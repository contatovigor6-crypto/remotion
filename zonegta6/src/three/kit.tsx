// Kit 3D ZoneGTAVI: objetos procedurais (geometria real, materiais PBR) para os cenários.
import type {ThreeElements} from '@react-three/fiber';
// Tudo é determinístico (depende só do frame), como o Remotion exige.
import {RoundedBox} from '@react-three/drei';
import {useMemo} from 'react';
import * as THREE from 'three';

export const rand = (seed: number) => {
	let s = seed % 2147483647;
	if (s <= 0) s += 2147483646;
	return () => (s = (s * 16807) % 2147483647) / 2147483647;
};

// Console genérico (inspirado no formato de um console de mesa preto) — sem logotipo.
export const Console3D: React.FC<{glow?: number; glowColor?: string; glasses?: boolean; dust?: number} & ThreeElements['group']> = ({glow = 1, glowColor = '#ffffff', glasses = false, dust = 0, ...props}) => {
	const vents = useMemo(() => [...Array(18)].map((_, i) => i), []);
	return (
		<group {...props}>
			<RoundedBox args={[3.4, 0.95, 2.6]} radius={0.06} smoothness={4} castShadow receiveShadow>
				<meshPhysicalMaterial color={dust > 0 ? new THREE.Color('#1b1b1f').lerp(new THREE.Color('#6b6458'), dust * 0.5) : '#141417'} roughness={0.35 + dust * 0.5} metalness={0.2} clearcoat={1 - dust} clearcoatRoughness={0.15} />
			</RoundedBox>
			{/* grade de ventilação (lado esquerdo do topo) */}
			{vents.map((i) => (
				<mesh key={i} position={[-1.65 + i * 0.115, 0.48, 0]} castShadow>
					<boxGeometry args={[0.06, 0.02, 2.4]} />
					<meshStandardMaterial color="#060607" roughness={0.9} />
				</mesh>
			))}
			{/* painel frontal brilhante */}
			<mesh position={[0.9, 0, 1.305]}>
				<boxGeometry args={[1.5, 0.9, 0.01]} />
				<meshPhysicalMaterial color="#0a0a0c" roughness={0.05} metalness={0.4} clearcoat={1} />
			</mesh>
			{/* fenda do disco */}
			<mesh position={[-0.4, 0.15, 1.31]}>
				<boxGeometry args={[1.6, 0.04, 0.02]} />
				<meshStandardMaterial color="#000" />
			</mesh>
			{/* botão luminoso */}
			<mesh position={[1.35, 0.15, 1.315]}>
				<cylinderGeometry args={[0.09, 0.09, 0.02, 32]} />
				<meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={3 * glow} toneMapped={false} />
			</mesh>
			{glow > 0 ? <pointLight position={[1.35, 0.15, 1.6]} color={glowColor} intensity={2 * glow} distance={3} /> : null}
			{/* pés */}
			{[-1.4, 1.4].map((x) => [-1, 1].map((z) => (
				<mesh key={`${x}${z}`} position={[x, -0.5, z]}>
					<cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
					<meshStandardMaterial color="#000" />
				</mesh>
			)))}
			{glasses ? (
				<group position={[0, 0.25, 1.38]}>
					{[-0.45, 0.45].map((x) => (
						<mesh key={x} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
							<cylinderGeometry args={[0.33, 0.33, 0.06, 32]} />
							<meshPhysicalMaterial color="#050505" roughness={0.02} metalness={0.9} clearcoat={1} />
						</mesh>
					))}
					<mesh><boxGeometry args={[0.3, 0.06, 0.06]} /><meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} /></mesh>
				</group>
			) : null}
		</group>
	);
};

// Carro estilizado (sedã esportivo) com faróis e lanternas emissivos.
export const Car3D: React.FC<{color?: string} & ThreeElements['group']> = ({color = '#e8304f', ...props}) => (
	<group {...props}>
		<RoundedBox args={[1.9, 0.55, 4.4]} radius={0.18} position={[0, 0.55, 0]} castShadow receiveShadow>
			<meshPhysicalMaterial color={color} metalness={0.6} roughness={0.25} clearcoat={1} clearcoatRoughness={0.05} />
		</RoundedBox>
		<RoundedBox args={[1.6, 0.5, 2.1]} radius={0.2} position={[0, 1.02, -0.3]} castShadow>
			<meshPhysicalMaterial color="#0b0f16" metalness={0.3} roughness={0.05} clearcoat={1} />
		</RoundedBox>
		{[-0.85, 0.85].map((x) => [-1.4, 1.4].map((z) => (
			<mesh key={`${x}${z}`} position={[x, 0.35, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
				<cylinderGeometry args={[0.36, 0.36, 0.3, 24]} />
				<meshStandardMaterial color="#111" roughness={0.6} />
			</mesh>
		)))}
		{[-0.6, 0.6].map((x) => (
			<group key={x}>
				<mesh position={[x, 0.6, 2.21]}><boxGeometry args={[0.45, 0.14, 0.02]} /><meshStandardMaterial color="#fff" emissive="#fff6d8" emissiveIntensity={4} toneMapped={false} /></mesh>
				<mesh position={[x, 0.62, -2.21]}><boxGeometry args={[0.5, 0.12, 0.02]} /><meshStandardMaterial color="#f00" emissive="#ff1030" emissiveIntensity={4} toneMapped={false} /></mesh>
			</group>
		))}
	</group>
);

// Palmeira: tronco curvo segmentado + folhas.
export const Palm: React.FC<ThreeElements['group'] & {sway?: number}> = ({sway = 0, ...props}) => {
	const segs = 9;
	return (
		<group {...props}>
			{[...Array(segs)].map((_, i) => (
				<mesh key={i} position={[Math.sin(i / segs) * 0.9 + sway * (i / segs) ** 2, i * 0.75, 0]} rotation={[0, 0, -0.12 - sway * 0.05]} castShadow>
					<cylinderGeometry args={[0.22 - i * 0.012, 0.26 - i * 0.012, 0.78, 10]} />
					<meshStandardMaterial color={i % 2 ? '#7a5a3a' : '#6a4b2f'} roughness={0.95} />
				</mesh>
			))}
			<group position={[Math.sin(1) * 0.9 + sway, segs * 0.75, 0]}>
				{[...Array(9)].map((_, i) => (
					<mesh key={i} rotation={[0.9 + Math.sin(i) * 0.15 + sway * 0.1, (i / 9) * Math.PI * 2, 0]} position={[0, 0, 0]} castShadow>
						<coneGeometry args={[0.45, 3.4, 4, 1, true]} />
						<meshStandardMaterial color={i % 2 ? '#2f7d3a' : '#246b30'} roughness={0.8} side={THREE.DoubleSide} />
					</mesh>
				))}
			</group>
		</group>
	);
};

// Textura procedural de janelas acesas para prédios.
export const useWindowTexture = (seed: number, lit = 0.45, tint = '#ffd9a0') =>
	useMemo(() => {
		const r = rand(seed);
		const c = document.createElement('canvas');
		c.width = 128;
		c.height = 256;
		const g = c.getContext('2d')!;
		g.fillStyle = '#0d0f17';
		g.fillRect(0, 0, 128, 256);
		for (let y = 0; y < 32; y++)
			for (let x = 0; x < 8; x++) {
				g.fillStyle = r() < lit ? tint : '#1a1f2c';
				g.fillRect(x * 16 + 3, y * 8 + 2, 10, 5);
			}
		const t = new THREE.CanvasTexture(c);
		t.colorSpace = THREE.SRGBColorSpace;
		t.wrapS = t.wrapT = THREE.RepeatWrapping;
		return t;
	}, [seed, lit, tint]);

export const Building: React.FC<{w: number; h: number; d: number; seed: number; tint?: string; neon?: string} & ThreeElements['group']> = ({w, h, d, seed, tint, neon, ...props}) => {
	const tex = useWindowTexture(seed, 0.4, tint);
	const map = useMemo(() => {
		const t = tex.clone();
		t.repeat.set(w / 4, h / 8);
		t.needsUpdate = true;
		return t;
	}, [tex, w, h]);
	return (
		<group {...props}>
			<mesh position={[0, h / 2, 0]} castShadow receiveShadow>
				<boxGeometry args={[w, h, d]} />
				<meshStandardMaterial map={map} emissiveMap={map} emissive="#ffffff" emissiveIntensity={0.9} roughness={0.4} metalness={0.3} />
			</mesh>
			{neon ? (
				<mesh position={[0, h + 0.1, 0]}>
					<boxGeometry args={[w + 0.05, 0.12, d + 0.05]} />
					<meshStandardMaterial color={neon} emissive={neon} emissiveIntensity={4} toneMapped={false} />
				</mesh>
			) : null}
		</group>
	);
};

// Nuvem volumétrica aproximada: cluster de esferas suaves (geometria real, iluminada).
export const CloudPuff: React.FC<{seed: number; scale?: number; color?: string; opacity?: number} & ThreeElements['group']> = ({seed, scale = 1, color = '#ffffff', opacity = 1, ...props}) => {
	const puffs = useMemo(() => {
		const r = rand(seed);
		return [...Array(14)].map(() => ({p: [(r() - 0.5) * 6, (r() - 0.3) * 1.6, (r() - 0.5) * 3] as [number, number, number], s: 0.9 + r() * 1.4}));
	}, [seed]);
	return (
		<group scale={scale} {...props}>
			{puffs.map((p, i) => (
				<mesh key={i} position={p.p} scale={p.s} castShadow receiveShadow>
					<icosahedronGeometry args={[1, 3]} />
					<meshStandardMaterial color={color} roughness={1} transparent={opacity < 1} opacity={opacity} />
				</mesh>
			))}
		</group>
	);
};

// Domo de céu com gradiente (geometria esférica, não imagem).
export const SkyDome: React.FC<{top: string; bottom: string; radius?: number}> = ({top, bottom, radius = 400}) => {
	const geo = useMemo(() => {
		const g = new THREE.SphereGeometry(radius, 32, 16);
		const cTop = new THREE.Color(top), cBot = new THREE.Color(bottom);
		const colors: number[] = [];
		const pos = g.attributes.position;
		for (let i = 0; i < pos.count; i++) {
			const t = THREE.MathUtils.clamp(pos.getY(i) / radius * 1.5 + 0.3, 0, 1);
			const c = cBot.clone().lerp(cTop, t);
			colors.push(c.r, c.g, c.b);
		}
		g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
		return g;
	}, [top, bottom, radius]);
	return (
		<mesh geometry={geo}>
			<meshBasicMaterial vertexColors side={THREE.BackSide} fog={false} depthWrite={false} />
		</mesh>
	);
};

// Figura humana estilizada (manequim) — usada como REPRESENTAÇÃO ILUSTRATIVA.
export const Mannequin: React.FC<{color?: string; skin?: string; hair?: string; female?: boolean; pose?: number} & ThreeElements['group']> = ({color = '#2b4c7e', skin = '#c99a74', hair = '#1a120c', female = false, pose = 0, ...props}) => (
	<group {...props}>
		<mesh position={[0, 1.25, 0]} castShadow><capsuleGeometry args={[female ? 0.24 : 0.28, 0.7, 8, 16]} /><meshStandardMaterial color={color} roughness={0.7} /></mesh>
		<mesh position={[0, 1.95, 0]} castShadow><sphereGeometry args={[0.2, 24, 24]} /><meshStandardMaterial color={skin} roughness={0.6} /></mesh>
		<mesh position={[0, 2.03, -0.03]} castShadow scale={female ? [1.05, 1.1, 1.25] : [1.02, 0.7, 1.05]}><sphereGeometry args={[0.2, 24, 24, 0, Math.PI * 2, 0, Math.PI / 1.8]} /><meshStandardMaterial color={hair} roughness={0.8} /></mesh>
		{[-0.12, 0.12].map((x) => <mesh key={x} position={[x, 0.45, 0]} castShadow><capsuleGeometry args={[0.1, 0.65, 6, 12]} /><meshStandardMaterial color="#1c1c22" roughness={0.8} /></mesh>)}
		{[-1, 1].map((sgn) => <mesh key={sgn} position={[sgn * (female ? 0.33 : 0.37), 1.3, 0]} rotation={[0, 0, sgn * (0.15 + pose)]} castShadow><capsuleGeometry args={[0.07, 0.6, 6, 12]} /><meshStandardMaterial color={skin} roughness={0.6} /></mesh>)}
	</group>
);
