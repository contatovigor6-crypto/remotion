import type {Shot} from '../data/shots';

// "NPCs com personalidade em GTA 6" — só imagens oficiais INÉDITAS no canal (ver IMAGENS-USADAS.md).
// Fichas de personalidade, medidores e reações são motion design ilustrativo, não interface do jogo.
export const SHOTS: Shot[] = [
	// ---------- GANCHO
	{id: 'A', from: 0, to: 2.9, src: 'v9/man-glasses.jpg', focus0: [0.55, 0.42], s0: 1.2, s1: 1.08, inT: 'cut', look: 'dark', note: '"E se eu te dissesse..." — título'},
	{id: 'B', from: 2.9, to: 5.68, src: 'v9/taxi-guns.jpg', focus0: [0.42, 0.45], s0: 1.05, s1: 1.15, inT: 'whipL', look: 'dark', punches: [4.88], note: '"não esteja nos criminosos"'},
	{id: 'C', from: 5.68, to: 7.08, src: 'v9/raul-drive.jpg', focus0: [0.52, 0.42], s0: 1.12, s1: 1.04, inT: 'cut', look: 'dark', note: '"ou na polícia"'},
	{id: 'D', from: 7.08, to: 10.82, src: 'v9/street-bikers.jpg', focus0: [0.5, 0.5], focus1: [0.6, 0.5], s0: 1.05, s1: 1.15, inT: 'zoom', punches: [9.92], note: '"nas pessoas andando pela rua"'},
	{id: 'E', from: 10.82, to: 15.66, src: 'v9/art-hotel.jpg', focus0: [0.4, 0.5], focus1: [0.6, 0.5], s0: 1.05, s1: 1.15, inT: 'glitch', look: 'dark', note: '"NPCs com comportamentos mais complexos"'},
	{id: 'F', from: 15.66, to: 21.78, src: 'v9/bonfire.jpg', focus0: [0.3, 0.45], focus1: [0.45, 0.45], s0: 1.05, s1: 1.18, inT: 'whipR', look: 'dark', punches: [20.8], note: '"situação normal → verdadeiro problema"'},
	{id: 'G', from: 21.78, to: 28.14, src: 'v9/vc-balcony.jpg', focus0: [0.62, 0.45], s0: 1.05, s1: 1.15, inT: 'zoom', look: 'dark', note: '"Fica até o final"'},
	// ---------- PERSONALIDADES
	{id: 'H', from: 28.14, to: 34.16, src: 'v9/art-crowd.jpg', focus0: [0.4, 0.55], focus1: [0.6, 0.55], s0: 1.05, s1: 1.12, inT: 'whipL', look: 'dark', note: '"pedestres com sempre o mesmo comportamento" — clones'},
	{id: 'I', from: 34.16, to: 39.12, src: 'v9/woman-face.jpg', focus0: [0.5, 0.42], s0: 1.15, s1: 1.05, inT: 'flash', note: '"personalidades e temperamentos diferentes"'},
	{id: 'J', from: 39.12, to: 44.82, src: 'v9/cal-golf.jpg', focus0: [0.65, 0.42], s0: 1.05, s1: 1.15, inT: 'whipR', look: 'dark', note: '"nem todo mundo vai reagir igual"'},
	{id: 'K', from: 44.82, to: 47.46, src: 'v9/woman-car.jpg', focus0: [0.35, 0.45], s0: 1.05, s1: 1.15, inT: 'cut', look: 'dark', note: '"alguns podem se afastar"'},
	{id: 'L', from: 47.46, to: 49.66, src: 'v9/tough-duo.jpg', focus0: [0.4, 0.45], s0: 1.15, s1: 1.25, inT: 'cut', look: 'dark', punches: [48.16], note: '"outros podem enfrentar você"'},
	{id: 'M', from: 49.66, to: 54.94, src: 'v9/hunters.jpg', focus0: [0.35, 0.5], focus1: [0.45, 0.5], s0: 1.1, s1: 1.35, inT: 'glitch', look: 'dark', punches: [52.42], note: '"pode até sacar uma arma"'},
	// ---------- PERCEBEM VOCÊ
	{id: 'N', from: 54.94, to: 62.12, src: 'v9/pool-party.jpg', focus0: [0.55, 0.45], focus1: [0.7, 0.45], s0: 1.05, s1: 1.15, inT: 'whipL', look: 'dark', note: '"percebem quando alguém observa uma conversa"'},
	{id: 'O', from: 62.12, to: 67.64, src: 'v9/counter-woman.jpg', focus0: [0.6, 0.4], s0: 1.05, s1: 1.18, inT: 'zoom', look: 'dark', note: '"demonstrar incômodo"'},
	// ---------- PENSA COMIGO
	{id: 'P', from: 67.64, to: 69.14, src: 'v9/art-graffiti.jpg', focus0: [0.5, 0.5], s0: 1.1, s1: 1.3, inT: 'dip', look: 'title', note: '"Agora pensa comigo" — título'},
	{id: 'Q', from: 69.14, to: 73.48, src: 'v9/strangers.jpg', focus0: [0.55, 0.42], s0: 1.05, s1: 1.15, inT: 'flash', note: '"provocar um desconhecido"'},
	{id: 'R', from: 73.48, to: 79.0, src: 'v9/dirt-bikes.jpg', focus0: [0.45, 0.5], s0: 1.05, s1: 1.25, inT: 'whipR', look: 'dark', punches: [77.38], note: '"em vez de fugir... resolve enfrentar você"'},
	{id: 'S', from: 79.0, to: 83.14, src: 'v9/boobie-art.jpg', focus0: [0.5, 0.4], s0: 1.15, s1: 1.05, inT: 'zoom', note: '"escolher suas brigas com mais cuidado"'},
	{id: 'T', from: 83.14, to: 87.4, src: 'v9/dimez-art.jpg', focus0: [0.4, 0.4], focus1: [0.6, 0.4], s0: 1.05, s1: 1.12, inT: 'whipL', punches: [86.26], note: '"nem todo mundo vai aceitar desaforo"'},
	// ---------- CIDADE VIVA
	{id: 'U1', from: 87.4, to: 91.6, src: 'v9/wildlife.jpg', focus0: [0.35, 0.5], focus1: [0.55, 0.5], s0: 1.05, s1: 1.15, inT: 'zoom', note: '"fazer a cidade parecer viva"'},
	{id: 'U2', from: 91.6, to: 95.64, src: 'v9/art-boatshed.jpg', focus0: [0.4, 0.5], s0: 1.05, s1: 1.15, inT: 'whipR', look: 'dark', note: '"não existem apenas para preencher o cenário"'},
	{id: 'V', from: 95.64, to: 101.1, src: 'v9/raul-art.jpg', focus0: [0.45, 0.4], s0: 1.12, s1: 1.04, inT: 'glitch', note: '"cada NPC terá uma personalidade única?"'},
	{id: 'W', from: 101.1, to: 104.28, src: 'v9/helicopter.jpg', focus0: [0.47, 0.45], s0: 1.05, s1: 1.15, inT: 'whipL', look: 'calm', note: '"Ainda não sabemos até onde vai"'},
	// ---------- ENQUETE / INSCRIÇÃO
	{id: 'X1', from: 104.28, to: 109.78, src: 'v9/airboat-aerial.jpg', focus0: [0.25, 0.6], s0: 1.05, s1: 1.15, inT: 'flash', look: 'dark', note: '"Você teria coragem de provocar" — enquete A'},
	{id: 'X2', from: 109.78, to: 113.92, src: 'v9/willie-neon.jpg', focus0: [0.45, 0.5], s0: 1.05, s1: 1.15, inT: 'cut', look: 'dark', note: '"reagir de maneiras diferentes" — enquete B'},
	{id: 'Y', from: 113.92, to: 115.88, src: 'v9/taxi-side.jpg', focus0: [0.5, 0.5], s0: 1.1, s1: 1.18, inT: 'whipR', look: 'dark', note: '"Comenta aí, deixa o like"'},
	{id: 'Z', from: 115.88, to: 121.6, src: 'v9/art-bridge.jpg', focus0: [0.5, 0.5], s0: 1.2, s1: 1.1, inT: 'zoom', look: 'title', note: '"se inscreve no ZoneGTAVI" — logo'},
];
