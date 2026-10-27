import React from 'react';
import {WATERMARK} from '../brand';
import {WORDS} from '../data/words-preso';
import {ShortEdit} from '../ShortEdit';
import {HIDDEN, KEYWORDS, SFX, SHAKES} from './data';
import {PresoOverlays, WantedHud} from './Overlays';
import {SHOTS} from './shots';

// Narração original (ElevenLabs) usada sem nenhuma alteração: public/v2/voice.mp3
export const GTA6Preso: React.FC<{music: string | null; musicGain: number}> = ({music, musicGain}) => (
	<ShortEdit
		shots={SHOTS}
		sfx={SFX}
		shakes={SHAKES}
		words={WORDS}
		keywords={KEYWORDS}
		hidden={HIDDEN}
		voice="v2/voice.mp3"
		music={music}
		musicGain={musicGain}
		overlays={<PresoOverlays />}
		hud={<WantedHud />}
		watermark={WATERMARK}
	/>
);
