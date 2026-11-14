"""Regra do canal: nunca repetir imagem ou vídeo de fundo.

Uso: python scripts/check_media.py [arquivo-do-video-novo.tsx]
Lista as mídias usadas por arquivo de cena. Com um argumento, falha se esse arquivo
repetir uma mídia dentro dele ou usar alguma que outro vídeo já usou.
"""
import re
import sys
from collections import Counter
from pathlib import Path

files = [p for p in Path("src").rglob("*.ts*") if p.name not in ("Background.tsx", "Fx.tsx")]
used = {p: re.findall(r"'((?:v/)?[\w.-]+\.(?:jpg|png|mp4|webm))'", p.read_text()) for p in files}
used = {p: [m for m in v if not m.startswith("logo")] for p, v in used.items() if v}
for p, v in used.items():
    print(f"{p}: {len(v)} usos, {len(set(v))} mídias")
if len(sys.argv) > 1:
    target = Path(sys.argv[1])
    mine = used[target]
    dup = [m for m, c in Counter(mine).items() if c > 1]
    others = {m for p, v in used.items() if p != target for m in v}
    old = sorted(set(mine) & others)
    if dup or old:
        sys.exit(f"REPETIDAS no vídeo: {dup}\nJÁ USADAS em outros vídeos: {old}")
    print("OK: nenhuma mídia repetida em", target)
else:
    print("usadas:", " ".join(sorted({m for v in used.values() for m in v})))
