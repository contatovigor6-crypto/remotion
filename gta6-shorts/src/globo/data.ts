import type {Sfx} from '../data/sfx';
import type {Shake} from '../ShortEdit';

export const DURATION_S = 51.0;

export const KEYWORDS = new Set([
	'gta', '6', 'globo.', 'sábado,', 'fórmula', '1.', 'duas', 'tarde,', 'gp', 'são', 'paulo,', 'interlagos.',
	'30', 'segundos', 'vice', 'city,', 'português,', '18', 'anos,', '"vamos', 'bem?"', 'acreditou.', 'fã', 'filmou',
	'tv,', 'espalhou', 'redes.', 'painel', 'avenida', 'nove', 'julho,', 'praça', 'sé', 'metrô', 'rockstar', 'brasil',
	'nunca.', 'faltam', '11', 'dias.', 'comercial?', 'comenta', 'zonegtavi.',
]);

export const HIDDEN: [number, number][] = [
	[0, 3.3],
	[16.6, 20.3],
	[39.2, 43.4],
	[43.4, 51.0],
];

export const SHAKES: Shake[] = [
	{at: 1.6, amp: 16},
	{at: 16.6, amp: 12},
	{at: 20.4, amp: 16},
	{at: 36.3, amp: 14},
];

export const SFX: Sfx[] = [
	{at: 0.02, file: 'sfx-impact', vol: 0.5},
	{at: 1.6, file: 'sfx-pop', vol: 0.45},
	{at: 2.0, file: 'sfx-impact', vol: 0.42},
	{at: 3.28, file: 'sfx-whoosh', vol: 0.3},
	{at: 3.4, file: 'sfx-pop', vol: 0.35},
	{at: 6.18, file: 'sfx-whoosh', vol: 0.3},
	{at: 6.9, file: 'sfx-pop', vol: 0.35},
	{at: 9.5, file: 'sfx-pop', vol: 0.35},
	{at: 10.6, file: 'sfx-glitch', vol: 0.3},
	{at: 13.38, file: 'sfx-whoosh', vol: 0.3},
	{at: 13.5, file: 'sfx-pop', vol: 0.35},
	{at: 15.38, file: 'sfx-pop', vol: 0.35},
	{at: 16.58, file: 'sfx-whoosh', vol: 0.3},
	{at: 18.3, file: 'sfx-typing', vol: 0.25},
	{at: 20.3, file: 'sfx-impact', vol: 0.42},
	{at: 20.4, file: 'sfx-impact', vol: 0.45},
	{at: 22.98, file: 'sfx-whoosh', vol: 0.3},
	{at: 23.2, file: 'sfx-shutter', vol: 0.35},
	{at: 25.5, file: 'sfx-notify', vol: 0.35},
	{at: 27.1, file: 'sfx-glitch', vol: 0.3},
	{at: 27.2, file: 'sfx-glitch', vol: 0.3},
	{at: 28.98, file: 'sfx-whoosh', vol: 0.3},
	{at: 30.66, file: 'sfx-pop', vol: 0.35},
	{at: 32.4, file: 'sfx-tick', vol: 0.3},
	{at: 33.62, file: 'sfx-pop', vol: 0.35},
	{at: 35.78, file: 'sfx-whoosh', vol: 0.3},
	{at: 36.3, file: 'sfx-impact', vol: 0.45},
	{at: 39.18, file: 'sfx-whoosh', vol: 0.3},
	{at: 39.3, file: 'sfx-subdrop', vol: 0.4},
	{at: 41.3, file: 'sfx-pop', vol: 0.35},
	{at: 41.55, file: 'sfx-pop', vol: 0.35},
	{at: 43.4, file: 'sfx-tick', vol: 0.3},
	{at: 43.9, file: 'sfx-typing', vol: 0.25},
	{at: 45.0, file: 'sfx-tick', vol: 0.45},
	{at: 45.33, file: 'sfx-notify', vol: 0.4},
	{at: 45.73, file: 'sfx-pop', vol: 0.4},
];
