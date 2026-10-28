import React from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame} from 'remotion';
import {At, Chip, Stamp, TitleCard, useOut, useSpring} from '../components/Overlays';
import {EndCard} from '../fps/Overlays';
import {NotConfirmed, Poll} from '../preso/Overlays';
import {C, DISPLAY, GRAD, SAFE, UI, f} from '../theme';

const GREEN = '#3DFF8A';
const BLUE = '#2F8CFF';

/** Mola a partir de um instante absoluto (s) dentro de um <At from={start}> */
const useAt = (start: number, at: number, damping = 12, stiffness = 260) => useSpring(at - start, damping, stiffness);
const fmtCount = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(1).replace('.', ',')} MI` : n >= 1e3 ? `${Math.round(n / 1e3)} MIL` : String(Math.round(n)));

/** Moldura de celular ILUSTRATIVA (não é a interface do jogo) */
const Phone: React.FC<{children: React.ReactNode; p: number; left?: number; top?: number; tilt?: number}> = ({children, p, left = 290, top = 330, tilt = -4}) => (
	<div style={{position: 'absolute', left, top, width: 500, height: 720, borderRadius: 56, background: '#0b0b10', border: '10px solid #2a2a33', boxShadow: '0 30px 80px rgba(0,0,0,0.65)', overflow: 'hidden', opacity: p, transform: `translateY(${(1 - p) * 700}px) rotate(${tilt}deg)`}}>
		<div style={{position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', width: 130, height: 30, borderRadius: 15, background: '#000', zIndex: 2}} />
		<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #3b1d5e, #12081f 60%)'}} />
		<div style={{position: 'absolute', inset: '64px 22px 22px'}}>{children}</div>
	</div>
);

const Notif: React.FC<{icon: string; app: string; text: string; p: number; color?: string}> = ({icon, app, text, p, color = C.pink}) => (
	<div style={{display: 'flex', gap: 14, alignItems: 'center', background: 'rgba(255,255,255,0.94)', borderRadius: 22, padding: '14px 16px', marginBottom: 14, opacity: p, transform: `translateY(${(1 - p) * -60}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`}}>
		<div style={{width: 58, height: 58, borderRadius: 14, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0}}>{icon}</div>
		<div style={{minWidth: 0}}>
			<div style={{fontFamily: UI, fontWeight: 800, fontSize: 18, color: '#666', letterSpacing: 1}}>{app}</div>
			<div style={{fontFamily: UI, fontWeight: 800, fontSize: 24, color: C.ink, lineHeight: 1.15}}>{text}</div>
		</div>
	</div>
);

const IllusTag: React.FC<{top?: number}> = ({top = 300}) => (
	<div style={{position: 'absolute', top, left: SAFE.left}}>
		<div style={{fontFamily: UI, fontWeight: 800, fontSize: 22, letterSpacing: 4, color: C.ink, background: C.yellow, padding: '5px 12px', borderRadius: 6}}>ILUSTRAÇÃO · NÃO É A TELA DO JOGO</div>
	</div>
);

const HookTitle: React.FC<{dur: number}> = ({dur}) => {
	const a = useSpring(0, 12, 260);
	const b = useSpring(0.6, 10, 300);
	const out = useOut(dur, 3);
	return (
		<AbsoluteFill style={{alignItems: 'center', top: 400, opacity: out}}>
			<div style={{fontFamily: DISPLAY, fontSize: 170, color: 'white', textShadow: '0 6px 0 #000', opacity: a, transform: `scale(${interpolate(a, [0, 1], [1.5, 1])})`}}>📱 O CELULAR</div>
			<div style={{fontFamily: DISPLAY, fontSize: 150, lineHeight: 1, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 8px 0 #000)', opacity: b, transform: `scale(${interpolate(b, [0, 1], [1.8, 1])})`}}>DE GTA 6</div>
		</AbsoluteFill>
	);
};

/** Celular recebendo notificações: "mecânica" → "mensagens" */
const PhoneNotifs: React.FC<{start: number; dur: number; msgAt: number; moreAt: number}> = ({start, dur, msgAt, moreAt}) => {
	const p = useSpring(0, 14, 200);
	const n1 = useAt(start, start + 0.7);
	const n2 = useAt(start, msgAt);
	const n3 = useAt(start, msgAt + 0.5);
	const q = useAt(start, moreAt, 10, 300);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<IllusTag />
			<Phone p={p}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 64, color: 'white', textAlign: 'center', marginTop: 10}}>21:47</div>
				<div style={{fontFamily: UI, fontWeight: 600, fontSize: 22, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: 26}}>VICE CITY</div>
				<Notif icon="⭐" app="NOVA MECÂNICA?" text="O celular pode ser a chave do jogo" p={n1} color={C.yellow} />
				<Notif icon="💬" app="MENSAGENS" text="Só para receber mensagens?" p={n2} color={GREEN} />
				<Notif icon="💬" app="MENSAGENS" text="Ou algo muito maior…" p={n3} color={GREEN} />
			</Phone>
			<div style={{position: 'absolute', top: 960, width: '100%', textAlign: 'center', opacity: q, transform: `scale(${interpolate(q, [0, 1], [1.6, 1])})`}}>
				<Chip bg={C.pink} size={44}>
					OU MUDA A HISTÓRIA?
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

/** Linha do tempo da história ramificando a partir de uma notificação */
const Branches: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	const grow = interpolate(frame, [6, 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const node = (x: number, y: number, label: string, d: number) => {
		const p = spring({frame: frame - d, fps: 30, config: {damping: 12, stiffness: 260}});
		return (
			<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${p})`}}>
				<Chip bg="rgba(11,6,18,0.9)" size={30}>
					{label}
				</Chip>
			</div>
		);
	};
	return (
		<AbsoluteFill style={{opacity: out * s}}>
			<svg width={1080} height={1920} style={{position: 'absolute'}}>
				{[
					[540, 760, 260, 470],
					[540, 760, 540, 430],
					[540, 760, 820, 470],
				].map(([x1, y1, x2, y2], i) => (
					<line key={i} x1={x1} y1={y1} x2={x1 + (x2 - x1) * grow} y2={y1 + (y2 - y1) * grow} stroke={i === 1 ? C.yellow : 'white'} strokeWidth={8} strokeDasharray="20 14" strokeLinecap="round" />
				))}
			</svg>
			<div style={{position: 'absolute', left: 540, top: 760, transform: 'translate(-50%,-50%)', width: 120, height: 120, borderRadius: 60, background: C.pink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, boxShadow: '0 10px 30px rgba(0,0,0,0.6)'}}>📱</div>
			{node(260, 440, 'CAMINHO A', 30)}
			{node(540, 400, 'CAMINHO B', 38)}
			{node(820, 440, 'CAMINHO C', 46)}
		</AbsoluteFill>
	);
};

const StayTill: React.FC<{start: number; dur: number; possAt: number}> = ({start, dur, possAt}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 240);
	const d = useAt(start, possAt);
	const out = useOut(dur);
	const fill = interpolate(frame, [0, f(dur)], [0.08, 0.92], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 400, left: SAFE.left, right: 140, opacity: s, transform: `translateY(${(1 - s) * 40}px)`}}>
				<div style={{fontFamily: DISPLAY, fontSize: 96, color: 'white', textShadow: '0 5px 0 #000'}}>FICA ATÉ O FINAL</div>
				<div style={{marginTop: 14, height: 30, borderRadius: 15, background: 'rgba(255,255,255,0.2)', border: '4px solid white', overflow: 'hidden'}}>
					<div style={{width: `${fill * 100}%`, height: '100%', background: GRAD}} />
				</div>
				<div style={{marginTop: 22, opacity: d, transform: `scale(${interpolate(d, [0, 1], [1.5, 1])})`, transformOrigin: 'left center'}}>
					<Chip bg={C.yellow} color={C.ink} size={38}>
						UMA POSSIBILIDADE QUE MERECE ATENÇÃO
					</Chip>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** "Nos trailers": celulares, vídeos, redes sociais */
const SeenInTrailers: React.FC<{start: number; dur: number; items: [string, number][]}> = ({start, dur, items}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 380, left: SAFE.left, right: 140}}>
				<div style={{opacity: s}}>
					<Chip bg={C.ink} size={32}>
						🎬 NOS TRAILERS
					</Chip>
				</div>
				{items.map(([label, at]) => {
					const p = spring({frame: frame - f(at - start), fps: 30, config: {damping: 11, stiffness: 300}});
					return frame >= f(at - start) ? (
						<div key={label} style={{marginTop: 16, opacity: p, transform: `translateX(${(1 - p) * -220}px)`}}>
							<div style={{display: 'inline-block', fontFamily: DISPLAY, fontSize: 92, color: 'white', textShadow: '0 6px 0 #000'}}>{label}</div>
						</div>
					) : null;
				})}
			</div>
		</AbsoluteFill>
	);
};

/** Perfil com seguidores explodindo da noite para o dia */
const Followers: React.FC<{start: number; dur: number; boomAt: number}> = ({start, dur, boomAt}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	const t = start + frame / 30;
	const k = interpolate(t, [start + 0.3, boomAt, boomAt + 0.9], [0, 0.05, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const n = 12 + k * k * 1_240_000;
	const night = t < boomAt;
	return (
		<AbsoluteFill style={{opacity: out}}>
			<IllusTag />
			<div style={{position: 'absolute', top: 360, left: SAFE.left, right: 140, background: 'rgba(255,255,255,0.95)', borderRadius: 30, padding: '26px 30px', opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.8, 1])})`, boxShadow: '0 20px 50px rgba(0,0,0,0.5)'}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 22}}>
					<div style={{width: 110, height: 110, borderRadius: 55, background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60}}>😎</div>
					<div>
						<div style={{fontFamily: UI, fontWeight: 800, fontSize: 34, color: C.ink}}>@qualquer.pessoa.vc</div>
						<div style={{fontFamily: UI, fontWeight: 600, fontSize: 24, color: '#777'}}>{night ? '🌙 ontem à noite' : '☀️ hoje de manhã'}</div>
					</div>
				</div>
				<div style={{marginTop: 18, fontFamily: DISPLAY, fontSize: 120, color: night ? C.ink : C.pink, lineHeight: 1}}>{fmtCount(n)}</div>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 28, letterSpacing: 4, color: '#777'}}>SEGUIDORES</div>
			</div>
		</AbsoluteFill>
	);
};

/** Gravando → postando na "internet do jogo" */
const RecUpload: React.FC<{start: number; dur: number; postAt: number}> = ({start, dur, postAt}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 12, 260);
	const out = useOut(dur);
	const t = start + frame / 30;
	const posting = t >= postAt;
	const prog = interpolate(t, [postAt, postAt + 1.3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const blink = Math.floor(frame / 10) % 2 === 0;
	const sec = Math.floor(frame / 30);
	return (
		<AbsoluteFill style={{opacity: out * s}}>
			<div style={{position: 'absolute', top: 300, left: 60, right: 130, height: 640, border: '6px solid rgba(255,255,255,0.9)', borderRadius: 30}} />
			<div style={{position: 'absolute', top: 330, left: 100, display: 'flex', alignItems: 'center', gap: 14}}>
				<div style={{width: 30, height: 30, borderRadius: 15, background: C.red, opacity: blink ? 1 : 0.25}} />
				<span style={{fontFamily: UI, fontWeight: 800, fontSize: 36, color: 'white', textShadow: '0 2px 8px #000'}}>REC 00:0{sec}</span>
			</div>
			{posting ? (
				<div style={{position: 'absolute', top: 820, left: 100, right: 170, background: 'rgba(11,6,18,0.9)', borderRadius: 18, padding: '16px 20px'}}>
					<div style={{fontFamily: UI, fontWeight: 800, fontSize: 28, color: 'white'}}>{prog < 1 ? '⬆️ PUBLICANDO NA INTERNET DO JOGO…' : '✅ PUBLICADO'}</div>
					<div style={{marginTop: 12, height: 16, borderRadius: 8, background: 'rgba(255,255,255,0.2)', overflow: 'hidden'}}>
						<div style={{width: `${prog * 100}%`, height: '100%', background: GREEN}} />
					</div>
				</div>
			) : null}
		</AbsoluteFill>
	);
};

/** O vídeo se espalha: cartões de post com visualizações subindo */
const Viral: React.FC<{start: number; dur: number}> = ({start, dur}) => {
	const frame = useCurrentFrame();
	const out = useOut(dur);
	const card = (i: number, x: number, y: number, rot: number) => {
		const p = spring({frame: frame - i * 7, fps: 30, config: {damping: 12, stiffness: 240}});
		const views = 900 + Math.pow(frame / 30 + i * 0.4, 3) * (40000 + i * 9000);
		return (
			<div key={i} style={{position: 'absolute', left: x, top: y, width: 330, background: 'white', borderRadius: 20, padding: 12, transform: `rotate(${rot}deg) scale(${p})`, boxShadow: '0 14px 34px rgba(0,0,0,0.5)'}}>
				<div style={{height: 150, borderRadius: 12, background: `linear-gradient(135deg, ${[C.pink, C.purple, C.orange][i % 3]}, ${C.ink})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 70}}>😳</div>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 24, color: C.ink, marginTop: 8}}>👁 {fmtCount(views)}</div>
			</div>
		);
	};
	const fire = spring({frame: frame - 18, fps: 30, config: {damping: 9, stiffness: 300}});
	return (
		<AbsoluteFill style={{opacity: out}}>
			<IllusTag />
			{card(0, 80, 380, -6)}
			{card(1, 560, 360, 5)}
			{card(2, 320, 600, -2)}
			<div style={{position: 'absolute', top: 880, width: '100%', textAlign: 'center', opacity: fire, transform: `scale(${interpolate(fire, [0, 1], [2, 1])}) rotate(-3deg)`}}>
				<span style={{fontFamily: DISPLAY, fontSize: 110, color: C.yellow, textShadow: '0 6px 0 #000'}}>VIRALIZOU 🔥</span>
			</div>
		</AbsoluteFill>
	);
};

const Influencer: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 9, 300);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			{Array.from({length: 26}).map((_, i) => {
				const x = random(`cx${i}`) * 1000 + 40;
				const y = -60 + ((frame * (6 + random(`cv${i}`) * 8) + random(`cy${i}`) * 900) % 1100);
				return <div key={i} style={{position: 'absolute', left: x, top: 260 + y, width: 18, height: 30, background: [C.yellow, C.pink, C.cyan, GREEN][i % 4], transform: `rotate(${frame * 9 + i * 40}deg)`, opacity: s}} />;
			})}
			<div style={{position: 'absolute', top: 430, width: '100%', textAlign: 'center', opacity: s, transform: `scale(${interpolate(s, [0, 1], [2, 1])})`}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 36, letterSpacing: 6, color: C.yellow, textShadow: '0 2px 8px #000'}}>PARABÉNS 🎉</div>
				<div style={{display: 'inline-flex', alignItems: 'center', gap: 16, marginTop: 10, background: 'white', borderRadius: 60, padding: '12px 36px'}}>
					<div style={{width: 64, height: 64, borderRadius: 32, background: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: UI, fontWeight: 800, fontSize: 40, color: 'white'}}>✓</div>
					<span style={{fontFamily: DISPLAY, fontSize: 96, color: C.ink}}>INFLUENCER</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** A polícia também viu o post */
const PoliceSaw: React.FC<{start: number; dur: number; alertAt: number}> = ({start, dur, alertAt}) => {
	const frame = useCurrentFrame();
	const a = useAt(start, alertAt, 10, 300);
	const out = useOut(dur);
	const flash = Math.floor(frame / 5) % 2 === 0;
	const t = start + frame / 30;
	return (
		<AbsoluteFill style={{opacity: out}}>
			{t >= alertAt ? <AbsoluteFill style={{background: flash ? 'rgba(255,45,61,0.16)' : 'rgba(47,140,255,0.16)'}} /> : null}
			<div style={{position: 'absolute', top: 400, left: SAFE.left, right: 140}}>
				<Notif icon="🚔" app="DEPARTAMENTO DE POLÍCIA" text="Vimos o seu vídeo. Estamos a caminho. 👀" p={a} color={BLUE} />
			</div>
			<div style={{position: 'absolute', top: 300, left: SAFE.left}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 22, letterSpacing: 4, color: C.ink, background: C.yellow, padding: '5px 12px', borderRadius: 6}}>PIADA · NÃO É MECÂNICA CONFIRMADA</div>
			</div>
		</AbsoluteFill>
	);
};

/** "Simples menu" riscado → apps de contatos, informações, oportunidades, acontecimentos */
const MoreThanMenu: React.FC<{start: number; dur: number; crossAt: number}> = ({start, dur, crossAt}) => {
	const s = useSpring(0, 13, 240);
	const x = useAt(start, crossAt, 10, 300);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 420, left: SAFE.left, right: 140, opacity: s}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.yellow, textShadow: '0 2px 8px #000'}}>O CELULAR COMO…</div>
				<div style={{position: 'relative', display: 'inline-block', marginTop: 10}}>
					<div style={{fontFamily: DISPLAY, fontSize: 110, color: 'white', textShadow: '0 6px 0 #000'}}>UM SIMPLES MENU</div>
					<div style={{position: 'absolute', left: -10, top: '52%', height: 16, width: `${x * 104}%`, background: C.red, borderRadius: 8, transform: 'rotate(-3deg)'}} />
				</div>
			</div>
		</AbsoluteFill>
	);
};

const APPS: [string, string, string, number][] = [
	['👥', 'CONTATOS', '#1FA7C9', 56.9],
	['🗂', 'INFORMAÇÕES', C.purple, 57.74],
	['💰', 'OPORTUNIDADES', '#22A35A', 58.84],
	['📰', 'ACONTECIMENTOS', C.orange, 59.76],
];
const AppGrid: React.FC<{start: number; dur: number}> = ({start, dur}) => {
	const frame = useCurrentFrame();
	const p = useSpring(0, 14, 200);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<IllusTag />
			<Phone p={p} tilt={3}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 26, letterSpacing: 4, color: 'rgba(255,255,255,0.75)', textAlign: 'center', margin: '6px 0 26px'}}>CONECTADO À TRAMA</div>
				<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22}}>
					{APPS.map(([icon, label, color, at]) => {
						const a = spring({frame: frame - f(at - start), fps: 30, config: {damping: 10, stiffness: 300}});
						return (
							<div key={label} style={{textAlign: 'center', opacity: a, transform: `scale(${interpolate(a, [0, 1], [0.3, 1])})`}}>
								<div style={{width: 160, height: 160, margin: '0 auto', borderRadius: 38, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 84, boxShadow: '0 10px 24px rgba(0,0,0,0.4)'}}>{icon}</div>
								<div style={{fontFamily: UI, fontWeight: 800, fontSize: 21, color: 'white', marginTop: 10, letterSpacing: 1}}>{label}</div>
							</div>
						);
					})}
				</div>
			</Phone>
		</AbsoluteFill>
	);
};

/** Post de Jason e Lucia com reações e comentários de NPCs */
const Reactions: React.FC<{start: number; dur: number; jlAt: number}> = ({start, dur, jlAt}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	const t = start + frame / 30;
	const likes = interpolate(t, [start + 0.5, start + dur], [120, 98000], {extrapolateLeft: 'clamp'});
	const comments: [string, number][] = [
		['"Eu vi isso ao vivo 😱"', start + 1.2],
		['"Quem são esses dois??"', start + 2.4],
		['"Vice City não para 🔥"', start + 3.6],
	];
	const j = useAt(start, jlAt);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<IllusTag />
			<div style={{position: 'absolute', top: 360, left: SAFE.left, right: 140, background: 'rgba(255,255,255,0.96)', borderRadius: 28, padding: '22px 26px', opacity: s, transform: `translateY(${(1 - s) * 60}px)`, boxShadow: '0 20px 50px rgba(0,0,0,0.5)'}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
					<div style={{width: 72, height: 72, borderRadius: 36, background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40}}>📍</div>
					<div style={{fontFamily: UI, fontWeight: 800, fontSize: 28, color: C.ink}}>
						{t >= jlAt ? (
							<span style={{opacity: j}}>
								@jason <span style={{color: '#999'}}>&</span> @lucia
							</span>
						) : (
							'@vicecity.agora'
						)}
					</div>
				</div>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 30, color: C.ink, marginTop: 14}}>❤️ {fmtCount(likes)} curtidas</div>
				{comments.map(([c, at]) => {
					const p = spring({frame: frame - f(at - start), fps: 30, config: {damping: 12, stiffness: 260}});
					return t >= at ? (
						<div key={c} style={{fontFamily: UI, fontWeight: 600, fontSize: 28, color: '#333', marginTop: 10, opacity: p, transform: `translateX(${(1 - p) * 80}px)`}}>
							💬 {c}
						</div>
					) : null;
				})}
			</div>
			{['❤️', '😂', '😱', '🔥', '👏', '❤️', '😂', '🔥'].map((e, i) => {
				const d = (frame - i * 9) / 30;
				if (d < 0) return null;
				const y = 980 - d * 260;
				return <div key={i} style={{position: 'absolute', left: 720 + Math.sin(d * 3 + i) * 70, top: y, fontSize: 64, opacity: interpolate(d, [0, 0.2, 2.2, 2.8], [0, 1, 1, 0], {extrapolateRight: 'clamp'})}}>{e}</div>;
			})}
		</AbsoluteFill>
	);
};

const Detail: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 10, 300);
	const out = useOut(dur);
	const pulse = 1 + 0.05 * Math.sin(frame / 3);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 380, left: 540 - 210, width: 420, height: 420, borderRadius: 210, border: `14px solid ${C.yellow}`, transform: `scale(${s * pulse})`, opacity: s, boxShadow: '0 0 0 2000px rgba(0,0,0,0.45)'}} />
			<div style={{position: 'absolute', top: 740, left: 540 + 110, width: 46, height: 190, background: C.yellow, borderRadius: 20, transform: `rotate(-40deg) scale(${s})`, transformOrigin: 'top center'}} />
			<div style={{position: 'absolute', top: 300, width: '100%', textAlign: 'center', opacity: s}}>
				<Chip bg={C.yellow} color={C.ink} size={38}>
					O DETALHE MAIS IMPORTANTE
				</Chip>
			</div>
		</AbsoluteFill>
	);
};

const Consequences: React.FC<{start: number; dur: number; aAt: number; bAt: number}> = ({start, dur, aAt, bAt}) => {
	const a = useAt(start, aAt, 11, 280);
	const b = useAt(start, bAt, 11, 280);
	const out = useOut(dur);
	const row = (text: string, p: number) => (
		<div style={{display: 'flex', alignItems: 'center', gap: 18, background: 'rgba(11,6,18,0.9)', borderRadius: 16, padding: '14px 22px', marginTop: 16, opacity: p, transform: `translateX(${(1 - p) * 220}px)`, borderLeft: `10px solid ${C.orange}`}}>
			<span style={{fontFamily: DISPLAY, fontSize: 54, color: C.orange}}>?</span>
			<span style={{fontFamily: DISPLAY, fontSize: 54, color: 'white', lineHeight: 1.05}}>{text}</span>
		</div>
	);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 760, left: SAFE.left, right: 140}}>
				{row('POSTS ALTERAM A HISTÓRIA', a)}
				{row('CONSEQUÊNCIAS NA JOGABILIDADE', b)}
			</div>
		</AbsoluteFill>
	);
};

const Checklist: React.FC<{start: number; dur: number; yesAt: number; noAt: number}> = ({start, dur, yesAt, noAt}) => {
	const y = useAt(start, yesAt, 11, 280);
	const n = useAt(start, noAt, 11, 280);
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	const row = (ok: boolean, text: string, p: number) => (
		<div style={{display: 'flex', alignItems: 'center', gap: 20, background: 'rgba(11,6,18,0.9)', borderRadius: 16, padding: '16px 22px', marginTop: 18, opacity: p, transform: `translateX(${(1 - p) * 220}px)`, borderLeft: `10px solid ${ok ? GREEN : C.red}`}}>
			<div style={{width: 76, height: 76, borderRadius: 38, background: ok ? GREEN : C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
				<span style={{fontFamily: DISPLAY, fontSize: 56, color: C.ink}}>{ok ? '✓' : '✗'}</span>
			</div>
			<span style={{fontFamily: DISPLAY, fontSize: 54, color: 'white', lineHeight: 1.05}}>{text}</span>
		</div>
	);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 380, left: SAFE.left, right: 140}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 28, letterSpacing: 6, color: C.yellow, textShadow: '0 2px 8px #000', opacity: s}}>O QUE OS TRAILERS MOSTRAM</div>
				{row(true, 'CELULARES E CONTEÚDO DIGITAL', y)}
				{row(false, 'ESSAS MECÂNICAS COMPROVADAS', n)}
			</div>
		</AbsoluteFill>
	);
};

/** "Se a Rockstar..." → acessório vira parte da experiência */
const Upgrade: React.FC<{start: number; dur: number; accAt: number; partAt: number}> = ({start, dur, accAt, partAt}) => {
	const a = useAt(start, accAt, 12, 260);
	const p = useAt(start, partAt, 9, 300);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 400, left: SAFE.left, right: 140, textAlign: 'center'}}>
				<div style={{opacity: a, transform: `translateY(${(1 - a) * 40}px)`}}>
					<span style={{fontFamily: DISPLAY, fontSize: 86, color: 'rgba(255,255,255,0.75)', textShadow: '0 5px 0 #000', textDecoration: p > 0.5 ? 'line-through' : 'none'}}>APENAS UM ACESSÓRIO</span>
				</div>
				<div style={{fontFamily: DISPLAY, fontSize: 90, color: C.yellow, opacity: p, lineHeight: 1}}>↓</div>
				<div style={{opacity: p, transform: `scale(${interpolate(p, [0, 1], [1.8, 1])})`}}>
					<div style={{display: 'inline-block', fontFamily: DISPLAY, fontSize: 100, lineHeight: 1.05, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 6px 0 #000)'}}>PARTE DA EXPERIÊNCIA</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ------------------------------------------------------------------ timeline

export const CelularOverlays: React.FC = () => (
	<AbsoluteFill>
		<At from={0} to={2.36}>
			<HookTitle dur={2.36} />
		</At>
		<At from={2.36} to={8.5}>
			<PhoneNotifs start={2.36} dur={6.14} msgAt={7.46} moreAt={8.5} />
		</At>
		<At from={8.5} to={12.62}>
			<Branches dur={4.12} />
		</At>
		<At from={12.62} to={16.84}>
			<StayTill start={12.62} dur={4.22} possAt={14.36} />
		</At>
		<At from={20.3} to={24.52}>
			<SeenInTrailers
				start={20.3}
				dur={4.22}
				items={[
					['📱 CELULARES', 20.52],
					['🎥 VÍDEOS', 21.44],
					['❤️ REDES SOCIAIS', 21.98],
				]}
			/>
		</At>
		<At from={26.54} to={27.36}>
			<AbsoluteFill style={{alignItems: 'center', top: 820}}>
				<Chip bg={C.pink} size={52}>
					🌴 VICE CITY
				</Chip>
			</AbsoluteFill>
		</At>
		<At from={27.36} to={32.38}>
			<Followers start={27.36} dur={5.02} boomAt={30.38} />
		</At>
		<At from={32.38} to={34.5}>
			<TitleCard
				start={32.38}
				top={640}
				lines={[
					{text: 'AGORA IMAGINA', at: 32.45},
					{text: 'A SITUAÇÃO', at: 33.14, big: true},
				]}
			/>
		</At>
		<At from={35.3} to={36.86}>
			<Stamp text="ABSURDO NA RUA" top={460} color={C.yellow} />
		</At>
		<At from={36.86} to={39.8}>
			<RecUpload start={36.86} dur={2.94} postAt={37.88} />
		</At>
		<At from={39.8} to={43.42}>
			<Viral start={39.8} dur={3.62} />
		</At>
		<At from={43.42} to={46.18}>
			<Influencer dur={2.76} />
		</At>
		<At from={46.18} to={49.68}>
			<PoliceSaw start={46.18} dur={3.5} alertAt={47.38} />
		</At>
		<At from={49.68} to={54.7}>
			<MoreThanMenu start={49.68} dur={5.02} crossAt={53.84} />
		</At>
		<At from={54.7} to={62.26}>
			<AppGrid start={54.7} dur={7.56} />
		</At>
		<At from={62.26} to={64.4}>
			<Stamp text="OUTRA POSSIBILIDADE" top={480} color={C.cyan} />
		</At>
		<At from={64.4} to={70.56}>
			<Reactions start={64.4} dur={6.16} jlAt={69.4} />
		</At>
		<At from={70.56} to={74.22}>
			<AbsoluteFill style={{alignItems: 'center', top: 470}}>
				<Chip bg={GREEN} color={C.ink} size={50}>
					🌎 UM MUNDO AINDA MAIS VIVO
				</Chip>
			</AbsoluteFill>
		</At>
		<At from={74.22} to={76.8}>
			<Detail dur={2.58} />
		</At>
		<At from={76.8} to={84.7}>
			<NotConfirmed dur={7.9} rockstarAt={0.6} />
		</At>
		<At from={78.26} to={84.7}>
			<Consequences start={78.26} dur={6.44} aAt={80.02} bAt={81.98} />
		</At>
		<At from={84.7} to={92.36}>
			<Checklist start={84.7} dur={7.66} yesAt={87.2} noAt={89.7} />
		</At>
		<At from={93.44} to={96.8}>
			<AbsoluteFill style={{alignItems: 'center', top: 470}}>
				<Chip bg={C.purple} size={46}>
					SE VIRAR UMA MECÂNICA PROFUNDA…
				</Chip>
			</AbsoluteFill>
		</At>
		<At from={96.8} to={102.96}>
			<Upgrade start={96.8} dur={6.16} accAt={98.38} partAt={100.56} />
		</At>
		<At from={102.96} to={104.16}>
			<AbsoluteFill style={{alignItems: 'center', top: 470}}>
				<Chip bg={C.pink} size={52}>
					AGORA ME RESPONDE 👇
				</Chip>
			</AbsoluteFill>
		</At>
		<At from={104.16} to={114.64}>
			<Poll start={104.16} aAt={106.62} bAt={112.22} a="VIRALIZAR É TOP 🔥" b="IRRITANTE EM 5 MIN 🙄" />
		</At>
		<At from={116.4} to={122.6}>
			<EndCard start={116.4} subAt={116.74} />
		</At>
		<At from={118.6} to={122.6}>
			<AbsoluteFill style={{alignItems: 'center', top: 1120}}>
				<div style={{fontFamily: DISPLAY, fontSize: 66, color: 'white', textAlign: 'center', textShadow: '0 5px 0 #000', padding: '0 80px', whiteSpace: 'pre-line'}}>{'INVESTIGANDO CADA DETALHE\nDE GTA 6'}</div>
			</AbsoluteFill>
		</At>
	</AbsoluteFill>
);
