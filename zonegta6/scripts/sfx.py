"""Biblioteca de efeitos sonoros originais do ZoneGTA6, 100% sintetizada.

Uso: python scripts/sfx.py public/sfx/v2

Gera ~40 sons diferentes (whooshes, impactos, risers, blips, sons temáticos) para que
nenhum precise se repetir mais de 2 vezes no mesmo vídeo.
"""
import os
import sys
import wave

import numpy as np

SR = 48000
OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(2026)


def t_(d):
    return np.arange(int(d * SR)) / SR


def noise(d):
    return rng.standard_normal(int(d * SR))


def band(x, lo, hi):
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X = np.fft.rfft(x)
    X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, len(x))


def glide(f0, f1, d, curve=1.0):
    t = t_(d)
    f = f0 + (f1 - f0) * (t / d) ** curve
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def tone(f, d, decay, wave_="sin"):
    t = t_(d)
    ph = 2 * np.pi * f * t
    s = {"sin": np.sin(ph), "sq": np.sign(np.sin(ph)), "tri": 2 / np.pi * np.arcsin(np.sin(ph)), "saw": 2 * ((f * t) % 1) - 1}[wave_]
    return s * np.exp(-t * decay)


def bell(f, d, decay):
    t = t_(d)
    return sum(np.sin(2 * np.pi * f * r * t) * g * np.exp(-t * decay * (1 + i * 0.6)) for i, (r, g) in enumerate([(1, 1), (2.76, 0.5), (5.4, 0.25), (8.93, 0.12)]))


def place(parts, d):
    out = np.zeros(int(d * SR))
    for at, s, g in parts:
        i = int(at * SR)
        s = s[: len(out) - i]
        out[i : i + len(s)] += s * g
    return out


def whoosh(d, lo, hi, up=True, width=0.18):
    t = t_(d)
    n = noise(d)
    out = np.zeros(len(t))
    edges = np.geomspace(lo, hi, 9)
    for k in range(8):
        pos = k / 7 if up else 1 - k / 7
        env = np.exp(-(((t / d) - (0.2 + 0.6 * pos)) ** 2) / (2 * width**2))
        out += band(n, edges[k], edges[k + 1]) * env
    return out


def click(f=2000, d=0.02):
    t = t_(d)
    return (noise(d) * 0.6 + np.sin(2 * np.pi * f * t)) * np.exp(-t * 250)


def sub(f0, f1, d, decay):
    t = t_(d)
    f = f1 + (f0 - f1) * np.exp(-t * 25)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * decay)


S = {}
# ── Transições ───────────────────────────────────────────────
S["whoosh_a"] = whoosh(0.6, 300, 6000)
S["whoosh_b"] = whoosh(0.7, 300, 7000, up=False)
S["whoosh_c"] = whoosh(0.35, 1000, 11000, width=0.14)
S["whoosh_d"] = whoosh(0.9, 80, 1500) * 1.6
S["whoosh_e"] = place([(0, whoosh(0.4, 400, 8000), 1), (0.3, whoosh(0.5, 400, 8000, up=False), 1)], 0.85)
S["swish_f"] = whoosh(0.2, 3000, 13000, up=False, width=0.2)

# ── Impactos ─────────────────────────────────────────────────
S["impact_a"] = sub(110, 36, 1.2, 4) + place([(0, click(900, 0.03), 0.6)], 1.2)
S["impact_b"] = place([(0, bell(210, 1.4, 4), 0.5), (0, sub(140, 50, 0.6, 9), 1)], 1.4)
S["impact_c"] = place([(0, band(noise(0.25), 60, 1600) * np.exp(-t_(0.25) * 22), 1.2), (0, sub(160, 48, 0.7, 8), 1)], 0.7)
S["impact_d"] = place([(0, sub(120, 45, 0.5, 10), 1), (0.12, sub(100, 38, 0.8, 6), 1)], 0.95)
S["impact_e"] = place([(0, sub(100, 32, 2.0, 2.2), 1), (0, band(noise(2.0), 200, 5000) * np.exp(-t_(2.0) * 3.5), 0.5)], 2.0)
st = t_(2.2)
S["stinger_intro"] = np.tanh(3 * sum(tone(f, 2.2, 1.4, "saw") for f in (46.2, 92.6, 138.5, 93.1)) / 4) * 0.8 + sub(90, 30, 2.2, 2)
S["stinger_final"] = place(
    [(0, sub(110, 34, 2.6, 1.6), 1), (0, band(noise(2.6), 2500, 12000) * np.exp(-t_(2.6) * 2.5), 0.3)]
    + [(0.02 * i, tone(f, 2.5, 1.6, "tri"), 0.22) for i, f in enumerate((185, 277.2, 370, 554.4, 740))],
    2.6,
)

# ── Risers ───────────────────────────────────────────────────
tt = t_(1.5)
S["riser_a"] = sum(band(noise(1.5), lo, lo * 2) * np.clip((tt / 1.5 - i * 0.12), 0, 1) ** 2 for i, lo in enumerate((400, 800, 1600, 3200, 6400)))
tt = t_(1.2)
S["riser_b"] = glide(180, 1400, 1.2, 2.0) * (tt / 1.2) ** 1.5 * (0.6 + 0.4 * np.sin(2 * np.pi * (4 + 14 * tt / 1.2) * tt))
tt = t_(1.0)
S["reverse_cym"] = band(noise(1.0), 3500, 14000) * (tt / 1.0) ** 3

# ── Interface ────────────────────────────────────────────────
S["blip_a"] = place([(0, tone(880, 0.09, 12, "sq"), 0.5), (0.085, tone(1320, 0.14, 14, "sq"), 0.5)], 0.25)
S["blip_b"] = tone(1760, 0.35, 12)
S["blip_c"] = place([(i * 0.06, tone(f, 0.2, 14, "tri"), 0.8) for i, f in enumerate((1046.5, 1318.5, 1568))], 0.35)
tt = t_(0.4)
S["blip_d"] = np.sin(2 * np.pi * 1200 * tt + 3 * np.sin(2 * np.pi * 1680 * tt) * np.exp(-tt * 12)) * np.exp(-tt * 10)
S["check_a"] = place([(0, glide(400, 900, 0.07), 0.8), (0.06, tone(2093, 0.4, 9), 0.6)], 0.5)
S["check_b"] = place([(0, bell(784, 0.3, 14), 0.6), (0.09, bell(1175, 0.45, 10), 0.6)], 0.55)
tt = t_(0.5)
S["check_c"] = place([(0, click(3000), 0.8), (0.01, np.sin(2 * np.pi * 1568 * tt + 0.4 * np.sin(2 * np.pi * 7 * tt)) * np.exp(-tt * 8), 0.7)], 0.5)
S["check_d"] = place([(0, sub(300, 150, 0.1, 30), 0.9), (0.03, tone(1318.5, 0.45, 9, "tri"), 0.8)], 0.5)
S["click_a"] = click(2200, 0.03)
S["pop_a"] = glide(300, 760, 0.07) * np.exp(-t_(0.07) * 20)
S["pop_b"] = place([(0, glide(700, 260, 0.06), 0.9), (0.05, glide(260, 900, 0.07), 0.9)], 0.14)
g = noise(0.28)
S["glitch_a"] = np.round(band(g, 500, 9000) * 3) / 3 * (np.sin(2 * np.pi * 37 * t_(0.28)) > 0) * np.exp(-t_(0.28) * 5)
S["glitch_b"] = place([(i * 0.045, tone(f, 0.04, 2, "sq"), 0.5) for i, f in enumerate(rng.choice([220, 330, 494, 660, 880, 1320], 8))], 0.4)
S["scan"] = glide(500, 2600, 0.45, 1.5) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 30 * t_(0.45)))) * np.hanning(int(0.45 * SR))
S["success"] = place([(i * 0.09, tone(f, 0.5, 6, "tri"), 0.6) for i, f in enumerate((739.99, 932.33, 1108.7, 1480))], 0.8)
S["notify"] = place([(0, bell(1318.5, 0.5, 7), 0.6), (0.16, bell(1046.5, 0.8, 5), 0.6)], 1.0)

# ── Temáticos ────────────────────────────────────────────────
tt = t_(0.5)
crumple = band(noise(0.5), 700, 6000) * (rng.random(len(tt)) > 0.55) * np.repeat(rng.random(50), len(tt) // 50 + 1)[: len(tt)]
S["trash"] = place([(0, crumple * np.exp(-tt * 3), 1.2), (0.42, sub(140, 55, 0.3, 14), 1)], 0.75)
S["download"] = place([(i * 0.085, tone(520 * 2 ** (i * 2 / 12), 0.07, 5, "sq"), 0.45) for i in range(6)] + [(0.51, tone(1046.5, 0.3, 8, "sq"), 0.45)], 0.85)
S["cash"] = place([(i * 0.045, click(1500 + 300 * i, 0.02), 0.6) for i in range(4)] + [(0.2, bell(2637, 0.9, 5), 0.45), (0.22, bell(3520, 0.9, 5), 0.35)], 1.1)
S["clock"] = place([(i * 0.22, click(2200 if i % 2 == 0 else 1500, 0.025), 0.9) for i in range(4)] + [(0.9, bell(880, 1.2, 3.5), 0.5)], 2.1)
S["power_down"] = band(tone(1, 0.01, 0) if False else (2 * ((np.cumsum(400 * np.exp(-t_(0.8) * 2.6) + 50) / SR) % 1) - 1), 40, 3000) * np.exp(-t_(0.8) * 1.5)
S["power_up"] = glide(220, 1500, 0.5, 2.2) * np.hanning(int(0.5 * SR)) + 0.4 * place([(0.42, tone(1760, 0.25, 12, "tri"), 1)], 0.5 + 0.0)[: int(0.5 * SR)]
S["toggle"] = place([(0, click(1100, 0.03), 1), (0.09, click(2400, 0.03), 1), (0.11, tone(1568, 0.15, 18), 0.4)], 0.3)
S["typing"] = place([(float(x), click(rng.integers(1800, 3200), 0.018), 0.7) for x in np.sort(rng.random(10) * 0.65)], 0.75)
S["cloud"] = place([(float(x), tone(f, 0.5, 7), 0.3) for x, f in zip(np.sort(rng.random(9) * 0.7), rng.choice([1975.5, 2349.3, 2637, 2960, 3520, 3951], 9))] + [(0, whoosh(1.0, 3000, 12000) * 0.25, 1)], 1.3)
tt = t_(0.55)
S["slide_whistle"] = np.sin(2 * np.pi * np.cumsum(1500 * np.exp(-tt * 2.2) + 350 + 25 * np.sin(2 * np.pi * 9 * tt)) / SR) * np.hanning(len(tt))
S["alarm"] = place([(i * 0.16, tone(1244.5 if i % 2 == 0 else 932.3, 0.13, 3, "sq"), 0.4) for i in range(6)], 1.0)
penta = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66]
S["tally"] = place([(i * 0.2, bell(f, 0.5, 8), 0.5) for i, f in enumerate(penta)] + [(1.25, tone(2093, 0.6, 5), 0.3)], 2.0)

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
