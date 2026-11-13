import React from 'react';
import {AbsoluteFill, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const XFADE = 12; // frames de transição entre duas mídias

// Uma mídia de fundo: zoom lento (Ken Burns) + travelling lateral pela imagem 16:9
// recortada em 9:16. Arquivos .mp4/.webm/.mov entram como vídeo, sem som.
const Shot: React.FC<{file: string; dur: number; index: number}> = ({file, dur, index}) => {
	const frame = useCurrentFrame();
	const zoomIn = index % 2 === 0;
	const scale = interpolate(frame, [0, dur], zoomIn ? [1.04, 1.16] : [1.16, 1.04], clamp);
	const panFrom = index % 3 === 0 ? -6 : index % 3 === 1 ? 6 : 0;
	const pan = interpolate(frame, [0, dur], [panFrom, -panFrom], clamp);
	// Entrada: fade + leve desfoque de movimento, como um whip curto.
	const fadeIn = interpolate(frame, [0, XFADE], [0, 1], clamp);
	const blur = interpolate(frame, [0, XFADE], [10, 0], clamp);
	const isVideo = /\.(mp4|webm|mov)$/i.test(file);
	const style: React.CSSProperties = {
		width: '100%',
		height: '100%',
		objectFit: 'cover',
		transform: `scale(${scale}) translateX(${pan}%)`,
	};
	return (
		<AbsoluteFill style={{opacity: fadeIn, filter: `blur(${blur}px)`}}>
			{isVideo ? (
				<OffthreadVideo src={staticFile(`media/${file}`)} muted style={style} />
			) : (
				<Img src={staticFile(`media/${file}`)} style={style} />
			)}
		</AbsoluteFill>
	);
};

// Distribui as mídias de um bloco em fatias iguais, com sobreposição para o crossfade.
export const Slideshow: React.FC<{files: string[]; from: number; dur: number}> = ({files, from, dur}) => {
	const slice = Math.floor(dur / files.length);
	return (
		<>
			{files.map((file, i) => {
				const start = from + i * slice;
				const length = (i === files.length - 1 ? dur - i * slice : slice) + XFADE;
				return (
					<Sequence key={`${from}-${file}`} from={start} durationInFrames={length} name={`bg-${file}`}>
						<Shot file={file} dur={length} index={i} />
					</Sequence>
				);
			})}
		</>
	);
};

// Tratamento de cor para o texto continuar legível: escurece, puxa para a paleta do canal
// e reforça topo/base, onde ficam o HUD e os textos.
export const Grade: React.FC<{accent: string}> = ({accent}) => (
	<>
		<AbsoluteFill style={{background: 'rgba(6,6,12,0.28)'}} />
		<AbsoluteFill style={{background: accent, mixBlendMode: 'soft-light', opacity: 0.25}} />
		<AbsoluteFill
			style={{
				background:
					'linear-gradient(180deg, rgba(6,6,12,0.8) 0%, rgba(6,6,12,0.2) 22%, rgba(6,6,12,0.45) 55%, rgba(6,6,12,0.9) 100%)',
			}}
		/>
	</>
);
