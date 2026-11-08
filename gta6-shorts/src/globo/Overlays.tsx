import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame} from 'remotion';
import {At, Chip, Stamp, useOut, useSpring} from '../components/Overlays';
import {ProOutro} from '../components/ProOutro';
import {C, DISPLAY, GRAD, SAFE, UI, f} from '../theme';

// Gráficos do Short "GTA 6 apareceu na GLOBO". Ilustrações (sem logotipo da emissora; não é a imagem real da transmissão).
const GREEN = '#3DFF8A';
const useAt = (start: number, at: number, damping = 12, stiffness = 260) => useSpring(at - start, damping, stiffness);

/** Gancho: moldura de TV com "NA TV ABERTA" */
const TvHook: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 11, 280);
	const t2 = useSpring(1.6, 10, 300);
	const out = useOut(dur, 4);
	const rec = Math.floor(frame / 15) % 2 === 0;
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', left: 60, right: 60, top: 330, height: 560, borderRadius: 30, border: '14px solid #1a1a1f', boxShadow: '0 0 0 4px #333, 0 30px 80px rgba(0,0,0,0.7), inset 0 0 120px rgba(0,0,0,0.6)', opacity: s, transform: `scale(${interpolate(s, [0, 1], [1.25, 1])})`}}>
				<div style={{position: 'absolute', left: 26, top: 22, display: 'flex', alignItems: 'center', gap: 10, background: C.red, padding: '6px 16px', borderRadius: 8}}>
					<div style={{width: 16, height: 16, borderRadius: 8, background: 'white', opacity: rec ? 1 : 0.2}} />
					<span style={{fontFamily: UI, fontWeight: 800, fontSize: 28, color: 'white', letterSpacing: 3}}>TV ABERTA</span>
				</div>
				<div style={{position: 'absolute', right: 26, top: 22}}>
					<div style={{width: 64, height: 64, borderRadius: 10, background: '#111', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 44, color: 'white'}}>18</div>
				</div>
				<div style={{position: 'absolute', left: 0, right: 0, bottom: 40, textAlign: 'center'}}>
					<div style={{fontFamily: DISPLAY, fontSize: 130, color: 'white', textShadow: '0 8px 0 #000', lineHeight: 1}}>GTA 6</div>
					<div style={{display: 'inline-block', marginTop: 10, background: C.yellow, padding: '6px 30px 0', borderRadius: 12, transform: `rotate(-2deg) scale(${interpolate(t2, [0, 1], [1.8, 1])})`, opacity: t2}}>
						<span style={{fontFamily: DISPLAY, fontSize: 96, color: C.ink}}>NA GLOBO 😳</span>
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Ficha da exibição */
const AirCard: React.FC<{start: number; dur: number; rows: {t: string; at: number; c?: string; tc?: string}[]}> = ({start, dur, rows}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 370, left: SAFE.left, right: 140, opacity: s, transform: `translateY(${(1 - s) * 100}px)`}}>
				<div style={{display: 'inline-flex', alignItems: 'center', gap: 12, background: 'rgba(11,6,18,0.9)', padding: '10px 20px', borderRadius: 14, border: `3px solid ${C.red}`}}>
					<div style={{width: 16, height: 16, borderRadius: 8, background: C.red, boxShadow: `0 0 14px ${C.red}`}} />
					<span style={{fontFamily: UI, fontWeight: 800, fontSize: 30, color: 'white', letterSpacing: 3}}>FOI AO AR</span>
				</div>
				<div style={{marginTop: 14}}>
					{rows.map((r, i) => {
						const p = spring({frame: frame - f(r.at - start), fps: 30, config: {damping: 11, stiffness: 300}});
						if (frame < f(r.at - start)) return null;
						return (
							<div key={i} style={{margin: '10px 0', opacity: p, transform: `translateX(${(1 - p) * 160}px)`}}>
								<Chip bg={r.c ?? C.ink} color={r.tc} size={42}>
									{r.t}
								</Chip>
							</div>
						);
					})}
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Legenda em português (ilustração) */
const Subtitle: React.FC<{dur: number}> = ({dur}) => {
	const s = useSpring(0, 10, 300);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 420, left: 0, right: 0, textAlign: 'center', opacity: s, transform: `scale(${interpolate(s, [0, 1], [1.4, 1])})`}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 26, color: C.yellow, letterSpacing: 5, marginBottom: 10}}>LEGENDA EM PORTUGUÊS</div>
				<span style={{display: 'inline-block', fontFamily: UI, fontWeight: 800, fontSize: 64, color: 'white', background: 'rgba(0,0,0,0.78)', padding: '10px 26px', borderRadius: 10}}>"Vamos ficar bem?"</span>
			</div>
		</AbsoluteFill>
	);
};

/** Celular filmando a TV */
const Phone: React.FC<{start: number; dur: number; viralAt: number}> = ({start, dur, viralAt}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 12, 260);
	const v = useAt(start, viralAt, 10, 300);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', left: 300, top: 340, width: 480, height: 620, borderRadius: 50, background: '#0c0c10', border: '10px solid #2a2a30', boxShadow: '0 30px 70px rgba(0,0,0,0.7)', opacity: s, transform: `rotate(${-6 + Math.sin(frame / 9) * 1.5}deg) translateY(${(1 - s) * 200}px)`, overflow: 'hidden'}}>
				<div style={{position: 'absolute', inset: 20, borderRadius: 30, background: 'linear-gradient(160deg, #2b1a3a, #ff3e9a 140%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
					<div style={{fontSize: 120}}>📺</div>
					<div style={{fontFamily: DISPLAY, fontSize: 64, color: 'white', marginTop: 10}}>GTA 6 NA TV</div>
					<div style={{position: 'absolute', top: 20, left: 22, display: 'flex', alignItems: 'center', gap: 8}}>
						<div style={{width: 18, height: 18, borderRadius: 9, background: C.red, opacity: Math.floor(frame / 12) % 2 ? 1 : 0.3}} />
						<span style={{fontFamily: UI, fontWeight: 800, fontSize: 26, color: 'white'}}>REC</span>
					</div>
				</div>
			</div>
			<div style={{position: 'absolute', top: 370, left: SAFE.left, opacity: s}}>
				<Chip bg={C.purple} size={38}>
					📱 UM FÃ FILMOU
				</Chip>
			</div>
			<div style={{position: 'absolute', top: 870, left: SAFE.left, opacity: v, transform: `scale(${interpolate(v, [0, 1], [1.6, 1])})`, transformOrigin: 'left center'}}>
				<Chip bg={C.red} size={40}>
					🔥 SE ESPALHOU NAS REDES
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

/** Mapa estilizado de SP com pinos */
const MapPins: React.FC<{start: number; dur: number; pins: {t: string; at: number; x: number; y: number}[]}> = ({start, dur, pins}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', left: 70, right: 70, top: 360, height: 600, borderRadius: 30, background: 'rgba(11,6,18,0.88)', border: '3px solid rgba(255,255,255,0.18)', overflow: 'hidden', opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})`}}>
				{/* ruas estilizadas (ilustração) */}
				<svg width="940" height="600" style={{position: 'absolute', inset: 0, opacity: 0.35}}>
					<path d="M0 420 C 200 380, 400 460, 940 300" stroke="#8a8aa0" strokeWidth={14} fill="none" />
					<path d="M300 0 C 320 200, 280 400, 360 600" stroke="#8a8aa0" strokeWidth={10} fill="none" />
					<path d="M620 0 C 600 180, 700 380, 640 600" stroke="#8a8aa0" strokeWidth={10} fill="none" />
					<path d="M0 160 L 940 220" stroke="#8a8aa0" strokeWidth={6} fill="none" />
					<path d="M0 540 L 940 500" stroke="#8a8aa0" strokeWidth={6} fill="none" />
				</svg>
				<div style={{position: 'absolute', left: 24, top: 18, fontFamily: DISPLAY, fontSize: 52, color: 'white'}}>📍 SÃO PAULO</div>
				{pins.map((p, i) => {
					const k = spring({frame: frame - f(p.at - start), fps: 30, config: {damping: 9, stiffness: 300}});
					if (frame < f(p.at - start)) return null;
					return (
						<div key={i} style={{position: 'absolute', left: p.x, top: p.y, transform: `translate(-50%, -100%) scale(${k})`, transformOrigin: '50% 100%', textAlign: 'center'}}>
							<div style={{background: [C.pink, C.yellow, C.cyan][i % 3], color: C.ink, fontFamily: UI, fontWeight: 800, fontSize: 28, padding: '8px 16px', borderRadius: 12, whiteSpace: 'nowrap', boxShadow: '0 10px 24px rgba(0,0,0,0.5)'}}>{p.t}</div>
							<div style={{width: 0, height: 0, margin: '0 auto', borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: `20px solid ${[C.pink, C.yellow, C.cyan][i % 3]}`}} />
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

/** Contagem + enquete */
const Countdown: React.FC<{start: number; pollAt: number}> = ({start, pollAt}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 11, 280);
	const p = useAt(start, pollAt, 11, 280);
	const pulse = 1 + 0.04 * Math.sin(frame / 3);
	const opt = (l: string, t: string, color: string, i: number) => {
		const k = spring({frame: frame - f(pollAt - start + i * 0.25), fps: 30, config: {damping: 11, stiffness: 300}});
		return (
			<div style={{display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.96)', borderRadius: 18, padding: '12px 18px', margin: '12px 0', opacity: k, transform: `translateX(${(1 - k) * 200}px)`}}>
				<div style={{width: 64, height: 64, borderRadius: 14, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38}}>{l}</div>
				<span style={{fontFamily: DISPLAY, fontSize: 50, color: C.ink}}>{t}</span>
			</div>
		);
	};
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', top: 350, left: 0, right: 0, textAlign: 'center', opacity: s}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 32, letterSpacing: 6, color: C.yellow}}>FALTAM</div>
				<div style={{fontFamily: DISPLAY, fontSize: 220, lineHeight: 0.95, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 10px 0 #000)', transform: `scale(${pulse})`}}>11 DIAS</div>
			</div>
			<div style={{position: 'absolute', top: 650, left: SAFE.left, right: 140, opacity: p}}>
				{opt('✅', 'EU VI O COMERCIAL', GREEN, 0)}
				{opt('😱', 'TÔ SABENDO AGORA', C.red, 1)}
			</div>
		</AbsoluteFill>
	);
};

export const GloboOverlays: React.FC = () => (
	<AbsoluteFill>
		<At from={0} to={3.3}>
			<TvHook dur={3.3} />
		</At>
		<At from={3.4} to={6.2}>
			<AbsoluteFill style={{alignItems: 'center', top: 470}}>
				<Chip bg={C.red} size={50}>
					🏎️ NO MEIO DA FÓRMULA 1
				</Chip>
			</AbsoluteFill>
		</At>
		<At from={6.2} to={16.6}>
			<AirCard
				start={6.2}
				dur={10.4}
				rows={[
					{t: '📅 SÁBADO, 07/11 · ~14H', at: 6.9},
					{t: '🏁 GP DE SÃO PAULO · INTERLAGOS', at: 9.5, c: C.purple},
					{t: '⏱️ 30 SEGUNDOS DE VICE CITY', at: 13.5, c: C.pink},
					{t: '🇧🇷 LEGENDA EM PORTUGUÊS', at: 15.38, c: GREEN, tc: C.ink},
				]}
			/>
		</At>
		<At from={16.6} to={18.3}>
			<AbsoluteFill style={{alignItems: 'center', top: 500}}>
				<div style={{width: 200, height: 200, borderRadius: 24, background: '#111', border: '8px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 130, color: 'white', boxShadow: '0 0 40px rgba(0,0,0,0.8)'}}>18</div>
			</AbsoluteFill>
		</At>
		<At from={18.3} to={20.3}>
			<Subtitle dur={2.0} />
		</At>
		<At from={20.4} to={23.0}>
			<Stamp text="NINGUÉM ACREDITOU" top={520} color={C.yellow} />
		</At>
		<At from={23.0} to={27.1}>
			<Phone start={23.0} dur={4.1} viralAt={25.5} />
		</At>
		<At from={27.2} to={29.0}>
			<AbsoluteFill style={{alignItems: 'center', top: 470}}>
				<Chip bg={C.ink} size={48}>
					⚠️ E NÃO FOI SÓ NA TV…
				</Chip>
			</AbsoluteFill>
		</At>
		<At from={29.0} to={35.8}>
			<MapPins
				start={29.0}
				dur={6.8}
				pins={[
					{t: 'AV. NOVE DE JULHO', at: 30.66, x: 320, y: 330},
					{t: 'PRAÇA DA SÉ', at: 32.42, x: 650, y: 250},
					{t: '🚇 METRÔ', at: 33.62, x: 520, y: 520},
				]}
			/>
		</At>
		<At from={36.3} to={39.2}>
			<Stamp text="🇧🇷 DE OLHO NO BRASIL" top={520} color={GREEN} />
		</At>
		<At from={39.2} to={43.4}>
			<Countdown start={39.2} pollAt={41.3} />
		</At>
		<At from={43.4} to={51.0}>
			<ProOutro subAt={1.6} tagline="INVESTIGANDO CADA DETALHE DE GTA 6" />
		</At>
	</AbsoluteFill>
);
