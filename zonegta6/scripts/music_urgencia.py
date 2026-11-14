"""Trilha original "urgência" para o vídeo de perguntas, 100% sintetizada.

Uso: python scripts/music_urgencia.py src/faq/timing-<video>.json public/music/<saida>.wav

140 BPM em Fá# menor. Relógio, alarme em dois tons, baixo distorcido em semicolcheias,
bateria de pista e um impacto a cada nova pergunta (lido de timing.json). Ou seja: se a
narração mudar, basta gerar a trilha de novo e os impactos seguem as perguntas.
"""
import json
import sys
import wave

import numpy as np

timing = json.load(open(sys.argv[1]))
OUT = sys.argv[2]
FPS = 30
SR = 48000
DUR = timing["duration"] / FPS
qs = [b["q"] / FPS for b in timing["blocks"]]
ids = [b["id"] for b in timing["blocks"]]
T_FIRST_Q = qs[1]  # primeira pergunta: a bateria entra aqui
T_LAYER = qs[len(qs) // 2]  # segunda metade: entra uma camada a mais
T_CTA = qs[-1]

BPM = 140
BEAT = 60 / BPM
BAR = BEAT * 4
STEP = BEAT / 4
PHASE = T_FIRST_Q % BAR

rng = np.random.default_rng(140)
N = int(SR * DUR)
L = np.zeros(N)
R = np.zeros(N)
t_all = np.arange(N) / SR


def hz(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def lowpass(x, cutoff):
    a = np.broadcast_to(np.exp(-2 * np.pi * np.asarray(cutoff, dtype=float) / SR), x.shape)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a[i]) * x[i] + a[i] * acc
        y[i] = acc
    return y


def highpass(x, c):
    return x - lowpass(x, c)


def saw(f, n, detune=0.0, phase=0.0):
    tt = np.arange(n) / SR
    return 2 * ((tt * f * (1 + detune) + phase) % 1) - 1


def add(sig, start, pan=0.0, gain=1.0):
    i = int(start * SR)
    if i >= N or i + len(sig) <= 0:
        return
    if i < 0:
        sig, i = sig[-i:], 0
    sig = sig[: N - i] * gain
    L[i : i + len(sig)] += sig * (1 - max(pan, 0))
    R[i : i + len(sig)] += sig * (1 + min(pan, 0))


def kick(at, g):
    n = int(0.4 * SR)
    tt = np.arange(n) / SR
    f = 48 + 120 * np.exp(-tt * 35)
    add(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 8), at, 0, g)


def clap(at, g):
    n = int(0.25 * SR)
    tt = np.arange(n) / SR
    s = rng.standard_normal(n) * (np.exp(-tt * 18) + 0.6 * np.exp(-np.abs(tt - 0.012) * 300))
    add(lowpass(highpass(s, 900), 7000), at, 0, g)


def hat(at, g, pan=0.25):
    n = int(0.035 * SR)
    add(highpass(rng.standard_normal(n), 7500) * np.exp(-np.arange(n) / SR * 110), at, pan, g)


def tick(at, g, pan):
    n = int(0.02 * SR)
    add(highpass(rng.standard_normal(n), 4500) * np.exp(-np.arange(n) / SR * 220), at, pan, g)


def impact(at, g, length=2.6):
    """Impacto de pergunta nova: braam curto + sub + prato invertido antes."""
    n = int(length * SR)
    tt = np.arange(n) / SR
    s = np.zeros(n)
    for m in (30, 42, 49):
        for dt in (-0.012, 0.0, 0.013):
            s += saw(hz(m), n, dt)
    s = np.tanh(lowpass(s / 9, 900) * 3) * np.exp(-tt * 1.6)
    sub = np.sin(2 * np.pi * np.cumsum(32 + 60 * np.exp(-tt * 3)) / SR) * np.exp(-tt * 2.2)
    crash = highpass(rng.standard_normal(n), 3000) * np.exp(-tt * 3.5)
    add(s + 0.9 * sub + 0.25 * crash, at, 0, g)
    m = int(0.45 * SR)  # "sucção" antes do impacto
    tt = np.arange(m) / SR
    sw = highpass(rng.standard_normal(m), 800 + 5000 * tt / 0.45) * (tt / 0.45) ** 3
    add(sw, at - 0.45, 0, 0.35 * g)


def alarm(at, g, length):
    """Alarme em dois tons (Fá# – Sol), quadrado filtrado: a "sirene" da urgência."""
    n = int(length * SR)
    tt = np.arange(n) / SR
    f = np.where((tt // (BEAT / 2)) % 2 == 0, hz(78), hz(79))
    sq = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR))
    add(lowpass(sq, 2600) * np.exp(-(tt % (BEAT / 2)) * 9), at, 0, g)


roots = [42, 38, 40, 37]  # F#m – D – E – C# (i – VI – VII – V), dois compassos cada
osti = [0, 0, 12, 0, 7, 0, 12, 0, 0, 0, 12, 0, 10, 7, 3, 0]

# Pad de tensão por baixo de tudo.
pad = np.zeros(N)
for m, gg in ((54, 1), (57, 0.8), (61, 0.6), (62, 0.25)):
    for dt in (-0.006, 0.0, 0.007):
        pad += saw(hz(m), N, dt, rng.random()) * gg
pad = lowpass(pad / 8, 700) * np.interp(t_all, [0, 1, T_CTA, T_CTA + 1, DUR], [0.4, 0.6, 0.6, 0.9, 0])
add(pad, 0, 0, 0.16)

# Introdução: relógio + pulso grave acelerando o filtro + alarme subindo.
t = 0.15
k = 0
while t < T_FIRST_Q - 0.02:
    p = t / T_FIRST_Q
    tick(t, 0.20 if k % 4 == 0 else 0.11, 0.4 if k % 2 else -0.4)
    if k % 2 == 0:
        n = int(STEP * 2 * SR)
        b = lowpass(saw(hz(30), n) + 0.5 * saw(hz(42), n, 0.005), 180 + 1000 * p ** 2)
        add(b * np.exp(-np.arange(n) / SR * 10), t, 0, 0.35 + 0.25 * p)
    t += STEP
    k += 1
alarm(max(0, T_FIRST_Q - 2 * BAR), 0.05, 2 * BAR)
impact(0.13, 0.9)  # "Faltam cinco dias"

# Corpo: bateria de pista, baixo distorcido, ostinato e alarme.
t = T_FIRST_Q
k = 0
while t < T_CTA - 0.02:
    bar_i = int((t - T_FIRST_Q) / BAR + 1e-6)
    root = roots[(bar_i // 2) % 4]
    pos = k % 16
    if pos % 4 == 0:
        kick(t, 0.6)
    if pos in (4, 12):
        clap(t, 0.24)
    hat(t, 0.10 if pos % 2 else 0.05, 0.25 if pos % 2 else -0.25)
    n = int(STEP * SR)
    b = np.tanh(3.2 * lowpass(saw(hz(root - 12), n) + saw(hz(root - 12), n, 0.01), 500))
    add(b * np.exp(-np.arange(n) / SR * 14), t, 0, 0.17)
    s = saw(hz(root + 12 + osti[pos]), n) + 0.5 * saw(hz(root + 24 + osti[pos]), n, 0.004)
    add(lowpass(s, 2000) * np.exp(-np.arange(n) / SR * 24), t, 0.3 if k % 2 else -0.3, 0.08)
    if t >= T_LAYER:  # camada extra na segunda metade: arpejo agudo
        a = np.sign(np.sin(2 * np.pi * hz(root + 36 + osti[(pos * 3) % 16]) * np.arange(n) / SR))
        add(lowpass(a, 3500) * np.exp(-np.arange(n) / SR * 30), t, -0.4 if k % 2 else 0.4, 0.045)
    if pos == 0 and bar_i % 2 == 0:
        alarm(t, 0.035, BAR)
    t += STEP
    k += 1

# Um impacto em cada pergunta (e um maior no encerramento).
for q in qs[1:-1]:
    impact(q, 0.75)
impact(T_CTA, 1.0, 4.5)

# Encerramento: só relógio desacelerando sobre o pad.
t = T_CTA
k = 0
while t < DUR - 1:
    tick(t, 0.15 * max(0, 1 - (t - T_CTA) / (DUR - T_CTA)), 0.4 if k % 2 else -0.4)
    t += BEAT / 2 * (1 + (t - T_CTA) / 6)
    k += 1

# Reverb curto para colar a mixagem.
wl, wr = np.zeros(N), np.zeros(N)
for i, (d, g) in enumerate([(0.029, 0.4), (0.043, 0.35), (0.067, 0.3), (0.101, 0.22), (0.149, 0.15)]):
    k = int(d * SR)
    a, b = (L, R) if i % 2 == 0 else (R, L)
    wl[k:] += a[:-k] * g
    wr[k:] += b[:-k] * g
L += lowpass(wl, 5000) * 0.3
R += lowpass(wr, 5000) * 0.3

fade = np.clip((DUR - t_all) / 2.0, 0, 1) * np.clip(t_all / 0.05, 0, 1)
L *= fade
R *= fade
peak = max(np.abs(L).max(), np.abs(R).max())
out = (np.stack([L, R], 1) / peak * 0.89 * 32767).astype(np.int16)
with wave.open(OUT, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(out.tobytes())
print("ok", OUT, f"{DUR:.2f}s")
