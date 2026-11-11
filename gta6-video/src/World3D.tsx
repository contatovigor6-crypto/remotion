import {useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import React, {useMemo} from 'react';
import {Easing, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';

// Fundo 3D que ilustra literalmente cada frase da narração.
// Os tempos (em segundos) batem com as palavras de src/words.json.

const PINK = '#ff2e88';
const ORANGE = '#ff8a3d';
const CYAN = '#22e4ff';
const YELLOW = '#ffe600';
const GREEN = '#39ff88';
const RED = '#ff2b2b';
const FPS = 30;

type V3 = [number, number, number];

const lerp3 = (a: V3, b: V3, k: number): V3 => [
	a[0] + (b[0] - a[0]) * k,
	a[1] + (b[1] - a[1]) * k,
	a[2] + (b[2] - a[2]) * k,
];

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

// progresso 0→1 entre dois segundos
const prog = (t: number, a: number, b: number, ease = Easing.out(Easing.cubic)) =>
	ease(clamp01((t - a) / (b - a)));

const CameraRig: React.FC<{from: V3; to: V3; lookFrom: V3; lookTo: V3; k: number; fov?: number}> = ({
	from,
	to,
	lookFrom,
	lookTo,
	k,
	fov = 50,
}) => {
	const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
	const e = Easing.inOut(Easing.sin)(clamp01(k));
	camera.position.set(...lerp3(from, to, e));
	camera.fov = fov;
	camera.updateProjectionMatrix();
	camera.lookAt(new THREE.Vector3(...lerp3(lookFrom, lookTo, e)));
	return null;
};

// Textura desenhada num <canvas>. `key` muda => redesenha.
const useCanvasTexture = (w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void, key: string) => {
	const tex = useMemo(() => {
		const c = document.createElement('canvas');
		c.width = w;
		c.height = h;
		const t = new THREE.CanvasTexture(c);
		t.colorSpace = THREE.SRGBColorSpace;
		t.anisotropy = 4;
		return t;
	}, [w, h]);
	useMemo(() => {
		const ctx = (tex.image as HTMLCanvasElement).getContext('2d')!;
		ctx.clearRect(0, 0, w, h);
		draw(ctx);
		tex.needsUpdate = true;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tex, key, document.fonts.check('40px Anton') && document.fonts.check('900 40px Montserrat')]);
	return tex;
};

const Studio: React.FC<{bg: string; floor?: string; fog?: [number, number]}> = ({bg, floor = '#141022', fog = [20, 70]}) => (
	<>
		<color attach="background" args={[bg]} />
		<fog attach="fog" args={[bg, fog[0], fog[1]]} />
		<mesh rotation={[-Math.PI / 2, 0, 0]}>
			<planeGeometry args={[200, 200]} />
			<meshStandardMaterial color={floor} metalness={0.5} roughness={0.35} />
		</mesh>
	</>
);

/* ------------------------- objetos reutilizados ------------------------- */

const CoverTexture = () =>
	useCanvasTexture(
		512,
		640,
		(ctx) => {
			const g = ctx.createLinearGradient(0, 0, 512, 640);
			g.addColorStop(0, '#3d0a5c');
			g.addColorStop(0.55, PINK);
			g.addColorStop(1, ORANGE);
			ctx.fillStyle = g;
			ctx.fillRect(0, 0, 512, 640);
			ctx.fillStyle = '#0b4fc4';
			ctx.fillRect(0, 0, 512, 64);
			ctx.fillStyle = '#fff';
			ctx.font = '900 40px Montserrat';
			ctx.textAlign = 'center';
			ctx.fillText('MÍDIA FÍSICA', 256, 46);
			ctx.beginPath();
			ctx.fillStyle = YELLOW;
			ctx.arc(256, 400, 150, 0, Math.PI * 2);
			ctx.fill();
			ctx.font = '200px Anton';
			ctx.lineWidth = 14;
			ctx.strokeStyle = '#12002b';
			ctx.strokeText('GTA 6', 256, 330);
			ctx.fillStyle = '#fff';
			ctx.fillText('GTA 6', 256, 330);
		},
		'cover',
	);

const TrayTexture = () =>
	useCanvasTexture(
		512,
		640,
		(ctx) => {
			ctx.fillStyle = '#1d1d26';
			ctx.fillRect(0, 0, 512, 640);
			ctx.strokeStyle = 'rgba(255,255,255,0.25)';
			ctx.setLineDash([16, 12]);
			ctx.lineWidth = 6;
			ctx.beginPath();
			ctx.arc(256, 270, 200, 0, Math.PI * 2);
			ctx.stroke();
			ctx.setLineDash([]);
			ctx.fillStyle = '#0b0b10';
			ctx.beginPath();
			ctx.arc(256, 270, 46, 0, Math.PI * 2);
			ctx.fill();
			ctx.save();
			ctx.translate(256, 545);
			ctx.rotate(-0.06);
			ctx.fillStyle = '#fffbe8';
			ctx.fillRect(-190, -55, 380, 110);
			ctx.fillStyle = '#555';
			ctx.font = '900 26px Montserrat';
			ctx.textAlign = 'center';
			ctx.fillText('CÓDIGO DE DOWNLOAD', 0, -12);
			ctx.fillStyle = '#111';
			ctx.font = '900 36px Montserrat';
			ctx.fillText('XXXX-XXXX-XXXX', 0, 32);
			ctx.restore();
		},
		'tray',
	);

// Caixa de jogo 3D: open 0 = fechada, 1 = aberta (capa gira na dobradiça esquerda)
const GameCase3D: React.FC<{open: number; position?: V3; rotation?: V3; scale?: number}> = ({
	open,
	position = [0, 0, 0],
	rotation = [0, 0, 0],
	scale = 1,
}) => {
	const cover = CoverTexture();
	const tray = TrayTexture();
	const W = 2.6;
	const H = 3.3;
	const D = 0.28;
	return (
		<group position={position} rotation={rotation} scale={scale}>
			{/* bandeja */}
			<mesh position={[0, 0, -D / 2]}>
				<boxGeometry args={[W, H, D]} />
				<meshStandardMaterial color="#0b4fc4" />
			</mesh>
			<mesh position={[0, 0, 0.001]}>
				<planeGeometry args={[W - 0.15, H - 0.15]} />
				<meshStandardMaterial map={tray} />
			</mesh>
			{/* capa com dobradiça na esquerda */}
			<group position={[-W / 2, 0, 0.02]} rotation={[0, -open * 2.6, 0]}>
				<mesh position={[W / 2, 0, 0.03]}>
					<boxGeometry args={[W, H, 0.06]} />
					<meshStandardMaterial color="#0b4fc4" />
				</mesh>
				<mesh position={[W / 2, 0, 0.061]}>
					<planeGeometry args={[W - 0.15, H - 0.15]} />
					<meshStandardMaterial map={cover} emissiveMap={cover} emissive="#ffffff" emissiveIntensity={0.25} />
				</mesh>
			</group>
		</group>
	);
};

const Confetti: React.FC<{t: number; start: number; origin: V3; count?: number; spread?: number}> = ({
	t,
	start,
	origin,
	count = 60,
	spread = 0.25,
}) => {
	if (t < start) return null;
	const d = (t - start) * FPS;
	return (
		<>
			{new Array(count).fill(0).map((_, i) => {
				const a = random(`ca${i}`) * Math.PI * 2;
				const up = 0.3 + random(`cu${i}`) * 0.5;
				const v = spread * (0.5 + random(`cv${i}`));
				return (
					<mesh
						key={i}
						position={[
							origin[0] + Math.cos(a) * v * d,
							origin[1] + up * d * 0.4 - d * d * 0.004,
							origin[2] + Math.sin(a) * v * d * 0.6,
						]}
						rotation={[d * 0.3 + i, d * 0.2, i]}
					>
						<planeGeometry args={[0.18, 0.28]} />
						<meshBasicMaterial color={[PINK, YELLOW, CYAN, GREEN, ORANGE][i % 5]} side={THREE.DoubleSide} />
					</mesh>
				);
			})}
		</>
	);
};

/* -------------------------------- sets -------------------------------- */

// "Você pretende comprar GTA 6 em mídia física?" – corredor de loja com caixas de jogo
const StoreSet: React.FC<{t: number; k: number}> = ({k}) => {
	const cover = CoverTexture();
	const colors = [PINK, CYAN, YELLOW, '#6b5bff', ORANGE, GREEN];
	return (
		<>
			<Studio bg="#070b1c" floor="#1b1e2e" fog={[6, 40]} />
			<ambientLight intensity={0.7} />
			<pointLight position={[0, 6, 0]} intensity={60} color={CYAN} />
			<pointLight position={[0, 6, -14]} intensity={60} color={PINK} />
			{[-1, 1].map((side) =>
				[0.6, 2.0, 3.4, 4.8].map((y) => (
					<group key={`${side}${y}`}>
						<mesh position={[side * 3.45, y, -10]}>
							<boxGeometry args={[1.2, 0.08, 34]} />
							<meshStandardMaterial color="#9aa3bd" metalness={0.8} />
						</mesh>
						{new Array(30).fill(0).map((_, i) => {
							const isGta = random(`g${side}${y}${i}`) > 0.6;
							return (
								<mesh
									key={i}
									position={[side * 3.3, y + 0.55, 6 - i * 1.1]}
									rotation={[0, side > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}
								>
									<planeGeometry args={[0.8, 1.0]} />
									{isGta ? (
										<meshStandardMaterial map={cover} side={THREE.DoubleSide} />
									) : (
										<meshStandardMaterial
											color={colors[Math.floor(random(`b${side}${y}${i}`) * colors.length)]}
											side={THREE.DoubleSide}
										/>
									)}
								</mesh>
							);
						})}
					</group>
				)),
			)}
			<CameraRig from={[0, 2.4, 8]} to={[0.2, 2.6, -1]} lookFrom={[0, 2.2, -10]} lookTo={[-0.6, 2.4, -14]} k={k} />
		</>
	);
};

// "...antes de gastar seu dinheiro." – caixa registradora cuspindo notas
const MoneySet: React.FC<{t: number; k: number}> = ({t, k}) => {
	const bill = useCanvasTexture(
		256,
		128,
		(ctx) => {
			ctx.fillStyle = '#3fbf6f';
			ctx.fillRect(0, 0, 256, 128);
			ctx.strokeStyle = '#1d7a41';
			ctx.lineWidth = 8;
			ctx.strokeRect(8, 8, 240, 112);
			ctx.fillStyle = '#0d4d27';
			ctx.font = '900 54px Montserrat';
			ctx.textAlign = 'center';
			ctx.fillText('R$ 100', 128, 84);
		},
		'bill',
	);
	const screen = useCanvasTexture(
		256,
		96,
		(ctx) => {
			ctx.fillStyle = '#06140a';
			ctx.fillRect(0, 0, 256, 96);
			ctx.fillStyle = GREEN;
			ctx.font = '900 46px monospace';
			ctx.textAlign = 'center';
			ctx.fillText(t > 6.0 ? 'R$ ???' : 'TOTAL', 128, 64);
		},
		t > 6.0 ? 'b' : 'a',
	);
	const drawer = prog(t, 5.5, 5.9);
	const rain = t > 5.6 ? (t - 5.6) * FPS : -1;
	return (
		<>
			<Studio bg="#120a24" floor="#24183d" fog={[10, 40]} />
			<ambientLight intensity={0.6} />
			<spotLight position={[0, 9, 4]} angle={0.6} penumbra={0.5} intensity={200} color="#fff3d0" />
			<pointLight position={[-4, 3, 2]} intensity={30} color={PINK} />
			{/* balcão */}
			<mesh position={[0, 0.9, 0]}>
				<boxGeometry args={[7, 1.8, 2.6]} />
				<meshStandardMaterial color="#2a1d45" />
			</mesh>
			{/* registradora */}
			<group position={[0, 1.8, 0]}>
				<mesh position={[0, 0.5, 0]}>
					<boxGeometry args={[2.4, 1, 1.8]} />
					<meshStandardMaterial color="#d9d9e6" metalness={0.4} />
				</mesh>
				<mesh position={[0, 1.4, -0.4]} rotation={[-0.3, 0, 0]}>
					<boxGeometry args={[1.6, 0.7, 0.15]} />
					<meshStandardMaterial color="#222" />
				</mesh>
				<mesh position={[0, 1.4, -0.31]} rotation={[-0.3, 0, 0]}>
					<planeGeometry args={[1.45, 0.55]} />
					<meshBasicMaterial map={screen} />
				</mesh>
				{/* gaveta abrindo */}
				<mesh position={[0, 0.15, 0.9 + drawer * 0.9]}>
					<boxGeometry args={[2.2, 0.3, 1.2]} />
					<meshStandardMaterial color="#bfbfcc" />
				</mesh>
			</group>
			{/* notas voando para fora */}
			{rain >= 0
				? new Array(26).fill(0).map((_, i) => {
						const d = rain - i * 1.2;
						if (d < 0) return null;
						const a = random(`ma${i}`) * Math.PI * 2;
						return (
							<mesh
								key={i}
								position={[Math.cos(a) * d * 0.09, 2.4 + d * 0.16 - d * d * 0.0025, 1.6 + Math.sin(a) * d * 0.05]}
								rotation={[d * 0.2, d * 0.15 + i, d * 0.1]}
							>
								<planeGeometry args={[1.0, 0.5]} />
								<meshStandardMaterial map={bill} side={THREE.DoubleSide} />
							</mesh>
						);
					})
				: null}
			<CameraRig from={[-4, 4.5, 9]} to={[3, 3.6, 7]} lookFrom={[0, 3.6, 0]} lookTo={[0, 3.4, 0]} k={k} />
		</>
	);
};

// "...esse detalhe pode pegar muita gente de surpresa." – caixa-surpresa que explode
const SurpriseSet: React.FC<{t: number; k: number}> = ({t, k}) => {
	const q = useCanvasTexture(
		256,
		256,
		(ctx) => {
			ctx.fillStyle = '#6b2bd9';
			ctx.fillRect(0, 0, 256, 256);
			ctx.fillStyle = YELLOW;
			ctx.fillRect(110, 0, 36, 256);
			ctx.fillRect(0, 110, 256, 36);
			ctx.font = '170px Anton';
			ctx.textAlign = 'center';
			ctx.lineWidth = 12;
			ctx.strokeStyle = '#1a0526';
			ctx.strokeText('?', 128, 190);
			ctx.fillStyle = '#fff';
			ctx.fillText('?', 128, 190);
		},
		'q',
	);
	const pop = 11.18;
	const shake = t < pop ? prog(t, 8, pop, Easing.in(Easing.quad)) : 0;
	const s = Math.sin(t * 60) * 0.12 * shake;
	const lid = prog(t, pop, pop + 0.35);
	return (
		<>
			<Studio bg="#0d0420" floor="#1d0c36" fog={[10, 40]} />
			<ambientLight intensity={0.45} />
			<spotLight position={[0, 10, 3]} angle={0.45} penumbra={0.4} intensity={260} color="#ffe9c4" />
			{/* pedestal */}
			<mesh position={[0, 0.5, 0]}>
				<cylinderGeometry args={[2.2, 2.4, 1, 32]} />
				<meshStandardMaterial color="#2a1d45" />
			</mesh>
			<group position={[0, 2.5, 0]} rotation={[0, t * 0.6 + s, s]}>
				<mesh>
					<boxGeometry args={[3, 3, 3]} />
					<meshStandardMaterial map={q} />
				</mesh>
				{/* tampa */}
				<group position={[0, 1.6 + lid * 6, 0]} rotation={[lid * 2, lid * 3, lid]}>
					<mesh>
						<boxGeometry args={[3.3, 0.5, 3.3]} />
						<meshStandardMaterial color="#5a1fc4" />
					</mesh>
					<mesh position={[0, 0.45, 0]} rotation={[0, Math.PI / 4, 0]}>
						<torusGeometry args={[0.5, 0.15, 8, 16]} />
						<meshStandardMaterial color={YELLOW} />
					</mesh>
				</group>
			</group>
			{t > pop ? <pointLight position={[0, 4.5, 0]} intensity={300 * (1 - lid * 0.5)} color={YELLOW} distance={20} /> : null}
			<Confetti t={t} start={pop} origin={[0, 4, 0]} count={80} />
			<CameraRig from={[0, 5, 14]} to={[0, 4.2, 9]} lookFrom={[0, 3.6, 0]} lookTo={[0, 3.2, 0]} k={k} />
		</>
	);
};

// "A Rockstar confirmou uma informação bastante curiosa." – parede de TVs com URGENTE
const NewsSet: React.FC<{t: number; k: number}> = ({t, k}) => {
	const blink = Math.floor(t * 4) % 2 === 0;
	const urg = useCanvasTexture(
		320,
		200,
		(ctx) => {
			ctx.fillStyle = blink ? RED : '#7a0a0a';
			ctx.fillRect(0, 0, 320, 200);
			ctx.fillStyle = '#fff';
			ctx.font = '72px Anton';
			ctx.textAlign = 'center';
			ctx.fillText('URGENTE', 160, 95);
			ctx.font = '900 26px Montserrat';
			ctx.fillText('COMUNICADO OFICIAL', 160, 150);
		},
		blink ? 'on' : 'off',
	);
	const ex = useCanvasTexture(
		200,
		200,
		(ctx) => {
			ctx.fillStyle = '#111';
			ctx.fillRect(0, 0, 200, 200);
			ctx.fillStyle = YELLOW;
			ctx.font = '170px Anton';
			ctx.textAlign = 'center';
			ctx.fillText('!', 100, 170);
		},
		'ex',
	);
	const spin = t * 8;
	return (
		<>
			<Studio bg="#0a0a14" floor="#14141f" fog={[12, 40]} />
			<ambientLight intensity={0.3} />
			{/* parede de TVs */}
			{[-1, 0, 1].map((x) =>
				[0, 1, 2].map((y) => (
					<group key={`${x}${y}`} position={[x * 3.4, 1.6 + y * 2.2, -3]}>
						<mesh>
							<boxGeometry args={[3.2, 2, 0.2]} />
							<meshStandardMaterial color="#111" />
						</mesh>
						<mesh position={[0, 0, 0.11]}>
							<planeGeometry args={[3, 1.8]} />
							<meshBasicMaterial map={(x + y) % 2 === 0 ? urg : ex} />
						</mesh>
					</group>
				)),
			)}
			{/* sirene giratória */}
			<group position={[0, 1.2, 2]}>
				<mesh position={[0, -0.4, 0]}>
					<cylinderGeometry args={[0.8, 0.9, 0.4, 24]} />
					<meshStandardMaterial color="#222" />
				</mesh>
				<mesh position={[0, 0.3, 0]}>
					<sphereGeometry args={[0.7, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
					<meshStandardMaterial color={RED} emissive={RED} emissiveIntensity={1.2} transparent opacity={0.85} />
				</mesh>
				<spotLight
					position={[0, 0.4, 0]}
					target-position={[Math.cos(spin) * 10, 0.4, Math.sin(spin) * 10]}
					angle={0.35}
					intensity={400}
					color={RED}
				/>
				<pointLight position={[0, 0.5, 0]} intensity={40} color={RED} />
			</group>
			<CameraRig from={[-3, 3.5, 11]} to={[2, 3, 8]} lookFrom={[0, 3.6, -2]} lookTo={[0, 3.4, -2]} k={k} />
		</>
	);
};

// "Determinadas versões físicas de GTA 6 não terão disco dentro da caixa. Isso mesmo."
const EmptyCaseSet: React.FC<{t: number; k: number}> = ({t, k}) => {
	const open = prog(t, 18.5, 19.3, Easing.out(Easing.back(1.3)));
	const sad = t >= 21.14;
	return (
		<>
			<Studio bg={sad ? '#15151a' : '#160a2a'} floor={sad ? '#202024' : '#241238'} fog={[8, 30]} />
			<ambientLight intensity={0.5} />
			<spotLight position={[0, 8, 6]} angle={0.5} penumbra={0.4} intensity={260} color={sad ? '#ffffff' : '#ffe0f0'} />
			<pointLight position={[-4, 3, 2]} intensity={sad ? 0 : 30} color={PINK} />
			<pointLight position={[4, 3, 2]} intensity={sad ? 0 : 30} color={CYAN} />
			<GameCase3D open={open} position={[0.6 * open, 3.2, 0]} rotation={[-0.15, -0.25 + open * 0.25, 0]} scale={1.2} />
			{/* poeira caindo quando abre (caixa vazia) */}
			{t > 19.3
				? new Array(30).fill(0).map((_, i) => (
						<mesh key={i} position={[random(`px${i}`) * 4 - 1.4, 5.2 - (((t - 19.3) * 0.6 + random(`py${i}`) * 4) % 4), 0.5 + random(`pz${i}`)]}>
							<sphereGeometry args={[0.03, 6, 6]} />
							<meshBasicMaterial color="#fff" transparent opacity={0.6} />
						</mesh>
					))
				: null}
			<CameraRig
				from={[-2.5, 4.6, 9]}
				to={sad ? [0.6, 3.6, 4.6] : [0.4, 4.0, 7]}
				lookFrom={[0, 3.6, 0]}
				lookTo={[0.6, 3.4, 0]}
				k={sad ? 0.6 + prog(t, 21.14, 22.1) * 0.4 : k * 1.15}
			/>
		</>
	);
};

// "Em vez de receber um Blu-ray tradicional, o jogador encontrará apenas um código
// para baixar o jogo digitalmente."
const DiscCodeSet: React.FC<{t: number; k: number}> = ({t, k}) => {
	const fly = prog(t, 23.6, 24.1, Easing.in(Easing.quad));
	const card = prog(t, 24.6, 25.3, Easing.out(Easing.back(1.4)));
	const dl = t > 27.2;
	const code = useCanvasTexture(
		512,
		300,
		(ctx) => {
			ctx.fillStyle = '#fffbe8';
			ctx.fillRect(0, 0, 512, 300);
			ctx.fillStyle = '#0b4fc4';
			ctx.fillRect(0, 0, 512, 70);
			ctx.fillStyle = '#fff';
			ctx.font = '900 38px Montserrat';
			ctx.textAlign = 'center';
			ctx.fillText('CÓDIGO DE DOWNLOAD', 256, 48);
			ctx.fillStyle = '#111';
			ctx.font = '900 56px Montserrat';
			ctx.fillText('XXXX-XXXX-XXXX', 256, 180);
			ctx.fillStyle = '#666';
			ctx.font = '700 26px Montserrat';
			ctx.fillText('válido para 1 download', 256, 245);
		},
		'code',
	);
	return (
		<>
			<Studio bg="#01080c" floor="#031a14" fog={[8, 35]} />
			<ambientLight intensity={0.5} />
			<pointLight position={[0, 6, 6]} intensity={120} color="#ffffff" />
			<pointLight position={[-5, 4, 0]} intensity={60} color={CYAN} />
			{/* Blu-ray girando, depois arremessado no "Blu-ray" */}
			{fly < 1 ? (
				<group position={[fly * 14, 4 + fly * 5, -fly * 4]} rotation={[Math.PI / 2 - 0.15, t * 0.5, t * 6 + fly * 20]}>
					<mesh>
						<cylinderGeometry args={[2, 2, 0.06, 64]} />
						<meshPhysicalMaterial color="#dfe6ff" metalness={0.35} roughness={0.15} iridescence={1} iridescenceIOR={1.8} emissive="#8fa8ff" emissiveIntensity={0.35} />
					</mesh>
					<mesh position={[0, 0.04, 0]}>
						<cylinderGeometry args={[0.45, 0.45, 0.08, 32]} />
						<meshStandardMaterial color="#2a0f40" />
					</mesh>
				</group>
			) : null}
			{/* cartão do código */}
			{card > 0 ? (
				<mesh position={[0, 3.0, 0]} rotation={[-0.1, (1 - card) * Math.PI * 1.5 + Math.sin(t * 2) * 0.1, 0]} scale={card}>
					<planeGeometry args={[3.2, 1.88]} />
					<meshStandardMaterial map={code} side={THREE.DoubleSide} emissiveMap={code} emissive="#fff" emissiveIntensity={0.3} />
				</mesh>
			) : null}
			{/* setas de download descendo */}
			{dl
				? [0, 1, 2].map((i) => {
						const y = 7 - ((((t - 27.2) * 2.4 + i * 1.3) % 4) );
						return (
							<group key={i} position={[3.4, y - 1.5, 0]}>
								<mesh position={[0, 0.5, 0]}>
									<boxGeometry args={[0.4, 0.9, 0.4]} />
									<meshStandardMaterial color={GREEN} emissive={GREEN} emissiveIntensity={0.8} />
								</mesh>
								<mesh rotation={[Math.PI, 0, 0]}>
									<coneGeometry args={[0.6, 0.7, 4]} />
									<meshStandardMaterial color={GREEN} emissive={GREEN} emissiveIntensity={0.8} />
								</mesh>
							</group>
						);
					})
				: null}
			{/* chão de dados */}
			{new Array(10).fill(0).map((_, i) =>
				new Array(6).fill(0).map((__, j) => {
					const h = 0.2 + (Math.sin(i / 1.5 + t * 3) + Math.cos(j + t * 2) + 2) * 0.25;
					return (
						<mesh key={`${i}${j}`} position={[(i - 4.5) * 1.3, h / 2 - 0.6, -j * 1.3 - 4]}>
							<boxGeometry args={[1, h, 1]} />
							<meshStandardMaterial color="#03221a" emissive={GREEN} emissiveIntensity={0.25 + h * 0.4} />
						</mesh>
					);
				}),
			)}
			<CameraRig from={[0, 5, 11]} to={[1.5, 4.6, 9]} lookFrom={[0, 4, 0]} lookTo={[0.5, 3.8, 0]} k={k} />
		</>
	);
};

// "Você compra a caixa física, mas ainda precisará baixar o jogo pela internet para conseguir jogar."
const LivingRoomSet: React.FC<{t: number; k: number}> = ({t, k}) => {
	const p = t < 33.4 ? 0.02 + prog(t, 29.2, 33.4, Easing.linear) * 0.1 : 0.12 + prog(t, 33.4, 35.0) * 0.87;
	const stuck = t >= 35.0;
	const screen = useCanvasTexture(
		640,
		360,
		(ctx) => {
			ctx.fillStyle = '#0a0a1a';
			ctx.fillRect(0, 0, 640, 360);
			ctx.fillStyle = '#fff';
			ctx.font = '900 40px Montserrat';
			ctx.textAlign = 'left';
			ctx.fillText(stuck ? 'Travou em 99% 💀' : 'Baixando GTA 6...', 40, 110);
			ctx.fillStyle = '#2a2a3a';
			ctx.fillRect(40, 160, 560, 50);
			ctx.fillStyle = GREEN;
			ctx.fillRect(40, 160, 560 * p, 50);
			ctx.fillStyle = '#bbb';
			ctx.font = '700 30px Montserrat';
			ctx.fillText(`${Math.floor(p * 100)}%   ·   150 GB`, 40, 270);
		},
		`${Math.floor(p * 100)}-${stuck}`,
	);
	const blink = Math.floor(t * 8) % 2 === 0;
	return (
		<>
			<Studio bg="#120a1e" floor="#3a2a2a" fog={[10, 30]} />
			<ambientLight intensity={0.55} />
			<pointLight position={[0, 5, 5]} intensity={60} color="#ffd9b0" />
			{/* parede */}
			<mesh position={[0, 4, -3]}>
				<planeGeometry args={[30, 10]} />
				<meshStandardMaterial color="#2b1d3d" />
			</mesh>
			{/* rack + TV */}
			<mesh position={[0, 0.5, -2]}>
				<boxGeometry args={[6, 1, 1.2]} />
				<meshStandardMaterial color="#3b2a20" />
			</mesh>
			<mesh position={[0, 3.2, -2.3]}>
				<boxGeometry args={[5.6, 3.3, 0.2]} />
				<meshStandardMaterial color="#0a0a0a" />
			</mesh>
			<mesh position={[0, 3.2, -2.19]}>
				<planeGeometry args={[5.3, 3.0]} />
				<meshBasicMaterial map={screen} />
			</mesh>
			<pointLight position={[0, 3.2, -1.2]} intensity={20} color={CYAN} />
			{/* console genérico */}
			<mesh position={[-1.6, 1.25, -1.9]}>
				<boxGeometry args={[1.6, 0.5, 0.9]} />
				<meshStandardMaterial color="#e8e8f0" />
			</mesh>
			{/* roteador piscando */}
			<group position={[2.2, 1.15, -1.9]}>
				<mesh>
					<boxGeometry args={[1.1, 0.3, 0.7]} />
					<meshStandardMaterial color="#1a1a1a" />
				</mesh>
				{[-0.35, 0.35].map((x) => (
					<mesh key={x} position={[x, 0.55, -0.25]} rotation={[0, 0, x > 0 ? -0.2 : 0.2]}>
						<cylinderGeometry args={[0.04, 0.04, 0.9]} />
						<meshStandardMaterial color="#1a1a1a" />
					</mesh>
				))}
				{[0, 1, 2, 3].map((i) => (
					<mesh key={i} position={[-0.3 + i * 0.2, 0.05, 0.36]}>
						<sphereGeometry args={[0.04, 6, 6]} />
						<meshBasicMaterial color={(blink ? i % 2 : (i + 1) % 2) ? GREEN : '#063'} />
					</mesh>
				))}
				{/* ondas de wi-fi */}
				{t > 33.9
					? [0, 1, 2].map((i) => (
							<mesh key={i} position={[0, 0.9, -0.2]} rotation={[0, 0, 0]}>
								<torusGeometry args={[0.4 + (((t * 1.5 + i * 0.33) % 1) * 1.2), 0.03, 6, 32, Math.PI]} />
								<meshBasicMaterial color={CYAN} transparent opacity={0.8 - ((t * 1.5 + i * 0.33) % 1) * 0.8} />
							</mesh>
						))
					: null}
			</group>
			{/* mesinha de centro com a caixa física */}
			<mesh position={[0, 0.6, 2]}>
				<boxGeometry args={[4, 0.2, 2]} />
				<meshStandardMaterial color="#5a3d2b" />
			</mesh>
			<GameCase3D open={0} position={[-0.6, 0.73, 2]} rotation={[-Math.PI / 2, 0, 0.3]} scale={0.45} />
			{/* controle */}
			<mesh position={[0.9, 0.78, 2.1]} rotation={[0, -0.4, 0]}>
				<boxGeometry args={[0.9, 0.15, 0.45]} />
				<meshStandardMaterial color="#111" />
			</mesh>
			<CameraRig from={[-2, 2.9, 11.5]} to={[1, 2.8, 10.2]} lookFrom={[0, 4.2, -1]} lookTo={[0, 4.3, -1]} k={k} />
		</>
	);
};

// "GTA 6 está previsto para chegar no dia 19 de novembro para PlayStation 5 e Xbox Series X e S."
const LaunchSet: React.FC<{t: number; k: number}> = ({t, k}) => {
	const flip = prog(t, 39.2, 39.7);
	const page = useCanvasTexture(
		400,
		440,
		(ctx) => {
			ctx.fillStyle = '#fff';
			ctx.fillRect(0, 0, 400, 440);
			ctx.fillStyle = RED;
			ctx.fillRect(0, 0, 400, 110);
			ctx.fillStyle = '#fff';
			ctx.font = '90px Anton';
			ctx.textAlign = 'center';
			ctx.fillText('NOV', 200, 92);
			ctx.fillStyle = '#111';
			ctx.font = '280px Anton';
			ctx.fillText('19', 200, 400);
		},
		'19',
	);
	const oldPage = useCanvasTexture(
		400,
		440,
		(ctx) => {
			ctx.fillStyle = '#eee';
			ctx.fillRect(0, 0, 400, 440);
			ctx.fillStyle = '#888';
			ctx.fillRect(0, 0, 400, 110);
			ctx.fillStyle = '#bbb';
			ctx.font = '280px Anton';
			ctx.textAlign = 'center';
			ctx.fillText('??', 200, 400);
		},
		'old',
	);
	const c1 = prog(t, 41.1, 41.6, Easing.out(Easing.back(1.5)));
	const c2 = prog(t, 42.4, 42.9, Easing.out(Easing.back(1.5)));
	return (
		<>
			<Studio bg="#0b0620" floor="#1a1035" fog={[12, 40]} />
			<ambientLight intensity={0.5} />
			<spotLight position={[0, 12, 6]} angle={0.5} penumbra={0.5} intensity={300} />
			<spotLight position={[-6, 8, 4]} angle={0.3} penumbra={0.4} intensity={c1 * 300} color="#4d8bff" target-position={[-3, 1, 0]} />
			<spotLight position={[6, 8, 4]} angle={0.3} penumbra={0.4} intensity={c2 * 300} color={GREEN} target-position={[3, 1, 0]} />
			{/* calendário gigante */}
			<group position={[0, 5.2, -1]}>
				<mesh position={[0, 0, -0.1]}>
					<boxGeometry args={[3.2, 3.5, 0.2]} />
					<meshStandardMaterial color="#ddd" />
				</mesh>
				<mesh position={[0, 0, 0.01]}>
					<planeGeometry args={[3, 3.3]} />
					<meshStandardMaterial map={page} emissiveMap={page} emissive="#fff" emissiveIntensity={0.3} />
				</mesh>
				{flip < 1 ? (
					<group position={[0, 1.65, 0.03]} rotation={[-flip * Math.PI * 0.95, 0, 0]}>
						<mesh position={[0, -1.65, 0]}>
							<planeGeometry args={[3, 3.3]} />
							<meshStandardMaterial map={oldPage} side={THREE.DoubleSide} />
						</mesh>
					</group>
				) : null}
			</group>
			{/* pedestais com consoles genéricos */}
			{[
				{x: -3, s: c1, color: '#f2f2f7', h: 1.6, w: 0.7},
				{x: 3, s: c2, color: '#141414', h: 1.3, w: 0.9},
			].map((c) => (
				<group key={c.x} position={[c.x * 0.85, 1.0, 1.5]}>
					<mesh position={[0, 0.9, 0]}>
						<cylinderGeometry args={[1, 1.1, 1.8, 32]} />
						<meshStandardMaterial color="#2a1d45" emissive="#2a1d45" emissiveIntensity={0.4} />
					</mesh>
					{c.s > 0 ? (
						<mesh position={[0, 1.8 + (c.h / 2) * c.s * 1.4, 0]} rotation={[0, t * 0.8, 0]} scale={c.s * 1.4}>
							<boxGeometry args={[c.w, c.h, 1.2]} />
							<meshStandardMaterial color={c.color} metalness={0.3} roughness={0.4} />
						</mesh>
					) : null}
				</group>
			))}
			<Confetti t={t} start={39.38} origin={[0, 6, 0]} count={70} />
			<CameraRig from={[0, 4.6, 13]} to={[0, 4.2, 11]} lookFrom={[0, 4.6, 0]} lookTo={[0, 4.4, 0]} k={k} />
		</>
	);
};

// "Você acha isso um absurdo ou não se importa em comprar uma caixa sem disco?"
const VoteSet: React.FC<{t: number; k: number}> = ({t, k}) => {
	const pressA = t >= 46.8 && t < 47.6 ? 1 : 0;
	const pressB = t >= 48.14 && t < 48.9 ? 1 : 0;
	const label = (txt: string, color: string) => (ctx: CanvasRenderingContext2D) => {
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, 400, 120);
		ctx.fillStyle = '#fff';
		ctx.font = '76px Anton';
		ctx.textAlign = 'center';
		ctx.fillText(txt, 200, 92);
	};
	const la = useCanvasTexture(400, 120, label('ABSURDO', RED), 'a');
	const lb = useCanvasTexture(400, 120, label('TANTO FAZ', '#6b5bff'), 'b');
	return (
		<>
			<Studio bg="#120624" floor="#22103d" fog={[12, 40]} />
			<ambientLight intensity={0.5} />
			<spotLight position={[0, 10, 6]} angle={0.6} penumbra={0.5} intensity={260} />
			{[
				{x: -2.6, color: RED, press: pressA, tex: la, glow: t >= 46.8},
				{x: 2.6, color: '#6b5bff', press: pressB, tex: lb, glow: t >= 48.14},
			].map((b) => (
				<group key={b.x} position={[b.x, 0, 0]}>
					<mesh position={[0, 1, 0]}>
						<cylinderGeometry args={[1.4, 1.5, 2, 32]} />
						<meshStandardMaterial color="#2a1d45" />
					</mesh>
					<mesh position={[0, 2.25 - b.press * 0.2, 0]}>
						<cylinderGeometry args={[1.1, 1.1, 0.5, 32]} />
						<meshStandardMaterial color={b.color} emissive={b.color} emissiveIntensity={b.glow ? 0.9 : 0.15} />
					</mesh>
					<mesh position={[0, 1, 1.52]}>
						<planeGeometry args={[2.4, 0.72]} />
						<meshBasicMaterial map={b.tex} />
					</mesh>
					{b.glow ? <pointLight position={[0, 3, 0]} intensity={60} color={b.color} distance={8} /> : null}
				</group>
			))}
			{/* a caixa sem disco flutuando entre os botões */}
			<GameCase3D open={0.55 + Math.sin(t * 2) * 0.1} position={[0, 4.4, -0.5]} rotation={[0, Math.sin(t) * 0.4, 0]} scale={0.8} />
			<CameraRig from={[0, 3.0, 11]} to={[0, 3.2, 9.8]} lookFrom={[0, 3.8, 0]} lookTo={[0, 4.0, 0]} k={k} />
		</>
	);
};

// "Comenta aqui embaixo e segue a ZoneGTA6..." – balões de comentário e sino
const CommentSet: React.FC<{t: number; k: number}> = ({t, k}) => {
	const dots = useCanvasTexture(
		256,
		160,
		(ctx) => {
			ctx.fillStyle = '#ffffff';
			ctx.fillRect(0, 0, 256, 160);
			ctx.fillStyle = '#444';
			[70, 128, 186].forEach((x) => {
				ctx.beginPath();
				ctx.arc(x, 80, 18, 0, Math.PI * 2);
				ctx.fill();
			});
		},
		'dots',
	);
	const ring = t > 53.68 ? Math.sin((t - 53.68) * 18) * Math.exp(-(t - 53.68) * 1.5) * 0.6 : 0;
	return (
		<>
			<Studio bg="#14062a" floor="#22103d" fog={[12, 40]} />
			<ambientLight intensity={0.7} />
			<pointLight position={[0, 6, 6]} intensity={120} color="#ffffff" />
			<pointLight position={[-5, 3, 0]} intensity={60} color={PINK} />
			{new Array(9).fill(0).map((_, i) => {
				const start = 50.7 + i * 0.35;
				if (t < start) return null;
				const d = t - start;
				const x = -4 + random(`bx${i}`) * 8;
				return (
					<group key={i} position={[x, 0.5 + d * 1.6, -random(`bz${i}`) * 3]} rotation={[0, Math.sin(d + i) * 0.3, 0]} scale={Math.min(1, d * 4) * (0.7 + random(`bs${i}`) * 0.5)}>
						<mesh>
							<boxGeometry args={[1.8, 1.1, 0.3]} />
							<meshStandardMaterial color="#ffffff" />
						</mesh>
						<mesh position={[0, 0, 0.16]}>
							<planeGeometry args={[1.7, 1.0]} />
							<meshBasicMaterial map={dots} />
						</mesh>
						<mesh position={[-0.5, -0.7, 0]} rotation={[0, 0, Math.PI]}>
							<coneGeometry args={[0.25, 0.5, 3]} />
							<meshStandardMaterial color="#ffffff" />
						</mesh>
					</group>
				);
			})}
			{/* sino */}
			<group position={[3.3, 5.6, 0]} rotation={[0, 0, ring]}>
				<mesh position={[0, -0.8, 0]}>
					<cylinderGeometry args={[0.35, 1, 1.4, 32, 1, true]} />
					<meshStandardMaterial color={YELLOW} metalness={0.8} roughness={0.25} side={THREE.DoubleSide} />
				</mesh>
				<mesh position={[0, -0.1, 0]}>
					<sphereGeometry args={[0.36, 16, 12]} />
					<meshStandardMaterial color={YELLOW} metalness={0.8} roughness={0.25} />
				</mesh>
				<mesh position={[0, -1.6, 0]}>
					<sphereGeometry args={[0.2, 12, 10]} />
					<meshStandardMaterial color={ORANGE} />
				</mesh>
			</group>
			<CameraRig from={[0, 4, 12]} to={[0, 4.4, 10]} lookFrom={[0, 4.4, 0]} lookTo={[0, 4.6, 0]} k={k} />
		</>
	);
};

/* ------------------------------ roteiro ------------------------------ */

const SEGMENTS: {from: number; to: number; Set: React.FC<{t: number; k: number}>}[] = [
	{from: 0, to: 3.4, Set: StoreSet},
	{from: 3.4, to: 7.1, Set: MoneySet},
	{from: 7.1, to: 12.2, Set: SurpriseSet},
	{from: 12.2, to: 15.5, Set: NewsSet},
	{from: 15.5, to: 22.1, Set: EmptyCaseSet},
	{from: 22.1, to: 29.15, Set: DiscCodeSet},
	{from: 29.15, to: 36, Set: LivingRoomSet},
	{from: 36, to: 37, Set: StoreSet},
	{from: 37, to: 44.6, Set: LaunchSet},
	{from: 44.6, to: 50.55, Set: VoteSet},
	{from: 50.55, to: 999, Set: CommentSet},
];

export const World3D: React.FC<{end: number}> = ({end}) => {
	const frame = useCurrentFrame();
	const {width, height, fps} = useVideoConfig();
	const t = frame / fps;
	const seg = SEGMENTS.find((s) => t >= s.from && t < s.to) ?? SEGMENTS[SEGMENTS.length - 1];
	const k = interpolate(t, [seg.from, Math.min(seg.to, end)], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	return (
		<ThreeCanvas width={width} height={height} camera={{fov: 50, near: 0.1, far: 300}}>
			<seg.Set t={t} k={k} />
		</ThreeCanvas>
	);
};
