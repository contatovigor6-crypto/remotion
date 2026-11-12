import {Environment, RoundedBox, Sparkles} from '@react-three/drei';
import {ThreeCanvas} from '@remotion/three';
import {useMemo} from 'react';
import {Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {Building, Car3D, CloudPuff, Console3D, Mannequin, Palm, rand, SkyDome} from '../three/kit';
import {path, Rig} from '../three/rig';

const G = '#39FF7A';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Stage: React.FC<{children: React.ReactNode; bg: string; fog?: [number, number]; hdri: string; env?: number}> = ({children, bg, fog = [10, 60], hdri, env = 0.5}) => {
	const {width, height} = useVideoConfig();
	return (
		<ThreeCanvas width={width} height={height} shadows gl={{toneMapping: THREE.ACESFilmicToneMapping, antialias: true}} camera={{fov: 40, near: 0.1, far: 900}}>
			<color attach="background" args={[bg]} />
			<fog attach="fog" args={[bg, fog[0], fog[1]]} />
			<Environment files={staticFile(`hdri/${hdri}.hdr`)} environmentIntensity={env} />
			{children}
		</ThreeCanvas>
	);
};

// 1) ESTÚDIO: console no pedestal, câmera orbitando rápido + push-in. "É REAL" = flash de luz verde.
export const StudioHook: React.FC<{realAt: number}> = ({realAt}) => {
	const frame = useCurrentFrame();
	const a = interpolate(frame, [0, realAt + 30], [-1.6, 0.35], clamp);
	const r = interpolate(frame, [0, realAt], [14, 7.5], {...clamp, easing: Easing.out(Easing.cubic)});
	const hit = frame >= realAt ? Math.max(0, 1 - (frame - realAt) / 12) : 0;
	return (
		<Stage bg="#040508" hdri="studio_small_08" fog={[8, 35]}>
			<Rig frame={frame} pos={[Math.sin(a) * r, 2.2 + r * 0.15, Math.cos(a) * r]} look={[0, 1.1, 0]} fov={38} shake={hit * 0.15} />
			<spotLight position={[0, 9, 2]} angle={0.35} penumbra={0.7} intensity={420} castShadow shadow-mapSize={[1024, 1024]} />
			<spotLight position={[-6, 3, -4]} angle={0.5} penumbra={1} intensity={frame >= realAt ? 260 : 80} color={G} />
			<pointLight position={[0, 1.5, 4]} intensity={hit * 60} color={G} />
			<Console3D position={[0, 1.3, 0]} dust={0.6} />
			<mesh position={[0, 0.4, 0]} castShadow receiveShadow>
				<cylinderGeometry args={[2.6, 2.8, 0.8, 64]} />
				<meshPhysicalMaterial color="#1a1c22" metalness={0.8} roughness={0.25} clearcoat={1} />
			</mesh>
			<mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
				<circleGeometry args={[40, 64]} />
				<meshStandardMaterial color="#0c0d11" roughness={0.25} metalness={0.6} />
			</mesh>
			<Sparkles count={60} scale={[10, 6, 10]} size={3} speed={0} opacity={0.5} color="#cfd6ff" position={[0, 3, 0]} />
		</Stage>
	);
};

// 2) QUARTO: gaveta abre, console sobe brilhando; "não é brincadeira" = snap pro close.
export const BedroomRise: React.FC<{riseFrom: number; riseTo: number; snapAt: number}> = ({riseFrom, riseTo, snapAt}) => {
	const frame = useCurrentFrame();
	const open = interpolate(frame, [riseFrom - 20, riseFrom], [0, 1.6], {...clamp, easing: Easing.out(Easing.cubic)});
	const rise = interpolate(frame, [riseFrom, riseTo], [0, 1.9], {...clamp, easing: Easing.out(Easing.back(1.2))});
	const glow = interpolate(frame, [riseTo - 10, riseTo + 10], [0, 1], clamp);
	const snap = frame >= snapAt;
	const cam = snap
		? path(frame, [[snapAt, [4.5, 4.4, 9.5]], [snapAt + 60, [3.2, 3.8, 7.8]]], Easing.out(Easing.quad))
		: path(frame, [[0, [-5, 5.5, 17]], [riseTo, [-2.6, 4.2, 11.5]]]);
	return (
		<Stage bg="#0d0a12" hdri="studio_small_08" env={0.45} fog={[9, 30]}>
			<Rig frame={frame} pos={cam} look={[0, 1.1 + rise * 0.6, 0]} fov={snap ? 34 : 42} shake={snap && frame - snapAt < 8 ? 0.05 : 0} />
			<ambientLight intensity={0.55} color="#b9a7ff" />
			{/* luminária */}
			<pointLight position={[3.4, 3.4, -1.2]} intensity={70} color="#ffb36b" castShadow distance={14} />
			<mesh position={[3.4, 3.3, -1.2]}><sphereGeometry args={[0.28, 24, 24]} /><meshStandardMaterial emissive="#ffb36b" emissiveIntensity={3} color="#ffb36b" toneMapped={false} /></mesh>
			{/* luz da janela (lua) */}
			<directionalLight position={[-6, 6, -2]} intensity={0.6} color="#7c9cff" castShadow shadow-mapSize={[1024, 1024]} />
			{/* quarto */}
			<mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[14, 14]} /><meshStandardMaterial color="#5b3d28" roughness={0.6} /></mesh>
			<mesh position={[0, 3.5, -3]} receiveShadow><planeGeometry args={[14, 7]} /><meshStandardMaterial color="#2c2a3a" roughness={0.9} /></mesh>
			<mesh position={[-5, 3.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow><planeGeometry args={[14, 7]} /><meshStandardMaterial color="#26243a" roughness={0.9} /></mesh>
			<mesh position={[-4.98, 3.6, -0.5]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[2.2, 2.6]} /><meshStandardMaterial color="#1b2a55" emissive="#2a3f80" emissiveIntensity={0.6} /></mesh>
			{/* cama */}
			<RoundedBox args={[3.2, 0.7, 5]} radius={0.15} position={[3.6, 0.35, 1.5]} castShadow receiveShadow><meshStandardMaterial color="#3a4f7a" roughness={0.9} /></RoundedBox>
			{/* cômoda + gaveta */}
			<RoundedBox args={[4.2, 1.6, 2.2]} radius={0.05} position={[0, 0.8, -1.4]} castShadow receiveShadow><meshStandardMaterial color="#6e4b2f" roughness={0.7} /></RoundedBox>
			<group position={[0, 0.85, -1.2 + open]}>
				<mesh castShadow receiveShadow><boxGeometry args={[3.8, 0.9, 2]} /><meshStandardMaterial color="#7d5636" roughness={0.6} /></mesh>
				<mesh position={[0, 0, 1.02]}><boxGeometry args={[0.8, 0.12, 0.1]} /><meshStandardMaterial color="#c9a46a" metalness={0.9} roughness={0.2} /></mesh>
			</group>
			<Console3D scale={0.85} position={[0, 0.85 + rise, -1.2 + open]} glowColor={G} glow={0.3 + glow * 1.5} dust={1 - glow} />
			<pointLight position={[0, 1.6 + rise, -0.2 + open]} color={G} intensity={glow * 30} distance={8} />
			<Sparkles count={70} scale={[3, 3, 2]} size={4} speed={0} opacity={glow} color={G} position={[0, 2 + rise, -0.6 + open]} />
		</Stage>
	);
};

// 3) VOO EM PRIMEIRA PESSOA ENTRE PRÉDIOS (Vice City à noite) — "como funciona".
export const CityFlythrough: React.FC = () => {
	const frame = useCurrentFrame();
	const z = interpolate(frame, [0, 100], [40, -60]);
	const blds = useMemo(() => {
		const r = rand(42);
		return [...Array(40)].map((_, i) => ({x: (i % 2 ? 1 : -1) * (6 + r() * 6), z: 40 - Math.floor(i / 2) * 6, w: 3 + r() * 3, h: 8 + r() * 26, d: 3 + r() * 3, seed: i * 13 + 5, neon: r() < 0.5 ? (r() < 0.5 ? '#ff2e88' : '#2de2e6') : undefined}));
	}, []);
	return (
		<Stage bg="#120a24" hdri="modern_buildings_night" env={0.3} fog={[10, 70]}>
			<Rig frame={frame} pos={[Math.sin(frame / 15) * 1.5, 4 + Math.sin(frame / 9) * 0.6, z]} look={[Math.sin(frame / 15 + 0.6) * 2, 4.5, z - 10]} fov={60} roll={Math.sin(frame / 15) * 0.12} />
			<SkyDome top="#0b0620" bottom="#ff2e88" />
			<ambientLight intensity={0.3} />
			<directionalLight position={[10, 20, 5]} intensity={0.5} color="#ff9ad5" />
			{blds.map((b, i) => <Building key={i} position={[b.x, 0, b.z]} w={b.w} h={b.h} d={b.d} seed={b.seed} neon={b.neon} />)}
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -20]} receiveShadow><planeGeometry args={[60, 200]} /><meshStandardMaterial color="#0b0b12" roughness={0.15} metalness={0.8} /></mesh>
			{[...Array(20)].map((_, i) => (
				<mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 40 - i * 6]}><planeGeometry args={[0.25, 2.5]} /><meshStandardMaterial color="#ffd36b" emissive="#ffd36b" emissiveIntensity={1.5} /></mesh>
			))}
		</Stage>
	);
};

// 4) NUVENS VOLUMÉTRICAS: câmera atravessa as nuvens e desce até o console iluminado por um feixe.
export const CloudDescent: React.FC<{dayAt: number}> = ({dayAt}) => {
	const frame = useCurrentFrame();
	const cam = path(frame, [[0, [0, 36, 30]], [110, [15, 15, 18]], [200, [4, 4.5, 11]]]);
	const pulse = frame >= dayAt ? 1 + Math.max(0, 1 - (frame - dayAt) / 15) * 2 : 1;
	return (
		<Stage bg="#0a1830" hdri="moonless_golf" env={0.4} fog={[8, 60]}>
			<Rig frame={frame} pos={cam} look={[0, interpolate(frame, [0, 200], [12, 1.5], clamp), 0]} fov={45} />
			<SkyDome top="#030a1a" bottom="#2a4d80" />
			<ambientLight intensity={0.35} color="#9fb8ff" />
			<directionalLight position={[8, 30, 6]} intensity={1.6} color="#dfe8ff" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-20} shadow-camera-right={20} shadow-camera-top={20} shadow-camera-bottom={-20} />
			{[...Array(9)].map((_, i) => (
				<CloudPuff key={i} seed={i * 31 + 7} scale={1.4 + (i % 3) * 0.5} position={[((i * 7) % 15) - 7 + Math.sin(frame / 60 + i) * 0.5, 13 + (i % 4) * 2.5, -6 + ((i * 5) % 14)]} />
			))}
			{/* feixe de "streaming" */}
			<mesh position={[0, 7, 0]}>
				<cylinderGeometry args={[0.6, 2.2, 12, 32, 1, true]} />
				<meshBasicMaterial color={G} transparent opacity={0.12 * pulse} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
			</mesh>
			{[...Array(8)].map((_, i) => {
				const y = 12 - (((frame * 0.25 + i * 1.5) % 12));
				return <mesh key={i} position={[Math.sin(i) * 0.6, y, Math.cos(i) * 0.6]}><octahedronGeometry args={[0.18]} /><meshStandardMaterial color={G} emissive={G} emissiveIntensity={3} toneMapped={false} /></mesh>;
			})}
			<Console3D position={[0, 0.5, 0]} glowColor={G} glow={pulse} />
			<pointLight position={[0, 3, 0]} intensity={20 * pulse} color={G} distance={10} />
			<mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[30, 64]} /><meshStandardMaterial color="#101622" roughness={0.3} metalness={0.5} /></mesh>
		</Stage>
	);
};

// 5) RUA DE VICE CITY AO PÔR DO SOL: travelling acompanhando carro, palmeiras, prédios;
// "Jason e Lucia" = duas figuras 3D ILUSTRATIVAS ao lado de um carro.
export const ViceStreet: React.FC<{viceAt: number; jlAt: number}> = ({viceAt, jlAt}) => {
	const frame = useCurrentFrame();
	const carZ = interpolate(frame, [0, 260], [30, -50]);
	const jl = frame >= jlAt;
	const cam = jl
		? path(frame, [[jlAt, [-4.6, 2.6, -31]], [jlAt + 50, [-3.9, 2.2, -35]]], Easing.out(Easing.cubic))
		: ([-3.5, 1.4 + Math.sin(frame / 20) * 0.1, carZ + 7] as [number, number, number]);
	const look: [number, number, number] = jl ? [-1.5, 1.4, -45] : [0, 1, carZ];
	const palms = useMemo(() => [...Array(16)].map((_, i) => ({x: i % 2 ? 7.5 : -7.5, z: 30 - Math.floor(i / 2) * 11})), []);
	const blds = useMemo(() => {
		const r = rand(7);
		return [...Array(16)].map((_, i) => ({x: (i % 2 ? 1 : -1) * (14 + r() * 4), z: 30 - Math.floor(i / 2) * 11, w: 6, h: 6 + r() * 16, d: 8, c: ['#f7c6a3', '#9fe3e0', '#f2a7c3', '#fff1c9'][i % 4]}));
	}, []);
	const traffic = [0, 1, 2].map((i) => interpolate(frame, [0, 260], [-50 + i * 25, 40 + i * 25]) % 90 - 45);
	return (
		<Stage bg="#f08a5d" hdri="venice_sunset" env={0.9} fog={[20, 110]}>
			<Rig frame={frame} pos={cam} look={look} fov={jl ? 36 : 50} shake={frame >= viceAt && frame < viceAt + 6 ? 0.05 : 0} />
			<SkyDome top="#3b1f6b" bottom="#ffb36b" />
			<directionalLight position={[-30, 12, -40]} intensity={2.2} color="#ffb070" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-40} shadow-camera-right={40} shadow-camera-top={40} shadow-camera-bottom={-40} shadow-camera-far={150} />
			<mesh position={[-60, 14, -160]}><sphereGeometry args={[14, 32, 32]} /><meshBasicMaterial color="#ffd27a" fog={false} /></mesh>
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -10]} receiveShadow><planeGeometry args={[12, 200]} /><meshStandardMaterial color="#2a2a30" roughness={0.45} metalness={0.2} /></mesh>
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -10]} receiveShadow><planeGeometry args={[80, 200]} /><meshStandardMaterial color="#c9b79a" roughness={0.9} /></mesh>
			{[...Array(24)].map((_, i) => <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 30 - i * 5]}><planeGeometry args={[0.2, 2]} /><meshStandardMaterial color="#f5f5f5" /></mesh>)}
			{palms.map((p, i) => <Palm key={i} position={[p.x, 0, p.z]} sway={Math.sin(frame / 25 + i) * 0.3} />)}
			{blds.map((b, i) => (
				<mesh key={i} position={[b.x, b.h / 2, b.z]} castShadow receiveShadow><boxGeometry args={[b.w, b.h, b.d]} /><meshStandardMaterial color={b.c} roughness={0.7} /></mesh>
			))}
			<Car3D position={[1.6, 0, carZ]} rotation={[0, Math.PI, 0]} color="#ff2e88" />
			{traffic.map((z, i) => <Car3D key={i} position={[-1.8, 0, z]} color={['#2de2e6', '#ffe45e', '#ffffff'][i]} />)}
			{/* figuras ilustrativas */}
			<Car3D position={[-3, 0, -46]} rotation={[0, 0.4, 0]} color="#1b1b22" />
			<Mannequin position={[-1.4, 0, -44]} rotation={[0, -0.6, 0]} color="#3d5a80" />
			<Mannequin position={[-0.4, 0, -44.6]} rotation={[0, -0.9, 0]} female color="#b23a48" hair="#3b1d14" pose={0.1} />
		</Stage>
	);
};

// 6) SURREAL: placa de PARE gigante despenca num vazio vermelho; depois lupa sobre "letras miúdas" 3D.
export const StopVoid: React.FC<{detailAt: number}> = ({detailAt}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const drop = spring({frame, fps, config: {damping: 11, mass: 0.8}});
	const land = frame > 6 && frame < 16 ? 0.25 : 0;
	const second = frame >= detailAt;
	const lens = second ? Math.sin((frame - detailAt) / 10) * 1.6 : 0;
	return (
		<Stage bg={second ? '#0b0b10' : '#2a0306'} hdri="studio_small_08" env={0.4} fog={[6, 40]}>
			{!second ? (
				<>
					<Rig frame={frame} pos={[2, 1.2, 9]} look={[0, 3, 0]} fov={42} shake={land} />
					<spotLight position={[4, 12, 6]} angle={0.5} penumbra={0.5} intensity={500} castShadow shadow-mapSize={[1024, 1024]} />
					<pointLight position={[-4, 2, 3]} intensity={30} color="#ff3b3b" />
					<group position={[0, interpolate(drop, [0, 1], [16, 0]), 0]}>
						<mesh position={[0, 4.2, 0]} rotation={[Math.PI / 2, Math.PI / 8, 0]} castShadow>
							<cylinderGeometry args={[2.6, 2.6, 0.18, 8]} />
							<meshPhysicalMaterial color="#d81e1e" roughness={0.35} clearcoat={1} />
						</mesh>
						<mesh position={[0, 4.2, -0.01]} rotation={[Math.PI / 2, Math.PI / 8, 0]}>
							<cylinderGeometry args={[2.85, 2.85, 0.14, 8]} />
							<meshStandardMaterial color="#f2f2f2" roughness={0.4} />
						</mesh>
						<mesh position={[0, 1.2, -0.15]} castShadow><cylinderGeometry args={[0.12, 0.12, 4.5, 16]} /><meshStandardMaterial color="#9aa0aa" metalness={0.9} roughness={0.3} /></mesh>
					</group>
					<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow><circleGeometry args={[30, 64]} /><meshStandardMaterial color="#3a0508" roughness={0.6} /></mesh>
				</>
			) : (
				<>
					<Rig frame={frame} pos={path(frame, [[detailAt, [0, 6, 6]], [detailAt + 70, [0.5, 3.2, 3.6]]])} look={[lens * 0.4, 0, 0]} fov={45} />
					<spotLight position={[0, 10, 4]} angle={0.5} penumbra={0.6} intensity={300} castShadow shadow-mapSize={[1024, 1024]} />
					<FinePrint />
					<group position={[lens, 1.6, 0.3]}>
						<mesh rotation={[Math.PI / 2, 0, 0]} castShadow><torusGeometry args={[1, 0.12, 24, 64]} /><meshStandardMaterial color="#c9c9d1" metalness={1} roughness={0.15} /></mesh>
						<mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.95, 0.95, 0.04, 48]} /><meshPhysicalMaterial transmission={1} thickness={0.6} roughness={0} ior={1.5} color="#e8f6ff" /></mesh>
						<mesh position={[0.9, 0, 1.5]} rotation={[Math.PI / 2, 0, 0.6]} castShadow><cylinderGeometry args={[0.13, 0.13, 1.8, 16]} /><meshStandardMaterial color="#3b2416" roughness={0.6} /></mesh>
					</group>
				</>
			)}
		</Stage>
	);
};

const FinePrint: React.FC = () => {
	const tex = useMemo(() => {
		const c = document.createElement('canvas');
		c.width = 512; c.height = 512;
		const g = c.getContext('2d')!;
		g.fillStyle = '#f3efe4'; g.fillRect(0, 0, 512, 512);
		g.fillStyle = '#111'; g.font = 'bold 44px sans-serif'; g.fillText('TERMOS E CONDIÇÕES*', 40, 70);
		g.fillStyle = '#555';
		const r = rand(3);
		for (let y = 110; y < 500; y += 14) g.fillRect(40, y, 300 + r() * 130, 5);
		const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
	}, []);
	return (
		<>
			<mesh rotation={[-Math.PI / 2, 0, 0.08]} receiveShadow><boxGeometry args={[5, 5, 0.04]} /><meshStandardMaterial map={tex} roughness={0.9} /></mesh>
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow><planeGeometry args={[40, 40]} /><meshStandardMaterial color="#2a1d14" roughness={0.7} /></mesh>
		</>
	);
};

// 7) DISCO SE ESTILHAÇA ("sem versão nativa") — material iridescente, fatias explodindo.
export const DiscShatter: React.FC<{breakAt: number}> = ({breakAt}) => {
	const frame = useCurrentFrame();
	const t = Math.max(0, frame - breakAt);
	const pieces = 10;
	return (
		<Stage bg="#12040a" hdri="studio_small_08" env={1} fog={[6, 30]}>
			<Rig frame={frame} pos={[Math.sin(frame / 40) * 2, 1.2, 7 - Math.min(t, 20) * 0.05]} look={[0, 1.2, 0]} fov={40} shake={t > 0 && t < 10 ? 0.08 : 0} />
			<spotLight position={[3, 8, 5]} angle={0.5} penumbra={0.6} intensity={300} castShadow />
			<pointLight position={[-3, 1, 2]} intensity={t > 0 ? 50 : 10} color="#ff2a2a" />
			<group position={[0, 1.4, 0]} rotation={[0.35, frame * 0.08, 0]}>
				{[...Array(pieces)].map((_, i) => {
					const ang = (i / pieces) * Math.PI * 2 + Math.PI / pieces;
					const d = t * 0.12;
					return (
						<mesh key={i} position={[Math.cos(ang) * d, Math.sin(ang) * d - t * t * 0.002, 0]} rotation={[t * 0.05 * (i % 2 ? 1 : -1), 0, t * 0.04]}>
							<cylinderGeometry args={[2, 2, 0.05, 8, 1, false, (i / pieces) * Math.PI * 2, (Math.PI * 2) / pieces]} />
							<meshPhysicalMaterial color="#d9dde8" metalness={1} roughness={0.08} iridescence={1} iridescenceIOR={1.6} clearcoat={1} />
						</mesh>
					);
				})}
			</group>
		</Stage>
	);
};

// 8) DATA CENTER NAS NUVENS: dolly em 1ª pessoa pelo corredor de servidores.
export const ServerAisle: React.FC = () => {
	const frame = useCurrentFrame();
	const z = interpolate(frame, [0, 140], [14, -6]);
	return (
		<Stage bg="#030a08" hdri="modern_buildings_night" env={0.2} fog={[4, 30]}>
			<Rig frame={frame} pos={[0, 1.7 + Math.sin(frame / 6) * 0.03, z]} look={[0, 1.6, z - 6]} fov={58} />
			<ambientLight intensity={0.1} />
			{[...Array(6)].map((_, i) => <pointLight key={i} position={[0, 4.2, 12 - i * 5]} intensity={8} distance={7} color="#bfe9ff" />)}
			{[-1, 1].map((side) => [...Array(12)].map((_, i) => (
				<group key={`${side}${i}`} position={[side * 2.1, 0, 16 - i * 2.1]}>
					<mesh position={[0, 1.5, 0]} castShadow receiveShadow><boxGeometry args={[1.4, 3, 2]} /><meshStandardMaterial color="#14171c" metalness={0.7} roughness={0.35} /></mesh>
					{[...Array(10)].map((_, k) => (
						<mesh key={k} position={[-side * 0.71, 0.4 + k * 0.27, ((k * 37 + i * 11) % 9) / 10 - 0.45]}>
							<boxGeometry args={[0.02, 0.05, 0.08]} />
							<meshStandardMaterial color={G} emissive={(frame + k * 3 + i * 7) % 14 < 7 ? G : '#0a3'} emissiveIntensity={4} toneMapped={false} />
						</mesh>
					))}
				</group>
			)))}
			<mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[8, 60]} /><meshStandardMaterial color="#0d1013" metalness={0.6} roughness={0.2} /></mesh>
			<mesh position={[0, 4.6, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[8, 60]} /><meshStandardMaterial color="#090b0d" /></mesh>
			<Console3D position={[0, 0.5, -8]} glowColor={G} glow={1.5} scale={0.7} />
		</Stage>
	);
};

// 9) GARAGEM: carro no showroom, câmera orbitando; cada requisito acende um holofote.
export const Garage: React.FC<{lights: number[]}> = ({lights}) => {
	const frame = useCurrentFrame();
	const a = frame / 70;
	const on = lights.map((l) => interpolate(frame, [l, l + 6], [0, 1], clamp));
	return (
		<Stage bg="#0b0b0e" hdri="autoshop_01" env={0.35} fog={[8, 40]}>
			<Rig frame={frame} pos={[Math.sin(a) * 9, 2.6, Math.cos(a) * 9]} look={[0, 0.9, 0]} fov={40} />
			<ambientLight intensity={0.08} />
			{[-3, 0, 3].map((x, i) => (
				<group key={i}>
					<spotLight position={[x, 7, 2]} angle={0.35} penumbra={0.5} intensity={on[i] * 260} color={['#ffffff', G, '#ffd36b'][i]} castShadow shadow-mapSize={[1024, 1024]} />
					<mesh position={[x, 6.8, 2]}><cylinderGeometry args={[0.3, 0.4, 0.4, 24]} /><meshStandardMaterial color="#222" emissive={['#ffffff', G, '#ffd36b'][i]} emissiveIntensity={on[i] * 2} /></mesh>
				</group>
			))}
			<Car3D color="#ffe45e" rotation={[0, frame / 120, 0]} />
			<mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[40, 40]} /><meshStandardMaterial color="#3a3d42" roughness={0.35} metalness={0.3} /></mesh>
			<mesh position={[0, 4, -8]} receiveShadow><planeGeometry args={[40, 8]} /><meshStandardMaterial color="#5b5e63" roughness={0.9} /></mesh>
			<mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[3.4, 3.55, 64]} /><meshStandardMaterial color="#ffe45e" emissive="#ffe45e" emissiveIntensity={0.5} /></mesh>
		</Stage>
	);
};

// 10) PRAIA AO PÔR DO SOL: console de óculos na espreguiçadeira; dolly-in.
export const Beach: React.FC<{coolAt: number}> = ({coolAt}) => {
	const frame = useCurrentFrame();
	const water = useMemo(() => new THREE.PlaneGeometry(200, 120, 80, 40), []);
	useMemo(() => {
		const p = water.attributes.position;
		for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * 0.4 + frame * 0.08) * 0.15 + Math.cos(p.getY(i) * 0.5 + frame * 0.05) * 0.12);
		p.needsUpdate = true;
		water.computeVertexNormals();
	}, [water, frame]);
	const cool = frame >= coolAt;
	return (
		<Stage bg="#f6a36b" hdri="spiaggia_di_mondello" env={0.8} fog={[25, 140]}>
			<Rig frame={frame} pos={path(frame, [[0, [6, 3.2, 12]], [cool ? coolAt + 40 : 9999, [1.6, 1.6, 4.6]]])} look={[0, 1, 0]} fov={38} />
			<SkyDome top="#5a3a8a" bottom="#ffc27a" />
			<directionalLight position={[-20, 10, -40]} intensity={2.4} color="#ffbd7a" castShadow shadow-mapSize={[1024, 1024]} />
			<mesh position={[-30, 6, -110]}><sphereGeometry args={[10, 32, 32]} /><meshBasicMaterial color="#ffe0a0" fog={false} /></mesh>
			<mesh geometry={water} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, -60]}><meshPhysicalMaterial color="#1f6f8b" roughness={0.08} metalness={0.2} clearcoat={1} /></mesh>
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 5]} receiveShadow><planeGeometry args={[200, 30]} /><meshStandardMaterial color="#e9cf9f" roughness={1} /></mesh>
			{/* espreguiçadeira */}
			<group position={[0, 0, 0]}>
				<mesh position={[0, 0.5, 0.5]} rotation={[-0.15, 0, 0]} castShadow receiveShadow><boxGeometry args={[2.2, 0.1, 3]} /><meshStandardMaterial color="#e94f6a" roughness={0.8} /></mesh>
				<mesh position={[0, 1.3, -1.1]} rotation={[0.9, 0, 0]} castShadow><boxGeometry args={[2.2, 0.1, 1.8]} /><meshStandardMaterial color="#e94f6a" roughness={0.8} /></mesh>
				{[-1, 1].map((x) => <mesh key={x} position={[x, 0.25, 0.5]} castShadow><boxGeometry args={[0.08, 0.5, 3]} /><meshStandardMaterial color="#ddd" metalness={0.8} roughness={0.3} /></mesh>)}
			</group>
			<Console3D scale={0.55} position={[0, 0.85, 0.4]} rotation={[-0.15, 0, 0]} glasses={cool} glowColor={G} />
			<Palm position={[-5, 0, -3]} sway={Math.sin(frame / 25) * 0.3} />
			<Palm position={[6, 0, -6]} sway={Math.sin(frame / 25 + 2) * 0.3} />
			<mesh position={[2.6, 0, -0.5]} castShadow><cylinderGeometry args={[0.05, 0.05, 4, 8]} /><meshStandardMaterial color="#ddd" /></mesh>
			<mesh position={[2.6, 3.8, -0.5]} castShadow><coneGeometry args={[2.4, 0.9, 16, 1, true]} /><meshStandardMaterial color="#2de2e6" side={THREE.DoubleSide} roughness={0.7} /></mesh>
		</Stage>
	);
};

// 11) RUA NOTURNA COM CHUVA E REFLEXOS: grua sobe até o letreiro neon da marca.
export const RainyNight: React.FC<{followAt: number}> = ({followAt}) => {
	const frame = useCurrentFrame();
	const drops = useMemo(() => {
		const r = rand(99);
		return [...Array(260)].map(() => ({x: (r() - 0.5) * 24, y: r() * 16, z: (r() - 0.5) * 30, s: 0.5 + r() * 0.5}));
	}, []);
	const crane = frame >= followAt;
	const cam = crane ? path(frame, [[followAt, [0, 2, 12]], [followAt + 60, [0, 9.5, 9]]], Easing.out(Easing.cubic)) : path(frame, [[0, [-5, 1.4, 14]], [followAt, [-1, 1.6, 10]]]);
	return (
		<Stage bg="#06070d" hdri="modern_buildings_night" env={0.35} fog={[8, 50]}>
			<Rig frame={frame} pos={cam} look={crane ? [0, 9, -6] : [1, 2, -4]} fov={44} />
			<ambientLight intensity={0.1} />
			<pointLight position={[-4, 5, -2]} intensity={60} color="#ff2e88" distance={20} />
			<pointLight position={[5, 4, -4]} intensity={60} color="#2de2e6" distance={20} />
			{/* chão molhado (espelhado/metálico) */}
			<mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[60, 80]} /><meshPhysicalMaterial color="#0a0b10" roughness={0.05} metalness={0.9} clearcoat={1} /></mesh>
			{[...Array(8)].map((_, i) => <Building key={i} position={[(i % 2 ? 1 : -1) * 9, 0, 4 - Math.floor(i / 2) * 9]} w={6} h={12 + (i % 3) * 6} d={7} seed={i * 17} neon={i % 2 ? '#2de2e6' : '#ff2e88'} />)}
			<Building position={[0, 0, -14]} w={14} h={9} d={6} seed={5} />
			{/* letreiro neon 3D "ZG6" sobre o prédio */}
			<group position={[0, 9.6, -11]}>
				<RoundedBox args={[7.5, 2, 0.4]} radius={0.15}><meshStandardMaterial color="#111" metalness={0.6} roughness={0.3} /></RoundedBox>
				<mesh position={[0, 0, 0.25]}><torusGeometry args={[0.7, 0.08, 16, 48]} /><meshStandardMaterial color="#ff2e88" emissive="#ff2e88" emissiveIntensity={5} toneMapped={false} /></mesh>
				{[-2.4, 2.4].map((x, i) => <mesh key={x} position={[x, 0, 0.25]}><boxGeometry args={[1.6, 0.16, 0.1]} /><meshStandardMaterial color={i ? G : '#2de2e6'} emissive={i ? G : '#2de2e6'} emissiveIntensity={5} toneMapped={false} /></mesh>)}
				<pointLight position={[0, 0, 1.5]} color="#ff2e88" intensity={40} distance={15} />
			</group>
			<Car3D position={[2.2, 0, -2]} rotation={[0, -0.3, 0]} color="#2a6cff" />
			{/* chuva */}
			{drops.map((d, i) => {
				const y = ((d.y - frame * 0.6 * d.s) % 16 + 16) % 16;
				return <mesh key={i} position={[d.x, y, d.z]}><boxGeometry args={[0.012, 0.5, 0.012]} /><meshBasicMaterial color="#9fb4d8" transparent opacity={0.5} /></mesh>;
			})}
		</Stage>
	);
};
