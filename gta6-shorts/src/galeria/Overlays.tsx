import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {At, Chip, Stamp, useOut, useSpring} from '../components/Overlays';
import {ProOutro} from '../components/ProOutro';
import {C, DISPLAY, GRAD, SAFE, UI, f} from '../theme';

// Gráficos do Short "As 39 imagens novas de GTA 6". Ilustrações (não é a interface do jogo).
const GREEN = '#3DFF8A';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const useAt = (start: number, at: number, damping = 12, stiffness = 260) => useSpring(at - start, damping, stiffness);

/** Gancho: "39" contando + IMAGENS NOVAS */
const Hook: React.FC<{dur: number; countTo: number; wordAt: number}> = ({dur, countTo, wordAt}) => {
	const frame = useCurrentFrame();
	const t = frame / 30;
	const k = interpolate(t, [0.15, countTo], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const s = useSpring(0.1, 11, 280);
	const w = useSpring(wordAt, 10, 300);
	const out = useOut(dur, 4);
	const pulse = t > countTo ? 1 + 0.04 * Math.sin(frame / 2.5) : 1;
	return (
		<AbsoluteFill style={{alignItems: 'center', top: 360, opacity: out}}>
			<div style={{fontFamily: DISPLAY, fontSize: 360, lineHeight: 0.95, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 12px 0 #000)', opacity: s, transform: `scale(${interpolate(s, [0, 1], [1.8, 1]) * pulse})`, fontVariantNumeric: 'tabular-nums'}}>{Math.round(39 * k)}</div>
			<div style={{fontFamily: DISPLAY, fontSize: 110, color: 'white', textShadow: '0 7px 0 #000', opacity: w, transform: `translateY(${(1 - w) * 40}px)`}}>IMAGENS NOVAS</div>
			<div style={{marginTop: 8, opacity: w}}>
				<Chip bg={C.red} size={36}>
					📸 OFICIAIS · ROCKSTAR GAMES
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

/** Cartão da galeria oficial */
const Gallery: React.FC<{start: number; dur: number; daysAt: number}> = ({start, dur, daysAt}) => {
	const s = useSpring(0.1, 13, 240);
	const d = useAt(start, daysAt, 10, 300);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 390, left: SAFE.left, right: 140, background: 'rgba(11,6,18,0.9)', borderRadius: 26, padding: '26px 30px', border: '3px solid rgba(255,255,255,0.18)', boxShadow: '0 24px 60px rgba(0,0,0,0.6)', opacity: s, transform: `translateY(${(1 - s) * 120}px)`}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
					<div style={{width: 18, height: 18, borderRadius: 9, background: GREEN, boxShadow: `0 0 16px ${GREEN}`}} />
					<span style={{fontFamily: UI, fontWeight: 800, fontSize: 28, color: GREEN, letterSpacing: 4}}>SITE OFICIAL · 05/11/2026</span>
				</div>
				<div style={{fontFamily: DISPLAY, fontSize: 104, lineHeight: 1, marginTop: 12, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent'}}>LAUNCH GALLERY</div>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 32, color: 'white', marginTop: 6, letterSpacing: 3}}>A GALERIA DE LANÇAMENTO</div>
				<div style={{marginTop: 18, opacity: d, transform: `scale(${interpolate(d, [0, 1], [1.5, 1])})`, transformOrigin: 'left center'}}>
					<Chip bg={C.yellow} color={C.ink} size={38}>
						⏳ 14 DIAS ANTES DA ESTREIA
					</Chip>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Lupa varrendo a tela */
const Scanner: React.FC<{start: number; dur: number; tagAt: number}> = ({start, dur, tagAt}) => {
	const frame = useCurrentFrame();
	const t = frame / 30;
	const tag = useAt(start, tagAt, 10, 300);
	const out = useOut(dur);
	const x = 540 + Math.sin(t * 2.2) * 300;
	const y = 760 + Math.cos(t * 1.7) * 180;
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', left: x - 130, top: y - 130, width: 260, height: 260, borderRadius: 130, border: '12px solid white', boxShadow: '0 0 0 6px rgba(0,0,0,0.5), 0 0 60px rgba(255,216,74,0.6)', background: 'rgba(255,255,255,0.06)'}}>
				<div style={{position: 'absolute', left: 205, top: 205, width: 30, height: 150, background: 'white', borderRadius: 15, transform: 'rotate(-45deg)', transformOrigin: '15px 0'}} />
			</div>
			<AbsoluteFill style={{alignItems: 'center', top: 380}}>
				<div style={{opacity: tag, transform: `scale(${interpolate(tag, [0, 1], [1.6, 1])})`}}>
					<Chip bg={C.pink} size={50}>
						🔍 DETALHES ESCONDIDOS
					</Chip>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

/** "DETALHE #n" + itens que surgem conforme a fala */
const Detail: React.FC<{start: number; dur: number; n: number; items: {t: string; at: number; c?: string}[]}> = ({start, dur, n, items}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 11, 300);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 360, left: SAFE.left, opacity: s, transform: `translateX(${(1 - s) * -200}px)`}}>
				<div style={{display: 'inline-flex', alignItems: 'baseline', gap: 12, background: C.ink, padding: '8px 22px 2px', borderRadius: 14, border: `4px solid ${C.yellow}`}}>
					<span style={{fontFamily: UI, fontWeight: 800, fontSize: 30, color: C.yellow, letterSpacing: 4}}>DETALHE</span>
					<span style={{fontFamily: DISPLAY, fontSize: 76, color: 'white'}}>#{n}</span>
				</div>
				<div style={{marginTop: 14}}>
					{items.map((it, i) => {
						const p = spring({frame: frame - f(it.at - start), fps: 30, config: {damping: 11, stiffness: 300}});
						if (frame < f(it.at - start)) return null;
						return (
							<div key={i} style={{margin: '10px 0', opacity: p, transform: `translateX(${(1 - p) * 160}px)`}}>
								<Chip bg={it.c ?? C.pink} size={42}>
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

/** Mira no olho vermelho do jacaré */
const Reticle: React.FC<{dur: number; x: number; y: number}> = ({dur, x, y}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 9, 320);
	const out = useOut(dur);
	const r = 150 + 12 * Math.sin(frame / 3);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<AbsoluteFill style={{background: `radial-gradient(circle at ${x}px ${y}px, rgba(0,0,0,0) 160px, rgba(0,0,0,0.55) 360px)`, opacity: s}} />
			<div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r, border: `9px solid ${C.red}`, boxShadow: `0 0 40px ${C.red}`, transform: `scale(${interpolate(s, [0, 1], [2.4, 1])})`, opacity: s}} />
			<div style={{position: 'absolute', left: x - 240, top: y - 6, width: 480, height: 12, background: `linear-gradient(90deg, ${C.red}, rgba(255,45,61,0) 30%, rgba(255,45,61,0) 70%, ${C.red})`, opacity: s}} />
			<div style={{position: 'absolute', top: 380, left: 0, right: 0, textAlign: 'center', opacity: s}}>
				<Chip bg={C.red} size={52}>
					👁️ OLHO VERMELHO
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

/** 10/11 pré-download -> 19/11 lançamento */
const Dates: React.FC<{start: number; dur: number; preAt: number; launchAt: number}> = ({start, dur, preAt, launchAt}) => {
	const frame = useCurrentFrame();
	const a = useAt(start, preAt - 0.2, 10, 300);
	const b = useAt(start, launchAt - 0.2, 10, 300);
	const out = useOut(dur);
	const card = (k: number, day: string, label: string, color: string) => (
		<div style={{flex: 1, background: 'rgba(11,6,18,0.9)', borderRadius: 24, padding: '20px 10px 24px', textAlign: 'center', border: `5px solid ${color}`, opacity: k, transform: `scale(${interpolate(k, [0, 1], [1.6, 1])})`, boxShadow: `0 0 40px ${color}55`}}>
			<div style={{fontFamily: DISPLAY, fontSize: 130, lineHeight: 1, color}}>{day}</div>
			<div style={{fontFamily: UI, fontWeight: 800, fontSize: 28, color: 'white', letterSpacing: 2, marginTop: 6}}>NOVEMBRO</div>
			<div style={{marginTop: 12}}>
				<Chip bg={color} color={C.ink} size={28}>
					{label}
				</Chip>
			</div>
		</div>
	);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 400, left: SAFE.left, right: SAFE.left, display: 'flex', gap: 20, alignItems: 'center'}}>
				{card(a, '10', '💾 PRÉ-DOWNLOAD', C.cyan)}
				<span style={{fontFamily: DISPLAY, fontSize: 90, color: C.yellow, opacity: b, transform: `translateX(${Math.sin(frame / 4) * 6}px)`}}>➜</span>
				{card(b, '19', '🎮 LANÇAMENTO', C.pink)}
			</div>
		</AbsoluteFill>
	);
};

/** Enquete com miniaturas: qual imagem deixou mais curioso? */
const Poll: React.FC<{start: number}> = ({start}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 260);
	const opts = [
		{l: 'A', t: 'CONVERSÍVEL', src: 'Jason_and_Lucia_19', pos: '82% 40%'},
		{l: 'B', t: 'BANCO', src: 'Jason_and_Lucia_15', pos: '30% 40%'},
		{l: 'C', t: 'MOTO', src: 'Jason_Duval_11', pos: '60% 35%'},
		{l: 'D', t: 'JACARÉ', src: 'Grassrivers_08', pos: '44% 67%'},
	];
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', top: 330, left: 60, right: 60, opacity: s}}>
				<div style={{textAlign: 'center', fontFamily: DISPLAY, fontSize: 70, color: 'white', textShadow: '0 6px 0 #000', lineHeight: 1.05}}>QUAL TE DEIXOU MAIS CURIOSO?</div>
				<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 20}}>
					{opts.map((o, i) => {
						const p = spring({frame: frame - f(0.25 + i * 0.22), fps: 30, config: {damping: 11, stiffness: 300}});
						return (
							<div key={o.l} style={{position: 'relative', height: 250, borderRadius: 20, overflow: 'hidden', border: '5px solid white', boxShadow: '0 14px 30px rgba(0,0,0,0.5)', opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.6, 1])})`}}>
								<Img src={staticFile(`v16/${o.src}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: o.pos, transform: 'scale(1.6)', transformOrigin: o.pos}} />
								<div style={{position: 'absolute', left: 12, top: 12, width: 66, height: 66, borderRadius: 14, background: [C.cyan, C.purple, C.orange, C.red][i], display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
									<span style={{fontFamily: DISPLAY, fontSize: 52, color: 'white'}}>{o.l}</span>
								</div>
								<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: '6px 0', background: 'rgba(11,6,18,0.82)', textAlign: 'center', fontFamily: DISPLAY, fontSize: 40, color: 'white'}}>{o.t}</div>
							</div>
						);
					})}
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ------------------------------------------------------------------ timeline

export const GaleriaOverlays: React.FC = () => (
	<AbsoluteFill>
		<At from={0} to={3.7}>
			<Hook dur={3.7} countTo={1.75} wordAt={2.4} />
		</At>
		<At from={6.1} to={7.7}>
			<Stamp text="NUNCA VISTO" sub="ATÉ AGORA" top={500} color={C.yellow} />
		</At>
		<At from={7.7} to={12.5}>
			<Gallery start={7.7} dur={4.8} daysAt={10.9} />
		</At>
		<At from={12.5} to={15.4}>
			<Scanner start={12.5} dur={2.9} tagAt={13.5} />
		</At>
		<At from={15.4} to={22.0}>
			<Detail
				start={15.4}
				dur={6.6}
				n={1}
				items={[
					{t: '🔫 LUCIA ATIRANDO', at: 16.5},
					{t: '🚚 CARRO-FORTE', at: 19.2, c: C.purple},
					{t: '🚓 POLÍCIA ATRÁS', at: 20.25, c: C.red},
				]}
			/>
		</At>
		<At from={22.0} to={26.9}>
			<Detail
				start={22.0}
				dur={4.9}
				n={2}
				items={[
					{t: '🎭 MASCARADOS', at: 23.6},
					{t: '🏦 DENTRO DE UM BANCO', at: 24.95, c: C.purple},
					{t: '🙌 REFÉNS', at: 25.6, c: C.red},
				]}
			/>
		</At>
		<At from={26.9} to={31.0}>
			<Detail
				start={26.9}
				dur={4.1}
				n={3}
				items={[
					{t: '🏍️ FUGA DE MOTO', at: 27.84},
					{t: '🚨 VIATURAS COLADAS', at: 29.18, c: C.red},
				]}
			/>
		</At>
		<At from={31.0} to={38.2}>
			<Detail
				start={31.0}
				dur={7.2}
				n={4}
				items={[
					{t: '🏋️ JASON MALHANDO', at: 32.16},
					{t: '🪩 BALADA LOTADA', at: 33.58, c: C.purple},
					{t: '🤿 FUNDO DO MAR', at: 35.78, c: C.cyan},
				]}
			/>
		</At>
		<At from={38.2} to={40.6}>
			<Stamp text="⚠️ ASSUSTADORA" top={520} color={C.red} />
		</At>
		<At from={40.6} to={45.0}>
			<Detail start={40.6} dur={4.4} n={5} items={[{t: '🌙 PÂNTANO À NOITE', at: 41.54, c: C.purple}, {t: '🐊 JACARÉ ENORME', at: 43.72, c: C.red}]} />
		</At>
		<At from={45.0} to={48.1}>
			<Reticle dur={3.1} x={500} y={1360} />
		</At>
		<At from={48.6} to={50.0}>
			<AbsoluteFill style={{alignItems: 'center', top: 470}}>
				<Chip bg={C.yellow} color={C.ink} size={46}>
					⏱️ NÃO É POR ACASO
				</Chip>
			</AbsoluteFill>
		</At>
		<At from={50.0} to={55.6}>
			<Dates start={50.0} dur={5.6} preAt={51.6} launchAt={54.16} />
		</At>
		<At from={55.6} to={58.4}>
			<Poll start={55.6} />
		</At>
		<At from={58.4} to={65.0}>
			<ProOutro subAt={1.6} tagline="INVESTIGANDO CADA DETALHE DE GTA 6" />
		</At>
	</AbsoluteFill>
);
