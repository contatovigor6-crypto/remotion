import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {WATERMARK} from '../brand';
import {C, DISPLAY, GRAD, UI} from '../theme';

// Thumbnail 1280×720 do Short "GTA 6 a 60 fps no PS5?": pôster oficial (Jason em neon) + texto à esquerda + logo do canal.
export const ThumbFps: React.FC = () => (
	<AbsoluteFill style={{background: 'black', overflow: 'hidden'}}>
		<Img src={staticFile('thumb/jason-neon.jpg')} style={{position: 'absolute', left: -40, top: -30, width: 1400, height: 788, filter: 'contrast(1.12) saturate(1.25) brightness(1.08)'}} />
		<AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(11,6,18,0.96) 0%, rgba(11,6,18,0.85) 34%, rgba(11,6,18,0) 58%)'}} />
		<div style={{position: 'absolute', left: 44, top: 70}}>
			<div style={{display: 'inline-flex', alignItems: 'baseline', gap: 10}}>
				<span style={{fontFamily: DISPLAY, fontSize: 250, lineHeight: 0.95, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 8px 0 #000)'}}>60</span>
				<span style={{fontFamily: DISPLAY, fontSize: 130, color: 'white', textShadow: '0 6px 0 #000'}}>FPS</span>
			</div>
			<div style={{fontFamily: DISPLAY, fontSize: 116, color: 'white', lineHeight: 1.05, textShadow: '0 6px 0 #000', whiteSpace: 'nowrap'}}>NO PS5?</div>
			<div style={{display: 'inline-block', marginTop: 18, background: C.red, transform: 'rotate(-3deg)', padding: '6px 24px 0', borderRadius: 10, boxShadow: '0 10px 30px rgba(0,0,0,0.6)'}}>
				<span style={{fontFamily: DISPLAY, fontSize: 76, color: 'white', letterSpacing: 2, whiteSpace: 'nowrap'}}>A VERDADE</span>
			</div>
		</div>
		{WATERMARK === null ? null : (
			<Img src={staticFile(WATERMARK)} style={{position: 'absolute', right: 26, bottom: 26, width: 128, height: 128, borderRadius: 18, boxShadow: '0 6px 18px rgba(0,0,0,0.6)'}} />
		)}
		<div style={{position: 'absolute', left: 44, bottom: 18, fontFamily: UI, fontWeight: 800, fontSize: 18, color: 'rgba(255,255,255,0.7)', letterSpacing: 2}}>IMAGEM OFICIAL: ROCKSTAR GAMES</div>
	</AbsoluteFill>
);
