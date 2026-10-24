import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, DISPLAY, SAFE, UI} from '../theme';

/**
 * Tempo "dentro do jogo" do experimento (segundos) em função do tempo do vídeo.
 * Começa quando o Jason fica parado e chega a 01:00:00 exatamente em "uma hora" (43.06 s).
 */
export const gameClock = (t: number) =>
	interpolate(t, [15.8, 22.0, 25.95, 41.36, 43.06], [0, 6, 10, 38 * 60, 3600], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.5, 0, 0.9, 1),
	});

export const fmt = (secs: number) => {
	const s = Math.floor(secs);
	const hh = String(Math.floor(s / 3600)).padStart(2, '0');
	const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
	const ss = String(s % 60).padStart(2, '0');
	return `${hh}:${mm}:${ss}`;
};

const visible = (t: number) => (t >= 15.8 && t < 42.2) || (t >= 45.7 && t < 58.7) || t >= 74.68;

/** HUD discreto de "experimento": REC + cronômetro + velocidade */
export const Hud: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;
	if (!visible(t)) return null;
	const since = t >= 74.68 ? t - 74.68 : t - 15.8;
	const inO = interpolate(since, [0, 0.25], [0, 1], {extrapolateRight: 'clamp'});
	const clock = t >= 74.68 ? 0 : gameClock(t);
	const ff = t >= 26 && t < 43.06;
	const locked = t >= 43.06 && t < 58.7;
	const blink = Math.floor(frame / 15) % 2 === 0;
	const lockPulse = locked ? interpolate(t - 43.06, [0, 0.3], [1.25, 1], {extrapolateRight: 'clamp'}) : 1;
	return (
		<AbsoluteFill style={{opacity: inO}}>
			<div
				style={{
					position: 'absolute',
					top: SAFE.top + 20,
					left: SAFE.left,
					display: 'flex',
					alignItems: 'center',
					gap: 14,
					fontFamily: UI,
					fontWeight: 800,
					fontSize: 30,
					color: C.white,
					letterSpacing: 3,
					textShadow: '0 2px 8px rgba(0,0,0,0.8)',
				}}
			>
				<div style={{width: 20, height: 20, borderRadius: 10, background: C.red, opacity: blink ? 1 : 0.25, boxShadow: `0 0 14px ${C.red}`}} />
				EXPERIMENTO #01 · AFK
			</div>
			<div
				style={{
					position: 'absolute',
					top: SAFE.top + 64,
					left: SAFE.left,
					fontFamily: DISPLAY,
					fontSize: 84,
					color: locked ? C.yellow : C.white,
					letterSpacing: 4,
					transform: `scale(${lockPulse})`,
					transformOrigin: 'left center',
					textShadow: locked ? `0 0 24px ${C.orange}, 0 4px 0 #000` : '0 4px 0 #000, 0 0 18px rgba(0,0,0,0.7)',
					fontVariantNumeric: 'tabular-nums',
				}}
			>
				{fmt(clock)}
			</div>
			{ff ? (
				<div
					style={{
						position: 'absolute',
						top: SAFE.top + 168,
						left: SAFE.left,
						padding: '6px 14px',
						background: C.pink,
						color: 'white',
						fontFamily: UI,
						fontWeight: 800,
						fontSize: 28,
						letterSpacing: 2,
						borderRadius: 6,
					}}
				>
					▶▶ TEMPO ACELERADO
				</div>
			) : null}
		</AbsoluteFill>
	);
};
