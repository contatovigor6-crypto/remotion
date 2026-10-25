import React from 'react';
import {
	AbsoluteFill,
	Easing,
	Img,
	OffthreadVideo,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import type {Look, Shot} from '../data/shots';
import {f} from '../theme';
import {RGBSplit} from './RGBSplit';

const LOOKS: Record<Look, string> = {
	base: 'contrast(1.08) saturate(1.15)',
	desat: 'saturate(0.4) contrast(1.05)',
	calm: 'saturate(0.5) brightness(0.78) contrast(1.05)',
	red: 'contrast(1.15) saturate(1.1) brightness(0.9)',
	freeze: 'saturate(0.15) contrast(1.25) brightness(0.95)',
	dark: 'brightness(0.5) saturate(1.1) contrast(1.05)',
	title: 'brightness(0.32) saturate(1.2) blur(10px)',
};

const ease = Easing.bezier(0.33, 0, 0.2, 1);

export const ShotView: React.FC<{shot: Shot}> = ({shot}) => {
	const frame = useCurrentFrame(); // relativo ao início do plano
	const {fps} = useVideoConfig();
	const len = f(shot.to) - f(shot.from);
	const frozen = shot.freezeAt !== undefined && frame >= f(shot.freezeAt) - f(shot.from);
	const motionFrame = frozen ? f(shot.freezeAt!) - f(shot.from) : frame;
	const p = ease(Math.min(1, motionFrame / len));

	const focus1 = shot.focus1 ?? shot.focus0;
	const fx = interpolate(p, [0, 1], [shot.focus0[0], focus1[0]]);
	const fy = interpolate(p, [0, 1], [shot.focus0[1], focus1[1]]);
	let scale = interpolate(p, [0, 1], [shot.s0, shot.s1]);

	// Punch-ins sincronizados com palavras-chave (zoom seco que permanece)
	for (const t of shot.punches ?? []) {
		const local = f(t) - f(shot.from);
		scale *= 1 + 0.09 * spring({frame: frame - local, fps, config: {damping: 16, stiffness: 260, mass: 0.6}});
	}

	// Transições de entrada
	let tx = 0;
	let blurX = 0;
	let blur = 0;
	let overlay: React.ReactNode = null;
	let split = 0;
	const tIn = frame;
	if (shot.inT === 'whipL' || shot.inT === 'whipR') {
		const d = shot.inT === 'whipL' ? 1 : -1;
		const q = interpolate(tIn, [0, 7], [1, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
		tx = d * 230 * q;
		scale *= 1 + 0.5 * q;
		blurX = 60 * q;
	}
	if (shot.inT === 'zoom') {
		const q = interpolate(tIn, [0, 9], [1, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
		scale *= 1 + 0.45 * q;
		blur = 14 * q;
	}
	if (shot.inT === 'glitch') {
		split = interpolate(tIn, [0, 2, 8], [40, 26, 0], {extrapolateRight: 'clamp'});
	}
	if (shot.inT === 'flash') {
		const o = interpolate(tIn, [0, 5], [0.9, 0], {extrapolateRight: 'clamp'});
		overlay = <AbsoluteFill style={{background: 'white', opacity: o}} />;
	}
	if (shot.inT === 'dip') {
		const o = interpolate(tIn, [0, 7], [1, 0], {extrapolateRight: 'clamp'});
		overlay = <AbsoluteFill style={{background: 'black', opacity: o}} />;
	}

	const look = frozen ? 'freeze' : shot.look ?? 'base';
	const filterId = `mb-${shot.id}`;
	const filters = [LOOKS[look], blur > 0.2 ? `blur(${blur}px)` : '', blurX > 0.5 ? `url(#${filterId})` : '']
		.filter(Boolean)
		.join(' ');

	const mediaStyle: React.CSSProperties = {
		position: 'absolute',
		width: '100%',
		height: '100%',
		objectFit: 'cover',
		objectPosition: `${fx * 100}% ${fy * 100}%`,
	};

	const media = shot.video ? (
		<OffthreadVideo src={staticFile(shot.src)} muted style={mediaStyle} startFrom={f(shot.startFrom ?? 0)} playbackRate={shot.rate ?? 1} />
	) : (
		<Img src={staticFile(shot.src)} style={mediaStyle} />
	);

	return (
		<AbsoluteFill style={{background: 'black', overflow: 'hidden'}}>
			<svg width={0} height={0} style={{position: 'absolute'}}>
				<filter id={filterId} x="-20%" y="0" width="140%" height="100%">
					<feGaussianBlur stdDeviation={`${blurX} 0`} />
				</filter>
			</svg>
			<RGBSplit amount={split}>
				<AbsoluteFill
					style={{
						transform: `translateX(${tx}px) scale(${scale})`,
						transformOrigin: `${fx * 100}% ${fy * 100}%`,
						filter: filters,
					}}
				>
					{media}
				</AbsoluteFill>
			</RGBSplit>
			{look === 'red' ? (
				<AbsoluteFill style={{background: 'radial-gradient(circle at 60% 40%, rgba(255,40,70,0) 20%, rgba(150,0,30,0.55) 100%)'}} />
			) : null}
			{frozen ? <FreezeFx since={frame - (f(shot.freezeAt!) - f(shot.from))} /> : null}
			{overlay}
		</AbsoluteFill>
	);
};

/** Quadro congelado: flash curto + linhas de varredura, como uma "pausa" do jogo */
const FreezeFx: React.FC<{since: number}> = ({since}) => {
	const flash = interpolate(since, [0, 4], [0.7, 0], {extrapolateRight: 'clamp'});
	return (
		<>
			<AbsoluteFill
				style={{
					backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 2px, transparent 2px, transparent 5px)',
				}}
			/>
			<AbsoluteFill style={{background: 'white', opacity: flash}} />
		</>
	);
};
