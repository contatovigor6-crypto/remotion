import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame} from 'remotion';
import {At, Chip, Stamp, useOut, useSpring} from '../components/Overlays';
import {EndCard} from '../fps/Overlays';
import {C, DISPLAY, GRAD, SAFE, UI, f} from '../theme';

const GREEN = '#3DFF8A';
const useAt = (start: number, at: number, damping = 12, stiffness = 260) => useSpring(at - start, damping, stiffness);

/** Contador gigante "17 DIAS" com dígitos girando */
const Countdown: React.FC<{dur: number; days: number; top?: number; label: string}> = ({dur, days, top = 380, label}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 10, 260);
	const out = useOut(dur, 4);
	const spin = frame < 14 ? Math.round(99 - (99 - days) * (frame / 14)) : days;
	return (
		<AbsoluteFill style={{alignItems: 'center', top, opacity: out}}>
			<div style={{fontFamily: UI, fontWeight: 800, fontSize: 40, letterSpacing: 10, color: C.yellow, textShadow: '0 3px 10px #000', opacity: s}}>{label}</div>
			<div style={{fontFamily: DISPLAY, fontSize: 330, lineHeight: 0.95, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 12px 0 #000) drop-shadow(0 0 40px rgba(255,62,154,0.6))', transform: `scale(${interpolate(s, [0, 1], [1.6, 1])})`, fontVariantNumeric: 'tabular-nums'}}>{spin}</div>
			<div style={{fontFamily: DISPLAY, fontSize: 130, color: 'white', lineHeight: 1, textShadow: '0 8px 0 #000', opacity: s}}>DIAS</div>
		</AbsoluteFill>
	);
};

const DateCard: React.FC<{start: number; dur: number; dateAt: number; platAt: number}> = ({start, dur, dateAt, platAt}) => {
	const d = useAt(start, dateAt, 10, 280);
	const p = useAt(start, platAt, 12, 260);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{alignItems: 'center', top: 420, opacity: out}}>
			<div style={{fontFamily: UI, fontWeight: 800, fontSize: 34, letterSpacing: 8, color: C.yellow, opacity: d}}>CONFIRMADO PELA ROCKSTAR</div>
			<div style={{fontFamily: DISPLAY, fontSize: 200, lineHeight: 1, color: 'white', textShadow: '0 10px 0 #000', opacity: d, transform: `scale(${interpolate(d, [0, 1], [1.7, 1])})`}}>19 NOV</div>
			<div style={{marginTop: 18, opacity: p, transform: `translateY(${(1 - p) * 40}px)`, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center'}}>
				<Chip bg="white" color={C.ink} size={42}>
					🎮 PLAYSTATION 5
				</Chip>
				<Chip bg="#107C10" size={42}>
					🎮 XBOX SERIES X|S
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

/** Barra de download do pré-carregamento */
const Preload: React.FC<{start: number; dur: number; at: number; weekAt: number}> = ({start, dur, at, weekAt}) => {
	const frame = useCurrentFrame();
	const t = start + frame / 30;
	const s = useAt(start, at, 12, 260);
	const w = useAt(start, weekAt, 10, 300);
	const out = useOut(dur);
	const prog = interpolate(t, [at, start + dur], [0.03, 0.88], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 380, left: SAFE.left, right: 140, background: 'rgba(11,6,18,0.92)', borderRadius: 22, padding: '22px 26px', borderLeft: `10px solid ${GREEN}`, opacity: s, transform: `translateY(${(1 - s) * 60}px)`}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 26, letterSpacing: 5, color: GREEN}}>⬇️ PRÉ-CARREGAMENTO DIGITAL</div>
				<div style={{fontFamily: DISPLAY, fontSize: 110, color: 'white', lineHeight: 1.05}}>12 DE NOVEMBRO</div>
				<div style={{marginTop: 12, height: 30, borderRadius: 15, background: 'rgba(255,255,255,0.15)', overflow: 'hidden'}}>
					<div style={{width: `${prog * 100}%`, height: '100%', background: GREEN}} />
				</div>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 24, color: 'rgba(255,255,255,0.75)', marginTop: 8}}>BAIXANDO GTA VI… {Math.round(prog * 100)}%</div>
			</div>
			{t >= weekAt ? (
				<div style={{position: 'absolute', top: 760, left: SAFE.left, opacity: w, transform: `scale(${interpolate(w, [0, 1], [1.6, 1])}) rotate(-3deg)`, transformOrigin: 'left center'}}>
					<Chip bg={C.yellow} color={C.ink} size={46}>
						1 SEMANA ANTES DO LANÇAMENTO
					</Chip>
				</div>
			) : null}
		</AbsoluteFill>
	);
};

/** Versão física: caixa com código, sem disco (ILUSTRAÇÃO) */
const CodeBox: React.FC<{start: number; dur: number; codeAt: number; noDiscAt: number}> = ({start, dur, codeAt, noDiscAt}) => {
	const frame = useCurrentFrame();
	const t = start + frame / 30;
	const s = useSpring(0, 13, 220);
	const c = useAt(start, codeAt, 11, 280);
	const n = useAt(start, noDiscAt, 9, 320);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 300, left: SAFE.left}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 22, letterSpacing: 4, color: C.ink, background: C.yellow, padding: '5px 12px', borderRadius: 6}}>ILUSTRAÇÃO · NÃO É A CAIXA OFICIAL</div>
			</div>
			<div style={{position: 'absolute', top: 380, left: 0, right: 0, textAlign: 'center', opacity: s}}>
				<div style={{fontFamily: DISPLAY, fontSize: 96, color: 'white', textShadow: '0 6px 0 #000'}}>📦 VERSÃO FÍSICA</div>
			</div>
			<div style={{position: 'absolute', top: 520, left: 300, width: 480, height: 300, background: 'linear-gradient(135deg, #2a1440, #0b0612)', border: '6px solid rgba(255,255,255,0.85)', borderRadius: 18, transform: `perspective(900px) rotateY(-14deg) scale(${s})`, boxShadow: '0 30px 60px rgba(0,0,0,0.7)'}}>
				<div style={{position: 'absolute', left: 40, right: 40, top: 70, background: 'white', borderRadius: 10, padding: '14px 18px', opacity: c, transform: `translateY(${(1 - c) * -120}px) rotate(-3deg)`}}>
					<div style={{fontFamily: UI, fontWeight: 800, fontSize: 20, color: '#666', letterSpacing: 3}}>CÓDIGO DE DOWNLOAD</div>
					<div style={{fontFamily: 'monospace', fontWeight: 800, fontSize: 34, color: C.ink, letterSpacing: 4}}>XXXX-XXXX-XXXX</div>
				</div>
			</div>
			{t >= noDiscAt ? (
				<div style={{position: 'absolute', top: 870, left: 0, right: 0, textAlign: 'center', opacity: n, transform: `scale(${interpolate(n, [0, 1], [2, 1])})`}}>
					<span style={{display: 'inline-flex', alignItems: 'center', gap: 16, fontFamily: DISPLAY, fontSize: 84, color: 'white', background: C.red, padding: '4px 30px', borderRadius: 14, boxShadow: '0 12px 30px rgba(0,0,0,0.6)'}}>💿 SEM DISCO</span>
				</div>
			) : null}
		</AbsoluteFill>
	);
};

const MusicCard: React.FC<{dur: number; title: string; date: string; color: string; sub: string}> = ({dur, title, date, color, sub}) => {
	const s = useSpring(0, 11, 280);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 700, left: SAFE.left, right: 140, opacity: s, transform: `translateX(${(1 - s) * -300}px)`, background: 'rgba(11,6,18,0.9)', borderRadius: 22, padding: '20px 26px', borderLeft: `10px solid ${color}`}}>
				<Chip bg={color} size={36}>
					{sub}
				</Chip>
				<div style={{fontFamily: DISPLAY, fontSize: 100, color: 'white', lineHeight: 1.05, marginTop: 12, textShadow: '0 6px 0 #000'}}>{title}</div>
				<div style={{fontFamily: DISPLAY, fontSize: 130, lineHeight: 1, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 8px 0 #000)'}}>{date}</div>
			</div>
		</AbsoluteFill>
	);
};

const Surprise: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 11, 280);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{alignItems: 'center', top: 430, opacity: out}}>
			<div style={{fontFamily: DISPLAY, fontSize: 120, color: 'white', textShadow: '0 7px 0 #000', opacity: s}}>MAIS UMA</div>
			<div style={{fontFamily: DISPLAY, fontSize: 170, lineHeight: 1, color: C.yellow, textShadow: '0 9px 0 #000', transform: `scale(${(1 + 0.04 * Math.sin(frame / 4)) * interpolate(s, [0, 1], [1.8, 1])}) rotate(-3deg)`}}>SURPRESA?</div>
		</AbsoluteFill>
	);
};

// ------------------------------------------------------------------ timeline

export const ContagemOverlays: React.FC = () => (
	<AbsoluteFill>
		<At from={0} to={2.4}>
			<Countdown dur={2.4} days={17} label="FALTAM APENAS" />
		</At>
		<At from={5.4} to={10.0}>
			<AbsoluteFill style={{alignItems: 'center', top: 470}}>
				<Chip bg={C.pink} size={50}>
					📋 O QUE TODO FÃ PRECISA SABER
				</Chip>
			</AbsoluteFill>
		</At>
		<At from={12.2} to={17.0}>
			<DateCard start={12.2} dur={4.8} dateAt={12.2} platAt={13.7} />
		</At>
		<At from={17.0} to={27.7}>
			<Preload start={17.0} dur={10.7} at={19.1} weekAt={23.7} />
		</At>
		<At from={31.0} to={37.5}>
			<CodeBox start={31.0} dur={6.5} codeAt={34.1} noDiscAt={36.4} />
		</At>
		<At from={40.0} to={42.6}>
			<MusicCard dur={2.6} sub="💿 ÁLBUM OFICIAL" title="GTA VI: THE ALBUM" date="19 NOV" color={C.pink} />
		</At>
		<At from={42.6} to={47.7}>
			<MusicCard dur={5.1} sub="🎼 TRILHA ORIGINAL · JUSTICE" title="PREVISTA PARA" date="11 DEZ" color={C.purple} />
		</At>
		<At from={49.3} to={55.6}>
			<Surprise dur={6.3} />
		</At>
		<At from={55.6} to={56.5}>
			<Stamp text="AINDA NÃO SABEMOS" top={520} color={C.orange} />
		</At>
		<At from={58.5} to={61.1}>
			<Countdown dur={2.6} days={17} top={420} label="A CONTAGEM COMEÇOU" />
		</At>
		<At from={61.1} to={62.4}>
			<Stamp text="VOCÊ ESTÁ PREPARADO?" top={520} color={C.yellow} />
		</At>
		<At from={62.4} to={67.4}>
			<EndCard start={62.4} subAt={63.6} />
		</At>
	</AbsoluteFill>
);
