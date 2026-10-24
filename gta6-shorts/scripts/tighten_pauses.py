import subprocess, re, json, sys
A, out, mapout = sys.argv[1], sys.argv[2], sys.argv[3]
log = subprocess.run(["ffmpeg","-hide_banner","-i",A,"-af","silencedetect=n=-38dB:d=0.36","-f","null","-"],capture_output=True,text=True).stderr
st=[float(x) for x in re.findall(r"silence_start: ([\d.]+)",log)]; en=[float(x) for x in re.findall(r"silence_end: ([\d.]+)",log)]
dur=float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",A],capture_output=True,text=True).stdout)
KEEP=0.30
segs=[]; cur=0.0
for s,e in zip(st,en):
    if s<0.1: continue
    mid_cut_start = s + KEEP/2; mid_cut_end = e - KEEP/2
    segs.append((cur, mid_cut_start)); cur = mid_cut_end
segs.append((cur,dur))
# mapping old->new
mp=[]; t=0
for a,b in segs: mp.append({"oldStart":a,"oldEnd":b,"newStart":t}); t+=b-a
json.dump(mp,open(mapout,"w"),indent=1)
parts="".join(f"[0:a]atrim={a:.4f}:{b:.4f},asetpts=PTS-STARTPTS,afade=t=in:d=0.01,afade=t=out:st={b-a-0.012:.4f}:d=0.012[s{i}];" for i,(a,b) in enumerate(segs))
fc=parts+"".join(f"[s{i}]" for i in range(len(segs)))+f"concat=n={len(segs)}:v=0:a=1,highpass=f=80,lowpass=f=15000,acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=2,aresample=48000[o]"
subprocess.run(["ffmpeg","-v","error","-y","-i",A,"-filter_complex",fc,"-map","[o]","-ac","2","-c:a","pcm_s16le",out],check=True)
print("old",dur,"new",t,"cuts",len(segs)-1)
