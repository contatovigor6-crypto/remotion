"""Gera out/legendas-ptbr.srt a partir de src/data/words.ts (frases curtas, <= 42 caracteres)."""
import json, re, sys
src = open(sys.argv[1]).read()
words = json.loads(src[src.index("= [") + 2: src.rindex("]") + 1])
cues, cur = [], []
def flush():
    if cur: cues.append((cur[0]["start"], cur[-1]["end"], " ".join(w["text"] for w in cur)))
    cur.clear()
for w in words:
    glued = cur and cur[-1]["text"] == "GTA"
    if cur and not glued and (len(" ".join(x["text"] for x in cur)) + len(w["text"]) > 42 or w["start"] - cur[-1]["end"] > 0.4):
        flush()
    cur.append(w)
    if re.search(r"[.?!]$", w["text"]) or (w["text"].endswith(",") and len(" ".join(x["text"] for x in cur)) > 18): flush()
flush()
ts = lambda s: f"{int(s//3600):02d}:{int(s%3600//60):02d}:{int(s%60):02d},{int(round(s%1*1000)):03d}".replace(",1000", ",999")
with open(sys.argv[2], "w") as f:
    for i, (a, b, t) in enumerate(cues, 1):
        nxt = cues[i][0] if i < len(cues) else b + 1
        f.write(f"{i}\n{ts(a)} --> {ts(min(b + 0.15, nxt - 0.02))}\n{t}\n\n")
print(len(cues), "cues")
