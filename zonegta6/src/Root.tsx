import React from 'react';
import {Composition} from 'remotion';
import {Faq, FAQ_DURATION} from './faq/Faq';
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
		{/* Vídeo 2: 7 perguntas sobre GTA 6 (tempos em src/faq/timing.json). */}
		<Composition
			id="ZoneGTA6-Perguntas"
			component={Faq}
			defaultProps={{music: 'trilha-urgencia.mp3'}}
			durationInFrames={FAQ_DURATION}
			fps={FPS}
			width={1080}
			height={1920}
		/>
	</>
);
