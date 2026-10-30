import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {LongCaptions} from './LongCaptions';
import {ShotView} from '../components/ShotView';
import type {Sfx} from '../data/sfx';
import type {Shot} from '../data/shots';
import type {Word} from '../data/words';
import {f} from '../theme';

import type {Shake} from '../ShortEdit';

/** Base dos vídeos LONGOS (16:9, 1920×1080): mesma lógica dos Shorts com legendas e marca-d'água no layout horizontal. */
export const LongEdit: React.FC<{
	shots: Shot[];
	sfx: Sfx[];
	shakes: Shake[];
	words: Word[];
	keywords: Set<string>;
	hidden: [number, number][];
	voice: string;
	/** null = sem trilha (ex.: para adicionar um som pelo editor do YouTube) */
	music: string | null;
	/** ganho extra da trilha (ajusta trilhas com mais energia na faixa da fala) */
	musicGain: number;
	overlays: React.ReactNode;
	hud: React.ReactNode;
	/** logo original do canal (marca-d'água fixa do 1º ao último quadro); null = ainda não fornecida */
	watermark: string | null;
}> = ({shots, sfx, shakes, words, keywords, hidden, voice, music, musicGain, overlays, hud, watermark}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Tremor só nos impactos principais
	let x = 0;
	let y = 0;
	let r = 0;
	for (const s of shakes) {
		const d = frame - f(s.at);
		if (d < 0 || d > 10) continue;
		const k = s.amp * Math.exp(-d / 3.2);
		x += (random(`sx${s.at}${d}`) - 0.5) * 2 * k;
		y += (random(`sy${s.at}${d}`) - 0.5) * 2 * k;
		r += (random(`sr${s.at}${d}`) - 0.5) * 0.08 * k;
	}

	// Trechos com voz (para o ducking da trilha)
	const speech = useMemo(() => {
		const out: [number, number][] = [];
		for (const w of words) {
			const last = out[out.length - 1];
			if (last && w.start - last[1] < 0.35) last[1] = w.end;
			else out.push([w.start, w.end]);
		}
		return out;
	}, [words]);
	const musicVolume = (t: number) => {
		let dist = Infinity;
		for (const [a, b] of speech) {
			if (t >= a && t <= b) {
				dist = 0;
				break;
			}
			dist = Math.min(dist, Math.abs(t - a), Math.abs(t - b));
		}
		const duck = interpolate(dist, [0, 0.25], [0.16, 0.32], {extrapolateRight: 'clamp'});
		const intro = interpolate(t, [0, 0.4], [0.6, 1], {extrapolateRight: 'clamp'});
		return duck * intro * musicGain;
	};

	return (
		<AbsoluteFill style={{background: 'black'}}>
			<AbsoluteFill style={{transform: `translate(${x}px, ${y}px) rotate(${r}deg)`}}>
				{shots.map((s) => (
					<Sequence key={s.id} from={f(s.from)} durationInFrames={f(s.to) - f(s.from)} name={`${s.id} ${s.note}`}>
						<ShotView shot={s} />
					</Sequence>
				))}
				{overlays}
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)'}} />
			{/* leve gradiente atrás das legendas para leitura */}
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 62%, rgba(0,0,0,0.45) 86%, rgba(0,0,0,0.25) 100%)'}} />
			<Img
				src={staticFile(`fx/grain${frame % 6}.png`)}
				style={{position: 'absolute', width: '100%', height: '100%', mixBlendMode: 'overlay', opacity: 0.12}}
			/>
			{hud}
			<LongCaptions words={words} keywords={keywords} hidden={hidden} />
			{/* Marca-d'água: fora do container com tremor/zoom, então nunca se move nem some em cortes e transições.
			    Canto superior esquerdo, longe das legendas (embaixo) e dos controles do player. */}
			{watermark === null ? null : (
				<Img
					src={staticFile(watermark)}
					style={{position: 'absolute', top: 36, left: 40, width: 120, height: 120, objectFit: 'contain', borderRadius: 18, opacity: 0.85, boxShadow: '0 4px 14px rgba(0,0,0,0.55)'}}
				/>
			)}

			<Audio src={staticFile(voice)} volume={1} />
			{music === null ? null : <Audio src={staticFile(music)} volume={(fr) => musicVolume(fr / fps)} />}
			{sfx.map((s, i) => (
				<Sequence key={i} from={f(s.at)} layout="none" name={`sfx ${s.file}`}>
					<Audio src={staticFile(`audio/${s.file}.wav`)} volume={s.vol} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
