import React from 'react';
import {WATERMARK} from '../brand';
import {WORDS} from '../data/words-vicecity';
import type {Sfx} from '../data/sfx';
import {ShortEdit, type Shake} from '../ShortEdit';
import {END, OUTRO_AT, ViceCityMotion} from './Motion';

// Short "Miami virou Vice City de verdade" — estilo cyberpunk com cenas 3D (three.js).
// Narração: voz neural pt-BR (narrador pro): public/v26/voice.mp3
export const DURATION_S = END;
const KEYWORDS = new Set(['miami', 'vice', 'city', 'verdade,', 'gostou.', 'heat,', 'rockstar', 'letreiro', 'gigante,', 'welcome', 'city.', '975', 'mil', 'dólares,', '25', 'votação', 'condado.', 'xerife', 'miami-dade', 'não', 'dirigível', 'céu,', 'cadeiras', '10', 'murais', 'wynwood', 'walls.', 'wynwood,', 'telões', 'the', 'vault,', 'boate', 'marketing.', 'véspera', '18,', 'heat', 'quadra', 'uniformes', 'especiais.', 'saiu,', 'real.', 'city,']);
const HIDDEN: [number, number][] = [
	[0, 4.25],
	[47.35, END],
];
const SHAKES: Shake[] = [
	{at: 1.0, amp: 16},
	{at: 9.4, amp: 18},
	{at: 14.06, amp: 12},
	{at: 16.3, amp: 14},
	{at: 37.04, amp: 12},
];
const cuts = [4.25, 10.85, 17.5, 22.1, 26.6, 29.0, 35.25, 42.55, 47.35];
const SFX: Sfx[] = [
	{at: 0.02, file: 'sfx-impact', vol: 0.5},
	{at: 0.9, file: 'sfx-glitch', vol: 0.45},
	{at: 1.0, file: 'sfx-impact', vol: 0.45},
	{at: 1.5, file: 'sfx-typing', vol: 0.25},
	{at: 2.6, file: 'sfx-pop', vol: 0.35},
	...cuts.map((t) => ({at: t - 0.02, file: 'sfx-glitch', vol: 0.3})),
	...cuts.map((t) => ({at: t - 0.05, file: 'sfx-whoosh', vol: 0.25})),
	{at: 5.25, file: 'sfx-tick', vol: 0.35},
	{at: 7.0, file: 'sfx-whoosh-rev', vol: 0.3},
	{at: 9.4, file: 'sfx-impact', vol: 0.55},
	{at: 9.42, file: 'sfx-subdrop', vol: 0.35},
	{at: 11.8, file: 'sfx-typing', vol: 0.25},
	{at: 13.0, file: 'sfx-pop', vol: 0.35},
	{at: 14.06, file: 'sfx-impact', vol: 0.42},
	{at: 16.3, file: 'sfx-impact', vol: 0.5},
	{at: 17.95, file: 'sfx-siren', vol: 0.22},
	{at: 20.0, file: 'sfx-typing', vol: 0.3},
	{at: 23.96, file: 'sfx-whoosh', vol: 0.3},
	{at: 25.08, file: 'sfx-pop', vol: 0.35},
	{at: 26.86, file: 'sfx-tick', vol: 0.35},
	{at: 28.3, file: 'sfx-pop', vol: 0.35},
	{at: 30.5, file: 'sfx-glitch', vol: 0.35},
	{at: 31.2, file: 'sfx-glitch', vol: 0.3},
	{at: 32.1, file: 'sfx-pop', vol: 0.35},
	{at: 33.3, file: 'sfx-impact', vol: 0.42},
	{at: 37.04, file: 'sfx-impact', vol: 0.45},
	{at: 38.3, file: 'sfx-whoosh-rev', vol: 0.3},
	{at: 40.5, file: 'sfx-pop', vol: 0.35},
	{at: 43.68, file: 'sfx-tapestop', vol: 0.3},
	{at: 45.1, file: 'sfx-impact', vol: 0.45},
	{at: 47.65, file: 'sfx-pop', vol: 0.3},
	{at: 47.85, file: 'sfx-pop', vol: 0.3},
	{at: OUTRO_AT + 0.02, file: 'sfx-impact', vol: 0.5},
	{at: OUTRO_AT + 0.04, file: 'sfx-subdrop', vol: 0.35},
	{at: OUTRO_AT + 0.5, file: 'sfx-typing', vol: 0.25},
	{at: OUTRO_AT + 1.6, file: 'sfx-tick', vol: 0.45},
	{at: OUTRO_AT + 1.93, file: 'sfx-notify', vol: 0.4},
	{at: OUTRO_AT + 2.33, file: 'sfx-pop', vol: 0.4},
];

export const GTA6ViceCity: React.FC<{music: string | null; musicGain: number}> = ({music, musicGain}) => (
	<ShortEdit shots={[]} sfx={SFX} shakes={SHAKES} words={WORDS} keywords={KEYWORDS} hidden={HIDDEN} voice="v26/voice.mp3" music={music} musicGain={musicGain} overlays={<ViceCityMotion />} hud={null} watermark={WATERMARK} />
);
