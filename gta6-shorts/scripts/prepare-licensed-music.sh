#!/usr/bin/env bash
# Prepara trilhas de Kevin MacLeod (incompetech.com, CC BY 4.0): recorte, atraso de entrada,
# queda de volume num trecho da narração e fade final. Crédito obrigatório na descrição.
# Colunas: nome arquivo início_na_faixa atraso duração_total queda_início queda_fim
set -euo pipefail
cd "$(dirname "$0")/.."
RAW=.cache/raw; mkdir -p "$RAW" public/audio
while read -r name file offset delay dur dipA dipB; do
  [ -z "$name" ] && continue
  # nomes com espaço são escritos com "_" na lista
  [ -f "$RAW/$file" ] || curl -sfL -m 120 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/${file//_/%20}" -o "$RAW/$file"
  env="volume='1-0.85*min(1,max(0,min((t-$dipA)/0.25,($dipB-t)/0.4)))':eval=frame"
  ms=$(python3 -c "print(int($delay*1000))")
  ffmpeg -nostdin -v error -y -ss "$offset" -i "$RAW/$file" \
    -af "aresample=48000,afade=t=in:d=0.05,adelay=${ms}|${ms},apad,atrim=0:$dur,$env,afade=t=out:st=$(python3 -c "print($dur-2.2)"):d=2.2" -ac 2 "public/audio/music-$name.wav"
  echo "ok $name ($file a partir de ${offset}s, entra em ${delay}s)"
done <<'LIST'
investigations Investigations.mp3 0 0 82.6 44.2 48.6
hitman Hitman.mp3 51.3 0 82.6 44.2 48.6
internet-investigations Investigations.mp3 0 1.9 95.4 58.0 59.9
internet-volatile Volatile_Reaction.mp3 27.9 0 95.4 58.0 59.9
internet-ouroboros Ouroboros.mp3 66 0 95.4 58.0 59.9
LIST
