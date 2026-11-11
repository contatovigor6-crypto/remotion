# ZONEGTA6 · Leonida: as 6 regiões do mapa de GTA VI

Vídeo 3D de 64 s (1920×1080, 30 fps) feito com Remotion + React Three Fiber: um sobrevoo por um mapa estilizado de Leonida, parando em Vice City, Leonida Keys, Grassrivers, Port Gellhorn, Ambrosia e Mount Kalaga.

O mapa é uma ilustração de fã, não o mapa oficial. Os textos de cada região vêm das descrições publicadas pela Rockstar Games; a data de lançamento exibida é 19 de novembro de 2026.

## Short vertical: "GTA 6 já tem nota?"

Composição `NotaPSN` (1080×1920, 42 s) no estilo das capas do canal ZoneGTAVI: as avaliações de GTA VI que apareceram na PlayStation Store antes do lançamento (média 4,67 com 12 notas, noticiado em 10/11/2026 pelo Notebookcheck). Código em `src/nota/`; os números e a fonte ficam em `src/nota/timeline.ts`.

```bash
npx remotion render NotaPSN out/zonegtavi-nota-ps-store.mp4
node scripts/make-music.mjs music-nota.wav nota          # trilha do short
```

## Comandos

```bash
npm i
npm run dev                                              # abre o Remotion Studio
npx remotion render Leonida out/zonegta6-leonida.mp4     # renderiza o vídeo
node scripts/make-music.mjs music.wav                    # regenera a trilha (converta para public/music.mp3)
```

Em máquinas sem GPU, adicione `--gl=swangle` ao render.

## Onde editar

- `src/timeline.ts`: textos, cores, ordem e duração de cada região.
- `src/Overlay.tsx`: títulos, cartões e encerramento.
- `src/world/`: terreno, câmera e os modelos 3D de cada região.
- `scripts/make-music.mjs`: trilha sintetizada (120 BPM, cada seção começa em um compasso).

Fontes: Anton e Montserrat (SIL Open Font License), incluídas em `public/fonts`.
