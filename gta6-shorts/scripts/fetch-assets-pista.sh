#!/usr/bin/env bash
# Assets do Short "Pista no dinheiro (GTA 6 × Red Dead)" — só material oficial AINDA NÃO USADO no canal -> public/v6
set -euo pipefail
cd "$(dirname "$0")/.."
RAW=.cache/raw; mkdir -p "$RAW" public/v6
BASE=https://www.rockstargames.com/VI/_next/static/media
FOB=https://media-rockstargames-com.akamaized.net/rockstargames-newsite/img/global/games/fob/1280
while read -r name file; do
  [ -z "$name" ] && continue
  if [ ! -f "$RAW/$file" ]; then
    case "$file" in
      fob-1280-*) curl -sfL -m 120 "$FOB/${file#fob-1280-}" -o "$RAW/$file" ;;
      *) curl -sfL -m 180 "$BASE/$file" -o "$RAW/$file" ;;
    esac
  fi
  case "$file" in
    *.png) ffmpeg -nostdin -v error -y -i "$RAW/$file" "public/v6/$name.png" ;;
    *) ffmpeg -nostdin -v error -y -i "$RAW/$file" -vf "scale='min(3840,iw)':-2" -q:v 2 "public/v6/$name.jpg" ;;
  esac
  echo "ok $name"
done <<'LIST'
rdr2 fob-1280-reddeadredemption2.jpg

keyart-car hero.0q5-tr6h86ai7.jpg
jason-art jason.056em7v4xfo9h.jpg
lucia-art lucia.03~6lpmqrk3rt.jpg
cash-seat VINTAGE_VICE_CITY_WEAPON_PATTERN_01.0gybtumgwdcoi.jpg
club-night VINTAGE_VICE_CITY_PACK_EXCLUSIVE_LOOKS_04.04mve901t8b.i.jpg
stanier-night VINTAGE_VICE_CITY_PACK_VAPID_STANIER_01.004m_8d1~qngy.jpg
stanier-tail VINTAGE_VICE_CITY_PACK_VAPID_STANIER_04.0n002i9p87b~q.jpg
couple-port VINTAGE_VICE_CITY_PACK_02.14mvx9a15z8jv.jpg
vintage-gunman VINTAGE_VICE_CITY_PACK_EXCLUSIVE_LOOKS_03.0au1tphsftqm5.jpg
neon-tattoo ULTIMATE_EDITION_ELECTRIC_FANG_02.0a0h59s0zvhgc.jpg
revolvers-table ULTIMATE_EDITION_HAWK_AND_LITTLE_MORGAN_REVOLVERS_02.04e_9jco7lluf.jpg
revolver-aim ULTIMATE_EDITION_HAWK_AND_LITTLE_MORGAN_REVOLVERS_01.0~3pdc~~sing4.jpg
salon-desk ULTIMATE_EDITION_SARAS_SALON_03.0w1t10_u0yv~b.jpg
pistols ULTIMATE_EDITION_WEAPON_VARIANTS_01.12licq0_o7mb5.jpg
style-couple ULTIMATE_EDITION_VICE_CITY_STYLE_01.0.u1gt~99yzks.jpg
style-boots ULTIMATE_EDITION_VICE_CITY_STYLE_03.08.sic8sgqk4u.jpg
salon-man ULTIMATE_EDITION_SARAS_SALON_02.170lw.lgxdghm.jpg
ptt-store ULTIMATE_EDITION_PTT_STORE_01.0seuocb~7b1-q.jpg
style-man ULTIMATE_EDITION_VICE_CITY_STYLE_04.1572kk.expq-n.jpg
willie-truck ULTIMATE_EDITION_ONE_EYED_WILLIE_02.0dgnw_y_1bqao.jpg
cheetah-white ULTIMATE_EDITION_GROTTI_CHEETAH_03.0v3_dryhtjarc.jpg
cheetah-door ULTIMATE_EDITION_GROTTI_CHEETAH_04.0caq_y0_f1rvt.jpg
van-graffiti ULTIMATE_EDITION_STOCK_305_01.0vuq0m5_1j-17.jpg
drequan-art drequan.0i_4zkdw4a9ao.jpg
port-gellhorn port-gellhorn.0df42ncz7hxo5.jpg
ambrosia ambrosia.00n-7--pckqlj.jpg
leonida-keys leonida-keys.0c1o_6.himv2v.jpg
kalaga kalaga.0xhu5q0-a39r-.jpg
cal-art cal.03-v.l7iq4j_7.jpg
crab poster.14d0~mder2ihs.png
sun poster.01rwkio33~ckl.png
LIST
