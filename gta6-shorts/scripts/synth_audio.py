"""Sintetiza trilha (synthwave escuro, 120 BPM) e SFX originais — sem samples de terceiros.

Uso: python3 scripts/synth_audio.py public/audio [parado|preso]
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
    write(PROFILE["out"], music())
    write("sfx-siren.wav", siren())
    write("sfx-cuffs.wav", cuffs())
    write("sfx-cell.wav", cell_slam())
    write("sfx-tapestop.wav", tape_stop())
    print("ok")
