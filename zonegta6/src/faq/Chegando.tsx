import React from 'react';
import {AbsoluteFill, Html5Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Grade, Slideshow} from '../Background';
import {Backdrop, Flash, Panel, Shake, Tag, Words} from '../components';
import {C, display, mono} from '../theme';
import {BeatPulse, KineticTitle, ChannelLogo, HudBrand, Particles, Transition} from './Fx';
import timing from './timing-chegando.json';

// Vídeo 4: "GTA 6 está chegando" (roteiro do canal, narrado pelo Marcio).
// Tempos e marcas (cues) vêm de timing-chegando.json (scripts/faq_timing.py <audio> chegando).

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const CHEGANDO_DURATION = timing.duration;

type B = {id: string; from: number; to: number; q: number; a: number};
const T = Object.fromEntries(timing.blocks.map((b) => [b.id, b])) as Record<string, B>;
const cue = timing.cues;

const media: Record<string, string[]> = {
	hook: ['launch_trailer.jpg', 'vice_city_01.jpg'],
	espera: ['jason_and_lucia_05.jpg', 'port_gellhorn_02.jpg', 'vice_city_21.jpg', 'grassrivers_01.jpg'],
	cinco: ['vice_city_27.jpg'],
	data: ['pre_load.jpg', 'an_extended_look.jpg', 'vice_city_10.jpg'],
	mundo: ['vice_city_02.jpg', 'jason_and_lucia_10.jpg', 'vice_city_20.jpg', 'vice_city_13.jpg'],
	predl: ['vice_city_22.jpg', 'vice_city_17.jpg', 'mount_kalaga_national_park_01.jpg'],
	era: ['vice_city_26.jpg', 'leonida_keys_01.jpg', 'vice_city_16.jpg'],
	cta: ['jason_and_lucia_01.jpg', 'jason_and_lucia_09.jpg', 'hero.jpg', 'vice_city_01.jpg'],
};
const accent: Record<string, string> = {hook: C.red, espera: C.cyan, cinco: C.pink, data: C.cyan, mundo: C.amber, predl: C.green, era: C.pink, cta: C.cyan};

const usePop = (at: number, damping = 11) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({frame: frame - at, fps, config: {damping, mass: 0.6}});
};

// Texto gigante que "bate" na tela, com separação de cores no impacto.
const Slam: React.FC<{text: string; at: number; size: number; color?: string; rotate?: number}> = ({text, at, size, color = C.white, rotate = 0}) => {
	const frame = useCurrentFrame();
	const p = usePop(at, 10);
	if (frame < at) return null;
	return (
		<div
			style={{
				fontFamily: display,
				fontSize: size,
				lineHeight: 0.92,
				color,
				textTransform: 'uppercase',
				transform: `scale(${interpolate(p, [0, 1], [2.4, 1])}) rotate(${rotate}deg)`,
				opacity: Math.min(1, p * 2),
				filter: `blur(${interpolate(p, [0, 1], [16, 0], clamp)}px)`,
				textShadow: `0 0 60px ${color}99, ${(1 - p) * 26}px 0 ${C.pink}, ${-(1 - p) * 26}px 0 ${C.cyan}`,
			}}
		>
			{text}
		</div>
	);
};

const Stage: React.FC<{children: React.ReactNode; top?: number; gap?: number; center?: boolean}> = ({children, top = 380, gap = 28, center}) => (
	<AbsoluteFill style={{padding: `${top}px 80px 0`, display: 'flex', flexDirection: 'column', gap, alignItems: center ? 'center' : undefined, textAlign: center ? 'center' : undefined}}>
		{children}
	</AbsoluteFill>
);

const Kicker: React.FC<{color: string; children: React.ReactNode}> = ({color, children}) => (
	<div style={{fontFamily: mono, fontSize: 34, color, letterSpacing: 6}}>{children}</div>
);

// ── 1. Gancho: "GTA 6 está chegando! PARE TUDO!" ─────────────
const Hook: React.FC<{b: B}> = ({b}) => {
	const frame = useCurrentFrame();
	const a = b.a - b.from;
	const scale = interpolate(frame, [0, 6, 80], [2.2, 1, 0.94], {...clamp, easing: easeOut});
	const stop = frame >= a;
	return (
		<>
			<Shake at={a} strength={50}>
				<Shake at={0} strength={36}>
					<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 24, filter: stop ? 'saturate(0.3)' : undefined}}>
						<Kicker color={C.red}>● ALERTA</Kicker>
						<div style={{fontFamily: display, fontSize: 300, lineHeight: 0.9, color: C.white, transform: `scale(${scale})`, textShadow: `0 0 70px ${C.pink}`}}>
							GTA <span style={{color: C.pink}}>6</span>
						</div>
						<KineticTitle text="está chegando" delay={30} size={130} color={C.cyan} />
					</AbsoluteFill>
				</Shake>
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
					<div style={{background: stop ? C.red : 'transparent', padding: '10px 50px', transform: 'rotate(-6deg)', boxShadow: stop ? '0 0 120px rgba(255,77,77,0.8)' : undefined}}>
						<Slam text="PARE TUDO!" at={a} size={230} color={C.white} />
					</div>
				</AbsoluteFill>
			</Shake>
			<Flash at={0} />
			<Flash at={a} />
		</>
	);
};

// ── 2. Anos de espera: trailers, teorias, especulações ───────
const Espera: React.FC<{b: B}> = ({b}) => {
	const frame = useCurrentFrame();
	const a = b.a - b.from;
	const rows: Array<[string, number, string]> = [
		['▶ TRAILERS', cue.trailers - b.from, C.pink],
		['TEORIAS', cue.teorias - b.from, C.amber],
		['ESPECULAÇÕES', cue.espec - b.from, C.cyan],
	];
	const out = interpolate(frame, [a - 6, a], [1, 0], clamp);
	return (
		<>
			<Stage>
				<div style={{opacity: out, display: 'flex', flexDirection: 'column', gap: 26}}>
					<Kicker color={C.cyan}>DEPOIS DE TANTOS</Kicker>
					<KineticTitle text="Anos de espera" delay={b.q - b.from + 14} size={150} />
					{rows.map(([text, at, color], i) => {
						const p = spring({frame: frame - at, fps: 30, config: {damping: 11, mass: 0.6}});
						return (
							<div key={text} style={{fontFamily: display, fontSize: 132, lineHeight: 1, color, opacity: Math.min(1, p * 2), transform: `translateX(${(1 - p) * (i % 2 ? 500 : -500)}px) skewX(${(1 - p) * (i % 2 ? -20 : 20)}deg)`, textShadow: `0 0 40px ${color}88`, borderLeft: `10px solid ${color}`, paddingLeft: 24}}>
								{text}
							</div>
						);
					})}
				</div>
			</Stage>
			<Shake at={a} strength={30}>
				<Stage top={560}>
					<Slam text="Finalmente." at={a} size={190} color={C.cyan} />
					<Words text="O momento que todos os fãs de GTA estavam esperando." delay={a + 22} size={62} every={6} />
				</Stage>
			</Shake>
			<Flash at={a} />
		</>
	);
};

// ── 3. Faltam apenas 5 dias ──────────────────────────────────
const Cinco: React.FC<{b: B}> = ({b}) => {
	const frame = useCurrentFrame();
	const a = b.a - b.from;
	const n = Math.round(interpolate(frame, [0, a], [9, 5], clamp));
	const landed = frame >= a;
	const p = usePop(a, 8);
	return (
		<>
			<Shake at={a} strength={44}>
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
					{/* Raios girando atrás do número */}
					<div style={{position: 'absolute', width: 1500, height: 1500, background: `repeating-conic-gradient(${C.pink}33 0deg 6deg, transparent 6deg 18deg)`, transform: `rotate(${frame * 1.5}deg)`, maskImage: 'radial-gradient(circle, black 15%, transparent 65%)', opacity: landed ? 1 : 0.3}} />
					<Kicker color={C.white}>FALTAM APENAS</Kicker>
					<div style={{fontFamily: display, fontSize: 820, lineHeight: 0.85, color: landed ? C.white : C.dim, transform: `scale(${landed ? interpolate(p, [0, 1], [1.6, 1]) : 1})`, textShadow: landed ? `0 0 100px ${C.pink}, 0 0 200px ${C.pink}` : undefined}}>{n}</div>
					<div style={{fontFamily: display, fontSize: 220, lineHeight: 1, color: C.pink, letterSpacing: 20, opacity: landed ? 1 : 0.2}}>DIAS</div>
				</AbsoluteFill>
			</Shake>
			<Flash at={a} />
		</>
	);
};

// ── 4. 19 de novembro · PS5 e Xbox Series ────────────────────
const Data: React.FC<{b: B}> = ({b}) => {
	const frame = useCurrentFrame();
	const q = b.q - b.from;
	const a = b.a - b.from;
	const x = cue.xbox - b.from;
	const chip = (text: string, at: number, color: string) => {
		const p = spring({frame: frame - at, fps: 30, config: {damping: 10, mass: 0.6}});
		return (
			<div style={{fontFamily: display, fontSize: 84, color: C.bg, background: color, padding: '10px 30px', transform: `scale(${p}) rotate(${(1 - p) * -8}deg)`, opacity: Math.min(1, p * 2), boxShadow: `0 0 50px ${color}88`, alignSelf: 'flex-start'}}>{text}</div>
		);
	};
	return (
		<Stage top={390}>
			<Kicker color={C.cyan}>DATA DE LANÇAMENTO</Kicker>
			<Panel accent={C.cyan} delay={q}>
				<div style={{display: 'flex', alignItems: 'baseline', gap: 30}}>
					<div style={{fontFamily: display, fontSize: 330, color: C.white, lineHeight: 0.9}}>{Math.round(interpolate(frame, [q, q + 22], [1, 19], clamp))}</div>
					<div style={{fontFamily: display, fontSize: 170, color: C.cyan, lineHeight: 0.9}}>NOV</div>
				</div>
				<div style={{fontFamily: mono, fontSize: 40, color: C.dim, marginTop: 16, letterSpacing: 6}}>2026 · GRAND THEFT AUTO VI</div>
			</Panel>
			<Words text="GTA 6 finalmente chega ao" delay={q + 55} size={56} every={6} color={C.dim} />
			{chip('PLAYSTATION 5', a, C.white)}
			{chip('XBOX SERIES X|S', x, C.green)}
			<div style={{marginTop: 10}}>
				<Tag status="CONFIRMADO" delay={x + 20} source="ROCKSTAR NEWSWIRE" />
			</div>
		</Stage>
	);
};

// ── 5. Vice City, Jason e Lucia, o que a Rockstar preparou ───
const Mundo: React.FC<{b: B}> = ({b}) => {
	const frame = useCurrentFrame();
	const q = b.q - b.from;
	const cards: Array<[string, string, string, number, string]> = [
		['EXPLORAR', 'VICE CITY', 'vice_city_01.jpg', b.a - b.from - 8, C.pink],
		['A HISTÓRIA DE', 'JASON E LUCIA', 'jason_and_lucia_01.jpg', cue.jason - b.from - 4, C.cyan],
		['TUDO O QUE A', 'ROCKSTAR PREPAROU', 'jason_and_lucia_08.jpg', cue.rockstar - b.from - 4, C.amber],
	];
	return (
		<Stage top={370} gap={22}>
			<Kicker color={C.amber}>ESTAMOS TÃO PERTO</Kicker>
			<KineticTitle text="Parece até mentira" delay={q} size={112} />
			{cards.map(([small, bigText, file, at, color], i) => {
				const p = spring({frame: frame - at, fps: 30, config: {damping: 12, mass: 0.7}});
				const zoom = interpolate(frame, [at, at + 200], [1.25, 1.05], clamp);
				return (
					<div key={file} style={{position: 'relative', height: 300, overflow: 'hidden', border: `3px solid ${color}`, boxShadow: `0 0 40px ${color}66`, opacity: Math.min(1, p * 2), transform: `translateX(${(1 - p) * (i % 2 ? -700 : 700)}px) rotate(${(1 - p) * (i % 2 ? -6 : 6)}deg)`}}>
						<Img src={staticFile(`media/${file}`)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}} />
						<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(6,6,12,0.92) 0%, rgba(6,6,12,0.45) 55%, transparent 100%)'}} />
						<div style={{position: 'absolute', left: 30, bottom: 24}}>
							<div style={{fontFamily: mono, fontSize: 28, color, letterSpacing: 5}}>{small}</div>
							<div style={{fontFamily: display, fontSize: bigText.length > 14 ? 78 : 104, lineHeight: 1, color: C.white}}>{bigText}</div>
						</div>
						<div style={{position: 'absolute', right: 20, top: 14, fontFamily: display, fontSize: 70, color, opacity: 0.9}}>0{i + 1}</div>
					</div>
				);
			})}
		</Stage>
	);
};

// ── 6. Pré-download, contagem regressiva, expectativa absurda ─
const Predl: React.FC<{b: B}> = ({b}) => {
	const frame = useCurrentFrame();
	const q = b.q - b.from;
	const a = b.a - b.from;
	const ab = cue.absurda - b.from;
	const dl = interpolate(frame, [q + 4, q + 44], [0, 1], {...clamp, easing: easeOut});
	const count = usePop(a, 12);
	const hype = interpolate(frame, [a + 40, ab], [0, 1.25], {...clamp, easing: (t) => t * t});
	const over = frame >= ab;
	const hypeColor = over ? C.red : hype > 0.7 ? C.amber : C.green;
	return (
		<>
			<Shake at={ab} strength={46}>
				<Stage top={380} gap={30}>
					<Panel accent={C.green} delay={q}>
						<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
							<div style={{fontFamily: display, fontSize: 84, color: C.white}}>PRÉ-DOWNLOAD</div>
							<div style={{fontFamily: display, fontSize: 84, color: C.green}}>{Math.round(dl * 100)}%</div>
						</div>
						<div style={{height: 40, border: `3px solid ${C.green}`, padding: 5, marginTop: 12}}>
							<div style={{height: '100%', width: `${dl * 100}%`, background: C.green, boxShadow: `0 0 26px ${C.green}`}} />
						</div>
						<div style={{fontFamily: mono, fontSize: 32, color: C.green, marginTop: 14, letterSpacing: 4, opacity: dl >= 1 ? 1 : 0}}>● JÁ DISPONÍVEL</div>
					</Panel>
					<div style={{opacity: Math.min(1, count * 2), transform: `translateY(${(1 - count) * 60}px)`}}>
						<Kicker color={C.pink}>CONTAGEM REGRESSIVA</Kicker>
						<div style={{display: 'flex', gap: 14, marginTop: 14}}>
							{[5, 4, 3, 2, 1].map((d, i) => (
								<div key={d} style={{flex: 1, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontSize: 110, color: i === 0 ? C.bg : C.dim, background: i === 0 ? C.pink : 'rgba(255,255,255,0.08)', border: `2px solid ${i === 0 ? C.pink : 'rgba(255,255,255,0.2)'}`, boxShadow: i === 0 ? `0 0 ${30 + 20 * Math.sin(frame / 3)}px ${C.pink}` : undefined}}>
									{d}
								</div>
							))}
						</div>
					</div>
					<div style={{opacity: interpolate(frame, [a + 34, a + 44], [0, 1], clamp)}}>
						<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
							<Kicker color={hypeColor}>EXPECTATIVA</Kicker>
							<div style={{fontFamily: mono, fontSize: 30, color: C.dim}}>MÁX ▼</div>
						</div>
						<div style={{position: 'relative', height: 70, background: 'rgba(255,255,255,0.1)', marginTop: 12, marginRight: 150}}>
							<div style={{height: '100%', width: `${hype * 100}%`, background: `linear-gradient(90deg, ${C.green}, ${C.amber}, ${C.red})`, boxShadow: `0 0 40px ${hypeColor}`}} />
							<div style={{position: 'absolute', right: 0, top: -10, bottom: -10, width: 4, background: C.white}} />
						</div>
						<div style={{marginTop: 20}}>
							<Slam text="ABSURDA!" at={ab} size={210} color={C.red} rotate={-3} />
						</div>
					</div>
				</Stage>
			</Shake>
			<Flash at={ab} />
		</>
	);
};

// ── 7. Uma nova era de Grand Theft Auto ──────────────────────
const Era: React.FC<{b: B}> = ({b}) => {
	const frame = useCurrentFrame();
	const q = b.q - b.from;
	const a = b.a - b.from;
	const p = usePop(a, 9);
	const sweep = interpolate(frame, [a + 4, a + 40], [-30, 130], clamp);
	return (
		<>
			<Shake at={a} strength={40}>
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 20, padding: '0 70px', textAlign: 'center'}}>
					<div style={{position: 'absolute', width: 1700, height: 1700, background: `repeating-conic-gradient(${C.amber}2a 0deg 4deg, transparent 4deg 14deg)`, transform: `rotate(${frame * 0.8}deg)`, maskImage: 'radial-gradient(circle, black 10%, transparent 60%)', opacity: frame >= a ? 1 : 0}} />
					<div style={{opacity: interpolate(frame, [a - 5, a], [1, 0.0], clamp), position: 'absolute', top: 700, left: 70, right: 70}}>
						<KineticTitle text="Foram anos esperando" delay={q} size={120} />
						<div style={{marginTop: 20}}>
							<Words text="e agora estamos a poucos dias de viver" delay={q + 62} size={60} every={7} color={C.dim} />
						</div>
					</div>
					{frame >= a ? (
						<>
							<Kicker color={C.amber}>UMA</Kicker>
							<div style={{fontFamily: display, fontSize: 330, lineHeight: 0.88, transform: `scale(${interpolate(p, [0, 1], [2.6, 1])})`, backgroundImage: `linear-gradient(100deg, ${C.pink} ${sweep - 40}%, ${C.white} ${sweep}%, ${C.amber} ${sweep + 40}%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: `drop-shadow(0 0 50px ${C.pink})`}}>
								NOVA
								<br />
								ERA
							</div>
							<div style={{fontFamily: display, fontSize: 96, color: C.white, letterSpacing: 6, opacity: interpolate(frame, [a + 14, a + 24], [0, 1], clamp)}}>DE GRAND THEFT AUTO</div>
						</>
					) : null}
				</AbsoluteFill>
			</Shake>
			<Flash at={a} />
		</>
	);
};

// ── 8. E você? A espera está chegando ao fim ─────────────────
const Cta: React.FC<{b: B}> = ({b}) => {
	const frame = useCurrentFrame();
	const q = b.q - b.from;
	const a = b.a - b.from;
	const prep = cue.preparado - b.from;
	const len = b.to - b.from;
	const logoAt = len - 92;
	const logo = usePop(logoAt, 12);
	const out = interpolate(frame, [a - 6, a], [1, 0], clamp);
	return (
		<>
			<Stage top={420}>
				<div style={{opacity: out, display: 'flex', flexDirection: 'column', gap: 30}}>
					<Slam text="E você?" at={q} size={260} color={C.white} />
					<KineticTitle text="Está preparado para GTA 6?" delay={prep - 8} size={140} color={C.pink} />
					<Words text="Comenta aí embaixo!" delay={prep + 40} size={60} every={5} color={C.dim} />
				</div>
			</Stage>
			<Shake at={a} strength={34}>
				<Stage top={430} gap={10}>
					{frame >= a ? (
						<>
							<Kicker color={C.cyan}>UMA COISA É CERTA</Kicker>
							<KineticTitle text="A espera está chegando ao fim" delay={a} size={170} />
						</>
					) : null}
				</Stage>
			</Shake>
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 290, textAlign: 'center'}}>
				<ChannelLogo at={logoAt} size={500} />
				<div style={{fontFamily: mono, fontSize: 22, color: C.dim, marginTop: 20, opacity: interpolate(frame, [len - 50, len - 38], [0, 1], clamp)}}>
					Fontes: Rockstar Newswire · post do pré-load da Rockstar
				</div>
			</div>
			<Flash at={a} />
		</>
	);
};

const scenes: Record<string, React.FC<{b: B}>> = {hook: Hook, espera: Espera, cinco: Cinco, data: Data, mundo: Mundo, predl: Predl, era: Era, cta: Cta};

// ── HUD ──────────────────────────────────────────────────────
const Hud: React.FC = () => {
	const frame = useCurrentFrame();
	const blink = Math.floor(frame / 10) % 2 === 0;
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<HudBrand />
			<div style={{position: 'absolute', top: 160, right: 80, fontFamily: mono, fontSize: 30, color: C.red, letterSpacing: 3}}>
				<span style={{opacity: blink ? 1 : 0.2}}>●</span> T-5 DIAS
			</div>
			<div style={{position: 'absolute', bottom: 250, left: 80, fontFamily: mono, fontSize: 20, color: C.dim, letterSpacing: 2}}>IMAGENS: ROCKSTAR GAMES · GTA VI</div>
			<div style={{position: 'absolute', bottom: 230, left: 80, right: 80, height: 6, background: 'rgba(255,255,255,0.12)'}}>
				<div style={{height: '100%', width: `${(frame / CHEGANDO_DURATION) * 100}%`, background: `linear-gradient(90deg, ${C.cyan}, ${C.pink})`}} />
			</div>
		</AbsoluteFill>
	);
};

// ── Sound design: efeitos de public/sfx/v2, no máximo 2 usos de cada ──
type Ev = [name: string, frame: number, volume: number];
const sfxPlan = (): Ev[] => {
	const ev: Ev[] = [
		// gancho
		['stinger_intro', 0, 0.7],
		['alarm', 12, 0.3],
		['impact_e', T.hook.a, 0.75],
		['glitch_b', T.hook.a + 2, 0.35],
		// anos de espera
		['whoosh_a', T.espera.from - 6, 0.5],
		['swish_f', T.espera.q + 12, 0.4],
		['pop_a', cue.trailers, 0.5],
		['pop_b', cue.teorias, 0.5],
		['glitch_a', cue.espec, 0.45],
		['riser_a', T.espera.a - 45, 0.5],
		['impact_a', T.espera.a, 0.7],
		// 5 dias
		['whoosh_b', T.cinco.from - 6, 0.5],
		['typing', T.cinco.from, 0.4],
		['impact_b', T.cinco.a, 0.75],
		// data
		['whoosh_c', T.data.from - 6, 0.5],
		['scan', T.data.q, 0.4],
		['blip_a', T.data.a, 0.45],
		['blip_b', cue.xbox, 0.45],
		['blip_c', cue.xbox + 20, 0.35],
		// mundo
		['whoosh_d', T.mundo.from - 6, 0.5],
		['swish_f', T.mundo.q, 0.4],
		['impact_c', T.mundo.a - 8, 0.6],
		['impact_d', cue.jason - 4, 0.6],
		['impact_c', cue.rockstar - 4, 0.6],
		['cloud', cue.rockstar + 10, 0.35],
		// pré-download e expectativa
		['whoosh_e', T.predl.from - 6, 0.5],
		['download', T.predl.q + 4, 0.45],
		['success', T.predl.q + 46, 0.45],
		['clock', T.predl.a, 0.5],
		['riser_b', cue.absurda - 36, 0.5],
		['impact_a', cue.absurda, 0.75],
		['alarm', cue.absurda + 6, 0.3],
		// nova era
		['whoosh_a', T.era.from - 6, 0.5],
		['reverse_cym', T.era.a - 30, 0.5],
		['impact_e', T.era.a, 0.75],
		['power_up', T.era.a + 14, 0.35],
		// encerramento
		['whoosh_b', T.cta.from - 6, 0.5],
		['impact_d', T.cta.q, 0.6],
		['glitch_a', cue.preparado - 8, 0.4],
		['notify', cue.preparado + 40, 0.4],
		['riser_a', T.cta.a - 45, 0.5],
		['impact_b', T.cta.a, 0.7],
		['stinger_final', T.cta.to - 92, 0.75],
	];
	const count: Record<string, number> = {};
	for (const [name] of ev) {
		count[name] = (count[name] ?? 0) + 1;
		if (count[name] > 2) throw new Error(`Efeito "${name}" usado mais de 2 vezes`);
	}
	return ev;
};

const musicVolume = (f: number) => {
	let dist = Infinity;
	for (const [s, e] of timing.voiceActivity) {
		if (f >= s && f <= e) return 0.22;
		dist = Math.min(dist, f < s ? s - f : f - e);
	}
	return interpolate(dist, [0, 6], [0.22, 0.55], clamp);
};

export const Chegando: React.FC<{music: string}> = ({music}) => {
	const frame = useCurrentFrame();
	const blocks = timing.blocks as B[];
	const current = blocks.find((b) => frame >= b.from && frame < b.to) ?? blocks[blocks.length - 1];
	const acc = accent[current.id];
	// Leve "respiração" de câmera em todo o vídeo.
	const drift = 1 + 0.012 * Math.sin(frame / 37);
	return (
		<AbsoluteFill style={{backgroundColor: C.bg}}>
			{blocks.map((b) => (
				<Slideshow key={b.id} files={media[b.id]} from={b.from} dur={b.to - b.from} />
			))}
			<Grade accent={acc} />
			<Backdrop accent={acc} overlay />
			<Particles accent={acc} />
			<AbsoluteFill style={{transform: `scale(${drift})`}}>
				{blocks.map((b) => {
					const Scene = scenes[b.id];
					return (
						<Sequence key={b.id} from={b.from} durationInFrames={b.to - b.from} name={b.id}>
							<Scene b={b} />
						</Sequence>
					);
				})}
			</AbsoluteFill>
			<BeatPulse accent={acc} start={blocks[1].q} end={T.cta.q} period={(60 / 140) * 30} />
			{blocks.slice(1).map((b, i) => (
				<Transition key={b.id} at={b.from} kind={i} accent={accent[b.id]} />
			))}
			<Hud />
			<Html5Audio src={staticFile(`music/${music}`)} volume={musicVolume} />
			<Sequence from={timing.voStart} name="narracao">
				<Html5Audio src={staticFile(timing.file)} volume={1} />
			</Sequence>
			{sfxPlan().map(([name, at, vol], i) => (
				<Sequence key={i} from={Math.max(0, at)} durationInFrames={120} name={`sfx-${name}`}>
					<Html5Audio src={staticFile(`sfx/v2/${name}.wav`)} volume={vol} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
