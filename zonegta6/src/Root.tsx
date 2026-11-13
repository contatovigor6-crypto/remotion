import React from 'react';
import {Composition} from 'remotion';
import {DURATION, Short} from './Short';
import {FPS} from './theme';

export const Root: React.FC = () => (
	<Composition id="ZoneGTA6-Short" component={Short} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
);
