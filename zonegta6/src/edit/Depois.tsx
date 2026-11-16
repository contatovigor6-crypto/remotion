import React from 'react';
import {AbsoluteFill, Html5Audio, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ChannelLogo, LOGO} from '../faq/Fx';
import {C, mono, Status, statusColor} from '../theme';
import {BAR_H, Card, cine, DateCard, GOLD, IMG_H, Lux, Title} from './Filme';
import {Shot, Stat} from './Recorde';
import {Flare, GoldDust, GoldFrame, GoldWipe, Layered, LightLeak, Sheen, Triptych, Whip} from './Cine';
import data from './depois-timeline.json';
import {Countdown, CutLines, findTags, HudTags, Reticle, Ripple, Subtitles, Timecode, Word} from './Motion';

// Vídeo 7: "Depois do lançamento" — narrado pelo Marcio, em linguagem de trailer.
// Foco no gancho (primeiros 8 s) e num encerramento de marca profissional.
// Linha do tempo gerada da narração por scripts/depois_timeline.py.

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
type Seg = {
	kind: string;
	dur: number;
	file?: string;
	focus?: number;
	caption?: string | null;
	lines?: string[];
	text?: string[];
	big?: string;
	status?: string;
	source?: string;
	small?: boolean;
	rest?: boolean;
	flashes?: Array<[string, number]>;
	lineAt?: number;
	dropAt?: number;
	subAt?: number;
	tagAt?: number;
	fx?: string;
	dir?: 1 | -1;
	open?: boolean;
	panels?: Array<{file: string; focus: number; label: string; at: number}>;
};
const segs = data.segments as unknown as Seg[];
const starts = segs.reduce<number[]>((acc, _s, i) => [...acc, i === 0 ? 0 : acc[i - 1] + segs[i - 1].dur], []);
export const DEPOIS_DURATION = starts[starts.length - 1] + segs[segs.length - 1].dur;
const startOf = (kind: string) => starts[segs.findIndex((s) => s.kind === kind)];

// Letras surgindo do desfoque, uma a uma.
export const Letters: React.FC<{text: string; at: number; speed?: number; style: React.CSSProperties}> = ({text, at, speed = 1.4, style}) => {
	const frame = useCurrentFrame();
	// Gradiente de texto (folha de ouro) precisa ir em cada letra, pois elas animam separadas.
	const {backgroundImage, WebkitBackgroundClip, WebkitTextFillColor, ...rest} = style;
	const gold: React.CSSProperties = backgroundImage ? {backgroundImage, WebkitBackgroundClip, WebkitTextFillColor} : {};
	return (
		<div style={{whiteSpace: 'pre', ...rest}}>
			{text.split('').map((ch, k) => {
				const o = interpolate(frame, [at + k * speed, at + k * speed + 8], [0, 1], clamp);
				return (
					<span key={k} style={{opacity: o, filter: `blur(${(1 - o) * 8}px)`, display: 'inline-block', transform: `translateY(${(1 - o) * 12}px)`, ...gold}}>
						{ch}
					</span>
				);
			})}
		</div>
	);
};

// ── GANCHO 1: "Faltam apenas TRÊS DIAS" ──────────────────────
// Tela cheia (sem faixas), três flashes de imagem nos tempos de "faltam / três / dias",
// número dourado gigante batendo com tremor e um feixe de luz cruzando.
export const Hook: React.FC<{s: Seg}> = ({s}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const flashes = s.flashes ?? [];
	const cur = [...flashes].reverse().find(([, at]) => frame >= at) ?? flashes[0];
	const sinceCut = frame - cur[1];
	const num = spring({frame: frame - (flashes[1]?.[1] ?? 0), fps, config: {damping: 9, mass: 0.6}});
	const shake = sinceCut < 8 ? (random(`hk${frame}`) - 0.5) * 30 * (1 - sinceCut / 8) : 0;
	const streak = interpolate(frame, [(flashes[2]?.[1] ?? 30) - 2, (flashes[2]?.[1] ?? 30) + 16], [-60, 160], clamp);
	return (
		<AbsoluteFill style={{background: '#000', transform: `translate(${shake}px, ${shake * 0.6}px)`}}>
			<AbsoluteFill>
				<Img src={staticFile(`media/${cur[0]}`)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.25 - Math.min(sinceCut, 30) * 0.004})`, filter: 'brightness(0.42) contrast(1.15) saturate(0.85)'}} />
				<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.75), rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.85))'}} />
				{sinceCut < 3 ? <AbsoluteFill style={{background: '#fff', opacity: 0.6 * (1 - sinceCut / 3)}} /> : null}
			</AbsoluteFill>
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
				<Letters text="FALTAM APENAS" at={2} speed={1.2} style={{fontFamily: cine, fontWeight: 700, fontSize: 64, color: '#f1ece4', letterSpacing: 14}} />
				<div style={{position: 'relative', fontFamily: cine, fontWeight: 900, fontSize: 720, lineHeight: 1, transform: `scale(${interpolate(num, [0, 1], [1.8, 1])})`, opacity: Math.min(1, num * 2), backgroundImage: 'linear-gradient(180deg, #fff6dc 0%, #e2c27d 50%, #8a6a35 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: `drop-shadow(0 0 ${40 * num}px rgba(226,194,125,0.55))`}}>
					3
				</div>
				<div style={{fontFamily: cine, fontWeight: 700, fontSize: 140, color: '#f1ece4', letterSpacing: interpolate(frame, [(flashes[2]?.[1] ?? 30), 120], [10, 30], clamp), opacity: frame >= (flashes[2]?.[1] ?? 30) ? 1 : 0, marginTop: -40}}>DIAS</div>
				<div style={{marginTop: 40}}>
					<Letters text="PARA O LANÇAMENTO DE GTA VI" at={s.lineAt ?? 50} speed={0.9} style={{fontFamily: cine, fontWeight: 400, fontSize: 44, color: '#c9a86a', letterSpacing: 8}} />
				</div>
			</AbsoluteFill>
			{/* Feixe de luz cruzando o número. */}
			<div style={{position: 'absolute', top: 0, bottom: 0, width: 260, left: `${streak}%`, background: 'linear-gradient(90deg, transparent, rgba(255,240,210,0.35), transparent)', transform: 'skewX(-18deg)', mixBlendMode: 'screen'}} />
		</AbsoluteFill>
	);
};

// ── GANCHO 2: corte seco para o preto, "MAS EXISTE UMA PERGUNTA" ──
export const Hook2: React.FC<{s: Seg}> = ({s}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#000', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 30, opacity: interpolate(frame, [s.dur - 8, s.dur], [1, 0], clamp)}}>
			<div style={{position: 'absolute', width: 1000, height: 420, background: 'radial-gradient(ellipse, rgba(201,168,106,0.14) 0%, transparent 65%)'}} />
			<Letters text="MAS EXISTE" at={3} speed={1.6} style={{fontFamily: cine, fontWeight: 700, fontSize: 78, color: '#f1ece4', letterSpacing: 8, transform: `scale(${1 + frame * 0.0008})`}} />
			<Letters text="UMA PERGUNTA" at={14} speed={1.6} style={{fontFamily: cine, fontWeight: 900, fontSize: 86, color: '#e2c27d', letterSpacing: 6, transform: `scale(${1 + frame * 0.0008})`}} />
			<div style={{height: 2, width: interpolate(frame, [26, 60], [0, 420], clamp), background: 'linear-gradient(90deg, transparent, #c9a86a, transparent)'}} />
			<Letters text="que muita gente ainda não está fazendo" at={s.subAt ?? 48} speed={0.7} style={{fontFamily: cine, fontSize: 34, color: '#b9b2a6', letterSpacing: 2}} />
		</AbsoluteFill>
	);
};

// ── A pergunta central, grande, sobre a imagem ───────────────
const Question: React.FC<{s: Seg; index: number}> = ({s, index}) => {
	const frame = useCurrentFrame();
	const lines = s.text ?? [];
	let delay = 4;
	return (
		<AbsoluteFill>
			{s.fx === 'parallax' ? <Layered file={s.file ?? ''} focus={s.focus ?? 0.5} dur={s.dur} mode="parallax" /> : <Shot s={{...s, caption: null}} index={index} />}
			<AbsoluteFill style={{background: 'rgba(0,0,0,0.35)', opacity: interpolate(frame, [0, 10], [0, 1], clamp)}} />
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
				{lines.map((l, i) => {
					const at = delay;
					delay += l.length * 1.1 + 4;
					return <Letters key={l} text={l} at={at} speed={1.1} style={{fontFamily: cine, fontWeight: 900, fontSize: 68, color: i === lines.length - 1 ? '#e2c27d' : '#f1ece4', letterSpacing: 5, lineHeight: 1.25, textShadow: '0 6px 30px rgba(0,0,0,0.9)'}} />;
				})}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ── Citação (aspas grandes douradas + fonte) ─────────────────
const Quote: React.FC<{s: Seg}> = ({s}) => {
	const frame = useCurrentFrame();
	const col = statusColor[(s.status ?? 'CONFIRMADO') as Status] ?? C.amber;
	return (
		<AbsoluteFill style={{background: '#000', justifyContent: 'center', alignItems: 'center', opacity: interpolate(frame, [s.dur - 10, s.dur], [1, 0], clamp)}}>
			<div style={{position: 'absolute', width: 1100, height: 560, background: 'radial-gradient(ellipse, rgba(201,168,106,0.18) 0%, transparent 65%)'}} />
			<div style={{textAlign: 'center', transform: `scale(${1 + frame * 0.0007})`}}>
				{(s.lines ?? []).map((l, i) => (
					<Letters key={l} text={l} at={4 + i * 22} speed={1} style={{fontFamily: cine, fontWeight: 700, fontSize: 72, color: '#f1ece4', letterSpacing: 4, lineHeight: 1.35, ...GOLD}} />
				))}
				<div style={{height: 2, width: interpolate(frame, [30, 60], [0, 460], clamp), background: 'linear-gradient(90deg, transparent, #c9a86a, transparent)', margin: '30px auto'}} />
				<div style={{display: 'inline-flex', alignItems: 'center', gap: 16, opacity: interpolate(frame, [44, 54], [0, 1], clamp)}}>
					<div style={{fontFamily: mono, fontWeight: 700, fontSize: 26, letterSpacing: 3, color: '#000', background: col, padding: '6px 14px'}}>● {s.status}</div>
					<div style={{fontFamily: mono, fontSize: 24, color: '#b9b2a6', letterSpacing: 3}}>FONTE: {s.source}</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ── Encerramento de marca ────────────────────────────────────
// Feixes de luz giram atrás da logo, nome do canal abre o espaçamento, a frase final
// entra na palavra "essa", o convite para se inscrever surge num quadro dourado e a
// tela fecha no preto com o crédito.
export const Outro: React.FC<{s: Seg}> = ({s}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const name = spring({frame: frame - 18, fps, config: {damping: 14}});
	const tagAt = s.tagAt ?? 70;
	const sub = spring({frame: frame - (tagAt + 30), fps, config: {damping: 13}});
	const end = interpolate(frame, [s.dur - 18, s.dur - 2], [1, 0], clamp);
	return (
		<AbsoluteFill style={{background: '#000', justifyContent: 'center', alignItems: 'center', opacity: end}}>
			<div style={{position: 'absolute', width: 1600, height: 1600, background: 'repeating-conic-gradient(rgba(226,194,125,0.10) 0deg 3deg, transparent 3deg 15deg)', transform: `rotate(${frame * 0.25}deg)`, maskImage: 'radial-gradient(circle, black 8%, transparent 55%)', opacity: interpolate(frame, [0, 20], [0, 1], clamp)}} />
			<div style={{position: 'absolute', width: 900, height: 900, background: 'radial-gradient(circle, rgba(255,46,136,0.20) 0%, transparent 60%)'}} />
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34, marginTop: -60}}>
				<ChannelLogo at={2} size={520} />
				<div style={{fontFamily: cine, fontWeight: 900, fontSize: 92, color: '#f1ece4', letterSpacing: interpolate(name, [0, 1], [2, 16]), opacity: name, ...GOLD}}>ZONE GTA VI</div>
				<Letters text="ESSA HISTÓRIA ESTÁ APENAS COMEÇANDO" at={tagAt} speed={0.8} style={{fontFamily: cine, fontSize: 32, color: '#c9a86a', letterSpacing: 5}} />
				<div style={{marginTop: 16, opacity: sub, transform: `translateY(${(1 - sub) * 30}px)`, border: '2px solid #c9a86a', padding: '14px 30px', fontFamily: cine, fontWeight: 700, fontSize: 30, color: '#f1ece4', letterSpacing: 5, whiteSpace: 'nowrap', boxShadow: `0 0 ${20 + 10 * Math.sin(frame / 6)}px rgba(226,194,125,0.35)`}}>
					INSCREVA-SE · ATIVE AS NOTIFICAÇÕES
				</div>
			</div>
			<div style={{position: 'absolute', top: 1660, fontFamily: cine, fontSize: 18, color: '#8d867b', letterSpacing: 3, textAlign: 'center', lineHeight: 1.7, opacity: interpolate(frame, [tagAt + 40, tagAt + 54], [0, 1], clamp)}}>
				IMAGENS&nbsp;&nbsp;ROCKSTAR GAMES&nbsp;&nbsp;·&nbsp;&nbsp;EDIÇÃO E TRILHA ORIGINAL&nbsp;&nbsp;ZONE GTA VI
			</div>
		</AbsoluteFill>
	);
};

// ── Sound design cinematográfico (public/sfx/cine), máx. 2 usos por efeito ──
type Ev = [src: string, frame: number, volume: number, why: string];
const X = (n: string) => `sfx/cine/${n}.wav`;
const POOLS: Record<string, string[]> = {
	transition: ['air_a', 'air_c', 'air_b', 'air_f', 'air_d', 'air_e'].map(X),
	cardIn: ['braam_b', 'braam_c', 'braam_a', 'boom_c'].map(X),
	caption: ['glint_a', 'glint_b', 'glint_c', 'glint_d'].map(X),
	swell: ['swell_a', 'swell_b', 'swell_c'].map(X),
	hit: ['hit_a', 'hit_b', 'hit_c', 'hit_d', 'hit_e', 'hit_f'].map(X),
};
const buildSfx = (): Ev[] => {
	const ev: Ev[] = [];
	const count: Record<string, number> = {};
	const use = (src: string, at: number, vol: number, why: string) => {
		count[src] = (count[src] ?? 0) + 1;
		ev.push([src, at, vol, why]);
	};
	const take = (pool: string, at: number, vol: number, why: string) => {
		const pick = POOLS[pool].find((x) => (count[x] ?? 0) < 2);
		if (pick) use(pick, at, vol, why);
	};
	const fixed = (names: string[], at: number, vol: number, why: string) => {
		const pick = names.map(X).find((x) => (count[x] ?? 0) < 2);
		if (pick) use(pick, at, vol, why);
	};
	// GANCHO: um golpe por palavra, feixe de luz e corte seco para o silêncio.
	const hook = segs[0];
	const fl = hook.flashes ?? [];
	fixed(['boom_a'], 0, 0.65, 'gancho: FALTAM');
	fixed(['hit_a'], fl[1]?.[1] ?? 19, 0.6, 'gancho: o 3 bate na tela');
	fixed(['hit_c'], fl[2]?.[1] ?? 37, 0.55, 'gancho: DIAS');
	fixed(['air_c'], (fl[2]?.[1] ?? 37) - 2, 0.35, 'feixe de luz cruzando o número');
	fixed(['swell_a'], (hook.dropAt ?? 126) - 40, 0.4, 'sucção antes do corte para o preto');
	fixed(['boom_b'], hook.dropAt ?? 126, 0.55, 'corte seco: MAS EXISTE UMA PERGUNTA');
	fixed(['heartbeat'], (hook.dropAt ?? 126) + 20, 0.5, 'silêncio com batimento');
	segs.forEach((s, i) => {
		const at = starts[i];
		if (s.kind === 'question') {
			fixed(['braam_a'], at, 0.55, 'a pergunta central');
			fixed(['tension'], at + 10, 0.3, 'cordas em tensão sob a pergunta');
		}
		if (s.kind === 'stat' || s.kind === 'quote') {
			take('swell', at - 30, 0.38, 'sucção antes do dado');
			take('cardIn', at, 0.5, 'dado aparece');
			take('caption', at + 40, 0.28, 'selo de verificação');
		}
		if (s.kind === 'date') fixed(['rise_b'], at - 70, 0.35, 'subida até a data');
		if (s.kind === 'triptych') (s.panels ?? []).forEach((pn, k) => fixed([['hit_b', 'hit_d', 'hit_f'][k], 'hit_a', 'hit_c'], at + pn.at, 0.45, `painel ${pn.label}`));
		if (s.kind === 'title') fixed(['boom_c', 'hit_f'], at, 0.6, 'título: começa uma nova era');
		if (s.kind === 'logo') {
			fixed(['rise_a'], at - 80, 0.35, 'subida até a logo');
			fixed(['finale'], at + 2, 0.6, 'logo do canal: acorde final');
			fixed(['glint_d', 'glint_c'], at + (s.tagAt ?? 70), 0.3, 'frase final');
			fixed(['hit_e', 'hit_d'], at + (s.tagAt ?? 70) + 30, 0.4, 'convite para se inscrever');
		}
	});
	segs.forEach((s, i) => {
		const at = starts[i];
		if (s.kind === 'shot' && i > 2) take('transition', at - 4, 0.3, 'passagem entre planos');
		if (s.caption) take('caption', at + 10, 0.26, `legenda ${s.caption}`);
		if (s.kind === 'card') take('cardIn', at, 0.4, `cartela ${(s.lines ?? []).join(' ')}`);
		if (s.kind === 'shot' && !s.caption) take('hit', at, 0.25, 'corte de plano');
	});
	for (const [n, c] of Object.entries(count)) if (c > 2) throw new Error(`Efeito "${n}" usado mais de 2 vezes`);
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

// Transições de lente: vazamento de luz na entrada dos dados, queima de película antes
// das viradas e reflexo anamórfico no título e na revelação final.
const fxOverlays: Array<[string, number]> = segs.flatMap((s, i): Array<[string, number]> => {
	const at = starts[i];
	if (s.kind === 'stat') return [['leak', at - 12]];
	if (s.kind === 'card' || s.kind === 'date') return [['wipe', at - 9]];
	if (s.kind === 'shot' || s.kind === 'question') return [['sheen', at + 16]];
	if (s.kind === 'title') return [['flare', at + 2]];
	if (s.open) return [['flareLow', at + 20]];
	if (s.kind === 'triptych') return [['leak', at - 8]];
	return [];
});

// Aberração cromática (franja vermelha/azul) por poucos frames nos impactos.
const impacts = [0, ...(segs[0].flashes ?? []).map(([, at]) => at), ...segs.flatMap((s, i) => (['stat', 'quote', 'question', 'title'].includes(s.kind) ? [starts[i]] : []))];
const aberration = (f: number) => {
	const d = impacts.map((at) => f - at).filter((x) => x >= 0 && x < 7)[0];
	if (d === undefined) return undefined;
	const k = (1 - d / 7) * 9;
	return `drop-shadow(${k}px 0 0 rgba(255,0,70,0.55)) drop-shadow(${-k}px 0 0 rgba(0,190,255,0.55))`;
};

// ── Camada de motion graphics ────────────────────────────────
const words = data.words as unknown as Word[];
const hudTags = findTags(words, [
	{label: 'ROCKSTAR GAMES', match: ['rockstar']},
	{label: 'TAKE-TWO INTERACTIVE', match: ['take']},
	{label: 'INVESTIDORES · 9/11', match: ['investidores']},
	{label: 'LANÇAMENTO · 19/11', match: ['19'], after: 800},
	{label: 'PRÉ-VENDAS ↑', match: ['acima']},
	{label: 'GTA ONLINE', match: ['gta', 'online']},
	{label: 'COMUNIDADE ATIVA', match: ['comunidade']},
	{label: 'PÓS-LANÇAMENTO', match: ['periodo']},
	{label: 'NOVA ERA', match: ['nova', 'era'], after: 2500},
]);
const windowSegs = segs.map((s, i) => ({s, i})).filter(({s}) => s.kind === 'shot' || s.kind === 'question');
// Sem legenda onde a tela já mostra a mesma frase em destaque ou onde ela cobriria a tela dividida.
const noSubs = segs.flatMap((s, i): Array<[number, number]> => (['question', 'triptych', 'title', 'date'].includes(s.kind) ? [[starts[i], starts[i] + s.dur]] : []));
const rippleAt = segs.flatMap((s, i) => (['stat', 'quote', 'question', 'title', 'triptych'].includes(s.kind) ? [starts[i]] : []));

export const Depois: React.FC = () => {
	const frame = useCurrentFrame();
	const fullScreen = frame < startOf('question');
	return (
		<Lux.Provider value>
		<AbsoluteFill style={{backgroundColor: '#000', filter: aberration(frame)}}>
			{segs.map((s, i) => (
				<Sequence key={i} from={starts[i]} durationInFrames={s.dur} name={s.file ?? s.kind}>
					{s.kind === 'hook' ? <Hook s={s} /> : null}
					{s.kind === 'hook2' ? <Hook2 s={s} /> : null}
					{s.kind === 'question' ? <Question s={s} index={i} /> : null}
					{s.kind === 'shot' && (s.fx === 'parallax' || s.fx === 'dolly') ? <Layered file={s.file ?? ''} focus={s.focus ?? 0.5} dur={s.dur} mode={s.fx === 'dolly' ? 'dolly' : 'parallax'} open={s.open} caption={s.caption} /> : null}
					{s.kind === 'shot' && s.fx === 'whip' ? <Whip file={s.file ?? ''} focus={s.focus ?? 0.5} dur={s.dur} dir={s.dir ?? 1} caption={s.caption} /> : null}
					{s.kind === 'shot' && !s.fx ? <Shot s={s} index={i} /> : null}
					{s.kind === 'triptych' ? <Triptych panels={s.panels ?? []} dur={s.dur} /> : null}
					{s.kind === 'card' ? <Card lines={s.lines ?? []} small={s.small} dur={s.dur} /> : null}
					{s.kind === 'stat' ? <Stat s={s} /> : null}
					{s.kind === 'quote' ? <Quote s={s} /> : null}
					{s.kind === 'date' ? <DateCard dur={s.dur} /> : null}
					{s.kind === 'title' ? <Title dur={s.dur} /> : null}
					{s.kind === 'logo' ? <Outro s={s} /> : null}
				</Sequence>
			))}
			{segs.map((s, i) =>
				(s.kind === 'shot' && !s.open) || s.kind === 'question' ? (
					<Sequence key={`gf${i}`} from={starts[i]} durationInFrames={s.dur} name="moldura">
						<GoldFrame dur={s.dur} />
					</Sequence>
				) : null,
			)}
			{!fullScreen ? <GoldDust /> : null}
			{windowSegs.map(({s, i}) => (
				<Sequence key={`mo${i}`} from={starts[i]} durationInFrames={s.dur} name="motion-plano">
					<Reticle focus={s.focus ?? 0.5} dur={s.dur} open={s.open} />
					{!s.open ? <Timecode start={starts[i]} /> : null}
					<CutLines />
				</Sequence>
			))}
			{rippleAt.map((at, k) => (
				<Sequence key={`rp${k}`} from={at} durationInFrames={40} name="onda">
					<Ripple />
				</Sequence>
			))}
			<HudTags tags={hudTags} />
			<Subtitles words={words} from={startOf('question')} to={startOf('logo')} hide={noSubs} />
			{!fullScreen && frame < startOf('logo') ? <Countdown days={3} /> : null}
			{fxOverlays.map(([kind, at], k) => (
				<Sequence key={`fx${k}`} from={Math.max(0, at)} durationInFrames={40} name={`fx-${kind}`}>
					{kind === 'leak' ? <LightLeak /> : kind === 'wipe' ? <GoldWipe /> : kind === 'sheen' ? <Sheen /> : <Flare y={kind === 'flareLow' ? 1300 : 960} />}
				</Sequence>
			))}
			<AbsoluteFill style={{pointerEvents: 'none', opacity: 0.08, mixBlendMode: 'overlay'}}>
				<svg width="100%" height="100%">
					<filter id="grain">
						<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={Math.floor(random(`g${frame}`) * 1000)} />
						<feColorMatrix type="saturate" values="0" />
					</filter>
					<rect width="100%" height="100%" filter="url(#grain)" />
				</svg>
			</AbsoluteFill>
			{/* Marca do canal e crédito; o gancho fica em tela cheia, sem marca. */}
			{!fullScreen && frame < startOf('logo') ? (
				<>
					<div style={{position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, opacity: 0.9}}>
						<Img src={staticFile(LOGO)} style={{width: 70, height: 70, borderRadius: '50%', objectFit: 'cover'}} />
						<div style={{fontFamily: cine, fontWeight: 700, fontSize: 30, color: '#f1ece4', letterSpacing: 10, ...GOLD}}>ZONE GTA VI</div>
					</div>
					<div style={{position: 'absolute', top: BAR_H + IMG_H + 235, left: 0, right: 0, textAlign: 'center', fontFamily: cine, fontSize: 20, color: '#8d867b', letterSpacing: 6}}>IMAGENS: ROCKSTAR GAMES · GTA VI E GTA ONLINE</div>
				</>
			) : null}
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
		</Lux.Provider>
	);
};
