import React from 'react';
import {WATERMARK} from '../brand';
import {WORDS} from '../data/words-gold';
import {ShortEdit} from '../ShortEdit';
import {SFX, SHAKES} from './data';
import {GoldMotion} from './Motion';

// Versão MOTION DESIGN: sem planos de fotos; toda a imagem vem do componente GoldMotion (cenário neon + tipografia cinética + 3D).
// Narração com voz neural pt-BR (narrador pro), sem edição: public/v22/voice.mp3
const KEYWORDS = new Set(['gta', '6', 'pronto?', 'gold', '"gold",', 'take-two,', 'take-two', 'zelnick', 'completou', 'pré-venda', 'precedentes.', 'número.', 'vitória.', 'adiamentos,', '19', 'novembro.', 'atualização', 'nove', 'recordes?']);
// Legendas aparecem só onde a cena não já escreve a mesma frase na tela
const HIDDEN: [number, number][] = [
	[0, 2.5],
	[9.0, 13.4],
	[27.6, 36.0],
	[48.8, 62.5],
];

export const GTA6Gold: React.FC<{music: string | null; musicGain: number}> = ({music, musicGain}) => (
	<ShortEdit
		shots={[]}
		sfx={SFX}
		shakes={SHAKES}
		words={WORDS}
		keywords={KEYWORDS}
		hidden={HIDDEN}
		voice="v22/voice.mp3"
		music={music}
		musicGain={musicGain}
		overlays={<GoldMotion />}
		hud={null}
		watermark={WATERMARK}
	/>
);
