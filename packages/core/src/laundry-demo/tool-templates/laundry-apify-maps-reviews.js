function isStringTag(value) {
  return (
    value !== null &&
    value !== undefined &&
    Object.prototype.toString.call(value) === "[object String]"
  );
}

function trimmedString(value, fallback) {
  if (!isStringTag(value)) {
    return fallback;
  }

  const text = value.trim();

  return text || fallback;
}

/** @param {Record<string, unknown>} input */
/** @param {{ fetch?: typeof fetch }} context */
export async function run(input, context) {
  const apiKey = process.env.APIFY_API_KEY?.trim();

  const searchQuery = trimmedString(input.searchQuery, "laundry Jakarta");

  const maxPlaces = Math.min(
    20,
    Math.max(1, Number(input.maxPlaces ?? 5) || 5)
  );

  const actorId = (
    process.env.APIFY_MAPS_ACTOR_ID ?? "compass/crawler-google-places"
  ).trim();

  if (!apiKey) {
    return {
      error:
        "APIFY_API_KEY is not set. Ask an admin to add it in tool credentials or server env.",
      ok: false,
    };
  }

  const fetchFn = context?.fetch ?? globalThis.fetch;
  const runUrl = `https://api.apify.com/v2/acts/${encodeURIComponent(actorId)}/run-sync-get-dataset-items?token=${encodeURIComponent(apiKey)}`;

  const body = {
    language: "en",
    maxCrawledPlaces: maxPlaces,
    searchStringsArray: [searchQuery],
  };

  const response = await fetchFn(runUrl, {
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    method: "POST",
    signal: AbortSignal.timeout(120_000),
  });

  if (response.status === 401 || response.status === 403) {
    return {
      error: "Apify rejected the API key.",
      ok: false,
    };
  }

  if (!response.ok) {
    const text = await response.text();

    return {
      error: `Apify run failed (${response.status}): ${text.slice(0, 240)}`,
      ok: false,
    };
  }

  const items = await response.json();
  const rows = Array.isArray(items) ? items.slice(0, maxPlaces) : [];

  const places = rows.map((row) => ({
    address: row.address ?? row.street ?? null,
    category: row.categoryName ?? row.category ?? null,
    name: row.title ?? row.name ?? "Unknown",
    rating: row.totalScore ?? row.rating ?? null,
    reviewsCount: row.reviewsCount ?? row.reviews ?? null,
    url: row.url ?? row.placeUrl ?? null,
  }));

  return {
    disclaimer:
      "Public scraping for demo only. Not an official Google Business Profile integration.",
    ok: true,
    places,
    query: searchQuery,
    scrapedCount: places.length,
  };
}
