import type {Shot} from '../data/shots';

// Short "O código de GTA 6 entregou 2 segredos" — gráficos (terminal/conquistas) sobre fotos vivas oficiais.
// Inéditas em vídeo: Vice_City_18/23, Jason_and_Lucia_18, Lucia_Caminos_14. Reaproveitada (só 1 vídeo antes): imagem do Newswire (v15).
const P = (id: string, from: number, to: number, src: string, f0: [number, number], f1: [number, number], s0: number, s1: number, inT: Shot['inT'], look: Shot['look'], note: string, punches: number[] = []): Shot => ({id, from, to, src, live: true, focus0: f0, focus1: f1, s0, s1, inT, look, punches, note});

export const SHOTS: Shot[] = [
	P('A', 0, 5.45, 'v16/Vice_City_23.jpg', [0.45, 0.45], [0.55, 0.45], 1.2, 1.05, 'glitch', 'dark', '"O código de GTA 6 entregou dois segredos"', [0.3, 3.5]),
	P('B', 5.45, 12.55, 'v16/Vice_City_18.jpg', [0.35, 0.45], [0.6, 0.45], 1.05, 1.18, 'glitch', 'dark', '"joinSession... launchMultiplayerActivity"', [9.6, 10.8]),
	P('C', 12.55, 16.85, 'v16/Jason_and_Lucia_18.jpg', [0.4, 0.5], [0.6, 0.5], 1.08, 1.15, 'whipL', 'dark', '"entrar numa sessão... iniciar multiplayer"'),
	P('D', 16.85, 24.75, 'v15/hero.jpg', [0.2, 0.55], [0.75, 0.45], 1.3, 1.15, 'whipR', 'dark', '"página oficial: um jogador... online depois"'),
	P('E', 24.75, 28.85, 'v16/Jason_and_Lucia_18.jpg', [0.75, 0.45], [0.7, 0.45], 1.35, 1.25, 'zoom', 'dark', '"em GTA 5, o online chegou duas semanas depois"'),
	P('F', 28.85, 40.35, 'v16/Vice_City_23.jpg', [0.7, 0.5], [0.3, 0.5], 1.25, 1.12, 'glitch', 'dark', '"55 conquistas... uma com o número 1000"', [33.0, 39.9]),
	P('G', 40.35, 44.85, 'v16/Lucia_Caminos_14.jpg', [0.3, 0.38], [0.32, 0.4], 1.1, 1.25, 'flash', 'dark', '"a platina de GTA 6"', [42.9]),
	P('H', 44.85, 51.85, 'v16/Vice_City_18.jpg', [0.7, 0.5], [0.5, 0.5], 1.25, 1.1, 'whipL', 'dark', '"nada confirmado... pré-download amanhã"', [45.7]),
	P('I', 51.85, 55.5, 'v15/hero-towers.jpg', [0.5, 0.35], [0.5, 0.5], 1.15, 1.05, 'whipR', 'dark', '"GTA 6 Online no lançamento?"'),
	P('J', 55.5, 63.0, 'v15/hero-downtown.jpg', [0.5, 0.4], [0.5, 0.4], 1.15, 1.05, 'cut', 'title', '"Comenta e segue o ZoneGTAVI" — encerramento'),
];
