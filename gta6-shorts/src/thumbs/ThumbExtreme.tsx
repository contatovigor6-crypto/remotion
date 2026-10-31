import React from 'react';
import {AbsoluteFill, Img, random, staticFile} from 'remotion';
import {WATERMARK} from '../brand';
import {C, DISPLAY, GRAD, UI} from '../theme';

// ZONEGTA6 — EXTREME CLICK THUMBNAIL SYSTEM (1280×720): um foco dominante (personagem oficial em primeiro plano),
// luz cinematográfica + partículas, texto de 2–5 palavras com uma palavra em destaque, logo original sempre exposta.

const Dust: React.FC<{seed: string; n: number; x0: number; x1: number}> = ({seed, n, x0, x1}) => (
	<>
		{Array.from({length: n}).map((_, i) => {
			const x = x0 + random(`${seed}x${i}`) * (x1 - x0);
			const y = random(`${seed}y${i}`) * 720;
			const r = 1.5 + random(`${seed}r${i}`) * 4.5;
			const o = 0.25 + random(`${seed}o${i}`) * 0.6;
			return <div key={i} style={{position: 'absolute', left: x, top: y, width: r * 2, height: r * 2, borderRadius: r, background: 'rgba(255,240,220,1)', opacity: o, filter: `blur(${r > 4 ? 2 : 0.6}px)`, boxShadow: '0 0 8px rgba(255,220,180,0.8)'}} />;
		})}
	</>
);

const Logo: React.FC<{side: 'left' | 'right'}> = ({side}) =>
	WATERMARK === null ? null : (
		<div style={{position: 'absolute', top: 26, [side]: 30, padding: 5, borderRadius: 26, background: GRAD, boxShadow: '0 0 34px rgba(255,62,154,0.75), 0 10px 24px rgba(0,0,0,0.7)'}}>
			<Img src={staticFile(WATERMARK)} style={{display: 'block', width: 128, height: 128, borderRadius: 22}} />
		</div>
	);

/** "Os interiores de GTA 6": Jason entrando no 24/7 (screenshot oficial, Edge 430) — "10X MAIS INTERIORES" */
export const ThumbExtremeInteriores: React.FC = () => (
	<AbsoluteFill style={{background: '#05040a', overflow: 'hidden'}}>
		<Img src={staticFile('v10/jason-247.jpg')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.32)', transformOrigin: '22% 38%', filter: 'contrast(1.18) saturate(1.25) brightness(1.02)'}} />
		{/* separação: escurece o fundo à direita para o texto, luz quente atrás do personagem */}
		<AbsoluteFill style={{background: 'linear-gradient(270deg, rgba(5,4,10,0.96) 0%, rgba(5,4,10,0.85) 34%, rgba(5,4,10,0.15) 62%, rgba(5,4,10,0) 75%)'}} />
		<AbsoluteFill style={{background: 'radial-gradient(ellipse at 28% 40%, rgba(255,170,90,0.0) 0%, rgba(255,170,90,0) 30%, rgba(0,0,0,0.55) 85%)'}} />
		<AbsoluteFill style={{background: 'linear-gradient(115deg, rgba(56,225,255,0.22) 0%, rgba(56,225,255,0) 30%)', mixBlendMode: 'screen'}} />
		<Dust seed="int" n={46} x0={0} x1={720} />
		<AbsoluteFill style={{boxShadow: 'inset 0 0 180px rgba(0,0,0,0.85)'}} />
		<div style={{position: 'absolute', right: 46, top: 175, textAlign: 'right'}}>
			<div style={{fontFamily: DISPLAY, fontSize: 250, lineHeight: 0.92, backgroundImage: `linear-gradient(180deg, ${C.yellow}, ${C.orange})`, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 10px 0 #000) drop-shadow(0 0 30px rgba(255,180,60,0.45))'}}>10X</div>
			<div style={{fontFamily: DISPLAY, fontSize: 96, color: 'white', lineHeight: 1.0, textShadow: '0 7px 0 #000'}}>MAIS</div>
			<div style={{fontFamily: DISPLAY, fontSize: 104, color: 'white', lineHeight: 1.0, textShadow: '0 7px 0 #000', whiteSpace: 'nowrap'}}>INTERIORES</div>
		</div>
		<Logo side="right" />
		<div style={{position: 'absolute', right: 46, bottom: 16, fontFamily: UI, fontWeight: 800, fontSize: 15, color: 'rgba(255,255,255,0.6)', letterSpacing: 2}}>IMAGEM OFICIAL: ROCKSTAR GAMES</div>
	</AbsoluteFill>
);
