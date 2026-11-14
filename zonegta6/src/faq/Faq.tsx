import React from 'react';
import {AbsoluteFill, Html5Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Grade, Slideshow} from '../Background';
import {Backdrop, Flash, Panel, Shake, Tag, useIn, Words} from '../components';
import {C, display, mono} from '../theme';
import {checklist} from './checklist';
import {BeatPulse, Check, Infographic, KineticTitle, LogoSting, Particles, Transition} from './Fx';
import {blocks, FaqBlock} from './data';
import timingChecklist from './timing-checklist.json';
import timingPerguntas from './timing-perguntas.json';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Logo do canal no encerramento. null = logo em texto.
const LOGO_FILE: string | null = null;

const accents = [C.pink, C.cyan, C.amber, C.pink, C.cyan, C.amber, C.green, C.cyan, C.pink];

// Cada vídeo em formato de lista: conteúdo + tempos (gerados por scripts/faq_timing.py).
export const videos = {
	perguntas: {
		blocks,
		timing: timingPerguntas,
		label: 'PERGUNTA',
		kicker: 'CONTAGEM REGRESSIVA',
		hud: 'T-5 DIAS',
		sources: 'Fontes: Rockstar · Xbox Wire · lojas PlayStation/Xbox · imprensa especializada',
	},
	checklist: {
		blocks: checklist,
		timing: timingChecklist,
		label: 'PASSO',
		kicker: 'LANÇAMENTO 19/11',
		hud: 'LANÇA 19/11',
		sources: 'Fontes: Rockstar · Xbox Wire · lojas PlayStation/Xbox · imprensa especializada',
	},
};
export type VideoId = keyof typeof videos;

type Timed = FaqBlock & {from: number; to: number; q: number; a: number; accent: string};

// Distribui as palavras do texto de apoio ao longo do trecho da resposta.
const everyFor = (text: string, frames: number) =>
	Math.max(3, Math.min(10, Math.floor(frames / Math.max(1, text.split(' ').length))));

// ── Item (pergunta/passo) + resposta ─────────────────────────
const ItemScene: React.FC<{b: Timed; n: number; total: number; label: string}> = ({b, n, total, label}) => {
	const frame = useCurrentFrame();
	const q = b.q - b.from; // frame (dentro do bloco) em que o título é falado
	const a = b.a - b.from; // frame em que a explicação começa
	const len = b.to - b.from;
	const answerIn = useIn(a, 11);
	const big = b.answer.length > 9 ? 124 : 190;
	// "Câmera": aproximação lenta no bloco + soco de zoom quando a resposta entra.
	const push = 1 + 0.035 * (frame / len);
	const punch = frame >= a ? interpolate(frame, [a, a + 9], [1.08, 1], clamp) : 1;
	return (
		<>
			<Shake at={a} strength={26}>
				<AbsoluteFill style={{padding: '370px 80px 0', display: 'flex', flexDirection: 'column', gap: 26, transform: `scale(${push * punch})`, transformOrigin: '50% 40%'}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
						<div style={{fontFamily: mono, fontSize: 34, color: b.accent, letterSpacing: 6}}>
							{label} {n}/{total}
						</div>
						<div style={{display: 'flex', gap: 8}}>
							{Array.from({length: total}).map((_, i) => (
								<div
									key={i}
									style={{
										width: 26,
										height: 8,
										background: i < n ? b.accent : 'rgba(255,255,255,0.2)',
										boxShadow: i === n - 1 ? `0 0 14px ${b.accent}` : undefined,
									}}
								/>
							))}
						</div>
					</div>
					<KineticTitle text={b.question} delay={Math.max(0, q - 2)} size={b.question.length > 16 ? 104 : 128} />
					<div
						style={{
							opacity: answerIn,
							transform: `scale(${interpolate(answerIn, [0, 1], [1.5, 1])}) rotate(${interpolate(answerIn, [0, 1], [-4, 0])}deg)`,
							transformOrigin: 'left center',
							filter: `blur(${interpolate(answerIn, [0, 1], [14, 0])}px)`,
						}}
					>
						<Panel accent={b.accent} delay={a}>
							<div
								style={{
									fontFamily: display,
									fontSize: big,
									lineHeight: 0.95,
									color: b.accent,
									whiteSpace: 'nowrap',
									textShadow: `0 0 50px ${b.accent}88, ${(1 - answerIn) * 20}px 0 ${C.pink}, ${-(1 - answerIn) * 20}px 0 ${C.cyan}`,
								}}
							>
								{b.answer}
							</div>
						</Panel>
					</div>
					<Words text={b.detail} delay={a + 8} size={44} every={everyFor(b.detail, Math.max(60, len - a - 70))} />
					{b.status ? <Tag status={b.status} delay={Math.min(len - 60, a + 40)} source={b.source} /> : null}
					<div style={{position: 'relative', minHeight: 120}}>
						<Infographic id={b.id} a={a} accent={b.accent} />
						<div style={{position: 'absolute', right: -20, top: -60}}>
							<Check at={len - 26} accent={C.green} />
						</div>
					</div>
				</AbsoluteFill>
			</Shake>
			<Flash at={a} />
		</>
	);
};

// ── Gancho ───────────────────────────────────────────────────
const HookScene: React.FC<{b: Timed; kicker: string}> = ({b, kicker}) => {
	const frame = useCurrentFrame();
	const a = b.a - b.from;
	const len = b.to - b.from;
	const scale = interpolate(frame, [0, 6, 60], [2.2, 1, 0.95], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
	const second = useIn(a, 10);
	const [line1, line2] = b.question.split('|');
	return (
		<>
			<Shake at={0} strength={40}>
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 30, padding: '0 70px'}}>
					<div style={{fontFamily: mono, fontSize: 40, color: C.red, letterSpacing: 8}}>● {kicker}</div>
					<div
						style={{
							fontFamily: display,
							fontSize: 210,
							lineHeight: 0.9,
							color: C.white,
							textAlign: 'center',
							transform: `scale(${scale})`,
							textShadow: `0 0 60px ${C.pink}`,
						}}
					>
						{line1}
						<br />
						<span style={{color: C.pink}}>{line2}</span>
					</div>
					<div
						style={{
							fontFamily: display,
							fontSize: b.answer.length > 12 ? 124 : 150,
							color: C.cyan,
							opacity: second,
							transform: `scale(${interpolate(second, [0, 1], [1.6, 1])})`,
							textShadow: `0 0 50px ${C.cyan}`,
							textAlign: 'center',
						}}
					>
						{b.answer}
					</div>
					<div style={{textAlign: 'center', width: 880}}>
						<Words text={b.detail} delay={a + 30} size={56} every={everyFor(b.detail, len - a - 50)} />
					</div>
				</AbsoluteFill>
			</Shake>
			<Flash at={0} />
			<Flash at={a} />
		</>
	);
};

// ── Encerramento: recapitulação + logo ───────────────────────
const CtaScene: React.FC<{b: Timed; sources: string; items: Timed[]}> = ({b, sources, items}) => {
	const frame = useCurrentFrame();
	const a = b.a - b.from;
	const len = b.to - b.from;
	const logoAt = len - 75;
	const logo = useIn(logoAt, 12);
	return (
		<AbsoluteFill style={{padding: '390px 80px 0', display: 'flex', flexDirection: 'column', gap: 26}}>
			<KineticTitle text={b.question} delay={Math.max(0, b.q - b.from - 2)} size={104} color={C.pink} />
			<div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
				{items.map((it, i) => {
					const at = a + i * 6;
					const p = interpolate(frame, [at, at + 8], [0, 1], clamp);
					return (
						<div key={it.id} style={{display: 'flex', alignItems: 'center', gap: 18, opacity: p, transform: `translateX(${(1 - p) * -60}px)`}}>
							<Check at={at + 4} accent={it.accent} size={46} />
							<div style={{fontFamily: display, fontSize: 44, color: C.white, textTransform: 'uppercase'}}>{it.question}</div>
						</div>
					);
				})}
			</div>
			<Words text={b.detail} delay={a + 28} size={46} every={5} />
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 300, textAlign: 'center', opacity: LOGO_FILE ? logo : 1, transform: LOGO_FILE ? `scale(${0.8 + logo * 0.2})` : undefined}}>
				{LOGO_FILE ? <Img src={staticFile(LOGO_FILE)} style={{width: 620, maxHeight: 300, objectFit: 'contain'}} /> : <LogoSting at={logoAt} />}
				<div style={{fontFamily: mono, fontSize: 22, color: C.dim, marginTop: 20, opacity: interpolate(frame, [len - 50, len - 38], [0, 1], clamp)}}>
					{sources}
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ── HUD ──────────────────────────────────────────────────────
const Hud: React.FC<{tag: string; duration: number}> = ({tag, duration}) => {
	const frame = useCurrentFrame();
	const blink = Math.floor(frame / 10) % 2 === 0; // pisca rápido: urgência
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{position: 'absolute', top: 150, left: 80, fontFamily: display, fontSize: 52, color: C.white, letterSpacing: 2}}>
				ZONE<span style={{color: C.pink}}>GTA6</span>
			</div>
			<div style={{position: 'absolute', top: 160, right: 80, fontFamily: mono, fontSize: 30, color: C.red, letterSpacing: 3}}>
				<span style={{opacity: blink ? 1 : 0.2}}>●</span> {tag}
			</div>
			<div style={{position: 'absolute', bottom: 250, left: 80, fontFamily: mono, fontSize: 20, color: C.dim, letterSpacing: 2}}>
				IMAGENS: ROCKSTAR GAMES · GTA VI
			</div>
			<div style={{position: 'absolute', bottom: 230, left: 80, right: 80, height: 6, background: 'rgba(255,255,255,0.12)'}}>
				<div style={{height: '100%', width: `${(frame / duration) * 100}%`, background: `linear-gradient(90deg, ${C.cyan}, ${C.pink})`}} />
			</div>
		</AbsoluteFill>
	);
};

// ── Sound design ─────────────────────────────────────────────
// Efeitos de public/sfx/v2 (scripts/sfx.py). Regra do canal: nenhum efeito toca mais
// de 2 vezes no mesmo vídeo; o plano abaixo é validado e quebra o render se violar.
type Ev = [name: string, frame: number, volume: number];
const WHOOSH = ['whoosh_a', 'whoosh_b', 'whoosh_c', 'whoosh_d', 'whoosh_e', 'whoosh_a', 'whoosh_b', 'whoosh_c'];
const TITLE = ['swish_f', 'glitch_a', 'pop_b', 'click_a', 'swish_f', 'glitch_a', 'pop_b'];
const IMPACT = ['impact_a', 'impact_b', 'impact_c', 'impact_d', 'impact_a', 'impact_b', 'impact_c'];
const BLIP = ['blip_a', 'blip_b', 'blip_c', 'blip_d', 'blip_a', 'blip_b', 'blip_c'];
const CHECK = ['check_a', 'check_b', 'check_c', 'check_d', 'check_a', 'check_b', 'check_c'];
// Sons temáticos por passo: [efeito, frames depois do início da explicação].
const THEMED: Record<string, Array<[string, number]>> = {
	espaco: [['scan', 12], ['slide_whistle', 140], ['trash', 158]],
	predownload: [['download', 12], ['success', 114]],
	bonus: [['riser_b', -36], ['cash', 10], ['pop_a', 75]],
	horario: [['clock', 6]],
	fps: [['reverse_cym', -30], ['power_down', 6], ['power_up', 112]],
	legendas: [['toggle', 45], ['typing', 52]],
	xboxone: [['cloud', 8], ['click_a', 141]],
};

const buildSfx = (timed: Timed[]): Ev[] => {
	const ev: Ev[] = [];
	let n = 0;
	for (const b of timed) {
		const len = b.to - b.from;
		if (b.id === 'hook') {
			ev.push(['stinger_intro', 0, 0.7], ['alarm', 24, 0.3], ['riser_a', b.a - 45, 0.5], ['impact_e', b.a, 0.7], ['glitch_b', b.a + 2, 0.35]);
			continue;
		}
		ev.push([WHOOSH[n % WHOOSH.length], b.from - 6, 0.5]);
		if (b.id === 'cta') {
			ev.push(['tally', b.a, 0.45], ['notify', b.a + 44, 0.4], ['riser_a', b.to - 75 - 45, 0.45], ['stinger_final', b.to - 75, 0.75]);
			continue;
		}
		ev.push([TITLE[n % 7], b.q - 2, 0.45], [IMPACT[n % 7], b.a, 0.65], [BLIP[n % 7], b.from + Math.min(len - 60, b.a - b.from + 40), 0.35], [CHECK[n % 7], b.to - 26, 0.5]);
		for (const [name, off] of THEMED[b.id] ?? []) ev.push([name, b.a + off, 0.5]);
		n++;
	}
	const count: Record<string, number> = {};
	for (const [name] of ev) {
		count[name] = (count[name] ?? 0) + 1;
		if (count[name] > 2) throw new Error(`Efeito "${name}" usado mais de 2 vezes`);
	}
	return ev;
};

export const Faq: React.FC<{music: string; video: VideoId}> = ({music, video}) => {
	const frame = useCurrentFrame();
	const v = videos[video];
	const {timing} = v;
	const timed: Timed[] = v.blocks.map((b, i) => {
		const t = timing.blocks.find((x) => x.id === b.id);
		if (!t) throw new Error(`Bloco sem tempo: ${b.id}`);
		return {...b, ...t, accent: accents[i % accents.length]};
	});
	const items = timed.filter((b) => b.status !== null);
	const current = timed.find((b) => frame >= b.from && frame < b.to) ?? timed[timed.length - 1];

	// Ducking da trilha sob a voz (trechos medidos na transcrição).
	const musicVolume = (f: number) => {
		let dist = Infinity;
		for (const [s, e] of timing.voiceActivity) {
			if (f >= s && f <= e) return 0.22;
			dist = Math.min(dist, f < s ? s - f : f - e);
		}
		return interpolate(dist, [0, 6], [0.22, 0.55], clamp);
	};

	return (
		<AbsoluteFill style={{backgroundColor: C.bg}}>
			{timed.map((b) => (
				<Slideshow key={b.id} files={b.media} from={b.from} dur={b.to - b.from} />
			))}
			<Grade accent={current.accent} />
			<Backdrop accent={current.accent} overlay />
			<Particles accent={current.accent} />
			{timed.map((b) => (
				<Sequence key={b.id} from={b.from} durationInFrames={b.to - b.from} name={b.id}>
					{b.id === 'hook' ? (
						<HookScene b={b} kicker={v.kicker} />
					) : b.id === 'cta' ? (
						<CtaScene b={b} sources={v.sources} items={items} />
					) : (
						<ItemScene b={b} n={items.indexOf(b) + 1} total={items.length} label={v.label} />
					)}
				</Sequence>
			))}
			<BeatPulse accent={current.accent} start={timed[1].q} end={timed[timed.length - 1].q} period={(60 / 140) * 30} />
			{timed.slice(1).map((b, i) => (
				<Transition key={b.id} at={b.from} kind={i} accent={b.accent} />
			))}
			<Hud tag={v.hud} duration={timing.duration} />
			<Html5Audio src={staticFile(`music/${music}`)} volume={musicVolume} />
			<Sequence from={timing.voStart} name="narracao">
				<Html5Audio src={staticFile(timing.file)} volume={1} />
			</Sequence>
			{buildSfx(timed).map(([name, at, vol], i) => (
				<Sequence key={i} from={Math.max(0, at)} durationInFrames={120} name={`sfx-${name}`}>
					<Html5Audio src={staticFile(`sfx/v2/${name}.wav`)} volume={vol} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
