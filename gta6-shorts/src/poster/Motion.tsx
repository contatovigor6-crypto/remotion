import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame} from 'remotion';
import {At} from '../components/Overlays';
import {ProOutro} from '../components/ProOutro';
import {C, DISPLAY, UI, f} from '../theme';

// "Pôster de GTA 6" em MOTION DESIGN: um cenário diferente por cena + objetos animados.
// Única imagem do jogo: a capa oficial (que é exatamente o pôster de que o vídeo fala). O mapa desenhado é ILUSTRAÇÃO, não o mapa oficial.

const PINK = '#FF3E9A';
const CYAN = '#38E1FF';
const YEL = '#FFD84A';
const GREEN = '#3DFF8A';
const GRADT = `linear-gradient(180deg, ${YEL} 0%, #FF9A3C 45%, ${PINK} 100%)`;
const fr = () => useCurrentFrame();
const sp = (frame: number, at: number, d = 12, s = 260) => spring({frame: frame - f(at), fps: 30, config: {damping: d, stiffness: s}});
const lerp = (frame: number, a: number, b: number, o0: number, o1: number, ease = Easing.out(Easing.cubic)) => interpolate(frame, [f(a), f(b)], [o0, o1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

const Big: React.FC<{size: number; children: React.ReactNode; grad?: boolean; style?: React.CSSProperties}> = ({size, children, grad, style}) =>
	grad ? (
		<span style={{fontFamily: DISPLAY, fontSize: size, lineHeight: 1, backgroundImage: GRADT, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 8px 0 #000)', ...style}}>{children}</span>
	) : (
		<span style={{fontFamily: DISPLAY, fontSize: size, lineHeight: 1, color: 'white', textShadow: '0 8px 0 #000', ...style}}>{children}</span>
	);
const Pill: React.FC<{bg: string; color?: string; size?: number; children: React.ReactNode}> = ({bg, color = 'white', size = 40, children}) => (
	<span style={{display: 'inline-block', background: bg, color, fontFamily: UI, fontWeight: 800, fontSize: size, padding: `${size * 0.25}px ${size * 0.6}px`, borderRadius: size * 0.5, boxShadow: '0 10px 0 rgba(0,0,0,0.55)', whiteSpace: 'nowrap'}}>{children}</span>
);
const Stamp: React.FC<{text: string; color: string; at: number; top: number; rot?: number}> = ({text, color, at, top, rot = -10}) => {
	const frame = fr();
	const s = sp(frame, at, 9, 340);
	if (frame < f(at)) return null;
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top, textAlign: 'center'}}>
			<span style={{display: 'inline-block', fontFamily: DISPLAY, fontSize: 130, color, border: `12px solid ${color}`, borderRadius: 24, padding: '4px 40px 0', transform: `rotate(${rot}deg) scale(${interpolate(s, [0, 1], [2.6, 1])})`, opacity: interpolate(s, [0, 0.2], [0, 1], {extrapolateRight: 'clamp'}), background: 'rgba(0,0,0,0.35)'}}>{text}</span>
		</div>
	);
};

/* ---------------------------------------------------------------- mapa ilustrativo (península estilizada, NÃO é o mapa oficial) */
const MapArt: React.FC<{w: number; h: number; fog?: number}> = ({w, h, fog = 0}) => {
	const frame = fr();
	return (
		<div style={{position: 'relative', width: w, height: h, borderRadius: 18, overflow: 'hidden', background: 'linear-gradient(160deg, #1b6fa8, #0f4c7a)', boxShadow: '0 30px 60px rgba(0,0,0,0.55)', border: '8px solid #f4ead2'}}>
			<svg width={w} height={h} viewBox="0 0 100 130" preserveAspectRatio="none" style={{position: 'absolute', inset: 0}}>
				<path d="M10 0 L70 0 L72 10 L66 22 L70 34 L64 46 L68 58 L62 72 L66 86 L58 100 L54 112 L46 122 L40 116 L44 104 L38 92 L42 80 L34 66 L38 52 L30 40 L34 26 L22 18 L12 10 Z" fill="#e8d9a8" stroke="#c9b37a" strokeWidth={0.8} />
				<path d="M30 40 L38 52 L34 66 L42 80" stroke="#7fbf6a" strokeWidth={6} fill="none" opacity={0.6} />
				{[[58, 108], [62, 112], [66, 116], [70, 118]].map(([x, y], i) => (
					<circle key={i} cx={x} cy={y} r={1.6} fill="#e8d9a8" />
				))}
				<path d="M20 12 L60 50 L48 96" stroke="#c0392b" strokeWidth={1} strokeDasharray="2 2" fill="none" />
				{[[52, 30], [44, 62], [56, 94]].map(([x, y], i) => (
					<g key={i}>
						<circle cx={x} cy={y} r={2.4} fill={PINK} />
						<circle cx={x} cy={y} r={2.4 + ((frame / 6 + i * 3) % 6)} fill="none" stroke={PINK} strokeWidth={0.6} opacity={1 - ((frame / 6 + i * 3) % 6) / 6} />
					</g>
				))}
			</svg>
			<div style={{position: 'absolute', left: 14, top: 10, fontFamily: DISPLAY, fontSize: w * 0.09, color: '#f4ead2', letterSpacing: 4, textShadow: '0 3px 0 rgba(0,0,0,0.4)'}}>LEONIDA</div>
			<div style={{position: 'absolute', right: 10, bottom: 8, fontFamily: UI, fontWeight: 800, fontSize: w * 0.032, color: 'rgba(255,255,255,0.85)', background: 'rgba(0,0,0,0.45)', padding: '3px 8px', borderRadius: 6}}>ILUSTRAÇÃO</div>
			{fog > 0 ? (
				<div style={{position: 'absolute', inset: 0}}>
					{Array.from({length: 10}).map((_, i) => (
						<div key={i} style={{position: 'absolute', left: (random(`fx${i}`) * w) - 120 + Math.sin(frame / 25 + i) * 40, top: random(`fy${i}`) * h - 120, width: 320, height: 320, borderRadius: 160, background: 'rgba(220,225,235,0.9)', filter: 'blur(40px)', opacity: fog}} />
					))}
				</div>
			) : null}
		</div>
	);
};

/* ---------------------------------------------------------------- fundos (um por cena) */
const BgOcean: React.FC = () => {
	const frame = fr();
	return (
		<AbsoluteFill style={{background: 'linear-gradient(180deg, #04223f 0%, #0a4f7f 60%, #0e6aa0 100%)', overflow: 'hidden'}}>
			<AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.08) 2px, transparent 2px)', backgroundSize: '120px 120px'}} />
			{Array.from({length: 14}).map((_, i) => (
				<svg key={i} width={1400} height={40} style={{position: 'absolute', left: -200 + ((frame * (1 + i % 3)) % 200), top: 150 + i * 130, opacity: 0.25}}>
					<path d={`M0 20 ${Array.from({length: 28}).map((__, k) => `Q ${k * 50 + 25} ${k % 2 ? 0 : 40} ${k * 50 + 50} 20`).join(' ')}`} stroke="white" strokeWidth={3} fill="none" />
				</svg>
			))}
			<svg width={260} height={260} style={{position: 'absolute', right: 40, bottom: 120, opacity: 0.45, transform: `rotate(${Math.sin(frame / 40) * 8}deg)`}} viewBox="-50 -50 100 100">
				<circle r={44} fill="none" stroke="white" strokeWidth={2} />
				<path d="M0 -42 L8 0 L0 42 L-8 0 Z" fill="white" />
				<text y={-30} textAnchor="middle" fill="white" fontSize={10} fontFamily="Inter" fontWeight={800}>N</text>
			</svg>
		</AbsoluteFill>
	);
};
const BgDesk: React.FC = () => (
	<AbsoluteFill style={{background: 'repeating-linear-gradient(90deg, #5a3a22 0px, #6b4529 60px, #5f3e25 120px)', overflow: 'hidden'}}>
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 35%, rgba(255,230,180,0.35), rgba(0,0,0,0.65) 75%)'}} />
		<div style={{position: 'absolute', left: -60, top: 1450, width: 420, height: 300, background: '#f4f1ea', transform: 'rotate(-12deg)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}} />
		<div style={{position: 'absolute', right: -40, top: 1560, width: 360, height: 260, background: '#fffdf5', transform: 'rotate(9deg)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}} />
		<div style={{position: 'absolute', left: 820, top: 180, width: 160, height: 160, borderRadius: 80, border: '14px solid rgba(80,40,20,0.35)'}} />
	</AbsoluteFill>
);
const BgPrint: React.FC = () => {
	const frame = fr();
	return (
		<AbsoluteFill style={{background: '#f7f7f2', overflow: 'hidden'}}>
			{[CYAN, PINK, YEL, '#111'].map((c, i) => (
				<div key={i} style={{position: 'absolute', left: [-200, 600, 100, 700][i], top: [200, 300, 1300, 1450][i], width: 600, height: 600, borderRadius: 300, background: c, opacity: 0.22, filter: 'blur(30px)', transform: `scale(${1 + 0.05 * Math.sin(frame / 20 + i)})`}} />
			))}
			<AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(0,0,0,0.12) 2px, transparent 2px)', backgroundSize: '22px 22px'}} />
		</AbsoluteFill>
	);
};
const BgStore: React.FC = () => {
	const frame = fr();
	return (
		<AbsoluteFill style={{background: 'linear-gradient(180deg, #120018 0%, #2b0a3d 100%)', overflow: 'hidden'}}>
			{Array.from({length: 6}).map((_, i) => (
				<div key={i} style={{position: 'absolute', left: 40, right: 40, top: 300 + i * 260, height: 18, background: '#3d1655', boxShadow: '0 6px 0 #1a0526'}}>
					{Array.from({length: 7}).map((__, k) => (
						<div key={k} style={{position: 'absolute', left: 20 + k * 140, bottom: 18, width: 90, height: 130 + ((k * 7 + i * 3) % 4) * 20, background: [PINK, CYAN, YEL, '#7B3CFF'][(k + i) % 4], opacity: 0.35, borderRadius: 8}} />
					))}
				</div>
			))}
			<div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontFamily: DISPLAY, fontSize: 70, color: PINK, textShadow: `0 0 20px ${PINK}, 0 0 40px ${PINK}`, opacity: 0.6 + 0.4 * (Math.floor(frame / 8) % 2)}}>STORE</div>
		</AbsoluteFill>
	);
};
const BgParty: React.FC = () => {
	const frame = fr();
	return (
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #ff4fa3 0%, #8a1060 70%)', overflow: 'hidden'}}>
			{Array.from({length: 80}).map((_, i) => {
				const x = random(`cx${i}`) * 1080;
				const y = (random(`cy${i}`) * 2000 + frame * (8 + random(`cv${i}`) * 10)) % 2000 - 60;
				return <div key={i} style={{position: 'absolute', left: x, top: y, width: 16, height: 30, background: [YEL, CYAN, 'white', GREEN][i % 4], transform: `rotate(${frame * 8 + i * 40}deg)`, opacity: 0.85}} />;
			})}
		</AbsoluteFill>
	);
};
const BgFog: React.FC = () => {
	const frame = fr();
	return (
		<AbsoluteFill style={{background: 'linear-gradient(180deg, #0c0f17 0%, #1d2433 100%)', overflow: 'hidden'}}>
			{Array.from({length: 8}).map((_, i) => (
				<div key={i} style={{position: 'absolute', left: ((frame * (0.6 + i * 0.2) + i * 300) % 1800) - 600, top: 200 + i * 220, width: 900, height: 260, borderRadius: 130, background: 'rgba(180,190,210,0.12)', filter: 'blur(30px)'}} />
			))}
		</AbsoluteFill>
	);
};
const BgSpot: React.FC = () => {
	const frame = fr();
	return (
		<AbsoluteFill style={{background: '#050308', overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: 540 - 500 + Math.sin(frame / 30) * 60, top: -200, width: 1000, height: 1700, background: 'linear-gradient(180deg, rgba(255,240,200,0.32), rgba(255,240,200,0))', clipPath: 'polygon(42% 0, 58% 0, 100% 100%, 0 100%)'}} />
			<div style={{position: 'absolute', left: 140, right: 140, top: 1320, height: 140, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,240,200,0.35), rgba(0,0,0,0) 70%)'}} />
		</AbsoluteFill>
	);
};
const BgSpace: React.FC = () => {
	const frame = fr();
	return (
		<AbsoluteFill style={{background: '#02030a', overflow: 'hidden'}}>
			{Array.from({length: 120}).map((_, i) => (
				<div key={i} style={{position: 'absolute', left: random(`sx${i}`) * 1080, top: random(`sy${i}`) * 1300, width: 3, height: 3, borderRadius: 2, background: 'white', opacity: 0.3 + 0.7 * Math.abs(Math.sin(frame / 14 + i))}} />
			))}
			<div style={{position: 'absolute', left: -600, top: 1350, width: 2280, height: 2280, borderRadius: '50%', background: 'radial-gradient(circle at 50% 10%, #2f8fd8 0%, #0d3b6e 30%, #041528 60%)', boxShadow: '0 -20px 80px rgba(80,170,255,0.5)'}} />
		</AbsoluteFill>
	);
};
const BgBrick: React.FC = () => (
	<AbsoluteFill style={{background: '#7a2f22', overflow: 'hidden'}}>
		<AbsoluteFill style={{backgroundImage: 'linear-gradient(#5c2016 6px, transparent 6px), linear-gradient(90deg, #5c2016 6px, transparent 6px)', backgroundSize: '160px 80px', opacity: 0.9}} />
		<AbsoluteFill style={{backgroundImage: 'linear-gradient(90deg, #5c2016 6px, transparent 6px)', backgroundSize: '160px 80px', backgroundPosition: '80px 40px', maskImage: 'repeating-linear-gradient(180deg, transparent 0 40px, #000 40px 80px)', WebkitMaskImage: 'repeating-linear-gradient(180deg, transparent 0 40px, #000 40px 80px)'}} />
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 35%, rgba(255,220,180,0.25), rgba(0,0,0,0.6) 80%)'}} />
	</AbsoluteFill>
);

/* ---------------------------------------------------------------- cenas */
// 1) 0–4.4  mapa dobrado se abrindo + GRÁTIS
const S1: React.FC = () => {
	const frame = fr();
	const open = lerp(frame, 0.3, 1.6, 0, 1, Easing.inOut(Easing.cubic));
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', opacity: sp(frame, 0)}}>
				<Big size={100}>O MAPA DE GTA 6</Big>
			</div>
			<div style={{position: 'absolute', left: 540 - 300, top: 470, width: 600, height: 780, perspective: 1600}}>
				<div style={{position: 'absolute', inset: 0, display: 'flex'}}>
					{[0, 1, 2].map((i) => {
						const angle = i === 1 ? 0 : (1 - open) * (i === 0 ? 92 : -92);
						return (
							<div key={i} style={{width: 200, height: 780, overflow: 'hidden', transformOrigin: i === 0 ? '100% 50%' : '0% 50%', transform: `rotateY(${angle}deg)`, filter: `brightness(${0.75 + open * 0.25})`}}>
								<div style={{marginLeft: -i * 200}}>
									<MapArt w={600} h={780} />
								</div>
							</div>
						);
					})}
				</div>
			</div>
			<Stamp text="GRÁTIS" color={GREEN} at={3.6} top={1300} />
		</AbsoluteFill>
	);
};

// 2) 4.4–11.0  navegador com 2 downloads + 19/11
const S2: React.FC = () => {
	const frame = fr();
	const t = 4.4 + frame / 30;
	const s = sp(frame, 0.1, 13, 240);
	const dl = (a: number) => interpolate(t, [a, a + 1.5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const row = (label: string, a: number, icon: string) => {
		const k = dl(a);
		return (
			<div style={{display: 'flex', alignItems: 'center', gap: 18, background: '#f3f3f6', borderRadius: 16, padding: '18px 20px', marginTop: 16}}>
				<span style={{fontSize: 54}}>{icon}</span>
				<div style={{flex: 1}}>
					<div style={{fontFamily: UI, fontWeight: 800, fontSize: 34, color: C.ink}}>{label}</div>
					<div style={{height: 16, borderRadius: 8, background: '#dcdce4', marginTop: 8, overflow: 'hidden'}}>
						<div style={{width: `${k * 100}%`, height: '100%', background: k >= 1 ? GREEN : CYAN}} />
					</div>
				</div>
				<span style={{fontFamily: UI, fontWeight: 800, fontSize: 30, color: k >= 1 ? '#13a35a' : '#666'}}>{k >= 1 ? '✓' : `${Math.round(k * 100)}%`}</span>
			</div>
		);
	};
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', opacity: sp(frame, 0.5 - 0)}}>
				<Pill bg={C.red} size={46}>
					📅 19 DE NOVEMBRO
				</Pill>
			</div>
			<div style={{position: 'absolute', left: 70, right: 70, top: 470, background: 'white', borderRadius: 26, overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,0.55)', opacity: s, transform: `translateY(${(1 - s) * 140}px) rotate(-1.5deg)`}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', background: '#e7e7ee'}}>
					{['#ff5f57', '#febc2e', '#28c840'].map((c) => (
						<div key={c} style={{width: 18, height: 18, borderRadius: 9, background: c}} />
					))}
					<div style={{flex: 1, marginLeft: 14, background: 'white', borderRadius: 10, padding: '8px 14px', fontFamily: UI, fontWeight: 700, fontSize: 26, color: '#444'}}>🔒 site oficial de GTA VI</div>
				</div>
				<div style={{padding: '10px 24px 28px'}}>
					{row('pôster_capa.pdf', 8.6, '🖼️')}
					{row('mapa_leonida.pdf', 9.4, '🗺️')}
				</div>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1320, display: 'flex', justifyContent: 'center', gap: 20}}>
				<div style={{opacity: sp(frame, 10.0 - 4.4), transform: `scale(${interpolate(sp(frame, 10.0 - 4.4), [0, 1], [1.6, 1])})`}}>
					<Pill bg={CYAN} color={C.ink} size={42}>
						⬇️ BAIXAR
					</Pill>
				</div>
				<div style={{opacity: sp(frame, 10.5 - 4.4), transform: `scale(${interpolate(sp(frame, 10.5 - 4.4), [0, 1], [1.6, 1])})`}}>
					<Pill bg={PINK} size={42}>
						🖨️ IMPRIMIR
					</Pill>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// 3) 11.0–14.3  impressora soltando o pôster (capa oficial) e o mapa
const S3: React.FC = () => {
	const frame = fr();
	const p1 = lerp(frame, 0.2, 1.4, 0, 1);
	const p2 = lerp(frame, 2.0, 3.2, 0, 1);
	return (
		<AbsoluteFill>
			{/* papéis saindo */}
			<div style={{position: 'absolute', left: 140, top: 580, width: 360, height: 440, overflow: 'hidden'}}>
				<div style={{position: 'absolute', left: 0, top: -440 + p1 * 440, width: 360, height: 440, background: 'white', padding: 14, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', transform: `rotate(${(1 - p1) * 0 - 3}deg)`}}>
					<Img src={staticFile('v23/capa-oficial.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 50%'}} />
				</div>
			</div>
			<div style={{position: 'absolute', left: 580, top: 580, width: 360, height: 440, overflow: 'hidden'}}>
				<div style={{position: 'absolute', left: 0, top: -440 + p2 * 440}}>
					<MapArt w={360} h={440} />
				</div>
			</div>
			{/* impressora */}
			<div style={{position: 'absolute', left: 60, right: 60, top: 400, height: 190, borderRadius: 30, background: 'linear-gradient(180deg, #2b2b33, #15151a)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'}}>
				<div style={{position: 'absolute', left: 60, right: 60, bottom: 26, height: 16, borderRadius: 8, background: '#000'}} />
				<div style={{position: 'absolute', right: 40, top: 30, width: 24, height: 24, borderRadius: 12, background: Math.floor(frame / 6) % 2 ? GREEN : '#0a4'}} />
				<div style={{position: 'absolute', left: 40, top: 30, fontFamily: UI, fontWeight: 800, fontSize: 30, color: 'rgba(255,255,255,0.8)'}}>IMPRIMINDO…</div>
			</div>
			<div style={{position: 'absolute', left: 120, top: 1300, width: 400, textAlign: 'center', opacity: p1}}>
				<Pill bg={C.ink} size={34}>
					🖼️ PÔSTER (CAPA)
				</Pill>
			</div>
			<div style={{position: 'absolute', left: 560, top: 1300, width: 400, textAlign: 'center', opacity: p2}}>
				<Pill bg={C.ink} size={34}>
					🗺️ MAPA DE LEONIDA
				</Pill>
			</div>
		</AbsoluteFill>
	);
};

// 4) 14.3–22.1  pôster físico dupla face girando + etiqueta US$ 0,99
const S4: React.FC = () => {
	const frame = fr();
	const rot = interpolate(frame, [f(1.0), f(6.5)], [0, 540], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
	const tag = sp(frame, 20.3 - 14.3, 8, 300);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 320, textAlign: 'center', opacity: sp(frame, 0)}}>
				<Big size={88}>PÔSTER FÍSICO</Big>
				<div style={{marginTop: 10}}>
					<Pill bg={PINK} size={36}>
						🔄 DUPLA FACE · LOJA DA ROCKSTAR
					</Pill>
				</div>
			</div>
			<div style={{position: 'absolute', left: 540 - 175, top: 560, width: 350, height: 470, perspective: 1600}}>
				<div style={{position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', transform: `rotateY(${rot}deg)`}}>
					<div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden', background: 'white', padding: 14, boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}}>
						<Img src={staticFile('v23/capa-oficial.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
					</div>
					<div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)'}}>
						<MapArt w={350} h={470} />
					</div>
				</div>
			</div>
			<div style={{position: 'absolute', left: 600, top: 1280, transform: `rotate(${-14 + Math.sin(frame / 8) * 4}deg) scale(${interpolate(tag, [0, 1], [2.4, 1])})`, opacity: frame >= f(20.3 - 14.3) ? tag : 0}}>
				<div style={{background: YEL, borderRadius: 18, padding: '14px 26px', border: '6px solid #000', boxShadow: '0 12px 0 #000'}}>
					<div style={{fontFamily: UI, fontWeight: 800, fontSize: 26, color: C.ink}}>SÓ</div>
					<div style={{fontFamily: DISPLAY, fontSize: 96, color: C.ink, lineHeight: 1}}>US$ 0,99</div>
				</div>
			</div>
			<div style={{position: 'absolute', left: 60, top: 1320, opacity: sp(frame, 1.9)}}>
				<Pill bg={C.ink} size={32}>
					⏱️ LOGO APÓS O LANÇAMENTO
				</Pill>
			</div>
		</AbsoluteFill>
	);
};

// 5) 22.1–24.8  grátis com qualquer compra
const S5: React.FC = () => {
	const frame = fr();
	const s = sp(frame, 0.05, 9, 320);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 420, textAlign: 'center', opacity: s}}>
				<div style={{fontSize: 220, transform: `translateX(${Math.sin(frame / 4) * 20}px) scale(${interpolate(s, [0, 1], [0.4, 1])})`}}>🛒</div>
				<Big size={96}>QUALQUER COMPRA</Big>
				<div style={{fontFamily: DISPLAY, fontSize: 120, color: 'white', textShadow: '0 8px 0 #000'}}>=</div>
			</div>
			<Stamp text="PÔSTER GRÁTIS" color={YEL} at={0.6} top={1000} rot={-6} />
		</AbsoluteFill>
	);
};

// 6) 24.8–30.3  mistério: mapa com névoa — inteira ou só uma parte?
const S6: React.FC = () => {
	const frame = fr();
	const fog = lerp(frame, 0.4, 1.4, 0, 0.95);
	const q = sp(frame, 29.0 - 24.8, 10, 300);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', opacity: sp(frame, 0)}}>
				<Big size={110} grad>
					MAS TEM MISTÉRIO
				</Big>
			</div>
			<div style={{position: 'absolute', left: 540 - 200, top: 480, opacity: sp(frame, 0.2)}}>
				<MapArt w={400} h={540} fog={fog} />
				<div style={{position: 'absolute', left: 0, right: 0, top: 160, textAlign: 'center', fontFamily: DISPLAY, fontSize: 220, color: 'white', textShadow: '0 10px 0 #000', opacity: fog, transform: `scale(${1 + 0.05 * Math.sin(frame / 5)})`}}>?</div>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1300, textAlign: 'center', opacity: q, transform: `scale(${interpolate(q, [0, 1], [1.6, 1])})`}}>
				<Pill bg={C.ink} size={44}>
					🗺️ LEONIDA INTEIRA OU SÓ UMA PARTE?
				</Pill>
			</div>
		</AbsoluteFill>
	);
};

// 7) 30.3–35.5  caixa da edição física: código dentro… e o pôster?
const S7: React.FC = () => {
	const frame = fr();
	const lid = lerp(frame, 1.2, 2.2, 0, 1, Easing.inOut(Easing.cubic));
	const code = sp(frame, 2.4, 10, 300);
	const q = sp(frame, 4.3, 9, 320);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center'}}>
				<Big size={92}>EDIÇÃO FÍSICA</Big>
			</div>
			<div style={{position: 'absolute', left: 540 - 220, top: 520, width: 440, height: 520, perspective: 1400}}>
				{/* card do código saindo */}
				<div style={{position: 'absolute', left: 70, right: 70, top: interpolate(code, [0, 1], [180, -120]), height: 200, borderRadius: 18, background: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: code}}>
					<div style={{fontFamily: UI, fontWeight: 800, fontSize: 26, color: '#555'}}>CÓDIGO DE DOWNLOAD</div>
					<div style={{fontFamily: 'Courier New, monospace', fontWeight: 700, fontSize: 40, color: C.ink, marginTop: 6}}>XXXX-XXXX-XXXX</div>
				</div>
				<div style={{position: 'absolute', inset: 0, top: 120, borderRadius: 20, background: 'linear-gradient(160deg, #1f6fe0, #0b2e6b)', border: '6px solid #0a1d44', boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}}>
					<div style={{position: 'absolute', left: 0, right: 0, top: 140, textAlign: 'center', fontFamily: DISPLAY, fontSize: 90, color: 'white'}}>GTA VI</div>
				</div>
				<div style={{position: 'absolute', left: 0, right: 0, top: 120, height: 60, borderRadius: '20px 20px 6px 6px', background: '#174fb0', border: '6px solid #0a1d44', transformOrigin: '50% 0%', transform: `rotateX(${lid * 120}deg)`}} />
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1300, textAlign: 'center', opacity: q, transform: `scale(${interpolate(q, [0, 1], [1.6, 1])})`}}>
				<Pill bg={C.red} size={44}>
					❓ E O PÔSTER? NÃO CONFIRMADO
				</Pill>
			</div>
		</AbsoluteFill>
	);
};

// 8) 35.5–40.8  régua medindo o mapa: o tamanho real do mundo
const S8: React.FC = () => {
	const frame = fr();
	const m = lerp(frame, 1.2, 3.4, 0, 1);
	const s = sp(frame, 3.3, 9, 320);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', opacity: sp(frame, 0)}}>
				<Big size={96}>SE VIER COMPLETO…</Big>
			</div>
			<div style={{position: 'absolute', left: 540 - 200, top: 470, opacity: sp(frame, 0.2)}}>
				<MapArt w={400} h={540} />
			</div>
			{/* régua */}
			<div style={{position: 'absolute', left: 230, top: 1290, width: 620 * m, height: 70, background: YEL, borderRadius: 10, border: '5px solid #000', overflow: 'hidden', boxShadow: '0 10px 0 #000'}}>
				{Array.from({length: 40}).map((_, i) => (
					<div key={i} style={{position: 'absolute', left: i * 16, top: 0, width: 3, height: i % 5 ? 22 : 40, background: '#000'}} />
				))}
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1420, textAlign: 'center', opacity: s, transform: `scale(${interpolate(s, [0, 1], [1.8, 1])})`}}>
				<Big size={110} grad>
					TAMANHO REAL?
				</Big>
			</div>
		</AbsoluteFill>
	);
};

// 9) 40.8–43.5  pôster na parede com fita + enquete
const S9: React.FC = () => {
	const frame = fr();
	const s = sp(frame, 0.05, 10, 260);
	const opt = (l: string, t: string, color: string, i: number) => {
		const k = sp(frame, 0.8 + i * 0.25, 11, 300);
		return (
			<div style={{display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.96)', borderRadius: 18, padding: '10px 18px', margin: '12px 0', opacity: k, transform: `translateX(${(1 - k) * 200}px)`}}>
				<div style={{width: 62, height: 62, borderRadius: 14, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36}}>{l}</div>
				<span style={{fontFamily: DISPLAY, fontSize: 46, color: C.ink}}>{t}</span>
			</div>
		);
	};
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 540 - 200, top: 330, width: 400, height: 520, transform: `rotate(${-3 + (1 - s) * 20}deg) scale(${interpolate(s, [0, 1], [1.4, 1])})`, opacity: s}}>
				<MapArt w={400} h={520} />
				{[[-20, -14, -30], [340, -14, 30]].map(([x, y, r], i) => (
					<div key={i} style={{position: 'absolute', left: x, top: y, width: 90, height: 34, background: 'rgba(255,240,180,0.85)', transform: `rotate(${r}deg)`}} />
				))}
			</div>
			<div style={{position: 'absolute', left: 70, right: 70, top: 1250}}>
				<Big size={62}>VAI COLAR NA PAREDE?</Big>
				{opt('🖨️', 'VOU IMPRIMIR', GREEN, 0)}
				{opt('💸', 'VOU COMPRAR O FÍSICO', PINK, 1)}
			</div>
		</AbsoluteFill>
	);
};

const SCENES: [number, number, React.FC, string, React.FC][] = [
	[0, 4.4, S1, CYAN, BgOcean],
	[4.4, 11.0, S2, YEL, BgDesk],
	[11.0, 14.3, S3, PINK, BgPrint],
	[14.3, 22.1, S4, CYAN, BgStore],
	[22.1, 24.8, S5, YEL, BgParty],
	[24.8, 30.3, S6, '#9aa3b5', BgFog],
	[30.3, 35.5, S7, YEL, BgSpot],
	[35.5, 40.8, S8, CYAN, BgSpace],
	[40.8, 43.5, S9, PINK, BgBrick],
];

const Wipe: React.FC<{color: string}> = ({color}) => {
	const frame = fr();
	const x = interpolate(frame, [0, 10], [-1400, 1400], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
	return <div style={{position: 'absolute', left: x, top: -400, width: 700, height: 2800, background: color, transform: 'rotate(18deg)'}} />;
};
const SceneShell: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
	const frame = fr();
	const inn = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const out = interpolate(frame, [f(dur) - 6, f(dur)], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return <AbsoluteFill style={{opacity: Math.min(inn, out), transform: `scale(${interpolate(inn, [0, 1], [1.08, 1])})`, filter: `blur(${(1 - inn) * 8}px)`}}>{children}</AbsoluteFill>;
};

export const PosterMotion: React.FC = () => (
	<AbsoluteFill>
		{SCENES.map(([a, b, , , Bg], i) => (
			<At key={`bg${i}`} from={a} to={i === SCENES.length - 1 ? 52 : b}>
				<Bg />
			</At>
		))}
		{SCENES.map(([a, b, Scene, col], i) => (
			<At key={i} from={a} to={b}>
				<SceneShell dur={b - a}>
					<Scene />
				</SceneShell>
				{i > 0 ? <Wipe color={col} /> : null}
			</At>
		))}
		<At from={43.5} to={52}>
			<ProOutro subAt={1.6} tagline="INVESTIGANDO CADA DETALHE DE GTA 6" />
		</At>
	</AbsoluteFill>
);
