import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {BAR_H, cine, fadeInOut, IMG_H, tracking} from './Filme';

// Gramática de cinema do ZoneGTA6: cada plano pode usar uma técnica diferente.
// Recortes dos assuntos (public/media/cut/<nome>_cut.png) vêm de scripts/plates.py.

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeInOut = (t: number) => t * t * (3 - 2 * t);
const cutOf = (file: string) => `media/cut/${file.replace(/\.jpg$/, '')}_cut.png`;

// Janela de cinema. Com `open`, as faixas pretas recolhem e a imagem toma a tela inteira
// (mudança de proporção, usada nos momentos grandes).
const Window: React.FC<{dur: number; open?: boolean; fade?: boolean; children: React.ReactNode}> = ({dur, open, fade = true, children}) => {
	const frame = useCurrentFrame();
	const o = open ? interpolate(frame, [4, 26], [0, 1], {...clamp, easing: easeInOut}) : 0;
	const h = IMG_H + (1920 - IMG_H) * o;
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: (1920 - h) / 2, height: h, overflow: 'hidden', opacity: fade ? fadeInOut(frame, dur, 7) : 1}}>
			{children}
			<AbsoluteFill style={{background: 'linear-gradient(180deg, #0a2a3a, #3a1a05)', mixBlendMode: 'soft-light', opacity: 0.38}} />
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />
		</div>
	);
};

export const Caption: React.FC<{text: string; dur: number; low?: boolean}> = ({text, dur, low}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: low ? 1560 : BAR_H + IMG_H + 44, textAlign: 'center', opacity: fadeInOut(frame, dur, 10)}}>
			<div style={{height: 2, width: 120, background: '#c9a86a', margin: '0 auto 18px'}} />
			<div style={{fontFamily: cine, fontWeight: 700, fontSize: text.length > 20 ? 42 : 52, color: '#f1ece4', letterSpacing: tracking(frame, dur, 6, 11), padding: '0 40px', textShadow: '0 4px 20px #000'}}>{text}</div>
		</div>
	);
};

// 2.5D: fundo desfocando devagar (troca de foco) e assunto nítido na frente, se
// aproximando mais rápido que o fundo. `dolly` faz o efeito vertigo: o fundo se afasta
// enquanto o assunto se aproxima.
export const Layered: React.FC<{file: string; focus: number; dur: number; mode: 'parallax' | 'dolly'; open?: boolean; caption?: string | null}> = ({file, focus, dur, mode, open, caption}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [0, dur], [0, 1], {...clamp, easing: easeInOut});
	const pos = `${focus * 100}% 50%`;
	const bgScale = mode === 'dolly' ? 1.28 - 0.24 * p : 1.04 + 0.05 * p;
	const fgScale = mode === 'dolly' ? 1.0 + 0.1 * p : 1.05 + 0.12 * p;
	const rack = mode === 'dolly' ? 2 + 4 * p : 7 * p;
	const style: React.CSSProperties = {position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transformOrigin: pos};
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Window dur={dur} open={open}>
				<Img src={staticFile(`media/${file}`)} style={{...style, transform: `scale(${bgScale}) translateX(${(0.5 - p) * 1.4}%)`, filter: `blur(${rack}px) brightness(${0.95 - 0.15 * p}) contrast(1.05)`}} />
				<Img src={staticFile(cutOf(file))} style={{...style, transform: `scale(${fgScale}) translateX(${(p - 0.5) * 1.0}%)`, filter: 'contrast(1.1) saturate(1.0) drop-shadow(0 20px 40px rgba(0,0,0,0.6))'}} />
			</Window>
			{caption ? <Caption text={caption} dur={dur} low={open} /> : null}
		</AbsoluteFill>
	);
};

// Chicote de câmera: o plano entra varrendo de lado com rastro de movimento.
export const Whip: React.FC<{file: string; focus: number; dur: number; dir?: 1 | -1; caption?: string | null}> = ({file, focus, dur, dir = 1, caption}) => {
	const frame = useCurrentFrame();
	const w = interpolate(frame, [0, 8], [1, 0], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Window dur={dur} fade={false}>
				<Img
					src={staticFile(`media/${file}`)}
					style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${focus * 100}% 50%`, transform: `translateX(${dir * w * 70}%) scale(${1.06 + frame * 0.0006})`, filter: `blur(${w * 28}px) contrast(1.08)`}}
				/>
			</Window>
			{caption ? <Caption text={caption} dur={dur} /> : null}
		</AbsoluteFill>
	);
};

// Tela dividida em três: cada painel entra no momento em que é citado.
export const Triptych: React.FC<{panels: Array<{file: string; focus: number; label: string; at: number}>; dur: number}> = ({panels, dur}) => {
	const frame = useCurrentFrame();
	const H = 1180;
	return (
		<AbsoluteFill style={{background: '#000', opacity: interpolate(frame, [dur - 8, dur], [1, 0], clamp)}}>
			<div style={{position: 'absolute', left: 30, right: 30, top: (1920 - H) / 2, height: H, display: 'flex', gap: 14}}>
				{panels.map((pn, i) => {
					const p = interpolate(frame, [pn.at, pn.at + 12], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
					const flash = frame >= pn.at && frame < pn.at + 3 ? 1 - (frame - pn.at) / 3 : 0;
					return (
						<div key={i} style={{flex: 1, position: 'relative', overflow: 'hidden', opacity: p, transform: `translateY(${(1 - p) * (i % 2 ? -120 : 120)}px)`, border: '1px solid rgba(201,168,106,0.5)'}}>
							<Img src={staticFile(`media/${pn.file}`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${pn.focus * 100}% 50%`, transform: `scale(${1.15 - 0.08 * p + Math.max(0, frame - pn.at) * 0.0007})`, filter: 'contrast(1.08)'}} />
							<AbsoluteFill style={{background: 'linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.85))'}} />
							<AbsoluteFill style={{background: '#fff', opacity: flash * 0.7}} />
							<div style={{position: 'absolute', left: 0, right: 0, bottom: 34, textAlign: 'center', fontFamily: cine, fontWeight: 700, fontSize: 40, color: '#f1ece4', letterSpacing: 3}}>{pn.label}</div>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

// ── Transições e efeitos de lente (sobrepostos, por cima de tudo) ──

// Vazamento de luz: manchas quentes atravessando a tela num corte.
export const LightLeak: React.FC<{len?: number}> = ({len = 26}) => {
	const frame = useCurrentFrame();
	const p = frame / len;
	const o = Math.sin(Math.min(1, p) * Math.PI);
	return (
		<AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen', opacity: o * 0.85}}>
			<div style={{position: 'absolute', width: 1400, height: 1400, left: -400 + p * 900, top: 200 + p * 300, background: 'radial-gradient(circle, rgba(255,140,40,0.9) 0%, rgba(255,60,100,0.5) 35%, transparent 65%)'}} />
			<div style={{position: 'absolute', width: 900, height: 900, left: 500 - p * 600, top: 900 - p * 400, background: 'radial-gradient(circle, rgba(255,220,150,0.8) 0%, transparent 60%)'}} />
		</AbsoluteFill>
	);
};

// Queima de película: a imagem estoura em branco-alaranjado e cai no preto.
export const FilmBurn: React.FC<{len?: number}> = ({len = 22}) => {
	const frame = useCurrentFrame();
	const up = interpolate(frame, [0, len * 0.55], [0, 1], clamp);
	const down = interpolate(frame, [len * 0.55, len], [1, 0], clamp);
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<AbsoluteFill style={{background: `radial-gradient(circle at ${40 + random('fb') * 20}% 45%, #fff6e0 0%, #ffb45a ${20 + up * 40}%, #a2300a ${45 + up * 40}%, transparent ${70 + up * 40}%)`, opacity: up * down, mixBlendMode: 'screen'}} />
			<AbsoluteFill style={{background: '#000', opacity: frame > len * 0.55 ? down * 0.6 : 0}} />
		</AbsoluteFill>
	);
};

// Reflexo anamórfico: um traço horizontal de luz azulada cruzando a tela.
export const Flare: React.FC<{y?: number; len?: number}> = ({y = 960, len = 30}) => {
	const frame = useCurrentFrame();
	const p = frame / len;
	const o = Math.sin(Math.min(1, p) * Math.PI);
	return (
		<AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen', opacity: o}}>
			<div style={{position: 'absolute', left: -200, right: -200, top: y - 3, height: 6, background: 'linear-gradient(90deg, transparent, rgba(120,190,255,0.9), #fff, rgba(120,190,255,0.9), transparent)', filter: 'blur(2px)', transform: `translateX(${(p - 0.5) * 300}px)`}} />
			<div style={{position: 'absolute', left: `${20 + p * 60}%`, top: y - 160, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(120,190,255,0.35) 25%, transparent 60%)'}} />
		</AbsoluteFill>
	);
};
