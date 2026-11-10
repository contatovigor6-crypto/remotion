import React from 'react';
import {WATERMARK} from '../brand';
import {WORDS} from '../data/words-festival';
import type {Sfx} from '../data/sfx';
import {ShortEdit, type Shake} from '../ShortEdit';
import {FestivalMotion} from './Motion';

// Short "GTA 6 vai ganhar um FESTIVAL" em motion design sincronizado com a música.
// Narração: voz neural pt-BR (narrador pro), sem edição: public/v25/voice.mp3
export const DURATION_S = 54.0;
const KEYWORDS = new Set(['gta', '6', 'festival', 'line-up', 'absurdo.', 'rockstar', 'playstation', 'festival.', 'miami,', '21', 'novembro,', 'dois', 'dias', 'travis', 'scott,', 'cardi', 'b,', 'metro', 'boomin,', 'don', 'toliver', 'kodak', 'black.', 'justice,', 'trilha', 'original', 'dj', 'set.', 'palcos,', 'wynwood.', 'sorteio,', 'dois', 'hoje.', 'álbum', '34', 'faixas.', 'perderia?']);
const HIDDEN: [number, number][] = [
	[0, 4.2],
	[13.3, 19.3],
	[40.4, 54],
];
const SHAKES: Shake[] = [
	{at: 1.4, amp: 14},
	{at: 18.4, amp: 16},
	{at: 34.2, amp: 14},
];
const cuts = [4.2, 8.5, 13.3, 19.3, 25.5, 28.6, 35.3, 40.4];
const SFX: Sfx[] = [
	{at: 0.02, file: 'sfx-impact', vol: 0.5},
	{at: 1.4, file: 'sfx-impact', vol: 0.45},
	{at: 2.9, file: 'sfx-pop', vol: 0.35},
	...cuts.map((t) => ({at: t - 0.02, file: 'sfx-whoosh', vol: 0.32})),
	{at: 4.3, file: 'sfx-whoosh-rev', vol: 0.3},
	{at: 6.2, file: 'sfx-impact', vol: 0.4},
	{at: 9.1, file: 'sfx-pop', vol: 0.35},
	{at: 11.1, file: 'sfx-tick', vol: 0.35},
	{at: 14.2, file: 'sfx-pop', vol: 0.35},
	{at: 15.2, file: 'sfx-pop', vol: 0.35},
	{at: 16.1, file: 'sfx-pop', vol: 0.35},
	{at: 17.0, file: 'sfx-pop', vol: 0.35},
	{at: 18.4, file: 'sfx-impact', vol: 0.5},
	{at: 20.4, file: 'sfx-impact', vol: 0.42},
	{at: 24.2, file: 'sfx-pop', vol: 0.35},
	{at: 30.0, file: 'sfx-glitch', vol: 0.35},
	{at: 31.1, file: 'sfx-pop', vol: 0.35},
	{at: 31.9, file: 'sfx-pop', vol: 0.35},
	{at: 34.2, file: 'sfx-impact', vol: 0.5},
	{at: 34.25, file: 'sfx-tick', vol: 0.4},
	{at: 38.5, file: 'sfx-typing', vol: 0.25},
	{at: 39.6, file: 'sfx-impact', vol: 0.4},
	{at: 40.6, file: 'sfx-pop', vol: 0.3},
	{at: 40.8, file: 'sfx-pop', vol: 0.3},
	{at: 41.0, file: 'sfx-pop', vol: 0.3},
	{at: 41.2, file: 'sfx-pop', vol: 0.3},
	{at: 43.72, file: 'sfx-impact', vol: 0.5},
	{at: 43.74, file: 'sfx-subdrop', vol: 0.35},
	{at: 44.2, file: 'sfx-typing', vol: 0.25},
	{at: 45.3, file: 'sfx-tick', vol: 0.45},
	{at: 45.63, file: 'sfx-notify', vol: 0.4},
	{at: 46.03, file: 'sfx-pop', vol: 0.4},
];

export const GTA6Festival: React.FC<{music: string | null; musicGain: number}> = ({music, musicGain}) => (
	<ShortEdit shots={[]} sfx={SFX} shakes={SHAKES} words={WORDS} keywords={KEYWORDS} hidden={HIDDEN} voice="v25/voice.mp3" music={music} musicGain={musicGain} overlays={<FestivalMotion />} hud={null} watermark={WATERMARK} />
);
