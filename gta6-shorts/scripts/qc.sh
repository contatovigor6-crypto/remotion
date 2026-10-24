#!/usr/bin/env bash
# Controle de qualidade do vídeo renderizado: metadados, quadros pretos, loudness e contact sheets.
set -uo pipefail
IN=$1; OUTDIR=${2:-.qc}; mkdir -p "$OUTDIR/frames"
echo "== streams"; ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate,pix_fmt,sample_rate,channels,bit_rate:format=duration,size -of compact "$IN"
echo "== quadros pretos (>=0.1s)"; ffmpeg -nostdin -hide_banner -i "$IN" -vf "blackdetect=d=0.1:pic_th=0.97" -an -f null - 2>&1 | grep -o "black_start.*" || echo "nenhum"
echo "== loudness"; ffmpeg -nostdin -hide_banner -i "$IN" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|LRA|Peak):"
echo "== clipping (amostras em 0 dBFS)"; ffmpeg -nostdin -hide_banner -i "$IN" -af astats=metadata=0 -f null - 2>&1 | grep -E "Peak level dB|Number of clipped" | tail -3
# contact sheets: 1 quadro a cada 0.5 s, 6x4 por folha
rm -f "$OUTDIR"/frames/*.jpg
ffmpeg -nostdin -v error -i "$IN" -vf "fps=2,scale=270:480,drawtext=text='%{pts\:hms}':x=6:y=6:fontsize=20:fontcolor=yellow:box=1:boxcolor=black@0.6" "$OUTDIR/frames/%04d.jpg"
n=$(ls "$OUTDIR"/frames | wc -l); i=0
for start in $(seq 1 24 $n); do
  ffmpeg -nostdin -v error -y -start_number $start -i "$OUTDIR/frames/%04d.jpg" -frames:v 1 -vf "tile=8x3" "$OUTDIR/sheet$(printf %02d $i).jpg"; i=$((i+1))
done
echo "== $i contact sheets em $OUTDIR"
