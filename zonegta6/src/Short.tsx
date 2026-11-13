import React from 'react';
import {
	AbsoluteFill,
	Html5Audio,
	Img,
	interpolate,
	random,
	Sequence,
	staticFile,
	useCurrentFrame,
} from 'remotion';
import {Grade, Slideshow} from './Background';
import {Backdrop, Flash, MaskTitle, Panel, Shake, Tag, useIn, Words} from './components';
import {body, C, display, mono} from './theme';
import {voiceActivity} from './voiceActivity';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Mapa da timeline (30 fps). A duração de cada bloco segue a narração
// Narração do Marcio (ElevenLabs) em um único arquivo contínuo; cada bloco começa
// 6 frames antes da primeira palavra dele, medida por transcrição com timestamps.
const blocks = {
	hook: 150, // gancho: "6 DIAS" + mistério do número
	date: 192, // contexto: data confirmada
	fps: 369, // revelação principal: 30 FPS + alívio cômico
	pro: 236, // recompensa: o que o PS5 Pro ganha
	rumor: 218, // separa rumor de fato: modo 40 FPS?
	size: 196, // tamanho do download + humor
	cloud: 163, // Xbox One via nuvem
	record: 146, // recorde de pré-venda
	cta: 338, // pergunta + CTA
} as const;
type Block = keyof typeof blocks;
export const T = (() => {
	let at = 0;
	const out = {} as Record<Block, [number, number]>;
	for (const k of Object.keys(blocks) as Block[]) {
		out[k] = [at, at + blocks[k]];
		at += blocks[k];
	}
	return out;
})();
export const DURATION = T.cta[1];

// Fundo: capturas oficiais de GTA VI (Rockstar Games, seção Downloads do site oficial),
// trocando de imagem dentro de cada bloco. Ficam em public/media/, fora do git.
// Para usar clipes de vídeo, basta colocar o .mp4 em public/media/ e listar aqui.
const media: Record<Block, string[]> = {
	hook: ['vice_city_01.jpg', 'launch_trailer.jpg'],
	date: ['pre_load.jpg', 'an_extended_look.jpg', 'hero.jpg'],
	fps: ['jason_and_lucia_08.jpg', 'jason_and_lucia_09.jpg', 'jason_and_lucia_04.jpg', 'vice_city_06.jpg', 'vice_city_25.jpg'],
	pro: ['leonida_keys_01.jpg', 'vice_city_08.jpg', 'leonida_keys_04.jpg'],
	rumor: ['grassrivers_04.jpg', 'port_gellhorn_01.jpg', 'mount_kalaga_national_park_02.jpg'],
	size: ['vice_city_18.jpg', 'vice_city_19.jpg', 'leonida_keys_01.jpg'],
	cloud: ['vice_city_23.jpg', 'vice_city_27.jpg'],
	record: ['vice_city_25.jpg', 'vice_city_06.jpg'],
	cta: ['jason_and_lucia_01.jpg', 'hero.jpg', 'vice_city_01.jpg'],
};

const VO_FILE = 'vo/narracao-marcio.mp3';
const VO_START = 4; // frame em que a narração entra

const S: React.FC<{k: Block; children: React.ReactNode}> = ({k, children}) => (
	<Sequence from={T[k][0]} durationInFrames={T[k][1] - T[k][0]} name={k}>
		{children}
	</Sequence>
);

const Stack: React.FC<{children: React.ReactNode; gap?: number; top?: number}> = ({children, gap = 36, top = 430}) => (
	<AbsoluteFill style={{padding: `${top}px 80px 0`, display: 'flex', flexDirection: 'column', gap}}>{children}</AbsoluteFill>
);

// ── 1. GANCHO ────────────────────────────────────────────────
const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const scale = interpolate(frame, [0, 6, 105], [2.4, 1, 0.92], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
	const g = frame < 8 ? (random(`h${frame}`) - 0.5) * 50 : 0;
	const layer = (color: string, dx: number, blend: boolean) => (
		<div
			style={{
				position: blend ? 'absolute' : 'relative',
				inset: 0,
				fontFamily: display,
				fontSize: 330,
				lineHeight: 0.9,
				color,
				transform: `translateX(${dx}px)`,
				mixBlendMode: blend ? 'screen' : undefined,
				textAlign: 'center',
				textShadow: blend ? undefined : `0 0 60px ${C.pink}`,
			}}
		>
			6 DIAS
		</div>
	);
	return (
		<Shake at={0} strength={40}>
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 60}}>
				<div style={{position: 'relative', transform: `scale(${scale})`}}>
					{layer(C.white, 0, false)}
					{g !== 0 ? layer(C.pink, g, true) : null}
					{g !== 0 ? layer(C.cyan, -g, true) : null}
				</div>
				<div style={{width: 860, textAlign: 'center'}}>
					<Words text="e um único número está dividindo a comunidade." delay={59} size={60} every={9} />
				</div>
			</AbsoluteFill>
		</Shake>
	);
};

// ── 2. DATA ──────────────────────────────────────────────────
const DateScene: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Stack top={470}>
			<Words text="GTA VI chega em" size={58} color={C.dim} />
			<Panel accent={C.cyan} delay={6}>
				<div style={{display: 'flex', alignItems: 'baseline', gap: 30}}>
					<div style={{fontFamily: display, fontSize: 300, color: C.white, lineHeight: 0.9}}>
						{Math.round(interpolate(frame, [8, 53], [1, 19], clamp))}
					</div>
					<div style={{fontFamily: display, fontSize: 150, color: C.cyan, lineHeight: 0.9}}>NOV</div>
				</div>
				<div style={{fontFamily: mono, fontSize: 40, color: C.dim, marginTop: 20, letterSpacing: 4}}>
					2026 · PS5 · XBOX SERIES X|S
				</div>
			</Panel>
			<Tag status="CONFIRMADO" delay={60} source="ROCKSTAR NEWSWIRE" />
			<div style={{marginTop: 20}}>
				<Words text="Mas o post do pre-load trouxe um detalhe técnico…" delay={102} size={52} every={8} />
			</div>
		</Stack>
	);
};

// ── 3. REVELAÇÃO: 30 FPS ─────────────────────────────────────
const FpsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const n = Math.round(interpolate(frame, [0, 13], [60, 30], {...clamp, easing: (t) => t * t}));
	// Freeze dramático + zoom para o momento cômico (frame 120 em diante).
	const joke = frame >= 247;
	const zoom = joke ? interpolate(frame, [247, 255], [1, 1.18], clamp) : 1;
	const sat = joke ? 0.25 : 1;
	const pop = useIn(247, 10);
	return (
		<>
			<Shake at={13} strength={34}>
				<AbsoluteFill style={{transform: `scale(${zoom})`, filter: `saturate(${sat})`}}>
					<Stack top={380} gap={30}>
						<div style={{fontFamily: mono, fontSize: 36, color: C.pink, letterSpacing: 6}}>META DE DESEMPENHO</div>
						<div style={{display: 'flex', alignItems: 'baseline', gap: 24}}>
							<div
								style={{
									fontFamily: display,
									fontSize: 420,
									lineHeight: 0.85,
									color: n === 30 ? C.white : C.dim,
									textShadow: n === 30 ? `0 0 70px ${C.pink}` : undefined,
								}}
							>
								{n}
							</div>
							<div style={{fontFamily: display, fontSize: 160, color: C.pink}}>FPS</div>
						</div>
						<Words text="no PS5, no PS5 Pro e no Xbox Series X|S. Nenhum modo desempenho anunciado." delay={77} size={50} every={11} />
						<Tag status="CONFIRMADO" delay={225} source="ROCKSTAR · POST DO PRE-LOAD (10/11)" />
					</Stack>
				</AbsoluteFill>
			</Shake>
			{joke ? (
				<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 300}}>
					<div
						style={{
							background: C.white,
							color: C.bg,
							fontFamily: body,
							fontWeight: 800,
							fontSize: 48,
							padding: '22px 34px',
							transform: `rotate(-3deg) scale(${pop})`,
							maxWidth: 880,
							textAlign: 'center',
							boxShadow: '12px 12px 0 ' + C.pink,
						}}
					>
						quem jurava 60 FPS: “tá, mas é uma experiência cinematográfica”
					</div>
				</AbsoluteFill>
			) : null}
			<Flash at={13} />
		</>
	);
};

// ── 4. PS5 PRO ───────────────────────────────────────────────
const Feature: React.FC<{title: string; desc: string; delay: number; accent: string}> = ({title, desc, delay, accent}) => (
	<Panel accent={accent} delay={delay}>
		<div style={{fontFamily: display, fontSize: 86, color: accent, lineHeight: 1}}>{title}</div>
		<div style={{fontFamily: body, fontWeight: 600, fontSize: 42, color: C.white, marginTop: 12}}>{desc}</div>
	</Panel>
);

const ProScene: React.FC = () => (
	<Stack top={400}>
		<MaskTitle text="E o PS5 Pro?" size={130} />
		<Words text="Mesmos 30 FPS, mas com dois extras:" delay={37} size={50} color={C.dim} />
		<Feature title="PSSR" desc="upscaling da Sony para mais nitidez" delay={88} accent={C.cyan} />
		<Feature title="SOMBRAS COM RAY TRACING" desc="exclusivas do PS5 Pro" delay={164} accent={C.pink} />
		<Tag status="CONFIRMADO" delay={200} source="ROCKSTAR" />
	</Stack>
);

// ── 5. RUMOR: 40 FPS ─────────────────────────────────────────
const RumorScene: React.FC = () => {
	const frame = useCurrentFrame();
	const stamp = useIn(205, 9);
	return (
		<Stack top={420}>
			<div style={{fontFamily: mono, fontSize: 36, color: C.amber, letterSpacing: 6}}>LINHA DE INVESTIGAÇÃO</div>
			<MaskTitle text="Um modo 40 FPS?" size={130} color={C.amber} />
			<Panel accent={C.amber} delay={30} style={{borderStyle: 'dashed'}}>
				<Words
					text="Dados minerados da PSN sugerem saída em 120 Hz — o que tornaria um modo 40 FPS possível."
					delay={35}
					size={46}
					every={8}
				/>
				<div
					style={{
						position: 'absolute',
						right: 30,
						bottom: -120,
						fontFamily: display,
						fontSize: 80,
						color: C.red,
						border: `6px solid ${C.red}`,
						padding: '0 20px',
						transform: `rotate(-8deg) scale(${interpolate(stamp, [0, 1], [2.2, 1])})`,
						opacity: stamp,
						background: 'rgba(6,6,12,0.85)',
					}}
				>
					NÃO CONFIRMADO
				</div>
			</Panel>
			<div style={{marginTop: 110, opacity: interpolate(frame, [200, 210], [0, 1], clamp)}}>
				<Tag status="RUMOR" source="DATAMINE · VIA IMPRENSA" />
			</div>
		</Stack>
	);
};

// ── 6. TAMANHO ───────────────────────────────────────────────
const SizeScene: React.FC = () => {
	const frame = useCurrentFrame();
	const fill = interpolate(frame, [6, 60], [0, 0.82], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
	const gb = Math.round(fill / 0.82 * 210);
	return (
		<Stack top={430}>
			<div style={{fontFamily: mono, fontSize: 36, color: C.cyan, letterSpacing: 6}}>DOWNLOAD NO XBOX</div>
			<div style={{fontFamily: display, fontSize: 300, color: C.white, lineHeight: 0.9}}>
				~{gb}
				<span style={{fontSize: 140, color: C.cyan}}> GB</span>
			</div>
			<div style={{height: 64, border: `3px solid ${C.cyan}`, padding: 6}}>
				<div
					style={{
						height: '100%',
						width: `${fill * 100}%`,
						background: `repeating-linear-gradient(45deg, ${C.cyan}, ${C.cyan} 18px, ${C.cyan}aa 18px, ${C.cyan}aa 36px)`,
						backgroundPosition: `${frame * 3}px 0`,
					}}
				/>
			</div>
			<Tag status="REPORTADO" delay={66} source="LISTAGEM DA LOJA XBOX · VIA IMPRENSA" />
			<div style={{marginTop: 40}}>
				<Words text="Hora de apagar aquele jogo que você jura que um dia vai zerar." delay={91} size={52} color={C.amber} every={8} />
			</div>
		</Stack>
	);
};

// ── 7. XBOX ONE NA NUVEM ─────────────────────────────────────
const CloudScene: React.FC = () => (
	<Stack top={420}>
		<MaskTitle text="Tem Xbox One?" size={140} />
		<Words text="Dá para jogar no dia 1 — via Xbox Cloud Gaming." delay={40} size={54} every={7} />
		<Panel accent={C.green} delay={104}>
			<div style={{fontFamily: mono, fontSize: 34, color: C.dim, letterSpacing: 4}}>LIBERAÇÃO NA NUVEM</div>
			<div style={{fontFamily: display, fontSize: 150, color: C.green, lineHeight: 1}}>19/11 · 03H</div>
			<div style={{fontFamily: mono, fontSize: 32, color: C.dim}}>HORÁRIO DE BRASÍLIA (1H ET)</div>
			<div style={{fontFamily: body, fontWeight: 600, fontSize: 38, color: C.white, marginTop: 16}}>
				Jogo vendido à parte · gráficos de Series S no streaming
			</div>
		</Panel>
		<Tag status="CONFIRMADO" delay={135} source="XBOX WIRE (10/11)" />
	</Stack>
);

// ── 8. RECORDE ───────────────────────────────────────────────
const RecordScene: React.FC = () => {
	const frame = useCurrentFrame();
	const sweep = interpolate(frame, [0, 30], [-120, 220], clamp);
	return (
		<Shake at={6} strength={20}>
			<Stack top={520}>
				<div style={{fontFamily: mono, fontSize: 36, color: C.amber, letterSpacing: 6}}>E PARA FECHAR</div>
				<div
					style={{
						fontFamily: display,
						fontSize: 140,
						lineHeight: 1,
						color: C.white,
						backgroundImage: `linear-gradient(100deg, ${C.white} ${sweep - 40}%, ${C.amber} ${sweep}%, ${C.white} ${sweep + 40}%)`,
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
					}}
				>
					O MAIS PRÉ-VENDIDO DA HISTÓRIA
				</div>
				<Words text="da Microsoft Store." delay={107} size={60} color={C.amber} />
				<Tag status="CONFIRMADO" delay={125} source="XBOX WIRE" />
			</Stack>
			<Flash at={6} />
		</Shake>
	);
};

// ── 9. CTA ───────────────────────────────────────────────────
// Logo do canal no encerramento. Coloque o arquivo em public/ e informe o nome aqui
// (PNG com fundo transparente funciona melhor). null = logo em texto.
const LOGO_FILE: string | null = null;

const CtaScene: React.FC = () => {
	const frame = useCurrentFrame();
	const logo = useIn(180, 12);
	return (
		<AbsoluteFill style={{padding: '420px 80px 0', display: 'flex', flexDirection: 'column', gap: 40}}>
			<Words text="30 FPS te incomoda" delay={24} size={88} every={8} />
			<Words text="ou a Rockstar compensa no resto?" delay={86} size={88} color={C.pink} every={8} />
			<Words text="Comenta aqui embaixo ↓" delay={148} size={52} color={C.dim} />
			<div style={{marginTop: 'auto', marginBottom: 330, textAlign: 'center', opacity: logo, transform: `scale(${0.8 + logo * 0.2})`}}>
				{LOGO_FILE ? (
					<Img src={staticFile(LOGO_FILE)} style={{width: 620, maxHeight: 420, objectFit: 'contain'}} />
				) : (
					<div style={{fontFamily: display, fontSize: 140, color: C.white, letterSpacing: 4}}>
						ZONE<span style={{color: C.pink}}>GTA6</span>
					</div>
				)}
				<div style={{fontFamily: mono, fontSize: 22, color: C.dim, marginTop: 30, opacity: interpolate(frame, [230, 240], [0, 1], clamp)}}>
					Fontes: Rockstar Newswire · Xbox Wire · Take-Two · imprensa especializada
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ── HUD PERSISTENTE ──────────────────────────────────────────
const Hud: React.FC = () => {
	const frame = useCurrentFrame();
	const blink = Math.floor(frame / 15) % 2 === 0;
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{position: 'absolute', top: 150, left: 80, fontFamily: display, fontSize: 52, color: C.white, letterSpacing: 2}}>
				ZONE<span style={{color: C.pink}}>GTA6</span>
			</div>
			<div style={{position: 'absolute', top: 160, right: 80, fontFamily: mono, fontSize: 30, color: C.red, letterSpacing: 3}}>
				<span style={{opacity: blink ? 1 : 0.2}}>●</span> T-6 DIAS
			</div>
			<div style={{position: 'absolute', bottom: 250, left: 80, fontFamily: mono, fontSize: 20, color: C.dim, letterSpacing: 2}}>
				IMAGENS: ROCKSTAR GAMES · GTA VI
			</div>
			<div style={{position: 'absolute', bottom: 230, left: 80, right: 80, height: 6, background: 'rgba(255,255,255,0.12)'}}>
				<div style={{height: '100%', width: `${(frame / DURATION) * 100}%`, background: `linear-gradient(90deg, ${C.cyan}, ${C.pink})`}} />
			</div>
		</AbsoluteFill>
	);
};

// Cor de destaque por bloco para o fundo.
const accentAt = (f: number) => {
	if (f < T.date[0]) return C.pink;
	if (f < T.fps[0]) return C.cyan;
	if (f < T.pro[0]) return C.pink;
	if (f < T.rumor[0]) return C.cyan;
	if (f < T.size[0]) return C.amber;
	if (f < T.cloud[0]) return C.cyan;
	if (f < T.record[0]) return C.green;
	if (f < T.cta[0]) return C.amber;
	return C.pink;
};

// ── SOUND DESIGN ─────────────────────────────────────────────
// Todos os efeitos foram sintetizados com ffmpeg (sem direitos de terceiros).
const sfx: Array<[Block, number, string, number]> = [
	['hook', 0, 'impact', 1],
	['hook', 0, 'glitch', 0.6],
	['date', 0, 'whoosh', 0.7],
	['date', 53, 'tick', 0.5],
	['date', 117, 'riser', 0.55],
	['fps', 0, 'subdrop', 1],
	['fps', 13, 'impact', 0.9],
	['fps', 247, 'glitch', 0.5],
	['pro', 0, 'whoosh', 0.7],
	['pro', 88, 'tick', 0.5],
	['pro', 164, 'tick', 0.5],
	['rumor', 0, 'whoosh', 0.6],
	['rumor', 205, 'impact', 0.6],
	['size', 0, 'whoosh', 0.7],
	['cloud', 0, 'whoosh', 0.7],
	['cloud', 104, 'tick', 0.5],
	['record', 0, 'subdrop', 0.8],
	['record', 6, 'impact', 0.7],
	['cta', 0, 'whoosh', 0.6],
	['cta', 180, 'impact', 0.7],
];

// Ducking: a música desce para 0,2 enquanto o narrador fala e sobe para 0,5 nas pausas,
// com rampas de 6 frames para não "bombear".
const DUCK = 0.2;
const OPEN = 0.5;
const RAMP = 6;
const musicVolume = (f: number) => {
	let dist = Infinity;
	for (const [a, b] of voiceActivity) {
		if (f >= a && f <= b) return DUCK;
		dist = Math.min(dist, f < a ? a - f : f - b);
	}
	return interpolate(dist, [0, RAMP], [DUCK, OPEN], clamp);
};

export const Short: React.FC<{music: string}> = ({music}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{backgroundColor: C.bg}}>
			{(Object.keys(media) as Block[]).map((k) => (
				<Slideshow key={k} files={media[k]} from={T[k][0]} dur={T[k][1] - T[k][0]} />
			))}
			<Grade accent={accentAt(frame)} />
			<Backdrop accent={accentAt(frame)} overlay />
			<S k="hook"><Hook /></S>
			<S k="date"><DateScene /></S>
			<S k="fps"><FpsScene /></S>
			<S k="pro"><ProScene /></S>
			<S k="rumor"><RumorScene /></S>
			<S k="size"><SizeScene /></S>
			<S k="cloud"><CloudScene /></S>
			<S k="record"><RecordScene /></S>
			<S k="cta"><CtaScene /></S>
			<Hud />
			{/* Trilha original escolhida por composição (ver Root.tsx), com ducking sob a voz. */}
			<Html5Audio src={staticFile(`music/${music}`)} volume={musicVolume} />
			<Sequence from={VO_START} name="narracao">
				<Html5Audio src={staticFile(VO_FILE)} volume={1} />
			</Sequence>
			{sfx.map(([k, offset, name, vol], i) => (
				<Sequence key={i} from={T[k][0] + offset} durationInFrames={90} name={`sfx-${name}`}>
					<Html5Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
