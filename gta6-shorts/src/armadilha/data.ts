import type {Sfx} from '../data/sfx';
import type {Shake} from '../ShortEdit';

export const DURATION_S = 55.0;

export const KEYWORDS = new Set([
	'rockstar', 'armadilha', 'vazar', 'gta', '6.', 'jogando.', 'insiders,', 'imprensa', 'enviadas,', '18,', 'lançamento.', 'detalhe.',
	'nome', 'jogando,', "d'água,", 'tela.', 'vazou', 'vídeo?', 'exatamente', 'foi.', 'pior.', 'falsas,', 'funcionário.', 'falso',
	'internet,', 'pronto.', 'sobrenome.', 'agosto,', 'nada', 'passar.', 'faltam', '10', 'dias.', 'coragem', '6?', 'comenta,',
	'zonegtavi.',
]);

export const HIDDEN: [number, number][] = [
	[0, 4.2],
	[41.8, 47.4],
	[47.4, 55.0],
];

export const SHAKES: Shake[] = [
	{at: 1.25, amp: 18},
	{at: 13.8, amp: 12},
	{at: 23.6, amp: 14},
	{at: 25.75, amp: 16},
	{at: 36.0, amp: 16},
];

export const SFX: Sfx[] = [
	{at: 0.02, file: 'sfx-glitch', vol: 0.4},
	{at: 1.2, file: 'sfx-cuffs', vol: 0.45},
	{at: 2.4, file: 'sfx-pop', vol: 0.35},
	{at: 4.18, file: 'sfx-whoosh', vol: 0.3},
	{at: 4.3, file: 'sfx-pop', vol: 0.35},
	{at: 6.08, file: 'sfx-whoosh', vol: 0.3},
	{at: 6.4, file: 'sfx-pop', vol: 0.3},
	{at: 7.7, file: 'sfx-pop', vol: 0.3},
	{at: 10.0, file: 'sfx-pop', vol: 0.3},
	{at: 12.4, file: 'sfx-pop', vol: 0.3},
	{at: 13.7, file: 'sfx-impact', vol: 0.42},
	{at: 13.8, file: 'sfx-impact', vol: 0.42},
	{at: 15.3, file: 'sfx-glitch', vol: 0.32},
	{at: 17.0, file: 'sfx-typing', vol: 0.25},
	{at: 17.9, file: 'sfx-shutter', vol: 0.35},
	{at: 21.78, file: 'sfx-whoosh', vol: 0.3},
	{at: 23.6, file: 'sfx-impact', vol: 0.45},
	{at: 25.7, file: 'sfx-impact', vol: 0.42},
	{at: 26.78, file: 'sfx-whoosh', vol: 0.3},
	{at: 29.6, file: 'sfx-pop', vol: 0.3},
	{at: 29.95, file: 'sfx-pop', vol: 0.3},
	{at: 30.3, file: 'sfx-pop', vol: 0.3},
	{at: 31.6, file: 'sfx-glitch', vol: 0.32},
	{at: 32.6, file: 'sfx-notify', vol: 0.4},
	{at: 36.0, file: 'sfx-impact', vol: 0.48},
	{at: 37.48, file: 'sfx-whoosh', vol: 0.3},
	{at: 38.3, file: 'sfx-whoosh', vol: 0.3},
	{at: 41.78, file: 'sfx-whoosh', vol: 0.3},
	{at: 43.9, file: 'sfx-pop', vol: 0.35},
	{at: 44.2, file: 'sfx-pop', vol: 0.35},
	{at: 47.4, file: 'sfx-tick', vol: 0.3},
	{at: 47.9, file: 'sfx-typing', vol: 0.25},
	{at: 49.0, file: 'sfx-tick', vol: 0.45},
	{at: 49.33, file: 'sfx-notify', vol: 0.4},
	{at: 49.73, file: 'sfx-pop', vol: 0.4},
];
