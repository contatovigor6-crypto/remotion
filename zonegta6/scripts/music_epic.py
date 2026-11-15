"""Trilha épica de trailer, 100% sintetizada, sincronizada com uma linha do tempo.

Uso: python scripts/music_epic.py src/edit/recorde-timeline.json public/music/<saida>.wav

Diferente da trilha de drone: tem PULSO CONTÍNUO (ostinato de cordas em colcheias,
percussão grave), para ficar presente mesmo por baixo da narração. Ré menor, 110 BPM.
A energia cresce ao longo do vídeo; pausa nas cartelas de silêncio ("PENSE NISSO."),
explode na montagem e fecha com acorde maior na logo.
"""
import json
import sys
import wave

import numpy as np

FPS = 30
SR = 48000
BPM = 110
BEAT = 60 / BPM
BAR = 4 * BEAT

src = json.load(open(sys.argv[1]))
tl = src["segments"]
starts, at = [], 0
for s in tl:
    starts.append(at)
    at += s["dur"]
DUR = at / FPS
sec = lambda fr: fr / FPS
find = lambda k: next((sec(st) for st, s in zip(starts, tl) if s["kind"] == k), None)
TITLE, DATE, LOGO = find("title"), find("date"), find("logo")
fast = [(sec(st), sec(s["dur"])) for st, s in zip(starts, tl) if s.get("fast")]
MONT = (fast[0][0], fast[-1][0] + fast[-1][1]) if fast else (DUR, DUR)
hits = [sec(st) for st, s in zip(starts, tl) if s["kind"] in ("stat", "card")]
# Pausas: cartelas curtas de reflexão tiram o pulso (respiro dramático).
rests = [(sec(st), sec(st + s["dur"])) for st, s in zip(starts, tl) if s["kind"] == "card" and s.get("lines") == ["PENSE NISSO."]]
question = next((sec(st) for st, s in zip(starts, tl) if s.get("theme") == "pergunta"), MONT[0] - 1.5)

N = int(SR * DUR)
rng = np.random.default_rng(110)
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


def saws(notes, d, det=(-0.006, 0.0, 0.007)):
    t = tt(d)
    return sum(2 * ((t * hz(m) * (1 + dt) + rng.random()) % 1) - 1 for m in notes for dt in det) / (len(notes) * len(det))


def resting(t):
    return any(a <= t < b for a, b in rests) or (MONT[1] <= t < (TITLE or DUR))


# Energia de 0 a 1 ao longo do vídeo (cresce até a montagem).
def energy(t):
    return float(np.interp(t, [0, 6, 25, MONT[0], MONT[1], DUR], [0.45, 0.55, 0.7, 0.85, 1.0, 0.6]))


prog = [(38, 41, 45), (34, 38, 41), (36, 40, 43), (33, 37, 40)]  # Dm – Bb – C – A
bar_starts = np.arange(0, DUR, BAR)
for bi, b0 in enumerate(bar_starts):
    chord = prog[bi % 4]
    e = energy(b0)
    rest = resting(b0 + 0.01)
    # Pad de cordas (sempre, mais baixo na pausa).
    d = BAR + 0.6
    t = tt(d)
    pad = band(saws([n + 12 for n in chord] + [chord[0] + 24], d), 120, 1800) * np.clip(t / 0.4, 0, 1) * np.clip((d - t) / 0.6, 0, 1)
    add(pad, b0, -0.3, 0.16 * (0.5 if rest else 1))
    add(pad, b0 + 0.01, 0.3, 0.16 * (0.5 if rest else 1))
    if rest or b0 >= (LOGO or DUR):
        continue
    # Contrabaixo em semínimas.
    for k in range(4):
        d = BEAT * 0.95
        t = tt(d)
        add(band(saws([chord[0] - 12, chord[0]], d), 30, 400) * np.exp(-t * 3), b0 + k * BEAT, 0, 0.32 * e)
    # Ostinato de cordas em colcheias (o "motor" do trailer).
    pat = [0, 12, 7, 12, 0, 12, 5, 12]
    for k in range(8):
        tk = b0 + k * BEAT / 2
        if resting(tk):
            continue
        d = BEAT / 2 * 0.9
        t = tt(d)
        note = chord[0] + 24 + pat[k]
        s = band(saws([note], d, (-0.004, 0.004)), 200, 3500) * np.exp(-t * 7) * np.clip(t / 0.005, 0, 1)
        add(s, tk, 0.35 if k % 2 else -0.35, 0.11 * (0.7 + 0.5 * e))
    # Percussão: taiko no 1 e 3; caixa no 2 e 4 a partir do meio; rolos antes dos acentos.
    for k in range(4):
        tk = b0 + k * BEAT
        if k in (0, 2):
            d = 0.8
            t = tt(d)
            taiko = np.sin(2 * np.pi * np.cumsum(55 + 80 * np.exp(-t * 25)) / SR) * np.exp(-t * 5) + 0.25 * band(rng.standard_normal(len(t)), 80, 1500) * np.exp(-t * 22)
            add(taiko, tk, 0, 0.45 * e)
        if k in (1, 3) and e > 0.62:
            d = 0.35
            t = tt(d)
            sn = band(rng.standard_normal(len(t)), 400, 7000) * np.exp(-t * 16) + 0.4 * np.sin(2 * np.pi * 180 * t) * np.exp(-t * 20)
            add(sn, tk, 0, 0.18 * e)
    # Metais graves a cada 2 compassos depois do primeiro terço.
    if bi % 2 == 0 and b0 > DUR * 0.3:
        d = BAR * 2
        t = tt(d)
        br = np.tanh(band(saws([chord[0], chord[0] + 7, chord[0] + 12], d), 60, 1500) * 3) * np.clip(t / 0.6, 0, 1) * np.exp(-t * 0.6)
        add(br, b0, 0, 0.14 * e)

# Montagem: dobra a percussão em colcheias.
t0 = MONT[0]
while t0 < MONT[1]:
    d = 0.5
    t = tt(d)
    add(np.sin(2 * np.pi * np.cumsum(60 + 90 * np.exp(-t * 30)) / SR) * np.exp(-t * 8), t0, 0, 0.3)
    t0 += BEAT / 2


def impact(t0, g=1.0, d=3.0):
    t = tt(d)
    s = np.tanh(band(saws([26, 33, 38], d), 40, 900) * 5) * np.exp(-t * 1.2)
    s += 0.9 * np.sin(2 * np.pi * np.cumsum(30 + 50 * np.exp(-t * 2)) / SR) * np.exp(-t * 1.5)
    add(s, t0, 0, g)


for h in hits:
    impact(h, 0.55, 2.4)
# Riser da pergunta até a montagem.
d = max(0.5, MONT[0] - question)
t = tt(d)
add(band(rng.standard_normal(len(t)), 500, 12000) * (t / d) ** 2.5 * 0.6 + np.sin(2 * np.pi * np.cumsum(hz(50) * 2 ** (t / d * 2)) / SR) * (t / d) ** 2 * 0.4, question, 0, 0.5)
if DATE:
    impact(DATE, 0.7)
if TITLE:
    impact(TITLE, 1.0, 4.0)
    d = (LOGO or DUR) - TITLE + 0.5
    t = tt(d)
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5 * t)
    choir = sum(np.sin(2 * np.pi * np.cumsum(hz(m) * vib) / SR) * g for m, g in ((62, 1), (65, 0.8), (69, 0.8), (74, 0.5)))
    add(choir / 4 * np.clip(t / 0.8, 0, 1) * np.clip((d - t) / 0.5, 0, 1), TITLE, 0, 0.16)
if LOGO:
    d = DUR - LOGO
    t = tt(d)
    fin = band(saws([38, 50, 54, 57, 62], d), 60, 2200) * np.clip(t / 0.05, 0, 1) * np.clip((d - t) / 2.0, 0, 1)
    add(fin, LOGO, 0, 0.45)
    impact(LOGO, 0.8)

# Reverb de sala.
wl, wr = np.zeros(N), np.zeros(N)
for i, (dl, g) in enumerate([(0.039, 0.5), (0.063, 0.45), (0.101, 0.38), (0.157, 0.3), (0.233, 0.22), (0.347, 0.15)]):
    k = int(dl * SR)
    a, b = (L, R) if i % 2 == 0 else (R, L)
    wl[k:] += a[:-k] * g
    wr[k:] += b[:-k] * g
L += band(wl, 150, 5000) * 0.45
R += band(wr, 150, 5000) * 0.45
# Abre espaço para a voz: corte suave em 1–4 kHz.
L = L - band(L, 1200, 4000) * 0.45
R = R - band(R, 1200, 4000) * 0.45

fade = np.clip((DUR - t_all) / 2.0, 0, 1) * np.clip(t_all / 0.2, 0, 1)
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
