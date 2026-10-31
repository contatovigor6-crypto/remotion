import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {WATERMARK} from '../brand';
import {C, DISPLAY, GRAD, UI} from '../theme';

// Thumbnail vertical "PRO" (1080×1920): logo original em destaque (selo com brilho), pergunta de curiosidade extrema,
// palavra-chave em caixa amarela, círculo + seta apontando o detalhe, imagem oficial na metade de baixo.

export type ProLine = {text: string; size: number; style?: 'white' | 'grad' | 'box' | 'red'};

export const ThumbPro: React.FC<{
	src: string;
	pos: string;
	imageTop: number;
	lines: ProLine[];
	circle: {x: number; y: number; r: number} | null;
	credit: string;
}> = ({src, pos, imageTop, lines, circle, credit}) => (
	<AbsoluteFill style={{background: '#07040c', overflow: 'hidden'}}>
		{/* fundo: textura de luz neon atrás do texto */}
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 18%, rgba(255,62,154,0.35), rgba(123,60,255,0.18) 35%, rgba(7,4,12,0) 60%)'}} />
		<div style={{position: 'absolute', left: 0, right: 0, top: imageTop, bottom: 0, overflow: 'hidden'}}>
			<Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, filter: 'contrast(1.15) saturate(1.25)'}} />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, #07040c 0%, rgba(7,4,12,0) 22%, rgba(7,4,12,0) 75%, rgba(7,4,12,0.85) 100%)'}} />
			<AbsoluteFill style={{boxShadow: 'inset 0 0 220px rgba(0,0,0,0.75)'}} />
		</div>
		{circle === null ? null : (
			<>
				<div style={{position: 'absolute', left: circle.x - circle.r, top: circle.y - circle.r, width: circle.r * 2, height: circle.r * 2, borderRadius: '50%', border: `12px solid ${C.red}`, boxShadow: `0 0 40px ${C.red}, inset 0 0 30px rgba(255,45,61,0.5)`}} />
				<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
					<path d={`M ${circle.x + circle.r + 170} ${circle.y - circle.r - 140} Q ${circle.x + circle.r + 120} ${circle.y - circle.r - 10} ${circle.x + circle.r * 0.75 + 10} ${circle.y - circle.r * 0.75 - 10}`} stroke={C.red} strokeWidth={16} fill="none" strokeLinecap="round" />
					<polygon points={`${circle.x + circle.r * 0.75 - 22},${circle.y - circle.r * 0.75 - 40} ${circle.x + circle.r * 0.75 + 40},${circle.y - circle.r * 0.75 - 6} ${circle.x + circle.r * 0.75 - 6},${circle.y - circle.r * 0.75 + 34}`} fill={C.red} />
				</svg>
			</>
		)}
		{/* selo com a logo original — sempre bem exposta */}
		{WATERMARK === null ? null : (
			<div style={{position: 'absolute', top: 70, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
				<div style={{padding: 8, borderRadius: 44, background: GRAD, boxShadow: '0 0 60px rgba(255,62,154,0.75), 0 18px 40px rgba(0,0,0,0.7)'}}>
					<Img src={staticFile(WATERMARK)} style={{display: 'block', width: 250, height: 250, borderRadius: 38}} />
				</div>
			</div>
		)}
		<div style={{position: 'absolute', top: 370, left: 0, right: 0, textAlign: 'center'}}>
			{lines.map((l) => {
				const base: React.CSSProperties = {fontFamily: DISPLAY, fontSize: l.size, lineHeight: 1.04, whiteSpace: 'nowrap', letterSpacing: 1};
				if (l.style === 'box')
					return (
						<div key={l.text} style={{margin: '10px 0'}}>
							<span style={{...base, display: 'inline-block', background: C.yellow, color: C.ink, padding: '6px 30px 0', borderRadius: 14, transform: 'rotate(-2.5deg)', boxShadow: '0 14px 0 #000, 0 0 50px rgba(255,216,74,0.5)'}}>{l.text}</span>
						</div>
					);
				if (l.style === 'grad') return <div key={l.text} style={{...base, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 9px 0 #000)'}}>{l.text}</div>;
				return <div key={l.text} style={{...base, color: l.style === 'red' ? C.red : 'white', textShadow: '0 9px 0 #000, 0 0 30px rgba(0,0,0,0.8)'}}>{l.text}</div>;
			})}
		</div>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 50, textAlign: 'center', fontFamily: UI, fontWeight: 800, fontSize: 24, color: 'rgba(255,255,255,0.7)', letterSpacing: 4}}>{credit}</div>
	</AbsoluteFill>
);

/** Exemplo: "A polícia de GTA 6 vai ser mais inteligente que você?" */
export const ThumbProPolicia: React.FC = () => (
	<ThumbPro
		src="v7/vc-police.jpg"
		pos="0% 30%"
		imageTop={1060}
		lines={[
			{text: 'A POLÍCIA DE GTA 6', size: 118},
			{text: 'VAI SER MAIS', size: 132, style: 'grad'},
			{text: 'INTELIGENTE', size: 168, style: 'box'},
			{text: 'QUE VOCÊ?', size: 150},
		]}
		circle={{x: 180, y: 1330, r: 140}}
		credit="IMAGEM OFICIAL: ROCKSTAR GAMES"
	/>
);

/** "NPCs com personalidade" — Cal com o taco (screenshot oficial) */
export const ThumbProNpc: React.FC = () => (
	<ThumbPro
		src="v9/cal-golf.jpg"
		pos="66% 20%"
		imageTop={1060}
		lines={[
			{text: 'EM GTA 6', size: 130},
			{text: 'OS NPCs', size: 170, style: 'grad'},
			{text: 'REVIDAM', size: 190, style: 'box'},
			{text: 'CUIDADO 😳', size: 130},
		]}
		circle={{x: 560, y: 1330, r: 150}}
		credit="IMAGEM OFICIAL: ROCKSTAR GAMES"
	/>
);

/** Thumbnail HORIZONTAL (1280×720) para vídeo longo — mesmo estilo PRO: logo em destaque, pergunta de curiosidade, círculo no detalhe */
export const ThumbProLongEdge: React.FC = () => (
	<AbsoluteFill style={{background: '#07040c', overflow: 'hidden'}}>
		<Img src={staticFile('v10/shark.jpg')} style={{position: 'absolute', left: 180, top: 0, width: 1280, height: 720, objectFit: 'cover', filter: 'contrast(1.15) saturate(1.3)'}} />
		<AbsoluteFill style={{background: 'linear-gradient(90deg, #07040c 0%, rgba(7,4,12,0.92) 33%, rgba(7,4,12,0.2) 58%, rgba(7,4,12,0) 75%)'}} />
		<AbsoluteFill style={{background: 'radial-gradient(circle at 15% 20%, rgba(255,62,154,0.35), rgba(7,4,12,0) 45%)'}} />
		<AbsoluteFill style={{boxShadow: 'inset 0 0 160px rgba(0,0,0,0.7)'}} />
		{/* círculo + seta no tubarão-martelo */}
		<div style={{position: 'absolute', left: 740, top: 140, width: 330, height: 250, borderRadius: '50%', border: `10px solid ${C.red}`, boxShadow: `0 0 34px ${C.red}`}} />
		<svg width={1280} height={720} style={{position: 'absolute', left: 0, top: 0}}>
			<path d="M 1180 600 Q 1170 470 1050 400" stroke={C.red} strokeWidth={14} fill="none" strokeLinecap="round" />
			<polygon points="1030,376 1078,398 1042,426" fill={C.red} />
		</svg>
		{WATERMARK === null ? null : (
			<div style={{position: 'absolute', top: 30, left: 34, padding: 6, borderRadius: 30, background: GRAD, boxShadow: '0 0 40px rgba(255,62,154,0.75), 0 10px 26px rgba(0,0,0,0.7)'}}>
				<Img src={staticFile(WATERMARK)} style={{display: 'block', width: 150, height: 150, borderRadius: 25}} />
			</div>
		)}
		<div style={{position: 'absolute', left: 40, top: 215}}>
			<div style={{fontFamily: DISPLAY, fontSize: 96, color: 'white', lineHeight: 1, textShadow: '0 7px 0 #000', whiteSpace: 'nowrap'}}>NOVAS IMAGENS</div>
			<div style={{fontFamily: DISPLAY, fontSize: 118, lineHeight: 1.02, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 7px 0 #000)', whiteSpace: 'nowrap'}}>DE GTA 6</div>
			<div style={{display: 'inline-block', marginTop: 12, background: C.yellow, color: C.ink, fontFamily: DISPLAY, fontSize: 92, padding: '4px 24px 0', borderRadius: 12, transform: 'rotate(-2.5deg)', boxShadow: '0 10px 0 #000, 0 0 40px rgba(255,216,74,0.5)', whiteSpace: 'nowrap'}}>ESCONDEM ISSO 😳</div>
		</div>
		<div style={{position: 'absolute', right: 30, top: 28, background: 'rgba(11,6,18,0.85)', color: 'white', fontFamily: UI, fontWeight: 800, fontSize: 22, letterSpacing: 3, padding: '8px 16px', borderRadius: 8}}>🆕 EDGE 430 · 29/10</div>
		<div style={{position: 'absolute', left: 40, bottom: 18, fontFamily: UI, fontWeight: 800, fontSize: 16, color: 'rgba(255,255,255,0.7)', letterSpacing: 2}}>IMAGEM OFICIAL: ROCKSTAR GAMES</div>
	</AbsoluteFill>
);

/** Thumbnail HORIZONTAL do vídeo longo "Os interiores de GTA 6" — círculo no cachorro (screenshot oficial da Edge) */
export const ThumbProLongInteriores: React.FC = () => (
	<AbsoluteFill style={{background: '#07040c', overflow: 'hidden'}}>
		<Img src={staticFile('v6/neon-tattoo.jpg')} style={{position: 'absolute', left: 330, top: 0, width: 1280, height: 720, objectFit: 'cover', filter: 'contrast(1.15) saturate(1.3)'}} />
		<AbsoluteFill style={{background: 'linear-gradient(90deg, #07040c 0%, rgba(7,4,12,0.92) 33%, rgba(7,4,12,0.2) 58%, rgba(7,4,12,0) 75%)'}} />
		<AbsoluteFill style={{background: 'radial-gradient(circle at 15% 20%, rgba(255,62,154,0.35), rgba(7,4,12,0) 45%)'}} />
		<AbsoluteFill style={{boxShadow: 'inset 0 0 160px rgba(0,0,0,0.7)'}} />
		{/* círculo + seta no tubarão-martelo */}
		<div style={{position: 'absolute', left: 700, top: 170, width: 300, height: 300, borderRadius: '50%', border: `10px solid ${C.red}`, boxShadow: `0 0 34px ${C.red}`}} />
		<svg width={1280} height={720} style={{position: 'absolute', left: 0, top: 0}}>
			<path d="M 1160 610 Q 1130 480 1010 420" stroke={C.red} strokeWidth={14} fill="none" strokeLinecap="round" />
			<polygon points="990,396 1038,418 1002,446" fill={C.red} />
		</svg>
		{WATERMARK === null ? null : (
			<div style={{position: 'absolute', top: 30, left: 34, padding: 6, borderRadius: 30, background: GRAD, boxShadow: '0 0 40px rgba(255,62,154,0.75), 0 10px 26px rgba(0,0,0,0.7)'}}>
				<Img src={staticFile(WATERMARK)} style={{display: 'block', width: 150, height: 150, borderRadius: 25}} />
			</div>
		)}
		<div style={{position: 'absolute', left: 40, top: 215}}>
			<div style={{fontFamily: DISPLAY, fontSize: 96, color: 'white', lineHeight: 1, textShadow: '0 7px 0 #000', whiteSpace: 'nowrap'}}>O QUE TEM ATRÁS</div>
			<div style={{fontFamily: DISPLAY, fontSize: 118, lineHeight: 1.02, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 7px 0 #000)', whiteSpace: 'nowrap'}}>DAS PORTAS</div>
			<div style={{display: 'inline-block', marginTop: 12, background: C.yellow, color: C.ink, fontFamily: DISPLAY, fontSize: 92, padding: '4px 24px 0', borderRadius: 12, transform: 'rotate(-2.5deg)', boxShadow: '0 10px 0 #000, 0 0 40px rgba(255,216,74,0.5)', whiteSpace: 'nowrap'}}>DE GTA 6? 🚪</div>
		</div>
		<div style={{position: 'absolute', right: 30, top: 28, background: 'rgba(11,6,18,0.85)', color: 'white', fontFamily: UI, fontWeight: 800, fontSize: 22, letterSpacing: 3, padding: '8px 16px', borderRadius: 8}}>🔎 INTERIORES DE GTA 6</div>
		<div style={{position: 'absolute', left: 40, bottom: 18, fontFamily: UI, fontWeight: 800, fontSize: 16, color: 'rgba(255,255,255,0.7)', letterSpacing: 2}}>IMAGEM OFICIAL: ROCKSTAR GAMES</div>
	</AbsoluteFill>
);
