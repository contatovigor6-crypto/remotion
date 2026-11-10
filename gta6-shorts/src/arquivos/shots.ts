import type {Shot} from '../data/shots';

// Short "Os arquivos de GTA 6 entregaram 3 pistas" — gráficos (arquivos trancados, pistas) sobre fotos vivas oficiais já usadas 1–2 vezes
// (estoque de imagens inéditas esgotado): Launch Gallery (v16) e carros oficiais (v19).
const P = (id: string, from: number, to: number, src: string, f0: [number, number], f1: [number, number], s0: number, s1: number, inT: Shot['inT'], look: Shot['look'], note: string, punches: number[] = []): Shot => ({id, from, to, src: `${src}.jpg`, live: true, focus0: f0, focus1: f1, s0, s1, inT, look, punches, note});

export const SHOTS: Shot[] = [
	P('A', 0, 3.8, 'v16/Vice_City_27', [0.5, 0.5], [0.55, 0.5], 1.3, 1.1, 'glitch', 'dark', '"GTA 6 já está dentro dos consoles... trancado"', [3.0]),
	P('B', 3.8, 8.3, 'v19/v-grupo2', [0.5, 0.65], [0.5, 0.55], 1.25, 1.08, 'whipL', 'dark', '"o pré-download começou hoje"'),
	P('C', 8.3, 12.6, 'v16/Vice_City_13', [0.5, 0.5], [0.55, 0.45], 1.08, 1.2, 'glitch', 'dark', '"criptografados... três pistas"', [11.4]),
	P('D', 12.6, 18.7, 'v16/Jason_and_Lucia_14', [0.45, 0.45], [0.55, 0.45], 1.1, 1.2, 'whipR', 'dark', '"22 GB só de áudio"'),
	P('E', 18.7, 26.6, 'v16/Leonida_Keys_07', [0.6, 0.35], [0.62, 0.65], 1.1, 1.2, 'glitch', 'dark', '"core_restofworld001... Austrália e Nova Zelândia"', [25.2]),
	P('F', 26.6, 29.0, 'v16/Vice_City_26', [0.5, 0.5], [0.5, 0.55], 1.0, 1.35, 'zoom', 'dark', '"ninguém sabe o que tem dentro dele"'),
	P('G', 29.0, 35.0, 'v19/l-emerus', [0.5, 0.55], [0.42, 0.55], 1.15, 1.05, 'flash', 'dark', '"ray tracing... PS5 Pro"', [32.1]),
	P('H', 35.0, 39.4, 'v19/l-coquette', [0.45, 0.55], [0.55, 0.55], 1.05, 1.18, 'whipL', 'dark', '"nome de arquivo engana... Rockstar não confirmou"'),
	P('I', 39.4, 49.0, 'v19/l-cheetah', [0.6, 0.55], [0.4, 0.55], 1.1, 1.2, 'whipR', 'dark', '"bônus: instalar pelo app do Xbox sem pré-venda"'),
	P('J', 49.0, 51.9, 'v19/v-grupo1', [0.5, 0.7], [0.5, 0.6], 1.15, 1.05, 'zoom', 'dark', '"qual pista te deixou mais curioso?"'),
	P('K', 51.9, 59.5, 'v16/Vice_City_15', [0.5, 0.5], [0.5, 0.5], 1.15, 1.05, 'cut', 'title', '"Comenta e segue o ZoneGTAVI" — encerramento'),
];
