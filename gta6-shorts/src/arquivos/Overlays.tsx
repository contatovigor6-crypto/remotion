import React from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame} from 'remotion';
import {At, Chip, Stamp, useOut, useSpring} from '../components/Overlays';
import {ProOutro} from '../components/ProOutro';
import {C, DISPLAY, GRAD, SAFE, UI, f} from '../theme';

// Gráficos do Short "Os arquivos de GTA 6 entregaram 3 pistas". Ilustrações (não é a interface do console nem do jogo).
const GREEN = '#3DFF8A';
const MONO = '"JetBrains Mono", "Courier New", monospace';
const useAt = (start: number, at: number, damping = 12, stiffness = 260) => useSpring(at - start, damping, stiffness);

const Lock: React.FC<{size: number; open?: boolean}> = ({size, open = false}) => (
	<div style={{position: 'relative', width: size, height: size * 1.1}}>
		<div style={{position: 'absolute', left: size * 0.2, top: open ? -size * 0.12 : 0, width: size * 0.6, height: size * 0.55, border: `${size * 0.1}px solid #E8E8F0`, borderBottom: 'none', borderRadius: `${size * 0.3}px ${size * 0.3}px 0 0`}} />
		<div style={{position: 'absolute', left: 0, top: size * 0.45, width: size, height: size * 0.65, borderRadius: size * 0.12, background: GRAD, boxShadow: '0 10px 0 #000'}}>
			<div style={{position: 'absolute', left: size * 0.44, top: size * 0.2, width: size * 0.12, height: size * 0.25, borderRadius: size * 0.06, background: C.ink}} />
		</div>
	</div>
);

const Hook: React.FC<{dur: number; lockAt: number}> = ({dur, lockAt}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0.05, 11, 280);
	const l = useSpring(lockAt, 8, 340);
	const out = useOut(dur, 4);
	const shake = frame > f(lockAt) && frame < f(lockAt) + 8 ? Math.sin(frame * 3) * 10 : 0;
	return (
		<AbsoluteFill style={{alignItems: 'center', top: 360, opacity: out}}>
			<div style={{fontFamily: DISPLAY, fontSize: 110, color: 'white', textShadow: '0 7px 0 #000', opacity: s, textAlign: 'center', lineHeight: 1.05}}>GTA 6 JÁ ESTÁ NO SEU CONSOLE</div>
			<div style={{marginTop: 26, opacity: l, transform: `translateX(${shake}px) scale(${interpolate(l, [0, 1], [2.2, 1])})`}}>
				<Lock size={190} />
			</div>
			<div style={{marginTop: 20, opacity: l}}>
				<Chip bg={C.red} size={52}>
					🔒 MAS TRANCADO
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

const Preload: React.FC<{start: number; dur: number}> = ({start, dur}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	const k = interpolate(frame, [10, f(dur) - 10], [0.08, 0.86], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 380, left: 70, right: 70, background: 'rgba(11,6,18,0.9)', borderRadius: 24, padding: '24px 28px', border: '3px solid rgba(255,255,255,0.18)', opacity: s, transform: `translateY(${(1 - s) * 100}px)`}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
					<div style={{width: 16, height: 16, borderRadius: 8, background: GREEN, boxShadow: `0 0 14px ${GREEN}`}} />
					<span style={{fontFamily: UI, fontWeight: 800, fontSize: 30, color: GREEN, letterSpacing: 3}}>COMEÇOU HOJE · 10/11</span>
				</div>
				<div style={{fontFamily: DISPLAY, fontSize: 92, color: 'white', marginTop: 8}}>📥 PRÉ-DOWNLOAD</div>
				<div style={{position: 'relative', height: 40, borderRadius: 20, background: 'rgba(255,255,255,0.14)', marginTop: 16, overflow: 'hidden'}}>
					<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${k * 100}%`, background: GRAD}} />
				</div>
				<div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontWeight: 700, fontSize: 26, color: 'white', marginTop: 8}}>
					<span>{Math.round(212 * k)} / 212 GB</span>
					<span style={{color: C.yellow}}>🔍 CURIOSOS FUÇANDO…</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};

const Files: React.FC<{start: number; dur: number; cluesAt: number}> = ({start, dur, cluesAt}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 240);
	const c = useAt(start, cluesAt, 9, 320);
	const out = useOut(dur);
	const names = ['█████████.dat', '██████.rpf', 'core_restofworld001', '████████.dat', '█████.rpf', '███████.dat'];
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 360, left: 70, right: 70, background: 'rgba(4,10,8,0.93)', borderRadius: 22, padding: '18px 22px', border: `3px solid ${GREEN}55`, opacity: s}}>
				<div style={{fontFamily: MONO, fontSize: 26, color: 'rgba(255,255,255,0.7)'}}>/gta6/ (ilustração)</div>
				{names.map((n, i) => {
					const k = spring({frame: frame - f(0.2 + i * 0.25), fps: 30, config: {damping: 12, stiffness: 280}});
					return (
						<div key={n} style={{display: 'flex', alignItems: 'center', gap: 14, margin: '8px 0', opacity: k, transform: `translateX(${(1 - k) * 100}px)`}}>
							<span style={{fontSize: 34}}>🔒</span>
							<span style={{fontFamily: MONO, fontWeight: 700, fontSize: 32, color: GREEN, textShadow: `0 0 ${random(`g${i}${Math.floor(frame / 5)}`) > 0.85 ? 12 : 0}px ${GREEN}`}}>{n}</span>
						</div>
					);
				})}
			</div>
			<div style={{position: 'absolute', top: 900, left: 0, right: 0, textAlign: 'center', opacity: c, transform: `scale(${interpolate(c, [0, 1], [1.8, 1])})`}}>
				<Chip bg={C.yellow} color={C.ink} size={50}>
					🔍 3 PISTAS
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

const Clue: React.FC<{n: number}> = ({n}) => {
	const s = useSpring(0, 10, 320);
	return (
		<div style={{position: 'absolute', top: 360, left: SAFE.left, opacity: s, transform: `translateX(${(1 - s) * -200}px)`}}>
			<div style={{display: 'inline-flex', alignItems: 'baseline', gap: 12, background: C.ink, padding: '8px 22px 2px', borderRadius: 14, border: `4px solid ${C.yellow}`}}>
				<span style={{fontFamily: UI, fontWeight: 800, fontSize: 30, color: C.yellow, letterSpacing: 4}}>PISTA</span>
				<span style={{fontFamily: DISPLAY, fontSize: 76, color: 'white'}}>#{n}</span>
			</div>
		</div>
	);
};

const Audio: React.FC<{start: number; dur: number; items: {t: string; at: number}[]}> = ({start, dur, items}) => {
	const frame = useCurrentFrame();
	const out = useOut(dur);
	const k = interpolate(frame, [f(1.0), f(2.0)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{opacity: out}}>
			<Clue n={1} />
			<div style={{position: 'absolute', top: 500, left: SAFE.left, right: 140}}>
				<div style={{fontFamily: DISPLAY, fontSize: 150, lineHeight: 1, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 8px 0 #000)'}}>~22 GB</div>
				<div style={{fontFamily: DISPLAY, fontSize: 70, color: 'white', textShadow: '0 5px 0 #000'}}>🔊 SÓ DE ÁUDIO</div>
				<div style={{display: 'flex', height: 38, borderRadius: 19, overflow: 'hidden', marginTop: 14, background: 'rgba(255,255,255,0.15)'}}>
					<div style={{width: `${(22 / 212) * 100 * k}%`, background: C.cyan}} />
				</div>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 24, color: 'rgba(255,255,255,0.8)', marginTop: 6}}>DE ATÉ 212 GB</div>
				<div style={{display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap'}}>
					{items.map((it, i) => {
						const p = spring({frame: frame - f(it.at - start), fps: 30, config: {damping: 10, stiffness: 300}});
						if (frame < f(it.at - start)) return null;
						return (
							<div key={i} style={{transform: `scale(${interpolate(p, [0, 1], [1.7, 1])})`, opacity: p}}>
								<Chip bg={[C.purple, C.pink, C.orange][i]} size={38}>
									{it.t}
								</Chip>
							</div>
						);
					})}
				</div>
			</div>
		</AbsoluteFill>
	);
};

const Missing: React.FC<{start: number; dur: number; nameAt: number; flagsAt: number}> = ({start, dur, nameAt, flagsAt}) => {
	const frame = useCurrentFrame();
	const t = start + frame / 30;
	const fl = useAt(start, flagsAt, 9, 320);
	const out = useOut(dur);
	const name = 'core_restofworld001';
	const n = Math.max(0, Math.min(name.length, Math.floor((t - nameAt) * 16)));
	return (
		<AbsoluteFill style={{opacity: out}}>
			<Clue n={2} />
			<div style={{position: 'absolute', top: 500, left: 60, right: 60, background: 'rgba(4,10,8,0.93)', borderRadius: 20, padding: '20px 24px', border: `3px solid ${C.yellow}88`}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 26, color: 'rgba(255,255,255,0.7)', letterSpacing: 3}}>ARQUIVO MISTERIOSO</div>
				<div style={{fontFamily: MONO, fontWeight: 700, fontSize: 50, color: C.yellow, marginTop: 6, minHeight: 64}}>
					{name.slice(0, n)}
					{n < name.length && Math.floor(frame / 6) % 2 === 0 ? '█' : ''}
				</div>
			</div>
			<div style={{position: 'absolute', top: 720, left: 60, right: 60, display: 'flex', gap: 20, opacity: fl, transform: `scale(${interpolate(fl, [0, 1], [1.5, 1])})`}}>
				{[
					{f: '🇦🇺', t: 'AUSTRÁLIA'},
					{f: '🇳🇿', t: 'NOVA ZELÂNDIA'},
				].map((x) => (
					<div key={x.t} style={{flex: 1, background: 'rgba(11,6,18,0.9)', borderRadius: 20, padding: '16px 10px', textAlign: 'center', border: `5px solid ${C.red}`}}>
						<div style={{fontSize: 80}}>{x.f}</div>
						<div style={{fontFamily: UI, fontWeight: 800, fontSize: 26, color: 'white'}}>{x.t}</div>
						<div style={{fontFamily: DISPLAY, fontSize: 46, color: C.red}}>❌ NÃO APARECE</div>
					</div>
				))}
			</div>
		</AbsoluteFill>
	);
};

const RayTracing: React.FC<{start: number; dur: number; rtAt: number; proAt: number}> = ({start, dur, rtAt, proAt}) => {
	const frame = useCurrentFrame();
	const r = useAt(start, rtAt, 10, 300);
	const p = useAt(start, proAt, 10, 300);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			{/* raios de luz (efeito) */}
			<AbsoluteFill style={{opacity: 0.5 * r}}>
				{Array.from({length: 7}).map((_, i) => (
					<div key={i} style={{position: 'absolute', left: 100 + i * 140, top: -200, width: 12, height: 2400, background: 'linear-gradient(180deg, rgba(255,255,255,0), rgba(140,220,255,0.6), rgba(255,255,255,0))', transform: `rotate(${18 + Math.sin(frame / 20 + i) * 4}deg)`, filter: 'blur(4px)'}} />
				))}
			</AbsoluteFill>
			<Clue n={3} />
			<div style={{position: 'absolute', top: 500, left: SAFE.left, right: 140, opacity: r, transform: `translateY(${(1 - r) * 60}px)`}}>
				<div style={{fontFamily: MONO, fontWeight: 700, fontSize: 40, color: GREEN}}>BVH8 → </div>
				<div style={{fontFamily: DISPLAY, fontSize: 120, lineHeight: 1, color: 'white', textShadow: '0 7px 0 #000'}}>RAY TRACING?</div>
			</div>
			<div style={{position: 'absolute', top: 760, left: SAFE.left, opacity: p, transform: `scale(${interpolate(p, [0, 1], [1.6, 1])})`, transformOrigin: 'left center'}}>
				<Chip bg="#1E5BFF" size={48}>
					🎮 PS5 PRO?
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

const XboxApp: React.FC<{start: number; dur: number; installAt: number; lockAt: number}> = ({start, dur, installAt, lockAt}) => {
	const frame = useCurrentFrame();
	const t = start + frame / 30;
	const s = useSpring(0, 12, 260);
	const lk = useAt(start, lockAt, 10, 300);
	const out = useOut(dur);
	const k = interpolate(t, [installAt, installAt + 3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 360, left: SAFE.left, opacity: s}}>
				<Chip bg={GREEN} color={C.ink} size={40}>
					🎁 BÔNUS · NO XBOX
				</Chip>
			</div>
			<div style={{position: 'absolute', left: 290, top: 470, width: 500, height: 560, borderRadius: 50, background: '#0c0c10', border: '10px solid #2a2a30', boxShadow: '0 30px 70px rgba(0,0,0,0.7)', opacity: s, transform: `rotate(-4deg) translateY(${(1 - s) * 200}px)`, overflow: 'hidden'}}>
				<div style={{position: 'absolute', inset: 18, borderRadius: 32, background: 'linear-gradient(160deg, #0e2a12, #1b6b2a)', padding: 26}}>
					<div style={{fontFamily: UI, fontWeight: 800, fontSize: 26, color: 'rgba(255,255,255,0.75)'}}>APP DO CELULAR (ILUSTRAÇÃO)</div>
					<div style={{fontFamily: DISPLAY, fontSize: 64, color: 'white', marginTop: 10}}>GTA VI</div>
					<div style={{marginTop: 18, background: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: '14px 16px'}}>
						<div style={{fontFamily: UI, fontWeight: 800, fontSize: 28, color: 'white'}}>{k < 1 ? 'INSTALANDO…' : '✅ INSTALADO'}</div>
						<div style={{height: 18, borderRadius: 9, background: 'rgba(0,0,0,0.3)', marginTop: 10, overflow: 'hidden'}}>
							<div style={{width: `${k * 100}%`, height: '100%', background: GREEN}} />
						</div>
					</div>
					<div style={{marginTop: 18, background: 'rgba(0,0,0,0.35)', borderRadius: 14, padding: '14px 16px', opacity: lk, transform: `scale(${interpolate(lk, [0, 1], [1.3, 1])})`}}>
						<div style={{fontFamily: UI, fontWeight: 800, fontSize: 28, color: C.yellow}}>▶ JOGAR: 🔒 SÓ EM 19/11</div>
					</div>
				</div>
			</div>
			<div style={{position: 'absolute', top: 1050, left: 0, right: 0, textAlign: 'center', fontFamily: UI, fontWeight: 700, fontSize: 22, color: 'rgba(255,255,255,0.6)'}}>DESCOBERTA DA COMUNIDADE · NÃO É ANÚNCIO OFICIAL</div>
		</AbsoluteFill>
	);
};

const Poll: React.FC = () => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 260);
	const opt = (l: string, t: string, color: string, i: number) => {
		const k = spring({frame: frame - f(0.3 + i * 0.22), fps: 30, config: {damping: 11, stiffness: 300}});
		return (
			<div style={{display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.96)', borderRadius: 18, padding: '10px 18px', margin: '12px 0', opacity: k, transform: `translateX(${(1 - k) * 200}px)`}}>
				<div style={{width: 62, height: 62, borderRadius: 14, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 46, color: 'white'}}>{l}</div>
				<span style={{fontFamily: DISPLAY, fontSize: 46, color: C.ink}}>{t}</span>
			</div>
		);
	};
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', top: 360, left: SAFE.left, right: 140, opacity: s}}>
				<div style={{fontFamily: DISPLAY, fontSize: 74, color: 'white', textShadow: '0 6px 0 #000', lineHeight: 1.05}}>QUAL PISTA TE DEIXOU MAIS CURIOSO?</div>
				{opt('1', '🔊 22 GB DE ÁUDIO', C.cyan, 0)}
				{opt('2', '🗂️ ARQUIVO SUMIDO', C.red, 1)}
				{opt('3', '✨ RAY TRACING', C.purple, 2)}
			</div>
		</AbsoluteFill>
	);
};

export const ArquivosOverlays: React.FC = () => (
	<AbsoluteFill>
		<At from={0} to={3.8}>
			<Hook dur={3.8} lockAt={2.5} />
		</At>
		<At from={3.8} to={8.3}>
			<Preload start={3.8} dur={4.5} />
		</At>
		<At from={8.3} to={12.6}>
			<Files start={8.3} dur={4.3} cluesAt={11.3} />
		</At>
		<At from={12.6} to={18.7}>
			<Audio
				start={12.6}
				dur={6.1}
				items={[
					{t: '🎙️ DIÁLOGOS', at: 16.4},
					{t: '📻 RÁDIOS', at: 17.3},
					{t: '🎵 MÚSICAS', at: 18.0},
				]}
			/>
		</At>
		<At from={18.7} to={26.6}>
			<Missing start={18.7} dur={7.9} nameAt={21.5} flagsAt={25.1} />
		</At>
		<At from={26.7} to={29.0}>
			<Stamp text="???" sub="NINGUÉM SABE" top={520} color={C.yellow} />
		</At>
		<At from={29.0} to={35.0}>
			<RayTracing start={29.0} dur={6.0} rtAt={31.8} proAt={33.7} />
		</At>
		<At from={35.1} to={39.4}>
			<Stamp text="NÃO CONFIRMADO" sub="NOME DE ARQUIVO ENGANA" top={500} color={C.red} />
		</At>
		<At from={39.4} to={49.0}>
			<XboxApp start={39.4} dur={9.6} installAt={42.8} lockAt={46.6} />
		</At>
		<At from={49.0} to={51.9}>
			<Poll />
		</At>
		<At from={51.9} to={59.5}>
			<ProOutro subAt={1.6} tagline="INVESTIGANDO CADA DETALHE DE GTA 6" />
		</At>
	</AbsoluteFill>
);
