import {AbsoluteFill, Audio, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {body, C, Captions, display, Pop, ViceBackground, Watermark} from '../brand/brand';
import {sentences as S, wordAt, words} from './timing';

// Conceito: "A ressurreição do Xbox One" — um console aposentado que volta dos mortos graças à nuvem.
// Paleta própria do episódio: céu noturno azul + verde neon. Trilha: trap original "Cloud Drip".
const FPS = 30;
const f = (s: number) => Math.round(s * FPS);
const G = '#39FF7A';
const SKY = '#071A33';
export const xboxOneCloudDuration = f(S[S.length - 1].end + 1.6);

const rel = (sentence: number, word: string, base: number) => f(wordAt(sentence, word)) - f(base);

const Sky: React.FC<{tint?: string}> = ({tint = '#0C2E57'}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: `linear-gradient(180deg, #030B18 0%, ${SKY} 45%, ${tint} 100%)`}}>
			{[...Array(40)].map((_, i) => (
				<div key={i} style={{position: 'absolute', left: (i * 263) % 1080, top: (i * 137) % 1100, width: 4, height: 4, borderRadius: 2, background: '#fff', opacity: 0.3 + 0.5 * Math.abs(Math.sin(frame / 20 + i))}} />
			))}
			{[0, 1, 2].map((i) => (
				<Cloud key={i} x={((frame * (0.6 + i * 0.3) + i * 420) % 1500) - 300} y={1150 + i * 140} scale={0.9 + i * 0.25} opacity={0.12} />
			))}
		</AbsoluteFill>
	);
};

const Cloud: React.FC<{x: number; y: number; scale?: number; opacity?: number; color?: string}> = ({x, y, scale = 1, opacity = 1, color = '#fff'}) => (
	<div style={{position: 'absolute', left: x, top: y, width: 420, height: 200, transform: `scale(${scale})`, opacity}}>
		<div style={{position: 'absolute', left: 0, top: 80, width: 420, height: 120, borderRadius: 60, background: color}} />
		<div style={{position: 'absolute', left: 70, top: 20, width: 160, height: 160, borderRadius: '50%', background: color}} />
		<div style={{position: 'absolute', left: 190, top: 0, width: 190, height: 190, borderRadius: '50%', background: color}} />
	</div>
);

// Console genérico (caixa preta horizontal) — sem logotipo da marca.
const OldConsole: React.FC<{w?: number; dusty?: number; glasses?: boolean}> = ({w = 640, dusty = 0, glasses = false}) => {
	const h = w * 0.3;
	return (
		<div style={{position: 'relative', width: w, height: h, borderRadius: 18, background: 'linear-gradient(180deg, #2B2B30, #0E0E12)', boxShadow: '0 30px 60px #000a'}}>
			<div style={{position: 'absolute', left: 0, top: 0, width: w * 0.62, height: '100%', borderRadius: '18px 0 0 18px', backgroundImage: 'repeating-linear-gradient(90deg, #1a1a1f 0 6px, #232329 6px 12px)'}} />
			<div style={{position: 'absolute', right: w * 0.08, top: h * 0.38, width: h * 0.22, height: h * 0.22, borderRadius: '50%', background: '#fff', boxShadow: `0 0 20px ${G}`}} />
			<div style={{position: 'absolute', right: w * 0.04, top: h * 0.16, width: w * 0.3, height: 6, background: '#000'}} />
			{dusty > 0 ? <div style={{position: 'absolute', inset: 0, borderRadius: 18, background: 'repeating-radial-gradient(circle at 30% 20%, #bfae9a55 0 3px, transparent 3px 14px)', opacity: dusty}} /> : null}
			{glasses ? (
				<div style={{position: 'absolute', left: w * 0.12, top: -h * 0.42, display: 'flex', gap: 20}}>
					<div style={{width: w * 0.2, height: h * 0.45, borderRadius: '0 0 40px 40px', background: '#000', border: '6px solid #222'}} />
					<div style={{width: w * 0.2, height: h * 0.45, borderRadius: '0 0 40px 40px', background: '#000', border: '6px solid #222'}} />
				</div>
			) : null}
		</div>
	);
};

const Big: React.FC<{children: React.ReactNode; color?: string; size?: number; top: number}> = ({children, color = C.white, size = 140, top}) => (
	<div style={{position: 'absolute', top, left: 40, right: 40, textAlign: 'center', fontFamily: display, fontSize: size, lineHeight: 1, color, textTransform: 'uppercase', textShadow: `0 8px 0 #000, 0 0 40px ${color}55`}}>{children}</div>
);

// ---------- CENAS ----------

const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const real = f(S[1].start);
	const zoom = interpolate(frame, [0, real], [1.25, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const stamp = spring({frame: frame - real, fps, config: {damping: 9}});
	return (
		<AbsoluteFill>
			<Sky />
			<div style={{transform: `scale(${zoom})`, position: 'absolute', inset: 0}}>
				<Big top={240} size={150}>GTA 6 no</Big>
				<Big top={400} size={190} color={G}>Xbox One?</Big>
				<div style={{position: 'absolute', left: 220, top: 760}}><OldConsole dusty={1} /></div>
				{[0, 1, 2].map((i) => (
					<div key={i} style={{position: 'absolute', left: 170 + i * 330, top: 660 - Math.abs(Math.sin(frame / 6 + i)) * 30, fontFamily: display, fontSize: 120, color: C.yellow, transform: `rotate(${(i - 1) * 18}deg)`}}>?</div>
				))}
			</div>
			{frame >= real ? (
				<div style={{position: 'absolute', top: 1000, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${interpolate(stamp, [0, 1], [3, 1])}) rotate(-8deg)`, opacity: Math.min(1, stamp * 2)}}>
					<div style={{fontFamily: display, fontSize: 130, color: G, border: `10px solid ${G}`, padding: '0 40px', borderRadius: 16, background: '#000a'}}>É REAL</div>
				</div>
			) : null}
		</AbsoluteFill>
	);
};

const Resurrection: React.FC = () => {
	const frame = useCurrentFrame();
	const base = S[2].start;
	const rise = interpolate(frame, [rel(2, 'jogadores', base), rel(2, 'poderão', base)], [500, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.3))});
	const glow = interpolate(frame, [rel(2, 'poderão', base), rel(2, 'poderão', base) + 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const prank = f(S[3].start - base);
	return (
		<AbsoluteFill>
			<Sky tint="#0F3B2A" />
			<Big top={200} size={110}>Ele voltou</Big>
			<Big top={320} size={80} color={G}>dos mortos</Big>
			{/* "gaveta" de onde o console sai */}
			<div style={{position: 'absolute', left: 140, right: 140, top: 760, height: 360, overflow: 'hidden'}}>
				<div style={{position: 'absolute', left: 80, top: 60 + rise, filter: `drop-shadow(0 0 ${40 * glow}px ${G})`}}><OldConsole w={640} dusty={1 - glow} /></div>
			</div>
			<div style={{position: 'absolute', left: 100, right: 100, top: 1100, height: 40, borderRadius: 10, background: '#5A3B22'}} />
			{[...Array(10)].map((_, i) => (
				<div key={i} style={{position: 'absolute', left: 200 + ((i * 97) % 680), top: 900 - ((frame * (2 + (i % 3)) + i * 40) % 300), width: 10, height: 10, borderRadius: 5, background: G, opacity: glow * 0.8}} />
			))}
			{frame >= prank ? (
				<Pop at={prank} style={{position: 'absolute', top: 470, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
					<div style={{position: 'relative', fontFamily: display, fontSize: 120, color: C.white}}>
						PEGADINHA?
						<div style={{position: 'absolute', left: -20, right: -20, top: '50%', height: 18, background: C.red, transform: 'rotate(-8deg)'}} />
					</div>
				</Pop>
			) : null}
		</AbsoluteFill>
	);
};

const Explain: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill>
			<Sky />
			<Big top={300} size={150}>Como</Big>
			<Big top={460} size={150} color={G}>funciona?</Big>
			<div style={{position: 'absolute', top: 780, left: 0, right: 0, textAlign: 'center', fontFamily: display, fontSize: 200, color: C.yellow, transform: `translateY(${Math.abs(Math.sin(frame / 5)) * 40}px)`}}>↓</div>
		</AbsoluteFill>
	);
};

const CloudDiagram: React.FC = () => {
	const frame = useCurrentFrame();
	const base = S[5].start;
	const cg = rel(5, 'cloud', base);
	const day = rel(5, '19', base);
	const tv = f(S[6].start - base);
	const vice = rel(6, 'vice', base);
	const jl = rel(6, 'jason', base);
	return (
		<AbsoluteFill>
			<Sky />
			<Pop at={0} style={{position: 'absolute', top: 190, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
				<div style={{fontFamily: body, fontWeight: 900, fontSize: 44, color: '#000', background: G, padding: '10px 28px', borderRadius: 14}}>MICROSOFT CONFIRMOU</div>
			</Pop>
			{frame >= cg ? (
				<Pop at={cg} style={{position: 'absolute', top: 270, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
					<div style={{position: 'relative', width: 420, height: 220}}>
						<Cloud x={0} y={0} color="#E9F3FF" />
						<div style={{position: 'absolute', left: 0, right: 0, top: 100, textAlign: 'center', fontFamily: display, fontSize: 52, color: SKY}}>CLOUD GAMING</div>
					</div>
				</Pop>
			) : null}
			{/* ondas de transmissão */}
			{frame >= cg + 10 ? [0, 1, 2, 3].map((i) => {
				const p = ((frame - cg + i * 8) % 32) / 32;
				return <div key={i} style={{position: 'absolute', left: 525, top: 520 + p * 170, width: 30, height: 30, borderRadius: '50%', background: G, opacity: 1 - p}} />;
			}) : null}
			{/* TV + console */}
			<div style={{position: 'absolute', left: 140, top: 720, width: 800, height: 450, borderRadius: 20, border: '16px solid #111', background: '#000', overflow: 'hidden'}}>
				{frame >= vice ? (
					<div style={{position: 'absolute', inset: 0, transform: 'scale(0.42)', transformOrigin: 'top left', width: 1080 * 1.8, height: 1920}}>
						<div style={{width: 1080 * 1.8, height: 1920, position: 'relative'}}><ViceBackground /></div>
					</div>
				) : (
					<div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, #222 0 3px, #333 3px 6px)', opacity: frame >= tv ? 0.9 : 0.4}} />
				)}
				{frame >= vice ? <div style={{position: 'absolute', top: 60, left: 0, right: 0, textAlign: 'center', fontFamily: display, fontSize: 110, color: C.white, textShadow: `0 0 30px ${C.pink}`}}>VICE CITY</div> : null}
				{frame >= jl ? <Pop at={jl} style={{position: 'absolute', top: 220, left: 0, right: 0, textAlign: 'center', fontFamily: display, fontSize: 70, color: C.yellow}}>JASON & LUCIA</Pop> : null}
			</div>
			<div style={{position: 'absolute', left: 270, top: 1180}}><OldConsole w={540} /></div>
			{frame >= day ? (
				<Pop at={day} style={{position: 'absolute', top: 560, right: 60}}>
					<div style={{background: '#fff', borderRadius: 18, overflow: 'hidden', width: 200, textAlign: 'center', transform: 'rotate(6deg)', boxShadow: '0 10px 30px #0008'}}>
						<div style={{background: C.red, color: '#fff', fontFamily: body, fontWeight: 900, fontSize: 30, padding: 6}}>NOV</div>
						<div style={{fontFamily: display, fontSize: 110, color: '#111', lineHeight: 1.1}}>19</div>
					</div>
				</Pop>
			) : null}
		</AbsoluteFill>
	);
};

const Calma: React.FC = () => {
	const frame = useCurrentFrame();
	const base = S[7].start;
	const detail = f(S[8].start - base);
	return (
		<AbsoluteFill style={{background: '#000'}}>
			{frame < detail ? (
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
					<Pop><div style={{width: 520, height: 520, background: C.red, clipPath: 'polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontSize: 150, color: '#fff', marginTop: -300}}>CALMA</div></Pop>
				</AbsoluteFill>
			) : (
				<AbsoluteFill>
					<Big top={380} size={130} color={C.yellow}>Letras</Big>
					<Big top={520} size={130} color={C.yellow}>miúdas*</Big>
					<div style={{position: 'absolute', top: 760, left: 380, width: 300, height: 300, borderRadius: '50%', border: '24px solid #ddd', transform: `translateX(${Math.sin(frame / 8) * 60}px)`, background: '#ffffff11'}} />
					<div style={{position: 'absolute', top: 1030, left: 620, width: 50, height: 240, background: '#8B5A2B', borderRadius: 20, transform: `translateX(${Math.sin(frame / 8) * 60}px) rotate(-40deg)`, transformOrigin: 'top'}} />
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};

const NotNative: React.FC = () => {
	const frame = useCurrentFrame();
	const base = S[9].start;
	const cross = rel(9, 'nativa', base);
	const stream = f(S[10].start - base);
	const p = interpolate(frame, [cross, cross + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill>
			<Sky tint="#2A0F1F" />
			{frame < stream ? (
				<>
					<Big top={230} size={110}>Versão nativa</Big>
					<Big top={350} size={110} color={C.red}>pro Xbox One</Big>
					<div style={{position: 'absolute', left: 290, top: 600, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #ddd 0 12%, #9ab 13% 60%, #789 61%)', boxShadow: '0 20px 50px #000a'}} />
					<div style={{position: 'absolute', left: 240, top: 820, width: 600 * p, height: 50, background: C.red, transform: 'rotate(45deg)', transformOrigin: 'left center', marginLeft: 50, marginTop: -200}} />
					<div style={{position: 'absolute', left: 240, top: 1050, width: 600 * p, height: 50, background: C.red, transform: 'rotate(-45deg)', transformOrigin: 'left center', marginLeft: 50, marginTop: -30}} />
					{frame >= cross ? <Pop at={cross} style={{position: 'absolute', top: 1150, left: 0, right: 0, textAlign: 'center', fontFamily: display, fontSize: 120, color: C.red}}>NÃO TEM</Pop> : null}
				</>
			) : (
				<>
					<Big top={200} size={110}>Roda na nuvem</Big>
					<div style={{position: 'absolute', top: 340, left: 0, right: 0, textAlign: 'center', fontFamily: body, fontWeight: 800, fontSize: 44, color: G}}>o Xbox One só recebe a imagem</div>
					<Cloud x={330} y={460} color="#E9F3FF" />
					{/* servidor dentro da nuvem */}
					<div style={{position: 'absolute', left: 470, top: 540, width: 140, height: 110, borderRadius: 10, background: '#111', display: 'flex', flexDirection: 'column', gap: 10, padding: 14}}>
						{[0, 1, 2].map((i) => <div key={i} style={{height: 18, borderRadius: 4, background: (frame + i * 5) % 20 < 10 ? G : '#1d4'}} />)}
					</div>
					{[0, 1, 2, 3, 4].map((i) => {
						const q = ((frame + i * 7) % 35) / 35;
						return <div key={i} style={{position: 'absolute', left: 525, top: 700 + q * 330, width: 30, height: 30, background: G, borderRadius: 6, opacity: 1 - q, transform: 'rotate(45deg)'}} />;
					})}
					<div style={{position: 'absolute', left: 220, top: 1060}}><OldConsole /></div>
				</>
			)}
		</AbsoluteFill>
	);
};

const Checklist: React.FC = () => {
	const frame = useCurrentFrame();
	const base = S[11].start;
	const items = [
		{t: rel(12, 'região', base), label: 'Disponível na sua região'},
		{t: rel(12, 'serviço', base), label: 'Acesso ao jogo em nuvem'},
		{t: rel(12, 'comprar', base), label: 'Comprar o jogo à parte'},
	];
	return (
		<AbsoluteFill>
			<Sky />
			<Pop><Big top={200} size={160} color={C.yellow}>Tem mais!</Big></Pop>
			<div style={{position: 'absolute', top: 470, left: 80, right: 80, display: 'flex', flexDirection: 'column', gap: 34}}>
				{items.map((it) => frame >= it.t ? (
					<Pop key={it.label} at={it.t}>
						<div style={{display: 'flex', alignItems: 'center', gap: 28, background: '#0B1B33EE', border: `4px solid ${G}`, borderRadius: 24, padding: '28px 30px'}}>
							<div style={{width: 70, height: 70, borderRadius: 14, background: G, position: 'relative', flexShrink: 0}}>
								<div style={{position: 'absolute', left: 22, top: 8, width: 22, height: 42, borderRight: '10px solid #000', borderBottom: '10px solid #000', transform: 'rotate(45deg)'}} />
							</div>
							<div style={{fontFamily: body, fontWeight: 900, fontSize: 50, color: '#fff', lineHeight: 1.1}}>{it.label}</div>
						</div>
					</Pop>
				) : null)}
			</div>
		</AbsoluteFill>
	);
};

const Survivor: React.FC = () => {
	const frame = useCurrentFrame();
	const base = S[13].start;
	const year = Math.round(interpolate(frame, [rel(13, 'tantos', base), rel(13, 'descobrir', base)], [2013, 2026], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
	const cool = rel(13, 'console', base);
	return (
		<AbsoluteFill>
			<Sky tint="#26214F" />
			<div style={{position: 'absolute', top: 220, left: 0, right: 0, textAlign: 'center', fontFamily: display, fontSize: 260, color: year === 2026 ? G : C.white, textShadow: '0 10px 0 #000'}}>{year}</div>
			<div style={{position: 'absolute', top: 560, left: 0, right: 0, textAlign: 'center', fontFamily: body, fontWeight: 800, fontSize: 46, color: '#ffffffaa'}}>Xbox One: lançado em 2013</div>
			<div style={{position: 'absolute', left: 220, top: 820, transform: `rotate(${frame >= cool ? -4 : 0}deg)`}}><OldConsole glasses={frame >= cool} /></div>
			{frame >= cool ? (
				<Pop at={cool} style={{position: 'absolute', top: 1080, left: 0, right: 0, textAlign: 'center'}}>
					<div style={{fontFamily: display, fontSize: 110, color: C.yellow}}>EU SOBREVIVI</div>
				</Pop>
			) : null}
		</AbsoluteFill>
	);
};

const Poll: React.FC = () => {
	const frame = useCurrentFrame();
	const base = S[14].start;
	const a = rel(14, 'ainda', base), b = rel(14, 'migrou', base);
	const follow = f(S[15].start - base);
	const Option: React.FC<{label: string; at: number; color: string}> = ({label, at, color}) => frame >= at ? (
		<Pop at={at}>
			<div style={{border: `5px solid ${color}`, borderRadius: 26, padding: '30px 34px', background: '#0B1B33EE', fontFamily: body, fontWeight: 900, fontSize: 54, color: '#fff'}}>{label}</div>
		</Pop>
	) : null;
	return (
		<AbsoluteFill>
			<Sky />
			{frame < follow ? (
				<>
					<Big top={230} size={120}>Me conta</Big>
					<div style={{position: 'absolute', top: 480, left: 90, right: 90, display: 'flex', flexDirection: 'column', gap: 40}}>
						<Option label="Ainda tenho Xbox One" at={a} color={G} />
						<Option label="Já migrei de geração" at={b} color={C.pink} />
					</div>
					<div style={{position: 'absolute', top: 960, left: 0, right: 0, textAlign: 'center', fontFamily: body, fontWeight: 800, fontSize: 46, color: C.yellow}}>responde nos comentários</div>
				</>
			) : (
				<Pop at={follow} style={{position: 'absolute', top: 420, left: 0, right: 0, textAlign: 'center'}}>
					<div style={{fontFamily: display, fontSize: 110, color: '#fff'}}>SEGUE A</div>
					<div style={{fontFamily: display, fontSize: 190, color: '#fff', textShadow: `0 0 50px ${C.pink}`}}>ZONE<span style={{color: C.pink}}>GTA6</span></div>
					<div style={{marginTop: 30, display: 'inline-block', fontFamily: body, fontWeight: 900, fontSize: 56, color: '#000', background: G, padding: '16px 44px', borderRadius: 50, transform: `scale(${1 + Math.max(0, Math.sin(frame / 4)) * 0.06})`}}>SEGUIR</div>
				</Pop>
			)}
		</AbsoluteFill>
	);
};

// ---------- MONTAGEM ----------

const END = S[S.length - 1].end + 1.6;
const scenes: {from: number; to: number; C: React.FC}[] = [
	{from: 0, to: S[2].start, C: Hook},
	{from: S[2].start, to: S[4].start, C: Resurrection},
	{from: S[4].start, to: S[5].start, C: Explain},
	{from: S[5].start, to: S[7].start, C: CloudDiagram},
	{from: S[7].start, to: S[9].start, C: Calma},
	{from: S[9].start, to: S[11].start, C: NotNative},
	{from: S[11].start, to: S[13].start, C: Checklist},
	{from: S[13].start, to: S[14].start, C: Survivor},
	{from: S[14].start, to: END, C: Poll},
];

const sfx: {at: number; src: string; vol: number; max?: number}[] = [
	{at: 0.0, src: 'record-scratch', vol: 0.45},
	{at: S[1].start, src: 'vine-boom', vol: 0.6},
	{at: wordAt(2, 'poderão'), src: 'anime-wow', vol: 0.4, max: 2.2},
	{at: wordAt(3, 'brincadeira'), src: 'bruh', vol: 0.55},
	{at: S[4].start - 0.1, src: 'whoosh', vol: 0.7},
	{at: S[5].start - 0.1, src: 'whoosh', vol: 0.7},
	{at: wordAt(5, '19'), src: 'ding', vol: 0.35},
	{at: wordAt(6, 'vice'), src: 'shutter-modern', vol: 0.5},
	{at: S[7].start - 0.05, src: 'record-scratch', vol: 0.6},
	{at: S[8].start, src: 'illuminati-confirmed', vol: 0.25, max: 2.3},
	{at: wordAt(9, 'nativa'), src: 'windows-xp-error', vol: 0.5},
	{at: S[10].start - 0.1, src: 'whoosh', vol: 0.7},
	{at: S[11].start, src: 'vine-boom', vol: 0.5},
	{at: wordAt(12, 'região'), src: 'snapchat-notification', vol: 0.6},
	{at: wordAt(12, 'serviço'), src: 'snapchat-notification', vol: 0.6},
	{at: wordAt(12, 'comprar'), src: 'snapchat-notification', vol: 0.6},
	{at: S[13].start - 0.1, src: 'whoosh', vol: 0.7},
	{at: wordAt(13, 'console'), src: 'yippee', vol: 0.4, max: 1.8},
	{at: S[14].start - 0.1, src: 'whoosh', vol: 0.7},
	{at: S[15].start, src: 'ding', vol: 0.4},
];

export const XboxOneCloud: React.FC<{narrationSrc: string | null}> = ({narrationSrc}) => {
	const calmA = f(S[7].start), calmB = f(S[9].start);
	return (
		<AbsoluteFill style={{background: SKY}}>
			{scenes.map(({from, to, C: Scene}, i) => (
				<Sequence key={i} from={f(from)} durationInFrames={Math.max(1, f(to) - f(from))}>
					<Scene />
				</Sequence>
			))}
			<Captions words={words} accent={G} hlColor={C.yellow} />
			<Watermark />
			<Audio
				src={staticFile('music/cloud-drip.wav')}
				volume={(fr) => {
					// silêncio no "Mas calma! Existe um detalhe..." e volta no impacto
					if (fr >= calmA && fr < calmB) return interpolate(fr, [calmA, calmA + 4], [0.16, 0], {extrapolateRight: 'clamp'});
					return interpolate(fr, [0, 12], [0, 0.16], {extrapolateRight: 'clamp'});
				}}
			/>
			{sfx.map((s, i) => (
				<Sequence key={`sfx${i}`} from={f(Math.max(0, s.at))} durationInFrames={s.max ? f(s.max) : undefined}>
					<Audio src={staticFile(`sfx/${s.src}.wav`)} volume={(fr) => (s.max ? s.vol * interpolate(fr, [f(s.max) - 8, f(s.max)], [1, 0], {extrapolateLeft: 'clamp'}) : s.vol)} />
				</Sequence>
			))}
			{narrationSrc ? <Audio src={staticFile(narrationSrc)} /> : null}
		</AbsoluteFill>
	);
};
