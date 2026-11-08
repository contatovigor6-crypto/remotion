import type {Shot} from '../data/shots';

// Short "GTA 6 apareceu na GLOBO" — screenshots oficiais INÉDITAS (Launch Gallery, 05/11/2026) como fotos vivas. Narração: voz neural pt-BR (Antonio).
const G = (n: string) => `v16/${n}.jpg`;
const P = (id: string, from: number, to: number, src: string, f0: [number, number], f1: [number, number], s0: number, s1: number, inT: Shot['inT'], look: Shot['look'], note: string, punches: number[] = []): Shot => ({id, from, to, src: G(src), live: true, focus0: f0, focus1: f1, s0, s1, inT, look, punches, note});

export const SHOTS: Shot[] = [
	P('A', 0, 2.0, 'Vice_City_22', [0.45, 0.5], [0.5, 0.5], 1.2, 1.05, 'cut', 'dark', '"GTA 6 acabou de aparecer na Globo"', [0.1]),
	P('B', 2.0, 3.3, 'Jason_Duval_16', [0.35, 0.4], [0.4, 0.4], 1.05, 1.18, 'flash', 'dark', '"na Globo"', [2.04]),
	P('C', 3.3, 6.2, 'Vice_City_14', [0.55, 0.45], [0.45, 0.45], 1.1, 1.2, 'whipL', 'dark', '"em pleno sábado, no meio da Fórmula 1"'),
	P('D', 6.2, 10.6, 'Vice_City_20', [0.6, 0.45], [0.45, 0.45], 1.08, 1.18, 'whipR', 'dark', '"duas da tarde, intervalo do GP de São Paulo"'),
	P('E', 10.6, 13.4, 'Jason_Duval_18', [0.42, 0.42], [0.42, 0.4], 1.05, 1.2, 'glitch', 'dark', '"pouco antes da classificação em Interlagos"'),
	P('F', 13.4, 16.6, 'Vice_City_24', [0.4, 0.5], [0.55, 0.5], 1.05, 1.15, 'zoom', 'dark', '"30 segundos de Vice City, legenda em português"'),
	P('G', 16.6, 20.3, 'Jason_and_Lucia_17', [0.62, 0.45], [0.35, 0.45], 1.08, 1.12, 'whipL', 'dark', '"selo de 18 anos... Vamos ficar bem?"', [18.8]),
	P('H', 20.3, 23.0, 'Lucia_Caminos_11', [0.55, 0.4], [0.55, 0.4], 1.25, 1.1, 'flash', 'dark', '"quem estava assistindo não acreditou"', [21.76]),
	P('I', 23.0, 27.1, 'Vice_City_19', [0.3, 0.45], [0.6, 0.45], 1.05, 1.1, 'whipR', 'dark', '"um fã filmou a própria TV"'),
	P('J', 27.1, 29.0, 'Jason_Duval_12', [0.75, 0.35], [0.7, 0.35], 1.1, 1.2, 'glitch', 'dark', '"e não foi só na TV"'),
	P('K', 29.0, 32.4, 'Vice_City_21', [0.5, 0.45], [0.5, 0.45], 1.05, 1.15, 'whipL', 'dark', '"painel na Avenida Nove de Julho"'),
	P('L', 32.4, 35.8, 'Jason_Duval_14', [0.55, 0.45], [0.5, 0.45], 1.1, 1.2, 'cut', 'dark', '"Praça da Sé... estações de metrô"'),
	P('M', 35.8, 39.2, 'Lucia_Caminos_12', [0.3, 0.4], [0.4, 0.4], 1.1, 1.22, 'zoom', 'dark', '"a Rockstar está de olho no Brasil"', [37.5]),
	P('N', 39.2, 43.4, 'Vice_City_25', [0.5, 0.45], [0.5, 0.45], 1.05, 1.15, 'whipR', 'dark', '"faltam 11 dias... você viu esse comercial?"'),
	P('O', 43.4, 51.0, 'Port_Gellhorn_07', [0.5, 0.45], [0.5, 0.45], 1.15, 1.05, 'cut', 'title', '"Comenta e segue o ZoneGTAVI" — encerramento'),
];
