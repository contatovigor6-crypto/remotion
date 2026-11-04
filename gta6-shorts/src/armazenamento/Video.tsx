import React from 'react';
import {WATERMARK} from '../brand';
import {WORDS} from '../data/words-armazenamento';
import {ShortEdit} from '../ShortEdit';
import {HIDDEN, KEYWORDS, SFX, SHAKES} from './data';
import {ArmazenamentoOverlays} from './Overlays';
import {SHOTS} from './shots';

// Narração original (ElevenLabs) sem alteração: public/v15/voice.mp3
export const GTA6Armazenamento: React.FC<{music: string | null; musicGain: number}> = ({music, musicGain}) => (
	<ShortEdit
		shots={SHOTS}
		sfx={SFX}
		shakes={SHAKES}
		words={WORDS}
		keywords={KEYWORDS}
		hidden={HIDDEN}
		voice="v15/voice.mp3"
		music={music}
		musicGain={musicGain}
		overlays={<ArmazenamentoOverlays />}
		hud={null}
		watermark={WATERMARK}
	/>
);
