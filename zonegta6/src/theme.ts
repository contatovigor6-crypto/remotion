import {loadFont as loadAnton} from '@remotion/google-fonts/Anton';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';

export const display = loadAnton('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;
export const body = loadInter('normal', {
	weights: ['400', '600', '800'],
	subsets: ['latin'],
}).fontFamily;
export const mono = loadMono('normal', {weights: ['500', '700'], subsets: ['latin']}).fontFamily;

// Identidade ZoneGTA6: noite de neon, sem copiar a arte oficial da Rockstar.
export const C = {
	bg: '#06060c',
	panel: 'rgba(14, 14, 28, 0.82)',
	pink: '#ff2e88',
	cyan: '#19e3ff',
	amber: '#ffb347',
	white: '#f4f4fb',
	dim: 'rgba(244, 244, 251, 0.62)',
	green: '#3cff9e',
	red: '#ff4d4d',
};

// Protocolo de verdade: toda informação na tela carrega uma destas etiquetas.
export type Status = 'CONFIRMADO' | 'REPORTADO' | 'RUMOR' | 'TEORIA';
export const statusColor: Record<Status, string> = {
	CONFIRMADO: C.green,
	REPORTADO: C.cyan,
	RUMOR: C.amber,
	TEORIA: C.pink,
};

export const FPS = 30;
