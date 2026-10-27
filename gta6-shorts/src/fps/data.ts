import type {Sfx} from '../data/sfx';
import type {Shake} from '../ShortEdit';

export const DURATION_S = 100.4;

export const KEYWORDS = new Set([
	'gta', '6', '60', 'fps', 'fps,', 'fps.', 'fps?', 'ps5?', 'ps5', 'ps5,', 'decepcionar', 'atenção,', 'importante',
	'lançamento.', 'agosto,', 'relatos', '30', 'desenvolvimento,', 'aberto,', 'definitiva', 'complicado?', 'gráficos',
	'trânsito,', 'multidões,', 'física,', 'inteligência', 'artificial', 'mundo', 'aberto', 'hardware.', 'confunde.',
	'impressionante', 'não', 'confirmou', 'oficialmente', 'cuidado', 'garantido.', 'anos', 'incríveis', 'fluidos.',
	'time', 'comentários.', 'rumores,', 'inscreve', 'zonegtavi.',
]);

// Trechos em que um título grande já mostra a fala
export const HIDDEN: [number, number][] = [
	[35.9, 38.1],
	[96.9, 100.4],
];

export const SHAKES: Shake[] = [
	{at: 0.66, amp: 14},
	{at: 3.2, amp: 16},
	{at: 22.74, amp: 16},
	{at: 33.08, amp: 16},
	{at: 37.06, amp: 20},
	{at: 62.94, amp: 18},
	{at: 85.34, amp: 16},
];

export const SFX: Sfx[] = [
	{at: 0.64, file: 'sfx-impact', vol: 0.5},
	{at: 1.86, file: 'sfx-whoosh', vol: 0.3},
	{at: 3.18, file: 'sfx-glitch', vol: 0.35},
	{at: 4.28, file: 'sfx-whoosh', vol: 0.3},
	{at: 5.36, file: 'sfx-subdrop', vol: 0.4},
	{at: 7.48, file: 'sfx-whoosh', vol: 0.3},
	{at: 8.28, file: 'sfx-pop', vol: 0.35},
	{at: 11.12, file: 'sfx-pop', vol: 0.35},
	{at: 12.7, file: 'sfx-glitch', vol: 0.3},
	{at: 15.5, file: 'sfx-whoosh', vol: 0.3},
	{at: 17.58, file: 'sfx-pop', vol: 0.35},
	{at: 18.56, file: 'sfx-glitch', vol: 0.3},
	{at: 19.82, file: 'sfx-typing', vol: 0.3},
	{at: 22.72, file: 'sfx-impact', vol: 0.45},
	{at: 24.98, file: 'sfx-whoosh', vol: 0.3},
	{at: 30.92, file: 'sfx-pop', vol: 0.35},
	{at: 31.66, file: 'sfx-glitch', vol: 0.3},
	{at: 33.06, file: 'sfx-impact', vol: 0.45},
	{at: 35.86, file: 'sfx-whoosh-rev', vol: 0.3},
	{at: 37.04, file: 'sfx-impact', vol: 0.55},
	{at: 38.12, file: 'sfx-whoosh', vol: 0.3},
	{at: 41.64, file: 'sfx-whoosh', vol: 0.3},
	{at: 43.2, file: 'sfx-pop', vol: 0.3},
	{at: 43.94, file: 'sfx-pop', vol: 0.3},
	{at: 45.04, file: 'sfx-pop', vol: 0.3},
	{at: 45.88, file: 'sfx-pop', vol: 0.3},
	{at: 47.32, file: 'sfx-pop', vol: 0.3},
	{at: 49.7, file: 'sfx-whoosh-rev', vol: 0.3},
	{at: 51.56, file: 'sfx-glitch', vol: 0.35},
	{at: 52.0, file: 'sfx-tapestop', vol: 0.45},
	{at: 55.3, file: 'sfx-whoosh', vol: 0.3},
	{at: 57.6, file: 'sfx-pop', vol: 0.35},
	{at: 61.1, file: 'sfx-glitch', vol: 0.3},
	{at: 62.92, file: 'sfx-impact', vol: 0.5},
	{at: 67.38, file: 'sfx-whoosh', vol: 0.3},
	{at: 68.7, file: 'sfx-glitch', vol: 0.3},
	{at: 71.52, file: 'sfx-whoosh-rev', vol: 0.3},
	{at: 74.58, file: 'sfx-whoosh', vol: 0.3},
	{at: 81.12, file: 'sfx-pop', vol: 0.35},
	{at: 85.32, file: 'sfx-pop', vol: 0.35},
	{at: 87.0, file: 'sfx-whoosh-rev', vol: 0.3},
	{at: 88.22, file: 'sfx-pop', vol: 0.4},
	{at: 90.1, file: 'sfx-pop', vol: 0.4},
	{at: 94.5, file: 'sfx-whoosh', vol: 0.3},
	{at: 98.0, file: 'sfx-impact', vol: 0.45},
	{at: 98.3, file: 'sfx-notify', vol: 0.4},
];
