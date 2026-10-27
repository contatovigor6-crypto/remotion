import React from 'react';
import {AbsoluteFill, Freeze, Img, OffthreadVideo, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {At, Chip, LaunchDate, Stamp, TitleCard, useOut, useSpring} from '../components/Overlays';
import {NotConfirmed, Pause, Poll} from '../preso/Overlays';
import {WATERMARK} from '../brand';
import {C, DISPLAY, GRAD, SAFE, UI, f} from '../theme';

const GREEN = '#3DFF8A';

/** Leitura de FPS estilo HUD de benchmark */
const FpsReadout: React.FC<{value: string; color: string; label: string; size: number}> = ({value, color, label, size}) => (
	<div style={{display: 'inline-flex', alignItems: 'baseline', gap: 14, background: 'rgba(11,6,18,0.85)', border: `5px solid ${color}`, borderRadius: 18, padding: '6px 28px 0'}}>
		<span style={{fontFamily: DISPLAY, fontSize: size, color, fontVariantNumeric: 'tabular-nums', textShadow: `0 0 24px ${color}`}}>{value}</span>
		<span style={{fontFamily: UI, fontWeight: 800, fontSize: size * 0.32, color: 'white', letterSpacing: 4}}>{label}</span>
	</div>
);

const HookTitle: React.FC<{dur: number}> = ({dur}) => {
	const s = useSpring(0, 12, 260);
	const out = useOut(dur, 3);
	return (
		<AbsoluteFill style={{alignItems: 'center', top: 420, opacity: out}}>
			<div style={{transform: `scale(${interpolate(s, [0, 1], [1.6, 1])})`, opacity: s, textAlign: 'center'}}>
				<div style={{fontFamily: DISPLAY, fontSize: 200, lineHeight: 1, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 8px 0 #000)'}}>60 FPS</div>
				<div style={{fontFamily: DISPLAY, fontSize: 110, color: 'white', textShadow: '0 6px 0 #000'}}>NO PS5?</div>
			</div>
		</AbsoluteFill>
	);
};

/** Contador que oscila entre valores e termina em "60?" */
const FpsSpin: React.FC<{dur: number; lockAt: number}> = ({dur, lockAt}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 12, 260);
	const out = useOut(dur);
	const locked = frame >= f(lockAt);
	const v = locked ? '60?' : String(Math.round(24 + random(`fps${Math.floor(frame / 2)}`) * 40));
	return (
		<AbsoluteFill style={{alignItems: 'center', top: 470, opacity: out}}>
			<div style={{transform: `scale(${interpolate(s, [0, 1], [0.6, 1]) * (locked ? 1.05 : 1)})`, opacity: s}}>
				<FpsReadout value={v} color={locked ? C.yellow : GREEN} label="FPS" size={200} />
			</div>
			<div style={{marginTop: 26, opacity: locked ? 1 : 0}}>
				<Chip bg={C.ink} size={44}>
					PS5
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

const Wish: React.FC<{dur: number; ps5At: number; fpsAt: number}> = ({dur, ps5At, fpsAt}) => {
	const a = useSpring(ps5At, 12, 280);
	const b = useSpring(fpsAt, 12, 280);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 430, left: SAFE.left, right: 140}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.yellow, textShadow: '0 2px 8px #000', opacity: a}}>A EXPECTATIVA</div>
				<div style={{display: 'flex', gap: 20, marginTop: 14, alignItems: 'center'}}>
					<div style={{opacity: a, transform: `scale(${interpolate(a, [0, 1], [1.6, 1])})`}}>
						<Chip bg={C.ink} size={56}>
							PS5
						</Chip>
					</div>
					<span style={{fontFamily: DISPLAY, fontSize: 70, color: 'white', opacity: b, textShadow: '0 4px 0 #000'}}>+</span>
					<div style={{opacity: b, transform: `scale(${interpolate(b, [0, 1], [1.6, 1])})`}}>
						<FpsReadout value="60" color={GREEN} label="FPS" size={110} />
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

const REPORT: [string, number, string][] = [
	['AGOSTO', 18.8, 'white'],
	['CONSOLE RODANDO A 30 FPS', 22.74, C.red],
	['DURANTE O DESENVOLVIMENTO', 24.32, C.yellow],
];
const Report: React.FC<{start: number; dur: number}> = ({start, dur}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 400, left: SAFE.left, right: 140, background: 'rgba(11,6,18,0.88)', borderRadius: 18, padding: '24px 30px', borderLeft: `10px solid ${C.red}`, opacity: s, transform: `translateY(${(1 - s) * 60}px)`}}>
				<div style={{display: 'flex', gap: 14, alignItems: 'center'}}>
					<div style={{fontFamily: DISPLAY, fontSize: 66, color: 'white'}}>RELATO</div>
					<div style={{fontFamily: UI, fontWeight: 800, fontSize: 24, letterSpacing: 4, color: C.ink, background: C.yellow, padding: '6px 12px', borderRadius: 6}}>NÃO OFICIAL</div>
				</div>
				{REPORT.map(([text, at, color]) => {
					const r = spring({frame: frame - f(at - start), fps: 30, config: {damping: 13, stiffness: 280}});
					return frame >= f(at - start) ? (
						<div key={text} style={{fontFamily: DISPLAY, fontSize: 58, color, marginTop: 10, opacity: r, transform: `translateX(${(1 - r) * -60}px)`}}>
							{text}
						</div>
					) : null;
				})}
			</div>
		</AbsoluteFill>
	);
};

/** Chave "MODO 60 FPS" travada no meio: em aberto */
const Toggle: React.FC<{dur: number; openAt: number}> = ({dur, openAt}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 240);
	const o = useSpring(openAt, 10, 260);
	const out = useOut(dur);
	const wobble = Math.sin(frame / 4) * 18;
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 430, left: SAFE.left, right: 140, opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.85, 1])})`}}>
				<div style={{fontFamily: DISPLAY, fontSize: 80, color: 'white', textShadow: '0 5px 0 #000'}}>MODO 60 FPS</div>
				<div style={{marginTop: 16, display: 'flex', alignItems: 'center', gap: 26}}>
					<div style={{position: 'relative', width: 260, height: 120, borderRadius: 60, background: 'rgba(255,255,255,0.18)', border: '5px solid white'}}>
						<div style={{position: 'absolute', top: 10, left: 70 + wobble, width: 90, height: 90, borderRadius: 45, background: C.yellow, boxShadow: '0 6px 16px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<span style={{fontFamily: DISPLAY, fontSize: 64, color: C.ink}}>?</span>
						</div>
					</div>
					<div style={{opacity: o, transform: `scale(${interpolate(o, [0, 1], [1.8, 1])})`}}>
						<Chip bg={C.yellow} color={C.ink} size={44}>
							EM ABERTO
						</Chip>
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

const LOAD: [string, number][] = [
	['TRÂNSITO', 43.22],
	['MULTIDÕES', 43.96],
	['FÍSICA', 45.06],
	['INTELIGÊNCIA ARTIFICIAL', 45.9],
	['MUNDO ABERTO', 47.34],
];
/** Lista do que o jogo processa + medidor de carga que chega ao máximo em "hardware" */
const Load: React.FC<{start: number; dur: number; maxAt: number}> = ({start, dur, maxAt}) => {
	const frame = useCurrentFrame();
	const out = useOut(dur);
	const t = start + frame / 30;
	const n = LOAD.filter(([, at]) => t >= at).length;
	const target = t >= maxAt ? 1 : n / 6;
	const level = interpolate(frame, [0, f(dur)], [0, 1]) * 0 + target;
	const max = t >= maxAt;
	const blink = Math.floor(frame / 5) % 2 === 0;
	const color = level > 0.8 ? C.red : level > 0.5 ? C.orange : GREEN;
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 390, left: SAFE.left, right: 140}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.yellow, textShadow: '0 2px 8px #000'}}>O JOGO PRECISA PROCESSAR</div>
				{LOAD.map(([label, at]) => {
					const r = spring({frame: frame - f(at - start), fps: 30, config: {damping: 13, stiffness: 300}});
					return t >= at ? (
						<div key={label} style={{display: 'inline-block', margin: '10px 10px 0 0', opacity: r, transform: `scale(${interpolate(r, [0, 1], [1.5, 1])})`}}>
							<Chip bg="rgba(11,6,18,0.88)" size={34}>
								{label}
							</Chip>
						</div>
					) : null;
				})}
				<div style={{marginTop: 26, fontFamily: UI, fontWeight: 800, fontSize: 28, letterSpacing: 5, color: 'white', textShadow: '0 2px 8px #000'}}>CARGA NO HARDWARE</div>
				<div style={{marginTop: 10, height: 44, borderRadius: 22, background: 'rgba(255,255,255,0.18)', border: '4px solid white', overflow: 'hidden'}}>
					<div style={{width: `${Math.max(6, level * 100)}%`, height: '100%', background: color, opacity: max && !blink ? 0.6 : 1, transition: 'none'}} />
				</div>
				{max ? (
					<div style={{marginTop: 14}}>
						<Chip bg={C.red} size={38}>
							EXIGE BASTANTE
						</Chip>
					</div>
				) : null}
			</div>
		</AbsoluteFill>
	);
};

const NotEqual: React.FC<{dur: number; neqAt: number}> = ({dur, neqAt}) => {
	const s = useSpring(0, 13, 240);
	const q = useSpring(neqAt, 9, 300);
	const r = useSpring(neqAt + 0.6, 12, 260);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 420, width: '100%', textAlign: 'center'}}>
				<div style={{opacity: s, transform: `translateY(${(1 - s) * 40}px)`}}>
					<Chip bg={C.ink} size={50}>
						VISUAL IMPRESSIONANTE
					</Chip>
				</div>
				<div style={{fontFamily: DISPLAY, fontSize: 180, color: C.red, lineHeight: 1.1, opacity: q, transform: `scale(${interpolate(q, [0, 1], [2.4, 1])})`, textShadow: '0 8px 0 #000'}}>≠</div>
				<div style={{opacity: r, transform: `scale(${interpolate(r, [0, 1], [1.5, 1])})`}}>
					<FpsReadout value="60" color={GREEN} label="FPS GARANTIDO" size={110} />
				</div>
			</div>
		</AbsoluteFill>
	);
};

const OfficialStatus: React.FC<{dur: number}> = ({dur}) => {
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 330, left: SAFE.left, opacity: s}}>
				<Chip bg={C.ink} size={30}>
					STATUS OFICIAL · 60 FPS NO PS5
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

/** Vídeos genéricos prometendo "60 FPS GARANTIDO" sendo riscados */
const Beware: React.FC<{dur: number; crossAt: number}> = ({dur, crossAt}) => {
	const frame = useCurrentFrame();
	const out = useOut(dur);
	const x = useSpring(crossAt, 10, 300);
	const card = (i: number) => {
		const s = spring({frame: frame - i * 5, fps: 30, config: {damping: 13, stiffness: 240}});
		return (
			<div key={i} style={{position: 'relative', background: 'rgba(11,6,18,0.9)', borderRadius: 16, overflow: 'hidden', margin: '0 0 22px', display: 'flex', gap: 18, padding: 14, opacity: s, transform: `translateX(${(1 - s) * 200}px) rotate(${i ? 1.5 : -1.5}deg)`}}>
				<div style={{width: 230, height: 130, borderRadius: 10, background: 'linear-gradient(135deg,#ff3e9a,#7b3cff)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<span style={{fontFamily: DISPLAY, fontSize: 40, color: 'white', textAlign: 'center', lineHeight: 1}}>60 FPS!!!</span>
				</div>
				<div>
					<div style={{fontFamily: DISPLAY, fontSize: 44, color: 'white', lineHeight: 1.1}}>"60 FPS GARANTIDO"</div>
					<div style={{marginTop: 10, width: 260, height: 16, borderRadius: 8, background: 'rgba(255,255,255,0.3)'}} />
				</div>
				<svg width="100%" height="100%" style={{position: 'absolute', left: 0, top: 0, opacity: x}}>
					<line x1="4%" y1="10%" x2={`${4 + 92 * x}%`} y2={`${10 + 80 * x}%`} stroke={C.red} strokeWidth={14} strokeLinecap="round" />
				</svg>
			</div>
		);
	};
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 400, left: SAFE.left, right: 140}}>
				{card(0)}
				{card(1)}
				<div style={{opacity: x, transform: `scale(${interpolate(x, [0, 1], [1.8, 1])})`, textAlign: 'center'}}>
					<Chip bg={C.red} size={50}>
						⚠ CUIDADO
					</Chip>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Comparação de fluidez (SIMULAÇÃO): mesma cena, em cima atualizando a cada 2 quadros, embaixo a cada quadro */
const Compare: React.FC<{start: number; t30: number; t60: number}> = ({start, t30, t60}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const top = spring({frame, fps, config: {damping: 18, stiffness: 200}});
	const bot = spring({frame: frame - 6, fps, config: {damping: 18, stiffness: 200}});
	const a = spring({frame: frame - f(t30 - start), fps, config: {damping: 10, stiffness: 300}});
	const b = spring({frame: frame - f(t60 - start), fps, config: {damping: 10, stiffness: 300}});
	const vid = (choppy: boolean) => {
		const v = <OffthreadVideo src={staticFile('v2/green-car.mp4')} muted startFrom={60} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '45% 50%'}} />;
		return choppy ? <Freeze frame={Math.floor(frame / 3) * 3}>{v}</Freeze> : v;
	};
	const half = (bottom: boolean, p: number, title: string, sub: string, color: string, big: number) => (
		<div style={{position: 'absolute', left: 0, right: 0, top: bottom ? 960 : 0, height: 960, overflow: 'hidden', transform: `translateX(${(1 - p) * (bottom ? 1080 : -1080)}px)`}}>
			{vid(!bottom)}
			<div style={{position: 'absolute', left: SAFE.left, top: bottom ? 300 : 380}}>
				<div style={{fontFamily: DISPLAY, fontSize: 84, color: 'white', textShadow: '0 5px 0 #000'}}>{title}</div>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 30, color, letterSpacing: 4, textShadow: '0 2px 8px #000'}}>{sub}</div>
			</div>
			<div style={{position: 'absolute', right: 150, top: bottom ? 300 : 380, opacity: big, transform: `scale(${interpolate(big, [0, 1], [1.8, 1])})`}}>
				<FpsReadout value={bottom ? '60' : '30'} color={color} label="FPS?" size={90} />
			</div>
		</div>
	);
	return (
		<AbsoluteFill style={{background: 'black'}}>
			{half(false, top, 'GRÁFICOS INCRÍVEIS', 'MENOS FLUIDO', C.orange, a)}
			{half(true, bot, 'MOVIMENTO FLUIDO', 'MAIS FLUIDO', GREEN, b)}
			<div style={{position: 'absolute', top: 948, left: 0, right: 0, height: 24, background: GRAD}} />
			<div style={{position: 'absolute', top: 890, left: SAFE.left}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 22, letterSpacing: 4, color: C.ink, background: C.yellow, padding: '5px 12px', borderRadius: 6}}>
					SIMULAÇÃO DA DIFERENÇA · NÃO É GAMEPLAY
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Encerramento com a logo original do canal */
const EndCard: React.FC<{start: number; subAt: number}> = ({start, subAt}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 220);
	const b = useSpring(subAt - start, 10, 300);
	const pressed = frame >= f(subAt - start) + 8;
	if (WATERMARK === null) return null;
	return (
		<AbsoluteFill style={{alignItems: 'center'}}>
			<Img
				src={staticFile(WATERMARK)}
				style={{position: 'absolute', top: 360, width: 560, height: 560, borderRadius: 48, opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.7, 1])})`, boxShadow: '0 30px 80px rgba(0,0,0,0.7)'}}
			/>
			<div style={{position: 'absolute', top: 960, opacity: b, transform: `scale(${interpolate(b, [0, 1], [1.6, 1]) * (pressed ? 0.95 : 1)})`, display: 'flex', alignItems: 'center', gap: 18, background: pressed ? '#3a3a3a' : C.red, padding: '20px 44px', borderRadius: 60, boxShadow: '0 16px 40px rgba(0,0,0,0.6)'}}>
				<span style={{fontFamily: UI, fontWeight: 800, fontSize: 52, color: 'white', letterSpacing: 2}}>{pressed ? 'INSCRITO' : 'INSCREVA-SE'}</span>
				<svg width={52} height={52} viewBox="0 0 24 24">
					<path d="M12 22a2.5 2.5 0 002.5-2.5h-5A2.5 2.5 0 0012 22zm7-6V11a7 7 0 00-5.5-6.8V3.5a1.5 1.5 0 00-3 0v.7A7 7 0 005 11v5l-2 2v1h18v-1z" fill="white" />
				</svg>
			</div>
		</AbsoluteFill>
	);
};

// ------------------------------------------------------------------ timeline

export const FpsOverlays: React.FC = () => (
	<AbsoluteFill>
		<At from={0} to={1.88}>
			<HookTitle dur={1.88} />
		</At>
		<At from={1.88} to={4.32}>
			<FpsSpin dur={2.44} lockAt={3.2 - 1.88} />
		</At>
		<At from={7.52} to={12.74}>
			<Wish dur={5.22} ps5At={8.3 - 7.52} fpsAt={11.14 - 7.52} />
		</At>
		<At from={15.54} to={18.6}>
			<LaunchDate dur={3.06} logoAt={0.4} />
		</At>
		<At from={18.6} to={25.02}>
			<Report start={18.6} dur={6.42} />
		</At>
		<At from={25.02} to={31.7}>
			<Toggle dur={6.68} openAt={30.94 - 25.02} />
		</At>
		<At from={33.08} to={35.9}>
			<Stamp text="NADA DEFINITIVO" sub="RELATO ≠ VERSÃO FINAL" top={470} color={C.yellow} />
		</At>
		<At from={35.9} to={38.14}>
			<TitleCard
				start={35.9}
				top={660}
				lines={[
					{text: 'MAS POR QUE ISSO É', at: 36.0},
					{text: 'TÃO COMPLICADO?', at: 37.06, big: true},
				]}
			/>
		</At>
		<At from={40.22} to={41.68}>
			<AbsoluteFill style={{alignItems: 'center', top: 470}}>
				<Chip bg={C.ink} size={48}>
					GRÁFICOS BONITOS ✓
				</Chip>
			</AbsoluteFill>
		</At>
		<At from={41.68} to={51.98}>
			<Load start={41.68} dur={10.3} maxAt={51.36} />
		</At>
		<At from={51.98} to={55.34}>
			<Pause dur={3.36} detailAt={53.24 - 51.98} />
		</At>
		<At from={55.34} to={61.14}>
			<NotEqual dur={5.8} neqAt={57.62 - 55.34} />
		</At>
		<At from={61.14} to={67.42}>
			<OfficialStatus dur={6.28} />
		</At>
		<At from={62.94} to={67.42}>
			<NotConfirmed dur={4.48} rockstarAt={63.44 - 62.94} />
		</At>
		<At from={67.42} to={71.56}>
			<Beware dur={4.14} crossAt={68.44 - 67.42} />
		</At>
		<At from={74.62} to={87.04}>
			<Compare start={74.62} t30={81.14} t60={85.34} />
		</At>
		<At from={87.04} to={94.54}>
			<Poll start={87.04} aAt={88.24} bAt={90.12} a="TIME 30 FPS" b="TIME 60 FPS" />
		</At>
		<At from={94.54} to={100.4}>
			<EndCard start={94.54} subAt={98.0} />
		</At>
	</AbsoluteFill>
);
