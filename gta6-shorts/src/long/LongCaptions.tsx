import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Word} from '../data/words';
import {C, DISPLAY, GRAD} from '../theme';

type Page = {words: Word[]; start: number; end: number};

const buildPages = (words: Word[]): Page[] => {
	const pages: Page[] = [];
	let cur: Word[] = [];
	const flush = () => {
		if (cur.length) pages.push({words: cur, start: cur[0].start, end: cur[cur.length - 1].end});
		cur = [];
	};
	for (const w of words) {
		const chars = cur.reduce((a, x) => a + x.text.length + 1, 0) + w.text.length;
		const gap = cur.length ? w.start - cur[cur.length - 1].end : 0;
		if (cur.length && (cur.length >= 6 || chars > 34 || gap > 0.35)) flush();
		cur.push(w);
		if (/[.,?!]$/.test(w.text) && w.text.length > 2) flush();
	}
	flush();
	// cada página fica até a próxima começar (máx. 0.5 s depois da última palavra)
	for (let i = 0; i < pages.length; i++) {
		const next = pages[i + 1]?.start ?? Infinity;
		pages[i].end = Math.min(next, pages[i].end + 0.5);
	}
	return pages;
};

const norm = (s: string) => s.toLowerCase();

export const LongCaptions: React.FC<{
	words: Word[];
	/** palavras destacadas (minúsculas, com pontuação) — seletivo: o que carrega o sentido */
	keywords: Set<string>;
	/** trechos em que um título grande já mostra a fala (evita duplicar texto) */
	hidden: [number, number][];
}> = ({words, keywords, hidden}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;
	const pages = useMemo(() => buildPages(words), [words]);
	if (hidden.some(([a, b]) => t >= a && t < b)) return null;
	const page = pages.find((p) => t >= p.start - 0.06 && t < p.end);
	if (!page) return null;

	const pageIn = spring({frame: frame - Math.round((page.start - 0.06) * fps), fps, config: {damping: 18, stiffness: 300}});

	return (
		<AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center'}}>
			<div
				style={{
					position: 'absolute',
					top: 900,
					left: 160,
					width: 1600,
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center',
					alignItems: 'baseline',
					columnGap: 22,
					rowGap: 0,
					transform: `scale(${interpolate(pageIn, [0, 1], [0.86, 1])})`,
					opacity: pageIn,
				}}
			>
				{page.words.map((w, i) => {
					const spoken = t >= w.start - 0.04;
					const active = t >= w.start - 0.04 && t < w.end + 0.08;
					const key = keywords.has(norm(w.text));
					const pop = spring({frame: frame - Math.round((w.start - 0.04) * fps), fps, config: {damping: 12, stiffness: 320, mass: 0.5}});
					const size = key ? 78 : 68;
					const text = w.text.replace(/[,.]$/, '').toUpperCase();
					return (
						<span
							key={i}
							style={{
								fontFamily: DISPLAY,
								fontSize: size,
								lineHeight: 1.08,
								letterSpacing: 1,
								position: 'relative',
								display: 'inline-block',
								opacity: spoken ? 1 : 0.0,
								transform: `translateY(${spoken ? (1 - pop) * 16 : 16}px) scale(${active ? 1 + 0.06 * pop : 1}) rotate(${key && active ? -2 : 0}deg)`,
							}}
						>
							{/* contorno + sombra (camada de trás) */}
							<span
								style={{
									position: 'absolute',
									inset: 0,
									WebkitTextStroke: '11px #0B0612',
									color: '#0B0612',
									filter: 'drop-shadow(0 5px 0 rgba(0,0,0,0.55))',
								}}
							>
								{text}
							</span>
							<span
								style={{
									position: 'relative',
									...(key
										? {backgroundImage: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}
										: {color: active ? C.yellow : C.white}),
								}}
							>
								{text}
							</span>
						</span>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
