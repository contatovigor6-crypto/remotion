#!/usr/bin/env python3
"""PRODUÇÃO EM SÉRIE de Shorts de GTA 6 (estilo clássico do ZoneGTAVI) — um comando por vídeo.

Uso:  python3 scripts/serie.py plans/<slug>.json [--etapa voz|spec|render|tudo]

O plano (plans/<slug>.json) tem só o que muda de um vídeo para outro: roteiro (falas + mídia oficial de cada fala + selos),
trilha, thumbnail e textos de publicação. A esteira faz o resto, sempre igual:
  1. narração "narrador pro" (edge-tts pt-BR Antonio, ritmo/tom por fala, cadeia de estúdio)  -> public/serie/<slug>/voice.mp3
  2. transcrição (faster-whisper) + alinhamento com o TEXTO DO ROTEIRO (legenda com a grafia certa, sem correção manual)
  3. montagem automática: cortes por fala, Ken Burns alternado, transições variadas, punch-ins nas palavras-chave,
     SFX nos cortes/impactos, tremidas, selos, ProOutro no "Comenta"                     -> public/serie/<slug>/spec.json
  4. trilha Kevin MacLeod (CC BY) inédita, recortada e com ganho calculado para o nível padrão do canal (~-36 dB)
  5. render (GTA6Serie) + masterização + QC (logo em 100% dos quadros, quadros pretos, nível da trilha)
  6. entrega em /home/user/EXPORTADO: vídeo, -leve, -mini, .srt, THUMB vertical (sem logo) e PUBLICACAO-<slug>.txt
  7. registra música e mídia usadas (MUSICAS-USADAS.md / IMAGENS-USADAS.md)
Cada etapa reaproveita o que já existe (rodar de novo após ajustar o plano só refaz o necessário: apague o arquivo da etapa).
"""
import difflib, json, os, re, subprocess, sys, unicodedata

ROOT = '/home/user/remotion/gta6-shorts'
EXP = '/home/user/EXPORTADO'
S = '/tmp/claude-0/-home-user/83ad95ed-b7b0-5ec2-b00c-ebf6e84941a1/scratchpad'
BROWSER = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell'
COLORS = {'yellow': '#FFD84A', 'pink': '#FF3E9A', 'red': '#FF2D3D', 'cyan': '#38E1FF', 'purple': '#7B3CFF', 'orange': '#FF9A3C', 'green': '#2BD96B', 'white': '#FFFFFF'}
GAP = 0.42
MAX_DUR = 59.5
os.chdir(ROOT)
os.environ.setdefault('SSL_CERT_FILE', '/root/.ccr/ca-bundle.crt')


def sh(cmd, **kw):
    print('$', cmd if isinstance(cmd, str) else ' '.join(cmd), flush=True)
    return subprocess.run(cmd, shell=isinstance(cmd, str), check=True, **kw)


def dur(path):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path], capture_output=True, text=True, check=True).stdout)


def norm(s):
    s = unicodedata.normalize('NFD', s.lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]', '', s)


plan_path = sys.argv[1]
etapa = sys.argv[sys.argv.index('--etapa') + 1] if '--etapa' in sys.argv else 'tudo'
P = json.load(open(plan_path))
slug = P['slug']
D = f'public/serie/{slug}'
W = f'{S}/serie-{slug}'
os.makedirs(D, exist_ok=True)
os.makedirs(W, exist_ok=True)
os.makedirs(f'{S}/tmp', exist_ok=True)
lines = P['lines']

# ------------------------------------------------------------------ checagens do plano
used_music = open('MUSICAS-USADAS.md').read()
mname = P['music']['name']
if f'**{mname}**' in used_music and not os.path.exists(f'{D}/music.wav'):
    sys.exit(f'ERRO: a trilha "{mname}" já foi usada (MUSICAS-USADAS.md). Escolha outra.')
for ln in lines:
    for m in ln['media']:
        src = m if isinstance(m, str) else m['src']
        if not os.path.exists(f'public/{src}'):
            sys.exit(f'ERRO: mídia não encontrada: public/{src}')
tags_all = P['pub']['hashtags']
if len(tags_all) > 15 or tags_all[0] != '#GTA6' or tags_all[-1] != '#Shorts':
    sys.exit('ERRO: hashtags da descrição: no máximo 15, começando com #GTA6 e terminando com #Shorts.')

# ------------------------------------------------------------------ 1. narração
voice = f'{D}/voice.mp3'
if P.get('voice_file') and not os.path.exists(voice):
    # áudio enviado pelo dono do canal (ex.: ElevenLabs Marcio): usado como veio, sem cortar/acelerar
    sh(['cp', P['voice_file'], voice])
if not os.path.exists(voice):
    starts, t = [], 0.15
    for i, ln in enumerate(lines):
        mp3, wav = f'{W}/l{i}.mp3', f'{W}/l{i}.wav'
        sh(['edge-tts', '--proxy', os.environ['HTTPS_PROXY'], '--voice', 'pt-BR-AntonioNeural', f"--rate={ln.get('rate', '+8%')}", f"--pitch={ln.get('pitch', '+0Hz')}", '--text', ln.get('say', ln['text']), '--write-media', mp3], capture_output=True)
        sh(['ffmpeg', '-v', 'error', '-y', '-i', mp3, '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse', wav])
        starts.append(round(t, 2))
        t += dur(wav) + GAP
    json.dump([[s, ln.get('say', ln['text']), ln.get('rate', '+8%'), ln.get('pitch', '+0Hz')] for s, ln in zip(starts, lines)], open(f'{W}/roteiro.json', 'w'), ensure_ascii=False)
    json.dump(starts, open(f'{D}/starts.json', 'w'))
    sh(['python3', 'scripts/narrador_pro.py', f'{W}/roteiro.json', voice])
starts = json.load(open(f'{D}/starts.json')) if os.path.exists(f'{D}/starts.json') else None
vdur = dur(voice)

# ------------------------------------------------------------------ 2. transcrição + alinhamento com o roteiro
raw = f'{D}/raw.json'
if not os.path.exists(raw):
    sh(['ffmpeg', '-v', 'error', '-y', '-i', voice, '-ar', '16000', '-ac', '1', '-f', 'f32le', f'{W}/v.f32'])
    sh(['python3', 'scripts/transcribe.py', f'{W}/v.f32', raw])
heard = [{'n': norm(w['w']), 's': w['s'], 'e': w['e']} for seg in json.load(open(raw)) for w in seg['words'] if norm(w['w'])]
toks = []  # (texto exibido, índice da fala)
for i, ln in enumerate(lines):
    for tk in ln['text'].split():
        toks.append((tk, i))
A = [norm(t) for t, _ in toks]
B = [h['n'] for h in heard]
times = [None] * len(toks)
for blk in difflib.SequenceMatcher(None, A, B, autojunk=False).get_matching_blocks():
    for k in range(blk.size):
        times[blk.a + k] = (heard[blk.b + k]['s'], heard[blk.b + k]['e'])
if starts is None:
    # áudio pronto: início de cada fala = 1ª palavra reconhecida dela (recuada pelo nº de palavras antes dela)
    starts = []
    for i in range(len(lines)):
        idx = [k for k, (_, li) in enumerate(toks) if li == i]
        first = next((k for k in idx if times[k] is not None), None)
        starts.append(0.0 if i == 0 else round(max(0.0, (times[first][0] if first is not None else starts[-1] + 1) - 0.3 * (first - idx[0] if first is not None else 0)), 2))
    json.dump(starts, open(f'{D}/starts.json', 'w'))
# palavras não reconhecidas: distribui no intervalo entre vizinhas (dentro da fala)
for i, ln in enumerate(lines):
    idx = [k for k, (_, li) in enumerate(toks) if li == i]
    lo_line, hi_line = starts[i], (starts[i + 1] - GAP + 0.05 if i + 1 < len(lines) else vdur)
    k = 0
    while k < len(idx):
        if times[idx[k]] is not None:
            k += 1
            continue
        j = k
        while j < len(idx) and times[idx[j]] is None:
            j += 1
        a = times[idx[k - 1]][1] if k > 0 else lo_line
        b = times[idx[j]][0] if j < len(idx) else hi_line
        n = j - k
        for q in range(n):
            times[idx[k + q]] = (a + (b - a) * q / n, a + (b - a) * (q + 1) / n)
        k = j
words = [{'text': t, 'start': round(times[k][0], 3), 'end': round(times[k][1], 3)} for k, (t, _) in enumerate(toks)]
miss = sum(1 for k in range(len(toks)) if A[k] not in B)
print(f'alinhamento: {len(words)} palavras, {miss} não reconhecidas pelo whisper (tempo interpolado)')
line_words = [[w for w, (_, li) in zip(words, toks) if li == i] for i in range(len(lines))]

# ------------------------------------------------------------------ 3. montagem automática
com = next((w for w in line_words[-1] if norm(w['text']).startswith('comenta')), line_words[-1][0])
outro_at = round(com['start'] - 0.05, 2)
duration = round(min(MAX_DUR, max(outro_at + 9.0, vdur + 1.0)), 2)
kw_extra = {norm(k) for k in P.get('keywords', [])}
keywords = set()
for i, lw in enumerate(line_words):
    for j, w in enumerate(lw):
        n = norm(w['text'])
        if re.search(r'\d', w['text']) or n in kw_extra or (j > 0 and w['text'][:1].isupper() and n not in ('gta',)):
            keywords.add(w['text'].lower())
keywords |= {'gta', '6'}
TRANS = ['whipL', 'flash', 'whipR', 'zoom', 'glitch', 'whipL', 'flash', 'whipR', 'dip']
shots, sfx, shakes, tags = [], [], [], []
sid = 0
for i, ln in enumerate(lines):
    a = 0.0 if i == 0 else round(starts[i] - 0.12, 2)
    b = round(starts[i + 1] - 0.12, 2) if i + 1 < len(lines) else duration
    if i == len(lines) - 1:
        b = duration
    media = ln['media']
    n = len(media)
    lw = line_words[i]
    # pontos de corte: no início da palavra mais próxima da divisão igual
    cuts = [a]
    for q in range(1, n):
        target = a + (b - a) * q / n
        cuts.append(round(min(lw, key=lambda w: abs(w['start'] - target))['start'] - 0.04, 2) if lw else round(target, 2))
    cuts.append(b)
    for q, m in enumerate(media):
        m = {'src': m} if isinstance(m, str) else m
        fr_, to_ = cuts[q], cuts[q + 1]
        if to_ - fr_ < 0.3:
            continue
        zin = sid % 2 == 0
        f0 = m.get('focus', [0.5, 0.5])
        shot = {'id': chr(65 + sid % 26) + str(sid // 26), 'from': fr_, 'to': to_, 'src': m['src'], 'focus0': f0, 'focus1': m.get('focus1', f0),
                's0': m.get('s0', 1.05 if zin else 1.22), 's1': m.get('s1', 1.2 if zin else 1.06),
                'inT': 'cut' if sid == 0 else (TRANS[i % len(TRANS)] if q == 0 else 'cut'), 'look': m.get('look', 'base' if i else 'dark'),
                'punches': [w['start'] for w in lw if fr_ <= w['start'] < to_ and w['text'].lower() in keywords and re.search(r'\d', w['text'])][:2],
                'note': ln['text'][:60]}
        if m['src'].endswith('.mp4'):
            shot['video'] = True
            cd = dur(f"public/{m['src']}") - m.get('startFrom', 0)
            rate = m.get('rate', 1.0)
            if cd / rate < (to_ - fr_):
                rate = max(0.5, cd / (to_ - fr_))
                if cd / rate < (to_ - fr_):
                    shot['freezeAt'] = round(fr_ + cd / rate - 0.1, 2)
            shot['rate'] = round(rate, 3)
            if 'startFrom' in m:
                shot['startFrom'] = m['startFrom']
        else:
            shot['live'] = True
        if m.get('fit'):
            shot['fit'] = True
        shots.append(shot)
        if sid > 0:
            sfx.append({'at': round(fr_ - 0.02, 2), 'file': 'sfx-whoosh' if q == 0 else 'sfx-pop', 'vol': 0.3})
        sid += 1
    if ln.get('impact'):
        at = lw[0]['start'] if lw else a
        sfx.append({'at': round(at, 2), 'file': 'sfx-impact', 'vol': 0.45})
        shakes.append({'at': round(at, 2), 'amp': 14})
    for tg in ln.get('tags', []):
        w0 = next((w for w in lw if norm(tg['word']) in norm(w['text'])), lw[0] if lw else None)
        at = round(w0['start'], 2) if w0 else a
        tags.append({'at': at, 'to': round(min(b, outro_at) - 0.05, 2), 'text': tg['text'], 'color': COLORS.get(tg.get('color', 'yellow'), tg.get('color')), 'kind': tg.get('kind', 'pill')})
        sfx.append({'at': at, 'file': {'stamp': 'sfx-impact', 'big': 'sfx-impact'}.get(tg.get('kind', 'pill'), 'sfx-pop'), 'vol': 0.4})
        if tg.get('kind') in ('stamp', 'big'):
            shakes.append({'at': at, 'amp': 12})
# selos que dividem a mesma área (pill/stamp embaixo; big em cima) não se sobrepõem: cada um sai quando o próximo entra
tags.sort(key=lambda t: t['at'])
for grp in (('pill', 'stamp'), ('big',)):
    g_ = [t for t in tags if t['kind'] in grp]
    for k_, t1 in enumerate(g_):
        nxt = g_[k_ + 1]['at'] - 0.05 if k_ + 1 < len(g_) else outro_at - 0.05
        t1['to'] = round(min(max(t1['to'], t1['at'] + 1.8), nxt, outro_at - 0.05), 2)
tags = [t for t in tags if t['to'] - t['at'] > 0.4]
sfx = [{'at': 0.02, 'file': 'sfx-impact', 'vol': 0.5}] + sfx + [
    {'at': round(outro_at + 0.02, 2), 'file': 'sfx-impact', 'vol': 0.5}, {'at': round(outro_at + 0.04, 2), 'file': 'sfx-subdrop', 'vol': 0.35},
    {'at': round(outro_at + 0.5, 2), 'file': 'sfx-typing', 'vol': 0.25}, {'at': round(outro_at + 1.6, 2), 'file': 'sfx-tick', 'vol': 0.45},
    {'at': round(outro_at + 1.93, 2), 'file': 'sfx-notify', 'vol': 0.4}, {'at': round(outro_at + 2.33, 2), 'file': 'sfx-pop', 'vol': 0.4}]
shakes = [{'at': 0.3, 'amp': 14}] + shakes

# ------------------------------------------------------------------ 4. trilha
music_wav = f'{D}/music.wav'
mu = P['music']
if not os.path.exists(music_wav):
    rawm = f".cache/raw/{mu['file']}"
    if not os.path.exists(rawm):
        sh(['curl', '-sfL', '-m', '120', f"https://incompetech.com/music/royalty-free/mp3-royaltyfree/{mu['file'].replace('_', '%20')}", '-o', rawm])
    sh(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-ss', str(mu.get('offset', 0)), '-i', rawm, '-af', f"aresample=48000,afade=t=in:d=0.05,apad,atrim=0:{duration},afade=t=out:st={duration - 2.2}:d=2.2", '-ac', '2', music_wav])
band = float(re.search(r'mean_volume: (-?[\d.]+)', subprocess.run(['ffmpeg', '-nostdin', '-i', music_wav, '-af', 'highpass=f=300,lowpass=f=4000,volumedetect', '-f', 'null', '/dev/null'], capture_output=True, text=True).stderr).group(1))
gain = round(10 ** ((-36 + 14.4 - band) / 20), 3)
gain = round(gain * P['music'].get('ajuste', 1.0), 3)

spec = {'slug': slug, 'duration': duration, 'outroAt': outro_at, 'voice': f'serie/{slug}/voice.mp3', 'music': f'serie/{slug}/music.wav', 'musicGain': gain,
        'words': words, 'keywords': sorted(keywords), 'hidden': [[outro_at, duration]], 'shots': shots, 'sfx': sfx, 'shakes': shakes, 'tags': tags,
        'credit': P.get('credit', 'Imagens: Rockstar Games')}
json.dump(spec, open(f'{D}/spec.json', 'w'), ensure_ascii=False, indent=1)
th = dict(P['thumb'])
th['hlColor'] = COLORS.get(th.get('hlColor', 'yellow'), th.get('hlColor'))
th.setdefault('pos', '50% 50%')
th.setdefault('bottom', '')
th.setdefault('credit', 'IMAGEM OFICIAL: ROCKSTAR GAMES')
json.dump(th, open(f'{D}/thumb.json', 'w'), ensure_ascii=False)
print(f'spec ok: {duration}s, outro em {outro_at}s, {len(shots)} cortes, {len(tags)} selos, trilha ganho {gain}')
if etapa in ('voz', 'spec'):
    sys.exit(0)

# ------------------------------------------------------------------ 5. render + master + QC
draft = f'out/serie-{slug}.mp4'
final = f'{EXP}/gta6-{slug}.mp4'
props = json.dumps({'slug': slug, 'spec': None, 'music': None, 'musicGain': None})
env = dict(os.environ, TMPDIR=f'{S}/tmp')
if not os.path.exists(final):
    sh(['npx', 'remotion', 'render', 'GTA6Serie', draft, f'--props={props}', '--concurrency=4', f'--browser-executable={BROWSER}'], env=env)
    sh(f'rm -rf -- "{S}"/tmp/remotion-*')
    sh(['bash', 'scripts/finalize.sh', draft, final], env=dict(env, TARGET='none'))
    os.remove(draft)
qc = subprocess.run(['python3', '-I', 'scripts/check_watermark.py', final, 'public/brand/zonegtavi-logo.png'], capture_output=True, text=True).stdout.strip().splitlines()[-1]
blacks = subprocess.run(['ffmpeg', '-i', final, '-vf', 'blackdetect=d=0.1:pix_th=0.05', '-an', '-f', 'null', '-'], capture_output=True, text=True).stderr.count('black_start')
F = 'highpass=f=300,lowpass=f=4000,aresample=8000,aformat=channel_layouts=mono:sample_fmts=flt'
sh(['ffmpeg', '-v', 'error', '-y', '-i', final, '-t', str(outro_at), '-af', F, '-f', 'f32le', f'{W}/mix.f32'])
sh(['ffmpeg', '-v', 'error', '-y', '-i', music_wav, '-t', str(outro_at), '-af', F, '-f', 'f32le', f'{W}/mus.f32'])
import numpy as np
mx, mm = np.fromfile(f'{W}/mix.f32', np.float32), np.fromfile(f'{W}/mus.f32', np.float32)
nn = min(len(mx), len(mm))
g = float(np.dot(mx[:nn], mm[:nn]) / np.dot(mm[:nn], mm[:nn]))
level = 20 * np.log10(np.sqrt(np.mean((g * mm[:nn]) ** 2)) + 1e-12)
print(f'QC: {qc} | quadros pretos: {blacks} | trilha na mixagem: {level:.1f} dB (alvo -36)')
if abs(level + 36) > 1.0:
    # corrige o nível da trilha sem re-renderizar os quadros: render só de áudio com o ganho ajustado + troca da faixa
    gain2 = round(float(gain * 10 ** ((-36 - level) / 20)), 3)
    print(f'ajustando trilha: ganho {gain} -> {gain2}')
    ap = json.dumps({'slug': slug, 'spec': None, 'music': None, 'musicGain': gain2})
    sh(['npx', 'remotion', 'render', 'GTA6Serie', f'{W}/audio.wav', f'--props={ap}', '--config=remotion.audio.config.ts', '--concurrency=1', f'--browser-executable={BROWSER}'], env=env)
    sh(f'rm -rf -- "{S}"/tmp/remotion-*')
    sh(['ffmpeg', '-v', 'error', '-y', '-i', final, '-i', f'{W}/audio.wav', '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k', '-ar', '48000', '-movflags', '+faststart', f'{W}/fix.mp4'])
    os.replace(f'{W}/fix.mp4', final)
    spec['musicGain'] = gain2
    json.dump(spec, open(f'{D}/spec.json', 'w'), ensure_ascii=False, indent=1)
    sh(['ffmpeg', '-v', 'error', '-y', '-i', final, '-t', str(outro_at), '-af', F, '-f', 'f32le', f'{W}/mix.f32'])
    mx = np.fromfile(f'{W}/mix.f32', np.float32)
    nn = min(len(mx), len(mm))
    g = float(np.dot(mx[:nn], mm[:nn]) / np.dot(mm[:nn], mm[:nn]))
    level = 20 * np.log10(np.sqrt(np.mean((g * mm[:nn]) ** 2)) + 1e-12)
    print(f'trilha após ajuste: {level:.1f} dB')

# ------------------------------------------------------------------ 6. entrega
sh(['ffmpeg', '-v', 'error', '-y', '-i', final, '-vf', 'scale=720:1280', '-c:v', 'libx264', '-crf', '27', '-maxrate', '3M', '-bufsize', '6M', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', f'{EXP}/gta6-{slug}-mini.mp4'])
sh(['ffmpeg', '-v', 'error', '-y', '-i', final, '-c:v', 'libx264', '-crf', '23', '-maxrate', '6M', '-bufsize', '12M', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', f'{EXP}/gta6-{slug}-leve.mp4'])
open(f'{W}/words.ts', 'w').write('export const WORDS = ' + json.dumps(words, ensure_ascii=False) + ';\n')
sh(['python3', 'scripts/make_srt.py', f'{W}/words.ts', f'{EXP}/gta6-{slug}.srt'])
thumb = f'{EXP}/THUMB-gta6-{slug}-vertical.png'
sh(['npx', 'remotion', 'still', 'ThumbSerie', thumb, f"--props={json.dumps({'slug': slug, 'thumb': None})}", f'--browser-executable={BROWSER}'], env=env)
sh(f'rm -rf -- "{S}"/tmp/remotion-*')
pb = P['pub']
txt = f"""PUBLICAÇÃO — "{P['tema']}" (ZoneGTAVI)

=== TÍTULO (até 100 caracteres) ===
{pb['titulo']}

Alternativas (teste A/B):
""" + ''.join(f'- {a}\n' for a in pb.get('alternativas', [])) + f"""
=== DESCRIÇÃO ===
{pb['descricao'].strip()}

Fontes: {pb['fontes']}
Imagens: {pb.get('imagens', 'imagens e vídeos oficiais de GTA VI — Rockstar Games.')}
Narração: voz sintética.

Música: "{mname}" Kevin MacLeod (incompetech.com)
Licensed under Creative Commons: By Attribution 4.0 License
http://creativecommons.org/licenses/by/4.0/

{' '.join(tags_all)}

=== HASHTAGS ===
{pb['hashtags_curtas']}

=== TAGS (campo "Tags" do YouTube Studio) ===
{pb['tags']}

=== COMENTÁRIO FIXADO ===
{pb['fixado'].strip()}

=== QUANDO POSTAR ===
{pb.get('quando', '- Hoje, entre 18h e 20h (Brasília); responder os primeiros comentários na primeira hora.')}
"""
open(f'{EXP}/PUBLICACAO-gta6-{slug}.txt', 'w').write(txt)

# ------------------------------------------------------------------ 7. registros
if f'**{mname}**' not in used_music:
    open('MUSICAS-USADAS.md', 'a').write(f"| **Short (série) — {P['tema']}** | **{mname}** | Kevin MacLeod, CC BY 4.0 |\n")
media_used = sorted({(m if isinstance(m, str) else m['src']) for ln in lines for m in ln['media']} | {P['thumb']['bg']})
reg = open('IMAGENS-USADAS.md').read()
if f'## Short (série) — {P["tema"]}' not in reg:
    open('IMAGENS-USADAS.md', 'a').write(f"\n## Short (série) — {P['tema']}\n- " + ', '.join(media_used) + '\n')
for fn in ('MUSICAS-USADAS.md', 'IMAGENS-USADAS.md', 'PREFERENCIAS-CANAL.md'):
    sh(['cp', fn, EXP])
print(f'\nPRONTO: {final}\n  QC: {qc} | pretos: {blacks} | trilha {level:.1f} dB')
