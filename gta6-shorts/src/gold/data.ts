import type {Sfx} from '../data/sfx';
import type {Shake} from '../ShortEdit';

export const DURATION_S = 62.5;

export const KEYWORDS = new Set([
	'gta', '6', 'pronto?', 'ontem,', 'rockstar.', 'take-two,', 'strauss', 'zelnick', 'completou', 'desenvolvimento', '6.', '"gold",',
	'final', 'fechada,', 'pré-venda', 'expectativas.', 'take-two', 'precedentes.', 'número.', 'cauteloso,', 'vitória.', 'adiamentos,', 'pronto.', '19',
	'novembro.', 'gold', 'acabou.', 'atualização', 'dia.', 'faltam', 'nove', 'dias.', 'recordes?', 'comenta,', 'zonegtavi.',
]);

export const HIDDEN: [number, number][] = [
	[0, 2.5],
	[48.8, 54.3],
	[54.3, 62.5],
];

export const SHAKES: Shake[] = [
	{at: 0.2, amp: 14},
	{at: 13.4, amp: 12},
	{at: 26.4, amp: 14},
	{at: 41.5, amp: 14},
];

export const SFX: Sfx[] = [
	{at: 0.02, file: 'sfx-impact', vol: 0.5},
	{at: 0.1, file: 'sfx-whoosh', vol: 0.3},
	{at: 2.48, file: 'sfx-whoosh', vol: 0.3},
	{at: 2.6, file: 'sfx-pop', vol: 0.35},
	{at: 6.38, file: 'sfx-whoosh', vol: 0.3},
	{at: 6.6, file: 'sfx-pop', vol: 0.3},
	{at: 10.4, file: 'sfx-typing', vol: 0.3},
	{at: 13.4, file: 'sfx-impact', vol: 0.42},
	{at: 13.8, file: 'sfx-pop', vol: 0.35},
	{at: 18.88, file: 'sfx-whoosh', vol: 0.3},
	{at: 19.1, file: 'sfx-pop', vol: 0.3},
	{at: 22.4, file: 'sfx-pop', vol: 0.4},
	{at: 26.4, file: 'sfx-impact', vol: 0.42},
	{at: 27.6, file: 'sfx-glitch', vol: 0.32},
	{at: 27.7, file: 'sfx-glitch', vol: 0.35},
	{at: 29.7, file: 'sfx-pop', vol: 0.4},
	{at: 30.58, file: 'sfx-whoosh', vol: 0.3},
	{at: 30.8, file: 'sfx-whoosh', vol: 0.3},
	{at: 35.88, file: 'sfx-whoosh', vol: 0.3},
	{at: 36.3, file: 'sfx-tick', vol: 0.35},
	{at: 37.0, file: 'sfx-tick', vol: 0.35},
	{at: 37.7, file: 'sfx-tick', vol: 0.35},
	{at: 41.5, file: 'sfx-impact', vol: 0.45},
	{at: 42.78, file: 'sfx-whoosh', vol: 0.3},
	{at: 43.0, file: 'sfx-pop', vol: 0.35},
	{at: 48.78, file: 'sfx-whoosh', vol: 0.3},
	{at: 49.0, file: 'sfx-subdrop', vol: 0.35},
	{at: 50.8, file: 'sfx-pop', vol: 0.35},
	{at: 51.1, file: 'sfx-pop', vol: 0.35},
	{at: 54.3, file: 'sfx-tick', vol: 0.3},
	{at: 54.8, file: 'sfx-typing', vol: 0.25},
	{at: 55.9, file: 'sfx-tick', vol: 0.45},
	{at: 56.23, file: 'sfx-notify', vol: 0.4},
	{at: 56.63, file: 'sfx-pop', vol: 0.4},
];
