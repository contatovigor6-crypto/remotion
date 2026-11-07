import type {Shot} from '../data/shots';

// Short "As 39 imagens novas de GTA 6" — 100% screenshots oficiais INÉDITAS no canal (Launch Gallery, rockstargames.com/VI, 05/11/2026),
// todas como "fotos vivas" (câmera 3D, luz e partículas). Narração: Marcio (ElevenLabs).
const G = (n: string) => `v16/${n}.jpg`;
const P = (id: string, from: number, to: number, src: string, f0: [number, number], f1: [number, number], s0: number, s1: number, inT: Shot['inT'], look: Shot['look'], note: string, punches: number[] = []): Shot => ({id, from, to, src: G(src), live: true, focus0: f0, focus1: f1, s0, s1, inT, look, punches, note});

export const SHOTS: Shot[] = [
	// ---------- GANCHO
	P('A', 0, 1.75, 'Vice_City_17', [0.45, 0.6], [0.5, 0.6], 1.25, 1.08, 'cut', 'dark', '"A Rockstar acabou de soltar" — perseguição noturna', [0.2]),
	P('B', 1.75, 3.7, 'Jason_Duval_17', [0.28, 0.4], [0.34, 0.4], 1.05, 1.18, 'flash', 'dark', '"39 imagens novas"', [1.78]),
	P('C', 3.7, 5.4, 'Lucia_Caminos_13', [0.4, 0.45], [0.55, 0.45], 1.1, 1.25, 'whipL', 'dark', '"de GTA 6"', [3.76]),
	P('D', 5.4, 7.7, 'Vice_City_16', [0.62, 0.42], [0.6, 0.42], 1.3, 1.1, 'glitch', 'dark', '"coisas que ninguém tinha visto"', [6.16]),
	// ---------- A GALERIA
	P('E', 7.7, 10.4, 'Vice_City_27', [0.55, 0.5], [0.45, 0.5], 1.15, 1.05, 'zoom', 'dark', '"galeria de lançamento, site oficial"'),
	P('F', 10.4, 12.5, 'Vice_City_15', [0.45, 0.5], [0.6, 0.5], 1.05, 1.15, 'whipR', 'dark', '"a duas semanas da estreia"'),
	P('G', 12.5, 15.4, 'Vice_City_26', [0.5, 0.5], [0.5, 0.55], 1.0, 1.3, 'zoom', 'dark', '"quase todas escondem algum detalhe"', [13.6]),
	// ---------- OS DETALHES
	P('H', 15.4, 22.0, 'Jason_and_Lucia_19', [0.78, 0.45], [0.72, 0.3], 1.05, 1.2, 'flash', 'dark', '"Lucia atirando... carro-forte e a polícia logo atrás"', [16.5, 19.3]),
	P('I', 22.0, 26.9, 'Jason_and_Lucia_15', [0.22, 0.4], [0.78, 0.5], 1.08, 1.08, 'whipL', 'dark', '"mascarados dentro de um banco, com reféns"', [23.6, 25.6]),
	P('J', 26.9, 31.0, 'Jason_Duval_11', [0.6, 0.35], [0.55, 0.4], 1.25, 1.08, 'whipR', 'dark', '"Jason fugindo de moto"', [27.84]),
	P('K', 31.0, 32.2, 'Jason_Duval_13', [0.5, 0.45], [0.55, 0.45], 1.05, 1.15, 'glitch', 'dark', '"E tem mais"'),
	P('L', 32.2, 33.4, 'Jason_Duval_15', [0.55, 0.32], [0.55, 0.36], 1.05, 1.15, 'cut', 'dark', '"Jason malhando"'),
	P('M', 33.4, 35.6, 'Vice_City_13', [0.5, 0.5], [0.55, 0.45], 1.05, 1.18, 'cut', 'dark', '"uma balada lotada em Vice City"'),
	P('N', 35.6, 38.2, 'Leonida_Keys_07', [0.62, 0.32], [0.65, 0.7], 1.1, 1.15, 'cut', 'dark', '"um mergulhador no fundo do mar das Keys"'),
	// ---------- O JACARÉ
	P('O', 38.2, 40.6, 'Grassrivers_07', [0.3, 0.42], [0.35, 0.6], 1.1, 1.22, 'dip', 'desat', '"a mais assustadora é essa"'),
	P('Q', 40.6, 45.0, 'Grassrivers_08', [0.3, 0.38], [0.4, 0.55], 1.0, 1.3, 'flash', 'dark', '"um barco no pântano, à noite... e um jacaré enorme"'),
	P('Q2', 45.0, 48.1, 'Grassrivers_08', [0.44, 0.67], [0.44, 0.67], 1.9, 2.05, 'flash', 'base', '"com o olho vermelho brilhando" — zoom no olho', [45.3]),
	// ---------- O MOMENTO
	P('R', 48.1, 50.0, 'Jason_Duval_19', [0.7, 0.42], [0.62, 0.42], 1.1, 1.2, 'whipL', 'dark', '"o momento não é por acaso"'),
	P('S', 50.0, 55.6, 'Jason_and_Lucia_16', [0.36, 0.55], [0.5, 0.55], 1.2, 1.05, 'zoom', 'dark', '"pré-download 10 de novembro... 19 de novembro"'),
	// ---------- PERGUNTA / CTA
	P('T', 55.6, 58.4, 'Jason_and_Lucia_20', [0.5, 0.5], [0.5, 0.5], 1.05, 1.15, 'whipR', 'dark', '"Qual te deixou mais curioso?"'),
	P('U', 58.4, 65.0, 'Jason_and_Lucia_14', [0.5, 0.45], [0.5, 0.45], 1.15, 1.05, 'cut', 'title', '"Comenta e segue o ZoneGTAVI" — encerramento'),
];
