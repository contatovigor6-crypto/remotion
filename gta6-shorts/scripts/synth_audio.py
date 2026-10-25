"""Sintetiza trilha (synthwave escuro, 120 BPM) e SFX originais — sem samples de terceiros.

Uso: python3 scripts/synth_audio.py public/audio [parado|preso|phonk|trap|funk|hype|ambient]
O arranjo segue os marcos da narração (segundos na voz já editada).
"""
import sys, os, wave
import numpy as np

SR = 48000
OUT = sys.argv[1] if len(sys.argv) > 1 else "public/audio"
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(6)

# Perfis de arranjo: marcos em segundos na narração de cada vídeo.
# mutes: stem -> [(início, fim, ganho)]; drums = kick/caixa/hats.
PROFILES = {
    # "1 hora parado" (synthwave escuro, Lá menor)
    "parado": dict(
        bpm=120, dur=80.0, end_hit=77.95, out="music.wav",
        prog=[(57, [57, 60, 64]), (53, [53, 57, 60]), (48, [48, 52, 55]), (55, [55, 59, 62])],
        mutes=dict(
            drums=[(22.0, 27.4, 0), (38.2, 41.36, 0), (58.7, 68.9, 0)],
            bass=[(22.0, 25.95, 0), (39.7, 41.36, 0), (58.7, 61.1, 0)],
            arp=[(22.0, 26.0, 0.35), (58.7, 61.1, 0)],
            pad=[(58.7, 61.1, 0)],
        ),
        tense=(61.1, 68.9), ticks=(22.0, 25.95), riser=(38.2, 41.36),
    ),
    # "Preso no GTA 6?" (ação/tensão, Ré menor, mais rápido)
    "preso": dict(
        bpm=128, dur=82.6, end_hit=81.45, out="music-preso.wav",
        prog=[(50, [50, 53, 57]), (46, [46, 50, 53]), (43, [43, 46, 50]), (45, [45, 49, 52])],
        mutes=dict(
            drums=[(10.9, 15.3, 0), (44.26, 48.6, 0), (60.2, 64.3, 0)],
            bass=[(44.26, 48.6, 0), (62.0, 64.3, 0)],
            arp=[(44.26, 48.6, 0.3), (62.5, 64.3, 0)],
            pad=[(62.5, 63.4, 0.3)],
        ),
        tense=(11.0, 15.3), ticks=(44.4, 48.5), riser=(60.2, 63.44),
    ),
    # Mesma edição de "preso", trilha no estilo drift phonk (cowbell, 808 distorcido, hats rápidos)
    "phonk": dict(
        style="phonk", bpm=140, dur=82.6, end_hit=81.45, out="music-phonk.wav",
        # Fá menor: Fm - Db - Eb - C
        prog=[(41, [65, 68, 72]), (37, [61, 65, 68]), (39, [63, 67, 70]), (36, [60, 64, 67])],
        mutes=dict(
            drums=[(10.9, 15.3, 0), (44.26, 48.6, 0), (60.2, 63.44, 0)],
            bass=[(44.26, 48.6, 0), (62.0, 63.44, 0)],
            arp=[(10.9, 15.3, 0.55), (44.26, 48.6, 0.25), (62.6, 63.44, 0)],
        ),
        tense=(11.0, 15.3), ticks=(44.4, 48.5), riser=(60.2, 63.44),
    ),
    # Trap sombrio: piano grave, 808, hats em tercina (75 BPM meio-tempo, Dó menor: Cm - Ab - Eb - G)
    "trap": dict(
        style="trap", bpm=150, dur=82.6, end_hit=81.45, out="music-trap.wav",
        prog=[(36, [60, 63, 67]), (32, [56, 60, 63]), (39, [55, 58, 63]), (31, [55, 59, 62])],
        mutes=dict(
            drums=[(10.9, 15.3, 0), (44.26, 48.6, 0), (60.2, 63.44, 0)],
            bass=[(44.26, 48.6, 0), (62.0, 63.44, 0)],
            arp=[(44.26, 48.6, 0.45), (62.6, 63.44, 0)],
        ),
        tense=(11.0, 15.3), ticks=(44.4, 48.5), riser=(60.2, 63.44),
    ),
    # Funk phonk brasileiro: tamborzão, grave distorcido, lead de sintetizador (130 BPM, Mi menor)
    "funk": dict(
        style="funk", bpm=130, dur=82.6, end_hit=81.45, out="music-funk.wav",
        prog=[(40, [64, 67, 71]), (36, [60, 64, 67]), (43, [62, 67, 71]), (38, [62, 66, 69])],
        mutes=dict(
            drums=[(10.9, 15.3, 0), (44.26, 48.6, 0), (60.2, 63.44, 0)],
            bass=[(44.26, 48.6, 0), (62.0, 63.44, 0)],
            arp=[(10.9, 15.3, 0.5), (44.26, 48.6, 0.3), (62.6, 63.44, 0)],
        ),
        tense=(11.0, 15.3), ticks=(44.4, 48.5), riser=(60.2, 63.44),
    ),
    # Empolgante: dance/trailer positivo, Fá maior (F - C - Dm - Bb), 128 BPM
    "hype": dict(
        style="hype", bpm=128, dur=82.6, end_hit=81.45, out="music-hype.wav",
        prog=[(41, [65, 69, 72]), (36, [60, 64, 67]), (38, [62, 65, 69]), (34, [58, 62, 65])],
        mutes=dict(
            drums=[(10.9, 15.3, 0), (44.26, 48.6, 0), (60.2, 63.44, 0)],
            bass=[(44.26, 48.6, 0), (62.0, 63.44, 0)],
            arp=[(10.9, 15.3, 0.5), (44.26, 48.6, 0.35), (62.6, 63.44, 0)],
        ),
        tense=(11.0, 15.3), ticks=(44.4, 48.5), riser=(60.2, 63.44),
    ),
    # Ambiente: pads cinematográficos, Ré menor (Dm - Bb - F - C), sem bateria
    "ambient": dict(
        style="ambient", bpm=80, dur=82.6, end_hit=81.45, out="music-ambient.wav",
        prog=[(38, [62, 65, 69]), (34, [58, 62, 65]), (41, [60, 65, 69]), (36, [60, 64, 67])],
        mutes=dict(
            bass=[(44.26, 48.6, 0.3), (62.0, 63.44, 0)],
            arp=[(44.26, 48.6, 0.4), (62.6, 63.44, 0)],
        ),
        tense=(11.0, 15.3), ticks=(44.4, 48.5), riser=(60.2, 63.44),
    ),
}
PROFILE = PROFILES[sys.argv[2] if len(sys.argv) > 2 else "parado"]
BPM = PROFILE["bpm"]
BEAT = 60 / BPM
DUR = PROFILE["dur"]
END_HIT = PROFILE["end_hit"]


def write(name, x):
    x = np.asarray(x, dtype=np.float64)
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    peak = np.max(np.abs(x)) or 1
    x = x / peak * 0.89
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())


def t(n):
    return np.arange(int(n * SR)) / SR


def env_ad(n, a, d):
    tt = t(n)
    return np.minimum(tt / max(a, 1e-4), 1) * np.exp(-tt / d)


def lp(x, cutoff):
    """One-pole low-pass; cutoff may be an array (time-varying)."""
    cutoff = np.broadcast_to(cutoff, x.shape)
    a = 1 - np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc); y[i] = acc
    return y


def lp_fast(x, cutoff, passes=2):
    from scipy.signal import butter, sosfilt
    sos = butter(passes * 2, cutoff, "low", fs=SR, output="sos")
    return sosfilt(sos, x)


def hp_fast(x, cutoff):
    from scipy.signal import butter, sosfilt
    return sosfilt(butter(4, cutoff, "high", fs=SR, output="sos"), x)


def bp_fast(x, lo, hi):
    from scipy.signal import butter, sosfilt
    return sosfilt(butter(2, [lo, hi], "band", fs=SR, output="sos"), x)


def saw(f, n):
    ph = np.cumsum(np.broadcast_to(f, (int(n * SR),)) / SR)
    return 2 * (ph % 1) - 1


def midi(m):
    return 440 * 2 ** ((m - 69) / 12)


# ---------------------------------------------------------------- SFX
def kick(n=0.45, f0=150, f1=42):
    tt = t(n); f = f1 + (f0 - f1) * np.exp(-tt * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 7) + 0.3 * np.tanh(4 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-tt * 30)


def impact():
    n = 2.2; tt = t(n)
    boom = np.sin(2 * np.pi * np.cumsum(30 + 90 * np.exp(-tt * 9)) / SR) * np.exp(-tt * 2.2)
    noise = lp_fast(rng.standard_normal(len(tt)), 2500) * np.exp(-tt * 9) * 0.6
    crack = hp_fast(rng.standard_normal(len(tt)), 3000) * np.exp(-tt * 40) * 0.5
    x = np.tanh(1.6 * (boom + noise + crack))
    return x


def whoosh(n=0.55, rev=False):
    tt = t(n); x = rng.standard_normal(len(tt))
    shape = np.sin(np.pi * np.clip(tt / n, 0, 1)) ** 2
    from scipy.signal import butter, sosfilt
    out = np.zeros_like(x)
    # sweep band-pass by blocks
    blk = 512
    for i in range(0, len(x), blk):
        p = i / len(x)
        c = 400 + 5000 * (p if not rev else 1 - p) ** 1.5
        sos = butter(2, [c * 0.6, min(c * 1.6, 20000)], "band", fs=SR, output="sos")
        out[i:i + blk] = sosfilt(sos, x[max(0, i - 2048):i + blk])[-len(x[i:i + blk]):]
    out *= shape
    if rev:
        out *= np.linspace(0.3, 1, len(out)) ** 2
    st = np.stack([out * (1 - 0.4 * tt / n), out * (0.6 + 0.4 * tt / n)], 1)
    return st


def riser(n):
    tt = t(n); p = tt / n
    noise = rng.standard_normal(len(tt))
    out = np.zeros_like(noise); blk = 1024
    from scipy.signal import butter, sosfilt
    for i in range(0, len(noise), blk):
        c = 300 + 9000 * (i / len(noise)) ** 2
        sos = butter(2, [c * 0.5, min(c * 1.5, 22000)], "band", fs=SR, output="sos")
        out[i:i + blk] = sosfilt(sos, noise[max(0, i - 4096):i + blk])[-len(noise[i:i + blk]):]
    tone = saw(110 * 2 ** (2 * p), n) * 0.25 + saw(110.7 * 2 ** (2 * p), n) * 0.25
    return (out * 0.8 + lp_fast(tone, 3000)) * p ** 2


def tick():
    tt = t(0.06)
    return np.sin(2 * np.pi * 3200 * tt) * np.exp(-tt * 140) + 0.4 * hp_fast(rng.standard_normal(len(tt)), 5000) * np.exp(-tt * 300)


def pop():
    tt = t(0.12)
    return np.sin(2 * np.pi * np.cumsum(900 * np.exp(-tt * 30) + 300) / SR) * np.exp(-tt * 45)


def glitch():
    n = 0.35; tt = t(n); x = np.zeros(len(tt))
    seg = int(0.018 * SR)
    for i in range(0, len(x), seg):
        if rng.random() < 0.7:
            f = rng.choice([180, 440, 880, 1760, 3520])
            s = np.sign(np.sin(2 * np.pi * f * tt[: min(seg, len(x) - i)]))
            x[i:i + seg] = s * rng.uniform(0.3, 1)
    x = np.round(x * 6) / 6
    return x * np.exp(-tt * 3) * 0.6 + hp_fast(rng.standard_normal(len(tt)), 2000) * 0.3 * np.exp(-tt * 8)


def sub_drop():
    tt = t(1.6)
    return np.sin(2 * np.pi * np.cumsum(70 * np.exp(-tt * 1.2) + 25) / SR) * np.exp(-tt * 1.8)


def typing():
    n = 0.9; x = np.zeros(int(n * SR))
    for k in range(9):
        s = int((0.05 + k * 0.09 + rng.uniform(0, 0.02)) * SR)
        c = tick()[: int(0.04 * SR)] * rng.uniform(0.4, 0.8)
        x[s:s + len(c)] += c[: len(x) - s]
    return x


def shutter():
    tt = t(0.18)
    a = hp_fast(rng.standard_normal(len(tt)), 1500) * np.exp(-tt * 80)
    b = np.roll(a, int(0.07 * SR)) * 0.7
    return a + b


def siren(n=1.6):
    """Sirene de duas notas (estilo viatura), distante."""
    tt = t(n)
    f = np.where((tt * 2.5) % 1 < 0.5, 960, 770)
    f = lp_fast(f.astype(float), 18)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.3 * np.sin(4 * np.pi * np.cumsum(f) / SR)
    e = np.minimum(tt / 0.15, 1) * np.minimum((n - tt) / 0.3, 1)
    return bp_fast(x, 500, 4000) * e


def cuffs():
    """Clique metálico de algema: dois estalos com ressonância."""
    n = 0.5; x = np.zeros(int(n * SR))
    for off, f0 in ((0.0, 3100), (0.11, 2650)):
        s0 = int(off * SR); m = int(0.3 * SR); tt = t(0.3)
        ring = sum(np.sin(2 * np.pi * f0 * k * tt) / k for k in (1, 2.76, 5.4)) * np.exp(-tt * 30)
        click = hp_fast(rng.standard_normal(m), 4000) * np.exp(-tt * 300)
        x[s0:s0 + m] += (ring * 0.6 + click)[: len(x) - s0]
    return x


def cell_slam():
    """Porta de cela batendo: impacto grave + ressonância metálica."""
    n = 2.0; tt = t(n)
    boom = np.sin(2 * np.pi * np.cumsum(45 + 70 * np.exp(-tt * 14)) / SR) * np.exp(-tt * 3)
    metal = sum(np.sin(2 * np.pi * f * tt + k) for k, f in enumerate((220, 331, 517, 743, 1104))) * np.exp(-tt * 2.2) * 0.12
    hit = lp_fast(rng.standard_normal(len(tt)), 3000) * np.exp(-tt * 25) * 0.8
    return np.tanh(1.4 * (boom + metal + hit))


def tape_stop():
    """Desaceleração (fita parando) para o 'Mas calma'."""
    n = 0.7; tt = t(n)
    f = 220 * (1 - tt / n) ** 2 + 20
    x = (saw(f, n) + 0.5 * saw(f * 1.5, n)) * (1 - tt / n)
    return lp_fast(x, 1800)


# ---------------------------------------------------------------- MUSIC
def music():
    n = int(DUR * SR); tt = np.arange(n) / SR
    L = np.zeros(n); R = np.zeros(n)
    beat_times = np.arange(0, DUR, BEAT)

    def sec_gain(name, x):
        """Arranjo: volume de cada stem por tempo (perfil)."""
        g = np.ones_like(x)
        key = "drums" if name in ("kick", "hat", "snare") else name
        for a, b, gain in PROFILE["mutes"].get(key, []):
            g[(x >= a) & (x < b)] = gain
        g[x >= END_HIT + (0.1 if name == "pad" else 0)] = 0
        return g

    # progression Am - F - C - G (1 bar = 4 beats each)
    prog = PROFILE["prog"]
    bar = 4 * BEAT

    # kick + snare + hats
    for i, bt in enumerate(beat_times):
        if sec_gain("kick", np.array([bt]))[0] == 0:
            continue
        s = int(bt * SR); k = kick() * 0.9
        L[s:s + len(k)] += k[: n - s]; R[s:s + len(k)] += k[: n - s]
        if i % 2 == 1:
            sn = hp_fast(rng.standard_normal(int(0.25 * SR)), 900) * np.exp(-t(0.25) * 18) * 0.35
            sn += np.sin(2 * np.pi * 190 * t(0.25)) * np.exp(-t(0.25) * 25) * 0.4
            L[s:s + len(sn)] += sn[: n - s] * 0.9; R[s:s + len(sn)] += sn[: n - s]
        for off in (0.5,):
            hs = int((bt + off * BEAT) * SR)
            h = hp_fast(rng.standard_normal(int(0.05 * SR)), 7000) * np.exp(-t(0.05) * 90) * 0.18
            if hs < n:
                L[hs:hs + len(h)] += h[: n - hs] * 0.7; R[hs:hs + len(h)] += h[: n - hs]

    # bass: 8th-note pulse on chord root
    bass = np.zeros(n)
    for b in np.arange(0, DUR, BEAT / 2):
        chord = prog[int(b // bar) % 4]
        f = midi(chord[0] - 24)
        s = int(b * SR); m = int(BEAT / 2 * SR * 0.9)
        seg = saw(f, m / SR) * env_ad(m / SR, 0.004, 0.12)
        bass[s:s + m] += seg[: n - s]
    bass = lp_fast(bass, 380) * sec_gain("bass", tt)
    # side-chain pump
    pump = np.ones(n)
    for bt in beat_times:
        s = int(bt * SR); m = int(BEAT * SR)
        pump[s:s + m] = np.minimum(pump[s:s + m], 0.35 + 0.65 * np.clip(t(BEAT)[: n - s][:m] / 0.18, 0, 1))
    L += bass * 0.55 * pump; R += bass * 0.55 * pump

    # arp: 16ths across chord tones, octave up
    arp = np.zeros(n)
    for j, b in enumerate(np.arange(0, DUR, BEAT / 4)):
        chord = prog[int(b // bar) % 4][1]
        note = (chord + [chord[0] + 12])[j % 4] + 12
        s = int(b * SR); m = int(BEAT / 4 * SR)
        seg = (saw(midi(note), m / SR) + saw(midi(note) * 1.004, m / SR)) * env_ad(m / SR, 0.002, 0.05)
        arp[s:s + m] += seg[: n - s]
    cutoff_curve = 1200 + 1800 * (0.5 + 0.5 * np.sin(2 * np.pi * tt / 16))
    arp = lp_fast(arp, 2600) * sec_gain("arp", tt) * 0.16
    dly = int(BEAT * 0.75 * SR)
    arpL = arp + np.concatenate([np.zeros(dly), arp[:-dly]]) * 0.35
    arpR = arp + np.concatenate([np.zeros(dly * 2 // 3), arp[:-(dly * 2 // 3)]]) * 0.35
    L += arpL * pump; R += arpR * pump

    # pad
    pad = np.zeros(n); padR = np.zeros(n)
    for bi, b in enumerate(np.arange(0, DUR, bar)):
        chord = prog[bi % 4][1]
        s = int(b * SR); m = int(bar * SR)
        segL = sum(saw(midi(c), m / SR) + saw(midi(c) * 1.006, m / SR) for c in chord)
        segR = sum(saw(midi(c) * 0.997, m / SR) + saw(midi(c) * 1.003, m / SR) for c in chord)
        e = np.minimum(t(m / SR) / 0.3, 1) * np.minimum((m / SR - t(m / SR)) / 0.3, 1)
        pad[s:s + m] += (segL * e)[: n - s]; padR[s:s + m] += (segR * e)[: n - s]
    g = sec_gain("pad", tt) * 0.06
    L += lp_fast(pad, 1400) * g; R += lp_fast(padR, 1400) * g

    # tense section: heartbeat-like low pulse + clock ticks
    for b in np.arange(*PROFILE["tense"], BEAT):
        s = int(b * SR); k = kick(0.3, 90, 40) * 0.6
        L[s:s + len(k)] += k; R[s:s + len(k)] += k
        k2 = kick(0.25, 80, 38) * 0.35; s2 = s + int(0.18 * SR)
        L[s2:s2 + len(k2)] += k2; R[s2:s2 + len(k2)] += k2
    # calm section: ticks of a clock
    for b in np.arange(*PROFILE["ticks"], 1.0):
        s = int(b * SR); c = tick() * 0.25
        L[s:s + len(c)] += c; R[s:s + len(c)] += c

    # riser into drop
    r0, r1 = PROFILE["riser"]
    r = riser(r1 - r0); s = int(r0 * SR)
    L[s:s + len(r)] += r * 0.35; R[s:s + len(r)] += r * 0.35

    # fade tail
    fade = np.clip((DUR - tt) / 1.5, 0, 1)
    out = np.stack([L * fade, R * fade], 1)
    return np.tanh(out * 1.2)


def cowbell(f, n):
    """Cowbell estilo 808 (duas ondas quadradas em razão ~1.48, filtradas)."""
    tt = t(n)
    x = np.sign(np.sin(2 * np.pi * f * tt)) + np.sign(np.sin(2 * np.pi * f * 1.482 * tt))
    return bp_fast(x, 500, 3200) * (np.exp(-tt * 26) * 0.75 + np.exp(-tt * 7) * 0.25)


def music_phonk():
    n = int(DUR * SR); tt = np.arange(n) / SR
    L = np.zeros(n); R = np.zeros(n)
    bar = 4 * BEAT
    prog = PROFILE["prog"]

    def gain(stem, x):
        g = np.ones_like(np.atleast_1d(x), dtype=float)
        for a, b, v in PROFILE["mutes"].get(stem, []):
            g[(x >= a) & (x < b)] = v
        g[np.atleast_1d(x) >= END_HIT] = 0
        return g

    def add(sig, at, vol=1.0, pan=0.0):
        s = int(at * SR)
        if s >= n:
            return
        m = min(len(sig), n - s)
        if sig.ndim == 2:
            L[s:s + m] += sig[:m, 0] * vol; R[s:s + m] += sig[:m, 1] * vol
        else:
            L[s:s + m] += sig[:m] * vol * (1 - pan); R[s:s + m] += sig[:m] * vol * (1 + pan)

    # bateria: kick com padrão trap, palma no 3º tempo (meio-tempo), hats em colcheias com rolos
    kick_pat = [0, 1.5, 2.75]
    for bi, b0 in enumerate(np.arange(0, DUR, bar)):
        for k in kick_pat:
            at = b0 + k * BEAT
            if gain("drums", np.array([at]))[0] > 0:
                add(np.tanh(2.2 * kick(0.4, 170, 45)), at, 0.8)
        at = b0 + 2 * BEAT
        if gain("drums", np.array([at]))[0] > 0:
            clap = sum(np.roll(hp_fast(rng.standard_normal(int(0.3 * SR)), 1200) * np.exp(-t(0.3) * 16), int(d * SR)) for d in (0, 0.008, 0.017))
            add(clap * 0.32, at)
        for h in range(8):
            at = b0 + h * BEAT / 2
            if gain("drums", np.array([at]))[0] == 0:
                continue
            roll = 3 if (bi % 2 == 1 and h == 7) else 1
            for r in range(roll):
                hh = hp_fast(rng.standard_normal(int(0.04 * SR)), 8000) * np.exp(-t(0.04) * 120)
                add(hh * (0.13 if r == 0 else 0.09), at + r * BEAT / 6, pan=0.25)

    # 808 distorcido com glide para a tônica do acorde
    b808 = np.zeros(n)
    for bi, b0 in enumerate(np.arange(0, DUR, bar)):
        root = prog[bi % 4][0]
        for k, dur in ((0, 1.4), (1.5, 1.2), (2.75, 1.2)):
            at = b0 + k * BEAT
            if gain("bass", np.array([at]))[0] == 0:
                continue
            m = int(dur * BEAT * SR); tl = t(m / SR)
            f = midi(root) * (1 + 0.5 * np.exp(-tl * 40))
            sig = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(tl / 0.005, 1) * np.exp(-tl * 1.8)
            s = int(at * SR); b808[s:s + m] += sig[: n - s]
    b808 = lp_fast(np.tanh(3.0 * b808), 900) * 0.55
    L += b808; R += b808

    # melodia de cowbell (motivo original em semicolcheias) + eco
    motif = [0, 0, 3, 0, 7, 0, 5, 3, 0, 0, 3, 0, 8, 7, 5, 3]
    cb = np.zeros(n)
    for j, at in enumerate(np.arange(0, DUR, BEAT / 4)):
        bi = int(at // bar)
        step = j % 16
        if step in (1, 9) or gain("arp", np.array([at]))[0] == 0:
            continue
        root = prog[bi % 4][1][0]
        note = root + motif[step] + (12 if (bi % 4 == 3 and step >= 12) else 0)
        sig = cowbell(midi(note), BEAT / 4 * 1.6)
        s = int(at * SR); m = min(len(sig), n - s)
        cb[s:s + m] += sig[:m] * gain("arp", np.array([at]))[0]
    dly = int(BEAT * 0.75 * SR)
    cbL = cb + np.concatenate([np.zeros(dly), cb[:-dly]]) * 0.3
    cbR = cb + np.concatenate([np.zeros(dly // 2), cb[:-(dly // 2)]]) * 0.3
    L += cbL * 0.2; R += cbR * 0.2

    # pulso tenso (preso × eliminado) e relógio na pausa
    for b in np.arange(*PROFILE["tense"], BEAT * 2):
        add(np.tanh(2 * kick(0.35, 90, 38)), b, 0.6)
    for b in np.arange(*PROFILE["ticks"], 1.0):
        add(tick(), b, 0.25)
    r0, r1 = PROFILE["riser"]
    add(riser(r1 - r0), r0, 0.35)

    fade = np.clip((DUR - tt) / 1.2, 0, 1)
    out = np.stack([L * fade, R * fade], 1)
    return np.tanh(out * 1.3)


def radio_chirp():
    """Rádio policial: estalo de estática + dois bipes curtos de 'câmbio' (banda telefônica)."""
    n = 0.75; x = np.zeros(int(n * SR))
    st = bp_fast(rng.standard_normal(int(0.22 * SR)), 900, 3500) * np.exp(-t(0.22) * 9) * 0.55
    x[: len(st)] += st
    for off, f0, d in ((0.24, 1460, 0.07), (0.34, 1950, 0.09)):
        s0 = int(off * SR); tt = t(d)
        tone = np.sin(2 * np.pi * f0 * tt) * np.minimum(tt / 0.004, 1) * np.minimum((d - tt) / 0.006, 1)
        x[s0:s0 + len(tone)] += tone * 0.5
    tail = bp_fast(rng.standard_normal(int(0.2 * SR)), 1000, 3000) * np.exp(-t(0.2) * 25) * 0.4
    x[int(0.5 * SR):int(0.5 * SR) + len(tail)] += tail
    return np.tanh(1.8 * bp_fast(x, 400, 4000))


def _stems():
    n = int(DUR * SR)
    return n, np.arange(n) / SR, np.zeros(n), np.zeros(n)


def _gain(stem, at):
    for a, b, v in PROFILE["mutes"].get(stem, []):
        if a <= at < b:
            return v
    return 0.0 if at >= END_HIT else 1.0


def _add(L, R, sig, at, vol=1.0, pan=0.0):
    n = len(L); s = int(at * SR)
    if s >= n or vol == 0:
        return
    m = min(len(sig), n - s)
    L[s:s + m] += sig[:m] * vol * (1 - pan); R[s:s + m] += sig[:m] * vol * (1 + pan)


def _common_fx(L, R):
    for b in np.arange(*PROFILE["tense"], BEAT * 2):
        _add(L, R, np.tanh(2 * kick(0.35, 90, 38)), b, 0.6)
    for b in np.arange(*PROFILE["ticks"], 1.0):
        _add(L, R, tick(), b, 0.25)
    r0, r1 = PROFILE["riser"]
    _add(L, R, riser(r1 - r0), r0, 0.35)


def piano(f, n):
    """Piano sintético: parciais levemente inarmônicas com decaimento por harmônico."""
    tt = t(n)
    x = sum(np.sin(2 * np.pi * f * k * (1 + 0.0004 * k * k) * tt) * np.exp(-tt * (1.2 + 0.9 * k)) / k for k in range(1, 8))
    return x * np.minimum(tt / 0.003, 1)


def music_trap():
    n, tt, L, R = _stems()
    bar = 4 * BEAT * 2  # meio-tempo: compasso = 8 batidas de 150 BPM
    prog = PROFILE["prog"]
    hb = BEAT  # colcheia em 75 BPM
    for bi, b0 in enumerate(np.arange(0, DUR, bar)):
        root = prog[bi % 4][0]
        # kick + 808 (mesmo padrão)
        for k in (0, 3, 5.5):
            at = b0 + k * hb
            if _gain("drums", at):
                _add(L, R, np.tanh(2 * kick(0.4, 150, 42)), at, 0.75)
            if _gain("bass", at):
                m = 1.6 * hb; tl = t(m)
                f = midi(root) * (1 + 0.6 * np.exp(-tl * 30))
                sig = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(tl / 0.005, 1) * np.exp(-tl * 1.2)
                _add(L, R, lp_fast(np.tanh(2.2 * sig), 700) * 0.6, at)
        # caixa no tempo 3 (meio-tempo)
        for k in (4,):
            at = b0 + k * hb
            if _gain("drums", at):
                sn = hp_fast(rng.standard_normal(int(0.3 * SR)), 1500) * np.exp(-t(0.3) * 14) * 0.4
                sn += np.sin(2 * np.pi * 185 * t(0.3)) * np.exp(-t(0.3) * 22) * 0.35
                _add(L, R, sn, at)
        # hats: colcheias + tercinas no fim do compasso
        for h in range(16):
            at = b0 + h * hb / 2
            if not _gain("drums", at):
                continue
            hh = hp_fast(rng.standard_normal(int(0.035 * SR)), 8500) * np.exp(-t(0.035) * 130)
            if h in (14, 15) and bi % 2:
                for r in range(3):
                    _add(L, R, hh, at + r * hb / 6, 0.09, 0.2)
            else:
                _add(L, R, hh, at, 0.11, 0.2)
        # piano: arpejo grave do acorde em colcheias + nota longa no início
        chord = prog[bi % 4][1]
        g = _gain("arp", b0)
        for j in range(8):
            at = b0 + j * hb
            note = (chord + [chord[0] + 12])[[0, 1, 2, 1, 3, 2, 1, 2][j]] - 12
            _add(L, R, piano(midi(note), 1.4), at, 0.16 * _gain("arp", at), -0.15)
        _add(L, R, piano(midi(chord[0] - 24), 3.0), b0, 0.18 * g, 0.1)
        # cordas suaves (pad)
        m = bar
        pad = sum(saw(midi(c - 12) * d, m) for c in chord for d in (0.997, 1.003))
        e = np.minimum(t(m) / 0.6, 1) * np.minimum((m - t(m)) / 0.4, 1)
        _add(L, R, lp_fast(pad * e, 1100) * 0.035, b0, _gain("arp", b0) if _gain("arp", b0) < 1 else 1.0)
    _common_fx(L, R)
    fade = np.clip((DUR - tt) / 1.2, 0, 1)
    return np.tanh(np.stack([L * fade, R * fade], 1) * 1.3)


def music_funk():
    n, tt, L, R = _stems()
    bar = 4 * BEAT
    sx = BEAT / 4  # semicolcheia
    prog = PROFILE["prog"]
    tambor = [0, 3, 6, 8, 11, 14]  # tamborzão
    clap = [4, 12]
    lead_motif = [0, None, 3, None, 5, 3, None, 7, 0, None, 3, None, 10, None, 7, 5]
    for bi, b0 in enumerate(np.arange(0, DUR, bar)):
        root, chord = prog[bi % 4]
        for st in tambor:
            at = b0 + st * sx
            if _gain("drums", at):
                tom = np.sin(2 * np.pi * np.cumsum(70 + 110 * np.exp(-t(0.3) * 25)) / SR) * np.exp(-t(0.3) * 9)
                _add(L, R, np.tanh(2.5 * tom), at, 0.7)
            if _gain("bass", at):
                m = 2.5 * sx; tl = t(m)
                sig = np.tanh(4 * np.sin(2 * np.pi * midi(root - 12) * tl)) * np.exp(-tl * 4)
                _add(L, R, lp_fast(sig, 600) * 0.4, at)
        for st in clap:
            at = b0 + st * sx
            if _gain("drums", at):
                c = sum(np.roll(hp_fast(rng.standard_normal(int(0.25 * SR)), 1300) * np.exp(-t(0.25) * 20), int(d * SR)) for d in (0, 0.01, 0.02))
                _add(L, R, c, at, 0.3)
        for h in range(16):
            at = b0 + h * sx
            if _gain("drums", at) and h % 2 == 0:
                hh = hp_fast(rng.standard_normal(int(0.03 * SR)), 9000) * np.exp(-t(0.03) * 140)
                _add(L, R, hh, at, 0.1 if h % 4 else 0.13, 0.25)
        # lead de sintetizador (pluck com leve detune)
        for j, step in enumerate(lead_motif):
            if step is None:
                continue
            at = b0 + j * sx
            g = _gain("arp", at)
            if not g:
                continue
            f = midi(chord[0] + step)
            m = 1.8 * sx
            pl = (saw(f, m) + saw(f * 1.006, m)) * np.exp(-t(m) * 14)
            _add(L, R, lp_fast(pl, 2400), at, 0.11 * g, -0.2 if j % 2 else 0.2)
    _common_fx(L, R)
    fade = np.clip((DUR - tt) / 1.2, 0, 1)
    return np.tanh(np.stack([L * fade, R * fade], 1) * 1.3)


def supersaw(f, n, voices=5, spread=0.012):
    return sum(saw(f * (1 + spread * (k - voices // 2) / (voices // 2)), n) for k in range(voices)) / voices


def music_hype():
    n, tt, L, R = _stems()
    bar = 4 * BEAT
    prog = PROFILE["prog"]
    pump = np.ones(n)
    for bt in np.arange(0, DUR, BEAT):
        s = int(bt * SR); m = min(int(BEAT * SR), n - s)
        pump[s:s + m] = 0.3 + 0.7 * np.clip(t(BEAT)[:m] / 0.2, 0, 1)
    chords = np.zeros(n); chordsR = np.zeros(n); bass = np.zeros(n)
    for bi, b0 in enumerate(np.arange(0, DUR, bar)):
        root, chord = prog[bi % 4]
        for k in range(4):
            at = b0 + k * BEAT
            if _gain("drums", at):
                _add(L, R, np.tanh(1.8 * kick(0.38, 160, 48)), at, 0.75)
                oh = hp_fast(rng.standard_normal(int(0.12 * SR)), 7000) * np.exp(-t(0.12) * 30)
                _add(L, R, oh, at + BEAT / 2, 0.12, 0.2)
                if k in (1, 3):
                    c = sum(np.roll(hp_fast(rng.standard_normal(int(0.25 * SR)), 1200) * np.exp(-t(0.25) * 18), int(d * SR)) for d in (0, 0.009, 0.019))
                    _add(L, R, c, at, 0.3)
            # baixo no contratempo
            if _gain("bass", at + BEAT / 2):
                m = BEAT / 2 * 0.9
                sb = saw(midi(root - 12), m) * env_ad(m, 0.004, 0.12)
                s0 = int((at + BEAT / 2) * SR); mm = min(len(sb), n - s0)
                if mm <= 0:
                    continue
                bass[s0:s0 + mm] += sb[:mm]
        # acordes supersaw em colcheias, seguindo o "pump"
        g = _gain("arp", b0)
        for j in range(8):
            at = b0 + j * BEAT / 2
            m = BEAT / 2 * 0.95
            seg = sum(supersaw(midi(c), m) for c in chord) * env_ad(m, 0.005, 0.25)
            s0 = int(at * SR); mm = min(len(seg), n - s0)
            if mm <= 0:
                continue
            chords[s0:s0 + mm] += seg[:mm] * _gain("arp", at)
            seg2 = sum(supersaw(midi(c) * 1.002, m) for c in chord) * env_ad(m, 0.005, 0.25)
            chordsR[s0:s0 + mm] += seg2[:mm] * _gain("arp", at)
        # melodia pluck (sobe no último compasso do ciclo)
        mel = [7, None, 4, 7, None, 9, 7, 4] if bi % 4 != 3 else [7, 9, 12, None, 12, 14, 12, 9]
        for j, st in enumerate(mel):
            if st is None:
                continue
            at = b0 + j * BEAT / 2
            m = BEAT / 2 * 1.5
            pl = (saw(midi(chord[0] + st), m) + saw(midi(chord[0] + st) * 1.004, m)) * np.exp(-t(m) * 10)
            _add(L, R, lp_fast(pl, 3500), at, 0.085 * _gain("arp", at), 0.15 if j % 2 else -0.15)
    L += lp_fast(chords, 3000) * 0.05 * pump; R += lp_fast(chordsR, 3000) * 0.05 * pump
    b = lp_fast(bass, 450) * 0.4 * pump
    L += b; R += b
    _common_fx(L, R)
    fade = np.clip((DUR - tt) / 1.2, 0, 1)
    return np.tanh(np.stack([L * fade, R * fade], 1) * 1.2)


def music_ambient():
    n, tt, L, R = _stems()
    bar = 4 * BEAT
    prog = PROFILE["prog"]
    padL = np.zeros(n); padR = np.zeros(n)
    for bi, b0 in enumerate(np.arange(0, DUR, bar)):
        root, chord = prog[bi % 4]
        m = bar + 1.2  # sobreposição para transição suave entre acordes
        e = np.minimum(t(m) / 1.0, 1) * np.minimum((m - t(m)) / 1.2, 1)
        notes = chord + [chord[0] + 12]
        sl = sum(supersaw(midi(c - 12), m, 3, 0.006) for c in notes) * e
        sr = sum(supersaw(midi(c - 12) * 1.003, m, 3, 0.006) for c in notes) * e
        s0 = int(b0 * SR); mm = min(len(sl), n - s0)
        if mm <= 0:
            continue
        g = _gain("arp", b0)
        padL[s0:s0 + mm] += sl[:mm] * g; padR[s0:s0 + mm] += sr[:mm] * g
        # sub suave
        if _gain("bass", b0):
            sub = np.sin(2 * np.pi * midi(root - 12) * t(bar)) * np.minimum(t(bar) / 0.5, 1) * np.minimum((bar - t(bar)) / 0.5, 1)
            _add(L, R, sub, b0, 0.22 * _gain("bass", b0))
        # notas de piano espaçadas
        for k, idx in ((0, 2), (1.5, 1), (2.5, 3)):
            at = b0 + k * BEAT
            _add(L, R, piano(midi(notes[idx] + 12), 2.5), at, 0.07 * _gain("arp", at), -0.3 if k else 0.3)
        # pulso leve (quase imperceptível) para dar movimento
        for k in range(4):
            at = b0 + k * BEAT
            if 10.9 <= at < 15.3 or 44.26 <= at < 48.6 or at >= END_HIT:
                continue
            _add(L, R, np.tanh(kick(0.3, 80, 40)), at, 0.18)
    dly = int(BEAT * 0.75 * SR)
    pl = lp_fast(padL, 1600); pr = lp_fast(padR, 1600)
    L += (pl + np.concatenate([np.zeros(dly), pr[:-dly]]) * 0.25) * 0.08
    R += (pr + np.concatenate([np.zeros(dly), pl[:-dly]]) * 0.25) * 0.08
    _common_fx(L, R)
    fade = np.clip((DUR - tt) / 1.5, 0, 1)
    return np.tanh(np.stack([L * fade, R * fade], 1) * 1.1)


if __name__ == "__main__":
    write("sfx-impact.wav", impact())
    write("sfx-whoosh.wav", whoosh())
    write("sfx-whoosh-rev.wav", whoosh(0.6, rev=True))
    write("sfx-tick.wav", tick())
    write("sfx-pop.wav", pop())
    write("sfx-glitch.wav", glitch())
    write("sfx-subdrop.wav", sub_drop())
    write("sfx-typing.wav", typing())
    write("sfx-shutter.wav", shutter())
    style = PROFILE.get("style")
    write(PROFILE["out"], {"phonk": music_phonk, "trap": music_trap, "funk": music_funk, "hype": music_hype, "ambient": music_ambient}.get(style, music)())
    write("sfx-siren.wav", siren())
    write("sfx-cuffs.wav", cuffs())
    write("sfx-cell.wav", cell_slam())
    write("sfx-tapestop.wav", tape_stop())
    write("sfx-radio.wav", radio_chirp())
    print("ok")
