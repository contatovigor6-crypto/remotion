import React from 'react';
import {Composition} from 'remotion';
import {DURATION, Short} from './Short';
import {FPS} from './theme';

// Mesma edição, uma composição por trilha (todas originais, geradas em scripts/).
const versions = [
	{id: 'ZoneGTA6-Short', music: 'trilha-suspense.mp3'},
	{id: 'ZoneGTA6-Short-Dramatico', music: 'trilha-suspense-dramatico.mp3'},
	{id: 'ZoneGTA6-Short-Acao', music: 'trilha-acao-suspense.mp3'},
	{id: 'ZoneGTA6-Short-Synthwave', music: 'trilha-zonegta6.mp3'},
];

export const Root: React.FC = () => (
	<>
		{versions.map((v) => (
			<Composition
				key={v.id}
				id={v.id}
				component={Short}
				defaultProps={{music: v.music}}
				durationInFrames={DURATION}
				fps={FPS}
				width={1080}
				height={1920}
			/>
		))}
	</>
);
