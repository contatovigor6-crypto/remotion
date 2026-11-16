import React from 'react';
import {AbsoluteFill, Html5Audio, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {LOGO} from '../faq/Fx';
import {display, mono, Status, statusColor} from '../theme';

/*
 * ESTILO ZONEGTA6 — modelo fixo de edição do canal.
 *
 * Identidade (não muda de vídeo para vídeo):
 *  - Texto é o protagonista: a narração aparece gigante (Anton), em blocos de 1–3 palavras,
 *    cada bloco com uma das 5 animações do ciclo.
 *  - Paleta: preto profundo + OURO (palavras-chave com tarja) + ROSA VICE (acentos e brilho).
 *  - Assinatura: transição em "Z" (faixa em zigue-zague, como o Z da logo) a cada troca de trecho.
 *  - Imagens oficiais como fundo escurecido, com grade e luz rosa se movendo.
 *  - Selos de verificação (CONFIRMADO / REPORTADO / SEM ANÚNCIO) carimbando com a fonte.
 *  - Gancho em tela cheia com flashes de imagem + número/palavra gigante; virada seca.
 *  - Encerramento: o Z corta a tela, a logo entra com anel, nome do canal e convite.
 *  - Som: trilha original sob a voz (55% na fala, 85% nas pausas) e kit cinematográfico
 *    (public/sfx/cine), nenhum efeito mais de 2 vezes.
 *
 * Para um vídeo novo, basta uma linha do tempo (segmentos + palavras com tempo) e a
 * configuração do gancho; veja src/style/videos.ts.
 */

export const GOLD = '#e2c27d';
export const PINK = '#ff2e88';
export const INK = '#060507';
const GOLD_TEXT: React.CSSProperties = {backgroundImage: 'linear-gradient(180deg, #fff3cf 0%, #f0d48a 35%, #c9a24e 60%, #f5dc98 80%, #a8803a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const norm = (w: string) => w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

export type Word = [string, number, number];
export type Seg = {kind: string; dur: number; file?: string; focus?: number; status?: string; source?: string; panels?: Array<{file: string; focus: number}>; [k: string]: unknown};
export type ZoneData = {voStart: number; segments: Seg[]; words: Word[]; voice: Array<[number, number]>};
export type ZoneConfig = {
	data: ZoneData;
	vo: string;
	music: string;
	days: number | null;
	hook: {flashes: Array<[string, number]>; kicker: string; big: string; small: string; line: string; lineAt: number};
	hook2: {lines: [string, string]; sub: string; subAt: number};
	keywords: string[];
};

const DEFAULT_KEYS = ['gta', '6', 'vi', 'rockstar', 'take', 'two', 'zelnick', '19', 'novembro', 'pre', 'vendas', 'online', 'vice', 'city', 'leonida', 'jason', 'lucia', 'era', 'historia', 'recorde', 'lancamento'];

// ── Assinatura: transição em Z ───────────────────────────────
export const ZWipe: React.FC<{dir?: 1 | -1}> = ({dir = 1}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [0, 16], [-1, 1], {...clamp, easing: (t) => t * t * (3 - 2 * t)});
	const x = p * 1500 * dir;
	// Zigue-zague (Z) largo, atravessando a tela na diagonal.
	const z = 'M -200 -100 L 1280 -100 L 1280 520 L 260 1180 L 1280 1180 L 1280 2020 L -200 2020 L -200 1400 L 820 740 L -200 740 Z';
	return (
		<AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
			<svg width={1080} height={1920} style={{position: 'absolute', transform: `translateX(${x}px)`}}>
				<defs>
					<linearGradient id="zg" x1="0" x2="1">
						<stop offset="0" stopColor="#a8803a" />
						<stop offset="0.5" stopColor="#f5dc98" />
						<stop offset="1" stopColor="#a8803a" />
					</linearGradient>
				</defs>
				<path d={z} fill="url(#zg)" />
				<path d={z} fill="none" stroke={PINK} strokeWidth={14} />
			</svg>
			<svg width={1080} height={1920} style={{position: 'absolute', transform: `translateX(${x - 160 * dir}px)`, opacity: 0.85}}>
				<path d={z} fill={INK} transform="scale(0.96) translate(22 40)" />
			</svg>
		</AbsoluteFill>
	);
};

// ── Fundo: imagem do trecho, escurecida, com grade e luz rosa ──
const Background: React.FC<{segs: Seg[]; starts: number[]}> = ({segs, starts}) => {
	const frame = useCurrentFrame();
	const idx = Math.max(0, starts.findIndex((st, i) => frame >= st && frame < st + segs[i].dur));
	const s = segs[idx];
	const file = s.file ?? s.panels?.[0]?.file ?? null;
	const local = frame - starts[idx];
	return (
		<AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 35%, #1b0d16 0%, ${INK} 70%)`}}>
			{file ? <Img src={staticFile(`media/${file}`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${(s.focus ?? 0.5) * 100}% 50%`, transform: `scale(${1.15 + local * 0.0012})`, filter: 'brightness(0.36) saturate(0.85) contrast(1.1) blur(2px)'}} /> : null}
			<AbsoluteFill style={{background: `linear-gradient(180deg, ${INK}e6 0%, ${INK}22 30%, ${INK}33 65%, ${INK}ee 100%)`}} />
			<AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(226,194,125,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(226,194,125,0.06) 1px, transparent 1px)', backgroundSize: '90px 90px', backgroundPosition: `0 ${frame * 0.8}px`}} />
			<div style={{position: 'absolute', left: -300, right: -300, height: 500, top: 700 + Math.sin(frame / 60) * 260, background: 'radial-gradient(ellipse, rgba(255,46,136,0.16) 0%, transparent 60%)'}} />
		</AbsoluteFill>
	);
};

// ── Texto cinético ───────────────────────────────────────────
type Chunk = {words: Word[]; from: number; to: number; i: number};
const VARIANTS = ['slam', 'rise', 'split', 'tilt', 'stack'] as const;
const Kinetic: React.FC<{c: Chunk; keys: Set<string>}> = ({c, keys}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const v = VARIANTS[c.i % VARIANTS.length];
	const len = c.to - c.from;
	const longest = Math.max(...c.words.map(([w]) => w.length));
	const size = Math.min(210, Math.max(110, 940 / (0.5 * Math.max(longest, 4))));
	const stacked = v === 'stack' || c.words.some(([w]) => w.length > 9);
	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: interpolate(frame, [len - 5, len], [1, 0], clamp)}}>
			<div style={{display: 'flex', flexDirection: stacked ? 'column' : 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: stacked ? 0 : '0 28px', width: 1000, transform: v === 'tilt' ? 'rotate(-4deg)' : undefined}}>
				{c.words.map(([w, s], k) => {
					const local = s - 2 - c.from;
					const p = spring({frame: frame - local, fps, config: {damping: v === 'slam' ? 9 : 13, mass: 0.6}});
					const key = keys.has(norm(w));
					const box = key ? interpolate(frame, [local + 1, local + 6], [0, 1], {...clamp, easing: easeOut}) : 0;
					const tf = v === 'slam' ? `scale(${interpolate(p, [0, 1], [2.2, 1])})` : v === 'rise' ? `translateY(${(1 - p) * 160}px)` : v === 'split' ? `translateX(${(1 - p) * (k % 2 ? 420 : -420)}px)` : v === 'tilt' ? `translateY(${(1 - p) * -120}px) rotate(${(1 - p) * 14}deg)` : `translateX(${(1 - p) * -200}px) skewX(${(1 - p) * -20}deg)`;
					return (
						<div key={k} style={{position: 'relative', overflow: v === 'rise' ? 'hidden' : 'visible', padding: '0 14px', margin: key ? '6px 0' : 0}}>
							{key ? <div style={{position: 'absolute', left: 0, right: 0, top: '-2%', bottom: '-4%', background: 'linear-gradient(180deg, #f5dc98, #e2c27d 55%, #c9a24e)', transform: `scaleX(${box})`, transformOrigin: 'left', boxShadow: `0 0 40px rgba(226,194,125,0.45), 8px 8px 0 ${PINK}`}} /> : null}
							<div style={{position: 'relative', fontFamily: display, fontSize: size, lineHeight: 0.98, color: key ? (box > 0.85 ? INK : '#f5dc98') : '#f6f0e8', opacity: Math.min(1, p * 2), transform: tf, filter: v === 'slam' ? `blur(${(1 - p) * 10}px)` : undefined, textShadow: key && box > 0.85 ? undefined : '0 8px 30px rgba(0,0,0,0.85)'}}>
								{w.replace(/[.,!]$/, '').toUpperCase()}
							</div>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

const Accent: React.FC<{c: Chunk}> = ({c}) => {
	const frame = useCurrentFrame();
	const kind = c.words.some(([w]) => norm(w) === 'acima') ? 'arrow' : c.words.some(([w]) => /\?$/.test(w)) ? 'question' : (['bar', 'ring', 'brackets', 'bar', 'dots'] as const)[c.i % 5];
	const p = interpolate(frame, [2, 14], [0, 1], {...clamp, easing: easeOut});
	const out = interpolate(frame, [c.to - c.from - 5, c.to - c.from], [1, 0], clamp);
	return (
		<AbsoluteFill style={{pointerEvents: 'none', justifyContent: 'center', alignItems: 'center', opacity: out}}>
			{kind === 'bar' ? <div style={{position: 'absolute', top: 1180, width: 520 * p, height: 8, background: PINK, boxShadow: `0 0 24px ${PINK}`}} /> : null}
			{kind === 'ring' ? <div style={{position: 'absolute', width: 300 + 600 * p, height: 300 + 600 * p, borderRadius: '50%', border: `${3 * (1 - p) + 1}px solid ${PINK}`, opacity: 1 - p}} /> : null}
			{kind === 'brackets' ? [-1, 1].map((d) => <div key={d} style={{position: 'absolute', top: 760, height: 400, width: 60, left: d < 0 ? 40 - (1 - p) * 100 : undefined, right: d > 0 ? 40 - (1 - p) * 100 : undefined, borderTop: `6px solid ${PINK}`, borderBottom: `6px solid ${PINK}`, [d < 0 ? 'borderLeft' : 'borderRight']: `6px solid ${PINK}`}} />) : null}
			{kind === 'dots' ? [0, 1, 2].map((k) => <div key={k} style={{position: 'absolute', top: 1190, left: 480 + k * 44, width: 20, height: 20, borderRadius: 20, background: k === 1 ? GOLD : PINK, transform: `scale(${interpolate(frame, [2 + k * 3, 10 + k * 3], [0, 1], clamp)})`}} />) : null}
			{kind === 'arrow' ? <svg width={220} height={300} style={{position: 'absolute', top: 470, transform: `translateY(${(1 - p) * 120}px)`, opacity: p}}><path d="M110 10 L200 120 L140 120 L140 290 L80 290 L80 120 L20 120 Z" fill={GOLD} stroke={PINK} strokeWidth={6} /></svg> : null}
			{kind === 'question' ? <div style={{position: 'absolute', top: 360, fontFamily: display, fontSize: 380, color: 'rgba(255,46,136,0.2)', transform: `scale(${0.8 + 0.2 * p}) rotate(${(1 - p) * 20}deg)`}}>?</div> : null}
		</AbsoluteFill>
	);
};

const Badge: React.FC<{status: string; source: string}> = ({status, source}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = spring({frame: frame - 6, fps, config: {damping: 10, mass: 0.5}});
	const col = statusColor[status as Status] ?? '#ffb347';
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: 1380, display: 'flex', justifyContent: 'center'}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 14, transform: `scale(${interpolate(p, [0, 1], [1.6, 1])}) rotate(${(1 - p) * -6}deg)`, opacity: Math.min(1, p * 2), background: 'rgba(0,0,0,0.78)', border: `2px solid ${col}`, padding: '10px 18px'}}>
				<div style={{fontFamily: mono, fontWeight: 700, fontSize: 28, color: '#000', background: col, padding: '4px 12px', letterSpacing: 2}}>● {status}</div>
				<div style={{fontFamily: mono, fontSize: 24, color: '#f1ece4', letterSpacing: 2}}>{source}</div>
			</div>
		</div>
	);
};

// ── Gancho: flashes de imagem + palavra/número gigante ────────
const Hook: React.FC<{h: ZoneConfig['hook']; dur: number}> = ({h, dur}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const cur = [...h.flashes].reverse().find(([, at]) => frame >= at) ?? h.flashes[0];
	const since = frame - cur[1];
	const bigAt = h.flashes[1]?.[1] ?? 18;
	const smallAt = h.flashes[2]?.[1] ?? 36;
	const big = spring({frame: frame - bigAt, fps, config: {damping: 9, mass: 0.6}});
	const shake = since < 8 ? (random(`h${frame}`) - 0.5) * 34 * (1 - since / 8) : 0;
	return (
		<AbsoluteFill style={{background: INK, transform: `translate(${shake}px, ${shake * 0.6}px)`, opacity: interpolate(frame, [dur - 3, dur], [1, 0], clamp)}}>
			<Img src={staticFile(`media/${cur[0]}`)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.25 - Math.min(since, 30) * 0.004})`, filter: 'brightness(0.4) contrast(1.15) saturate(0.9)'}} />
			<AbsoluteFill style={{background: `linear-gradient(180deg, ${INK}cc, transparent 40%, ${INK}dd)`}} />
			{since < 3 ? <AbsoluteFill style={{background: '#fff', opacity: 0.6 * (1 - since / 3)}} /> : null}
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
				<div style={{fontFamily: display, fontSize: 84, color: '#f6f0e8', letterSpacing: 8, opacity: interpolate(frame, [2, 8], [0, 1], clamp), transform: `translateY(${interpolate(frame, [2, 10], [-40, 0], clamp)}px)`}}>{h.kicker}</div>
				<div style={{fontFamily: display, fontSize: 760, lineHeight: 0.9, transform: `scale(${interpolate(big, [0, 1], [2, 1])})`, opacity: Math.min(1, big * 2), ...GOLD_TEXT, filter: `drop-shadow(0 0 ${40 * big}px rgba(255,46,136,0.55))`}}>{h.big}</div>
				<div style={{fontFamily: display, fontSize: 190, color: '#f6f0e8', letterSpacing: interpolate(frame, [smallAt, smallAt + 40], [6, 24], clamp), opacity: frame >= smallAt ? 1 : 0, transform: `scale(${frame >= smallAt ? interpolate(frame, [smallAt, smallAt + 6], [1.4, 1], clamp) : 1})`, marginTop: -30}}>{h.small}</div>
				<div style={{marginTop: 30, background: PINK, padding: '8px 22px', fontFamily: mono, fontWeight: 700, fontSize: 36, color: '#fff', letterSpacing: 4, transform: `scaleX(${interpolate(frame, [h.lineAt, h.lineAt + 8], [0, 1], {...clamp, easing: easeOut})})`}}>{h.line}</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ── Virada seca: duas linhas gigantes + subtítulo ────────────
const Hook2: React.FC<{h: ZoneConfig['hook2']; dur: number}> = ({h, dur}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const a = spring({frame: frame - 2, fps, config: {damping: 10, mass: 0.6}});
	const b = spring({frame: frame - 12, fps, config: {damping: 10, mass: 0.6}});
	return (
		<AbsoluteFill style={{background: INK, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', opacity: interpolate(frame, [dur - 6, dur], [1, 0], clamp)}}>
			<div style={{position: 'absolute', width: 900, height: 900, background: 'radial-gradient(circle, rgba(255,46,136,0.18) 0%, transparent 60%)'}} />
			<div style={{fontFamily: display, fontSize: Math.min(170, 900 / (0.5 * h.lines[0].length)), color: '#f6f0e8', lineHeight: 1, transform: `translateX(${(1 - a) * -500}px)`, opacity: a, whiteSpace: 'nowrap'}}>{h.lines[0]}</div>
			<div style={{position: 'relative', marginTop: 10}}>
				<div style={{position: 'absolute', inset: '-2% -3% -4% -3%', background: 'linear-gradient(180deg, #f5dc98, #e2c27d 55%, #c9a24e)', transform: `scaleX(${b})`, transformOrigin: 'left', boxShadow: `10px 10px 0 ${PINK}`}} />
				<div style={{position: 'relative', fontFamily: display, fontSize: Math.min(170, 900 / (0.5 * h.lines[1].length)), color: INK, lineHeight: 1, padding: '0 20px', opacity: b, whiteSpace: 'nowrap'}}>{h.lines[1]}</div>
			</div>
			<div style={{marginTop: 40, fontFamily: mono, fontWeight: 700, fontSize: 34, color: '#f6f0e8', letterSpacing: 3, opacity: interpolate(frame, [h.subAt, h.subAt + 10], [0, 1], clamp)}}>{h.sub}</div>
		</AbsoluteFill>
	);
};

// ── Encerramento: o Z corta, a logo entra com anel e convite ──
const Outro: React.FC<{dur: number; tagAt: number}> = ({dur, tagAt}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const logo = spring({frame: frame - 8, fps, config: {damping: 10, mass: 0.7}});
	const ring = interpolate(frame, [8, 34], [0, 1], {...clamp, easing: easeOut});
	const name = spring({frame: frame - 18, fps, config: {damping: 12}});
	const sub = spring({frame: frame - (tagAt + 26), fps, config: {damping: 11}});
	return (
		<AbsoluteFill style={{background: INK, justifyContent: 'center', alignItems: 'center', opacity: interpolate(frame, [dur - 14, dur - 2], [1, 0], clamp)}}>
			<div style={{position: 'absolute', width: 1000, height: 1000, background: 'radial-gradient(circle, rgba(255,46,136,0.22) 0%, transparent 60%)'}} />
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34, marginTop: -40}}>
				<div style={{position: 'relative', width: 520, height: 520}}>
					<div style={{position: 'absolute', inset: -40, borderRadius: '50%', border: `4px solid ${PINK}`, transform: `scale(${0.6 + 0.6 * ring})`, opacity: 1 - ring}} />
					<div style={{position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', transform: `scale(${interpolate(logo, [0, 1], [0.2, 1])}) rotate(${(1 - logo) * -120}deg)`, boxShadow: `0 0 70px ${PINK}, 0 0 140px rgba(255,46,136,0.4)`, opacity: Math.min(1, logo * 2)}}>
						<Img src={staticFile(LOGO)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
					</div>
				</div>
				<div style={{fontFamily: display, fontSize: 120, letterSpacing: interpolate(name, [0, 1], [0, 10]), opacity: name, ...GOLD_TEXT}}>ZONE GTA VI</div>
				<div style={{fontFamily: mono, fontWeight: 700, fontSize: 32, color: '#f6f0e8', letterSpacing: 4, opacity: interpolate(frame, [tagAt, tagAt + 10], [0, 1], clamp)}}>ESSA HISTÓRIA ESTÁ APENAS COMEÇANDO</div>
				<div style={{background: PINK, color: '#fff', fontFamily: display, fontSize: 64, letterSpacing: 3, padding: '10px 36px', transform: `scale(${interpolate(sub, [0, 1], [0.4, 1])})`, opacity: Math.min(1, sub * 2), boxShadow: `8px 8px 0 ${GOLD}`}}>INSCREVA-SE</div>
			</div>
		</AbsoluteFill>
	);
};

// ── Composição do modelo ─────────────────────────────────────
type Ev = [src: string, frame: number, volume: number];
const X = (n: string) => `sfx/cine/${n}.wav`;

export const ZoneVideo: React.FC<{cfg: ZoneConfig}> = ({cfg}) => {
	const frame = useCurrentFrame();
	const segs = cfg.data.segments;
	const starts = React.useMemo(() => segs.reduce<number[]>((acc, _s, i) => [...acc, i === 0 ? 0 : acc[i - 1] + segs[i - 1].dur], []), [segs]);
	const total = starts[starts.length - 1] + segs[segs.length - 1].dur;
	const bodyFrom = starts[2];
	const bodyTo = starts[segs.length - 1];
	const keys = React.useMemo(() => new Set([...DEFAULT_KEYS, ...cfg.keywords].map(norm)), [cfg.keywords]);
	const chunks = React.useMemo((): Chunk[] => {
		const ws = cfg.data.words.filter(([, s]) => s >= bodyFrom - 4 && s < bodyTo);
		const out: Word[][] = [];
		let cur: Word[] = [];
		ws.forEach((w, i) => {
			cur.push(w);
			const next = ws[i + 1];
			const segBreak = next && starts.some((st) => st > w[1] && st <= next[1]);
			if (cur.length >= 3 || !next || next[1] - w[2] > 8 || /[.?!,]$/.test(w[0]) || segBreak) {
				out.push(cur);
				cur = [];
			}
		});
		return out.map((c, i) => ({words: c, from: c[0][1] - 2, to: (out[i + 1]?.[0][1] ?? c[c.length - 1][2] + 18) - 2, i}));
	}, [cfg.data.words, bodyFrom, bodyTo, starts]);
	const sfx = React.useMemo((): Ev[] => {
		const ev: Ev[] = [];
		const count: Record<string, number> = {};
		const pick = (names: string[], at: number, vol: number) => {
			const n = names.map(X).find((x) => (count[x] ?? 0) < 2);
			if (!n) return;
			count[n] = (count[n] ?? 0) + 1;
			ev.push([n, at, vol]);
		};
		const fl = cfg.hook.flashes;
		pick(['boom_a'], 0, 0.65);
		pick(['hit_a'], fl[1]?.[1] ?? 18, 0.6);
		pick(['hit_c'], fl[2]?.[1] ?? 36, 0.55);
		pick(['swell_a'], starts[1] - 40, 0.4);
		pick(['boom_b'], starts[1], 0.55);
		pick(['heartbeat'], starts[1] + 20, 0.5);
		segs.forEach((s, i) => {
			if (starts[i] < bodyFrom || starts[i] >= bodyTo) return;
			pick(['air_a', 'air_c', 'air_b', 'air_f', 'air_d', 'air_e'], starts[i] - 3, 0.35);
			if (s.status) {
				pick(['braam_a', 'braam_b', 'braam_c'], starts[i], 0.5);
				pick(['glint_a', 'glint_b', 'glint_c', 'glint_d'], starts[i] + 6, 0.3);
			}
		});
		chunks.forEach((c) => {
			if (c.words.some(([w]) => keys.has(norm(w)))) pick(['hit_b', 'hit_d', 'hit_e', 'hit_f', 'boom_c', 'swell_b', 'swell_c'], c.from + 2, 0.3);
		});
		pick(['rise_a'], bodyTo - 80, 0.35);
		pick(['finale'], bodyTo + 2, 0.6);
		return ev;
	}, [segs, starts, bodyFrom, bodyTo, chunks, keys, cfg.hook.flashes]);
	const musicVolume = (f: number) => {
		let dist = Infinity;
		for (const [a, b] of cfg.data.voice) {
			if (f >= a && f <= b) return 0.55;
			dist = Math.min(dist, f < a ? a - f : f - b);
		}
		return interpolate(dist, [0, 8], [0.55, 0.85], clamp);
	};
	const body = frame >= bodyFrom && frame < bodyTo;
	const outro = segs[segs.length - 1];
	return (
		<AbsoluteFill style={{backgroundColor: INK}}>
			<Sequence from={0} durationInFrames={segs[0].dur} name="gancho">
				<Hook h={cfg.hook} dur={segs[0].dur} />
			</Sequence>
			<Sequence from={starts[1]} durationInFrames={segs[1].dur} name="virada">
				<Hook2 h={cfg.hook2} dur={segs[1].dur} />
			</Sequence>
			<Sequence from={bodyFrom} durationInFrames={bodyTo - bodyFrom} name="corpo">
				<Background segs={segs} starts={starts} />
			</Sequence>
			{chunks.map((c) => (
				<Sequence key={c.i} from={c.from} durationInFrames={Math.max(6, c.to - c.from)} name={c.words.map(([w]) => w).join(' ')}>
					<Accent c={c} />
					<Kinetic c={c} keys={keys} />
				</Sequence>
			))}
			{segs.map((s, i) =>
				s.status && starts[i] >= bodyFrom && starts[i] < bodyTo ? (
					<Sequence key={`b${i}`} from={starts[i]} durationInFrames={s.dur} name="selo">
						<Badge status={s.status} source={s.source ?? ''} />
					</Sequence>
				) : null,
			)}
			<Sequence from={bodyTo} durationInFrames={total - bodyTo} name="encerramento">
				<Outro dur={total - bodyTo} tagAt={(outro.tagAt as number) ?? 70} />
			</Sequence>
			{/* Assinatura: Z cortando a tela nas viradas de trecho, na entrada do corpo e no encerramento. */}
			{starts.map((st, i) =>
				i >= 1 ? (
					<Sequence key={`z${i}`} from={st - 8} durationInFrames={18} name="z">
						<ZWipe dir={i % 2 ? -1 : 1} />
					</Sequence>
				) : null,
			)}
			{body ? (
				<>
					<div style={{position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16}}>
						<Img src={staticFile(LOGO)} style={{width: 66, height: 66, borderRadius: '50%', objectFit: 'cover', boxShadow: `0 0 18px ${PINK}`}} />
						<div style={{fontFamily: display, fontSize: 40, letterSpacing: 6, ...GOLD_TEXT}}>ZONE GTA VI</div>
					</div>
					{cfg.days !== null ? <div style={{position: 'absolute', right: 40, top: 312, fontFamily: mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: '#fff', background: PINK, padding: '6px 12px'}}>D-{cfg.days}</div> : null}
					<div style={{position: 'absolute', left: 80, right: 80, bottom: 300, height: 6, background: 'rgba(255,255,255,0.12)'}}>
						<div style={{height: '100%', width: `${((frame - bodyFrom) / (bodyTo - bodyFrom)) * 100}%`, background: `linear-gradient(90deg, ${PINK}, ${GOLD})`}} />
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, bottom: 250, textAlign: 'center', fontFamily: mono, fontSize: 20, color: 'rgba(241,236,228,0.5)', letterSpacing: 3}}>IMAGENS: ROCKSTAR GAMES</div>
				</>
			) : null}
			<Html5Audio src={staticFile(`music/${cfg.music}`)} volume={musicVolume} />
			<Sequence from={cfg.data.voStart} name="narracao">
				<Html5Audio src={staticFile(`vo/${cfg.vo}`)} volume={1} />
			</Sequence>
			{sfx.map(([src, at, vol], i) => (
				<Sequence key={i} from={Math.max(0, at)} durationInFrames={150} name={`sfx-${src}`}>
					<Html5Audio src={staticFile(src)} volume={vol} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};

export const zoneDuration = (d: ZoneData) => d.segments.reduce((a, s) => a + s.dur, 0);
