"""Trilha original de trailer de cinema, 100% sintetizada.

Uso: python scripts/music_trailer.py public/music/trilha-trailer.wav

Segue a linha do tempo de src/edit/filme-timeline.json (frames a 30 fps): drone grave, notas
de piano, "braams" nas cartelas, batidas que aceleram na montagem, silêncio antes do
título, grande impacto no título e acorde final na logo.
"""
import sys
import wave

import numpy as np

FPS = 30
SR = 48000
# Marcos lidos da mesma linha do tempo usada pela cena (src/edit/filme-timeline.json).
import json

_tl = json.load(open("src/edit/filme-timeline.json"))
_starts, _at = [], 0
for _seg in _tl:
    _starts.append(_at)
    _at += _seg["dur"]
END = _at
CARDS = [st for st, seg in zip(_starts, _tl) if seg["kind"] == "card"][1:]  # cartelas (menos a de abertura)
_fast = [st for st, seg in zip(_starts, _tl) if seg["kind"] == "shot" and seg["dur"] <= 12]
MONTAGE = (_fast[0], _fast[-1] + 12)  # cortes rápidos (12 frames cada)
TITLE, DATE, DAYS, LOGO = (next(st for st, seg in zip(_starts, _tl) if seg["kind"] == k) for k in ("title", "date", "days", "logo"))

DUR = END / FPS
N = int(SR * DUR)
rng = np.random.default_rng(7)
L = np.zeros(N)
R = np.zeros(N)
t_all = np.arange(N) / SR


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def tt(d):
    return np.arange(int(d * SR)) / SR


def band(x, lo, hi):
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X = np.fft.rfft(x)
    X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, len(x))


def add(sig, frame, pan=0.0, gain=1.0):
    i = int(frame / FPS * SR)
    if i >= N or i + len(sig) <= 0:
        return
    if i < 0:
        sig, i = sig[-i:], 0
    sig = sig[: N - i] * gain
    L[i : i + len(sig)] += sig * (1 - max(pan, 0))
    R[i : i + len(sig)] += sig * (1 + min(pan, 0))


def saws(notes, d, lo, hi):
    t = tt(d)
    s = sum(2 * ((t * hz(m) * (1 + dt) + rng.random()) % 1) - 1 for m in notes for dt in (-0.006, 0.0, 0.007))
    return band(s / (len(notes) * 3), lo, hi)


def braam(g=1.0, d=3.2, root=26):
    t = tt(d)
    s = np.tanh(saws([root, root + 12, root + 19], d, 40, 900) * 5) * np.exp(-t * 1.1)
    sub = np.sin(2 * np.pi * np.cumsum(30 + 55 * np.exp(-t * 2)) / SR) * np.exp(-t * 1.6)
    return (s + 0.9 * sub) * g


def boom(d=2.5, f0=42):
    t = tt(d)
    return np.sin(2 * np.pi * np.cumsum(f0 + f0 * 1.5 * np.exp(-t * 22)) / SR) * np.exp(-t * 2.2) + 0.3 * band(rng.standard_normal(len(t)), 100, 2500) * np.exp(-t * 14)


def piano(m, d=2.4):
    t = tt(d)
    return sum(np.sin(2 * np.pi * hz(m) * h * t) * g * np.exp(-t * (1.6 + h)) for h, g in ((1, 1), (2, 0.4), (3, 0.18))) * np.clip(t / 0.004, 0, 1)


def riser(d):
    t = tt(d)
    z = band(rng.standard_normal(len(t)), 500, 12000) * (t / d) ** 2.5
    tone = np.sin(2 * np.pi * np.cumsum(hz(50) * 2 ** (t / d * 2)) / SR) * (t / d) ** 2
    return 0.6 * z + 0.4 * tone


# Drone em Ré menor do começo até o silêncio antes do título.
sil = MONTAGE[1] / FPS
drone = saws([26, 38, 45, 50], DUR, 40, 500)
drone *= np.interp(t_all, [0, 2, sil - 0.1, sil, TITLE / FPS, TITLE / FPS + 0.5, LOGO / FPS, DUR], [0, 0.7, 1.0, 0, 0, 0.9, 0.9, 0])
drone *= 0.8 + 0.2 * np.sin(2 * np.pi * 0.13 * t_all)
add(drone, 0, -0.15, 0.6)
add(np.roll(drone, 700), 0, 0.15, 0.6)

# Piano: motivo lento de 4 notas, repetido até a montagem (sem tocar em cima dos braams).
_motif = [62, 65, 64, 57, 62, 69, 65, 64]
for _k, _fr in enumerate(range(10, MONTAGE[0] - 30, 52)):
    if all(abs(_fr - c) > 20 for c in CARDS):
        add(piano(_motif[_k % 8]), _fr, 0.2, 0.22)

# Braams nas cartelas.
for fr in CARDS:
    add(braam(0.8), fr, 0, 0.8)

# Montagem: uma batida por corte, cada vez mais forte, com riser por cima.
cuts = list(range(MONTAGE[0], MONTAGE[1], 12))
for k, fr in enumerate(cuts):
    add(boom(0.6, 55), fr, 0, 0.45 + 0.07 * k)
add(riser((MONTAGE[1] - MONTAGE[0]) / FPS), MONTAGE[0], 0, 0.55)

# Título: grande impacto + acorde sustentado com "coro".
add(braam(1.0, 4.5), TITLE, 0, 1.0)
add(boom(3.5, 36), TITLE, 0, 1.0)
d = (LOGO - TITLE) / FPS + 1
t = tt(d)
vib = 1 + 0.004 * np.sin(2 * np.pi * 5 * t)
choir = sum(np.sin(2 * np.pi * np.cumsum(hz(m) * vib) / SR) * g for m, g in ((62, 1), (65, 0.8), (69, 0.8), (74, 0.5)))
add(choir / 4 * np.clip(t / 1.2, 0, 1) * np.clip((d - t) / 1.0, 0, 1), TITLE, 0, 0.16)
add(saws([50, 53, 57, 62], d, 100, 1500) * np.clip(t / 0.8, 0, 1) * np.clip((d - t) / 1.0, 0, 1), TITLE, 0, 0.35)

add(boom(2.5, 40), DATE, 0, 0.8)
add(braam(0.6, 2.5), DATE, 0, 0.6)
add(boom(2.2, 44), DAYS, 0, 0.7)

# Logo: acorde final em Ré maior (resolve) e batida.
d = (END - LOGO) / FPS
t = tt(d)
fin = saws([38, 50, 54, 57, 62], d, 60, 1800) * np.clip(t / 0.05, 0, 1) * np.clip((d - t) / 2.5, 0, 1)
add(fin, LOGO, 0, 0.6)
add(boom(3.0, 38), LOGO, 0, 0.9)

# Reverb de sala grande.
wl, wr = np.zeros(N), np.zeros(N)
for i, (dly, g) in enumerate([(0.041, 0.5), (0.067, 0.45), (0.103, 0.4), (0.161, 0.33), (0.239, 0.26), (0.353, 0.2), (0.509, 0.14)]):
    k = int(dly * SR)
    a, b = (L, R) if i % 2 == 0 else (R, L)
    wl[k:] += a[:-k] * g
    wr[k:] += b[:-k] * g
L += band(wl, 150, 5000) * 0.5
R += band(wr, 150, 5000) * 0.5

fade = np.clip((DUR - t_all) / 2.0, 0, 1) * np.clip(t_all / 0.3, 0, 1)
L *= fade
R *= fade
peak = max(np.abs(L).max(), np.abs(R).max())
out = (np.stack([L, R], 1) / peak * 0.89 * 32767).astype(np.int16)
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(out.tobytes())
print("ok", sys.argv[1], f"{DUR:.1f}s")
