#!/usr/bin/env bash
# Assets extras do Short "Internet no GTA 6" (clipes oficiais de rockstargames.com/VI) -> public/v3
set -euo pipefail
cd "$(dirname "$0")/.."
RAW=.cache/raw; mkdir -p "$RAW" public/v3
BASE=https://www.rockstargames.com/VI/_next/static/media
while read -r name file; do
  [ -z "$name" ] && continue
  [ -f "$RAW/$file" ] || curl -sfL -m 180 "$BASE/$file" -o "$RAW/$file"
  ffmpeg -nostdin -v error -y -i "$RAW/$file" -vf "format=yuv420p" -an -c:v libx264 -crf 15 -preset slow -g 30 "public/v3/$name.mp4"
  echo "ok $name"
done <<'LIST'
dimez-rec 1440.0wvebhg25~1qs.mp4
club 1440.0xpga-~yai0e7.mp4
drequan 1440.0y44fmg89qmdv.mp4
boobie-boat 1440.0~ufz66l44gju.mp4
brian 1440.0k48go_x68~-q.mp4
LIST
