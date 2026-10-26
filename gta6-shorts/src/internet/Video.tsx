import React from 'react';
import {WORDS} from '../data/words-internet';
import {ShortEdit} from '../ShortEdit';
import {HIDDEN, KEYWORDS, SFX, SHAKES} from './data';
import {InternetOverlays} from './Overlays';
import {SHOTS} from './shots';

// Narração original (ElevenLabs) sem alteração: public/v3/voice.mp3
export const GTA6Internet: React.FC<{music: string | null; musicGain: number}> = ({music, musicGain}) => (
	<ShortEdit
		shots={SHOTS}
		sfx={SFX}
		shakes={SHAKES}
		words={WORDS}
		keywords={KEYWORDS}
		hidden={HIDDEN}
		voice="v3/voice.mp3"
		music={music}
		musicGain={musicGain}
		overlays={<InternetOverlays />}
		hud={null}
	/>
);
