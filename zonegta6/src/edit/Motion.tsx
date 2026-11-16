import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {mono} from '../theme';
import {BAR_H, cine, GOLD, IMG_H} from './Filme';

// Camada de motion graphics por cima da edição de filme: legendas animadas da narração,
// etiquetas de HUD nos nomes-chave, mira de foco, código de tempo, ondas nos impactos,
// linhas nos cortes e contador regressivo. Tudo guiado pelos tempos das palavras.

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export type Word = [string, number, number];
const norm = (w: string) =>
	w
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9-]/g, '');

// ── Legendas: blocos de até 4 palavras; a palavra falada fica em ouro ──
const chunk = (words: Word[]) => {
	const out: Word[][] = [];
	let cur: Word[] = [];
	words.forEach((w, i) => {
		cur.push(w);
		const next = words[i + 1];
		const pause = next ? next[1] - w[2] > 9 : true;
		const end = /[.?!,]$/.test(w[0]);
		if (cur.length >= 3 || pause || end) {
			out.push(cur);
			cur = [];
		}
	});
	if (cur.length) out.push(cur);
	return out;
};

export const Subtitles: React.FC<{words: Word[]; from: number; to: number; y?: number; hide?: Array<[number, number]>}> = ({words, from, to, y = 404, hide = []}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const blocks = React.useMemo(() => chunk(words), [words]);
	if (frame < from || frame >= to || hide.some(([a, b]) => frame >= a && frame < b)) return null;
	const b = blocks.find((c, i) => frame >= c[0][1] - 2 && frame < (blocks[i + 1]?.[0][1] ?? c[c.length - 1][2] + 20) - 2);
	if (!b) return null;
	const pop = spring({frame: frame - (b[0][1] - 2), fps, config: {damping: 12, mass: 0.5}});
	return (
		<div style={{position: 'absolute', left: 40, right: 40, top: y, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0 24px', transform: `scale(${0.85 + 0.15 * pop})`, opacity: Math.min(1, pop * 1.5)}}>
			{b.map(([w, s, e], i) => {
				const active = frame >= s && frame < e + 4;
				const said = frame >= s;
				return (
					<span
						key={i}
						style={{
							fontFamily: cine,
							fontWeight: 900,
							fontSize: 52,
							letterSpacing: 2,
							textTransform: 'uppercase',
							color: said ? '#f1ece4' : 'rgba(241,236,228,0.45)',
							transform: `translateY(${active ? -5 : 0}px)`,
							display: 'inline-block',
							textShadow: '0 4px 18px rgba(0,0,0,0.9)',
							...(active ? GOLD : {}),
						}}
					>
						{w.replace(/[,]$/, '')}
					</span>
				);
			})}
		</div>
	);
};

// ── Etiquetas de HUD que entram nos nomes-chave ──────────────
export type Tag = {label: string; match: string[]; after?: number};
export const findTags = (words: Word[], tags: Tag[]) =>
	tags.flatMap((t) => {
		const keys = words.map((w) => norm(w[0]));
		for (let i = 0; i < keys.length - t.match.length + 1; i++) {
			if (words[i][1] < (t.after ?? 0)) continue;
			if (t.match.every((m, k) => keys[i + k].startsWith(m))) return [{label: t.label, at: words[i][1]}];
		}
		return [];
	});

export const HudTags: React.FC<{tags: Array<{label: string; at: number}>}> = ({tags}) => {
	const frame = useCurrentFrame();
	const t = [...tags].reverse().find((x) => frame >= x.at && frame < x.at + 48);
	if (!t) return null;
	const f = frame - t.at;
	const inP = interpolate(f, [0, 8], [0, 1], {...clamp, easing: easeOut});
	const outP = interpolate(f, [40, 48], [1, 0], clamp);
	const typed = t.label.slice(0, Math.floor(interpolate(f, [4, 4 + t.label.length * 0.9], [0, t.label.length], clamp)));
	return (
		<div style={{position: 'absolute', right: 0, top: BAR_H + 46, opacity: outP, transform: `translateX(${(1 - inP) * 340}px)`}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(0,0,0,0.72)', borderLeft: '4px solid #e2c27d', padding: '10px 26px 10px 18px'}}>
				<div style={{width: 10, height: 10, borderRadius: 10, background: '#e2c27d', opacity: Math.floor(f / 6) % 2 ? 0.3 : 1}} />
				<div style={{fontFamily: mono, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: '#f1ece4'}}>{typed}</div>
			</div>
			<div style={{height: 2, marginTop: 6, width: `${inP * 100}%`, background: 'linear-gradient(90deg, #e2c27d, transparent)'}} />
		</div>
	);
};

// ── Mira de foco: desenha sobre o ponto de interesse do plano ──
export const Reticle: React.FC<{focus: number; dur: number; open?: boolean}> = ({focus, dur, open}) => {
	const frame = useCurrentFrame();
	const draw = interpolate(frame, [6, 24], [0, 1], {...clamp, easing: easeOut});
	const out = interpolate(frame, [dur - 10, dur], [1, 0], clamp);
	const x = 40 + focus * 1000;
	const y = open ? 960 : BAR_H + IMG_H * 0.42;
	const r = 120 - 30 * draw;
	return (
		<AbsoluteFill style={{pointerEvents: 'none', opacity: out * 0.85}}>
			<svg width={1080} height={1920} style={{position: 'absolute'}}>
				<circle cx={x} cy={y} r={r} fill="none" stroke="#e2c27d" strokeWidth={1.5} strokeDasharray={`${2 * Math.PI * r * draw} 999`} transform={`rotate(${-90 + frame * 1.5} ${x} ${y})`} />
				{[0, 90, 180, 270].map((a) => (
					<line key={a} x1={x} y1={y - r - 16} x2={x} y2={y - r + 8} stroke="#e2c27d" strokeWidth={2} opacity={draw} transform={`rotate(${a} ${x} ${y})`} />
				))}
			</svg>
			<div style={{position: 'absolute', left: Math.min(860, x + r + 14), top: y - 14, fontFamily: mono, fontSize: 20, letterSpacing: 3, color: '#e2c27d', opacity: draw}}>FOCO ▸ {Math.round(focus * 100)}%</div>
		</AbsoluteFill>
	);
};

// ── Código de tempo e REC sobre a janela de imagem ──────────
export const Timecode: React.FC<{start: number}> = ({start}) => {
	const frame = useCurrentFrame();
	const f = frame + start;
	const pad = (n: number) => String(n).padStart(2, '0');
	const tc = `${pad(Math.floor(f / 1800))}:${pad(Math.floor(f / 30) % 60)}:${pad(f % 30)}`;
	return (
		<>
			<div style={{position: 'absolute', left: 54, top: BAR_H + 44, fontFamily: mono, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: '#f1ece4', display: 'flex', gap: 10, alignItems: 'center', textShadow: '0 2px 8px #000'}}>
				<span style={{color: '#ff4d4d', opacity: Math.floor(f / 15) % 2 ? 0.25 : 1}}>●</span> REC
			</div>
			<div style={{position: 'absolute', left: 54, top: BAR_H + IMG_H - 70, fontFamily: mono, fontSize: 22, letterSpacing: 3, color: 'rgba(241,236,228,0.85)', textShadow: '0 2px 8px #000'}}>TC {tc}</div>
		</>
	);
};

// ── Onda dourada saindo do centro nos impactos ───────────────
export const Ripple: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{pointerEvents: 'none', justifyContent: 'center', alignItems: 'center'}}>
			{[0, 6].map((d) => {
				const p = interpolate(frame - d, [0, 26], [0, 1], {...clamp, easing: easeOut});
				return <div key={d} style={{position: 'absolute', width: 200 + 900 * p, height: 200 + 900 * p, borderRadius: '50%', border: `${2 + 3 * (1 - p)}px solid #e2c27d`, opacity: (1 - p) * 0.7}} />;
			})}
		</AbsoluteFill>
	);
};

// ── Linhas douradas cortando a tela num corte ────────────────
export const CutLines: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{[
				[BAR_H - 4, 1],
				[BAR_H + IMG_H + 2, -1],
			].map(([y, dir], k) => {
				const p = interpolate(frame, [0, 14], [0, 1], {...clamp, easing: easeOut});
				return <div key={k} style={{position: 'absolute', top: y, height: 2, left: dir > 0 ? 0 : `${(1 - p) * 100}%`, width: `${p * 100}%`, background: 'linear-gradient(90deg, transparent, #f5dc98, transparent)', opacity: 1 - interpolate(frame, [12, 22], [0, 1], clamp), boxShadow: '0 0 12px #e2b85a'}} />;
			})}
		</AbsoluteFill>
	);
};

// ── Contador regressivo fixo ─────────────────────────────────
export const Countdown: React.FC<{days: number}> = ({days}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{position: 'absolute', right: 40, top: 300, display: 'flex', alignItems: 'center', gap: 10, border: '1.5px solid #c9a86a', padding: '8px 14px', background: 'rgba(0,0,0,0.6)'}}>
			<span style={{fontFamily: mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, ...GOLD}}>D-{days}</span>
			<span style={{width: 1, height: 20, background: '#c9a86a'}} />
			<span style={{fontFamily: mono, fontSize: 20, letterSpacing: 3, color: '#f1ece4', opacity: Math.floor(frame / 20) % 2 ? 0.6 : 1}}>19.11</span>
		</div>
	);
};
