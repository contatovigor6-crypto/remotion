import type {Sfx} from '../data/sfx';
import type {Shake} from '../ShortEdit';

export const DURATION_S = 67.4;

export const KEYWORDS = new Set([
	'17', 'dias', 'gta', '6,', 'lançamento.', 'rockstar', 'confirmou', '19', 'novembro', 'playstation', 'xbox', 'novidade',
	'importante,', 'pré', '-carregamento', 'digital', '12', 'novembro,', 'semana', 'baixar', 'física', 'código', 'download',
	'sem', 'disco,', 'música', 'álbum', 'justice', '11', 'dezembro.', 'surpresa', 'leonida?', 'sabemos.', 'contagem',
	'regressiva', 'preparado?', 'comenta', 'inscreve', 'zonegtavi',
]);

export const HIDDEN: [number, number][] = [
	[0, 2.35],
	[12.2, 17.0],
	[58.5, 62.4],
	[62.4, 67.4],
];

export const SHAKES: Shake[] = [
	{at: 0.5, amp: 16},
	{at: 12.3, amp: 16},
	{at: 21.4, amp: 14},
	{at: 36.4, amp: 18},
	{at: 51.9, amp: 14},
	{at: 61.5, amp: 18},
];

export const SFX: Sfx[] = [
	{at: 0.02, file: 'sfx-impact', vol: 0.5},
	{at: 0.1, file: 'sfx-tick', vol: 0.35},
	{at: 0.45, file: 'sfx-subdrop', vol: 0.4},
	{at: 2.38, file: 'sfx-whoosh', vol: 0.3},
	{at: 4.58, file: 'sfx-glitch', vol: 0.3},
	{at: 5.4, file: 'sfx-pop', vol: 0.35},
	{at: 9.98, file: 'sfx-whoosh', vol: 0.3},
	{at: 12.2, file: 'sfx-impact', vol: 0.5},
	{at: 13.7, file: 'sfx-pop', vol: 0.35},
	{at: 14.9, file: 'sfx-pop', vol: 0.35},
	{at: 16.98, file: 'sfx-whoosh', vol: 0.3},
	{at: 19.1, file: 'sfx-notify', vol: 0.35},
	{at: 21.4, file: 'sfx-impact', vol: 0.4},
	{at: 22.68, file: 'sfx-whoosh', vol: 0.3},
	{at: 23.7, file: 'sfx-pop', vol: 0.4},
	{at: 27.68, file: 'sfx-glitch', vol: 0.3},
	{at: 30.98, file: 'sfx-whoosh', vol: 0.3},
	{at: 34.1, file: 'sfx-pop', vol: 0.4},
	{at: 36.4, file: 'sfx-impact', vol: 0.45},
	{at: 37.48, file: 'sfx-whoosh', vol: 0.3},
	{at: 40.0, file: 'sfx-pop', vol: 0.35},
	{at: 42.58, file: 'sfx-whoosh', vol: 0.3},
	{at: 46.1, file: 'sfx-pop', vol: 0.35},
	{at: 47.68, file: 'sfx-glitch', vol: 0.3},
	{at: 49.3, file: 'sfx-whoosh-rev', vol: 0.3},
	{at: 51.9, file: 'sfx-impact', vol: 0.4},
	{at: 55.4, file: 'sfx-tapestop', vol: 0.4},
	{at: 56.5, file: 'sfx-impact', vol: 0.45},
	{at: 58.5, file: 'sfx-tick', vol: 0.35},
	{at: 61.1, file: 'sfx-impact', vol: 0.5},
	{at: 62.38, file: 'sfx-whoosh', vol: 0.3},
	{at: 63.6, file: 'sfx-impact', vol: 0.45},
	{at: 63.9, file: 'sfx-notify', vol: 0.4},
];
