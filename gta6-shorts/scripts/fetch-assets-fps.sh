#!/usr/bin/env bash
# Assets do Short "60 fps no PS5" — só material oficial AINDA NÃO USADO nos vídeos anteriores (ver IMAGENS-USADAS.md) -> public/v5
set -euo pipefail
cd "$(dirname "$0")/.."
RAW=.cache/raw; mkdir -p "$RAW" public/v5
BASE=https://www.rockstargames.com/VI/_next/static/media
while read -r name file; do
  [ -z "$name" ] && continue
  [ -f "$RAW/$file" ] || curl -sfL -m 180 "$BASE/$file" -o "$RAW/$file"
  case "$file" in
    *.mp4) ffmpeg -nostdin -v error -y -i "$RAW/$file" -vf "scale=1920:-2:flags=lanczos,format=yuv420p" -an -c:v libx264 -crf 15 -preset slow -g 30 "public/v5/$name.mp4" ;;
    *) ffmpeg -nostdin -v error -y -i "$RAW/$file" -vf "scale='min(3840,iw)':-2" -q:v 2 "public/v5/$name.jpg" ;;
  esac
  echo "ok $name"
done <<'LIST'
vc-bay 2160.0f~8x619osiuz.mp4
jungle 2160.0e1.61hz34pqi.mp4
factory 2160.0pew5a1n0n9b4.mp4
cheetah-pegasus ULTIMATE_EDITION_GROTTI_CHEETAH_01.0a.wy3s_ogjey.jpg
tattoo-back ULTIMATE_EDITION_ELECTRIC_FANG_04.0p0qga4w7y5yl.jpg
speedboats ULTIMATE_EDITION_SQUALO_04.00vlesedwtiuy.jpg
mechanic ULTIMATE_EDITION_RIDEOUT_CUSTOMS_03.0_n4oqh5f_ar4.jpg
postcard vice-city.16wd57vf.tvv4.jpg
car-interior ULTIMATE_EDITION_RIDEOUT_CUSTOMS_02.0u9jg4xxbm_yd.jpg
racecar ULTIMATE_EDITION_WYMAN_CAR_COLLECTION_04.05ku1csui.4h6.jpg
flag-car ULTIMATE_EDITION_WYMAN_CAR_COLLECTION_06.0ikq3r8wnrayv.jpg
floral-back ULTIMATE_EDITION_VICE_CITY_STYLE_02.0c-r4s-x7srt5.jpg
stilt-house ULTIMATE_EDITION_SAFEHOUSE_VEHICLES_01.0wv6pw3t-mky3.jpg
stock305 ULTIMATE_EDITION_STOCK_305_03.00wltke54q_n0.jpg
ganado-road ULTIMATE_EDITION_VAPID_GANADO_RETRO_BUILD_01.062dgvkwdynw5.jpg
club-dance VINTAGE_VICE_CITY_PACK_EXCLUSIVE_LOOKS_01.15zo0h-xdm91b.jpg
buggy-mud ULTIMATE_EDITION_VAPID_BUGGY_01.0jxfiql~371ik.jpg
kayak ULTIMATE_EDITION_SAFEHOUSE_VEHICLES_03.0c9.qtpdi.tf..jpg
lowrider ULTIMATE_EDITION_RIDEOUT_CUSTOMS_01.065-ms8~k8vbq.jpg
stock305-man ULTIMATE_EDITION_STOCK_305_02.0va5ldrhsejht.jpg
yacht ULTIMATE_EDITION_SQUALO_02.09qplkj.rjnk7.jpg
wyman ULTIMATE_EDITION_WYMAN_CAR_COLLECTION_01.0swhrm__iu~6b.jpg
tattoo-shop ULTIMATE_EDITION_ELECTRIC_FANG_01.04tsytu7qp2b-.jpg
rooftop ULTIMATE_EDITION_VICE_CITY_STYLE_05.0img~prrjg.bc.jpg
tattoo-neon ULTIMATE_EDITION_ELECTRIC_FANG_03.0wd4urd9xwy5..jpg
ocean-view VINTAGE_VICE_CITY_PACK_01.05zaof7o1uz.3.jpg
LIST
