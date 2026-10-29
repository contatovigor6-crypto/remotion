import type {Sfx} from '../data/sfx';
import type {Shake} from '../ShortEdit';

export const DURATION_S = 98.6;

export const KEYWORDS = new Set([
	'jason', 'favor', 'gta', '6?', '6', '6.', 'caro', 'final,', 'dono', 'casa', 'detalhe', 'importante', 'rockstar', 'propriedade',
	'brian', 'heder,', 'criminoso', 'experiente', 'tráfico', 'drogas.', 'sofá', 'pizza.', 'diferente.', 'troca', 'cobrar', 'dívidas',
	'criminosas.', 'aluguel', 'boleto,', 'problema.', 'militar,', 'criminosos', 'lugar', 'crime,', 'obrigação', 'abandonar.',
	'submundo', 'lucia', 'atenção,', 'confirmou', 'acordo', 'consequências', 'graça', 'criminosos?', 'aluguel.', 'missão',
	'secundária', 'like', 'inscreve', 'zonegtavi', 'curiosidades',
]);

// Trechos em que um título grande já mostra a fala
export const HIDDEN: [number, number][] = [
	[0, 2.3],
	[18.3, 19.46],
	[93.7, 98.6],
];

export const SHAKES: Shake[] = [
	{at: 2.76, amp: 14},
	{at: 8.14, amp: 16},
	{at: 18.42, amp: 16},
	{at: 21.3, amp: 14},
	{at: 28.2, amp: 16},
	{at: 35.84, amp: 18},
	{at: 43.92, amp: 20},
	{at: 58.84, amp: 18},
	{at: 74.44, amp: 14},
	{at: 87.24, amp: 14},
];

export const SFX: Sfx[] = [
	{at: 0.02, file: 'sfx-impact', vol: 0.45},
	{at: 1.6, file: 'sfx-pop', vol: 0.35},
	{at: 2.38, file: 'sfx-whoosh', vol: 0.3},
	{at: 2.6, file: 'sfx-impact', vol: 0.4},
	{at: 4.58, file: 'sfx-glitch', vol: 0.3},
	{at: 4.9, file: 'sfx-typing', vol: 0.3},
	{at: 8.12, file: 'sfx-subdrop', vol: 0.45},
	{at: 9.56, file: 'sfx-whoosh-rev', vol: 0.3},
	{at: 11.74, file: 'sfx-pop', vol: 0.35},
	{at: 15.32, file: 'sfx-whoosh', vol: 0.3},
	{at: 18.42, file: 'sfx-impact', vol: 0.5},
	{at: 19.44, file: 'sfx-whoosh', vol: 0.3},
	{at: 19.64, file: 'sfx-pop', vol: 0.35},
	{at: 21.3, file: 'sfx-impact', vol: 0.4},
	{at: 23.02, file: 'sfx-whoosh', vol: 0.3},
	{at: 25.3, file: 'sfx-pop', vol: 0.35},
	{at: 27.64, file: 'sfx-pop', vol: 0.35},
	{at: 28.18, file: 'sfx-glitch', vol: 0.35},
	{at: 29.4, file: 'sfx-impact', vol: 0.45},
	{at: 31.66, file: 'sfx-whoosh', vol: 0.3},
	{at: 32.0, file: 'sfx-typing', vol: 0.3},
	{at: 35.84, file: 'sfx-impact', vol: 0.5},
	{at: 39.62, file: 'sfx-whoosh', vol: 0.3},
	{at: 40.62, file: 'sfx-shutter', vol: 0.35},
	{at: 43.9, file: 'sfx-impact', vol: 0.55},
	{at: 44.98, file: 'sfx-whoosh-rev', vol: 0.3},
	{at: 47.76, file: 'sfx-whoosh', vol: 0.3},
	{at: 48.14, file: 'sfx-pop', vol: 0.35},
	{at: 49.46, file: 'sfx-pop', vol: 0.35},
	{at: 51.48, file: 'sfx-pop', vol: 0.35},
	{at: 54.02, file: 'sfx-glitch', vol: 0.3},
	{at: 57.18, file: 'sfx-whoosh', vol: 0.3},
	{at: 58.84, file: 'sfx-cuffs', vol: 0.45},
	{at: 61.0, file: 'sfx-whoosh', vol: 0.3},
	{at: 64.48, file: 'sfx-pop', vol: 0.35},
	{at: 65.86, file: 'sfx-pop', vol: 0.35},
	{at: 67.04, file: 'sfx-whoosh', vol: 0.3},
	{at: 68.42, file: 'sfx-pop', vol: 0.35},
	{at: 69.78, file: 'sfx-tapestop', vol: 0.4},
	{at: 71.58, file: 'sfx-pop', vol: 0.35},
	{at: 73.64, file: 'sfx-whoosh', vol: 0.3},
	{at: 74.44, file: 'sfx-impact', vol: 0.4},
	{at: 78.88, file: 'sfx-whoosh', vol: 0.3},
	{at: 81.12, file: 'sfx-pop', vol: 0.4},
	{at: 85.32, file: 'sfx-whoosh', vol: 0.3},
	{at: 86.84, file: 'sfx-pop', vol: 0.4},
	{at: 88.32, file: 'sfx-whoosh', vol: 0.3},
	{at: 88.5, file: 'sfx-notify', vol: 0.4},
	{at: 92.14, file: 'sfx-whoosh', vol: 0.3},
	{at: 93.68, file: 'sfx-whoosh', vol: 0.3},
	{at: 93.98, file: 'sfx-impact', vol: 0.45},
	{at: 94.2, file: 'sfx-notify', vol: 0.4},
];
