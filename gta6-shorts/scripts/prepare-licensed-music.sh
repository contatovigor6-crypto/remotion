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
fps-volatile Volatile_Reaction.mp3 27.9 0 100.4 51.9 55.3
fps-cyborg Cyborg_Ninja.mp3 0 0 100.4 51.9 55.3
pista-spyglass Spy_Glass.mp3 0 0 107.4 59.7 61.1
celular-raving Raving_Energy.mp3 0 0 122.6 73.9 76.7
brian-getaway Mistake_the_Getaway.mp3 0 0 98.6 69.6 71.0
npc-exit Exit_the_Premises.mp3 0 0 121.6 67.5 69.0
contagem-clash Clash_Defiant.mp3 0 0 67.4 55.4 56.4
contagem-suspense Gathering_Darkness.mp3 0 0 67.4 55.4 56.4
contagem-cutrun Cut_and_Run.mp3 0 0 67.4 55.4 56.4
sindicato-movement Movement_Proposition.mp3 0 0 95.4 74.0 76.0
reacao-exhilarate Exhilarate.mp3 0 0 75.9 62.6 63.6
reacao-fivearmies Five_Armies.mp3 10 0 75.9 62.6 63.6
armazenamento-cabello Electro_Cabello.mp3 0 0 93.6 50.45 51.15
galeria-iceflow Ice_Flow.mp3 0 0 65.0 38.15 40.6
globo-heroic Heroic_Age.mp3 10 0 51.0 38.7 39.3
carros-dangerstorm Danger_Storm.mp3 0 0 51.5 28.5 28.9
armadilha-hotpursuit Hot_Pursuit.mp3 5 0 55.0 25.3 25.75
LIST
