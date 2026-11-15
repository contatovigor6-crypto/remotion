import {loadFont} from '@remotion/google-fonts/Cinzel';
import React from 'react';
import {AbsoluteFill, Html5Audio, Img, interpolate, random, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ChannelLogo, LOGO} from '../faq/Fx';
import {C, mono} from '../theme';
import timelineData from './filme-timeline.json';

// Vídeo 5, versão "filme": a mesma contagem regressiva em linguagem de trailer de
// cinema. Faixas pretas, cartelas de texto sobre preto, planos com aproximação lenta
// e fusão para o preto, montagem rápida, título e data. Sem narração.
// Os marcos abaixo são os mesmos de scripts/music_trailer.py.

const cine = loadFont('normal', {weights: ['400', '700', '900'], subsets: ['latin']}).fontFamily;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const DAYS = 4; // dias até 19/11 na data de publicação (15/11). Ajuste se postar outro dia.
const IMG_H = 810; // altura da janela de imagem: mostra 75% da largura da foto 16:9
const BAR_H = (1920 - IMG_H) / 2; // faixas de cinema acima e abaixo

// Linha do tempo em src/edit/filme-timeline.json (a trilha lê o mesmo arquivo).
// `focus` é o ponto de interesse horizontal da imagem (0 = esquerda, 1 = direita):
// o enquadramento é centrado nele, para o assunto principal ficar sempre visível.
type Seg = {kind: string; dur: number; lines?: string[]; small?: boolean; file?: string; focus?: number; caption?: string | null};
const timeline = timelineData as Seg[];
const starts = timeline.reduce<number[]>((acc, _seg, i) => [...acc, i === 0 ? 0 : acc[i - 1] + timeline[i - 1].dur], []);
const startOf = (kind: string) => starts[timeline.findIndex((t) => t.kind === kind)];
export const FILME_DURATION = starts[starts.length - 1] + timeline[timeline.length - 1].dur;

const tracking = (frame: number, dur: number, from: number, to: number) => interpolate(frame, [0, dur], [from, to], clamp);
const fadeInOut = (frame: number, dur: number, edge = 10) => Math.min(interpolate(frame, [0, edge], [0, 1], clamp), interpolate(frame, [dur - edge, dur], [1, 0], clamp));

// Cartela: texto espaçado sobre preto. As letras surgem uma a uma, saindo do desfoque,
// enquanto o espaçamento abre devagar; um filete dourado cresce por baixo.
const Card: React.FC<{lines: string[]; small?: boolean; dur: number}> = ({lines, small, dur}) => {
	const frame = useCurrentFrame();
	let n = 0;
	return (
		<AbsoluteFill style={{background: '#000', justifyContent: 'center', alignItems: 'center', opacity: interpolate(frame, [dur - 12, dur], [1, 0], clamp)}}>
			{/* Brilho quente atrás do texto, como luz de projetor. */}
			<div style={{position: 'absolute', width: 1200, height: 500, background: 'radial-gradient(ellipse, rgba(201,168,106,0.16) 0%, transparent 65%)', opacity: interpolate(frame, [0, 30], [0, 1], clamp)}} />
			<div style={{transform: `scale(${1 + frame * 0.0009})`, textAlign: 'center'}}>
				{lines.map((l, i) => (
					<div key={l} style={{fontFamily: cine, fontWeight: small ? 400 : 700, fontSize: small ? (i === 0 ? 62 : 38) : Math.min(100, 880 / (0.78 * l.length)), color: i === 0 || !small ? '#f1ece4' : '#b9b2a6', letterSpacing: tracking(frame, dur, small ? 14 : 5, small ? 22 : 11), lineHeight: 1.35, whiteSpace: 'pre'}}>
						{l.split('').map((ch, k) => {
							const o = interpolate(frame, [4 + n * 1.3, 14 + n * 1.3], [0, 1], clamp);
							n++;
							return (
								<span key={k} style={{opacity: o, filter: `blur(${(1 - o) * 8}px)`, display: 'inline-block', transform: `translateY(${(1 - o) * 10}px)`}}>
									{ch}
								</span>
							);
						})}
					</div>
				))}
				<div style={{height: 2, width: interpolate(frame, [10, 46], [0, 360], clamp), background: 'linear-gradient(90deg, transparent, #c9a86a, transparent)', margin: '26px auto 0'}} />
			</div>
		</AbsoluteFill>
	);
};

// Plano: a imagem ocupa uma janela larga no centro da tela, enquadrada no assunto
// (focus), com aproximação lenta e fusão para o preto. A legenda fica abaixo dela.
const Shot: React.FC<{file: string; focus: number; caption?: string | null; dur: number; index: number}> = ({file, focus, caption, dur, index}) => {
	const frame = useCurrentFrame();
	const fast = dur <= 12;
	const scale = fast ? 1.03 + frame * 0.004 : interpolate(frame, [0, dur], index % 2 ? [1.08, 1.0] : [1.0, 1.08]);
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: BAR_H, height: IMG_H, overflow: 'hidden', opacity: fast ? 1 : fadeInOut(frame, dur, 8)}}>
				<Img
					src={staticFile(`media/${file}`)}
					style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${focus * 100}% 50%`, transform: `scale(${scale})`, transformOrigin: `${focus * 100}% 50%`, filter: 'contrast(1.1) saturate(0.95)'}}
				/>
				{/* Cor de cinema: sombras azuladas, altas luzes quentes. */}
				<AbsoluteFill style={{background: 'linear-gradient(180deg, #0a2a3a, #3a1a05)', mixBlendMode: 'soft-light', opacity: 0.4}} />
				<AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />
				{fast && frame < 1 ? <AbsoluteFill style={{background: '#fff', opacity: 0.5}} /> : null}
			</div>
			{caption ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: BAR_H + IMG_H + 44, textAlign: 'center', opacity: fadeInOut(frame, dur, 12)}}>
					<div style={{height: 2, width: 120, background: '#c9a86a', margin: '0 auto 18px'}} />
					<div style={{fontFamily: cine, fontWeight: 700, fontSize: 54, color: '#f1ece4', letterSpacing: tracking(frame, dur, 8, 14)}}>{caption}</div>
				</div>
			) : null}
		</AbsoluteFill>
	);
};

// Arte quadrada oficial (capa, trilha): inteira e centralizada, sem corte, sobre uma
// versão desfocada dela mesma.
const Art: React.FC<{file: string; caption?: string | null; dur: number}> = ({file, caption, dur}) => {
	const frame = useCurrentFrame();
	const src = staticFile(`media/${file}`);
	const size = IMG_H + 40;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: BAR_H, height: IMG_H, overflow: 'hidden', opacity: fadeInOut(frame, dur, 10)}}>
				<Img src={src} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(40px) brightness(0.45)', transform: 'scale(1.2)'}} />
				<Img src={src} style={{position: 'absolute', left: (1080 - size) / 2, top: (IMG_H - size) / 2, width: size, height: size, objectFit: 'contain', transform: `scale(${0.92 + frame * 0.0008})`, boxShadow: '0 30px 80px rgba(0,0,0,0.8)'}} />
			</div>
			{caption ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: BAR_H + IMG_H + 44, textAlign: 'center', opacity: fadeInOut(frame, dur, 12)}}>
					<div style={{height: 2, width: 120, background: '#c9a86a', margin: '0 auto 18px'}} />
					<div style={{fontFamily: cine, fontWeight: 700, fontSize: 50, color: '#f1ece4', letterSpacing: tracking(frame, dur, 6, 12)}}>{caption}</div>
				</div>
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
	['reverse_cym', startOf('title') - 24, 0.4, 'sucção antes do título'],
	['impact_e', startOf('title'), 0.6, 'título GRAND THEFT AUTO VI aparece'],
	['whoosh_d', startOf('date') - 4, 0.4, 'passagem para a data'],
	['stinger_final', startOf('logo') + 2, 0.7, 'logo do canal entra'],
];

export const Filme: React.FC<{music: string | null}> = ({music}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			{timeline.map((seg, i) => (
				<Sequence key={i} from={starts[i]} durationInFrames={seg.dur} name={seg.kind}>
					{seg.kind === 'card' ? <Card lines={seg.lines ?? []} small={seg.small} dur={seg.dur} /> : null}
					{seg.kind === 'shot' ? <Shot file={seg.file ?? ''} focus={seg.focus ?? 0.5} caption={seg.caption} dur={seg.dur} index={i} /> : null}
					{seg.kind === 'art' ? <Art file={seg.file ?? ''} caption={seg.caption} dur={seg.dur} /> : null}
					{seg.kind === 'title' ? <Title dur={seg.dur} /> : null}
					{seg.kind === 'date' ? <DateCard dur={seg.dur} /> : null}
					{seg.kind === 'days' ? <DaysCard dur={seg.dur} /> : null}
					{seg.kind === 'logo' ? <LogoCard dur={seg.dur} /> : null}
				</Sequence>
			))}
			{/* Grão de película */}
			<AbsoluteFill style={{pointerEvents: 'none', opacity: 0.09, mixBlendMode: 'overlay'}}>
				<svg width="100%" height="100%">
					<filter id="grain">
						<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={Math.floor(random(`g${frame}`) * 1000)} />
						<feColorMatrix type="saturate" values="0" />
					</filter>
					<rect width="100%" height="100%" filter="url(#grain)" />
				</svg>
			</AbsoluteFill>
			{/* Marca do canal em cima e crédito embaixo, dentro das faixas pretas. */}
			<div style={{position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, opacity: 0.9}}>
				<Img src={staticFile(LOGO)} style={{width: 70, height: 70, borderRadius: '50%', objectFit: 'cover'}} />
				<div style={{fontFamily: cine, fontWeight: 700, fontSize: 30, color: '#f1ece4', letterSpacing: 10}}>ZONE GTA VI</div>
			</div>
			<div style={{position: 'absolute', top: 1600, left: 0, right: 0, textAlign: 'center', fontFamily: cine, fontSize: 20, color: '#8d867b', letterSpacing: 6}}>IMAGENS: ROCKSTAR GAMES · GTA VI</div>
			{music ? <Html5Audio src={staticFile(`music/${music}`)} volume={0.85} /> : null}
			{sfx.map(([name, at, vol], i) => (
				<Sequence key={i} from={Math.max(0, at)} durationInFrames={120} name={`sfx-${name}`}>
					<Html5Audio src={staticFile(`sfx/v2/${name}.wav`)} volume={vol} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
