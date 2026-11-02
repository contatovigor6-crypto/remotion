import React from 'react';
import {WATERMARK} from '../brand';
import {WORDS} from '../data/words-contagem';
import {ShortEdit} from '../ShortEdit';
import {HIDDEN, KEYWORDS, SFX, SHAKES} from './data';
import {ContagemOverlays} from './Overlays';
import {SHOTS} from './shots';

// Narração original (ElevenLabs) sem alteração: public/v12/voice.mp3
export const GTA6Contagem: React.FC<{music: string | null; musicGain: number}> = ({music, musicGain}) => (
	<ShortEdit
		shots={SHOTS}
		sfx={SFX}
		shakes={SHAKES}
		words={WORDS}
		keywords={KEYWORDS}
		hidden={HIDDEN}
		voice="v12/voice.mp3"
		music={music}
		musicGain={musicGain}
		overlays={<ContagemOverlays />}
		hud={null}
		watermark={WATERMARK}
	/>
);
