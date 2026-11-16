"""Trilha original "hybrid motion" (orquestral + eletrônica), 100% sintetizada.

Uso: python scripts/music_motion.py src/edit/depois-timeline.json public/music/<saida>.wav

100 BPM, Ré menor. Baixo de sintetizador pulsando em semicolcheias com "sidechain"
(respira a cada tempo), arpejo de pluck, cordas em staccato, bateria cinematográfica
(bumbo, caixa larga, tons) e risers nos dados. Para no gancho para o impacto do texto,
cresce até o fim e fecha com acorde maior na logo. Melodia e harmonia próprias.
"""
import json
import sys
import wave

import numpy as np

FPS = 30
SR = 48000
BPM = 100
BEAT = 60 / BPM
BAR = 4 * BEAT
STEP = BEAT / 4

tl = json.load(open(sys.argv[1]))["segments"]
starts, at = [], 0
for s in tl:
    starts.append(at)
    at += s["dur"]
DUR = at / FPS
sec = lambda fr: fr / FPS
find = lambda k: next((sec(st) for st, s in zip(starts, tl) if s["kind"] == k), None)
TITLE, LOGO = find("title"), find("logo")
HOOK2 = (sec(starts[1]), sec(starts[2])) if len(starts) > 2 else (0, 0)
hits = [sec(st) for st, s in zip(starts, tl) if s["kind"] in ("stat", "quote", "question", "triptych")]

N = int(SR * DUR)
rng = np.random.default_rng(100)
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


def saw(m, d, det=0.0):
    t = tt(d)
    return 2 * ((t * hz(m) * (1 + det) + rng.random()) % 1) - 1


def resting(t):
    return HOOK2[0] <= t < HOOK2[1] or t < 0.05


prog = [(38, [62, 65, 69]), (34, [62, 65, 70]), (36, [60, 64, 67]), (33, [61, 64, 69])]  # Dm – Bb – C – A
arp_pat = [0, 1, 2, 1, 0, 2, 1, 2]
for b0 in np.arange(0, DUR, BAR):
    bi = int(round(b0 / BAR))
    bass, chord = prog[bi % 4]
    e = float(np.interp(b0, [0, HOOK2[1], DUR * 0.5, DUR * 0.88, DUR], [0.6, 0.65, 0.8, 1.0, 0.7]))
    if LOGO and b0 >= LOGO:
        break
    # Pad (sempre, mais baixo na pausa).
    d = BAR + 0.6
    t = tt(d)
    pad = band(sum(saw(m - 12, d, dt) for m in chord for dt in (-0.006, 0.006)) / 6, 150, 1800) * np.clip(t / 0.5, 0, 1) * np.clip((d - t) / 0.6, 0, 1)
    add(pad, b0, 0, 0.12 * (0.5 if resting(b0 + 0.01) else 1))
    for k in range(16):
        tk = b0 + k * STEP
        if resting(tk):
            continue
        duck = 0.35 + 0.65 * ((k % 4) / 3)  # "sidechain": abaixa no tempo e sobe até o próximo
        # Baixo pulsante.
        d = STEP * 0.9
        t = tt(d)
        b = band(saw(bass - 12, d) + 0.6 * saw(bass, d, 0.01), 30, 700) * np.exp(-t * 10)
        add(b, tk, 0, 0.22 * e * duck)
        # Arpejo de pluck (oitava acima, alternando lados).
        if b0 > HOOK2[1]:
            m = chord[arp_pat[k % 8]] + (12 if k % 8 >= 6 else 0)
            p = band(saw(m, 0.18, 0.003), 400, 6000) * np.exp(-tt(0.18) * 18)
            add(p, tk, 0.4 if k % 2 else -0.4, 0.045 * e)
    if resting(b0 + 0.01):
        continue
    # Cordas em staccato nos tempos.
    for k in range(4):
        d = BEAT * 0.4
        t = tt(d)
        st = band(sum(saw(m, d, dt) for m in chord for dt in (-0.004, 0.004)) / 6, 250, 3500) * np.exp(-t * 9)
        add(st, b0 + k * BEAT, 0, 0.09 * e)
    # Bateria: bumbo no 1 e 3, caixa larga no 2 e 4, tons no fim de cada 4 compassos.
    for k in range(4):
        tk = b0 + k * BEAT
        if k in (0, 2):
            t = tt(0.4)
            add(np.sin(2 * np.pi * np.cumsum(48 + 120 * np.exp(-t * 35)) / SR) * np.exp(-t * 9), tk, 0, 0.42 * e)
        else:
            t = tt(0.45)
            sn = band(rng.standard_normal(len(t)), 300, 8000) * np.exp(-t * 11) + 0.4 * np.sin(2 * np.pi * 185 * t) * np.exp(-t * 18)
            add(sn, tk, 0, 0.17 * e)
    if bi % 4 == 3:
        for j in range(4):
            t = tt(0.4)
            add(np.sin(2 * np.pi * np.cumsum((110 - 15 * j) + 60 * np.exp(-t * 20)) / SR) * np.exp(-t * 8), b0 + 3 * BEAT + j * STEP, 0, 0.25 * e)


def impact(t0, g=1.0, d=3.0):
    t = tt(d)
    s = np.tanh(band(sum(saw(m, d, dt) for m in (26, 33, 38) for dt in (-0.01, 0.01)) / 6, 40, 900) * 5) * np.exp(-t * 1.3)
    s += 0.9 * np.sin(2 * np.pi * np.cumsum(30 + 55 * np.exp(-t * 2)) / SR) * np.exp(-t * 1.6)
    add(s, t0, 0, g)


for h in hits:
    d = 1.6
    t = tt(d)
    add(band(rng.standard_normal(len(t)), 500, 12000) * (t / d) ** 3 * 0.6, h - d, 0, 0.35)
    impact(h, 0.5, 2.2)
if TITLE:
    impact(TITLE, 0.9, 4.0)
if LOGO:
    d = DUR - LOGO
    t = tt(d)
    fin = band(sum(saw(m, d, dt) for m in (38, 50, 54, 57, 62, 66) for dt in (-0.005, 0.005)) / 12, 60, 2500) * np.clip(t / 0.05, 0, 1) * np.clip((d - t) / 2.5, 0, 1)
    add(fin, LOGO, 0, 0.5)
    impact(LOGO, 0.7)

wl, wr = np.zeros(N), np.zeros(N)
for i, (dl, g) in enumerate([(0.041, 0.45), (0.067, 0.4), (0.107, 0.33), (0.163, 0.26), (0.241, 0.18)]):
    k = int(dl * SR)
    a, b = (L, R) if i % 2 == 0 else (R, L)
    wl[k:] += a[:-k] * g
    wr[k:] += b[:-k] * g
L += band(wl, 150, 6000) * 0.4
R += band(wr, 150, 6000) * 0.4
L = L - band(L, 1200, 4000) * 0.4
R = R - band(R, 1200, 4000) * 0.4
fade = np.clip((DUR - t_all) / 2.5, 0, 1) * np.clip(t_all / 0.1, 0, 1)
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
