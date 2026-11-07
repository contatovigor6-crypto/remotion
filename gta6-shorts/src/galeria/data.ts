import type {Sfx} from '../data/sfx';
import type {Shake} from '../ShortEdit';

export const DURATION_S = 65.0;

export const KEYWORDS = new Set([
	'rockstar', '39', 'imagens', 'novas', 'gta', '6,', 'ninguém', 'visto.', 'galeria', 'lançamento,', 'oficial', 'duas',
	'semanas', 'detalhe.', 'lucia', 'atirando', 'conversível', 'carro-forte', 'polícia', 'mascarados', 'banco', 'reféns', 'jason', 'fugindo',
	'moto', 'viaturas', 'malhando,', 'balada', 'vice', 'city', 'mergulhador', 'keys.', 'assustadora', 'pântano,', 'noite,', 'jacaré',
	'enorme', 'olho', 'vermelho', 'acaso.', 'pré-download', '10', 'novembro,', '19', 'novembro.', 'curioso?', 'comenta', 'zonegtavi,',
]);

export const HIDDEN: [number, number][] = [
	[0, 3.7],
	[45.0, 48.1],
	[58.4, 65.0],
];

export const SHAKES: Shake[] = [
	{at: 1.75, amp: 16},
	{at: 6.1, amp: 16},
	{at: 15.4, amp: 12},
	{at: 38.2, amp: 14},
	{at: 43.72, amp: 16},
	{at: 45.0, amp: 18},
	{at: 53.96, amp: 12},
];

export const SFX: Sfx[] = [
	{at: 0.02, file: 'sfx-impact', vol: 0.5},
	{at: 0.15, file: 'sfx-typing', vol: 0.25},
	{at: 1.75, file: 'sfx-impact', vol: 0.42},
	{at: 2.4, file: 'sfx-whoosh', vol: 0.25},
	{at: 3.68, file: 'sfx-whoosh', vol: 0.3},
	{at: 5.4, file: 'sfx-glitch', vol: 0.3},
	{at: 6.1, file: 'sfx-impact', vol: 0.45},
	{at: 7.68, file: 'sfx-whoosh', vol: 0.3},
	{at: 7.9, file: 'sfx-shutter', vol: 0.35},
	{at: 10.38, file: 'sfx-whoosh', vol: 0.3},
	{at: 10.9, file: 'sfx-pop', vol: 0.4},
	{at: 12.48, file: 'sfx-whoosh', vol: 0.3},
	{at: 13.5, file: 'sfx-pop', vol: 0.35},
	{at: 15.4, file: 'sfx-impact', vol: 0.42},
	{at: 16.5, file: 'sfx-pop', vol: 0.35},
	{at: 19.2, file: 'sfx-pop', vol: 0.35},
	{at: 20.25, file: 'sfx-siren', vol: 0.18},
	{at: 21.98, file: 'sfx-whoosh', vol: 0.3},
	{at: 23.6, file: 'sfx-pop', vol: 0.35},
	{at: 24.95, file: 'sfx-pop', vol: 0.35},
	{at: 25.6, file: 'sfx-pop', vol: 0.35},
	{at: 26.88, file: 'sfx-whoosh', vol: 0.3},
	{at: 27.84, file: 'sfx-pop', vol: 0.35},
	{at: 29.18, file: 'sfx-pop', vol: 0.35},
	{at: 31.0, file: 'sfx-glitch', vol: 0.3},
	{at: 32.16, file: 'sfx-pop', vol: 0.3},
	{at: 33.4, file: 'sfx-tick', vol: 0.3},
	{at: 33.58, file: 'sfx-pop', vol: 0.3},
	{at: 35.6, file: 'sfx-tick', vol: 0.3},
	{at: 35.78, file: 'sfx-pop', vol: 0.3},
	{at: 38.18, file: 'sfx-whoosh-rev', vol: 0.3},
	{at: 40.6, file: 'sfx-impact', vol: 0.42},
	{at: 41.54, file: 'sfx-pop', vol: 0.3},
	{at: 43.72, file: 'sfx-impact', vol: 0.4},
	{at: 45.0, file: 'sfx-glitch', vol: 0.35},
	{at: 48.08, file: 'sfx-whoosh', vol: 0.3},
	{at: 48.6, file: 'sfx-tick', vol: 0.4},
	{at: 49.98, file: 'sfx-whoosh', vol: 0.3},
	{at: 51.4, file: 'sfx-pop', vol: 0.4},
	{at: 53.96, file: 'sfx-impact', vol: 0.42},
	{at: 55.58, file: 'sfx-whoosh', vol: 0.3},
	{at: 55.85, file: 'sfx-pop', vol: 0.3},
	{at: 56.07, file: 'sfx-pop', vol: 0.3},
	{at: 56.29, file: 'sfx-pop', vol: 0.3},
	{at: 56.51, file: 'sfx-pop', vol: 0.3},
	{at: 58.4, file: 'sfx-tick', vol: 0.3},
	{at: 58.9, file: 'sfx-typing', vol: 0.25},
	{at: 60.0, file: 'sfx-tick', vol: 0.45},
	{at: 60.33, file: 'sfx-notify', vol: 0.4},
	{at: 60.73, file: 'sfx-pop', vol: 0.4},
];
