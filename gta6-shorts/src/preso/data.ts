import type {Sfx} from '../data/sfx';
import type {Shake} from '../ShortEdit';

export const DURATION_S = 82.6;

// Destaques seletivos nas legendas
export const KEYWORDS = new Set([
	'preso', 'verdade', 'gta', '6?', '6,', '6', 'capturado', 'fim', 'história?', 'final,', 'diferença', 'eliminado',
	'polícia.', 'polícia', 'jason', 'lucia', 'grades?', 'crime,', 'cercado', 'policiais', 'fuga.', 'morrer,',
	'custódia?', 'possibilidades', 'dinheiro,', 'confiscados', 'liberdade.', 'calma,', 'detalhe', 'confundir.',
	'possibilidades,', 'não', 'confirmadas', 'rockstar.', 'prisão', 'afirmar', 'resposta', 'captura,', 'confirmação',
	'suficiente', 'escapar,', 'atrapalharia', 'diversão?',
]);

// Trechos em que um título grande já mostra a fala
export const HIDDEN: [number, number][] = [
	[2.25, 3.5],
	[11.5, 15.3],
	[62.45, 64.25],
];

export const SHAKES: Shake[] = [
	{at: 0.94, amp: 18},
	{at: 2.32, amp: 22},
	{at: 11.58, amp: 20},
	{at: 13.54, amp: 24},
	{at: 23.32, amp: 22},
	{at: 39.7, amp: 14},
	{at: 50.94, amp: 18},
	{at: 63.44, amp: 26},
];

// Efeitos sonoros sintetizados (scripts/synth_audio.py ... preso) — só em eventos motivados
export const SFX: Sfx[] = [
	{at: 0.0, file: 'sfx-siren', vol: 0.18},
	{at: 0.92, file: 'sfx-cell', vol: 0.55},
	{at: 1.22, file: 'sfx-whoosh', vol: 0.35},
	{at: 2.3, file: 'sfx-impact', vol: 0.55},
	{at: 3.5, file: 'sfx-glitch', vol: 0.3},
	{at: 4.84, file: 'sfx-shutter', vol: 0.5},
	{at: 4.9, file: 'sfx-cuffs', vol: 0.45},
	{at: 5.42, file: 'sfx-whoosh', vol: 0.3},
	{at: 7.86, file: 'sfx-glitch', vol: 0.3},
	{at: 11.56, file: 'sfx-cell', vol: 0.5},
	{at: 13.52, file: 'sfx-impact', vol: 0.55},
	{at: 15.25, file: 'sfx-whoosh-rev', vol: 0.3},
	{at: 15.6, file: 'sfx-siren', vol: 0.15},
	{at: 17.3, file: 'sfx-whoosh', vol: 0.3},
	{at: 19.95, file: 'sfx-whoosh', vol: 0.3},
	{at: 21.48, file: 'sfx-whoosh', vol: 0.25},
	{at: 23.3, file: 'sfx-cell', vol: 0.55},
	{at: 24.1, file: 'sfx-glitch', vol: 0.3},
	{at: 25.3, file: 'sfx-pop', vol: 0.35},
	{at: 25.9, file: 'sfx-siren', vol: 0.22},
	{at: 28.94, file: 'sfx-glitch', vol: 0.3},
	{at: 30.12, file: 'sfx-whoosh-rev', vol: 0.3},
	{at: 32.74, file: 'sfx-cuffs', vol: 0.5},
	{at: 34.1, file: 'sfx-shutter', vol: 0.5},
	{at: 35.02, file: 'sfx-whoosh', vol: 0.3},
	{at: 38.08, file: 'sfx-pop', vol: 0.4},
	{at: 39.68, file: 'sfx-impact', vol: 0.4},
	{at: 40.5, file: 'sfx-whoosh', vol: 0.3},
	{at: 42.9, file: 'sfx-whoosh-rev', vol: 0.3},
	{at: 44.26, file: 'sfx-tapestop', vol: 0.45},
	{at: 46.16, file: 'sfx-pop', vol: 0.35},
	{at: 48.52, file: 'sfx-glitch', vol: 0.3},
	{at: 50.92, file: 'sfx-impact', vol: 0.55},
	{at: 54.22, file: 'sfx-whoosh', vol: 0.3},
	{at: 58.22, file: 'sfx-whoosh', vol: 0.3},
	{at: 60.44, file: 'sfx-cell', vol: 0.4},
	{at: 63.42, file: 'sfx-impact', vol: 0.65},
	{at: 64.28, file: 'sfx-whoosh', vol: 0.3},
	{at: 65.54, file: 'sfx-pop', vol: 0.4},
	{at: 67.6, file: 'sfx-glitch', vol: 0.35},
	{at: 69.7, file: 'sfx-whoosh', vol: 0.3},
	{at: 72.55, file: 'sfx-whoosh-rev', vol: 0.3},
	{at: 76.58, file: 'sfx-pop', vol: 0.4},
	{at: 79.18, file: 'sfx-pop', vol: 0.4},
	{at: 81.1, file: 'sfx-typing', vol: 0.3},
];
