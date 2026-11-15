"""Trilha original no estilo phonk lento ("slowed"), 100% sintetizada.

Uso: python scripts/music_phonk.py public/music/trilha-phonk.wav

100 BPM (1 tempo = 18 frames a 30 fps, 1 compasso = 72 frames), Fá# menor, 15 compassos.
Melodia de cowbell, 808 distorcido com slide, palma no tempo 3, chimbal com rolos e
bastante reverb. A melodia é própria: não reproduz nenhuma música existente.
Estrutura (compassos): 0-1 intro filtrada · 2-9 drop · 10-11 quebra · 12-13 drop · 14 final.
"""
import sys
import wave

import numpy as np

SR = 48000
BPM = 100
BEAT = 60 / BPM
BAR = BEAT * 4
BARS = 15
DUR = BARS * BAR
N = int(SR * DUR)
rng = np.random.default_rng(100)
L = np.zeros(N)
R = np.zeros(N)
t_all = np.arange(N) / SR


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def band(x, lo, hi):
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X = np.fft.rfft(x)
    X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, len(x))


def add(sig, start, pan=0.0, gain=1.0, bus=None):
    i = int(start * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    l, r = (L, R) if bus is None else bus
    l[i : i + len(sig)] += sig * (1 - max(pan, 0))
    r[i : i + len(sig)] += sig * (1 + min(pan, 0))


def tt(d):
    return np.arange(int(d * SR)) / SR


def cowbell(m, d=0.5):
    t = tt(d)
    f = hz(m)
    s = np.sign(np.sin(2 * np.pi * f * t)) + np.sign(np.sin(2 * np.pi * f * 1.48 * t))
    return band(s, f * 0.8, 9000) * (np.exp(-t * 9) + 0.25 * np.exp(-t * 2.5))


def bass808(m, d, slide_to=None):
    t = tt(d)
    f0 = hz(m)
    f = f0 * (1 + 1.2 * np.exp(-t * 40))
    if slide_to is not None:
        f = f + (hz(slide_to) - f0) * np.clip((t - d * 0.45) / (d * 0.3), 0, 1)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR)
    return np.tanh(s * 3.5) * np.exp(-t * 1.6) * np.clip((d - t) / 0.03, 0, 1)


def kick():
    t = tt(0.3)
    return np.sin(2 * np.pi * np.cumsum(50 + 130 * np.exp(-t * 38)) / SR) * np.exp(-t * 11)


def clap():
    t = tt(0.35)
    e = sum(np.exp(-np.abs(t - x) * 260) for x in (0.0, 0.012, 0.026)) + 0.6 * np.exp(-t * 12)
    return band(rng.standard_normal(len(t)), 900, 7500) * e


def hat(d=0.04, decay=120):
    t = tt(d)
    return band(rng.standard_normal(len(t)), 7000, 15000) * np.exp(-t * decay)


# Cowbell: frase de 2 compassos em colcheias (None = pausa). Bus próprio, para filtrar por seção.
phrase = [66, None, 66, 69, 66, None, 73, 71, 66, None, 66, 69, 64, 66, 61, 64]
phrase_b = [66, None, 66, 69, 73, None, 76, 73, 71, None, 69, 66, 64, 66, 61, None]
cb = [np.zeros(N), np.zeros(N)]
for bar in range(BARS - 1):
    notes = (phrase_b if (bar // 2) % 4 == 3 else phrase)[(bar % 2) * 8 : (bar % 2) * 8 + 8]
    for k, m in enumerate(notes):
        if m is not None:
            add(cowbell(m), bar * BAR + k * BEAT / 2, 0.25 if k % 2 else -0.25, 0.5, cb)
add(cowbell(66, 2.2), (BARS - 1) * BAR, 0, 0.6, cb)


def section_filter(x):
    """Intro e quebra abafadas (som de 'rádio distante'); drop aberto."""
    out = np.zeros(N)
    for b0, b1, hi, g in ((0, 2, 1100, 0.8), (2, 10, 9000, 1.0), (10, 12, 1400, 0.7), (12, 15, 9000, 1.0)):
        i, j = int(b0 * BAR * SR), min(N, int(b1 * BAR * SR))
        seg = np.zeros(N)
        seg[i:j] = x[i:j]
        out += band(seg, 150, hi) * g
    return out


L += section_filter(cb[0])
R += section_filter(cb[1])

# Pad escuro (Fá# menor) em tudo.
pad = np.zeros(N)
for m, g in ((42, 1.0), (49, 0.7), (54, 0.6), (57, 0.5), (61, 0.3)):
    for dt in (-0.005, 0.0, 0.006):
        pad += (2 * ((t_all * hz(m) * (1 + dt) + rng.random()) % 1) - 1) * g
pad = band(pad, 60, 700) / 6
add(pad * np.interp(t_all, [0, 2, DUR - 2.4, DUR], [0.3, 1, 1, 0]), 0, 0, 0.22)

drop = [b for b in range(BARS) if 2 <= b < 10 or 12 <= b < 14]
for bar in drop:
    t0 = bar * BAR
    root = 30 if bar % 4 < 2 else (26 if bar % 4 == 2 else 28)
    # 808 + bumbo: tempo 1, "e" do 2, tempo 4 (com slide no fim do compasso).
    add(bass808(root, BEAT * 1.4), t0, 0, 0.55)
    add(bass808(root, BEAT * 1.3), t0 + BEAT * 1.5, 0, 0.5)
    add(bass808(root, BEAT * 0.95, slide_to=root + (5 if bar % 2 else -2)), t0 + BEAT * 3, 0, 0.5)
    for b in (0, 1.5, 3):
        add(kick(), t0 + BEAT * b, 0, 0.5)
    add(clap(), t0 + BEAT * 2, 0, 0.5)
    for k in range(8):
        add(hat(), t0 + k * BEAT / 2, 0.3, 0.16 if k % 2 == 0 else 0.1)
    if bar % 2 == 1:  # rolo de chimbal no fim do compasso
        for k in range(6):
            add(hat(0.03, 160), t0 + BEAT * 3.25 + k * BEAT / 8, -0.3, 0.07 + 0.015 * k)

# Quebra: um 808 longo e palmas esparsas.
add(bass808(30, BEAT * 3.5), 10 * BAR, 0, 0.45)
add(clap(), 10 * BAR + BEAT * 2, 0, 0.3)
add(clap(), 11 * BAR + BEAT * 2, 0, 0.3)

# Risers antes dos dois drops (fim da intro e fim da quebra) e virada de bumbo.
for end in (2 * BAR, 12 * BAR):
    d = BEAT * 4
    t = tt(d)
    rz = band(rng.standard_normal(len(t)), 600, 12000) * (t / d) ** 2.5
    tone = np.sin(2 * np.pi * np.cumsum(hz(54) * 2 ** (t / d * 1.5)) / SR) * (t / d) ** 2
    add(0.5 * rz + 0.35 * tone, end - d, 0, 0.5)
    for k in range(4):
        add(kick(), end - BEAT + k * BEAT / 4, 0, 0.3 + 0.07 * k)

# Final: 808 e impacto que se apagam.
add(bass808(30, BEAT * 4), 14 * BAR, 0, 0.6)
add(kick(), 14 * BAR, 0, 0.6)
add(clap(), 14 * BAR, 0, 0.35)

# Reverb largo (clima "slowed") e leve abafado geral.
wl, wr = np.zeros(N), np.zeros(N)
for i, (d, g) in enumerate([(0.037, 0.5), (0.061, 0.45), (0.097, 0.4), (0.149, 0.34), (0.223, 0.27), (0.331, 0.2), (0.467, 0.14)]):
    k = int(d * SR)
    a, b = (L, R) if i % 2 == 0 else (R, L)
    wl[k:] += a[:-k] * g
    wr[k:] += b[:-k] * g
L = band(L + band(wl, 200, 5000) * 0.5, 25, 11000)
R = band(R + band(wr, 200, 5000) * 0.5, 25, 11000)

fade = np.clip((DUR - t_all) / 1.5, 0, 1) * np.clip(t_all / 0.05, 0, 1)
L *= fade
R *= fade
peak = max(np.abs(L).max(), np.abs(R).max())
out = (np.tanh(np.stack([L, R], 1) / peak * 1.6) / np.tanh(1.6) * 0.89 * 32767).astype(np.int16)
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(out.tobytes())
print("ok", sys.argv[1], f"{DUR:.1f}s")
