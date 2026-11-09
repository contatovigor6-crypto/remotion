import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame} from 'remotion';
import {At, Chip, Stamp, useOut, useSpring} from '../components/Overlays';
import {ProOutro} from '../components/ProOutro';
import {C, DISPLAY, GRAD, SAFE, UI, f} from '../theme';

// Gráficos do Short "A armadilha da Rockstar pra quem vazar GTA 6". Ilustrações (marca d'água e nomes são fictícios).
const GREEN = '#3DFF8A';
const useAt = (start: number, at: number, damping = 12, stiffness = 260) => useSpring(at - start, damping, stiffness);

const Hook: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0.05, 11, 280);
	const trap = useSpring(1.2, 8, 340);
	const out = useOut(dur, 4);
	const jaw = interpolate(trap, [0, 1], [-30, 0]);
	return (
		<AbsoluteFill style={{alignItems: 'center', top: 380, opacity: out}}>
			<div style={{fontFamily: DISPLAY, fontSize: 110, color: 'white', textShadow: '0 7px 0 #000', opacity: s}}>A ROCKSTAR MONTOU UMA</div>
			<div style={{display: 'inline-block', marginTop: 10, background: C.red, padding: '8px 40px 0', borderRadius: 14, transform: `rotate(-2deg) scale(${interpolate(trap, [0, 1], [2.2, 1])})`, opacity: trap, boxShadow: '0 12px 0 #000'}}>
				<span style={{fontFamily: DISPLAY, fontSize: 160, color: 'white'}}>ARMADILHA</span>
			</div>
			{/* "dentes" da armadilha (ilustração) */}
			<div style={{display: 'flex', gap: 6, marginTop: 26, opacity: trap, transform: `translateY(${jaw}px)`}}>
				{Array.from({length: 9}).map((_, i) => (
					<div key={i} style={{width: 0, height: 0, borderLeft: '26px solid transparent', borderRight: '26px solid transparent', borderTop: `60px solid ${i % 2 ? '#c9c9d4' : '#e8e8f0'}`, filter: 'drop-shadow(0 4px 0 #000)'}} />
				))}
			</div>
			<div style={{marginTop: 18, opacity: interpolate(frame, [f(2.4), f(2.7)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
				<Chip bg={C.ink} size={40}>
					🕵️ PRA QUEM VAZAR GTA 6
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

const Copies: React.FC<{start: number; dur: number; rows: {t: string; at: number; c?: string; tc?: string}[]}> = ({start, dur, rows}) => {
	const frame = useCurrentFrame();
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 360, left: SAFE.left}}>
				{rows.map((r, i) => {
					const k = spring({frame: frame - f(r.at - start), fps: 30, config: {damping: 11, stiffness: 300}});
					if (frame < f(r.at - start)) return null;
					return (
						<div key={i} style={{margin: '12px 0', opacity: k, transform: `translateX(${(1 - k) * 160}px)`}}>
							<Chip bg={r.c ?? C.ink} color={r.tc} size={44}>
								{r.t}
							</Chip>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

/** Marca d'água com nome passeando pela tela (ilustração) */
const Watermark: React.FC<{start: number; dur: number; nameAt: number}> = ({start, dur, nameAt}) => {
	const frame = useCurrentFrame();
	const t = start + frame / 30;
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	const on = t >= nameAt - 0.3;
	const k = (frame - f(nameAt - 0.3 - start)) / 30;
	const pos = [
		[90, 640],
		[330, 860],
		[120, 980],
		[380, 600],
	];
	const idx = Math.max(0, Math.floor(k / 0.9)) % pos.length;
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 370, left: SAFE.left, right: 140, opacity: s}}>
				<Chip bg={C.purple} size={38}>
					🎮 CÓPIA DE ANÁLISE
				</Chip>
				<div style={{fontFamily: DISPLAY, fontSize: 82, color: 'white', textShadow: '0 6px 0 #000', marginTop: 10, lineHeight: 1.05}}>O SEU NOME NA TELA</div>
			</div>
			{on ? (
				<div style={{position: 'absolute', left: pos[idx][0], top: pos[idx][1], fontFamily: UI, fontWeight: 800, fontSize: 54, color: 'rgba(255,255,255,0.85)', letterSpacing: 3, textShadow: '0 3px 10px rgba(0,0,0,0.8)', whiteSpace: 'nowrap', transform: 'rotate(-8deg)'}}>
					ANALISTA_0427 · RASTREADO
				</div>
			) : null}
			{on ? (
				<div style={{position: 'absolute', inset: 0, opacity: 0.16, fontFamily: UI, fontWeight: 800, fontSize: 30, color: 'white', lineHeight: '110px', transform: 'rotate(-14deg) translateY(200px)', whiteSpace: 'nowrap', overflow: 'hidden'}}>
					{Array.from({length: 14}).map((_, i) => (
						<div key={i} style={{marginLeft: (i % 2) * 120 - 200}}>{'ANALISTA_0427   '.repeat(8)}</div>
					))}
				</div>
			) : null}
			<div style={{position: 'absolute', bottom: 120, left: 0, right: 0, textAlign: 'center', fontFamily: UI, fontWeight: 700, fontSize: 22, color: 'rgba(255,255,255,0.6)', letterSpacing: 2}}>ILUSTRAÇÃO · AFIRMAÇÃO DE UM CRIADOR, NÃO CONFIRMADA PELA ROCKSTAR</div>
		</AbsoluteFill>
	);
};

const Caught: React.FC<{start: number; dur: number; at: number}> = ({start, dur, at}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 11, 280);
	const c = useAt(start, at, 9, 320);
	const out = useOut(dur);
	const r = 150 + 10 * Math.sin(frame / 3);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 380, left: 0, right: 0, textAlign: 'center', opacity: s}}>
				<span style={{fontFamily: DISPLAY, fontSize: 110, color: 'white', textShadow: '0 7px 0 #000'}}>VAZOU UM VÍDEO?</span>
			</div>
			<div style={{position: 'absolute', left: 540 - r, top: 820 - r, width: r * 2, height: r * 2, borderRadius: r, border: `10px solid ${C.red}`, boxShadow: `0 0 40px ${C.red}`, opacity: c, transform: `scale(${interpolate(c, [0, 1], [2.2, 1])})`}} />
			<div style={{position: 'absolute', top: 1000, left: 0, right: 0, textAlign: 'center', opacity: c}}>
				<Chip bg={C.red} size={44}>
					🎯 ELES SABEM QUEM FOI
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

/** Armadilha das informações falsas: cada funcionário recebe uma versão diferente */
const CanaryTrap: React.FC<{start: number; dur: number; showAt: number; leakAt: number; nameAt: number}> = ({start, dur, showAt, leakAt, nameAt}) => {
	const frame = useCurrentFrame();
	const t = start + frame / 30;
	const out = useOut(dur);
	const emps = [
		{n: 'FUNCIONÁRIO A', d: 'CARRO AZUL', c: '#1E88FF'},
		{n: 'FUNCIONÁRIO B', d: 'CARRO VERMELHO', c: C.red},
		{n: 'FUNCIONÁRIO C', d: 'CARRO VERDE', c: GREEN},
	];
	const leak = useAt(start, leakAt, 10, 300);
	const nm = useAt(start, nameAt, 9, 320);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 360, left: SAFE.left}}>
				<Chip bg={C.yellow} color={C.ink} size={36}>
					🧪 INFORMAÇÃO FALSA, UMA PRA CADA (EXEMPLO)
				</Chip>
			</div>
			<div style={{position: 'absolute', top: 450, left: 60, right: 60, display: 'flex', gap: 16}}>
				{emps.map((e, i) => {
					const k = spring({frame: frame - f(showAt + i * 0.35 - start), fps: 30, config: {damping: 11, stiffness: 300}});
					const guilty = i === 1 && t >= nameAt;
					return (
						<div key={i} style={{flex: 1, background: 'rgba(11,6,18,0.9)', borderRadius: 20, padding: '18px 10px', textAlign: 'center', border: `5px solid ${guilty ? C.red : 'rgba(255,255,255,0.2)'}`, opacity: frame >= f(showAt + i * 0.35 - start) ? k : 0, transform: `translateY(${(1 - k) * 80}px) scale(${guilty ? interpolate(nm, [0, 1], [1.25, 1.08]) : 1})`, boxShadow: guilty ? `0 0 40px ${C.red}` : 'none'}}>
							<div style={{fontSize: 70}}>{guilty ? '🚨' : '👤'}</div>
							<div style={{fontFamily: UI, fontWeight: 800, fontSize: 22, color: 'white', letterSpacing: 1}}>{e.n}</div>
							<div style={{marginTop: 10, display: 'inline-block', background: e.c, color: e.c === GREEN ? C.ink : 'white', fontFamily: UI, fontWeight: 800, fontSize: 20, padding: '6px 10px', borderRadius: 8}}>{e.d}</div>
						</div>
					);
				})}
			</div>
			{t >= leakAt ? (
				<div style={{position: 'absolute', top: 760, left: 90, right: 90, background: 'rgba(255,255,255,0.96)', borderRadius: 18, padding: '16px 20px', opacity: leak, transform: `translateY(${(1 - leak) * 60}px)`}}>
					<div style={{fontFamily: UI, fontWeight: 800, fontSize: 24, color: '#666'}}>🌐 POST NA INTERNET</div>
					<div style={{fontFamily: UI, fontWeight: 800, fontSize: 36, color: C.ink, marginTop: 4}}>"VAZOU: GTA 6 TEM UM <span style={{color: C.red}}>CARRO VERMELHO</span>"</div>
				</div>
			) : null}
			{t >= nameAt ? (
				<div style={{position: 'absolute', top: 960, left: 0, right: 0, textAlign: 'center', opacity: nm}}>
					<Chip bg={C.red} size={44}>
						🪪 NOME E SOBRENOME
					</Chip>
				</div>
			) : null}
		</AbsoluteFill>
	);
};

const August: React.FC<{start: number; dur: number; quoteAt: number}> = ({start, dur, quoteAt}) => {
	const s = useSpring(0, 13, 240);
	const q = useAt(start, quoteAt, 12, 260);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 370, left: SAFE.left}}>
				<Chip bg={C.ink} size={38}>
					📅 AGOSTO DE 2026 · VÍDEOS DE GAMEPLAY VAZARAM
				</Chip>
			</div>
			<div style={{position: 'absolute', top: 470, left: SAFE.left, right: 140, background: 'rgba(11,6,18,0.92)', borderRadius: 22, padding: '22px 26px', borderLeft: `12px solid ${C.cyan}`, opacity: q, transform: `translateX(${(1 - q) * 300}px)`}}>
				<div style={{fontFamily: DISPLAY, fontSize: 70, color: 'white', lineHeight: 1.08}}>"DE PARTIR O CORAÇÃO DA NOSSA EQUIPE"</div>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 26, color: C.cyan, marginTop: 12, letterSpacing: 2}}>— ROCKSTAR GAMES (DECLARAÇÃO OFICIAL)</div>
			</div>
			<div style={{position: 'absolute', top: 800, left: SAFE.left, opacity: s}}>
				<Chip bg={C.red} size={38}>
					🔒 AGORA: NADA PASSA
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
				<div style={{fontFamily: DISPLAY, fontSize: 200, lineHeight: 0.95, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 10px 0 #000)'}}>10 DIAS</div>
			</div>
			<div style={{position: 'absolute', top: 640, left: SAFE.left, right: 140, opacity: p}}>
				{opt('😈', 'SIM, ALGUÉM VAI VAZAR', C.red, 0)}
				{opt('🔒', 'NÃO, NINGUÉM ARRISCA', GREEN, 1)}
			</div>
		</AbsoluteFill>
	);
};

export const ArmadilhaOverlays: React.FC = () => (
	<AbsoluteFill>
		<At from={0} to={4.2}>
			<Hook dur={4.2} />
		</At>
		<At from={4.3} to={6.1}>
			<AbsoluteFill style={{alignItems: 'center', top: 470}}>
				<Chip bg={C.purple} size={48}>
					🎮 TEM GENTE JÁ JOGANDO
				</Chip>
			</AbsoluteFill>
		</At>
		<At from={6.1} to={13.7}>
			<Copies
				start={6.1}
				dur={7.6}
				rows={[
					{t: '🗣️ SEGUNDO INSIDERS', at: 6.4},
					{t: '📦 CÓPIAS DA IMPRENSA ENVIADAS', at: 7.7, c: C.purple},
					{t: '📅 ANÁLISES SÓ EM 18/11', at: 10.0, c: C.pink},
					{t: '🎮 LANÇAMENTO: 19/11', at: 12.4, c: C.yellow, tc: C.ink},
				]}
			/>
		</At>
		<At from={13.8} to={15.3}>
			<Stamp text="SÓ QUE…" top={520} color={C.yellow} />
		</At>
		<At from={15.3} to={21.8}>
			<Watermark start={15.3} dur={6.5} nameAt={18.2} />
		</At>
		<At from={21.8} to={25.7}>
			<Caught start={21.8} dur={3.9} at={23.6} />
		</At>
		<At from={25.75} to={26.8}>
			<Stamp text="FICA PIOR" top={520} color={C.red} />
		</At>
		<At from={26.8} to={37.5}>
			<CanaryTrap start={26.8} dur={10.7} showAt={29.6} leakAt={32.6} nameAt={36.0} />
		</At>
		<At from={37.5} to={41.8}>
			<August start={37.5} dur={4.3} quoteAt={38.3} />
		</At>
		<At from={41.8} to={47.4}>
			<Countdown start={41.8} pollAt={43.9} />
		</At>
		<At from={47.4} to={55.0}>
			<ProOutro subAt={1.6} tagline="INVESTIGANDO CADA DETALHE DE GTA 6" />
		</At>
	</AbsoluteFill>
);
