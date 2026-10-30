import React from 'react';
import {WATERMARK} from '../brand';
import {WORDS} from '../data/words-npc';
import {ShortEdit} from '../ShortEdit';
import {HIDDEN, KEYWORDS, SFX, SHAKES} from './data';
import {NpcOverlays} from './Overlays';
import {SHOTS} from './shots';

// Narração original (ElevenLabs) sem alteração: public/v9/voice.mp3
export const GTA6Npc: React.FC<{music: string | null; musicGain: number}> = ({music, musicGain}) => (
	<ShortEdit
		shots={SHOTS}
		sfx={SFX}
		shakes={SHAKES}
		words={WORDS}
		keywords={KEYWORDS}
		hidden={HIDDEN}
		voice="v9/voice.mp3"
		music={music}
		musicGain={musicGain}
		overlays={<NpcOverlays />}
		hud={null}
		watermark={WATERMARK}
	/>
);
