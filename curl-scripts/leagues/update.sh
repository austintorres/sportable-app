#!/bin/bash

API="http://localhost:4741"
URL_PATH="/leagues"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "league": {
      "name": "'"${NAME}"'",
      "sport": "'"${SPORT}"'",
      "description": "'"${DESC}"'"
    }
  }'

echo
