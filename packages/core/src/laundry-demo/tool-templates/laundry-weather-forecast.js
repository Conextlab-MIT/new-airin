/** @param {Record<string, unknown>} input */
/** @param {{ fetch?: typeof fetch }} context */
export async function run(input, context) {
  const apiKey = process.env.OPENWEATHER_API_KEY?.trim();
  const city =
    typeof input.city === "string" && input.city.trim()
      ? input.city.trim()
      : "Jakarta";
  const days = Math.min(7, Math.max(1, Number(input.days ?? 7) || 7));

  const loads =
    input.dailyLoadsKg && typeof input.dailyLoadsKg === "object"
      ? input.dailyLoadsKg
      : null;

  if (!apiKey) {
    return {
      error:
        "OPENWEATHER_API_KEY is not set. Ask an admin to add it in tool credentials or server env.",
      ok: false,
    };
  }

  const geoUrl = new URL("https://api.openweathermap.org/geo/1.0/direct");
  geoUrl.searchParams.set("q", city);
  geoUrl.searchParams.set("limit", "1");
  geoUrl.searchParams.set("appid", apiKey);

  const fetchFn = context?.fetch ?? globalThis.fetch;
  const geoRes = await fetchFn(geoUrl);

  if (!geoRes.ok) {
    return {
      error: `Weather geocode failed (${geoRes.status}). Check city name and API key.`,
      ok: false,
    };
  }

  const geo = await geoRes.json();

  if (!Array.isArray(geo) || geo.length === 0) {
    return {
      error: `City not found: ${city}`,
      ok: false,
    };
  }

  const { lat, lon, name, country } = geo[0];

  const forecastUrl = new URL(
    "https://api.openweathermap.org/data/2.5/forecast"
  );
  forecastUrl.searchParams.set("lat", String(lat));
  forecastUrl.searchParams.set("lon", String(lon));
  forecastUrl.searchParams.set("appid", apiKey);
  forecastUrl.searchParams.set("units", "metric");

  const forecastRes = await fetchFn(forecastUrl);

  if (!forecastRes.ok) {
    return {
      error: `Weather forecast failed (${forecastRes.status}).`,
      ok: false,
    };
  }

  const forecast = await forecastRes.json();
  const slices = Array.isArray(forecast?.list)
    ? forecast.list.slice(0, days * 8)
    : [];

  const byDay = new Map();

  for (const slot of slices) {
    const date = String(slot.dt_txt ?? "").slice(0, 10);

    if (!date) {
      continue;
    }

    const entry = byDay.get(date) ?? {
      date,
      popMax: 0,
      rainMm: 0,
      tempC: slot.main?.temp ?? null,
    };

    entry.popMax = Math.max(entry.popMax, Number(slot.pop ?? 0));
    entry.rainMm += Number(slot.rain?.["3h"] ?? 0);
    entry.tempC = slot.main?.temp ?? entry.tempC;
    byDay.set(date, entry);
  }

  const daily = [...byDay.values()].slice(0, days);

  const baselineKg =
    typeof input.baselineDailyLoadKg === "number"
      ? input.baselineDailyLoadKg
      : typeof input.baselineDailyLoadKg === "string"
        ? Number(input.baselineDailyLoadKg)
        : 120;

  const forecastLoads = daily.map((day) => {
    let factor = 1;
    const reasons = [];

    if (day.popMax >= 0.55) {
      factor += 0.18;
      reasons.push("rain likely");
    }

    if (day.tempC != null && day.tempC >= 32) {
      factor += 0.08;
      reasons.push("hot day");
    }

    if (loads && loads[day.date] != null) {
      const historical = Number(loads[day.date]);

      if (!Number.isNaN(historical) && historical > 0) {
        const blended = Math.round(historical * factor);
        return {
          ...day,
          adjustmentReasons: reasons,
          forecastKg: blended,
          historicalKg: historical,
        };
      }
    }

    return {
      ...day,
      adjustmentReasons: reasons,
      forecastKg: Math.round(baselineKg * factor),
      historicalKg: null,
    };
  });

  return {
    city: `${name}, ${country}`,
    daily: forecastLoads,
    message:
      "Forecast blends weather with baseline or user-provided historical loads. It is guidance only.",
    ok: true,
    provider: "openweathermap",
  };
}
