import {useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import React, {useMemo} from 'react';
import {interpolate, random, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import * as THREE from 'three';

// Mundo 3D original (cidade praiana neon fictícia). Cada trecho do roteiro tem
// um "set" próprio e uma câmera em movimento; a troca de set é um corte seco.

const PINK = '#ff2e88';
const ORANGE = '#ff8a3d';
const CYAN = '#22e4ff';
const YELLOW = '#ffe600';
const GREEN = '#39ff88';

type V3 = [number, number, number];

const lerp3 = (a: V3, b: V3, k: number): V3 => [
	a[0] + (b[0] - a[0]) * k,
	a[1] + (b[1] - a[1]) * k,
	a[2] + (b[2] - a[2]) * k,
];

// Move a câmera entre duas posições ao longo do trecho
const CameraRig: React.FC<{from: V3; to: V3; lookFrom: V3; lookTo: V3; k: number; fov?: number}> = ({
	from,
	to,
	lookFrom,
	lookTo,
	k,
	fov = 55,
}) => {
	const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
	const e = Easing.inOut(Easing.sin)(k);
	camera.position.set(...lerp3(from, to, e));
	camera.fov = fov;
	camera.updateProjectionMatrix();
	camera.lookAt(new THREE.Vector3(...lerp3(lookFrom, lookTo, e)));
	return null;
};

/* ------------------------------ peças ------------------------------ */

const useWindowTexture = (seed: string) =>
	useMemo(() => {
		const c = document.createElement('canvas');
		c.width = 64;
		c.height = 128;
		const ctx = c.getContext('2d')!;
		ctx.fillStyle = '#0d0620';
		ctx.fillRect(0, 0, 64, 128);
		for (let y = 4; y < 128; y += 10) {
			for (let x = 4; x < 64; x += 10) {
				const r = random(`${seed}${x}-${y}`);
				ctx.fillStyle = r > 0.55 ? (r > 0.85 ? '#7ff0ff' : '#ffd77a') : '#1a1030';
				ctx.fillRect(x, y, 6, 6);
			}
		}
		const tex = new THREE.CanvasTexture(c);
		tex.magFilter = THREE.NearestFilter;
		tex.colorSpace = THREE.SRGBColorSpace;
		return tex;
	}, [seed]);

const City: React.FC<{seed: string; size?: number; lit?: number}> = ({seed, size = 10, lit = 1}) => {
	const tex = useWindowTexture(seed);
	const buildings = useMemo(() => {
		const out: {x: number; z: number; w: number; d: number; h: number; neon: boolean}[] = [];
		for (let i = -size; i <= size; i++) {
			for (let j = -size; j <= size; j++) {
				if (i % 3 === 0 || j % 3 === 0) continue; // ruas
				const r = random(`${seed}${i}:${j}`);
				if (r < 0.15) continue;
				const dist = Math.hypot(i, j);
				out.push({
					x: i * 6,
					z: j * 6,
					w: 3.5 + random(`${seed}w${i}${j}`) * 1.5,
					d: 3.5 + random(`${seed}d${i}${j}`) * 1.5,
					h: 4 + r * r * Math.max(6, 38 - dist * 1.8),
					neon: random(`${seed}n${i}${j}`) > 0.8,
				});
			}
		}
		return out;
	}, [seed, size]);
	return (
		<group>
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
				<planeGeometry args={[size * 14, size * 14]} />
				<meshStandardMaterial color="#14101f" />
			</mesh>
			{buildings.map((b, i) => (
				<group key={i} position={[b.x, b.h / 2, b.z]}>
					<mesh>
						<boxGeometry args={[b.w, Math.max(b.h, 2), b.d]} />
						<meshStandardMaterial
							map={tex}
							emissiveMap={tex}
							emissive="#ffffff"
							emissiveIntensity={0.9 * lit}
							color="#2a1d45"
						/>
					</mesh>
					{b.neon ? (
						<mesh position={[0, Math.max(b.h, 2) / 2 + 0.15, 0]}>
							<boxGeometry args={[b.w + 0.2, 0.3, b.d + 0.2]} />
							<meshBasicMaterial color={i % 2 ? PINK : CYAN} />
						</mesh>
					) : null}
				</group>
			))}
		</group>
	);
};

const Palm: React.FC<{position: V3; scale?: number; color?: string}> = ({position, scale = 1, color = '#1a0526'}) => {
	const frame = useCurrentFrame();
	const sway = Math.sin(frame / 25 + position[0]) * 0.05;
	return (
		<group position={position} scale={scale} rotation={[0, 0, sway]}>
			<mesh position={[0.4, 4, 0]} rotation={[0, 0, -0.1]}>
				<cylinderGeometry args={[0.18, 0.32, 8, 8]} />
				<meshStandardMaterial color={color} />
			</mesh>
			{new Array(7).fill(0).map((_, i) => (
				<mesh
					key={i}
					position={[0.8, 8, 0]}
					rotation={[0, (i / 7) * Math.PI * 2, -0.5]}
				>
					<boxGeometry args={[0.15, 0.08, 4]} />
					<meshStandardMaterial color={color} />
				</mesh>
			))}
		</group>
	);
};

const Car: React.FC<{position: V3; rotationY?: number; color?: string; convertible?: boolean}> = ({
	position,
	rotationY = 0,
	color = PINK,
	convertible,
}) => {
	const frame = useCurrentFrame();
	return (
		<group position={position} rotation={[0, rotationY, 0]}>
			<mesh position={[0, 0.55, 0]}>
				<boxGeometry args={[1.9, 0.6, 4.2]} />
				<meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
			</mesh>
			{convertible ? (
				<mesh position={[0, 1.0, -0.2]} rotation={[-0.5, 0, 0]}>
					<boxGeometry args={[1.7, 0.5, 0.05]} />
					<meshStandardMaterial color="#9fd8ff" transparent opacity={0.6} />
				</mesh>
			) : (
				<mesh position={[0, 1.1, 0.2]}>
					<boxGeometry args={[1.6, 0.55, 2]} />
					<meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
				</mesh>
			)}
			{[-0.95, 0.95].map((x) =>
				[-1.4, 1.4].map((z) => (
					<mesh key={`${x}${z}`} position={[x, 0.35, z]} rotation={[frame * 0.6, 0, Math.PI / 2]}>
						<cylinderGeometry args={[0.35, 0.35, 0.3, 12]} />
						<meshStandardMaterial color="#0a0a0a" />
					</mesh>
				)),
			)}
			{/* lanternas */}
			{[-0.65, 0.65].map((x) => (
				<mesh key={x} position={[x, 0.65, 2.11]}>
					<boxGeometry args={[0.45, 0.18, 0.05]} />
					<meshBasicMaterial color="#ff2020" />
				</mesh>
			))}
			{/* neon embaixo */}
			<mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
				<planeGeometry args={[2.4, 4.8]} />
				<meshBasicMaterial color={CYAN} transparent opacity={0.35} />
			</mesh>
		</group>
	);
};

const Helicopter: React.FC<{position: V3}> = ({position}) => {
	const frame = useCurrentFrame();
	return (
		<group position={position}>
			<mesh scale={[1, 0.8, 1.6]}>
				<sphereGeometry args={[1, 16, 12]} />
				<meshStandardMaterial color="#05010d" metalness={0.5} />
			</mesh>
			<mesh position={[0, 0.2, 2.6]}>
				<boxGeometry args={[0.25, 0.25, 3]} />
				<meshStandardMaterial color="#05010d" />
			</mesh>
			<mesh position={[0, 1, 0]} rotation={[0, frame * 0.9, 0]}>
				<boxGeometry args={[7, 0.05, 0.25]} />
				<meshStandardMaterial color="#222" />
			</mesh>
			<mesh position={[0, -0.9, 0]}>
				<sphereGeometry args={[0.15, 8, 8]} />
				<meshBasicMaterial color={frame % 20 < 10 ? '#ff2020' : '#330000'} />
			</mesh>
			{/* cone do holofote */}
			<mesh position={[0, -9, -2]} rotation={[0.25 + Math.sin(frame / 20) * 0.2, 0, 0]}>
				<coneGeometry args={[4, 18, 24, 1, true]} />
				<meshBasicMaterial color="#fff6c8" transparent opacity={0.12} side={THREE.DoubleSide} depthWrite={false} />
			</mesh>
		</group>
	);
};

const Sun: React.FC<{position: V3; radius: number}> = ({position, radius}) => {
	const tex = useMemo(() => {
		const c = document.createElement('canvas');
		c.width = 256;
		c.height = 256;
		const ctx = c.getContext('2d')!;
		const g = ctx.createLinearGradient(0, 0, 0, 256);
		g.addColorStop(0, YELLOW);
		g.addColorStop(0.5, ORANGE);
		g.addColorStop(1, PINK);
		ctx.fillStyle = g;
		ctx.beginPath();
		ctx.arc(128, 128, 126, 0, Math.PI * 2);
		ctx.fill();
		ctx.globalCompositeOperation = 'destination-out';
		[150, 175, 198, 218, 236].forEach((y, i) => ctx.fillRect(0, y, 256, 5 + i * 2));
		const t = new THREE.CanvasTexture(c);
		t.colorSpace = THREE.SRGBColorSpace;
		return t;
	}, []);
	return (
		<mesh position={position}>
			<planeGeometry args={[radius * 2, radius * 2]} />
			<meshBasicMaterial map={tex} transparent fog={false} />
		</mesh>
	);
};

const NeonGrid: React.FC<{z: number}> = ({z}) => (
	<group position={[0, 0, z]}>
		<gridHelper args={[400, 80, CYAN, CYAN]} />
	</group>
);

const Ocean: React.FC<{color: string; y?: number}> = ({color, y = 0}) => {
	const frame = useCurrentFrame();
	const geo = useMemo(() => new THREE.PlaneGeometry(400, 400, 60, 60), []);
	const pos = geo.attributes.position;
	for (let i = 0; i < pos.count; i++) {
		const x = pos.getX(i);
		const yy = pos.getY(i);
		pos.setZ(i, Math.sin(x / 6 + frame / 10) * 0.4 + Math.cos(yy / 5 + frame / 13) * 0.4);
	}
	pos.needsUpdate = true;
	geo.computeVertexNormals();
	return (
		<mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}>
			<meshStandardMaterial color={color} metalness={0.7} roughness={0.25} />
		</mesh>
	);
};

/* ------------------------------ sets ------------------------------ */

const StoreSet: React.FC<{k: number}> = ({k}) => {
	const colors = [PINK, CYAN, YELLOW, '#6b5bff', ORANGE, GREEN, '#ffffff'];
	return (
		<>
			<color attach="background" args={['#070b1c']} />
			<ambientLight intensity={0.6} />
			<pointLight position={[0, 6, 0]} intensity={60} color={CYAN} />
			<pointLight position={[0, 6, -14]} intensity={60} color={PINK} />
			<mesh rotation={[-Math.PI / 2, 0, 0]}>
				<planeGeometry args={[40, 80]} />
				<meshStandardMaterial color="#1b1e2e" metalness={0.6} roughness={0.3} />
			</mesh>
			{[-3, 3].map((side) =>
				[0.6, 2.0, 3.4, 4.8].map((y) => (
					<group key={`${side}${y}`}>
						<mesh position={[side * 1.15, y, -10]}>
							<boxGeometry args={[1.2, 0.08, 34]} />
							<meshStandardMaterial color="#9aa3bd" metalness={0.8} />
						</mesh>
						{new Array(30).fill(0).map((_, i) => (
							<mesh key={i} position={[side * 1.1, y + 0.55, 6 - i * 1.1]}>
								<boxGeometry args={[0.18, 1.0, 0.8]} />
								<meshStandardMaterial
									color={colors[Math.floor(random(`b${side}${y}${i}`) * colors.length)]}
									emissive={colors[Math.floor(random(`b${side}${y}${i}`) * colors.length)]}
									emissiveIntensity={0.25}
								/>
							</mesh>
						))}
					</group>
				)),
			)}
			<CameraRig from={[0, 2.2, 8]} to={[0.4, 2.6, -2]} lookFrom={[0, 2, -10]} lookTo={[-1, 2.4, -14]} k={k} />
		</>
	);
};

const CityNightSet: React.FC<{k: number; heli: boolean; fireworks: boolean; frame: number}> = ({
	k,
	heli,
	fireworks,
	frame,
}) => (
	<>
		<color attach="background" args={['#0a0420']} />
		<fog attach="fog" args={['#2a0b45', 30, 140]} />
		<ambientLight intensity={0.35} />
		<hemisphereLight args={[PINK, '#000', 0.6]} />
		<City seed="night" />
		<Sun position={[0, 18, -120]} radius={22} />
		{heli ? <Helicopter position={[-20 + k * 40, 30, -10]} /> : null}
		{fireworks
			? [0, 1, 2].map((b) => {
					const period = 40;
					const d = (frame + b * 13) % period;
					const cycle = Math.floor((frame + b * 13) / period);
					const c: V3 = [
						-30 + random(`fx${b}${cycle}`) * 60,
						35 + random(`fy${b}${cycle}`) * 15,
						-40 - random(`fz${b}${cycle}`) * 20,
					];
					return new Array(18).fill(0).map((_, i) => {
						const a = (i / 18) * Math.PI * 2;
						const r = d * 0.35;
						return (
							<mesh key={`${b}-${i}`} position={[c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r - d * d * 0.004, c[2]]}>
								<sphereGeometry args={[0.35, 6, 6]} />
								<meshBasicMaterial color={[PINK, YELLOW, CYAN][b]} transparent opacity={1 - d / period} fog={false} />
							</mesh>
						);
					});
				})
			: null}
		<CameraRig from={[-60, 75, 90]} to={[35, 48, 75]} lookFrom={[0, 0, -10]} lookTo={[0, 8, -30]} k={k} />
	</>
);

const ChaseSet: React.FC<{k: number; frame: number}> = ({k, frame}) => {
	const z = -frame * 1.4;
	const red = Math.floor(frame / 5) % 2 === 0;
	return (
		<>
			<color attach="background" args={['#0a0630']} />
			<fog attach="fog" args={['#3a1360', 20, 160]} />
			<ambientLight intensity={0.7} />
			<hemisphereLight args={[PINK, '#000', 0.8]} />
			<Sun position={[0, 14, z - 150]} radius={26} />
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, z - 100]}>
				<planeGeometry args={[14, 400]} />
				<meshStandardMaterial color="#16161f" />
			</mesh>
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, z - 100]}>
				<planeGeometry args={[400, 400]} />
				<meshStandardMaterial color="#0b0614" />
			</mesh>
			{new Array(40).fill(0).map((_, i) => {
				const zz = Math.floor(z / 8) * 8 - i * 8;
				return (
					<group key={i}>
						<mesh position={[0, 0.02, zz]} rotation={[-Math.PI / 2, 0, 0]}>
							<planeGeometry args={[0.3, 3]} />
							<meshBasicMaterial color={YELLOW} />
						</mesh>
						{i % 3 === 0
							? [-8, 8].map((x) => (
									<group key={x} position={[x, 0, zz]}>
										<mesh position={[0, 4, 0]}>
											<cylinderGeometry args={[0.1, 0.1, 8]} />
											<meshStandardMaterial color="#333" />
										</mesh>
										<mesh position={[x > 0 ? -0.8 : 0.8, 8, 0]}>
											<boxGeometry args={[1.6, 0.2, 0.5]} />
											<meshBasicMaterial color="#fff2c4" />
										</mesh>
										<pointLight position={[x > 0 ? -1 : 1, 7.5, 0]} intensity={30} distance={14} color="#ffd27a" />
									</group>
								))
							: null}
						{i % 2 === 0 ? <Palm position={[i % 4 === 0 ? -14 : 14, 0, zz - 4]} scale={1.2} /> : null}
					</group>
				);
			})}
			<Car position={[Math.sin(frame / 9) * 2, 0, z - 14]} rotationY={Math.PI} color="#e8e8f0" />
			<pointLight position={[-4, 3, z + 4]} intensity={red ? 120 : 0} distance={30} color="#ff1e28" />
			<pointLight position={[4, 3, z + 4]} intensity={red ? 0 : 120} distance={30} color="#1e5aff" />
			<CameraRig from={[0, 3.2, z + 2]} to={[0, 2.6, z + 2]} lookFrom={[0, 1.5, z - 20]} lookTo={[0, 1.8, z - 20]} k={k} />
		</>
	);
};

const StormSet: React.FC<{k: number; frame: number}> = ({k, frame}) => {
	const cycle = frame % 50;
	const flash = cycle < 3 ? 1 - cycle / 3 : cycle >= 6 && cycle < 8 ? 0.6 : 0;
	return (
		<>
			<color attach="background" args={[flash > 0.3 ? '#8a96c0' : '#0b1020']} />
			<fog attach="fog" args={['#1c2440', 20, 120]} />
			<ambientLight intensity={0.25 + flash * 3} />
			<City seed="storm" lit={0.5} />
			{new Array(220).fill(0).map((_, i) => {
				const x = random(`rx${i}`) * 60 - 30;
				const zz = random(`rz${i}`) * 60 - 50;
				const y = 40 - ((random(`ry${i}`) * 40 + frame * 1.6) % 40);
				return (
					<mesh key={i} position={[x, y, zz]} rotation={[0, 0, 0.15]}>
						<boxGeometry args={[0.04, 1.6, 0.04]} />
						<meshBasicMaterial color="#bcd0ff" transparent opacity={0.5} />
					</mesh>
				);
			})}
			<CameraRig from={[0, 30, 55]} to={[0, 24, 40]} lookFrom={[0, 14, -20]} lookTo={[0, 18, -30]} k={k} />
		</>
	);
};

const SunsetSet: React.FC<{k: number; frame: number; car: boolean; dusk?: boolean}> = ({k, frame, car, dusk}) => (
	<>
		<color attach="background" args={[dusk ? '#2a0f5c' : '#3d0a5c']} />
		<fog attach="fog" args={[PINK, 40, 200]} />
		<ambientLight intensity={0.5} />
		<directionalLight position={[0, 10, -50]} intensity={2} color={ORANGE} />
		<Sun position={[0, 20, -160]} radius={45} />
		<Ocean color={dusk ? '#5a1d7a' : '#2b0a4a'} y={-0.6} />
		{/* calçadão */}
		<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 20]}>
			<planeGeometry args={[400, 30]} />
			<meshStandardMaterial color={dusk ? '#c98a5a' : '#1a0526'} />
		</mesh>
		{new Array(12).fill(0).map((_, i) => (
			<Palm key={i} position={[-66 + i * 12, 0, 12 + (i % 2) * 3]} scale={1.3} />
		))}
		{dusk ? null : <NeonGrid z={-40} />}
		{car ? <Car position={[-40 + k * 80, 0, 14]} rotationY={Math.PI / 2} color={dusk ? PINK : CYAN} convertible /> : null}
		<CameraRig
			from={[-14, 4, 34]}
			to={[14, 6, 30]}
			lookFrom={[0, 6, -40]}
			lookTo={[0, 8, -40]}
			k={k}
		/>
		{frame < 0 ? null : null}
	</>
);

const DataSet: React.FC<{k: number; frame: number}> = ({k, frame}) => {
	const cubes = [];
	for (let i = -12; i <= 12; i++) {
		for (let j = -20; j <= 4; j++) {
			const h = 0.5 + (Math.sin(i / 2 + frame / 10) + Math.cos(j / 3 + frame / 14) + 2) * 1.6;
			cubes.push(
				<mesh key={`${i}:${j}`} position={[i * 1.6, h / 2 - 3, j * 1.6]}>
					<boxGeometry args={[1.2, h, 1.2]} />
					<meshStandardMaterial
						color="#03221a"
						emissive={random(`dc${i}${j}`) > 0.85 ? CYAN : GREEN}
						emissiveIntensity={0.15 + (h / 6.4) * 0.8}
					/>
				</mesh>,
			);
		}
	}
	return (
		<>
			<color attach="background" args={['#01080c']} />
			<fog attach="fog" args={['#01080c', 8, 45]} />
			<ambientLight intensity={0.2} />
			{cubes}
			<CameraRig from={[-6, 8, 10]} to={[6, 5, 2]} lookFrom={[0, 0, -12]} lookTo={[0, 0, -16]} k={k} />
		</>
	);
};

const MapSet: React.FC<{k: number}> = ({k}) => {
	const path: V3[] = [
		[-27, 0, 27],
		[-27, 0, 0],
		[0, 0, 0],
		[0, 0, -27],
		[18, 0, -27],
	];
	const segs = path.length - 1;
	const progress = Math.min(1, k * 1.4) * segs;
	return (
		<>
			<color attach="background" args={['#1767a6']} />
			<ambientLight intensity={0.7} />
			<directionalLight position={[30, 60, 20]} intensity={2.2} />
			<City seed="map" lit={0.25} />
			{path.slice(0, -1).map((p, i) => {
				const q = path[i + 1];
				const part = Math.max(0, Math.min(1, progress - i));
				if (part <= 0) return null;
				const end = lerp3(p, q, part);
				const mid = lerp3(p, end, 0.5);
				const len = Math.hypot(end[0] - p[0], end[2] - p[2]);
				return (
					<mesh key={i} position={[mid[0], 0.6, mid[2]]} rotation={[0, Math.atan2(end[0] - p[0], end[2] - p[2]), 0]}>
						<boxGeometry args={[1.4, 0.4, len + 1.4]} />
						<meshBasicMaterial color={PINK} />
					</mesh>
				);
			})}
			<mesh position={[18, 4 + Math.sin(k * 30) * 0.8, -27]}>
				<coneGeometry args={[1.8, 4, 16]} />
				<meshStandardMaterial color="#ff2b2b" emissive="#ff2b2b" emissiveIntensity={0.5} />
			</mesh>
			<CameraRig from={[-30, 90, 60]} to={[10, 70, 30]} lookFrom={[-10, 0, 0]} lookTo={[8, 0, -15]} k={k} />
		</>
	);
};

/* ------------------------------ roteiro ------------------------------ */

const SEGMENTS: {from: number; to: number; render: (k: number, frame: number) => React.ReactNode}[] = [
	{from: 0, to: 3.4, render: (k) => <StoreSet k={k} />},
	{from: 3.4, to: 7.1, render: (k, fr) => <CityNightSet k={k} frame={fr} heli fireworks={false} />},
	{from: 7.1, to: 12.2, render: (k, fr) => <ChaseSet k={k} frame={fr} />},
	{from: 12.2, to: 15.5, render: (k, fr) => <StormSet k={k} frame={fr} />},
	{from: 15.5, to: 22.1, render: (k, fr) => <SunsetSet k={k} frame={fr} car />},
	{from: 22.1, to: 29.15, render: (k, fr) => <DataSet k={k} frame={fr} />},
	{from: 29.15, to: 36, render: (k) => <MapSet k={k} />},
	{from: 36, to: 37, render: (k) => <StoreSet k={k} />},
	{from: 37, to: 44.6, render: (k, fr) => <CityNightSet k={k} frame={fr} heli fireworks />},
	{from: 44.6, to: 50.55, render: (k, fr) => <SunsetSet k={k} frame={fr} car dusk />},
	{from: 50.55, to: 999, render: (k, fr) => <SunsetSet k={Math.min(1, k * 1.2)} frame={fr} car={false} />},
];

export const World3D: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, height, fps} = useVideoConfig();
	const t = frame / fps;
	const seg = SEGMENTS.find((s) => t >= s.from && t < s.to) ?? SEGMENTS[SEGMENTS.length - 1];
	const k = interpolate(t, [seg.from, Math.min(seg.to, 58.8)], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	return (
		<ThreeCanvas width={width} height={height} camera={{fov: 55, near: 0.1, far: 600}}>
			{seg.render(k, frame)}
		</ThreeCanvas>
	);
};
