import React from 'react';
import {AbsoluteFill, Html5Audio, Img, interpolate, OffthreadVideo, random, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {LOGO} from '../faq/Fx';
import {C, mono, statusColor, Status} from '../theme';
import {BAR_H, Card, cine, DateCard, fadeInOut, IMG_H, LogoCard, Title, tracking} from './Filme';
import data from './recorde-timeline.json';

// Vídeo 6: "Recorde" — narrado pelo Marcio, em linguagem de trailer de cinema.
// Linha do tempo gerada da narração por scripts/recorde_timeline.py.

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
type Seg = {
	kind: string;
	dur: number;
	file?: string;
	focus?: number;
	caption?: string | null;
	lines?: string[];
	big?: string;
	status?: string;
	source?: string;
	theme?: string;
	fast?: boolean;
	overlay?: {text: string[]; dur: number};
};
const segs = data.segments as Seg[];
const starts = segs.reduce<number[]>((acc, _s, i) => [...acc, i === 0 ? 0 : acc[i - 1] + segs[i - 1].dur], []);
export const RECORDE_DURATION = starts[starts.length - 1] + segs[segs.length - 1].dur;

// Plano: janela de cinema centrada no assunto; aceita imagem ou vídeo.
const Shot: React.FC<{s: Seg; index: number}> = ({s, index}) => {
	const frame = useCurrentFrame();
	const fast = Boolean(s.fast);
	const focus = s.focus ?? 0.5;
	const scale = fast ? 1.03 + frame * 0.004 : interpolate(frame, [0, s.dur], index % 2 ? [1.08, 1.0] : [1.0, 1.08]);
	const style: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${focus * 100}% 50%`, transform: `scale(${scale})`, transformOrigin: `${focus * 100}% 50%`, filter: 'contrast(1.1) saturate(0.95)'};
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: BAR_H, height: IMG_H, overflow: 'hidden', opacity: fast ? 1 : fadeInOut(frame, s.dur, 7)}}>
				{s.file?.endsWith('.mp4') ? <OffthreadVideo muted src={staticFile(`media/${s.file}`)} style={style} /> : <Img src={staticFile(`media/${s.file}`)} style={style} />}
				<AbsoluteFill style={{background: 'linear-gradient(180deg, #0a2a3a, #3a1a05)', mixBlendMode: 'soft-light', opacity: 0.4}} />
				<AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />
				{fast && frame < 1 ? <AbsoluteFill style={{background: '#fff', opacity: 0.45}} /> : null}
			</div>
			{s.caption ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: BAR_H + IMG_H + 44, textAlign: 'center', opacity: fadeInOut(frame, s.dur, 10)}}>
					<div style={{height: 2, width: 120, background: '#c9a86a', margin: '0 auto 18px'}} />
					<div style={{fontFamily: cine, fontWeight: 700, fontSize: s.caption.length > 20 ? 42 : 52, color: '#f1ece4', letterSpacing: tracking(frame, s.dur, 6, 11), padding: '0 40px'}}>{s.caption}</div>
				</div>
			) : null}
		</AbsoluteFill>
	);
};

// Cartela de dado: número grande dourado, texto em duas linhas e selo de verificação.
const Stat: React.FC<{s: Seg}> = ({s}) => {
	const frame = useCurrentFrame();
	const glow = interpolate(frame, [0, 8, 40], [0, 1, 0.5], clamp);
	const big = interpolate(frame, [0, 14], [1.25, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
	const col = statusColor[(s.status ?? 'CONFIRMADO') as Status];
	return (
		<AbsoluteFill style={{background: '#000', justifyContent: 'center', alignItems: 'center', opacity: interpolate(frame, [s.dur - 10, s.dur], [1, 0], clamp)}}>
			<div style={{position: 'absolute', width: 1100, height: 600, background: 'radial-gradient(ellipse, rgba(201,168,106,0.22) 0%, transparent 65%)', opacity: glow}} />
			<div style={{textAlign: 'center'}}>
				<div style={{fontFamily: cine, fontWeight: 900, fontSize: s.big && s.big.length > 3 ? 230 : 300, lineHeight: 1.05, transform: `scale(${big})`, backgroundImage: 'linear-gradient(180deg, #fff3d6 0%, #c9a86a 55%, #8a6a35 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{s.big}</div>
				{(s.lines ?? []).map((l, i) => (
					<div key={l} style={{fontFamily: cine, fontWeight: i === 0 ? 700 : 400, fontSize: i === 0 ? 56 : 38, color: i === 0 ? '#f1ece4' : '#b9b2a6', letterSpacing: tracking(frame, s.dur, 4, 8), lineHeight: 1.5, opacity: interpolate(frame, [10 + i * 8, 22 + i * 8], [0, 1], clamp), whiteSpace: 'nowrap'}}>
						{l}
					</div>
				))}
				<div style={{height: 2, width: interpolate(frame, [16, 50], [0, 520], clamp), background: 'linear-gradient(90deg, transparent, #c9a86a, transparent)', margin: '26px auto 26px'}} />
				<div style={{display: 'inline-flex', alignItems: 'center', gap: 16, opacity: interpolate(frame, [34, 44], [0, 1], clamp)}}>
					<div style={{fontFamily: mono, fontWeight: 700, fontSize: 26, letterSpacing: 3, color: '#000', background: col, padding: '6px 14px'}}>● {s.status}</div>
					<div style={{fontFamily: mono, fontSize: 24, color: '#b9b2a6', letterSpacing: 3}}>FONTE: {s.source}</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// Texto da pergunta por cima da montagem, letra a letra, na faixa inferior.
const Overlay: React.FC<{text: string[]; dur: number}> = ({text, dur}) => {
	const frame = useCurrentFrame();
	let n = 0;
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: BAR_H + IMG_H + 30, textAlign: 'center', opacity: interpolate(frame, [dur - 10, dur], [1, 0], clamp)}}>
			{text.map((l) => (
				<div key={l} style={{fontFamily: cine, fontWeight: 700, fontSize: 44, color: '#f1ece4', letterSpacing: 5, lineHeight: 1.45, whiteSpace: 'pre'}}>
					{l.split('').map((ch, k) => {
						const o = interpolate(frame, [6 + n * 1.6, 14 + n * 1.6], [0, 1], clamp);
						n++;
						return (
							<span key={k} style={{opacity: o, filter: `blur(${(1 - o) * 6}px)`}}>
								{ch}
							</span>
						);
					})}
				</div>
			))}
		</div>
	);
};

// ── Sound design: sempre presente, o melhor som para cada momento ──
// Biblioteca: public/sfx/v2 (44 sons) + public/sfx (originais do canal). Cada evento
// tem uma lista de sons em ordem de preferência; entra o primeiro que ainda não tocou
// 2 vezes. Assim nenhum efeito passa de 2 usos e todo momento tem som.
type Ev = [src: string, frame: number, volume: number, why: string];
const V2 = (n: string) => `sfx/v2/${n}.wav`;
const V1 = (n: string) => `sfx/${n}.wav`;
const POOLS: Record<string, string[]> = {
	shotIn: [V2('whoosh_a'), V2('whoosh_c'), V2('swish_f'), V2('whoosh_b'), V1('whoosh'), V2('whoosh_d'), V2('whoosh_e')],
	cardIn: [V1('subdrop'), V2('impact_d'), V2('reverse_cym'), V2('power_down'), V1('impact')],
	caption: [V2('blip_a'), V2('blip_c'), V2('check_c'), V2('blip_d'), V2('check_b'), V2('check_d'), V2('blip_b')],
	cut: [V2('impact_a'), V2('impact_b'), V2('impact_c'), V2('glitch_a'), V2('pop_b'), V2('click_a'), V2('pop_a'), V1('glitch'), V1('tick'), V2('glitch_b'), V2('toggle')],
	shimmer: [V2('notify'), V2('success'), V2('tally'), V2('check_a')],
};

const buildSfx = (): Ev[] => {
	const ev: Ev[] = [];
	const count: Record<string, number> = {};
	const take = (pool: string, at: number, vol: number, why: string) => {
		const pick = POOLS[pool].find((s) => (count[s] ?? 0) < 2);
		if (!pick) return;
		count[pick] = (count[pick] ?? 0) + 1;
		ev.push([pick, at, vol, why]);
	};
	// Momento específico: o som ideal primeiro, depois alternativas parecidas.
	const fixed = (src: string | string[], at: number, vol: number, why: string) => {
		const pick = (Array.isArray(src) ? src : [src]).find((x) => (count[x] ?? 0) < 2);
		if (!pick) throw new Error(`Sem efeito disponível para: ${why}`);
		count[pick] = (count[pick] ?? 0) + 1;
		ev.push([pick, at, vol, why]);
	};
	fixed(V2('stinger_intro'), 0, 0.5, 'abertura do vídeo');
	fixed([V2('impact_e'), V1('impact')], 2, 0.55, 'primeira imagem: marca histórica');
	// 1ª passada: momentos-chave reservam o som ideal antes de tudo.
	segs.forEach((s, i) => {
		const at = starts[i];
		if (s.kind === 'stat') {
			fixed(i < 5 ? [V1('riser'), V2('riser_b')] : [V2('riser_b'), V1('riser')], at - 40, 0.35, 'tensão antes do dado');
			take('cardIn', at, 0.5, 'dado aparece');
			take('shimmer', at + 34, 0.32, 'selo de verificação');
		}
		if (s.theme === 'gatilho') fixed([V2('toggle'), V2('click_a')], at + 4, 0.4, 'gatilho adaptável: clique de trava');
		if (s.theme === 'tatil') fixed(V2('power_up'), at + 2, 0.35, 'resposta tátil: vibração subindo');
		if (s.theme === 'tempest') {
			fixed(V2('scan'), at + 6, 0.4, 'áudio 3D: som varrendo de um lado ao outro');
			fixed(V2('cloud'), at + 26, 0.35, 'áudio 3D: brilho espacial');
		}
		if (s.theme === 'pergunta') fixed([V2('riser_a'), V1('riser'), V2('riser_b')], at + 4, 0.4, 'a pergunta: tensão antes da montagem');
		if (s.overlay) fixed(V2('typing'), at + 6, 0.2, 'letras da pergunta surgindo');
		if (s.lines?.[0] === 'PENSE NISSO.') fixed(V2('clock'), at + 4, 0.35, 'pausa para pensar: relógio');
		if (s.kind === 'date') {
			fixed([V2('whoosh_e'), V2('whoosh_d'), V1('whoosh')], at - 4, 0.4, 'passagem para a data');
			fixed(V2('download'), at + 30, 0.3, 'linha do pré-download');
		}
		if (s.kind === 'title') {
			fixed([V2('reverse_cym'), V2('riser_a'), V1('riser')], at - 24, 0.4, 'sucção antes do título');
			fixed([V1('impact'), V2('impact_e'), V2('impact_d')], at, 0.6, 'título GRAND THEFT AUTO VI');
		}
		if (s.kind === 'logo') {
			fixed(V2('stinger_final'), at + 2, 0.7, 'logo do canal');
			take('shimmer', at + 20, 0.3, 'INSCREVA-SE');
		}
	});

	// 2ª passada: sons de transição, cortes e legendas com o que sobrou.
	segs.forEach((s, i) => {
		const at = starts[i];
		if (s.kind === 'shot' && !s.fast && i > 0) take('shotIn', at - 3, 0.36, 'entrada de plano');
		if (s.kind === 'shot' && s.fast) take('cut', at, 0.42, 'corte da montagem');
		if (s.caption) take('caption', at + 10, 0.3, `legenda ${s.caption}`);
		if (s.kind === 'card') take('cardIn', at, 0.42, `cartela ${(s.lines ?? []).join(' ')}`);
	});
	return ev;
};
const sfx = buildSfx();

// Trilha abaixa enquanto o narrador fala e respira nas pausas.
const musicVolume = (f: number) => {
	let dist = Infinity;
	for (const [a, b] of data.voice) {
		if (f >= a && f <= b) return 0.3;
		dist = Math.min(dist, f < a ? a - f : f - b);
	}
	return interpolate(dist, [0, 8], [0.3, 0.62], clamp);
};

export const Recorde: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			{segs.map((s, i) => (
				<Sequence key={i} from={starts[i]} durationInFrames={s.dur} name={s.file ?? s.kind}>
					{s.kind === 'shot' ? <Shot s={s} index={i} /> : null}
					{s.kind === 'card' ? <Card lines={s.lines ?? []} dur={s.dur} /> : null}
					{s.kind === 'stat' ? <Stat s={s} /> : null}
					{s.kind === 'date' ? <DateCard dur={s.dur} /> : null}
					{s.kind === 'title' ? <Title dur={s.dur} /> : null}
					{s.kind === 'logo' ? <LogoCard dur={s.dur} /> : null}
				</Sequence>
			))}
			{segs.map((s, i) =>
				s.overlay ? (
					<Sequence key={`o${i}`} from={starts[i]} durationInFrames={s.overlay.dur} name="pergunta">
						<Overlay text={s.overlay.text} dur={s.overlay.dur} />
					</Sequence>
				) : null,
			)}
			{/* Grão de película */}
			<AbsoluteFill style={{pointerEvents: 'none', opacity: 0.09, mixBlendMode: 'overlay'}}>
				<svg width="100%" height="100%">
					<filter id="grain">
						<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={Math.floor(random(`g${frame}`) * 1000)} />
						<feColorMatrix type="saturate" values="0" />
					</filter>
					<rect width="100%" height="100%" filter="url(#grain)" />
				</svg>
			</AbsoluteFill>
			<div style={{position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, opacity: 0.9}}>
				<Img src={staticFile(LOGO)} style={{width: 70, height: 70, borderRadius: '50%', objectFit: 'cover'}} />
				<div style={{fontFamily: cine, fontWeight: 700, fontSize: 30, color: '#f1ece4', letterSpacing: 10}}>ZONE GTA VI</div>
			</div>
			<div style={{position: 'absolute', top: 1600, left: 0, right: 0, textAlign: 'center', fontFamily: cine, fontSize: 20, color: '#8d867b', letterSpacing: 6}}>IMAGENS: ROCKSTAR GAMES · GTA VI</div>
			<Html5Audio src={staticFile('music/trilha-recorde.mp3')} volume={musicVolume} />
			<Sequence from={data.voStart} name="narracao">
				<Html5Audio src={staticFile('vo/recorde-marcio.mp3')} volume={1} />
			</Sequence>
			{sfx.map(([src, at, vol], i) => (
				<Sequence key={i} from={Math.max(0, at)} durationInFrames={120} name={`sfx-${src}`}>
					<Html5Audio src={staticFile(src)} volume={vol} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
