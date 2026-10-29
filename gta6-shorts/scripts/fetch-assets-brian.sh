#!/usr/bin/env bash
# Assets do Short "Jason mora de favor (Brian Heder)" — screenshots oficiais (páginas de personagens/lugares do site) AINDA NÃO USADOS no canal -> public/v8
set -euo pipefail
cd "$(dirname "$0")/.."
RAW=.cache/raw; mkdir -p "$RAW" public/v8
BASE=https://www.rockstargames.com/VI/_next/static/media
while read -r name file; do
  [ -z "$name" ] && continue
  [ -f "$RAW/$file" ] || curl -sfL -m 180 "$BASE/$file" -o "$RAW/$file"
  case "$file" in
    *.png) ffmpeg -nostdin -v error -y -i "$RAW/$file" "public/v8/$name.png" ;;
    *) ffmpeg -nostdin -v error -y -i "$RAW/$file" -vf "scale='min(3840,iw)':-2" -q:v 2 "public/v8/$name.jpg" ;;
  esac
  echo "ok $name"
done <<'LIST'
jason-boat Jason_Duval_03.0-1vum7x-3vtp.jpg
safehouse ULTIMATE_EDITION_SAFEHOUSE_VEHICLES_02.0-2n5rm9n8.rq.jpg
brian-dock Brian_Heder_02.0kmg6iw38f-9o.jpg
grass-aerial Grassrivers_02.0teqs5xe2pem1.jpg
brian-art brian.11f5qmv3.7o8n.jpg
brian-car Brian_Heder_01.0r.ute88os9k-.jpg
brian-friends Brian_Heder_04.0z3o0t88jw54l.jpg
town-night Ambrosia_02.0wtqs05ozl.ym.jpg
willie-garage ULTIMATE_EDITION_ONE_EYED_WILLIE_01.0n7-__or5f.b6.jpg
gellhorn-bat Port_Gellhorn_02.00e7cz6lwrup-.jpg
gellhorn-car Port_Gellhorn_03.00c2b0eh7sm~q.jpg
keys-aerial Leonida_Keys_01.0zgz7tveur6y8.jpg
grass-gator Grassrivers_01.1096rw4lbjur_.jpg
grass-chase Grassrivers_04.01ckpqbhxyz76.jpg
biker-couple Ambrosia_03.0vt46a.1s.7-y.jpg
gellhorn-cabaret Port_Gellhorn_04.0hd-7kzfi51q..jpg
lucia-fight Lucia_Caminos_01.0a7yqvewctkfp.jpg
cal-night Cal_Hampton_04.0-78dep86yx2q.jpg
raul-club Raul_Bautista_04.0qx77gyvykvv5.jpg
boobie-drink Boobie_Ike_03.0neka36~z25b5.jpg
drequan-purple DreQuan_Priest_03.0zbl4i_x_1biu.jpg
gellhorn-motel Port_Gellhorn_01.0fmisvza-5-cq.jpg
kalaga-kayak Mount_Kalaga_National_Park_06.166ouq5pjd7h0.jpg
ambrosia-sunset Ambrosia_04.0.2cefoguu-tt.jpg
LIST
