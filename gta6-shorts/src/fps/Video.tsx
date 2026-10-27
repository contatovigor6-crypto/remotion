import React from 'react';
import {WATERMARK} from '../brand';
import {WORDS} from '../data/words-fps';
import {ShortEdit} from '../ShortEdit';
import {HIDDEN, KEYWORDS, SFX, SHAKES} from './data';
import {FpsOverlays} from './Overlays';
import {SHOTS} from './shots';

// Narração original (ElevenLabs) sem alteração: public/v4/voice.mp3
export const GTA6Fps: React.FC<{music: string | null; musicGain: number}> = ({music, musicGain}) => (
	<ShortEdit
		shots={SHOTS}
		sfx={SFX}
		shakes={SHAKES}
		words={WORDS}
		keywords={KEYWORDS}
		hidden={HIDDEN}
		voice="v4/voice.mp3"
		music={music}
		musicGain={musicGain}
		overlays={<FpsOverlays />}
		hud={null}
		watermark={WATERMARK}
	/>
);
