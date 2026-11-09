import React from 'react';
import {WATERMARK} from '../brand';
import {WORDS} from '../data/words-codigo';
import {ShortEdit} from '../ShortEdit';
import {HIDDEN, KEYWORDS, SFX, SHAKES} from './data';
import {CodigoOverlays} from './Overlays';
import {SHOTS} from './shots';

// Narração com voz neural pt-BR (Antonio, narrador pro), sem edição: public/v18/voice.mp3
export const GTA6Codigo: React.FC<{music: string | null; musicGain: number}> = ({music, musicGain}) => (
	<ShortEdit
		shots={SHOTS}
		sfx={SFX}
		shakes={SHAKES}
		words={WORDS}
		keywords={KEYWORDS}
		hidden={HIDDEN}
		voice="v18/voice.mp3"
		music={music}
		musicGain={musicGain}
		overlays={<CodigoOverlays />}
		hud={null}
		watermark={WATERMARK}
	/>
);
