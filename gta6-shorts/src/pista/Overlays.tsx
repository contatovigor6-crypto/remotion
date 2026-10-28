import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {At, Chip, Stamp, TitleCard, useOut, useSpring} from '../components/Overlays';
import {EndCard} from '../fps/Overlays';
import {NotConfirmed, Poll} from '../preso/Overlays';
import {C, DISPLAY, GRAD, SAFE, UI, f} from '../theme';

const RDR = '#E8202A';
const MONEY = '#8FBF7A';

/** Entrada em mola a partir de um instante absoluto (s) dentro de um <At from={start}> */
const useAt = (start: number, at: number, damping = 12, stiffness = 260) => useSpring(at - start, damping, stiffness);

const HookTitle: React.FC<{dur: number}> = ({dur}) => {
	const a = useSpring(0, 12, 260);
	const b = useSpring(0.5, 10, 300);
	const out = useOut(dur, 3);
	return (
		<AbsoluteFill style={{alignItems: 'center', top: 400, opacity: out}}>
			<div style={{fontFamily: DISPLAY, fontSize: 150, color: 'white', textShadow: '0 6px 0 #000', opacity: a, transform: `scale(${interpolate(a, [0, 1], [1.5, 1])})`}}>UMA PISTA</div>
			<div style={{fontFamily: DISPLAY, fontSize: 170, lineHeight: 1, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 8px 0 #000)', opacity: b, transform: `scale(${interpolate(b, [0, 1], [1.8, 1])})`}}>
				ESCONDIDA?
			</div>
		</AbsoluteFill>
	);
};

const GameBadge: React.FC<{label: string; sub: string; color: string; p: number}> = ({label, sub, color, p}) => (
	<div style={{opacity: p, transform: `scale(${interpolate(p, [0, 1], [1.7, 1])})`, background: 'rgba(11,6,18,0.9)', border: `6px solid ${color}`, borderRadius: 20, padding: '14px 26px', textAlign: 'center', minWidth: 300}}>
		<div style={{fontFamily: DISPLAY, fontSize: 78, color, lineHeight: 1.05}}>{label}</div>
		<div style={{fontFamily: UI, fontWeight: 800, fontSize: 24, letterSpacing: 4, color: 'white'}}>{sub}</div>
	</div>
);

/** GTA VI ligado a Red Dead II por uma corrente tracejada com "?" */
const Connect: React.FC<{start: number; dur: number; gtaAt: number; rdrAt: number}> = ({start, dur, gtaAt, rdrAt}) => {
	const frame = useCurrentFrame();
	const g = useAt(start, gtaAt);
	const r = useAt(start, rdrAt);
	const out = useOut(dur);
	const pulse = 1 + 0.08 * Math.sin(frame / 3);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 380, left: SAFE.left, right: 140, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
				<GameBadge label="GTA VI" sub="VICE CITY" color={C.pink} p={g} />
				<div style={{flex: 1, height: 10, margin: '0 12px', backgroundImage: `repeating-linear-gradient(90deg, ${C.yellow} 0 22px, transparent 22px 36px)`, opacity: r, transform: `scaleX(${r})`, position: 'relative'}}>
					<div style={{position: 'absolute', left: '50%', top: -44, transform: `translateX(-50%) scale(${pulse})`, width: 96, height: 96, borderRadius: 48, background: C.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.5)'}}>
						<span style={{fontFamily: DISPLAY, fontSize: 72, color: C.ink}}>?</span>
					</div>
				</div>
				<GameBadge label="RED DEAD II" sub="VELHO OESTE" color={RDR} p={r} />
			</div>
		</AbsoluteFill>
	);
};

/** "A pista está no dinheiro" — com o mascote oficial (caranguejo com nota) entrando */
const InTheMoney: React.FC<{start: number; dur: number; pistaAt: number; moneyAt: number}> = ({start, dur, pistaAt, moneyAt}) => {
	const frame = useCurrentFrame();
	const p = useAt(start, pistaAt);
	const m = useAt(start, moneyAt, 9, 300);
	const out = useOut(dur);
	const bob = Math.sin(frame / 5) * 10;
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 380, left: SAFE.left, opacity: p, transform: `translateX(${(1 - p) * -200}px)`}}>
				<Chip bg={C.ink} size={44}>
					🔍 A PISTA ESTÁ...
				</Chip>
			</div>
			<div style={{position: 'absolute', top: 470, left: SAFE.left, opacity: m, transform: `scale(${interpolate(m, [0, 1], [2.2, 1])}) rotate(-4deg)`, transformOrigin: 'left center'}}>
				<div style={{fontFamily: DISPLAY, fontSize: 150, lineHeight: 1, color: MONEY, textShadow: '0 8px 0 #000, 0 0 40px rgba(143,191,122,0.6)'}}>NO DINHEIRO</div>
			</div>
			<Img src={staticFile('v6/crab.png')} style={{position: 'absolute', top: 660 + bob, right: 150, width: 380, opacity: m, transform: `translateY(${(1 - m) * 500}px) rotate(${-8 + bob / 3}deg)`}} />
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
						UM DETALHE MUDA TUDO
					</Chip>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Moldura de gravação: "TRAILER 2" */
const RecFrame: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 12, 260);
	const out = useOut(dur);
	const blink = Math.floor(frame / 12) % 2 === 0;
	const corner = (style: React.CSSProperties) => <div style={{position: 'absolute', width: 90, height: 90, borderColor: 'white', borderStyle: 'solid', borderWidth: 0, ...style}} />;
	return (
		<AbsoluteFill style={{opacity: out * s}}>
			<div style={{position: 'absolute', top: 300, left: 60, right: 130, bottom: 860}}>
				{corner({top: 0, left: 0, borderTopWidth: 8, borderLeftWidth: 8})}
				{corner({top: 0, right: 0, borderTopWidth: 8, borderRightWidth: 8})}
				{corner({bottom: 0, left: 0, borderBottomWidth: 8, borderLeftWidth: 8})}
				{corner({bottom: 0, right: 0, borderBottomWidth: 8, borderRightWidth: 8})}
				<div style={{position: 'absolute', top: 36, left: 40, display: 'flex', alignItems: 'center', gap: 14}}>
					<div style={{width: 30, height: 30, borderRadius: 15, background: C.red, opacity: blink ? 1 : 0.2}} />
					<span style={{fontFamily: UI, fontWeight: 800, fontSize: 34, color: 'white', letterSpacing: 4, textShadow: '0 2px 8px #000'}}>REC</span>
				</div>
				<div style={{position: 'absolute', top: 120, left: 40, transform: `scale(${interpolate(s, [0, 1], [1.6, 1])})`, transformOrigin: 'left center'}}>
					<div style={{fontFamily: DISPLAY, fontSize: 130, lineHeight: 1, color: 'white', textShadow: '0 6px 0 #000'}}>TRAILER 2</div>
					<div style={{fontFamily: UI, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.yellow, textShadow: '0 2px 8px #000'}}>GRAND THEFT AUTO VI</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Nota de dinheiro ILUSTRADA (não é a nota do jogo): retrato com silhueta e "?" */
const Bill: React.FC<{value: string; reveal: number; tint?: string}> = ({value, reveal, tint = MONEY}) => (
	<div style={{position: 'relative', width: 760, height: 330, borderRadius: 14, background: `linear-gradient(135deg, #e3eedb, ${tint})`, border: '10px double #3d5a35', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', overflow: 'hidden'}}>
		<div style={{position: 'absolute', inset: 14, border: '3px solid rgba(61,90,53,0.6)', borderRadius: 8, backgroundImage: 'repeating-linear-gradient(45deg, rgba(61,90,53,0.08) 0 6px, transparent 6px 14px)'}} />
		{[
			{top: 18, left: 26},
			{top: 18, right: 26},
			{bottom: 14, left: 26},
			{bottom: 14, right: 26},
		].map((pos, i) => (
			<div key={i} style={{position: 'absolute', ...pos, fontFamily: DISPLAY, fontSize: 64, color: '#2f4a28'}}>
				{value}
			</div>
		))}
		<div style={{position: 'absolute', left: '50%', top: 34, transform: 'translateX(-50%)', width: 200, height: 250, borderRadius: '50%', background: 'radial-gradient(#f1f6ec, #b8d1a8)', border: '6px solid #3d5a35', overflow: 'hidden'}}>
			<svg viewBox="0 0 100 125" width="100%" height="100%">
				<circle cx="50" cy="48" r="22" fill="#2f4a28" />
				<path d="M10 125 Q14 80 50 76 Q86 80 90 125 Z" fill="#2f4a28" />
			</svg>
			<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: reveal}}>
				<span style={{fontFamily: DISPLAY, fontSize: 120, color: C.yellow, textShadow: '0 4px 0 #000', transform: `scale(${interpolate(reveal, [0, 1], [2, 1])})`}}>?</span>
			</div>
		</div>
	</div>
);

/** Fãs notam algo estranho nas notas → ampliam com lupa → dois rostos familiares → vistos em RDR2 */
const BillInvestigation: React.FC<{start: number; dur: number; billAt: number; clubAt: number; zoomAt: number; facesAt: number; rdrAt: number}> = ({start, dur, billAt, clubAt, zoomAt, facesAt, rdrAt}) => {
	const frame = useCurrentFrame();
	const t = start + frame / 30;
	const b1 = useAt(start, billAt, 13, 220);
	const b2 = useAt(start, billAt + 0.35, 13, 220);
	const club = useAt(start, clubAt);
	const z = useAt(start, zoomAt, 16, 120);
	const faces = useAt(start, facesAt, 9, 300);
	const rdr = useAt(start, rdrAt);
	const out = useOut(dur);
	// lupa percorre as notas e para sobre os retratos
	const lx = interpolate(t, [zoomAt, zoomAt + 1.2, facesAt], [120, 640, 330], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const ly = interpolate(t, [zoomAt, zoomAt + 1.2, facesAt], [120, 260, 180], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 330, left: 0, right: 0, height: 560}}>
				<div style={{position: 'absolute', left: 60, top: 10, transform: `rotate(-7deg) translateY(${(1 - b1) * 900}px)`, opacity: b1}}>
					<Bill value="10" reveal={faces} />
				</div>
				<div style={{position: 'absolute', left: 230, top: 200, transform: `rotate(5deg) translateY(${(1 - b2) * 900}px)`, opacity: b2}}>
					<Bill value="1" reveal={faces} tint="#a9c99a" />
				</div>
				{/* lupa */}
				<div style={{position: 'absolute', left: lx, top: ly, opacity: z, transform: `scale(${interpolate(z, [0, 1], [0.4, 1])})`}}>
					<div style={{width: 230, height: 230, borderRadius: 115, border: `16px solid ${C.yellow}`, background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.45), rgba(255,255,255,0.05) 60%)', boxShadow: '0 12px 30px rgba(0,0,0,0.6)'}} />
					<div style={{position: 'absolute', left: 190, top: 190, width: 46, height: 150, background: C.yellow, borderRadius: 20, transform: 'rotate(-45deg)', transformOrigin: 'top center'}} />
				</div>
			</div>
			<div style={{position: 'absolute', top: 300, left: SAFE.left}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 22, letterSpacing: 4, color: C.ink, background: C.yellow, padding: '5px 12px', borderRadius: 6, opacity: b1}}>ILUSTRAÇÃO · NÃO É A NOTA DO JOGO</div>
			</div>
			{t >= clubAt && t < facesAt ? (
				<div style={{position: 'absolute', top: 920, left: SAFE.left, opacity: club, transform: `translateX(${(1 - club) * -200}px)`}}>
					<Chip bg={C.purple} size={36}>
						📍 CENA DE CLUBE NOTURNO
					</Chip>
				</div>
			) : null}
			{t >= facesAt ? (
				<div style={{position: 'absolute', top: 920, left: SAFE.left, right: 140, opacity: faces}}>
					<Chip bg={C.ink} size={36}>
						2 ROSTOS FAMILIARES
					</Chip>
					<div style={{marginTop: 12, opacity: rdr, transform: `scale(${interpolate(rdr, [0, 1], [1.5, 1])})`, transformOrigin: 'left center'}}>
						<Chip bg={RDR} size={36}>
							🤠 DE RED DEAD REDEMPTION 2
						</Chip>
					</div>
				</div>
			) : null}
		</AbsoluteFill>
	);
};

/** Fichas dos dois presidentes fictícios (sem retratos: apenas os nomes ditos na narração) */
const Names: React.FC<{start: number; dur: number; aAt: number; bAt: number; subAt: number}> = ({start, dur, aAt, bAt, subAt}) => {
	const a = useAt(start, aAt, 11, 280);
	const b = useAt(start, bAt, 11, 280);
	const s = useAt(start, subAt);
	const out = useOut(dur);
	const card = (name: string, last: string, p: number, rot: number) => (
		<div style={{display: 'flex', alignItems: 'center', gap: 22, background: '#f3e7cf', borderRadius: 12, padding: '16px 24px', marginBottom: 22, opacity: p, transform: `translateX(${(1 - p) * 300}px) rotate(${rot}deg)`, boxShadow: '0 16px 40px rgba(0,0,0,0.55)', border: '4px solid #6b4a2b'}}>
			<div style={{width: 96, height: 120, borderRadius: '50%', background: '#6b4a2b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
				<span style={{fontFamily: DISPLAY, fontSize: 70, color: '#f3e7cf'}}>?</span>
			</div>
			<div>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 22, letterSpacing: 4, color: '#8a2a1a'}}>PRESIDENTE</div>
				<div style={{fontFamily: DISPLAY, fontSize: 70, color: '#2b1a0e', lineHeight: 1.02}}>{name}</div>
				<div style={{fontFamily: DISPLAY, fontSize: 70, color: '#2b1a0e', lineHeight: 1.02}}>{last}</div>
			</div>
		</div>
	);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 340, left: SAFE.left, right: 150}}>
				{card('THADDEUS', 'WAXMAN', a, -2)}
				{card('FRANKLIN', 'HARDIN', b, 1.5)}
				<div style={{opacity: s, transform: `scale(${interpolate(s, [0, 1], [1.6, 1])})`, transformOrigin: 'left center'}}>
					<Chip bg={RDR} size={34}>
						PRESIDENTES FICTÍCIOS · RDR2
					</Chip>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Quadro de investigação: "nomes aleatórios?" riscado → "já existiam em RDR2" */
const CaseBoard: React.FC<{start: number; dur: number; crossAt: number; existAt: number}> = ({start, dur, crossAt, existAt}) => {
	const s = useSpring(0, 13, 240);
	const x = useAt(start, crossAt, 10, 300);
	const e = useAt(start, existAt, 9, 320);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 390, left: SAFE.left, right: 140, opacity: s, transform: `translateY(${(1 - s) * 50}px)`}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 28, letterSpacing: 6, color: C.yellow, textShadow: '0 2px 8px #000'}}>ARQUIVO DO CASO</div>
				<div style={{position: 'relative', display: 'inline-block', marginTop: 8}}>
					<div style={{fontFamily: DISPLAY, fontSize: 84, color: 'white', textShadow: '0 5px 0 #000'}}>NOMES ALEATÓRIOS?</div>
					<div style={{position: 'absolute', left: -10, top: '52%', height: 14, width: `${x * 104}%`, background: C.red, borderRadius: 7, transform: 'rotate(-3deg)'}} />
				</div>
			</div>
			{e > 0.01 ? <Stamp text="JÁ EXISTIAM" sub="NA HISTÓRIA DE RED DEAD REDEMPTION 2" top={640} color={C.yellow} /> : null}
		</AbsoluteFill>
	);
};

/** Os mesmos personagens: de RDR2 para o dinheiro de GTA 6 */
const Transfer: React.FC<{start: number; dur: number; gtaAt: number}> = ({start, dur, gtaAt}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 12, 260);
	const g = useAt(start, gtaAt, 10, 300);
	const out = useOut(dur);
	const t = start + frame / 30;
	const flow = interpolate(t, [start + 0.6, gtaAt], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 360, left: SAFE.left, right: 140}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 28, letterSpacing: 6, color: C.yellow, textShadow: '0 2px 8px #000', opacity: s}}>OS MESMOS PERSONAGENS</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 16}}>
					<GameBadge label="RDR2" sub="HISTÓRIA" color={RDR} p={s} />
					<div style={{flex: 1, position: 'relative', height: 60}}>
						<div style={{position: 'absolute', top: 24, left: 0, height: 12, width: `${flow * 100}%`, background: C.yellow, borderRadius: 6}} />
						<div style={{position: 'absolute', top: -6, left: `calc(${flow * 100}% - 36px)`, fontSize: 60, opacity: s}}>💵</div>
					</div>
					<GameBadge label="GTA VI" sub="DINHEIRO" color={MONEY} p={g} />
				</div>
			</div>
		</AbsoluteFill>
	);
};

const BigQuestion: React.FC<{text: string; color: string; top?: number}> = ({text, color, top = 560}) => {
	const s = useSpring(0, 9, 320);
	return (
		<AbsoluteFill style={{alignItems: 'center', background: `rgba(11,6,18,${0.45 * s})`}}>
			<div style={{position: 'absolute', top, fontFamily: DISPLAY, fontSize: 132, color, textAlign: 'center', lineHeight: 1.02, textShadow: '0 8px 0 #000', whiteSpace: 'pre-line', transform: `scale(${interpolate(s, [0, 1], [2, 1])}) rotate(-3deg)`, opacity: s, padding: '0 60px'}}>{text}</div>
		</AbsoluteFill>
	);
};

/** Tela dividida: GTA VI (arte oficial) × Red Dead Redemption 2 (arte oficial), ligadas no meio */
const Split: React.FC<{start: number; linkAt: number}> = ({start, linkAt}) => {
	const frame = useCurrentFrame();
	const top = spring({frame, fps: 30, config: {damping: 18, stiffness: 200}});
	const bot = spring({frame: frame - 5, fps: 30, config: {damping: 18, stiffness: 200}});
	const l = useAt(start, linkAt, 9, 300);
	const zoom = interpolate(frame, [0, 150], [1.05, 1.15]);
	return (
		<AbsoluteFill style={{background: 'black'}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 960, overflow: 'hidden', transform: `translateX(${(1 - top) * -1080}px)`}}>
				<Img src={staticFile('v6/keyart-car.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '55% 50%', transform: `scale(${zoom})`}} />
				<div style={{position: 'absolute', left: SAFE.left, top: 330}}>
					<Chip bg={C.pink} size={44}>
						GTA VI
					</Chip>
				</div>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 960, height: 960, overflow: 'hidden', transform: `translateX(${(1 - bot) * 1080}px)`}}>
				<Img src={staticFile('v6/rdr2.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 22%', transform: `scale(${zoom})`}} />
			</div>
			<div style={{position: 'absolute', top: 948, left: 0, right: 0, height: 24, background: GRAD}} />
			<div style={{position: 'absolute', top: 960 - 70, left: 540 - 70, width: 140, height: 140, borderRadius: 70, background: C.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${l})`, boxShadow: '0 10px 30px rgba(0,0,0,0.6)'}}>
				<span style={{fontSize: 80}}>🔗</span>
			</div>
		</AbsoluteFill>
	);
};

const Checklist: React.FC<{start: number; dur: number; yesAt: number; noAt: number}> = ({start, dur, yesAt, noAt}) => {
	const y = useAt(start, yesAt, 11, 280);
	const n = useAt(start, noAt, 11, 280);
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	const row = (ok: boolean, text: string, p: number) => (
		<div style={{display: 'flex', alignItems: 'center', gap: 20, background: 'rgba(11,6,18,0.9)', borderRadius: 16, padding: '16px 22px', marginTop: 18, opacity: p, transform: `translateX(${(1 - p) * 220}px)`, borderLeft: `10px solid ${ok ? '#3DFF8A' : C.red}`}}>
			<div style={{width: 76, height: 76, borderRadius: 38, background: ok ? '#3DFF8A' : C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
				<span style={{fontFamily: DISPLAY, fontSize: 56, color: C.ink}}>{ok ? '✓' : '✗'}</span>
			</div>
			<span style={{fontFamily: DISPLAY, fontSize: 56, color: 'white', lineHeight: 1.05}}>{text}</span>
		</div>
	);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 380, left: SAFE.left, right: 140}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 28, letterSpacing: 6, color: C.yellow, textShadow: '0 2px 8px #000', opacity: s}}>O QUE DÁ PARA AFIRMAR</div>
				{row(true, 'REFERÊNCIA VISUAL CONCRETA', y)}
				{row(false, 'PROVA DE UNIVERSO COMPARTILHADO', n)}
			</div>
		</AbsoluteFill>
	);
};

const Detail: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 10, 300);
	const out = useOut(dur);
	const pulse = 1 + 0.05 * Math.sin(frame / 3);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 380, left: 540 - 210, width: 420, height: 420, borderRadius: 210, border: `14px solid ${C.yellow}`, transform: `scale(${s * pulse})`, opacity: s, boxShadow: '0 0 0 2000px rgba(0,0,0,0.45)'}} />
			<div style={{position: 'absolute', top: 740, left: 540 + 110, width: 46, height: 190, background: C.yellow, borderRadius: 20, transform: `rotate(-40deg) scale(${s})`, transformOrigin: 'top center'}} />
			<div style={{position: 'absolute', top: 300, width: '100%', textAlign: 'center', opacity: s}}>
				<Chip bg={C.yellow} color={C.ink} size={38}>
					O DETALHE MAIS INTERESSANTE
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

const OnPurpose: React.FC<{start: number; dur: number; rockstarAt: number}> = ({start, dur, rockstarAt}) => {
	const s = useSpring(0, 12, 260);
	const r = useAt(start, rockstarAt, 10, 300);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 400, left: SAFE.left, right: 140}}>
				<div style={{fontFamily: DISPLAY, fontSize: 104, color: 'white', lineHeight: 1.05, textShadow: '0 6px 0 #000', opacity: s, transform: `translateY(${(1 - s) * 40}px)`}}>SE FOI DE PROPÓSITO...</div>
				<div style={{marginTop: 18, opacity: r, transform: `scale(${interpolate(r, [0, 1], [1.6, 1])})`, transformOrigin: 'left center'}}>
					<Chip bg={C.pink} size={38} style={{whiteSpace: 'nowrap'}}>
						ALGUÉM DA ROCKSTAR QUIS ISSO
					</Chip>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Notificação de conquista: jogador atento */
const Achievement: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 260);
	const out = useOut(dur);
	const shine = interpolate(frame % 60, [0, 30], [-200, 900], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 420, left: SAFE.left, right: 140, transform: `translateY(${(1 - s) * -300}px)`, opacity: s}}>
				<div style={{position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 24, background: 'rgba(11,6,18,0.94)', border: `5px solid ${C.yellow}`, borderRadius: 70, padding: '18px 36px 18px 18px', boxShadow: '0 16px 40px rgba(0,0,0,0.6)'}}>
					<div style={{width: 110, height: 110, borderRadius: 55, background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
						<span style={{fontSize: 64}}>🏆</span>
					</div>
					<div>
						<div style={{fontFamily: UI, fontWeight: 800, fontSize: 24, letterSpacing: 4, color: C.yellow}}>CONQUISTA DESBLOQUEADA</div>
						<div style={{fontFamily: DISPLAY, fontSize: 68, color: 'white', lineHeight: 1.05}}>JOGADOR ATENTO</div>
					</div>
					<div style={{position: 'absolute', top: 0, bottom: 0, left: shine, width: 80, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)', transform: 'skewX(-20deg)'}} />
				</div>
			</div>
		</AbsoluteFill>
	);
};

const CommentPrompt: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 11, 280);
	const out = useOut(dur);
	const dots = '.'.repeat(1 + (Math.floor(frame / 6) % 3));
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 420, left: SAFE.left, right: 140, opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.7, 1])})`, transformOrigin: 'left top'}}>
				<div style={{background: 'white', borderRadius: 28, padding: '24px 30px', boxShadow: '0 16px 40px rgba(0,0,0,0.5)'}}>
					<div style={{fontFamily: UI, fontWeight: 800, fontSize: 26, color: '#606060'}}>💬 Comentários</div>
					<div style={{fontFamily: DISPLAY, fontSize: 70, color: C.ink, marginTop: 6}}>MINHA TEORIA É{dots}</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ------------------------------------------------------------------ timeline

export const PistaOverlays: React.FC = () => (
	<AbsoluteFill>
		<At from={0} to={2.8}>
			<HookTitle dur={2.8} />
		</At>
		<At from={2.8} to={7.6}>
			<Connect start={2.8} dur={4.8} gtaAt={3.9} rdrAt={5.88} />
		</At>
		<At from={7.6} to={11.1}>
			<InTheMoney start={7.6} dur={3.5} pistaAt={9.22} moneyAt={10.06} />
		</At>
		<At from={11.1} to={16.84}>
			<StayTill start={11.1} dur={5.74} detailAt={12.88} />
		</At>
		<At from={16.84} to={19.44}>
			<RecFrame dur={2.6} />
		</At>
		<At from={19.44} to={31.2}>
			<BillInvestigation start={19.44} dur={11.76} billAt={21.3} clubAt={23.7} zoomAt={24.98} facesAt={27.14} rdrAt={29.5} />
		</At>
		<At from={31.2} to={35.0}>
			<Names start={31.2} dur={3.8} aAt={31.32} bAt={32.56} subAt={33.86} />
		</At>
		<At from={36.76} to={37.82}>
			<AbsoluteFill style={{alignItems: 'center', top: 860}}>
				<Chip bg={RDR} size={48}>
					🤠 FAROESTE
				</Chip>
			</AbsoluteFill>
		</At>
		<At from={37.82} to={40.12}>
			<TitleCard
				start={37.82}
				top={640}
				lines={[
					{text: 'E AQUI COMEÇA A', at: 37.9},
					{text: 'INVESTIGAÇÃO', at: 38.94, big: true},
				]}
			/>
		</At>
		<At from={40.12} to={47.2}>
			<CaseBoard start={40.12} dur={7.08} crossAt={41.9} existAt={44.24} />
		</At>
		<At from={47.2} to={52.4}>
			<Transfer start={47.2} dur={5.2} gtaAt={50.86} />
		</At>
		<At from={52.62} to={53.6}>
			<BigQuestion text="COINCIDÊNCIA?" color={C.yellow} />
		</At>
		<At from={53.66} to={54.7}>
			<BigQuestion text={'REFERÊNCIA\nESCONDIDA?'} color={C.pink} />
		</At>
		<At from={54.7} to={59.8}>
			<Split start={54.7} linkAt={57.52} />
		</At>
		<At from={59.8} to={62.64}>
			<Stamp text="CALMA, DETETIVE!" top={470} color={C.cyan} />
		</At>
		<At from={62.64} to={63.38}>
			<Stamp text="🔨 AINDA NÃO" sub="SEM VEREDITO" top={470} color={C.yellow} />
		</At>
		<At from={63.38} to={71.74}>
			<Checklist start={63.38} dur={8.36} yesAt={65.32} noAt={67.72} />
		</At>
		<At from={71.74} to={75.3}>
			<NotConfirmed dur={3.56} rockstarAt={72.44 - 71.74} />
		</At>
		<At from={75.3} to={78.04}>
			<Detail dur={2.74} />
		</At>
		<At from={78.04} to={82.68}>
			<OnPurpose start={78.04} dur={4.64} rockstarAt={81.54} />
		</At>
		<At from={83.02} to={85.8}>
			<Achievement dur={2.78} />
		</At>
		<At from={85.8} to={87.44}>
			<AbsoluteFill style={{alignItems: 'center', top: 470}}>
				<Chip bg={C.pink} size={52}>
					QUERO SABER DE VOCÊ 👇
				</Chip>
			</AbsoluteFill>
		</At>
		<At from={87.44} to={94.66}>
			<Poll start={87.44} aAt={89.24} bAt={92.38} a="MESMO UNIVERSO 🤠" b="SÓ BRINCADEIRA 😂" />
		</At>
		<At from={94.66} to={96.64}>
			<CommentPrompt dur={1.98} />
		</At>
		<At from={97.5} to={100.6}>
			<AbsoluteFill style={{alignItems: 'center', top: 470}}>
				<Chip bg={C.ink} size={46}>
					🔍 MISTÉRIOS DE GTA 6
				</Chip>
			</AbsoluteFill>
		</At>
		<At from={100.6} to={107.4}>
			<EndCard start={100.6} subAt={101.6} />
		</At>
		<At from={103.52} to={107.4}>
			<AbsoluteFill style={{alignItems: 'center', top: 1120}}>
				<div style={{fontFamily: DISPLAY, fontSize: 66, color: 'white', textAlign: 'center', textShadow: '0 5px 0 #000', padding: '0 80px'}}>CADA DETALHE PODE SER UMA NOVA PISTA</div>
			</AbsoluteFill>
		</At>
	</AbsoluteFill>
);
