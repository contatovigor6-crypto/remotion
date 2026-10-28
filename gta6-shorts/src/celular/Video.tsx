import React from 'react';
import {WATERMARK} from '../brand';
import {WORDS} from '../data/words-celular';
import {ShortEdit} from '../ShortEdit';
import {HIDDEN, KEYWORDS, SFX, SHAKES} from './data';
import {CelularOverlays} from './Overlays';
import {SHOTS} from './shots';

// Narração original (ElevenLabs) sem alteração: public/v7/voice.mp3
export const GTA6Celular: React.FC<{music: string | null; musicGain: number}> = ({music, musicGain}) => (
	<ShortEdit
		shots={SHOTS}
		sfx={SFX}
		shakes={SHAKES}
		words={WORDS}
		keywords={KEYWORDS}
		hidden={HIDDEN}
		voice="v7/voice.mp3"
		music={music}
		musicGain={musicGain}
		overlays={<CelularOverlays />}
		hud={null}
		watermark={WATERMARK}
	/>
);
