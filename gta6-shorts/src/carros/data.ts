import type {Sfx} from '../data/sfx';
import type {Shake} from '../ShortEdit';

export const DURATION_S = 51.5;

export const KEYWORDS = new Set([
	'carros', 'gta', '6', 'jogo,', 'miami.', 'outubro,', 'comboio', 'idênticos', 'key', 'biscayne,', 'placa', 'leonida.',
	'viatura', 'polícia', 'vice', 'city.', 'esportivo,', 'giroflex', 'west', 'coast', 'customs,', 'verdade', '5.', 'rockstar',
	'seis', 'jogo.', 'acreditar', 'versão', 'um?', 'comboio', 'rua,', 'atrás?', 'comenta,', 'zonegtavi.',
]);

export const HIDDEN: [number, number][] = [
	[0, 4.55],
	[25.85, 37.5],
	[40.85, 44.9],
	[44.9, 51.5],
];

export const SHAKES: Shake[] = [
	{at: 0.4, amp: 14},
	{at: 10.4, amp: 12},
	{at: 13.2, amp: 14},
	{at: 25.9, amp: 16},
	{at: 37.6, amp: 14},
];

export const SFX: Sfx[] = [
	{at: 0.02, file: 'sfx-impact', vol: 0.5},
	{at: 2.55, file: 'sfx-impact', vol: 0.42},
	{at: 4.53, file: 'sfx-whoosh', vol: 0.3},
	{at: 4.7, file: 'sfx-pop', vol: 0.3},
	{at: 5.7, file: 'sfx-pop', vol: 0.3},
	{at: 8.23, file: 'sfx-whoosh', vol: 0.3},
	{at: 8.4, file: 'sfx-pop', vol: 0.3},
	{at: 10.4, file: 'sfx-impact', vol: 0.4},
	{at: 11.45, file: 'sfx-impact', vol: 0.42},
	{at: 13.2, file: 'sfx-siren', vol: 0.22},
	{at: 17.0, file: 'sfx-siren', vol: 0.2},
	{at: 18.43, file: 'sfx-whoosh', vol: 0.3},
	{at: 20.9, file: 'sfx-pop', vol: 0.4},
	{at: 22.28, file: 'sfx-whoosh', vol: 0.3},
	{at: 23.6, file: 'sfx-pop', vol: 0.35},
	{at: 25.83, file: 'sfx-whoosh', vol: 0.3},
	{at: 28.55, file: 'sfx-impact', vol: 0.42},
	{at: 29.75, file: 'sfx-tick', vol: 0.35},
	{at: 31.2, file: 'sfx-tick', vol: 0.35},
	{at: 32.15, file: 'sfx-tick', vol: 0.35},
	{at: 33.05, file: 'sfx-tick', vol: 0.35},
	{at: 35.05, file: 'sfx-tick', vol: 0.35},
	{at: 37.48, file: 'sfx-whoosh', vol: 0.3},
	{at: 37.6, file: 'sfx-impact', vol: 0.45},
	{at: 40.83, file: 'sfx-whoosh', vol: 0.3},
	{at: 41.45, file: 'sfx-pop', vol: 0.35},
	{at: 41.75, file: 'sfx-pop', vol: 0.35},
	{at: 44.9, file: 'sfx-tick', vol: 0.35},
	{at: 45.4, file: 'sfx-typing', vol: 0.25},
	{at: 46.5, file: 'sfx-tick', vol: 0.45},
	{at: 46.83, file: 'sfx-notify', vol: 0.4},
	{at: 47.23, file: 'sfx-pop', vol: 0.4},
];
