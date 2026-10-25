#!/usr/bin/env bash
# Assets do Short "Preso no GTA 6": clipes e pôsteres oficiais de rockstargames.com/VI -> public/v2
# Clipes ficam em H.264, 60 fps nativos (permite câmera lenta 0.5x sem duplicar quadros).
set -euo pipefail
cd "$(dirname "$0")/.."
RAW=.cache/raw; mkdir -p "$RAW" public/v2
BASE=https://www.rockstargames.com/VI/_next/static/media
while read -r name file; do
  [ -z "$name" ] && continue
  [ -f "$RAW/$file" ] || curl -sfL -m 180 "$BASE/$file" -o "$RAW/$file"
  case "$file" in
    *.mp4) ffmpeg -nostdin -v error -y -i "$RAW/$file" -vf "scale='min(1920,iw)':-2:flags=lanczos,format=yuv420p" -an -c:v libx264 -crf 15 -preset slow -g 30 "public/v2/$name.mp4" ;;
    *) ffmpeg -nostdin -v error -y -i "$RAW/$file" -q:v 2 "public/v2/$name.jpg" ;;
  esac
  echo "ok $name"
done <<'LIST'
jl-sun 1920.06.kf93f1w.3v.mp4
robbery 1920.06imzelx5kmr9.mp4
lucia-car 1920.09nzmgt_kjb3t.mp4
city-night 1920.0bnh1cyqg24b..mp4
storm 1920.0exv_.86d6~jf.mp4
ocean-sunset 1920.0qrr5q0y~1k4n.mp4
keys 1920.16oyx_-wut8u~.mp4
hug 1920.0vcfeq8xs7lcj.mp4
jason-neon 1920.137yhvl5ofq_p.mp4
raul 1440.0~pcr9ggqcku6.mp4
skyline-v 1080.0vh0x1m5ined9.mp4
green-car 1920.0zq3.gu44hhq_.mp4
couple-v mobile.01e24lvhdu677.jpg
lucia-v mobile.02k0a_sb5-8k7.jpg
gun-v mobile.07_8xvc_cedh..jpg
jason-night-v mobile.0jzys13fkqnae.jpg
jl-sun-v mobile.16wml24njlfle.jpg
LIST
