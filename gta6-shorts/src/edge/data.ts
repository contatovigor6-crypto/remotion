import type {Sfx} from '../data/sfx';
import type {Shake} from '../ShortEdit';
import {SHOTS} from './shots';

export const DURATION_S = 621.6;

export const KEYWORDS = new Set([
	'novas', 'imagens', 'gta', '6', '6,', 'tubarão', 'martelo', 'motociclistas,', 'pântanos,', 'urbanos', 'jason', 'lucia',
	'90', 'minutos,', 'edge,', 'edge', 'leonida.', 'aerobarco', 'motociclistas', 'corais.', 'submarina', 'tatuagem', 'livre.',
	'600', 'mil', 'animações', 'personalidade', 'temperamento,', 'agressividade', 'fugir', 'discutir', 'agressivo', 'cachorro',
	'polícia', 'investigação.', 'procurado', 'roupa,', 'aparência,', 'arma', 'veículo,', 'parceiro', 'câmeras', 'pregos',
	'pastor', 'alemão', 'carros', 'combustível', 'motor.', 'rastreadores,', 'waink,', 'scooter', 'bros.', 'clima', 'tempestades',
	'vento', 'chuva', 'dia', 'noite.', 'interiores.', 'música.', '34', 'justice', 'gesaffelstein,', 'tame', 'impala,', 'sza',
	'rádios', 'padrão.', '19', 'novembro', '2026', 'playstation', 'xbox', 'comentários.', 'inscreva', 'canal,',
]);

// Legendas escondidas só no encerramento (a logo e o botão ocupam o centro)
export const HIDDEN: [number, number][] = [[616.0, 621.6]];

export const SHAKES: Shake[] = [
	{at: 15.6, amp: 10},
	{at: 174.3, amp: 12},
	{at: 207.8, amp: 12},
	{at: 313.8, amp: 14},
	{at: 318.0, amp: 16},
	{at: 323.5, amp: 14},
	{at: 575.3, amp: 12},
];

// Efeitos derivados do plano de cortes: whoosh nas transições rápidas, impacto nos títulos de capítulo, pop nos rótulos
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
	{at: 15.6, file: 'sfx-subdrop', vol: 0.35},
	{at: 35.2, file: 'sfx-pop', vol: 0.3},
	{at: 64.2, file: 'sfx-shutter', vol: 0.3},
	{at: 90.2, file: 'sfx-subdrop', vol: 0.35},
	{at: 105.7, file: 'sfx-pop', vol: 0.3},
	{at: 111.3, file: 'sfx-pop', vol: 0.3},
	{at: 174.3, file: 'sfx-impact', vol: 0.35},
	{at: 216.2, file: 'sfx-glitch', vol: 0.25},
	{at: 256.4, file: 'sfx-radio', vol: 0.3},
	{at: 274.9, file: 'sfx-typing', vol: 0.25},
	{at: 294.6, file: 'sfx-pop', vol: 0.3},
	{at: 298.5, file: 'sfx-pop', vol: 0.3},
	{at: 301.6, file: 'sfx-pop', vol: 0.3},
	{at: 313.8, file: 'sfx-impact', vol: 0.4},
	{at: 323.5, file: 'sfx-impact', vol: 0.4},
	{at: 355.3, file: 'sfx-notify', vol: 0.3},
	{at: 364.2, file: 'sfx-notify', vol: 0.3},
	{at: 391.5, file: 'sfx-notify', vol: 0.3},
	{at: 487.0, file: 'sfx-pop', vol: 0.3},
	{at: 494.5, file: 'sfx-pop', vol: 0.3},
	{at: 575.3, file: 'sfx-impact', vol: 0.4},
	{at: 600.3, file: 'sfx-pop', vol: 0.3},
	{at: 601.6, file: 'sfx-pop', vol: 0.3},
	{at: 603.5, file: 'sfx-pop', vol: 0.3},
	{at: 605.7, file: 'sfx-pop', vol: 0.3},
	{at: 616.1, file: 'sfx-impact', vol: 0.4},
	{at: 616.4, file: 'sfx-notify', vol: 0.35},
	...auto,
].sort((a, b) => a.at - b.at);
