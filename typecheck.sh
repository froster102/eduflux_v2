#!/bin/bash
set -e

for dir in apps/*; do
  if [ -f "$dir/package.json" ]; then
    echo "🔍 Type checking $dir..."
    (cd "$dir" && bunx tsc --noEmit)
  fi
done

echo "✅ Type check complete for all services!"
