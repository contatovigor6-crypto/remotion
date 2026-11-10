import type {Shot} from '../data/shots';

// Short "GTA 6 Gold: o jogo finalmente ficou pronto?" — fotos vivas oficiais já usadas 1 vez (estoque inédito esgotado) + gráficos novos.
const P = (id: string, from: number, to: number, src: string, f0: [number, number], f1: [number, number], s0: number, s1: number, inT: Shot['inT'], look: Shot['look'], note: string, punches: number[] = []): Shot => ({id, from, to, src: `${src}.jpg`, live: true, focus0: f0, focus1: f1, s0, s1, inT, look, punches, note});

export const SHOTS: Shot[] = [
	P('A', 0, 2.5, 'v16/Jason_Duval_17', [0.3, 0.4], [0.32, 0.4], 1.2, 1.05, 'cut', 'dark', '"GTA 6 finalmente ficou pronto?"', [0.2]),
	P('B', 2.5, 6.4, 'v16/Lucia_Caminos_12', [0.3, 0.4], [0.4, 0.4], 1.08, 1.2, 'whipL', 'dark', '"a resposta veio ontem"'),
	P('C', 6.4, 13.4, 'v16/Vice_City_20', [0.6, 0.45], [0.45, 0.45], 1.08, 1.18, 'whipR', 'dark', '"Zelnick: a Rockstar completou o desenvolvimento"', [11.0]),
	P('D', 13.4, 18.9, 'v16/Vice_City_22', [0.45, 0.5], [0.55, 0.5], 1.2, 1.05, 'flash', 'dark', '"gold: versão final fechada"', [14.8]),
	P('E', 18.9, 27.6, 'v16/Vice_City_25', [0.5, 0.45], [0.5, 0.5], 1.05, 1.18, 'whipL', 'dark', '"pré-venda muito acima das expectativas"'),
	P('F', 27.6, 30.6, 'v16/Vice_City_18', [0.5, 0.45], [0.6, 0.45], 1.15, 1.25, 'glitch', 'dark', '"não revelaram nenhum número"', [29.7]),
	P('G', 30.6, 35.9, 'v16/Jason_Duval_14', [0.55, 0.45], [0.5, 0.45], 1.1, 1.2, 'whipR', 'dark', '"ainda não estão prontos pra declarar vitória"'),
	P('H', 35.9, 42.8, 'v16/Jason_and_Lucia_16', [0.3, 0.55], [0.5, 0.55], 1.25, 1.08, 'zoom', 'dark', '"depois de dois adiamentos... 19 de novembro"', [41.6]),
	P('I', 42.8, 48.8, 'v19/l-buccaneer', [0.4, 0.55], [0.5, 0.55], 1.05, 1.18, 'whipL', 'dark', '"pode ter atualização no primeiro dia"'),
	P('J', 48.8, 54.3, 'v16/Jason_and_Lucia_17', [0.62, 0.45], [0.38, 0.45], 1.08, 1.12, 'whipR', 'dark', '"faltam nove dias... recordes?"'),
	P('K', 54.3, 62.5, 'v16/Vice_City_24', [0.45, 0.5], [0.5, 0.5], 1.15, 1.05, 'cut', 'title', '"Comenta e segue o ZoneGTAVI" — encerramento'),
];
