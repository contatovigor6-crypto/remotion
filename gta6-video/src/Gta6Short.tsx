import {loadFont} from '@remotion/fonts';
import React from 'react';
import {
	AbsoluteFill,
	Audio,
	Easing,
	interpolate,
	random,
	Sequence,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import words from './words.json';

// Fontes empacotadas em public/fonts (o render não depende de internet)
const ANTON = 'Anton';
const MONT = 'Montserrat';
loadFont({family: ANTON, url: staticFile('fonts/anton.woff2')});
loadFont({family: MONT, url: staticFile('fonts/montserrat-700.woff2'), weight: '700'});
loadFont({family: MONT, url: staticFile('fonts/montserrat-900.woff2'), weight: '900'});

export const FPS = 30;
// Narração tem 56,6 s. Seguramos ~0,7 s no final para fechar o CTA.
export const DURATION_IN_FRAMES = Math.round(57.3 * FPS);

const f = (s: number) => Math.round(s * FPS);

const PINK = '#ff2e88';
const ORANGE = '#ff8a3d';
const CYAN = '#22e4ff';
const YELLOW = '#ffe600';
const GREEN = '#39ff88';
const RED = '#ff2b2b';

// Mola "pop" usada em todas as entradas. t = segundo absoluto em que o elemento aparece.
const usePop = (t: number, damping = 11) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({
		frame: frame - f(t),
		fps,
		config: {damping, stiffness: 220, mass: 0.7},
	});
};

const textStroke = (px: number, color = '#000') =>
	`${px}px ${color}`;

/* ---------------------------------------------------------------- */
/* CÂMERA: punch-zooms nos beats cômicos + tremidas nos impactos     */
/* ---------------------------------------------------------------- */

const PUNCHES: {t: number; amount: number}[] = [
	{t: 2.52, amount: 0.16}, // "física?" + vine boom
	{t: 6.28, amount: 0.06}, // "dinheiro"
	{t: 11.18, amount: 0.14}, // "surpresa"
	{t: 12.32, amount: 0.05}, // "Rockstar"
	{t: 18.6, amount: 0.18}, // "NÃO terão disco"
	{t: 21.14, amount: 0.22}, // "Isso mesmo." (bruh)
	{t: 26.54, amount: 0.08}, // "código"
	{t: 35.24, amount: 0.12}, // "jogar" 🤡
	{t: 36.1, amount: 0.2}, // "E tem mais!"
	{t: 39.38, amount: 0.1}, // "19"
	{t: 46.8, amount: 0.12}, // "absurdo"
];

const SHAKES: {t: number; dur: number; power: number}[] = [
	{t: 2.52, dur: 0.35, power: 14},
	{t: 18.6, dur: 0.5, power: 18},
	{t: 26.54, dur: 0.3, power: 10},
	{t: 36.1, dur: 0.5, power: 22},
	{t: 46.8, dur: 0.4, power: 12},
];

const Camera: React.FC<{children: React.ReactNode}> = ({children}) => {
	const frame = useCurrentFrame();
	let scale = 1;
	for (const p of PUNCHES) {
		const d = frame - f(p.t);
		if (d >= 0 && d < 24) {
			scale +=
				p.amount *
				interpolate(d, [0, 2, 24], [0, 1, 0], {
					easing: Easing.out(Easing.cubic),
					extrapolateRight: 'clamp',
				});
		}
	}
	// "Isso mesmo." -> zoom lento e dramático que segura até o próximo bloco
	scale += interpolate(frame, [f(21.14), f(22.1)], [0, 0.12], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.quad),
	}) * (frame < f(22.2) ? 1 : 0);

	let x = 0;
	let y = 0;
	let rot = 0;
	for (const s of SHAKES) {
		const d = frame - f(s.t);
		if (d >= 0 && d < f(s.dur)) {
			const k = 1 - d / f(s.dur);
			x += (random(`x${frame}`) - 0.5) * 2 * s.power * k;
			y += (random(`y${frame}`) - 0.5) * 2 * s.power * k;
			rot += (random(`r${frame}`) - 0.5) * 2 * k;
		}
	}
	return (
		<AbsoluteFill
			style={{
				transform: `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`,
			}}
		>
			{children}
		</AbsoluteFill>
	);
};

/* ---------------------------------------------------------------- */
/* FUNDO: pôr do sol synthwave, grid em perspectiva e coqueiros      */
/* ---------------------------------------------------------------- */

const Palm: React.FC<{x: number; scale: number; flip?: boolean}> = ({
	x,
	scale,
	flip,
}) => {
	const frame = useCurrentFrame();
	const sway = Math.sin(frame / 25 + x) * 2;
	return (
		<svg
			viewBox="0 0 200 400"
			width={200 * scale}
			height={400 * scale}
			style={{
				position: 'absolute',
				left: x,
				bottom: 560,
				transform: `scaleX(${flip ? -1 : 1}) rotate(${sway}deg)`,
				transformOrigin: 'bottom center',
			}}
		>
			<path
				d="M100 400 C 104 300, 112 200, 120 110 L 128 110 C 122 200, 114 300, 112 400 Z"
				fill="#1a0526"
			/>
			{[
				'M124 110 C 90 80, 50 85, 10 120 C 55 95, 90 98, 124 116 Z',
				'M124 110 C 160 75, 195 85, 200 125 C 170 98, 150 100, 124 116 Z',
				'M124 110 C 100 60, 70 35, 30 30 C 75 50, 100 75, 122 112 Z',
				'M124 110 C 140 55, 170 30, 195 40 C 160 50, 140 80, 126 114 Z',
				'M124 110 C 118 70, 125 30, 140 5 C 132 40, 130 75, 128 112 Z',
			].map((d) => (
				<path key={d} d={d} fill="#1a0526" />
			))}
		</svg>
	);
};

const Background: React.FC<{hue: number}> = ({hue}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill
			style={{
				background: `linear-gradient(180deg, #12002b 0%, #3d0a5c 35%, ${PINK} 62%, ${ORANGE} 72%, #1a0526 72.2%)`,
				filter: `hue-rotate(${hue}deg)`,
			}}
		>
			{/* Sol listrado */}
			<div
				style={{
					position: 'absolute',
					left: 540 - 330,
					top: 760,
					width: 660,
					height: 660,
					borderRadius: '50%',
					background: `linear-gradient(180deg, ${YELLOW} 0%, ${ORANGE} 50%, ${PINK} 100%)`,
					WebkitMaskImage:
						'linear-gradient(180deg, #000 0%, #000 50%, transparent 50%, transparent 54%, #000 54%, #000 62%, transparent 62%, transparent 67%, #000 67%, #000 74%, transparent 74%, transparent 80%, #000 80%, #000 86%, transparent 86%)',
					boxShadow: `0 0 160px ${PINK}`,
					opacity: 0.9,
				}}
			/>
			<Palm x={-40} scale={1.6} />
			<Palm x={820} scale={1.3} flip />
			{/* Grid em perspectiva */}
			<div
				style={{
					position: 'absolute',
					left: -540,
					right: -540,
					top: 1382,
					height: 900,
					transform: 'perspective(500px) rotateX(62deg)',
					transformOrigin: 'top center',
					backgroundImage: `linear-gradient(${CYAN} 3px, transparent 3px), linear-gradient(90deg, ${CYAN} 3px, transparent 3px)`,
					backgroundSize: '90px 90px',
					backgroundPosition: `0 ${(frame * 4) % 90}px`,
					opacity: 0.55,
				}}
			/>
			{/* Vinheta */}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.65) 100%)',
				}}
			/>
		</AbsoluteFill>
	);
};

/* ---------------------------------------------------------------- */
/* ELEMENTOS                                                         */
/* ---------------------------------------------------------------- */

const Title: React.FC<{
	children: React.ReactNode;
	at: number;
	size?: number;
	color?: string;
	top: number;
	rotate?: number;
}> = ({children, at, size = 130, color = '#fff', top, rotate = -3}) => {
	const pop = usePop(at);
	if (pop <= 0) return null;
	return (
		<div
			style={{
				position: 'absolute',
				top,
				left: 0,
				right: 0,
				textAlign: 'center',
				fontFamily: ANTON,
				fontSize: size,
				lineHeight: 1,
				color,
				textTransform: 'uppercase',
				WebkitTextStroke: textStroke(Math.round(size / 13)),
				paintOrder: 'stroke fill',
				textShadow: '0 10px 0 rgba(0,0,0,0.6)',
				transform: `scale(${pop}) rotate(${rotate}deg)`,
				padding: '0 40px',
			}}
		>
			{children}
		</div>
	);
};

const Emoji: React.FC<{
	char: string;
	at: number;
	x: number;
	y: number;
	size?: number;
	wobble?: boolean;
}> = ({char, at, x, y, size = 200, wobble}) => {
	const frame = useCurrentFrame();
	const pop = usePop(at, 9);
	if (pop <= 0) return null;
	const w = wobble ? Math.sin(frame / 4) * 8 : 0;
	return (
		<div
			style={{
				position: 'absolute',
				left: x - size / 2,
				top: y - size / 2,
				fontSize: size,
				lineHeight: 1,
				transform: `scale(${pop}) rotate(${w}deg)`,
				filter: 'drop-shadow(0 12px 0 rgba(0,0,0,0.4))',
			}}
		>
			{char}
		</div>
	);
};

const GameCase: React.FC<{open: number; finePrint: boolean}> = ({
	open,
	finePrint,
}) => {
	const W = 500;
	const H = 640;
	return (
		<div style={{position: 'relative', width: W, height: H, perspective: 1600}}>
			{/* Bandeja interna (vazia!) */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: 26,
					background: 'linear-gradient(135deg, #2a2a33, #15151b)',
					border: '14px solid #0b4fc4',
					boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)',
				}}
			>
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: '42%',
						width: 360,
						height: 360,
						marginLeft: -180,
						marginTop: -180,
						borderRadius: '50%',
						border: '6px dashed rgba(255,255,255,0.18)',
					}}
				/>
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: '42%',
						width: 80,
						height: 80,
						marginLeft: -40,
						marginTop: -40,
						borderRadius: '50%',
						background: '#0b0b10',
						border: '6px solid #3a3a45',
					}}
				/>
				{/* papelzinho com o código */}
				<div
					style={{
						position: 'absolute',
						left: 70,
						right: 70,
						bottom: 40,
						height: 110,
						background: '#fffbe8',
						borderRadius: 8,
						transform: 'rotate(-4deg)',
						fontFamily: MONT,
						fontWeight: 900,
						fontSize: 30,
						color: '#222',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						boxShadow: '0 6px 16px rgba(0,0,0,0.6)',
					}}
				>
					<div style={{fontSize: 22, opacity: 0.6}}>CÓDIGO DE DOWNLOAD</div>
					<div style={{letterSpacing: 2}}>XXXX-XXXX-XXXX</div>
				</div>
				<div style={{position: 'absolute', right: 26, top: 20, fontSize: 90}}>
					🕸️
				</div>
			</div>
			{/* Capa */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					transformOrigin: 'left center',
					transform: `rotateY(${-open * 165}deg)`,
					backfaceVisibility: 'hidden',
					borderRadius: 26,
					border: '14px solid #0b4fc4',
					background: `linear-gradient(160deg, #3d0a5c 0%, ${PINK} 55%, ${ORANGE} 100%)`,
					overflow: 'hidden',
					boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
				}}
			>
				<div
					style={{
						background: '#0b4fc4',
						color: '#fff',
						fontFamily: MONT,
						fontWeight: 900,
						fontSize: 34,
						padding: '8px 0',
						textAlign: 'center',
						letterSpacing: 4,
					}}
				>
					MÍDIA FÍSICA
				</div>
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: 250,
						width: 300,
						height: 300,
						marginLeft: -150,
						borderRadius: '50%',
						background: `linear-gradient(180deg, ${YELLOW}, ${ORANGE})`,
						opacity: 0.9,
					}}
				/>
				<div
					style={{
						position: 'absolute',
						top: 110,
						left: 0,
						right: 0,
						textAlign: 'center',
						fontFamily: ANTON,
						fontSize: 190,
						color: '#fff',
						WebkitTextStroke: '10px #12002b',
						paintOrder: 'stroke fill',
						lineHeight: 1,
					}}
				>
					GTA 6
				</div>
				<div
					style={{
						position: 'absolute',
						bottom: 18,
						left: 0,
						right: 0,
						textAlign: 'center',
						fontFamily: MONT,
						fontWeight: 700,
						fontSize: 22,
						color: '#fff',
						opacity: finePrint ? 1 : 0,
					}}
				>
					*disco não incluso 🙃
				</div>
			</div>
		</div>
	);
};

const DownloadBar: React.FC<{
	progress: number;
	label: string;
	sub: string;
	top: number;
	at: number;
}> = ({progress, label, sub, top, at}) => {
	const pop = usePop(at);
	if (pop <= 0) return null;
	return (
		<div
			style={{
				position: 'absolute',
				top,
				left: 90,
				right: 90,
				background: '#101018',
				borderRadius: 28,
				border: `5px solid ${CYAN}`,
				padding: '28px 34px',
				transform: `scale(${pop})`,
				boxShadow: `0 0 50px ${CYAN}66`,
				fontFamily: MONT,
				color: '#fff',
			}}
		>
			<div style={{fontWeight: 900, fontSize: 44, marginBottom: 18}}>
				{label}
			</div>
			<div
				style={{
					height: 46,
					background: '#2a2a3a',
					borderRadius: 23,
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						width: `${progress * 100}%`,
						height: '100%',
						background: `repeating-linear-gradient(45deg, ${GREEN}, ${GREEN} 20px, #2bd46f 20px, #2bd46f 40px)`,
					}}
				/>
			</div>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					marginTop: 14,
					fontWeight: 700,
					fontSize: 32,
					opacity: 0.85,
				}}
			>
				<span>{sub}</span>
				<span>{Math.floor(progress * 100)}%</span>
			</div>
		</div>
	);
};

/* ---------------------------------------------------------------- */
/* CENAS                                                             */
/* ---------------------------------------------------------------- */

// Wrapper: monta a cena só no intervalo e dá um "punch-in" na entrada (corte seco com impacto).
const Scene: React.FC<{
	from: number;
	to: number;
	children: React.ReactNode;
}> = ({from, to, children}) => {
	const frame = useCurrentFrame();
	const pop = usePop(from, 14);
	if (frame < f(from) || frame >= f(to)) return null;
	return (
		<AbsoluteFill
			style={{
				transform: `scale(${interpolate(pop, [0, 1], [1.25, 1])})`,
				opacity: interpolate(pop, [0, 0.25], [0, 1], {
					extrapolateRight: 'clamp',
				}),
			}}
		>
			{children}
		</AbsoluteFill>
	);
};

const HookScene: React.FC = () => {
	const frame = useCurrentFrame();
	const casePop = usePop(0, 10);
	const tilt = Math.sin(frame / 12) * 4;
	return (
		<>
			<Title at={0.1} top={150} size={110}>
				Vai comprar
			</Title>
			<Title at={1.24} top={270} size={170} color={YELLOW} rotate={2}>
				GTA 6
			</Title>
			<div
				style={{
					position: 'absolute',
					left: 290,
					top: 520,
					transform: `scale(${casePop * 0.95}) rotate(${tilt}deg)`,
				}}
			>
				<GameCase open={0} finePrint={false} />
			</div>
			<Emoji char="🤔" at={0.3} x={880} y={560} size={170} wobble />
		</>
	);
};

const MoneyScene: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<>
			{/* chuva de dinheiro 💸 */}
			{new Array(14).fill(0).map((_, i) => {
				const start = f(5.6) + i * 2;
				const d = frame - start;
				if (d < 0) return null;
				const x = random(`mx${i}`) * 1000;
				const y = -150 + d * (16 + random(`ms${i}`) * 10);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							fontSize: 120,
							opacity: 0.85,
							transform: `rotate(${d * (random(`mr${i}`) * 8 - 4)}deg)`,
						}}
					>
						💸
					</div>
				);
			})}
			<Title at={3.42} top={170} size={120}>
				Antes de gastar
			</Title>
			<Title at={6.12} top={300} size={150} color={GREEN} rotate={3}>
				seu dinheiro
			</Title>
			<Emoji char="👛" at={3.5} x={540} y={860} size={340} />
			<Emoji char="😰" at={4.4} x={540} y={600} size={190} wobble />
		</>
	);
};

const StayScene: React.FC = () => {
	const frame = useCurrentFrame();
	const progress = interpolate(frame, [f(7.3), f(11.1)], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	return (
		<>
			<Title at={7.3} top={180} size={130}>
				Fica até o
			</Title>
			<Title at={7.88} top={320} size={190} color={YELLOW} rotate={2}>
				final ⚠️
			</Title>
			<DownloadBar
				at={8.3}
				top={620}
				progress={progress}
				label="Carregando surpresa..."
				sub="não pula, hein 👀"
			/>
			<Emoji char="😱" at={11.18} x={540} y={1000} size={300} wobble />
		</>
	);
};

const NewsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const blink = Math.floor(frame / 8) % 2 === 0;
	const pop = usePop(12.24);
	return (
		<>
			<div
				style={{
					position: 'absolute',
					top: 260,
					left: 60,
					right: 60,
					transform: `scale(${pop}) rotate(-2deg)`,
				}}
			>
				<div
					style={{
						background: RED,
						fontFamily: ANTON,
						fontSize: 110,
						color: '#fff',
						textAlign: 'center',
						padding: '10px 0',
						border: '8px solid #fff',
						opacity: blink ? 1 : 0.85,
					}}
				>
					🚨 URGENTE 🚨
				</div>
				<div
					style={{
						background: '#fff',
						fontFamily: MONT,
						fontWeight: 900,
						fontSize: 62,
						color: '#111',
						textAlign: 'center',
						padding: '22px 10px',
					}}
				>
					ROCKSTAR CONFIRMOU
				</div>
			</div>
			<Title at={14.04} top={720} size={110} color={CYAN} rotate={2}>
				informação curiosa
			</Title>
			<Emoji char="🧐" at={14.66} x={540} y={1050} size={260} wobble />
		</>
	);
};

const EmptyBoxScene: React.FC = () => {
	const frame = useCurrentFrame();
	const open = interpolate(frame, [f(18.5), f(19.3)], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.back(1.4)),
	});
	const sad = frame >= f(21.14);
	return (
		<AbsoluteFill style={{filter: sad ? 'grayscale(0.85) contrast(1.15)' : 'none'}}>
			<Title at={15.62} top={140} size={105}>
				Versões físicas
			</Title>
			<Title at={18.6} top={265} size={135} color={RED} rotate={2}>
				SEM DISCO ❌
			</Title>
			<div
				style={{
					position: 'absolute',
					left: 290,
					top: 500,
					transform: `scale(0.95) rotate(${interpolate(open, [0, 1], [-3, 0])}deg)`,
				}}
			>
				<GameCase open={open} finePrint={frame >= f(17.4)} />
			</div>
			{sad ? (
				<>
					<Emoji char="🗿" at={21.14} x={880} y={1080} size={240} />
					<Title at={21.14} top={1200} size={120} color={YELLOW} rotate={-4}>
						isso mesmo.
					</Title>
				</>
			) : null}
		</AbsoluteFill>
	);
};

const BluRayScene: React.FC = () => {
	const frame = useCurrentFrame();
	const discPop = usePop(22.2);
	// tapa: o disco voa pra fora no "Blu-ray"
	const slap = interpolate(frame, [f(23.6), f(24.1)], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.in(Easing.quad),
	});
	const errPop = usePop(26.54, 13);
	const dl = interpolate(frame, [f(27.2), f(29.1)], [0, 0.07], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	return (
		<>
			<Title at={22.24} top={150} size={110}>
				Em vez do Blu-ray...
			</Title>
			{slap < 1 ? (
				<div
					style={{
						position: 'absolute',
						left: 540 - 220,
						top: 420,
						width: 440,
						height: 440,
						borderRadius: '50%',
						background:
							'conic-gradient(from 0deg, #c9d6ff, #f0c9ff, #c9fff3, #fff6c9, #c9d6ff)',
						border: '6px solid #fff',
						boxShadow: '0 0 60px rgba(120,180,255,0.8)',
						transform: `translate(${slap * 900}px, ${-slap * 300}px) rotate(${frame * 6 + slap * 720}deg) scale(${discPop})`,
					}}
				>
					<div
						style={{
							position: 'absolute',
							left: 170,
							top: 170,
							width: 100,
							height: 100,
							borderRadius: '50%',
							background: '#2a0f40',
						}}
					/>
					{frame >= f(23.24) ? (
						<div
							style={{
								position: 'absolute',
								inset: 0,
								fontSize: 380,
								lineHeight: '440px',
								textAlign: 'center',
								color: RED,
								fontFamily: ANTON,
							}}
						>
							✕
						</div>
					) : null}
				</div>
			) : null}
			{frame < f(26.5) ? (
				<Emoji char="👋" at={23.5} x={260} y={650} size={220} />
			) : null}
			{/* Janela de erro estilo sistema antigo */}
			{errPop > 0 ? (
				<div
					style={{
						position: 'absolute',
						left: 110,
						right: 110,
						top: 420,
						transform: `scale(${errPop})`,
						background: '#ece9d8',
						border: '4px solid #0a246a',
						borderRadius: 10,
						fontFamily: MONT,
						boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
					}}
				>
					<div
						style={{
							background: 'linear-gradient(90deg, #0a246a, #3a6ea5)',
							color: '#fff',
							fontWeight: 900,
							fontSize: 34,
							padding: '12px 20px',
						}}
					>
						GTA6.exe
					</div>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 24,
							padding: '30px 28px',
							fontWeight: 700,
							fontSize: 40,
							color: '#111',
						}}
					>
						<span style={{fontSize: 90}}>⛔</span>
						<span>
							Disco não encontrado.
							<br />
							Use o <b>código</b> 🎟️
						</span>
					</div>
				</div>
			) : null}
			<DownloadBar
				at={27.2}
				top={830}
				progress={dl}
				label="Baixando GTA 6..."
				sub="Na caixa física 📦"
			/>
		</>
	);
};

const ClownScene: React.FC = () => {
	const frame = useCurrentFrame();
	const dl = interpolate(frame, [f(33.4), f(35.0)], [0.12, 0.99], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	const stuck = frame >= f(35.0);
	return (
		<>
			<Title at={29.22} top={140} size={120} color={YELLOW}>
				ou seja...
			</Title>
			<Emoji char="📦" at={30.4} x={250} y={560} size={260} />
			<div
				style={{
					position: 'absolute',
					left: 120,
					top: 720,
					width: 260,
					textAlign: 'center',
					fontFamily: ANTON,
					fontSize: 60,
					color: '#fff',
					WebkitTextStroke: '6px #000',
					paintOrder: 'stroke fill',
					opacity: frame >= f(30.78) ? 1 : 0,
				}}
			>
				CAIXA
			</div>
			<Title at={31.76} top={470} size={220} rotate={0}>
				+
			</Title>
			<Emoji char="🌐" at={33.98} x={830} y={560} size={260} />
			<div
				style={{
					position: 'absolute',
					left: 700,
					top: 720,
					width: 260,
					textAlign: 'center',
					fontFamily: ANTON,
					fontSize: 60,
					color: '#fff',
					WebkitTextStroke: '6px #000',
					paintOrder: 'stroke fill',
					opacity: frame >= f(33.98) ? 1 : 0,
				}}
			>
				INTERNET
			</div>
			{frame < f(35.24) ? (
				<DownloadBar
					at={33.4}
					top={880}
					progress={dl}
					label={stuck ? 'Travou em 99% 💀' : 'Baixando 150 GB...'}
					sub={stuck ? 'tempo restante: 3 dias' : 'tempo restante: ∞'}
				/>
			) : (
				<>
					<Emoji char="🤡" at={35.24} x={540} y={1000} size={360} wobble />
				</>
			)}
		</>
	);
};

const MoreScene: React.FC = () => {
	const frame = useCurrentFrame();
	const flash = interpolate(frame, [f(36.1), f(36.4)], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	return (
		<>
			<AbsoluteFill
				style={{
					background: `repeating-conic-gradient(from ${frame * 3}deg at 50% 45%, ${YELLOW} 0deg 10deg, ${ORANGE} 10deg 20deg)`,
					opacity: 0.85,
				}}
			/>
			<Title at={36.02} top={620} size={230} rotate={-6}>
				E TEM MAIS!
			</Title>
			<AbsoluteFill style={{background: '#fff', opacity: flash}} />
		</>
	);
};

const DateScene: React.FC = () => {
	const frame = useCurrentFrame();
	const cal = usePop(39.2, 9);
	const confettiStart = f(39.38);
	return (
		<>
			<Title at={37.08} top={140} size={110}>
				GTA 6 chega dia
			</Title>
			{cal > 0 ? (
				<div
					style={{
						position: 'absolute',
						left: 540 - 230,
						top: 330,
						width: 460,
						borderRadius: 34,
						overflow: 'hidden',
						background: '#fff',
						boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
						transform: `perspective(1200px) rotateX(${(1 - cal) * 90}deg)`,
						transformOrigin: 'top center',
					}}
				>
					<div
						style={{
							background: RED,
							color: '#fff',
							fontFamily: ANTON,
							fontSize: 90,
							textAlign: 'center',
							padding: '6px 0',
						}}
					>
						NOV
					</div>
					<div
						style={{
							fontFamily: ANTON,
							fontSize: 300,
							color: '#111',
							textAlign: 'center',
							lineHeight: 1.1,
						}}
					>
						19
					</div>
				</div>
			) : null}
			{/* confete */}
			{frame >= confettiStart
				? new Array(40).fill(0).map((_, i) => {
						const d = frame - confettiStart;
						const ang = random(`ca${i}`) * Math.PI * 2;
						const v = 14 + random(`cv${i}`) * 18;
						const x = 540 + Math.cos(ang) * v * d;
						const y = 600 + Math.sin(ang) * v * d + 0.9 * d * d;
						return (
							<div
								key={i}
								style={{
									position: 'absolute',
									left: x,
									top: y,
									width: 22,
									height: 34,
									background: [PINK, YELLOW, CYAN, GREEN, ORANGE][i % 5],
									transform: `rotate(${d * 20 + i * 30}deg)`,
								}}
							/>
						);
					})
				: null}
			{(
				[
					{t: 41.18, label: 'PS5', color: '#0b4fc4', y: 1000},
					{t: 42.5, label: 'XBOX SERIES X|S', color: '#107c10', y: 1150},
				] as const
			).map((p) => (
				<Badge key={p.label} {...p} />
			))}
		</>
	);
};

const Badge: React.FC<{t: number; label: string; color: string; y: number}> = ({
	t,
	label,
	color,
	y,
}) => {
	const pop = usePop(t);
	if (pop <= 0) return null;
	return (
		<div
			style={{
				position: 'absolute',
				top: y,
				left: 0,
				right: 0,
				display: 'flex',
				justifyContent: 'center',
				transform: `scale(${pop})`,
			}}
		>
			<div
				style={{
					background: color,
					color: '#fff',
					fontFamily: MONT,
					fontWeight: 900,
					fontSize: 64,
					padding: '18px 48px',
					borderRadius: 60,
					border: '6px solid #fff',
					boxShadow: '0 12px 0 rgba(0,0,0,0.4)',
				}}
			>
				{label}
			</div>
		</div>
	);
};

const PollScene: React.FC = () => {
	const frame = useCurrentFrame();
	const pop = usePop(44.74);
	const a = interpolate(frame, [f(46.8), f(47.7)], [0.1, 0.62], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	const b = interpolate(frame, [f(48.14), f(49.0)], [0.1, 0.38], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	const row = (emoji: string, label: string, v: number, color: string, active: boolean) => (
		<div
			style={{
				position: 'relative',
				height: 130,
				borderRadius: 26,
				background: '#2a2a3a',
				overflow: 'hidden',
				marginTop: 28,
				border: active ? `6px solid ${YELLOW}` : '6px solid transparent',
			}}
		>
			<div style={{width: `${v * 100}%`, height: '100%', background: color}} />
			<div
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					padding: '0 30px',
					fontFamily: MONT,
					fontWeight: 900,
					fontSize: 54,
					color: '#fff',
				}}
			>
				<span>
					{emoji} {label}
				</span>
				<span>{Math.round(v * 100)}%</span>
			</div>
		</div>
	);
	return (
		<>
			<Title at={44.74} top={150} size={120}>
				E aí, você acha...
			</Title>
			<div
				style={{
					position: 'absolute',
					top: 420,
					left: 80,
					right: 80,
					background: '#101018',
					borderRadius: 34,
					padding: '34px 34px 40px',
					border: `5px solid ${PINK}`,
					boxShadow: `0 0 60px ${PINK}88`,
					transform: `scale(${pop})`,
				}}
			>
				<div style={{fontFamily: MONT, fontWeight: 900, fontSize: 46, color: '#fff'}}>
					Caixa sem disco é...
				</div>
				{row('😡', 'UM ABSURDO', a, RED, frame >= f(46.8) && frame < f(48.1))}
				{row('🤷', 'TANTO FAZ', b, '#6b5bff', frame >= f(48.1))}
			</div>
		</>
	);
};

const CtaScene: React.FC = () => {
	const frame = useCurrentFrame();
	const followed = frame >= f(52.15);
	const cursorIn = interpolate(frame, [f(51.4), f(52.0)], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	const press = frame >= f(52.04) && frame < f(52.2) ? 0.9 : 1;
	const cardPop = usePop(51.9);
	return (
		<>
			<Title at={50.66} top={150} size={150} color={YELLOW}>
				Comenta aí 👇
			</Title>
			<Emoji char="💬" at={50.7} x={540} y={520} size={230} wobble />
			{cardPop > 0 ? (
				<div
					style={{
						position: 'absolute',
						left: 90,
						right: 90,
						top: 760,
						background: '#fff',
						borderRadius: 40,
						padding: 36,
						display: 'flex',
						alignItems: 'center',
						gap: 30,
						transform: `scale(${cardPop})`,
						boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
					}}
				>
					<div
						style={{
							width: 150,
							height: 150,
							borderRadius: '50%',
							background: `linear-gradient(160deg, ${PINK}, ${ORANGE})`,
							fontFamily: ANTON,
							fontSize: 64,
							color: '#fff',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							WebkitTextStroke: '4px #12002b',
							paintOrder: 'stroke fill',
							flexShrink: 0,
						}}
					>
						Z6
					</div>
					<div style={{flex: 1}}>
						<div style={{fontFamily: ANTON, fontSize: 70, color: '#111', lineHeight: 1}}>
							ZONE GTA 6
						</div>
						<div
							style={{
								marginTop: 16,
								display: 'inline-block',
								background: followed ? '#d9d9d9' : RED,
								color: followed ? '#333' : '#fff',
								fontFamily: MONT,
								fontWeight: 900,
								fontSize: 44,
								padding: '12px 36px',
								borderRadius: 40,
								transform: `scale(${press})`,
							}}
						>
							{followed ? 'SEGUINDO ✓' : 'SEGUIR'}
						</div>
					</div>
				</div>
			) : null}
			{cursorIn > 0 ? (
				<div
					style={{
						position: 'absolute',
						left: interpolate(cursorIn, [0, 1], [1000, 470]),
						top: interpolate(cursorIn, [0, 1], [1300, 990]),
						fontSize: 120,
						transform: `scale(${press})`,
					}}
				>
					👆
				</div>
			) : null}
			<Emoji char="🔔" at={53.68} x={880} y={1200} size={170} wobble />
		</>
	);
};

/* ---------------------------------------------------------------- */
/* LEGENDAS: palavra por palavra, 1–3 palavras por bloco             */
/* ---------------------------------------------------------------- */

const KEYWORDS = new Set([
	'gta',
	'6',
	'física',
	'dinheiro',
	'final',
	'surpresa',
	'rockstar',
	'confirmou',
	'não',
	'disco',
	'caixa',
	'blu-ray',
	'código',
	'digitalmente',
	'internet',
	'mais',
	'19',
	'novembro',
	'playstation',
	'xbox',
	'absurdo',
	'comenta',
	'segue',
	'zone',
]);

type Word = {text: string; start: number; end: number};

const PAGES: Word[][] = (() => {
	const pages: Word[][] = [];
	let cur: Word[] = [];
	for (const w of words as Word[]) {
		const prev = cur[cur.length - 1];
		const breakHere =
			cur.length >= 3 ||
			(prev && /[.,?!]$/.test(prev.text)) ||
			(prev && w.start - prev.end > 0.35);
		if (breakHere && cur.length) {
			pages.push(cur);
			cur = [];
		}
		cur.push(w);
	}
	if (cur.length) pages.push(cur);
	return pages;
})();

const Captions: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;
	const idx = PAGES.findIndex((p, i) => {
		const next = PAGES[i + 1];
		return t >= p[0].start && (next ? t < next[0].start : t < p[p.length - 1].end + 0.6);
	});
	// No "E TEM MAIS!" o título gigante já é a legenda
	if (idx === -1 || (t >= 36.0 && t < 37.0)) return null;
	const page = PAGES[idx];
	const pagePop = spring({
		frame: frame - f(page[0].start),
		fps,
		config: {damping: 12, stiffness: 260},
	});
	return (
		<div
			style={{
				position: 'absolute',
				left: 50,
				right: 50,
				top: 1440,
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: 'center',
				gap: '0 38px',
				transform: `scale(${interpolate(pagePop, [0, 1], [0.7, 1])})`,
			}}
		>
			{page.map((w) => {
				if (t < w.start - 0.02) return null;
				const active = t < w.end + 0.05;
				const clean = w.text.toLowerCase().replace(/[.,?!]/g, '');
				const isKey = KEYWORDS.has(clean);
				const wp = spring({
					frame: frame - f(w.start),
					fps,
					config: {damping: 10, stiffness: 300},
				});
				return (
					<span
						key={`${w.start}-${w.text}`}
						style={{
							fontFamily: ANTON,
							fontSize: 120,
							lineHeight: 1.15,
							textTransform: 'uppercase',
							color: active ? YELLOW : isKey ? GREEN : '#fff',
							WebkitTextStroke: '12px #000',
							paintOrder: 'stroke fill',
							textShadow: '0 8px 0 rgba(0,0,0,0.7)',
							display: 'inline-block',
							transform: `scale(${interpolate(wp, [0, 1], [0.4, active ? 1.04 : 1])})`,
						}}
					>
						{w.text.replace(/[.,]$/, '')}
					</span>
				);
			})}
		</div>
	);
};

/* ---------------------------------------------------------------- */
/* EFEITOS SONOROS (cada um tem uma função cômica — ver comentários) */
/* ---------------------------------------------------------------- */

const SFX: {t: number; src: string; volume: number; dur?: number}[] = [
	{t: 2.5, src: 'vine-boom', volume: 0.45}, // pergunta-gancho "mídia física?"
	{t: 6.25, src: 'ding', volume: 0.3}, // "dinheiro" – caixa registradora
	{t: 7.28, src: 'whoosh', volume: 0.5}, // virada "fica até o final"
	{t: 11.15, src: 'anime-wow', volume: 0.22, dur: 1.4}, // "surpresa"
	{t: 12.22, src: 'snapchat-notification', volume: 0.5}, // notificação: URGENTE
	{t: 18.55, src: 'record-scratch', volume: 0.45}, // "NÃO terão disco" – virada absurda
	{t: 21.1, src: 'bruh', volume: 0.6}, // "Isso mesmo." 🗿
	{t: 23.55, src: 'whip', volume: 0.6}, // tapa no Blu-ray
	{t: 26.5, src: 'windows-xp-error', volume: 0.4}, // "código" – erro de disco
	{t: 27.3, src: 'loading-lag', volume: 0.2, dur: 1.8}, // download eterno
	{t: 35.2, src: 'spongebob-fail', volume: 0.3, dur: 2.0}, // "jogar" 🤡
	{t: 36.0, src: 'vine-boom', volume: 0.45}, // "E TEM MAIS!"
	{t: 39.3, src: 'yippee', volume: 0.25, dur: 1.6}, // data revelada + confete
	{t: 46.75, src: 'omg-hell-nah', volume: 0.25, dur: 1.6}, // "absurdo"
	{t: 50.6, src: 'whoosh', volume: 0.5}, // entra o CTA
	{t: 52.0, src: 'mouse-click', volume: 0.7}, // clica em seguir
	{t: 52.15, src: 'ding', volume: 0.3}, // "SEGUINDO ✓"
];

/* ---------------------------------------------------------------- */

export const Gta6Short: React.FC = () => {
	const frame = useCurrentFrame();
	// Cada bloco do roteiro ganha um tom diferente no fundo (mesma identidade visual)
	const hue =
		frame < f(15.5) ? 0 : frame < f(22.1) ? -25 : frame < f(36) ? -55 : frame < f(44.7) ? -15 : 0;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Camera>
				<Background hue={hue} />
				<Scene from={0} to={3.4}>
					<HookScene />
				</Scene>
				<Scene from={3.4} to={7.1}>
					<MoneyScene />
				</Scene>
				<Scene from={7.1} to={12.2}>
					<StayScene />
				</Scene>
				<Scene from={12.2} to={15.5}>
					<NewsScene />
				</Scene>
				<Scene from={15.5} to={22.1}>
					<EmptyBoxScene />
				</Scene>
				<Scene from={22.1} to={29.15}>
					<BluRayScene />
				</Scene>
				<Scene from={29.15} to={36.0}>
					<ClownScene />
				</Scene>
				<Scene from={36.0} to={37.0}>
					<MoreScene />
				</Scene>
				<Scene from={37.0} to={44.6}>
					<DateScene />
				</Scene>
				<Scene from={44.6} to={50.55}>
					<PollScene />
				</Scene>
				<Scene from={50.55} to={57.3}>
					<CtaScene />
				</Scene>
			</Camera>
			{/* Legendas fora da câmera para ficarem sempre legíveis */}
			<Captions />
			<Audio src={staticFile('narracao.mp3')} />
			{SFX.map((s) => (
				<Sequence
					key={`${s.src}-${s.t}`}
					from={f(s.t)}
					durationInFrames={s.dur ? f(s.dur) : undefined}
					layout="none"
				>
					<Audio src={staticFile(`sfx/${s.src}.wav`)} volume={s.volume} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
