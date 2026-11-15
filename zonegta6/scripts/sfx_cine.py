"""Kit de efeitos sonoros cinematográficos (estilo trailer), 100% sintetizado.

Uso: python scripts/sfx_cine.py public/sfx/cine

Só sons que cabem num trailer: passagens de ar graves, impactos com corpo, booms de
sub, swells invertidos, risers, braams curtos, brilhos suaves e batimento. Sem bipes,
cliques ou sons de interface.
"""
import os
import sys
import wave

import numpy as np

SR = 48000
OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(1919)


def t_(d):
    return np.arange(int(d * SR)) / SR


def noise(d):
    return rng.standard_normal(int(d * SR))


def band(x, lo, hi):
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X = np.fft.rfft(x)
    X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, len(x))


def sweep_noise(d, lo0, lo1, width, curve=1.0, env=None):
    """Ruído com filtro passa-faixa que se move (passagem de ar)."""
    t = t_(d)
    out = np.zeros(len(t))
    steps = 12
    n = noise(d)
    for k in range(steps):
        p = k / (steps - 1)
        c = lo0 * (lo1 / lo0) ** (p**curve)
        seg = band(n, c / width, c * width)
        g = np.exp(-(((t / d) - p) ** 2) / (2 * 0.09**2))
        out += seg * g
    return out * (env if env is not None else 1)


def sub(f0, f1, d, decay):
    t = t_(d)
    f = f1 + (f0 - f1) * np.exp(-t * 18)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * decay)


def saws(notes, d):
    t = t_(d)
    return sum(2 * ((t * 440 * 2 ** ((m - 69) / 12) * (1 + dt) + rng.random()) % 1) - 1 for m in notes for dt in (-0.008, 0.0, 0.009)) / (len(notes) * 3)


def reverb(x, amount=0.5):
    y = x.copy()
    for d, g in ((0.043, 0.5), (0.071, 0.42), (0.113, 0.35), (0.173, 0.27), (0.257, 0.2), (0.379, 0.13)):
        k = int(d * SR)
        y[k:] += x[:-k] * g * amount
    return y


def pad_to(x, d):
    n = int(d * SR)
    return np.pad(x, (0, max(0, n - len(x))))[:n]


S = {}
# Passagens de ar graves (transições entre planos).
for name, (d, a, b, w) in {"air_a": (0.9, 150, 2500, 1.6), "air_b": (1.1, 2500, 180, 1.6), "air_c": (0.7, 300, 4000, 1.5), "air_d": (1.3, 90, 1400, 1.8), "air_e": (0.8, 3500, 250, 1.5), "air_f": (1.0, 200, 3000, 1.7)}.items():
    S[name] = reverb(sweep_noise(d, a, b, w, 1.3), 0.4)

# Impactos com corpo (cartelas, dados, cortes da montagem).
for i, (f0, f1, body) in enumerate([(120, 42, 900), (95, 36, 700), (140, 50, 1300), (110, 40, 600), (160, 55, 1600), (85, 33, 500)]):
    d = 1.6
    t = t_(d)
    hit = sub(f0, f1, d, 3.2) + 0.5 * band(noise(d), 60, body) * np.exp(-t * 18) + 0.15 * band(noise(d), 2000, 9000) * np.exp(-t * 40)
    S[f"hit_{'abcdef'[i]}"] = reverb(hit, 0.35)

# Booms de sub, longos (momentos grandes).
for i, (f0, f1, dec) in enumerate([(70, 28, 1.4), (60, 25, 1.1), (80, 30, 1.8)]):
    S[f"boom_{'abc'[i]}"] = reverb(sub(f0, f1, 3.0, dec), 0.3)

# Swells invertidos (sucção antes de um impacto): terminam no pico.
for i, (d, lo, hi) in enumerate([(1.4, 400, 12000), (1.0, 300, 9000), (1.8, 500, 14000)]):
    t = t_(d)
    sw = band(noise(d), lo, hi) * (t / d) ** 3.2
    tone = np.sin(2 * np.pi * np.cumsum(70 * 2 ** (t / d * 1.4)) / SR) * (t / d) ** 2.5
    S[f"swell_{'abc'[i]}"] = sw * 0.8 + tone * 0.4

# Risers longos.
for i, (d, f0) in enumerate([(3.0, 55), (2.4, 70)]):
    t = t_(d)
    rz = sweep_noise(d, 300, 9000, 1.6, 1.0, (t / d) ** 2)
    tone = sum(np.sin(2 * np.pi * np.cumsum(f0 * h * 2 ** (t / d * 2)) / SR) for h in (1, 1.5, 2)) / 3 * (t / d) ** 2.2
    S[f"rise_{'ab'[i]}"] = rz * 0.7 + tone * 0.5

# Braams curtos (cartelas fortes).
for i, root in enumerate([38, 36, 41]):
    d = 2.6
    t = t_(d)
    br = np.tanh(band(saws([root, root + 7, root + 12], d), 40, 1200) * 5) * np.exp(-t * 1.3)
    S[f"braam_{'abc'[i]}"] = reverb(br + 0.7 * sub(80, 32, d, 1.8), 0.4)

# Brilhos suaves (legendas): sinos graves com cauda, sem cara de interface.
for i, notes in enumerate([(74, 81), (69, 76), (72, 79), (77, 84)]):
    d = 2.2
    t = t_(d)
    sh = sum(np.sin(2 * np.pi * 440 * 2 ** ((m - 69) / 12) * r * t) * g * np.exp(-t * (2.5 + j)) for m in notes for j, (r, g) in enumerate([(1, 1), (2.01, 0.3), (3.98, 0.12)]))
    sh *= np.clip(t / 0.02, 0, 1)
    S[f"glint_{'abcd'[i]}"] = reverb(sh / 3, 0.6)

# Batimento cardíaco (pausas dramáticas).
hb = np.zeros(int(2.4 * SR))
for k, at in enumerate((0.0, 0.24, 1.1, 1.34)):
    s = sub(70, 38, 0.35, 14) * (1 if k % 2 == 0 else 0.7)
    i = int(at * SR)
    hb[i : i + len(s)] += s
S["heartbeat"] = hb

# Tensão: cordas raspando em cluster, crescendo (antes da pergunta).
d = 2.5
t = t_(d)
cl = sum(np.sin(2 * np.pi * np.cumsum(440 * 2 ** ((m - 69) / 12) * (1 + 0.004 * np.sin(2 * np.pi * (5 + k) * t))) / SR) for k, m in enumerate((74, 75, 76, 77)))
S["tension"] = reverb(cl / 4 * (t / d) ** 1.5, 0.5)

# Acorde final grande (logo).
d = 4.0
t = t_(d)
S["finale"] = reverb(band(saws([38, 50, 54, 57, 62], d), 50, 2500) * np.clip(t / 0.03, 0, 1) * np.exp(-t * 0.8) + 0.8 * sub(75, 30, d, 1.2), 0.5)

for name, s in S.items():
    s = np.asarray(s, dtype=float)
    fade = int(0.004 * SR)
    s[:fade] *= np.linspace(0, 1, fade)
    s[-fade:] *= np.linspace(1, 0, fade)
    s = s / (np.abs(s).max() + 1e-9) * 0.85
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((s * 32767).astype(np.int16).tobytes())
print(len(S), "efeitos em", OUT)
