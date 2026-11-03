import React from 'react';
import {WATERMARK} from '../brand';
import {WORDS} from '../data/words-sindicato';
import {ShortEdit} from '../ShortEdit';
import {HIDDEN, KEYWORDS, SFX, SHAKES} from './data';
import {SindicatoOverlays} from './Overlays';
import {SHOTS} from './shots';

// Narração original (ElevenLabs) sem alteração: public/v13/voice.mp3
export const GTA6Sindicato: React.FC<{music: string | null; musicGain: number}> = ({music, musicGain}) => (
	<ShortEdit
		shots={SHOTS}
		sfx={SFX}
		shakes={SHAKES}
		words={WORDS}
		keywords={KEYWORDS}
		hidden={HIDDEN}
		voice="v13/voice.mp3"
		music={music}
		musicGain={musicGain}
		overlays={<SindicatoOverlays />}
		hud={null}
		watermark={WATERMARK}
	/>
);
