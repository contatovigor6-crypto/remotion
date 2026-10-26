import type {Shot} from '../data/shots';

// "Internet no GTA 6" — plano de montagem. Telas de celular/navegador são ILUSTRAÇÕES (rotuladas na tela),
// não interfaces reais do jogo: a narração trata essas funções como não confirmadas.
export const SHOTS: Shot[] = [
	// ---------- GANCHO
	{id: 'A', from: 0, to: 1.76, src: 'v2/skyline-v.mp4', video: true, focus0: [0.5, 0.5], s0: 1.1, s1: 1.2, inT: 'cut', look: 'dark', note: '"A internet de GTA 6" — título'},
	{id: 'B', from: 1.76, to: 4.26, src: 'v2/city-night.mp4', video: true, focus0: [0.5, 0.5], s0: 1.05, s1: 1.2, inT: 'zoom', punches: [3.42], note: '"muito mais do que parece"'},
	{id: 'C', from: 4.26, to: 5.9, src: 'v2/jason-night-v.jpg', focus0: [0.5, 0.35], s0: 1.05, s1: 1.15, inT: 'whipL', punches: [5.08], note: '"será que você vai conseguir"'},
	{id: 'D', from: 5.9, to: 7.46, src: 'v2/keys.mp4', video: true, rate: 0.5, focus0: [0.5, 0.5], s0: 1.1, s1: 1.2, inT: 'whipR', look: 'dark', note: '"navegar por sites" — navegador (ilustração)'},
	{id: 'E', from: 7.46, to: 8.84, src: 'v2/city-night.mp4', video: true, startFrom: 4, focus0: [0.5, 0.5], s0: 1.15, s1: 1.25, inT: 'cut', look: 'dark', note: '"acompanhar notícias" — letreiro'},
	{id: 'F', from: 8.84, to: 12.3, src: 'img/vc-day.jpg', focus0: [0.4, 0.5], focus1: [0.55, 0.5], s0: 1.05, s1: 1.15, inT: 'glitch', look: 'dark', note: '"descobrir coisas sobre Vice City" — busca'},
	{id: 'G', from: 12.3, to: 15.56, src: 'v2/raul.mp4', video: true, rate: 0.45, focus0: [0.5, 0.45], s0: 1.0, s1: 1.15, inT: 'glitch', punches: [13.08], note: '"Fica até o final"'},
	{id: 'H', from: 15.56, to: 21.5, src: 'img/cover-v.jpg', focus0: [0.5, 0.5], s0: 1.1, s1: 1.2, inT: 'dip', look: 'title', note: '"mostrar × interagir" — tela dividida'},
	// ---------- CONTEXTO (material oficial)
	{id: 'I', from: 21.5, to: 26.16, src: 'img/pool-v.jpg', focus0: [0.5, 0.5], s0: 1.0, s1: 1.1, inT: 'whipL', note: '"redes sociais fazem parte da apresentação" — post'},
	{id: 'J', from: 26.16, to: 29.0, src: 'v3/dimez-rec.mp4', video: true, rate: 0.35, focus0: [0.5, 0.4], s0: 1.0, s1: 1.1, inT: 'whipR', punches: [28.12], note: '"cheio de vídeos" — placa RECORDING'},
	{id: 'K', from: 29.0, to: 29.9, src: 'v3/drequan.mp4', video: true, focus0: [0.5, 0.45], s0: 1.05, s1: 1.1, inT: 'cut', note: '"personagens"'},
	{id: 'L1', from: 29.9, to: 31.32, src: 'v3/club.mp4', video: true, rate: 0.7, focus0: [0.5, 0.45], s0: 1.0, s1: 1.08, inT: 'cut', note: '"situações"'},
	{id: 'L2', from: 31.32, to: 33.0, src: 'v3/boobie-boat.mp4', video: true, rate: 0.6, focus0: [0.6, 0.45], s0: 1.0, s1: 1.08, inT: 'whipL', note: '"saído da internet real"'},
	// ---------- CENÁRIO IMAGINADO
	{id: 'M', from: 33.0, to: 41.9, src: 'v2/couple-v.jpg', focus0: [0.5, 0.45], s0: 1.2, s1: 1.3, inT: 'zoom', look: 'title', note: '"imagina abrir o celular" — celular (ilustração)'},
	{id: 'P', from: 41.9, to: 45.9, src: 'v2/robbery.mp4', video: true, rate: 0.25, focus0: [0.72, 0.42], s0: 1.0, s1: 1.12, inT: 'glitch', note: '"situações do jogo aparecessem na internet"'},
	{id: 'Q', from: 45.9, to: 50.6, src: 'v2/storm.mp4', video: true, rate: 0.22, focus0: [0.5, 0.5], s0: 1.1, s1: 1.25, inT: 'whipR', note: '"notícia sobre uma confusão" — urgente'},
	{id: 'R', from: 50.6, to: 54.4, src: 'img/heist-v.jpg', focus0: [0.5, 0.5], s0: 1.1, s1: 1.2, inT: 'glitch', look: 'dark', note: '"informações escondidas"'},
	{id: 'S', from: 54.4, to: 58.0, src: 'v2/skyline-v.mp4', video: true, startFrom: 2.5, focus0: [0.5, 0.5], s0: 1.0, s1: 1.12, inT: 'zoom', punches: [57.34], note: '"Vice City muito mais viva"'},
	// ---------- O QUE NÃO É CONFIRMADO
	{id: 'T', from: 58.0, to: 64.6, src: 'img/cover-v.jpg', focus0: [0.5, 0.45], s0: 1.1, s1: 1.2, inT: 'glitch', look: 'title', note: '"Mas atenção... não dá para afirmar" — selo'},
	{id: 'U1', from: 64.6, to: 70.0, src: 'img/keyart-v.jpg', focus0: [0.5, 0.45], s0: 1.15, s1: 1.25, inT: 'whipL', look: 'dark', note: '"não significa que teremos" — lista'},
	{id: 'U2', from: 70.0, to: 76.0, src: 'img/masked-v.jpg', focus0: [0.5, 0.45], s0: 1.1, s1: 1.2, inT: 'whipR', look: 'dark', note: '"sites interativos... como a nossa"'},
	{id: 'W', from: 76.0, to: 78.1, src: 'img/trailer2-v.jpg', focus0: [0.5, 0.4], s0: 1.0, s1: 1.3, inT: 'dip', look: 'title', note: '"a grande diferença" — título'},
	{id: 'X', from: 78.1, to: 83.3, src: 'v2/jl-sun.mp4', video: true, rate: 0.26, focus0: [0.5, 0.4], s0: 1.0, s1: 1.12, inT: 'flash', look: 'dark', note: '"só para contar histórias" — opção A'},
	{id: 'Y', from: 83.3, to: 88.6, src: 'v2/lucia-car.mp4', video: true, rate: 0.28, focus0: [0.6, 0.45], s0: 1.0, s1: 1.12, inT: 'whipL', look: 'dark', note: '"o jogador possa interagir" — opção B'},
	// ---------- ENQUETE / LOOP (fecha no plano de abertura)
	{id: 'Z', from: 88.6, to: 95.4, src: 'v2/skyline-v.mp4', video: true, focus0: [0.5, 0.5], s0: 1.25, s1: 1.1, inT: 'zoom', look: 'dark', note: '"Qual dessas possibilidades?" — enquete'},
];
