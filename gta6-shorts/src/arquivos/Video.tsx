import React from 'react';
import {WATERMARK} from '../brand';
import {WORDS} from '../data/words-arquivos';
import {ShortEdit} from '../ShortEdit';
import {HIDDEN, KEYWORDS, SFX, SHAKES} from './data';
import {ArquivosOverlays} from './Overlays';
import {SHOTS} from './shots';

// Narração com voz neural pt-BR (narrador pro), sem edição: public/v21/voice.mp3
export const GTA6Arquivos: React.FC<{music: string | null; musicGain: number}> = ({music, musicGain}) => (
	<ShortEdit
		shots={SHOTS}
		sfx={SFX}
		shakes={SHAKES}
		words={WORDS}
		keywords={KEYWORDS}
		hidden={HIDDEN}
		voice="v21/voice.mp3"
		music={music}
		musicGain={musicGain}
		overlays={<ArquivosOverlays />}
		hud={null}
		watermark={WATERMARK}
	/>
);
