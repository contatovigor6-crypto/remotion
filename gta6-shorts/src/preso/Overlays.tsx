import React from 'react';
import {AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {At, Chip, LogoSlam, Stamp, TitleCard, useOut, useSpring} from '../components/Overlays';
import {C, DISPLAY, GRAD, SAFE, UI, f} from '../theme';

const BLUE = '#2E6BFF';

// ------------------------------------------------------------------ HUD de procurado (estrelas)

/** Nível de procurado (0–5) por tempo da narração; null = HUD oculto */
const wantedLevel = (t: number): number | null => {
	if (t < 3.54) return 5;
	if (t >= 24.16 && t < 31.42) {
		if (t < 25.32) return 1;
		if (t < 26.0) return 2;
		if (t < 26.82) return 3;
		return 5;
	}
	if (t >= 31.42 && t < 35.1) return 0; // sob custódia
	return null;
};

export const WantedHud: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;
	const level = wantedLevel(t);
	if (level === null) return null;
	const custody = t >= 31.42 && t < 35.1;
	const blink = Math.floor(frame / 5) % 2 === 0;
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', top: SAFE.top + 10, left: SAFE.left, display: 'flex', gap: 8}}>
				{[0, 1, 2, 3, 4].map((i) => {
					const on = i < level;
					return (
						<svg key={i} width={66} height={66} viewBox="0 0 24 24" style={{filter: on ? 'drop-shadow(0 0 10px rgba(255,216,74,0.8))' : 'none'}}>
							<path
								d="M12 1.8l3.1 6.4 7 1-5.1 4.9 1.2 7L12 17.8l-6.2 3.3 1.2-7L1.9 9.2l7-1z"
								fill={on ? (blink && level === 5 ? 'white' : C.yellow) : 'rgba(255,255,255,0.15)'}
								stroke="#0B0612"
								strokeWidth={1.4}
							/>
						</svg>
					);
				})}
			</div>
			<div style={{position: 'absolute', top: SAFE.top + 88, left: SAFE.left, fontFamily: UI, fontWeight: 800, fontSize: 28, letterSpacing: 5, color: custody ? C.cyan : 'white', textShadow: '0 2px 8px #000'}}>
				{custody ? 'SOB CUSTÓDIA · HIPÓTESE' : 'NÍVEL DE PROCURADO'}
			</div>
		</AbsoluteFill>
	);
};

// ------------------------------------------------------------------ elementos

/** Luzes de viatura varrendo as bordas (vermelho/azul alternados) */
const SirenLights: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const out = useOut(dur, 6);
	const inO = interpolate(frame, [0, 6], [0, 1], {extrapolateRight: 'clamp'});
	const phase = Math.floor(frame / 4) % 2;
	return (
		<AbsoluteFill style={{opacity: out * inO * 0.55, mixBlendMode: 'screen'}}>
			<AbsoluteFill style={{background: `radial-gradient(ellipse at ${phase ? '0%' : '100%'} 30%, ${phase ? C.red : BLUE} 0%, rgba(0,0,0,0) 55%)`}} />
		</AbsoluteFill>
	);
};

const HookTitle: React.FC<{dur: number}> = ({dur}) => {
	const s = useSpring(0, 13, 260);
	const out = useOut(dur, 3);
	return (
		<AbsoluteFill style={{alignItems: 'center', top: 400, opacity: out}}>
			<div style={{transform: `scale(${interpolate(s, [0, 1], [1.4, 1])})`, opacity: s, textAlign: 'center'}}>
				<div style={{display: 'inline-block', background: C.ink, padding: '6px 26px 0', borderRadius: 12, transform: 'rotate(-3deg)', border: `5px solid ${C.red}`}}>
					<span style={{fontFamily: DISPLAY, fontSize: 120, letterSpacing: 2, color: 'white'}}>PRESO?</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Tela dividida: "PRESO" × "ELIMINADO" */
const Versus: React.FC<{start: number}> = ({start}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const top = spring({frame, fps, config: {damping: 18, stiffness: 200}});
	const bot = spring({frame: frame - f(0.5), fps, config: {damping: 18, stiffness: 200}});
	const s1 = spring({frame: frame - f(11.58 - start), fps, config: {damping: 10, stiffness: 300}});
	const s2 = spring({frame: frame - f(13.54 - start), fps, config: {damping: 10, stiffness: 300}});
	const vs = spring({frame: frame - f(12.16 - start), fps, config: {damping: 9, stiffness: 260}});
	const bars = interpolate(frame, [f(11.58 - start), f(11.58 - start) + 7], [-960, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bounce});
	return (
		<AbsoluteFill style={{background: 'black'}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 960, overflow: 'hidden', transform: `translateX(${(1 - top) * -1080}px)`}}>
				<Img src={staticFile('img/jason-fence.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '72% 50%', filter: 'saturate(0.3) contrast(1.15) brightness(0.8) sepia(0.2) hue-rotate(180deg)'}} />
				<svg width={1080} height={960} style={{position: 'absolute', top: bars, left: 0}}>
					<defs>
						<linearGradient id="bar" x1="0" x2="1">
							<stop offset="0" stopColor="#3a3f48" />
							<stop offset="0.5" stopColor="#c8ced8" />
							<stop offset="1" stopColor="#2a2e35" />
						</linearGradient>
					</defs>
					{Array.from({length: 7}, (_, i) => (
						<rect key={i} x={70 + i * 150} y={0} width={34} height={960} fill="url(#bar)" />
					))}
					<rect x={0} y={250} width={1080} height={26} fill="url(#bar)" />
				</svg>
				<div style={{position: 'absolute', bottom: 70, width: '100%', textAlign: 'center', opacity: s1, transform: `scale(${interpolate(s1, [0, 1], [2, 1])})`}}>
					<span style={{fontFamily: DISPLAY, fontSize: 170, color: C.cyan, textShadow: '0 8px 0 #000, 0 0 40px rgba(56,225,255,0.6)'}}>PRESO</span>
				</div>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 960, height: 960, overflow: 'hidden', transform: `translateX(${(1 - bot) * 1080}px)`}}>
				<OffthreadVideo
					src={staticFile('v2/robbery.mp4')}
					muted
					playbackRate={0.4}
					style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '60% 40%', filter: `grayscale(${s2}) contrast(1.2) brightness(${1 - 0.3 * s2})`}}
				/>
				<AbsoluteFill style={{background: 'rgba(160,0,20,0.55)', opacity: s2, mixBlendMode: 'multiply'}} />
				<div style={{position: 'absolute', top: 60, width: '100%', textAlign: 'center', opacity: s2, transform: `scale(${interpolate(s2, [0, 1], [2, 1])})`}}>
					<span style={{fontFamily: DISPLAY, fontSize: 170, color: C.red, textShadow: '0 8px 0 #000, 0 0 40px rgba(255,45,61,0.6)'}}>ELIMINADO</span>
				</div>
			</div>
			<div style={{position: 'absolute', top: 948, left: 0, right: 0, height: 24, background: GRAD}} />
			<div style={{position: 'absolute', top: 960 - 80, left: 540 - 80, width: 160, height: 160, borderRadius: 80, background: C.ink, border: `6px solid ${C.yellow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${vs}) rotate(${(1 - vs) * 90}deg)`}}>
				<span style={{fontFamily: DISPLAY, fontSize: 80, color: C.yellow}}>VS</span>
			</div>
		</AbsoluteFill>
	);
};

const PoliceTag: React.FC<{dur: number}> = ({dur}) => {
	const s = useSpring(0, 12, 280);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{alignItems: 'center', top: 560, opacity: out}}>
			<div style={{transform: `scale(${interpolate(s, [0, 1], [0.4, 1])})`, opacity: s, display: 'flex', alignItems: 'center', gap: 20, background: 'rgba(11,6,18,0.8)', border: `5px solid ${BLUE}`, borderRadius: 16, padding: '14px 34px'}}>
				<svg width={70} height={80} viewBox="0 0 24 28">
					<path d="M12 1l10 4v8c0 7-4.5 11.5-10 14C6.5 24.5 2 20 2 13V5z" fill={BLUE} stroke="white" strokeWidth={1.5} />
					<path d="M12 8l1.6 3.3 3.6.5-2.6 2.5.6 3.6L12 16.2l-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z" fill="white" />
				</svg>
				<span style={{fontFamily: DISPLAY, fontSize: 96, color: 'white', letterSpacing: 3}}>POLÍCIA</span>
			</div>
		</AbsoluteFill>
	);
};

const NameTag: React.FC<{name: string; dur: number; color: string}> = ({name, dur, color}) => {
	const s = useSpring(0, 12, 300);
	const out = useOut(dur, 3);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', left: SAFE.left, top: 860, transform: `translateX(${(1 - s) * -400}px)`, display: 'flex', alignItems: 'stretch'}}>
				<div style={{width: 14, background: color}} />
				<div style={{background: 'rgba(11,6,18,0.85)', padding: '8px 26px 2px'}}>
					<div style={{fontFamily: UI, fontWeight: 800, fontSize: 24, letterSpacing: 6, color}}>PROTAGONISTA</div>
					<div style={{fontFamily: DISPLAY, fontSize: 84, color: 'white', lineHeight: 1.05}}>{name}</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Grades de cela caindo sobre a imagem */
const Bars: React.FC<{dropAt: number; dur: number}> = ({dropAt, dur}) => {
	const frame = useCurrentFrame();
	const out = useOut(dur, 4);
	const y = interpolate(frame, [f(dropAt), f(dropAt) + 8], [-1920, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bounce});
	return (
		<AbsoluteFill style={{opacity: out}}>
			<AbsoluteFill style={{background: 'rgba(0,0,0,0.25)', opacity: frame >= f(dropAt) ? 1 : 0}} />
			<svg width={1080} height={1920} style={{position: 'absolute', top: y, left: 0, filter: 'drop-shadow(12px 0 14px rgba(0,0,0,0.7))'}}>
				<defs>
					<linearGradient id="bar2" x1="0" x2="1">
						<stop offset="0" stopColor="#2b3038" />
						<stop offset="0.45" stopColor="#d9dee6" />
						<stop offset="1" stopColor="#22262c" />
					</linearGradient>
				</defs>
				{Array.from({length: 6}, (_, i) => (
					<rect key={i} x={60 + i * 190} y={0} width={44} height={1920} fill="url(#bar2)" />
				))}
				<rect x={0} y={330} width={1080} height={34} fill="url(#bar2)" />
				<rect x={0} y={1500} width={1080} height={34} fill="url(#bar2)" />
			</svg>
		</AbsoluteFill>
	);
};

/** Minimapa: viaturas convergindo e rotas de fuga sendo bloqueadas */
const Minimap: React.FC<{dur: number; blockAt: number}> = ({dur, blockAt}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 14, 220);
	const out = useOut(dur);
	const R = 330;
	const cx = 540;
	const cy = 760;
	const close = interpolate(frame, [0, f(dur)], [1, 0.38], {easing: Easing.out(Easing.quad)});
	const cops = [20, 95, 160, 230, 300].map((a, i) => {
		const ang = ((a + frame * 0.6) * Math.PI) / 180;
		const r = R * (0.9 - i * 0.04) * close;
		return {x: cx + Math.cos(ang) * r, y: cy + Math.sin(ang) * r, c: i % 2 ? BLUE : C.red};
	});
	const routes = [-60, 30, 140, 215];
	const blocked = (i: number) => frame >= f(blockAt) + i * 3;
	const flash = Math.floor(frame / 4) % 2 === 0;
	return (
		<AbsoluteFill style={{opacity: out}}>
			<svg width={1080} height={1920} style={{position: 'absolute', transform: `scale(${interpolate(s, [0, 1], [0.7, 1])})`, transformOrigin: `${cx}px ${cy}px`, opacity: s}}>
				<defs>
					<clipPath id="mapclip">
						<circle cx={cx} cy={cy} r={R} />
					</clipPath>
				</defs>
				<circle cx={cx} cy={cy} r={R + 14} fill="rgba(11,6,18,0.85)" stroke="white" strokeWidth={6} />
				<g clipPath="url(#mapclip)">
					{Array.from({length: 9}, (_, i) => (
						<React.Fragment key={i}>
							<line x1={cx - R + i * 82} y1={cy - R} x2={cx - R + i * 82 - 60} y2={cy + R} stroke="rgba(255,255,255,0.12)" strokeWidth={10} />
							<line x1={cx - R} y1={cy - R + i * 82} x2={cx + R} y2={cy - R + i * 82 + 40} stroke="rgba(255,255,255,0.12)" strokeWidth={10} />
						</React.Fragment>
					))}
					{routes.map((a, i) => {
						const ang = (a * Math.PI) / 180;
						const x2 = cx + Math.cos(ang) * R;
						const y2 = cy + Math.sin(ang) * R;
						const b = blocked(i);
						return (
							<g key={a}>
								<line x1={cx} y1={cy} x2={x2} y2={y2} stroke={b ? C.red : C.yellow} strokeWidth={12} strokeDasharray={b ? '0' : '26 16'} strokeDashoffset={-frame * 3} opacity={0.9} />
								{b ? (
									<g transform={`translate(${cx + Math.cos(ang) * R * 0.7} ${cy + Math.sin(ang) * R * 0.7})`}>
										<circle r={30} fill={C.red} />
										<path d="M-13 -13 L13 13 M13 -13 L-13 13" stroke="white" strokeWidth={8} strokeLinecap="round" />
									</g>
								) : null}
							</g>
						);
					})}
					{cops.map((c, i) => (
						<circle key={i} cx={c.x} cy={c.y} r={20} fill={flash ? c.c : 'white'} stroke="#000" strokeWidth={3} />
					))}
				</g>
				<path d={`M${cx} ${cy - 30} L${cx + 22} ${cy + 22} L${cx} ${cy + 10} L${cx - 22} ${cy + 22} Z`} fill="white" stroke={C.ink} strokeWidth={4} />
			</svg>
			<div style={{position: 'absolute', top: 330, width: '100%', textAlign: 'center', opacity: frame >= f(blockAt) ? 1 : 0}}>
				<Chip bg={C.red} size={34}>
					ROTA DE FUGA: BLOQUEADA
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

/** Ficha policial (régua de altura + placa) — explicitamente hipotética */
const Mugshot: React.FC<{dur: number; flashAt: number}> = ({dur, flashAt}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 14, 220);
	const p = useSpring(0.5, 13, 240);
	const out = useOut(dur);
	const flash = interpolate(frame, [f(flashAt) - 1, f(flashAt), f(flashAt) + 5], [0, 0.85, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{opacity: out}}>
			<AbsoluteFill style={{opacity: s * 0.8}}>
				{Array.from({length: 10}, (_, i) => (
					<div key={i} style={{position: 'absolute', left: 0, right: 0, top: 260 + i * 80, height: i % 2 ? 2 : 4, background: 'rgba(255,255,255,0.55)'}}>
						{i % 2 === 0 ? <span style={{position: 'absolute', left: SAFE.left, top: 6, fontFamily: UI, fontWeight: 800, fontSize: 26, color: 'white', textShadow: '0 2px 6px #000'}}>{`2,${String(10 - i).padStart(2, '0')}`}</span> : null}
					</div>
				))}
			</AbsoluteFill>
			<div style={{position: 'absolute', top: 910, width: '100%', display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - p) * 300}px)`, opacity: p}}>
				<div style={{background: '#101014', border: '4px solid white', padding: '10px 36px', textAlign: 'center'}}>
					<div style={{fontFamily: UI, fontWeight: 800, fontSize: 26, letterSpacing: 8, color: C.yellow}}>CENÁRIO HIPOTÉTICO</div>
					<div style={{fontFamily: DISPLAY, fontSize: 80, color: 'white', letterSpacing: 4, lineHeight: 1.1}}>SOB CUSTÓDIA</div>
				</div>
			</div>
			<AbsoluteFill style={{background: 'white', opacity: flash}} />
		</AbsoluteFill>
	);
};

const LOSSES: [string, number, boolean][] = [
	['$ DINHEIRO', 38.1, false],
	['EQUIPAMENTOS', 39.7, true],
];
const Losses: React.FC<{start: number; dur: number}> = ({start, dur}) => {
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 470, left: SAFE.left, right: 140}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 28, letterSpacing: 6, color: C.yellow, marginBottom: 14, textShadow: '0 2px 8px #000'}}>POSSÍVEIS CONSEQUÊNCIAS</div>
				{LOSSES.map(([label, at, stamp]) => (
					<LossRow key={label} label={label} delay={at - start} stamp={stamp} />
				))}
			</div>
		</AbsoluteFill>
	);
};
const LossRow: React.FC<{label: string; delay: number; stamp: boolean}> = ({label, delay, stamp}) => {
	const frame = useCurrentFrame();
	const s = useSpring(delay, 12, 300);
	const st = useSpring(delay + 0.05, 9, 320);
	if (frame < f(delay)) return null;
	return (
		<div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 20, margin: '12px 0', background: 'rgba(11,6,18,0.82)', padding: '10px 24px', borderRadius: 10, opacity: s, transform: `translateX(${(1 - s) * -80}px)`}}>
			<span style={{fontFamily: DISPLAY, fontSize: 70, color: C.red}}>−</span>
			<span style={{fontFamily: DISPLAY, fontSize: 70, color: 'white', letterSpacing: 2}}>{label}</span>
			{stamp ? (
				<div style={{position: 'absolute', right: 10, top: 40, border: `8px solid ${C.red}`, color: C.red, fontFamily: DISPLAY, fontSize: 92, padding: '0 16px', transform: `rotate(-10deg) scale(${interpolate(st, [0, 1], [2.4, 1])})`, opacity: st, background: 'rgba(11,6,18,0.7)'}}>
					CONFISCADO
				</div>
			) : null}
		</div>
	);
};

const Pause: React.FC<{dur: number; detailAt: number}> = ({dur, detailAt}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 10, 300);
	const d = useSpring(detailAt, 12, 220);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 430, width: '100%', display: 'flex', justifyContent: 'center', gap: 34, transform: `scale(${interpolate(s, [0, 1], [1.6, 1])})`, opacity: s * (frame < f(detailAt) ? 1 : 0.0)}}>
				<div style={{width: 70, height: 230, background: 'white', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.6)'}} />
				<div style={{width: 70, height: 230, background: 'white', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.6)'}} />
			</div>
			<div style={{position: 'absolute', top: 360, left: 540 - 220, width: 440, height: 440, borderRadius: 220, border: `14px solid ${C.yellow}`, transform: `scale(${d})`, opacity: d, boxShadow: '0 0 0 2000px rgba(0,0,0,0.45)'}} />
			<div style={{position: 'absolute', top: 735, left: 540 + 120, width: 46, height: 200, background: C.yellow, borderRadius: 20, transform: `rotate(-40deg) scale(${d})`, transformOrigin: 'top center', opacity: d}} />
			<div style={{position: 'absolute', top: 290, width: '100%', textAlign: 'center', opacity: d}}>
				<Chip bg={C.yellow} color={C.ink} size={36}>
					O DETALHE
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

export const NotConfirmed: React.FC<{dur: number; rockstarAt: number}> = ({dur, rockstarAt}) => {
	const s = useSpring(0, 10, 300);
	const r = useSpring(rockstarAt, 12, 260);
	const out = useOut(dur);
	const tape = 'repeating-linear-gradient(-45deg, #FF2D3D 0 26px, #0B0612 26px 52px)';
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 480, width: '100%', display: 'flex', justifyContent: 'center'}}>
				<div style={{transform: `rotate(-5deg) scale(${interpolate(s, [0, 1], [2, 1])})`, opacity: s, padding: 12, background: tape, borderRadius: 10}}>
					<div style={{background: C.ink, padding: '14px 40px', borderRadius: 4, textAlign: 'center'}}>
						<div style={{fontFamily: DISPLAY, fontSize: 110, color: 'white', letterSpacing: 3, lineHeight: 1.05}}>NÃO CONFIRMADO</div>
						<div style={{fontFamily: UI, fontWeight: 800, fontSize: 30, color: C.red, letterSpacing: 6, opacity: r}}>SEM ANÚNCIO OFICIAL DA ROCKSTAR</div>
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

const Awaiting: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 14, 220);
	const out = useOut(dur);
	const x = ((frame * 14) % 900) - 300;
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 500, left: SAFE.left, right: 140, background: 'rgba(11,6,18,0.85)', borderRadius: 16, padding: '28px 34px', borderLeft: `10px solid ${C.yellow}`, transform: `translateY(${(1 - s) * 60}px)`, opacity: s}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 28, letterSpacing: 6, color: C.yellow}}>SISTEMA DE PRISÃO</div>
				<div style={{fontFamily: DISPLAY, fontSize: 74, color: 'white', lineHeight: 1.15, marginTop: 6}}>AGUARDANDO CONFIRMAÇÃO</div>
				<div style={{marginTop: 20, height: 18, borderRadius: 9, background: 'rgba(255,255,255,0.15)', overflow: 'hidden', position: 'relative'}}>
					<div style={{position: 'absolute', left: x, width: 300, height: '100%', background: GRAD, borderRadius: 9}} />
				</div>
			</div>
		</AbsoluteFill>
	);
};

const VERDICT: [string, string, boolean, number][] = [
	['SITUAÇÕES DE CAPTURA', 'PODEM EXISTIR', true, 65.56],
	['SISTEMA DE PRISÃO', 'SEM CONFIRMAÇÃO', false, 68.16],
];
const Verdict: React.FC<{start: number; dur: number}> = ({start, dur}) => {
	const out = useOut(dur);
	const s = useSpring(0, 14, 220);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 430, left: SAFE.left, right: 140, opacity: s}}>
				<div style={{fontFamily: DISPLAY, fontSize: 80, color: 'white', textShadow: '0 6px 0 #000', marginBottom: 10}}>A RESPOSTA</div>
				{VERDICT.map(([label, value, ok, at]) => (
					<VerdictRow key={label} label={label} value={value} ok={ok} delay={at - start} />
				))}
			</div>
		</AbsoluteFill>
	);
};
const VerdictRow: React.FC<{label: string; value: string; ok: boolean; delay: number}> = ({label, value, ok, delay}) => {
	const frame = useCurrentFrame();
	const s = useSpring(delay, 12, 300);
	if (frame < f(delay)) return null;
	const color = ok ? C.yellow : C.red;
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 22, background: 'rgba(11,6,18,0.85)', borderRadius: 12, padding: '16px 24px', margin: '14px 0', opacity: s, transform: `translateX(${(1 - s) * -100}px)`}}>
			<div style={{width: 76, height: 76, borderRadius: 38, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transform: `scale(${interpolate(s, [0, 1], [1.8, 1])})`}}>
				<span style={{fontFamily: UI, fontWeight: 800, fontSize: 46, color: C.ink}}>{ok ? '?' : '✕'}</span>
			</div>
			<div>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 26, letterSpacing: 4, color: 'rgba(255,255,255,0.8)'}}>{label}</div>
				<div style={{fontFamily: DISPLAY, fontSize: 64, color, lineHeight: 1.1}}>{value}</div>
			</div>
		</div>
	);
};

export const Poll: React.FC<{start: number; aAt: number; bAt: number; a: string; b: string}> = ({start, aAt, bAt, a: aText, b: bText}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 14, 240);
	const a = useSpring(aAt - start, 11, 280);
	const b = useSpring(bAt - start, 11, 280);
	const pulse = 1 + 0.03 * Math.sin(frame / 4);
	const option = (letter: string, text: string, p: number, color: string) => (
		<div style={{display: 'flex', alignItems: 'center', gap: 22, background: 'rgba(255,255,255,0.96)', borderRadius: 20, padding: '18px 26px', margin: '18px 0', opacity: p, transform: `translateX(${(1 - p) * 200}px)`, boxShadow: '0 16px 40px rgba(0,0,0,0.45)'}}>
			<div style={{width: 84, height: 84, borderRadius: 16, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
				<span style={{fontFamily: DISPLAY, fontSize: 64, color: 'white'}}>{letter}</span>
			</div>
			<span style={{fontFamily: DISPLAY, fontSize: 62, color: C.ink, lineHeight: 1.05}}>{text}</span>
		</div>
	);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', top: 360, left: SAFE.left, right: 140, opacity: s, transform: `translateY(${(1 - s) * 50}px)`}}>
				<div style={{display: 'inline-block', background: C.pink, color: 'white', fontFamily: UI, fontWeight: 800, fontSize: 34, letterSpacing: 6, padding: '10px 22px', borderRadius: 10, transform: `scale(${pulse})`, transformOrigin: 'left center'}}>
					COMENTE A OU B
				</div>
				{option('A', aText, a, '#1FA7C9')}
				{option('B', bText, b, C.red)}
			</div>
		</AbsoluteFill>
	);
};

export const Flash: React.FC = () => {
	const frame = useCurrentFrame();
	return <AbsoluteFill style={{background: 'white', opacity: interpolate(frame, [0, 6], [0.75, 0], {extrapolateRight: 'clamp'})}} />;
};

// ------------------------------------------------------------------ timeline

export const PresoOverlays: React.FC = () => (
	<AbsoluteFill>
		<At from={0} to={1.32}>
			<SirenLights dur={1.32} />
		</At>
		<At from={0.94} to={1.32}>
			<HookTitle dur={0.38} />
		</At>
		<At from={2.32} to={3.54}>
			<LogoSlam />
		</At>
		<At from={4.86} to={5.5}>
			<Stamp text="CAPTURADO" top={470} color={C.cyan} />
		</At>
		<At from={10.9} to={15.3}>
			<Versus start={10.9} />
		</At>
		<At from={15.3} to={17.4}>
			<SirenLights dur={2.1} />
		</At>
		<At from={16.68} to={17.4}>
			<PoliceTag dur={0.72} />
		</At>
		<At from={21.0} to={21.54}>
			<NameTag name="JASON" dur={0.54} color={C.orange} />
		</At>
		<At from={21.54} to={22.72}>
			<NameTag name="LUCIA" dur={1.18} color={C.pink} />
		</At>
		<At from={22.72} to={24.16}>
			<Bars dropAt={23.32 - 22.72} dur={1.44} />
		</At>
		<At from={25.84} to={30.2}>
			<SirenLights dur={4.36} />
		</At>
		<At from={27.56} to={30.2}>
			<Minimap dur={2.64} blockAt={28.96 - 27.56} />
		</At>
		<At from={31.42} to={35.1}>
			<Mugshot dur={3.68} flashAt={34.12 - 31.42} />
		</At>
		<At from={37.7} to={40.58}>
			<Losses start={37.7} dur={2.88} />
		</At>
		<At from={43.26} to={43.6}>
			<Flash />
		</At>
		<At from={44.26} to={48.6}>
			<Pause dur={4.34} detailAt={46.18 - 44.26} />
		</At>
		<At from={50.94} to={54.3}>
			<NotConfirmed dur={3.36} rockstarAt={53.34 - 50.94} />
		</At>
		<At from={54.84} to={58.3}>
			<Awaiting dur={3.46} />
		</At>
		<At from={62.45} to={64.3}>
			<TitleCard
				start={62.45}
				top={700}
				lines={[
					{text: 'E A RESPOSTA', at: 62.8},
					{text: 'É ESSA', at: 63.44, big: true},
				]}
			/>
		</At>
		<At from={64.3} to={72.6}>
			<Verdict start={64.3} dur={8.3} />
		</At>
		<At from={73.3} to={82.6}>
			<Poll start={73.3} aAt={76.6} bAt={79.2} a="PRISÃO COM FUGA POSSÍVEL" b="SÓ ATRAPALHARIA A DIVERSÃO" />
		</At>
	</AbsoluteFill>
);
