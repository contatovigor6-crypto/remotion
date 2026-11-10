import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame} from 'remotion';
import {At} from '../components/Overlays';
import {ProOutro} from '../components/ProOutro';
import {C, DISPLAY, UI, f} from '../theme';

// "GTA 6 Gold" em MOTION DESIGN: cenário neon (Vice City) + tipografia cinética + objetos 3D em CSS.
// Tudo é ilustração; as únicas imagens do jogo aparecem dentro de formas (cena final). Sem números inventados.

const GOLD = 'linear-gradient(180deg, #FFF6C2 0%, #FFD24A 38%, #E09A00 68%, #FFE680 100%)';
const PINK = '#FF3E9A';
const PURPLE = '#7B3CFF';
const CYAN = '#38E1FF';
const GREEN = '#3DFF8A';
const fr = () => useCurrentFrame();
const sp = (frame: number, at: number, d = 12, s = 260) => spring({frame: frame - f(at), fps: 30, config: {damping: d, stiffness: s}});
const lerp = (frame: number, a: number, b: number, o0: number, o1: number, ease = Easing.out(Easing.cubic)) => interpolate(frame, [f(a), f(b)], [o0, o1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

/* ---------------------------------------------------------------- fundo vivo */
const Backdrop: React.FC = () => {
	const frame = fr();
	const t = frame / 30;
	const hue = Math.sin(t / 6) * 10;
	return (
		<AbsoluteFill style={{background: '#07040f', overflow: 'hidden'}}>
			{/* céu em degradê pôr do sol de Vice City */}
			<AbsoluteFill style={{background: `linear-gradient(180deg, #0b0520 0%, #2a0b4a 38%, #8a1f6b 58%, #ff7a3c 72%, #0b0418 72.2%)`, filter: `hue-rotate(${hue}deg)`}} />
			{/* sol listrado */}
			<div style={{position: 'absolute', left: 540 - 300, top: 1380 - 600, width: 600, height: 600, borderRadius: 300, background: 'linear-gradient(180deg, #FFE680 0%, #FF9A3C 50%, #FF3E9A 100%)', boxShadow: '0 0 160px rgba(255,120,80,0.6)', maskImage: 'repeating-linear-gradient(180deg, #000 0px, #000 28px, transparent 28px, transparent 40px)', WebkitMaskImage: 'linear-gradient(180deg, #000 55%, transparent 55%), repeating-linear-gradient(180deg, #000 0px, #000 26px, transparent 26px, transparent 38px)', opacity: 0.9}} />
			{/* chão em perspectiva (grade synthwave desenhada em SVG) */}
			<svg width={1080} height={540} style={{position: 'absolute', left: 0, top: 1382}}>
				{Array.from({length: 23}).map((_, i) => {
					const x = -1100 + i * 150;
					return <line key={`v${i}`} x1={540} y1={0} x2={x} y2={540} stroke={PINK} strokeWidth={3} opacity={0.65} />;
				})}
				{Array.from({length: 12}).map((_, i) => {
					const p = ((i + (frame % 30) / 30) / 12);
					const y = Math.pow(p, 2.2) * 540;
					return <line key={`h${i}`} x1={0} y1={y} x2={1080} y2={y} stroke={PINK} strokeWidth={2 + p * 3} opacity={0.25 + p * 0.6} />;
				})}
			</svg>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1382, height: 540, background: 'linear-gradient(180deg, rgba(255,62,154,0.25) 0%, rgba(7,4,15,0) 40%)'}} />
			{/* skyline em silhueta */}
			<svg width={1080} height={300} style={{position: 'absolute', left: 0, top: 1090}}>
				<path d="M0 300 L0 210 L60 210 L60 150 L110 150 L110 230 L170 230 L170 90 L230 90 L230 200 L290 200 L290 130 L330 130 L330 60 L370 60 L370 180 L430 180 L430 110 L500 110 L500 230 L560 230 L560 40 L610 40 L610 170 L670 170 L670 120 L730 120 L730 210 L790 210 L790 80 L840 80 L840 190 L900 190 L900 140 L960 140 L960 220 L1020 220 L1020 170 L1080 170 L1080 300 Z" fill="#12061f" />
			</svg>
			{/* partículas douradas */}
			{Array.from({length: 60}).map((_, i) => {
				const x = random(`px${i}`) * 1080;
				const speed = 20 + random(`ps${i}`) * 60;
				const y = 1920 - ((t * speed + random(`py${i}`) * 1920) % 2000);
				const r = 1.5 + random(`pr${i}`) * 3.5;
				return <div key={i} style={{position: 'absolute', left: x + Math.sin(t + i) * 12, top: y, width: r * 2, height: r * 2, borderRadius: r, background: i % 4 ? '#FFD24A' : PINK, opacity: 0.55, boxShadow: `0 0 10px ${i % 4 ? '#FFD24A' : PINK}`}} />;
			})}
			{/* leve vinheta superior para a logo e textos */}
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(7,4,15,0.85) 0%, rgba(7,4,15,0) 22%)'}} />
		</AbsoluteFill>
	);
};


/* ---------------------------------------------------------------- fundos por cena (um cenário diferente em cada) */
const BgCityRain: React.FC = () => {
	const frame = fr();
	return (
		<AbsoluteFill style={{background: 'linear-gradient(180deg, #02030c 0%, #081a3a 55%, #0d0620 100%)', overflow: 'hidden'}}>
			{Array.from({length: 14}).map((_, i) => {
				const w = 60 + random(`bw${i}`) * 90;
				const h = 500 + random(`bh${i}`) * 900;
				const x = i * 80 - 30;
				return (
					<div key={i} style={{position: 'absolute', left: x, bottom: 0, width: w, height: h, background: '#070b1d', boxShadow: '0 0 0 2px #0e1636'}}>
						{Array.from({length: 18}).map((__, k) => (
							<div key={k} style={{position: 'absolute', left: 8 + (k % 3) * (w / 3.2), top: 20 + Math.floor(k / 3) * 70, width: 12, height: 22, background: random(`win${i}-${k}-${Math.floor(frame / 40)}`) > 0.55 ? (k % 2 ? '#FFD24A' : '#38E1FF') : 'transparent', opacity: 0.7}} />
						))}
					</div>
				);
			})}
			{Array.from({length: 90}).map((_, i) => {
				const x = (random(`rx${i}`) * 1300 + frame * 6) % 1300 - 110;
				const y = (random(`ry${i}`) * 2100 + frame * 46) % 2100 - 100;
				return <div key={i} style={{position: 'absolute', left: x, top: y, width: 2, height: 46, background: 'rgba(170,210,255,0.45)', transform: 'rotate(12deg)'}} />;
			})}
		</AbsoluteFill>
	);
};
const BgTech: React.FC = () => {
	const frame = fr();
	const scan = (frame * 14) % 2100 - 100;
	return (
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #0a2a4a 0%, #020814 70%)', overflow: 'hidden'}}>
			<AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(56,225,255,0.12) 2px, transparent 2px), linear-gradient(90deg, rgba(56,225,255,0.12) 2px, transparent 2px)', backgroundSize: '90px 90px', backgroundPosition: `${frame % 90}px ${(frame * 2) % 90}px`}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: scan, height: 120, background: 'linear-gradient(180deg, rgba(56,225,255,0), rgba(56,225,255,0.25), rgba(56,225,255,0))'}} />
			{Array.from({length: 20}).map((_, i) => (
				<div key={i} style={{position: 'absolute', left: random(`nx${i}`) * 1080, top: random(`ny${i}`) * 1920, width: 10, height: 10, borderRadius: 5, background: CYAN, opacity: 0.4 + 0.4 * Math.sin(frame / 8 + i), boxShadow: `0 0 16px ${CYAN}`}} />
			))}
		</AbsoluteFill>
	);
};
const BgGoldBurst: React.FC = () => {
	const frame = fr();
	return (
		<AbsoluteFill style={{background: '#140a00', overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: 540 - 1600, top: 680 - 1600, width: 3200, height: 3200, background: 'repeating-conic-gradient(from 0deg, rgba(255,210,74,0.32) 0deg 8deg, rgba(0,0,0,0) 8deg 20deg)', transform: `rotate(${frame * 0.8}deg)`}} />
			<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 35%, rgba(255,230,128,0.55) 0%, rgba(224,154,0,0.25) 30%, rgba(20,10,0,0.95) 70%)'}} />
		</AbsoluteFill>
	);
};
const BgMarket: React.FC = () => {
	const frame = fr();
	return (
		<AbsoluteFill style={{background: 'linear-gradient(180deg, #021a0e 0%, #03100a 100%)', overflow: 'hidden'}}>
			<AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(61,255,138,0.08) 2px, transparent 2px)', backgroundSize: '100% 120px'}} />
			{Array.from({length: 26}).map((_, i) => {
				const up = random(`cu${i}`) > 0.3;
				const h = 60 + random(`ch${i}`) * 260;
				const x = ((i * 70 - frame * 3) % 1820 + 1820) % 1820 - 140;
				const y = 1500 - i * 30 - random(`cy${i}`) * 120;
				return (
					<div key={i} style={{position: 'absolute', left: x, top: y - h, width: 30, height: h, background: up ? 'rgba(61,255,138,0.35)' : 'rgba(255,45,61,0.3)', borderRadius: 4}}>
						<div style={{position: 'absolute', left: 13, top: -40, width: 4, height: h + 80, background: up ? 'rgba(61,255,138,0.35)' : 'rgba(255,45,61,0.3)'}} />
					</div>
				);
			})}
		</AbsoluteFill>
	);
};
const BgCasino: React.FC = () => {
	const frame = fr();
	return (
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #5a0010 0%, #1a0006 75%)', overflow: 'hidden'}}>
			{Array.from({length: 26}).map((_, i) => {
				const r = 40 + random(`br${i}`) * 110;
				return <div key={i} style={{position: 'absolute', left: random(`bx${i}`) * 1080 - r, top: random(`by${i}`) * 1920 - r + Math.sin(frame / 30 + i) * 30, width: r * 2, height: r * 2, borderRadius: r, background: i % 3 ? 'rgba(255,210,74,0.18)' : 'rgba(255,62,154,0.2)', filter: 'blur(14px)'}} />;
			})}
			{Array.from({length: 24}).map((_, i) => (
				<div key={`l${i}`} style={{position: 'absolute', left: 40 + (i % 12) * 90, top: i < 12 ? 250 : 1700, width: 22, height: 22, borderRadius: 11, background: (Math.floor(frame / 5) + i) % 2 ? '#FFD24A' : '#5a3a00', boxShadow: (Math.floor(frame / 5) + i) % 2 ? '0 0 20px #FFD24A' : 'none'}} />
			))}
		</AbsoluteFill>
	);
};
const BgIce: React.FC = () => {
	const frame = fr();
	return (
		<AbsoluteFill style={{background: 'linear-gradient(180deg, #0a2a44 0%, #0d4a6e 50%, #a8e6ff 120%)', overflow: 'hidden'}}>
			{Array.from({length: 70}).map((_, i) => {
				const x = random(`sx${i}`) * 1080 + Math.sin(frame / 20 + i) * 30;
				const y = (random(`sy${i}`) * 2000 + frame * (2 + random(`ss${i}`) * 4)) % 2000 - 40;
				const r = 2 + random(`sr${i}`) * 5;
				return <div key={i} style={{position: 'absolute', left: x, top: y, width: r * 2, height: r * 2, borderRadius: r, background: 'white', opacity: 0.8}} />;
			})}
			<AbsoluteFill style={{boxShadow: 'inset 0 0 180px rgba(220,245,255,0.55)'}} />
		</AbsoluteFill>
	);
};
const BgTunnel: React.FC = () => {
	const frame = fr();
	return (
		<AbsoluteFill style={{background: '#04020a', overflow: 'hidden'}}>
			{Array.from({length: 12}).map((_, i) => {
				const k = ((i + frame / 18) % 12) / 12;
				const sz = 80 + Math.pow(k, 2) * 2600;
				return <div key={i} style={{position: 'absolute', left: 540 - sz / 2, top: 760 - sz / 2, width: sz, height: sz, border: `${2 + k * 8}px solid ${i % 2 ? GREEN : PURPLE}`, borderRadius: 40, opacity: 0.15 + k * 0.6, transform: `rotate(${k * 30}deg)`}} />;
			})}
		</AbsoluteFill>
	);
};
const BgBlueprint: React.FC = () => {
	const frame = fr();
	return (
		<AbsoluteFill style={{background: '#0b2e6b', overflow: 'hidden'}}>
			<AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '200px 200px, 200px 200px, 40px 40px, 40px 40px'}} />
			{[0, 1, 2].map((i) => (
				<svg key={i} width={500} height={500} viewBox="-50 -50 100 100" style={{position: 'absolute', left: [-120, 700, 150][i], top: [1350, 200, 1600][i], opacity: 0.25, transform: `rotate(${frame * (i % 2 ? -1 : 1) * 1.5}deg)`}}>
					{Array.from({length: 12}).map((_, k) => (
						<rect key={k} x={-6} y={-50} width={12} height={18} fill="none" stroke="white" strokeWidth={1.2} transform={`rotate(${k * 30})`} />
					))}
					<circle r={34} fill="none" stroke="white" strokeWidth={1.2} />
					<circle r={10} fill="none" stroke="white" strokeWidth={1.2} />
				</svg>
			))}
		</AbsoluteFill>
	);
};
const BgGalaxy: React.FC = () => {
	const frame = fr();
	return (
		<AbsoluteFill style={{background: 'radial-gradient(ellipse at 30% 30%, #3b1170 0%, #12052a 45%, #03010a 100%)', overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: 300, top: 600, width: 900, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,62,154,0.35), rgba(0,0,0,0) 70%)', filter: 'blur(30px)', transform: `rotate(${frame * 0.2}deg)`}} />
			{Array.from({length: 140}).map((_, i) => {
				const r = 1 + random(`gr${i}`) * 2.5;
				return <div key={i} style={{position: 'absolute', left: random(`gx${i}`) * 1080, top: random(`gy${i}`) * 1920, width: r * 2, height: r * 2, borderRadius: r, background: 'white', opacity: 0.3 + 0.7 * Math.abs(Math.sin(frame / 15 + i))}} />;
			})}
		</AbsoluteFill>
	);
};

/* ---------------------------------------------------------------- peças reutilizáveis */
const GoldText: React.FC<{size: number; children: React.ReactNode; style?: React.CSSProperties}> = ({size, children, style}) => (
	<span style={{fontFamily: DISPLAY, fontSize: size, lineHeight: 1, backgroundImage: GOLD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 8px 0 #000) drop-shadow(0 0 24px rgba(255,200,0,0.45))', ...style}}>{children}</span>
);

/** disco 3D (CSS) com face dourada, borda e brilho que varre */
const Disc3D: React.FC<{size: number; rotY: number; rotX?: number; label?: string}> = ({size, rotY, rotX = 12, label = 'GOLD'}) => {
	const frame = fr();
	const shine = ((frame * 9) % 400) - 100;
	const face = (back: boolean) => (
		<div style={{position: 'absolute', inset: 0, borderRadius: size / 2, background: `conic-gradient(from ${frame * 3}deg, #FFF6C2, #E09A00, #FFE680, #B87A00, #FFF6C2)`, transform: `translateZ(${back ? -10 : 10}px) ${back ? 'rotateY(180deg)' : ''}`, backfaceVisibility: 'hidden', overflow: 'hidden', boxShadow: 'inset 0 0 40px rgba(120,70,0,0.6)'}}>
			<div style={{position: 'absolute', top: 0, bottom: 0, left: `${shine}%`, width: '30%', background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.75), rgba(255,255,255,0))', transform: 'skewX(-20deg)'}} />
			{Array.from({length: 6}).map((_, k) => (
				<div key={k} style={{position: 'absolute', inset: size * (0.08 + k * 0.06), borderRadius: '50%', border: '1px solid rgba(120,70,0,0.25)'}} />
			))}
			<div style={{position: 'absolute', left: '50%', top: '50%', width: size * 0.26, height: size * 0.26, marginLeft: -size * 0.13, marginTop: -size * 0.13, borderRadius: '50%', background: '#0b0612', border: `${size * 0.03}px solid #FFE680`}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: size * 0.17, textAlign: 'center', fontFamily: DISPLAY, fontSize: size * 0.12, color: 'rgba(90,50,0,0.75)', letterSpacing: size * 0.01}}>{label}</div>
		</div>
	);
	return (
		<div style={{width: size, height: size, perspective: 1400}}>
			<div style={{position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`}}>
				{face(false)}
				{face(true)}
				{/* espessura */}
				{Array.from({length: 8}).map((_, k) => (
					<div key={k} style={{position: 'absolute', inset: 0, borderRadius: '50%', border: '6px solid #B87A00', transform: `translateZ(${-9 + k * 2.5}px)`}} />
				))}
			</div>
		</div>
	);
};

/** palavras que "batem" na tela uma a uma */
const Slam: React.FC<{words: {t: string; at: number; gold?: boolean; size?: number}[]; top: number}> = ({words, top}) => {
	const frame = fr();
	return (
		<div style={{position: 'absolute', top, left: 40, right: 40, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 26px'}}>
			{words.map((w, i) => {
				const s = sp(frame, w.at, 9, 320);
				if (frame < f(w.at)) return null;
				const sz = w.size ?? 130;
				return (
					<div key={i} style={{transform: `scale(${interpolate(s, [0, 1], [2.6, 1])}) rotate(${interpolate(s, [0, 1], [i % 2 ? 8 : -8, 0])}deg)`, opacity: interpolate(s, [0, 0.2], [0, 1], {extrapolateRight: 'clamp'})}}>
						{w.gold ? <GoldText size={sz}>{w.t}</GoldText> : <span style={{fontFamily: DISPLAY, fontSize: sz, color: 'white', lineHeight: 1, textShadow: '0 8px 0 #000'}}>{w.t}</span>}
					</div>
				);
			})}
		</div>
	);
};

const Pill: React.FC<{bg: string; color?: string; size?: number; children: React.ReactNode}> = ({bg, color = 'white', size = 40, children}) => (
	<span style={{display: 'inline-block', background: bg, color, fontFamily: UI, fontWeight: 800, fontSize: size, padding: `${size * 0.25}px ${size * 0.6}px`, borderRadius: size * 0.5, boxShadow: '0 10px 0 rgba(0,0,0,0.6)', whiteSpace: 'nowrap'}}>{children}</span>
);

/** transição: faixa diagonal que varre a tela */
const Wipe: React.FC<{color: string}> = ({color}) => {
	const frame = fr();
	const x = interpolate(frame, [0, 10], [-1400, 1400], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
	return <div style={{position: 'absolute', left: x, top: -400, width: 700, height: 2800, background: color, transform: 'rotate(18deg)', boxShadow: `0 0 80px ${color}`}} />;
};

/* ---------------------------------------------------------------- cenas */
// 1) 0–2.5  "GTA 6 finalmente ficou pronto?"
const S1: React.FC = () => {
	const frame = fr();
	const q = sp(frame, 1.75, 7, 260);
	return (
		<AbsoluteFill>
			<Slam top={380} words={[{t: 'GTA 6', at: 0.0, gold: true, size: 190}, {t: 'FINALMENTE', at: 0.95, size: 110}, {t: 'FICOU', at: 1.45, size: 130}, {t: 'PRONTO', at: 1.75, size: 150}]} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 860, textAlign: 'center', opacity: q, transform: `rotate(${interpolate(q, [0, 1], [-200, 0])}deg) scale(${q})`}}>
				<GoldText size={260}>?</GoldText>
			</div>
		</AbsoluteFill>
	);
};

// 2) 2.5–6.4  "a resposta veio ontem... do chefe da dona da Rockstar" — calendário que vira
const S2: React.FC = () => {
	const frame = fr();
	const flip = lerp(frame, 0.9, 1.6, 0, 180, Easing.inOut(Easing.cubic));
	const tag = sp(frame, 2.2);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center'}}>
				<span style={{fontFamily: DISPLAY, fontSize: 96, color: 'white', textShadow: '0 7px 0 #000'}}>A RESPOSTA VEIO</span>
			</div>
			<div style={{position: 'absolute', left: 540 - 220, top: 470, width: 440, height: 440, perspective: 1200}}>
				<div style={{position: 'absolute', inset: 0, borderRadius: 30, background: '#fff', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', overflow: 'hidden'}}>
					<div style={{height: 110, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: UI, fontWeight: 800, fontSize: 46, color: 'white', letterSpacing: 6}}>NOVEMBRO</div>
					<div style={{fontFamily: DISPLAY, fontSize: 250, color: C.ink, textAlign: 'center', lineHeight: 1.25}}>09</div>
				</div>
				{/* folha de cima (dia 10 virando para trás) */}
				<div style={{position: 'absolute', inset: 0, transformOrigin: '50% 0%', transform: `rotateX(${flip}deg)`, transformStyle: 'preserve-3d'}}>
					<div style={{position: 'absolute', inset: 0, borderRadius: 30, background: '#f3f3f3', backfaceVisibility: 'hidden', overflow: 'hidden'}}>
						<div style={{height: 110, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: UI, fontWeight: 800, fontSize: 46, color: 'white', letterSpacing: 6}}>NOVEMBRO</div>
						<div style={{fontFamily: DISPLAY, fontSize: 250, color: C.ink, textAlign: 'center', lineHeight: 1.25}}>10</div>
					</div>
				</div>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1320, textAlign: 'center', opacity: tag, transform: `translateY(${(1 - tag) * 40}px)`}}>
				<Pill bg={C.ink} size={40}>
					👔 DIRETO DO CHEFE DA TAKE-TWO
				</Pill>
			</div>
		</AbsoluteFill>
	);
};

// 3) 6.4–13.4  citação com onda de áudio de "call" e texto revelando
const S3: React.FC = () => {
	const frame = fr();
	const t = 6.4 + frame / 30;
	const quote = 'A ROCKSTAR COMPLETOU O DESENVOLVIMENTO DE GTA VI';
	const n = Math.max(0, Math.min(quote.length, Math.floor((t - 10.4) * 26)));
	const s = sp(frame, 0.1, 13, 240);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', top: 330, left: 60, right: 60, opacity: s, transform: `translateY(${(1 - s) * 80}px)`}}>
				<Pill bg={PURPLE} size={36}>
					📞 REUNIÃO COM INVESTIDORES · TAKE-TWO
				</Pill>
				{/* onda de áudio da ligação */}
				<div style={{display: 'flex', alignItems: 'center', gap: 8, height: 140, marginTop: 24}}>
					{Array.from({length: 38}).map((_, i) => {
						const talk = t > 9.0 && t < 13.0 ? 1 : 0.25;
						const h = 14 + Math.abs(Math.sin(frame / 3 + i * 0.7) * Math.cos(frame / 7 + i)) * 120 * talk;
						return <div key={i} style={{width: 14, height: h, borderRadius: 7, background: i % 3 ? CYAN : PINK, boxShadow: `0 0 12px ${CYAN}`}} />;
					})}
				</div>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 30, color: 'rgba(255,255,255,0.8)', marginTop: 10, letterSpacing: 3}}>STRAUSS ZELNICK · CEO DA TAKE-TWO</div>
				<div style={{fontFamily: DISPLAY, fontSize: 86, color: 'white', lineHeight: 1.08, marginTop: 18, textShadow: '0 6px 0 #000', minHeight: 300}}>
					<span style={{color: '#FFD24A'}}>“</span>
					{quote.slice(0, n)}
					{n > 0 && n < quote.length && Math.floor(frame / 5) % 2 === 0 ? <span style={{color: '#FFD24A'}}>|</span> : null}
					{n >= quote.length ? <span style={{color: '#FFD24A'}}>”</span> : null}
				</div>
			</div>
		</AbsoluteFill>
	);
};

// 4) 13.4–18.9  GOLD: disco 3D gira + anel 100%
const S4: React.FC = () => {
	const frame = fr();
	const intro = sp(frame, 0, 10, 200);
	const rot = interpolate(frame, [0, f(5.5)], [-540, 30], {easing: Easing.out(Easing.cubic)});
	const ring = lerp(frame, 1.0, 3.4, 0, 1);
	const word = sp(frame, 1.4, 9, 320);
	const fin = sp(frame, 2.6, 11, 280);
	const R = 300;
	const C2 = 2 * Math.PI * R;
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 540 - 340, top: 330, width: 680, height: 680, opacity: intro, transform: `scale(${interpolate(intro, [0, 1], [0.3, 1])})`}}>
				<svg width={680} height={680} style={{position: 'absolute', inset: 0, transform: 'rotate(-90deg)'}}>
					<circle cx={340} cy={340} r={R} stroke="rgba(255,255,255,0.15)" strokeWidth={22} fill="none" />
					<circle cx={340} cy={340} r={R} stroke={GREEN} strokeWidth={22} fill="none" strokeDasharray={C2} strokeDashoffset={C2 * (1 - ring)} strokeLinecap="round" style={{filter: `drop-shadow(0 0 14px ${GREEN})`}} />
				</svg>
				<div style={{position: 'absolute', left: 90, top: 90}}>
					<Disc3D size={500} rotY={rot} />
				</div>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1300, textAlign: 'center', opacity: word, transform: `scale(${interpolate(word, [0, 1], [2.4, 1])})`}}>
				<GoldText size={170}>"GOLD"</GoldText>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1500, textAlign: 'center', opacity: fin}}>
				<Pill bg={GREEN} color={C.ink} size={42}>
					✓ VERSÃO FINAL · {Math.round(100 * ring)}%
				</Pill>
			</div>
		</AbsoluteFill>
	);
};

// 5) 18.9–27.6  pré-venda: gráfico neon que rompe a linha da expectativa (sem números)
const S5: React.FC = () => {
	const frame = fr();
	const t = 18.9 + frame / 30;
	const k = interpolate(t, [19.4, 26.6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad)});
	const W = 900;
	const H = 620;
	const pts = Array.from({length: 40}).map((_, i) => {
		const x = i / 39;
		const y = 0.08 + Math.pow(x, 2.4) * 0.95 + Math.sin(i * 1.7) * 0.02;
		return [40 + x * (W - 80), H - 40 - y * (H - 120)] as const;
	});
	const vis = Math.max(2, Math.floor(k * pts.length));
	const d = pts.slice(0, vis).map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
	const head = pts[vis - 1];
	const exp = H - 40 - 0.45 * (H - 120);
	const broke = head[1] < exp;
	const a = sp(frame, 22.4 - 18.9, 10, 300);
	const b = sp(frame, 26.4 - 18.9, 9, 320);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', top: 320, left: 60}}>
				<Pill bg={PINK} size={40}>
					🛒 PRÉ-VENDA DE GTA 6
				</Pill>
			</div>
			<svg width={W} height={H} style={{position: 'absolute', left: 90, top: 420}}>
				<defs>
					<linearGradient id="fillg" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#FFD24A" stopOpacity={0.45} />
						<stop offset="100%" stopColor="#FFD24A" stopOpacity={0} />
					</linearGradient>
				</defs>
				<line x1={40} y1={exp} x2={W - 40} y2={exp} stroke="white" strokeWidth={4} strokeDasharray="18 12" opacity={0.7} />
				<text x={48} y={exp - 14} fill="white" opacity={0.85} fontFamily="Inter, sans-serif" fontWeight={800} fontSize={28}>EXPECTATIVA INICIAL</text>
				<path d={`${d} L${head[0]},${H - 40} L40,${H - 40} Z`} fill="url(#fillg)" />
				<path d={d} stroke="#FFD24A" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{filter: 'drop-shadow(0 0 16px #FFD24A)'}} />
				<circle cx={head[0]} cy={head[1]} r={18} fill="white" style={{filter: 'drop-shadow(0 0 20px white)'}} />
			</svg>
			{broke ? (
				<div style={{position: 'absolute', left: 90 + head[0] - 60, top: 420 + head[1] - 140, fontSize: 90, transform: `rotate(-30deg) scale(${1 + 0.1 * Math.sin(frame / 2)})`}}>🚀</div>
			) : null}
			<div style={{position: 'absolute', left: 60, right: 60, top: 1320, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start'}}>
				<div style={{opacity: a, transform: `translateX(${(1 - a) * -300}px)`}}>
					<Pill bg="#FFD24A" color={C.ink} size={44}>
						📈 MUITO ACIMA DO ESPERADO
					</Pill>
				</div>
				<div style={{opacity: b, transform: `translateX(${(1 - b) * 300}px) skewX(${Math.sin(frame) * (frame % 20 < 3 ? 12 : 0)}deg)`}}>
					<Pill bg={C.red} size={44}>
						🔥 "NÍVEIS SEM PRECEDENTES"
					</Pill>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// 6) 27.6–30.6  máquina caça-níquel que para em ???
const S6: React.FC = () => {
	const frame = fr();
	const s = sp(frame, 0, 11, 260);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', opacity: s}}>
				<span style={{fontFamily: DISPLAY, fontSize: 90, color: 'white', textShadow: '0 6px 0 #000'}}>QUANTAS PRÉ-VENDAS?</span>
			</div>
			<div style={{position: 'absolute', left: 90, right: 90, top: 520, display: 'flex', gap: 18, justifyContent: 'center', padding: 24, borderRadius: 30, background: 'linear-gradient(180deg, #2a0b4a, #12061f)', border: '8px solid #FFD24A', boxShadow: '0 0 50px rgba(255,200,0,0.5)', opacity: s}}>
				{Array.from({length: 4}).map((_, i) => {
					const stop = f(0.6 + i * 0.35);
					const spinning = frame < stop;
					const off = spinning ? (frame * 70 + i * 37) % 200 : 0;
					return (
						<div key={i} style={{width: 170, height: 220, borderRadius: 18, background: 'white', overflow: 'hidden', position: 'relative'}}>
							<div style={{position: 'absolute', left: 0, right: 0, top: -off, textAlign: 'center', fontFamily: DISPLAY, fontSize: 190, lineHeight: '220px', color: spinning ? '#999' : C.red, filter: spinning ? 'blur(6px)' : 'none'}}>
								{spinning ? String((Math.floor(frame / 2) + i * 3) % 10) : '?'}
								<br />
								{spinning ? String((Math.floor(frame / 2) + i * 3 + 1) % 10) : ''}
							</div>
						</div>
					);
				})}
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 860, textAlign: 'center', opacity: sp(frame, 2.0, 9, 320)}}>
				<Pill bg={C.red} size={52}>
					❌ NENHUM NÚMERO REVELADO
				</Pill>
			</div>
		</AbsoluteFill>
	);
};

// 7) 30.6–35.9  "ainda não estão prontos pra declarar VITÓRIA" — palavra congelada/riscada
const S7: React.FC = () => {
	const frame = fr();
	const a = sp(frame, 0.2, 11, 280);
	const v = sp(frame, 2.7, 9, 320);
	const cross = lerp(frame, 4.0, 4.6, 0, 1);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', opacity: a}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 34, color: CYAN, letterSpacing: 6}}>O CHEFE FOI CAUTELOSO</div>
				<div style={{fontFamily: DISPLAY, fontSize: 120, color: 'white', textShadow: '0 7px 0 #000', marginTop: 10}}>"AINDA NÃO"</div>
				<div style={{fontFamily: DISPLAY, fontSize: 80, color: 'white', textShadow: '0 6px 0 #000'}}>VAMOS DECLARAR</div>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 720, textAlign: 'center', opacity: v, transform: `scale(${interpolate(v, [0, 1], [2.2, 1])})`}}>
				<div style={{position: 'relative', display: 'inline-block'}}>
					<GoldText size={190} style={{filter: `drop-shadow(0 8px 0 #000) drop-shadow(0 0 30px rgba(56,225,255,${0.3 + cross * 0.5})) saturate(${1 - cross * 0.7})`}}>VITÓRIA</GoldText>
					<div style={{position: 'absolute', left: -20, top: '50%', height: 22, width: `${cross * 110}%`, background: CYAN, borderRadius: 11, transform: 'rotate(-6deg)', boxShadow: `0 0 20px ${CYAN}`}} />
				</div>
				<div style={{fontSize: 70, marginTop: 8}}>🧊</div>
			</div>
		</AbsoluteFill>
	);
};

// 8) 35.9–42.8  linha do tempo em cartões 3D: 2 adiamentos -> 19/11
const S8: React.FC = () => {
	const frame = fr();
	const cards = [
		{t: 'OUTONO 2025', s: 'ADIADO', c: C.red, at: 0.6},
		{t: 'MAIO 2026', s: 'ADIADO', c: C.red, at: 1.4},
		{t: '19 NOV 2026', s: 'MANTIDO', c: GREEN, at: 4.9},
	];
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center'}}>
				<span style={{fontFamily: DISPLAY, fontSize: 92, color: 'white', textShadow: '0 6px 0 #000'}}>DEPOIS DE 2 ADIAMENTOS…</span>
			</div>
			<div style={{position: 'absolute', left: 80, right: 80, top: 480, perspective: 1400}}>
				{cards.map((c, i) => {
					const s = sp(frame, c.at, 12, 220);
					const last = i === 2;
					const stamp = sp(frame, c.at + 0.4, 9, 320);
					return (
						<div key={i} style={{position: 'relative', height: 190, margin: '22px 0', borderRadius: 26, background: last ? 'linear-gradient(135deg, #0f3d22, #1d7a3f)' : 'rgba(20,8,36,0.92)', border: `5px solid ${c.c}`, transformOrigin: '50% 50%', transform: `rotateX(${interpolate(s, [0, 1], [-95, 0])}deg) scale(${last ? 1 + 0.03 * Math.sin(frame / 5) : 1})`, opacity: s, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 36px', boxShadow: last ? `0 0 60px ${GREEN}88` : 'none'}}>
							<span style={{fontFamily: DISPLAY, fontSize: 84, color: 'white', textDecoration: last ? 'none' : 'line-through', textDecorationColor: C.red, textDecorationThickness: 8}}>{c.t}</span>
							<span style={{fontFamily: DISPLAY, fontSize: 52, color: c.c, border: `5px solid ${c.c}`, borderRadius: 12, padding: '2px 16px', transform: `rotate(-8deg) scale(${interpolate(stamp, [0, 1], [2, 1])})`, opacity: stamp}}>{c.s}</span>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

// 9) 42.8–48.8  engrenagens: gold não é o fim, pode ter atualização no dia 1
const Gear: React.FC<{size: number; rot: number; color: string}> = ({size, rot, color}) => (
	<svg width={size} height={size} viewBox="-50 -50 100 100" style={{transform: `rotate(${rot}deg)`}}>
		{Array.from({length: 10}).map((_, i) => (
			<rect key={i} x={-7} y={-50} width={14} height={20} rx={3} fill={color} transform={`rotate(${i * 36})`} />
		))}
		<circle r={34} fill={color} />
		<circle r={13} fill="#12061f" />
	</svg>
);
const S9: React.FC = () => {
	const frame = fr();
	const s = sp(frame, 0.1, 11, 280);
	const p = sp(frame, 3.8, 9, 320);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 340, textAlign: 'center', opacity: s}}>
				<GoldText size={150}>GOLD</GoldText>
				<span style={{fontFamily: DISPLAY, fontSize: 150, color: 'white', margin: '0 26px', textShadow: '0 8px 0 #000'}}>≠</span>
				<span style={{fontFamily: DISPLAY, fontSize: 150, color: 'white', textShadow: '0 8px 0 #000'}}>FIM</span>
			</div>
			<div style={{position: 'absolute', left: 250, top: 560, opacity: s}}>
				<Gear size={320} rot={frame * 3} color="#FFD24A" />
			</div>
			<div style={{position: 'absolute', left: 520, top: 700, opacity: s}}>
				<Gear size={220} rot={-frame * 4.4 + 18} color={PINK} />
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1330, textAlign: 'center', opacity: p, transform: `scale(${interpolate(p, [0, 1], [1.8, 1])})`}}>
				<Pill bg={CYAN} color={C.ink} size={46}>
					🛠️ ATUALIZAÇÃO NO DIA 1?
				</Pill>
			</div>
		</AbsoluteFill>
	);
};

// 10) 48.8–54.3  contagem com dígito virando 10 -> 9 + enquete com imagem oficial dentro de cartas
const S10: React.FC = () => {
	const frame = fr();
	const flip = lerp(frame, 0.2, 0.8, 0, 180, Easing.inOut(Easing.cubic));
	const poll = sp(frame, 2.0, 11, 280);
	const card = (src: string, label: string, color: string, i: number) => {
		const k = sp(frame, 2.0 + i * 0.3, 11, 280);
		return (
			<div style={{flex: 1, height: 360, borderRadius: 26, overflow: 'hidden', position: 'relative', border: `6px solid ${color}`, boxShadow: `0 0 40px ${color}88`, opacity: k, transform: `translateY(${(1 - k) * 120}px) rotate(${i ? 3 : -3}deg)`}}>
				<Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
				<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 10px', background: 'rgba(7,4,15,0.85)', textAlign: 'center', fontFamily: DISPLAY, fontSize: 46, color: 'white'}}>{label}</div>
			</div>
		);
	};
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 320, textAlign: 'center'}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 32, letterSpacing: 6, color: '#FFD24A'}}>FALTAM</div>
				<div style={{display: 'inline-flex', alignItems: 'center', gap: 20}}>
					<div style={{width: 240, height: 260, perspective: 1000, position: 'relative'}}>
						<div style={{position: 'absolute', inset: 0, borderRadius: 24, background: '#12061f', border: '6px solid #FFD24A', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<GoldText size={220}>9</GoldText>
						</div>
						<div style={{position: 'absolute', inset: 0, transformOrigin: '50% 0%', transform: `rotateX(${flip}deg)`, backfaceVisibility: 'hidden'}}>
							<div style={{position: 'absolute', inset: 0, borderRadius: 24, background: '#12061f', border: '6px solid #FFD24A', display: 'flex', alignItems: 'center', justifyContent: 'center', backfaceVisibility: 'hidden'}}>
								<GoldText size={180}>10</GoldText>
							</div>
						</div>
					</div>
					<span style={{fontFamily: DISPLAY, fontSize: 130, color: 'white', textShadow: '0 8px 0 #000'}}>DIAS</span>
				</div>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', opacity: poll}}>
				<span style={{fontFamily: DISPLAY, fontSize: 64, color: 'white', textShadow: '0 5px 0 #000'}}>VAI QUEBRAR RECORDES?</span>
			</div>
			<div style={{position: 'absolute', left: 70, right: 70, top: 740, display: 'flex', gap: 26}}>
				{card('v16/Jason_Duval_19.jpg', '🏆 SIM', '#FFD24A', 0)}
				{card('v16/Lucia_Caminos_13.jpg', '🤔 NÃO', CYAN, 1)}
			</div>
		</AbsoluteFill>
	);
};

/* ---------------------------------------------------------------- linha do tempo */
const SCENES: [number, number, React.FC, string, React.FC][] = [
	[0, 2.5, S1, PINK, Backdrop],
	[2.5, 6.4, S2, '#FFD24A', BgCityRain],
	[6.4, 13.4, S3, PURPLE, BgTech],
	[13.4, 18.9, S4, '#FFD24A', BgGoldBurst],
	[18.9, 27.6, S5, PINK, BgMarket],
	[27.6, 30.6, S6, C.red, BgCasino],
	[30.6, 35.9, S7, CYAN, BgIce],
	[35.9, 42.8, S8, GREEN, BgTunnel],
	[42.8, 48.8, S9, '#FFD24A', BgBlueprint],
	[48.8, 54.3, S10, PINK, BgGalaxy],
];

export const GoldMotion: React.FC = () => (
	<AbsoluteFill>
		{SCENES.map(([a, b, , , Bg], i) => (
			<At key={`bg${i}`} from={a} to={i === SCENES.length - 1 ? 62.5 : b}>
				<Bg />
			</At>
		))}
		{SCENES.map(([a, b, Scene, col], i) => (
			<At key={i} from={a} to={b}>
				<SceneShell dur={b - a}>
					<Scene />
				</SceneShell>
				{i > 0 ? <Wipe color={col} /> : null}
			</At>
		))}
		<At from={54.3} to={62.5}>
			<ProOutro subAt={1.6} tagline="INVESTIGANDO CADA DETALHE DE GTA 6" />
		</At>
	</AbsoluteFill>
);

/** entrada (zoom/blur) e saída rápidas para cada cena */
const SceneShell: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
	const frame = fr();
	const inn = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const out = interpolate(frame, [f(dur) - 6, f(dur)], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return <AbsoluteFill style={{opacity: Math.min(inn, out), transform: `scale(${interpolate(inn, [0, 1], [1.08, 1])})`, filter: `blur(${(1 - inn) * 8}px)`}}>{children}</AbsoluteFill>;
};
