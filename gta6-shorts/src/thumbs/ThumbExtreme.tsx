import React from 'react';
import {AbsoluteFill, Img, random, staticFile} from 'remotion';
import {WATERMARK} from '../brand';
import {C, DISPLAY, GRAD, UI} from '../theme';

// ZONEGTA6 — EXTREME CLICK THUMBNAIL SYSTEM (1280×720): um foco dominante (personagem oficial em primeiro plano),
// luz cinematográfica + partículas, texto de 2–5 palavras com uma palavra em destaque. Sem logo do canal (pedido em 31/10).

const Dust: React.FC<{seed: string; n: number; x0: number; x1: number}> = ({seed, n, x0, x1}) => (
	<>
		{Array.from({length: n}).map((_, i) => {
			const x = x0 + random(`${seed}x${i}`) * (x1 - x0);
			const y = random(`${seed}y${i}`) * 720;
			const r = 1.5 + random(`${seed}r${i}`) * 4.5;
			const o = 0.25 + random(`${seed}o${i}`) * 0.6;
			return <div key={i} style={{position: 'absolute', left: x, top: y, width: r * 2, height: r * 2, borderRadius: r, background: 'rgba(255,240,220,1)', opacity: o, filter: `blur(${r > 4 ? 2 : 0.6}px)`, boxShadow: '0 0 8px rgba(255,220,180,0.8)'}} />;
		})}
	</>
);

const Logo: React.FC<{side: 'left' | 'right'}> = ({side}) =>
	WATERMARK === null ? null : (
		<div style={{position: 'absolute', top: 26, [side]: 30, padding: 5, borderRadius: 26, background: GRAD, boxShadow: '0 0 34px rgba(255,62,154,0.75), 0 10px 24px rgba(0,0,0,0.7)'}}>
			<Img src={staticFile(WATERMARK)} style={{display: 'block', width: 128, height: 128, borderRadius: 22}} />
		</div>
	);

/** "Os interiores de GTA 6": Jason entrando no 24/7 (screenshot oficial, Edge 430) — "10X MAIS INTERIORES" */
export const ThumbExtremeInteriores: React.FC = () => (
	<AbsoluteFill style={{background: '#05040a', overflow: 'hidden'}}>
		<Img src={staticFile('v10/jason-247.jpg')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.32)', transformOrigin: '22% 38%', filter: 'contrast(1.18) saturate(1.25) brightness(1.02)'}} />
		{/* separação: escurece o fundo à direita para o texto, luz quente atrás do personagem */}
		<AbsoluteFill style={{background: 'linear-gradient(270deg, rgba(5,4,10,0.96) 0%, rgba(5,4,10,0.85) 34%, rgba(5,4,10,0.15) 62%, rgba(5,4,10,0) 75%)'}} />
		<AbsoluteFill style={{background: 'radial-gradient(ellipse at 28% 40%, rgba(255,170,90,0.0) 0%, rgba(255,170,90,0) 30%, rgba(0,0,0,0.55) 85%)'}} />
		<AbsoluteFill style={{background: 'linear-gradient(115deg, rgba(56,225,255,0.22) 0%, rgba(56,225,255,0) 30%)', mixBlendMode: 'screen'}} />
		<Dust seed="int" n={46} x0={0} x1={720} />
		<AbsoluteFill style={{boxShadow: 'inset 0 0 180px rgba(0,0,0,0.85)'}} />
		<div style={{position: 'absolute', right: 46, top: 175, textAlign: 'right'}}>
			<div style={{fontFamily: DISPLAY, fontSize: 250, lineHeight: 0.92, backgroundImage: `linear-gradient(180deg, ${C.yellow}, ${C.orange})`, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 10px 0 #000) drop-shadow(0 0 30px rgba(255,180,60,0.45))'}}>10X</div>
			<div style={{fontFamily: DISPLAY, fontSize: 96, color: 'white', lineHeight: 1.0, textShadow: '0 7px 0 #000'}}>MAIS</div>
			<div style={{fontFamily: DISPLAY, fontSize: 104, color: 'white', lineHeight: 1.0, textShadow: '0 7px 0 #000', whiteSpace: 'nowrap'}}>INTERIORES</div>
		</div>
		<div style={{position: 'absolute', right: 46, bottom: 16, fontFamily: UI, fontWeight: 800, fontSize: 15, color: 'rgba(255,255,255,0.6)', letterSpacing: 2}}>IMAGEM OFICIAL: ROCKSTAR GAMES</div>
	</AbsoluteFill>
);

/** Short "Faltam 17 dias": Lucia (screenshot oficial, Edge 430) — "BAIXE 7 DIAS ANTES" (pré-carregamento em 12/11, lançamento 19/11) */
export const ThumbExtremeContagem: React.FC = () => (
	<AbsoluteFill style={{background: '#05040a', overflow: 'hidden'}}>
		<Img src={staticFile('v10/lucia-club.jpg')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.18) translateX(110px)', transformOrigin: '55% 40%', filter: 'contrast(1.15) saturate(1.3)'}} />
		<AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(5,4,10,0.97) 0%, rgba(5,4,10,0.88) 32%, rgba(5,4,10,0.1) 58%, rgba(5,4,10,0) 72%)'}} />
		<AbsoluteFill style={{background: 'linear-gradient(250deg, rgba(255,62,154,0.28) 0%, rgba(255,62,154,0) 35%)', mixBlendMode: 'screen'}} />
		<Dust seed="cont" n={40} x0={500} x1={1280} />
		<AbsoluteFill style={{boxShadow: 'inset 0 0 170px rgba(0,0,0,0.85)'}} />
		<div style={{position: 'absolute', left: 46, top: 110}}>
			<div style={{fontFamily: DISPLAY, fontSize: 132, color: 'white', lineHeight: 1, textShadow: '0 8px 0 #000'}}>BAIXE</div>
			<div style={{fontFamily: DISPLAY, fontSize: 236, lineHeight: 0.95, backgroundImage: `linear-gradient(180deg, ${C.yellow}, ${C.orange})`, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 10px 0 #000) drop-shadow(0 0 30px rgba(255,180,60,0.45))', whiteSpace: 'nowrap'}}>7 DIAS</div>
			<div style={{fontFamily: DISPLAY, fontSize: 132, color: 'white', lineHeight: 1, textShadow: '0 8px 0 #000'}}>ANTES</div>
		</div>
		<div style={{position: 'absolute', left: 46, bottom: 16, fontFamily: UI, fontWeight: 800, fontSize: 15, color: 'rgba(255,255,255,0.6)', letterSpacing: 2}}>IMAGEM OFICIAL: ROCKSTAR GAMES</div>
	</AbsoluteFill>
);

/** Short "Votação sindical na Rockstar UK": Méndez em close (screenshot oficial, Edge 430) — "VOTAÇÃO NA ROCKSTAR" */
export const ThumbExtremeSindicato: React.FC = () => (
	<AbsoluteFill style={{background: '#05040a', overflow: 'hidden'}}>
		<Img src={staticFile('v10/mendez.jpg')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.2) translateX(150px)', transformOrigin: '40% 40%', filter: 'contrast(1.18) saturate(1.15)'}} />
		<AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(5,4,10,0.97) 0%, rgba(5,4,10,0.88) 36%, rgba(5,4,10,0.12) 62%, rgba(5,4,10,0) 76%)'}} />
		<AbsoluteFill style={{background: 'linear-gradient(250deg, rgba(255,45,61,0.25) 0%, rgba(255,45,61,0) 38%)', mixBlendMode: 'screen'}} />
		<Dust seed="sind" n={36} x0={560} x1={1280} />
		<AbsoluteFill style={{boxShadow: 'inset 0 0 170px rgba(0,0,0,0.85)'}} />
		<div style={{position: 'absolute', left: 46, top: 120}}>
			<div style={{fontFamily: DISPLAY, fontSize: 118, color: 'white', lineHeight: 1, textShadow: '0 8px 0 #000'}}>ENQUANTO</div>
			<div style={{fontFamily: DISPLAY, fontSize: 118, color: 'white', lineHeight: 1, textShadow: '0 8px 0 #000'}}>GTA 6 LANÇA…</div>
			<div style={{display: 'inline-block', marginTop: 18, background: C.red, padding: '6px 26px 0', borderRadius: 12, transform: 'rotate(-2.5deg)', boxShadow: '0 12px 0 #000, 0 0 40px rgba(255,45,61,0.5)'}}>
				<span style={{fontFamily: DISPLAY, fontSize: 130, color: 'white', whiteSpace: 'nowrap'}}>🗳️ VOTAÇÃO</span>
			</div>
		</div>
		<div style={{position: 'absolute', left: 46, bottom: 16, fontFamily: UI, fontWeight: 800, fontSize: 15, color: 'rgba(255,255,255,0.6)', letterSpacing: 2}}>IMAGEM OFICIAL: ROCKSTAR GAMES</div>
	</AbsoluteFill>
);

/** VERTICAL 1080×1920 (Shorts) — "Votação na Rockstar": Méndez em close, texto no terço superior */
export const ThumbExtremeSindicatoV: React.FC = () => (
	<AbsoluteFill style={{background: '#05040a', overflow: 'hidden'}}>
		<Img src={staticFile('v10/mendez.jpg')} style={{position: 'absolute', left: 0, right: 0, top: 800, bottom: 0, width: '100%', height: 1120, objectFit: 'cover', objectPosition: '34% 20%', transform: 'scale(1.15)', transformOrigin: '40% 30%', filter: 'contrast(1.18) saturate(1.15)'}} />
		<AbsoluteFill style={{background: 'linear-gradient(180deg, #05040a 0%, #05040a 33%, rgba(5,4,10,0.6) 43%, rgba(5,4,10,0) 52%, rgba(5,4,10,0) 85%, rgba(5,4,10,0.9) 100%)'}} />
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 18%, rgba(255,45,61,0.32), rgba(5,4,10,0) 45%)'}} />
		<Dust seed="sindv" n={60} x0={0} x1={1080} />
		<AbsoluteFill style={{boxShadow: 'inset 0 0 220px rgba(0,0,0,0.85)'}} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center'}}>
			<div style={{fontFamily: DISPLAY, fontSize: 150, color: 'white', lineHeight: 1, textShadow: '0 10px 0 #000'}}>ENQUANTO</div>
			<div style={{fontFamily: DISPLAY, fontSize: 150, color: 'white', lineHeight: 1.02, textShadow: '0 10px 0 #000', whiteSpace: 'nowrap'}}>GTA 6 LANÇA…</div>
			<div style={{display: 'inline-block', marginTop: 26, background: C.red, padding: '10px 40px 2px', borderRadius: 16, transform: 'rotate(-2.5deg)', boxShadow: '0 14px 0 #000, 0 0 50px rgba(255,45,61,0.55)'}}>
				<span style={{fontFamily: DISPLAY, fontSize: 170, color: 'white', whiteSpace: 'nowrap'}}>🗳️ VOTAÇÃO</span>
			</div>
		</div>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 50, textAlign: 'center', fontFamily: UI, fontWeight: 800, fontSize: 24, color: 'rgba(255,255,255,0.65)', letterSpacing: 3}}>IMAGEM OFICIAL: ROCKSTAR GAMES</div>
	</AbsoluteFill>
);

/** VERTICAL (Shorts) — "Os NPCs reagem à sua arma": Jason no fogo (screenshot oficial, Edge 430) */
export const ThumbExtremeReacaoV: React.FC = () => (
	<AbsoluteFill style={{background: '#05040a', overflow: 'hidden'}}>
		<Img src={staticFile('v10/jason-fire.jpg')} style={{position: 'absolute', left: 0, top: 760, width: '100%', height: 1160, objectFit: 'cover', objectPosition: '50% 30%', transform: 'scale(1.15)', transformOrigin: '50% 30%', filter: 'contrast(1.15) saturate(1.25)'}} />
		<AbsoluteFill style={{background: 'linear-gradient(180deg, #05040a 0%, #05040a 34%, rgba(5,4,10,0.6) 41%, rgba(5,4,10,0) 50%, rgba(5,4,10,0) 85%, rgba(5,4,10,0.9) 100%)'}} />
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 18%, rgba(255,140,40,0.3), rgba(5,4,10,0) 45%)'}} />
		<Dust seed="reacv" n={70} x0={0} x1={1080} />
		<AbsoluteFill style={{boxShadow: 'inset 0 0 220px rgba(0,0,0,0.85)'}} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center'}}>
			<div style={{fontFamily: DISPLAY, fontSize: 150, color: 'white', lineHeight: 1, textShadow: '0 10px 0 #000'}}>SACOU A ARMA?</div>
			<div style={{fontFamily: DISPLAY, fontSize: 130, color: 'white', lineHeight: 1.05, textShadow: '0 10px 0 #000', marginTop: 10}}>OS NPCs</div>
			<div style={{display: 'inline-block', marginTop: 20, background: C.yellow, padding: '10px 44px 2px', borderRadius: 16, transform: 'rotate(-2.5deg)', boxShadow: '0 14px 0 #000, 0 0 50px rgba(255,216,74,0.5)'}}>
				<span style={{fontFamily: DISPLAY, fontSize: 190, color: C.ink, whiteSpace: 'nowrap'}}>REAGEM</span>
			</div>
		</div>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 50, textAlign: 'center', fontFamily: UI, fontWeight: 800, fontSize: 24, color: 'rgba(255,255,255,0.65)', letterSpacing: 3}}>IMAGEM OFICIAL: ROCKSTAR GAMES</div>
	</AbsoluteFill>
);

// Short "GTA 6 vai exigir até 212 GB" (vertical 1080×1920): Jason e Lucia (imagem oficial) + barra de armazenamento estourando (ilustração).
export const ThumbExtremeArmazenamentoV: React.FC = () => (
	<AbsoluteFill style={{background: '#05040a', overflow: 'hidden'}}>
		<Img src={staticFile('v5/ocean-view.jpg')} style={{position: 'absolute', left: 0, top: 800, width: '100%', height: 1120, objectFit: 'cover', objectPosition: '42% 30%', transform: 'scale(1.12)', transformOrigin: '42% 30%', filter: 'contrast(1.12) saturate(1.25)'}} />
		<AbsoluteFill style={{background: 'linear-gradient(180deg, #05040a 0%, #05040a 37%, rgba(5,4,10,0.6) 43%, rgba(5,4,10,0) 52%, rgba(5,4,10,0) 85%, rgba(5,4,10,0.9) 100%)'}} />
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 22%, rgba(255,45,61,0.32), rgba(5,4,10,0) 45%)'}} />
		<Dust seed="armv" n={70} x0={0} x1={1080} />
		<AbsoluteFill style={{boxShadow: 'inset 0 0 220px rgba(0,0,0,0.85)'}} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center'}}>
			<div style={{fontFamily: DISPLAY, fontSize: 150, color: 'white', lineHeight: 1, textShadow: '0 10px 0 #000'}}>SEU CONSOLE</div>
			<div style={{display: 'inline-block', marginTop: 24, background: C.yellow, padding: '10px 44px 2px', borderRadius: 16, transform: 'rotate(-2.5deg)', boxShadow: '0 14px 0 #000, 0 0 50px rgba(255,216,74,0.5)'}}>
				<span style={{fontFamily: DISPLAY, fontSize: 180, color: C.ink, whiteSpace: 'nowrap'}}>AGUENTA?</span>
			</div>
			<div style={{margin: '54px 90px 0', position: 'relative', height: 86, borderRadius: 43, background: 'rgba(255,255,255,0.12)', border: `6px solid ${C.red}`, overflow: 'hidden', boxShadow: `0 0 50px rgba(255,45,61,0.7)`}}>
				<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: '100%', background: `linear-gradient(90deg, ${C.orange}, ${C.red})`}} />
				<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 64, color: 'white', textShadow: '0 4px 0 #000'}}>212 GB 💾</div>
			</div>
		</div>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 50, textAlign: 'center', fontFamily: UI, fontWeight: 800, fontSize: 24, color: 'rgba(255,255,255,0.65)', letterSpacing: 3}}>IMAGEM OFICIAL: ROCKSTAR GAMES</div>
	</AbsoluteFill>
);

// Short "As 39 imagens novas de GTA 6" (vertical 1080×1920): Lucia (Launch Gallery) + detalhe circulado do jacaré de olho vermelho (imagem oficial).
export const ThumbExtremeGaleriaV: React.FC = () => (
	<AbsoluteFill style={{background: '#05040a', overflow: 'hidden'}}>
		<Img src={staticFile('v16/Lucia_Caminos_13.jpg')} style={{position: 'absolute', left: 0, top: 760, width: '100%', height: 1160, objectFit: 'cover', objectPosition: '38% 40%', transform: 'scale(1.1)', transformOrigin: '38% 40%', filter: 'contrast(1.12) saturate(1.2)'}} />
		<AbsoluteFill style={{background: 'linear-gradient(180deg, #05040a 0%, #05040a 35%, rgba(5,4,10,0.6) 41%, rgba(5,4,10,0) 50%, rgba(5,4,10,0) 85%, rgba(5,4,10,0.9) 100%)'}} />
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 16%, rgba(255,45,61,0.32), rgba(5,4,10,0) 45%)'}} />
		<Dust seed="galv" n={70} x0={0} x1={1080} />
		<AbsoluteFill style={{boxShadow: 'inset 0 0 220px rgba(0,0,0,0.85)'}} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center'}}>
			<div style={{fontFamily: DISPLAY, fontSize: 170, color: 'white', lineHeight: 1, textShadow: '0 10px 0 #000'}}>VOCÊ VIU</div>
			<div style={{display: 'inline-block', marginTop: 22, background: C.yellow, padding: '10px 50px 2px', borderRadius: 16, transform: 'rotate(-2.5deg)', boxShadow: '0 14px 0 #000, 0 0 50px rgba(255,216,74,0.5)'}}>
				<span style={{fontFamily: DISPLAY, fontSize: 200, color: C.ink, whiteSpace: 'nowrap'}}>ISSO?</span>
			</div>
		</div>
		{/* detalhe circulado (recorte da imagem oficial Grassrivers_08) */}
		<div style={{position: 'absolute', right: 50, top: 820, width: 400, height: 400, borderRadius: 200, overflow: 'hidden', border: `12px solid ${C.red}`, boxShadow: '0 0 0 8px #000, 0 0 70px rgba(255,45,61,0.8)'}}>
			<Img src={staticFile('v16/Grassrivers_08.jpg')} style={{position: 'absolute', width: 1800, height: 1013, left: -592, top: -488}} />
		</div>
		<svg width={260} height={200} viewBox="0 0 260 200" style={{position: 'absolute', right: 400, top: 700}}>
			<path d="M10 20 Q 140 10 210 140" stroke={C.red} strokeWidth={16} fill="none" strokeLinecap="round" />
			<path d="M175 130 L 222 165 L 232 108 Z" fill={C.red} />
		</svg>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 50, textAlign: 'center', fontFamily: UI, fontWeight: 800, fontSize: 24, color: 'rgba(255,255,255,0.65)', letterSpacing: 3}}>IMAGENS OFICIAIS: ROCKSTAR GAMES</div>
	</AbsoluteFill>
);

// Short "A armadilha da Rockstar pra quem vazar GTA 6" (vertical 1080×1920): Lucia (Launch Gallery) + marca d'água de nomes (ilustração da denúncia).
export const ThumbExtremeVazamentoV: React.FC = () => (
	<AbsoluteFill style={{background: '#05040a', overflow: 'hidden'}}>
		<Img src={staticFile('v16/Lucia_Caminos_14.jpg')} style={{position: 'absolute', left: 0, top: 740, width: '100%', height: 1180, objectFit: 'cover', objectPosition: '30% 35%', transform: 'scale(1.12)', transformOrigin: '30% 35%', filter: 'contrast(1.15) saturate(1.2)'}} />
		{/* marca d'água ilustrativa: nomes repetidos em diagonal */}
		<div style={{position: 'absolute', left: -300, top: 700, width: 1700, height: 1300, transform: 'rotate(-18deg)', opacity: 0.22, fontFamily: UI, fontWeight: 800, fontSize: 40, color: 'white', lineHeight: '120px', letterSpacing: 4, whiteSpace: 'nowrap', overflow: 'hidden'}}>
			{Array.from({length: 11}).map((_, i) => (
				<div key={i} style={{marginLeft: (i % 2) * 140}}>{'ANALISTA_0427 · CÓPIA RASTREADA · '.repeat(4)}</div>
			))}
		</div>
		<AbsoluteFill style={{background: 'linear-gradient(180deg, #05040a 0%, #05040a 34%, rgba(5,4,10,0.6) 40%, rgba(5,4,10,0) 49%, rgba(5,4,10,0) 85%, rgba(5,4,10,0.9) 100%)'}} />
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 16%, rgba(255,45,61,0.35), rgba(5,4,10,0) 45%)'}} />
		<Dust seed="vazv" n={60} x0={0} x1={1080} />
		<AbsoluteFill style={{boxShadow: 'inset 0 0 220px rgba(0,0,0,0.85)'}} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center'}}>
			<div style={{fontFamily: DISPLAY, fontSize: 190, color: 'white', lineHeight: 1, textShadow: '0 10px 0 #000'}}>VAZOU?</div>
			<div style={{display: 'inline-block', marginTop: 22, background: C.red, padding: '10px 50px 2px', borderRadius: 16, transform: 'rotate(-2.5deg)', boxShadow: '0 14px 0 #000, 0 0 60px rgba(255,45,61,0.6)'}}>
				<span style={{fontFamily: DISPLAY, fontSize: 190, color: 'white', whiteSpace: 'nowrap'}}>FOI PEGO.</span>
			</div>
		</div>
		<div style={{position: 'absolute', right: 60, top: 1180, border: `8px solid ${C.yellow}`, borderRadius: 16, padding: '10px 22px 4px', transform: 'rotate(8deg)', background: 'rgba(5,4,10,0.7)'}}>
			<span style={{fontFamily: DISPLAY, fontSize: 64, color: C.yellow, letterSpacing: 3}}>🔍 RASTREADO</span>
		</div>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 50, textAlign: 'center', fontFamily: UI, fontWeight: 800, fontSize: 24, color: 'rgba(255,255,255,0.65)', letterSpacing: 3}}>IMAGEM OFICIAL: ROCKSTAR GAMES · MARCA D'ÁGUA ILUSTRATIVA</div>
	</AbsoluteFill>
);
