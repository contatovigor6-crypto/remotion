import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame} from 'remotion';
import {At, Chip, Stamp, useOut, useSpring} from '../components/Overlays';
import {ProOutro} from '../components/ProOutro';
import {C, DISPLAY, GRAD, SAFE, UI, f} from '../theme';

// Gráficos do Short "GTA 6 vai exigir até 212 GB". Todos são ilustrações (não é a interface do jogo nem do console).
const GREEN = '#3DFF8A';
const useAt = (start: number, at: number, damping = 12, stiffness = 260) => useSpring(at - start, damping, stiffness);
const useT = (start: number) => start + useCurrentFrame() / 30;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Barra de armazenamento genérica (ilustração) */
const Bar: React.FC<{k: number; color?: string; height?: number; segs?: {k: number; color: string}[]}> = ({k, color, height = 46, segs}) => (
	<div style={{position: 'relative', height, borderRadius: height / 2, background: 'rgba(255,255,255,0.14)', border: '3px solid rgba(255,255,255,0.5)', overflow: 'hidden'}}>
		{segs ? (
			<div style={{position: 'absolute', inset: 0, display: 'flex'}}>
				{segs.map((s, i) => (
					<div key={i} style={{width: `${s.k * 100}%`, height: '100%', background: s.color}} />
				))}
			</div>
		) : (
			<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${k * 100}%`, background: color ?? GRAD, boxShadow: `0 0 30px ${C.pink}`}} />
		)}
	</div>
);

/** Gancho: "212 GB" contando + barra enchendo */
const Hook: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const t = frame / 30;
	const k = interpolate(t, [0.05, 1.3], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const s = useSpring(0, 11, 280);
	const out = useOut(dur, 4);
	const shake = t > 1.3 && t < 1.5 ? Math.sin(frame * 3) * 8 : 0;
	return (
		<AbsoluteFill style={{top: 420, opacity: out}}>
			<div style={{textAlign: 'center', transform: `translateX(${shake}px) scale(${interpolate(s, [0, 1], [1.6, 1])})`, opacity: s}}>
				<div style={{fontFamily: DISPLAY, fontSize: 300, lineHeight: 1, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 10px 0 #000)', fontVariantNumeric: 'tabular-nums'}}>
					{Math.round(212 * k)}
					<span style={{fontSize: 150}}> GB</span>
				</div>
			</div>
			<div style={{margin: '20px 110px 0', opacity: s}}>
				<Bar k={k} height={56} />
				<div style={{display: 'flex', justifyContent: 'space-between', fontFamily: UI, fontWeight: 800, fontSize: 30, color: 'white', marginTop: 10, letterSpacing: 3}}>
					<span>💾 PRÉ-DOWNLOAD</span>
					<span style={{color: t > 1.3 ? C.yellow : 'white'}}>{t > 1.3 ? 'ATÉ 212 GB' : 'CARREGANDO…'}</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};

const Tag: React.FC<{top?: number; bg: string; color?: string; size?: number; children: React.ReactNode; dur: number}> = ({top = 470, bg, color, size = 48, children, dur}) => {
	const s = useSpring(0, 11, 280);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{alignItems: 'center', top, opacity: out}}>
			<div style={{opacity: s, transform: `scale(${interpolate(s, [0, 1], [1.6, 1])})`}}>
				<Chip bg={bg} color={color} size={size}>
					{children}
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

/** Cartão "comunicado oficial" (ilustração com a informação do Newswire, sem imitar a página) */
const Official: React.FC<{start: number; dur: number; numAt: number; devAt: number}> = ({start, dur, numAt, devAt}) => {
	const t = useT(start);
	const s = useSpring(0.1, 13, 240);
	const n = useAt(start, numAt, 10, 300);
	const d = useAt(start, devAt, 12, 260);
	const out = useOut(dur);
	const k = interpolate(t, [numAt - 0.2, numAt + 1.0], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 380, left: SAFE.left, right: 140, background: 'rgba(11,6,18,0.9)', borderRadius: 26, padding: '26px 30px', border: '3px solid rgba(255,255,255,0.18)', boxShadow: '0 24px 60px rgba(0,0,0,0.6)', opacity: s, transform: `translateY(${(1 - s) * 120}px)`}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
					<div style={{width: 18, height: 18, borderRadius: 9, background: GREEN, boxShadow: `0 0 16px ${GREEN}`}} />
					<span style={{fontFamily: UI, fontWeight: 800, fontSize: 30, color: GREEN, letterSpacing: 4}}>CONFIRMADO PELA ROCKSTAR</span>
				</div>
				<div style={{fontFamily: DISPLAY, fontSize: 66, color: 'white', marginTop: 14, lineHeight: 1.05}}>PRÉ-DOWNLOAD DE GTA 6</div>
				<div style={{display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 6, opacity: n, transform: `scale(${interpolate(n, [0, 1], [1.4, 1])})`, transformOrigin: 'left center'}}>
					<span style={{fontFamily: UI, fontWeight: 800, fontSize: 40, color: C.yellow}}>ATÉ</span>
					<span style={{fontFamily: DISPLAY, fontSize: 150, lineHeight: 1, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent'}}>212 GB</span>
				</div>
				<div style={{marginTop: 8}}>
					<Bar k={k} height={34} />
				</div>
				<div style={{marginTop: 18, opacity: d, transform: `translateY(${(1 - d) * 20}px)`}}>
					<Chip bg={C.cyan} color={C.ink} size={32}>
						⚠️ DEPENDENDO DO DISPOSITIVO
					</Chip>
				</div>
				<div style={{fontFamily: UI, fontWeight: 700, fontSize: 22, color: 'rgba(255,255,255,0.6)', marginTop: 16, letterSpacing: 2}}>FONTE: ROCKSTAR NEWSWIRE · 03/11/2026</div>
			</div>
		</AbsoluteFill>
	);
};

/** "RUMOR" riscado -> carimbo OFICIAL */
const NotRumor: React.FC<{start: number; dur: number; crossAt: number; stampAt: number}> = ({start, dur, crossAt, stampAt}) => {
	const t = useT(start);
	const s = useSpring(0, 12, 260);
	const x = useAt(start, crossAt, 10, 300);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<AbsoluteFill style={{alignItems: 'center', top: 430, opacity: s}}>
				<div style={{position: 'relative', display: 'inline-block'}}>
					<div style={{fontFamily: DISPLAY, fontSize: 120, color: 'white', textShadow: '0 6px 0 #000', opacity: t >= stampAt ? 0.35 : 1}}>🗣️ RUMOR</div>
					<div style={{position: 'absolute', left: -14, top: '52%', height: 18, width: `${x * 110}%`, background: C.red, borderRadius: 9, transform: 'rotate(-5deg)'}} />
				</div>
			</AbsoluteFill>
			{t >= stampAt ? (
				<At from={stampAt - start} to={dur}>
					<Stamp text="OFICIAL ✓" sub="NÚMERO CONFIRMADO" top={600} color={GREEN} />
				</At>
			) : null}
		</AbsoluteFill>
	);
};

/** Lista do mundo: itens surgem conforme a narração */
const World: React.FC<{start: number; dur: number; titleAt: number; items: {e: string; t: string; at: number}[]}> = ({start, dur, titleAt, items}) => {
	const frame = useCurrentFrame();
	const tt = useAt(start, titleAt, 11, 280);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 370, left: 0, right: 0, textAlign: 'center', opacity: tt, transform: `scale(${interpolate(tt, [0, 1], [1.7, 1])})`}}>
				<span style={{fontFamily: DISPLAY, fontSize: 112, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 7px 0 #000)'}}>MUNDO ENORME</span>
			</div>
			<div style={{position: 'absolute', top: 530, left: SAFE.left, right: SAFE.left, display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center'}}>
				{items.map((it, i) => {
					const p = spring({frame: frame - f(it.at - start), fps: 30, config: {damping: 10, stiffness: 300}});
					if (frame < f(it.at - start)) return null;
					return (
						<div key={i} style={{transform: `scale(${interpolate(p, [0, 1], [1.8, 1])})`, opacity: p}}>
							<Chip bg={i % 2 ? C.purple : C.pink} size={40}>
								{it.e} {it.t}
							</Chip>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

/** Tipos de arquivo enchendo o armazenamento */
const Files: React.FC<{start: number; dur: number; rows: {e: string; t: string; at: number; w: number; c: string}[]; driveAt: number}> = ({start, dur, rows, driveAt}) => {
	const frame = useCurrentFrame();
	const t = useT(start);
	const out = useOut(dur);
	const s = useSpring(0, 13, 240);
	const dv = useAt(start, driveAt, 11, 280);
	const segs = rows.map((r) => ({k: r.w * interpolate(t, [r.at, r.at + 0.6], [0, 1], clamp), color: r.c}));
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 370, left: SAFE.left, right: 140, opacity: s}}>
				<Chip bg={C.ink} size={34}>
					📁 O QUE OCUPA ESPAÇO
				</Chip>
				<div style={{marginTop: 18}}>
					{rows.map((r, i) => {
						const p = spring({frame: frame - f(r.at - start), fps: 30, config: {damping: 12, stiffness: 280}});
						return (
							<div key={i} style={{display: 'flex', alignItems: 'center', gap: 16, margin: '10px 0', opacity: frame >= f(r.at - start) ? p : 0.18, transform: `translateX(${(1 - p) * 120}px)`}}>
								<div style={{width: 70, height: 70, borderRadius: 14, background: r.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40}}>{r.e}</div>
								<span style={{fontFamily: DISPLAY, fontSize: 58, color: 'white', textShadow: '0 4px 0 #000'}}>{r.t}</span>
							</div>
						);
					})}
				</div>
				<div style={{marginTop: 18}}>
					<Bar k={0} segs={segs} height={44} />
				</div>
				<div style={{marginTop: 14, opacity: dv, transform: `scale(${interpolate(dv, [0, 1], [1.4, 1])})`, transformOrigin: 'left center'}}>
					<Chip bg={C.yellow} color={C.ink} size={36}>
						💾 TUDO ISSO NO SEU CONSOLE
					</Chip>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** FATOS × TEORIAS */
const FactsTheories: React.FC<{start: number; dur: number; factsAt: number; theoAt: number}> = ({start, dur, factsAt, theoAt}) => {
	const a = useAt(start, factsAt, 11, 280);
	const b = useAt(start, theoAt, 11, 280);
	const out = useOut(dur);
	const col = (k: number, title: string, color: string, icon: string, from: number) => (
		<div style={{flex: 1, background: 'rgba(11,6,18,0.88)', borderRadius: 24, padding: '26px 18px', textAlign: 'center', border: `5px solid ${color}`, opacity: k, transform: `translateX(${(1 - k) * from}px)`}}>
			<div style={{fontSize: 96}}>{icon}</div>
			<div style={{fontFamily: DISPLAY, fontSize: 80, color}}>{title}</div>
		</div>
	);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 420, left: SAFE.left, right: SAFE.left, display: 'flex', gap: 22, alignItems: 'center'}}>
				{col(a, 'FATOS', GREEN, '✅', -300)}
				<span style={{fontFamily: DISPLAY, fontSize: 80, color: 'white', opacity: b}}>×</span>
				{col(b, 'TEORIAS', C.orange, '❓', 300)}
			</div>
		</AbsoluteFill>
	);
};

/** 212 GB dividido em "?" — a Rockstar não detalhou */
const Unknown: React.FC<{start: number; dur: number; noteAt: number}> = ({start, dur, noteAt}) => {
	const frame = useCurrentFrame();
	const t = useT(start);
	const s = useSpring(0, 13, 240);
	const n = useAt(start, noteAt, 11, 280);
	const out = useOut(dur);
	const k = interpolate(t - start, [0.1, 1.4], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const cols = [C.pink, C.purple, C.cyan, C.orange, C.yellow];
	const ws = [0.26, 0.18, 0.22, 0.14, 0.2];
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 400, left: SAFE.left, right: 140, opacity: s}}>
				<div style={{fontFamily: DISPLAY, fontSize: 84, color: 'white', textShadow: '0 6px 0 #000', lineHeight: 1.05}}>QUANTO É DE CADA COISA?</div>
				<div style={{display: 'flex', height: 120, marginTop: 22, borderRadius: 20, overflow: 'hidden', border: '4px solid rgba(255,255,255,0.6)'}}>
					{ws.map((w, i) => (
						<div key={i} style={{width: `${w * 100 * k}%`, background: cols[i], display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '3px solid rgba(0,0,0,0.35)'}}>
							<span style={{fontFamily: DISPLAY, fontSize: 70, color: C.ink, transform: `translateY(${Math.sin(frame / 5 + i) * 4}px)`}}>?</span>
						</div>
					))}
				</div>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 30, color: 'white', marginTop: 10, letterSpacing: 3}}>212 GB NO TOTAL</div>
				<div style={{marginTop: 20, opacity: n, transform: `translateY(${(1 - n) * 20}px)`}}>
					<Chip bg={C.red} size={38}>
						🔒 A ROCKSTAR NÃO DETALHOU
					</Chip>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** "212 GB = ?" e o que NÃO dá para afirmar */
const CantSay: React.FC<{start: number; dur: number; items: {t: string; at: number}[]}> = ({start, dur, items}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 12, 260);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 380, left: SAFE.left, right: 140, opacity: s}}>
				<div style={{fontFamily: DISPLAY, fontSize: 92, color: 'white', textShadow: '0 6px 0 #000'}}>
					212 GB <span style={{color: C.yellow}}>=</span> <span style={{color: C.orange}}>?</span>
				</div>
				{items.map((it, i) => {
					const p = spring({frame: frame - f(it.at - start), fps: 30, config: {damping: 11, stiffness: 280}});
					return (
						<div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, margin: '14px 0', opacity: frame >= f(it.at - start) ? p : 0, transform: `translateX(${(1 - p) * 200}px)`}}>
							<div style={{position: 'relative'}}>
								<span style={{fontFamily: DISPLAY, fontSize: 70, color: 'white', textShadow: '0 5px 0 #000'}}>{it.t}</span>
							</div>
							<Chip bg="rgba(255,45,61,0.9)" size={26}>
								NÃO CONFIRMADO
							</Chip>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

/** Calendário: 10/11 pré-download -> 19/11 lançamento (9 dias) */
const Calendar: React.FC<{start: number; dur: number; okAt: number; preAt: number; daysAt: number; launchAt: number}> = ({start, dur, okAt, preAt, daysAt, launchAt}) => {
	const t = useT(start);
	const ok = useAt(start, okAt, 11, 280);
	const cal = useAt(start, preAt - 0.6, 13, 240);
	const pre = useAt(start, preAt, 10, 300);
	const lau = useAt(start, launchAt, 10, 300);
	const out = useOut(dur);
	const run = interpolate(t, [daysAt - 0.2, launchAt], [0, 9], clamp);
	const days = Array.from({length: 10}, (_, i) => 10 + i);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 370, left: 0, right: 0, textAlign: 'center', opacity: ok, transform: `scale(${interpolate(ok, [0, 1], [1.6, 1])})`}}>
				<Chip bg={GREEN} color={C.ink} size={46}>
					✓ NÚMERO OFICIAL
				</Chip>
			</div>
			<div style={{position: 'absolute', top: 480, left: 50, right: 50, background: 'rgba(11,6,18,0.9)', borderRadius: 24, padding: '20px 18px 24px', opacity: cal, transform: `translateY(${(1 - cal) * 80}px)`, border: '3px solid rgba(255,255,255,0.15)'}}>
				<div style={{fontFamily: DISPLAY, fontSize: 52, color: 'white', textAlign: 'center', letterSpacing: 4}}>NOVEMBRO 2026</div>
				<div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginTop: 14}}>
					{days.map((d, i) => {
						const isPre = d === 10;
						const isLau = d === 19;
						const passed = i > 0 && i <= run && !isLau;
						const bg = isPre && t >= preAt ? C.cyan : isLau && t >= launchAt ? C.pink : passed ? 'rgba(255,216,74,0.85)' : 'rgba(255,255,255,0.1)';
						const sc = isPre && t >= preAt ? interpolate(pre, [0, 1], [1.4, 1]) : isLau && t >= launchAt ? interpolate(lau, [0, 1], [1.5, 1]) : 1;
						return (
							<div key={d} style={{height: 112, borderRadius: 16, background: bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${sc})`, boxShadow: (isPre && t >= preAt) || (isLau && t >= launchAt) ? `0 0 28px ${isPre ? C.cyan : C.pink}` : 'none'}}>
								<span style={{fontFamily: DISPLAY, fontSize: 56, color: bg.startsWith('rgba(255,255,255') ? 'white' : C.ink}}>{d}</span>
								{isPre && t >= preAt ? <span style={{fontFamily: UI, fontWeight: 800, fontSize: 15, color: C.ink}}>PRÉ-DOWNLOAD</span> : null}
								{isLau && t >= launchAt ? <span style={{fontFamily: UI, fontWeight: 800, fontSize: 15, color: C.ink}}>LANÇAMENTO</span> : null}
							</div>
						);
					})}
				</div>
				<div style={{textAlign: 'center', marginTop: 16, height: 70}}>
					{t >= daysAt - 0.2 ? (
						<span style={{fontFamily: DISPLAY, fontSize: 64, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent'}}>
							{Math.max(1, Math.round(run))} {Math.round(run) === 1 ? 'DIA' : 'DIAS'} ANTES ⏳
						</span>
					) : null}
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Pergunta final: limpeza no console (ilustração) + enquete A/B */
const Cleanup: React.FC<{start: number; dur: number; needAt: number; aAt: number; bAt: number; cleanAt: number}> = ({start, dur, needAt, aAt, bAt, cleanAt}) => {
	const frame = useCurrentFrame();
	const t = useT(start);
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	// espaço livre: 120 GB -> precisa 212 GB -> limpeza libera
	const used = interpolate(t, [cleanAt, cleanAt + 1.2], [0.78, 0.48], clamp);
	const need = interpolate(t, [needAt - 0.3, needAt + 0.6], [0, 0.32], clamp);
	const over = used + need > 1;
	const opt = (l: string, text: string, at: number, color: string) => {
		const p = spring({frame: frame - f(at - start), fps: 30, config: {damping: 11, stiffness: 280}});
		return (
			<div style={{display: 'flex', alignItems: 'center', gap: 18, background: 'rgba(255,255,255,0.96)', borderRadius: 20, padding: '14px 20px', margin: '14px 0', opacity: frame >= f(at - start) ? p : 0, transform: `translateX(${(1 - p) * 200}px)`, boxShadow: '0 16px 40px rgba(0,0,0,0.45)'}}>
				<div style={{width: 74, height: 74, borderRadius: 16, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
					<span style={{fontFamily: DISPLAY, fontSize: 56, color: 'white'}}>{l}</span>
				</div>
				<span style={{fontFamily: DISPLAY, fontSize: 50, color: C.ink, lineHeight: 1.05}}>{text}</span>
			</div>
		);
	};
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 360, left: SAFE.left, right: 140, opacity: s}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 30, color: 'white', letterSpacing: 4}}>🎮 ARMAZENAMENTO DO CONSOLE</div>
				<div style={{position: 'relative', height: 58, borderRadius: 29, background: 'rgba(255,255,255,0.14)', border: `3px solid ${over ? C.red : 'rgba(255,255,255,0.5)'}`, overflow: 'hidden', marginTop: 12}}>
					<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${used * 100}%`, background: '#8a8a99'}} />
					<div style={{position: 'absolute', left: `${used * 100}%`, top: 0, bottom: 0, width: `${need * 100}%`, background: GRAD, opacity: over ? 0.55 + 0.45 * Math.abs(Math.sin(frame / 3)) : 1}} />
				</div>
				<div style={{display: 'flex', justifyContent: 'space-between', fontFamily: UI, fontWeight: 800, fontSize: 26, color: 'white', marginTop: 8, letterSpacing: 2}}>
					<span>OUTROS JOGOS</span>
					<span style={{color: over ? C.red : GREEN}}>{t < needAt - 0.3 ? '' : over ? 'SEM ESPAÇO! 😬' : 'GTA 6 CABE ✓'}</span>
				</div>
				<div style={{marginTop: 10}}>
					{opt('A', '✅ JÁ ESTOU PREPARADO', aAt, '#1FA7C9')}
					{opt('B', '🧹 VOU PRECISAR DE LIMPEZA', bAt, C.red)}
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ------------------------------------------------------------------ timeline

export const ArmazenamentoOverlays: React.FC = () => (
	<AbsoluteFill>
		<At from={0} to={2.5}>
			<Hook dur={2.5} />
		</At>
		<At from={5.2} to={6.4}>
			<Tag bg={C.ink} dur={1.2}>
				🎮 NO SEU CONSOLE
			</Tag>
		</At>
		<At from={9.1} to={10.5}>
			<Stamp text="POR QUÊ?" top={500} color={C.yellow} />
		</At>
		<At from={13.6} to={15.4}>
			<Tag bg={C.pink} dur={1.8}>
				🗺️ O QUE TEM EM LEONIDA?
			</Tag>
		</At>
		<At from={15.4} to={22.9}>
			<Official start={15.4} dur={7.5} numAt={19.0} devAt={21.0} />
		</At>
		<At from={23.0} to={26.7}>
			<NotRumor start={23.0} dur={3.7} crossAt={24.2} stampAt={25.2} />
		</At>
		<At from={27.3} to={29.7}>
			<Tag bg={C.purple} dur={2.4}>
				🔍 UM DETALHE INTERESSANTE
			</Tag>
		</At>
		<At from={29.7} to={42.5}>
			<World
				start={29.7}
				dur={12.8}
				titleAt={32.4}
				items={[
					{e: '🏙️', t: 'CIDADES', at: 33.76},
					{e: '🌾', t: 'ÁREAS RURAIS', at: 34.58},
					{e: '🏠', t: 'INTERIORES', at: 35.68},
					{e: '🚗', t: 'VEÍCULOS', at: 37.04},
					{e: '🧍', t: 'PERSONAGENS', at: 38.0},
					{e: '🐢', t: 'ANIMAIS', at: 38.9},
					{e: '🎵', t: 'MÚSICAS', at: 39.74},
					{e: '➕', t: 'MUITO MAIS', at: 40.44},
				]}
			/>
		</At>
		<At from={42.5} to={50.4}>
			<Files
				start={42.5}
				dur={7.9}
				driveAt={49.2}
				rows={[
					{e: '🖼️', t: 'TEXTURAS', at: 44.06, w: 0.3, c: C.pink},
					{e: '🧊', t: 'MODELOS 3D', at: 45.02, w: 0.2, c: C.purple},
					{e: '🔊', t: 'ÁUDIO', at: 45.86, w: 0.18, c: C.cyan},
					{e: '🏃', t: 'ANIMAÇÕES', at: 46.46, w: 0.17, c: C.orange},
					{e: '📦', t: 'OUTROS DADOS', at: 47.8, w: 0.15, c: C.yellow},
				]}
			/>
		</At>
		<At from={51.0} to={54.1}>
			<FactsTheories start={51.0} dur={3.1} factsAt={52.6} theoAt={53.15} />
		</At>
		<At from={54.1} to={59.8}>
			<Unknown start={54.1} dur={5.7} noteAt={55.7} />
		</At>
		<At from={59.8} to={66.9}>
			<CantSay
				start={59.8}
				dur={7.1}
				items={[
					{t: '+ MISSÕES?', at: 63.9},
					{t: '+ CIDADES?', at: 65.0},
					{t: '+ CONTEÚDO?', at: 66.0},
				]}
			/>
		</At>
		<At from={66.9} to={76.9}>
			<Calendar start={66.9} dur={10.0} okAt={69.0} preAt={71.5} daysAt={72.8} launchAt={75.4} />
		</At>
		<At from={76.9} to={86.0}>
			<Cleanup start={76.9} dur={9.1} needAt={80.7} aAt={78.8} bAt={83.2} cleanAt={84.3} />
		</At>
		<At from={86.0} to={93.6}>
			<ProOutro subAt={1.6} tagline="INVESTIGANDO CADA DETALHE DE GTA 6" />
		</At>
	</AbsoluteFill>
);
