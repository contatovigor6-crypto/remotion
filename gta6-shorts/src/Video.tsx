import React from 'react';
import {Hud} from './components/Hud';
import {Overlays} from './components/Overlays';
import {HIDDEN, KEYWORDS} from './data/captions';
import {SFX} from './data/sfx';
import {SHOTS} from './data/shots';
import {WORDS} from './data/words';
import {ShortEdit} from './ShortEdit';

// Tremores só nos impactos principais
const SHAKES = [
	{at: 2.14, amp: 22},
	{at: 21.18, amp: 10},
	{at: 36.92, amp: 20},
	{at: 41.36, amp: 22},
	{at: 60.32, amp: 26},
	{at: 73.36, amp: 14},
];

export const GTA6Parado: React.FC = () => (
	<ShortEdit
		shots={SHOTS}
		sfx={SFX}
		shakes={SHAKES}
		words={WORDS}
		keywords={KEYWORDS}
		hidden={HIDDEN}
		voice="audio/voice.wav"
		music="audio/music.wav"
		overlays={<Overlays />}
		hud={<Hud />}
	/>
);
