import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {WATERMARK} from '../brand';
import {C, DISPLAY, UI} from '../theme';

// Thumbnail 1280×720 do Short "A pista no dinheiro": dinheiro oficial de GTA VI (inédito) × arte oficial de RDR2 + texto + logo do canal.
export const ThumbPista: React.FC = () => (
	<AbsoluteFill style={{background: 'black', overflow: 'hidden'}}>
		<Img src={staticFile('v6/cash-seat.jpg')} style={{position: 'absolute', left: -120, top: -40, width: 1420, height: 799, filter: 'contrast(1.1) saturate(1.2)'}} />
		<div style={{position: 'absolute', top: 0, bottom: 0, right: 0, width: 520, overflow: 'hidden', clipPath: 'polygon(18% 0, 100% 0, 100% 100%, 0 100%)'}}>
			<Img src={staticFile('v6/rdr2.jpg')} style={{position: 'absolute', left: -60, top: -40, width: 640, height: 790}} />
		</div>
		<div style={{position: 'absolute', top: 0, bottom: 0, right: 520 - 26, width: 16, background: C.yellow, transform: 'skewX(-7deg)', transformOrigin: 'bottom'}} />
		<AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(11,6,18,0.95) 0%, rgba(11,6,18,0.8) 38%, rgba(11,6,18,0) 58%)'}} />
		<div style={{position: 'absolute', left: 44, top: 60}}>
			<div style={{fontFamily: DISPLAY, fontSize: 92, color: 'white', lineHeight: 1, textShadow: '0 6px 0 #000', whiteSpace: 'nowrap'}}>
				GTA 6 <span style={{color: C.yellow}}>×</span> RED DEAD
			</div>
			<div style={{display: 'inline-block', marginTop: 18, background: C.red, transform: 'rotate(-3deg)', padding: '6px 24px 0', borderRadius: 10, boxShadow: '0 10px 30px rgba(0,0,0,0.6)'}}>
				<span style={{fontFamily: DISPLAY, fontSize: 70, color: 'white', letterSpacing: 2, whiteSpace: 'nowrap'}}>PISTA ESCONDIDA</span>
			</div>
			<div style={{fontFamily: DISPLAY, fontSize: 150, lineHeight: 1.05, marginTop: 14, color: '#9BE07F', textShadow: '0 8px 0 #000, 0 0 40px rgba(155,224,127,0.5)', whiteSpace: 'nowrap'}}>NO DINHEIRO?</div>
		</div>
		{WATERMARK === null ? null : (
			<Img src={staticFile(WATERMARK)} style={{position: 'absolute', right: 26, bottom: 26, width: 128, height: 128, borderRadius: 18, boxShadow: '0 6px 18px rgba(0,0,0,0.6)'}} />
		)}
		<div style={{position: 'absolute', left: 44, bottom: 18, fontFamily: UI, fontWeight: 800, fontSize: 18, color: 'rgba(255,255,255,0.7)', letterSpacing: 2}}>IMAGENS OFICIAIS: ROCKSTAR GAMES</div>
	</AbsoluteFill>
);
