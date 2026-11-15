import {loadFont} from '@remotion/google-fonts/Cinzel';
import React from 'react';
import {AbsoluteFill, Html5Audio, Img, interpolate, random, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ChannelLogo, LOGO} from '../faq/Fx';
import {C, mono} from '../theme';

// Vídeo 5, versão "filme": a mesma contagem regressiva em linguagem de trailer de
// cinema. Faixas pretas, cartelas de texto sobre preto, planos com aproximação lenta
// e fusão para o preto, montagem rápida, título e data. Sem narração.
// Os marcos abaixo são os mesmos de scripts/music_trailer.py.

const cine = loadFont('normal', {weights: ['400', '700', '900'], subsets: ['latin']}).fontFamily;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const DAYS = 4; // dias até 19/11 na data de publicação (15/11). Ajuste se postar outro dia.
const BAR_H = 330; // altura das faixas de cinema

type Seg =
	| {kind: 'card'; lines: string[]; small?: boolean}
	| {kind: 'shot'; file: string; caption?: string}
	| {kind: 'black'}
	| {kind: 'title'}
	| {kind: 'date'}
	| {kind: 'days'}
	| {kind: 'logo'};
const timeline: Array<[Seg, number]> = [
	[{kind: 'card', lines: ['ZONE GTA VI', 'APRESENTA'], small: true}, 75],
	[{kind: 'shot', file: 'ambrosia_04.jpg'}, 75],
	[{kind: 'shot', file: 'ambrosia_02.jpg'}, 60],
	[{kind: 'card', lines: ['DEPOIS DE ANOS', 'DE ESPERA']}, 70],
	[{kind: 'shot', file: 'jason_duval_01.jpg', caption: 'JASON DUVAL'}, 50],
	[{kind: 'shot', file: 'lucia_caminos_01.jpg', caption: 'LUCIA CAMINOS'}, 50],
	[{kind: 'card', lines: ['DOIS', 'PROTAGONISTAS']}, 60],
	[{kind: 'shot', file: 'jason_duval_04.jpg', caption: 'VICE CITY'}, 45],
	[{kind: 'shot', file: 'grassrivers_05.jpg', caption: 'ESTADO DE LEONIDA'}, 45],
	[{kind: 'card', lines: ['UM ESTADO', 'INTEIRO']}, 60],
	// Montagem: 8 cortes de 12 frames.
	...['jason_and_lucia_17.jpg', 'jason_and_lucia_19.jpg', 'jason_duval_05.jpg', 'lucia_caminos_07.jpg', 'jason_duval_07.jpg', 'lucia_caminos_03.jpg', 'jason_duval_09.jpg', 'jason_and_lucia_14.jpg'].map(
		(file): [Seg, number] => [{kind: 'shot', file}, 12],
	),
	[{kind: 'black'}, 20],
	[{kind: 'title'}, 90],
	[{kind: 'date'}, 90],
	[{kind: 'days'}, 60],
	[{kind: 'logo'}, 110],
];
const starts = timeline.reduce<number[]>((acc, [, d], i) => [...acc, i === 0 ? 0 : acc[i - 1] + timeline[i - 1][1]], []);
export const FILME_DURATION = starts[starts.length - 1] + timeline[timeline.length - 1][1]; // 1056

const tracking = (frame: number, dur: number, from: number, to: number) => interpolate(frame, [0, dur], [from, to], clamp);
const fadeInOut = (frame: number, dur: number, edge = 10) => Math.min(interpolate(frame, [0, edge], [0, 1], clamp), interpolate(frame, [dur - edge, dur], [1, 0], clamp));

// Cartela: texto espaçado sobre preto, abrindo o espaçamento devagar.
const Card: React.FC<{lines: string[]; small?: boolean; dur: number}> = ({lines, small, dur}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#000', justifyContent: 'center', alignItems: 'center', opacity: fadeInOut(frame, dur, 12)}}>
			<div style={{transform: `scale(${1 + frame * 0.0009})`, textAlign: 'center'}}>
				{lines.map((l, i) => (
					<div key={l} style={{fontFamily: cine, fontWeight: small ? 400 : 700, fontSize: small ? (i === 0 ? 62 : 38) : Math.min(104, 900 / (0.74 * l.length)), color: i === 0 || !small ? '#f1ece4' : '#b9b2a6', letterSpacing: tracking(frame, dur, small ? 14 : 6, small ? 22 : 13), lineHeight: 1.35, whiteSpace: 'nowrap'}}>
						{l}
					</div>
				))}
				<div style={{height: 2, width: interpolate(frame, [6, 40], [0, 360], clamp), background: '#c9a86a', margin: '26px auto 0'}} />
			</div>
		</AbsoluteFill>
	);
};

// Plano: imagem dentro da janela de cinema, com aproximação lenta e fusão para o preto.
const Shot: React.FC<{file: string; caption?: string; dur: number; index: number}> = ({file, caption, dur, index}) => {
	const frame = useCurrentFrame();
	const fast = dur <= 12;
	const scale = fast ? 1.12 + frame * 0.004 : interpolate(frame, [0, dur], index % 2 ? [1.16, 1.06] : [1.05, 1.16]);
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<AbsoluteFill style={{opacity: fast ? 1 : fadeInOut(frame, dur, 8)}}>
				<Img src={staticFile(`media/${file}`)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale}) translateX(${(index % 2 ? 1 : -1) * frame * 0.02}%)`, filter: 'contrast(1.12) saturate(0.9) brightness(0.92)'}} />
				{/* Cor de cinema: sombras azuladas, altas luzes quentes. */}
				<AbsoluteFill style={{background: 'linear-gradient(180deg, #0a2a3a, #3a1a05)', mixBlendMode: 'soft-light', opacity: 0.55}} />
				{fast && frame < 1 ? <AbsoluteFill style={{background: '#fff', opacity: 0.5}} /> : null}
			</AbsoluteFill>
			{caption ? (
				<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: BAR_H + 70}}>
					<div style={{opacity: fadeInOut(frame, dur, 12), textAlign: 'center'}}>
						<div style={{height: 2, width: 120, background: '#c9a86a', margin: '0 auto 16px'}} />
						<div style={{fontFamily: cine, fontWeight: 700, fontSize: 54, color: '#f1ece4', letterSpacing: tracking(frame, dur, 8, 14), textShadow: '0 4px 24px #000'}}>{caption}</div>
					</div>
				</AbsoluteFill>
			) : null}
		</AbsoluteFill>
	);
};

const Title: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const sweep = interpolate(frame, [8, 60], [-30, 130], clamp);
	return (
		<AbsoluteFill style={{background: '#000', justifyContent: 'center', alignItems: 'center', opacity: interpolate(frame, [dur - 10, dur], [1, 0], clamp)}}>
			<div style={{position: 'absolute', width: 1400, height: 6, background: 'radial-gradient(ellipse, #ffd9a0 0%, transparent 70%)', opacity: interpolate(frame, [0, 6, 50], [0, 1, 0.35], clamp), transform: `scaleX(${interpolate(frame, [0, 20], [0.2, 1], clamp)})`}} />
			<div style={{textAlign: 'center', transform: `scale(${interpolate(frame, [0, dur], [1.12, 1])})`}}>
				<div style={{fontFamily: cine, fontWeight: 700, fontSize: 56, color: '#f1ece4', letterSpacing: tracking(frame, dur, 6, 12), whiteSpace: 'nowrap'}}>GRAND THEFT AUTO</div>
				<div style={{fontFamily: cine, fontWeight: 900, fontSize: 460, lineHeight: 1, backgroundImage: `linear-gradient(105deg, ${C.pink} ${sweep - 45}%, #fff3d6 ${sweep}%, ${C.amber} ${sweep + 45}%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>VI</div>
			</div>
		</AbsoluteFill>
	);
};

const DateCard: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#000', justifyContent: 'center', alignItems: 'center', opacity: fadeInOut(frame, dur, 10)}}>
			<div style={{textAlign: 'center', transform: `scale(${1 + frame * 0.0008})`}}>
				<div style={{fontFamily: cine, fontSize: 40, color: '#c9a86a', letterSpacing: 16}}>NOS CONSOLES</div>
				<div style={{fontFamily: cine, fontWeight: 900, fontSize: 78, color: '#f1ece4', letterSpacing: tracking(frame, dur, 2, 6), lineHeight: 1.3, whiteSpace: 'nowrap'}}>19 DE NOVEMBRO</div>
				<div style={{height: 2, width: interpolate(frame, [6, 40], [0, 520], clamp), background: '#c9a86a', margin: '10px auto 26px'}} />
				<div style={{fontFamily: cine, fontSize: 44, color: '#f1ece4', letterSpacing: 10}}>PS5 · XBOX SERIES X|S</div>
				<div style={{fontFamily: mono, fontSize: 26, color: '#b9b2a6', letterSpacing: 6, marginTop: 30, opacity: interpolate(frame, [30, 42], [0, 1], clamp)}}>PRÉ-DOWNLOAD JÁ DISPONÍVEL</div>
			</div>
		</AbsoluteFill>
	);
};

const DaysCard: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#000', justifyContent: 'center', alignItems: 'center', opacity: fadeInOut(frame, dur, 8)}}>
			<div style={{textAlign: 'center'}}>
				<div style={{fontFamily: cine, fontSize: 60, color: '#b9b2a6', letterSpacing: 20}}>FALTAM</div>
				<div style={{fontFamily: cine, fontWeight: 900, fontSize: 420, lineHeight: 1.05, color: '#f1ece4', textShadow: `0 0 80px ${C.pink}`}}>{DAYS}</div>
				<div style={{fontFamily: cine, fontWeight: 700, fontSize: 110, color: C.pink, letterSpacing: tracking(frame, dur, 18, 30)}}>DIAS</div>
			</div>
		</AbsoluteFill>
	);
};

const LogoCard: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#000', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 44}}>
			<ChannelLogo at={2} size={600} />
			<div style={{fontFamily: cine, fontWeight: 700, fontSize: 56, color: '#f1ece4', letterSpacing: 10, opacity: interpolate(frame, [18, 30], [0, 1], clamp)}}>INSCREVA-SE NO CANAL</div>
			{/* Bloco de créditos, como em cartaz de filme. */}
			<div style={{fontFamily: cine, fontSize: 22, color: '#8d867b', letterSpacing: 5, textAlign: 'center', lineHeight: 1.7, opacity: interpolate(frame, [34, 48], [0, 1], clamp)}}>
				IMAGENS&nbsp;&nbsp;ROCKSTAR GAMES&nbsp;&nbsp;·&nbsp;&nbsp;GRAND THEFT AUTO VI
				<br />
				EDIÇÃO E TRILHA ORIGINAL&nbsp;&nbsp;ZONE GTA VI
			</div>
		</AbsoluteFill>
	);
};

// Sound design mínimo: a trilha já marca cartelas, cortes e título.
type Ev = [name: string, frame: number, volume: number, why: string];
const sfx: Ev[] = [
	['reverse_cym', starts[19] - 24, 0.4, 'sucção antes do título'],
	['impact_e', starts[19], 0.6, 'título GRAND THEFT AUTO VI aparece'],
	['whoosh_d', starts[20] - 4, 0.4, 'passagem para a data'],
	['stinger_final', starts[22] + 2, 0.7, 'logo do canal entra'],
];

export const Filme: React.FC<{music: string | null}> = ({music}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			{timeline.map(([seg, dur], i) => (
				<Sequence key={i} from={starts[i]} durationInFrames={dur} name={seg.kind}>
					{seg.kind === 'card' ? <Card lines={seg.lines} small={seg.small} dur={dur} /> : null}
					{seg.kind === 'shot' ? <Shot file={seg.file} caption={seg.caption} dur={dur} index={i} /> : null}
					{seg.kind === 'title' ? <Title dur={dur} /> : null}
					{seg.kind === 'date' ? <DateCard dur={dur} /> : null}
					{seg.kind === 'days' ? <DaysCard dur={dur} /> : null}
					{seg.kind === 'logo' ? <LogoCard dur={dur} /> : null}
				</Sequence>
			))}
			{/* Vinheta e grão de película */}
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)', pointerEvents: 'none'}} />
			<AbsoluteFill style={{pointerEvents: 'none', opacity: 0.09, mixBlendMode: 'overlay'}}>
				<svg width="100%" height="100%">
					<filter id="grain">
						<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={Math.floor(random(`g${frame}`) * 1000)} />
						<feColorMatrix type="saturate" values="0" />
					</filter>
					<rect width="100%" height="100%" filter="url(#grain)" />
				</svg>
			</AbsoluteFill>
			{/* Faixas de cinema, com a marca do canal em cima e o crédito embaixo. */}
			<div style={{position: 'absolute', top: 0, left: 0, right: 0, height: BAR_H, background: '#000', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 46}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 18, opacity: 0.9}}>
					<Img src={staticFile(LOGO)} style={{width: 70, height: 70, borderRadius: '50%', objectFit: 'cover'}} />
					<div style={{fontFamily: cine, fontWeight: 700, fontSize: 30, color: '#f1ece4', letterSpacing: 10}}>ZONE GTA VI</div>
				</div>
			</div>
			<div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: BAR_H, background: '#000', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 40}}>
				<div style={{fontFamily: cine, fontSize: 20, color: '#8d867b', letterSpacing: 6}}>IMAGENS: ROCKSTAR GAMES · GTA VI</div>
			</div>
			{music ? <Html5Audio src={staticFile(`music/${music}`)} volume={0.85} /> : null}
			{sfx.map(([name, at, vol], i) => (
				<Sequence key={i} from={Math.max(0, at)} durationInFrames={120} name={`sfx-${name}`}>
					<Html5Audio src={staticFile(`sfx/v2/${name}.wav`)} volume={vol} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
