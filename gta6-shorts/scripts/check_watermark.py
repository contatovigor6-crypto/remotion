"""Confere, quadro a quadro, se a logo do canal está visível na posição da marca-d'água.
Uso: python3 -I scripts/check_watermark.py video.mp4 public/brand/zonegtavi-logo.png
Compara a região (x=40,y=56,128x128) de cada quadro com a logo original (correlação normalizada)."""
import subprocess, sys
import numpy as np
video, logo = sys.argv[1], sys.argv[2]
N = 48
ref = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", logo, "-vf", f"scale={N}:{N},format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout, np.uint8).astype(float)
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", video, "-vf", f"crop=128:128:40:56,scale={N}:{N},format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
frames = np.frombuffer(raw, np.uint8).reshape(-1, N * N).astype(float)
r = (ref - ref.mean()) / (ref.std() + 1e-9)
scores = np.array([np.mean(((x - x.mean()) / (x.std() + 1e-9)) * r) for x in frames])
bad = np.where(scores < 0.6)[0]
print(f"quadros: {len(scores)} | correlação mínima: {scores.min():.3f} | média: {scores.mean():.3f} | quadros sem logo (<0.6): {len(bad)}")
if len(bad):
    print("primeiros quadros suspeitos (s):", [round(b / 30, 2) for b in bad[:20]])
