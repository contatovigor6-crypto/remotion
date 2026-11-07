import React from 'react';
import {WATERMARK} from '../brand';
import {WORDS} from '../data/words-galeria';
import {ShortEdit} from '../ShortEdit';
import {HIDDEN, KEYWORDS, SFX, SHAKES} from './data';
import {GaleriaOverlays} from './Overlays';
import {SHOTS} from './shots';

// Narração gerada no ElevenLabs (voz Marcio), sem edição: public/v16/voice.mp3
export const GTA6Galeria: React.FC<{music: string | null; musicGain: number}> = ({music, musicGain}) => (
	<ShortEdit
		shots={SHOTS}
		sfx={SFX}
		shakes={SHAKES}
		words={WORDS}
		keywords={KEYWORDS}
		hidden={HIDDEN}
		voice="v16/voice.mp3"
		music={music}
		musicGain={musicGain}
		overlays={<GaleriaOverlays />}
		hud={null}
		watermark={WATERMARK}
	/>
);
