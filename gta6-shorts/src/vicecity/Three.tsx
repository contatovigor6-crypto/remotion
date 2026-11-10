import React, {useEffect, useMemo, useState} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {continueRender, delayRender, interpolate, Easing, staticFile, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js';
// @ts-ignore json da fonte
import fontJson from 'three/examples/fonts/helvetiker_bold.typeface.json';

// Cenas 3D (three.js via @remotion/three) do Short "Miami virou Vice City" — estilo cyberpunk neon.
export const PINK = '#FF2BD6';
export const CYAN = '#00F0FF';
export const VIOLET = '#8A2BFF';
export const LIME = '#B8FF3C';
export const GOLD = '#FFC93C';

const font = new FontLoader().parse(fontJson as any);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const useTex = (src: string) => {
	const [tex, setTex] = useState<THREE.Texture | null>(null);
	const [h] = useState(() => delayRender(`tex ${src}`));
	const {advance} = useThree();
	useEffect(() => {
		new THREE.TextureLoader().load(
			staticFile(src),
			(t) => {
				t.colorSpace = THREE.SRGBColorSpace;
				setTex(t);
			},
			undefined,
			() => continueRender(h),
		);
	}, [src, h]);
	useEffect(() => {
		if (!tex) return;
		// redesenha o canvas com a textura carregada antes de liberar o quadro
		requestAnimationFrame(() => {
			advance(performance.now());
			continueRender(h);
		});
	}, [tex, advance, h]);
	return tex;
};

const Canvas: React.FC<{children: React.ReactNode; fov?: number; pos?: [number, number, number]; glow?: string}> = ({children, fov = 50, pos = [0, 0, 10], glow}) => (
	<div style={{position: 'absolute', inset: 0, filter: glow ? `drop-shadow(0 0 14px ${glow}) drop-shadow(0 0 4px ${glow})` : undefined}}>
		<ThreeCanvas width={1080} height={1920} camera={{fov, position: pos}} gl={{alpha: true, antialias: true, preserveDrawingBuffer: true}} style={{background: 'transparent'}}>
			{children}
		</ThreeCanvas>
	</div>
);

const Text3D: React.FC<{text: string; size: number; color: string; depth?: number; position?: [number, number, number]; rotation?: [number, number, number]; scale?: number}> = ({text, size, color, depth = 0.25, position, rotation, scale = 1}) => {
	const geo = useMemo(() => {
		const g = new TextGeometry(text, {font, size, depth, curveSegments: 5, bevelEnabled: true, bevelThickness: depth * 0.15, bevelSize: size * 0.02, bevelSegments: 2});
		g.center();
		return g;
	}, [text, size, depth]);
	return (
		<group position={position} rotation={rotation} scale={scale}>
			<mesh geometry={geo}>
				<meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.85} metalness={0.3} roughness={0.35} />
			</mesh>
			<lineSegments>
				<edgesGeometry args={[geo, 30]} />
				<lineBasicMaterial color="#ffffff" transparent opacity={0.35} />
			</lineSegments>
		</group>
	);
};

const NeonBox: React.FC<{w: number; h: number; d: number; position: [number, number, number]; color: string; fill?: string}> = ({w, h, d, position, color, fill = '#100428'}) => {
	const geo = useMemo(() => new THREE.BoxGeometry(w, h, d), [w, h, d]);
	return (
		<group position={position}>
			<mesh geometry={geo}>
				<meshBasicMaterial color={fill} />
			</mesh>
			<lineSegments>
				<edgesGeometry args={[geo]} />
				<lineBasicMaterial color={color} />
			</lineSegments>
		</group>
	);
};

/** S1 — voo por uma cidade neon em wireframe (ilustração) */
export const CityFly: React.FC = () => {
	const frame = useCurrentFrame();
	const t = frame / 30;
	const blds = useMemo(() => {
		const out: {x: number; z: number; w: number; h: number; d: number; c: string}[] = [];
		let s = 7;
		const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
		for (let i = 0; i < 70; i++) {
			const side = i % 2 ? 1 : -1;
			out.push({x: side * (2.2 + r() * 6), z: -i * 2.2, w: 0.8 + r() * 1.6, h: 1.5 + r() * 9, d: 0.8 + r() * 1.6, c: [PINK, CYAN, VIOLET][i % 3]});
		}
		return out;
	}, []);
	const camZ = 6 - t * 9;
	return (
		<Canvas fov={70} pos={[0, 1.6, 6]} glow={PINK}>
			<CamSetter x={0} z={camZ} y={1.6 + Math.sin(t * 1.5) * 0.15} roll={Math.sin(t * 0.9) * 0.05} lookY={2.2} />
			<gridHelper args={[200, 100, CYAN, VIOLET]} position={[0, 0, -60]} />
			{blds.map((b, i) => (
				<NeonBox key={i} w={b.w} h={b.h} d={b.d} position={[b.x, b.h / 2, b.z]} color={b.c} />
			))}
			<mesh position={[0, 9, -170]}>
				<circleGeometry args={[16, 48]} />
				<meshBasicMaterial color={PINK} />
			</mesh>
		</Canvas>
	);
};
// posiciona a câmera padrão do canvas
const CamSetter: React.FC<{x: number; y: number; z: number; roll: number; lookY: number}> = ({x, y, z, roll, lookY}) => {
	const {camera} = useThree();
	camera.position.set(x, y, z);
	camera.lookAt(x, lookY, z - 10);
	camera.rotation.z += roll;
	camera.updateProjectionMatrix();
	return null;
};

/** S2 — letreiro 3D "WELCOME TO VICE CITY" descendo de helicóptero sobre o teto da arena (ilustração) */
export const SignDrop: React.FC<{t0: number; land: number}> = ({t0, land}) => {
	const frame = useCurrentFrame();
	const t = t0 + frame / 30;
	const k = interpolate(t, [land - 2.4, land], [1, 0], {...clamp, easing: Easing.out(Easing.cubic)});
	const sway = Math.sin(t * 2.2) * 0.12 * k;
	const yaw = interpolate(t, [t0, t0 + 7], [-0.5, 0.35]);
	const bounce = t > land ? Math.exp(-(t - land) * 6) * Math.sin((t - land) * 30) * 0.08 : 0;
	return (
		<Canvas fov={42} pos={[0, 1.2, 19]} glow={PINK}>
			<ambientLight intensity={0.5} />
			<pointLight position={[0, 6, 6]} intensity={80} color={PINK} />
			<pointLight position={[-6, 2, 4]} intensity={40} color={CYAN} />
			<group rotation={[0.18, yaw, 0]} position={[0, 0.2, 0]}>
				{/* teto da arena */}
				<NeonBox w={9} h={0.5} d={5} position={[0, -0.25, 0]} color={CYAN} fill="#0a0626" />
				<NeonBox w={7.4} h={0.25} d={3.8} position={[0, 0.12, 0]} color={VIOLET} fill="#0d0830" />
				<group position={[0, 1.15 + k * 9 + bounce, 0]} rotation={[0, 0, sway]}>
					<Text3D text="WELCOME TO" size={0.42} color={PINK} position={[0, 0.85, 0]} />
					<Text3D text="VICE CITY" size={0.95} depth={0.35} color={PINK} position={[0, -0.1, 0]} />
					{/* cabos do helicóptero */}
					{k > 0.02
						? [-2.6, 2.6].map((x) => (
								<mesh key={x} position={[x * 0.7, 6, 0]} rotation={[0, 0, -x * 0.03]}>
									<cylinderGeometry args={[0.02, 0.02, 11, 6]} />
									<meshBasicMaterial color="#ffffff" transparent opacity={0.7 * Math.min(1, k * 4)} />
								</mesh>
							))
						: null}
				</group>
			</group>
		</Canvas>
	);
};

/** S3 — moedas 3D caindo e empilhando */
export const CoinRain: React.FC<{t0: number}> = ({t0}) => {
	const frame = useCurrentFrame();
	const t = t0 + frame / 30;
	const coins = useMemo(() => {
		let s = 3;
		const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
		return Array.from({length: 40}).map((_, i) => ({x: (r() - 0.5) * 9, at: t0 + 0.2 + r() * 6.2, rx: r() * 6, sp: 2 + r() * 4, zz: -r() * 4}));
	}, [t0]);
	return (
		<Canvas fov={50} pos={[0, 0, 12]} glow={GOLD}>
			<ambientLight intensity={0.6} />
			<pointLight position={[3, 5, 8]} intensity={120} color="#fff3c0" />
			<pointLight position={[-5, -3, 5]} intensity={60} color={PINK} />
			{coins.map((c, i) => {
				const dt = t - c.at;
				if (dt < 0) return null;
				const y = 10 - dt * 5.5;
				if (y < -11) return null;
				return (
					<mesh key={i} position={[c.x, y, c.zz]} rotation={[c.rx + dt * c.sp, dt * c.sp * 0.7, 0]}>
						<cylinderGeometry args={[0.55, 0.55, 0.12, 32]} />
						<meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.25} emissive="#7a4a00" emissiveIntensity={0.4} />
					</mesh>
				);
			})}
		</Canvas>
	);
};

/** S5a — dirigível 3D atravessando o céu (ilustração) */
export const Blimp: React.FC<{t0: number; at: number}> = ({t0, at}) => {
	const frame = useCurrentFrame();
	const t = t0 + frame / 30;
	const x = interpolate(t, [at - 0.6, at + 2.6], [-5.5, 0.6], {...clamp, easing: Easing.out(Easing.cubic)});
	return (
		<Canvas fov={45} pos={[0, 0, 14]} glow={CYAN}>
			<ambientLight intensity={0.5} />
			<pointLight position={[0, 6, 8]} intensity={140} color="#ffffff" />
			<pointLight position={[-6, -2, 6]} intensity={70} color={PINK} />
			<group position={[x, 1.6 + Math.sin(t * 1.4) * 0.15, 0]} rotation={[0.05, -0.35, Math.sin(t) * 0.03]} scale={0.62}>
				<mesh scale={[3.4, 1, 1]}>
					<sphereGeometry args={[1, 48, 32]} />
					<meshStandardMaterial color="#1a0f3d" metalness={0.5} roughness={0.3} emissive={VIOLET} emissiveIntensity={0.25} />
				</mesh>
				<lineSegments scale={[3.42, 1.02, 1.02]}>
					<edgesGeometry args={[new THREE.SphereGeometry(1, 16, 8), 1]} />
					<lineBasicMaterial color={CYAN} transparent opacity={0.6} />
				</lineSegments>
				<mesh position={[0, -1.05, 0]}>
					<boxGeometry args={[1.2, 0.35, 0.5]} />
					<meshStandardMaterial color="#0b0620" emissive={CYAN} emissiveIntensity={0.3} />
				</mesh>
				{[1, -1].map((s) => (
					<mesh key={s} position={[-3.1, s * 0.55, 0]} rotation={[0, 0, s * 0.5]}>
						<boxGeometry args={[0.9, 0.08, 0.7]} />
						<meshStandardMaterial color={PINK} emissive={PINK} emissiveIntensity={0.7} />
					</mesh>
				))}
				<Text3D text="VICE CITY" size={0.42} depth={0.06} color={PINK} position={[0.1, 0.05, 1.02]} />
			</group>
		</Canvas>
	);
};

/** S5b — carrossel 3D com 10 "murais" (artes oficiais das rádios de GTA VI) */
export const MuralRing: React.FC<{t0: number; srcs: string[]}> = ({t0, srcs}) => {
	const frame = useCurrentFrame();
	const t = t0 + frame / 30;
	const rot = t * 0.55;
	const R = 5.2;
	return (
		<Canvas fov={50} pos={[0, 0.6, 17]} glow={VIOLET}>
			<ambientLight intensity={1.2} />
			<group rotation={[0.08, rot, 0]} position={[0, 0.9, 0]}>
				{srcs.map((s, i) => (
					<MuralPanel key={i} src={s} angle={(i / srcs.length) * Math.PI * 2} R={R} color={[PINK, CYAN, VIOLET, LIME][i % 4]} />
				))}
			</group>
		</Canvas>
	);
};
const MuralPanel: React.FC<{src: string; angle: number; R: number; color: string}> = ({src, angle, R, color}) => {
	const tex = useTex(src);
	return (
		<group position={[Math.sin(angle) * R, 0, Math.cos(angle) * R]} rotation={[0, angle, 0]}>
			<mesh>
				<planeGeometry args={[2.7, 4.0]} />
				<meshBasicMaterial key={tex ? 'tex' : 'none'} map={tex ?? undefined} color={tex ? '#ffffff' : '#222'} side={THREE.DoubleSide} toneMapped={false} />
			</mesh>
			<lineSegments>
				<edgesGeometry args={[new THREE.BoxGeometry(2.8, 4.1, 0.05)]} />
				<lineBasicMaterial color={color} />
			</lineSegments>
		</group>
	);
};

/** S7 — quadra de basquete 3D neon girando + bola quicando (ilustração) */
export const Court: React.FC<{t0: number}> = ({t0}) => {
	const frame = useCurrentFrame();
	const t = t0 + frame / 30;
	const ph = (t * 1.6) % 1;
	const ballY = 0.45 + Math.abs(Math.sin(ph * Math.PI)) * 3.2;
	const lines = useMemo(() => {
		const pts: number[] = [];
		const seg = (a: number[], b: number[]) => pts.push(a[0], 0.02, a[1], b[0], 0.02, b[1]);
		const W = 5, L = 9.4;
		seg([-W, -L], [W, -L]); seg([W, -L], [W, L]); seg([W, L], [-W, L]); seg([-W, L], [-W, -L]); seg([-W, 0], [W, 0]);
		for (let i = 0; i < 48; i++) {
			const a0 = (i / 48) * Math.PI * 2, a1 = ((i + 1) / 48) * Math.PI * 2;
			seg([Math.cos(a0) * 1.8, Math.sin(a0) * 1.8], [Math.cos(a1) * 1.8, Math.sin(a1) * 1.8]);
		}
		for (const s of [-1, 1]) {
			for (let i = 0; i < 24; i++) {
				const a0 = (i / 24) * Math.PI, a1 = ((i + 1) / 24) * Math.PI;
				seg([Math.cos(a0) * 4.2, s * (L - Math.sin(a0) * 4.2)], [Math.cos(a1) * 4.2, s * (L - Math.sin(a1) * 4.2)]);
			}
			seg([-1.8, s * L], [-1.8, s * (L - 5.8)]); seg([1.8, s * L], [1.8, s * (L - 5.8)]); seg([-1.8, s * (L - 5.8)], [1.8, s * (L - 5.8)]);
		}
		const g = new THREE.BufferGeometry();
		g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
		return g;
	}, []);
	return (
		<Canvas fov={50} pos={[0, 9, 14]} glow={PINK}>
			<CamSetter x={0} y={9} z={14} roll={0} lookY={9} />
			<OrbitLook />
			<ambientLight intensity={0.7} />
			<pointLight position={[0, 8, 4]} intensity={160} color="#ffffff" />
			<group rotation={[0, t * 0.35, 0]}>
				<mesh rotation={[-Math.PI / 2, 0, 0]}>
					<planeGeometry args={[10.6, 19.6]} />
					<meshStandardMaterial color="#14062e" roughness={0.6} />
				</mesh>
				<lineSegments geometry={lines}>
					<lineBasicMaterial color={PINK} />
				</lineSegments>
				<Text3D text="VC" size={1.1} depth={0.05} color={CYAN} position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} />
				<mesh position={[1.5, ballY, 3]} rotation={[t * 4, t * 2, 0]}>
					<sphereGeometry args={[0.45, 32, 24]} />
					<meshStandardMaterial color="#ff7a1a" roughness={0.5} emissive="#5a1e00" emissiveIntensity={0.4} />
				</mesh>
			</group>
		</Canvas>
	);
};
const OrbitLook: React.FC = () => {
	const {camera} = useThree();
	camera.lookAt(0, 0, 0);
	camera.updateProjectionMatrix();
	return null;
};
