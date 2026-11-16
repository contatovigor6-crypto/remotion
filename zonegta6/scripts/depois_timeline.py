"""Linha do tempo do vídeo "Depois do lançamento" a partir da narração.

Uso: python scripts/depois_timeline.py <words.json> src/edit/depois-timeline.json
"""
import json
import sys

FPS = 30
VO = 6
words = json.load(open(sys.argv[1]))
fr = lambda t: 0 if t == 0 else int(round(t * FPS)) + VO
cue = lambda w, after=0.0: next(s for x, s, _ in words if s >= after and x.lower().strip(".,?!").startswith(w))

S = [
    # GANCHO (0–8 s): contagem + virada para a pergunta.
    (0.0, {"kind": "hook", "flashes": [["drequan_priest_03.jpg", 0], ["lucia_caminos_05.jpg", fr(cue("três"))], ["brian_heder_02.jpg", fr(cue("dias"))]], "lineAt": fr(cue("para")), "dropAt": fr(cue("mas"))}),
    (cue("mas") - 0.05, {"kind": "hook2", "rest": True, "subAt": fr(cue("muita")) - fr(cue("mas") - 0.05)}),
    (cue("o", 8.0) - 0.1, {"kind": "question", "file": "ultimate_edition_01.jpg", "focus": 0.5, "fx": "parallax", "text": ["O QUE A ROCKSTAR", "VAI FAZER DEPOIS?"]}),
    # DECLARAÇÃO DA TAKE-TWO
    (cue("e", 13.5), {"kind": "card", "small": True, "lines": ["STRAUSS ZELNICK", "PRESIDENTE DA TAKE-TWO"]}),
    (cue("durante") - 0.1, {"kind": "shot", "file": "brian_heder_03.jpg", "focus": 0.55, "fx": "parallax", "caption": "APRESENTAÇÃO A INVESTIDORES · 9/11"}),
    (cue("confirmou", 22) - 0.4, {"kind": "stat", "big": "19/11", "lines": ["LANÇAMENTO MANTIDO", "NO CAMINHO CERTO, SEGUNDO A TAKE-TWO"], "status": "CONFIRMADO", "source": "TAKE-TWO · RESULTADOS DE 9/11"}),
    (cue("revelou") - 0.2, {"kind": "quote", "lines": ["“O NÍVEL DE PRÉ-VENDAS", "É EXTRAORDINÁRIO”"], "status": "CONFIRMADO", "source": "TAKE-TWO · TELECONFERÊNCIA DE 9/11"}),
    (cue("mas", 32) - 0.1, {"kind": "card", "lines": ["O FUTURO", "DA FRANQUIA"]}),
    # GTA ONLINE
    (cue("a", 37.5) - 0.1, {"kind": "stat", "big": "GTA ONLINE", "lines": ["CONTINUA COM SUPORTE", "SEGUNDO O CEO DA TAKE-TWO"], "status": "REPORTADO", "source": "STRAUSS ZELNICK · TELECONFERÊNCIAS DE 2026"}),
    (cue("novos") - 0.15, {"kind": "shot", "file": "nov_online_9.jpg", "focus": 0.5, "fx": "whip", "caption": "ATUALIZAÇÕES · CONTEÚDOS · EVENTOS"}),
    (cue("enorme") - 0.3, {"kind": "shot", "file": "nov_online_6.jpg", "focus": 0.5, "fx": "parallax", "caption": "UMA COMUNIDADE ENORME"}),
    (cue("isso", 47) - 0.1, {"kind": "shot", "file": "nov_online_4.jpg", "focus": 0.5, "fx": "whip", "dir": -1}),
    (cue("não", 49.4) - 0.2, {"kind": "shot", "file": "nov_online_1.jpg", "focus": 0.45, "fx": "dolly", "caption": "NÃO É O FIM DE UMA ERA"}),
    (cue("a", 52.6) - 0.1, {"kind": "shot", "file": "ultimate_edition_squalo_01.jpg", "focus": 0.45, "fx": "whip"}),
    (cue("relevante") - 0.3, {"kind": "shot", "file": "ultimate_edition_grotti_cheetah_01.jpg", "focus": 0.5, "fx": "parallax", "caption": "MESMO DEPOIS DO LANÇAMENTO"}),
    # O QUE AINDA NÃO SE SABE
    (cue("e", 59.7) - 0.1, {"kind": "card", "lines": ["E EXISTE", "OUTRO DETALHE"]}),
    (cue("a", 61.7) - 0.1, {"kind": "stat", "big": "?", "lines": ["PLANOS PÓS-LANÇAMENTO", "AINDA NÃO REVELADOS PELA ROCKSTAR"], "status": "SEM ANÚNCIO", "source": "NENHUM COMUNICADO OFICIAL ATÉ 16/11"}),
    (cue("novidades") - 0.1, {"kind": "triptych", "panels": [
        {"file": "ultimate_edition_electric_fang_01.jpg", "focus": 0.45, "label": "NOVIDADES?", "at": 0},
        {"file": "ultimate_edition_stock_305_01.jpg", "focus": 0.5, "label": "EVENTOS?", "at": fr(cue("eventos", 68)) - fr(cue("novidades") - 0.1)},
        {"file": "vintage_vice_city_pack_01.jpg", "focus": 0.5, "label": "EXPANSÕES?", "at": fr(cue("expansões")) - fr(cue("novidades") - 0.1)},
    ]}),
    (cue("incógnita") - 0.4, {"kind": "shot", "file": "ultimate_edition_wyman_car_collection_01.jpg", "focus": 0.35, "fx": "dolly", "caption": "UMA INCÓGNITA"}),
    (cue("por", 73) - 0.1, {"kind": "card", "lines": ["UMA COISA", "ESTÁ CLARA"]}),
    (cue("a", 75.5) - 0.1, {"kind": "shot", "file": "ultimate_edition_vice_city_style_01.jpg", "focus": 0.5, "fx": "parallax"}),
    (cue("está", 79) - 0.1, {"kind": "shot", "file": "vintage_vice_city_pack_vapid_stanier_01.jpg", "focus": 0.5, "fx": "whip", "dir": -1}),
    (cue("capítulo") - 0.5, {"kind": "shot", "file": "ultimate_edition_rideout_customs_01.jpg", "focus": 0.55, "fx": "parallax", "open": True, "caption": "O PRÓXIMO GRANDE CAPÍTULO"}),
    # FINAL PROFISSIONAL
    (cue("quinta") - 0.1, {"kind": "date"}),
    (cue("nova", 86) - 0.5, {"kind": "title"}),
    (cue("e", 88.3) - 0.1, {"kind": "card", "lines": ["VOCÊ ESTÁ PREPARADO", "PARA O QUE VEM DEPOIS?"]}),
    (cue("aqui") - 0.15, {"kind": "logo", "outro": True, "tagAt": fr(cue("essa", 95)) - fr(cue("aqui") - 0.15)}),
]
END = words[-1][2] + 2.6

out = []
for k, (t, seg) in enumerate(S):
    a = fr(t)
    b = fr(S[k + 1][0]) if k + 1 < len(S) else fr(END)
    out.append({**seg, "dur": b - a})
assert all(s["dur"] > 15 for s in out), [(s["kind"], s["dur"]) for s in out if s["dur"] <= 15]
files = [s["file"] for s in out if "file" in s] + [f for s in out for f, _ in s.get("flashes", [])] + [p["file"] for s in out for p in s.get("panels", [])]
assert len(files) == len(set(files)), "mídia repetida"
json.dump({"voStart": VO, "segments": out, "voice": [[fr(s), fr(e)] for _, s, e in words], "words": [[w, fr(s), fr(e)] for w, s, e in words]}, open(sys.argv[2], "w"), indent=1, ensure_ascii=False)
print(len(out), "segmentos,", sum(s["dur"] for s in out), "frames =", round(sum(s["dur"] for s in out) / FPS, 1), "s")
for s in out[:4]:
    print(s["kind"], s["dur"])
