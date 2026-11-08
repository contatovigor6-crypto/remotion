import React from 'react';
import {WATERMARK} from '../brand';
import {WORDS} from '../data/words-globo';
import {ShortEdit} from '../ShortEdit';
import {HIDDEN, KEYWORDS, SFX, SHAKES} from './data';
import {GloboOverlays} from './Overlays';
import {SHOTS} from './shots';

// Narração com voz neural pt-BR (Antonio), sem edição: public/v17/voice.mp3
export const GTA6Globo: React.FC<{music: string | null; musicGain: number}> = ({music, musicGain}) => (
	<ShortEdit
		shots={SHOTS}
		sfx={SFX}
		shakes={SHAKES}
		words={WORDS}
		keywords={KEYWORDS}
		hidden={HIDDEN}
		voice="v17/voice.mp3"
		music={music}
		musicGain={musicGain}
		overlays={<GloboOverlays />}
		hud={null}
		watermark={WATERMARK}
	/>
);
