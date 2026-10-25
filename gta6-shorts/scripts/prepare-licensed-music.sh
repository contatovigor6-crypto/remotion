#!/usr/bin/env bash
# Prepara trilhas de Kevin MacLeod (incompetech.com, CC BY 4.0) para o Short "Preso":
# recorte, queda de volume no "Mas calma" (44,3–48,5 s) e fade final. Crédito obrigatório na descrição.
set -euo pipefail
cd "$(dirname "$0")/.."
RAW=.cache/raw; mkdir -p "$RAW" public/audio
DUR=82.6
ENV="volume='1-0.85*min(1,max(0,min((t-44.2)/0.25,(48.6-t)/0.4)))':eval=frame"
while read -r name file offset; do
  [ -f "$RAW/$file" ] || curl -sfL -m 120 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/${file// /%20}" -o "$RAW/$file"
  ffmpeg -nostdin -v error -y -ss "$offset" -t "$DUR" -i "$RAW/$file" \
    -af "aresample=48000,$ENV,afade=t=in:d=0.05,afade=t=out:st=$(python3 -c "print($DUR-2.2)"):d=2.2" -ac 2 "public/audio/music-$name.wav"
  echo "ok $name ($file a partir de ${offset}s)"
done <<'LIST'
investigations Investigations.mp3 0
hitman Hitman.mp3 51.3
LIST
