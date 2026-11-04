import type {Shot} from '../data/shots';

// Short "Os NPCs de GTA 6 reagem quando você saca a arma" — clipes de vídeo oficiais + fotos vivas (material oficial).
const V = (id: string, from: number, to: number, src: string, rate: number, fx: number, fy: number, inT: Shot['inT'], look: Shot['look'], note: string, punches: number[] = [], startFrom = 0): Shot => ({id, from, to, src, video: true, rate, startFrom, focus0: [fx, fy], s0: 1.05, s1: 1.12, inT, look, punches, note});
const P = (id: string, from: number, to: number, src: string, fx: number, fy: number, s0: number, s1: number, inT: Shot['inT'], look: Shot['look'], note: string, punches: number[] = []): Shot => ({id, from, to, src, live: true, focus0: [fx, fy], s0, s1, inT, look, punches, note});

export const SHOTS: Shot[] = [
	// ---------- GANCHO
	V('A', 0, 2.0, 'video/jason-clip-slow.mp4', 1, 0.55, 0.45, 'cut', 'dark', '"Existe um detalhe em GTA 6"'),
	P('B', 2.0, 6.0, 'v10/jason-fire.jpg', 0.5, 0.42, 1.08, 1.22, 'glitch', 'dark', '"pode mudar completamente como você joga"', [2.8]),
	V('C', 6.0, 8.8, 'v2/city-night.mp4', 1, 0.5, 0.5, 'whipL', 'dark', '"uma situação muito simples"'),
	V('D', 8.8, 11.8, 'v2/jason-neon.mp4', 0.67, 0.5, 0.45, 'flash', 'dark', '"sacar uma arma na frente de um desconhecido"', [9.5]),
	// ---------- GTA V
	P('E', 11.8, 16.4, 'v9/street-bikers.jpg', 0.5, 0.5, 1.05, 1.15, 'dip', 'calm', '"Em GTA V os pedestres ignoravam"'),
	P('F', 16.4, 20.6, 'v6/pistols.jpg', 0.45, 0.5, 1.05, 1.18, 'whipR', 'dark', '"a menos que você apontasse a arma"'),
	// ---------- A MUDANÇA
	V('G', 20.6, 26.2, 'v2/green-car.mp4', 1, 0.45, 0.5, 'whipL', 'dark', '"a Rockstar percebeu... realismo"'),
	P('H', 26.2, 30.3, 'v10/skyline.jpg', 0.55, 0.45, 1.1, 1.22, 'zoom', 'dark', '"Rob Nelson explicou"'),
	V('I', 30.3, 33.3, 'video/lucia-clip-slow.mp4', 1, 0.58, 0.45, 'glitch', 'dark', '"os personagens precisam reagir"'),
	V('J', 33.3, 36.5, 'v2/hug.mp4', 1, 0.5, 0.45, 'whipR', 'dark', '"ao que acontece ao redor deles"'),
	V('K', 36.5, 37.5, 'v2/storm.mp4', 0.6, 0.5, 0.5, 'flash', 'dark', '"E tem mais!"', [36.6]),
	P('L', 37.5, 46.3, 'v9/art-crowd.jpg', 0.5, 0.55, 1.05, 1.15, 'zoom', 'dark', '"600 mil animações"'),
	V('M', 46.3, 51.7, 'v2/skyline-v.mp4', 1, 0.5, 0.5, 'whipL', 'dark', '"não devem parecer figurantes"'),
	V('N', 51.7, 54.5, 'v3/club.mp4', 0.38, 0.5, 0.5, 'glitch', 'dark', '"o comportamento deles faz parte da experiência"'),
	P('O', 54.5, 58.8, 'v9/tough-duo.jpg', 0.45, 0.45, 1.05, 1.18, 'whipR', 'dark', '"uma das maiores diferenças de GTA 6"'),
	V('P', 58.8, 63.8, 'v2/city-night.mp4', 1, 0.3, 0.5, 'zoom', 'dark', '"o próprio mundo precisa reagir"', [62.8], 2.5),
	// ---------- PERGUNTA / CTA
	V('Q', 63.8, 66.0, 'v2/jl-sun.mp4', 0.83, 0.5, 0.45, 'cut', 'base', '"mais liberdade"'),
	V('R', 66.0, 71.1, 'v2/skyline-v.mp4', 1, 0.5, 0.35, 'whipL', 'dark', '"cada atitude gera uma reação inesperada?"', [], 3.0),
	P('S', 71.1, 75.9, 'v10/jl-moto.jpg', 0.5, 0.45, 1.2, 1.1, 'zoom', 'title', '"Comenta e se inscreve no ZoneGTAVI" — encerramento'),
];
