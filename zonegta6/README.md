# ZoneGTA6: Motion Engine (Remotion)

Short vertical produzido 100% em código, com motion design original. Não usa nenhuma arte, trailer ou música da Rockstar.

```bash
cd zonegta6
npm install
npm run studio        # pré-visualização no Remotion Studio
npm run render:short  # exporta out/zonegta6-contagem-final.mp4
```

## Radar GTA 6: 13/11/2026

| Assunto | Atual. | Comun. | Curios. | Visual | Retenção | Fontes | **Nota** |
|---|---|---|---|---|---|---|---|
| **30 FPS + extras do PS5 Pro + Xbox One na nuvem (post do pre-load)** | 10 | 10 | 9 | 9 | 9 | Oficial | **92** |
| Recorde de pré-venda (Microsoft Store) | 9 | 8 | 6 | 7 | 7 | Oficial | 78 |
| Take-Two Q2: data mantida, prejuízo por ação | 8 | 6 | 5 | 5 | 5 | Oficial | 64 |
| Festival em Miami (21/11) e álbum oficial | 8 | 6 | 6 | 7 | 6 | Agregadores | 62 |
| Possível modo 40 FPS (datamine) | 9 | 9 | 9 | 6 | 8 | Rumor | entra como **bloco RUMOR**, não como pauta |

## Narração

`public/vo/narracao-marcio.mp3` traz a voz "Marcio – Viral Hook Narrator" (ElevenLabs), enviada pelo canal. É um arquivo único e contínuo, que entra no frame 4. Cada bloco começa 6 frames antes da primeira palavra dele, e as animações batem com as palavras-chave. Os tempos foram medidos transcrevendo o áudio com o Whisper, palavra por palavra. Os `.wav` antigos do Piper continuam em `public/vo/` como alternativa, mas não são usados.

## Roteiro (PT-BR, cerca de 58 s com a narração)

| Tempo | Bloco | Narração / texto na tela | Status |
|---|---|---|---|
| 0:00 | Gancho | **6 dias.** E um único número está dividindo a comunidade. | — |
| 0:03 | Contexto | GTA VI chega em 19 de novembro, no PS5 e no Xbox Series X\|S. Mas o post do pre-load trouxe um detalhe técnico… | CONFIRMADO |
| 0:07 | Revelação | **30 FPS.** Essa é a meta no PS5, no PS5 Pro e no Xbox Series. Nenhum modo desempenho foi anunciado. *(humor)* Quem jurava 60 FPS: "tá, mas é uma experiência cinematográfica". | CONFIRMADO |
| 0:14 | Recompensa | E o PS5 Pro? Continua nos 30 FPS, mas ganha PSSR para mais nitidez e sombras com ray tracing exclusivas. | CONFIRMADO |
| 0:19 | Investigação | Um modo 40 FPS? Dados minerados da PSN sugerem saída em 120 Hz, o que tornaria isso possível. **Não confirmado.** | RUMOR |
| 0:23 | Dado | Cerca de 210 GB no Xbox. *(humor)* Hora de apagar aquele jogo que você jura que um dia vai zerar. | REPORTADO |
| 0:28 | Serviço | Tem Xbox One? Dá para jogar no dia 1 pelo Xbox Cloud Gaming, a partir das 03h de Brasília (1h ET). O jogo é vendido à parte. | CONFIRMADO |
| 0:33 | Fecho | É o jogo mais pré-vendido da história da Microsoft Store. | CONFIRMADO |
| 0:37 | CTA | 30 FPS te incomoda, ou a Rockstar compensa no resto? Comenta aqui embaixo. ZoneGTA6: investigar, descobrir, revelar. | — |

## Fontes

- Rockstar Newswire: lançamento em 19/11/2026 · <https://www.rockstargames.com/newswire/article/ak3ak31a49a221/grand-theft-auto-vi-is-now-set-to-launch-november-19-2026>
- Rockstar, post "Pre-Load Grand Theft Auto VI Now" (10/11): 30 FPS, PSSR e sombras RT no PS5 Pro · <https://www.rockstargames.com/newswire/article/89834o94713o21/pre-load-grand-theft-auto-vi-now> (o site não abriu no ambiente; o conteúdo foi conferido pelas citações em Game Informer, Wccftech e TweakTown)
- Xbox Wire (10/11): Cloud Gaming às 1h ET, recorde de pré-venda, preços · <https://news.xbox.com/en-us/2026/11/10/grand-theft-auto-6-comes-to-xbox-cloud-gaming-november-19/>
- Modo 40 FPS (datamine, RUMOR) · <https://www.altchar.com/game-news/gta-vi-could-use-a-newer-version-of-pssr-on-ps5-pro-with-a-40fps-mode-also-possible-datamine-suggests-aPJJY0d0cdmo>
- Tamanho de ~210 GB (listagem da loja Xbox, via imprensa, REPORTADO) · <https://gta6times.com/gta-6/updates>

## Estrutura

- `src/Short.tsx`: timeline (mapa `T`), as cenas e o sound design
- `src/components.tsx`: linguagem visual (fundo com grade, painéis HUD, títulos com máscara, etiquetas de verificação, shake, flash)
- `src/theme.ts`: cores, fontes e o sistema de status (CONFIRMADO / REPORTADO / RUMOR / TEORIA)
- `public/sfx/`: whoosh, impact, riser, sub drop, tick, glitch e drone, todos sintetizados com ffmpeg, sem direitos de terceiros

## Fundo com imagens de GTA VI

`src/Background.tsx` passa as imagens uma a uma dentro de cada bloco. Cada imagem tem zoom lento, um travelling lateral sobre o recorte 9:16, entrada com fade e desfoque de movimento, e um tratamento de cor para manter o texto legível. A lista de arquivos por bloco está em `media`, dentro de `src/Short.tsx`. Arquivos `.mp4`, `.webm` ou `.mov` entram automaticamente como vídeo, sem som.

As imagens são capturas oficiais da seção Downloads de rockstargames.com/VI e ficam em `public/media/`. Essa pasta **não vai para o git**, para não redistribuir material da Rockstar. Para renderizar em outra máquina, baixe as capturas de lá e salve com os nomes listados em `media`. O vídeo mostra o crédito "Imagens: Rockstar Games".

## Trilha sonora

`public/music/trilha-zonegta6.mp3` é uma música synthwave original, em Lá menor (Am–F–C–G) a 96 BPM. Ela é gerada por `scripts/music.py` (pad, baixo, arpejo e bateria sintetizados), sem samples nem música de terceiros. A grade de compassos foi alinhada para a batida entrar exatamente em "São **trinta**" (11,83 s). A bateria sai no bloco do rumor e volta no do download. No final fica só o pad, embaixo da logo.

O volume abaixa automaticamente: a música desce enquanto o narrador fala e sobe nas pausas. Os trechos com voz estão em `src/voiceActivity.ts`, medidos na transcrição.

### Trilha de suspense (atual)

O vídeo usa `public/music/trilha-suspense.mp3`, gerada por `scripts/music_suspense.py` e também 100% original. Como ela acompanha a história:

- **Introdução:** drone grave dissonante (Ré com Mi bemol), tique-taque de relógio e um batimento cardíaco que acelera.
- **Antes da revelação:** um riser nos 4 s anteriores, e um "braam" grave em "São **trinta**".
- **Depois da revelação:** ostinato grave e tambor.
- **Piada do "cinematográfico":** a música para por um instante, como respiro cômico.
- **Rumor:** só relógio, coração e um tom agudo fantasma.
- **Recorde:** um segundo braam.
- **Final:** um acorde que não resolve, embaixo da logo.

Para voltar à synthwave, troque o arquivo em `src/Short.tsx` por `music/trilha-zonegta6.mp3`.

### Versões por trilha

Cada trilha tem sua própria composição em `src/Root.tsx`, com a mesma edição e o mesmo volume automático sob a voz:

| Composição | Trilha | Gerador |
|---|---|---|
| `ZoneGTA6-Short` | Suspense (relógio, coração, braam) | `scripts/music_suspense.py` |
| `ZoneGTA6-Short-Dramatico` | Suspense dramático (cordas, piano, coro, tímpanos) | `scripts/music_variants.py drama` |
| `ZoneGTA6-Short-Acao` | Ação e suspense (128 BPM, ostinato, baixo distorcido, bateria, metais) | `scripts/music_variants.py acao` |
| `ZoneGTA6-Short-Synthwave` | Synthwave | `scripts/music.py` |

Exemplo: `npx remotion render ZoneGTA6-Short-Dramatico out/dramatico.mp4`

---

# Vídeo 2: 7 perguntas sobre GTA 6 (`ZoneGTA6-Perguntas`)

Pesquisado em 14/11/2026. O conteúdo fica em `src/faq/data.ts` (pergunta, resposta, status, fonte e imagens) e a cena em `src/faq/Faq.tsx`.

**Fluxo para trocar a narração** (por exemplo, pela voz do Marcio):

1. Salve o áudio em `public/vo/` (um único arquivo com o roteiro inteiro).
2. `python scripts/faq_timing.py public/vo/<arquivo>`: transcreve, encontra o começo de cada pergunta e de cada resposta e grava `src/faq/timing.json`.
3. `python scripts/music_urgencia.py src/faq/timing.json public/music/trilha-urgencia.wav` e depois converta para mp3: os impactos da trilha seguem as perguntas.
4. `npx remotion render ZoneGTA6-Perguntas out/perguntas.mp4`

A trilha "urgência" é original: 140 BPM em Fá# menor, com relógio, alarme em dois tons, baixo distorcido, bateria de pista e um impacto a cada pergunta.
