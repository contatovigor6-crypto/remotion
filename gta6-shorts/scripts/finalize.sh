#!/usr/bin/env bash
# Masterização para upload: H.264 yuv420p (faixa TV, BT.709) + áudio em -14 LUFS com true peak < -1.5 dBTP.
# Ganho calculado pela medição EBU R128 do mix + limiter com oversampling 4x (evita picos inter-amostra).
set -euo pipefail
IN=$1; OUT=$2; TARGET=${TARGET:--14}  # TARGET=none preserva o volume original da narração
I=$(ffmpeg -nostdin -hide_banner -i "$IN" -vn -af ebur128=framelog=quiet -f null - 2>&1 | awk '/^ +I:/{print $2}' | tail -1)
if [ "$TARGET" = "none" ]; then
  # Preserva a narração: sem ganho e sem limiter (só conversão de formato).
  AF="aresample=48000"; echo "mix: $I LUFS -> sem alteração de ganho"
else
  GAIN=$(python3 -c "print(round($TARGET - ($I) + 0.15, 2))")
  AF="aresample=192000,volume=${GAIN}dB,alimiter=limit=0.78:attack=0.5:release=50:level=false:asc=1,aresample=48000"
  echo "mix: $I LUFS -> ganho ${GAIN} dB"
fi
ffmpeg -nostdin -v error -y -i "$IN" \
  -vf "scale=in_range=pc:out_range=tv,format=yuv420p" -c:v libx264 -preset slow -crf 17 -profile:v high -level 4.2 -r 30 -g 60 -bf 2 \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -af "$AF" \
  -c:a aac -b:a 320k -ar 48000 -ac 2 -movflags +faststart "$OUT"
ffmpeg -nostdin -hide_banner -i "$OUT" -af ebur128=peak=true:framelog=quiet -f null - 2>&1 | grep -E "^ +(I|Peak):"
echo "ok -> $OUT"
