"""Converte a transcrição (faster-whisper, word timestamps) em src/data/words.ts.
Aplica correções revisadas manualmente sem alterar o sentido da fala."""
import json, sys
src, dst = sys.argv[1], sys.argv[2]
words = []
for seg in json.load(open(src)):
    for w in seg["words"]:
        words.append({"text": w["w"].strip(), "start": round(w["s"], 3), "end": round(w["e"], 3)})
words = [w for w in words if w["text"]]
# Revisão: "Comenta, eu teria coragem" é a frase que o espectador deve comentar.
for i, w in enumerate(words):
    if w["text"] == "Comenta,":
        w["text"] = "Comenta"
        words[i + 1]["text"] = "“eu"
        words[i + 3]["text"] = "coragem”"
    # Grafia oficial do nome da personagem
    if w["text"].startswith("Lúcia"):
        w["text"] = w["text"].replace("Lúcia", "Lucia")
    # Grafia oficial dos presidentes fictícios de Red Dead Redemption 2
    if w["text"] == "Fadius":
        w["text"] = "Thaddeus"
    # Grafia oficial: Brian Heder (Whisper ouve "Heather")
    if w["text"].startswith("Heather") and i > 0 and words[i - 1]["text"] == "Brian":
        w["text"] = w["text"].replace("Heather", "Heder")
    if w["text"].startswith("Harden"):
        w["text"] = w["text"].replace("Harden", "Hardin")
    if w["text"] == "vivo" and words[i+1]["text"] == "mesmo":
        w["text"] = "vivo,"
# Nomes próprios citados na narração (grafia oficial)
FIX = {"Ed": "Edge", "Ed,": "Edge,", "WANK,": "WAINK,", "Garbitt": "Garbut", "Garbott,": "Garbut,", "Garbott": "Garbut", "Leônida.": "Leonida.", "Leônida": "Leonida",
       "Playstation": "PlayStation", "XS.": "X|S.", "Taemin": "Tame", "Pala,": "Impala,"}
for w in words:
    w["text"] = FIX.get(w["text"], w["text"])
for i in range(len(words) - 1):
    if words[i]["text"] == "Gesavel" and words[i + 1]["text"].startswith("Stein"):
        words[i] = {"text": "Gesaffelstein" + words[i + 1]["text"][5:], "start": words[i]["start"], "end": words[i + 1]["end"]}
        del words[i + 1]
        break
# Nome do canal dito na narração ("Zone GTA VI") -> grafia oficial
for i in range(len(words) - 2):
    if words[i]["text"] == "Zone" and words[i + 1]["text"] == "GTA" and words[i + 2]["text"].rstrip(".,") in ("V", "VI", "6", "V1"):
        end = words[i + 2]["text"][-1] if words[i + 2]["text"][-1] in ".," else ""
        words[i] = {"text": "ZoneGTAVI" + end, "start": words[i]["start"], "end": words[i + 2]["end"]}
        del words[i + 1:i + 3]
        break
with open(dst, "w") as f:
    f.write("// Gerado por scripts/build_words.py — tempos em segundos na voz editada (public/audio/voice.wav)\n")
    f.write("export type Word = {text: string; start: number; end: number};\n")
    f.write("export const WORDS: Word[] = " + json.dumps(words, ensure_ascii=False, indent=1) + ";\n")
print(len(words), "words")
