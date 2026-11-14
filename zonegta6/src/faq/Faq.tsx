import React from 'react';
import {AbsoluteFill, Html5Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Grade, Slideshow} from '../Background';
import {Backdrop, Flash, MaskTitle, Panel, Shake, Tag, useIn, Words} from '../components';
import {body, C, display, mono} from '../theme';
import {blocks, FaqBlock} from './data';
import timing from './timing.json';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const FAQ_DURATION = timing.duration;
const QUESTIONS = blocks.filter((b) => b.status !== null).length;

// Logo do canal no encerramento (mesmo esquema do outro vídeo). null = logo em texto.
const LOGO_FILE: string | null = null;

const accents = [C.pink, C.cyan, C.amber, C.pink, C.cyan, C.amber, C.green, C.cyan, C.pink];

type Timed = FaqBlock & {from: number; to: number; q: number; a: number; index: number; accent: string};
const timed: Timed[] = blocks.map((b, i) => {
	const t = timing.blocks.find((x) => x.id === b.id);
	if (!t) throw new Error(`Bloco sem tempo: ${b.id}`);
	return {...b, ...t, index: i, accent: accents[i]};
});

// Distribui as palavras do texto de apoio ao longo do trecho da resposta.
const everyFor = (text: string, frames: number) =>
	Math.max(3, Math.min(10, Math.floor(frames / Math.max(1, text.split(' ').length))));

// ── Pergunta + resposta ──────────────────────────────────────
const QuestionScene: React.FC<{b: Timed; n: number}> = ({b, n}) => {
	const frame = useCurrentFrame();
	const q = b.q - b.from; // frame (dentro do bloco) em que a pergunta é falada
	const a = b.a - b.from; // frame em que a resposta começa
	const len = b.to - b.from;
	const answerIn = useIn(a, 11);
	const big = b.answer.length > 10 ? 120 : 190;
	return (
		<>
			<Shake at={a} strength={22}>
				<AbsoluteFill style={{padding: '380px 80px 0', display: 'flex', flexDirection: 'column', gap: 30}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
						<div style={{fontFamily: mono, fontSize: 34, color: b.accent, letterSpacing: 6}}>
							PERGUNTA {n}/{QUESTIONS}
						</div>
						<div style={{display: 'flex', gap: 8}}>
							{Array.from({length: QUESTIONS}).map((_, i) => (
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
					<MaskTitle text={b.question} delay={Math.max(0, q - 2)} size={b.question.length > 18 ? 104 : 128} />
					<div
						style={{
							opacity: answerIn,
							transform: `scale(${interpolate(answerIn, [0, 1], [1.4, 1])})`,
							transformOrigin: 'left center',
							filter: `blur(${interpolate(answerIn, [0, 1], [12, 0])}px)`,
						}}
					>
						<Panel accent={b.accent} delay={a}>
							<div
								style={{
									fontFamily: display,
									fontSize: big,
									lineHeight: 0.95,
									color: b.accent,
									textShadow: `0 0 50px ${b.accent}88`,
								}}
							>
								{b.answer}
							</div>
						</Panel>
					</div>
					<Words text={b.detail} delay={a + 8} size={48} every={everyFor(b.detail, Math.max(60, len - a - 60))} />
					{b.status ? (
						<div style={{marginTop: 10}}>
							<Tag status={b.status} delay={Math.min(len - 40, a + 40)} source={b.source} />
						</div>
					) : null}
				</AbsoluteFill>
			</Shake>
			<Flash at={a} />
		</>
	);
};

// ── Gancho ───────────────────────────────────────────────────
const HookScene: React.FC<{b: Timed}> = ({b}) => {
	const frame = useCurrentFrame();
	const a = b.a - b.from;
	const scale = interpolate(frame, [0, 6, 60], [2.2, 1, 0.95], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
	const seven = useIn(a, 10);
	return (
		<>
			<Shake at={0} strength={40}>
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 30, padding: '0 70px'}}>
					<div style={{fontFamily: mono, fontSize: 40, color: C.red, letterSpacing: 8}}>● CONTAGEM REGRESSIVA</div>
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
						FALTAM<br /><span style={{color: C.pink}}>5 DIAS</span>
					</div>
					<div
						style={{
							fontFamily: display,
							fontSize: 150,
							color: C.cyan,
							opacity: seven,
							transform: `scale(${interpolate(seven, [0, 1], [1.6, 1])})`,
							textShadow: `0 0 50px ${C.cyan}`,
						}}
					>
						7 PERGUNTAS
					</div>
					<div style={{textAlign: 'center', width: 880}}>
						<Words text={b.detail} delay={a + 10} size={56} every={5} />
					</div>
				</AbsoluteFill>
			</Shake>
			<Flash at={0} />
			<Flash at={a} />
		</>
	);
};

// ── Encerramento ─────────────────────────────────────────────
const CtaScene: React.FC<{b: Timed}> = ({b}) => {
	const frame = useCurrentFrame();
	const a = b.a - b.from;
	const len = b.to - b.from;
	const logo = useIn(a + 50, 12);
	return (
		<AbsoluteFill style={{padding: '420px 80px 0', display: 'flex', flexDirection: 'column', gap: 36}}>
			<MaskTitle text={b.question} size={120} color={C.pink} glow={C.pink} />
			<Words text={b.detail} delay={a} size={58} every={6} />
			<div style={{marginTop: 'auto', marginBottom: 330, textAlign: 'center', opacity: logo, transform: `scale(${0.8 + logo * 0.2})`}}>
				{LOGO_FILE ? (
					<Img src={staticFile(LOGO_FILE)} style={{width: 620, maxHeight: 420, objectFit: 'contain'}} />
				) : (
					<div style={{fontFamily: display, fontSize: 140, color: C.white, letterSpacing: 4}}>
						ZONE<span style={{color: C.pink}}>GTA6</span>
					</div>
				)}
				<div style={{fontFamily: mono, fontSize: 22, color: C.dim, marginTop: 30, opacity: interpolate(frame, [len - 60, len - 45], [0, 1], clamp)}}>
					Fontes: Rockstar · Xbox Wire · lojas PlayStation/Xbox · imprensa especializada
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ── HUD ──────────────────────────────────────────────────────
const Hud: React.FC = () => {
	const frame = useCurrentFrame();
	const blink = Math.floor(frame / 10) % 2 === 0; // pisca mais rápido: urgência
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{position: 'absolute', top: 150, left: 80, fontFamily: display, fontSize: 52, color: C.white, letterSpacing: 2}}>
				ZONE<span style={{color: C.pink}}>GTA6</span>
			</div>
			<div style={{position: 'absolute', top: 160, right: 80, fontFamily: mono, fontSize: 30, color: C.red, letterSpacing: 3}}>
				<span style={{opacity: blink ? 1 : 0.2}}>●</span> T-5 DIAS
			</div>
			<div style={{position: 'absolute', bottom: 250, left: 80, fontFamily: mono, fontSize: 20, color: C.dim, letterSpacing: 2}}>
				IMAGENS: ROCKSTAR GAMES · GTA VI
			</div>
			<div style={{position: 'absolute', bottom: 230, left: 80, right: 80, height: 6, background: 'rgba(255,255,255,0.12)'}}>
				<div style={{height: '100%', width: `${(frame / FAQ_DURATION) * 100}%`, background: `linear-gradient(90deg, ${C.cyan}, ${C.pink})`}} />
			</div>
		</AbsoluteFill>
	);
};

// Ducking da trilha sob a voz (trechos medidos na transcrição).
const musicVolume = (f: number) => {
	let dist = Infinity;
	for (const [s, e] of timing.voiceActivity) {
		if (f >= s && f <= e) return 0.22;
		dist = Math.min(dist, f < s ? s - f : f - e);
	}
	return interpolate(dist, [0, 6], [0.22, 0.55], clamp);
};

const sfx = (name: string, at: number, vol: number, key: string) => (
	<Sequence key={key} from={at} durationInFrames={90} name={`sfx-${name}`}>
		<Html5Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
	</Sequence>
);

export const Faq: React.FC<{music: string}> = ({music}) => {
	const frame = useCurrentFrame();
	const current = timed.find((b) => frame >= b.from && frame < b.to) ?? timed[timed.length - 1];
	let n = 0;
	return (
		<AbsoluteFill style={{backgroundColor: C.bg}}>
			{timed.map((b) => (
				<Slideshow key={b.id} files={b.media} from={b.from} dur={b.to - b.from} />
			))}
			<Grade accent={current.accent} />
			<Backdrop accent={current.accent} overlay />
			{timed.map((b) => {
				const isQ = b.status !== null;
				if (isQ) n++;
				return (
					<Sequence key={b.id} from={b.from} durationInFrames={b.to - b.from} name={b.id}>
						{b.id === 'hook' ? <HookScene b={b} /> : b.id === 'cta' ? <CtaScene b={b} /> : <QuestionScene b={b} n={n} />}
					</Sequence>
				);
			})}
			<Hud />
			<Html5Audio src={staticFile(`music/${music}`)} volume={musicVolume} />
			<Sequence from={timing.voStart} name="narracao">
				<Html5Audio src={staticFile(timing.file)} volume={1} />
			</Sequence>
			{timed.flatMap((b) => [
				sfx('whoosh', Math.max(0, b.from), 0.5, `${b.id}-w`),
				...(b.id !== 'cta' ? [sfx('tick', b.a, 0.4, `${b.id}-t`)] : []),
			])}
		</AbsoluteFill>
	);
};
