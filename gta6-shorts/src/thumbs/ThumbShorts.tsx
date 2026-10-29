import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {WATERMARK} from '../brand';
import {C, DISPLAY, GRAD, UI} from '../theme';

// Thumbnails verticais 1080×1920 (formato Shorts) — padrão do canal a partir de 29/10.
// Imagem oficial em tela cheia, texto curto no terço superior (longe da área de UI do app), logo original do canal no topo.

type Line = {text: string; size: number; grad?: boolean; color?: string};

const Frame: React.FC<{credit: string; children: React.ReactNode}> = ({credit, children}) => (
	<AbsoluteFill style={{background: 'black', overflow: 'hidden'}}>
		{children}
		{WATERMARK === null ? null : (
			<Img src={staticFile(WATERMARK)} style={{position: 'absolute', top: 70, left: 60, width: 170, height: 170, borderRadius: 26, boxShadow: '0 8px 24px rgba(0,0,0,0.6)'}} />
		)}
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 60, textAlign: 'center', fontFamily: UI, fontWeight: 800, fontSize: 26, color: 'rgba(255,255,255,0.75)', letterSpacing: 3}}>{credit}</div>
	</AbsoluteFill>
);

const Title: React.FC<{lines: Line[]; top: number}> = ({lines, top}) => (
	<div style={{position: 'absolute', top, left: 0, right: 0, textAlign: 'center'}}>
		{lines.map((l) => (
			<div
				key={l.text}
				style={{
					fontFamily: DISPLAY,
					fontSize: l.size,
					lineHeight: 1.02,
					whiteSpace: 'nowrap',
					...(l.grad
						? {backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 10px 0 #000)'}
						: {color: l.color ?? 'white', textShadow: '0 10px 0 #000, 0 0 40px rgba(0,0,0,0.6)'}),
				}}
			>
				{l.text}
			</div>
		))}
	</div>
);

const Tag: React.FC<{text: string; top: number; bg?: string; rot?: number}> = ({text, top, bg = C.red, rot = -3}) => (
	<div style={{position: 'absolute', top, left: 0, right: 0, textAlign: 'center'}}>
		<div style={{display: 'inline-block', background: bg, transform: `rotate(${rot}deg)`, padding: '10px 36px 2px', borderRadius: 14, boxShadow: '0 14px 40px rgba(0,0,0,0.6)'}}>
			<span style={{fontFamily: DISPLAY, fontSize: 92, color: 'white', letterSpacing: 2, whiteSpace: 'nowrap'}}>{text}</span>
		</div>
	</div>
);

const Bg: React.FC<{src: string; pos: string; scale?: number}> = ({src, pos, scale = 1}) => (
	<Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${scale})`, filter: 'contrast(1.1) saturate(1.2)'}} />
);

const TopShade: React.FC<{to?: number}> = ({to = 62}) => <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(11,6,18,0.92) 0%, rgba(11,6,18,0.7) ${to - 22}%, rgba(11,6,18,0) ${to}%)`}} />;

/** "Jason mora de favor" — arte oficial do Brian Heder */
export const ThumbShortBrian: React.FC = () => (
	<Frame credit="ARTE OFICIAL: ROCKSTAR GAMES">
		<AbsoluteFill style={{background: 'linear-gradient(180deg, #2a1440, #0b0612)'}} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 800, bottom: 0, overflow: 'hidden'}}>
			<Bg src="v8/brian-art.jpg" pos="58% 20%" />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(11,6,18,0.85) 0%, rgba(11,6,18,0) 18%)'}} />
		</div>
		<Title
			top={300}
			lines={[
				{text: 'JASON MORA', size: 170},
				{text: 'DE FAVOR?', size: 220, grad: true},
			]}
		/>
		<Tag text="O ALUGUEL É OUTRO 😬" top={730} />
		<div style={{position: 'absolute', right: 90, bottom: 260, background: '#f3ecdc', border: '8px solid #2b1a0e', borderRadius: 18, padding: '12px 34px', transform: 'rotate(5deg)', boxShadow: '0 16px 40px rgba(0,0,0,0.6)'}}>
			<div style={{fontFamily: UI, fontWeight: 800, fontSize: 32, letterSpacing: 6, color: '#8a2a1a'}}>🏠 ALUGUEL</div>
			<div style={{fontFamily: DISPLAY, fontSize: 110, color: '#2b1a0e', lineHeight: 1}}>R$ 0,00</div>
		</div>
	</Frame>
);

/** "O celular de GTA 6" — Jason com o celular */
export const ThumbShortCelular: React.FC = () => (
	<Frame credit="IMAGEM OFICIAL: ROCKSTAR GAMES">
		<AbsoluteFill style={{background: 'linear-gradient(180deg, #1d0f2e, #0b0612)'}} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 860, bottom: 0, overflow: 'hidden'}}>
			<Bg src="v7/jason-phone.jpg" pos="47% 0%" />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(11,6,18,0.8) 0%, rgba(11,6,18,0) 14%)'}} />
		</div>
		<Title
			top={300}
			lines={[
				{text: '📱 O CELULAR', size: 150},
				{text: 'VAI MUDAR', size: 150},
				{text: 'GTA 6?', size: 240, grad: true},
			]}
		/>
		<div style={{position: 'absolute', left: 110, right: 110, bottom: 150, display: 'flex', gap: 22, alignItems: 'center', background: 'rgba(255,255,255,0.95)', borderRadius: 34, padding: '20px 30px', transform: 'rotate(-3deg)', boxShadow: '0 16px 40px rgba(0,0,0,0.6)'}}>
			<div style={{width: 100, height: 100, borderRadius: 24, background: C.pink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60}}>🔥</div>
			<div>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 28, color: '#666'}}>REDES SOCIAIS</div>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 48, color: C.ink}}>Você viralizou!</div>
			</div>
		</div>
	</Frame>
);

/** "A pista no dinheiro" — dinheiro oficial de GTA VI em cima, arte de RDR2 embaixo */
export const ThumbShortPista: React.FC = () => (
	<Frame credit="IMAGENS OFICIAIS: ROCKSTAR GAMES">
		<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 1040, overflow: 'hidden'}}>
			<Bg src="v6/cash-seat.jpg" pos="32% 60%" />
		</div>
		<div style={{position: 'absolute', left: 0, right: 0, top: 1000, bottom: 0, overflow: 'hidden', clipPath: 'polygon(0 4%, 100% 0, 100% 100%, 0 100%)'}}>
			<Bg src="v6/rdr2.jpg" pos="45% 18%" />
		</div>
		<div style={{position: 'absolute', left: 0, right: 0, top: 990, height: 22, background: C.yellow, transform: 'rotate(-2.2deg)'}} />
		<TopShade to={50} />
		<Title
			top={290}
			lines={[
				{text: 'GTA 6 × RED DEAD', size: 128},
				{text: 'NO DINHEIRO?', size: 176, color: '#9BE07F'},
			]}
		/>
		<Tag text="PISTA ESCONDIDA" top={690} />
	</Frame>
);

/** "60 fps no PS5?" — lowrider oficial */
export const ThumbShortFps: React.FC = () => (
	<Frame credit="IMAGEM OFICIAL: ROCKSTAR GAMES">
		<Bg src="v5/lowrider.jpg" pos="42% 55%" />
		<TopShade />
		<Title
			top={300}
			lines={[
				{text: '60 FPS', size: 280, grad: true},
				{text: 'NO PS5?', size: 190},
			]}
		/>
		<Tag text="A VERDADE" top={830} />
	</Frame>
);
