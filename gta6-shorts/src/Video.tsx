import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Captions} from './components/Captions';
import {Hud} from './components/Hud';
import {Overlays} from './components/Overlays';
import {ShotView} from './components/ShotView';
import {SFX} from './data/sfx';
import {SHOTS} from './data/shots';
import {WORDS} from './data/words';
import {f} from './theme';

// Tremores só nos impactos principais
const SHAKES: {at: number; amp: number}[] = [
	{at: 2.14, amp: 22},
	{at: 21.18, amp: 10},
	{at: 36.92, amp: 20},
	{at: 41.36, amp: 22},
	{at: 60.32, amp: 26},
	{at: 73.36, amp: 14},
];

const useShake = () => {
	const frame = useCurrentFrame();
	let x = 0;
	let y = 0;
	let r = 0;
	for (const s of SHAKES) {
		const d = frame - f(s.at);
		if (d < 0 || d > 10) continue;
		const k = s.amp * Math.exp(-d / 3.2);
		x += (random(`sx${s.at}${d}`) - 0.5) * 2 * k;
		y += (random(`sy${s.at}${d}`) - 0.5) * 2 * k;
		r += (random(`sr${s.at}${d}`) - 0.5) * 0.08 * k;
	}
	return `translate(${x}px, ${y}px) rotate(${r}deg)`;
};

/** Volume da trilha: abaixa enquanto há voz (ducking), sobe nas pausas */
const SPEECH: [number, number][] = (() => {
	const out: [number, number][] = [];
	for (const w of WORDS) {
		const last = out[out.length - 1];
		if (last && w.start - last[1] < 0.35) last[1] = w.end;
		else out.push([w.start, w.end]);
	}
	return out;
})();
const musicVolume = (t: number) => {
	let d = Infinity;
	for (const [a, b] of SPEECH) {
		if (t >= a && t <= b) {
			d = 0;
			break;
		}
		d = Math.min(d, Math.abs(t - a), Math.abs(t - b));
	}
	const duck = interpolate(d, [0, 0.25], [0.16, 0.32], {extrapolateRight: 'clamp'});
	const intro = interpolate(t, [0, 0.4], [0.6, 1], {extrapolateRight: 'clamp'});
	return duck * intro;
};

const Finish: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)'}} />
			{/* leve gradiente atrás das legendas para leitura */}
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 52%, rgba(0,0,0,0.35) 66%, rgba(0,0,0,0) 80%)'}} />
			<Img
				src={staticFile(`fx/grain${frame % 6}.png`)}
				style={{position: 'absolute', width: '100%', height: '100%', mixBlendMode: 'overlay', opacity: 0.12}}
			/>
		</>
	);
};

export const GTA6Parado: React.FC = () => {
	const shake = useShake();
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill style={{background: 'black'}}>
			<AbsoluteFill style={{transform: shake}}>
				{SHOTS.map((s) => (
					<Sequence key={s.id} from={f(s.from)} durationInFrames={f(s.to) - f(s.from)} name={`${s.id} ${s.note}`}>
						<ShotView shot={s} />
					</Sequence>
				))}
				<Overlays />
			</AbsoluteFill>
			<Finish />
			<Hud />
			<Captions />

			<Audio src={staticFile('audio/voice.wav')} volume={1} />
			<Audio src={staticFile('audio/music.wav')} volume={(fr) => musicVolume(fr / fps)} />
			{SFX.map((s, i) => (
				<Sequence key={i} from={f(s.at)} layout="none" name={`sfx ${s.file}`}>
					<Audio src={staticFile(`audio/${s.file}.wav`)} volume={s.vol} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
