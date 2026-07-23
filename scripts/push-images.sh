#!/usr/bin/env bash
# Pushes public/products/ to origin in small batches.
#
# A single 451MB push trips GitHub's HTTPS transport (HTTP 408). Committing and
# pushing the imagery in chunks keeps each request small enough to complete.
# Safe to re-run: already-committed batches are skipped by `git diff --cached`.
set -uo pipefail
cd "$(dirname "$0")/.."

BATCHES=${BATCHES:-14}
mapfile -t DIRS < <(find public/products -mindepth 1 -maxdepth 1 -type d | sort)
TOTAL=${#DIRS[@]}
PER=$(( (TOTAL + BATCHES - 1) / BATCHES ))

echo "START: $TOTAL product dirs -> $BATCHES batches of ~$PER"

for ((b = 0; b < BATCHES; b++)); do
  start=$(( b * PER ))
  (( start >= TOTAL )) && break
  slice=("${DIRS[@]:start:PER}")

  git add -- "${slice[@]}" 2>/dev/null
  if git diff --cached --quiet; then
    echo "BATCH $((b+1))/$BATCHES: nothing new, skipping"
    continue
  fi

  n=$(git diff --cached --name-only | wc -l | tr -d ' ')
  git commit -q -m "Add product imagery (batch $((b+1))/$BATCHES)" \
    -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"

  ok=0
  for attempt in 1 2 3; do
    if git push -q origin main 2>&1; then
      echo "BATCH $((b+1))/$BATCHES: pushed $n files"
      ok=1
      break
    fi
    echo "BATCH $((b+1))/$BATCHES: push attempt $attempt failed, retrying..."
    sleep 15
  done

  if [[ $ok -eq 0 ]]; then
    echo "FAILED: batch $((b+1)) could not be pushed after 3 attempts"
    exit 1
  fi
done

echo "ALL BATCHES PUSHED"
git status --porcelain | wc -l | xargs echo "uncommitted files remaining:"
