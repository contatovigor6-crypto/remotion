import React from 'react';
import {
	AbsoluteFill,
	Easing,
	Img,
	Sequence,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {C, DISPLAY, GRAD, UI, f} from '../theme';
import {fmt, gameClock} from './Hud';

export const At: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => (
	<Sequence from={f(from)} durationInFrames={f(to) - f(from)} layout="none">
		{children}
	</Sequence>
);

export const useSpring = (delay = 0, damping = 14, stiffness = 220) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({frame: frame - f(delay), fps, config: {damping, stiffness}});
};

/** fade-out nos últimos frames de cada elemento */
export const useOut = (dur: number, n = 5) => {
	const frame = useCurrentFrame();
	return interpolate(frame, [f(dur) - n, f(dur)], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
};

export const Chip: React.FC<{bg: string; color?: string; children: React.ReactNode; size?: number; style?: React.CSSProperties}> = ({
	bg,
	color = 'white',
	children,
	size = 34,
	style,
}) => (
	<div
		style={{
			display: 'inline-flex',
			alignItems: 'center',
			gap: 12,
			padding: '10px 22px',
			background: bg,
			color,
			fontFamily: UI,
			fontWeight: 800,
			fontSize: size,
			letterSpacing: 3,
			borderRadius: 8,
			boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
			...style,
		}}
	>
		{children}
	</div>
);

// ------------------------------------------------------------------ elementos

const BigTimer: React.FC<{dur: number; mode: 'hook' | 'return'}> = ({dur, mode}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const local = frame / fps;
	const s = useSpring(0, 13, 260);
	const out = useOut(dur);
	// hook: 0 -> 1h até "hora" (3.86 s); return: segue o relógio do experimento
	const secs =
		mode === 'hook'
			? interpolate(local, [0, 1.06], [0, 3600], {extrapolateRight: 'clamp', easing: Easing.in(Easing.quad)})
			: gameClock(local + 42.2);
	const done = secs >= 3599.5;
	const lockT = mode === 'hook' ? 1.06 : 43.06 - 42.2;
	const lock = spring({frame: frame - Math.round(lockT * fps), fps, config: {damping: 10, stiffness: 300}});
	return (
		<AbsoluteFill style={{alignItems: 'center', top: 560, opacity: out}}>
			<div style={{position: 'absolute', top: -30, width: 900, height: 330, borderRadius: 24, background: 'rgba(11,6,18,0.72)', transform: `scale(${s})`}} />
			<div style={{position: 'relative', fontFamily: UI, fontWeight: 800, fontSize: 34, letterSpacing: 10, color: 'white', opacity: 0.9, marginBottom: 6}}>
				{mode === 'hook' ? 'TEMPO PARADO' : 'VOCÊ VOLTA EM...'}
			</div>
			<div
				style={{
					position: 'relative',
					fontFamily: DISPLAY,
					fontSize: 190,
					letterSpacing: 6,
					fontVariantNumeric: 'tabular-nums',
					transform: `scale(${interpolate(s, [0, 1], [0.6, 1]) * (done ? 1 + 0.12 * (1 - lock) : 1)})`,
					...(done
						? {backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: `drop-shadow(0 0 30px ${C.pink})`}
						: {color: 'white', textShadow: '0 6px 0 #000'}),
				}}
			>
				{fmt(secs)}
			</div>
		</AbsoluteFill>
	);
};

export const LogoSlam: React.FC = () => {
	const s = useSpring(0, 11, 260);
	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
			<Img
				src={staticFile('img/logo.png')}
				style={{
					width: 760,
					transform: `scale(${interpolate(s, [0, 1], [2.4, 1])}) rotate(${interpolate(s, [0, 1], [-8, 0])}deg)`,
					opacity: interpolate(s, [0, 0.3], [0, 1], {extrapolateRight: 'clamp'}),
					filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))',
				}}
			/>
		</AbsoluteFill>
	);
};

export const Stamp: React.FC<{text: string; sub?: string; top: number; color?: string}> = ({text, sub, top, color = C.pink}) => {
	const s = useSpring(0, 10, 320);
	return (
		<AbsoluteFill style={{alignItems: 'center', top}}>
			<div
				style={{
					border: `8px solid ${color}`,
					padding: '8px 30px 4px',
					borderRadius: 14,
					transform: `rotate(-6deg) scale(${interpolate(s, [0, 1], [2.2, 1])})`,
					opacity: interpolate(s, [0, 0.25], [0, 1], {extrapolateRight: 'clamp'}),
					background: 'rgba(11,6,18,0.55)',
					textAlign: 'center',
				}}
			>
				<div style={{fontFamily: DISPLAY, fontSize: 108, color, letterSpacing: 4, lineHeight: 1.05}}>{text}</div>
				{sub ? <div style={{fontFamily: UI, fontWeight: 800, fontSize: 30, color: 'white', letterSpacing: 6, marginBottom: 8}}>{sub}</div> : null}
			</div>
		</AbsoluteFill>
	);
};

const MapPin: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0.15, 9, 240);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			{[0, 1, 2].map((i) => {
				const p = ((frame + i * 12) % 36) / 36;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: 540 - 160 * p,
							top: 900 - 70 * p,
							width: 320 * p,
							height: 140 * p,
							borderRadius: '50%',
							border: `4px solid ${C.pink}`,
							opacity: (1 - p) * s,
						}}
					/>
				);
			})}
			<svg
				width={120}
				height={160}
				viewBox="0 0 24 32"
				style={{position: 'absolute', left: 480, top: 900 - 160 * s, opacity: s, filter: 'drop-shadow(0 10px 12px rgba(0,0,0,0.5))'}}
			>
				<defs>
					<linearGradient id="pin" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor={C.orange} />
						<stop offset="1" stopColor={C.pink} />
					</linearGradient>
				</defs>
				<path d="M12 0C5.4 0 0 5.2 0 11.7 0 20.4 12 32 12 32s12-11.6 12-20.3C24 5.2 18.6 0 12 0z" fill="url(#pin)" />
				<circle cx="12" cy="11.5" r="4.5" fill="white" />
			</svg>
			<div style={{position: 'absolute', top: 640, width: '100%', textAlign: 'center', opacity: s}}>
				<Chip bg={C.ink} size={36}>
					VOCÊ ESTÁ AQUI
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

const RULES: [string, number][] = [
	['ANDAR', 17.82],
	['DIRIGIR', 18.56],
	['FAZER QUALQUER COISA', 19.54],
];
const Checklist: React.FC<{start: number; dur: number}> = ({start, dur}) => {
	const out = useOut(dur);
	const s = useSpring(0, 16, 240);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div
				style={{
					position: 'absolute',
					left: 70,
					top: 770,
					padding: '18px 30px',
					background: 'rgba(11,6,18,0.7)',
					borderLeft: `8px solid ${C.pink}`,
					borderRadius: 10,
					transform: `translateX(${interpolate(s, [0, 1], [-600, 0])}px)`,
				}}
			>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 24, letterSpacing: 6, color: C.yellow, marginBottom: 6}}>REGRAS DO TESTE</div>
				{RULES.map(([label, t]) => (
					<RuleRow key={label} label={label} delay={t - start} />
				))}
			</div>
		</AbsoluteFill>
	);
};
const RuleRow: React.FC<{label: string; delay: number}> = ({label, delay}) => {
	const frame = useCurrentFrame();
	const s = useSpring(delay, 12, 300);
	if (frame < f(delay)) return null;
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 18, margin: '6px 0', opacity: s, transform: `translateX(${(1 - s) * -40}px)`}}>
			<div
				style={{
					width: 44,
					height: 44,
					borderRadius: 8,
					background: C.red,
					color: 'white',
					fontFamily: UI,
					fontWeight: 800,
					fontSize: 32,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					transform: `scale(${interpolate(s, [0, 1], [1.8, 1])})`,
				}}
			>
				✕
			</div>
			<div style={{fontFamily: DISPLAY, fontSize: 50, color: 'white', letterSpacing: 2}}>
				SEM {label}
			</div>
		</div>
	);
};

const Radar: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const out = useOut(dur);
	const inO = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
	const angle = frame * 6;
	return (
		<AbsoluteFill style={{opacity: out * inO}}>
			{[0, 1, 2, 3].map((i) => {
				const p = ((frame + i * 11) % 44) / 44;
				const r = 60 + 520 * p;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: 540 - r,
							top: 860 - r,
							width: r * 2,
							height: r * 2,
							borderRadius: '50%',
							border: `3px solid ${C.cyan}`,
							opacity: (1 - p) * 0.8,
						}}
					/>
				);
			})}
			<div
				style={{
					position: 'absolute',
					left: 540 - 520,
					top: 860 - 520,
					width: 1040,
					height: 1040,
					borderRadius: '50%',
					background: `conic-gradient(from ${angle}deg, rgba(56,225,255,0.28), rgba(56,225,255,0) 60deg)`,
				}}
			/>
			<div style={{position: 'absolute', left: 540 - 16, top: 860 - 16, width: 32, height: 32, borderRadius: 16, background: C.pink, boxShadow: `0 0 0 8px rgba(255,62,154,0.35)`}} />
		</AbsoluteFill>
	);
};

const Alert: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 12, 300);
	const out = useOut(dur);
	const blink = Math.floor(frame / 6) % 2 === 0;
	return (
		<AbsoluteFill style={{alignItems: 'center', top: 470, opacity: out}}>
			<div
				style={{
					transform: `scale(${interpolate(s, [0, 1], [0.5, 1])})`,
					opacity: s,
					border: `5px solid ${blink ? C.red : 'rgba(255,45,61,0.4)'}`,
					background: 'rgba(30,0,6,0.75)',
					padding: '14px 30px',
					borderRadius: 10,
					fontFamily: UI,
					fontWeight: 800,
					fontSize: 40,
					letterSpacing: 5,
					color: 'white',
				}}
			>
				<span style={{color: C.red}}>⚠</span> EVENTO INESPERADO
			</div>
		</AbsoluteFill>
	);
};

/** Título grande revelado palavra a palavra, sincronizado com a fala */
export const TitleCard: React.FC<{lines: {text: string; at: number; big?: boolean}[]; start: number; top: number}> = ({lines, start, top}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill style={{alignItems: 'center', top}}>
			{lines.map((l) => {
				const s = spring({frame: frame - f(l.at - start), fps, config: {damping: 12, stiffness: 260}});
				return (
					<div
						key={l.text}
						style={{
							fontFamily: DISPLAY,
							fontSize: l.big ? 200 : 104,
							lineHeight: 1.12,
							letterSpacing: 2,
							marginBottom: 10,
							opacity: s,
							transform: `translateY(${(1 - s) * 60}px) scale(${interpolate(s, [0, 1], [l.big ? 1.6 : 1.15, 1])})`,
							textAlign: 'center',
							...(l.big
								? {backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: `drop-shadow(0 0 40px rgba(255,62,154,0.7))`}
								: {color: 'white', textShadow: '0 6px 0 #000'}),
						}}
					>
						{l.text}
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

const Split: React.FC = () => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 18, 200);
	const s2 = useSpring(0.25, 18, 200);
	const q = useSpring(0.9, 9, 260);
	const half = (bottom: boolean, prog: number) => (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: bottom ? 960 : 0,
				height: 960,
				overflow: 'hidden',
				transform: `translateX(${(1 - prog) * (bottom ? 1080 : -1080)}px)`,
			}}
		>
			<Img
				src={staticFile('img/vc-day.jpg')}
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					objectPosition: bottom ? '58% 50%' : '42% 50%',
					transform: `scale(${1.05 + frame * 0.0015})`,
					filter: bottom ? 'sepia(0.35) saturate(1.3) hue-rotate(-12deg) brightness(0.92) contrast(1.1)' : 'contrast(1.08) saturate(1.1)',
				}}
			/>
			<div style={{position: 'absolute', left: 70, top: bottom ? 300 : 260}}>
				<Chip bg={bottom ? C.pink : C.ink} size={32}>
					{bottom ? 'DEPOIS · 01:00:00' : 'ANTES · 00:00:00'}
				</Chip>
			</div>
		</div>
	);
	return (
		<AbsoluteFill style={{background: 'black'}}>
			{half(false, s)}
			{half(true, s2)}
			<div style={{position: 'absolute', top: 954, left: 0, right: 0, height: 12, background: GRAD}} />
			<div
				style={{
					position: 'absolute',
					top: 870,
					width: '100%',
					textAlign: 'center',
					fontFamily: DISPLAY,
					fontSize: 150,
					color: 'white',
					textShadow: '0 8px 0 #000',
					transform: `scale(${interpolate(q, [0, 1], [0, 1])}) rotate(${(1 - q) * 20}deg)`,
				}}
			>
				MUDOU?
			</div>
		</AbsoluteFill>
	);
};

const Tracking: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 14, 200);
	const out = useOut(dur);
	const box = {x: 260, y: 470, w: 560, h: 560};
	const pad = interpolate(s, [0, 1], [160, 0]);
	const corner = (l: boolean, t: boolean) => (
		<div
			style={{
				position: 'absolute',
				left: l ? box.x - pad : box.x + box.w + pad - 70,
				top: t ? box.y - pad : box.y + box.h + pad - 70,
				width: 70,
				height: 70,
				borderColor: C.yellow,
				borderStyle: 'solid',
				borderWidth: `${t ? 7 : 0}px ${l ? 0 : 7}px ${t ? 0 : 7}px ${l ? 7 : 0}px`,
			}}
		/>
	);
	const scan = (frame * 14) % box.h;
	return (
		<AbsoluteFill style={{opacity: out * s}}>
			{corner(true, true)}
			{corner(false, true)}
			{corner(true, false)}
			{corner(false, false)}
			<div style={{position: 'absolute', left: box.x, top: box.y + scan, width: box.w, height: 3, background: 'rgba(255,216,74,0.5)'}} />
			<div style={{position: 'absolute', left: box.x, top: box.y - 70}}>
				<Chip bg={C.ink} color={C.yellow} size={28}>
					COMPORTAMENTO: ANALISANDO…
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

const Ecg: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const out = useOut(dur);
	const pts: string[] = [];
	for (let x = 0; x <= 1080; x += 6) {
		const ph = (x % 360) / 360;
		let y = 0;
		if (ph > 0.42 && ph < 0.46) y = -40;
		else if (ph >= 0.46 && ph < 0.5) y = 150;
		else if (ph >= 0.5 && ph < 0.54) y = -190;
		else if (ph >= 0.54 && ph < 0.58) y = 50;
		else if (ph > 0.7 && ph < 0.8) y = -25 * Math.sin(((ph - 0.7) / 0.1) * Math.PI);
		pts.push(`${x},${-y * 0.6}`);
	}
	const reveal = interpolate(frame, [0, 30], [0, 1080], {extrapolateRight: 'clamp'});
	const sweep = (frame * 20) % 1080;
	return (
		<AbsoluteFill style={{opacity: out}}>
			<svg width={1080} height={300} style={{position: 'absolute', top: 470}} viewBox="0 -150 1080 300">
				<defs>
					<clipPath id="ecgclip">
						<rect x={0} y={-150} width={reveal} height={300} />
					</clipPath>
				</defs>
				<polyline
					points={pts.join(' ')}
					fill="none"
					stroke={C.cyan}
					strokeWidth={7}
					strokeLinejoin="round"
					clipPath="url(#ecgclip)"
					style={{filter: `drop-shadow(0 0 10px ${C.cyan})`}}
				/>
				<circle cx={Math.min(sweep, reveal)} cy={0} r={10} fill="white" />
			</svg>
			<div style={{position: 'absolute', top: 400, left: 70}}>
				<Chip bg={C.ink} color={C.cyan} size={28}>
					SINAIS DE VIDA DO MUNDO?
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

const NotTested: React.FC<{dur: number; logoAt: number}> = ({dur, logoAt}) => {
	const s = useSpring(0, 10, 300);
	const l = useSpring(logoAt, 11, 260);
	const out = useOut(dur);
	const tape = 'repeating-linear-gradient(-45deg, #FFD84A 0 26px, #0B0612 26px 52px)';
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 470, width: '100%', display: 'flex', justifyContent: 'center'}}>
				<div style={{transform: `rotate(-4deg) scale(${interpolate(s, [0, 1], [1.8, 1])})`, opacity: s, padding: 10, background: tape, borderRadius: 10}}>
					<div style={{background: C.ink, padding: '14px 34px', borderRadius: 4, textAlign: 'center'}}>
						<div style={{fontFamily: DISPLAY, fontSize: 86, color: C.yellow, letterSpacing: 3, lineHeight: 1.05}}>AINDA NÃO TESTADO</div>
						<div style={{fontFamily: UI, fontWeight: 800, fontSize: 26, color: 'white', letterSpacing: 5}}>HIPÓTESE · SEM RESULTADO REAL</div>
					</div>
				</div>
			</div>
			<Img
				src={staticFile('img/logo.png')}
				style={{position: 'absolute', left: 540 - 190, top: 730, width: 380, opacity: l, transform: `scale(${interpolate(l, [0, 1], [1.8, 1])})`}}
			/>
		</AbsoluteFill>
	);
};

const HourRing: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 14, 220);
	const out = useOut(dur);
	const prog = interpolate(frame, [0, f(dur)], [0, 0.22], {extrapolateRight: 'clamp'});
	const R = 190;
	const circ = 2 * Math.PI * R;
	return (
		<AbsoluteFill style={{opacity: out * s}}>
			<svg width={480} height={480} style={{position: 'absolute', left: 300, top: 600, transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})`}}>
				<circle cx={240} cy={240} r={R} stroke="rgba(255,255,255,0.18)" strokeWidth={22} fill="rgba(11,6,18,0.55)" />
				<circle
					cx={240}
					cy={240}
					r={R}
					stroke={C.red}
					strokeWidth={22}
					fill="none"
					strokeDasharray={`${circ * prog} ${circ}`}
					strokeLinecap="round"
					transform="rotate(-90 240 240)"
				/>
			</svg>
			<div style={{position: 'absolute', top: 770, width: '100%', textAlign: 'center', fontFamily: DISPLAY, fontSize: 116, color: 'white', textShadow: '0 5px 0 #000'}}>
				60:00
			</div>
			<div style={{position: 'absolute', top: 910, width: '100%', textAlign: 'center', fontFamily: UI, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: 'white'}}>
				SEM SE MEXER
			</div>
		</AbsoluteFill>
	);
};

const Controller: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 12, 240);
	const slash = useSpring(0.35, 12, 260);
	const out = useOut(dur);
	const btn = (cx: number, cy: number, c: string, i: number) => {
		const pulse = 0.5 + 0.5 * Math.sin(frame / 3 + i);
		return <circle key={i} cx={cx} cy={cy} r={22} fill={c} opacity={0.35 + 0.4 * pulse} />;
	};
	return (
		<AbsoluteFill style={{opacity: out}}>
			<svg
				width={760}
				height={500}
				viewBox="0 0 760 500"
				style={{position: 'absolute', left: 160, top: 420, transform: `scale(${interpolate(s, [0, 1], [0.5, 1])}) rotate(${(1 - s) * -10}deg)`, opacity: s}}
			>
				<path
					d="M190 120 h380 c90 0 140 60 160 160 c20 110 -10 190 -80 190 c-60 0 -90 -70 -140 -110 h-260 c-50 40 -80 110 -140 110 c-70 0 -100 -80 -80 -190 c20 -100 70 -160 160 -160z"
					fill="rgba(11,6,18,0.85)"
					stroke="white"
					strokeWidth={8}
				/>
				<rect x={160} y={225} width={100} height={30} rx={6} fill="white" opacity={0.85} />
				<rect x={195} y={190} width={30} height={100} rx={6} fill="white" opacity={0.85} />
				{btn(560, 190, C.yellow, 0)}
				{btn(610, 240, C.red, 1)}
				{btn(510, 240, C.cyan, 2)}
				{btn(560, 290, '#5BFF8A', 3)}
				<circle cx={300} cy={340} r={40} fill="none" stroke="white" strokeWidth={6} opacity={0.7} />
				<circle cx={460} cy={340} r={40} fill="none" stroke="white" strokeWidth={6} opacity={0.7} />
				<circle cx={380} cy={270} r={230 * slash} fill="none" stroke={C.red} strokeWidth={26} opacity={slash} />
				<line
					x1={380 - 162 * slash}
					y1={270 + 162 * slash}
					x2={380 + 162 * slash}
					y2={270 - 162 * slash}
					stroke={C.red}
					strokeWidth={26}
					opacity={slash}
					strokeLinecap="round"
				/>
			</svg>
		</AbsoluteFill>
	);
};

const CommentBubble: React.FC<{dur: number; typeAt: number}> = ({dur, typeAt}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	const msg = 'eu teria coragem';
	const n = Math.floor(interpolate(frame, [f(typeAt), f(typeAt + 0.9)], [0, msg.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
	const caret = Math.floor(frame / 8) % 2 === 0;
	const sent = frame > f(typeAt + 1.3);
	const heart = spring({frame: frame - f(typeAt + 1.5), fps, config: {damping: 8, stiffness: 300}});
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div
				style={{
					position: 'absolute',
					left: 90,
					right: 150,
					top: 470,
					padding: '30px 34px',
					background: 'rgba(255,255,255,0.96)',
					borderRadius: 28,
					boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
					transform: `translateY(${(1 - s) * 140}px) scale(${interpolate(s, [0, 1], [0.8, 1])})`,
					opacity: s,
				}}
			>
				<div style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 14}}>
					<div style={{width: 76, height: 76, borderRadius: 38, background: GRAD}} />
					<div style={{fontFamily: UI, fontWeight: 800, fontSize: 38, color: '#555'}}>@você · agora</div>
				</div>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 70, color: C.ink}}>
					{msg.slice(0, n)}
					<span style={{opacity: !sent && caret ? 1 : 0, color: C.pink}}>|</span>
				</div>
				<div
					style={{
						position: 'absolute',
						right: -30,
						bottom: -30,
						width: 96,
						height: 96,
						borderRadius: 48,
						background: C.pink,
						color: 'white',
						fontSize: 54,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						transform: `scale(${heart})`,
						boxShadow: '0 10px 30px rgba(255,62,154,0.6)',
					}}
				>
					♥
				</div>
			</div>
		</AbsoluteFill>
	);
};

export const LaunchDate: React.FC<{dur: number; logoAt: number}> = ({dur, logoAt}) => {
	const l = useSpring(logoAt, 10, 260);
	const d = useSpring(logoAt + 0.35, 14, 260);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<Img
				src={staticFile('img/logo.png')}
				style={{position: 'absolute', left: 540 - 260, top: 560, width: 520, opacity: l, transform: `scale(${interpolate(l, [0, 1], [2.2, 1])})`, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))'}}
			/>
			<div style={{position: 'absolute', top: 980, width: '100%', textAlign: 'center', opacity: d, transform: `translateY(${(1 - d) * 40}px)`}}>
				<Chip bg={C.ink} size={34}>
					LANÇAMENTO OFICIAL · <span style={{color: C.yellow}}>19.11.2026</span>
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

/** Promessa do vídeo visível desde o 1º quadro */
const HookTitle: React.FC<{dur: number}> = ({dur}) => {
	const s = useSpring(0, 13, 260);
	const out = useOut(dur, 3);
	return (
		<AbsoluteFill style={{alignItems: 'center', top: 230, opacity: out}}>
			<div style={{transform: `scale(${interpolate(s, [0, 1], [1.4, 1])})`, opacity: s, textAlign: 'center'}}>
				<div style={{display: 'inline-block', background: C.ink, padding: '6px 26px 0', borderRadius: 12, transform: 'rotate(-3deg)'}}>
					<span style={{fontFamily: DISPLAY, fontSize: 112, letterSpacing: 2, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent'}}>1 HORA PARADO</span>
				</div>
				<div style={{fontFamily: DISPLAY, fontSize: 84, color: 'white', marginTop: 8, textShadow: '0 6px 0 #000'}}>NO GTA 6?</div>
			</div>
		</AbsoluteFill>
	);
};

// ------------------------------------------------------------------ timeline

export const Overlays: React.FC = () => (
	<AbsoluteFill>
		<At from={0} to={2.14}>
			<HookTitle dur={2.14} />
		</At>
		<At from={2.14} to={2.8}>
			<LogoSlam />
		</At>
		<At from={2.8} to={4.22}>
			<BigTimer dur={1.42} mode="hook" />
		</At>
		<At from={13.72} to={14.6}>
			<Stamp text="EXPERIMENTO #01" top={470} />
		</At>
		<At from={15.8} to={16.24}>
			<Stamp text="PARADO" sub="STATUS DO JASON" top={460} color={C.yellow} />
		</At>
		<At from={16.24} to={17.82}>
			<MapPin dur={1.58} />
		</At>
		<At from={17.82} to={22.0}>
			<Checklist start={17.82} dur={4.18} />
		</At>
		<At from={28.9} to={32.0}>
			<Radar dur={3.1} />
		</At>
		<At from={35.2} to={38.2}>
			<Alert dur={3.0} />
		</At>
		<At from={38.2} to={41.36}>
			<TitleCard
				start={38.2}
				top={640}
				lines={[
					{text: 'AGORA VEM', at: 38.26},
					{text: 'A PARTE QUE DEIXA', at: 38.92},
					{text: 'TUDO MAIS', at: 39.58},
					{text: 'INTERESSANTE', at: 40.48, big: true},
				]}
			/>
		</At>
		<At from={42.2} to={43.36}>
			<BigTimer dur={1.16} mode="return" />
		</At>
		<At from={43.36} to={45.7}>
			<Split />
		</At>
		<At from={45.7} to={48.74}>
			<Tracking dur={3.04} />
		</At>
		<At from={50.4} to={53.44}>
			<Ecg dur={3.04} />
		</At>
		<At from={54.3} to={58.7}>
			<NotTested dur={4.4} logoAt={57.78 - 54.3} />
		</At>
		<At from={58.74} to={61.18}>
			<TitleCard
				start={58.74}
				top={640}
				lines={[
					{text: 'MAS AQUI ESTÁ', at: 58.74},
					{text: 'O VERDADEIRO', at: 59.54},
					{text: 'DESAFIO', at: 60.32, big: true},
				]}
			/>
		</At>
		<At from={61.18} to={63.92}>
			<HourRing dur={2.74} />
		</At>
		<At from={63.92} to={65.58}>
			<Controller dur={1.66} />
		</At>
		<At from={68.9} to={72.52}>
			<CommentBubble dur={3.62} typeAt={69.6 - 68.9} />
		</At>
		<At from={72.52} to={74.68}>
			<LaunchDate dur={2.16} logoAt={73.36 - 72.52} />
		</At>
	</AbsoluteFill>
);
