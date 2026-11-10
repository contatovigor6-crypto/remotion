import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {DISPLAY} from '../theme';

// Thumbnail vertical (sem logo): arte oficial das rádios de GTA VI + título neon cyberpunk.
const PINK = '#FF2BD6';
const CYAN = '#00F0FF';
const N: React.FC<{size: number; color: string; children: React.ReactNode}> = ({size, color, children}) => (
	<div style={{position: 'relative', fontFamily: DISPLAY, fontSize: size, lineHeight: 1, whiteSpace: 'nowrap'}}>
		<span style={{position: 'absolute', left: -8, top: 0, color: CYAN, opacity: 0.85}}>{children}</span>
		<span style={{position: 'absolute', left: 8, top: 0, color: PINK, opacity: 0.85}}>{children}</span>
		<span style={{position: 'relative', color, WebkitTextStroke: '5px #05010f', paintOrder: 'stroke fill', textShadow: `0 0 30px ${PINK}, 0 12px 0 #000`}}>{children}</span>
	</div>
);
export const ThumbExtremeViceCityV: React.FC = () => (
	<AbsoluteFill style={{background: '#04000d'}}>
		<Img src={staticFile('v26/r-palms.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.5) contrast(1.15) brightness(0.8)'}} />
		<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(4,0,13,0.35) 0%, rgba(4,0,13,0.35) 35%, rgba(4,0,13,0.85) 75%, #04000d 100%)'}} />
		<AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0 3px, transparent 3px 7px)'}} />
		<div style={{position: 'absolute', left: -540, right: -540, top: 1500, height: 900, transform: 'perspective(600px) rotateX(62deg)', transformOrigin: '50% 0%', backgroundImage: `linear-gradient(${CYAN}aa 3px, transparent 3px), linear-gradient(90deg, ${PINK}aa 3px, transparent 3px)`, backgroundSize: '90px 90px'}} />
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 120}}>
			<N size={170} color="white">MIAMI VIROU</N>
			<div style={{height: 20}} />
			<N size={230} color={CYAN}>VICE CITY</N>
			<div style={{marginTop: 60, fontFamily: DISPLAY, fontSize: 84, color: 'white', background: PINK, padding: '10px 36px 4px', boxShadow: `0 0 50px ${PINK}, 0 10px 0 #000`, transform: 'rotate(-3deg)'}}>E A XERIFE RECLAMOU</div>
		</AbsoluteFill>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 60, textAlign: 'center', fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 30, color: 'rgba(255,255,255,0.75)'}}>ARTE OFICIAL: ROCKSTAR GAMES</div>
	</AbsoluteFill>
);
