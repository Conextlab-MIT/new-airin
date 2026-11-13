---
name: laundry-weather-triggers
description: When rain or heat should change staffing or promo — pairs with laundry_weather_forecast.
---

# Weather triggers (laundry)

## After a successful forecast tool call

- Rain likely (pop ≥ 55%): warn owner about pickup backlog; suggest express upsell carefully.
- Hot day (≥ 32°C): higher turnover on light fabrics; check dryer capacity.
- Combine with historical load map when the user provides CSV or sheet columns.

## On tool failure

- Stop. Tell the user the tool error. Do not invent weather or kg numbers.
