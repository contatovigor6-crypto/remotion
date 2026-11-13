"""Trilhas originais do ZoneGTA6, 100% sintetizadas (sem samples nem música de terceiros).

Uso:
  python scripts/music_variants.py drama public/music/trilha-suspense-dramatico.wav
  python scripts/music_variants.py acao  public/music/trilha-acao-suspense.wav

drama: "orquestral" lento — cordas, piano com motivo, coro, tímpanos e grandes ápices.
acao:  128 BPM — ostinato em staccato, baixo distorcido, bateria híbrida, metais e braams.

Os tempos são os do vídeo final (narração do Marcio).
"""
import sys
import wave

import numpy as np

MODE, OUT = sys.argv[1], sys.argv[2]
SR = 48000
DUR = 67.0
T_DROP = 11.83  # "São TRINTA quadros por segundo"
T_JOKE = (19.62, 20.5)  # "Quem jurava 60..." — respiro cômico, a música para
T_RUMOR = (31.4, 38.7)  # investigação: só clima
T_RECORD = 51.0  # "o mais pré-vendido da história"
T_LOGO = 61.5

rng = np.random.default_rng(6 if MODE == "drama" else 128)
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


def highpass(x, cutoff):
    return x - lowpass(x, cutoff)


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


def quiet(t):
    return T_RUMOR[0] <= t < T_RUMOR[1] or T_JOKE[0] <= t < T_JOKE[1]


def adsr(n, a, r):
    tt = np.arange(n) / SR
    return np.clip(tt / a, 0, 1) * np.clip((n / SR - tt) / r, 0, 1)


def ensemble(notes, n, cutoff, voices=(-0.006, 0.0, 0.007)):
    s = np.zeros(n)
    for m in notes:
        for dt in voices:
            s += saw(hz(m), n, dt, rng.random())
    return lowpass(s / (len(notes) * len(voices)), cutoff)


def boom(at, g, f0=48, decay=4.0, length=1.6):
    """Tímpano / tambor grave."""
    n = int(length * SR)
    tt = np.arange(n) / SR
    f = f0 + f0 * 1.2 * np.exp(-tt * 20)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * decay)
    s += 0.25 * lowpass(rng.standard_normal(n), 1500) * np.exp(-tt * 25)
    add(s, at, 0, g)


def braam(at, g, root=26, length=3.5):
    n = int(length * SR)
    tt = np.arange(n) / SR
    s = ensemble([root, root + 12, root + 19], n, 800, (-0.012, 0.0, 0.013))
    s = np.tanh(s * 2.5) * np.exp(-tt * 1.0)
    sub = np.sin(2 * np.pi * np.cumsum(30 + 50 * np.exp(-tt * 1.5)) / SR) * np.exp(-tt * 1.8)
    add(s + 0.8 * sub, at, 0, g)


def riser(end, length, g):
    n = int(length * SR)
    tt = np.arange(n) / SR
    z = highpass(rng.standard_normal(n), 300 + 3000 * (tt / length))
    tone = np.sin(2 * np.pi * np.cumsum(hz(48) * 2 ** (tt / length * 2)) / SR)
    add((0.6 * z + 0.4 * tone) * (tt / length) ** 2.2, end - length, 0, g)


def reverb():
    """Reverb simples: ecos difusos decrescentes, para dar espaço de "sala de concerto"."""
    global L, R
    wetL, wetR = np.zeros(N), np.zeros(N)
    for i, (d, g) in enumerate([(0.031, 0.5), (0.047, 0.45), (0.071, 0.4), (0.113, 0.33), (0.167, 0.27), (0.241, 0.2), (0.353, 0.14)]):
        k = int(d * SR)
        src_l, src_r = (L, R) if i % 2 == 0 else (R, L)
        wetL[k:] += src_l[:-k] * g
        wetR[k:] += src_r[:-k] * g
    L = L + lowpass(wetL, 4000) * 0.45
    R = R + lowpass(wetR, 4000) * 0.45


if MODE == "drama":
    # Ré menor, 70 BPM. Antes do drop: Dm – Bb (calmo). Depois: Dm – Bb – Gm – A (dramático).
    BEAT = 60 / 70
    BAR = BEAT * 4
    phase = T_DROP % BAR
    pre = [(50, 53, 57), (46, 50, 53)]
    post = [(50, 53, 57), (46, 50, 53), (43, 46, 50), (45, 49, 52)]
    bass = [38, 34, 31, 33]

    bars = np.arange(phase - BAR * 4, DUR, BAR)
    for bi, bs in enumerate(bars):
        if bs + BAR < 0:
            continue
        after = bs >= T_DROP - 0.01
        chord = post[bi % 4] if after else pre[bi % 2]
        root = bass[bi % 4] if after else (38 if bi % 2 == 0 else 34)
        n = int((BAR + 0.8) * SR)
        if bs >= T_LOGO:
            break
        rumor = T_RUMOR[0] <= bs < T_RUMOR[1] - 0.5
        # Cordas: abrem o filtro conforme a tensão sobe.
        cut = 700 if not after else 1400
        if not after:
            cut = 450 + 600 * np.clip((bs - (T_DROP - 3 * BAR)) / (3 * BAR), 0, 1)
        strings = ensemble(chord, n, cut) * adsr(n, 0.6, 0.8)
        add(strings, bs, -0.35, 0.34 if not rumor else 0.12)
        add(np.roll(strings, 500), bs, 0.35, 0.34 if not rumor else 0.12)
        # Contrabaixo.
        if not rumor:
            cb = ensemble([root - 12, root], n, 300) * adsr(n, 0.3, 0.8)
            add(cb, bs, 0, 0.45 if after else 0.3)
        # Coro ("aah"): senos com vibrato, só depois do drop.
        if after and not rumor:
            tt = np.arange(n) / SR
            vib = 1 + 0.004 * np.sin(2 * np.pi * 5.2 * tt)
            choir = np.zeros(n)
            for m in chord:
                for h, hg in ((1, 1.0), (2, 0.35), (3, 0.15)):
                    choir += np.sin(2 * np.pi * np.cumsum(hz(m + 12) * h * vib) / SR) * hg
            add(choir / 6 * adsr(n, 0.9, 0.9), bs, 0, 0.12)
        # Tímpano no tempo forte depois do drop.
        if after and not quiet(bs):
            boom(bs, 0.55)
            boom(bs + BEAT * 2.5, 0.3)

    # Piano: motivo de 4 notas que volta como uma pergunta sem resposta.
    motif = [74, 77, 76, 69]
    t = phase - BAR * 4
    k = 0
    while t < T_LOGO:
        if t >= 0.5 and not (T_JOKE[0] <= t < T_JOKE[1]):
            m = motif[k % 4] + (12 if t >= T_DROP and k % 8 >= 4 else 0)
            n = int(1.6 * SR)
            tt = np.arange(n) / SR
            p = sum(np.sin(2 * np.pi * hz(m) * h * tt) * g * np.exp(-tt * (2.5 + h)) for h, g in ((1, 1), (2, 0.4), (3, 0.2), (4, 0.08)))
            p *= np.clip(tt / 0.004, 0, 1)
            add(p, t, 0.2, 0.16 if t < T_DROP else 0.12)
        t += BEAT * (1 if t < T_DROP or quiet(t) else 0.5)
        k += 1

    # Rolo de tímpano crescendo e riser de cordas até o "trinta".
    t = T_DROP - 3.0
    while t < T_DROP - 0.05:
        p = (t - (T_DROP - 3.0)) / 3.0
        boom(t, 0.1 + 0.35 * p, decay=10, length=0.4)
        t += 0.16 - 0.1 * p
    riser(T_DROP, 3.5, 0.25)

    # Grandes ápices.
    for at, g in ((T_DROP, 1.0), (T_RECORD, 0.85), (T_RUMOR[1], 0.5)):
        boom(at, 1.0 * g, f0=40, decay=1.8, length=3.0)
        braam(at, 0.55 * g)

    # Final em Lá maior (dominante): termina "suspenso", pedindo continuação.
    n = int((DUR - T_LOGO) * SR)
    fin = ensemble([45, 49, 52, 57], n, 900) * adsr(n, 1.2, 3.5)
    add(fin, T_LOGO, 0, 0.5)
    boom(T_LOGO, 0.7, f0=40, decay=1.2, length=4.0)

else:
    # Mi menor, 128 BPM, ação + suspense.
    BEAT = 60 / 128
    BAR = BEAT * 4
    phase = T_DROP % BAR
    step = BEAT / 4
    roots = [40, 40, 36, 38]  # Em – Em – C – D
    osti = [0, 0, 12, 0, 0, 3, 0, 7, 0, 0, 12, 0, 10, 0, 7, 3]

    # Introdução: pulso em semicolcheias com filtro abrindo + tique metálico.
    t = 0.3
    k = 0
    while t < T_DROP - 0.02:
        p = t / T_DROP
        n = int(step * SR)
        s = saw(hz(28), n) + 0.5 * saw(hz(40), n, 0.004)
        s = lowpass(s, 200 + 900 * p ** 2) * np.exp(-np.arange(n) / SR * 18)
        add(s, t, 0, 0.30 + 0.2 * p)
        if k % 2 == 0:
            m = int(0.02 * SR)
            add(highpass(rng.standard_normal(m), 5000) * np.exp(-np.arange(m) / SR * 200), t, 0.4 if k % 4 else -0.4, 0.18)
        t += step
        k += 1
    riser(T_DROP, 4.5, 0.4)
    # Virada de tons antes do drop.
    for i in range(8):
        boom(T_DROP - BAR / 2 + i * BAR / 16, 0.25 + 0.05 * i, f0=70 - 4 * i, decay=9, length=0.4)

    # Seção de ação: ostinato, baixo distorcido, bateria híbrida e metais.
    t = T_DROP
    k = 0
    while t < T_LOGO:
        bar_i = int((t - T_DROP) / BAR + 1e-6)
        root = roots[bar_i % 4]
        q = quiet(t)
        half = T_RUMOR[0] <= t < T_RUMOR[1]
        n = int(step * SR)
        if not q:
            # Staccato de cordas.
            s = saw(hz(root + 12 + osti[k % 16]), n) + saw(hz(root + 24 + osti[k % 16]), n, 0.004) * 0.5
            s = lowpass(s, 1800) * np.exp(-np.arange(n) / SR * 26)
            add(s, t, 0.3 if k % 2 else -0.3, 0.11 * (1.0 if k % 4 == 0 else 0.7))
            # Baixo distorcido em colcheias.
            if k % 2 == 0:
                nb = int(step * 2 * SR)
                b = np.tanh(3 * lowpass(saw(hz(root - 12), nb) + saw(hz(root - 12), nb, 0.01), 400))
                add(b * np.exp(-np.arange(nb) / SR * 6), t, 0, 0.20)
            # Chimbal em semicolcheias.
            m = int(0.03 * SR)
            add(highpass(rng.standard_normal(m), 7000) * np.exp(-np.arange(m) / SR * 120), t, 0.25, 0.07 if k % 2 else 0.11)
        beat_pos = k % 16
        if not q:
            # Bumbo: 1, 2&, 3 ; caixa/palma: 2 e 4.
            if beat_pos in (0, 6, 8, 11):
                boom(t, 0.55, f0=50, decay=9, length=0.45)
            if beat_pos in (4, 12):
                m = int(0.3 * SR)
                tt = np.arange(m) / SR
                sn = (rng.standard_normal(m) * 0.8 + np.sin(2 * np.pi * 180 * tt)) * np.exp(-tt * 14)
                add(lowpass(sn, 6000), t, 0, 0.26)
        elif half and beat_pos == 0:
            boom(t, 0.4, f0=45, decay=4, length=1.0)  # meio tempo na investigação
        if half and k % 2 == 0:
            m = int(0.02 * SR)
            add(highpass(rng.standard_normal(m), 5000) * np.exp(-np.arange(m) / SR * 200), t, 0.4, 0.14)
        # Metais (stab) no início de cada compasso.
        if beat_pos == 0 and not q:
            nb = int(0.5 * SR)
            br = np.tanh(2 * ensemble([root + 12, root + 19, root + 24], nb, 1600)) * np.exp(-np.arange(nb) / SR * 5)
            add(br, t, 0, 0.16)
        t += step
        k += 1

    # Pad de tensão por baixo de tudo, incluindo a investigação.
    pad = ensemble([52, 53, 59], N, 600) * np.interp(t_all, [0, 3, T_LOGO, DUR], [0, 0.5, 0.6, 0])
    add(pad, 0, 0, 0.18)

    for at, g in ((T_DROP, 1.0), (T_RECORD, 0.9), (T_RUMOR[1], 0.6)):
        braam(at, 0.75 * g, root=28)
        boom(at, 0.9 * g, f0=40, decay=2.0, length=2.5)
    for i in range(8):  # virada antes do recorde
        boom(T_RECORD - BAR / 2 + i * BAR / 16, 0.22 + 0.04 * i, f0=70 - 4 * i, decay=9, length=0.4)

    # Final: impacto e drone que se apaga.
    braam(T_LOGO, 0.7, root=28, length=5.0)

reverb()
fade = np.clip((DUR - t_all) / 2.5, 0, 1) * np.clip(t_all / 0.6, 0, 1)
L *= fade
R *= fade
peak = max(np.abs(L).max(), np.abs(R).max())
out = (np.stack([L, R], 1) / peak * 0.89 * 32767).astype(np.int16)
with wave.open(OUT, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(out.tobytes())
print("ok", OUT)
