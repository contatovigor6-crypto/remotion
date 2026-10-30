#!/usr/bin/env bash
# Trilha do vídeo LONGO (Edge 430): 4 faixas de Kevin MacLeod (CC BY 4.0), uma por bloco de capítulos, com crossfade de 3 s.
# Colunas: arquivo  entra_em(s)  duração(s)  ganho(dB)
set -euo pipefail
cd "$(dirname "$0")/.."
RAW=.cache/raw; OUT=public/audio/music-edge-long.wav; TOTAL=621.6
args=(); filt=""; i=0
while read -r file at dur gain; do
  [ -z "$file" ] && continue
  [ -f "$RAW/$file" ] || curl -sfL -m 120 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/${file//_/%20}" -o "$RAW/$file"
  args+=(-i "$RAW/$file")
  ms=$(python3 -c "print(int($at*1000))")
  filt+="[$i:a]aresample=48000,atrim=0:$dur,asetpts=PTS-STARTPTS,volume=${gain}dB,afade=t=in:d=3,afade=t=out:st=$(python3 -c "print($dur-3)"):d=3,adelay=${ms}|${ms},apad=whole_dur=$TOTAL[m$i];"
  i=$((i+1))
done <<'LIST'
Crypto.mp3 0 165.9 6.6
Darkest_Child.mp3 162.9 181.2 -2.9
Hidden_Agenda.mp3 341.1 135.0 7.3
Unholy_Knight.mp3 476.1 145.5 -4.1
LIST
inputs=$(for k in $(seq 0 $((i-1))); do printf "[m%d]" $k; done)
ffmpeg -nostdin -v error -y "${args[@]}" -filter_complex "${filt}${inputs}amix=inputs=$i:normalize=0:duration=longest,atrim=0:$TOTAL,afade=t=out:st=$(python3 -c "print($TOTAL-2.5)"):d=2.5,alimiter=limit=0.89:level=false[out]" -map "[out]" -ac 2 "$OUT"
echo "ok $OUT"
