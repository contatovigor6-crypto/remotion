import type {Sfx} from '../data/sfx';
import type {Shake} from '../ShortEdit';

export const DURATION_S = 59.5;

export const KEYWORDS = new Set([
	'gta', '6', 'consoles,', 'trancado.', 'pré-download', 'hoje,', 'arquivos.', 'criptografados,', 'três', 'pistas.', '22', 'gb',
	'áudio.', 'diálogos,', 'rádios,', 'músicas.', 'estranha,', '"core_restofworld001"', 'austrália', 'nova', 'zelândia.', 'ninguém', 'ray', 'tracing,',
	'ps5', 'pro.', 'engana,', 'rockstar', 'nada.', 'bônus,', 'xbox,', 'app', 'celular,', 'pré-venda.', '19.', 'curioso?',
	'comenta,', 'zonegtavi.',
]);

export const HIDDEN: [number, number][] = [
	[0, 3.8],
	[49.0, 51.9],
	[51.9, 59.5],
];

export const SHAKES: Shake[] = [
	{at: 2.55, amp: 16},
	{at: 11.3, amp: 10},
	{at: 25.1, amp: 14},
	{at: 35.1, amp: 14},
];

export const SFX: Sfx[] = [
	{at: 0.02, file: 'sfx-glitch', vol: 0.4},
	{at: 2.5, file: 'sfx-cuffs', vol: 0.45},
	{at: 3.78, file: 'sfx-whoosh', vol: 0.3},
	{at: 4.0, file: 'sfx-pop', vol: 0.3},
	{at: 8.3, file: 'sfx-glitch', vol: 0.32},
	{at: 8.5, file: 'sfx-typing', vol: 0.3},
	{at: 11.3, file: 'sfx-pop', vol: 0.45},
	{at: 12.58, file: 'sfx-whoosh', vol: 0.3},
	{at: 12.7, file: 'sfx-pop', vol: 0.35},
	{at: 16.4, file: 'sfx-pop', vol: 0.3},
	{at: 17.3, file: 'sfx-pop', vol: 0.3},
	{at: 18.0, file: 'sfx-pop', vol: 0.3},
	{at: 18.7, file: 'sfx-glitch', vol: 0.32},
	{at: 18.8, file: 'sfx-pop', vol: 0.35},
	{at: 21.5, file: 'sfx-typing', vol: 0.3},
	{at: 25.1, file: 'sfx-impact', vol: 0.45},
	{at: 26.58, file: 'sfx-whoosh', vol: 0.3},
	{at: 26.7, file: 'sfx-subdrop', vol: 0.4},
	{at: 29.0, file: 'sfx-impact', vol: 0.42},
	{at: 29.1, file: 'sfx-pop', vol: 0.35},
	{at: 31.8, file: 'sfx-whoosh-rev', vol: 0.3},
	{at: 33.7, file: 'sfx-pop', vol: 0.4},
	{at: 34.98, file: 'sfx-whoosh', vol: 0.3},
	{at: 35.1, file: 'sfx-impact', vol: 0.45},
	{at: 39.38, file: 'sfx-whoosh', vol: 0.3},
	{at: 39.5, file: 'sfx-pop', vol: 0.35},
	{at: 42.8, file: 'sfx-typing', vol: 0.25},
	{at: 45.8, file: 'sfx-notify', vol: 0.35},
	{at: 46.6, file: 'sfx-tick', vol: 0.4},
	{at: 48.98, file: 'sfx-whoosh', vol: 0.3},
	{at: 49.3, file: 'sfx-pop', vol: 0.3},
	{at: 49.52, file: 'sfx-pop', vol: 0.3},
	{at: 49.74, file: 'sfx-pop', vol: 0.3},
	{at: 51.9, file: 'sfx-tick', vol: 0.3},
	{at: 52.4, file: 'sfx-typing', vol: 0.25},
	{at: 53.5, file: 'sfx-tick', vol: 0.45},
	{at: 53.83, file: 'sfx-notify', vol: 0.4},
	{at: 54.23, file: 'sfx-pop', vol: 0.4},
];
