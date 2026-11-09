import type {Sfx} from '../data/sfx';
import type {Shake} from '../ShortEdit';

export const DURATION_S = 63.0;

export const KEYWORDS = new Set([
	'código', 'gta', '6', 'segredos,', 'rockstar', 'nada.', 'playstation', 'join', 'session', 'launch', 'multiplayer', 'activity,',
	'sessão', 'multiplayer.', 'oficial', 'jogador.', 'online', 'atualização.', 'v,', 'semanas', 'lançamento.', '55', 'conquistas', '54,',
	'1000.', 'final.', 'platina', 'confirmado', 'pré-download', 'amanhã,', 'arquivos', 'lançamento?', 'comenta,', 'zonegtavi.',
]);

export const HIDDEN: [number, number][] = [
	[0, 5.45],
	[28.85, 40.35],
	[51.85, 55.5],
	[55.5, 63.0],
];

export const SHAKES: Shake[] = [
	{at: 1.6, amp: 16},
	{at: 10.75, amp: 10},
	{at: 33.6, amp: 12},
	{at: 39.7, amp: 18},
	{at: 45.55, amp: 14},
];

export const SFX: Sfx[] = [
	{at: 0.02, file: 'sfx-glitch', vol: 0.4},
	{at: 0.1, file: 'sfx-typing', vol: 0.3},
	{at: 1.6, file: 'sfx-impact', vol: 0.5},
	{at: 3.2, file: 'sfx-pop', vol: 0.35},
	{at: 5.45, file: 'sfx-glitch', vol: 0.32},
	{at: 5.7, file: 'sfx-typing', vol: 0.3},
	{at: 7.6, file: 'sfx-typing', vol: 0.25},
	{at: 9.55, file: 'sfx-pop', vol: 0.4},
	{at: 10.75, file: 'sfx-pop', vol: 0.4},
	{at: 12.53, file: 'sfx-whoosh', vol: 0.3},
	{at: 13.4, file: 'sfx-pop', vol: 0.35},
	{at: 14.8, file: 'sfx-pop', vol: 0.35},
	{at: 16.83, file: 'sfx-whoosh', vol: 0.3},
	{at: 17.2, file: 'sfx-pop', vol: 0.3},
	{at: 22.1, file: 'sfx-pop', vol: 0.4},
	{at: 24.73, file: 'sfx-whoosh', vol: 0.3},
	{at: 27.3, file: 'sfx-pop', vol: 0.4},
	{at: 28.85, file: 'sfx-glitch', vol: 0.32},
	{at: 32.4, file: 'sfx-typing', vol: 0.3},
	{at: 33.6, file: 'sfx-impact', vol: 0.4},
	{at: 35.6, file: 'sfx-tick', vol: 0.3},
	{at: 39.7, file: 'sfx-impact', vol: 0.5},
	{at: 40.35, file: 'sfx-impact', vol: 0.42},
	{at: 40.45, file: 'sfx-notify', vol: 0.45},
	{at: 42.8, file: 'sfx-pop', vol: 0.35},
	{at: 44.83, file: 'sfx-whoosh', vol: 0.3},
	{at: 45.55, file: 'sfx-impact', vol: 0.45},
	{at: 48.1, file: 'sfx-pop', vol: 0.4},
	{at: 51.83, file: 'sfx-whoosh', vol: 0.3},
	{at: 52.4, file: 'sfx-pop', vol: 0.35},
	{at: 52.7, file: 'sfx-pop', vol: 0.35},
	{at: 55.5, file: 'sfx-tick', vol: 0.3},
	{at: 56.0, file: 'sfx-typing', vol: 0.25},
	{at: 57.1, file: 'sfx-tick', vol: 0.45},
	{at: 57.43, file: 'sfx-notify', vol: 0.4},
	{at: 57.83, file: 'sfx-pop', vol: 0.4},
];
