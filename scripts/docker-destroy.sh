#!/usr/bin/env bash
set -euo pipefail

docker rm -f airin 2>/dev/null || true

while IFS= read -r id; do
  docker rm -f "$id" 2>/dev/null || true
done < <(docker ps -aq --filter publish=4310 2>/dev/null || true)

docker volume rm airin-data airin-config 2>/dev/null || true
docker image rm airin 2>/dev/null || true

echo "Destroy complete."
