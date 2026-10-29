import React from 'react';
import {WATERMARK} from '../brand';
import {WORDS} from '../data/words-brian';
import {ShortEdit} from '../ShortEdit';
import {HIDDEN, KEYWORDS, SFX, SHAKES} from './data';
import {BrianOverlays} from './Overlays';
import {SHOTS} from './shots';

// Narração original (ElevenLabs) sem alteração: public/v8/voice.mp3
export const GTA6Brian: React.FC<{music: string | null; musicGain: number}> = ({music, musicGain}) => (
	<ShortEdit
		shots={SHOTS}
		sfx={SFX}
		shakes={SHAKES}
		words={WORDS}
		keywords={KEYWORDS}
		hidden={HIDDEN}
		voice="v8/voice.mp3"
		music={music}
		musicGain={musicGain}
		overlays={<BrianOverlays />}
		hud={null}
		watermark={WATERMARK}
	/>
);
