#!/usr/bin/env bash
# Baixa as imagens/clipes oficiais publicados em rockstargames.com/VI e gera
# versões nomeadas e otimizadas em public/. Os arquivos da Rockstar não são
# versionados no git (direitos da Rockstar Games) — rode este script para recriá-los.
set -euo pipefail
cd "$(dirname "$0")/.."
RAW=.cache/raw; mkdir -p "$RAW" public/img public/video
BASE=https://www.rockstargames.com/VI/_next/static/media
# nome-local  arquivo-oficial
while read -r name file; do
  [ -z "$name" ] && continue
  [ -f "$RAW/$file" ] || curl -sfL -m 120 "$BASE/$file" -o "$RAW/$file"
  case "$file" in
    *.mp4) ffmpeg -nostdin -v error -y -i "$RAW/$file" -vf "scale=1920:1080:flags=lanczos,minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:vsbmc=1,setpts=2*PTS,fps=30" -an -c:v libx264 -crf 14 -preset slow -pix_fmt yuv420p "public/video/$name-slow.mp4"
           ffmpeg -nostdin -v error -y -i "$RAW/$file" -vf "scale=1920:1080:flags=lanczos" -an -c:v libx264 -crf 14 -pix_fmt yuv420p "public/video/$name.mp4" ;;
    *.png) convert "$RAW/$file" -trim +repage "public/img/$name.png" ;;
    *) ffmpeg -nostdin -v error -y -i "$RAW/$file" -vf "scale='min(3840,iw)':-2:flags=lanczos" -q:v 2 "public/img/$name.jpg" ;;
  esac
  echo "ok $name"
done <<'LIST'
pool-v onlyInLeonidaMobile.0mupfnk-x6x~r.jpg
pool onlyInLeonidaDesktop.15y2n40f3axwo.jpg
keyart-v Jason_Lucia_Lock_And_Load_phone.0ie39e_.q3v2a.jpg
keyart-date 517572321a549a.0y668_yrgy9s_.jpg
masked-v extended-look.0f0-3vo3w9u26.jpg
jason-fence Jason_Duval_07.0ca326xbl~oyh.jpg
jason-robbery Jason_Duval_Video_Clip.024oe-y640yxp.jpg
vc-day Vice_City_11.09paum3g942sc.jpg
vc-night desktop.00.5pzu2sm-z4.jpg
vc-night-v mobile.0mi46.hy2kwfa.jpg
traffic o3982oa93a23k4.05jwq4z-sjai_.jpg
couple-palms ULTIMATE_EDITION_01.16qc1xq5nigg1.jpg
people-car ULTIMATE_EDITION_02.0q-6.nrtf~jj0.jpg
lucia-car Lucia_Caminos_Video_Clip.0uqwkm_u_fu_9.jpg
lucia-gym Lucia_Caminos_09.0pd.ppokmi8-n.jpg
dolphin ULTIMATE_EDITION_SQUALO_03.0quncwrsw97j1.jpg
boats-skyline ULTIMATE_EDITION_SQUALO_01.0cim7hj58ypb1.jpg
heist-v mediaMobile.0p_yfitphljim.jpg
cover-v Official_Cover_Art_phone.0ufu1o6l.ijdb.jpg
trailer2-v trailer-2.0l.7aqib91fz6.jpg
cheetah-night ULTIMATE_EDITION_GROTTI_CHEETAH_02.0rkrlsu_dg~ww.jpg
duo-walk an-extended-look.0ijbsha5fo1te.jpg
logo poster_logo.0m-7c805zusl7.png
jason-clip Jason_Duval_Video_Clip.10.gc09c9y-j9.mp4
lucia-clip Lucia_Caminos_Video_Clip.0g8.3fx84ixw..mp4
LIST
