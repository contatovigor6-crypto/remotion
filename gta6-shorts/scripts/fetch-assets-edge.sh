#!/usr/bin/env bash
# Assets do vídeo LONGO "Novas imagens de GTA 6 (Edge 430)" -> public/v10
# 12 screenshots oficiais da Rockstar divulgados em 29/10/2026 pela revista Edge (edição 430), baixados do CDN da Future (editora da Edge/GamesRadar+),
# + material oficial do site ainda não usado (capas da trilha, fundos das rádios, carros, Leonida Keys, Kalaga).
set -euo pipefail
cd "$(dirname "$0")/.."
RAW=.cache/raw; EDGE=.cache/edge; mkdir -p "$RAW" "$EDGE" public/v10
while read -r name src file; do
  [ -z "$name" ] && continue
  case "$src" in
    edge) [ -f "$EDGE/$file.jpg" ] || curl -sfL -m 120 -A "Mozilla/5.0" "https://cdn.mos.cms.futurecdn.net/$file.jpg" -o "$EDGE/$file.jpg"; in="$EDGE/$file.jpg" ;;
    *) [ -f "$RAW/$file" ] || curl -sfL -m 180 "https://www.rockstargames.com/VI/_next/static/media/$file" -o "$RAW/$file"; in="$RAW/$file" ;;
  esac
  ffmpeg -nostdin -v error -y -i "$in" -vf "scale='min(3840,iw)':-2" -q:v 2 "public/v10/$name.jpg"
  echo "ok $name"
done <<'LIST'
shark edge 5tM9fEu93Wy2PaBx8LVEjE
tattoo-yard edge 9ewbBVH9Tq8KqbtJAbaoh9
mendez edge C6BCKHPMgQuk9NWQyksJch
bikers-town edge E6vC6Dz7vN5XyYaEvk373h
jl-moto edge MNHvfJvXKtYweEcyNY4XEM
jason-fire edge UqBPGhNWViTTPAY8b43YFY
lucia-club edge XCqyFu8hGEF9PDJcuQqRPX
jason-247 edge XqthJm6rK6mgfuMQ8P6Hbj
jl-car-guns edge aFA6ckrDzQeuuYkESY84LY
biker-tattoo edge u4Mt3o4L7yMdTQfJQNHPW3
airboat-swamp edge vEp9hNrNMaShhVixGMXb3Y
skyline edge wkAXyJBN52JNJAhikTDNRE
score-cover site 39ak8a12395591.0ybs2pkm~3732.jpg
album-cover site The_Album_Cover_Art_landscape.000ifb9a.j-gp.jpg
score-vinyl site exclusiveVinyl.0tb.kvi4kc2iz.jpg
radio-afrobank site afrobank-background.140-_kytq55lt.jpg
radio-chamber site chamber-background.0bdn5.jnvwos2.jpg
radio-cocoteo site cocoteo-background.0~6dq9w0~ac7f.jpg
radio-country site country-background.0dgx5dx.44v.x.jpg
radio-dirtysouth site dirty-south-background.05~e07omgorbi.jpg
radio-flash site flash-background.0tc3kakjq4vi6.jpg
car-teal site ULTIMATE_EDITION_WYMAN_CAR_COLLECTION_02.0_biiqjqkpg2b.jpg
car-wagon site ULTIMATE_EDITION_WYMAN_CAR_COLLECTION_03.0~0maq32u-4ai.jpg
car-cream site ULTIMATE_EDITION_WYMAN_CAR_COLLECTION_05.0e5.kdb~mrdih.jpg
buggy-front site ULTIMATE_EDITION_VAPID_BUGGY_02.0tf15jp~61bkj.jpg
buggy-wheel site ULTIMATE_EDITION_VAPID_BUGGY_03.0s2rbkg98-0ac.jpg
buggy-garage site ULTIMATE_EDITION_VAPID_BUGGY_04.0_29d.bgfvon7.jpg
canyon site Mount_Kalaga_National_Park_04.0e1sxnp1mln2u.jpg
underwater site Leonida_Keys_04.0hce1rw1s8pd9.jpg
cover-landscape site GTAVI_Official_Cover_Art_Landscape.03y6bcce9e2jr.jpg
LIST
