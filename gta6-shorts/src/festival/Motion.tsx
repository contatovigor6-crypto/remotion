import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame} from 'remotion';
import {At} from '../components/Overlays';
import {ProOutro} from '../components/ProOutro';
import {C, DISPLAY, UI, f} from '../theme';
import {BEATS, ENV} from './envelope';

// "GTA 6 vai ganhar um FESTIVAL" — motion design caprichado e sincronizado com a música (batidas + energia por banda).
// Imagem oficial NOVA: pôster do "Grand Theft Auto VI: The Festival" (Rockstar Newswire, 09/11/2026), usado em recortes/camadas.

const ART = 'v25/festival.jpg'; // 3840×2160
const PINK = '#FF3E9A';
const CYAN = '#38E1FF';
const YEL = '#FFD84A';
const PURPLE = '#7B3CFF';
const ORANGE = '#FF8A3C';
const GRADT = `linear-gradient(180deg, ${YEL} 0%, ${ORANGE} 45%, ${PINK} 100%)`;
const fr = () => useCurrentFrame();
const sp = (frame: number, at: number, d = 12, s = 260) => spring({frame: frame - f(at), fps: 30, config: {damping: d, stiffness: s}});
const lerp = (frame: number, a: number, b: number, o0: number, o1: number, ease = Easing.out(Easing.cubic)) => interpolate(frame, [f(a), f(b)], [o0, o1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

/** energia da música no tempo absoluto t (s) — banda 0=graves … 3=agudos */
const energy = (t: number, band = 0) => {
	const i = Math.max(0, Math.min(ENV.length - 1, Math.round(t * 30)));
	return ENV[i] ? ENV[i][band] : 0;
};
/** pulso que dispara em cada batida e decai */
const beatPulse = (t: number) => {
	let last = -10;
	for (const b of BEATS) {
		if (b <= t) last = b;
		else break;
	}
	return Math.exp(-(t - last) * 5);
};
const beatIndex = (t: number) => BEATS.filter((b) => b <= t).length;

const Big: React.FC<{size: number; children: React.ReactNode; grad?: boolean; color?: string; style?: React.CSSProperties}> = ({size, children, grad, color = 'white', style}) =>
	grad ? (
		<span style={{fontFamily: DISPLAY, fontSize: size, lineHeight: 1, backgroundImage: GRADT, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 8px 0 #000) drop-shadow(0 0 30px rgba(255,62,154,0.45))', ...style}}>{children}</span>
	) : (
		<span style={{fontFamily: DISPLAY, fontSize: size, lineHeight: 1, color, textShadow: '0 8px 0 #000', ...style}}>{children}</span>
	);
const Pill: React.FC<{bg: string; color?: string; size?: number; children: React.ReactNode}> = ({bg, color = 'white', size = 40, children}) => (
	<span style={{display: 'inline-block', background: bg, color, fontFamily: UI, fontWeight: 800, fontSize: size, padding: `${size * 0.25}px ${size * 0.6}px`, borderRadius: size * 0.5, boxShadow: '0 10px 0 rgba(0,0,0,0.55)', whiteSpace: 'nowrap'}}>{children}</span>
);

/** recorte da arte oficial: mostra a região (x,y,w,h em px da arte 3840×2160) preenchendo o quadro dado */
const ArtCrop: React.FC<{x: number; y: number; w: number; h: number; W: number; H: number; zoom?: number; style?: React.CSSProperties}> = ({x, y, w, h, W, H, zoom = 1, style}) => {
	const sc = Math.max(W / w, H / h) * zoom;
	return (
		<div style={{position: 'relative', width: W, height: H, overflow: 'hidden', ...style}}>
			<Img src={staticFile(ART)} style={{position: 'absolute', width: 3840 * sc, height: 2160 * sc, left: -(x + w / 2) * sc + W / 2, top: -(y + h / 2) * sc + H / 2, maxWidth: 'none'}} />
		</div>
	);
};

/* ---------------------------------------------------------------- fundos */
const BgArtSky: React.FC<{t0: number}> = ({t0}) => {
	const frame = fr();
	const t = t0 + frame / 30;
	const z = 1.15 + frame / 900;
	return (
		<AbsoluteFill style={{background: '#0a0620', overflow: 'hidden'}}>
			<AbsoluteFill style={{transform: `scale(${z + beatPulse(t) * 0.015})`, filter: `brightness(${0.75 + energy(t, 0) * 0.25})`}}>
				<ArtCrop x={1100} y={0} w={1640} h={2160} W={1080} H={1920} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,6,32,0.55) 0%, rgba(10,6,32,0) 35%, rgba(10,6,32,0) 70%, rgba(10,6,32,0.8) 100%)'}} />
		</AbsoluteFill>
	);
};
const BgStageLasers: React.FC<{t0: number; tint?: string}> = ({t0, tint = PURPLE}) => {
	const frame = fr();
	const t = t0 + frame / 30;
	const e = energy(t, 2);
	const pulse = beatPulse(t);
	return (
		<AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 100%, ${tint}55 0%, #05020f 65%)`, overflow: 'hidden'}}>
			{Array.from({length: 12}).map((_, i) => {
				const ang = -60 + i * 11 + Math.sin(t * 1.3 + i) * 12;
				const col = [PINK, CYAN, YEL, PURPLE][i % 4];
				return <div key={i} style={{position: 'absolute', left: 540 - 3, top: 1500, width: 6, height: 2200, transformOrigin: '50% 0%', transform: `rotate(${180 + ang}deg)`, background: `linear-gradient(180deg, ${col}, rgba(0,0,0,0))`, opacity: 0.25 + e * 0.6, filter: `drop-shadow(0 0 10px ${col})`}} />;
			})}
			{/* fumaça */}
			{Array.from({length: 6}).map((_, i) => (
				<div key={`s${i}`} style={{position: 'absolute', left: ((t * 40 + i * 260) % 1500) - 300, top: 1250 + (i % 3) * 90, width: 600, height: 260, borderRadius: 130, background: 'rgba(200,180,255,0.12)', filter: 'blur(30px)'}} />
			))}
			{/* plateia em silhueta pulando na batida */}
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 320}}>
				{Array.from({length: 22}).map((_, i) => {
					const jump = beatPulse(t - (i % 3) * 0.06) * (20 + random(`j${i}`) * 30);
					const x = i * 52 - 20;
					const h = 180 + random(`h${i}`) * 80;
					const arm = random(`a${i}`) > 0.55;
					return (
						<div key={i} style={{position: 'absolute', left: x, bottom: -40 + jump, width: 60, height: h}}>
							<div style={{position: 'absolute', left: 14, top: 0, width: 32, height: 32, borderRadius: 16, background: '#05020f'}} />
							<div style={{position: 'absolute', left: 6, top: 28, width: 48, height: h, borderRadius: '20px 20px 0 0', background: '#05020f'}} />
							{arm ? <div style={{position: 'absolute', left: 44, top: -50, width: 12, height: 90, borderRadius: 6, background: '#05020f', transform: 'rotate(18deg)'}} /> : null}
						</div>
					);
				})}
			</div>
			<AbsoluteFill style={{background: `rgba(255,255,255,${pulse * 0.06})`}} />
		</AbsoluteFill>
	);
};
const BgDJ: React.FC<{t0: number}> = ({t0}) => {
	const frame = fr();
	const t = t0 + frame / 30;
	return (
		<AbsoluteFill style={{background: 'linear-gradient(180deg, #12002a 0%, #2a0050 60%, #0a0016 100%)', overflow: 'hidden'}}>
			{/* parede de LED */}
			<AbsoluteFill style={{opacity: 0.35}}>
				{Array.from({length: 18}).map((_, r) => (
					<div key={r} style={{display: 'flex', gap: 6, marginTop: 6}}>
						{Array.from({length: 18}).map((__, c) => {
							const v = (Math.sin(t * 3 + c * 0.6 + r * 0.4) + 1) / 2 * energy(t, 1);
							return <div key={c} style={{width: 54, height: 54, borderRadius: 6, background: v > 0.45 ? (c % 2 ? PINK : CYAN) : '#1a0533', opacity: 0.4 + v}} />;
						})}
					</div>
				))}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
const BgSpot: React.FC<{color: string}> = ({color}) => {
	const frame = fr();
	return (
		<AbsoluteFill style={{background: '#04030c', overflow: 'hidden'}}>
			{[-1, 1].map((d) => (
				<div key={d} style={{position: 'absolute', left: 540 - 450 + d * 260 + Math.sin(frame / 25) * 40 * d, top: -200, width: 900, height: 2000, background: `linear-gradient(180deg, ${color}66, rgba(0,0,0,0))`, clipPath: 'polygon(45% 0, 55% 0, 100% 100%, 0 100%)', transform: `rotate(${d * 10}deg)`}} />
			))}
		</AbsoluteFill>
	);
};
const BgFelt: React.FC = () => {
	const frame = fr();
	return (
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #0f6b3a 0%, #052b17 75%)', overflow: 'hidden'}}>
			{Array.from({length: 40}).map((_, i) => (
				<div key={i} style={{position: 'absolute', left: random(`gx${i}`) * 1080, top: ((random(`gy${i}`) * 2000 + frame * (3 + random(`gv${i}`) * 4)) % 2000) - 40, width: 14, height: 14, borderRadius: 7, background: YEL, opacity: 0.5, boxShadow: `0 0 12px ${YEL}`}} />
			))}
		</AbsoluteFill>
	);
};
const BgVinylShop: React.FC = () => (
	<AbsoluteFill style={{background: 'linear-gradient(180deg, #3a1406 0%, #6b2a0c 100%)', overflow: 'hidden'}}>
		{Array.from({length: 4}).map((_, r) => (
			<div key={r} style={{position: 'absolute', left: 0, right: 0, top: 260 + r * 420, height: 300, display: 'flex', gap: 14, padding: '0 20px'}}>
				{Array.from({length: 7}).map((__, c) => (
					<div key={c} style={{flex: 1, borderRadius: 6, background: [PINK, YEL, CYAN, PURPLE, ORANGE][(c + r) % 5], opacity: 0.22, transform: `rotate(${((c + r) % 3) - 1}deg)`}} />
				))}
			</div>
		))}
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, rgba(255,200,120,0.25), rgba(0,0,0,0.55) 80%)'}} />
	</AbsoluteFill>
);

/* ---------------------------------------------------------------- cenas */
// 1) 0–4.2  gancho: camadas da arte + palavras na batida
const S1: React.FC = () => {
	const frame = fr();
	const t = frame / 30;
	const words = [
		{t: 'GTA 6', at: 0.05, grad: true, size: 200},
		{t: 'VAI GANHAR UM', at: 0.8, size: 92},
		{t: 'FESTIVAL', at: 1.4, grad: true, size: 170},
	];
	const lu = sp(frame, 2.9, 9, 320);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				{words.map((w, i) => {
					const s = sp(frame, w.at, 9, 320);
					if (frame < f(w.at)) return null;
					return (
						<div key={i} style={{transform: `scale(${interpolate(s, [0, 1], [2.6, 1]) * (1 + beatPulse(t) * 0.04)}) rotate(${interpolate(s, [0, 1], [i % 2 ? 8 : -8, 0])}deg)`, opacity: interpolate(s, [0, 0.2], [0, 1], {extrapolateRight: 'clamp'})}}>
							<Big size={w.size} grad={w.grad}>
								{w.t}
							</Big>
						</div>
					);
				})}
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1300, textAlign: 'center', opacity: lu, transform: `scale(${interpolate(lu, [0, 1], [1.8, 1])})`}}>
				<Pill bg={PINK} size={48}>
					🎤 E O LINE-UP É ABSURDO
				</Pill>
			</div>
		</AbsoluteFill>
	);
};

// 2) 4.2–8.5  Rockstar × PlayStation -> logo oficial do festival (recorte da arte)
const S2: React.FC = () => {
	const frame = fr();
	const a = sp(frame, 0.1, 10, 280);
	const logo = sp(frame, 2.0, 10, 220);
	const x = interpolate(a, [0, 1], [600, 0]);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 26, opacity: 1 - logo * 0.15}}>
				<div style={{transform: `translateX(${-x}px)`, background: '#111', border: `5px solid ${YEL}`, borderRadius: 18, padding: '14px 24px'}}>
					<span style={{fontFamily: DISPLAY, fontSize: 62, color: YEL}}>ROCKSTAR</span>
				</div>
				<Big size={80} color={PINK}>
					×
				</Big>
				<div style={{transform: `translateX(${x}px)`, background: '#0b2a8a', border: `5px solid ${CYAN}`, borderRadius: 18, padding: '14px 24px'}}>
					<span style={{fontFamily: DISPLAY, fontSize: 62, color: 'white'}}>PLAYSTATION</span>
				</div>
			</div>
			<div style={{position: 'absolute', left: 90, right: 90, top: 520, height: 640, borderRadius: 30, overflow: 'hidden', border: '6px solid rgba(255,255,255,0.85)', boxShadow: `0 0 70px ${PINK}88`, opacity: logo, transform: `perspective(1200px) rotateX(${(1 - logo) * 40}deg) scale(${interpolate(logo, [0, 1], [0.7, 1])})`}}>
				<ArtCrop x={1380} y={180} w={1080} h={760} W={900} H={640} zoom={1 + frame / 2000} />
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1300, textAlign: 'center', opacity: logo}}>
				<Pill bg={C.ink} size={36}>
					📰 ANÚNCIO OFICIAL · 09/11
				</Pill>
			</div>
		</AbsoluteFill>
	);
};

// 3) 8.5–13.3  Miami, 21/11, dois dias depois — skyline da arte + calendário
const S3: React.FC = () => {
	const frame = fr();
	const pin = sp(frame, 0.6, 8, 320);
	const d = lerp(frame, 2.6, 4.0, 19, 21);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 60, right: 60, top: 330, height: 520, borderRadius: 30, overflow: 'hidden', border: '6px solid white', boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}}>
				<ArtCrop x={1500} y={1300} w={2340} h={660} W={960} H={520} zoom={1.05 + frame / 1500} />
				<div style={{position: 'absolute', left: 560, top: 140 - pin * 20, opacity: pin, transform: `scale(${pin})`, transformOrigin: '50% 100%', textAlign: 'center'}}>
					<Pill bg={C.red} size={40}>
						📍 MIAMI
					</Pill>
				</div>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 900, display: 'flex', justifyContent: 'center', gap: 30, alignItems: 'center'}}>
				<div style={{width: 260, background: 'white', borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'}}>
					<div style={{background: C.red, color: 'white', fontFamily: UI, fontWeight: 800, fontSize: 30, textAlign: 'center', padding: 8, letterSpacing: 4}}>NOV</div>
					<div style={{fontFamily: DISPLAY, fontSize: 150, color: C.ink, textAlign: 'center', lineHeight: 1.2}}>{Math.round(d)}</div>
				</div>
				<div style={{opacity: lerp(frame, 3.6, 4.2, 0, 1)}}>
					<Big size={64} color={YEL}>
						2 DIAS
					</Big>
					<br />
					<Big size={54}>DEPOIS DO JOGO</Big>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// 4) 13.3–19.3  line-up no telão de LED, cada nome na fala
const S4: React.FC = () => {
	const frame = fr();
	const t = 13.3 + frame / 30;
	const names = [
		{n: 'TRAVIS SCOTT', at: 14.2, c: YEL},
		{n: 'CARDI B', at: 15.2, c: PINK},
		{n: 'METRO BOOMIN', at: 16.1, c: CYAN},
		{n: 'DON TOLIVER', at: 17.0, c: ORANGE},
		{n: 'KODAK BLACK', at: 18.4, c: '#3DFF8A', big: true},
	];
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 50, right: 50, top: 320, height: 820, borderRadius: 26, background: 'rgba(4,2,12,0.85)', border: '8px solid #2a1a44', boxShadow: `0 0 ${40 + beatPulse(t) * 60}px ${PURPLE}`, padding: '30px 30px', overflow: 'hidden'}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 30, color: 'rgba(255,255,255,0.7)', letterSpacing: 6, textAlign: 'center'}}>LINE-UP</div>
				{names.map((x, i) => {
					const s = sp(frame, x.at - 13.3, 9, 320);
					if (t < x.at) return null;
					return (
						<div key={i} style={{textAlign: 'center', marginTop: x.big ? 26 : 14, transform: `scale(${interpolate(s, [0, 1], [2.2, 1])})`, opacity: s}}>
							<span style={{fontFamily: DISPLAY, fontSize: x.big ? 120 : 92, color: x.c, textShadow: `0 0 24px ${x.c}, 0 6px 0 #000`, letterSpacing: 2}}>{x.n}</span>
						</div>
					);
				})}
				{/* scanlines de LED */}
				<AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0 3px, transparent 3px 7px)', pointerEvents: 'none'}} />
			</div>
		</AbsoluteFill>
	);
};

// 5) 19.3–25.5  Justice: vinil girando + equalizador da própria trilha
const S5: React.FC = () => {
	const frame = fr();
	const t = 19.3 + frame / 30;
	const s = sp(frame, 1.1, 10, 280);
	const dj = sp(frame, 4.9, 9, 320);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', opacity: s, transform: `scale(${interpolate(s, [0, 1], [1.8, 1])})`}}>
				<Big size={170} grad>
					JUSTICE
				</Big>
				<div style={{marginTop: 8}}>
					<Pill bg={C.ink} size={34}>
						🇫🇷 FIZERAM A TRILHA ORIGINAL DE GTA 6
					</Pill>
				</div>
			</div>
			{/* vinil */}
			<div style={{position: 'absolute', left: 540 - 250, top: 620, width: 500, height: 500, borderRadius: 250, background: 'repeating-radial-gradient(circle, #111 0 6px, #1d1d1d 6px 9px)', boxShadow: '0 30px 60px rgba(0,0,0,0.7)', transform: `rotate(${frame * 7}deg)`}}>
				<div style={{position: 'absolute', left: 175, top: 175, width: 150, height: 150, borderRadius: 75, overflow: 'hidden', border: '4px solid #000'}}>
					<ArtCrop x={1600} y={300} w={640} h={640} W={150} H={150} />
				</div>
			</div>
			{/* equalizador (energia real da música) */}
			<div style={{position: 'absolute', left: 80, right: 80, top: 1180, height: 200, display: 'flex', alignItems: 'flex-end', gap: 8}}>
				{Array.from({length: 24}).map((_, i) => {
					const band = Math.min(3, Math.floor(i / 6));
					const v = energy(t - i * 0.01, band) * (0.6 + 0.4 * Math.abs(Math.sin(i * 1.7 + t * 6)));
					return <div key={i} style={{flex: 1, height: 20 + v * 180, borderRadius: 6, background: [PINK, ORANGE, YEL, CYAN][band], boxShadow: `0 0 12px ${[PINK, ORANGE, YEL, CYAN][band]}`}} />;
				})}
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1420, textAlign: 'center', opacity: dj, transform: `scale(${interpolate(dj, [0, 1], [1.8, 1])})`}}>
				<Pill bg={PURPLE} size={48}>
					🎧 DJ SET
				</Pill>
			</div>
		</AbsoluteFill>
	);
};

// 6) 25.5–28.6  dois palcos, sem parar — tela dividida em 2 palcos
const S6: React.FC = () => {
	const frame = fr();
	const t = 25.5 + frame / 30;
	const st = (label: string, col: string, i: number) => (
		<div style={{flex: 1, height: 760, borderRadius: 24, overflow: 'hidden', position: 'relative', border: `6px solid ${col}`, boxShadow: `0 0 ${30 + beatPulse(t + i * 0.37) * 50}px ${col}`}}>
			<div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 90%, ${col}88 0%, #05020f 70%)`}} />
			{Array.from({length: 6}).map((_, k) => (
				<div key={k} style={{position: 'absolute', left: '50%', bottom: 120, width: 5, height: 900, transformOrigin: '50% 100%', transform: `rotate(${-40 + k * 16 + Math.sin(t * 2 + k + i) * 10}deg)`, background: `linear-gradient(0deg, ${col}, rgba(0,0,0,0))`, opacity: 0.4 + energy(t, 2) * 0.5}} />
			))}
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 20, textAlign: 'center'}}>
				<Big size={60}>{label}</Big>
			</div>
		</div>
	);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 320, textAlign: 'center'}}>
				<Big size={110} grad>
					2 PALCOS
				</Big>
			</div>
			<div style={{position: 'absolute', left: 60, right: 60, top: 470, display: 'flex', gap: 26}}>
				{st('PALCO 1', PINK, 0)}
				{st('PALCO 2', CYAN, 1)}
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1300, textAlign: 'center'}}>
				<Pill bg={C.ink} size={38}>
					📍 MANA WYNWOOD · MÚSICA SEM PARAR
				</Pill>
			</div>
		</AbsoluteFill>
	);
};

// 7) 28.6–35.3  sorteio: ingresso dourado girando + "prazo só até 10/11"
const S7: React.FC = () => {
	const frame = fr();
	const t = 28.6 + frame / 30;
	const no = sp(frame, 1.6, 9, 320);
	const lot = sp(frame, 2.5, 10, 300);
	const max = sp(frame, 3.3, 10, 300);
	const today = sp(frame, 5.6, 8, 340);
	const rot = frame * 5;
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 540 - 330, top: 330, width: 660, height: 300, perspective: 1200}}>
				<div style={{width: '100%', height: '100%', borderRadius: 26, background: `linear-gradient(135deg, #fff3b0, ${YEL} 40%, #e0a100)`, border: '6px dashed #7a5200', boxShadow: '0 0 60px rgba(255,200,0,0.6)', transform: `rotateY(${Math.sin(rot / 40) * 25}deg) rotateZ(${-4 + Math.sin(t) * 2}deg)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
					<div style={{fontFamily: UI, fontWeight: 800, fontSize: 30, color: '#5a3c00', letterSpacing: 6}}>INGRESSO</div>
					<div style={{fontFamily: DISPLAY, fontSize: 92, color: '#3a2600'}}>GTA VI: THE FESTIVAL</div>
				</div>
				{t >= 30.0 ? (
					<div style={{position: 'absolute', left: -20, top: '45%', width: `${no * 108}%`, height: 20, background: C.red, borderRadius: 10, transform: 'rotate(-8deg)', boxShadow: `0 0 20px ${C.red}`}} />
				) : null}
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 680, textAlign: 'center', opacity: no}}>
				<Big size={80} color={C.red}>
					NÃO ESTÁ À VENDA
				</Big>
			</div>
			<div style={{position: 'absolute', left: 80, right: 80, top: 800, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center'}}>
				<div style={{opacity: lot, transform: `translateX(${(1 - lot) * -300}px)`}}>
					<Pill bg={'#3DFF8A'} color={C.ink} size={46}>
						🎰 É SORTEIO
					</Pill>
				</div>
				<div style={{opacity: max, transform: `translateX(${(1 - max) * 300}px)`}}>
					<Pill bg={PURPLE} size={46}>
						🎟️ MÁXIMO 2 POR PESSOA
					</Pill>
				</div>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1290, textAlign: 'center', opacity: today, transform: `rotate(-5deg) scale(${interpolate(today, [0, 1], [2.4, 1])})`}}>
				<span style={{display: 'inline-block', fontFamily: DISPLAY, fontSize: 96, color: C.red, border: `10px solid ${C.red}`, borderRadius: 20, padding: '4px 30px 0', background: 'rgba(0,0,0,0.5)'}}>⏰ PRAZO: SÓ ATÉ 10/11</span>
			</div>
		</AbsoluteFill>
	);
};

// 8) 35.3–40.4  álbum: disco + contador 34 faixas
const S8: React.FC = () => {
	const frame = fr();
	const k = lerp(frame, 3.2, 4.4, 0, 34);
	const s = sp(frame, 0.2, 11, 260);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 320, textAlign: 'center', opacity: s}}>
				<Big size={92}>GTA 6: THE ALBUM</Big>
				<div style={{marginTop: 10}}>
					<Pill bg={C.ink} size={34}>
						💿 SAI JUNTO COM O JOGO · 19/11
					</Pill>
				</div>
			</div>
			<div style={{position: 'absolute', left: 540 - 230, top: 560, width: 460, height: 460, perspective: 1200, opacity: s}}>
				<div style={{position: 'absolute', left: 120, top: 10, width: 440, height: 440, borderRadius: 220, background: 'repeating-radial-gradient(circle, #111 0 6px, #222 6px 9px)', transform: `rotate(${frame * 5}deg) translateX(${interpolate(s, [0, 1], [0, 60])}px)`}} />
				<div style={{position: 'absolute', left: 0, top: 0, width: 460, height: 460, borderRadius: 14, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', transform: 'rotateY(-10deg)'}}>
					<ArtCrop x={1100} y={0} w={1640} h={1640} W={460} H={460} />
				</div>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1100, textAlign: 'center'}}>
				<Big size={200} grad>
					{Math.round(k)}
				</Big>
				<br />
				<Big size={70}>FAIXAS</Big>
			</div>
		</AbsoluteFill>
	);
};

// 9) 40.4–43.7  enquete: qual show você não perderia?
const S9: React.FC = () => {
	const frame = fr();
	const opts = [
		{l: 'A', t: 'TRAVIS SCOTT', c: YEL},
		{l: 'B', t: 'CARDI B', c: PINK},
		{l: 'C', t: 'JUSTICE', c: CYAN},
		{l: 'D', t: 'KODAK BLACK', c: '#3DFF8A'},
	];
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 320, textAlign: 'center'}}>
				<Big size={72}>QUAL SHOW VOCÊ NÃO PERDERIA?</Big>
			</div>
			<div style={{position: 'absolute', left: 70, right: 70, top: 470, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22}}>
				{opts.map((o, i) => {
					const k = sp(frame, 0.2 + i * 0.18, 10, 300);
					return (
						<div key={o.l} style={{height: 300, borderRadius: 24, background: 'rgba(5,2,15,0.88)', border: `6px solid ${o.c}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: k, transform: `scale(${interpolate(k, [0, 1], [0.5, 1])})`, boxShadow: `0 0 40px ${o.c}66`}}>
							<span style={{fontFamily: DISPLAY, fontSize: 110, color: o.c}}>{o.l}</span>
							<span style={{fontFamily: DISPLAY, fontSize: 50, color: 'white'}}>{o.t}</span>
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
	[0, 4.2, S1, PINK, ({t0}) => <BgArtSky t0={t0} />],
	[4.2, 8.5, S2, CYAN, () => <BgSpot color={CYAN} />],
	[8.5, 13.3, S3, YEL, ({t0}) => <BgStageLasers t0={t0} tint={ORANGE} />],
	[13.3, 19.3, S4, PURPLE, ({t0}) => <BgStageLasers t0={t0} tint={PURPLE} />],
	[19.3, 25.5, S5, PINK, ({t0}) => <BgDJ t0={t0} />],
	[25.5, 28.6, S6, CYAN, () => <BgSpot color={PINK} />],
	[28.6, 35.3, S7, YEL, () => <BgFelt />],
	[35.3, 40.4, S8, ORANGE, () => <BgVinylShop />],
	[40.4, 43.7, S9, PINK, ({t0}) => <BgArtSky t0={t0} />],
];

/** transição: flash + barra diagonal + zoom, alinhada à batida mais próxima */
const Wipe: React.FC<{color: string}> = ({color}) => {
	const frame = fr();
	const x = interpolate(frame, [0, 9], [-1400, 1400], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
	const flash = interpolate(frame, [0, 2, 8], [0, 0.55, 0], {extrapolateRight: 'clamp'});
	return (
		<>
			<div style={{position: 'absolute', left: x, top: -400, width: 520, height: 2800, background: color, transform: 'rotate(18deg)', boxShadow: `0 0 80px ${color}`}} />
			<div style={{position: 'absolute', left: x - 260, top: -400, width: 80, height: 2800, background: 'white', transform: 'rotate(18deg)', opacity: 0.8}} />
			<AbsoluteFill style={{background: 'white', opacity: flash}} />
		</>
	);
};
const SceneShell: React.FC<{dur: number; t0: number; children: React.ReactNode}> = ({dur, t0, children}) => {
	const frame = fr();
	const t = t0 + frame / 30;
	const inn = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const out = interpolate(frame, [f(dur) - 6, f(dur)], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const bump = 1 + beatPulse(t) * 0.012;
	return <AbsoluteFill style={{opacity: Math.min(inn, out), transform: `scale(${interpolate(inn, [0, 1], [1.1, 1]) * bump})`, filter: `blur(${(1 - inn) * 10}px)`}}>{children}</AbsoluteFill>;
};

export const FestivalMotion: React.FC = () => (
	<AbsoluteFill>
		{SCENES.map(([a, b, , , Bg], i) => (
			<At key={`bg${i}`} from={a} to={i === SCENES.length - 1 ? 54 : b}>
				<Bg t0={a} />
			</At>
		))}
		{SCENES.map(([a, b, Scene, col], i) => (
			<At key={i} from={a} to={b}>
				<SceneShell dur={b - a} t0={a}>
					<Scene />
				</SceneShell>
				{i > 0 ? <Wipe color={col} /> : null}
			</At>
		))}
		<At from={43.7} to={54}>
			<ProOutro subAt={1.6} tagline="INVESTIGANDO CADA DETALHE DE GTA 6" />
		</At>
	</AbsoluteFill>
);
