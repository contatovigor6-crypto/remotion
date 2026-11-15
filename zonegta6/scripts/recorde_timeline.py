"""Linha do tempo do vídeo "Recorde" a partir da narração (scripts/align1 -> words.json).

Uso: python scripts/recorde_timeline.py <words.json> src/edit/recorde-timeline.json

Cada segmento começa num momento da fala (tempos em segundos, medidos na transcrição).
"""
import json
import sys

FPS = 30
VO = 6  # frame em que a narração entra
words = json.load(open(sys.argv[1]))
fr = lambda t: 0 if t == 0 else int(round(t * FPS)) + VO

S = [  # (início em s, segmento)
    (0.0, {"kind": "shot", "file": "jason_lucia_rooftop_landscape.jpg", "focus": 0.5, "caption": "UMA MARCA HISTÓRICA"}),
    (3.7, {"kind": "shot", "file": "jason_lucia_lock_and_load_landscape.jpg", "focus": 0.5, "caption": "ANTES DO LANÇAMENTO"}),
    (6.2, {"kind": "stat", "big": "Nº1", "lines": ["O JOGO MAIS PRÉ-VENDIDO", "DA HISTÓRIA DA PLAYSTATION STORE"], "status": "CONFIRMADO", "source": "PLAYSTATION BLOG · 10/11"}),
    (10.2, {"kind": "shot", "file": "jason_duval_17.jpg", "focus": 0.42}),
    (12.4, {"kind": "shot", "file": "lucia_caminos_14.jpg", "focus": 0.45}),
    (14.7, {"kind": "card", "lines": ["PENSE NISSO."]}),
    (16.5, {"kind": "shot", "file": "jason_duval_12.jpg", "focus": 0.62}),
    (18.9, {"kind": "shot", "file": "lucia_caminos_12.jpg", "focus": 0.45}),
    (21.2, {"kind": "shot", "file": "jason_duval_13.jpg", "focus": 0.5, "caption": "E O JOGO NEM FOI LANÇADO"}),
    (23.8, {"kind": "card", "lines": ["E EXISTE", "OUTRO DETALHE"]}),
    (25.9, {"kind": "stat", "big": "10/11", "lines": ["PRÉ-DOWNLOAD ANTECIPADO", "NOVE DIAS ANTES DO LANÇAMENTO"], "status": "CONFIRMADO", "source": "ROCKSTAR · PLAYSTATION BLOG"}),
    (29.6, {"kind": "shot", "file": "jason_duval_03.jpg", "focus": 0.4}),
    (31.6, {"kind": "shot", "file": "raul_bautista_02.jpg", "focus": 0.5}),
    (33.6, {"kind": "card", "lines": ["FEITO PARA O", "PLAYSTATION 5"]}),
    (36.0, {"kind": "shot", "file": "raul_bautista_01.jpg", "focus": 0.55}),
    (39.5, {"kind": "shot", "file": "jason_duval_14.jpg", "focus": 0.5, "caption": "GATILHOS ADAPTÁVEIS", "theme": "gatilho"}),
    (41.3, {"kind": "shot", "file": "lucia_caminos_11.jpg", "focus": 0.55, "caption": "RESPOSTA TÁTIL", "theme": "tatil"}),
    (42.5, {"kind": "shot", "file": "lucia_caminos_09.jpg", "focus": 0.5, "caption": "CONTROLE DUALSENSE"}),
    (45.9, {"kind": "card", "lines": ["ÁUDIO 3D", "TEMPEST"], "theme": "tempest"}),
    (48.0, {"kind": "shot", "file": "mount_kalaga_national_park_06.jpg", "focus": 0.55, "caption": "SOM POSICIONADO NO AMBIENTE"}),
    (50.2, {"kind": "shot", "file": "leonida_keys_06.jpg", "focus": 0.6}),
    (52.5, {"kind": "shot", "file": "brian_heder_04.jpg", "focus": 0.5}),
    (54.3, {"kind": "shot", "file": "cal_hampton_01.jpg", "focus": 0.6, "caption": "NÃO É SÓ VER VICE CITY"}),
    (56.2, {"kind": "shot", "file": "grassrivers_06.jpg", "focus": 0.55, "caption": "É SENTIR"}),
    (58.0, {"kind": "shot", "file": "grassrivers_08.jpg", "focus": 0.5}),
    (60.0, {"kind": "card", "lines": ["E AGORA", "VEM A PERGUNTA"], "theme": "pergunta"}),
    (61.6, {"kind": "montage"}),
    (70.7, {"kind": "date"}),
    (73.2, {"kind": "title"}),
    (75.7, {"kind": "logo"}),
]
END = 81.6

# Montagem: 21 cortes alternando clipes em movimento e imagens novas.
clips = ["clip_jason_duval", "clip_lucia_caminos", "clip_cal_hampton", "clip_drequan_priest", "clip_real_dimez", "clip_raul_bautista", "clip_brian_heder"]
imgs = [("ambrosia_03.jpg", 0.5), ("cal_hampton_02.jpg", 0.5), ("raul_bautista_03.jpg", 0.55), ("boobie_ike_01.jpg", 0.5), ("drequan_priest_04.jpg", 0.5), ("real_dimez_01.jpg", 0.45),
        ("raul_bautista_04.jpg", 0.5), ("brian_heder_01.jpg", 0.5), ("cal_hampton_04.jpg", 0.5), ("mount_kalaga_national_park_03.jpg", 0.5), ("real_dimez_03.jpg", 0.6), ("jason_duval_18.jpg", 0.5), ("ambrosia_05.jpg", 0.4), ("grassrivers_03.jpg", 0.4)]
out = []
for k, (t, seg) in enumerate(S):
    a, b = fr(t), fr(S[k + 1][0]) if k + 1 < len(S) else fr(END)
    if seg["kind"] == "montage":
        n = 21
        step = (b - a) / n
        ci = ii = 0
        for c in range(n):
            s0, s1 = a + round(c * step), a + round((c + 1) * step)
            if c % 3 == 0 and ci < len(clips):
                out.append({"kind": "shot", "file": f"vw/{clips[ci]}.mp4", "focus": 0.5, "dur": s1 - s0, "fast": True})
                ci += 1
            else:
                f, fo = imgs[ii]
                ii += 1
                out.append({"kind": "shot", "file": f, "focus": fo, "dur": s1 - s0, "fast": True})
        out[-21]["overlay"] = {"text": ["O QUE VAI ACONTECER", "QUANDO MILHÕES DE JOGADORES", "ENTRAREM NESSE MUNDO?"], "dur": b - a}
        continue
    out.append({**seg, "dur": b - a})

files = [s["file"] for s in out if "file" in s]
assert len(files) == len(set(files)), "mídia repetida"
json.dump({"voStart": VO, "segments": out, "voice": [[fr(s), fr(e)] for _, s, e in words]}, open(sys.argv[2], "w"), indent=1, ensure_ascii=False)
print(len(out), "segmentos,", sum(s["dur"] for s in out), "frames =", round(sum(s["dur"] for s in out) / FPS, 1), "s")
