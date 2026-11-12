# ZoneGTA6 — Shorts

Projeto Remotion do canal ZoneGTA6 (9:16, 1080×1920, 30 fps).

- `src/brand/` — kit de marca reutilizável (cores, fontes, fundo Vice, marca d'água, legendas animadas).
- `src/xbox-one-cloud/` — vídeo "GTA 6 no Xbox One via nuvem" (narração Marcio, tempos reais em `narration-captions.json` via `scripts/transcribe.mjs`).
- `public/music/cloud-drip.wav` — trilha trap original (`scripts/make-music-trap.mjs`).
- `src/preload-212/` — vídeo "GTA 6 pede 212 GB" (pré-load aberto em 10/11/2026).
- `public/music/vice-pulse.wav` — trilha original gerada por `scripts/make-music.mjs` (sem direitos de terceiros).
- `public/sfx/` — efeitos da biblioteca `@remotion/sfx` (remotion.media).

## Narração

Voz: ElevenLabs "Marcio - Viral Hook Narrator" (`plASsyS7JE6GCAvx9uIc`).
Salve o MP3 em `public/voice/preload-212.mp3`, atualize os tempos em `src/preload-212/script.ts`
e renderize com:

```bash
npm install
npx remotion render Preload212 out/preload-212gb.mp4 --props='{"narrationSrc":"voice/preload-212.mp3"}'
```

## Identidade 3D (padrão a partir de nov/2026)

Todos os fundos e composições são cenas 3D reais (Three.js via `@remotion/three`):
geometria, materiais PBR, sombras, neblina, iluminação HDRI (Poly Haven, CC0, em `public/hdri/`)
e câmera animada por frame.

- `src/three/kit.tsx` — objetos 3D procedurais (console, carro, palmeira, prédios, nuvens, céu, figuras ilustrativas).
- `src/three/rig.tsx` — câmera cinematográfica (keyframes, tremida, roll).
- `src/xbox-one-3d/` — episódio "GTA 6 no Xbox One?" em 3D: 11 cenários sincronizados à narração.

Render (CPU, sem GPU, usa SwiftShader):

```bash
npx remotion render XboxOne3D out/xbox3d.mp4 --concurrency=4
```
