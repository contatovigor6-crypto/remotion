import React from 'react';
import {WATERMARK} from '../brand';
import {WORDS} from '../data/words-pc';
import type {Sfx} from '../data/sfx';
import {ShortEdit, type Shake} from '../ShortEdit';
import {PcMotion} from './Motion';

// Short "GTA 6 no PC: quando lança?" em motion design. Narração: voz neural pt-BR (narrador pro), sem edição: public/v24/voice.mp3
export const DURATION_S = 68.5;
const KEYWORDS = new Set(['gta', '6', 'pc?', 'brasil.', 'ninguém', 'sabe.', 'take-two', 'data', 'pc.', 'plataformas.', 'conta.', '5', 'sete', 'meses', 'red', 'dead', 'ano', '2027', '2028.', 'estimativa.', 'reviravolta.', 'obbe', 'vermeij,', 'antes,', 'inteligência', 'artificial.', 'opinião', 'oficial.', '19', 'novembro', 'ps5', 'xbox', 'console?']);
const HIDDEN: [number, number][] = [
	[0, 5.9],
	[5.9, 8.9],
	[47.7, 50.4],
	[56.0, 68.5],
];
const SHAKES: Shake[] = [
	{at: 7.7, amp: 14},
	{at: 36.9, amp: 12},
	{at: 38.8, amp: 14},
	{at: 53.9, amp: 10},
];
const cuts = [5.9, 8.9, 13.9, 19.6, 30.2, 38.6, 47.7, 50.4, 56.0];
const SFX: Sfx[] = [
	{at: 0.02, file: 'sfx-glitch', vol: 0.35},
	{at: 0.2, file: 'sfx-typing', vol: 0.3},
	{at: 3.6, file: 'sfx-pop', vol: 0.4},
	...cuts.map((t) => ({at: t - 0.02, file: 'sfx-whoosh', vol: 0.3})),
	{at: 6.0, file: 'sfx-glitch', vol: 0.4},
	{at: 7.7, file: 'sfx-impact', vol: 0.5},
	{at: 9.2, file: 'sfx-pop', vol: 0.3},
	{at: 9.7, file: 'sfx-pop', vol: 0.3},
	{at: 10.2, file: 'sfx-pop', vol: 0.3},
	{at: 12.4, file: 'sfx-glitch', vol: 0.3},
	{at: 22.3, file: 'sfx-whoosh-rev', vol: 0.3},
	{at: 26.6, file: 'sfx-whoosh-rev', vol: 0.3},
	{at: 32.2, file: 'sfx-whoosh-rev', vol: 0.3},
	{at: 36.9, file: 'sfx-impact', vol: 0.45},
	{at: 38.8, file: 'sfx-impact', vol: 0.5},
	{at: 40.2, file: 'sfx-pop', vol: 0.35},
	{at: 45.4, file: 'sfx-glitch', vol: 0.3},
	{at: 47.8, file: 'sfx-subdrop', vol: 0.4},
	{at: 51.2, file: 'sfx-pop', vol: 0.3},
	{at: 51.6, file: 'sfx-pop', vol: 0.3},
	{at: 52.0, file: 'sfx-pop', vol: 0.3},
	{at: 53.8, file: 'sfx-impact', vol: 0.4},
	{at: 56.3, file: 'sfx-pop', vol: 0.35},
	{at: 56.6, file: 'sfx-pop', vol: 0.35},
	{at: 59.52, file: 'sfx-impact', vol: 0.5},
	{at: 59.54, file: 'sfx-subdrop', vol: 0.35},
	{at: 60.0, file: 'sfx-typing', vol: 0.25},
	{at: 61.1, file: 'sfx-tick', vol: 0.45},
	{at: 61.43, file: 'sfx-notify', vol: 0.4},
	{at: 61.83, file: 'sfx-pop', vol: 0.4},
];

export const GTA6Pc: React.FC<{music: string | null; musicGain: number}> = ({music, musicGain}) => (
	<ShortEdit shots={[]} sfx={SFX} shakes={SHAKES} words={WORDS} keywords={KEYWORDS} hidden={HIDDEN} voice="v24/voice.mp3" music={music} musicGain={musicGain} overlays={<PcMotion />} hud={null} watermark={WATERMARK} />
);
