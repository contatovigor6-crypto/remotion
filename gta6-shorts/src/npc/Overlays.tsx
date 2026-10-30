import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame} from 'remotion';
import {At, Chip, Stamp, TitleCard, useOut, useSpring} from '../components/Overlays';
import {EndCard} from '../fps/Overlays';
import {Poll} from '../preso/Overlays';
import {C, DISPLAY, GRAD, SAFE, UI, f} from '../theme';

const GREEN = '#3DFF8A';

/** Mola a partir de um instante absoluto (s) dentro de um <At from={start}> */
const useAt = (start: number, at: number, damping = 12, stiffness = 260) => useSpring(at - start, damping, stiffness);

const IllusTag: React.FC<{top?: number}> = ({top = 300}) => (
	<div style={{position: 'absolute', top, left: SAFE.left}}>
		<div style={{fontFamily: UI, fontWeight: 800, fontSize: 22, letterSpacing: 4, color: C.ink, background: C.yellow, padding: '5px 12px', borderRadius: 6}}>ILUSTRAÇÃO · NÃO É A TELA DO JOGO</div>
	</div>
);

const HookTitle: React.FC<{dur: number}> = ({dur}) => {
	const a = useSpring(0, 12, 260);
	const b = useSpring(1.2, 10, 300);
	const out = useOut(dur, 3);
	return (
		<AbsoluteFill style={{alignItems: 'center', top: 400, opacity: out}}>
			<div style={{fontFamily: DISPLAY, fontSize: 120, color: 'white', textShadow: '0 6px 0 #000', opacity: a, transform: `scale(${interpolate(a, [0, 1], [1.5, 1])})`}}>O MAIOR PERIGO</div>
			<div style={{fontFamily: DISPLAY, fontSize: 170, lineHeight: 1, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 8px 0 #000)', opacity: b, transform: `scale(${interpolate(b, [0, 1], [1.8, 1])})`}}>DE GTA 6</div>
		</AbsoluteFill>
	);
};

/** "Não está nos criminosos / nem na polícia" — riscados, e "nas pessoas da rua" */
const NotThem: React.FC<{start: number; dur: number; crimAt: number; polAt: number; streetAt: number}> = ({start, dur, crimAt, polAt, streetAt}) => {
	const frame = useCurrentFrame();
	const t = start + frame / 30;
	const out = useOut(dur);
	const item = (label: string, at: number, crossAt: number) => {
		const p = spring({frame: frame - f(at - start), fps: 30, config: {damping: 11, stiffness: 280}});
		const x = interpolate(t, [crossAt, crossAt + 0.25], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
		return t >= at ? (
			<div key={label} style={{position: 'relative', display: 'inline-block', marginBottom: 16, opacity: p, transform: `translateX(${(1 - p) * -200}px)`}}>
				<Chip bg="rgba(11,6,18,0.9)" size={56}>
					{label}
				</Chip>
				<div style={{position: 'absolute', left: -10, top: '50%', height: 14, width: `${x * 106}%`, background: C.red, borderRadius: 7, transform: 'rotate(-4deg)'}} />
			</div>
		) : null;
	};
	const s = useAt(start, streetAt, 9, 320);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 400, left: SAFE.left, right: 140}}>
				{item('🕶️ CRIMINOSOS', crimAt, crimAt + 0.5)}
				<br />
				{item('🚔 POLÍCIA', polAt, polAt + 0.4)}
			</div>
			{t >= streetAt ? (
				<div style={{position: 'absolute', top: 700, left: SAFE.left, opacity: s, transform: `scale(${interpolate(s, [0, 1], [1.8, 1])}) rotate(-3deg)`, transformOrigin: 'left center'}}>
					<Chip bg={C.yellow} color={C.ink} size={60}>
						🚶 AS PESSOAS NA RUA
					</Chip>
				</div>
			) : null}
		</AbsoluteFill>
	);
};

/** Ficha de "IA" de NPC com barras subindo */
const Complexity: React.FC<{start: number; dur: number}> = ({start, dur}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	const bars: [string, number, string][] = [
		['REAÇÕES', 0.92, C.pink],
		['PERSONALIDADE', 0.85, C.purple],
		['IMPREVISIBILIDADE', 0.97, C.red],
	];
	return (
		<AbsoluteFill style={{opacity: out}}>
			<IllusTag />
			<div style={{position: 'absolute', top: 370, left: SAFE.left, right: 140, background: 'rgba(11,6,18,0.9)', borderRadius: 20, padding: '24px 28px', borderLeft: `10px solid ${C.cyan}`, opacity: s, transform: `translateY(${(1 - s) * 60}px)`}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 26, letterSpacing: 6, color: C.cyan}}>NPC · COMPORTAMENTO</div>
				<div style={{fontFamily: DISPLAY, fontSize: 76, color: 'white'}}>MUITO MAIS COMPLEXO</div>
				{bars.map(([label, v, color], i) => {
					const p = interpolate(frame, [12 + i * 8, 50 + i * 8], [0, v], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
					return (
						<div key={label} style={{marginTop: 16}}>
							<div style={{fontFamily: UI, fontWeight: 800, fontSize: 24, color: 'white', letterSpacing: 3}}>{label}</div>
							<div style={{marginTop: 6, height: 26, borderRadius: 13, background: 'rgba(255,255,255,0.15)', overflow: 'hidden'}}>
								<div style={{width: `${p * 100}%`, height: '100%', background: color, borderRadius: 13}} />
							</div>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

/** Normal → PROBLEMA */
const NormalToProblem: React.FC<{start: number; dur: number; normalAt: number; probAt: number}> = ({start, dur, normalAt, probAt}) => {
	const n = useAt(start, normalAt, 12, 260);
	const p = useAt(start, probAt, 9, 320);
	const out = useOut(dur);
	const frame = useCurrentFrame();
	const t = start + frame / 30;
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 420, width: '100%', textAlign: 'center'}}>
				<div style={{opacity: n * (t >= probAt ? 0.5 : 1), transform: `scale(${interpolate(n, [0, 1], [1.5, 1])})`}}>
					<span style={{fontFamily: DISPLAY, fontSize: 100, color: GREEN, textShadow: '0 6px 0 #000', textDecoration: t >= probAt ? 'line-through' : 'none'}}>😌 SITUAÇÃO NORMAL</span>
				</div>
				<div style={{fontFamily: DISPLAY, fontSize: 90, color: C.yellow, opacity: p, lineHeight: 1}}>↓</div>
				<div style={{opacity: p, transform: `scale(${interpolate(p, [0, 1], [2, 1])}) rotate(-3deg)`}}>
					<span style={{fontFamily: DISPLAY, fontSize: 130, color: C.red, textShadow: '0 6px 0 #000'}}>💥 PROBLEMA</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};

const StayTill: React.FC<{start: number; dur: number; detailAt: number}> = ({start, dur, detailAt}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 240);
	const d = useAt(start, detailAt);
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
						UM DETALHE MUDA COMO VOCÊ JOGA
					</Chip>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** "Outros jogos": NPCs clonados com o mesmo comportamento → "GTA 6": todos diferentes */
const Clones: React.FC<{start: number; dur: number; gtaAt: number}> = ({start, dur, gtaAt}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	const t = start + frame / 30;
	const gta = t >= gtaAt;
	const faces = gta ? ['😎', '😡', '😨', '🤨', '😏'] : ['😐', '😐', '😐', '😐', '😐'];
	return (
		<AbsoluteFill style={{opacity: out}}>
			<IllusTag />
			<div style={{position: 'absolute', top: 380, left: SAFE.left, right: 140, opacity: s}}>
				<Chip bg={gta ? C.pink : '#444'} size={34}>
					{gta ? 'GTA 6: CADA UM DE UM JEITO' : 'OUTROS JOGOS: TODO MUNDO IGUAL'}
				</Chip>
				<div style={{display: 'flex', justifyContent: 'space-between', marginTop: 24}}>
					{faces.map((e, i) => {
						const p = spring({frame: frame - i * 4 - (gta ? f(gtaAt - start) : 0), fps: 30, config: {damping: 10, stiffness: 300}});
						return (
							<div key={i} style={{width: 150, height: 150, borderRadius: 75, background: gta ? 'rgba(255,255,255,0.95)' : 'rgba(180,180,180,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 92, transform: `scale(${p}) translateY(${gta ? Math.sin(frame / 5 + i) * 8 : 0}px)`, boxShadow: '0 10px 26px rgba(0,0,0,0.5)'}}>
								{e}
							</div>
						);
					})}
				</div>
			</div>
		</AbsoluteFill>
	);
};

const TEMPERS: [string, string, string, number][] = [
	['😌', 'CALMO', GREEN, 0],
	['😡', 'ESQUENTADO', C.red, 0.35],
	['😨', 'MEDROSO', C.cyan, 0.7],
	['🔫', 'PERIGOSO', C.orange, 1.05],
];
/** Cartas de temperamento */
const Tempers: React.FC<{start: number; dur: number; at: number}> = ({start, dur, at}) => {
	const frame = useCurrentFrame();
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 370, left: SAFE.left, right: 140, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
				{TEMPERS.map(([e, label, color, d], i) => {
					const p = spring({frame: frame - f(at - start + d), fps: 30, config: {damping: 11, stiffness: 280}});
					return (
						<div key={label} style={{background: 'rgba(11,6,18,0.9)', border: `5px solid ${color}`, borderRadius: 22, padding: '16px 10px', textAlign: 'center', opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.5, 1])}) rotate(${i % 2 ? 3 : -3}deg)`}}>
							<div style={{fontSize: 80}}>{e}</div>
							<div style={{fontFamily: DISPLAY, fontSize: 50, color}}>{label}</div>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

/** Reações possíveis: se afastar / enfrentar / sacar arma */
const ReactList: React.FC<{start: number; dur: number; rows: [string, string, number, string][]}> = ({start, dur, rows}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 380, left: SAFE.left, right: 140}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 28, letterSpacing: 6, color: C.yellow, textShadow: '0 2px 8px #000', opacity: s}}>QUANDO VOCÊ PROVOCA…</div>
				{rows.map(([icon, text, at, color]) => {
					const p = spring({frame: frame - f(at - start), fps: 30, config: {damping: 11, stiffness: 300}});
					return frame >= f(at - start) ? (
						<div key={text} style={{display: 'flex', alignItems: 'center', gap: 18, background: 'rgba(11,6,18,0.9)', borderRadius: 16, padding: '14px 22px', marginTop: 16, borderLeft: `10px solid ${color}`, opacity: p, transform: `translateX(${(1 - p) * 220}px)`}}>
							<span style={{fontSize: 60}}>{icon}</span>
							<span style={{fontFamily: DISPLAY, fontSize: 60, color: 'white'}}>{text}</span>
						</div>
					) : null;
				})}
			</div>
		</AbsoluteFill>
	);
};

/** Olho: o NPC percebe que você está ouvindo a conversa */
const Noticed: React.FC<{start: number; dur: number; seeAt: number}> = ({start, dur, seeAt}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 240);
	const n = useAt(start, seeAt, 9, 320);
	const out = useOut(dur);
	const t = start + frame / 30;
	const blink = Math.floor(frame / 40) % 4 === 0 && frame % 40 < 4;
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 380, left: SAFE.left, right: 140, display: 'flex', alignItems: 'center', gap: 22, opacity: s}}>
				<div style={{width: 150, height: 150, borderRadius: 75, background: 'rgba(11,6,18,0.9)', border: `6px solid ${t >= seeAt ? C.red : 'white'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 90}}>{blink ? '😑' : '👁️'}</div>
				<div style={{fontFamily: DISPLAY, fontSize: 64, color: 'white', lineHeight: 1.05, textShadow: '0 5px 0 #000'}}>VOCÊ ESTÁ OUVINDO A CONVERSA…</div>
			</div>
			{t >= seeAt ? (
				<div style={{position: 'absolute', top: 600, left: SAFE.left, opacity: n, transform: `scale(${interpolate(n, [0, 1], [1.8, 1])})`, transformOrigin: 'left center'}}>
					<Chip bg={C.red} size={56}>
						👀 ELES PERCEBERAM
					</Chip>
				</div>
			) : null}
		</AbsoluteFill>
	);
};

/** Medidor de incômodo subindo */
const Annoyance: React.FC<{start: number; dur: number; reactAt: number}> = ({start, dur, reactAt}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	const t = start + frame / 30;
	const v = interpolate(t, [start + 0.4, reactAt], [0.1, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const color = v > 0.75 ? C.red : v > 0.45 ? C.orange : GREEN;
	const emoji = v > 0.75 ? '😠' : v > 0.45 ? '😒' : '🙂';
	return (
		<AbsoluteFill style={{opacity: out}}>
			<IllusTag />
			<div style={{position: 'absolute', top: 380, left: SAFE.left, right: 140, background: 'rgba(11,6,18,0.9)', borderRadius: 20, padding: '22px 26px', opacity: s}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
					<span style={{fontSize: 80}}>{emoji}</span>
					<div style={{fontFamily: DISPLAY, fontSize: 64, color: 'white'}}>NÍVEL DE INCÔMODO</div>
				</div>
				<div style={{marginTop: 14, height: 40, borderRadius: 20, background: 'rgba(255,255,255,0.15)', overflow: 'hidden', border: '4px solid white'}}>
					<div style={{width: `${v * 100}%`, height: '100%', background: color}} />
				</div>
				{t >= reactAt ? (
					<div style={{marginTop: 16}}>
						<Chip bg={C.red} size={40}>
							REAGE À SUA PRESENÇA
						</Chip>
					</div>
				) : null}
			</div>
		</AbsoluteFill>
	);
};

/** Fugir ✗ → Enfrentar ✓ */
const FleeFight: React.FC<{start: number; dur: number; fleeAt: number; fightAt: number}> = ({start, dur, fleeAt, fightAt}) => {
	const a = useAt(start, fleeAt, 11, 280);
	const b = useAt(start, fightAt, 9, 320);
	const frame = useCurrentFrame();
	const t = start + frame / 30;
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 400, left: SAFE.left, right: 140}}>
				<div style={{opacity: a, transform: `translateX(${(1 - a) * -200}px)`}}>
					<span style={{fontFamily: DISPLAY, fontSize: 92, color: 'rgba(255,255,255,0.8)', textShadow: '0 5px 0 #000', textDecoration: t >= fightAt ? 'line-through' : 'none'}}>🏃 FUGIR</span>
					<span style={{fontFamily: UI, fontWeight: 800, fontSize: 28, color: C.yellow, marginLeft: 16, letterSpacing: 3}}>COMO EM OUTROS JOGOS</span>
				</div>
				{t >= fightAt ? (
					<div style={{marginTop: 20, opacity: b, transform: `scale(${interpolate(b, [0, 1], [2, 1])}) rotate(-3deg)`, transformOrigin: 'left center'}}>
						<span style={{fontFamily: DISPLAY, fontSize: 130, color: C.red, textShadow: '0 7px 0 #000'}}>👊 ENFRENTAR</span>
					</div>
				) : null}
			</div>
		</AbsoluteFill>
	);
};

const Checklist: React.FC<{start: number; dur: number; yesAt: number; noAt: number}> = ({start, dur, yesAt, noAt}) => {
	const y = useAt(start, yesAt, 11, 280);
	const n = useAt(start, noAt, 11, 280);
	const out = useOut(dur);
	const row = (ok: boolean, text: string, p: number) => (
		<div style={{display: 'flex', alignItems: 'center', gap: 20, background: 'rgba(11,6,18,0.9)', borderRadius: 16, padding: '16px 22px', marginTop: 18, opacity: p, transform: `translateX(${(1 - p) * 220}px)`, borderLeft: `10px solid ${ok ? GREEN : C.orange}`}}>
			<div style={{width: 76, height: 76, borderRadius: 38, background: ok ? GREEN : C.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
				<span style={{fontFamily: DISPLAY, fontSize: 56, color: C.ink}}>{ok ? '✓' : '?'}</span>
			</div>
			<span style={{fontFamily: DISPLAY, fontSize: 56, color: 'white', lineHeight: 1.05}}>{text}</span>
		</div>
	);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 740, left: SAFE.left, right: 140}}>
				{row(true, 'CIDADE QUE PARECE VIVA', y)}
				{row(false, 'PERSONALIDADE ÚNICA PARA CADA NPC?', n)}
			</div>
		</AbsoluteFill>
	);
};

// ------------------------------------------------------------------ timeline

export const NpcOverlays: React.FC = () => (
	<AbsoluteFill>
		<At from={0} to={2.9}>
			<HookTitle dur={2.9} />
		</At>
		<At from={2.9} to={10.82}>
			<NotThem start={2.9} dur={7.92} crimAt={4.88} polAt={6.16} streetAt={7.46} />
		</At>
		<At from={10.82} to={15.66}>
			<Complexity start={10.82} dur={4.84} />
		</At>
		<At from={15.66} to={21.78}>
			<NormalToProblem start={15.66} dur={6.12} normalAt={18.94} probAt={20.8} />
		</At>
		<At from={21.78} to={28.14}>
			<StayTill start={21.78} dur={6.36} detailAt={23.52} />
		</At>
		<At from={28.14} to={34.16}>
			<Clones start={28.14} dur={6.02} gtaAt={34.16} />
		</At>
		<At from={34.16} to={39.12}>
			<Tempers start={34.16} dur={4.96} at={36.2} />
		</At>
		<At from={39.12} to={44.82}>
			<Stamp text="NEM TODO MUNDO" sub="REAGE DO MESMO JEITO" top={470} color={C.yellow} />
		</At>
		<At from={44.82} to={54.94}>
			<ReactList
				start={44.82}
				dur={10.12}
				rows={[
					['🚶', 'SE AFASTAR', 46.44, GREEN],
					['👊', 'ENFRENTAR VOCÊ', 48.16, C.orange],
					['🔫', 'SACAR UMA ARMA', 52.42, C.red],
				]}
			/>
		</At>
		<At from={54.94} to={62.12}>
			<Noticed start={54.94} dur={7.18} seeAt={58.48} />
		</At>
		<At from={62.12} to={67.64}>
			<Annoyance start={62.12} dur={5.52} reactAt={65.54} />
		</At>
		<At from={67.64} to={69.14}>
			<TitleCard
				start={67.64}
				top={680}
				lines={[
					{text: 'AGORA', at: 67.66},
					{text: 'PENSA COMIGO', at: 68.0, big: true},
				]}
			/>
		</At>
		<At from={72.02} to={73.48}>
			<AbsoluteFill style={{alignItems: 'center', top: 470}}>
				<Chip bg={C.pink} size={50}>
					😜 PROVOCOU UM DESCONHECIDO
				</Chip>
			</AbsoluteFill>
		</At>
		<At from={73.48} to={79.0}>
			<FleeFight start={73.48} dur={5.52} fleeAt={74.38} fightAt={77.38} />
		</At>
		<At from={80.18} to={83.14}>
			<AbsoluteFill style={{alignItems: 'center', top: 470}}>
				<Chip bg={C.ink} size={48}>
					⚠ ESCOLHA SUAS BRIGAS
				</Chip>
			</AbsoluteFill>
		</At>
		<At from={85.82} to={87.4}>
			<Stamp text="SEM DESAFORO" top={470} color={C.red} />
		</At>
		<At from={87.4} to={101.1}>
			<Checklist start={87.4} dur={13.7} yesAt={90.0} noAt={97.6} />
		</At>
		<At from={101.1} to={104.28}>
			<Stamp text="AINDA NÃO SABEMOS" sub="ATÉ ONDE ESSE SISTEMA VAI" top={480} color={C.orange} />
		</At>
		<At from={104.28} to={113.92}>
			<Poll start={104.28} aAt={106.16} bAt={110.68} a="EU PROVOCO SIM 😈" b="NEM PENSAR 😰" />
		</At>
		<At from={115.88} to={121.6}>
			<EndCard start={115.88} subAt={116.1} />
		</At>
		<At from={117.6} to={121.6}>
			<AbsoluteFill style={{alignItems: 'center', top: 1120}}>
				<div style={{fontFamily: DISPLAY, fontSize: 66, color: 'white', textAlign: 'center', textShadow: '0 5px 0 #000', padding: '0 80px', whiteSpace: 'pre-line'}}>{'INVESTIGAÇÕES E\nCURIOSIDADES DE GTA 6'}</div>
			</AbsoluteFill>
		</At>
	</AbsoluteFill>
);
