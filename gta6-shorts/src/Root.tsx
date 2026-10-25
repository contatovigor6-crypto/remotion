import React from 'react';
import {Composition} from 'remotion';
import {GTA6Preso} from './preso/Video';
import {DURATION_S as PRESO_DURATION} from './preso/data';
import {GTA6Parado} from './Video';
import {DURATION_S, FPS, H, W} from './theme';

export const Root: React.FC = () => (
	<>
		<Composition id="GTA6Parado" component={GTA6Parado} durationInFrames={Math.round(DURATION_S * FPS)} fps={FPS} width={W} height={H} />
		<Composition id="GTA6Preso" component={GTA6Preso} durationInFrames={Math.round(PRESO_DURATION * FPS)} fps={FPS} width={W} height={H} />
	</>
);
