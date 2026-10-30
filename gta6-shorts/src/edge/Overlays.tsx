import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {At, useOut, useSpring} from '../components/Overlays';
import {WATERMARK} from '../brand';
import {C, DISPLAY, GRAD, UI, f} from '../theme';

// Overlays do vídeo LONGO (1920×1080). Legendas ficam embaixo (y≈900); overlays usam o terço superior e as laterais.

const GREEN = '#3DFF8A';
const EDGE_IMGS = ['shark', 'tattoo-yard', 'mendez', 'bikers-town', 'jl-moto', 'jason-fire', 'lucia-club', 'jason-247', 'jl-car-guns', 'biker-tattoo', 'airboat-swamp', 'skyline'];

const useAt = (start: number, at: number, damping = 12, stiffness = 260) => useSpring(at - start, damping, stiffness);

const Pill: React.FC<{children: React.ReactNode; bg?: string; color?: string; size?: number; style?: React.CSSProperties}> = ({children, bg = 'rgba(11,6,18,0.88)', color = 'white', size = 34, style}) => (
	<div style={{display: 'inline-flex', alignItems: 'center', gap: 12, padding: '10px 24px', background: bg, color, fontFamily: UI, fontWeight: 800, fontSize: size, letterSpacing: 3, borderRadius: 10, boxShadow: '0 10px 30px rgba(0,0,0,0.45)', whiteSpace: 'nowrap', ...style}}>{children}</div>
);

/** Selo "IMAGEM NOVA · EDGE 430" no canto superior direito enquanto um screenshot novo está na tela */
const NewBadge: React.FC = () => {
	const s = useSpring(0, 14, 260);
	return (
		<div style={{position: 'absolute', top: 40, right: 50, opacity: s, transform: `translateY(${(1 - s) * -30}px)`}}>
			<Pill bg={C.yellow} color={C.ink} size={26}>
				🆕 IMAGEM OFICIAL NOVA · EDGE 430
			</Pill>
		</div>
	);
};

/** Rótulo do assunto da imagem, abaixo da logo */
const Label: React.FC<{text: string; dur: number; color?: string}> = ({text, dur, color = C.pink}) => {
	const s = useSpring(0.1, 13, 260);
	const out = useOut(dur);
	return (
		<div style={{position: 'absolute', top: 190, left: 50, opacity: s * out, transform: `translateX(${(1 - s) * -200}px)`}}>
			<div style={{display: 'flex', alignItems: 'stretch'}}>
				<div style={{width: 12, background: color, borderRadius: '6px 0 0 6px'}} />
				<div style={{background: 'rgba(11,6,18,0.88)', padding: '10px 26px', fontFamily: DISPLAY, fontSize: 58, color: 'white', borderRadius: '0 10px 10px 0', whiteSpace: 'nowrap'}}>{text}</div>
			</div>
		</div>
	);
};

const Hook: React.FC<{dur: number}> = ({dur}) => {
	const a = useSpring(0.2, 12, 240);
	const b = useSpring(0.9, 10, 280);
	const out = useOut(dur, 6);
	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: out, background: `rgba(11,6,18,${0.35 * out})`}}>
			<div style={{fontFamily: DISPLAY, fontSize: 150, color: 'white', textShadow: '0 8px 0 #000', opacity: a, transform: `scale(${interpolate(a, [0, 1], [1.4, 1])})`, marginTop: -140}}>NOVAS IMAGENS</div>
			<div style={{fontFamily: DISPLAY, fontSize: 200, lineHeight: 1, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 10px 0 #000)', opacity: b, transform: `scale(${interpolate(b, [0, 1], [1.8, 1])})`}}>DE GTA 6</div>
		</AbsoluteFill>
	);
};

const DemoCard: React.FC<{dur: number; edgeAt: number; start: number}> = ({dur, edgeAt, start}) => {
	const s = useSpring(0, 13, 240);
	const e = useAt(start, edgeAt, 10, 300);
	const out = useOut(dur);
	return (
		<div style={{position: 'absolute', top: 190, left: 50, opacity: out}}>
			<div style={{opacity: s, transform: `translateX(${(1 - s) * -200}px)`, background: 'rgba(11,6,18,0.9)', borderLeft: `12px solid ${C.cyan}`, borderRadius: 12, padding: '18px 30px'}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 26, letterSpacing: 6, color: C.cyan}}>DEMONSTRAÇÃO</div>
				<div style={{fontFamily: DISPLAY, fontSize: 96, color: 'white', lineHeight: 1}}>~90 MINUTOS</div>
			</div>
			<div style={{marginTop: 16, opacity: e, transform: `scale(${interpolate(e, [0, 1], [1.6, 1])})`, transformOrigin: 'left center'}}>
				<Pill bg={C.red} size={34}>
					📰 REVISTA EDGE · EDIÇÃO 430
				</Pill>
			</div>
		</div>
	);
};

const Chapter: React.FC<{n: number; title: string; sub: string; dur: number}> = ({n, title, sub, dur}) => {
	const a = useSpring(0.05, 12, 220);
	const b = useSpring(0.35, 12, 240);
	const out = useOut(dur, 8);
	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: out}}>
			<div style={{marginTop: -120, textAlign: 'center'}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 34, letterSpacing: 14, color: C.yellow, opacity: a}}>CAPÍTULO {n}</div>
				<div style={{height: 6, width: interpolate(a, [0, 1], [0, 520]), background: GRAD, margin: '16px auto 22px', borderRadius: 3}} />
				<div style={{fontFamily: DISPLAY, fontSize: 150, color: 'white', lineHeight: 1, textShadow: '0 8px 0 #000', opacity: b, transform: `translateY(${(1 - b) * 40}px)`}}>{title}</div>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 34, letterSpacing: 4, color: 'rgba(255,255,255,0.8)', marginTop: 14, opacity: b}}>{sub}</div>
			</div>
		</AbsoluteFill>
	);
};

/** Mosaico com os 12 screenshots novos */
const Mosaic: React.FC<{dur: number; label: string}> = ({dur, label}) => {
	const frame = useCurrentFrame();
	const out = useOut(dur, 8);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 130, left: 210, right: 210, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14}}>
				{EDGE_IMGS.map((name, i) => {
					const p = spring({frame: frame - i * 3, fps: 30, config: {damping: 13, stiffness: 240}});
					return <Img key={name} src={staticFile(`v10/${name}.jpg`)} style={{width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', borderRadius: 10, border: '3px solid rgba(255,255,255,0.85)', opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.6, 1])}) rotate(${(i % 3) - 1}deg)`, boxShadow: '0 10px 26px rgba(0,0,0,0.6)'}} />;
				})}
			</div>
			<div style={{position: 'absolute', top: 60, width: '100%', textAlign: 'center'}}>
				<Pill bg={C.yellow} color={C.ink} size={32}>
					{label}
				</Pill>
			</div>
		</AbsoluteFill>
	);
};

const ProveCard: React.FC<{start: number; dur: number; noAt: number; yesAt: number}> = ({start, dur, noAt, yesAt}) => {
	const a = useAt(start, noAt, 11, 280);
	const b = useAt(start, yesAt, 11, 280);
	const out = useOut(dur);
	const row = (ok: boolean, text: string, p: number) => (
		<div style={{display: 'flex', alignItems: 'center', gap: 18, background: 'rgba(11,6,18,0.9)', borderRadius: 14, padding: '14px 24px', marginTop: 16, borderLeft: `10px solid ${ok ? GREEN : C.red}`, opacity: p, transform: `translateX(${(1 - p) * 300}px)`}}>
			<span style={{fontFamily: DISPLAY, fontSize: 54, color: ok ? GREEN : C.red}}>{ok ? '✓' : '✗'}</span>
			<span style={{fontFamily: DISPLAY, fontSize: 50, color: 'white'}}>{text}</span>
		</div>
	);
	return (
		<div style={{position: 'absolute', top: 180, right: 60, width: 820, opacity: out}}>
			{row(false, 'PROVA DE SISTEMA SUBMARINO COMPLETO', a)}
			{row(true, 'ATENÇÃO VISUAL AO FUNDO DO MAR', b)}
		</div>
	);
};

const BigStat: React.FC<{start: number; dur: number; at: number}> = ({start, dur, at}) => {
	const frame = useCurrentFrame();
	const t = start + frame / 30;
	const out = useOut(dur);
	const k = interpolate(t, [at - 0.3, at + 1.4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const v = Math.round(600000 * (1 - Math.pow(1 - k, 3)));
	const s = useAt(start, at - 0.3, 12, 240);
	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: out}}>
			<div style={{marginTop: -160, textAlign: 'center', opacity: s}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 34, letterSpacing: 8, color: C.yellow}}>APROXIMADAMENTE</div>
				<div style={{fontFamily: DISPLAY, fontSize: 230, lineHeight: 1, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 10px 0 #000)', fontVariantNumeric: 'tabular-nums'}}>{v.toLocaleString('pt-BR')}</div>
				<div style={{fontFamily: DISPLAY, fontSize: 64, color: 'white', textShadow: '0 5px 0 #000'}}>ANIMAÇÕES PARA OS NPCs</div>
			</div>
		</AbsoluteFill>
	);
};

const ChipRow: React.FC<{start: number; dur: number; items: [string, number, string][]; top?: number; title?: string}> = ({start, dur, items, top = 190, title}) => {
	const frame = useCurrentFrame();
	const out = useOut(dur);
	return (
		<div style={{position: 'absolute', top, left: 50, right: 50, opacity: out}}>
			{title ? (
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 28, letterSpacing: 6, color: C.yellow, textShadow: '0 2px 8px #000', marginBottom: 12}}>{title}</div>
			) : null}
			<div style={{display: 'flex', gap: 18, flexWrap: 'wrap'}}>
				{items.map(([text, at, color]) => {
					const p = spring({frame: frame - f(at - start), fps: 30, config: {damping: 11, stiffness: 300}});
					return frame >= f(at - start) ? (
						<div key={text} style={{opacity: p, transform: `scale(${interpolate(p, [0, 1], [1.6, 1])})`}}>
							<Pill bg={color} size={40}>
								{text}
							</Pill>
						</div>
					) : null;
				})}
			</div>
		</div>
	);
};

const Wanted: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const out = useOut(dur);
	const fade = interpolate(frame, [f(dur) * 0.55, f(dur) * 0.9], [1, 0.15], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<div style={{position: 'absolute', top: 60, right: 60, opacity: out, display: 'flex', gap: 10}}>
			{[0, 1, 2, 3, 4].map((i) => {
				const p = spring({frame: frame - i * 4, fps: 30, config: {damping: 10, stiffness: 300}});
				return (
					<span key={i} style={{fontSize: 90, color: i < 4 ? C.yellow : 'rgba(255,255,255,0.3)', opacity: (i < 4 ? fade : 1) * p, textShadow: '0 4px 0 #000', transform: `scale(${p})`, display: 'inline-block'}}>
						★
					</span>
				);
			})}
		</div>
	);
};

const PROFILE: [string, string, number][] = [
	['👕', 'ROUPA', 274.9],
	['🧑', 'APARÊNCIA', 275.7],
	['🔫', 'ARMA', 276.8],
	['🚗', 'VEÍCULO', 278.2],
	['👥', 'PARCEIRO', 280.0],
	['📹', 'CÂMERAS', 282.0],
];
/** Perfil criminal ILUSTRATIVO: indicadores acendem conforme a narração e apagam quando as pistas são eliminadas */
const Profile: React.FC<{start: number; dur: number; off: Record<string, number>}> = ({start, dur, off}) => {
	const frame = useCurrentFrame();
	const t = start + frame / 30;
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	return (
		<div style={{position: 'absolute', top: 160, right: 60, width: 640, opacity: out * s, transform: `translateX(${(1 - s) * 300}px)`}}>
			<div style={{background: 'rgba(11,6,18,0.92)', borderRadius: 18, padding: '20px 24px', border: `3px solid ${C.red}`}}>
				<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
					<div style={{fontFamily: DISPLAY, fontSize: 52, color: 'white'}}>🚨 PERFIL DO SUSPEITO</div>
				</div>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 18, letterSpacing: 3, color: C.yellow, marginTop: 2}}>ILUSTRAÇÃO · NÃO É A INTERFACE DO JOGO</div>
				<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14}}>
					{PROFILE.map(([icon, label, at]) => {
						const on = t >= at && !(off[label] !== undefined && t >= off[label]);
						const p = spring({frame: frame - f(at - start), fps: 30, config: {damping: 12, stiffness: 300}});
						return (
							<div key={label} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12, background: on ? 'rgba(255,45,61,0.25)' : 'rgba(255,255,255,0.06)', border: `3px solid ${on ? C.red : 'rgba(255,255,255,0.15)'}`, transform: `scale(${t >= at ? interpolate(p, [0, 1], [1.2, 1]) : 1})`}}>
								<span style={{fontSize: 40, opacity: on ? 1 : 0.35}}>{icon}</span>
								<span style={{fontFamily: DISPLAY, fontSize: 40, color: on ? 'white' : 'rgba(255,255,255,0.35)', textDecoration: off[label] !== undefined && t >= off[label] ? 'line-through' : 'none'}}>{label}</span>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

const CarHud: React.FC<{start: number; dur: number; fuelAt: number; engineAt: number; trackAt: number}> = ({start, dur, fuelAt, engineAt, trackAt}) => {
	const frame = useCurrentFrame();
	const t = start + frame / 30;
	const out = useOut(dur);
	const fu = useAt(start, fuelAt, 12, 260);
	const en = useAt(start, engineAt, 12, 260);
	const tr = useAt(start, trackAt, 10, 300);
	const fuel = interpolate(t, [fuelAt, fuelAt + 3], [0.8, 0.18], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const ping = (frame % 30) / 30;
	return (
		<div style={{position: 'absolute', top: 160, right: 60, width: 600, opacity: out}}>
			<div style={{fontFamily: UI, fontWeight: 800, fontSize: 18, letterSpacing: 3, color: C.yellow, marginBottom: 8}}>ILUSTRAÇÃO · NÃO É A INTERFACE DO JOGO</div>
			<div style={{background: 'rgba(11,6,18,0.9)', borderRadius: 18, padding: '18px 24px', opacity: fu}}>
				<div style={{fontFamily: DISPLAY, fontSize: 44, color: 'white'}}>⛽ COMBUSTÍVEL</div>
				<div style={{marginTop: 8, height: 28, borderRadius: 14, background: 'rgba(255,255,255,0.15)', overflow: 'hidden'}}>
					<div style={{width: `${fuel * 100}%`, height: '100%', background: fuel < 0.3 ? C.red : C.orange}} />
				</div>
				<div style={{fontFamily: DISPLAY, fontSize: 44, color: 'white', marginTop: 14, opacity: en}}>🔧 CONDIÇÃO DO MOTOR</div>
				<div style={{marginTop: 8, height: 28, borderRadius: 14, background: 'rgba(255,255,255,0.15)', overflow: 'hidden', opacity: en}}>
					<div style={{width: '55%', height: '100%', background: C.yellow}} />
				</div>
			</div>
			{t >= trackAt ? (
				<div style={{marginTop: 16, display: 'flex', alignItems: 'center', gap: 18, opacity: tr}}>
					<div style={{position: 'relative', width: 90, height: 90}}>
						<div style={{position: 'absolute', inset: 0, borderRadius: 45, border: `4px solid ${C.red}`, transform: `scale(${0.4 + ping})`, opacity: 1 - ping}} />
						<div style={{position: 'absolute', left: 33, top: 33, width: 24, height: 24, borderRadius: 12, background: C.red}} />
					</div>
					<Pill bg={C.red} size={36}>
						📡 RASTREADOR ATIVO
					</Pill>
				</div>
			) : null}
		</div>
	);
};

/** Celular ILUSTRATIVO no canto direito com um app */
const PhoneApp: React.FC<{dur: number; app: string; color: string; children: React.ReactNode}> = ({dur, app, color, children}) => {
	const s = useSpring(0, 14, 200);
	const out = useOut(dur);
	return (
		<div style={{position: 'absolute', top: 70, right: 120, opacity: out}}>
			<div style={{fontFamily: UI, fontWeight: 800, fontSize: 18, letterSpacing: 3, color: C.yellow, marginBottom: 8, opacity: s}}>ILUSTRAÇÃO · NÃO É A TELA DO JOGO</div>
			<div style={{width: 400, height: 720, borderRadius: 50, background: '#0b0b10', border: '10px solid #2a2a33', boxShadow: '0 30px 80px rgba(0,0,0,0.65)', overflow: 'hidden', transform: `translateY(${(1 - s) * 700}px) rotate(3deg)`}}>
				<div style={{background: color, padding: '46px 22px 18px', fontFamily: DISPLAY, fontSize: 56, color: 'white'}}>{app}</div>
				<div style={{padding: 18}}>{children}</div>
			</div>
		</div>
	);
};

const AppRow: React.FC<{title: string; sub: string; at: number; start: number; tag?: string; tagColor?: string}> = ({title, sub, at, start, tag, tagColor = C.red}) => {
	const frame = useCurrentFrame();
	const p = spring({frame: frame - f(at - start), fps: 30, config: {damping: 12, stiffness: 280}});
	return (
		<div style={{background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: '14px 16px', marginBottom: 12, opacity: p, transform: `translateX(${(1 - p) * 120}px)`}}>
			<div style={{fontFamily: DISPLAY, fontSize: 34, color: 'white'}}>{title}</div>
			<div style={{fontFamily: UI, fontWeight: 600, fontSize: 20, color: 'rgba(255,255,255,0.75)'}}>{sub}</div>
			{tag ? (
				<div style={{display: 'inline-block', marginTop: 6, background: tagColor, color: 'white', fontFamily: UI, fontWeight: 800, fontSize: 18, padding: '3px 10px', borderRadius: 6}}>{tag}</div>
			) : null}
		</div>
	);
};

const Quote: React.FC<{dur: number; who: string; role: string; text: string}> = ({dur, who, role, text}) => {
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	return (
		<div style={{position: 'absolute', top: 170, right: 60, width: 760, opacity: out * s, transform: `translateX(${(1 - s) * 300}px)`}}>
			<div style={{background: 'rgba(11,6,18,0.9)', borderRadius: 18, padding: '22px 28px', borderLeft: `12px solid ${C.cyan}`}}>
				<div style={{fontFamily: DISPLAY, fontSize: 52, color: 'white', lineHeight: 1.1}}>{text}</div>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 26, color: C.cyan, marginTop: 12, letterSpacing: 2}}>
					— {who} · {role}
				</div>
			</div>
		</div>
	);
};

const Checklist: React.FC<{start: number; dur: number; rows: [string, string, number][]}> = ({start, dur, rows}) => {
	const frame = useCurrentFrame();
	const out = useOut(dur);
	const s = useSpring(0, 13, 240);
	return (
		<div style={{position: 'absolute', top: 120, left: 360, right: 360, opacity: out}}>
			<div style={{textAlign: 'center', opacity: s}}>
				<Pill bg={C.yellow} color={C.ink} size={32}>
					O PADRÃO DE GTA 6
				</Pill>
			</div>
			{rows.map(([icon, text, at]) => {
				const p = spring({frame: frame - f(at - start), fps: 30, config: {damping: 11, stiffness: 280}});
				return frame >= f(at - start) ? (
					<div key={text} style={{display: 'flex', alignItems: 'center', gap: 20, background: 'rgba(11,6,18,0.9)', borderRadius: 14, padding: '12px 24px', marginTop: 14, borderLeft: `10px solid ${GREEN}`, opacity: p, transform: `translateX(${(1 - p) * 300}px)`}}>
						<span style={{fontSize: 48}}>{icon}</span>
						<span style={{fontFamily: DISPLAY, fontSize: 50, color: 'white'}}>{text}</span>
					</div>
				) : null;
			})}
		</div>
	);
};

const DateCard: React.FC<{start: number; dur: number; at: number}> = ({start, dur, at}) => {
	const p = useAt(start, at, 10, 260);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: out}}>
			<div style={{marginTop: -150, textAlign: 'center', opacity: p, transform: `scale(${interpolate(p, [0, 1], [1.5, 1])})`}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 34, letterSpacing: 10, color: C.yellow}}>DATA OFICIAL DE LANÇAMENTO</div>
				<div style={{fontFamily: DISPLAY, fontSize: 210, lineHeight: 1, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 10px 0 #000)'}}>19 NOV 2026</div>
				<div style={{marginTop: 18}}>
					<Pill bg="white" color={C.ink} size={38}>
						PLAYSTATION 5 · XBOX SERIES X|S
					</Pill>
				</div>
			</div>
		</AbsoluteFill>
	);
};

const POLL: [string, string, number, string][] = [
	['A', '🦈 TUBARÃO-MARTELO', 600.3, '#1FA7C9'],
	['B', '🚶 PEDESTRES', 601.6, C.orange],
	['C', '🚨 POLÍCIA INVESTIGANDO', 603.5, C.red],
	['D', '❤️ JASON E LUCIA', 605.7, C.pink],
];
const Poll: React.FC<{start: number; dur: number}> = ({start, dur}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	return (
		<div style={{position: 'absolute', top: 90, left: 360, right: 360, opacity: out}}>
			<div style={{textAlign: 'center', opacity: s}}>
				<Pill bg={C.pink} size={34}>
					💬 O QUE MAIS TE SURPREENDEU? COMENTE A, B, C OU D
				</Pill>
			</div>
			<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 22}}>
				{POLL.map(([l, text, at, color]) => {
					const p = spring({frame: frame - f(at - start), fps: 30, config: {damping: 11, stiffness: 280}});
					return (
						<div key={l} style={{display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.96)', borderRadius: 18, padding: '14px 18px', opacity: frame >= f(at - start) ? p : 0, transform: `scale(${interpolate(p, [0, 1], [0.7, 1])})`, boxShadow: '0 14px 34px rgba(0,0,0,0.45)'}}>
							<div style={{width: 70, height: 70, borderRadius: 14, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
								<span style={{fontFamily: DISPLAY, fontSize: 52, color: 'white'}}>{l}</span>
							</div>
							<span style={{fontFamily: DISPLAY, fontSize: 46, color: C.ink, whiteSpace: 'nowrap'}}>{text}</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};

const EndCard: React.FC<{start: number; subAt: number}> = ({start, subAt}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 220);
	const b = useAt(start, subAt, 10, 300);
	const pressed = frame >= f(subAt - start) + 8;
	if (WATERMARK === null) return null;
	return (
		<AbsoluteFill style={{alignItems: 'center'}}>
			<div style={{position: 'absolute', top: 120, padding: 10, borderRadius: 50, background: GRAD, boxShadow: '0 0 70px rgba(255,62,154,0.7)', opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.7, 1])})`}}>
				<Img src={staticFile(WATERMARK)} style={{display: 'block', width: 420, height: 420, borderRadius: 42}} />
			</div>
			<div style={{position: 'absolute', top: 640, opacity: b, transform: `scale(${interpolate(b, [0, 1], [1.6, 1]) * (pressed ? 0.95 : 1)})`, display: 'flex', alignItems: 'center', gap: 18, background: pressed ? '#3a3a3a' : C.red, padding: '18px 44px', borderRadius: 60, boxShadow: '0 16px 40px rgba(0,0,0,0.6)'}}>
				<span style={{fontFamily: UI, fontWeight: 800, fontSize: 48, color: 'white', letterSpacing: 2}}>{pressed ? 'INSCRITO' : 'INSCREVA-SE'}</span>
				<svg width={48} height={48} viewBox="0 0 24 24">
					<path d="M12 22a2.5 2.5 0 002.5-2.5h-5A2.5 2.5 0 0012 22zm7-6V11a7 7 0 00-5.5-6.8V3.5a1.5 1.5 0 00-3 0v.7A7 7 0 005 11v5l-2 2v1h18v-1z" fill="white" />
				</svg>
			</div>
		</AbsoluteFill>
	);
};

// ------------------------------------------------------------------ timeline

export const EDGE_NEW = EDGE_IMGS;

export const EdgeOverlays: React.FC<{newSpans: [number, number][]}> = ({newSpans}) => (
	<AbsoluteFill>
		{newSpans.map(([a, b]) => (
			<At key={a} from={a} to={b}>
				<NewBadge />
			</At>
		))}
		<At from={0} to={5.6}>
			<Hook dur={5.6} />
		</At>
		<At from={15.5} to={18.2}>
			<Label text="TUBARÃO-MARTELO" dur={2.7} color={C.cyan} />
		</At>
		<At from={18.2} to={19.4}>
			<Label text="MOTOCICLISTAS" dur={1.2} />
		</At>
		<At from={19.4} to={20.3}>
			<Label text="PÂNTANOS" dur={0.9} color={GREEN} />
		</At>
		<At from={20.3} to={21.9}>
			<Label text="ÁREAS URBANAS" dur={1.6} color={C.orange} />
		</At>
		<At from={31.0} to={36.6}>
			<DemoCard start={31.0} dur={5.6} edgeAt={35.2} />
		</At>
		<At from={52.8} to={60.7}>
			<Chapter n={1} title="AS NOVAS IMAGENS" sub="LEONIDA MUITO ALÉM DE VICE CITY" dur={7.9} />
		</At>
		<At from={64.2} to={69.2}>
			<Mosaic dur={5.0} label="12 SCREENSHOTS NOVOS · EDGE 430 · 29/10" />
		</At>
		<At from={69.2} to={73.4}>
			<Label text="AEROBARCO NO PÂNTANO" dur={4.2} color={GREEN} />
		</At>
		<At from={73.4} to={77.0}>
			<Label text="ENCONTRO DE MOTOCICLISTAS" dur={3.6} />
		</At>
		<At from={77.0} to={86.2}>
			<ChipRow
				start={77.0}
				dur={9.2}
				items={[
					['🏘️ PEQUENAS ÁREAS URBANAS', 79.4, C.orange],
					['🏪 COMÉRCIOS', 80.8, C.purple],
					['🌄 LONGE DOS PRÉDIOS', 82.9, C.ink],
				]}
			/>
		</At>
		<At from={89.5} to={95.2}>
			<Label text="🦈 TUBARÃO-MARTELO ENTRE CORAIS" dur={5.7} color={C.cyan} />
		</At>
		<At from={105.3} to={118.6}>
			<ProveCard start={105.3} dur={13.3} noAt={105.7} yesAt={111.3} />
		</At>
		<At from={134.5} to={143.8}>
			<Label text="TATUAGEM AO AR LIVRE" dur={9.3} color={C.purple} />
		</At>
		<At from={159.5} to={169.5}>
			<Chapter n={2} title="OS NPCs" sub="O COMPORTAMENTO DOS PERSONAGENS" dur={10} />
		</At>
		<At from={169.5} to={182.5}>
			<BigStat start={169.5} dur={13} at={174.3} />
		</At>
		<At from={182.5} to={191.9}>
			<ChipRow
				start={182.5}
				dur={9.4}
				title="PERSONALIDADE DOS PEDESTRES"
				items={[
					['😐 TEMPERAMENTO', 187.2, C.purple],
					['😡 AGRESSIVIDADE', 188.4, C.red],
					['🎭 REAÇÕES DIFERENTES', 190.1, C.orange],
				]}
			/>
		</At>
		<At from={200.1} to={209.3}>
			<ChipRow
				start={200.1}
				dur={9.2}
				title="QUANDO COMEÇA UMA CONFUSÃO…"
				items={[
					['🏃 FOGE', 201.0, GREEN],
					['🗣️ DISCUTE', 203.9, C.orange],
					['👊 TE ENFRENTA', 207.8, C.red],
				]}
			/>
		</At>
		<At from={214.3} to={219.5}>
			<Label text="🐕 USA O CACHORRO PARA ATACAR" dur={5.2} color={C.red} />
		</At>
		<At from={246.6} to={256.2}>
			<Chapter n={3} title="A POLÍCIA INVESTIGA" sub="DE FUGA A INVESTIGAÇÃO" dur={9.6} />
		</At>
		<At from={256.2} to={264.9}>
			<Wanted dur={8.7} />
		</At>
		<At from={269.1} to={305.7}>
			<Profile start={269.1} dur={36.6} off={{ROUPA: 294.6, ARMA: 298.5, PARCEIRO: 301.6}} />
		</At>
		<At from={313.2} to={319.0}>
			<Label text="⚠️ FAIXA DE PREGOS" dur={5.8} color={C.red} />
		</At>
		<At from={320.2} to={324.4}>
			<Label text="🐕 UNIDADE K9 · PASTOR ALEMÃO" dur={4.2} color={C.red} />
		</At>
		<At from={341.5} to={349.0}>
			<Chapter n={4} title="OS CARROS" sub="COMBUSTÍVEL, RASTREADORES E APPS" dur={7.5} />
		</At>
		<At from={349.0} to={361.0}>
			<CarHud start={349.0} dur={12} fuelAt={350.8} engineAt={351.8} trackAt={355.3} />
		</At>
		<At from={361.0} to={383.0}>
			<PhoneApp dur={22} app="WAINK" color={C.red}>
				<AppRow start={361.0} at={364.2} title="Coupé esportivo" sub="Comprador procura este modelo" tag="RASTREADOR" />
				<AppRow start={361.0} at={368.5} title="SUV de luxo" sub="Segurança alta" tag="SEGURANÇA" tagColor={C.orange} />
				<AppRow start={361.0} at={374.4} title="Pagamento" sub="Depende da condição na entrega" tag="CONDIÇÃO = $$$" tagColor="#22A35A" />
			</PhoneApp>
		</At>
		<At from={383.0} to={395.9}>
			<PhoneApp dur={12.9} app="SCOOTER BROS" color={C.purple}>
				<AppRow start={383.0} at={387.7} title="Entregar meu carro" sub="Por uma taxa" />
				<AppRow start={383.0} at={391.5} title="🛵 Entregador a caminho" sub="Ele chega de scooter" tag="A CAMINHO" tagColor="#22A35A" />
				<AppRow start={383.0} at={393.5} title="🔫 Armas no porta-malas" sub="Ficam guardadas no carro" />
			</PhoneApp>
		</At>
		<At from={403.2} to={410.6}>
			<Chapter n={5} title="CLIMA E DIA/NOITE" sub="TEMPESTADES QUE SE MOVEM PELO MAPA" dur={7.4} />
		</At>
		<At from={410.6} to={426.5}>
			<ChipRow
				start={410.6}
				dur={15.9}
				items={[
					['🌬️ VENTO: NUVENS, ÁRVORES E ÁGUA', 411.1, C.cyan],
					['🌧️ SUPERFÍCIES MOLHADAS', 415.6, C.purple],
					['🌦️ CLIMA DIFERENTE POR REGIÃO', 420.4, C.orange],
					['✈️ AERONAVES NAS TEMPESTADES', 423.3, C.red],
				]}
			/>
		</At>
		<At from={430.6} to={437.0}>
			<Quote dur={6.4} who="SEGUNDO ROB NELSON" role="ROCKSTAR NORTH" text="O ritmo antigo fazia o mundo parecer rápido demais." />
		</At>
		<At from={437.6} to={447.4}>
			<Label text="🌅 PÔR DO SOL E NOITE MAIS LONGOS" dur={9.8} color={C.orange} />
		</At>
		<At from={447.4} to={452.8}>
			<Chapter n={6} title="INTERIORES" sub="LUGARES COM PERSONALIDADE" dur={5.4} />
		</At>
		<At from={452.8} to={460.4}>
			<Quote dur={7.6} who="SEGUNDO AARON GARBUT" role="ROCKSTAR NORTH" text="GTA 6 tem muito mais ambientes internos." />
		</At>
		<At from={475.2} to={484.3}>
			<Chapter n={7} title="A MÚSICA" sub="INFORMAÇÕES OFICIAIS DA ROCKSTAR" dur={9.1} />
		</At>
		<At from={486.6} to={491.9}>
			<Label text="💿 ÁLBUM OFICIAL · 34 FAIXAS" dur={5.3} color={C.pink} />
		</At>
		<At from={492.8} to={498.9}>
			<Label text="🎼 TRILHA ORIGINAL · JUSTICE" dur={6.1} color={C.purple} />
		</At>
		<At from={500.6} to={507.5}>
			<ChipRow
				start={500.6}
				dur={6.9}
				title="COLABORAÇÕES DIVULGADAS"
				items={[
					['GESAFFELSTEIN', 502.1, C.ink],
					['TAME IMPALA', 503.4, C.purple],
					['SZA', 504.6, C.pink],
					['KING GIZZARD & THE LIZARD WIZARD', 505.3, C.orange],
				]}
			/>
		</At>
		<At from={513.1} to={521.3}>
			<Label text="📻 AS RÁDIOS DE LEONIDA" dur={8.2} color={C.orange} />
		</At>
		<At from={528.6} to={538.6}>
			<Chapter n={8} title="O PADRÃO" sub="O QUE TUDO ISSO SIGNIFICA" dur={10} />
		</At>
		<At from={538.6} to={557.4}>
			<Checklist
				start={538.6}
				dur={18.8}
				rows={[
					['🚶', 'PERSONAGENS REAGEM AO AMBIENTE', 541.5],
					['🚨', 'A POLÍCIA REÚNE INFORMAÇÕES', 543.8],
					['❤️', 'PROTAGONISTAS COM RELACIONAMENTO', 545.9],
					['🚗', 'VEÍCULOS INFLUENCIAM A EXPLORAÇÃO', 550.4],
					['🌩️', 'O CLIMA MUDA O MUNDO', 554.2],
				]}
			/>
		</At>
		<At from={557.4} to={568.8}>
			<Label text="⚠️ NEM TUDO ESTÁ EXPLICADO AINDA" dur={11.4} color={C.orange} />
		</At>
		<At from={572.3} to={585.3}>
			<DateCard start={572.3} dur={13} at={575.3} />
		</At>
		<At from={593.2} to={612.4}>
			<Poll start={593.2} dur={19.2} />
		</At>
		<At from={612.4} to={621.6}>
			<EndCard start={612.4} subAt={616.1} />
		</At>
	</AbsoluteFill>
);
