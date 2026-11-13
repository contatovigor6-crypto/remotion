"""Trilha de suspense original do ZoneGTA6, 100% sintetizada (sem samples de terceiros).

Uso: python scripts/music_suspense.py public/music/trilha-suspense.wav

Linguagem: drone grave dissonante, tique-taque de relógio, pulso de batimento cardíaco,
ostinato grave em semicolcheias, riser antes da revelação e "braam" nos pontos-chave.
Os tempos abaixo são do vídeo final (narração do Marcio).
"""
import sys
import wave

import numpy as np

SR = 48000
DUR = 67.0
BPM = 84
BEAT = 60 / BPM

T_DROP = 11.83  # "São TRINTA quadros por segundo"
T_JOKE = 19.62  # "Quem jurava 60..." — a música para por um instante (respiro cômico)
T_RUMOR = (31.4, 38.7)  # investigação: só clima estranho, sem pulso
T_RECORD = 51.0  # "o mais pré-vendido da história"
T_LOGO = 61.5  # logo: acorde final sem resolver

rng = np.random.default_rng(66)
N = int(SR * DUR)
L = np.zeros(N)
R = np.zeros(N)
t_all = np.arange(N) / SR


def hz(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def lowpass(x, cutoff):
    # cutoff pode ser fixo ou uma curva (array) para filtros que abrem com o tempo.
    a = np.broadcast_to(np.exp(-2 * np.pi * np.asarray(cutoff, dtype=float) / SR), x.shape)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a[i]) * x[i] + a[i] * acc
        y[i] = acc
    return y


def add(sig, start, pan=0.0, gain=1.0):
    i = int(start * SR)
    if i >= N or i + len(sig) <= 0:
        return
    if i < 0:
        sig, i = sig[-i:], 0
    sig = sig[: N - i] * gain
    L[i : i + len(sig)] += sig * (1 - max(pan, 0))
    R[i : i + len(sig)] += sig * (1 + min(pan, 0))


def in_rumor(t):
    return T_RUMOR[0] <= t < T_RUMOR[1]


def saw(f, n, detune=0.0, phase=0.0):
    tt = np.arange(n) / SR
    return 2 * ((tt * f * (1 + detune) + phase) % 1) - 1


# 1) Drone: Ré grave + Mi bemol (segunda menor) — a dissonância que dá o desconforto.
#    Respira lentamente (LFO) e abre o filtro conforme a tensão cresce.
drone = np.zeros(N)
for n_, g in ((26, 1.0), (38, 0.6), (39, 0.35), (45, 0.25)):
    for dt in (-0.004, 0.0, 0.005):
        drone += saw(hz(n_), N, dt, rng.random()) * g
drone = lowpass(drone / 6, 420)
breath = 0.75 + 0.25 * np.sin(2 * np.pi * 0.11 * t_all)
swell = np.interp(t_all, [0, T_DROP - 0.3, T_DROP, T_LOGO, DUR], [0.5, 1.0, 0.85, 1.0, 0.0])
drone *= breath * swell
add(drone, 0, -0.15, 0.55)
add(np.roll(drone, 900), 0, 0.15, 0.55)

# 2) Tom agudo fantasma (trêmulo) que entra na introdução e domina a investigação.
ghost = np.sin(2 * np.pi * hz(86) * t_all) + 0.5 * np.sin(2 * np.pi * hz(87) * t_all)
ghost *= 0.5 + 0.5 * np.sin(2 * np.pi * 6.5 * t_all)
ghost_env = np.interp(
    t_all,
    [0, 3, T_DROP, T_DROP + 1, T_RUMOR[0], T_RUMOR[0] + 0.5, T_RUMOR[1], T_RUMOR[1] + 1, DUR],
    [0, 0.6, 0.6, 0.15, 0.15, 1.0, 1.0, 0.1, 0.1],
)
add(ghost * ghost_env, 0, 0.3, 0.035)

# 3) Tique-taque de relógio em colcheias durante a introdução e na investigação.
tick_n = int(0.03 * SR)
tick = rng.standard_normal(tick_n)
tick = (tick - lowpass(tick, 3500)) * np.exp(-np.arange(tick_n) / SR * 160)
t = 0.4
k = 0
while t < DUR:
    if t < T_DROP - 0.1 or in_rumor(t):
        add(tick, t, 0.5 if k % 2 else -0.5, 0.22 if k % 2 == 0 else 0.13)
    t += BEAT / 2
    k += 1

# 4) Batimento cardíaco (tum-tum) — acelera no riser antes da revelação.
def heart(at, g):
    n = int(0.3 * SR)
    tt = np.arange(n) / SR
    f = 40 + 45 * np.exp(-tt * 25)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 12)
    add(s, at, 0, g)
    add(s * 0.7, at + 0.22, 0, g)

t = 1.2
while t < T_DROP - 0.2:
    progress = t / T_DROP
    heart(t, 0.35 + 0.35 * progress)
    t += 1.15 - 0.55 * progress  # o coração acelera
for t in np.arange(T_RUMOR[0] + 0.5, T_RUMOR[1] - 0.3, 1.2):
    heart(t, 0.3)

# 5) Riser: ruído filtrado + tom subindo, nos 4 s antes do "trinta".
n = int(4.0 * SR)
tt = np.arange(n) / SR
rz = rng.standard_normal(n)
rz = rz - lowpass(rz, 300 + 2500 * (tt / 4))
tone = np.sin(2 * np.pi * np.cumsum(hz(50) * 2 ** (tt / 4 * 2)) / SR)
rise = (0.6 * rz + 0.5 * tone) * (tt / 4) ** 2
add(rise, T_DROP - 4.0, 0, 0.35)

# 6) Braam: impacto grave e largo (serras graves + sub + ruído) nos pontos de revelação.
def braam(at, g, length=3.2):
    n = int(length * SR)
    tt = np.arange(n) / SR
    s = np.zeros(n)
    for n_ in (26, 38, 45):
        for dt in (-0.01, 0.0, 0.012):
            s += saw(hz(n_), n, dt)
    s = lowpass(s / 9, 700) * np.exp(-tt * 1.1)
    sub = np.sin(2 * np.pi * np.cumsum(55 * np.exp(-tt * 1.5) + 30) / SR) * np.exp(-tt * 2)
    hit = rng.standard_normal(n) * np.exp(-tt * 30)
    add(s + 0.9 * sub + 0.3 * lowpass(hit, 2000), at, 0, g)

braam(T_DROP, 1.0)
braam(T_RECORD, 0.8)
braam(T_RUMOR[1], 0.55, 2.2)

# 7) Ostinato grave em semicolcheias (estilo cordas em staccato) depois da revelação.
pattern = [26, 26, 38, 26, 26, 37, 26, 33]
step = BEAT / 4
t = T_DROP
k = 0
while t < T_LOGO:
    if not in_rumor(t) and not (T_JOKE <= t < T_JOKE + 0.9):
        n = int(step * SR)
        note_ = pattern[k % len(pattern)]
        s = saw(hz(note_ + 12), n) + 0.5 * saw(hz(note_ + 24), n, 0.003)
        s = lowpass(s, 900) * np.exp(-np.arange(n) / SR * 22)
        accent = 1.0 if k % 4 == 0 else 0.6
        add(s, t, 0.25 if k % 2 else -0.25, 0.17 * accent)
    t += step
    k += 1

# 8) Percussão grave (tambor de guerra) nos tempos 1 e 3 depois da revelação.
t = T_DROP
k = 0
while t < T_LOGO:
    if not in_rumor(t) and not (T_JOKE <= t < T_JOKE + 0.9) and k % 2 == 0:
        n = int(0.5 * SR)
        tt = np.arange(n) / SR
        f = 50 + 70 * np.exp(-tt * 18)
        s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 6)
        s += 0.15 * rng.standard_normal(n) * np.exp(-tt * 40)
        add(s, t, 0, 0.55)
    t += BEAT
    k += 1

# 9) Final sem resolução: acorde grave de Ré com a segunda menor, sumindo.
n = int((DUR - T_LOGO) * SR)
tt = np.arange(n) / SR
fin = np.zeros(n)
for n_ in (38, 39, 45, 50):
    for dt in (-0.005, 0.006):
        fin += saw(hz(n_), n, dt)
fin = lowpass(fin / 8, 600) * np.clip(tt / 0.8, 0, 1) * np.clip((n / SR - tt) / 3.5, 0, 1)
add(fin, T_LOGO, 0, 0.5)

fade = np.clip((DUR - t_all) / 2.5, 0, 1) * np.clip(t_all / 0.8, 0, 1)
L *= fade
R *= fade
peak = max(np.abs(L).max(), np.abs(R).max())
out = (np.stack([L, R], 1) / peak * 0.89 * 32767).astype(np.int16)
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(out.tobytes())
print("ok", sys.argv[1])
