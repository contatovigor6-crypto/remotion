# Preferências do canal ZoneGTAVI (pedidos do dono do canal — seguir até ele pedir mudança)

- Thumbnail (ATUAL, pedido em 31/10): "ZONEGTA6 — EXTREME CLICK THUMBNAIL SYSTEM", src/thumbs/ThumbExtreme.tsx.
  FORMATO: SHORTS → vertical 1080×1920 (pedido em 03/11); vídeo LONGO → horizontal 1280×720.
  um foco dominante (personagem oficial em primeiro plano, expressão forte), luz cinematográfica, partículas/atmosfera,
  texto de 2–5 palavras com UMA palavra em destaque, sem repetir o título, honesta (sem inventar cenas/mecânicas).
  SEM a logo do canal na thumbnail (pedido em 31/10). A logo continua obrigatória nos VÍDEOS (marca-d'água em 100% dos quadros).
- (Anterior, substituído) Thumbnail formato SHORTS vertical 1080×1920, estilo PRO (src/thumbs/ThumbPro.tsx):
  logo original SEMPRE bem exposta (selo grande com brilho no topo), pergunta de curiosidade extrema,
  palavra-chave em caixa amarela, círculo + seta no detalhe da imagem oficial, visual profissional e estiloso.
- Logo original (public/brand/zonegtavi-logo.png) em 100% dos quadros, canto superior esquerdo; nunca redesenhar.
- Voz original sem alteração (TARGET=none); nunca cortar, acelerar ou inventar falas.
- Nunca repetir músicas (MUSICAS-USADAS.md) nem imagens (IMAGENS-USADAS.md) entre vídeos.
- Áudio novo = vídeo novo; entregar vídeo, thumbnail, título, descrição, hashtags, tags e comentário fixado na pasta EXPORTADO.
- Vídeo LONGO (quando o dono pedir): 1920×1080, editor src/long/LongEdit.tsx, capítulos + capítulos com timestamps na descrição;
  thumbnail HORIZONTAL 1280×720 no estilo PRO (ThumbProLongEdge como modelo).
- VÍDEOS EM MOVIMENTO (pedido em 02/11): usar clipes de vídeo oficiais da Rockstar sempre que houver, não só fotos passando.
- TRILHA (pedido em 02/11, atualizado): música ELETRIZANTE / energética (o dono trocou o suspense por eletrizante).
- FINAL DOS VÍDEOS (pedido em 03/11): usar sempre o encerramento profissional src/components/ProOutro.tsx (slam da logo com onda de choque,
  nome digitado, cursor clicando INSCREVER-SE → INSCRITO, sino e like animados, faixa "próxima investigação"), com SFX de clique/sino.

## Temas (07/11/2026)
- SOMENTE novidades quentes e investigações (notícias recentes de GTA 6, apuradas, separando fato confirmado de relato/rumor).
- Nunca repetir roteiros/temas já feitos nesta sessão nem nas outras abas (ex.: 212 GB/pré-download, horário de lançamento à meia-noite, Launch Gallery 39 imagens, votação sindical, contagem 17 dias, NPCs reagem à arma, interiores, Edge 430, celular, Brian, pista do dinheiro, 60 fps, internet, preso, 1h parado, polícia).
- Quando o usuário não mandar áudio: criar roteiro e narração com a voz "Marcio - Viral Hook Narrator" (ElevenLabs).

## SEO pelo Google Trends (Brasil, 24h — 10/11/2026)
- Mais buscados: "Lançamento GTA 6", "GTA 6 lançamento", "PS5 GTA 6", "GTA 6 PS5", "Xbox GTA 6", "Baixar do GTA 6" (+10%), "GTA 6 PC".
- Em alta: "GTA 6 Gold" (+190%), "GTA 6 Lançou?" (+150%), "Pôster de GTA 6" (+130%), "Data pré-download do GTA 6" (+130%),
  "quando gta 6 vai ser lançado para PC" (+120%), "quando libera o preload do gta 6" (+100%), "Grand Theft Auto VI" (+70%), "quando lança o gta 6" (+60%).
- Regras: colocar no TÍTULO a busca exata em alta (pergunta como o público digita: "GTA 6 lançou?", "quando libera…"), repetir 2–3 dessas
  frases na DESCRIÇÃO (1ª linha responde a pergunta), e usar as frases exatas nas TAGS. Plataformas (PS5/Xbox/PC) sempre citadas.
- Próximos temas puxados pela busca: GTA 6 no PC (quando lança?), Pôster/mapa de GTA 6, "GTA 6 Gold", "GTA 6 já lançou?".

## Estilo motion (10/11/2026)
- O usuário gostou da ideia de vídeos em MOTION DESIGN: tipografia cinética, objetos 3D (disco, calendário, cartões), gráficos animados,
  máquina de números, engrenagens — sem depender sempre de imagens de GTA 6 (usar imagens oficiais só em poucos momentos).
- "Por que você nunca muda o fundo?": trocar o CENÁRIO DE FUNDO a cada cena (ex.: pôr do sol neon, cidade com chuva, grade tech,
  raios dourados, mercado, cassino, gelo, túnel, planta azul, galáxia). Referência: src/gold/Motion.tsx.

## Trends 10/11/2026 (2ª leitura) → hashtags no FIM da descrição
- Em alta: "GTA 6 Gold" (+300%), "GTA 6 Lançou?" (+150%/+110%), "Pôster de GTA 6"/"Pôster GTA 6" (+120%), "quando gta 6 vai ser lançado para PC" (+90%),
  "quando lança o gta 6" (+70%), "Quantos GB tem o GTA 6" (+50%), "GTA 6 quando lança"/"que dia lança o gta 6" (+40%).
- Mais buscados: "Lançamento GTA 6" (+20%), "GTA 6 lançamento", "PS5 GTA 6", "Xbox GTA 6", "Baixar do GTA 6", "GTA 6 PC".
- REGRA: terminar TODA descrição com 10–15 hashtags tiradas das buscas do momento, sem espaço (ex.: #LançamentoGTA6 #GTA6Lançou #QuandoLançaOGTA6
  #QueDiaLançaOGTA6 #PosterDeGTA6 #GTA6Gold #BaixarGTA6 #PS5GTA6 #GTA6Xbox #GTA6PC), sempre com #GTA6 primeiro e #Shorts no fim.
  O YouTube ignora todas as hashtags se passar de 15 — nunca exceder.

## VOLTAR AO ESTILO ANTIGO (pedido em 11/11/2026) — substitui "Estilo motion" e o cyberpunk/3D
- Editar como antigamente (referência: src/carros, src/arquivos, src/codigo): ShortEdit com `shots` = imagens e CLIPES oficiais de GTA 6 em tela cheia
  (Ken Burns/zoom, cortes no ritmo da fala, tremidas e SFX nos impactos), legendas palavra a palavra com destaque, overlays pontuais
  (setas/círculos/selos/HUD) por cima das imagens — NÃO usar motion design de cenas inteiras nem cenas 3D, salvo pedido.
- Continua valendo: logo em 100% dos quadros, música eletrizante inédita, ProOutro no final, thumbnail vertical sem logo, hashtags do Trends no fim.
- Estoque de imagens oficiais inéditas praticamente esgotado: priorizar arte oficial nova que sair (Newswire) e, quando faltar, reuso mínimo
  e disfarçado (recorte/zoom diferente) — sempre avisar o usuário quais foram reaproveitadas.

## PRODUÇÃO EM MASSA (pedido em 11/11/2026) — o canal produz Shorts de GTA 6 em série
- Todo Short novo sai pela esteira: escrever plans/<slug>.json (roteiro + mídia por fala + selos + trilha + thumb + publicação)
  e rodar `python3 scripts/serie.py plans/<slug>.json` (composição GTA6Serie / thumbnail ThumbSerie, src/serie/Serie.tsx).
- A esteira faz sozinha: narração (narrador pro), legenda alinhada ao texto do roteiro, cortes/Ken Burns/transições/punch-ins,
  SFX, tremidas, selos, ProOutro no "Comenta", trilha com ganho no padrão (-36 dB), render, master, QC e entrega na EXPORTADO
  (vídeo, leve, mini, srt, THUMB vertical, PUBLICACAO) + registros de música/imagens. Bloqueia trilha repetida e hashtags fora da regra.
- Tempo por vídeo: ~10–15 min de máquina. Sem 3D/motion de cena inteira (lentos) — foco em volume com o estilo clássico.
- (11/11) MOTION AGRESSIVO na série: `"estilo": "agressivo"` no plano = transição forte em TODO corte (glitch/whip/flash/zoom),
  flash RGB nos cortes, zooms fortes, punch-ins em todas as palavras-chave, tremida a cada fala. CARTELAS de motion em tela cheia
  (src/serie/Cards.tsx: slam, cross, progress, date, photo, poll) com fundos variados (burst, stripes, grid, dots, split) —
  usar `{"card": {...}}` no lugar de uma mídia. Música: animada e CURIOSA (ex.: Run Amok, Jaunty Gumption, Scheming Weasel faster).
- Nunca repetir imagens/vídeos: as cartelas carregam o vídeo quando faltar mídia oficial inédita.
- (11/11) NUNCA usar o som de transição "schuuu" (sfx-whoosh / whoosh-rev) nos cortes. A esteira remove qualquer whoosh do spec.
  Para trocar só o áudio de um vídeo pronto: `python3 scripts/serie.py plans/<slug>.json --etapa audio`.
