#!/usr/bin/env bash
# Trilha do vídeo LONGO (Interiores): 3 faixas de Kevin MacLeod (CC BY 4.0), uma por bloco de capítulos, com crossfade de 3 s.
# Colunas: arquivo  entra_em(s)  duração(s)  ganho(dB)
set -euo pipefail
cd "$(dirname "$0")/.."
RAW=.cache/raw; OUT=public/audio/music-interiores-long.wav; TOTAL=356.2
args=(); filt=""; i=0
while read -r file at dur gain; do
  [ -z "$file" ] && continue
  [ -f "$RAW/$file" ] || curl -sfL -m 120 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/${file//_/%20}" -o "$RAW/$file"
  args+=(-i "$RAW/$file")
  ms=$(python3 -c "print(int($at*1000))")
  filt+="[$i:a]aresample=48000,atrim=0:$dur,asetpts=PTS-STARTPTS,volume=${gain}dB,afade=t=in:d=3,afade=t=out:st=$(python3 -c "print($dur-3)"):d=3,adelay=${ms}|${ms},apad=whole_dur=$TOTAL[m$i];"
  i=$((i+1))
done <<'LIST'
Mysterioso_March.mp3 0 155.1 7.5
Sneaky_Snitch.mp3 152.1 134.0 10.2
Comfortable_Mystery_4.mp3 283.1 73.1 -2.7
LIST
inputs=$(for k in $(seq 0 $((i-1))); do printf "[m%d]" $k; done)
ffmpeg -nostdin -v error -y "${args[@]}" -filter_complex "${filt}${inputs}amix=inputs=$i:normalize=0:duration=longest,atrim=0:$TOTAL,afade=t=out:st=$(python3 -c "print($TOTAL-2.5)"):d=2.5,alimiter=limit=0.89:level=false[out]" -map "[out]" -ac 2 "$OUT"
echo "ok $OUT"
