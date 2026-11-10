import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, random, spring, staticFile, useCurrentFrame} from 'remotion';
import {At} from '../components/Overlays';
import {ProOutro} from '../components/ProOutro';
import {DISPLAY, UI, f} from '../theme';
import {BEATS, ENV} from './envelope';
import {Blimp, CityFly, CoinRain, Court, CYAN, GOLD, LIME, MuralRing, PINK, SignDrop, VIOLET} from './Three';

// "Miami virou Vice City de verdade" — estilo CYBERPUNK: neon, glitch, HUD, scanlines e cenas 3D (three.js).
// Imagens/vídeos oficiais: fundos das rádios de GTA VI (inéditos no canal), clipes oficiais (city-night, skyline, jason-neon) e vc-night.
export const OUTRO_AT = 49.9;
export const END = 59.5;
const RED = '#FF2D55';
const MONO = 'ui-monospace, "DejaVu Sans Mono", monospace';
const fr = () => useCurrentFrame();
const sp = (frame: number, at: number, d = 12, s = 260) => spring({frame: frame - f(at), fps: 30, config: {damping: d, stiffness: s}});
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const energy = (t: number, band = 0) => {
	const i = Math.max(0, Math.min(ENV.length - 1, Math.round(t * 30)));
	return ENV[i] ? ENV[i][band] : 0;
};
const beatPulse = (t: number) => {
	let last = -10;
	for (const b of BEATS) {
		if (b <= t) last = b;
		else break;
	}
	return Math.exp(-(t - last) * 6);
};

/** texto neon com aberração cromática (camadas ciano/magenta deslocadas) */
const Neon: React.FC<{size: number; color?: string; children: React.ReactNode; split?: number; style?: React.CSSProperties; font?: string}> = ({size, color = 'white', children, split = 4, style, font = DISPLAY}) => {
	const base: React.CSSProperties = {fontFamily: font, fontSize: size, lineHeight: 1.02, whiteSpace: 'nowrap'};
	return (
		<span style={{position: 'relative', display: 'inline-block', ...style}}>
			<span style={{...base, position: 'absolute', left: -split, top: 0, color: CYAN, opacity: 0.8, mixBlendMode: 'screen'}}>{children}</span>
			<span style={{...base, position: 'absolute', left: split, top: 0, color: PINK, opacity: 0.8, mixBlendMode: 'screen'}}>{children}</span>
			<span style={{...base, position: 'relative', color, textShadow: `0 0 18px ${color === 'white' ? PINK : color}, 0 6px 0 #000`}}>{children}</span>
		</span>
	);
};
const Tag: React.FC<{color: string; children: React.ReactNode; size?: number; fill?: boolean}> = ({color, children, size = 38, fill}) => (
	<span style={{display: 'inline-block', fontFamily: MONO, fontWeight: 700, fontSize: size, letterSpacing: 2, color: fill ? '#05010f' : color, background: fill ? color : 'rgba(5,1,15,0.82)', border: `3px solid ${color}`, padding: `${size * 0.22}px ${size * 0.5}px`, clipPath: 'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)', boxShadow: `0 0 24px ${color}88`, whiteSpace: 'nowrap'}}>{children}</span>
);
/** cantoneiras de HUD em volta de um retângulo */
const Brackets: React.FC<{x: number; y: number; w: number; h: number; color: string; k?: number}> = ({x, y, w, h, color, k = 1}) => {
	const L = 60;
	const s = (st: React.CSSProperties) => <div style={{position: 'absolute', width: L, height: L, borderColor: color, borderStyle: 'solid', borderWidth: 0, filter: `drop-shadow(0 0 8px ${color})`, ...st}} />;
	const o = (1 - k) * 80;
	return (
		<div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: k}}>
			{s({left: -o, top: -o, borderLeftWidth: 6, borderTopWidth: 6})}
			{s({right: -o, top: -o, borderRightWidth: 6, borderTopWidth: 6})}
			{s({left: -o, bottom: -o, borderLeftWidth: 6, borderBottomWidth: 6})}
			{s({right: -o, bottom: -o, borderRightWidth: 6, borderBottomWidth: 6})}
		</div>
	);
};
/** máquina de escrever */
const typed = (s: string, frame: number, at: number, cps = 26) => s.slice(0, Math.max(0, Math.floor((frame / 30 - at) * cps)));

/* ---------------------------------------------------------------- fundos */
const BgGrid: React.FC<{t0: number; hue?: string}> = ({t0, hue = VIOLET}) => {
	const frame = fr();
	const t = t0 + frame / 30;
	const off = (t * 120) % 80;
	return (
		<AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 30%, ${hue}44 0%, #04000d 70%)`, overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: -540, right: -540, top: 1150, height: 1400, transform: 'perspective(600px) rotateX(62deg)', transformOrigin: '50% 0%', backgroundImage: `linear-gradient(${CYAN}88 2px, transparent 2px), linear-gradient(90deg, ${PINK}88 2px, transparent 2px)`, backgroundSize: '80px 80px', backgroundPosition: `0 ${off}px`}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 1060, height: 120, background: `linear-gradient(180deg, transparent, ${PINK}66, transparent)`, filter: 'blur(20px)'}} />
			{/* chuva de dados */}
			{Array.from({length: 16}).map((_, i) => {
				const x = 40 + i * 66;
				const y = ((t * (160 + random(`r${i}`) * 240) + random(`o${i}`) * 2000) % 2200) - 300;
				return (
					<div key={i} style={{position: 'absolute', left: x, top: y, fontFamily: MONO, fontSize: 24, color: i % 3 ? CYAN : PINK, opacity: 0.28, writingMode: 'vertical-rl', textShadow: `0 0 8px ${CYAN}`}}>
						{'VC0X19FF11A7E2B9C3D8'.slice(i % 6, 14)}
					</div>
				);
			})}
		</AbsoluteFill>
	);
};
/** foto/arte oficial com grade cyberpunk (duotone neon + Ken Burns + linhas de varredura) */
const BgArt: React.FC<{src: string; t0: number; pos?: string; zoom?: number; dim?: number; hue?: string}> = ({src, t0, pos = '50% 50%', zoom = 1.08, dim = 0.55, hue = VIOLET}) => {
	const frame = fr();
	const t = t0 + frame / 30;
	return (
		<AbsoluteFill style={{background: '#04000d', overflow: 'hidden'}}>
			<Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${zoom + frame / 1200 + beatPulse(t) * 0.01})`, filter: `saturate(1.4) contrast(1.15) brightness(${dim + energy(t, 0) * 0.15}) hue-rotate(-8deg)`}} />
			<AbsoluteFill style={{background: `linear-gradient(180deg, ${hue}66 0%, rgba(4,0,13,0.1) 40%, rgba(4,0,13,0.25) 65%, #04000dee 100%)`, mixBlendMode: 'normal'}} />
			<AbsoluteFill style={{background: `linear-gradient(135deg, ${CYAN}22, transparent 50%, ${PINK}33)`, mixBlendMode: 'screen'}} />
		</AbsoluteFill>
	);
};
const BgClip: React.FC<{src: string; t0: number; rate?: number; dim?: number; hue?: string; pos?: string}> = ({src, t0, rate = 1, dim = 0.6, hue = VIOLET, pos = '50% 50%'}) => {
	const frame = fr();
	const t = t0 + frame / 30;
	return (
		<AbsoluteFill style={{background: '#04000d', overflow: 'hidden'}}>
			<OffthreadVideo src={staticFile(src)} muted playbackRate={rate} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${1.06 + beatPulse(t) * 0.012})`, filter: `saturate(1.5) contrast(1.2) brightness(${dim}) hue-rotate(-12deg)`}} />
			<AbsoluteFill style={{background: `linear-gradient(180deg, ${hue}55 0%, transparent 35%, transparent 60%, #04000df0 100%)`}} />
			<AbsoluteFill style={{background: `linear-gradient(135deg, ${CYAN}22, transparent 50%, ${PINK}33)`, mixBlendMode: 'screen'}} />
		</AbsoluteFill>
	);
};

/* ---------------------------------------------------------------- cenas */
// 1) 0–4.25  gancho: cidade neon 3D + MIAMI → VICE CITY
const S1: React.FC = () => {
	const frame = fr();
	const t = frame / 30;
	const swap = t > 1.0;
	const g = t > 0.85 && t < 1.15;
	const k1 = sp(frame, 0.05, 10, 300);
	const k3 = sp(frame, 2.6, 11, 280);
	return (
		<AbsoluteFill>
			<CityFly />
			<div style={{position: 'absolute', left: 0, right: 0, top: 470, textAlign: 'center', transform: `scale(${interpolate(k1, [0, 1], [2.2, 1])}) translateX(${g ? (random(`g${frame}`) - 0.5) * 60 : 0}px)`, opacity: k1}}>
				<div>
					<Neon size={swap ? 150 : 190} color={swap ? PINK : 'white'} split={g ? 18 : 5}>
						{swap ? 'VICE CITY' : 'MIAMI'}
					</Neon>
				</div>
				<div style={{marginTop: 18, opacity: swap ? 1 : 0}}>
					<Tag color={CYAN}>{'> ' + typed('VIROU DE VERDADE', frame, 1.5, 18)}</Tag>
				</div>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1320, textAlign: 'center', opacity: k3, transform: `translateY(${(1 - k3) * 80}px)`}}>
				<Tag color={RED} size={46} fill>
					⚠ NEM TODO MUNDO GOSTOU
				</Tag>
			</div>
		</AbsoluteFill>
	);
};

// 2) 4.25–10.85  letreiro gigante no teto da arena
const S2: React.FC = () => {
	const frame = fr();
	const t0 = 4.25;
	const t = t0 + frame / 30;
	const k = sp(frame, 0.2, 12, 260);
	const lock = sp(frame, 1.0, 14, 240);
	return (
		<AbsoluteFill>
			<SignDrop t0={t0} land={9.4} />
			<div style={{position: 'absolute', left: 60, top: 250, opacity: k}}>
				<Tag color={CYAN}>📍 KASEYA CENTER · MIAMI</Tag>
				<div style={{marginTop: 14}}>
					<Neon size={66} split={3}>ARENA DO MIAMI HEAT</Neon>
				</div>
			</div>
			<Brackets x={110} y={560} w={860} h={430} color={CYAN} k={lock} />
			<div style={{position: 'absolute', left: 120, top: 1000, fontFamily: MONO, fontSize: 26, color: CYAN, opacity: lock * 0.9}}>
				{`ALVO: TETO · ALT ${(48 - Math.min(48, (t - 5) * 10)).toFixed(1)}M`}
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1330, textAlign: 'center', opacity: sp(frame, 4.1, 12, 260)}}>
				<Tag color={PINK} size={44}>
					LETREIRO GIGANTE · ROSA NEON
				</Tag>
			</div>
			<div style={{position: 'absolute', right: 40, bottom: 120, fontFamily: UI, fontSize: 22, color: 'rgba(255,255,255,0.6)'}}>letreiro 3D: ilustração</div>
		</AbsoluteFill>
	);
};

// 3) 10.85–17.5  US$ 975 mil, 25 mil abaixo da votação
const S3: React.FC = () => {
	const frame = fr();
	const t0 = 10.85;
	const t = t0 + frame / 30;
	const v = interpolate(t, [11.8, 13.0], [0, 975], {...clamp, easing: Easing.out(Easing.cubic)});
	const bar = interpolate(t, [11.8, 13.0], [0, 0.975], {...clamp, easing: Easing.out(Easing.cubic)});
	const lim = sp(frame, 14.5 - t0, 12, 240);
	const gap = sp(frame, 14.06 - t0, 9, 320);
	const noVote = sp(frame, 16.3 - t0, 10, 300);
	return (
		<AbsoluteFill>
			<CoinRain t0={t0} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center'}}>
				<Tag color={GOLD}>💰 VALOR DO ACORDO</Tag>
				<div style={{marginTop: 26}}>
					<Neon size={150} color={GOLD} split={4}>{`US$ ${Math.round(v)} MIL`}</Neon>
				</div>
			</div>
			{/* barra até o limite de 1 milhão */}
			<div style={{position: 'absolute', left: 90, right: 90, top: 640}}>
				<div style={{position: 'relative', height: 64, border: `4px solid ${CYAN}`, background: 'rgba(5,1,15,0.8)', boxShadow: `0 0 24px ${CYAN}66`}}>
					<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${bar * 100}%`, background: `linear-gradient(90deg, ${VIOLET}, ${PINK}, ${GOLD})`}} />
					<div style={{position: 'absolute', right: -4, top: -40, bottom: -40, width: 8, background: RED, boxShadow: `0 0 18px ${RED}`, opacity: lim}} />
				</div>
				<div style={{display: 'flex', justifyContent: 'space-between', marginTop: 18, fontFamily: MONO, fontSize: 28, color: 'white'}}>
					<span>US$ 0</span>
					<span style={{color: RED, opacity: lim}}>US$ 1 MILHÃO = VOTAÇÃO</span>
				</div>
				<div style={{marginTop: 34, textAlign: 'right', opacity: gap, transform: `scale(${interpolate(gap, [0, 1], [1.8, 1])})`, transformOrigin: '100% 50%'}}>
					<Tag color={LIME} size={48} fill>
						SÓ US$ 25 MIL ABAIXO
					</Tag>
				</div>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1330, textAlign: 'center', opacity: noVote, transform: `rotate(-4deg) scale(${interpolate(noVote, [0, 1], [2, 1])})`}}>
				<span style={{display: 'inline-block', fontFamily: DISPLAY, fontSize: 84, color: RED, border: `8px solid ${RED}`, padding: '6px 28px 0', background: 'rgba(5,1,15,0.7)', boxShadow: `0 0 30px ${RED}`}}>✕ SEM VOTAÇÃO NO CONDADO</span>
			</div>
		</AbsoluteFill>
	);
};

// 4) 17.5–22.1  a xerife reclamou
const S4: React.FC = () => {
	const frame = fr();
	const t0 = 17.5;
	const t = t0 + frame / 30;
	const k = sp(frame, 0.45, 9, 320);
	const q = sp(frame, 20.0 - t0, 12, 260);
	const quote = '"MIAMI-DADE NÃO É VICE CITY"';
	const blink = Math.floor(t * 4) % 2;
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: blink ? `linear-gradient(90deg, ${RED}55, transparent 60%)` : `linear-gradient(270deg, #2d5bff66, transparent 60%)`}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', opacity: k, transform: `scale(${interpolate(k, [0, 1], [1.6, 1])})`}}>
				<Tag color={RED} size={44} fill>
					🚨 ALERTA · XERIFE DE MIAMI-DADE
				</Tag>
				<div style={{marginTop: 26}}>
					<Neon size={124} split={6}>
						ELA RECLAMOU
					</Neon>
				</div>
			</div>
			<div style={{position: 'absolute', left: 70, right: 70, top: 640, opacity: q, transform: `translateY(${(1 - q) * 60}px)`}}>
				<div style={{background: 'rgba(5,1,15,0.88)', border: `4px solid ${RED}`, padding: '36px 30px', boxShadow: `0 0 40px ${RED}77`, clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)'}}>
					<div style={{fontFamily: DISPLAY, fontSize: 76, color: 'white', lineHeight: 1.08, minHeight: 166}}>{typed(quote, frame, 20.0 - t0, 22)}</div>
					<div style={{marginTop: 18, fontFamily: MONO, fontSize: 28, color: RED}}>— XERIFE ROSIE CORDERO-STUTZ</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// 5a) 22.1–26.6  a Rockstar não parou: dirigível + cadeiras de praia
const S5a: React.FC = () => {
	const frame = fr();
	const t0 = 22.1;
	const k = sp(frame, 0.2, 12, 280);
	const items = [
		{at: 23.96, txt: '🛩️ DIRIGÍVEL NO CÉU', c: CYAN},
		{at: 25.08, txt: '🏖️ CADEIRAS DE PRAIA', c: PINK},
	];
	return (
		<AbsoluteFill>
			<Blimp t0={t0} at={23.96} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center', opacity: k}}>
				<Neon size={96} split={4}>
					A ROCKSTAR NÃO PAROU
				</Neon>
			</div>
			<div style={{position: 'absolute', left: 80, top: 1310, display: 'flex', flexDirection: 'column', gap: 22}}>
				{items.map((it, i) => {
					const s = sp(frame, it.at - t0, 11, 300);
					return (
						<div key={i} style={{opacity: s, transform: `translateX(${(1 - s) * -300}px)`}}>
							<Tag color={it.c} size={46}>
								{it.txt}
							</Tag>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

// 5b) 26.6–29.0  10 murais no Wynwood Walls
const MURALS = ['v26/r-palms.jpg', 'v26/r-chamber.jpg', 'v26/r-flash.jpg', 'v26/r-grill.jpg', 'v26/r-pool.jpg', 'v26/r-afro.jpg', 'v26/r-country.jpg', 'v26/r-palms-wide.jpg', 'v26/r-chamber-wide.jpg', 'v26/r-party.jpg'];
const S5b: React.FC = () => {
	const frame = fr();
	const t0 = 26.6;
	const n = Math.round(interpolate(frame / 30 + t0, [26.86, 27.6], [0, 10], clamp));
	return (
		<AbsoluteFill>
			<MuralRing t0={t0} srcs={MURALS} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 240, textAlign: 'center'}}>
				<Neon size={190} color={LIME} split={6}>{`${n}`}</Neon>
				<div style={{marginTop: -10}}>
					<Neon size={84} split={4}>MURAIS DE GTA 6</Neon>
				</div>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1330, textAlign: 'center', opacity: sp(frame, 28.3 - t0, 12, 280)}}>
				<Tag color={VIOLET} size={46} fill>
					📍 WYNWOOD WALLS
				</Tag>
			</div>
			<div style={{position: 'absolute', right: 40, bottom: 120, fontFamily: UI, fontSize: 22, color: 'rgba(255,255,255,0.6)'}}>painéis: artes oficiais das rádios de GTA VI</div>
		</AbsoluteFill>
	);
};

// 6) 29.0–35.25  The Vault nos telões de Wynwood
const S6: React.FC = () => {
	const frame = fr();
	const t0 = 29.0;
	const t = t0 + frame / 30;
	const on = sp(frame, 30.5 - t0, 14, 200);
	const flick = t > 31.2 && t < 31.6 ? (Math.floor(t * 30) % 3 === 0 ? 0.25 : 1) : 1;
	const first = sp(frame, 33.3 - t0, 10, 300);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 230, textAlign: 'center'}}>
				<Tag color={CYAN}>📺 TELÕES DIGITAIS · WYNWOOD</Tag>
			</div>
			{/* telão 3D inclinado */}
			<div style={{position: 'absolute', left: 90, top: 360, width: 900, height: 620, perspective: 1400}}>
				<div style={{width: '100%', height: '100%', transform: `rotateY(${-18 + Math.sin(t * 0.6) * 4}deg) rotateX(4deg) scale(${interpolate(on, [0, 1], [0.6, 1])})`, opacity: on, border: `10px solid #1b1035`, outline: `3px solid ${PINK}`, boxShadow: `0 0 60px ${PINK}88`, background: '#000', overflow: 'hidden', position: 'relative'}}>
					<OffthreadVideo src={staticFile('v2/jason-neon.mp4')} muted playbackRate={0.5} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55) saturate(1.6) hue-rotate(-20deg)'}} />
					<AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0 3px, transparent 3px 6px)'}} />
					<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: flick}}>
						<div style={{fontFamily: MONO, fontSize: 30, color: CYAN, letterSpacing: 10, textShadow: `0 0 12px ${CYAN}`}}>VICE CITY NIGHTLIFE</div>
						<div style={{fontFamily: DISPLAY, fontSize: 190, color: 'white', letterSpacing: 8, textShadow: `0 0 20px ${PINK}, 0 0 50px ${PINK}, 0 0 90px ${VIOLET}`}}>THE VAULT</div>
					</AbsoluteFill>
				</div>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1310, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
				<div style={{opacity: sp(frame, 32.1 - t0, 12, 280)}}>
					<Tag color={PINK} size={44}>
						🍸 BOATE DE VICE CITY
					</Tag>
				</div>
				<div style={{opacity: first, transform: `scale(${interpolate(first, [0, 1], [1.8, 1])})`}}>
					<Tag color={LIME} size={44} fill>
						NUNCA TINHA APARECIDO NO MARKETING
					</Tag>
				</div>
			</div>
			<div style={{position: 'absolute', right: 40, bottom: 120, fontFamily: UI, fontSize: 22, color: 'rgba(255,255,255,0.6)'}}>telão: ilustração</div>
		</AbsoluteFill>
	);
};

// 7) 35.25–42.55  Miami Heat vira Vice City no dia 18
const S7: React.FC = () => {
	const frame = fr();
	const t0 = 35.25;
	const cal = sp(frame, 37.04 - t0, 10, 300);
	const team = sp(frame, 38.3 - t0, 12, 260);
	const uni = sp(frame, 40.5 - t0, 11, 280);
	return (
		<AbsoluteFill>
			<Court t0={t0} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 230, textAlign: 'center'}}>
				<Tag color={GOLD}>🏀 VÉSPERA DO LANÇAMENTO</Tag>
				<div style={{marginTop: 20, opacity: cal, transform: `scale(${interpolate(cal, [0, 1], [2, 1])})`}}>
					<Neon size={170} color={GOLD} split={5}>
						18/11
					</Neon>
				</div>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', opacity: team}}>
				<span style={{fontFamily: DISPLAY, fontSize: 74, color: 'rgba(255,255,255,0.75)', textDecoration: 'line-through', textDecorationColor: RED, textDecorationThickness: 8}}>MIAMI HEAT</span>
				<span style={{fontFamily: DISPLAY, fontSize: 74, color: CYAN}}> → </span>
				<Neon size={82} color={PINK} split={3}>
					VICE CITY
				</Neon>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1320, textAlign: 'center', opacity: uni, transform: `translateY(${(1 - uni) * 60}px)`}}>
				<Tag color={PINK} size={46} fill>
					QUADRA + UNIFORMES ESPECIAIS
				</Tag>
			</div>
			<div style={{position: 'absolute', right: 40, bottom: 120, fontFamily: UI, fontSize: 22, color: 'rgba(255,255,255,0.6)'}}>quadra 3D: ilustração</div>
		</AbsoluteFill>
	);
};

// 8) 42.55–47.35  o jogo nem saiu e Vice City já existe
const S8: React.FC = () => {
	const frame = fr();
	const t0 = 42.55;
	const t = t0 + frame / 30;
	const a = sp(frame, 43.68 - t0, 12, 260);
	const b = sp(frame, 45.1 - t0, 12, 260);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 260, textAlign: 'center', opacity: a, transform: `scale(${interpolate(a, [0, 1], [1.5, 1])})`}}>
				<Neon size={110} split={5}>
					O JOGO NEM SAIU...
				</Neon>
				<div style={{marginTop: 14}}>
					<Tag color={CYAN}>{`LANÇAMENTO: 19/11 · T-${Math.max(0, 9 - Math.floor((t - 43) / 0.5)) % 10}`}</Tag>
				</div>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1300, textAlign: 'center', opacity: b, transform: `translateY(${(1 - b) * 60}px)`}}>
				<Neon size={78} color={PINK} split={4}>
					VICE CITY JÁ É REAL
				</Neon>
			</div>
		</AbsoluteFill>
	);
};

// 9) 47.35–49.9  enquete
const S9: React.FC = () => {
	const frame = fr();
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center'}}>
				<Neon size={88} split={4}>
					VOCÊ QUERIA ISSO
				</Neon>
				<div>
					<Neon size={118} color={LIME} split={5}>
						NO BRASIL? 🇧🇷
					</Neon>
				</div>
			</div>
			<div style={{position: 'absolute', left: 90, right: 90, top: 690, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30}}>
				{[
					{t: 'SIM', c: LIME},
					{t: 'NÃO', c: RED},
				].map((o, i) => {
					const k = sp(frame, 0.3 + i * 0.2, 10, 300);
					return (
						<div key={o.t} style={{height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(5,1,15,0.88)', border: `6px solid ${o.c}`, boxShadow: `0 0 40px ${o.c}77`, opacity: k, transform: `scale(${interpolate(k, [0, 1], [0.5, 1])})`, clipPath: 'polygon(22px 0, 100% 0, 100% calc(100% - 22px), calc(100% - 22px) 100%, 0 100%, 0 22px)'}}>
							<span style={{fontFamily: DISPLAY, fontSize: 130, color: o.c, textShadow: `0 0 20px ${o.c}`}}>{o.t}</span>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

/* ---------------------------------------------------------------- montagem */
type SceneDef = [number, number, React.FC, string, React.FC<{t0: number}>];
const SCENES: SceneDef[] = [
	[0, 4.25, S1, PINK, ({t0}) => <BgGrid t0={t0} hue={VIOLET} />],
	[4.25, 10.85, S2, CYAN, ({t0}) => <BgClip src="v2/skyline-v.mp4" t0={t0} rate={0.8} dim={0.45} />],
	[10.85, 17.5, S3, GOLD, ({t0}) => <BgGrid t0={t0} hue="#6b4a00" />],
	[17.5, 22.1, S4, RED, ({t0}) => <BgArt src="img/vc-night.jpg" t0={t0} dim={0.4} hue="#5a0018" />],
	[22.1, 26.6, S5a, CYAN, ({t0}) => <BgArt src="v26/r-palms-wide.jpg" t0={t0} pos="30% 50%" zoom={1.0} dim={0.75} hue={VIOLET} />],
	[26.6, 29.0, S5b, VIOLET, ({t0}) => <BgGrid t0={t0} hue={PINK} />],
	[29.0, 35.25, S6, PINK, ({t0}) => <BgArt src="v26/r-party.jpg" t0={t0} pos="50% 50%" dim={0.5} hue={PINK} />],
	[35.25, 42.55, S7, GOLD, ({t0}) => <BgGrid t0={t0} hue="#003a5a" />],
	[42.55, 47.35, S8, CYAN, ({t0}) => <BgClip src="v2/city-night.mp4" t0={t0} rate={0.9} dim={0.55} />],
	[47.35, OUTRO_AT, S9, LIME, ({t0}) => <BgArt src="v26/r-chamber-wide.jpg" t0={t0} pos="70% 50%" dim={0.35} hue={VIOLET} />],
];

/** corte glitch: fatias deslocadas com RGB + flash */
const GlitchCut: React.FC<{color: string}> = ({color}) => {
	const frame = fr();
	if (frame > 9) return null;
	const k = 1 - frame / 9;
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{Array.from({length: 10}).map((_, i) => {
				const y = random(`y${i}-${frame}`) * 1920;
				const h = 20 + random(`h${i}-${frame}`) * 120;
				const x = (random(`x${i}-${frame}`) - 0.5) * 400 * k;
				return <div key={i} style={{position: 'absolute', left: x, top: y, width: 1080, height: h, background: i % 3 === 0 ? color : i % 3 === 1 ? CYAN : PINK, opacity: 0.55 * k, mixBlendMode: 'screen'}} />;
			})}
			<AbsoluteFill style={{background: 'white', opacity: interpolate(frame, [0, 1, 5], [0, 0.5, 0], clamp)}} />
		</AbsoluteFill>
	);
};
const SceneShell: React.FC<{dur: number; t0: number; children: React.ReactNode}> = ({dur, t0, children}) => {
	const frame = fr();
	const t = t0 + frame / 30;
	const inn = interpolate(frame, [0, 7], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const out = interpolate(frame, [f(dur) - 5, f(dur)], [1, 0], clamp);
	const bump = 1 + beatPulse(t) * 0.01;
	return <AbsoluteFill style={{opacity: Math.min(inn, out), transform: `scale(${interpolate(inn, [0, 1], [1.12, 1]) * bump})`, filter: `blur(${(1 - inn) * 8}px)`}}>{children}</AbsoluteFill>;
};
/** camada global cyberpunk: scanlines, vinheta, HUD e ruído */
const CyberFX: React.FC = () => {
	const frame = fr();
	const t = frame / 30;
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 2px, transparent 2px 5px)'}} />
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(4,0,13,0.75) 100%)'}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: ((t * 260) % 2300) - 200, height: 140, background: `linear-gradient(180deg, transparent, ${CYAN}14, transparent)`}} />
			<div style={{position: 'absolute', right: 40, top: 60, fontFamily: MONO, fontSize: 24, color: CYAN, textAlign: 'right', opacity: 0.85, textShadow: `0 0 8px ${CYAN}`}}>
				<span style={{color: RED}}>{Math.floor(t * 2) % 2 ? '●' : '○'}</span> REC · VICE_CITY.LIVE
				<br />
				{`25.7617° N  80.1918° W`}
			</div>
			<div style={{position: 'absolute', left: 40, right: 40, bottom: 60, height: 4, background: 'rgba(255,255,255,0.12)'}}>
				<div style={{width: `${Math.min(1, t / OUTRO_AT) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${CYAN}, ${PINK})`, boxShadow: `0 0 12px ${PINK}`}} />
			</div>
		</AbsoluteFill>
	);
};

export const ViceCityMotion: React.FC = () => (
	<AbsoluteFill>
		{SCENES.map(([a, b, , , Bg], i) => (
			<At key={`bg${i}`} from={a} to={i === SCENES.length - 1 ? END : b}>
				<Bg t0={a} />
			</At>
		))}
		{SCENES.map(([a, b, Scene, col], i) => (
			<At key={i} from={a} to={b}>
				<SceneShell dur={b - a} t0={a}>
					<Scene />
				</SceneShell>
				{i > 0 ? <GlitchCut color={col} /> : null}
			</At>
		))}
		<At from={0} to={OUTRO_AT}>
			<CyberFX />
		</At>
		<At from={OUTRO_AT} to={END}>
			<ProOutro subAt={1.6} tagline="INVESTIGANDO CADA DETALHE DE GTA 6" />
		</At>
	</AbsoluteFill>
);
