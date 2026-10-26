import type {Sfx} from '../data/sfx';
import type {Shake} from '../ShortEdit';

export const DURATION_S = 95.4;

// Destaques seletivos nas legendas
export const KEYWORDS = new Set([
	'internet', 'gta', '6', '6,', '6?', 'parece,', 'navegar', 'sites,', 'notícias', 'vice', 'city', 'real?', 'final,',
	'diferença', 'mostrar', 'interaja', 'verdade.', 'redes', 'sociais', 'vídeos,', 'personagens', 'celular', 'jason',
	'lucia', 'publicações,', 'comentários', 'notícia', 'confusão', 'escondidas', 'viva.', 'atenção,', 'afirmar',
	'navegador', 'completo,', 'interativos', 'nossa.', 'histórias,', 'interagir.', 'possibilidades', 'descobrir.',
]);

// Trechos em que um título grande já mostra a fala
export const HIDDEN: [number, number][] = [
	[15.9, 21.3],
	[76.0, 78.05],
];

export const SHAKES: Shake[] = [
	{at: 1.06, amp: 14},
	{at: 13.08, amp: 16},
	{at: 18.36, amp: 14},
	{at: 59.94, amp: 18},
	{at: 77.54, amp: 24},
];

// Efeitos sintetizados (scripts/synth_audio.py) — notificações onde há "celular/internet"
export const SFX: Sfx[] = [
	{at: 0.18, file: 'sfx-notify', vol: 0.35},
	{at: 1.04, file: 'sfx-impact', vol: 0.5},
	{at: 1.7, file: 'sfx-whoosh', vol: 0.3},
	{at: 4.2, file: 'sfx-whoosh', vol: 0.3},
	{at: 5.85, file: 'sfx-whoosh', vol: 0.3},
	{at: 6.0, file: 'sfx-typing', vol: 0.35},
	{at: 7.42, file: 'sfx-pop', vol: 0.35},
	{at: 8.8, file: 'sfx-glitch', vol: 0.3},
	{at: 9.9, file: 'sfx-typing', vol: 0.35},
	{at: 12.26, file: 'sfx-glitch', vol: 0.3},
	{at: 15.5, file: 'sfx-whoosh-rev', vol: 0.3},
	{at: 15.84, file: 'sfx-pop', vol: 0.35},
	{at: 18.34, file: 'sfx-impact', vol: 0.45},
	{at: 21.45, file: 'sfx-whoosh', vol: 0.3},
	{at: 23.7, file: 'sfx-notify', vol: 0.35},
	{at: 26.1, file: 'sfx-whoosh', vol: 0.3},
	{at: 28.1, file: 'sfx-shutter', vol: 0.4},
	{at: 31.28, file: 'sfx-whoosh', vol: 0.25},
	{at: 33.0, file: 'sfx-whoosh-rev', vol: 0.3},
	{at: 34.4, file: 'sfx-notify', vol: 0.4},
	{at: 37.0, file: 'sfx-pop', vol: 0.3},
	{at: 38.38, file: 'sfx-notify', vol: 0.3},
	{at: 39.2, file: 'sfx-pop', vol: 0.3},
	{at: 41.86, file: 'sfx-glitch', vol: 0.3},
	{at: 44.24, file: 'sfx-notify', vol: 0.35},
	{at: 45.85, file: 'sfx-whoosh', vol: 0.3},
	{at: 47.84, file: 'sfx-impact', vol: 0.4},
	{at: 50.56, file: 'sfx-glitch', vol: 0.3},
	{at: 52.2, file: 'sfx-typing', vol: 0.35},
	{at: 54.36, file: 'sfx-whoosh', vol: 0.3},
	{at: 58.1, file: 'sfx-tapestop', vol: 0.45},
	{at: 59.92, file: 'sfx-impact', vol: 0.55},
	{at: 64.56, file: 'sfx-whoosh', vol: 0.3},
	{at: 69.2, file: 'sfx-pop', vol: 0.35},
	{at: 70.0, file: 'sfx-whoosh', vol: 0.25},
	{at: 71.1, file: 'sfx-pop', vol: 0.35},
	{at: 73.2, file: 'sfx-pop', vol: 0.35},
	{at: 75.95, file: 'sfx-whoosh-rev', vol: 0.3},
	{at: 77.52, file: 'sfx-impact', vol: 0.6},
	{at: 78.08, file: 'sfx-whoosh', vol: 0.3},
	{at: 81.86, file: 'sfx-pop', vol: 0.4},
	{at: 83.26, file: 'sfx-whoosh', vol: 0.3},
	{at: 87.66, file: 'sfx-pop', vol: 0.4},
	{at: 88.56, file: 'sfx-whoosh-rev', vol: 0.3},
	{at: 89.16, file: 'sfx-pop', vol: 0.4},
	{at: 89.9, file: 'sfx-pop', vol: 0.4},
	{at: 93.9, file: 'sfx-typing', vol: 0.3},
];
