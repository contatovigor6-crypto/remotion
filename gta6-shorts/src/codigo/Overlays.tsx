import React from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame} from 'remotion';
import {At, Chip, Stamp, useOut, useSpring} from '../components/Overlays';
import {ProOutro} from '../components/ProOutro';
import {C, DISPLAY, GRAD, SAFE, UI, f} from '../theme';

// Gráficos do Short "O código de GTA 6 entregou 2 segredos". Ilustrações (não é a interface do console nem do jogo).
const GREEN = '#3DFF8A';
const MONO = '"JetBrains Mono", "Courier New", monospace';
const useAt = (start: number, at: number, damping = 12, stiffness = 260) => useSpring(at - start, damping, stiffness);

/** Chuva de código ao fundo (ilustração) */
const CodeRain: React.FC<{opacity?: number}> = ({opacity = 0.35}) => {
	const frame = useCurrentFrame();
	const cols = 18;
	return (
		<AbsoluteFill style={{opacity, overflow: 'hidden', background: 'rgba(3,8,6,0.55)'}}>
			{Array.from({length: cols}).map((_, i) => {
				const sp = 6 + random(`cs${i}`) * 10;
				const y = ((frame * sp + random(`cy${i}`) * 2000) % 2400) - 600;
				const chars = Array.from({length: 22}).map((__, k) => '01{}<>/=;ab#$'.charAt(Math.floor(random(`c${i}-${k}-${Math.floor(frame / 6)}`) * 13))).join('\n');
				return <div key={i} style={{position: 'absolute', left: i * 60 + 6, top: y, fontFamily: MONO, fontSize: 30, lineHeight: '34px', color: GREEN, whiteSpace: 'pre', textShadow: `0 0 8px ${GREEN}`}}>{chars}</div>;
			})}
		</AbsoluteFill>
	);
};

const Hook: React.FC<{dur: number; silentAt: number}> = ({dur, silentAt}) => {
	const s = useSpring(0.05, 11, 280);
	const two = useSpring(1.6, 9, 320);
	const sil = useSpring(silentAt, 11, 280);
	const out = useOut(dur, 4);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<CodeRain opacity={0.45} />
			<div style={{position: 'absolute', top: 380, left: 0, right: 0, textAlign: 'center'}}>
				<div style={{fontFamily: MONO, fontWeight: 700, fontSize: 40, color: GREEN, letterSpacing: 4, opacity: s}}>&gt; gta6.exe --scan</div>
				<div style={{fontFamily: DISPLAY, fontSize: 130, color: 'white', textShadow: '0 8px 0 #000', marginTop: 10, opacity: s, transform: `scale(${interpolate(s, [0, 1], [1.5, 1])})`}}>O CÓDIGO ENTREGOU</div>
				<div style={{display: 'inline-block', marginTop: 12, background: C.red, padding: '8px 40px 0', borderRadius: 14, transform: `rotate(-2deg) scale(${interpolate(two, [0, 1], [2, 1])})`, opacity: two, boxShadow: '0 12px 0 #000'}}>
					<span style={{fontFamily: DISPLAY, fontSize: 150, color: 'white'}}>2 SEGREDOS</span>
				</div>
				<div style={{marginTop: 26, opacity: sil, transform: `translateY(${(1 - sil) * 30}px)`}}>
					<Chip bg={C.ink} size={40}>
						🤐 ROCKSTAR EM SILÊNCIO
					</Chip>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Terminal digitando as linhas encontradas */
const Terminal: React.FC<{start: number; dur: number; lines: {t: string; at: number; hi?: boolean}[]; title: string; source?: string}> = ({start, dur, lines, title, source}) => {
	const frame = useCurrentFrame();
	const t = start + frame / 30;
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<CodeRain opacity={0.2} />
			<div style={{position: 'absolute', top: 360, left: 60, right: 60, borderRadius: 22, overflow: 'hidden', background: 'rgba(4,10,8,0.94)', border: `3px solid ${GREEN}55`, boxShadow: `0 0 50px ${GREEN}33, 0 30px 70px rgba(0,0,0,0.7)`, opacity: s, transform: `translateY(${(1 - s) * 120}px)`}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', background: 'rgba(255,255,255,0.06)'}}>
					{[C.red, C.yellow, GREEN].map((c) => (
						<div key={c} style={{width: 18, height: 18, borderRadius: 9, background: c}} />
					))}
					<span style={{fontFamily: MONO, fontSize: 26, color: 'rgba(255,255,255,0.75)', marginLeft: 12}}>{title}</span>
				</div>
				<div style={{padding: '18px 24px 26px'}}>
					{lines.map((l, i) => {
						const n = Math.max(0, Math.min(l.t.length, Math.floor((t - l.at) * 34)));
						if (t < l.at) return null;
						const typing = n < l.t.length;
						return (
							<div key={i} style={{fontFamily: MONO, fontWeight: 700, fontSize: l.hi ? 40 : 30, lineHeight: 1.45, color: l.hi ? C.yellow : GREEN, background: l.hi && !typing ? 'rgba(255,216,74,0.12)' : 'transparent', borderLeft: l.hi && !typing ? `6px solid ${C.yellow}` : '6px solid transparent', paddingLeft: 12, wordBreak: 'break-all'}}>
								{l.t.slice(0, n)}
								{typing && Math.floor(frame / 6) % 2 === 0 ? '█' : ''}
							</div>
						);
					})}
				</div>
			</div>
			{source ? (
				<div style={{position: 'absolute', top: 960, left: 60}}>
					<Chip bg="rgba(11,6,18,0.85)" size={26}>
						{source}
					</Chip>
				</div>
			) : null}
		</AbsoluteFill>
	);
};

/** Tradução: código = significado */
const Translate: React.FC<{start: number; dur: number; rows: {code: string; pt: string; at: number}[]}> = ({start, dur, rows}) => {
	const frame = useCurrentFrame();
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 380, left: SAFE.left, right: SAFE.left}}>
				<Chip bg={C.purple} size={36}>
					🧠 TRADUZINDO
				</Chip>
				{rows.map((r, i) => {
					const p = spring({frame: frame - f(r.at - start), fps: 30, config: {damping: 11, stiffness: 280}});
					if (frame < f(r.at - start)) return null;
					return (
						<div key={i} style={{marginTop: 22, background: 'rgba(11,6,18,0.9)', borderRadius: 20, padding: '16px 22px', opacity: p, transform: `translateX(${(1 - p) * 200}px)`, borderLeft: `10px solid ${i ? C.pink : C.cyan}`}}>
							<div style={{fontFamily: MONO, fontWeight: 700, fontSize: 34, color: GREEN}}>{r.code}</div>
							<div style={{fontFamily: DISPLAY, fontSize: 64, color: 'white', marginTop: 4}}>= {r.pt}</div>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

/** Página oficial diz "um jogador" -> online depois? */
const Official: React.FC<{start: number; dur: number; laterAt: number}> = ({start, dur, laterAt}) => {
	const s = useSpring(0, 13, 240);
	const l = useAt(start, laterAt, 10, 300);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 380, left: SAFE.left, right: 140, background: 'rgba(11,6,18,0.9)', borderRadius: 24, padding: '22px 26px', border: '3px solid rgba(255,255,255,0.2)', opacity: s, transform: `translateY(${(1 - s) * 100}px)`}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 26, color: 'rgba(255,255,255,0.7)', letterSpacing: 3}}>PÁGINA OFICIAL DO JOGO</div>
				<div style={{fontFamily: DISPLAY, fontSize: 82, color: 'white', marginTop: 8}}>👤 1 JOGADOR</div>
			</div>
			<div style={{position: 'absolute', top: 640, left: SAFE.left, opacity: l, transform: `scale(${interpolate(l, [0, 1], [1.6, 1])})`, transformOrigin: 'left center'}}>
				<Chip bg={C.yellow} color={C.ink} size={44}>
					🌐 ONLINE: DEPOIS, NUMA ATUALIZAÇÃO?
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

/** Linha do tempo GTA V -> GTA Online */
const Timeline: React.FC<{start: number; dur: number; bAt: number}> = ({start, dur, bAt}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 240);
	const b = useAt(start, bAt, 11, 280);
	const out = useOut(dur);
	const k = interpolate(frame, [f(bAt - start) - 20, f(bAt - start)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 400, left: 70, right: 70, opacity: s}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 30, color: C.yellow, letterSpacing: 4, textAlign: 'center'}}>⏪ EM GTA 5</div>
				<div style={{position: 'relative', height: 300, marginTop: 20}}>
					<div style={{position: 'absolute', left: 60, right: 60, top: 140, height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.2)'}} />
					<div style={{position: 'absolute', left: 60, top: 140, height: 12, borderRadius: 6, width: `${k * 820}px`, background: GRAD}} />
					<div style={{position: 'absolute', left: 0, top: 30, width: 240, textAlign: 'center'}}>
						<div style={{fontFamily: DISPLAY, fontSize: 52, color: 'white'}}>17/09/2013</div>
						<div style={{width: 40, height: 40, borderRadius: 20, background: C.cyan, margin: '18px auto 0'}} />
						<div style={{fontFamily: UI, fontWeight: 800, fontSize: 26, color: 'white', marginTop: 16}}>LANÇAMENTO</div>
					</div>
					<div style={{position: 'absolute', right: 0, top: 30, width: 260, textAlign: 'center', opacity: b, transform: `scale(${interpolate(b, [0, 1], [1.5, 1])})`}}>
						<div style={{fontFamily: DISPLAY, fontSize: 52, color: 'white'}}>01/10/2013</div>
						<div style={{width: 40, height: 40, borderRadius: 20, background: C.pink, margin: '18px auto 0'}} />
						<div style={{fontFamily: UI, fontWeight: 800, fontSize: 26, color: 'white', marginTop: 16}}>GTA ONLINE</div>
					</div>
				</div>
				<div style={{textAlign: 'center', marginTop: 4, opacity: b}}>
					<Chip bg={C.pink} size={44}>
						+14 DIAS
					</Chip>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** 55 conquistas: contador + grade, uma "1000" dourada */
const Achievements: React.FC<{start: number; dur: number; countAt: number; numsAt: number; goldAt: number}> = ({start, dur, countAt, numsAt, goldAt}) => {
	const frame = useCurrentFrame();
	const t = start + frame / 30;
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	const k = interpolate(t, [countAt - 0.6, countAt + 0.8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const n = Math.round(55 * k);
	const g = useAt(start, goldAt, 8, 300);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<CodeRain opacity={0.15} />
			<div style={{position: 'absolute', top: 350, left: 0, right: 0, textAlign: 'center', opacity: s}}>
				<div style={{fontFamily: DISPLAY, fontSize: 170, lineHeight: 1, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 8px 0 #000)', fontVariantNumeric: 'tabular-nums'}}>{n}</div>
				<div style={{fontFamily: DISPLAY, fontSize: 64, color: 'white', textShadow: '0 5px 0 #000'}}>🏆 CONQUISTAS</div>
			</div>
			<div style={{position: 'absolute', top: 640, left: 80, right: 80, display: 'grid', gridTemplateColumns: 'repeat(11, 1fr)', gap: 8}}>
				{Array.from({length: 55}).map((_, i) => {
					const on = i < n;
					const gold = i === 54;
					const showNum = t >= numsAt;
					const label = gold ? (t >= goldAt ? '1000' : '?') : showNum ? String(i + 1) : '';
					return (
						<div key={i} style={{height: 64, borderRadius: 10, background: gold && t >= goldAt ? 'linear-gradient(135deg,#FFE27A,#FFB300)' : on ? 'rgba(61,255,138,0.25)' : 'rgba(255,255,255,0.06)', border: gold && t >= goldAt ? '3px solid white' : `2px solid ${on ? GREEN : 'rgba(255,255,255,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 700, fontSize: gold && t >= goldAt ? 18 : 20, color: gold && t >= goldAt ? C.ink : 'white', transform: gold && t >= goldAt ? `scale(${interpolate(g, [0, 1], [3, 1.25])})` : 'none', boxShadow: gold && t >= goldAt ? '0 0 30px rgba(255,200,0,0.9)' : 'none', zIndex: gold ? 2 : 1}}>
							{label}
						</div>
					);
				})}
			</div>
			{t >= goldAt ? (
				<div style={{position: 'absolute', top: 1010, left: 0, right: 0, textAlign: 'center', opacity: g}}>
					<Chip bg={C.yellow} color={C.ink} size={36}>
						⭐ UMA APARECE COM O NÚMERO 1000
					</Chip>
				</div>
			) : null}
		</AbsoluteFill>
	);
};

/** Pop-up genérico de conquista (ilustração) */
const Platinum: React.FC<{start: number; dur: number; platAt: number}> = ({start, dur, platAt}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0.1, 10, 300);
	const p = useAt(start, platAt, 9, 320);
	const out = useOut(dur);
	const shine = (frame * 14) % 1400 - 300;
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 400, left: 70, right: 70, height: 200, borderRadius: 100, background: 'rgba(11,6,18,0.94)', border: '4px solid #E8E8F0', display: 'flex', alignItems: 'center', gap: 26, padding: '0 34px', overflow: 'hidden', opacity: s, transform: `translateY(${(1 - s) * -200}px)`, boxShadow: '0 0 60px rgba(220,220,255,0.5)'}}>
				<div style={{position: 'absolute', top: 0, bottom: 0, left: shine, width: 120, background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.25), rgba(255,255,255,0))', transform: 'skewX(-20deg)'}} />
				<div style={{width: 130, height: 130, borderRadius: 65, background: 'radial-gradient(circle at 35% 30%, #ffffff, #c9cbe0 45%, #7d80a0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, flexShrink: 0}}>🏆</div>
				<div>
					<div style={{fontFamily: UI, fontWeight: 800, fontSize: 28, color: 'rgba(255,255,255,0.7)', letterSpacing: 3}}>CONQUISTA FINAL?</div>
					<div style={{fontFamily: DISPLAY, fontSize: 70, color: 'white', lineHeight: 1.05}}>A PLATINA DE GTA 6</div>
				</div>
			</div>
			<div style={{position: 'absolute', top: 650, left: 0, right: 0, textAlign: 'center', opacity: p}}>
				<Chip bg={C.purple} size={34}>
					💭 HIPÓTESE — NÃO CONFIRMADO
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

const NotConfirmed: React.FC<{start: number; dur: number; preAt: number}> = ({start, dur, preAt}) => {
	const pre = useAt(start, preAt, 10, 300);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<At from={0.7} to={dur}>
				<Stamp text="NÃO CONFIRMADO" sub="PELA ROCKSTAR" top={430} color={C.yellow} />
			</At>
			<div style={{position: 'absolute', top: 760, left: 0, right: 0, textAlign: 'center', opacity: pre, transform: `scale(${interpolate(pre, [0, 1], [1.6, 1])})`}}>
				<Chip bg={C.cyan} color={C.ink} size={44}>
					📥 PRÉ-DOWNLOAD: AMANHÃ (10/11)
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

const Poll: React.FC<{start: number}> = ({start}) => {
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
				<div style={{fontFamily: DISPLAY, fontSize: 76, color: 'white', textShadow: '0 6px 0 #000', lineHeight: 1.05}}>GTA 6 ONLINE JÁ NO LANÇAMENTO?</div>
				{opt('✅', 'SIM, NO DIA 19', GREEN, 0)}
				{opt('⏳', 'NÃO, VEM DEPOIS', C.red, 1)}
			</div>
		</AbsoluteFill>
	);
};

export const CodigoOverlays: React.FC = () => (
	<AbsoluteFill>
		<At from={0} to={5.45}>
			<Hook dur={5.45} silentAt={3.2} />
		</At>
		<At from={5.45} to={12.55}>
			<Terminal
				start={5.45}
				dur={7.1}
				title="dados_playstation.log"
				source="FONTE: @PlaystationSize (X) · via Sportskeeda"
				lines={[
					{t: '> buscando: GTA VI ...', at: 5.7},
					{t: '> resultado:', at: 7.6},
					{t: 'joinSession', at: 9.55, hi: true},
					{t: 'launchActivity', at: 10.3},
					{t: 'launchMultiplayerActivity', at: 10.75, hi: true},
				]}
			/>
		</At>
		<At from={12.55} to={16.85}>
			<Translate
				start={12.55}
				dur={4.3}
				rows={[
					{code: 'joinSession', pt: 'ENTRAR NUMA SESSÃO', at: 13.4},
					{code: 'launchMultiplayerActivity', pt: 'INICIAR MULTIPLAYER', at: 14.8},
				]}
			/>
		</At>
		<At from={16.85} to={24.75}>
			<Official start={16.85} dur={7.9} laterAt={22.1} />
		</At>
		<At from={24.75} to={28.85}>
			<Timeline start={24.75} dur={4.1} bAt={27.3} />
		</At>
		<At from={28.85} to={40.35}>
			<Achievements start={28.85} dur={11.5} countAt={33.0} numsAt={35.6} goldAt={39.7} />
		</At>
		<At from={40.35} to={44.85}>
			<Platinum start={40.35} dur={4.5} platAt={42.8} />
		</At>
		<At from={44.85} to={51.85}>
			<NotConfirmed start={44.85} dur={7.0} preAt={48.1} />
		</At>
		<At from={51.85} to={55.5}>
			<Poll start={51.85} />
		</At>
		<At from={55.5} to={63.0}>
			<ProOutro subAt={1.6} tagline="INVESTIGANDO CADA DETALHE DE GTA 6" />
		</At>
	</AbsoluteFill>
);
