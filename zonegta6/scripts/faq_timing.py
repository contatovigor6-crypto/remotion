"""Gera src/faq/timing.json a partir de QUALQUER gravação da narração do vídeo de perguntas.

Uso: python scripts/faq_timing.py public/vo/<narracao>.(wav|mp3) [arquivo usado no vídeo]

Transcreve com Whisper (timestamps por palavra), encontra o início de cada pergunta e de
cada resposta pelas âncoras abaixo e grava os frames. Assim, trocar o narrador é só rodar
este script de novo, sem mexer nas animações.
"""
import json
import os
import re
import subprocess
import sys
import unicodedata

import numpy as np
from faster_whisper import WhisperModel

FPS = 30
VO_START = 4  # frame em que a narração entra no vídeo
LEAD = 6  # cada bloco começa 6 frames antes da primeira palavra

# (id, âncora da pergunta, âncora da resposta). As âncoras são as primeiras palavras.
BLOCKS = [
    ("hook", "faltam", "estas"),
    ("hora", "que horas", "a rockstar"),
    ("preco", "quanto custa", None),
    ("dublagem", "vai ser dublado", "nao tem"),
    ("plataformas", "roda no|ps4 ou no xbox@-2|ps quatro ou@-2", "ps4 nao@-1|ps quatro nao@-2|nao no xbox@-3"),
    ("pc", "e no pc", "a rockstar"),
    ("online", "tem modo|modo online@-1", "a descricao"),
    ("download", "ja da", "sim"),
    ("cta", "qual duvida", "comenta"),
]


def norm(w):
    w = unicodedata.normalize("NFD", w.lower())
    w = "".join(c for c in w if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]", "", w)


audio, video_file = sys.argv[1], (sys.argv[2] if len(sys.argv) > 2 else None)
pcm = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", audio, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True).stdout
model = WhisperModel("small", device="cpu", compute_type="int8")
segs, _ = model.transcribe(np.frombuffer(pcm, np.float32), language="pt", word_timestamps=True, beam_size=5)
words = [(w.word.strip(), w.start, w.end) for s in segs for w in s.words]
keys = [norm(w) for w, _, _ in words]
print(" ".join(w for w, _, _ in words))


def find(anchor, start):
    # "a|b" = alternativas; "@-2" = a pergunta começa 2 palavras antes do trecho encontrado
    # (útil quando o Whisper erra a primeira palavra).
    for alt in anchor.split("|"):
        text, _, off = alt.partition("@")
        parts = [norm(p) for p in text.split()]
        for i in range(start, len(keys) - len(parts) + 1):
            if keys[i : i + len(parts)] == parts:
                return max(start, i + int(off or 0))
    raise SystemExit(f"Âncora não encontrada: '{anchor}' (a partir da palavra {start})")


def frame(t):
    return int(round(t * FPS)) + VO_START


out = []
cursor = 0
for bid, qa, aa in BLOCKS:
    qi = find(qa, cursor)
    if aa:
        ai = find(aa, qi + 1)
    else:  # resposta = primeira palavra depois do "?" da pergunta
        ai = next(i + 1 for i in range(qi, len(words)) if words[i][0].endswith("?"))
    out.append({"id": bid, "q": frame(words[qi][1]), "a": frame(words[ai][1])})
    cursor = ai

voice = []
for _, s, e in words:
    s, e = frame(s), frame(e)
    if voice and s - voice[-1][1] < 12:
        voice[-1][1] = e
    else:
        voice.append([s, e])

starts = [b["q"] - LEAD for b in out]
starts[0] = 0
end = frame(words[-1][2]) + 45
for i, b in enumerate(out):
    b["from"] = starts[i]
    b["to"] = starts[i + 1] if i + 1 < len(out) else end

timing = {
    "file": video_file or os.path.relpath(audio, "public"),
    "voStart": VO_START,
    "duration": end,
    "blocks": out,
    "voiceActivity": voice,
}
os.makedirs("src/faq", exist_ok=True)
json.dump(timing, open("src/faq/timing.json", "w"), indent=1)
for b in out:
    print(f"{b['id']:12s} bloco {b['from']:5d}-{b['to']:5d}  pergunta@{b['q']}  resposta@{b['a']}")
print("duração:", end, "frames =", round(end / FPS, 2), "s")
