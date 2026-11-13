"""Trilha original do ZoneGTA6: synthwave noturno, 100% sintetizado (sem samples de terceiros).

Uso: python scripts/music.py public/music/trilha-zonegta6.wav

A grade de compassos é alinhada à narração: o primeiro tempo forte do "drop" cai
exatamente na palavra "trinta" (11,83 s no vídeo).
"""
import sys
import wave

import numpy as np

SR = 48000
BPM = 96
BEAT = 60 / BPM
BAR = BEAT * 4
DUR = 67.0
DROP = 11.83  # "São TRINTA quadros por segundo"
BREAK = (31.4, 38.7)  # bloco do rumor: tira bateria, fica só clima
OUTRO = 61.5  # logo ZoneGTA6: só pad e final
PHASE = DROP % BAR  # desloca a grade para que um compasso comece no drop

rng = np.random.default_rng(6)
N = int(SR * DUR)
L = np.zeros(N)
R = np.zeros(N)


def note(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def env(n, a, d, s, r, length):
    t = np.arange(n) / SR
    e = np.where(t < a, t / max(a, 1e-4), s + (1 - s) * np.exp(-(t - a) / max(d, 1e-4)))
    rel = np.clip((length - t) / max(r, 1e-4), 0, 1)
    return e * rel


def lowpass(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.zeros_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a) * x[i] + a * acc
        y[i] = acc
    return y


def saw(f, n, detune=0.0):
    t = np.arange(n) / SR
    ph = (t * f * (1 + detune)) % 1
    return 2 * ph - 1


def add(sig, start, pan=0.0, gain=1.0):
    i = int(start * SR)
    if i >= N or i + len(sig) <= 0:
        return
    if i < 0:
        sig, i = sig[-i:], 0
    sig = sig[: N - i] * gain
    L[i : i + len(sig)] += sig * (1 - max(pan, 0))
    R[i : i + len(sig)] += sig * (1 + min(pan, 0))


def in_break(t):
    return BREAK[0] <= t < BREAK[1]


# Progressão em Lá menor, clássica do synthwave: Am – F – C – G (um acorde por compasso).
prog = [(57, 60, 64), (53, 57, 60), (48, 52, 55), (55, 59, 62)]
roots = [45, 41, 48, 43]

bar_starts = np.arange(PHASE - BAR * 5, DUR, BAR)
for bi, bs in enumerate(bar_starts):
    if bs + BAR < 0:
        continue
    chord = prog[bi % 4]
    root = roots[bi % 4]
    pre = bs < DROP
    outro = bs >= OUTRO

    # Pad: serras desafinadas com filtro, abre na introdução e fica cheio depois do drop.
    n = int(BAR * SR) + int(0.6 * SR)
    pad = np.zeros(n)
    for m in chord:
        for dt in (-0.006, 0.0, 0.007):
            pad += saw(note(m), n, dt)
    cutoff = 900 if not pre else 350 + 550 * max(0, (bs - (DROP - 4 * BAR)) / (4 * BAR))
    pad = lowpass(pad / 9, cutoff) * env(n, 0.35, 1.0, 0.85, 0.6, n / SR)
    add(pad, bs, -0.3, 0.30)
    add(np.roll(pad, 300), bs, 0.3, 0.30)

    if outro:
        continue

    # Baixo pulsando em colcheias (só depois do drop e fora da quebra).
    for k in range(8):
        t = bs + k * BEAT / 2
        if t < DROP or in_break(t):
            continue
        n = int(BEAT / 2 * SR)
        b = lowpass(saw(note(root), n) + 0.5 * saw(note(root - 12), n), 500)
        add(b * env(n, 0.005, 0.12, 0.4, 0.04, n / SR), t, 0, 0.32)

    # Arpejo em semicolcheias: entra 2 compassos antes do drop como "riser" melódico.
    arp = [chord[0] + 12, chord[1] + 12, chord[2] + 12, chord[1] + 12]
    for k in range(16):
        t = bs + k * BEAT / 4
        if t < DROP - 2 * BAR or in_break(t):
            continue
        n = int(BEAT / 4 * SR)
        tt = np.arange(n) / SR
        sq = np.sign(np.sin(2 * np.pi * note(arp[k % 4]) * tt))
        sq = lowpass(sq, 2500) * env(n, 0.002, 0.06, 0.2, 0.02, n / SR)
        add(sq, t, 0.45 if k % 2 else -0.45, 0.07)

    # Bateria: bumbo nos 4 tempos, caixa no 2 e 4, chimbal nas colcheias.
    for k in range(4):
        t = bs + k * BEAT
        if t < DROP or in_break(t):
            continue
        n = int(0.35 * SR)
        tt = np.arange(n) / SR
        f = 45 + 110 * np.exp(-tt * 30)
        kick = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9)
        add(kick, t, 0, 0.55)
        if k in (1, 3):
            n = int(0.25 * SR)
            tt = np.arange(n) / SR
            sn = (rng.standard_normal(n) * 0.7 + np.sin(2 * np.pi * 190 * tt)) * np.exp(-tt * 16)
            add(lowpass(sn, 5000), t, 0, 0.22)
    for k in range(8):
        t = bs + k * BEAT / 2
        if t < DROP or in_break(t):
            continue
        n = int(0.05 * SR)
        hh = rng.standard_normal(n)
        hh = hh - lowpass(hh, 7000)
        add(hh * np.exp(-np.arange(n) / SR * 80), t, 0.2, 0.10 if k % 2 else 0.06)

# Fade final e normalização.
fade = np.clip((DUR - np.arange(N) / SR) / 3.0, 0, 1)
fade_in = np.clip(np.arange(N) / SR / 1.5, 0, 1)
L *= fade * fade_in
R *= fade * fade_in
peak = max(np.abs(L).max(), np.abs(R).max())
L, R = L / peak * 0.89, R / peak * 0.89
out = (np.stack([L, R], 1) * 32767).astype(np.int16)
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(out.tobytes())
print("ok", sys.argv[1], f"phase={PHASE:.3f}s")
