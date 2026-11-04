import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame} from 'remotion';
import {At, Chip, Stamp, useOut, useSpring} from '../components/Overlays';
import {ProOutro} from '../components/ProOutro';
import {C, DISPLAY, GRAD, SAFE, UI, f} from '../theme';

const GREEN = '#3DFF8A';
const useAt = (start: number, at: number, damping = 12, stiffness = 260) => useSpring(at - start, damping, stiffness);

const Hook: React.FC<{dur: number}> = ({dur}) => {
	const a = useSpring(0, 12, 260);
	const b = useSpring(0.8, 10, 300);
	const out = useOut(dur, 3);
	return (
		<AbsoluteFill style={{alignItems: 'center', top: 400, opacity: out}}>
			<div style={{fontFamily: DISPLAY, fontSize: 130, color: 'white', textShadow: '0 6px 0 #000', opacity: a, transform: `scale(${interpolate(a, [0, 1], [1.5, 1])})`}}>UM DETALHE QUE</div>
			<div style={{fontFamily: DISPLAY, fontSize: 160, lineHeight: 1, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 8px 0 #000)', opacity: b, transform: `scale(${interpolate(b, [0, 1], [1.8, 1])})`}}>MUDA TUDO</div>
		</AbsoluteFill>
	);
};

/** Mira + "SACOU A ARMA" com batimento de alerta */
const Draw: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0.1, 10, 300);
	const out = useOut(dur);
	const pulse = 1 + 0.06 * Math.sin(frame / 3);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<AbsoluteFill style={{background: `rgba(255,45,61,${0.12 + 0.06 * Math.sin(frame / 3)})`}} />
			<div style={{position: 'absolute', left: 540 - 170, top: 520, width: 340, height: 340, borderRadius: 170, border: `10px solid ${C.red}`, transform: `scale(${s * pulse})`, opacity: s}}>
				<div style={{position: 'absolute', left: 160, top: -40, width: 10, height: 420, background: C.red}} />
				<div style={{position: 'absolute', top: 160, left: -40, height: 10, width: 420, background: C.red}} />
			</div>
			<div style={{position: 'absolute', top: 400, width: '100%', textAlign: 'center', opacity: s}}>
				<Chip bg={C.red} size={50}>
					🔫 SACOU A ARMA…
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

/** GTA V: pedestres "ignoram" (ilustração) */
const OldGame: React.FC<{start: number; dur: number; aimAt: number}> = ({start, dur, aimAt}) => {
	const frame = useCurrentFrame();
	const t = start + frame / 30;
	const s = useSpring(0, 13, 240);
	const a = useAt(start, aimAt, 11, 280);
	const out = useOut(dur);
	const faces = t >= aimAt ? ['😱', '😱', '😱'] : ['😐', '😐', '😐'];
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 380, left: SAFE.left, right: 140, opacity: s}}>
				<Chip bg="#444" size={36}>
					🕹️ EM GTA V
				</Chip>
				<div style={{display: 'flex', gap: 24, marginTop: 24}}>
					{faces.map((e, i) => (
						<div key={i} style={{width: 170, height: 170, borderRadius: 85, background: 'rgba(200,200,200,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 110, transform: t >= aimAt ? `translateY(${Math.sin(frame / 2 + i) * 6}px)` : 'none'}}>
							{e}
						</div>
					))}
				</div>
				<div style={{fontFamily: DISPLAY, fontSize: 64, color: 'white', marginTop: 22, textShadow: '0 5px 0 #000'}}>{t >= aimAt ? 'SÓ SE VOCÊ APONTASSE' : 'PEDESTRES IGNORAVAM'}</div>
				{t >= aimAt ? (
					<div style={{marginTop: 12, opacity: a}}>
						<Chip bg={C.orange} size={32}>
							🎯 ARMA APONTADA DIRETAMENTE
						</Chip>
					</div>
				) : null}
			</div>
		</AbsoluteFill>
	);
};

const Quote: React.FC<{dur: number}> = ({dur}) => {
	const s = useSpring(0.2, 13, 240);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 400, left: SAFE.left, right: 140, background: 'rgba(11,6,18,0.92)', borderRadius: 22, padding: '24px 28px', borderLeft: `12px solid ${C.cyan}`, opacity: s, transform: `translateX(${(1 - s) * 300}px)`}}>
				<div style={{fontFamily: DISPLAY, fontSize: 70, color: 'white', lineHeight: 1.08}}>OS PERSONAGENS PRECISAM REAGIR DE FORMA CONVINCENTE</div>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 28, color: C.cyan, marginTop: 14, letterSpacing: 2}}>— SEGUNDO ROB NELSON · ROCKSTAR NORTH</div>
			</div>
		</AbsoluteFill>
	);
};

const BigStat: React.FC<{start: number; dur: number; at: number}> = ({start, dur, at}) => {
	const frame = useCurrentFrame();
	const t = start + frame / 30;
	const out = useOut(dur);
	const k = interpolate(t, [at - 0.4, at + 1.3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const v = Math.round(600000 * (1 - Math.pow(1 - k, 3)));
	const s = useAt(start, at - 0.4, 12, 240);
	return (
		<AbsoluteFill style={{alignItems: 'center', top: 420, opacity: out}}>
			<div style={{fontFamily: UI, fontWeight: 800, fontSize: 36, letterSpacing: 8, color: C.yellow, opacity: s}}>APROXIMADAMENTE</div>
			<div style={{fontFamily: DISPLAY, fontSize: 210, lineHeight: 1, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 10px 0 #000)', fontVariantNumeric: 'tabular-nums', opacity: s}}>{v.toLocaleString('pt-BR')}</div>
			<div style={{fontFamily: DISPLAY, fontSize: 76, color: 'white', textShadow: '0 6px 0 #000', opacity: s}}>ANIMAÇÕES</div>
			<div style={{display: 'flex', gap: 16, marginTop: 18, opacity: s}}>
				<Chip bg={C.purple} size={34}>
					🎭 PERSONALIDADE
				</Chip>
				<Chip bg={C.pink} size={34}>
					🔀 VARIEDADE
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

const NotExtras: React.FC<{start: number; dur: number; crossAt: number}> = ({start, dur, crossAt}) => {
	const s = useSpring(0, 13, 240);
	const x = useAt(start, crossAt, 10, 300);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 430, left: SAFE.left, right: 140, opacity: s}}>
				<div style={{position: 'relative', display: 'inline-block'}}>
					<div style={{fontFamily: DISPLAY, fontSize: 110, color: 'white', textShadow: '0 6px 0 #000'}}>🧍 FIGURANTES</div>
					<div style={{position: 'absolute', left: -10, top: '50%', height: 16, width: `${x * 106}%`, background: C.red, borderRadius: 8, transform: 'rotate(-4deg)'}} />
				</div>
				<div style={{marginTop: 16, opacity: x, transform: `scale(${interpolate(x, [0, 1], [1.6, 1])})`, transformOrigin: 'left center'}}>
					<Chip bg={GREEN} color={C.ink} size={46}>
						PARTE DA EXPERIÊNCIA
					</Chip>
				</div>
			</div>
		</AbsoluteFill>
	);
};

const WorldReacts: React.FC<{start: number; dur: number; youAt: number; worldAt: number}> = ({start, dur, youAt, worldAt}) => {
	const y = useAt(start, youAt, 11, 280);
	const w = useAt(start, worldAt, 9, 320);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{alignItems: 'center', top: 430, opacity: out}}>
			<div style={{opacity: y, transform: `translateY(${(1 - y) * 40}px)`}}>
				<Chip bg={C.ink} size={44}>
					🧑 VOCÊ PROVOCA
				</Chip>
			</div>
			<div style={{fontFamily: DISPLAY, fontSize: 90, color: C.yellow, opacity: w, lineHeight: 1.1}}>⇅</div>
			<div style={{opacity: w, transform: `scale(${interpolate(w, [0, 1], [1.8, 1])})`}}>
				<span style={{fontFamily: DISPLAY, fontSize: 130, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 8px 0 #000)'}}>O MUNDO REAGE</span>
			</div>
		</AbsoluteFill>
	);
};

const Poll: React.FC<{start: number; aAt: number; bAt: number}> = ({start, aAt, bAt}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 14, 240);
	const opt = (l: string, text: string, at: number, color: string) => {
		const p = spring({frame: frame - f(at - start), fps: 30, config: {damping: 11, stiffness: 280}});
		return (
			<div style={{display: 'flex', alignItems: 'center', gap: 20, background: 'rgba(255,255,255,0.96)', borderRadius: 20, padding: '16px 22px', margin: '16px 0', opacity: frame >= f(at - start) ? p : 0, transform: `translateX(${(1 - p) * 200}px)`, boxShadow: '0 16px 40px rgba(0,0,0,0.45)'}}>
				<div style={{width: 80, height: 80, borderRadius: 16, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
					<span style={{fontFamily: DISPLAY, fontSize: 60, color: 'white'}}>{l}</span>
				</div>
				<span style={{fontFamily: DISPLAY, fontSize: 56, color: C.ink, lineHeight: 1.05}}>{text}</span>
			</div>
		);
	};
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', top: 360, left: SAFE.left, right: 140, opacity: s}}>
				<Chip bg={C.pink} size={34}>
					COMENTE A OU B
				</Chip>
				{opt('A', '🕊️ MAIS LIBERDADE', aAt, '#1FA7C9')}
				{opt('B', '⚡ MUNDO QUE REAGE A TUDO', bAt, C.red)}
			</div>
		</AbsoluteFill>
	);
};

// ------------------------------------------------------------------ timeline

export const ReacaoOverlays: React.FC = () => (
	<AbsoluteFill>
		<At from={0} to={2.0}>
			<Hook dur={2.0} />
		</At>
		<At from={8.8} to={11.8}>
			<Draw dur={3.0} />
		</At>
		<At from={11.8} to={20.6}>
			<OldGame start={11.8} dur={8.8} aimAt={17.2} />
		</At>
		<At from={22.7} to={26.2}>
			<AbsoluteFill style={{alignItems: 'center', top: 470}}>
				<Chip bg={C.cyan} color={C.ink} size={46}>
					📈 MAIS REALISMO
				</Chip>
			</AbsoluteFill>
		</At>
		<At from={28.3} to={36.5}>
			<Quote dur={8.2} />
		</At>
		<At from={36.5} to={37.5}>
			<Stamp text="E TEM MAIS!" top={520} color={C.yellow} />
		</At>
		<At from={37.5} to={46.3}>
			<BigStat start={37.5} dur={8.8} at={40.2} />
		</At>
		<At from={46.3} to={54.5}>
			<NotExtras start={46.3} dur={8.2} crossAt={49.6} />
		</At>
		<At from={56.4} to={58.8}>
			<AbsoluteFill style={{alignItems: 'center', top: 470}}>
				<Chip bg={C.pink} size={46}>
					⚡ A MAIOR DIFERENÇA DE GTA 6?
				</Chip>
			</AbsoluteFill>
		</At>
		<At from={58.8} to={63.8}>
			<WorldReacts start={58.8} dur={5.0} youAt={59.9} worldAt={62.0} />
		</At>
		<At from={63.8} to={71.1}>
			<Poll start={63.8} aAt={66.4} bAt={68.3} />
		</At>
		<At from={71.1} to={75.9}>
			<ProOutro subAt={1.6} tagline="INVESTIGANDO CADA DETALHE DE GTA 6" />
		</At>
	</AbsoluteFill>
);
