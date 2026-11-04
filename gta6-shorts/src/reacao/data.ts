import type {Sfx} from '../data/sfx';
import type {Shake} from '../ShortEdit';

export const DURATION_S = 75.9;

export const KEYWORDS = new Set([
	'detalhe', 'gta', '6', 'completamente', 'joga.', 'arma', 'desconhecido.', 'v,', 'pedestres', 'ignoravam', 'apontasse',
	'rockstar', 'realismo', 'rob', 'nelson', '6,', 'reagir', 'convincente', 'mais!', '600', 'mil', 'animações', 'personalidade',
	'variedade', 'npcs', 'figurantes', 'experiência.', 'diferenças', '6.', 'mundo', 'reagir.', 'liberdade', 'reação',
	'inesperada?', 'comenta', 'inscreve', 'zonegtavi',
]);

export const HIDDEN: [number, number][] = [
	[0, 1.95],
	[36.5, 37.5],
	[40.0, 42.6],
	[71.1, 75.9],
];

export const SHAKES: Shake[] = [
	{at: 2.8, amp: 14},
	{at: 9.5, amp: 18},
	{at: 17.8, amp: 14},
	{at: 36.6, amp: 16},
	{at: 40.2, amp: 14},
	{at: 62.8, amp: 18},
];

export const SFX: Sfx[] = [
	{at: 0.02, file: 'sfx-impact', vol: 0.45},
	{at: 0.8, file: 'sfx-pop', vol: 0.35},
	{at: 1.98, file: 'sfx-glitch', vol: 0.3},
	{at: 5.98, file: 'sfx-whoosh', vol: 0.3},
	{at: 8.78, file: 'sfx-whoosh', vol: 0.3},
	{at: 9.5, file: 'sfx-cuffs', vol: 0.4},
	{at: 9.55, file: 'sfx-impact', vol: 0.45},
	{at: 11.78, file: 'sfx-whoosh-rev', vol: 0.3},
	{at: 16.38, file: 'sfx-whoosh', vol: 0.3},
	{at: 17.2, file: 'sfx-pop', vol: 0.4},
	{at: 20.58, file: 'sfx-whoosh', vol: 0.3},
	{at: 22.7, file: 'sfx-pop', vol: 0.35},
	{at: 26.18, file: 'sfx-whoosh', vol: 0.3},
	{at: 28.3, file: 'sfx-typing', vol: 0.3},
	{at: 30.28, file: 'sfx-glitch', vol: 0.3},
	{at: 33.28, file: 'sfx-whoosh', vol: 0.3},
	{at: 36.5, file: 'sfx-impact', vol: 0.5},
	{at: 37.48, file: 'sfx-whoosh', vol: 0.3},
	{at: 40.2, file: 'sfx-subdrop', vol: 0.4},
	{at: 46.28, file: 'sfx-whoosh', vol: 0.3},
	{at: 49.6, file: 'sfx-glitch', vol: 0.3},
	{at: 51.68, file: 'sfx-glitch', vol: 0.3},
	{at: 54.48, file: 'sfx-whoosh', vol: 0.3},
	{at: 56.4, file: 'sfx-pop', vol: 0.35},
	{at: 58.78, file: 'sfx-whoosh', vol: 0.3},
	{at: 62.0, file: 'sfx-impact', vol: 0.45},
	{at: 63.78, file: 'sfx-whoosh', vol: 0.3},
	{at: 66.4, file: 'sfx-pop', vol: 0.4},
	{at: 68.3, file: 'sfx-pop', vol: 0.4},
	{at: 71.2, file: 'sfx-impact', vol: 0.5},
	{at: 71.22, file: 'sfx-subdrop', vol: 0.35},
	{at: 71.6, file: 'sfx-typing', vol: 0.25},
	{at: 72.7, file: 'sfx-tick', vol: 0.45},
	{at: 73.03, file: 'sfx-notify', vol: 0.4},
	{at: 73.43, file: 'sfx-pop', vol: 0.4},
];
