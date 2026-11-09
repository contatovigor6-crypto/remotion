import type {Shot} from '../data/shots';

// Short "Os carros de GTA 6 saíram do jogo" — screenshots oficiais INÉDITAS dos 6 carros (divulgadas pela Rockstar à imprensa em 05–06/11/2026).
// Só imagens do jogo (sem fotos reais dos carros, que pertencem a terceiros).
const P = (id: string, from: number, to: number, src: string, f0: [number, number], f1: [number, number], s0: number, s1: number, inT: Shot['inT'], look: Shot['look'], note: string, punches: number[] = []): Shot => ({id, from, to, src: `v19/${src}.jpg`, live: true, focus0: f0, focus1: f1, s0, s1, inT, look, punches, note});

export const SHOTS: Shot[] = [
	P('A', 0, 2.55, 'v-grupo2', [0.5, 0.6], [0.5, 0.55], 1.25, 1.05, 'cut', 'dark', '"Os carros de GTA 6 saíram do jogo"', [0.4]),
	P('B', 2.55, 4.55, 'l-buccaneer', [0.4, 0.55], [0.5, 0.55], 1.05, 1.18, 'flash', 'dark', '"rodando pelas ruas de Miami"', [3.9]),
	P('C', 4.55, 8.25, 'v-grupo1', [0.5, 0.75], [0.5, 0.6], 1.3, 1.08, 'whipL', 'dark', '"em outubro, um comboio de carros idênticos"'),
	P('D', 8.25, 11.45, 'l-coquette', [0.45, 0.55], [0.55, 0.55], 1.05, 1.15, 'whipR', 'dark', '"Miami, Key Biscayne, placa de Leonida"'),
	P('E', 11.45, 18.45, 'v-tempesta', [0.5, 0.62], [0.5, 0.58], 1.0, 1.25, 'flash', 'dark', '"na frente de todos... viatura da polícia de Vice City"', [13.2, 17.2]),
	P('F', 18.45, 22.3, 'l-manana', [0.45, 0.55], [0.55, 0.55], 1.08, 1.18, 'whipL', 'dark', '"quem construiu foi a West Coast Customs"'),
	P('G', 22.3, 25.85, 'l-emerus', [0.5, 0.55], [0.42, 0.55], 1.15, 1.05, 'whipR', 'dark', '"já tinha feito um carro de verdade de GTA 5"'),
	P('H', 25.85, 28.55, 'v-grupo2', [0.3, 0.75], [0.6, 0.7], 1.5, 1.4, 'zoom', 'dark', '"a Rockstar mostrou os seis dentro do jogo"', [27.6]),
	P('I', 28.55, 29.75, 'v-cheetah', [0.5, 0.65], [0.5, 0.65], 1.15, 1.25, 'flash', 'base', '"O Cheetah"', [29.1]),
	P('J', 29.75, 31.2, 'v-tempesta', [0.5, 0.62], [0.5, 0.62], 1.3, 1.4, 'cut', 'base', '"O Tempesta da polícia"', [29.9]),
	P('K', 31.2, 32.15, 'v-emerus', [0.5, 0.62], [0.5, 0.62], 1.15, 1.25, 'cut', 'base', '"O Emerus"', [31.4]),
	P('L', 32.15, 33.05, 'v-coquette', [0.5, 0.65], [0.5, 0.65], 1.15, 1.25, 'cut', 'base', '"O Coquette"', [32.3]),
	P('M', 33.05, 35.05, 'v-manana', [0.5, 0.62], [0.5, 0.68], 1.1, 1.3, 'cut', 'base', '"O Manana, com rodas douradas"', [33.2, 34.3]),
	P('N', 35.05, 37.5, 'v-buccaneer', [0.5, 0.65], [0.5, 0.65], 1.1, 1.25, 'cut', 'base', '"E o Buccaneer verde, rebaixado"', [35.4]),
	P('O', 37.5, 40.85, 'l-cheetah', [0.55, 0.55], [0.45, 0.55], 1.08, 1.2, 'whipL', 'dark', '"existe uma versão de verdade de cada um?"'),
	P('P', 40.85, 44.9, 'l-tempesta', [0.5, 0.55], [0.5, 0.55], 1.05, 1.15, 'whipR', 'dark', '"se esse comboio passasse na sua rua, você ia atrás?"'),
	P('Q', 44.9, 51.5, 'v-grupo1', [0.5, 0.7], [0.5, 0.7], 1.2, 1.05, 'cut', 'title', '"Comenta e segue o ZoneGTAVI" — encerramento'),
];
