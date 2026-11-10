import React from 'react';
import {WATERMARK} from '../brand';
import {WORDS} from '../data/words-poster';
import type {Sfx} from '../data/sfx';
import {ShortEdit, type Shake} from '../ShortEdit';
import {PosterMotion} from './Motion';

// Short "Pôster de GTA 6" em motion design. Narração: voz neural pt-BR (narrador pro), sem edição: public/v23/voice.mp3
export const DURATION_S = 52.0;
const KEYWORDS = new Set(['mapa', 'gta', '6,', 'graça.', '19', 'novembro,', 'site', 'oficial', 'baixar', 'imprimir,', 'pôster', 'capa', 'leonida.', 'física,', 'loja', 'rockstar', 'dupla', 'face', '99', 'centavos', 'dólar,', 'graça,', 'mistério,', 'leonida', 'inteira', 'parte.', 'edição', 'código', 'pôster.', 'completo,', 'tamanho', 'real', 'mundo', '6.', 'parede?']);
const HIDDEN: [number, number][] = [
	[0, 4.4],
	[22.1, 24.8],
	[40.8, 52],
];
const SHAKES: Shake[] = [
	{at: 3.6, amp: 14},
	{at: 20.3, amp: 12},
	{at: 22.7, amp: 14},
	{at: 38.8, amp: 12},
];
const cuts = [4.4, 11.0, 14.3, 22.1, 24.8, 30.3, 35.5, 40.8];
const SFX: Sfx[] = [
	{at: 0.02, file: 'sfx-whoosh', vol: 0.35},
	{at: 0.4, file: 'sfx-shutter', vol: 0.3},
	{at: 3.6, file: 'sfx-impact', vol: 0.5},
	...cuts.map((t) => ({at: t - 0.02, file: 'sfx-whoosh', vol: 0.3})),
	{at: 4.7, file: 'sfx-pop', vol: 0.35},
	{at: 8.6, file: 'sfx-typing', vol: 0.25},
	{at: 10.0, file: 'sfx-pop', vol: 0.35},
	{at: 10.5, file: 'sfx-pop', vol: 0.35},
	{at: 11.2, file: 'sfx-typing', vol: 0.3},
	{at: 13.1, file: 'sfx-typing', vol: 0.3},
	{at: 15.3, file: 'sfx-whoosh-rev', vol: 0.3},
	{at: 20.3, file: 'sfx-impact', vol: 0.45},
	{at: 22.7, file: 'sfx-impact', vol: 0.5},
	{at: 25.2, file: 'sfx-subdrop', vol: 0.4},
	{at: 29.0, file: 'sfx-pop', vol: 0.35},
	{at: 31.5, file: 'sfx-whoosh-rev', vol: 0.3},
	{at: 32.7, file: 'sfx-pop', vol: 0.35},
	{at: 34.6, file: 'sfx-glitch', vol: 0.3},
	{at: 36.7, file: 'sfx-typing', vol: 0.25},
	{at: 38.8, file: 'sfx-impact', vol: 0.45},
	{at: 41.6, file: 'sfx-pop', vol: 0.35},
	{at: 41.85, file: 'sfx-pop', vol: 0.35},
	{at: 43.52, file: 'sfx-impact', vol: 0.5},
	{at: 43.54, file: 'sfx-subdrop', vol: 0.35},
	{at: 44.0, file: 'sfx-typing', vol: 0.25},
	{at: 45.1, file: 'sfx-tick', vol: 0.45},
	{at: 45.43, file: 'sfx-notify', vol: 0.4},
	{at: 45.83, file: 'sfx-pop', vol: 0.4},
];

export const GTA6Poster: React.FC<{music: string | null; musicGain: number}> = ({music, musicGain}) => (
	<ShortEdit shots={[]} sfx={SFX} shakes={SHAKES} words={WORDS} keywords={KEYWORDS} hidden={HIDDEN} voice="v23/voice.mp3" music={music} musicGain={musicGain} overlays={<PosterMotion />} hud={null} watermark={WATERMARK} />
);
