import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame} from 'remotion';
import {At, Chip, Stamp, useOut, useSpring} from '../components/Overlays';
import {EndCard} from '../fps/Overlays';
import {Poll} from '../preso/Overlays';
import {C, DISPLAY, GRAD, SAFE, UI, f} from '../theme';

const GREEN = '#3DFF8A';
const PAPER = '#f3ecdc';

/** Mola a partir de um instante absoluto (s) dentro de um <At from={start}> */
const useAt = (start: number, at: number, damping = 12, stiffness = 260) => useSpring(at - start, damping, stiffness);

const HookTitle: React.FC<{dur: number}> = ({dur}) => {
	const a = useSpring(0, 12, 260);
	const b = useSpring(1.6, 10, 300);
	const out = useOut(dur, 3);
	return (
		<AbsoluteFill style={{alignItems: 'center', top: 400, opacity: out}}>
			<div style={{fontFamily: DISPLAY, fontSize: 150, color: 'white', textShadow: '0 6px 0 #000', opacity: a, transform: `scale(${interpolate(a, [0, 1], [1.5, 1])})`}}>JASON MORA</div>
			<div style={{fontFamily: DISPLAY, fontSize: 190, lineHeight: 1, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 8px 0 #000)', opacity: b, transform: `scale(${interpolate(b, [0, 1], [1.8, 1])})`}}>DE FAVOR?</div>
		</AbsoluteFill>
	);
};

/** Placa da casa: aluguel R$ 0 */
const RentZero: React.FC<{dur: number}> = ({dur}) => {
	const s = useSpring(0.1, 10, 300);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 420, width: '100%', textAlign: 'center', transform: `scale(${interpolate(s, [0, 1], [1.8, 1])}) rotate(-3deg)`, opacity: s}}>
				<div style={{display: 'inline-block', background: PAPER, border: '8px solid #2b1a0e', borderRadius: 18, padding: '18px 40px', boxShadow: '0 16px 40px rgba(0,0,0,0.6)'}}>
					<div style={{fontFamily: UI, fontWeight: 800, fontSize: 32, letterSpacing: 6, color: '#8a2a1a'}}>🏠 ALUGUEL</div>
					<div style={{fontFamily: DISPLAY, fontSize: 150, color: '#2b1a0e', lineHeight: 1}}>R$ 0,00</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Etiqueta de preço que sobe até "???" — o favor custa mais caro */
const PriceTag: React.FC<{start: number; dur: number; caroAt: number}> = ({start, dur, caroAt}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 12, 260);
	const c = useAt(start, caroAt, 9, 320);
	const out = useOut(dur);
	const t = start + frame / 30;
	const v = Math.round(interpolate(t, [start + 0.3, caroAt], [0, 99999], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
	const swing = Math.sin(frame / 8) * 4;
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 380, left: SAFE.left, opacity: s, transform: `rotate(${-6 + swing}deg)`, transformOrigin: 'left top'}}>
				<div style={{display: 'flex', alignItems: 'center', background: C.yellow, borderRadius: '20px 60px 60px 20px', padding: '18px 50px 18px 30px', boxShadow: '0 16px 40px rgba(0,0,0,0.55)'}}>
					<div style={{width: 34, height: 34, borderRadius: 17, background: C.ink, marginRight: 24}} />
					<div>
						<div style={{fontFamily: UI, fontWeight: 800, fontSize: 26, letterSpacing: 4, color: C.ink}}>PREÇO REAL DO FAVOR</div>
						<div style={{fontFamily: DISPLAY, fontSize: 104, color: t >= caroAt ? C.red : C.ink, lineHeight: 1}}>{t >= caroAt ? 'R$ ???' : `R$ ${v.toLocaleString('pt-BR')}`}</div>
					</div>
				</div>
			</div>
			<div style={{position: 'absolute', top: 640, left: SAFE.left, opacity: c, transform: `scale(${interpolate(c, [0, 1], [1.8, 1])})`, transformOrigin: 'left center'}}>
				<Chip bg={C.red} size={46}>
					MUITO MAIS CARO
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

const StayTill: React.FC<{start: number; dur: number; ownerAt: number}> = ({start, dur, ownerAt}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 240);
	const d = useAt(start, ownerAt);
	const out = useOut(dur);
	const fill = interpolate(frame, [0, f(dur)], [0.08, 0.92], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 400, left: SAFE.left, right: 140, opacity: s, transform: `translateY(${(1 - s) * 40}px)`}}>
				<div style={{fontFamily: DISPLAY, fontSize: 96, color: 'white', textShadow: '0 5px 0 #000'}}>FICA ATÉ O FINAL</div>
				<div style={{marginTop: 14, height: 30, borderRadius: 15, background: 'rgba(255,255,255,0.2)', border: '4px solid white', overflow: 'hidden'}}>
					<div style={{width: `${fill * 100}%`, height: '100%', background: GRAD}} />
				</div>
				<div style={{marginTop: 22, opacity: d, transform: `scale(${interpolate(d, [0, 1], [1.5, 1])})`, transformOrigin: 'left center'}}>
					<Chip bg={C.yellow} color={C.ink} size={38}>
						🔑 QUEM É O DONO DA CASA?
					</Chip>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Ficha do personagem com o nome oficial */
const NameCard: React.FC<{start: number; dur: number; nameAt: number}> = ({start, dur, nameAt}) => {
	const s = useSpring(0, 13, 240);
	const n = useAt(start, nameAt, 10, 300);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 360, left: SAFE.left, opacity: s}}>
				<Chip bg={C.ink} size={30}>
					REVELADO PELA ROCKSTAR
				</Chip>
			</div>
			<div style={{position: 'absolute', top: 760, left: SAFE.left, right: 140, opacity: n, transform: `translateX(${(1 - n) * -300}px)`}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.yellow, textShadow: '0 2px 8px #000'}}>O DONO DA CASA</div>
				<div style={{fontFamily: DISPLAY, fontSize: 150, color: 'white', lineHeight: 1, textShadow: '0 8px 0 #000'}}>BRIAN</div>
				<div style={{fontFamily: DISPLAY, fontSize: 150, lineHeight: 1, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 8px 0 #000)'}}>HEDER</div>
			</div>
		</AbsoluteFill>
	);
};

const Dossier: React.FC<{start: number; dur: number; items: [string, number, string][]}> = ({start, dur, items}) => {
	const frame = useCurrentFrame();
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 380, left: SAFE.left, right: 140}}>
				{items.map(([label, at, color]) => {
					const p = spring({frame: frame - f(at - start), fps: 30, config: {damping: 10, stiffness: 300}});
					return frame >= f(at - start) ? (
						<div key={label} style={{marginBottom: 18, opacity: p, transform: `scale(${interpolate(p, [0, 1], [1.7, 1])}) rotate(-2deg)`, transformOrigin: 'left center'}}>
							<Chip bg={color} size={50}>
								{label}
							</Chip>
						</div>
					) : null;
				})}
			</div>
		</AbsoluteFill>
	);
};

/** O amigo do sofá e da pizza... riscado */
const NotThatFriend: React.FC<{start: number; dur: number; sofaAt: number; pizzaAt: number; crossAt: number}> = ({start, dur, sofaAt, pizzaAt, crossAt}) => {
	const a = useAt(start, sofaAt, 11, 280);
	const b = useAt(start, pizzaAt, 11, 280);
	const x = useAt(start, crossAt, 10, 300);
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	const bubble = (icon: string, text: string, p: number, rot: number) => (
		<div style={{display: 'flex', alignItems: 'center', gap: 18, background: 'white', borderRadius: 30, padding: '14px 28px', marginTop: 18, opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.5, 1])}) rotate(${rot}deg)`, boxShadow: '0 14px 34px rgba(0,0,0,0.5)', width: 'fit-content'}}>
			<span style={{fontSize: 70}}>{icon}</span>
			<span style={{fontFamily: DISPLAY, fontSize: 64, color: C.ink}}>{text}</span>
		</div>
	);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 360, left: SAFE.left, right: 140}}>
				<div style={{opacity: s}}>
					<Chip bg={C.ink} size={32}>
						O AMIGO QUE…
					</Chip>
				</div>
				<div style={{position: 'relative'}}>
					{bubble('🛋️', 'EMPRESTA O SOFÁ', a, -2)}
					{bubble('🍕', 'OFERECE PIZZA', b, 2)}
					<svg width="100%" height="100%" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: x}}>
						<line x1="0" y1="10%" x2={`${90 * x}%`} y2={`${10 + 85 * x}%`} stroke={C.red} strokeWidth={18} strokeLinecap="round" />
						<line x1="90%" y1="10%" x2={`${90 - 90 * x}%`} y2={`${10 + 85 * x}%`} stroke={C.red} strokeWidth={18} strokeLinecap="round" />
					</svg>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Contrato: moradia ⇄ cobrar dívidas */
const Deal: React.FC<{start: number; dur: number; debtAt: number}> = ({start, dur, debtAt}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 240);
	const d = useAt(start, debtAt, 9, 320);
	const out = useOut(dur);
	const t = start + frame / 30;
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 360, left: SAFE.left, right: 140, background: PAPER, borderRadius: 14, padding: '26px 30px', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', opacity: s, transform: `translateY(${(1 - s) * 300}px) rotate(-1.5deg)`}}>
				<div style={{fontFamily: DISPLAY, fontSize: 70, color: '#2b1a0e', textAlign: 'center', letterSpacing: 2}}>ACORDO</div>
				<div style={{height: 3, background: '#2b1a0e', margin: '6px 0 18px'}} />
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
					<div style={{textAlign: 'center', flex: 1}}>
						<div style={{fontSize: 70}}>🏠</div>
						<div style={{fontFamily: UI, fontWeight: 800, fontSize: 26, color: '#2b1a0e'}}>BRIAN DÁ</div>
						<div style={{fontFamily: DISPLAY, fontSize: 48, color: '#2b1a0e'}}>MORADIA</div>
					</div>
					<div style={{fontFamily: DISPLAY, fontSize: 80, color: '#8a2a1a'}}>⇄</div>
					<div style={{textAlign: 'center', flex: 1}}>
						<div style={{fontSize: 70}}>{t >= debtAt ? '💰' : '❔'}</div>
						<div style={{fontFamily: UI, fontWeight: 800, fontSize: 26, color: '#2b1a0e'}}>JASON PAGA COM</div>
						<div style={{fontFamily: DISPLAY, fontSize: 48, color: t >= debtAt ? '#8a2a1a' : '#2b1a0e'}}>{t >= debtAt ? 'COBRAR DÍVIDAS' : '???'}</div>
					</div>
				</div>
			</div>
			{t >= debtAt ? (
				<div style={{position: 'absolute', top: 770, width: '100%', textAlign: 'center', opacity: d, transform: `scale(${interpolate(d, [0, 1], [2, 1])}) rotate(-4deg)`}}>
					<span style={{display: 'inline-block', fontFamily: DISPLAY, fontSize: 60, color: C.red, border: `6px solid ${C.red}`, borderRadius: 10, padding: '4px 20px', background: 'rgba(11,6,18,0.7)'}}>PARA ATIVIDADES CRIMINOSAS</span>
				</div>
			) : null}
		</AbsoluteFill>
	);
};

/** Boleto de aluguel carimbado "PROBLEMA" */
const Boleto: React.FC<{start: number; dur: number; problemAt: number}> = ({start, dur, problemAt}) => {
	const s = useSpring(0, 13, 240);
	const p = useAt(start, problemAt, 9, 320);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 380, left: SAFE.left, right: 140, background: 'white', borderRadius: 10, padding: '22px 26px', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', opacity: s, transform: `translateY(${(1 - s) * 300}px) rotate(1.5deg)`}}>
				<div style={{display: 'flex', justifyContent: 'space-between', fontFamily: UI, fontWeight: 800, fontSize: 26, color: '#333'}}>
					<span>BOLETO · ALUGUEL</span>
					<span>VENC. 05</span>
				</div>
				<div style={{marginTop: 18, height: 90, backgroundImage: 'repeating-linear-gradient(90deg, #111 0 4px, transparent 4px 7px, #111 7px 9px, transparent 9px 14px)'}} />
				<div style={{fontFamily: UI, fontWeight: 600, fontSize: 22, color: '#555', marginTop: 10}}>00190.00009 01234.567890 12345.678901 1 00000000000</div>
			</div>
			<div style={{position: 'absolute', top: 470, width: '100%', textAlign: 'center', opacity: p, transform: `scale(${interpolate(p, [0, 1], [2.4, 1])}) rotate(-8deg)`}}>
				<span style={{display: 'inline-block', fontFamily: DISPLAY, fontSize: 120, color: C.red, border: `10px solid ${C.red}`, borderRadius: 14, padding: '0 30px', background: 'rgba(255,255,255,0.85)'}}>PROBLEMA</span>
			</div>
		</AbsoluteFill>
	);
};

/** Ficha do Jason */
const JasonFile: React.FC<{start: number; dur: number; rows: [string, string, number][]}> = ({start, dur, rows}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 360, left: SAFE.left, right: 140, background: 'rgba(11,6,18,0.9)', borderRadius: 18, padding: '22px 26px', borderLeft: `10px solid ${C.cyan}`, opacity: s, transform: `translateY(${(1 - s) * 50}px)`}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 26, letterSpacing: 6, color: C.cyan}}>FICHA</div>
				<div style={{fontFamily: DISPLAY, fontSize: 80, color: 'white', lineHeight: 1.05}}>JASON DUVAL</div>
				{rows.map(([icon, text, at]) => {
					const p = spring({frame: frame - f(at - start), fps: 30, config: {damping: 11, stiffness: 300}});
					return frame >= f(at - start) ? (
						<div key={text} style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 14, opacity: p, transform: `translateX(${(1 - p) * 200}px)`}}>
							<span style={{fontSize: 46}}>{icon}</span>
							<span style={{fontFamily: DISPLAY, fontSize: 52, color: 'white'}}>{text}</span>
						</div>
					) : null;
				})}
			</div>
		</AbsoluteFill>
	);
};

/** Ajuda → obrigação, com corrente */
const Obligation: React.FC<{start: number; dur: number; helpAt: number; oblAt: number}> = ({start, dur, helpAt, oblAt}) => {
	const frame = useCurrentFrame();
	const h = useAt(start, helpAt, 12, 260);
	const o = useAt(start, oblAt, 9, 320);
	const out = useOut(dur);
	const t = start + frame / 30;
	const shake = t >= oblAt ? Math.sin(frame * 1.7) * 3 * Math.max(0, 1 - (t - oblAt) * 1.5) : 0;
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 400, width: '100%', textAlign: 'center'}}>
				<div style={{opacity: h * (t >= oblAt ? 0.5 : 1), transform: `scale(${interpolate(h, [0, 1], [1.5, 1])})`}}>
					<span style={{fontFamily: DISPLAY, fontSize: 110, color: GREEN, textShadow: '0 6px 0 #000', textDecoration: t >= oblAt ? 'line-through' : 'none'}}>🤝 AJUDA</span>
				</div>
				<div style={{fontFamily: DISPLAY, fontSize: 90, color: C.yellow, opacity: o, lineHeight: 1}}>↓</div>
				<div style={{opacity: o, transform: `scale(${interpolate(o, [0, 1], [2, 1])}) translateX(${shake}px)`}}>
					<span style={{fontFamily: DISPLAY, fontSize: 120, color: C.red, textShadow: '0 6px 0 #000'}}>⛓️ OBRIGAÇÃO</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Mapa de conexões: Jason → Brian → submundo → (depois) Lucia */
const ConnectionMap: React.FC<{start: number; dur: number; jasonAt: number; underAt: number; luciaAt: number}> = ({start, dur, jasonAt, underAt, luciaAt}) => {
	const frame = useCurrentFrame();
	const out = useOut(dur);
	const t = start + frame / 30;
	const grow = (a: number) => interpolate(t, [a, a + 0.5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const node = (x: number, y: number, label: string, color: string, at: number) => {
		const p = spring({frame: frame - f(at - start), fps: 30, config: {damping: 11, stiffness: 280}});
		return (
			<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${p})`}}>
				<div style={{background: color, borderRadius: 16, padding: '12px 24px', fontFamily: DISPLAY, fontSize: 52, color: 'white', boxShadow: '0 12px 30px rgba(0,0,0,0.55)', whiteSpace: 'nowrap'}}>{label}</div>
			</div>
		);
	};
	const line = (x1: number, y1: number, x2: number, y2: number, g: number, dash = false) => <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * g} y2={y1 + (y2 - y1) * g} stroke={dash ? 'rgba(255,255,255,0.8)' : C.yellow} strokeWidth={10} strokeDasharray={dash ? '18 14' : undefined} strokeLinecap="round" />;
	return (
		<AbsoluteFill style={{opacity: out}}>
			<svg width={1080} height={1920} style={{position: 'absolute'}}>
				{line(280, 420, 540, 600, grow(jasonAt + 0.3))}
				{line(540, 600, 800, 780, grow(underAt))}
				{line(280, 420, 280, 900, grow(luciaAt), true)}
			</svg>
			{node(280, 420, 'JASON', C.cyan, jasonAt)}
			{node(540, 600, 'BRIAN', C.orange, jasonAt + 0.4)}
			{node(800, 780, 'SUBMUNDO', C.red, underAt)}
			{t >= luciaAt ? node(280, 900, 'LUCIA (DEPOIS)', C.pink, luciaAt) : null}
		</AbsoluteFill>
	);
};

const Checklist: React.FC<{start: number; dur: number; yesAt: number; noAt: number}> = ({start, dur, yesAt, noAt}) => {
	const y = useAt(start, yesAt, 11, 280);
	const n = useAt(start, noAt, 11, 280);
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	const row = (ok: boolean, text: string, p: number) => (
		<div style={{display: 'flex', alignItems: 'center', gap: 20, background: 'rgba(11,6,18,0.9)', borderRadius: 16, padding: '16px 22px', marginTop: 18, opacity: p, transform: `translateX(${(1 - p) * 220}px)`, borderLeft: `10px solid ${ok ? GREEN : C.red}`}}>
			<div style={{width: 76, height: 76, borderRadius: 38, background: ok ? GREEN : C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
				<span style={{fontFamily: DISPLAY, fontSize: 56, color: C.ink}}>{ok ? '✓' : '✗'}</span>
			</div>
			<span style={{fontFamily: DISPLAY, fontSize: 56, color: 'white', lineHeight: 1.05}}>{text}</span>
		</div>
	);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 380, left: SAFE.left, right: 140}}>
				<div style={{opacity: s}}>
					<Chip bg={C.yellow} color={C.ink} size={36}>
						⚠ ATENÇÃO
					</Chip>
				</div>
				{row(true, 'ACORDO CONFIRMADO PELA ROCKSTAR', y)}
				{row(false, 'TODAS AS CONSEQUÊNCIAS REVELADAS', n)}
			</div>
		</AbsoluteFill>
	);
};

/** Notificação de missão secundária (piada) */
const SideQuest: React.FC<{dur: number}> = ({dur}) => {
	const s = useSpring(0.1, 12, 260);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 300, left: SAFE.left}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 22, letterSpacing: 4, color: C.ink, background: C.yellow, padding: '5px 12px', borderRadius: 6}}>PIADA · NÃO É MISSÃO DO JOGO</div>
			</div>
			<div style={{position: 'absolute', top: 380, left: SAFE.left, right: 140, background: 'rgba(11,6,18,0.92)', border: `4px solid ${C.yellow}`, borderRadius: 18, padding: '20px 26px', opacity: s, transform: `translateY(${(1 - s) * -200}px)`}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 26, letterSpacing: 4, color: C.yellow}}>📍 NOVA MISSÃO SECUNDÁRIA</div>
				<div style={{fontFamily: DISPLAY, fontSize: 64, color: 'white', lineHeight: 1.1, marginTop: 8}}>"O PROPRIETÁRIO ESTÁ NA PORTA"</div>
			</div>
		</AbsoluteFill>
	);
};

// ------------------------------------------------------------------ timeline

export const BrianOverlays: React.FC = () => (
	<AbsoluteFill>
		<At from={0} to={2.4}>
			<HookTitle dur={2.4} />
		</At>
		<At from={2.4} to={4.6}>
			<RentZero dur={2.2} />
		</At>
		<At from={4.6} to={9.58}>
			<PriceTag start={4.6} dur={4.98} caroAt={8.14} />
		</At>
		<At from={9.58} to={15.34}>
			<StayTill start={9.58} dur={5.76} ownerAt={11.74} />
		</At>
		<At from={15.34} to={19.46}>
			<NameCard start={15.34} dur={4.12} nameAt={18.42} />
		</At>
		<At from={19.46} to={23.04}>
			<Dossier
				start={19.46}
				dur={3.58}
				items={[
					['CRIMINOSO EXPERIENTE', 19.64, C.ink],
					['💊 TRÁFICO DE DROGAS', 21.3, C.red],
				]}
			/>
		</At>
		<At from={23.04} to={29.4}>
			<NotThatFriend start={23.04} dur={6.36} sofaAt={25.3} pizzaAt={27.64} crossAt={28.2} />
		</At>
		<At from={29.4} to={31.68}>
			<Stamp text="NÃO É BEM ASSIM" top={470} color={C.yellow} />
		</At>
		<At from={31.68} to={39.64}>
			<Deal start={31.68} dur={7.96} debtAt={35.84} />
		</At>
		<At from={39.64} to={45.0}>
			<Boleto start={39.64} dur={5.36} problemAt={43.92} />
		</At>
		<At from={45.0} to={47.78}>
			<AbsoluteFill style={{alignItems: 'center', top: 470}}>
				<Chip bg={C.cyan} color={C.ink} size={50}>
					E O JASON NISSO TUDO?
				</Chip>
			</AbsoluteFill>
		</At>
		<At from={47.78} to={54.04}>
			<JasonFile
				start={47.78}
				dur={6.26}
				rows={[
					['🎖️', 'EXPERIÊNCIA MILITAR', 48.14],
					['🕶️', 'TRABALHA COM CRIMINOSOS', 49.46],
					['🧭', 'PROCURANDO SEU LUGAR', 51.48],
				]}
			/>
		</At>
		<At from={54.04} to={61.02}>
			<Obligation start={54.04} dur={6.98} helpAt={57.72} oblAt={58.84} />
		</At>
		<At from={61.02} to={69.8}>
			<ConnectionMap start={61.02} dur={8.78} jasonAt={64.48} underAt={65.86} luciaAt={68.42} />
		</At>
		<At from={69.8} to={78.9}>
			<Checklist start={69.8} dur={9.1} yesAt={71.58} noAt={74.44} />
		</At>
		<At from={78.9} to={88.34}>
			<Poll start={78.9} aAt={81.12} bAt={86.84} a="MORO DE GRAÇA 🏠" b="PAGO ALUGUEL 💸" />
		</At>
		<At from={88.34} to={92.16}>
			<SideQuest dur={3.82} />
		</At>
		<At from={93.7} to={98.6}>
			<EndCard start={93.7} subAt={93.98} />
		</At>
		<At from={95.38} to={98.6}>
			<AbsoluteFill style={{alignItems: 'center', top: 1120}}>
				<div style={{fontFamily: DISPLAY, fontSize: 66, color: 'white', textAlign: 'center', textShadow: '0 5px 0 #000', padding: '0 80px', whiteSpace: 'pre-line'}}>{'MAIS CURIOSIDADES\nDE GTA 6'}</div>
			</AbsoluteFill>
		</At>
	</AbsoluteFill>
);
