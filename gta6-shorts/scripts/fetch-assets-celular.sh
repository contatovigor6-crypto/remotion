#!/usr/bin/env bash
# Assets do Short "O celular de GTA 6" — screenshots oficiais (páginas de personagens/lugares do site) AINDA NÃO USADOS no canal -> public/v7
set -euo pipefail
cd "$(dirname "$0")/.."
RAW=.cache/raw; mkdir -p "$RAW" public/v7
BASE=https://www.rockstargames.com/VI/_next/static/media
while read -r name file; do
  [ -z "$name" ] && continue
  [ -f "$RAW/$file" ] || curl -sfL -m 180 "$BASE/$file" -o "$RAW/$file"
  case "$file" in
    *.png) ffmpeg -nostdin -v error -y -i "$RAW/$file" "public/v7/$name.png" ;;
    *) ffmpeg -nostdin -v error -y -i "$RAW/$file" -vf "scale='min(3840,iw)':-2" -q:v 2 "public/v7/$name.jpg" ;;
  esac
  echo "ok $name"
done <<'LIST'
jason-phone Jason_Duval_04.16d-z2wa2s~bk.jpg
jason-bike Jason_Duval_01.07m377xeb6jhq.jpg
jason-car Jason_Duval_02.1486~7_v40cn..jpg
jason-bar Jason_Duval_06.086o72llg6~1p.jpg
jason-rifle Jason_Duval_05.0kxp6enhvzqka.jpg
lucia-pool Lucia_Caminos_02.16n.5umvlu_48.jpg
lucia-bar Lucia_Caminos_03.14xgd2y_ymmeg.jpg
lucia-club Lucia_Caminos_06.0fxbjfk0jakb3.jpg
lucia-prison Lucia_Caminos_05.0i5b7k6a7_w6p.jpg
lucia-gun Lucia_Caminos_04.04kb_~4ubn3wn.jpg
dimez-studio Real_Dimez_01.0djwwboo8-glx.jpg
dimez-car Real_Dimez_02.1366u9.x.yp0_.jpg
dimez-fur Real_Dimez_03.02o2si7.op.ye.jpg
dimez-mic Real_Dimez_04.0wa3vo07lz4e2.jpg
boobie-phone Boobie_Ike_02.0sp9mtc.1cdzs.jpg
boobie-office Boobie_Ike_01.0-wji2pg5anfs.jpg
raul-phone Raul_Bautista_01.0md1ii-yrn96r.jpg
brian-papers Brian_Heder_03.10ntuqh2h6upf.jpg
drequan-studio DreQuan_Priest_04.0n~kj~px_fn8t.jpg
vc-sign Vice_City_01.135x56yoeu.6t.jpg
vc-aerial Vice_City_03.0nqz~lrqdmlze.jpg
vc-posers Vice_City_04.06evqutgh7624.jpg
vc-beach Vice_City_05.0~r~o0jzpp4a-.jpg
vc-police Vice_City_06.0_tdmr3u9w84x.jpg
vc-club Vice_City_07.0b3mhak4k78oh.jpg
vc-night Vice_City_08.0bbg_xp4hqdvz.jpg
vc-street Vice_City_09.0~ng.c8ack3fp.jpg
keys-iguana Leonida_Keys_02.0~ptk-53gl0lq.jpg
keys-boats Leonida_Keys_05.0yerhvjhto-h..jpg
cal-pool Cal_Hampton_03.0.q68~pt1to9z.jpg
outro-art outro.0e9ko9mexi~1m.jpg
cal-pool-hall Cal_Hampton_02.05r2t_mck65fe.jpg
drequan-club DreQuan_Priest_01.0_0~wi-ipdj35.jpg
keys-anchor Leonida_Keys_03.0v_3~-9ceyixc.jpg
raul-yacht Raul_Bautista_03.0-x4xbav_6c40.jpg
LIST
