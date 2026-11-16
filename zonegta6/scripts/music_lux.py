"""Trilha original "luxury cinematic", 100% sintetizada, sincronizada com uma linha do tempo.

Uso: python scripts/music_lux.py src/edit/depois-timeline.json public/music/<saida>.wav

76 BPM, Ré menor com acordes de sétima e nona (Dm9 – Bbmaj7 – Gm9 – A7sus4).
Cordas largas, piano elétrico, 808 grave com deslize, palma suave no tempo 3,
chimbal com swing e arpejos de harpa "de vidro". Respira no gancho, cresce nos
dados e fecha com acorde maior na logo. Melodia e harmonia próprias.
"""
import json
import sys
import wave

import numpy as np

FPS = 30
SR = 48000
BPM = 76
BEAT = 60 / BPM
BAR = 4 * BEAT

tl = json.load(open(sys.argv[1]))["segments"]
starts, at = [], 0
for s in tl:
    starts.append(at)
    at += s["dur"]
DUR = at / FPS
sec = lambda fr: fr / FPS
find = lambda k: next((sec(st) for st, s in zip(starts, tl) if s["kind"] == k), None)
TITLE, DATE, LOGO = find("title"), find("date"), find("logo")
rests = [(sec(st), sec(st + s["dur"])) for st, s in zip(starts, tl) if s.get("rest")]
hits = [sec(st) for st, s in zip(starts, tl) if s["kind"] in ("stat", "quote", "question", "triptych")]
HOOK_END = sec(starts[1]) if len(starts) > 1 else 0

N = int(SR * DUR)
rng = np.random.default_rng(76)
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


def add(sig, t0, pan=0.0, gain=1.0):
    i = int(t0 * SR)
    if i >= N or i + len(sig) <= 0:
        return
    if i < 0:
        sig, i = sig[-i:], 0
    sig = sig[: N - i] * gain
    L[i : i + len(sig)] += sig * (1 - max(pan, 0))
    R[i : i + len(sig)] += sig * (1 + min(pan, 0))


def resting(t):
    return any(a <= t < b for a, b in rests)


def strings(notes, d):
    t = tt(d)
    vib = 1 + 0.0035 * np.sin(2 * np.pi * 5.3 * t)
    s = sum(2 * ((np.cumsum(hz(m) * (1 + dt) * vib) / SR + rng.random()) % 1) - 1 for m in notes for dt in (-0.005, 0.0, 0.006))
    return band(s / (len(notes) * 3), 150, 2600) * np.clip(t / 0.7, 0, 1) * np.clip((d - t) / 0.8, 0, 1)


def epiano(m, d):
    """Piano elétrico: FM suave com decaimento, timbre "Rhodes"."""
    t = tt(d)
    f = hz(m)
    mod = np.sin(2 * np.pi * f * 2 * t) * 1.2 * np.exp(-t * 3)
    s = np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 1.6) + 0.25 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 6)
    return s * np.clip(t / 0.004, 0, 1) * (1 + 0.15 * np.sin(2 * np.pi * 4.5 * t))


def b808(m, d, slide=0):
    t = tt(d)
    f = hz(m) * (1 + 0.6 * np.exp(-t * 35)) * 2 ** (slide / 12 * np.clip((t - d * 0.6) / (d * 0.3), 0, 1))
    return np.tanh(2.2 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-t * 1.1) * np.clip((d - t) / 0.05, 0, 1)


def glass(m, d=1.6):
    t = tt(d)
    return sum(np.sin(2 * np.pi * hz(m) * r * t) * g * np.exp(-t * (3 + 2 * k)) for k, (r, g) in enumerate([(1, 1), (2.0, 0.4), (3.01, 0.15)])) * np.clip(t / 0.003, 0, 1)


prog = [  # (baixo, acorde do piano/cordas)
    (38, [53, 57, 60, 64]),  # Dm9 (F A C E sobre D)
    (34, [50, 53, 57, 62]),  # Bbmaj7 (D F A + D)
    (31, [50, 53, 57, 58]),  # Gm9 (D F A Bb)
    (33, [52, 55, 57, 62]),  # A7sus4 (E G A D)
]
arp = [74, 77, 81, 76, 74, 72, 77, 81]

# Gancho: só cordas e piano, sem batida (deixa o impacto do texto respirar).
for b0 in np.arange(0, DUR, BAR):
    bi = int(round(b0 / BAR))
    bass, chord = prog[bi % 4]
    rest = resting(b0 + 0.01)
    after_hook = b0 >= HOOK_END - 0.01
    e = float(np.interp(b0, [0, HOOK_END, DUR * 0.5, DUR * 0.85, DUR], [0.5, 0.6, 0.8, 1.0, 0.7]))
    add(strings([n + 12 for n in chord] + [bass + 24], BAR + 0.8), b0, 0, 0.17 * (0.5 if rest else 1))
    # Piano: acorde no 1 e "empurrão" no 3e.
    for off, vel in ((0, 1.0), (2.5 * BEAT, 0.6)):
        if resting(b0 + off):
            continue
        for k, m in enumerate(chord):
            add(epiano(m, 2.6), b0 + off + k * 0.012, -0.2 + 0.13 * k, 0.07 * vel)
    if rest or not after_hook or (LOGO and b0 >= LOGO):
        continue
    # 808: tempo 1, "e" do 2 e deslize no fim do compasso.
    add(b808(bass - 12, BEAT * 1.8), b0, 0, 0.36 * e)
    add(b808(bass - 12, BEAT * 1.4, slide=(5 if bi % 2 else -2)), b0 + BEAT * 2.5, 0, 0.3 * e)
    # Palma suave com reverb no tempo 3; bumbo leve junto com o 808.
    d = 0.5
    t = tt(d)
    clap = band(rng.standard_normal(len(t)), 900, 8000) * (np.exp(-t * 14) + 0.5 * np.exp(-np.abs(t - 0.015) * 300))
    add(clap, b0 + 2 * BEAT, 0, 0.13 * e)
    kick = np.sin(2 * np.pi * np.cumsum(48 + 110 * np.exp(-tt(0.3) * 40)) / SR) * np.exp(-tt(0.3) * 12)
    add(kick, b0, 0, 0.3 * e)
    # Chimbal com swing (semicolcheias "arrastadas").
    for k in range(8):
        tk = b0 + k * BEAT / 2 + (BEAT * 0.08 if k % 2 else 0)
        d = 0.04
        add(band(rng.standard_normal(int(d * SR)), 7000, 15000) * np.exp(-tt(d) * 110), tk, 0.3 if k % 2 else -0.3, (0.05 if k % 2 else 0.08) * e)
    # Harpa de vidro em colcheias, só na segunda metade.
    if b0 > DUR * 0.45:
        for k, m in enumerate(arp):
            add(glass(m - (2 if bi % 4 == 2 else 0)), b0 + k * BEAT / 2, 0.45 if k % 2 else -0.45, 0.035 * e)

# Acentos: swell de cordas + sino grave nos dados e na tela dividida.
for h in hits:
    d = 1.4
    t = tt(d)
    add(band(rng.standard_normal(len(t)), 300, 9000) * (t / d) ** 3 * 0.5, h - d, 0, 0.4)
    add(glass(62, 3.0) + glass(69, 3.0) * 0.6, h, 0, 0.12)
    add(np.sin(2 * np.pi * np.cumsum(40 + 60 * np.exp(-tt(2.0) * 4)) / SR) * np.exp(-tt(2.0) * 1.8), h, 0, 0.45)
if TITLE:
    add(strings([62, 65, 69, 74, 77], (LOGO or DUR) - TITLE + 0.5), TITLE, 0, 0.25)
    add(np.sin(2 * np.pi * np.cumsum(36 + 60 * np.exp(-tt(3.0) * 3)) / SR) * np.exp(-tt(3.0) * 1.2), TITLE, 0, 0.6)
if LOGO:
    d = DUR - LOGO
    for k, m in enumerate([50, 54, 57, 62, 66, 69]):  # Ré maior com nona: resolve
        add(epiano(m, d), LOGO + k * 0.05, -0.3 + 0.12 * k, 0.09)
    add(strings([50, 54, 57, 62, 69], d), LOGO, 0, 0.25)
    add(b808(26, 3.5), LOGO, 0, 0.4)

# Reverb amplo e abertura de espaço para a voz (1–4 kHz).
wl, wr = np.zeros(N), np.zeros(N)
for i, (dl, g) in enumerate([(0.047, 0.5), (0.079, 0.45), (0.123, 0.38), (0.191, 0.3), (0.283, 0.22), (0.419, 0.15), (0.601, 0.1)]):
    k = int(dl * SR)
    a, b = (L, R) if i % 2 == 0 else (R, L)
    wl[k:] += a[:-k] * g
    wr[k:] += b[:-k] * g
L += band(wl, 150, 6000) * 0.55
R += band(wr, 150, 6000) * 0.55
L = L - band(L, 1200, 4000) * 0.4
R = R - band(R, 1200, 4000) * 0.4
fade = np.clip((DUR - t_all) / 2.5, 0, 1) * np.clip(t_all / 0.3, 0, 1)
L *= fade
R *= fade
peak = max(np.abs(L).max(), np.abs(R).max())
out = (np.stack([L, R], 1) / peak * 0.89 * 32767).astype(np.int16)
with wave.open(sys.argv[2], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(out.tobytes())
print("ok", sys.argv[2], f"{DUR:.1f}s")
