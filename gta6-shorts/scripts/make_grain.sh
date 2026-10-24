#!/usr/bin/env bash
# Gera 6 texturas de granulação de filme (usadas em loop sobre o vídeo).
set -euo pipefail
cd "$(dirname "$0")/.."; mkdir -p public/fx
ffmpeg -nostdin -v error -y -f lavfi -i "color=c=gray:s=540x960:r=30,noise=alls=60:allf=t+u" -frames:v 6 -start_number 0 public/fx/grain%d.png
