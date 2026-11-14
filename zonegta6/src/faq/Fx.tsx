import React from 'react';
import {AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {body, C, display, mono} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const usePop = (at: number, damping = 12) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({frame: frame - at, fps, config: {damping, mass: 0.6}});
};

// ── Partículas de neon subindo (profundidade sobre o fundo) ───
export const Particles: React.FC<{accent: string}> = ({accent}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{Array.from({length: 38}).map((_, i) => {
				const speed = 1.2 + random(`ps${i}`) * 3;
				const size = 3 + random(`pz${i}`) * 7;
				const y = 1920 - ((frame * speed + random(`py${i}`) * 1920) % 2000);
				const x = random(`px${i}`) * 1080 + Math.sin(frame / 40 + i) * 30;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							width: size,
							height: size,
							borderRadius: size,
							background: i % 3 === 0 ? C.white : accent,
							opacity: 0.15 + random(`po${i}`) * 0.4,
							filter: `blur(${size > 7 ? 3 : 0.5}px)`,
							boxShadow: `0 0 ${size * 2}px ${accent}`,
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};

// ── Pulso de luz nas bordas, no tempo da música ──────────────
export const BeatPulse: React.FC<{accent: string; start: number; end: number; period: number}> = ({accent, start, end, period}) => {
	const frame = useCurrentFrame();
	if (frame < start || frame >= end) return null;
	const phase = ((frame - start) % period) / period;
	const strength = Math.exp(-phase * 5);
	return (
		<AbsoluteFill
			style={{
				pointerEvents: 'none',
				boxShadow: `inset 0 0 ${120 + strength * 120}px ${accent}`,
				opacity: 0.12 + strength * 0.3,
			}}
		/>
	);
};

// ── Transição entre blocos: faixas que fecham e abrem no corte ─
export const Transition: React.FC<{at: number; kind: number; accent: string}> = ({at, kind, accent}) => {
	const frame = useCurrentFrame();
	const f = frame - at;
	if (f < -7 || f > 9) return null;
	if (kind % 3 === 2) {
		// Flash com zoom radial.
		const o = interpolate(f, [-5, 0, 8], [0, 1, 0], clamp);
		return (
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle, ${C.white} 0%, ${accent} ${30 + o * 40}%, transparent ${60 + o * 40}%)`,
					opacity: o,
					mixBlendMode: 'screen',
				}}
			/>
		);
	}
	const horizontal = kind % 3 === 0;
	const N = 7;
	return (
		<AbsoluteFill>
			{Array.from({length: N}).map((_, i) => {
				const lag = (i % 3) - 1;
				const closing = interpolate(f, [-7 + lag, -1 + lag], [0, 1], {...clamp, easing: easeOut});
				const opening = interpolate(f, [1 + lag, 8 + lag], [1, 0], {...clamp, easing: easeOut});
				const s = f + lag < 0 ? closing : opening;
				const fromStart = (f + lag < 0) === (i % 2 === 0);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							background: i % 2 === 0 ? accent : C.bg,
							...(horizontal
								? {left: 0, right: 0, top: `${(i / N) * 100}%`, height: `${100 / N + 0.2}%`, transform: `scaleX(${s})`, transformOrigin: fromStart ? 'left' : 'right'}
								: {top: 0, bottom: 0, left: `${(i / N) * 100}%`, width: `${100 / N + 0.2}%`, transform: `scaleY(${s})`, transformOrigin: fromStart ? 'top' : 'bottom'}),
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};

// ── Título cinético: cada palavra sobe girando, em cascata ───
export const KineticTitle: React.FC<{text: string; delay: number; size: number; color?: string}> = ({text, delay, size, color = C.white}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<div style={{fontFamily: display, fontSize: size, lineHeight: 1.02, color, textTransform: 'uppercase', display: 'flex', flexWrap: 'wrap', gap: '0 0.22em'}}>
			{text.split(' ').map((w, i) => {
				const p = spring({frame: frame - delay - i * 3, fps, config: {damping: 11, mass: 0.6}});
				return (
					<span key={i} style={{overflow: 'hidden', display: 'inline-block', paddingBottom: 6}}>
						<span
							style={{
								display: 'inline-block',
								transform: `translateY(${(1 - p) * 110}%) rotate(${(1 - p) * 8}deg)`,
								filter: `blur(${interpolate(p, [0, 0.8, 1], [10, 1, 0], clamp)}px)`,
								textShadow: `${(1 - p) * 14}px 0 ${C.pink}, ${-(1 - p) * 14}px 0 ${C.cyan}`,
							}}
						>
							{w}
						</span>
					</span>
				);
			})}
		</div>
	);
};

// ── Selo de "feito": círculo e visto desenhados ──────────────
export const Check: React.FC<{at: number; accent: string; size?: number}> = ({at, accent, size = 150}) => {
	const frame = useCurrentFrame();
	const p = usePop(at, 9);
	const draw = interpolate(frame, [at + 2, at + 12], [0, 1], clamp);
	if (frame < at) return null;
	return (
		<svg width={size} height={size} viewBox="0 0 100 100" style={{transform: `scale(${p}) rotate(${(1 - p) * -30}deg)`, filter: `drop-shadow(0 0 18px ${accent})`}}>
			<circle cx="50" cy="50" r="44" fill="rgba(6,6,12,0.85)" stroke={accent} strokeWidth="7" />
			<path d="M28 52 L44 68 L74 34" fill="none" stroke={accent} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="70" strokeDashoffset={70 * (1 - draw)} />
		</svg>
	);
};

// ── Logo em texto animada (usada até o arquivo da logo chegar) ─
export const LogoSting: React.FC<{at: number}> = ({at}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const sweep = interpolate(frame, [at + 8, at + 34], [-40, 140], clamp);
	const chars = 'ZONEGTA6'.split('');
	return (
		<div style={{position: 'relative', display: 'inline-block'}}>
			<div style={{fontFamily: display, fontSize: 170, letterSpacing: 4, lineHeight: 1, display: 'flex'}}>
				{chars.map((ch, i) => {
					const p = spring({frame: frame - at - i * 2, fps, config: {damping: 9, mass: 0.6}});
					const col = i < 4 ? C.white : C.pink;
					return (
						<span key={i} style={{display: 'inline-block', color: col, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 90}px) scale(${0.4 + p * 0.6})`, textShadow: `0 0 ${40 * p}px ${col}88`}}>
							{ch}
						</span>
					);
				})}
			</div>
			<div style={{position: 'absolute', inset: 0, background: `linear-gradient(100deg, transparent ${sweep - 14}%, rgba(255,255,255,0.75) ${sweep}%, transparent ${sweep + 14}%)`, mixBlendMode: 'overlay'}} />
			<div style={{height: 8, marginTop: 6, background: `linear-gradient(90deg, ${C.cyan}, ${C.pink})`, transform: `scaleX(${interpolate(frame, [at + 10, at + 30], [0, 1], {...clamp, easing: easeOut})})`, transformOrigin: 'left'}} />
		</div>
	);
};

// ── Infográficos por passo ───────────────────────────────────
const Box: React.FC<{accent: string; at: number; title: string; children: React.ReactNode}> = ({accent, at, title, children}) => {
	const p = usePop(at, 14);
	return (
		<div
			style={{
				height: 380,
				background: 'rgba(10,10,22,0.78)',
				border: `1px solid ${accent}55`,
				borderLeft: `8px solid ${accent}`,
				padding: '26px 34px',
				opacity: p,
				transform: `translateY(${(1 - p) * 80}px) perspective(900px) rotateX(${(1 - p) * 25}deg)`,
				display: 'flex',
				flexDirection: 'column',
				gap: 18,
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			<div style={{fontFamily: mono, fontSize: 26, color: accent, letterSpacing: 5}}>{title}</div>
			{children}
		</div>
	);
};

const Chip: React.FC<{at: number; color: string; children: React.ReactNode}> = ({at, color, children}) => {
	const p = usePop(at, 10);
	return (
		<div style={{fontFamily: mono, fontWeight: 700, fontSize: 30, color: C.bg, background: color, padding: '8px 18px', borderRadius: 6, transform: `scale(${p})`, opacity: Math.min(1, p * 2), boxShadow: `0 0 24px ${color}88`, whiteSpace: 'nowrap'}}>
			{children}
		</div>
	);
};

const big = (color: string, size = 96): React.CSSProperties => ({fontFamily: display, fontSize: size, lineHeight: 1, color});
const label: React.CSSProperties = {fontFamily: body, fontWeight: 600, fontSize: 34, color: C.white};

export const hasInfographic = (id: string) => ['espaco', 'predownload', 'bonus', 'horario', 'fps', 'legendas', 'xboxone'].includes(id);

export const Infographic: React.FC<{id: string; a: number; accent: string}> = ({id, a, accent}) => {
	const frame = useCurrentFrame();
	const at = a + 6;
	if (id === 'espaco') {
		const gta = interpolate(frame, [at + 6, at + 60], [0, 1], {...clamp, easing: easeOut});
		const del = interpolate(frame, [a + 150, a + 165], [0, 1], clamp);
		return (
			<Box accent={accent} at={at} title="ARMAZENAMENTO DO CONSOLE">
				<div style={{display: 'flex', height: 74, border: `3px solid ${C.dim}`, padding: 5, gap: 5}}>
					<div style={{width: `${34 - del * 14}%`, background: 'rgba(255,255,255,0.3)'}} />
					<div style={{width: `${gta * 46}%`, background: `repeating-linear-gradient(45deg, ${accent}, ${accent} 16px, ${accent}aa 16px, ${accent}aa 32px)`, backgroundPosition: `${frame * 3}px 0`, boxShadow: `0 0 30px ${accent}`}} />
				</div>
				<div style={{display: 'flex', alignItems: 'baseline', gap: 20}}>
					<div style={big(accent, 120)}>{Math.round(gta * 200)}+ GB</div>
					<div style={label}>só de GTA VI</div>
				</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 18, opacity: interpolate(frame, [a + 100, a + 112], [0, 1], clamp)}}>
					<div style={{...label, textDecoration: del > 0.5 ? 'line-through' : 'none', opacity: 1 - del * 0.5, transform: `translateX(${Math.sin(frame * 2) * (del > 0 && del < 1 ? 8 : 0)}px)`}}>
						Jogo parado desde 2020
					</div>
					<Chip at={a + 156} color={C.red}>APAGADO</Chip>
				</div>
			</Box>
		);
	}
	if (id === 'predownload') {
		const p = interpolate(frame, [at + 6, at + 106], [0, 1], {...clamp, easing: (t) => t * t * (3 - 2 * t)});
		return (
			<Box accent={accent} at={at} title="PRÉ-DOWNLOAD · VERSÃO DIGITAL">
				<div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
					<div style={big(p >= 1 ? C.green : C.white, 120)}>{Math.round(p * 100)}%</div>
					<div style={{fontFamily: mono, fontSize: 30, color: C.dim}}>{p >= 1 ? 'CONCLUÍDO' : `BAIXANDO${'.'.repeat(1 + (Math.floor(frame / 8) % 3))}`}</div>
				</div>
				<div style={{height: 46, border: `3px solid ${p >= 1 ? C.green : accent}`, padding: 5}}>
					<div style={{height: '100%', width: `${p * 100}%`, background: p >= 1 ? C.green : accent, boxShadow: `0 0 26px ${p >= 1 ? C.green : accent}`}} />
				</div>
				<div style={{display: 'flex', gap: 16}}>
					<Chip at={at + 108} color={C.green}>PRONTO PARA JOGAR NO DIA 19</Chip>
				</div>
			</Box>
		);
	}
	if (id === 'bonus') {
		const card = (n: number, start: number, title: string, sub: string, color: string) => {
			const p = spring({frame: frame - start, fps: 30, config: {damping: 12, mass: 0.7}});
			return (
				<div style={{flex: 1, background: `linear-gradient(160deg, ${color}33, rgba(6,6,12,0.9))`, border: `2px solid ${color}`, padding: '22px 24px', transform: `perspective(800px) rotateY(${(1 - p) * 90}deg) scale(${0.8 + p * 0.2})`, opacity: Math.min(1, p * 2), boxShadow: `0 0 30px ${color}55`}}>
					<div style={{fontFamily: mono, fontSize: 24, color, letterSpacing: 4}}>BÔNUS {n}</div>
					<div style={{...big(C.white, 62), marginTop: 10}}>{title}</div>
					<div style={{...label, fontSize: 28, color: C.dim, marginTop: 8}}>{sub}</div>
				</div>
			);
		};
		return (
			<Box accent={accent} at={at} title="PRÉ-VENDA · ATÉ 19/11">
				<div style={{display: 'flex', gap: 22, flex: 1}}>
					{card(1, at + 4, 'VINTAGE VICE CITY', 'pacote de itens', C.pink)}
					{card(2, a + 75, '1 MÊS DE GTA+', 'assinatura', C.cyan)}
				</div>
			</Box>
		);
	}
	if (id === 'horario') {
		const spin = spring({frame: frame - at, fps: 30, config: {damping: 14, mass: 1.2}});
		const br = interpolate(frame, [a + 88, a + 100], [0, 1], clamp);
		return (
			<Box accent={accent} at={at} title="LIBERAÇÃO · 19 NOV">
				<div style={{display: 'flex', alignItems: 'center', gap: 40}}>
					<svg width={250} height={250} viewBox="0 0 100 100" style={{filter: `drop-shadow(0 0 16px ${accent})`}}>
						<circle cx="50" cy="50" r="45" fill="rgba(6,6,12,0.8)" stroke={accent} strokeWidth="4" />
						{Array.from({length: 12}).map((_, i) => (
							<line key={i} x1="50" y1="9" x2="50" y2={i % 3 === 0 ? 17 : 13} stroke={C.white} strokeWidth={i % 3 === 0 ? 3 : 1.5} transform={`rotate(${i * 30} 50 50)`} />
						))}
						<line x1="50" y1="50" x2="50" y2="26" stroke={C.white} strokeWidth="5" strokeLinecap="round" transform={`rotate(${(1 - spin) * -220} 50 50)`} />
						<line x1="50" y1="50" x2="50" y2="14" stroke={accent} strokeWidth="3" strokeLinecap="round" transform={`rotate(${(1 - spin) * 1080} 50 50)`} />
						<circle cx="50" cy="50" r="4" fill={C.white} />
					</svg>
					<div>
						<div style={big(C.white, 150)}>00:00</div>
						<div style={{fontFamily: mono, fontSize: 28, color: C.dim, letterSpacing: 3}}>NO HORÁRIO LOCAL</div>
						<div style={{...label, marginTop: 14, opacity: br, transform: `translateX(${(1 - br) * 30}px)`, color: accent}}>Brasil: 0h de Brasília</div>
					</div>
				</div>
			</Box>
		);
	}
	if (id === 'fps') {
		const fill = interpolate(frame, [at + 4, at + 30], [0, 1], {...clamp, easing: easeOut});
		const strike = interpolate(frame, [at + 14, at + 24], [0, 1], clamp);
		const row = (n: number, w: number, on: boolean) => (
			<div style={{display: 'flex', alignItems: 'center', gap: 20}}>
				<div style={{...big(on ? accent : C.dim, 70), width: 190, position: 'relative'}}>
					{n} FPS
					{!on ? <div style={{position: 'absolute', left: 0, top: '48%', height: 6, width: `${strike * 100}%`, background: C.red}} /> : null}
				</div>
				<div style={{flex: 1, height: 40, background: 'rgba(255,255,255,0.1)'}}>
					<div style={{height: '100%', width: `${w * fill * 100}%`, background: on ? accent : 'rgba(255,255,255,0.25)', boxShadow: on ? `0 0 26px ${accent}` : undefined}} />
				</div>
			</div>
		);
		return (
			<Box accent={accent} at={at} title="META DE DESEMPENHO · TODOS OS CONSOLES">
				{row(60, 1, false)}
				{row(30, 0.5, true)}
				<div style={{display: 'flex', gap: 14, marginTop: 6}}>
					<Chip at={a + 112} color={C.white}>PS5 PRO</Chip>
					<Chip at={a + 150} color={C.cyan}>+ NITIDEZ</Chip>
					<Chip at={a + 178} color={C.pink}>SOMBRAS RT</Chip>
				</div>
			</Box>
		);
	}
	if (id === 'legendas') {
		const on = spring({frame: frame - (a + 45), fps: 30, config: {damping: 12}});
		const text = '— Legendas em português: ligadas.';
		const typed = text.slice(0, Math.max(0, Math.floor((frame - (a + 52)) * 1.1)));
		return (
			<Box accent={accent} at={at} title="IDIOMAS">
				<div style={{display: 'flex', alignItems: 'center', gap: 20}}>
					<div style={{...label, width: 200}}>Áudio</div>
					<Chip at={at + 6} color={C.white}>EN</Chip>
					<div style={{display: 'flex', alignItems: 'center', gap: 6, height: 56}}>
						{Array.from({length: 18}).map((_, i) => (
							<div key={i} style={{width: 8, height: 10 + Math.abs(Math.sin(frame / 3 + i * 1.3)) * 44, background: C.dim}} />
						))}
					</div>
				</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 20}}>
					<div style={{...label, width: 200}}>Legendas</div>
					<Chip at={at + 12} color={accent}>PT-BR</Chip>
					<div style={{width: 110, height: 54, borderRadius: 54, background: on > 0.5 ? accent : 'rgba(255,255,255,0.2)', padding: 6, boxShadow: on > 0.5 ? `0 0 24px ${accent}` : undefined}}>
						<div style={{width: 42, height: 42, borderRadius: 42, background: C.white, transform: `translateX(${on * 56}px)`}} />
					</div>
					<div style={{fontFamily: mono, fontSize: 28, color: on > 0.5 ? accent : C.dim}}>{on > 0.5 ? 'LIGADAS' : 'DESLIGADAS'}</div>
				</div>
				<div style={{background: 'rgba(0,0,0,0.75)', padding: '14px 22px', fontFamily: body, fontWeight: 600, fontSize: 36, color: C.white, minHeight: 72}}>
					{typed}
					<span style={{opacity: Math.floor(frame / 8) % 2}}>▌</span>
				</div>
			</Box>
		);
	}
	if (id === 'xboxone') {
		return (
			<Box accent={accent} at={at} title="XBOX CLOUD GAMING">
				<div style={{display: 'flex', alignItems: 'center', gap: 40}}>
					<svg width={300} height={250} viewBox="0 0 120 100">
						<g fill={accent} style={{filter: `drop-shadow(0 0 6px ${accent})`}} transform={`translate(0 ${Math.sin(frame / 12) * 2})`}>
							<circle cx="42" cy="30" r="16" />
							<circle cx="62" cy="24" r="20" />
							<circle cx="82" cy="32" r="14" />
							<rect x="28" y="30" width="68" height="16" rx="8" />
						</g>
						{[44, 60, 76].map((x, i) => (
							<line key={x} x1={x} y1="52" x2={x} y2="74" stroke={C.white} strokeWidth="3" strokeDasharray="5 5" strokeDashoffset={-frame * 1.2 + i * 3} />
						))}
						<rect x="30" y="78" width="60" height="18" rx="3" fill="rgba(6,6,12,0.9)" stroke={C.white} strokeWidth="2" />
						<text x="60" y="91" textAnchor="middle" fontFamily={mono} fontSize="9" fill={C.white}>XBOX ONE</text>
					</svg>
					<div>
						<div style={big(C.white, 140)}>03:00</div>
						<div style={{fontFamily: mono, fontSize: 28, color: C.dim, letterSpacing: 3}}>BRASÍLIA · 19/11</div>
						<div style={{marginTop: 18, display: 'flex'}}>
							<Chip at={a + 141} color={C.amber}>JOGO VENDIDO À PARTE</Chip>
						</div>
					</div>
				</div>
			</Box>
		);
	}
	return null;
};

// ── Logo do canal (public/logo-zonegta6.jpg) ─────────────────
export const LOGO = 'logo-zonegta6.jpg';

// Encerramento: a logo entra girando, recortada em círculo, com anel de neon,
// onda de choque e um brilho que atravessa a imagem.
export const ChannelLogo: React.FC<{at: number; size: number}> = ({at, size}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = spring({frame: frame - at, fps, config: {damping: 11, mass: 0.8}});
	const wave = interpolate(frame, [at, at + 26], [0, 1], clamp);
	const sweep = interpolate(frame, [at + 10, at + 40], [-40, 140], clamp);
	if (frame < at) return <div style={{height: size}} />;
	return (
		<div style={{position: 'relative', width: size, height: size, margin: '0 auto'}}>
			<div style={{position: 'absolute', inset: 0, borderRadius: '50%', border: `6px solid ${C.pink}`, transform: `scale(${1 + wave * 0.9})`, opacity: 1 - wave}} />
			<div
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: '50%',
					overflow: 'hidden',
					transform: `scale(${interpolate(p, [0, 1], [0.2, 1])}) rotate(${(1 - p) * -90}deg)`,
					opacity: Math.min(1, p * 2),
					boxShadow: `0 0 ${50 + 20 * Math.sin(frame / 5)}px ${C.pink}, 0 0 120px ${C.pink}66`,
				}}
			>
				<Img src={staticFile(LOGO)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
				<div style={{position: 'absolute', inset: 0, background: `linear-gradient(110deg, transparent ${sweep - 12}%, rgba(255,255,255,0.55) ${sweep}%, transparent ${sweep + 12}%)`, mixBlendMode: 'screen'}} />
			</div>
		</div>
	);
};

// Marca fixa no topo: logo pequena + nome do canal.
export const HudBrand: React.FC = () => (
	<div style={{position: 'absolute', top: 132, left: 80, display: 'flex', alignItems: 'center', gap: 18, fontFamily: display, fontSize: 52, color: C.white, letterSpacing: 2}}>
		<Img src={staticFile(LOGO)} style={{width: 92, height: 92, borderRadius: '50%', objectFit: 'cover', boxShadow: `0 0 22px ${C.pink}aa`}} />
		<span>
			ZONE<span style={{color: C.pink}}>GTA6</span>
		</span>
	</div>
);
