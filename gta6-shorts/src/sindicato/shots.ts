import type {Shot} from '../data/shots';

// Short "A votação sindical na Rockstar UK durante o lançamento de GTA 6" — clipes de vídeo oficiais + fotos vivas (material oficial do jogo; não há imagens dos funcionários).
const V = (id: string, from: number, to: number, src: string, rate: number, fx: number, fy: number, inT: Shot['inT'], look: Shot['look'], note: string, punches: number[] = [], startFrom = 0): Shot => ({id, from, to, src, video: true, rate, startFrom, focus0: [fx, fy], s0: 1.05, s1: 1.12, inT, look, punches, note});
const P = (id: string, from: number, to: number, src: string, fx: number, fy: number, s0: number, s1: number, inT: Shot['inT'], look: Shot['look'], note: string, punches: number[] = []): Shot => ({id, from, to, src, live: true, focus0: [fx, fy], s0, s1, inT, look, punches, note});

export const SHOTS: Shot[] = [
	// ---------- GANCHO
	V('A', 0, 2.2, 'v2/city-night.mp4', 1, 0.5, 0.5, 'cut', 'dark', '"A Rockstar está prestes a viver..."'),
	V('B', 2.2, 5.6, 'v2/skyline-v.mp4', 1, 0.5, 0.5, 'zoom', 'dark', '"semanas mais importantes da sua história"'),
	P('C', 5.6, 9.7, 'v10/mendez.jpg', 0.42, 0.4, 1.08, 1.2, 'glitch', 'dark', '"um acontecimento que pouca gente está observando"'),
	// ---------- O LANÇAMENTO
	P('D', 9.7, 14.2, 'v12/box.jpg', 0.5, 0.5, 1.1, 1.2, 'flash', 'title', '"19 de novembro, GTA 6 finalmente será lançado"'),
	V('E', 14.2, 16.0, 'v2/jason-neon.mp4', 1, 0.5, 0.45, 'whipL', 'dark', '"mas existe outro acontecimento"'),
	V('F', 16.0, 21.7, 'v2/green-car.mp4', 1, 0.45, 0.5, 'whipR', 'dark', '"ao mesmo tempo... os próprios funcionários da Rockstar"'),
	// ---------- A VOTAÇÃO
	P('G', 21.7, 27.1, 'v7/vc-aerial.jpg', 0.5, 0.5, 1.05, 1.2, 'zoom', 'dark', '"12 a 26 de novembro, trabalhadores no Reino Unido"'),
	P('H', 27.1, 34.4, 'v6/salon-desk.jpg', 0.45, 0.5, 1.05, 1.15, 'whipL', 'dark', '"reconhecimento sindical através do IWGB"'),
	V('I', 34.4, 36.6, 'v3/drequan.mp4', 0.45, 0.5, 0.5, 'glitch', 'dark', '"por que isso é tão importante?"'),
	P('J', 36.6, 47.9, 'v7/boobie-office.jpg', 0.45, 0.45, 1.05, 1.2, 'whipR', 'dark', '"representação coletiva: salários, horas extras..."'),
	// ---------- A COINCIDÊNCIA
	V('K', 47.9, 49.8, 'v2/storm.mp4', 0.53, 0.5, 0.5, 'flash', 'dark', '"olha só a coincidência!"', [48.8]),
	V('L', 49.8, 55.6, 'v2/city-night.mp4', 1, 0.3, 0.5, 'whipL', 'dark', '"começa no dia do pré-carregamento"', [], 2.2),
	V('M', 55.6, 58.5, 'v2/hug.mp4', 1, 0.5, 0.45, 'whipR', 'dark', '"e atravessa o lançamento do jogo"'),
	V('N', 58.5, 63.9, 'v2/skyline-v.mp4', 1, 0.5, 0.35, 'zoom', 'base', '"milhões de jogadores entrando nesse universo"', [], 2.6),
	V('O1', 63.9, 66.9, 'video/lucia-clip-slow.mp4', 1, 0.58, 0.45, 'glitch', 'dark', '"um momento decisivo"'),
	V('O2', 66.9, 69.4, 'v2/raul.mp4', 0.6, 0.5, 0.45, 'cut', 'dark', '"dentro de seus próprios estúdios"'),
	// ---------- IMPORTANTE
	P('P', 69.4, 79.3, 'v10/cover-landscape.jpg', 0.5, 0.5, 1.0, 1.1, 'dip', 'title', '"acontecimentos distintos... sem confirmação de interferência"'),
	V('Q', 79.3, 81.4, 'v5/vc-bay.mp4', 0.48, 0.5, 0.5, 'zoom', 'base', '"uma coisa é certa"'),
	P('R', 81.4, 86.6, 'v10/skyline.jpg', 0.55, 0.45, 1.1, 1.25, 'whipL', 'dark', '"novembro de 2026 pode entrar para a história"'),
	V('S1', 86.6, 88.6, 'video/jason-clip-slow.mp4', 1, 0.55, 0.45, 'cut', 'dark', '"E você, já conhecia"'),
	V('S2', 88.6, 90.7, 'v2/jl-sun.mp4', 0.87, 0.5, 0.45, 'cut', 'base', '"essa situação?"'),
	P('T', 90.7, 95.4, 'v10/jl-moto.jpg', 0.5, 0.45, 1.2, 1.1, 'zoom', 'title', '"Comenta e se inscreve no ZoneGTAVI" — logo'),
];
