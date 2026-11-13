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

Os arquivos ficam em `public/vo/`, um por bloco. A voz foi gerada com o [Piper](https://github.com/OHF-Voice/piper1-gpl), voz `pt_BR-faber-medium`, treinada com um dataset CC0. Recebeu limpeza de silêncios, compressão e EQ de presença. A pronúncia foi conferida transcrevendo cada trecho com o Whisper. As grafias fonéticas ("Gê tê á seis", "São trinta…") evitam que "trinta" seja ouvido como "quarenta". O ElevenLabs não pôde ser usado porque a cota gratuita do mês acabou. Para trocar a voz, basta substituir os .wav e ajustar `blocks` em `src/Short.tsx`.

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
