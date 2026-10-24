import React from 'react';
import {Composition} from 'remotion';
import {GTA6Parado} from './Video';
import {DURATION_S, FPS, H, W} from './theme';

export const Root: React.FC = () => (
	<Composition id="GTA6Parado" component={GTA6Parado} durationInFrames={Math.round(DURATION_S * FPS)} fps={FPS} width={W} height={H} />
);
