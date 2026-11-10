import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame} from 'remotion';
import {At} from '../components/Overlays';
import {ProOutro} from '../components/ProOutro';
import {C, DISPLAY, UI, f} from '../theme';

// "GTA 6 no PC: quando lança?" em MOTION DESIGN — cenário diferente por cena. Estimativas sinalizadas como estimativa.
// Única imagem do jogo: uma screenshot oficial dentro do monitor (cena 1).

const PINK = '#FF3E9A';
const CYAN = '#38E1FF';
const YEL = '#FFD84A';
const GREEN = '#3DFF8A';
const PURPLE = '#7B3CFF';
const GRADT = `linear-gradient(180deg, ${YEL} 0%, #FF9A3C 45%, ${PINK} 100%)`;
const fr = () => useCurrentFrame();
const sp = (frame: number, at: number, d = 12, s = 260) => spring({frame: frame - f(at), fps: 30, config: {damping: d, stiffness: s}});
const lerp = (frame: number, a: number, b: number, o0: number, o1: number, ease = Easing.out(Easing.cubic)) => interpolate(frame, [f(a), f(b)], [o0, o1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

const Big: React.FC<{size: number; children: React.ReactNode; grad?: boolean; color?: string; style?: React.CSSProperties}> = ({size, children, grad, color = 'white', style}) =>
	grad ? (
		<span style={{fontFamily: DISPLAY, fontSize: size, lineHeight: 1, backgroundImage: GRADT, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 8px 0 #000)', ...style}}>{children}</span>
	) : (
		<span style={{fontFamily: DISPLAY, fontSize: size, lineHeight: 1, color, textShadow: '0 8px 0 #000', ...style}}>{children}</span>
	);
const Pill: React.FC<{bg: string; color?: string; size?: number; children: React.ReactNode}> = ({bg, color = 'white', size = 40, children}) => (
	<span style={{display: 'inline-block', background: bg, color, fontFamily: UI, fontWeight: 800, fontSize: size, padding: `${size * 0.25}px ${size * 0.6}px`, borderRadius: size * 0.5, boxShadow: '0 10px 0 rgba(0,0,0,0.55)', whiteSpace: 'nowrap'}}>{children}</span>
);
const Stamp: React.FC<{text: string; color: string; at: number; top: number; rot?: number; size?: number}> = ({text, color, at, top, rot = -8, size = 120}) => {
	const frame = fr();
	const s = sp(frame, at, 9, 340);
	if (frame < f(at)) return null;
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top, textAlign: 'center'}}>
			<span style={{display: 'inline-block', fontFamily: DISPLAY, fontSize: size, color, border: `12px solid ${color}`, borderRadius: 24, padding: '4px 36px 0', transform: `rotate(${rot}deg) scale(${interpolate(s, [0, 1], [2.6, 1])})`, opacity: interpolate(s, [0, 0.2], [0, 1], {extrapolateRight: 'clamp'}), background: 'rgba(0,0,0,0.4)'}}>{text}</span>
		</div>
	);
};

/* ---------------------------------------------------------------- fundos */
const BgRGB: React.FC = () => {
	const frame = fr();
	return (
		<AbsoluteFill style={{background: '#030308', overflow: 'hidden'}}>
			{Array.from({length: 7}).map((_, i) => (
				<div key={i} style={{position: 'absolute', left: -300, right: -300, top: 120 + i * 260, height: 26, borderRadius: 13, background: `linear-gradient(90deg, #ff0040, #ffae00, #3dff8a, #38e1ff, #7b3cff, #ff3e9a, #ff0040)`, backgroundSize: '1600px 100%', backgroundPosition: `${(frame * 12 + i * 200) % 1600}px 0`, filter: 'blur(10px)', opacity: 0.55, transform: `rotate(${-8 + i * 2}deg)`}} />
			))}
		</AbsoluteFill>
	);
};
const BgStatic: React.FC = () => {
	const frame = fr();
	return (
		<AbsoluteFill style={{background: '#111', overflow: 'hidden'}}>
			{Array.from({length: 48}).map((_, r) => (
				<div key={r} style={{position: 'absolute', left: 0, right: 0, top: r * 40, height: 40, display: 'flex'}}>
					{Array.from({length: 27}).map((__, c) => (
						<div key={c} style={{width: 40, height: 40, background: `rgb(${Math.floor(random(`n${r}-${c}-${frame % 7}`) * 120)},${Math.floor(random(`n${r}-${c}-${frame % 7}`) * 120)},${Math.floor(random(`n${r}-${c}-${frame % 7}`) * 130)})`}} />
					))}
				</div>
			))}
			<div style={{position: 'absolute', left: 0, right: 0, top: (frame * 30) % 1920, height: 60, background: 'rgba(255,255,255,0.12)'}} />
		</AbsoluteFill>
	);
};
const BgBoard: React.FC = () => (
	<AbsoluteFill style={{background: 'linear-gradient(180deg, #0a1428 0%, #13233f 60%, #0a1222 100%)', overflow: 'hidden'}}>
		<AbsoluteFill style={{backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.06) 3px, transparent 3px)', backgroundSize: '180px 100%', maskImage: 'linear-gradient(180deg, #000 0%, #000 55%, transparent 56%)', WebkitMaskImage: 'linear-gradient(180deg, #000 0%, #000 55%, transparent 56%)'}} />
		<div style={{position: 'absolute', left: -200, right: -200, top: 1150, height: 900, background: 'linear-gradient(180deg, #3a2516, #1c120a)', transform: 'perspective(800px) rotateX(55deg)', transformOrigin: '50% 0%', boxShadow: '0 -10px 60px rgba(0,0,0,0.6)'}} />
	</AbsoluteFill>
);
const BgOrbit: React.FC = () => {
	const frame = fr();
	return (
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #2a0f55 0%, #08031a 70%)', overflow: 'hidden'}}>
			{[300, 450, 600, 760].map((r, i) => (
				<div key={i} style={{position: 'absolute', left: 540 - r, top: 820 - r * 0.45, width: r * 2, height: r * 0.9, borderRadius: '50%', border: `3px solid rgba(123,60,255,${0.5 - i * 0.08})`, transform: `rotate(${frame * (i % 2 ? -0.3 : 0.3)}deg)`}} />
			))}
		</AbsoluteFill>
	);
};
const BgPaper: React.FC = () => (
	<AbsoluteFill style={{background: '#f4f1e8', overflow: 'hidden'}}>
		<AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(30,90,200,0.15) 2px, transparent 2px), linear-gradient(90deg, rgba(30,90,200,0.15) 2px, transparent 2px), linear-gradient(rgba(30,90,200,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(30,90,200,0.07) 1px, transparent 1px)', backgroundSize: '200px 200px, 200px 200px, 40px 40px, 40px 40px'}} />
	</AbsoluteFill>
);
const BgDusk: React.FC = () => {
	const frame = fr();
	return (
		<AbsoluteFill style={{background: 'linear-gradient(180deg, #0b3a4a 0%, #1f6f78 40%, #f29e4c 75%, #3a1a2a 100%)', overflow: 'hidden'}}>
			{Array.from({length: 5}).map((_, i) => (
				<div key={i} style={{position: 'absolute', left: ((frame * (0.5 + i * 0.2) + i * 400) % 1600) - 400, top: 200 + i * 160, width: 380, height: 90, borderRadius: 45, background: 'rgba(255,255,255,0.18)', filter: 'blur(8px)'}} />
			))}
		</AbsoluteFill>
	);
};
const BgCircuit: React.FC = () => {
	const frame = fr();
	return (
		<AbsoluteFill style={{background: '#021208', overflow: 'hidden'}}>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				{Array.from({length: 26}).map((_, i) => {
					const x = random(`cx${i}`) * 1080;
					const y = random(`cy${i}`) * 1920;
					const l = 120 + random(`cl${i}`) * 300;
					const d = `M${x} ${y} h${l} v${l * 0.6} h${l * 0.5}`;
					return (
						<g key={i}>
							<path d={d} stroke="rgba(61,255,138,0.25)" strokeWidth={4} fill="none" />
							<path d={d} stroke={GREEN} strokeWidth={6} fill="none" strokeDasharray={`40 ${l * 3}`} strokeDashoffset={-((frame * 8 + i * 50) % (l * 3))} style={{filter: `drop-shadow(0 0 6px ${GREEN})`}} />
							<circle cx={x} cy={y} r={8} fill={GREEN} opacity={0.7} />
						</g>
					);
				})}
			</svg>
		</AbsoluteFill>
	);
};
const BgCaution: React.FC = () => {
	const frame = fr();
	return (
		<AbsoluteFill style={{background: '#1a1400', overflow: 'hidden'}}>
			{[180, 1650].map((top, i) => (
				<div key={i} style={{position: 'absolute', left: -200, right: -200, top, height: 120, backgroundImage: 'repeating-linear-gradient(45deg, #FFD84A 0 50px, #111 50px 100px)', backgroundPosition: `${(frame * 6 * (i ? -1 : 1)) % 141}px 0`, transform: `rotate(${i ? 4 : -4}deg)`}} />
			))}
			<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, rgba(255,216,74,0.18), rgba(0,0,0,0) 60%)'}} />
		</AbsoluteFill>
	);
};
const BgBeams: React.FC = () => {
	const frame = fr();
	return (
		<AbsoluteFill style={{background: 'linear-gradient(180deg, #050a24 0%, #0b1a55 100%)', overflow: 'hidden'}}>
			{Array.from({length: 6}).map((_, i) => (
				<div key={i} style={{position: 'absolute', left: 540 - 60, top: 1920, width: 120, height: 2400, transformOrigin: '50% 0%', transform: `rotate(${180 + Math.sin(frame / 30 + i) * 30 + (i - 2.5) * 12}deg)`, background: `linear-gradient(180deg, ${i % 2 ? 'rgba(56,225,255,0.35)' : 'rgba(255,62,154,0.3)'}, rgba(0,0,0,0))`, filter: 'blur(10px)'}} />
			))}
		</AbsoluteFill>
	);
};
const BgSplit: React.FC = () => {
	const frame = fr();
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<AbsoluteFill style={{background: '#0b2a8a'}} />
			<AbsoluteFill style={{background: '#8a0b2a', clipPath: `polygon(0 ${58 + Math.sin(frame / 10) * 2}%, 100% ${42 + Math.sin(frame / 10) * 2}%, 100% 100%, 0 100%)`}} />
		</AbsoluteFill>
	);
};

/* ---------------------------------------------------------------- cenas */
// 1) 0–5.9  monitor de PC + busca digitada + "+90%"
const S1: React.FC = () => {
	const frame = fr();
	const t = frame / 30;
	const q = 'quando gta 6 vai ser lançado para PC';
	const n = Math.max(0, Math.min(q.length, Math.floor((t - 0.2) * 22)));
	const up = sp(frame, 3.6, 9, 320);
	const k = lerp(frame, 0.6, 5.0, 0, 0.62);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 90, right: 90, top: 330, background: 'white', borderRadius: 40, padding: '20px 30px', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', gap: 16}}>
				<span style={{fontSize: 40}}>🔍</span>
				<span style={{fontFamily: UI, fontWeight: 700, fontSize: 36, color: C.ink}}>
					{q.slice(0, n)}
					{n < q.length && Math.floor(frame / 6) % 2 === 0 ? '|' : ''}
				</span>
			</div>
			{/* monitor */}
			<div style={{position: 'absolute', left: 90, right: 90, top: 470, height: 520, borderRadius: 24, background: '#0b0b10', border: '16px solid #1c1c24', boxShadow: '0 30px 70px rgba(0,0,0,0.7)', overflow: 'hidden'}}>
				<Img src={staticFile('v16/Vice_City_19.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55)'}} />
				<div style={{position: 'absolute', left: 60, right: 60, bottom: 60}}>
					<div style={{fontFamily: UI, fontWeight: 800, fontSize: 30, color: 'white'}}>GTA VI · VERSÃO PC</div>
					<div style={{height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.2)', marginTop: 10, overflow: 'hidden'}}>
						<div style={{width: `${k * 100}%`, height: '100%', background: CYAN}} />
					</div>
					<div style={{fontFamily: UI, fontWeight: 800, fontSize: 26, color: YEL, marginTop: 8}}>CARREGANDO… DATA DESCONHECIDA</div>
				</div>
			</div>
			<div style={{position: 'absolute', left: 300, right: 300, top: 990, height: 90, background: '#1c1c24', clipPath: 'polygon(30% 0, 70% 0, 100% 100%, 0 100%)'}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 1300, textAlign: 'center', opacity: up, transform: `scale(${interpolate(up, [0, 1], [1.8, 1])})`}}>
				<Pill bg={GREEN} color={C.ink} size={46}>
					📈 BUSCA EM ALTA NO BRASIL
				</Pill>
			</div>
		</AbsoluteFill>
	);
};

// 2) 5.9–8.9  "NINGUÉM SABE" com glitch
const S2: React.FC = () => {
	const frame = fr();
	const g = frame % 9 < 2 ? 14 : 0;
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 480, textAlign: 'center'}}>
				<div style={{position: 'relative', display: 'inline-block'}}>
					<Big size={170} color={CYAN} style={{position: 'absolute', left: -g, top: 0, opacity: 0.8, textShadow: 'none'}}>
						???
					</Big>
					<Big size={170} color={PINK} style={{position: 'absolute', left: g, top: 0, opacity: 0.8, textShadow: 'none'}}>
						???
					</Big>
					<Big size={170}>???</Big>
				</div>
			</div>
			<Stamp text="NINGUÉM SABE" color={YEL} at={1.8} top={760} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 1320, textAlign: 'center'}}>
				<Pill bg={C.ink} size={36}>
					ERRO 404: DATA DO PC NÃO ENCONTRADA
				</Pill>
			</div>
		</AbsoluteFill>
	);
};

// 3) 8.9–13.9  reunião Take-Two: tabela de plataformas com PC sem data
const S3: React.FC = () => {
	const frame = fr();
	const rows = [
		{p: 'PS5', d: '19/11/2026', c: CYAN},
		{p: 'XBOX SERIES', d: '19/11/2026', c: GREEN},
		{p: 'PC', d: '— SEM DATA —', c: C.red},
	];
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center'}}>
				<Pill bg={PURPLE} size={38}>
					📞 TAKE-TWO · REUNIÃO DE 09/11
				</Pill>
			</div>
			<div style={{position: 'absolute', left: 90, right: 90, top: 460}}>
				{rows.map((r, i) => {
					const k = sp(frame, 0.3 + i * 0.5, 11, 280);
					const last = i === 2;
					return (
						<div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(8,14,30,0.92)', borderRadius: 20, padding: '24px 30px', margin: '16px 0', border: `5px solid ${r.c}`, opacity: k, transform: `translateX(${(1 - k) * 200}px) ${last ? `translateX(${frame % 20 < 3 && frame > f(3) ? 8 : 0}px)` : ''}`}}>
							<span style={{fontFamily: DISPLAY, fontSize: 70, color: 'white'}}>{r.p}</span>
							<span style={{fontFamily: UI, fontWeight: 800, fontSize: 36, color: r.c}}>{r.d}</span>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

// 4) 13.9–19.6  "todas as plataformas" — ícones orbitando
const S4: React.FC = () => {
	const frame = fr();
	const items = [
		{t: 'PS5', c: CYAN},
		{t: 'XBOX', c: GREEN},
		{t: 'PC', c: PINK},
	];
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', opacity: sp(frame, 0)}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 32, color: CYAN, letterSpacing: 4}}>O CHEFE DA TAKE-TWO JÁ DISSE:</div>
				<Big size={92}>"COM O TEMPO,</Big>
				<br />
				<Big size={92} grad>
					TODAS AS PLATAFORMAS"
				</Big>
			</div>
			<div style={{position: 'absolute', left: 540, top: 820}}>
				{items.map((it, i) => {
					const a = frame * 1.6 + i * 120;
					const x = Math.cos((a * Math.PI) / 180) * 300;
					const y = Math.sin((a * Math.PI) / 180) * 120;
					const z = Math.sin((a * Math.PI) / 180);
					return (
						<div key={i} style={{position: 'absolute', left: x - 110, top: y - 70, width: 220, height: 140, borderRadius: 24, background: 'rgba(10,6,24,0.92)', border: `6px solid ${it.c}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.8 + (z + 1) * 0.15})`, zIndex: Math.round((z + 1) * 10), boxShadow: `0 0 30px ${it.c}88`}}>
							<span style={{fontFamily: DISPLAY, fontSize: 64, color: 'white'}}>{it.t}</span>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

// 5) 19.6–30.2  histórico em barras (papel milimetrado)
const S5: React.FC = () => {
	const frame = fr();
	const bar = (label: string, from: string, to: string, months: number, at: number, color: string) => {
		const k = lerp(frame, at, at + 1.6, 0, 1);
		const W = 840 * (months / 20);
		return (
			<div style={{marginTop: 40}}>
				<div style={{fontFamily: DISPLAY, fontSize: 70, color: '#14213d'}}>{label}</div>
				<div style={{display: 'flex', justifyContent: 'space-between', width: 840, fontFamily: UI, fontWeight: 800, fontSize: 26, color: '#33415c', marginTop: 6}}>
					<span>🎮 CONSOLE: {from}</span>
					<span style={{opacity: k >= 1 ? 1 : 0}}>💻 PC: {to}</span>
				</div>
				<div style={{position: 'relative', width: 840, height: 70, borderRadius: 14, background: 'rgba(20,33,61,0.12)', marginTop: 8}}>
					<div style={{width: W * k, height: '100%', borderRadius: 14, background: color, boxShadow: '0 8px 0 rgba(0,0,0,0.25)'}} />
					<div style={{position: 'absolute', left: Math.max(20, W * k - 260), top: 6, fontFamily: DISPLAY, fontSize: 52, color: 'white', opacity: k}}>{Math.round(months * k)} MESES</div>
				</div>
			</div>
		);
	};
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 120, top: 330}}>
				<div style={{fontFamily: DISPLAY, fontSize: 92, color: '#14213d'}}>A HISTÓRIA FAZ A CONTA</div>
				{bar('GTA 5', 'SET/2013', 'ABR/2015', 19, 22.3 - 19.6, '#e63946')}
				{bar('RED DEAD 2', 'OUT/2018', 'NOV/2019', 13, 26.6 - 19.6, '#2a9d8f')}
			</div>
		</AbsoluteFill>
	);
};

// 6) 30.2–38.6  projeção: zona estimada fim 2027 – meio 2028
const S6: React.FC = () => {
	const frame = fr();
	const zone = lerp(frame, 2.0, 3.6, 0, 1);
	const yrs = ['2026', '2027', '2028'];
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center'}}>
				<Big size={88}>SE SEGUIR O PADRÃO…</Big>
			</div>
			<div style={{position: 'absolute', left: 90, right: 90, top: 560, height: 300}}>
				<div style={{position: 'absolute', left: 0, right: 0, top: 140, height: 14, borderRadius: 7, background: 'rgba(255,255,255,0.6)'}} />
				{yrs.map((y, i) => (
					<div key={y} style={{position: 'absolute', left: `${i * 40}%`, top: 70, transform: 'translateX(-50%)', textAlign: 'center'}}>
						<div style={{fontFamily: DISPLAY, fontSize: 54, color: 'white', textShadow: '0 4px 0 #000'}}>{y}</div>
						<div style={{width: 6, height: 50, background: 'white', margin: '6px auto 0'}} />
					</div>
				))}
				{/* lançamento nos consoles */}
				<div style={{position: 'absolute', left: 'calc(35% - 27px)', top: 120, width: 54, height: 54, borderRadius: 27, background: GREEN, border: '6px solid white', boxShadow: `0 0 20px ${GREEN}`}} />
				<div style={{position: 'absolute', left: '18%', top: 200, fontFamily: UI, fontWeight: 800, fontSize: 26, color: 'white'}}>CONSOLES: 19/11/2026</div>
				<div style={{position: 'absolute', left: '70%', top: 200, fontFamily: UI, fontWeight: 800, fontSize: 26, color: PINK, opacity: zone}}>PC (ESTIMATIVA)</div>
				{/* zona estimada do PC */}
				<div style={{position: 'absolute', left: '78%', width: `${zone * 20}%`, top: 108, height: 78, borderRadius: 18, background: 'repeating-linear-gradient(45deg, rgba(255,62,154,0.85) 0 18px, rgba(255,62,154,0.55) 18px 36px)', border: '5px solid white'}} />
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 900, textAlign: 'center', opacity: zone}}>
				<Big size={80} grad>
					FIM DE 2027 → MEIO DE 2028
				</Big>
			</div>
			<Stamp text="ESTIMATIVA" color={YEL} at={36.9 - 30.2} top={1320} size={96} />
		</AbsoluteFill>
	);
};

// 7) 38.6–47.7  reviravolta: opinião do ex-diretor técnico (IA)
const S7: React.FC = () => {
	const frame = fr();
	const q = sp(frame, 1.6, 12, 260);
	const ai = sp(frame, 6.8, 9, 320);
	return (
		<AbsoluteFill>
			<Stamp text="REVIRAVOLTA" color={GREEN} at={0.2} top={330} size={110} rot={-4} />
			<div style={{position: 'absolute', left: 80, right: 80, top: 560, background: 'rgba(2,18,8,0.92)', borderRadius: 24, padding: '24px 28px', borderLeft: `12px solid ${GREEN}`, opacity: q, transform: `translateX(${(1 - q) * 300}px)`}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 28, color: GREEN, letterSpacing: 2}}>OBBE VERMEIJ · EX-DIRETOR TÉCNICO DA ROCKSTAR NORTH</div>
				<div style={{fontFamily: DISPLAY, fontSize: 76, color: 'white', lineHeight: 1.08, marginTop: 10}}>O PC PODE CHEGAR ANTES</div>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1300, textAlign: 'center', opacity: ai, transform: `scale(${interpolate(ai, [0, 1], [1.6, 1])})`}}>
				<Pill bg={C.ink} size={42}>
					🤖 PARA COMPETIR COM CÓPIAS FEITAS POR IA
				</Pill>
			</div>
		</AbsoluteFill>
	);
};

// 8) 47.7–50.4  opinião ≠ anúncio
const S8: React.FC = () => (
	<AbsoluteFill>
		<div style={{position: 'absolute', left: 0, right: 0, top: 500, textAlign: 'center'}}>
			<Big size={140} color={YEL}>
				OPINIÃO
			</Big>
			<div style={{fontFamily: DISPLAY, fontSize: 120, color: 'white', textShadow: '0 8px 0 #000'}}>≠</div>
			<Big size={120}>ANÚNCIO OFICIAL</Big>
		</div>
	</AbsoluteFill>
);

// 9) 50.4–56.0  19/11: só PS5 e Xbox Series
const S9: React.FC = () => {
	const frame = fr();
	const cross = lerp(frame, 3.4, 4.0, 0, 1);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center'}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 34, color: CYAN, letterSpacing: 5}}>POR ENQUANTO</div>
				<Big size={150} grad>
					19/11
				</Big>
			</div>
			<div style={{position: 'absolute', left: 90, right: 90, top: 620, display: 'flex', gap: 22}}>
				{[
					{t: 'PS5', c: CYAN, on: true},
					{t: 'XBOX SERIES', c: GREEN, on: true},
					{t: 'PC', c: C.red, on: false},
				].map((p, i) => {
					const k = sp(frame, 0.8 + i * 0.4, 11, 280);
					return (
						<div key={i} style={{flex: 1, position: 'relative', height: 220, borderRadius: 24, background: 'rgba(5,10,36,0.92)', border: `6px solid ${p.c}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: k, transform: `translateY(${(1 - k) * 100}px)`}}>
							<span style={{fontFamily: DISPLAY, fontSize: p.t.length > 4 ? 46 : 70, color: 'white', textAlign: 'center'}}>{p.t}</span>
							<span style={{fontSize: 50, marginTop: 6}}>{p.on ? '✅' : '⏳'}</span>
							{!p.on ? <div style={{position: 'absolute', left: -10, top: '48%', height: 14, width: `${cross * 112}%`, background: C.red, borderRadius: 7, transform: 'rotate(-20deg)'}} /> : null}
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

// 10) 56.0–59.5  enquete PC x console
const S10: React.FC = () => {
	const frame = fr();
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center'}}>
				<Big size={96}>E VOCÊ?</Big>
			</div>
			<div style={{position: 'absolute', left: 90, right: 90, top: 520, display: 'flex', gap: 30}}>
				{[
					{e: '💻', t: 'ESPERO O PC', c: PINK},
					{e: '🎮', t: 'JOGO NO CONSOLE', c: CYAN},
				].map((o, i) => {
					const k = sp(frame, 0.3 + i * 0.3, 10, 300);
					return (
						<div key={i} style={{flex: 1, height: 420, borderRadius: 30, background: 'rgba(0,0,0,0.45)', border: `8px solid ${o.c}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: k, transform: `scale(${interpolate(k, [0, 1], [0.5, 1])}) rotate(${i ? 3 : -3}deg)`, boxShadow: `0 0 50px ${o.c}88`}}>
							<span style={{fontSize: 150}}>{o.e}</span>
							<span style={{fontFamily: DISPLAY, fontSize: 50, color: 'white', textAlign: 'center', marginTop: 10}}>{o.t}</span>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

const SCENES: [number, number, React.FC, string, React.FC][] = [
	[0, 5.9, S1, CYAN, BgRGB],
	[5.9, 8.9, S2, PINK, BgStatic],
	[8.9, 13.9, S3, PURPLE, BgBoard],
	[13.9, 19.6, S4, PINK, BgOrbit],
	[19.6, 30.2, S5, YEL, BgPaper],
	[30.2, 38.6, S6, PINK, BgDusk],
	[38.6, 47.7, S7, GREEN, BgCircuit],
	[47.7, 50.4, S8, YEL, BgCaution],
	[50.4, 56.0, S9, CYAN, BgBeams],
	[56.0, 59.5, S10, PINK, BgSplit],
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

export const PcMotion: React.FC = () => (
	<AbsoluteFill>
		{SCENES.map(([a, b, , , Bg], i) => (
			<At key={`bg${i}`} from={a} to={i === SCENES.length - 1 ? 68.5 : b}>
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
		<At from={59.5} to={68.5}>
			<ProOutro subAt={1.6} tagline="INVESTIGANDO CADA DETALHE DE GTA 6" />
		</At>
	</AbsoluteFill>
);
