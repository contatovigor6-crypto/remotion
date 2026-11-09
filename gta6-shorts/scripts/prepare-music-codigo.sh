#!/usr/bin/env bash
# Trilha do Short "O código de GTA 6": Mechanolith (Kevin MacLeod, CC BY 4.0, 55 s) estendida para 63 s
# com um laço do trecho energético (5–25 s) em crossfade, fade final de 2,2 s.
set -euo pipefail
cd "$(dirname "$0")/.."
RAW=.cache/raw/Mechanolith.mp3
[ -f "$RAW" ] || curl -sfL -m 120 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Mechanolith.mp3" -o "$RAW"
ffmpeg -nostdin -v error -y -i "$RAW" -i "$RAW" -filter_complex \
 "[0]atrim=0:46,asetpts=PTS-STARTPTS,aresample=48000[a];[1]atrim=5:25,asetpts=PTS-STARTPTS,aresample=48000[b];[a][b]acrossfade=d=2.5:c1=tri:c2=tri,atrim=0:63,afade=t=out:st=60.8:d=2.2" \
 -ac 2 public/audio/music-codigo-mechanolith.wav
echo ok
