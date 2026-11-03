import type {Sfx} from '../data/sfx';
import type {Shake} from '../ShortEdit';

export const DURATION_S = 95.4;

export const KEYWORDS = new Set([
	'rockstar', 'semanas', 'importantes', 'história,', 'acontecimento', 'observando.', '19', 'novembro,', 'gta', '6', 'lançado,',
	'funcionários', 'rockstar.', '12', '26', 'reino', 'unido', 'sindical', 'iwgb,', 'sindicato', 'importante?', 'favorável,',
	'coletiva', 'salários,', 'horas', 'extras,', 'demissões', 'condições', 'coincidência!', 'pré', '-carregamento', 'lançamento',
	'milhões', 'decisivo', 'distintos.', 'confirmação', 'certa,', '2026', 'motivo.', 'comenta', 'inscreve', 'zonegtavi',
]);

export const HIDDEN: [number, number][] = [
	[0, 5.5],
	[81.4, 86.6],
	[90.7, 95.4],
];

export const SHAKES: Shake[] = [
	{at: 1.0, amp: 12},
	{at: 10.1, amp: 14},
	{at: 22.4, amp: 14},
	{at: 31.6, amp: 16},
	{at: 48.8, amp: 18},
	{at: 76.0, amp: 12},
];

export const SFX: Sfx[] = [
	{at: 0.02, file: 'sfx-impact', vol: 0.45},
	{at: 0.9, file: 'sfx-pop', vol: 0.35},
	{at: 2.18, file: 'sfx-whoosh', vol: 0.3},
	{at: 5.58, file: 'sfx-glitch', vol: 0.3},
	{at: 7.3, file: 'sfx-pop', vol: 0.35},
	{at: 9.68, file: 'sfx-whoosh', vol: 0.3},
	{at: 10.1, file: 'sfx-impact', vol: 0.45},
	{at: 14.18, file: 'sfx-whoosh', vol: 0.3},
	{at: 15.98, file: 'sfx-whoosh', vol: 0.3},
	{at: 21.68, file: 'sfx-whoosh', vol: 0.3},
	{at: 22.4, file: 'sfx-typing', vol: 0.3},
	{at: 27.08, file: 'sfx-whoosh', vol: 0.3},
	{at: 28.1, file: 'sfx-pop', vol: 0.35},
	{at: 31.6, file: 'sfx-impact', vol: 0.45},
	{at: 34.38, file: 'sfx-glitch', vol: 0.3},
	{at: 34.5, file: 'sfx-impact', vol: 0.4},
	{at: 36.58, file: 'sfx-whoosh', vol: 0.3},
	{at: 43.8, file: 'sfx-pop', vol: 0.35},
	{at: 44.9, file: 'sfx-pop', vol: 0.35},
	{at: 45.7, file: 'sfx-pop', vol: 0.35},
	{at: 46.5, file: 'sfx-pop', vol: 0.35},
	{at: 47.9, file: 'sfx-impact', vol: 0.5},
	{at: 49.78, file: 'sfx-whoosh', vol: 0.3},
	{at: 54.0, file: 'sfx-notify', vol: 0.35},
	{at: 55.58, file: 'sfx-whoosh', vol: 0.3},
	{at: 56.6, file: 'sfx-pop', vol: 0.35},
	{at: 58.48, file: 'sfx-whoosh', vol: 0.3},
	{at: 59.7, file: 'sfx-pop', vol: 0.35},
	{at: 63.88, file: 'sfx-glitch', vol: 0.3},
	{at: 64.2, file: 'sfx-pop', vol: 0.35},
	{at: 69.38, file: 'sfx-tapestop', vol: 0.4},
	{at: 76.0, file: 'sfx-impact', vol: 0.4},
	{at: 79.28, file: 'sfx-whoosh', vol: 0.3},
	{at: 81.38, file: 'sfx-whoosh', vol: 0.3},
	{at: 82.0, file: 'sfx-impact', vol: 0.45},
	{at: 86.58, file: 'sfx-glitch', vol: 0.3},
	{at: 90.68, file: 'sfx-whoosh', vol: 0.3},
	{at: 90.8, file: 'sfx-impact', vol: 0.5},
	{at: 90.82, file: 'sfx-subdrop', vol: 0.35},
	{at: 91.2, file: 'sfx-typing', vol: 0.25},
	{at: 92.3, file: 'sfx-tick', vol: 0.45},
	{at: 92.63, file: 'sfx-notify', vol: 0.4},
	{at: 93.03, file: 'sfx-pop', vol: 0.4},
];
