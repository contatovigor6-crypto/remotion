import React from 'react';
import {WATERMARK} from '../brand';
import {WORDS} from '../data/words-pista';
import {ShortEdit} from '../ShortEdit';
import {HIDDEN, KEYWORDS, SFX, SHAKES} from './data';
import {PistaOverlays} from './Overlays';
import {SHOTS} from './shots';

// Narração original (ElevenLabs) sem alteração: public/v6/voice.mp3
export const GTA6Pista: React.FC<{music: string | null; musicGain: number}> = ({music, musicGain}) => (
	<ShortEdit
		shots={SHOTS}
		sfx={SFX}
		shakes={SHAKES}
		words={WORDS}
		keywords={KEYWORDS}
		hidden={HIDDEN}
		voice="v6/voice.mp3"
		music={music}
		musicGain={musicGain}
		overlays={<PistaOverlays />}
		hud={null}
		watermark={WATERMARK}
	/>
);
