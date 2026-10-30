#!/usr/bin/env bash
# Assets do Short "NPCs com personalidade" — screenshots oficiais (páginas de personagens/lugares do site) AINDA NÃO USADOS no canal -> public/v9
set -euo pipefail
cd "$(dirname "$0")/.."
RAW=.cache/raw; mkdir -p "$RAW" public/v9
BASE=https://www.rockstargames.com/VI/_next/static/media
while read -r name file; do
  [ -z "$name" ] && continue
  [ -f "$RAW/$file" ] || curl -sfL -m 180 "$BASE/$file" -o "$RAW/$file"
  case "$file" in
    *.png) ffmpeg -nostdin -v error -y -i "$RAW/$file" "public/v9/$name.png" ;;
    *) ffmpeg -nostdin -v error -y -i "$RAW/$file" -vf "scale='min(3840,iw)':-2" -q:v 2 "public/v9/$name.jpg" ;;
  esac
  echo "ok $name"
done <<'LIST'
man-glasses VINTAGE_VICE_CITY_PACK_EXCLUSIVE_LOOKS_05.01rxi8y_wrmf1.jpg
taxi-guns VINTAGE_VICE_CITY_PACK_VAPID_STANIER_02.0s2wun4_vzld2.jpg
raul-drive Raul_Bautista_02.10ddy6ogywu-t.jpg
street-bikers Ambrosia_01.0rqphs0gazkm..jpg
art-hotel Hero_BG.0vm~96xn2g1_l.jpg
bonfire Port_Gellhorn_05.0nsv0ou54n-t3.jpg
vc-balcony Vice_City_02.0c5.7qx17u9kl.jpg
art-crowd Hero_BG.00ah9g2acd7jo.jpg
woman-face VINTAGE_VICE_CITY_PACK_EXCLUSIVE_LOOKS_02.12udfnroe-lah.jpg
cal-golf Cal_Hampton_01.0xlil231_osh4.jpg
woman-car Ambrosia_05.0olhvjqff0o4b.jpg
tough-duo ULTIMATE_EDITION_SARAS_SALON_01.0gn7dwlvcgz17.jpg
hunters Mount_Kalaga_National_Park_03.037k2s87rwuxc.jpg
pool-party DreQuan_Priest_02.02u69e~nkk3eo.jpg
counter-woman ULTIMATE_EDITION_STOCK_305_04.0ipze9~3u6eok.jpg
art-graffiti Hero_BG.0xs9poewzot23.jpg
strangers ULTIMATE_EDITION_GOODTIME_GEAR_01.0t7de8dow381q.jpg
dirt-bikes Mount_Kalaga_National_Park_01.0v5fl0f83hjv_.jpg
boobie-art boobie.12whh6lj627qb.jpg
dimez-art dimez.0rsvgiu-t1zi3.jpg
wildlife Mount_Kalaga_National_Park_05.0_~vto-o2zxok.jpg
art-boatshed Hero_BG.0p-kp~u8~u~-v.jpg
raul-art raul.12h1r02jnfelx.jpg
helicopter Mount_Kalaga_National_Park_02.0f24dhopdprvx.jpg
airboat-aerial Grassrivers_03.14cuv-vg9orw4.jpg
willie-neon ULTIMATE_EDITION_ONE_EYED_WILLIE_03.0mhil16bnp3m2.jpg
taxi-side VINTAGE_VICE_CITY_PACK_VAPID_STANIER_03.0dzlk-r0ehlu4.jpg
art-bridge Hero_BG.0dwp8ucivdr~j.jpg
LIST
