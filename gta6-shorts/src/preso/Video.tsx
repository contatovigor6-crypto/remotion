import React from 'react';
import {WORDS} from '../data/words-preso';
import {ShortEdit} from '../ShortEdit';
import {HIDDEN, KEYWORDS, SFX, SHAKES} from './data';
import {PresoOverlays, WantedHud} from './Overlays';
import {SHOTS} from './shots';

// Narração original (ElevenLabs) usada sem nenhuma alteração: public/v2/voice.mp3
export const GTA6Preso: React.FC = () => (
	<ShortEdit
		shots={SHOTS}
		sfx={SFX}
		shakes={SHAKES}
		words={WORDS}
		keywords={KEYWORDS}
		hidden={HIDDEN}
		voice="v2/voice.mp3"
		music="audio/music-preso.wav"
		overlays={<PresoOverlays />}
		hud={<WantedHud />}
	/>
);
