import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {At, Chip, TitleCard, useOut, useSpring} from '../components/Overlays';
import {NotConfirmed, Poll} from '../preso/Overlays';
import {C, DISPLAY, GRAD, SAFE, UI, f} from '../theme';

const BLUE = '#2E8BFF';

/** Rótulo honesto para telas que não são do jogo */
const Concept: React.FC<{top: number}> = ({top}) => (
	<div style={{position: 'absolute', top, left: SAFE.left}}>
		<div style={{fontFamily: UI, fontWeight: 800, fontSize: 24, letterSpacing: 5, color: C.ink, background: C.yellow, padding: '6px 14px', borderRadius: 6}}>
			ILUSTRAÇÃO · NÃO É TELA DO JOGO
		</div>
	</div>
);

const typed = (text: string, frame: number, start: number, cps = 18) =>
	text.slice(0, Math.max(0, Math.floor(((frame - f(start)) / 30) * cps)));

// ------------------------------------------------------------------ elementos

const HookTitle: React.FC<{dur: number}> = ({dur}) => {
	const s = useSpring(0, 12, 260);
	const g = useSpring(1.06, 10, 300);
	const out = useOut(dur, 4);
	return (
		<AbsoluteFill style={{alignItems: 'center', top: 420, opacity: out}}>
			<div style={{textAlign: 'center', transform: `scale(${interpolate(s, [0, 1], [1.5, 1])})`, opacity: s}}>
				<div style={{display: 'inline-flex', alignItems: 'center', gap: 18, background: 'rgba(255,255,255,0.95)', borderRadius: 60, padding: '14px 34px'}}>
					<svg width={56} height={56} viewBox="0 0 24 24">
						<circle cx="12" cy="12" r="10" fill="none" stroke={BLUE} strokeWidth={2.4} />
						<path d="M2 12h20M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20" fill="none" stroke={BLUE} strokeWidth={2} />
					</svg>
					<span style={{fontFamily: DISPLAY, fontSize: 104, color: C.ink, letterSpacing: 2}}>INTERNET</span>
				</div>
				<div style={{fontFamily: DISPLAY, fontSize: 120, marginTop: 14, opacity: g, transform: `scale(${interpolate(g, [0, 1], [1.8, 1])})`, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 6px 0 #000)'}}>
					NO GTA 6?
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Barra de navegador digitando + barra de carregamento */
const Browser: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 260);
	const out = useOut(dur);
	const url = typed('www.', frame, 0.1, 10) + (frame > f(0.5) ? '•••••.com' : '');
	const load = interpolate(frame, [f(0.6), f(dur)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{opacity: out}}>
			<Concept top={330} />
			<div style={{position: 'absolute', top: 400, left: SAFE.left, right: 140, transform: `translateY(${(1 - s) * -80}px)`, opacity: s}}>
				<div style={{background: 'rgba(255,255,255,0.96)', borderRadius: 26, padding: '22px 30px', display: 'flex', alignItems: 'center', gap: 18, boxShadow: '0 20px 50px rgba(0,0,0,0.5)'}}>
					<svg width={44} height={44} viewBox="0 0 24 24">
						<rect x="5" y="10" width="14" height="10" rx="2" fill="#555" />
						<path d="M8 10V7a4 4 0 018 0v3" fill="none" stroke="#555" strokeWidth={2.4} />
					</svg>
					<span style={{fontFamily: UI, fontWeight: 800, fontSize: 48, color: C.ink}}>{url}</span>
				</div>
				<div style={{marginTop: 14, height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.2)', overflow: 'hidden'}}>
					<div style={{width: `${load * 100}%`, height: '100%', background: BLUE}} />
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Letreiro de notícias (genérico) */
const NewsTicker: React.FC<{dur: number; label: string; text: string; color: string}> = ({dur, label, text, color}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 14, 260);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<Concept top={330} />
			<div style={{position: 'absolute', top: 820, left: 0, right: 0, transform: `translateX(${(1 - s) * -1080}px)`, display: 'flex', height: 110, boxShadow: '0 16px 40px rgba(0,0,0,0.5)'}}>
				<div style={{background: color, padding: '0 30px', display: 'flex', alignItems: 'center'}}>
					<span style={{fontFamily: DISPLAY, fontSize: 64, color: 'white', letterSpacing: 2}}>{label}</span>
				</div>
				<div style={{flex: 1, background: 'rgba(255,255,255,0.95)', overflow: 'hidden', display: 'flex', alignItems: 'center'}}>
					<span style={{fontFamily: DISPLAY, fontSize: 58, color: C.ink, whiteSpace: 'nowrap', transform: `translateX(${40 - frame * 9}px)`}}>
						{text}
					</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Caixa de busca digitando "vice city" + resultados esqueleto */
const Search: React.FC<{dur: number; typeAt: number}> = ({dur, typeAt}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 260);
	const out = useOut(dur);
	const q = typed('vice city', frame, typeAt, 14);
	const caret = Math.floor(frame / 8) % 2 === 0;
	const results = frame > f(typeAt + 0.8);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<Concept top={330} />
			<div style={{position: 'absolute', top: 400, left: SAFE.left, right: 140, opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.85, 1])})`}}>
				<div style={{background: 'rgba(255,255,255,0.97)', borderRadius: 60, padding: '22px 34px', display: 'flex', alignItems: 'center', gap: 20, boxShadow: '0 20px 50px rgba(0,0,0,0.5)'}}>
					<svg width={52} height={52} viewBox="0 0 24 24">
						<circle cx="10" cy="10" r="6.5" fill="none" stroke="#444" strokeWidth={2.6} />
						<path d="M15 15l6 6" stroke="#444" strokeWidth={2.8} strokeLinecap="round" />
					</svg>
					<span style={{fontFamily: UI, fontWeight: 800, fontSize: 56, color: C.ink}}>
						{q}
						<span style={{color: BLUE, opacity: caret ? 1 : 0}}>|</span>
					</span>
				</div>
				{[0, 1, 2].map((i) => {
					const r = spring({frame: frame - f(typeAt + 0.8) - i * 4, fps: 30, config: {damping: 14, stiffness: 240}});
					return results ? (
						<div key={i} style={{marginTop: 18, background: 'rgba(11,6,18,0.82)', borderRadius: 18, padding: '18px 24px', opacity: r, transform: `translateY(${(1 - r) * 40}px)`}}>
							<div style={{width: 360 - i * 60, height: 22, borderRadius: 11, background: BLUE, opacity: 0.85}} />
							<div style={{marginTop: 12, width: 640 - i * 40, height: 16, borderRadius: 8, background: 'rgba(255,255,255,0.35)'}} />
						</div>
					) : null;
				})}
			</div>
		</AbsoluteFill>
	);
};

/** "MOSTRAR" × "INTERAGIR" */
const ShowVsInteract: React.FC<{start: number}> = ({start}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const top = spring({frame, fps, config: {damping: 18, stiffness: 200}});
	const bot = spring({frame: frame - 6, fps, config: {damping: 18, stiffness: 200}});
	const t1 = spring({frame: frame - f(15.82 - start), fps, config: {damping: 10, stiffness: 300}});
	const t2 = spring({frame: frame - f(18.36 - start), fps, config: {damping: 10, stiffness: 300}});
	const tap = (frame - f(19.42 - start)) % 24;
	const tapOn = frame >= f(19.42 - start);
	const feed = (i: number) => (
		<div key={i} style={{background: 'rgba(255,255,255,0.12)', borderRadius: 18, height: 150, margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: 18, padding: '0 20px'}}>
			<div style={{width: 110, height: 110, borderRadius: 14, background: 'rgba(255,255,255,0.25)'}} />
			<div>
				<div style={{width: 380, height: 20, borderRadius: 10, background: 'rgba(255,255,255,0.4)'}} />
				<div style={{width: 260, height: 16, borderRadius: 8, background: 'rgba(255,255,255,0.25)', marginTop: 12}} />
			</div>
		</div>
	);
	return (
		<AbsoluteFill style={{background: '#07040c'}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 960, overflow: 'hidden', transform: `translateX(${(1 - top) * -1080}px)`, background: 'linear-gradient(180deg,#1a1030,#0b0612)'}}>
				<div style={{position: 'absolute', left: 140, right: 140, top: 160 - ((frame * 4) % 168)}}>{[0, 1, 2, 3, 4, 5].map(feed)}</div>
				<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(11,6,18,0.2) 40%, rgba(11,6,18,0.95) 85%)'}} />
				<div style={{position: 'absolute', bottom: 70, width: '100%', textAlign: 'center', opacity: t1, transform: `scale(${interpolate(t1, [0, 1], [2, 1])})`}}>
					<svg width={90} height={90} viewBox="0 0 24 24" style={{verticalAlign: 'middle', marginRight: 16}}>
						<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" fill="none" stroke={C.cyan} strokeWidth={2} />
						<circle cx="12" cy="12" r="3.5" fill={C.cyan} />
					</svg>
					<span style={{fontFamily: DISPLAY, fontSize: 150, color: C.cyan, textShadow: '0 8px 0 #000', verticalAlign: 'middle'}}>MOSTRAR</span>
				</div>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 960, height: 960, overflow: 'hidden', transform: `translateX(${(1 - bot) * 1080}px)`, background: 'linear-gradient(180deg,#2a0c1e,#0b0612)'}}>
				<div style={{position: 'absolute', top: 60, width: '100%', textAlign: 'center', opacity: 0.25 + 0.75 * t2, transform: `scale(${interpolate(t2, [0, 1], [1, 1.12])})`}}>
					<span style={{fontFamily: DISPLAY, fontSize: 150, color: C.pink, textShadow: '0 8px 0 #000'}}>INTERAGIR</span>
				</div>
				<div style={{position: 'absolute', left: 340, top: 330, width: 400, height: 110, borderRadius: 55, background: C.pink, opacity: 0.35 + 0.65 * t2, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${tapOn && tap < 6 ? 0.92 : 1})`}}>
					<span style={{fontFamily: UI, fontWeight: 800, fontSize: 44, color: 'white', letterSpacing: 4}}>ABRIR</span>
				</div>
				{tapOn ? (
					<>
						<div style={{position: 'absolute', left: 540 - tap * 6, top: 385 - tap * 6, width: tap * 12, height: tap * 12, borderRadius: '50%', border: '6px solid white', opacity: 1 - tap / 24}} />
						<svg width={110} height={130} viewBox="0 0 24 28" style={{position: 'absolute', left: 520, top: 380 + (tap < 6 ? 6 : 0)}}>
							<path d="M9 2a2 2 0 014 0v9l5 1c2 .4 3 2 2.6 4l-1.4 7c-.3 1.5-1.6 3-3.2 3H10c-1.4 0-2.6-.8-3.2-2L3 17c-.6-1.2 0-2.6 1.3-3 1-.3 2 .1 2.6.9L9 17z" fill="white" stroke="#000" strokeWidth={1.2} />
						</svg>
					</>
				) : null}
			</div>
			<div style={{position: 'absolute', top: 948, left: 0, right: 0, height: 24, background: GRAD}} />
		</AbsoluteFill>
	);
};

/** Moldura de post com curtidas subindo (sobre imagem oficial) */
const SocialPost: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 14, 240);
	const out = useOut(dur);
	const likes = Math.floor(interpolate(frame, [0, f(dur)], [1200, 98400], {extrapolateRight: 'clamp'}));
	const hearts = [0, 1, 2, 3, 4, 5, 6, 7];
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 330, left: SAFE.left}}>
				<Chip bg={C.ink} size={26}>
					IMAGEM OFICIAL DE DIVULGAÇÃO
				</Chip>
			</div>
			<div style={{position: 'absolute', top: 420, left: SAFE.left, right: 140, display: 'flex', alignItems: 'center', gap: 16, opacity: s, transform: `translateY(${(1 - s) * -40}px)`}}>
				<div style={{width: 76, height: 76, borderRadius: 38, background: GRAD, border: '4px solid white'}} />
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 36, color: 'white', textShadow: '0 2px 8px #000'}}>redes sociais no universo de GTA 6</div>
			</div>
			<div style={{position: 'absolute', top: 920, left: SAFE.left, display: 'flex', alignItems: 'center', gap: 14, opacity: s}}>
				<span style={{fontSize: 64, color: C.pink, textShadow: '0 2px 10px #000'}}>♥</span>
				<span style={{fontFamily: DISPLAY, fontSize: 64, color: 'white', textShadow: '0 4px 0 #000'}}>{likes.toLocaleString('pt-BR')}</span>
			</div>
			{hearts.map((i) => {
				const p = ((frame + i * 9) % 60) / 60;
				return (
					<span key={i} style={{position: 'absolute', left: 840 + Math.sin(i * 2 + p * 6) * 40, top: 1000 - p * 600, fontSize: 54 + (i % 3) * 10, color: i % 2 ? C.pink : C.red, opacity: (1 - p) * s}}>
						♥
					</span>
				);
			})}
		</AbsoluteFill>
	);
};

/** Visor de gravação ("cheio de vídeos") */
const RecHud: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const out = useOut(dur, 3);
	const blink = Math.floor(frame / 12) % 2 === 0;
	const c = (l: boolean, t: boolean) => (
		<div style={{position: 'absolute', left: l ? 60 : 1080 - 60 - 90, top: t ? 300 : 1060, width: 90, height: 90, borderColor: 'white', borderStyle: 'solid', borderWidth: `${t ? 6 : 0}px ${l ? 0 : 6}px ${t ? 0 : 6}px ${l ? 6 : 0}px`}} />
	);
	const secs = Math.floor(frame / 30);
	return (
		<AbsoluteFill style={{opacity: out}}>
			{c(true, true)}
			{c(false, true)}
			{c(true, false)}
			{c(false, false)}
			<div style={{position: 'absolute', top: 320, left: 180, display: 'flex', alignItems: 'center', gap: 12, fontFamily: UI, fontWeight: 800, fontSize: 36, color: 'white', textShadow: '0 2px 8px #000'}}>
				<div style={{width: 26, height: 26, borderRadius: 13, background: C.red, opacity: blink ? 1 : 0.2}} />
				REC 00:{String(secs).padStart(2, '0')}
			</div>
		</AbsoluteFill>
	);
};

const PHONE = {x: 290, y: 240, w: 500, h: 860};

/** Celular imaginado: bloqueio → Jason → Lucia → feed com posts, comentários e notícia */
const Phone: React.FC<{start: number; dur: number}> = ({start, dur}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 14, 200);
	const out = useOut(dur);
	const at = (x: number) => f(x - start);
	const wallpaper = frame < at(35.82) ? 'v2/jason-night-v.jpg' : 'v2/lucia-v.jpg';
	const showWall = frame >= at(35.16) && frame < at(36.68);
	const feedOn = frame >= at(36.68);
	const scroll = interpolate(frame, [at(36.68), at(41.6)], [0, 620], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const comment = spring({frame: frame - at(38.4), fps: 30, config: {damping: 12, stiffness: 260}});
	const news = spring({frame: frame - at(39.22), fps: 30, config: {damping: 12, stiffness: 260}});
	const post = (src: string, i: number, caption: string) => (
		<div key={src} style={{background: '#16121e', borderRadius: 18, overflow: 'hidden', marginBottom: 16}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px'}}>
				<div style={{width: 36, height: 36, borderRadius: 18, background: i % 2 ? C.pink : C.cyan}} />
				<div style={{width: 150, height: 14, borderRadius: 7, background: 'rgba(255,255,255,0.45)'}} />
			</div>
			<Img src={staticFile(src)} style={{width: '100%', height: 250, objectFit: 'cover'}} />
			<div style={{padding: '10px 14px', fontFamily: UI, fontWeight: 600, fontSize: 22, color: 'rgba(255,255,255,0.8)'}}>{caption}</div>
		</div>
	);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<Concept top={160} />
			<div
				style={{
					position: 'absolute',
					left: PHONE.x,
					top: PHONE.y,
					width: PHONE.w,
					height: PHONE.h,
					borderRadius: 64,
					background: '#0d0b12',
					border: '10px solid #2b2733',
					boxShadow: '0 40px 90px rgba(0,0,0,0.7)',
					overflow: 'hidden',
					transform: `translateY(${(1 - s) * 1300}px) rotate(${(1 - s) * 8}deg)`,
				}}
			>
				{!showWall && !feedOn ? (
					<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg,#2a1450,#0b0612)'}}>
						<div style={{fontFamily: UI, fontWeight: 600, fontSize: 120, color: 'white'}}>21:47</div>
						<div style={{marginTop: 40, background: 'rgba(255,255,255,0.15)', borderRadius: 22, padding: '18px 22px', width: 400, opacity: frame > at(34.4) ? 1 : 0}}>
							<div style={{fontFamily: UI, fontWeight: 800, fontSize: 24, color: 'white'}}>Nova notificação</div>
							<div style={{marginTop: 8, width: 300, height: 14, borderRadius: 7, background: 'rgba(255,255,255,0.4)'}} />
						</div>
					</AbsoluteFill>
				) : null}
				{showWall ? (
					<AbsoluteFill>
						<Img src={staticFile(wallpaper)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
						<div style={{position: 'absolute', bottom: 40, width: '100%', textAlign: 'center', fontFamily: DISPLAY, fontSize: 70, color: 'white', textShadow: '0 4px 0 #000'}}>
							{frame < at(35.82) ? 'JASON' : 'LUCIA'}
						</div>
					</AbsoluteFill>
				) : null}
				{feedOn ? (
					<AbsoluteFill style={{background: '#09070d'}}>
						<div style={{position: 'absolute', left: 16, right: 16, top: 70 - scroll}}>
							{post('img/people-car.jpg', 0, 'publicação')}
							{post('img/couple-palms.jpg', 1, 'publicação')}
							{post('img/boats-skyline.jpg', 2, 'publicação')}
						</div>
						<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 60, background: '#09070d', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<div style={{width: 120, height: 14, borderRadius: 7, background: 'rgba(255,255,255,0.4)'}} />
						</div>
					</AbsoluteFill>
				) : null}
			</div>
			{/* balão de comentário e card de notícia saindo do celular */}
			<div style={{position: 'absolute', left: 70, top: 640, opacity: comment, transform: `scale(${comment})`, transformOrigin: 'right center'}}>
				<div style={{background: 'white', borderRadius: 24, padding: '14px 22px', boxShadow: '0 12px 30px rgba(0,0,0,0.5)'}}>
					<div style={{fontFamily: UI, fontWeight: 800, fontSize: 24, color: '#666'}}>comentário</div>
					<div style={{marginTop: 8, width: 220, height: 16, borderRadius: 8, background: '#bbb'}} />
				</div>
			</div>
			<div style={{position: 'absolute', right: 70, top: 840, opacity: news, transform: `scale(${news})`, transformOrigin: 'left center'}}>
				<div style={{background: C.red, borderRadius: 18, padding: '14px 22px', boxShadow: '0 12px 30px rgba(0,0,0,0.5)'}}>
					<div style={{fontFamily: DISPLAY, fontSize: 44, color: 'white'}}>NOTÍCIA</div>
					<div style={{marginTop: 6, width: 220, height: 14, borderRadius: 7, background: 'rgba(255,255,255,0.6)'}} />
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Moldura de "post" em volta da cena + visualizações */
const PostFrame: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	const views = Math.floor(interpolate(frame, [0, f(dur)], [2400, 312000]));
	return (
		<AbsoluteFill style={{opacity: out * s}}>
			<Concept top={330} />
			<div style={{position: 'absolute', left: 50, right: 50, top: 400, bottom: 860, border: '8px solid white', borderRadius: 30, boxShadow: '0 0 0 2000px rgba(0,0,0,0.35)'}} />
			<div style={{position: 'absolute', top: 1080 - 80, left: 70, display: 'flex', gap: 30, alignItems: 'center', fontFamily: UI, fontWeight: 800, fontSize: 36, color: 'white', textShadow: '0 2px 8px #000'}}>
				<span>▶ {views.toLocaleString('pt-BR')} visualizações</span>
			</div>
		</AbsoluteFill>
	);
};

/** Documento com tarjas pretas ("informações escondidas") */
const Redacted: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	const scan = (frame * 10) % 520;
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 380, left: SAFE.left + 20, right: 160, background: '#efe9dc', borderRadius: 8, padding: '30px 34px', transform: `rotate(-2deg) scale(${interpolate(s, [0, 1], [0.8, 1])})`, opacity: s, boxShadow: '0 30px 60px rgba(0,0,0,0.6)', overflow: 'hidden'}}>
				<div style={{fontFamily: DISPLAY, fontSize: 56, color: C.red, letterSpacing: 3}}>INFORMAÇÕES ESCONDIDAS</div>
				{[0.9, 0.7, 0.95, 0.55, 0.8].map((w, i) => (
					<div key={i} style={{marginTop: 22, height: 34, width: `${w * 100}%`, background: '#111', borderRadius: 3}} />
				))}
				<div style={{position: 'absolute', left: 0, right: 0, top: 80 + scan, height: 6, background: 'rgba(46,139,255,0.6)', boxShadow: '0 0 20px rgba(46,139,255,0.8)'}} />
			</div>
		</AbsoluteFill>
	);
};

const NOT_PROMISED: [string, number][] = [
	['NAVEGADOR COMPLETO', 69.22],
	['SITES INTERATIVOS', 71.12],
	['INTERNET COMO A NOSSA', 73.22],
];
const NotPromised: React.FC<{start: number; dur: number}> = ({start, dur}) => {
	const out = useOut(dur);
	const s = useSpring(0, 14, 220);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 400, left: SAFE.left, right: 140, opacity: s}}>
				<div style={{fontFamily: DISPLAY, fontSize: 84, lineHeight: 1.05, color: C.yellow, textShadow: '0 6px 0 #000', marginBottom: 10}}>NÃO SIGNIFICA QUE TEREMOS:</div>
				{NOT_PROMISED.map(([label, at]) => (
					<NotRow key={label} label={label} delay={at - start} />
				))}
			</div>
		</AbsoluteFill>
	);
};
const NotRow: React.FC<{label: string; delay: number}> = ({label, delay}) => {
	const frame = useCurrentFrame();
	const s = useSpring(delay, 12, 300);
	if (frame < f(delay)) return null;
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 20, background: 'rgba(11,6,18,0.85)', borderRadius: 12, padding: '14px 22px', margin: '14px 0', opacity: s, transform: `translateX(${(1 - s) * -100}px)`}}>
			<div style={{width: 64, height: 64, borderRadius: 32, background: C.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transform: `scale(${interpolate(s, [0, 1], [1.8, 1])})`}}>
				<span style={{fontFamily: UI, fontWeight: 800, fontSize: 42, color: C.ink}}>?</span>
			</div>
			<span style={{fontFamily: DISPLAY, fontSize: 62, color: 'white'}}>{label}</span>
		</div>
	);
};

const OptionCard: React.FC<{letter: string; title: string; sub: string; color: string; revealAt: number; dur: number}> = ({letter, title, sub, color, revealAt, dur}) => {
	const s = useSpring(0, 13, 240);
	const r = useSpring(revealAt, 11, 280);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 420, left: SAFE.left, right: 140, opacity: s, transform: `translateY(${(1 - s) * 60}px)`}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 22}}>
					<div style={{width: 120, height: 120, borderRadius: 24, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 30px rgba(0,0,0,0.5)'}}>
						<span style={{fontFamily: DISPLAY, fontSize: 96, color: 'white'}}>{letter}</span>
					</div>
					<span style={{fontFamily: UI, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: 'white', textShadow: '0 2px 8px #000'}}>POSSIBILIDADE</span>
				</div>
				<div style={{marginTop: 22, background: 'rgba(11,6,18,0.85)', borderLeft: `10px solid ${color}`, borderRadius: 12, padding: '18px 26px'}}>
					<div style={{fontFamily: DISPLAY, fontSize: 70, color: 'white', lineHeight: 1.1}}>{title}</div>
					<div style={{fontFamily: UI, fontWeight: 800, fontSize: 30, color, marginTop: 8, opacity: r}}>{sub}</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ------------------------------------------------------------------ timeline

export const InternetOverlays: React.FC = () => (
	<AbsoluteFill>
		<At from={0} to={1.76}>
			<HookTitle dur={1.76} />
		</At>
		<At from={5.9} to={7.46}>
			<Browser dur={1.56} />
		</At>
		<At from={7.46} to={8.84}>
			<NewsTicker dur={1.38} label="NOTÍCIAS" text="VICE CITY  •  LEONIDA  •  VICE CITY  •  LEONIDA  •" color={BLUE} />
		</At>
		<At from={8.84} to={12.3}>
			<Search dur={3.46} typeAt={10.08 - 8.84} />
		</At>
		<At from={15.56} to={21.5}>
			<ShowVsInteract start={15.56} />
		</At>
		<At from={21.5} to={26.16}>
			<SocialPost dur={4.66} />
		</At>
		<At from={26.16} to={33.0}>
			<RecHud dur={6.84} />
		</At>
		<At from={33.0} to={41.9}>
			<Phone start={33.0} dur={8.9} />
		</At>
		<At from={44.26} to={45.9}>
			<PostFrame dur={1.64} />
		</At>
		<At from={47.86} to={50.6}>
			<NewsTicker dur={2.74} label="URGENTE" text="CONFUSÃO NA CIDADE  •  AO VIVO  •  CONFUSÃO NA CIDADE  •" color={C.red} />
		</At>
		<At from={50.6} to={54.4}>
			<Redacted dur={3.8} />
		</At>
		<At from={59.94} to={64.6}>
			<NotConfirmed dur={4.66} rockstarAt={62.12 - 59.94} />
		</At>
		<At from={64.84} to={76.0}>
			<NotPromised start={64.84} dur={11.16} />
		</At>
		<At from={76.0} to={78.1}>
			<TitleCard
				start={76.0}
				top={680}
				lines={[
					{text: 'E AQUI ESTÁ', at: 76.14},
					{text: 'A GRANDE', at: 77.28},
					{text: 'DIFERENÇA', at: 77.54, big: true},
				]}
			/>
		</At>
		<At from={78.1} to={83.3}>
			<OptionCard letter="A" title="INTERNET SÓ PARA CONTAR HISTÓRIAS" sub="você vê, mas não interage" color="#1FA7C9" revealAt={81.88 - 78.1} dur={5.2} />
		</At>
		<At from={83.3} to={88.6}>
			<OptionCard letter="B" title="INTERNET PARA O JOGADOR INTERAGIR" sub="navegar, ler, descobrir" color={C.pink} revealAt={87.68 - 83.3} dur={5.3} />
		</At>
		<At from={88.74} to={95.4}>
			<Poll start={88.74} aAt={89.18} bAt={89.9} a="SÓ PARA CONTAR HISTÓRIAS" b="INTERNET INTERATIVA" />
		</At>
	</AbsoluteFill>
);
