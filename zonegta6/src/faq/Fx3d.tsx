import React from 'react';
import {random} from 'remotion';
import {C, display, mono} from '../theme';

// Kit 3D do ZoneGTA6: geometria de verdade em espaço 3D (perspectiva, profundidade,
// câmera), feita com transformações 3D do navegador. Renderiza no pipeline normal do
// Remotion, sem GPU. Regra: nada de filter/opacity/overflow nos contêineres 3D, porque
// isso achata a cena.

const P3D: React.CSSProperties = {transformStyle: 'preserve-3d'};

// Palco com câmera: perspectiva + rotação da cena inteira.
export const Scene3D: React.FC<{
	width: number;
	height: number;
	perspective?: number;
	rotateX?: number;
	rotateY?: number;
	z?: number;
	children: React.ReactNode;
}> = ({width, height, perspective = 1400, rotateX = 0, rotateY = 0, z = 0, children}) => (
	<div style={{width, height, perspective, perspectiveOrigin: '50% 45%', position: 'relative'}}>
		<div style={{...P3D, position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, transform: `translateZ(${z}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`}}>
			{children}
		</div>
	</div>
);

// Caixa com 6 faces, centrada em (x, y, z). `y` é o centro vertical (para baixo é positivo).
export const Box3D: React.FC<{
	w: number;
	h: number;
	d: number;
	x?: number;
	y?: number;
	z?: number;
	rotateY?: number;
	rotateX?: number;
	front: React.CSSProperties;
	side?: React.CSSProperties;
	top?: React.CSSProperties;
	children?: React.ReactNode; // conteúdo da face da frente
}> = ({w, h, d, x = 0, y = 0, z = 0, rotateY = 0, rotateX = 0, front, side, top, children}) => {
	const face = (fw: number, fh: number, transform: string, style: React.CSSProperties, content?: React.ReactNode) => (
		<div style={{position: 'absolute', width: fw, height: fh, left: -fw / 2, top: -fh / 2, transform, backfaceVisibility: 'hidden', ...style}}>{content}</div>
	);
	const s = side ?? front;
	const t = top ?? s;
	return (
		<div style={{...P3D, position: 'absolute', transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`}}>
			{face(w, h, `translateZ(${d / 2}px)`, front, children)}
			{face(w, h, `rotateY(180deg) translateZ(${d / 2}px)`, s)}
			{face(d, h, `rotateY(90deg) translateZ(${w / 2}px)`, s)}
			{face(d, h, `rotateY(-90deg) translateZ(${w / 2}px)`, s)}
			{face(w, d, `rotateX(90deg) translateZ(${h / 2}px)`, t)}
			{face(w, d, `rotateX(-90deg) translateZ(${h / 2}px)`, t)}
		</div>
	);
};

// Texto com volume: camadas empilhadas em profundidade.
export const Extruded: React.FC<{text: string; size: number; depth?: number; color?: string; sideColor?: string; glow?: string}> = ({
	text,
	size,
	depth = 28,
	color = C.white,
	sideColor = '#7a1245',
	glow,
}) => (
	<div style={{...P3D, position: 'absolute', left: 0, top: 0}}>
		{Array.from({length: depth}).map((_, i) => {
			const frontLayer = i === depth - 1;
			return (
				<div
					key={i}
					style={{
						position: 'absolute',
						transform: `translate(-50%, -50%) translateZ(${(i - depth + 1) * 4}px)`,
						fontFamily: display,
						fontSize: size,
						lineHeight: 0.9,
						whiteSpace: 'nowrap',
						textAlign: 'center',
						color: frontLayer ? color : sideColor,
						textShadow: frontLayer && glow ? `0 0 60px ${glow}` : undefined,
					}}
				>
					{text}
				</div>
			);
		})}
	</div>
);

// Chão em grade de neon.
export const Floor3D: React.FC<{size: number; y: number; color: string; shift?: number}> = ({size, y, color, shift = 0}) => (
	<div
		style={{
			position: 'absolute',
			width: size,
			height: size,
			left: -size / 2,
			top: -size / 2,
			transform: `translateY(${y}px) rotateX(90deg)`,
			backgroundColor: 'rgba(6,6,12,0.9)',
			backgroundImage: `linear-gradient(${color}88 3px, transparent 3px), linear-gradient(90deg, ${color}88 3px, transparent 3px)`,
			backgroundSize: '160px 160px',
			backgroundPosition: `0 ${shift}px`,
		}}
	/>
);

// Cenário: cidade de prédios de neon sobre a grade, com a câmera avançando.
export const City3D: React.FC<{frame: number; ground: number}> = ({frame, ground}) => {
	const colors = [C.pink, C.cyan, C.amber, '#9b5cff'];
	const travel = frame * 7;
	return (
		<div style={{...P3D, position: 'absolute'}}>
			<Floor3D size={5200} y={ground} color={C.pink} shift={travel} />
			{Array.from({length: 34}).map((_, i) => {
				const side = i % 2 === 0 ? -1 : 1;
				const lane = 520 + random(`cx${i}`) * 900;
				const h = 380 + random(`ch${i}`) * 900;
				const w = 190 + random(`cw${i}`) * 150;
				// Os prédios vêm do fundo em direção à câmera e reaparecem lá atrás.
				const z = ((i * 260 + travel) % 4400) - 3600;
				const col = colors[i % colors.length];
				const windows = `repeating-linear-gradient(0deg, transparent 0 26px, rgba(6,6,12,0.92) 26px 44px), repeating-linear-gradient(90deg, ${col}cc 0 20px, rgba(6,6,12,0.92) 20px 36px)`;
				return (
					<Box3D
						key={i}
						w={w}
						h={h}
						d={w}
						x={side * lane}
						y={ground - h / 2}
						z={z}
						front={{backgroundColor: '#0b0b18', backgroundImage: windows, border: `2px solid ${col}`}}
						side={{backgroundColor: '#08081a', backgroundImage: windows, border: `2px solid ${col}88`}}
						top={{backgroundColor: col}}
					/>
				);
			})}
		</div>
	);
};

// Coluna 3D de gráfico, crescendo a partir do chão.
export const Bar3D: React.FC<{w: number; h: number; x?: number; ground: number; color: string; label?: string}> = ({w, h, x = 0, ground, color, label}) => (
	<Box3D
		w={w}
		h={Math.max(2, h)}
		d={w}
		x={x}
		y={ground - Math.max(2, h) / 2}
		front={{background: `linear-gradient(180deg, ${color}, ${color}99)`, boxShadow: `0 0 40px ${color}`}}
		side={{background: `linear-gradient(180deg, ${color}bb, ${color}55)`}}
		top={{background: C.white}}
	>
		{label ? <div style={{fontFamily: mono, fontWeight: 700, fontSize: 30, color: C.bg, textAlign: 'center', marginTop: 12}}>{label}</div> : null}
	</Box3D>
);
