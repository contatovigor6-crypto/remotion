import React from 'react';
import {Composition} from 'remotion';
import {Faq, videos} from './faq/Faq';
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
		{/* Vídeos em lista: tempos em src/faq/timing-<id>.json. */}
		<Composition
			id="ZoneGTA6-Perguntas"
			component={Faq}
			defaultProps={{music: 'trilha-urgencia.mp3', video: 'perguntas' as const}}
			durationInFrames={videos.perguntas.timing.duration}
			fps={FPS}
			width={1080}
			height={1920}
		/>
		<Composition
			id="ZoneGTA6-Checklist"
			component={Faq}
			defaultProps={{music: 'trilha-urgencia-checklist.mp3', video: 'checklist' as const}}
			durationInFrames={videos.checklist.timing.duration}
			fps={FPS}
			width={1080}
			height={1920}
		/>
	</>
);
