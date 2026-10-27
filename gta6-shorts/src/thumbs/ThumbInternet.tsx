import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, DISPLAY, GRAD, UI} from '../theme';

// Thumbnail 1280×720 do Short "Internet no GTA 6": arte oficial do Launch Trailer (Lucia segurando o celular)
// + destaque no celular + texto curto à direita sobre degradê escuro.
const IMG_W = 2048; // arte 3840×2160 ampliada: personagens à esquerda, texto à direita
const IMG_X = -656;
const PHONE = {x: 532, y: 410};

export const ThumbInternet: React.FC = () => (
	<AbsoluteFill style={{background: 'black', overflow: 'hidden'}}>
		<Img
			src={staticFile('thumb/launch-poster.jpg')}
			style={{position: 'absolute', left: IMG_X, top: 0, width: IMG_W, height: (IMG_W * 9) / 16, filter: 'contrast(1.1) saturate(1.2)'}}
		/>
		<AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(11,6,18,0) 38%, rgba(11,6,18,0.82) 58%, rgba(11,6,18,0.95) 100%)'}} />
		<AbsoluteFill style={{background: 'radial-gradient(ellipse at 30% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.45) 100%)'}} />
		{/* destaque no celular */}
		<div
			style={{
				position: 'absolute',
				left: PHONE.x - 78,
				top: PHONE.y - 78,
				width: 156,
				height: 156,
				borderRadius: 78,
				border: `8px solid ${C.yellow}`,
				boxShadow: `0 0 30px ${C.yellow}, inset 0 0 20px rgba(255,216,74,0.6)`,
			}}
		/>
		<svg width={1280} height={720} style={{position: 'absolute', left: 0, top: 0}}>
			<path d="M 690 455 C 650 470, 640 450, 622 438" stroke={C.yellow} strokeWidth={12} fill="none" strokeLinecap="round" />
			<path d="M 608 424 L 640 430 L 620 456 Z" fill={C.yellow} />
		</svg>
		{/* texto */}
		<div style={{position: 'absolute', left: 680, top: 60, right: 30}}>
			<div style={{display: 'inline-flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.95)', borderRadius: 40, padding: '8px 24px'}}>
				<svg width={44} height={44} viewBox="0 0 24 24">
					<circle cx="12" cy="12" r="10" fill="none" stroke="#2E8BFF" strokeWidth={2.4} />
					<path d="M2 12h20M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20" fill="none" stroke="#2E8BFF" strokeWidth={2} />
				</svg>
				<span style={{fontFamily: DISPLAY, fontSize: 92, color: C.ink, letterSpacing: 1}}>INTERNET</span>
			</div>
			<div style={{fontFamily: DISPLAY, fontSize: 150, lineHeight: 1.0, marginTop: 14, whiteSpace: 'nowrap', backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 8px 0 #000)'}}>
				NO GTA 6
			</div>
			<div style={{display: 'inline-block', marginTop: 18, whiteSpace: 'nowrap', background: C.red, transform: 'rotate(-3deg)', padding: '6px 22px 0', borderRadius: 10, boxShadow: '0 10px 30px rgba(0,0,0,0.6)'}}>
				<span style={{fontFamily: DISPLAY, fontSize: 84, color: 'white', letterSpacing: 2}}>VAI SER REAL?</span>
			</div>
		</div>
		<div style={{position: 'absolute', left: 24, bottom: 18, fontFamily: UI, fontWeight: 800, fontSize: 18, color: 'rgba(255,255,255,0.75)', letterSpacing: 2}}>
			ARTE OFICIAL: ROCKSTAR GAMES
		</div>
	</AbsoluteFill>
);
