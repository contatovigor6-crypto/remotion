import type {Sfx} from '../data/sfx';
import type {Shake} from '../ShortEdit';
import {SHOTS} from './shots';

export const DURATION_S = 356.2;

export const KEYWORDS = new Set([
	'gta', '6,', '6', 'casa?', 'interiores', 'maior', 'dentro', 'final,', 'demonstração', 'fachada.', 'porta', 'edge,', 'garbut,',
	'grandeza', 'abertas', 'qualquer', 'internos,', 'histórias.', 'fotografias', 'família,', 'objetos', 'pessoais,', 'personalidade,',
	'cachorro', 'bagunça', 'jason', 'cheiro,', 'repulsa', 'reação.', 'sistemas', 'vida', 'curiosidade,', 'missão', 'lista',
	'completa', 'todas', 'prioridade', 'personalidades,', 'arquitetura.', 'pergunta.', 'comum', 'pequenas', 'coisas,',
	'centenas', 'detalhado?', 'comenta', 'inscreva', 'zonegtavi.', 'abrir.',
]);

export const HIDDEN: [number, number][] = [[345.5, 356.2]];

export const SHAKES: Shake[] = [
	{at: 9.4, amp: 10},
	{at: 54.8, amp: 14},
	{at: 174.1, amp: 12},
];

const auto: Sfx[] = SHOTS.flatMap((s) =>
	s.inT === 'whipL' || s.inT === 'whipR'
		? [{at: Math.max(0, s.from - 0.04), file: 'sfx-whoosh', vol: 0.22}]
		: s.inT === 'glitch'
			? [{at: s.from, file: 'sfx-glitch', vol: 0.22}]
			: s.inT === 'dip' && s.look === 'title'
				? [{at: s.from, file: 'sfx-whoosh-rev', vol: 0.25}, {at: s.from + 0.4, file: 'sfx-impact', vol: 0.35}]
				: [],
);

export const SFX: Sfx[] = [
	{at: 0.02, file: 'sfx-impact', vol: 0.4},
	{at: 0.95, file: 'sfx-pop', vol: 0.3},
	{at: 51.2, file: 'sfx-tick', vol: 0.35},
	{at: 51.6, file: 'sfx-tick', vol: 0.35},
	{at: 54.8, file: 'sfx-impact', vol: 0.4},
	{at: 82.5, file: 'sfx-pop', vol: 0.3},
	{at: 86.1, file: 'sfx-pop', vol: 0.3},
	{at: 93.7, file: 'sfx-pop', vol: 0.3},
	{at: 96.7, file: 'sfx-pop', vol: 0.3},
	{at: 118.2, file: 'sfx-pop', vol: 0.3},
	{at: 120.0, file: 'sfx-pop', vol: 0.3},
	{at: 121.6, file: 'sfx-pop', vol: 0.3},
	{at: 125.0, file: 'sfx-pop', vol: 0.3},
	{at: 172.4, file: 'sfx-glitch', vol: 0.25},
	{at: 254.4, file: 'sfx-pop', vol: 0.3},
	{at: 255.7, file: 'sfx-pop', vol: 0.3},
	{at: 257.9, file: 'sfx-pop', vol: 0.3},
	{at: 328.0, file: 'sfx-pop', vol: 0.35},
	{at: 332.8, file: 'sfx-pop', vol: 0.35},
	{at: 345.9, file: 'sfx-impact', vol: 0.4},
	{at: 346.2, file: 'sfx-notify', vol: 0.35},
	...auto,
].sort((a, b) => a.at - b.at);
