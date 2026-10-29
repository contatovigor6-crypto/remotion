import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {WATERMARK} from '../brand';
import {C, DISPLAY, GRAD, UI} from '../theme';

// Thumbnail 1280×720 do Short "Jason mora de favor": arte oficial inédita do Brian Heder + texto + logo do canal.
export const ThumbBrian: React.FC = () => (
	<AbsoluteFill style={{background: 'black', overflow: 'hidden'}}>
		<Img src={staticFile('v8/brian-art.jpg')} style={{position: 'absolute', left: 120, top: -20, width: 1400, height: 788, filter: 'contrast(1.1) saturate(1.25)'}} />
		<AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(11,6,18,0.97) 0%, rgba(11,6,18,0.85) 40%, rgba(11,6,18,0) 62%)'}} />
		<div style={{position: 'absolute', left: 44, top: 60}}>
			<div style={{fontFamily: DISPLAY, fontSize: 118, color: 'white', lineHeight: 1, textShadow: '0 6px 0 #000', whiteSpace: 'nowrap'}}>JASON MORA</div>
			<div style={{fontFamily: DISPLAY, fontSize: 160, lineHeight: 1.02, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 8px 0 #000)', whiteSpace: 'nowrap'}}>DE FAVOR?</div>
			<div style={{display: 'inline-block', marginTop: 16, background: C.red, transform: 'rotate(-3deg)', padding: '6px 24px 0', borderRadius: 10, boxShadow: '0 10px 30px rgba(0,0,0,0.6)'}}>
				<span style={{fontFamily: DISPLAY, fontSize: 64, color: 'white', letterSpacing: 2, whiteSpace: 'nowrap'}}>O ALUGUEL É OUTRO 😬</span>
			</div>
		</div>
		<div style={{position: 'absolute', right: 160, top: 470, background: '#f3ecdc', border: '6px solid #2b1a0e', borderRadius: 14, padding: '8px 22px', transform: 'rotate(5deg)', boxShadow: '0 12px 30px rgba(0,0,0,0.6)'}}>
			<div style={{fontFamily: UI, fontWeight: 800, fontSize: 20, letterSpacing: 4, color: '#8a2a1a'}}>🏠 ALUGUEL</div>
			<div style={{fontFamily: DISPLAY, fontSize: 64, color: '#2b1a0e', lineHeight: 1}}>R$ 0,00</div>
		</div>
		{WATERMARK === null ? null : (
			<Img src={staticFile(WATERMARK)} style={{position: 'absolute', right: 26, bottom: 26, width: 128, height: 128, borderRadius: 18, boxShadow: '0 6px 18px rgba(0,0,0,0.6)'}} />
		)}
		<div style={{position: 'absolute', left: 44, bottom: 18, fontFamily: UI, fontWeight: 800, fontSize: 18, color: 'rgba(255,255,255,0.7)', letterSpacing: 2}}>ARTE OFICIAL: ROCKSTAR GAMES</div>
	</AbsoluteFill>
);
