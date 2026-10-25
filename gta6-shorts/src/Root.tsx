import React from 'react';
import {Composition} from 'remotion';
import {GTA6Preso} from './preso/Video';
import {DURATION_S as PRESO_DURATION} from './preso/data';
import {GTA6Parado} from './Video';
import {DURATION_S, FPS, H, W} from './theme';

export const Root: React.FC = () => (
	<>
		<Composition id="GTA6Parado" component={GTA6Parado} durationInFrames={Math.round(DURATION_S * FPS)} fps={FPS} width={W} height={H} />
		{/* Mesma edição, trilhas diferentes */}
		<Composition id="GTA6Preso" component={GTA6Preso} defaultProps={{music: 'audio/music-preso.wav', musicGain: 1}} durationInFrames={Math.round(PRESO_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Composition id="GTA6PresoPhonk" component={GTA6Preso} defaultProps={{music: 'audio/music-phonk.wav', musicGain: 0.75}} durationInFrames={Math.round(PRESO_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Composition id="GTA6PresoTrap" component={GTA6Preso} defaultProps={{music: 'audio/music-trap.wav', musicGain: 1.25}} durationInFrames={Math.round(PRESO_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Composition id="GTA6PresoFunk" component={GTA6Preso} defaultProps={{music: 'audio/music-funk.wav', musicGain: 1}} durationInFrames={Math.round(PRESO_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Composition id="GTA6PresoSemMusica" component={GTA6Preso} defaultProps={{music: null, musicGain: 1}} durationInFrames={Math.round(PRESO_DURATION * FPS)} fps={FPS} width={W} height={H} />
	</>
);
