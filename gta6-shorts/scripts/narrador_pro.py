#!/usr/bin/env python3
"""Narrador "pro" gratuito (voz neural pt-BR Antonio via edge-tts) quando o ElevenLabs está sem créditos.
Uso: python3 scripts/narrador_pro.py roteiro.json saida.mp3
roteiro.json: [[inicio_s, "frase", "+12%", "-6Hz"], ...] (inicio = onde a frase começa na timeline)
Gera cada frase com ritmo/tom próprios, recorta silêncios, posiciona na timeline e aplica cadeia de estúdio
(EQ corpo/presença, compressão, limitador, loudnorm -20 LUFS). Requer: pip install edge-tts; proxy/CA do ambiente."""
import json, os, subprocess, sys, tempfile
lines = json.load(open(sys.argv[1])); out = sys.argv[2]
env = dict(os.environ, SSL_CERT_FILE=os.environ.get('SSL_CERT_FILE', '/root/.ccr/ca-bundle.crt'))
tmp = tempfile.mkdtemp()
ends = [l[0] for l in lines[1:]] + [lines[-1][0] + 30]
parts = []
for i, (st, t, r, p) in enumerate(lines):
    mp3, wav = f'{tmp}/l{i}.mp3', f'{tmp}/l{i}.wav'
    cmd = ['edge-tts', '--voice', 'pt-BR-AntonioNeural', f'--rate={r}', f'--pitch={p}', '--text', t, '--write-media', mp3]
    if os.environ.get('HTTPS_PROXY'): cmd[1:1] = ['--proxy', os.environ['HTTPS_PROXY']]
    subprocess.run(cmd, env=env, check=True, capture_output=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', mp3, '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse', '-ar', '48000', '-ac', '1', wav], check=True)
    d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', wav], capture_output=True, text=True).stdout)
    slot = ends[i] - st - 0.12
    if d > slot:
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', wav, '-af', f'atempo={min(1.25, d / slot):.4f}', wav + '.t.wav'], check=True); os.replace(wav + '.t.wav', wav)
    parts.append((st, wav))
inputs, fc = [], []
for k, (st, fn) in enumerate(parts):
    inputs += ['-i', fn]; ms = int(st * 1000); fc.append(f'[{k}]adelay={ms}|{ms}[a{k}]')
fc.append(''.join(f'[a{k}]' for k in range(len(parts))) + f'amix=inputs={len(parts)}:normalize=0[m]')
subprocess.run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', ';'.join(fc), '-map', '[m]', f'{tmp}/raw.wav'], check=True)
chain = 'highpass=f=75,equalizer=f=140:t=q:w=0.9:g=3,equalizer=f=320:t=q:w=1.2:g=-2.5,equalizer=f=3200:t=q:w=1.0:g=3,equalizer=f=7000:t=q:w=1.5:g=-2,acompressor=threshold=-20dB:ratio=3.5:attack=5:release=80:makeup=4,alimiter=limit=0.89,loudnorm=I=-20:TP=-1.5:LRA=7'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{tmp}/raw.wav', '-af', chain, '-ar', '44100', '-ac', '1', '-b:a', '192k', out], check=True)
print('ok ->', out)
