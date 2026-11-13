import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	random,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {body, C, display, mono, Status, statusColor} from './theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Entrada com mola: base de quase toda animação do canal.
export const useIn = (delay = 0, damping = 14) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({frame: frame - delay, fps, config: {damping, mass: 0.7}});
};

// Fundo vivo: grade em perspectiva + brilho + scanlines + vinheta.
export const Backdrop: React.FC<{accent: string}> = ({accent}) => {
	const frame = useCurrentFrame();
	const drift = (frame * 2.2) % 120;
	return (
		<AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 90% 55% at 50% 38%, ${accent}33 0%, transparent 70%)`,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: -540,
					right: -540,
					bottom: -200,
					height: 1100,
					transform: 'perspective(700px) rotateX(62deg)',
					transformOrigin: '50% 100%',
					backgroundImage: `linear-gradient(${accent}55 2px, transparent 2px), linear-gradient(90deg, ${accent}40 2px, transparent 2px)`,
					backgroundSize: '120px 120px',
					backgroundPosition: `0 ${drift}px`,
					maskImage: 'linear-gradient(to top, black 10%, transparent 85%)',
				}}
			/>
			<AbsoluteFill
				style={{
					backgroundImage:
						'repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, transparent 2px, transparent 4px)',
				}}
			/>
			<AbsoluteFill
				style={{
					background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.85) 100%)',
				}}
			/>
		</AbsoluteFill>
	);
};

// Camera shake controlado e com decaimento, disparado em impactos.
export const Shake: React.FC<{at: number; strength?: number; children: React.ReactNode}> = ({
	at,
	strength = 26,
	children,
}) => {
	const frame = useCurrentFrame();
	const t = frame - at;
	const decay = t >= 0 && t < 14 ? Math.pow(1 - t / 14, 2) : 0;
	const x = (random(`x${frame}`) - 0.5) * strength * decay;
	const y = (random(`y${frame}`) - 0.5) * strength * decay;
	return <AbsoluteFill style={{transform: `translate(${x}px, ${y}px)`}}>{children}</AbsoluteFill>;
};

// Etiqueta de verificação (CONFIRMADO / REPORTADO / RUMOR / TEORIA).
export const Tag: React.FC<{status: Status; delay?: number; source: string}> = ({
	status,
	delay = 0,
	source,
}) => {
	const p = useIn(delay, 16);
	const col = statusColor[status];
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 18,
				opacity: p,
				transform: `translateY(${(1 - p) * 30}px)`,
			}}
		>
			<div
				style={{
					fontFamily: mono,
					fontWeight: 700,
					fontSize: 30,
					letterSpacing: 3,
					color: C.bg,
					background: col,
					padding: '8px 18px',
					borderRadius: 6,
					boxShadow: `0 0 30px ${col}88`,
					whiteSpace: 'nowrap',
					flexShrink: 0,
				}}
			>
				● {status}
			</div>
			<div style={{fontFamily: mono, fontSize: 26, color: C.dim}}>FONTE: {source}</div>
		</div>
	);
};

// Título com revelação por máscara + motion blur vertical simulado.
export const MaskTitle: React.FC<{
	text: string;
	delay?: number;
	size?: number;
	color?: string;
	glow?: string;
}> = ({text, delay = 0, size = 150, color = C.white, glow}) => {
	const p = useIn(delay, 13);
	const blur = interpolate(p, [0, 0.7, 1], [14, 2, 0], clamp);
	return (
		<div style={{overflow: 'hidden', paddingBottom: 6}}>
			<div
				style={{
					fontFamily: display,
					fontSize: size,
					lineHeight: 1.02,
					color,
					textTransform: 'uppercase',
					transform: `translateY(${(1 - p) * 110}%)`,
					filter: `blur(${blur}px)`,
					textShadow: glow ? `0 0 40px ${glow}, 0 0 90px ${glow}66` : undefined,
				}}
			>
				{text}
			</div>
		</div>
	);
};

// Texto de apoio palavra a palavra, sincronizado com a leitura.
export const Words: React.FC<{text: string; delay?: number; size?: number; color?: string; every?: number}> = ({
	text,
	delay = 0,
	size = 54,
	color = C.white,
	every = 3,
}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{fontFamily: body, fontWeight: 800, fontSize: size, lineHeight: 1.2, color}}>
			{text.split(' ').map((w, i) => {
				const o = interpolate(frame, [delay + i * every, delay + i * every + 6], [0, 1], clamp);
				return (
					<span
						key={i}
						style={{
							opacity: o,
							display: 'inline-block',
							transform: `translateY(${(1 - o) * 18}px)`,
							marginRight: '0.28em',
						}}
					>
						{w}
					</span>
				);
			})}
		</div>
	);
};

// Painel estilo HUD futurista com cantos de mira.
export const Panel: React.FC<{accent: string; delay?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
	accent,
	delay = 0,
	children,
	style,
}) => {
	const p = useIn(delay, 15);
	const corner = (pos: React.CSSProperties): React.CSSProperties => ({
		position: 'absolute',
		width: 34,
		height: 34,
		borderColor: accent,
		borderStyle: 'solid',
		borderWidth: 0,
		...pos,
	});
	return (
		<div
			style={{
				position: 'relative',
				background: C.panel,
				border: `1px solid ${accent}44`,
				padding: '38px 44px',
				opacity: p,
				transform: `scale(${0.9 + p * 0.1}) translateY(${(1 - p) * 40}px)`,
				...style,
			}}
		>
			<div style={corner({top: -2, left: -2, borderTopWidth: 5, borderLeftWidth: 5})} />
			<div style={corner({top: -2, right: -2, borderTopWidth: 5, borderRightWidth: 5})} />
			<div style={corner({bottom: -2, left: -2, borderBottomWidth: 5, borderLeftWidth: 5})} />
			<div style={corner({bottom: -2, right: -2, borderBottomWidth: 5, borderRightWidth: 5})} />
			{children}
		</div>
	);
};

// Flash branco curto para pontuar cortes de impacto.
export const Flash: React.FC<{at: number}> = ({at}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [at, at + 1, at + 7], [0, 0.85, 0], clamp);
	return <AbsoluteFill style={{background: 'white', opacity: o, pointerEvents: 'none'}} />;
};
