import React from 'react';
import {AbsoluteFill, Html5Audio, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {LOGO} from '../faq/Fx';
import {C, display, mono, Status, statusColor} from '../theme';
import {Hook, Hook2, Outro} from './Depois';
import {GOLD} from './Filme';
import data from './depois-timeline.json';
import {Word} from './Motion';

// Vídeo 7, versão MOTION PURO: o texto é o protagonista. A narração aparece gigante,
// em blocos de 1 a 3 palavras, cada bloco com uma animação diferente; palavras-chave
// em ouro com tarja; formas, setas e anéis animados; transições gráficas em faixas.
// As imagens viram fundo dos gráficos. Gancho, final de marca, trilha e efeitos são os
// mesmos da versão de filme.

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
type Seg = {kind: string; dur: number; file?: string; focus?: number; status?: string; source?: string; panels?: Array<{file: string; focus: number}>; [k: string]: unknown};
const segs = data.segments as unknown as Seg[];
const starts = segs.reduce<number[]>((acc, _s, i) => [...acc, i === 0 ? 0 : acc[i - 1] + segs[i - 1].dur], []);
export const DEPOIS_MOTION_DURATION = starts[starts.length - 1] + segs[segs.length - 1].dur;
const startOf = (kind: string) => starts[segs.findIndex((s) => s.kind === kind)];
const BODY_FROM = startOf('question');
const BODY_TO = startOf('logo');
const words = (data.words as unknown as Word[]).filter(([, s]) => s >= BODY_FROM - 4 && s < BODY_TO);

const norm = (w: string) => w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
const KEY = new Set(['tres', 'gta', '6', 'rockstar', 'take', 'two', 'strauss', 'zelnick', 'investidores', '19', 'novembro', 'pre', 'vendas', 'expectativas', 'futuro', 'franquia', 'online', 'atualizacoes', 'conteudos', 'eventos', 'comunidade', 'era', 'fim', 'universo', 'relevante', 'historico', 'planos', 'estreia', 'novidades', 'expansoes', 'incognita', 'clara', 'capitulo', 'franquias', 'historia', 'nova', 'preparado', 'depois', 'jogadores', 'pista', 'detalhe', 'pergunta']);

// Blocos: até 3 palavras; quebra em pausas, pontuação e trocas de segmento.
type Chunk = {words: Word[]; from: number; to: number; i: number};
const chunks: Chunk[] = (() => {
	const out: Word[][] = [];
	let cur: Word[] = [];
	words.forEach((w, i) => {
		cur.push(w);
		const next = words[i + 1];
		const segBreak = next && starts.some((st) => st > w[1] && st <= next[1]);
		if (cur.length >= 3 || !next || next[1] - w[2] > 8 || /[.?!,]$/.test(w[0]) || segBreak) {
			out.push(cur);
			cur = [];
		}
	});
	return out.map((c, i) => ({words: c, from: c[0][1] - 2, to: (out[i + 1]?.[0][1] ?? c[c.length - 1][2] + 18) - 2, i}));
})();

// ── Fundo: imagem do segmento em tela cheia, escurecida, com grade animada ──
const Background: React.FC = () => {
	const frame = useCurrentFrame();
	const idx = starts.findIndex((st, i) => frame >= st && frame < st + segs[i].dur);
	const s = segs[idx] ?? segs[segs.length - 1];
	const file = s.file ?? s.panels?.[0]?.file ?? null;
	const local = frame - starts[idx];
	return (
		<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #1a1408 0%, #050505 70%)'}}>
			{file ? (
				<Img src={staticFile(`media/${file}`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${(s.focus ?? 0.5) * 100}% 50%`, transform: `scale(${1.18 + local * 0.0012})`, filter: 'brightness(0.38) saturate(0.8) contrast(1.1) blur(2px)'}} />
			) : null}
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(5,5,5,0.85) 0%, rgba(5,5,5,0.15) 30%, rgba(5,5,5,0.25) 65%, rgba(5,5,5,0.9) 100%)'}} />
			{/* Grade fina deslizando + diagonais douradas */}
			<AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(226,194,125,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(226,194,125,0.07) 1px, transparent 1px)', backgroundSize: '90px 90px', backgroundPosition: `0 ${frame * 0.8}px`}} />
			<AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(115deg, transparent 0 220px, rgba(226,194,125,0.05) 220px 222px)', backgroundPosition: `${frame * 2}px 0`}} />
		</AbsoluteFill>
	);
};

// ── Texto cinético ───────────────────────────────────────────
const VARIANTS = ['slam', 'rise', 'split', 'tilt', 'stack'] as const;
const KineticChunk: React.FC<{c: Chunk}> = ({c}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const v = VARIANTS[c.i % VARIANTS.length];
	const len = c.to - c.from;
	const longest = Math.max(...c.words.map(([w]) => w.length));
	const size = Math.min(210, Math.max(110, 940 / (0.5 * Math.max(longest, 4))));
	const out = interpolate(frame, [len - 5, len], [1, 0], clamp);
	const stacked = v === 'stack' || c.words.some(([w]) => w.length > 9);
	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: out}}>
			<div style={{display: 'flex', flexDirection: stacked ? 'column' : 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: stacked ? 0 : '0 28px', width: 1000, transform: v === 'tilt' ? 'rotate(-4deg)' : undefined}}>
				{c.words.map(([w, s], k) => {
					const local = s - 2 - c.from;
					const p = spring({frame: frame - local, fps, config: {damping: v === 'slam' ? 9 : 13, mass: 0.6}});
					const key = KEY.has(norm(w));
					const text = w.replace(/[.,!]$/, '').toUpperCase();
					const tf =
						v === 'slam'
							? `scale(${interpolate(p, [0, 1], [2.2, 1])})`
							: v === 'rise'
								? `translateY(${(1 - p) * 160}px)`
								: v === 'split'
									? `translateX(${(1 - p) * (k % 2 ? 420 : -420)}px)`
									: v === 'tilt'
										? `translateY(${(1 - p) * -120}px) rotate(${(1 - p) * 14}deg)`
										: `translateX(${(1 - p) * -200}px) skewX(${(1 - p) * -20}deg)`;
					const box = key ? interpolate(frame, [local + 1, local + 6], [0, 1], {...clamp, easing: easeOut}) : 0;
					return (
						<div key={k} style={{position: 'relative', overflow: v === 'rise' ? 'hidden' : 'visible', padding: '0 14px', margin: key ? '6px 0' : 0}}>
							{key ? <div style={{position: 'absolute', left: 0, right: 0, top: '-2%', bottom: '-4%', background: 'linear-gradient(180deg, #f5dc98, #e2c27d 55%, #c9a24e)', transform: `scaleX(${box})`, transformOrigin: 'left', boxShadow: '0 0 40px rgba(226,194,125,0.45)'}} /> : null}
							<div
								style={{
									position: 'relative',
									fontFamily: display,
									fontSize: size,
									lineHeight: 0.98,
									color: key ? (box > 0.85 ? '#0a0a0a' : '#f5dc98') : '#f4efe6',
									opacity: Math.min(1, p * 2),
									transform: tf,
									filter: v === 'slam' ? `blur(${(1 - p) * 10}px)` : undefined,
									textShadow: key && box > 0.85 ? undefined : '0 8px 30px rgba(0,0,0,0.85)',
								}}
							>
								{text}
							</div>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

// Formas de acento: barra sob o bloco, anel, colchetes e seta (para cima em "acima").
const Accent: React.FC<{c: Chunk}> = ({c}) => {
	const frame = useCurrentFrame();
	const kind = c.words.some(([w]) => norm(w) === 'acima') ? 'arrow' : c.words.some(([w]) => /\?$/.test(w)) ? 'question' : (['bar', 'ring', 'brackets', 'bar', 'dots'] as const)[c.i % 5];
	const p = interpolate(frame, [2, 14], [0, 1], {...clamp, easing: easeOut});
	const len = c.to - c.from;
	const out = interpolate(frame, [len - 5, len], [1, 0], clamp);
	return (
		<AbsoluteFill style={{pointerEvents: 'none', justifyContent: 'center', alignItems: 'center', opacity: out}}>
			{kind === 'bar' ? <div style={{position: 'absolute', top: 1180, width: 520 * p, height: 8, background: 'linear-gradient(90deg, #a8803a, #f5dc98, #a8803a)', boxShadow: '0 0 20px #e2b85a'}} /> : null}
			{kind === 'ring' ? <div style={{position: 'absolute', width: 300 + 600 * p, height: 300 + 600 * p, borderRadius: '50%', border: `${3 * (1 - p) + 1}px solid #e2c27d`, opacity: 1 - p}} /> : null}
			{kind === 'brackets'
				? [-1, 1].map((d) => <div key={d} style={{position: 'absolute', top: 760, height: 400, width: 60, left: d < 0 ? 40 + (1 - p) * -100 : undefined, right: d > 0 ? 40 + (1 - p) * -100 : undefined, borderTop: '6px solid #e2c27d', borderBottom: '6px solid #e2c27d', [d < 0 ? 'borderLeft' : 'borderRight']: '6px solid #e2c27d'}} />)
				: null}
			{kind === 'dots' ? [0, 1, 2].map((k) => <div key={k} style={{position: 'absolute', top: 1190, left: 480 + k * 44, width: 20, height: 20, borderRadius: 20, background: '#e2c27d', transform: `scale(${interpolate(frame, [2 + k * 3, 10 + k * 3], [0, 1], clamp)})`}} />) : null}
			{kind === 'arrow' ? (
				<svg width={220} height={300} style={{position: 'absolute', top: 470, transform: `translateY(${(1 - p) * 120}px)`, opacity: p}}>
					<path d="M110 10 L200 120 L140 120 L140 290 L80 290 L80 120 L20 120 Z" fill="#e2c27d" />
				</svg>
			) : null}
			{kind === 'question' ? <div style={{position: 'absolute', top: 360, fontFamily: display, fontSize: 380, color: 'rgba(226,194,125,0.18)', transform: `scale(${0.8 + 0.2 * p}) rotate(${(1 - p) * 20}deg)`}}>?</div> : null}
		</AbsoluteFill>
	);
};

// ── Transição gráfica: três faixas douradas varrendo a tela no corte ──
const BarsWipe: React.FC<{dir: number}> = ({dir}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
			{[0, 1, 2].map((k) => {
				const p = interpolate(frame - k * 2, [0, 14], [-1.3, 1.3], {...clamp, easing: (t) => t * t * (3 - 2 * t)});
				return <div key={k} style={{position: 'absolute', top: -400, bottom: -400, width: 260 - k * 70, left: '40%', background: k === 1 ? '#0a0a0a' : '#e2c27d', transform: `translateX(${p * dir * 1300}px) skewX(-18deg)`, opacity: k === 1 ? 0.9 : 1}} />;
			})}
		</AbsoluteFill>
	);
};

// ── Selo de verificação dos dados (motion) ───────────────────
const Badge: React.FC<{status: string; source: string}> = ({status, source}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = spring({frame: frame - 6, fps, config: {damping: 10, mass: 0.5}});
	const col = statusColor[status as Status] ?? C.amber;
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: 1380, display: 'flex', justifyContent: 'center'}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 14, transform: `scale(${interpolate(p, [0, 1], [1.6, 1])}) rotate(${(1 - p) * -6}deg)`, opacity: Math.min(1, p * 2), background: 'rgba(0,0,0,0.75)', border: `2px solid ${col}`, padding: '10px 18px'}}>
				<div style={{fontFamily: mono, fontWeight: 700, fontSize: 28, color: '#000', background: col, padding: '4px 12px', letterSpacing: 2}}>● {status}</div>
				<div style={{fontFamily: mono, fontSize: 24, color: '#f1ece4', letterSpacing: 2}}>{source}</div>
			</div>
		</div>
	);
};

// ── Sound design (kit cinematográfico, máx. 2 usos por efeito) ──
type Ev = [src: string, frame: number, volume: number];
const X = (n: string) => `sfx/cine/${n}.wav`;
const buildSfx = (): Ev[] => {
	const ev: Ev[] = [];
	const count: Record<string, number> = {};
	const pick = (names: string[], at: number, vol: number) => {
		const n = names.map(X).find((x) => (count[x] ?? 0) < 2);
		if (!n) return;
		count[n] = (count[n] ?? 0) + 1;
		ev.push([n, at, vol]);
	};
	const fl = (segs[0].flashes as Array<[string, number]>) ?? [];
	const dropAt = (segs[0].dropAt as number) ?? 126;
	pick(['boom_a'], 0, 0.65);
	pick(['hit_a'], fl[1]?.[1] ?? 19, 0.6);
	pick(['hit_c'], fl[2]?.[1] ?? 37, 0.55);
	pick(['swell_a'], dropAt - 40, 0.4);
	pick(['boom_b'], dropAt, 0.55);
	pick(['heartbeat'], dropAt + 20, 0.5);
	// Corpo: passagem de ar a cada troca de segmento; impacto + brilho nos selos.
	segs.forEach((s, i) => {
		const at = starts[i];
		if (at < BODY_FROM || at >= BODY_TO) return;
		pick(['air_a', 'air_c', 'air_b', 'air_f', 'air_d', 'air_e'], at - 3, 0.35);
		if (s.status) {
			pick(['braam_a', 'braam_b', 'braam_c'], at, 0.5);
			pick(['glint_a', 'glint_b', 'glint_c', 'glint_d'], at + 6, 0.3);
		}
	});
	// Blocos com palavra-chave ganham um impacto curto (enquanto houver efeitos livres).
	chunks.forEach((c) => {
		if (c.words.some(([w]) => KEY.has(norm(w)))) pick(['hit_b', 'hit_d', 'hit_e', 'hit_f', 'boom_c', 'swell_b', 'swell_c'], c.from + 2, 0.3);
	});
	pick(['rise_a'], BODY_TO - 80, 0.35);
	pick(['finale'], BODY_TO + 2, 0.6);
	return ev;
};
const sfx = buildSfx();

const musicVolume = (f: number) => {
	let dist = Infinity;
	for (const [a, b] of data.voice) {
		if (f >= a && f <= b) return 0.55;
		dist = Math.min(dist, f < a ? a - f : f - b);
	}
	return interpolate(dist, [0, 8], [0.55, 0.85], clamp);
};

export const DepoisMotion: React.FC = () => {
	const frame = useCurrentFrame();
	const body = frame >= BODY_FROM && frame < BODY_TO;
	return (
		<AbsoluteFill style={{backgroundColor: '#050505'}}>
			<Sequence from={0} durationInFrames={segs[0].dur} name="gancho">
				<Hook s={segs[0] as never} />
			</Sequence>
			<Sequence from={starts[1]} durationInFrames={segs[1].dur} name="gancho-2">
				<Hook2 s={segs[1] as never} />
			</Sequence>
			<Sequence from={BODY_FROM} durationInFrames={BODY_TO - BODY_FROM} name="corpo">
				<Background />
			</Sequence>
			{chunks.map((c) => (
				<Sequence key={c.i} from={c.from} durationInFrames={Math.max(6, c.to - c.from)} name={c.words.map(([w]) => w).join(' ')}>
					<Accent c={c} />
					<KineticChunk c={c} />
				</Sequence>
			))}
			{segs.map((s, i) =>
				s.status && starts[i] >= BODY_FROM ? (
					<Sequence key={`b${i}`} from={starts[i]} durationInFrames={s.dur} name="selo">
						<Badge status={s.status} source={s.source ?? ''} />
					</Sequence>
				) : null,
			)}
			{segs.map((s, i) =>
				starts[i] > BODY_FROM && starts[i] < BODY_TO ? (
					<Sequence key={`w${i}`} from={starts[i] - 7} durationInFrames={20} name="transicao">
						<BarsWipe dir={i % 2 ? -1 : 1} />
					</Sequence>
				) : null,
			)}
			<Sequence from={BODY_TO} durationInFrames={DEPOIS_MOTION_DURATION - BODY_TO} name="final">
				<Outro s={segs[segs.length - 1] as never} />
			</Sequence>
			{body ? (
				<>
					<div style={{position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16}}>
						<Img src={staticFile(LOGO)} style={{width: 66, height: 66, borderRadius: '50%', objectFit: 'cover'}} />
						<div style={{fontFamily: display, fontSize: 40, letterSpacing: 6, ...GOLD}}>ZONE GTA VI</div>
					</div>
					<div style={{position: 'absolute', right: 40, top: 312, fontFamily: mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, border: '1.5px solid #c9a86a', padding: '6px 12px', ...GOLD}}>D-3</div>
					<div style={{position: 'absolute', left: 80, right: 80, bottom: 300, height: 6, background: 'rgba(255,255,255,0.12)'}}>
						<div style={{height: '100%', width: `${((frame - BODY_FROM) / (BODY_TO - BODY_FROM)) * 100}%`, background: 'linear-gradient(90deg, #a8803a, #f5dc98)'}} />
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, bottom: 250, textAlign: 'center', fontFamily: mono, fontSize: 20, color: 'rgba(241,236,228,0.5)', letterSpacing: 3}}>IMAGENS: ROCKSTAR GAMES · GTA VI E GTA ONLINE</div>
				</>
			) : null}
			<AbsoluteFill style={{pointerEvents: 'none', opacity: 0.06, mixBlendMode: 'overlay'}}>
				<svg width="100%" height="100%">
					<filter id="grain">
						<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={Math.floor(random(`g${frame}`) * 1000)} />
					</filter>
					<rect width="100%" height="100%" filter="url(#grain)" />
				</svg>
			</AbsoluteFill>
			<Html5Audio src={staticFile('music/trilha-depois-motion.mp3')} volume={musicVolume} />
			<Sequence from={data.voStart} name="narracao">
				<Html5Audio src={staticFile('vo/depois-marcio.mp3')} volume={1} />
			</Sequence>
			{sfx.map(([src, at, vol], i) => (
				<Sequence key={i} from={Math.max(0, at)} durationInFrames={150} name={`sfx-${src}`}>
					<Html5Audio src={staticFile(src)} volume={vol} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
