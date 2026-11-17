#!/usr/bin/env python3
"""PACOTE DE SFX NOVO POR VÍDEO (pedido do dono do canal: "sempre inovar nos efeitos sonoros").

Uso: python3 scripts/sfx_pack.py <slug>   ->  public/audio/serie-<slug>-{hit,pop,ding,rise,drop,snap,stutter,bell,click}.wav

Cada vídeo ganha sons sintetizados na hora (sem samples de terceiros), com receita sorteada por categoria e
parâmetros aleatórios (semente = slug): impacto pode ser boom grave, porta de metal, trovão curto ou "punch" de trailer;
pop pode ser bolha, gota, blip 8-bit ou estalo de dedo; e assim por diante. Nunca há som de transição tipo "schuuu".
"""
import os, sys, wave, zlib
import numpy as np

SR = 48000
slug = sys.argv[1]
OUT = 'public/audio'
rng = np.random.default_rng(zlib.crc32(slug.encode()))


def t_(d):
    return np.arange(int(SR * d)) / SR


def env(d, a=0.003, r=None):
    t = t_(d)
    r = r or d
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / (r / 5))


def noise(d):
    return rng.standard_normal(int(SR * d))


def lp(x, k):
    # passa-baixa simples (média móvel exponencial)
    y = np.empty_like(x)
    a = np.exp(-2 * np.pi * k / SR)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def sweep(f0, f1, d, shape=3.0):
    t = t_(d)
    f = f1 + (f0 - f1) * np.exp(-t * shape / d * 3)
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def save(name, x, gain=0.9):
    x = x / (np.max(np.abs(x)) + 1e-9) * gain
    st = np.stack([x, x], 1)
    with wave.open(f'{OUT}/serie-{slug}-{name}.wav', 'wb') as w:
        w.setnchannels(2), w.setsampwidth(2), w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())


def pick(*recipes):
    return recipes[rng.integers(len(recipes))]()


R = lambda a, b: float(rng.uniform(a, b))

# ---------------------------------------------------------------- impacto
def hit_boom():
    d = R(1.0, 1.5)
    return sweep(R(90, 140), R(32, 45), d) * env(d, 0.002, d) * 1.0 + lp(noise(d), R(900, 2500)) * env(d, 0.001, 0.25) * 0.8
def hit_metal():
    d = R(1.0, 1.4)
    t = t_(d)
    parts = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * R(2, 5)) for f in rng.uniform(180, 1400, 5))
    return parts * 0.4 + sweep(R(80, 110), 40, d) * env(d, 0.002, 0.8) + noise(d) * env(d, 0.001, 0.08) * 0.6
def hit_thunder():
    d = R(1.2, 1.6)
    return lp(noise(d), R(200, 500)) * env(d, 0.01, d) * 1.4 + sweep(70, 35, d) * env(d, 0.005, d) * 0.8
def hit_punch():
    d = R(0.7, 1.0)
    return sweep(R(160, 220), R(45, 60), d, 6) * env(d, 0.001, 0.6) + lp(noise(d), 4000) * env(d, 0.0005, 0.03) * 0.9

# ---------------------------------------------------------------- pop
def pop_bubble():
    d = 0.16
    return sweep(R(300, 500), R(900, 1500), d, -2) * env(d, 0.002, 0.12)
def pop_drop():
    d = 0.22
    return sweep(R(1400, 2000), R(500, 700), d, 4) * env(d, 0.001, 0.18)
def pop_8bit():
    d = 0.12
    t = t_(d)
    f = R(600, 1200)
    sq = np.sign(np.sin(2 * np.pi * f * t)) * (t < d / 2) + np.sign(np.sin(2 * np.pi * f * 1.5 * t)) * (t >= d / 2)
    return sq * env(d, 0.001, d) * 0.6
def pop_snap():
    d = 0.1
    return (lp(noise(d), R(3000, 6000)) * env(d, 0.0005, 0.02) + np.sin(2 * np.pi * R(1800, 2600) * t_(d)) * env(d, 0.001, 0.04) * 0.5)

# ---------------------------------------------------------------- ding (destaque / recorde)
def ding_bell():
    d = R(1.0, 1.6)
    t = t_(d)
    f = R(700, 1100)
    return sum(a * np.sin(2 * np.pi * f * m * t) * np.exp(-t * k) for a, m, k in [(1, 1, 2.5), (0.5, 2.76, 4), (0.3, 5.4, 6), (0.2, 8.9, 9)])
def ding_cash():
    d = 0.9
    t = t_(d)
    return sum(np.sin(2 * np.pi * f * t) * np.exp(-t * 4) for f in (R(1500, 1900), R(2300, 2700))) + lp(noise(d), 6000) * env(d, 0.001, 0.05) * 0.5
def ding_chime():
    d = 1.2
    t = t_(d)
    base = R(500, 800)
    out = np.zeros_like(t)
    for i, m in enumerate((1, 1.25, 1.5, 2)):
        s = int(i * 0.07 * SR)
        out[s:] += np.sin(2 * np.pi * base * m * t[: len(t) - s]) * np.exp(-t[: len(t) - s] * 3)
    return out

# ---------------------------------------------------------------- riser (antes de revelação)
def rise_noise():
    d = R(1.0, 1.6)
    t = t_(d)
    return lp(noise(d), 3000) * (t / d) ** 2.5 + np.sin(2 * np.pi * np.cumsum(200 + 1200 * (t / d) ** 2) / SR) * (t / d) ** 3 * 0.4
def rise_tone():
    d = R(1.0, 1.4)
    t = t_(d)
    return sum(np.sin(2 * np.pi * np.cumsum(f * (1 + 2.5 * (t / d) ** 2)) / SR) for f in (R(180, 260), R(270, 390))) * (t / d) ** 2

# ---------------------------------------------------------------- drop grave (abertura do encerramento)
def drop_sub():
    d = R(1.4, 2.0)
    return sweep(R(120, 160), R(28, 36), d, 2) * env(d, 0.003, d)
def drop_808():
    d = 1.6
    return np.tanh(sweep(R(90, 120), R(38, 48), d, 4) * 3) * env(d, 0.002, d)

# ---------------------------------------------------------------- snap/stutter/bell/click
def snap_shutter():
    d = 0.18
    n = noise(d)
    return lp(n, 5000) * (env(d, 0.0005, 0.03) + np.roll(env(d, 0.0005, 0.03), int(0.07 * SR)) * 0.8)
def stutter_digital():
    d = 0.35
    t = t_(d)
    gate = (np.floor(t * R(28, 45)) % 2 == 0)
    return np.sign(np.sin(2 * np.pi * R(200, 600) * t)) * gate * env(d, 0.001, d) * 0.5
def bell_notify():
    d = 0.8
    t = t_(d)
    a, b = R(900, 1300), R(1300, 1800)
    return np.sin(2 * np.pi * a * t) * np.exp(-t * 6) * (t < 0.12) + np.sin(2 * np.pi * b * t) * np.exp(-(t - 0.12).clip(0) * 5) * (t >= 0.12)
def click_mouse():
    d = 0.06
    return lp(noise(d), 7000) * env(d, 0.0003, 0.01) + np.sin(2 * np.pi * R(2500, 3500) * t_(d)) * env(d, 0.0005, 0.015) * 0.6


os.makedirs(OUT, exist_ok=True)
save('hit', pick(hit_boom, hit_metal, hit_thunder, hit_punch))
save('pop', pick(pop_bubble, pop_drop, pop_8bit, pop_snap), 0.7)
save('ding', pick(ding_bell, ding_cash, ding_chime), 0.7)
save('rise', pick(rise_noise, rise_tone), 0.6)
save('drop', pick(drop_sub, drop_808))
save('snap', snap_shutter(), 0.7)
save('stutter', stutter_digital(), 0.5)
save('bell', bell_notify(), 0.6)
save('click', click_mouse(), 0.7)
print(f'pacote de SFX novo: public/audio/serie-{slug}-*.wav')
