# GTA 6 · YouTube Shorts (Remotion + FFmpeg)

Composições: `GTA6Parado` ("1 hora parado") e `GTA6Preso` ("Você pode ser preso de verdade?").

## GTA6Preso

- Narração original (ElevenLabs) usada **sem alteração** (`public/v2/voice.mp3`, ganho unitário, sem limiter).
- Assets: `./scripts/fetch-assets-preso.sh` (clipes 60 fps e pôsteres verticais oficiais).
- Trilha: `python3 scripts/synth_audio.py public/audio preso`.
- Dados: `src/preso/` (plano de cortes, SFX, destaques, overlays: estrelas de procurado, sirene, grades, minimapa, ficha, enquete).
- Export: `npx remotion render GTA6Preso out/preso-draft.mp4 && TARGET=none ./scripts/finalize.sh out/preso-draft.mp4 EXPORTADO/gta6-preso-de-verdade.mp4`.

## GTA6Parado

Pipeline de edição programática (Remotion + FFmpeg) para um Short vertical de alta retenção
construído sobre a narração do autor.

**Saída:** `out/gta6-parado-1h.mp4` — 1080×1920, 30 fps, H.264 (yuv420p) + AAC 320 kb/s estéreo,
-14 LUFS integrado, true peak ≤ -1.5 dBTP. Legendas fechadas: `out/legendas-ptbr.srt`.

## Estrutura

| Arquivo | Função |
|---|---|
| `src/data/words.ts` | Transcrição revisada com tempo por palavra (gerada por `scripts/build_words.py`) |
| `src/data/shots.ts` | **Plano de montagem**: cada plano, a fala que ilustra, enquadramento, câmera, transição |
| `src/data/sfx.ts` | Posição/volume de cada efeito sonoro |
| `src/components/ShotView.tsx` | Reenquadramento 16:9→9:16 por ponto de foco, Ken Burns, punch-ins, whip/zoom/glitch/flash/dip, looks de cor, freeze-frame |
| `src/components/Captions.tsx` | Legendas cinéticas palavra a palavra (destaques seletivos, área segura do Shorts) |
| `src/components/Hud.tsx` | HUD do experimento (REC + cronômetro do jogo que chega a 01:00:00 em "uma hora") |
| `src/components/Overlays.tsx` | Motion design semântico (logo, cronômetro, checklist, pin, radar, alerta, tela dividida, tracking, ECG, selo "ainda não testado", controle, balão de comentário, data oficial) |
| `src/Video.tsx` | Composição final: camadas, shake nos impactos, mix (ducking da trilha sob a voz) |
| `scripts/` | Transcrição, corte de pausas, síntese de trilha/SFX, download de assets, SRT, finalização |

## Reproduzir

```bash
npm install
pip install faster-whisper scipy numpy

# 1. Voz: limita pausas a 0,30 s + passa-alta/compressão leve
python3 scripts/tighten_pauses.py <narracao.mp3> public/audio/voice.wav /tmp/timemap.json
# 2. Transcrição com tempo por palavra (modelo medium, pt) -> src/data/words.ts
ffmpeg -i public/audio/voice.wav -ac 1 -ar 16000 -f f32le /tmp/v16.f32
python3 scripts/transcribe.py /tmp/v16.f32 scripts/words.raw.json
python3 scripts/build_words.py scripts/words.raw.json src/data/words.ts
# 3. Imagens e clipes oficiais (rockstargames.com/VI) -> public/img, public/video
./scripts/fetch-official-assets.sh
# 4. Trilha e SFX sintetizados (100% originais) -> public/audio
python3 scripts/synth_audio.py public/audio
# Granulação de filme -> public/fx
./scripts/make_grain.sh
# 5. Render + masterização
npx remotion render GTA6Parado out/draft.mp4
./scripts/finalize.sh out/draft.mp4 out/gta6-parado-1h.mp4
python3 scripts/make_srt.py src/data/words.ts out/legendas-ptbr.srt
```

Em ambientes sem o Chrome do Remotion, acrescente `--browser-executable=<caminho do chrome-headless-shell>`.

Pré-visualizar/editar: `npx remotion studio`.

## Para o próximo vídeo

1. Troque a narração e rode os passos 1–2.
2. Reescreva `src/data/shots.ts` (um plano por ideia da fala) e `src/data/sfx.ts`.
3. Ajuste os overlays em `Overlays.tsx` (a função `At` posiciona cada um no tempo).
4. Ajuste os marcos do arranjo no topo de `scripts/synth_audio.py`.

## Direitos

- **Narração:** do autor.
- **Trilha e efeitos sonoros:** sintetizados do zero em `scripts/synth_audio.py` — sem samples de terceiros.
- **Imagens/clipes de GTA VI:** material promocional oficial publicado pela Rockstar Games em
  rockstargames.com/VI. Os arquivos **não** são versionados aqui; o script os baixa. O uso em vídeos de
  comentário de fãs é prática comum, mas a responsabilidade pela publicação e por eventuais reivindicações
  é de quem publica.
