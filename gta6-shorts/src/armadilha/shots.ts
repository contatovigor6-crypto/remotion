import type {Shot} from '../data/shots';

// Short "A armadilha da Rockstar pra quem vazar GTA 6" — screenshots oficiais da Launch Gallery (cada uma usada só 1 vez antes),
// com gráficos novos (marca d'água, armadilha de informações falsas).
const P = (id: string, from: number, to: number, src: string, f0: [number, number], f1: [number, number], s0: number, s1: number, inT: Shot['inT'], look: Shot['look'], note: string, punches: number[] = []): Shot => ({id, from, to, src: `v16/${src}.jpg`, live: true, focus0: f0, focus1: f1, s0, s1, inT, look, punches, note});

export const SHOTS: Shot[] = [
	P('A', 0, 4.2, 'Vice_City_16', [0.62, 0.42], [0.6, 0.42], 1.35, 1.12, 'glitch', 'dark', '"A Rockstar montou uma armadilha"', [1.3]),
	P('B', 4.2, 6.1, 'Lucia_Caminos_11', [0.55, 0.4], [0.55, 0.4], 1.1, 1.22, 'whipL', 'dark', '"tem gente que já está jogando"'),
	P('C', 6.1, 13.7, 'Jason_and_Lucia_20', [0.45, 0.5], [0.6, 0.5], 1.05, 1.18, 'whipR', 'dark', '"cópias da imprensa... análises dia 18"'),
	P('D', 13.7, 15.3, 'Jason_Duval_12', [0.75, 0.35], [0.72, 0.35], 1.15, 1.25, 'flash', 'dark', '"só que tem um detalhe"', [14.6]),
	P('E', 15.3, 21.8, 'Jason_and_Lucia_15', [0.22, 0.4], [0.45, 0.45], 1.08, 1.15, 'glitch', 'dark', '"o nome de quem está jogando, em marca d\'água"'),
	P('F', 21.8, 25.7, 'Vice_City_21', [0.5, 0.45], [0.5, 0.4], 1.1, 1.25, 'zoom', 'dark', '"vazou um vídeo? eles sabem quem foi"', [23.9]),
	P('G', 25.7, 26.8, 'Grassrivers_07', [0.3, 0.42], [0.3, 0.42], 1.2, 1.3, 'flash', 'desat', '"E fica pior"', [25.8]),
	P('H', 26.8, 31.6, 'Vice_City_14', [0.6, 0.45], [0.4, 0.45], 1.1, 1.15, 'whipL', 'dark', '"informações falsas, diferentes pra cada funcionário"'),
	P('I', 31.6, 37.5, 'Jason_Duval_18', [0.42, 0.42], [0.45, 0.38], 1.05, 1.25, 'glitch', 'dark', '"o vazamento tem nome e sobrenome"', [36.2]),
	P('J', 37.5, 41.8, 'Jason_Duval_16', [0.35, 0.4], [0.4, 0.4], 1.1, 1.2, 'whipR', 'dark', '"depois dos vazamentos de agosto"'),
	P('K', 41.8, 47.4, 'Jason_and_Lucia_19', [0.78, 0.45], [0.75, 0.4], 1.1, 1.2, 'zoom', 'dark', '"faltam 10 dias... alguém vai ter coragem?"'),
	P('L', 47.4, 55.0, 'Vice_City_17', [0.45, 0.6], [0.5, 0.6], 1.2, 1.05, 'cut', 'title', '"Comenta e segue o ZoneGTAVI" — encerramento'),
];
