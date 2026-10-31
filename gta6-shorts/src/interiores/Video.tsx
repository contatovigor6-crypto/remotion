import React from 'react';
import {WATERMARK} from '../brand';
import {WORDS} from '../data/words-interiores';
import {LongEdit} from '../long/LongEdit';
import {HIDDEN, KEYWORDS, SFX, SHAKES} from './data';
import {InterioresOverlays} from './Overlays';
import {SHOTS} from './shots';

// Narração original (ElevenLabs) sem alteração: public/v11/voice.mp3 — vídeo LONGO 16:9
export const GTA6Interiores: React.FC<{music: string | null; musicGain: number}> = ({music, musicGain}) => (
	<LongEdit
		shots={SHOTS}
		sfx={SFX}
		shakes={SHAKES}
		words={WORDS}
		keywords={KEYWORDS}
		hidden={HIDDEN}
		voice="v11/voice.mp3"
		music={music}
		musicGain={musicGain}
		overlays={<InterioresOverlays />}
		hud={null}
		watermark={WATERMARK}
	/>
);
