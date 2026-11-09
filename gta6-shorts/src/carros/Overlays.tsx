import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame} from 'remotion';
import {At, Chip, Stamp, useOut, useSpring} from '../components/Overlays';
import {ProOutro} from '../components/ProOutro';
import {C, DISPLAY, GRAD, SAFE, UI, f} from '../theme';

// Gráficos do Short "Os carros de GTA 6 saíram do jogo". Ilustrações (placa e luzes são efeitos, não fotos reais).
const GREEN = '#3DFF8A';
const useAt = (start: number, at: number, damping = 12, stiffness = 260) => useSpring(at - start, damping, stiffness);

const Hook: React.FC<{dur: number; subAt: number}> = ({dur, subAt}) => {
	const s = useSpring(0.05, 10, 300);
	const sub = useSpring(subAt, 11, 280);
	const out = useOut(dur, 4);
	return (
		<AbsoluteFill style={{alignItems: 'center', top: 380, opacity: out}}>
			<div style={{fontFamily: DISPLAY, fontSize: 120, color: 'white', textShadow: '0 7px 0 #000', opacity: s}}>OS CARROS DE GTA 6</div>
			<div style={{display: 'inline-block', marginTop: 8, background: C.yellow, padding: '8px 40px 0', borderRadius: 14, transform: `rotate(-2deg) scale(${interpolate(s, [0, 1], [1.9, 1])})`, opacity: s, boxShadow: '0 12px 0 #000'}}>
				<span style={{fontFamily: DISPLAY, fontSize: 140, color: C.ink}}>SAÍRAM DO JOGO</span>
			</div>
			<div style={{marginTop: 24, opacity: sub, transform: `translateY(${(1 - sub) * 30}px)`}}>
				<Chip bg={C.pink} size={44}>
					🌴 RODANDO EM MIAMI
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

/** Placa estilizada "LEONIDA" (ilustração) */
const Plate: React.FC = () => (
	<div style={{width: 520, height: 260, borderRadius: 26, background: 'linear-gradient(180deg,#fdfdfd,#e6eef5)', border: '10px solid #1b2a44', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
		<div style={{fontFamily: UI, fontWeight: 800, fontSize: 40, color: '#e04a7a', letterSpacing: 10}}>LEONIDA</div>
		<div style={{fontFamily: DISPLAY, fontSize: 110, color: '#1b2a44', letterSpacing: 6, lineHeight: 1, whiteSpace: 'nowrap'}}>GTA VI</div>
	</div>
);

const Convoy: React.FC<{start: number; dur: number; rows: {t: string; at: number; c?: string; tc?: string}[]; plateAt: number}> = ({start, dur, rows, plateAt}) => {
	const frame = useCurrentFrame();
	const p = useAt(start, plateAt, 10, 300);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 360, left: SAFE.left}}>
				{rows.map((r, i) => {
					const k = spring({frame: frame - f(r.at - start), fps: 30, config: {damping: 11, stiffness: 300}});
					if (frame < f(r.at - start)) return null;
					return (
						<div key={i} style={{margin: '10px 0', opacity: k, transform: `translateX(${(1 - k) * 160}px)`}}>
							<Chip bg={r.c ?? C.ink} color={r.tc} size={42}>
								{r.t}
							</Chip>
						</div>
					);
				})}
			</div>
			<div style={{position: 'absolute', top: 700, left: 280, opacity: p, transform: `rotate(-6deg) scale(${interpolate(p, [0, 1], [1.8, 0.95])})`}}>
				<Plate />
			</div>
		</AbsoluteFill>
	);
};

/** Luzes de giroflex (vermelho/azul) + textos */
const Police: React.FC<{start: number; dur: number; aAt: number; bAt: number}> = ({start, dur, aAt, bAt}) => {
	const frame = useCurrentFrame();
	const a = useAt(start, aAt, 10, 300);
	const b = useAt(start, bAt, 10, 300);
	const out = useOut(dur);
	const t = start + frame / 30;
	const on = t >= bAt - 0.2;
	const phase = Math.floor(frame / 4) % 2;
	return (
		<AbsoluteFill style={{opacity: out}}>
			{on ? (
				<>
					<AbsoluteFill style={{background: `radial-gradient(circle at 15% 30%, ${phase ? 'rgba(255,40,60,0.45)' : 'rgba(255,40,60,0)'} , rgba(0,0,0,0) 45%)`}} />
					<AbsoluteFill style={{background: `radial-gradient(circle at 85% 30%, ${phase ? 'rgba(40,110,255,0)' : 'rgba(40,110,255,0.45)'} , rgba(0,0,0,0) 45%)`}} />
				</>
			) : null}
			<div style={{position: 'absolute', top: 380, left: 0, right: 0, textAlign: 'center', opacity: a, transform: `scale(${interpolate(a, [0, 1], [1.6, 1])})`}}>
				<Chip bg={C.red} size={48}>
					🚨 POLÍCIA DE VICE CITY
				</Chip>
			</div>
			<div style={{position: 'absolute', top: 480, left: 0, right: 0, textAlign: 'center', opacity: a}}>
				<span style={{fontFamily: DISPLAY, fontSize: 96, color: 'white', textShadow: '0 6px 0 #000'}}>NA FRENTE DO COMBOIO</span>
			</div>
			<div style={{position: 'absolute', top: 620, left: 0, right: 0, textAlign: 'center', opacity: b, transform: `scale(${interpolate(b, [0, 1], [1.6, 1])})`}}>
				<Chip bg="#1E5BFF" size={44}>
					🚔 COM GIROFLEX E TUDO
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

const Builder: React.FC<{start: number; dur: number; nameAt: number; gta5At: number}> = ({start, dur, nameAt, gta5At}) => {
	const n = useAt(start, nameAt, 11, 280);
	const g = useAt(start, gta5At, 11, 280);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 380, left: SAFE.left, right: 140, background: 'rgba(11,6,18,0.9)', borderRadius: 24, padding: '22px 26px', border: `4px solid ${C.orange}`, opacity: n, transform: `translateY(${(1 - n) * 100}px)`}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 26, color: 'rgba(255,255,255,0.7)', letterSpacing: 3}}>SEGUNDO A IMPRENSA, QUEM CONSTRUIU:</div>
				<div style={{fontFamily: DISPLAY, fontSize: 96, lineHeight: 1.05, marginTop: 6, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent'}}>🔧 WEST COAST CUSTOMS</div>
			</div>
			<div style={{position: 'absolute', top: 680, left: SAFE.left, opacity: g, transform: `scale(${interpolate(g, [0, 1], [1.5, 1])})`, transformOrigin: 'left center'}}>
				<Chip bg={C.purple} size={40}>
					⏪ JÁ FEZ UM CARRO REAL DE GTA 5
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

const SixCount: React.FC<{dur: number}> = ({dur}) => {
	const s = useSpring(0.1, 9, 320);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{alignItems: 'center', top: 400, opacity: out}}>
			<div style={{fontFamily: DISPLAY, fontSize: 260, lineHeight: 0.95, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 10px 0 #000)', opacity: s, transform: `scale(${interpolate(s, [0, 1], [2, 1])})`}}>6</div>
			<div style={{fontFamily: DISPLAY, fontSize: 88, color: 'white', textShadow: '0 6px 0 #000', opacity: s}}>CARROS NO JOGO</div>
		</AbsoluteFill>
	);
};

/** Etiqueta do carro na contagem 1/6 ... 6/6 */
const CarTag: React.FC<{n: number; name: string; sub?: string; color: string}> = ({n, name, sub, color}) => {
	const s = useSpring(0, 9, 340);
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(5,4,10,0) 12%, rgba(5,4,10,0.75) 20%, rgba(5,4,10,0.75) 36%, rgba(5,4,10,0) 46%)', opacity: s}} />
			<div style={{position: 'absolute', top: 360, left: SAFE.left, opacity: s, transform: `translateX(${(1 - s) * -220}px)`}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 30, color, letterSpacing: 4}}>{n}/6</div>
				<div style={{fontFamily: DISPLAY, fontSize: 130, lineHeight: 1, color: 'white', textShadow: '0 7px 0 #000', WebkitTextStroke: '3px #000'}}>{name}</div>
				{sub ? (
					<div style={{marginTop: 10}}>
						<Chip bg={color} color={C.ink} size={36}>
							{sub}
						</Chip>
					</div>
				) : null}
			</div>
		</AbsoluteFill>
	);
};

const Poll: React.FC = () => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 260);
	const opt = (l: string, t: string, color: string, i: number) => {
		const k = spring({frame: frame - f(0.6 + i * 0.3), fps: 30, config: {damping: 11, stiffness: 300}});
		return (
			<div style={{display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.96)', borderRadius: 18, padding: '12px 18px', margin: '14px 0', opacity: k, transform: `translateX(${(1 - k) * 200}px)`}}>
				<div style={{width: 66, height: 66, borderRadius: 14, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40}}>{l}</div>
				<span style={{fontFamily: DISPLAY, fontSize: 50, color: C.ink}}>{t}</span>
			</div>
		);
	};
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', top: 370, left: SAFE.left, right: 140, opacity: s}}>
				<div style={{fontFamily: DISPLAY, fontSize: 80, color: 'white', textShadow: '0 6px 0 #000', lineHeight: 1.05}}>PASSOU NA SUA RUA. E AÍ?</div>
				{opt('🏃', 'IA ATRÁS NA HORA', GREEN, 0)}
				{opt('📱', 'SÓ FILMAVA', C.cyan, 1)}
			</div>
		</AbsoluteFill>
	);
};

export const CarrosOverlays: React.FC = () => (
	<AbsoluteFill>
		<At from={0} to={4.55}>
			<Hook dur={4.55} subAt={2.6} />
		</At>
		<At from={4.55} to={11.45}>
			<Convoy
				start={4.55}
				dur={6.9}
				plateAt={10.4}
				rows={[
					{t: '📅 OUTUBRO DE 2026', at: 4.7},
					{t: '🚗 COMBOIO DE CARROS DE GTA 6', at: 5.7, c: C.purple},
					{t: '📍 MIAMI · KEY BISCAYNE', at: 8.4, c: C.pink},
					{t: '🪪 PLACAS DE LEONIDA', at: 10.4, c: C.yellow, tc: C.ink},
				]}
			/>
		</At>
		<At from={11.45} to={18.45}>
			<Police start={11.45} dur={7.0} aAt={13.2} bAt={17.0} />
		</At>
		<At from={18.45} to={25.85}>
			<Builder start={18.45} dur={7.4} nameAt={20.9} gta5At={23.6} />
		</At>
		<At from={25.85} to={28.55}>
			<SixCount dur={2.7} />
		</At>
		<At from={28.55} to={29.75}>
			<CarTag n={1} name="CHEETAH" color={C.cyan} />
		</At>
		<At from={29.75} to={31.2}>
			<CarTag n={2} name="TEMPESTA" sub="🚨 POLÍCIA" color={C.red} />
		</At>
		<At from={31.2} to={32.15}>
			<CarTag n={3} name="EMERUS" color={C.orange} />
		</At>
		<At from={32.15} to={33.05}>
			<CarTag n={4} name="COQUETTE" color={C.pink} />
		</At>
		<At from={33.05} to={35.05}>
			<CarTag n={5} name="MANANA" sub="✨ RODAS DOURADAS" color={C.yellow} />
		</At>
		<At from={35.05} to={37.5}>
			<CarTag n={6} name="BUCCANEER" sub="⬇️ REBAIXADO" color={GREEN} />
		</At>
		<At from={37.6} to={40.85}>
			<Stamp text="VERSÃO REAL?!" sub="DE CADA UM" top={500} color={C.yellow} />
		</At>
		<At from={40.85} to={44.9}>
			<Poll />
		</At>
		<At from={44.9} to={51.5}>
			<ProOutro subAt={1.6} tagline="INVESTIGANDO CADA DETALHE DE GTA 6" />
		</At>
	</AbsoluteFill>
);
