import React from 'react';
import {AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame} from 'remotion';
import {C, DISPLAY, UI} from '../theme';

// CARTELAS DE MOTION (produção em série) — cenas de tela cheia, rápidas de renderizar (2D), reutilizáveis por qualquer plano:
//   slam     palavras batendo na tela, uma a uma, com a última em destaque
//   cross    ícone gigante entra girando e leva um X vermelho
//   progress barra de download enchendo com contador
//   date     folha de calendário virando para a data
//   photo    imagem oficial (ou PNG recortado) entrando inclinada numa moldura, com título
//   poll     duas opções A/B para comentar
// Fundos variados (burst, stripes, grid, dots, split) para nunca repetir o cenário entre cartelas.

export type Card = {
	from: number;
	to: number;
	type: 'slam' | 'cross' | 'progress' | 'date' | 'photo' | 'poll';
	words?: string[];
	icon?: string;
	label?: string;
	sub?: string;
	img?: string;
	color: string;
	color2: string;
	bg: 'burst' | 'stripes' | 'grid' | 'dots' | 'split';
	value?: number;
	unit?: string;
	options?: string[];
};

const ink = (c: string) => (c === C.yellow || c === '#FFFFFF' || c === C.cyan ? '#111' : 'white');
const sp = (frame: number, at: number, d = 10, s = 300) => spring({frame: frame - at, fps: 30, config: {damping: d, stiffness: s}});

const Bg: React.FC<{kind: Card['bg']; c1: string; c2: string}> = ({kind, c1, c2}) => {
	const frame = useCurrentFrame();
	const t = frame / 30;
	if (kind === 'burst') {
		return (
			<AbsoluteFill style={{background: c2, overflow: 'hidden'}}>
				<div style={{position: 'absolute', left: -900, top: -500, width: 2880, height: 2880, background: `repeating-conic-gradient(from ${t * 40}deg at 50% 50%, ${c1} 0deg 10deg, ${c2} 10deg 20deg)`, opacity: 0.9}} />
				<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 20%, rgba(0,0,0,0.65) 85%)'}} />
			</AbsoluteFill>
		);
	}
	if (kind === 'stripes') {
		return (
			<AbsoluteFill style={{background: `repeating-linear-gradient(-30deg, ${c1} 0 70px, ${c2} 70px 140px)`, backgroundPosition: `${t * 260}px 0`, overflow: 'hidden'}}>
				<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, rgba(0,0,0,0.15) 20%, rgba(0,0,0,0.75) 90%)'}} />
			</AbsoluteFill>
		);
	}
	if (kind === 'grid') {
		return (
			<AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 30%, ${c1}66, #07040f 70%), #07040f`, overflow: 'hidden'}}>
				<div style={{position: 'absolute', left: -540, right: -540, top: 1050, height: 1400, transform: 'perspective(600px) rotateX(62deg)', transformOrigin: '50% 0%', backgroundImage: `linear-gradient(${c1} 3px, transparent 3px), linear-gradient(90deg, ${c2} 3px, transparent 3px)`, backgroundSize: '90px 90px', backgroundPosition: `0 ${(t * 300) % 90}px`, opacity: 0.8}} />
			</AbsoluteFill>
		);
	}
	if (kind === 'dots') {
		return (
			<AbsoluteFill style={{background: c2, overflow: 'hidden'}}>
				<AbsoluteFill style={{backgroundImage: `radial-gradient(${c1} 9px, transparent 10px)`, backgroundSize: '44px 44px', backgroundPosition: `${t * 60}px ${t * 90}px`, opacity: 0.55}} />
				<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 25%, rgba(0,0,0,0.7) 90%)'}} />
			</AbsoluteFill>
		);
	}
	// split: duas metades diagonais que deslizam
	return (
		<AbsoluteFill style={{background: c2, overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: -400 + Math.sin(t * 2) * 30, top: -200, width: 1400, height: 1300, background: c1, transform: 'rotate(-14deg)'}} />
			<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.6) 95%)'}} />
		</AbsoluteFill>
	);
};

const Slam: React.FC<{card: Card}> = ({card}) => {
	const frame = useCurrentFrame();
	const words = card.words ?? [];
	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', paddingTop: 300}}>
			{words.map((w, i) => {
				const k = sp(frame, 2 + i * 5, 9, 340);
				const last = i === words.length - 1;
				const size = Math.min(last ? 230 : 170, 1000 / (w.length * 0.5));
				const rot = (random(`r${w}${i}`) - 0.5) * 10;
				return (
					<div key={i} style={{opacity: k, transform: `scale(${interpolate(k, [0, 1], [3.2, 1])}) rotate(${rot * (1 - k) + (last ? -3 : 0)}deg)`, marginTop: i ? 6 : 0}}>
						<span style={{display: 'inline-block', fontFamily: DISPLAY, fontSize: size, lineHeight: 1.05, color: last ? ink(card.color) : 'white', background: last ? card.color : 'transparent', padding: last ? '6px 34px 0' : 0, borderRadius: 18, textShadow: last ? 'none' : '0 10px 0 #000', boxShadow: last ? '0 14px 0 #000' : 'none', whiteSpace: 'nowrap'}}>{w}</span>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

const Cross: React.FC<{card: Card}> = ({card}) => {
	const frame = useCurrentFrame();
	const k = sp(frame, 1, 11, 220);
	const x = sp(frame, 12, 8, 360);
	const lab = sp(frame, 16, 10, 300);
	return (
		<AbsoluteFill style={{alignItems: 'center', paddingTop: 260}}>
			<div style={{position: 'relative', width: 620, height: 620, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<div style={{fontSize: 470, lineHeight: 1, transform: `scale(${k}) rotate(${(1 - k) * -360 + frame * 1.5}deg)`, filter: 'drop-shadow(0 20px 0 rgba(0,0,0,0.6))'}}>{card.icon}</div>
				{[45, -45].map((r) => (
					<div key={r} style={{position: 'absolute', width: 700 * x, height: 70, background: C.red, borderRadius: 35, transform: `rotate(${r}deg)`, boxShadow: '0 10px 0 #000, 0 0 40px rgba(255,45,61,0.8)'}} />
				))}
			</div>
			<div style={{marginTop: 30, opacity: lab, transform: `translateY(${(1 - lab) * 80}px)`}}>
				<span style={{fontFamily: DISPLAY, fontSize: Math.min(120, 980 / ((card.label ?? '').length * 0.5)), color: 'white', textShadow: '0 10px 0 #000'}}>{card.label}</span>
			</div>
		</AbsoluteFill>
	);
};

const Progress: React.FC<{card: Card}> = ({card}) => {
	const frame = useCurrentFrame();
	const dur = (card.to - card.from) * 30;
	const p = interpolate(frame, [4, dur - 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const v = Math.round(p * (card.value ?? 100));
	return (
		<AbsoluteFill style={{alignItems: 'center', paddingTop: 330}}>
			<div style={{fontFamily: DISPLAY, fontSize: 96, color: 'white', textShadow: '0 8px 0 #000'}}>{card.label}</div>
			<div style={{marginTop: 50, width: 900, height: 110, borderRadius: 55, border: '8px solid white', background: 'rgba(0,0,0,0.55)', overflow: 'hidden', boxShadow: '0 12px 0 #000'}}>
				<div style={{width: `${p * 100}%`, height: '100%', background: `repeating-linear-gradient(-45deg, ${card.color} 0 30px, ${card.color2} 30px 60px)`, backgroundPosition: `${frame * 6}px 0`}} />
			</div>
			<div style={{marginTop: 34, fontFamily: DISPLAY, fontSize: 150, color: card.color, textShadow: '0 10px 0 #000'}}>{`${v}${card.unit ?? '%'}`}</div>
			{card.sub ? <div style={{marginTop: 6, fontFamily: UI, fontWeight: 800, fontSize: 40, color: 'white', textShadow: '0 4px 0 #000'}}>{card.sub}</div> : null}
		</AbsoluteFill>
	);
};

const DateCard: React.FC<{card: Card}> = ({card}) => {
	const frame = useCurrentFrame();
	const flip = sp(frame, 3, 12, 160);
	const [day, month] = (card.label ?? '19 NOV').split(' ');
	return (
		<AbsoluteFill style={{alignItems: 'center', paddingTop: 260, perspective: 1600}}>
			<div style={{width: 640, borderRadius: 40, overflow: 'hidden', boxShadow: '0 24px 0 #000', transform: `rotateX(${(1 - flip) * 100}deg) scale(${0.8 + flip * 0.2})`, transformOrigin: '50% 0%'}}>
				<div style={{background: card.color, padding: '24px 0', textAlign: 'center', fontFamily: DISPLAY, fontSize: 96, color: ink(card.color)}}>{month}</div>
				<div style={{background: 'white', textAlign: 'center', fontFamily: DISPLAY, fontSize: 380, lineHeight: 1.1, color: '#111'}}>{day}</div>
			</div>
			{card.sub ? (
				<div style={{marginTop: 40, opacity: sp(frame, 14), fontFamily: DISPLAY, fontSize: Math.min(84, 980 / (card.sub.length * 0.5)), color: 'white', textShadow: '0 8px 0 #000'}}>{card.sub}</div>
			) : null}
		</AbsoluteFill>
	);
};

const Photo: React.FC<{card: Card}> = ({card}) => {
	const frame = useCurrentFrame();
	const k = sp(frame, 1, 12, 220);
	const lab = sp(frame, 9, 10, 300);
	const png = (card.img ?? '').endsWith('.png');
	const drift = frame * 0.06;
	return (
		<AbsoluteFill style={{alignItems: 'center', paddingTop: 240}}>
			<div style={{opacity: lab, transform: `scale(${interpolate(lab, [0, 1], [1.8, 1])})`, marginBottom: 30}}>
				<span style={{display: 'inline-block', fontFamily: DISPLAY, fontSize: Math.min(110, 980 / ((card.label ?? '').length * 0.5)), color: ink(card.color), background: card.color, padding: '6px 30px 0', borderRadius: 16, boxShadow: '0 12px 0 #000', whiteSpace: 'nowrap'}}>{card.label}</span>
			</div>
			<div style={{transform: `translateY(${(1 - k) * 900}px) rotate(${(1 - k) * 25 - 4 + Math.sin(drift) * 1.5}deg) scale(${1 + frame / 900})`}}>
				{png ? (
					<Img src={staticFile(card.img ?? '')} style={{width: 980, height: 620, objectFit: 'contain', filter: 'drop-shadow(0 30px 30px rgba(0,0,0,0.6))'}} />
				) : (
					<div style={{padding: 18, background: 'white', borderRadius: 12, boxShadow: '0 30px 0 rgba(0,0,0,0.55)'}}>
						<Img src={staticFile(card.img ?? '')} style={{display: 'block', width: 800, height: 640, objectFit: 'cover'}} />
					</div>
				)}
			</div>
			{card.sub ? <div style={{position: 'absolute', bottom: 120, right: 40, fontFamily: UI, fontWeight: 600, fontSize: 24, color: 'rgba(255,255,255,0.8)', textShadow: '0 2px 4px #000'}}>{card.sub}</div> : null}
		</AbsoluteFill>
	);
};

const Poll: React.FC<{card: Card}> = ({card}) => {
	const frame = useCurrentFrame();
	const opts = card.options ?? ['SIM', 'NÃO'];
	return (
		<AbsoluteFill style={{alignItems: 'center', paddingTop: 280}}>
			<div style={{fontFamily: DISPLAY, fontSize: Math.min(100, 980 / ((card.label ?? '').length * 0.48)), color: 'white', textShadow: '0 10px 0 #000', textAlign: 'center', padding: '0 40px'}}>{card.label}</div>
			<div style={{display: 'flex', gap: 30, marginTop: 50}}>
				{opts.map((o, i) => {
					const k = sp(frame, 6 + i * 5, 9, 320);
					const col = i === 0 ? card.color : card.color2;
					return (
						<div key={o} style={{width: 440, height: 300, borderRadius: 30, background: col, boxShadow: '0 16px 0 #000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${interpolate(k, [0, 1], [0.3, 1])}) rotate(${(1 - k) * (i ? 12 : -12)}deg)`, opacity: k}}>
							<span style={{fontFamily: DISPLAY, fontSize: 120, color: ink(col), lineHeight: 1}}>{String.fromCharCode(65 + i)}</span>
							<span style={{fontFamily: DISPLAY, fontSize: Math.min(64, 400 / (o.length * 0.5)), color: ink(col), textAlign: 'center', padding: '0 16px'}}>{o}</span>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

export const CardView: React.FC<{card: Card}> = ({card}) => {
	const frame = useCurrentFrame();
	const dur = (card.to - card.from) * 30;
	const out = interpolate(frame, [dur - 3, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const zin = interpolate(frame, [0, 6], [1.25, 1], {extrapolateRight: 'clamp'});
	const body = {slam: Slam, cross: Cross, progress: Progress, date: DateCard, photo: Photo, poll: Poll}[card.type];
	return (
		<AbsoluteFill style={{opacity: out, transform: `scale(${zin})`}}>
			<Bg kind={card.bg} c1={card.color} c2={card.color2} />
			{React.createElement(body, {card})}
		</AbsoluteFill>
	);
};

/** flash agressivo nos cortes: separação RGB + clarão + barras de glitch por 4 quadros */
export const CutFx: React.FC = () => {
	const frame = useCurrentFrame();
	if (frame > 5) return null;
	const k = 1 - frame / 5;
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<AbsoluteFill style={{background: 'white', opacity: frame < 2 ? 0.45 : 0}} />
			{Array.from({length: 6}).map((_, i) => (
				<div key={i} style={{position: 'absolute', left: (random(`x${i}${frame}`) - 0.5) * 300 * k, top: random(`y${i}${frame}`) * 1920, width: 1080, height: 20 + random(`h${i}${frame}`) * 90, background: [C.cyan, C.pink, C.yellow][i % 3], opacity: 0.5 * k, mixBlendMode: 'screen'}} />
			))}
		</AbsoluteFill>
	);
};
