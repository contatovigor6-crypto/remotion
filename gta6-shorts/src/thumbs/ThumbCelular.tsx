import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {WATERMARK} from '../brand';
import {C, DISPLAY, GRAD, UI} from '../theme';

// Thumbnail 1280×720 do Short "O celular de GTA 6": screenshot oficial inédito (Jason com o celular) + texto + logo do canal.
export const ThumbCelular: React.FC = () => (
	<AbsoluteFill style={{background: 'black', overflow: 'hidden'}}>
		<Img src={staticFile('v7/jason-phone.jpg')} style={{position: 'absolute', left: 230, top: -30, width: 1400, height: 788, filter: 'contrast(1.1) saturate(1.25)'}} />
		<AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(11,6,18,0.97) 0%, rgba(11,6,18,0.85) 40%, rgba(11,6,18,0) 62%)'}} />
		<div style={{position: 'absolute', left: 44, top: 56}}>
			<div style={{fontFamily: DISPLAY, fontSize: 120, color: 'white', lineHeight: 1, textShadow: '0 6px 0 #000', whiteSpace: 'nowrap'}}>📱 O CELULAR</div>
			<div style={{fontFamily: DISPLAY, fontSize: 104, color: 'white', lineHeight: 1.08, textShadow: '0 6px 0 #000', whiteSpace: 'nowrap'}}>VAI MUDAR</div>
			<div style={{fontFamily: DISPLAY, fontSize: 170, lineHeight: 1, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 8px 0 #000)', whiteSpace: 'nowrap'}}>GTA 6?</div>
		</div>
		<div style={{position: 'absolute', right: 70, top: 70, display: 'flex', gap: 14, alignItems: 'center', background: 'rgba(255,255,255,0.95)', borderRadius: 22, padding: '12px 22px 12px 12px', transform: 'rotate(4deg)', boxShadow: '0 12px 30px rgba(0,0,0,0.6)'}}>
			<div style={{width: 64, height: 64, borderRadius: 16, background: C.pink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38}}>🔥</div>
			<div>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 18, color: '#666'}}>REDES SOCIAIS</div>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 28, color: C.ink}}>Você viralizou!</div>
			</div>
		</div>
		{WATERMARK === null ? null : (
			<Img src={staticFile(WATERMARK)} style={{position: 'absolute', right: 26, bottom: 26, width: 128, height: 128, borderRadius: 18, boxShadow: '0 6px 18px rgba(0,0,0,0.6)'}} />
		)}
		<div style={{position: 'absolute', left: 44, bottom: 18, fontFamily: UI, fontWeight: 800, fontSize: 18, color: 'rgba(255,255,255,0.7)', letterSpacing: 2}}>IMAGEM OFICIAL: ROCKSTAR GAMES</div>
	</AbsoluteFill>
);
