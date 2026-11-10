import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame} from 'remotion';
import {At, Chip, Stamp, useOut, useSpring} from '../components/Overlays';
import {ProOutro} from '../components/ProOutro';
import {C, DISPLAY, SAFE, UI, f} from '../theme';

// Gráficos do Short "GTA 6 Gold: o jogo finalmente ficou pronto?". Ilustrações (disco "gold" e gráfico são simbólicos, sem números inventados).
const GOLD = 'linear-gradient(180deg, #FFF3B0 0%, #FFD24A 40%, #E0A100 70%, #FFE680 100%)';
const GREEN = '#3DFF8A';
const useAt = (start: number, at: number, damping = 12, stiffness = 260) => useSpring(at - start, damping, stiffness);

/** Disco dourado girando (símbolo de "gold master") */
const GoldDisc: React.FC<{size: number}> = ({size}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{width: size, height: size, borderRadius: size / 2, background: `conic-gradient(from ${frame * 4}deg, #FFF3B0, #E0A100, #FFE680, #B87A00, #FFF3B0)`, boxShadow: '0 0 60px rgba(255,200,0,0.7), 0 16px 0 #000', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
			<div style={{width: size * 0.3, height: size * 0.3, borderRadius: size, background: '#111', border: `${size * 0.04}px solid #FFE680`}} />
		</div>
	);
};

const Hook: React.FC<{dur: number}> = ({dur}) => {
	const s = useSpring(0.05, 10, 300);
	const out = useOut(dur, 4);
	return (
		<AbsoluteFill style={{alignItems: 'center', top: 360, opacity: out}}>
			<div style={{opacity: s, transform: `scale(${interpolate(s, [0, 1], [2.2, 1])}) rotate(${interpolate(s, [0, 1], [-90, 0])}deg)`}}>
				<GoldDisc size={300} />
			</div>
			<div style={{fontFamily: DISPLAY, fontSize: 150, lineHeight: 1, marginTop: 20, backgroundImage: GOLD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 8px 0 #000)', opacity: s}}>GTA 6 GOLD</div>
			<div style={{fontFamily: DISPLAY, fontSize: 90, color: 'white', textShadow: '0 6px 0 #000', opacity: s}}>FICOU PRONTO?</div>
		</AbsoluteFill>
	);
};

const Quote: React.FC<{start: number; dur: number; quoteAt: number}> = ({start, dur, quoteAt}) => {
	const s = useSpring(0, 13, 240);
	const q = useAt(start, quoteAt, 11, 280);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 370, left: SAFE.left}}>
				<Chip bg={C.ink} size={36}>
					📞 REUNIÃO COM INVESTIDORES · TAKE-TWO
				</Chip>
			</div>
			<div style={{position: 'absolute', top: 470, left: SAFE.left, right: 140, background: 'rgba(11,6,18,0.92)', borderRadius: 22, padding: '22px 26px', borderLeft: '12px solid #FFD24A', opacity: s, transform: `translateX(${(1 - s) * 300}px)`}}>
				<div style={{fontFamily: DISPLAY, fontSize: 74, color: 'white', lineHeight: 1.08, opacity: q}}>"A ROCKSTAR COMPLETOU O DESENVOLVIMENTO DE GTA VI"</div>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 26, color: '#FFD24A', marginTop: 12, letterSpacing: 2}}>— STRAUSS ZELNICK, CEO DA TAKE-TWO · 09/11/2026</div>
			</div>
		</AbsoluteFill>
	);
};

const GoldMeaning: React.FC<{start: number; dur: number}> = ({start, dur}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0.1, 11, 280);
	const out = useOut(dur);
	const k = interpolate(frame, [10, 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{alignItems: 'center', top: 380, opacity: out}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 26, opacity: s}}>
				<GoldDisc size={200} />
				<div>
					<div style={{fontFamily: DISPLAY, fontSize: 110, lineHeight: 1, backgroundImage: GOLD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 6px 0 #000)'}}>"GOLD"</div>
					<div style={{fontFamily: UI, fontWeight: 800, fontSize: 30, color: 'white', letterSpacing: 3}}>= VERSÃO FINAL FECHADA</div>
				</div>
			</div>
			<div style={{width: 820, marginTop: 34, opacity: s}}>
				<div style={{display: 'flex', justifyContent: 'space-between', fontFamily: UI, fontWeight: 800, fontSize: 28, color: 'white', marginBottom: 8}}>
					<span>DESENVOLVIMENTO</span>
					<span style={{color: GREEN}}>{Math.round(100 * k)}% ✓</span>
				</div>
				<div style={{height: 44, borderRadius: 22, background: 'rgba(255,255,255,0.15)', overflow: 'hidden', border: '3px solid rgba(255,255,255,0.4)'}}>
					<div style={{width: `${k * 100}%`, height: '100%', background: GOLD}} />
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Pré-venda: seta subindo, SEM números (Take-Two não divulgou) */
const PreOrders: React.FC<{start: number; dur: number; aAt: number; bAt: number}> = ({start, dur, aAt, bAt}) => {
	const frame = useCurrentFrame();
	const t = start + frame / 30;
	const a = useAt(start, aAt, 11, 280);
	const b = useAt(start, bAt, 10, 300);
	const out = useOut(dur);
	const k = interpolate(t, [start + 0.3, bAt + 0.8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const pts = Array.from({length: 20}).map((_, i) => {
		const x = i / 19;
		const y = Math.pow(x, 2.2);
		return [60 + x * 760, 420 - y * 360] as const;
	});
	const vis = Math.max(2, Math.floor(k * pts.length));
	const d = pts.slice(0, vis).map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 360, left: SAFE.left}}>
				<Chip bg={C.purple} size={38}>
					🛒 PRÉ-VENDA DE GTA 6
				</Chip>
			</div>
			<svg width={900} height={460} style={{position: 'absolute', left: 90, top: 440}}>
				<line x1={60} y1={420} x2={840} y2={420} stroke="rgba(255,255,255,0.4)" strokeWidth={4} />
				<line x1={60} y1={40} x2={60} y2={420} stroke="rgba(255,255,255,0.4)" strokeWidth={4} />
				<line x1={60} y1={300} x2={840} y2={300} stroke="rgba(255,255,255,0.5)" strokeWidth={3} strokeDasharray="14 10" />
				<text x={70} y={290} fill="rgba(255,255,255,0.8)" fontFamily="Inter, sans-serif" fontWeight={800} fontSize={24}>EXPECTATIVA INICIAL</text>
				<path d={d} stroke="#FFD24A" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
			<div style={{position: 'absolute', top: 920, left: SAFE.left, right: SAFE.left, display: 'flex', flexDirection: 'column', gap: 12}}>
				<div style={{opacity: a, transform: `translateX(${(1 - a) * 200}px)`}}>
					<Chip bg="#FFD24A" color={C.ink} size={38}>
						📈 MUITO ACIMA DAS EXPECTATIVAS
					</Chip>
				</div>
				<div style={{opacity: b, transform: `translateX(${(1 - b) * 200}px)`}}>
					<Chip bg={C.red} size={38}>
						🔥 "NÍVEIS SEM PRECEDENTES"
					</Chip>
				</div>
			</div>
		</AbsoluteFill>
	);
};

const NoNumbers: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 10, 300);
	const out = useOut(dur);
	const digits = Array.from({length: 6}).map(() => '?');
	return (
		<AbsoluteFill style={{alignItems: 'center', top: 420, opacity: out}}>
			<div style={{fontFamily: UI, fontWeight: 800, fontSize: 32, color: C.yellow, letterSpacing: 5, opacity: s}}>QUANTAS PRÉ-VENDAS?</div>
			<div style={{display: 'flex', gap: 10, marginTop: 14, opacity: s, transform: `scale(${interpolate(s, [0, 1], [1.4, 1])})`}}>
				{digits.map((dg, i) => (
					<div key={i} style={{width: 110, height: 150, borderRadius: 16, background: 'rgba(11,6,18,0.92)', border: '4px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 110, color: 'rgba(255,255,255,0.55)', transform: `translateY(${Math.sin(frame / 4) * 4}px)`}}>
						{dg}
					</div>
				))}
			</div>
			<div style={{marginTop: 22, opacity: s}}>
				<Chip bg={C.red} size={48}>
					❓ NENHUM NÚMERO
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

const Caution: React.FC<{start: number; dur: number}> = ({start, dur}) => {
	const s = useSpring(0.1, 12, 260);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 400, left: SAFE.left, right: 140, background: 'rgba(11,6,18,0.92)', borderRadius: 22, padding: '22px 26px', borderLeft: `12px solid ${C.cyan}`, opacity: s, transform: `translateX(${(1 - s) * 300}px)`}}>
				<div style={{fontFamily: DISPLAY, fontSize: 76, color: 'white', lineHeight: 1.08}}>"AINDA NÃO ESTAMOS PRONTOS PARA DECLARAR VITÓRIA"</div>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 26, color: C.cyan, marginTop: 12, letterSpacing: 2}}>— STRAUSS ZELNICK (TRADUÇÃO)</div>
			</div>
			<div style={{position: 'absolute', top: 780, left: SAFE.left, opacity: s}}>
				<Chip bg={C.ink} size={38}>
					🧊 CAUTELA TOTAL
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

const Delays: React.FC<{start: number; dur: number; doneAt: number}> = ({start, dur, doneAt}) => {
	const frame = useCurrentFrame();
	const d = useAt(start, doneAt, 9, 320);
	const out = useOut(dur);
	const items = [
		{t: 'OUTONO 2025', s: 'ADIADO', c: C.red},
		{t: 'MAIO 2026', s: 'ADIADO', c: C.red},
		{t: '19 NOV 2026', s: 'MANTIDO ✓', c: GREEN},
	];
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 370, left: SAFE.left}}>
				<Chip bg={C.purple} size={36}>
					⏳ DEPOIS DE 2 ADIAMENTOS
				</Chip>
			</div>
			<div style={{position: 'absolute', top: 470, left: 70, right: 70}}>
				{items.map((it, i) => {
					const k = spring({frame: frame - f(0.4 + i * 0.7), fps: 30, config: {damping: 11, stiffness: 280}});
					const last = i === 2;
					return (
						<div key={i} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(11,6,18,0.9)', borderRadius: 18, padding: '18px 24px', margin: '14px 0', border: `4px solid ${it.c}`, opacity: k, transform: `translateX(${(1 - k) * 200}px) scale(${last ? interpolate(d, [0, 1], [1, 1.06]) : 1})`}}>
							<span style={{fontFamily: DISPLAY, fontSize: 64, color: 'white', textDecoration: last ? 'none' : 'line-through', textDecorationColor: C.red}}>{it.t}</span>
							<span style={{fontFamily: UI, fontWeight: 800, fontSize: 30, color: it.c}}>{it.s}</span>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

const Patch: React.FC<{dur: number}> = ({dur}) => {
	const s = useSpring(0.1, 11, 280);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{alignItems: 'center', top: 420, opacity: out}}>
			<div style={{fontSize: 140, opacity: s, transform: `scale(${interpolate(s, [0, 1], [1.8, 1])})`}}>🛠️</div>
			<div style={{fontFamily: DISPLAY, fontSize: 96, color: 'white', textShadow: '0 6px 0 #000', opacity: s}}>ATUALIZAÇÃO NO DIA 1?</div>
			<div style={{marginTop: 14, opacity: s}}>
				<Chip bg={C.yellow} color={C.ink} size={36}>
					GOLD ≠ TRABALHO ENCERRADO
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

const Countdown: React.FC<{start: number; pollAt: number}> = ({start, pollAt}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 11, 280);
	const p = useAt(start, pollAt, 11, 280);
	const opt = (l: string, t: string, color: string, i: number) => {
		const k = spring({frame: frame - f(pollAt - start + i * 0.3), fps: 30, config: {damping: 11, stiffness: 300}});
		return (
			<div style={{display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.96)', borderRadius: 18, padding: '12px 18px', margin: '12px 0', opacity: k, transform: `translateX(${(1 - k) * 200}px)`}}>
				<div style={{width: 64, height: 64, borderRadius: 14, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38}}>{l}</div>
				<span style={{fontFamily: DISPLAY, fontSize: 48, color: C.ink}}>{t}</span>
			</div>
		);
	};
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', top: 350, left: 0, right: 0, textAlign: 'center', opacity: s}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 32, letterSpacing: 6, color: C.yellow}}>FALTAM</div>
				<div style={{fontFamily: DISPLAY, fontSize: 200, lineHeight: 0.95, backgroundImage: GOLD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 10px 0 #000)'}}>9 DIAS</div>
			</div>
			<div style={{position: 'absolute', top: 640, left: SAFE.left, right: 140, opacity: p}}>
				{opt('🏆', 'VAI QUEBRAR RECORDES', '#E0A100', 0)}
				{opt('🤔', 'NÃO VAI SER TUDO ISSO', C.cyan, 1)}
			</div>
		</AbsoluteFill>
	);
};

export const GoldOverlays: React.FC = () => (
	<AbsoluteFill>
		<At from={0} to={2.5}>
			<Hook dur={2.5} />
		</At>
		<At from={2.6} to={6.4}>
			<AbsoluteFill style={{alignItems: 'center', top: 470}}>
				<Chip bg={C.ink} size={46}>
					📅 RESPOSTA VEIO ONTEM · 09/11
				</Chip>
			</AbsoluteFill>
		</At>
		<At from={6.4} to={13.4}>
			<Quote start={6.4} dur={7.0} quoteAt={10.4} />
		</At>
		<At from={13.4} to={18.9}>
			<GoldMeaning start={13.4} dur={5.5} />
		</At>
		<At from={18.9} to={27.6}>
			<PreOrders start={18.9} dur={8.7} aAt={22.4} bAt={26.4} />
		</At>
		<At from={27.6} to={30.6}>
			<NoNumbers dur={3.0} />
		</At>
		<At from={30.6} to={35.9}>
			<Caution start={30.6} dur={5.3} />
		</At>
		<At from={35.9} to={42.8}>
			<Delays start={35.9} dur={6.9} doneAt={41.5} />
		</At>
		<At from={42.8} to={48.8}>
			<Patch dur={6.0} />
		</At>
		<At from={48.8} to={54.3}>
			<Countdown start={48.8} pollAt={50.8} />
		</At>
		<At from={54.3} to={62.5}>
			<ProOutro subAt={1.6} tagline="INVESTIGANDO CADA DETALHE DE GTA 6" />
		</At>
	</AbsoluteFill>
);
