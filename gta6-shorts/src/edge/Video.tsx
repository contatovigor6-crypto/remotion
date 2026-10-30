import React from 'react';
import {WATERMARK} from '../brand';
import {WORDS} from '../data/words-edge';
import {LongEdit} from '../long/LongEdit';
import {HIDDEN, KEYWORDS, SFX, SHAKES} from './data';
import {EDGE_NEW, EdgeOverlays} from './Overlays';
import {SHOTS} from './shots';

// Intervalos em que um screenshot novo (Edge 430) está na tela, para o selo "IMAGEM OFICIAL NOVA"
const NEW_SPANS: [number, number][] = SHOTS.filter((s) => EDGE_NEW.some((n) => s.src === `v10/${n}.jpg`) && s.look !== 'title').map((s) => [s.from, s.to]);

// Narração original (ElevenLabs) sem alteração: public/v10/voice.mp3 — vídeo LONGO 16:9
export const GTA6Edge: React.FC<{music: string | null; musicGain: number}> = ({music, musicGain}) => (
	<LongEdit
		shots={SHOTS}
		sfx={SFX}
		shakes={SHAKES}
		words={WORDS}
		keywords={KEYWORDS}
		hidden={HIDDEN}
		voice="v10/voice.mp3"
		music={music}
		musicGain={musicGain}
		overlays={<EdgeOverlays newSpans={NEW_SPANS} />}
		hud={null}
		watermark={WATERMARK}
	/>
);
