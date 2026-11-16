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
2. `python scripts/faq_timing.py public/vo/<arquivo> perguntas`: transcreve, encontra o começo de cada pergunta e de cada resposta e grava `src/faq/timing-perguntas.json`.
3. `python scripts/music_urgencia.py src/faq/timing-perguntas.json public/music/trilha-urgencia.wav` e depois converta para mp3: os impactos da trilha seguem as perguntas.
4. `npx remotion render ZoneGTA6-Perguntas out/perguntas.mp4`

A trilha "urgência" é original: 140 BPM em Fá# menor, com relógio, alarme em dois tons, baixo distorcido, bateria de pista e um impacto a cada pergunta.

# Vídeo 3: Faça isso antes de jogar GTA 6 (`ZoneGTA6-Checklist`)

Checklist de 7 passos, narrado pelo Marcio (`public/vo/checklist-marcio.mp3`). Usa a mesma cena do vídeo 2 (`src/faq/Faq.tsx`), com o conteúdo em `src/faq/checklist.ts` e os tempos em `src/faq/timing-checklist.json` (gerados com `scripts/faq_timing.py <audio> checklist`). A trilha `trilha-urgencia-checklist.mp3` foi gerada com `scripts/music_urgencia.py` a partir desses tempos, com um impacto em cada passo.

## Edição v2 dos vídeos em lista

- **Efeitos sonoros:** `scripts/sfx.py` gera 44 sons originais em `public/sfx/v2/`. O plano de som fica em `buildSfx` (`src/faq/Faq.tsx`) e é validado: se algum efeito tocar mais de 2 vezes no mesmo vídeo, o render falha.
- **Visual** (`src/faq/Fx.tsx`): transições em faixas ou flash entre blocos, partículas de neon, pulso de luz no tempo da música, título cinético, infográfico animado por passo, selo de "feito" e recapitulação no encerramento.
- **Logo:** defina `LOGO_FILE` em `src/faq/Faq.tsx` (arquivo em `public/`). Enquanto for `null`, entra a logo em texto animada.

# Vídeo 4: GTA 6 está chegando (`ZoneGTA6-Chegando`)

Roteiro do canal, narrado pelo Marcio (`public/vo/chegando-marcio.mp3`; a palavra "Roteiro", lida por engano no começo, foi cortada). As cenas ficam em `src/faq/Chegando.tsx`, uma por trecho da fala, e os tempos e marcas de palavras em `src/faq/timing-chegando.json` (`scripts/faq_timing.py <audio> chegando`). A trilha `trilha-urgencia-chegando.mp3` foi gerada a partir desses tempos, e o plano de som usa os efeitos de `public/sfx/v2/`, com no máximo 2 usos de cada.

## Regras de edição do canal (a partir do vídeo 4)

- **Logo:** `public/logo-zonegta6.jpg` entra no encerramento (`ChannelLogo`) e no canto superior (`HudBrand`), ambos em `src/faq/Fx.tsx`.
- **Nunca repetir fundo:** `python scripts/check_media.py src/faq/<Video>.tsx` falha se o vídeo repetir uma mídia ou usar alguma que outro vídeo já usou.
- **Vídeos de fundo:** clipes oficiais do pacote de downloads da Rockstar (`GTAVI_Videos.zip`) e do site de GTA VI, convertidos para 9:16 em `public/media/v/` (fora do git, como as imagens).
- **3D:** `src/faq/Fx3d.tsx` tem palco com câmera, caixas, texto com volume, chão em grade, cidade de neon e coluna de gráfico. É 3D feito com transformações do navegador, sem GPU.

# Vídeo 5: contagem regressiva sem narração (`ZoneGTA6-Edit`)

Fica em `src/edit/Edit.tsx`, em **estilo de telejornal**: vinheta de "URGENTE", barra do canal no topo, manchete em terço inferior (faixas que abrem da esquerda), letreiro correndo, enquete e encerramento com a data em cartela e a logo. Estrutura: abertura, 8 manchetes confirmadas (uma por compasso da trilha), enquete e final. A constante `DAYS` precisa bater com a data de publicação.

A trilha `trilha-phonk.mp3` é original (`scripts/music_phonk.py`) e toca em volume baixo. `ZoneGTA6-Edit-SemMusica` é a mesma edição só com os efeitos.

## Decisões de estilo do canal (15/11)

- **Motion:** estilo de telejornal. Sem 3D (`src/faq/Fx3d.tsx` fica só como arquivo).
- **Efeitos sonoros:** poucos, um por acontecimento, escolhido pelo que aparece na tela (o plano em `sfxPlan` traz o motivo de cada som). Nenhum efeito mais de 2 vezes por vídeo.
- **Sempre:** logo no encerramento e na barra do canal; fundos inéditos (`scripts/check_media.py`).

# Vídeo 5, versão filme (`ZoneGTA6-Filme`) — padrão do canal

A contagem regressiva em linguagem de trailer de cinema (`src/edit/Filme.tsx`), com 66,5 s. A linha do tempo fica em `src/edit/filme-timeline.json` e é lida tanto pela cena quanto pela trilha (`scripts/music_trailer.py`), então mudar a duração de um plano mantém música e imagem alinhadas.

- **Planos:** a imagem ocupa uma janela larga no centro (75% da largura da foto 16:9 visível) e é enquadrada pelo campo `focus` de cada plano, para o assunto principal aparecer. Aproximação lenta, fusão para o preto, cor de película e grão.
- **Cartelas:** texto em Cinzel sobre preto, com as letras surgindo uma a uma.
- **Estrutura:** apresentação, protagonistas, cidade, regiões do estado, montagem de cortes rápidos, título, data, dias que faltam e logo com bloco de créditos.
- **Som:** trilha de trailer original e só 4 efeitos sonoros.

**Decisão do canal (15/11): este estilo de filme é o padrão para os próximos vídeos.**

### Material oficial mais recente (15/11)

O pacote de screenshots (`GTAVI_Screenshots.zip`, atualizado em 04/11) traz as mesmas 138 imagens da página de downloads, e o pacote de vídeos é de agosto. O material realmente novo são as artes dos posts de novembro do Newswire: arte de lançamento (Jason e Lucia no carro), Vice City de lançamento, capa oficial e arte da trilha original de Justice. Elas ficam em `public/media/nov_*.jpg` (fora do git). As artes quadradas usam o segmento `art` do filme, que mostra a imagem inteira sem corte.

### Vídeos no filme

Os segmentos `shot` aceitam `.mp4`. Os clipes oficiais (pacote de vídeos da Rockstar e os dois vídeos do site de GTA VI) foram recortados para a janela do filme (1080×810) em `public/media/vw/` (fora do git): o voo sobre Vice City, o casal no carro na praia (dois trechos) e 7 clipes de personagem de 12 frames, usados na montagem alternando com imagens. São os mesmos clipes do vídeo 4, mas em enquadramento largo, porque não existe outro vídeo oficial para download.

# Vídeo 6: Recorde (`ZoneGTA6-Recorde`)

Narrado pelo Marcio (`public/vo/recorde-marcio.mp3`), em linguagem de trailer de cinema. A linha do tempo sai da narração: `scripts/recorde_timeline.py <words.json> src/edit/recorde-timeline.json` posiciona cada imagem, cartela e dado na frase correspondente. A trilha é gerada por `scripts/music_trailer.py src/edit/recorde-timeline.json public/music/trilha-recorde.wav` e baixa sob a voz.

- **Fatos:** recorde de pré-venda e recursos do DualSense e do Tempest 3D, ambos do PlayStation Blog (10/11). O pré-download antecipado foi anunciado pela Rockstar; a narração diz "a Sony decidiu", por isso a fonte na tela é "Rockstar · PlayStation Blog".
- **Imagens:** 37 imagens oficiais que nunca apareceram em vídeos anteriores. Os 7 clipes de personagem da montagem são os mesmos dos vídeos 4 e 5 (não existe outro vídeo oficial para download).
- **Som:** cerca de 70 efeitos (`public/sfx/v2` e `public/sfx`), nenhum mais de 2 vezes. Os momentos-chave reservam o som ideal primeiro; transições, cortes e legendas usam o que sobra.
- `scripts/check_media.py` agora também lê os arquivos `.json` de linha do tempo.

### Recorde v2: som de trailer

- **Trilha:** `scripts/music_epic.py <timeline.json> <saida.wav>` gera uma trilha épica com pulso contínuo (ostinato de cordas, taiko, contrabaixo, metais), que cresce até a montagem e pausa na cartela "PENSE NISSO.". A mixagem abre espaço em 1–4 kHz para a voz. No vídeo, ela fica em 55% sob a narração e 85% nas pausas (antes eram 30% e 62%, e a música sumia).
- **Efeitos:** `scripts/sfx_cine.py` gera 30 sons cinematográficos em `public/sfx/cine/` (passagens de ar graves, impactos, booms, swells, risers, braams, brilhos suaves, batimento, tensão, acorde final). O vídeo usa só esse kit, sem sons de interface.

# Vídeo 7: Depois do lançamento (`ZoneGTA6-Depois`)

Narrado pelo Marcio (`public/vo/depois-marcio.mp3`). Cenas em `src/edit/Depois.tsx`, linha do tempo gerada da narração por `scripts/depois_timeline.py`, trilha por `scripts/music_epic.py` e efeitos do kit `public/sfx/cine`.

- **Gancho (0–8 s):** abre em tela cheia, com três flashes de imagem nas palavras "faltam / três / dias", o "3" dourado gigante batendo com tremor e um feixe de luz cruzando. Depois vem o corte seco para o preto: a música para, entra um batimento e aparece "MAS EXISTE UMA PERGUNTA". Em seguida, "O QUE A ROCKSTAR VAI FAZER DEPOIS?" letra por letra sobre a imagem.
- **Final de marca:** a logo entra com feixes de luz girando, "ZONE GTA VI" abre o espaçamento, a frase final entra na palavra "essa", vem o convite "INSCREVA-SE · ATIVE AS NOTIFICAÇÕES" num quadro dourado, depois os créditos e o fade para o preto.
- **Fatos:** "19/11 mantido" e "pré-vendas extraordinárias" vêm da teleconferência da Take-Two de 9/11 (CONFIRMADO). O suporte ao GTA Online vem de declarações do CEO em teleconferências anteriores de 2026 (REPORTADO), e não da apresentação de novembro, como a narração sugere. Planos pós-lançamento: sem anúncio oficial até 16/11.
- **Imagens novas:** 4 imagens de GTA Online publicadas pela Rockstar em novembro, artes da Edição Ultimate e do Pacote Vintage Vice City, e as últimas capturas inéditas de GTA VI.

### Gramática de cinema (vídeo 7 em diante)

`src/edit/Cine.tsx` reúne técnicas de filme; cada plano recebe a sua pelo campo `fx` da linha do tempo:

- `parallax`: 2.5D. O fundo desfoca devagar (troca de foco) e o assunto, recortado por `scripts/plates.py` (rembg, local), avança na frente em outra velocidade.
- `dolly`: efeito vertigo. O fundo se afasta enquanto o assunto se aproxima.
- `whip`: chicote de câmera, com o plano entrando de lado com rastro de movimento.
- `open: true`: as faixas pretas recolhem e a imagem toma a tela inteira (mudança de proporção).
- `triptych`: tela dividida em três, com cada painel entrando no momento em que é citado.
- Transições sobrepostas: vazamento de luz na entrada dos dados, queima de película antes das viradas, reflexo anamórfico no título e aberração cromática nos impactos.

Os recortes ficam em `public/media/cut/` (fora do git).

### Vídeo 7, versão luxo

- **Trilha:** `scripts/music_lux.py` ("luxury cinematic", 76 BPM: cordas, piano elétrico com acordes de sétima e nona, 808 com deslize, palma suave, chimbal com swing e harpa de vidro). Arquivo `public/music/trilha-depois-lux.mp3`.
- **Visual:** `Lux` (contexto em `src/edit/Filme.tsx`) transforma os textos principais em folha de ouro. Em `src/edit/Cine.tsx`, `GoldFrame` é a moldura dourada que se desenha em volta da imagem, `GoldDust` a poeira dourada flutuando, `Sheen` o brilho de vitrine passando sobre cada plano e `GoldWipe` a transição por fio dourado, no lugar da queima de película.

### Vídeo 7, versão filme + motion

- `src/edit/Motion.tsx` é a camada de motion graphics, guiada pelos tempos de cada palavra (`words` em `depois-timeline.json`):
  - legendas animadas de até 3 palavras, com a palavra falada em ouro (somem onde a tela já mostra a frase ou a tela dividida);
  - etiquetas de HUD nos nomes-chave;
  - mira de foco sobre o assunto, código de tempo e REC;
  - ondas douradas nos impactos, linhas nos cortes e contador D-3.
- **Trilha:** `scripts/music_motion.py` ("hybrid motion", 100 BPM): baixo pulsando com sidechain, arpejo de pluck, cordas em staccato e bateria cinematográfica. Arquivo `public/music/trilha-depois-motion.mp3`.

### Vídeo 7, versão motion puro (`ZoneGTA6-Depois-Motion`)

`src/edit/DepoisMotion.tsx`: o texto é o protagonista. A narração aparece gigante (fonte Anton), em blocos de 1 a 3 palavras, cada bloco com uma animação diferente (impacto, subida, divisão lateral, inclinação, empilhamento). As palavras-chave ganham tarja dourada; há formas de acento (barra, anel, colchetes, pontos, seta para cima em "acima" e um "?" gigante nas perguntas), transições em faixas douradas a cada troca de trecho e selos de verificação animados. As imagens ficam como fundo escurecido, com grade animada. O gancho, o final de marca, a trilha "hybrid motion" e o kit de efeitos cinematográficos são os mesmos da versão de filme.
