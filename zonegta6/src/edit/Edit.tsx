import React from 'react';
import {AbsoluteFill, Html5Audio, Img, interpolate, OffthreadVideo, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ChannelLogo, HudBrand, KineticTitle, Particles} from '../faq/Fx';
import {City3D, Extruded, Scene3D} from '../faq/Fx3d';
import {C, display, mono} from '../theme';

// Vídeo 5: edit de contagem regressiva, sem narração. A edição é a protagonista e
// segue a batida da trilha (100 BPM: 1 tempo = 18 frames, 1 compasso = 72 frames).
// Trilha original em estilo phonk lento (scripts/music_phonk.py), em volume baixo.

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const BEAT = 18;
const BAR = 72;
const DAYS = 4; // dias até 19/11 na data de publicação (15/11). Ajuste se postar outro dia.

const INTRO = 0;
const DROP = 2 * BAR; // 144
const BREAK = 10 * BAR; // 720
const OUTRO = 12 * BAR; // 864
export const EDIT_DURATION = 15 * BAR; // 1080 frames = 36 s

// ── Fatos do drop: um por compasso (todos confirmados pela Rockstar) ──
type Fact = {kicker: string; lines: string[]; color: string; shots: Array<[string, number]>};
const facts: Fact[] = [
	{kicker: 'LANÇAMENTO', lines: ['19', 'NOVEMBRO'], color: C.pink, shots: [['jason_and_lucia_17.jpg', 36], ['jason_and_lucia_19.jpg', 36]]},
	{kicker: 'PLATAFORMAS', lines: ['PS5', 'XBOX SERIES'], color: C.cyan, shots: [['jason_duval_05.jpg', 18], ['lucia_caminos_07.jpg', 18], ['jason_duval_07.jpg', 36]]},
	{kicker: 'A CIDADE', lines: ['VICE', 'CITY'], color: C.amber, shots: [['jason_duval_04.jpg', 36], ['lucia_caminos_02.jpg', 36]]},
	{kicker: 'O ESTADO', lines: ['LEONIDA'], color: C.green, shots: [['grassrivers_05.jpg', 18], ['leonida_keys_07.jpg', 18], ['port_gellhorn_06.jpg', 36]]},
	{kicker: 'PROTAGONISTA', lines: ['JASON'], color: C.cyan, shots: [['jason_duval_01.jpg', 36], ['jason_duval_09.jpg', 36]]},
	{kicker: 'PROTAGONISTA', lines: ['LUCIA'], color: C.pink, shots: [['lucia_caminos_01.jpg', 18], ['lucia_caminos_03.jpg', 18], ['lucia_caminos_08.jpg', 36]]},
	{kicker: 'JÁ LIBERADO', lines: ['PRÉ-', 'DOWNLOAD'], color: C.green, shots: [['jason_duval_08.jpg', 36], ['jason_duval_10.jpg', 36]]},
	{kicker: 'LIBERAÇÃO · HORÁRIO LOCAL', lines: ['MEIA-', 'NOITE'], color: C.amber, shots: [['port_gellhorn_04.jpg', 18], ['vice_city_07.jpg', 18], ['jason_and_lucia_14.jpg', 36]]},
];

// Linha do tempo de planos de fundo (mídia inédita: ver scripts/check_media.py).
type ShotDef = {file: string; from: number; dur: number; index: number};
const shots: ShotDef[] = (() => {
	const list: Array<[string, number, number]> = [
		['ambrosia_04.jpg', INTRO, BAR],
		['ambrosia_02.jpg', INTRO + BAR, BAR],
	];
	facts.forEach((f, i) => {
		let at = DROP + i * BAR;
		for (const [file, dur] of f.shots) {
			list.push([file, at, dur]);
			at += dur;
		}
	});
	list.push(['lucia_caminos_04.jpg', BREAK, BAR], ['v/cal.mp4', BREAK + BAR, BAR]);
	list.push(['grassrivers_07.jpg', OUTRO, 2 * BAR], ['ambrosia_06.jpg', OUTRO + 2 * BAR, BAR]);
	return list.map(([file, from, dur], index) => ({file, from, dur, index}));
})();

// Plano de fundo com "soco" de zoom na entrada (sensação de speed ramp) e deriva lenta.
const Shot: React.FC<{s: ShotDef}> = ({s}) => {
	const f = useCurrentFrame();
	const punch = 0.24 * Math.exp(-f / 3.5);
	const drift = 0.0009 * f;
	const dir = s.index % 2 === 0 ? 1 : -1;
	const style: React.CSSProperties = {
		width: '100%',
		height: '100%',
		objectFit: 'cover',
		transform: `scale(${1.1 + punch + drift}) translateX(${dir * (3 - f * 0.05)}%) rotate(${dir * punch * 6}deg)`,
		filter: `blur(${punch * 30}px) saturate(1.15) contrast(1.05)`,
	};
	return /\.mp4$/.test(s.file) ? <OffthreadVideo src={staticFile(`media/${s.file}`)} muted style={style} /> : <Img src={staticFile(`media/${s.file}`)} style={style} />;
};

// Palavras 3D com volume, entrando de lado e balançando.
const Words3D: React.FC<{lines: string[]; color: string; at: number; flip: boolean}> = ({lines, color, at, flip}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = spring({frame: frame - at, fps, config: {damping: 10, mass: 0.6}});
	const sizes = lines.map((l) => Math.min(380, 880 / (0.5 * l.length)));
	const total = sizes.reduce((a, b) => a + b * 0.95, 0);
	const dir = flip ? -1 : 1;
	let y = -total / 2;
	return (
		<Scene3D width={1080} height={1000} perspective={1200} rotateX={-6} rotateY={dir * (interpolate(p, [0, 1], [85, 12]) + Math.sin((frame - at) / 10) * 5)}>
			{lines.map((l, i) => {
				const size = sizes[i];
				const cy = y + (size * 0.95) / 2;
				y += size * 0.95;
				return (
					<div key={l} style={{transformStyle: 'preserve-3d', position: 'absolute', transform: `translate3d(0, ${cy}px, 0) scale(${interpolate(p, [0, 1], [1.8, 1])})`}}>
						<Extruded text={l} size={size} depth={22} color={i === 0 ? C.white : color} sideColor="#3b0a26" glow={color} />
					</div>
				);
			})}
		</Scene3D>
	);
};

const Kicker: React.FC<{color: string; at: number; children: React.ReactNode}> = ({color, at, children}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [at, at + 5], [0, 1], clamp);
	return (
		<div style={{fontFamily: mono, fontWeight: 700, fontSize: 36, letterSpacing: 6, color: C.bg, background: color, padding: '8px 22px', opacity: o, transform: `translateY(${(1 - o) * -30}px)`, boxShadow: `0 0 30px ${color}`}}>
			{children}
		</div>
	);
};

// ── Intro: FALTAM [n] DIAS ───────────────────────────────────
const Intro: React.FC = () => {
	const frame = useCurrentFrame();
	const lock = BAR; // o número trava no início do 2º compasso
	const {fps} = useVideoConfig();
	const p = spring({frame: frame - lock, fps, config: {damping: 9, mass: 0.6}});
	const landed = frame >= lock;
	const n = landed ? DAYS : Math.max(DAYS, 9 - Math.floor(frame / 9));
	const rotY = landed ? interpolate(p, [0, 1], [-90, 0]) + Math.sin((frame - lock) / 12) * 14 : frame * 11;
	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
			<div style={{position: 'absolute', width: 1500, height: 1500, background: `repeating-conic-gradient(${C.pink}33 0deg 6deg, transparent 6deg 18deg)`, transform: `rotate(${frame * 1.5}deg)`, maskImage: 'radial-gradient(circle, black 15%, transparent 65%)', opacity: landed ? 1 : 0.35}} />
			<Kicker color={C.white} at={4}>GTA 6 · FALTAM</Kicker>
			<Scene3D width={1080} height={780} perspective={1200} rotateX={-10} rotateY={rotY}>
				<Extruded text={String(n)} size={840} depth={34} color={landed ? C.white : C.dim} sideColor={landed ? '#b3185f' : '#3a3a48'} glow={landed ? C.pink : undefined} />
			</Scene3D>
			<div style={{fontFamily: display, fontSize: 230, lineHeight: 1, color: C.pink, letterSpacing: 20, opacity: landed ? 1 : 0.15, transform: `scale(${landed ? interpolate(p, [0, 1], [1.5, 1]) : 1})`}}>DIAS</div>
		</AbsoluteFill>
	);
};

// ── Quebra: VOCÊ ESTÁ PRONTO? ────────────────────────────────
const Break: React.FC = () => {
	const frame = useCurrentFrame();
	const zoom = 1 + frame * 0.0012;
	return (
		<AbsoluteFill style={{justifyContent: 'center', padding: '0 80px', transform: `scale(${zoom})`}}>
			<KineticTitle text="Você está" delay={4} size={190} />
			<KineticTitle text="pronto?" delay={BEAT * 2} size={250} color={C.pink} />
			<div style={{fontFamily: mono, fontSize: 40, color: C.cyan, letterSpacing: 6, marginTop: 30, opacity: interpolate(frame, [BAR, BAR + 10], [0, 1], clamp)}}>
				COMENTA: SIM OU NÃO
			</div>
		</AbsoluteFill>
	);
};

// ── Final: data em 3D dentro da cidade de neon + logo ────────
const Outro: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = spring({frame, fps, config: {damping: 9, mass: 0.7}});
	const logoAt = 2 * BAR + 4;
	const city = frame < logoAt + 6;
	const line = (text: string, y: number, size: number, color: string) => (
		<div style={{transformStyle: 'preserve-3d', position: 'absolute', transform: `translate3d(0, ${y}px, 60px) scale(${interpolate(p, [0, 1], [2.6, 1])})`}}>
			<Extruded text={text} size={size} depth={30} color={color} sideColor="#5a0c30" glow={C.pink} />
		</div>
	);
	return (
		<>
			{city ? (
				<AbsoluteFill>
					<Scene3D width={1080} height={1920} perspective={850} rotateX={-5} rotateY={Math.sin(frame / 40) * 10}>
						<City3D frame={frame + 200} ground={520} />
						{line('19.11', -220, 350, C.white)}
						{line('2026', 90, 330, C.pink)}
					</Scene3D>
				</AbsoluteFill>
			) : null}
			<AbsoluteFill style={{alignItems: 'center', paddingTop: 330}}>
				{frame < logoAt ? <Kicker color={C.cyan} at={BEAT}>GTA 6 CHEGA EM</Kicker> : null}
			</AbsoluteFill>
			{frame >= logoAt ? (
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 50}}>
					<ChannelLogo at={logoAt} size={640} />
					<div style={{fontFamily: display, fontSize: 96, color: C.white, letterSpacing: 4, opacity: interpolate(frame, [logoAt + 14, logoAt + 24], [0, 1], clamp), textShadow: `0 0 40px ${C.pink}`}}>
						SE INSCREVE NO CANAL
					</div>
				</AbsoluteFill>
			) : null}
		</>
	);
};

// ── Sound design: efeitos de public/sfx/v2, no máximo 2 usos de cada ──
type Ev = [name: string, frame: number, volume: number];
const sfxPlan = (): Ev[] => {
	const ev: Ev[] = [
		['stinger_intro', 0, 0.7],
		['alarm', BEAT * 2, 0.3],
		['impact_d', BAR, 0.6],
		['riser_a', DROP - 45, 0.5],
	];
	const impact = ['impact_a', 'impact_b', 'impact_c', 'impact_e', 'impact_a', 'impact_b', 'impact_c', 'impact_e'];
	const whoosh = ['whoosh_a', 'whoosh_b', 'whoosh_c', 'whoosh_d', 'whoosh_e', 'whoosh_a', 'whoosh_b', 'whoosh_c'];
	const cuts = ['swish_f', 'glitch_a', 'pop_a', 'click_a', 'pop_b', 'glitch_b', 'swish_f', 'glitch_a', 'pop_a', 'pop_b', 'blip_a', 'blip_b'];
	const themed: Array<[string, number] | null> = [['scan', 2], ['power_up', 2], ['cloud', 4], ['success', 4], ['typing', 4], ['notify', 4], ['download', 4], ['clock', 0]];
	let c = 0;
	facts.forEach((f, i) => {
		const s = DROP + i * BAR;
		ev.push([whoosh[i], s - 5, 0.5], [impact[i], s, 0.7]);
		let at = s;
		f.shots.slice(0, -1).forEach(([, dur]) => {
			at += dur;
			ev.push([cuts[c++], at - 1, 0.45]);
		});
		const th = themed[i];
		if (th) ev.push([th[0], s + th[1], 0.4]);
	});
	ev.push(
		['whoosh_d', BREAK - 5, 0.5],
		['power_down', BREAK, 0.5],
		['blip_c', BREAK + BEAT * 2, 0.4],
		['reverse_cym', BREAK + BAR + 6, 0.4],
		['riser_b', OUTRO - 36, 0.5],
		['whoosh_e', OUTRO - 5, 0.5],
		['impact_d', OUTRO, 0.75],
		['check_a', OUTRO + BEAT * 2, 0.4],
		['riser_a', OUTRO + 2 * BAR + 4 - 45, 0.45],
		['stinger_final', OUTRO + 2 * BAR + 4, 0.75],
		['tally', OUTRO + 2 * BAR + 20, 0.35],
	);
	const count: Record<string, number> = {};
	for (const [name] of ev) {
		count[name] = (count[name] ?? 0) + 1;
		if (count[name] > 2) throw new Error(`Efeito "${name}" usado mais de 2 vezes`);
	}
	return ev;
};

export const Edit: React.FC<{music: string | null}> = ({music}) => {
	const frame = useCurrentFrame();
	const inDrop = frame >= DROP && frame < BREAK;
	const inBreak = frame >= BREAK && frame < OUTRO;
	const factIndex = inDrop ? Math.floor((frame - DROP) / BAR) : -1;
	const fact = factIndex >= 0 ? facts[factIndex] : null;
	const acc = fact ? fact.color : inBreak ? C.cyan : C.pink;
	const beatPhase = (frame % BEAT) / BEAT;
	const barPhase = frame % BAR;
	const energetic = inDrop || (frame >= OUTRO && frame < OUTRO + 2 * BAR);
	// Batida: pulso de zoom em todo tempo; tremor no 1 de cada compasso; estrobo na palma (tempo 3).
	const pulse = energetic ? 1 + 0.035 * Math.exp(-beatPhase * 6) : 1;
	const shake = energetic && barPhase < 10 ? Math.pow(1 - barPhase / 10, 2) * 28 : 0;
	const sx = (random(`sx${frame}`) - 0.5) * shake;
	const sy = (random(`sy${frame}`) - 0.5) * shake;
	const strobe = energetic && barPhase >= BEAT * 2 && barPhase < BEAT * 2 + 3 ? 0.22 : 0;
	const cutFlash = shots.some((s) => frame >= s.from && frame < s.from + 2) ? 0.5 : 0;
	return (
		<AbsoluteFill style={{backgroundColor: C.bg}}>
			<AbsoluteFill style={{transform: `scale(${pulse}) translate(${sx}px, ${sy}px)`, filter: inBreak ? 'saturate(0.35) brightness(0.8)' : undefined}}>
				{shots.map((s) => (
					<Sequence key={s.file} from={s.from} durationInFrames={s.dur} name={`bg-${s.file}`}>
						<Shot s={s} />
					</Sequence>
				))}
			</AbsoluteFill>
			{/* Tratamento leve: aqui a imagem é a protagonista. */}
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(6,6,12,0.75) 0%, rgba(6,6,12,0.12) 24%, rgba(6,6,12,0.25) 60%, rgba(6,6,12,0.85) 100%)'}} />
			<AbsoluteFill style={{background: acc, mixBlendMode: 'soft-light', opacity: 0.22}} />
			<Particles accent={acc} />
			<AbsoluteFill style={{transform: `translate(${sx}px, ${sy}px)`}}>
				<Sequence from={INTRO} durationInFrames={DROP} name="intro">
					<Intro />
				</Sequence>
				{facts.map((f, i) => (
					<Sequence key={i} from={DROP + i * BAR} durationInFrames={BAR} name={f.lines.join(' ')}>
						<AbsoluteFill style={{alignItems: 'center', paddingTop: 330}}>
							<Kicker color={f.color} at={0}>{f.kicker}</Kicker>
						</AbsoluteFill>
						<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
							<Words3D lines={f.lines} color={f.color} at={0} flip={i % 2 === 1} />
						</AbsoluteFill>
						<AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 330}}>
							<div style={{fontFamily: mono, fontWeight: 700, fontSize: 28, letterSpacing: 3, color: C.bg, background: C.green, padding: '6px 16px', borderRadius: 6}}>● CONFIRMADO · ROCKSTAR GAMES</div>
						</AbsoluteFill>
					</Sequence>
				))}
				<Sequence from={BREAK} durationInFrames={OUTRO - BREAK} name="quebra">
					<Break />
				</Sequence>
				<Sequence from={OUTRO} durationInFrames={EDIT_DURATION - OUTRO} name="final">
					<Outro />
				</Sequence>
			</AbsoluteFill>
			{/* Luz nas bordas no pulso da batida. */}
			{energetic ? <AbsoluteFill style={{pointerEvents: 'none', boxShadow: `inset 0 0 ${130 + Math.exp(-beatPhase * 5) * 130}px ${acc}`, opacity: 0.15 + Math.exp(-beatPhase * 5) * 0.35}} /> : null}
			<AbsoluteFill style={{background: C.white, opacity: Math.max(strobe, cutFlash, frame >= DROP && frame < DROP + 4 ? 0.9 : 0, frame >= OUTRO && frame < OUTRO + 4 ? 0.9 : 0), pointerEvents: 'none'}} />
			{/* Faixas de cinema */}
			<div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 96, background: '#000'}} />
			<div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 96, background: '#000'}} />
			<HudBrand />
			<div style={{position: 'absolute', top: 160, right: 80, fontFamily: mono, fontSize: 30, color: C.red, letterSpacing: 3}}>
				<span style={{opacity: Math.floor(frame / 9) % 2 ? 1 : 0.2}}>●</span> T-{DAYS} DIAS
			</div>
			<div style={{position: 'absolute', bottom: 250, left: 80, fontFamily: mono, fontSize: 20, color: C.dim, letterSpacing: 2}}>IMAGENS: ROCKSTAR GAMES · GTA VI</div>
			<div style={{position: 'absolute', bottom: 230, left: 80, right: 80, height: 6, background: 'rgba(255,255,255,0.12)'}}>
				<div style={{height: '100%', width: `${(frame / EDIT_DURATION) * 100}%`, background: `linear-gradient(90deg, ${C.cyan}, ${C.pink})`}} />
			</div>
			{/* Música baixa, de fundo; os efeitos e a edição ficam na frente. */}
			{music ? <Html5Audio src={staticFile(`music/${music}`)} volume={0.42} /> : null}
			{sfxPlan().map(([name, at, vol], i) => (
				<Sequence key={i} from={Math.max(0, at)} durationInFrames={120} name={`sfx-${name}`}>
					<Html5Audio src={staticFile(`sfx/v2/${name}.wav`)} volume={vol} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
