#!/bin/zsh
set -euo pipefail

ENDPOINT="http://192.168.12.112:11434/v1/models"
EXPECTED_HOST="192.168.12.112"
EXPECTED_PORT="11434"

command -v curl >/dev/null
command -v jq >/dev/null

MODELS="$(curl -fsS --connect-timeout 3 --max-time 10 "$ENDPOINT")"

printf '%s\n' "$MODELS" | jq -e '.object == "list" and (.data | type == "array")' >/dev/null

printf '%s\n' "$MODELS" | jq -r --arg host "$EXPECTED_HOST" --arg port "$EXPECTED_PORT" '
  {
    endpoint: ("http://" + $host + ":" + $port + "/v1/models"),
    object: .object,
    models: [.data[] | {id: .id, object: .object, owned_by: .owned_by}]
  }
'
