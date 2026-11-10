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
		<Img src={staticFile('v16/Vice_City_16.jpg')} style={{position: 'absolute', left: 0, top: 740, width: '100%', height: 1180, objectFit: 'cover', objectPosition: '62% 40%', transform: 'scale(1.15)', transformOrigin: '62% 40%', filter: 'contrast(1.15) saturate(1.2)'}} />
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

// Short "GTA 6 apareceu na GLOBO" (vertical 1080×1920): Jason e Lucia (Launch Gallery) dentro de uma TV ilustrada (sem logotipo da emissora).
export const ThumbExtremeGloboV: React.FC = () => (
	<AbsoluteFill style={{background: '#05040a', overflow: 'hidden'}}>
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 30%, rgba(255,45,61,0.35), rgba(5,4,10,0) 55%)'}} />
		<Dust seed="globov" n={60} x0={0} x1={1080} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center'}}>
			<div style={{fontFamily: DISPLAY, fontSize: 150, color: 'white', lineHeight: 1, textShadow: '0 10px 0 #000'}}>PASSOU NA</div>
			<div style={{display: 'inline-block', marginTop: 20, background: C.yellow, padding: '10px 44px 2px', borderRadius: 16, transform: 'rotate(-2.5deg)', boxShadow: '0 14px 0 #000, 0 0 50px rgba(255,216,74,0.5)'}}>
				<span style={{fontFamily: DISPLAY, fontSize: 170, color: C.ink, whiteSpace: 'nowrap'}}>TV ABERTA</span>
			</div>
		</div>
		{/* TV ilustrada */}
		<div style={{position: 'absolute', left: 50, right: 50, top: 760, height: 760, borderRadius: 40, background: '#151519', padding: 26, boxShadow: '0 0 0 6px #2c2c33, 0 40px 90px rgba(0,0,0,0.8), 0 0 80px rgba(255,45,61,0.35)'}}>
			<div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 22, overflow: 'hidden'}}>
				<Img src={staticFile('v16/Jason_and_Lucia_17.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 40%', filter: 'contrast(1.12) saturate(1.2)'}} />
				<AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 5px)'}} />
				<div style={{position: 'absolute', left: 22, top: 22, display: 'flex', alignItems: 'center', gap: 10, background: C.red, padding: '8px 18px', borderRadius: 10}}>
					<div style={{width: 18, height: 18, borderRadius: 9, background: 'white'}} />
					<span style={{fontFamily: UI, fontWeight: 800, fontSize: 34, color: 'white', letterSpacing: 3}}>NO AR</span>
				</div>
				<div style={{position: 'absolute', right: 22, top: 22, width: 80, height: 80, borderRadius: 12, background: '#111', border: '4px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 56, color: 'white'}}>18</div>
				<div style={{position: 'absolute', left: 0, right: 0, bottom: 26, textAlign: 'center'}}>
					<span style={{fontFamily: UI, fontWeight: 800, fontSize: 44, color: 'white', background: 'rgba(0,0,0,0.75)', padding: '8px 20px', borderRadius: 8}}>"Vamos ficar bem?"</span>
				</div>
			</div>
		</div>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 50, textAlign: 'center', fontFamily: UI, fontWeight: 800, fontSize: 24, color: 'rgba(255,255,255,0.65)', letterSpacing: 3}}>IMAGEM OFICIAL: ROCKSTAR GAMES · TV ILUSTRATIVA</div>
	</AbsoluteFill>
);

// Short "O código de GTA 6 entregou 2 segredos" (vertical 1080×1920): Lucia (Launch Gallery) + código verde e "ONLINE?" (ilustração).
export const ThumbExtremeCodigoV: React.FC = () => (
	<AbsoluteFill style={{background: '#030806', overflow: 'hidden'}}>
		<Img src={staticFile('v16/Lucia_Caminos_14.jpg')} style={{position: 'absolute', left: 0, top: 760, width: '100%', height: 1160, objectFit: 'cover', objectPosition: '30% 35%', transform: 'scale(1.1)', transformOrigin: '30% 35%', filter: 'contrast(1.15) saturate(1.1) hue-rotate(-8deg)'}} />
		<div style={{position: 'absolute', inset: 0, opacity: 0.22, fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 34, lineHeight: '44px', color: '#3DFF8A', whiteSpace: 'pre', overflow: 'hidden', padding: 20}}>
			{Array.from({length: 44}).map((_, i) => `joinSession(); launchMultiplayerActivity(); 0x${(i * 7919).toString(16)} achievements[55]\n`).join('')}
		</div>
		<AbsoluteFill style={{background: 'linear-gradient(180deg, #030806 0%, #030806 36%, rgba(3,8,6,0.6) 42%, rgba(3,8,6,0) 52%, rgba(3,8,6,0) 85%, rgba(3,8,6,0.9) 100%)'}} />
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 18%, rgba(61,255,138,0.25), rgba(3,8,6,0) 45%)'}} />
		<AbsoluteFill style={{boxShadow: 'inset 0 0 220px rgba(0,0,0,0.85)'}} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 140, textAlign: 'center'}}>
			<div style={{fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 44, color: '#3DFF8A', letterSpacing: 4}}>&gt; código encontrado</div>
			<div style={{fontFamily: DISPLAY, fontSize: 150, color: 'white', lineHeight: 1, textShadow: '0 10px 0 #000', marginTop: 16}}>GTA 6 TEM</div>
			<div style={{display: 'inline-block', marginTop: 20, background: C.yellow, padding: '10px 44px 2px', borderRadius: 16, transform: 'rotate(-2.5deg)', boxShadow: '0 14px 0 #000, 0 0 50px rgba(255,216,74,0.5)'}}>
				<span style={{fontFamily: DISPLAY, fontSize: 180, color: C.ink, whiteSpace: 'nowrap'}}>ONLINE?</span>
			</div>
		</div>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 50, textAlign: 'center', fontFamily: UI, fontWeight: 800, fontSize: 24, color: 'rgba(255,255,255,0.65)', letterSpacing: 3}}>IMAGEM OFICIAL: ROCKSTAR GAMES · CÓDIGO ILUSTRATIVO</div>
	</AbsoluteFill>
);

// Short "Os carros de GTA 6 saíram do jogo" (vertical 1080×1920): viatura Tempesta (imagem oficial) + luzes de giroflex (efeito).
export const ThumbExtremeCarrosV: React.FC = () => (
	<AbsoluteFill style={{background: '#05040a', overflow: 'hidden'}}>
		<Img src={staticFile('v19/v-tempesta.jpg')} style={{position: 'absolute', left: 0, top: 640, width: '100%', height: 1280, objectFit: 'cover', objectPosition: '50% 62%', transform: 'scale(1.35)', transformOrigin: '50% 66%', filter: 'contrast(1.12) saturate(1.2)'}} />
		<AbsoluteFill style={{background: 'linear-gradient(180deg, #05040a 0%, #05040a 33%, rgba(5,4,10,0.6) 40%, rgba(5,4,10,0) 50%, rgba(5,4,10,0) 85%, rgba(5,4,10,0.9) 100%)'}} />
		<AbsoluteFill style={{background: 'radial-gradient(circle at 12% 45%, rgba(255,40,60,0.45), rgba(0,0,0,0) 35%), radial-gradient(circle at 88% 45%, rgba(40,110,255,0.45), rgba(0,0,0,0) 35%)'}} />
		<Dust seed="carrosv" n={50} x0={0} x1={1080} />
		<AbsoluteFill style={{boxShadow: 'inset 0 0 200px rgba(0,0,0,0.8)'}} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 130, textAlign: 'center'}}>
			<div style={{fontFamily: DISPLAY, fontSize: 140, color: 'white', lineHeight: 1, textShadow: '0 10px 0 #000'}}>ISSO EXISTE</div>
			<div style={{display: 'inline-block', marginTop: 20, background: C.yellow, padding: '10px 44px 2px', borderRadius: 16, transform: 'rotate(-2.5deg)', boxShadow: '0 14px 0 #000, 0 0 50px rgba(255,216,74,0.5)'}}>
				<span style={{fontFamily: DISPLAY, fontSize: 170, color: C.ink, whiteSpace: 'nowrap'}}>DE VERDADE</span>
			</div>
		</div>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 50, textAlign: 'center', fontFamily: UI, fontWeight: 800, fontSize: 24, color: 'rgba(255,255,255,0.65)', letterSpacing: 3}}>IMAGEM OFICIAL DO JOGO: ROCKSTAR GAMES</div>
	</AbsoluteFill>
);

// Short "Os arquivos de GTA 6 entregaram 3 pistas" (vertical 1080×1920): Lucia (imagem oficial) + arquivo misterioso "core_restofworld001" (ilustração).
export const ThumbExtremeArquivosV: React.FC = () => (
	<AbsoluteFill style={{background: '#030806', overflow: 'hidden'}}>
		<Img src={staticFile('v16/Lucia_Caminos_13.jpg')} style={{position: 'absolute', left: 0, top: 760, width: '100%', height: 1160, objectFit: 'cover', objectPosition: '42% 40%', transform: 'scale(1.1)', transformOrigin: '42% 40%', filter: 'contrast(1.12) saturate(1.15)'}} />
		<AbsoluteFill style={{background: 'linear-gradient(180deg, #030806 0%, #030806 36%, rgba(3,8,6,0.6) 42%, rgba(3,8,6,0) 52%, rgba(3,8,6,0) 85%, rgba(3,8,6,0.9) 100%)'}} />
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 22%, rgba(255,216,74,0.22), rgba(3,8,6,0) 45%)'}} />
		<AbsoluteFill style={{boxShadow: 'inset 0 0 220px rgba(0,0,0,0.85)'}} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center'}}>
			<div style={{fontFamily: DISPLAY, fontSize: 130, color: 'white', lineHeight: 1, textShadow: '0 10px 0 #000'}}>ARQUIVO SUMIDO</div>
			<div style={{display: 'inline-block', marginTop: 22, background: '#04100a', border: '6px solid #3DFF8A', padding: '14px 26px', borderRadius: 16, boxShadow: '0 14px 0 #000, 0 0 50px rgba(61,255,138,0.4)'}}>
				<span style={{fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 56, color: '#3DFF8A'}}>core_restofworld001</span>
			</div>
			<div style={{display: 'inline-block', marginTop: 26, background: C.yellow, padding: '10px 40px 2px', borderRadius: 16, transform: 'rotate(-2.5deg)', boxShadow: '0 14px 0 #000'}}>
				<span style={{fontFamily: DISPLAY, fontSize: 130, color: C.ink, whiteSpace: 'nowrap'}}>O QUE É ISSO?</span>
			</div>
		</div>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 50, textAlign: 'center', fontFamily: UI, fontWeight: 800, fontSize: 24, color: 'rgba(255,255,255,0.65)', letterSpacing: 3}}>IMAGEM OFICIAL: ROCKSTAR GAMES</div>
	</AbsoluteFill>
);

// Short "GTA 6 Gold: o jogo finalmente ficou pronto?" (vertical 1080×1920): Jason (imagem oficial) + disco dourado e "100%".
export const ThumbExtremeGoldV: React.FC = () => (
	<AbsoluteFill style={{background: '#0a0702', overflow: 'hidden'}}>
		<Img src={staticFile('v16/Jason_Duval_19.jpg')} style={{position: 'absolute', left: 0, top: 760, width: '100%', height: 1160, objectFit: 'cover', objectPosition: '68% 40%', transform: 'scale(1.12)', transformOrigin: '68% 40%', filter: 'contrast(1.12) saturate(1.15) sepia(0.15)'}} />
		<AbsoluteFill style={{background: 'linear-gradient(180deg, #0a0702 0%, #0a0702 36%, rgba(10,7,2,0.6) 42%, rgba(10,7,2,0) 52%, rgba(10,7,2,0) 85%, rgba(10,7,2,0.9) 100%)'}} />
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 20%, rgba(255,200,0,0.35), rgba(10,7,2,0) 45%)'}} />
		<Dust seed="goldv" n={70} x0={0} x1={1080} />
		<AbsoluteFill style={{boxShadow: 'inset 0 0 220px rgba(0,0,0,0.85)'}} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center'}}>
			<div style={{display: 'inline-block', width: 230, height: 230, borderRadius: 115, background: 'conic-gradient(#FFF3B0, #E0A100, #FFE680, #B87A00, #FFF3B0)', boxShadow: '0 0 70px rgba(255,200,0,0.8), 0 14px 0 #000', position: 'relative'}}>
				<div style={{position: 'absolute', left: 80, top: 80, width: 70, height: 70, borderRadius: 35, background: '#111', border: '8px solid #FFE680'}} />
			</div>
			<div style={{fontFamily: DISPLAY, fontSize: 150, lineHeight: 1, marginTop: 14, backgroundImage: 'linear-gradient(180deg, #FFF3B0 0%, #FFD24A 40%, #E0A100 70%, #FFE680 100%)', WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 10px 0 #000)'}}>DEU GOLD</div>
			<div style={{display: 'inline-block', marginTop: 10, background: '#3DFF8A', padding: '8px 36px 0', borderRadius: 14, transform: 'rotate(-2.5deg)', boxShadow: '0 12px 0 #000'}}>
				<span style={{fontFamily: DISPLAY, fontSize: 120, color: C.ink}}>100% PRONTO?</span>
			</div>
		</div>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 50, textAlign: 'center', fontFamily: UI, fontWeight: 800, fontSize: 24, color: 'rgba(255,255,255,0.65)', letterSpacing: 3}}>IMAGEM OFICIAL: ROCKSTAR GAMES</div>
	</AbsoluteFill>
);

// Short "Pôster de GTA 6" (vertical 1080×1920): pôster com a capa oficial + mapa ilustrativo, etiqueta GRÁTIS.
export const ThumbExtremePosterV: React.FC = () => (
	<AbsoluteFill style={{background: 'linear-gradient(180deg, #04223f 0%, #0a4f7f 100%)', overflow: 'hidden'}}>
		<AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.08) 2px, transparent 2px)', backgroundSize: '120px 120px'}} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center'}}>
			<div style={{fontFamily: DISPLAY, fontSize: 140, color: 'white', lineHeight: 1, textShadow: '0 10px 0 #000'}}>O MAPA DE GTA 6</div>
			<div style={{display: 'inline-block', marginTop: 20, background: '#3DFF8A', padding: '10px 44px 2px', borderRadius: 16, transform: 'rotate(-2.5deg)', boxShadow: '0 14px 0 #000'}}>
				<span style={{fontFamily: DISPLAY, fontSize: 170, color: C.ink, whiteSpace: 'nowrap'}}>DE GRAÇA</span>
			</div>
		</div>
		<div style={{position: 'absolute', left: 90, top: 760, width: 520, height: 720, background: 'white', padding: 16, transform: 'rotate(-6deg)', boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}}>
			<Img src={staticFile('v23/capa-oficial.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
		</div>
		<div style={{position: 'absolute', right: 70, top: 900, width: 440, height: 600, borderRadius: 18, overflow: 'hidden', background: 'linear-gradient(160deg, #1b6fa8, #0f4c7a)', border: '10px solid #f4ead2', transform: 'rotate(7deg)', boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}}>
			<svg width={440} height={600} viewBox="0 0 100 130" preserveAspectRatio="none">
				<path d="M10 0 L70 0 L72 10 L66 22 L70 34 L64 46 L68 58 L62 72 L66 86 L58 100 L54 112 L46 122 L40 116 L44 104 L38 92 L42 80 L34 66 L38 52 L30 40 L34 26 L22 18 L12 10 Z" fill="#e8d9a8" stroke="#c9b37a" strokeWidth={0.8} />
			</svg>
			<div style={{position: 'absolute', left: 16, top: 10, fontFamily: DISPLAY, fontSize: 52, color: '#f4ead2'}}>LEONIDA</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 230, textAlign: 'center', fontFamily: DISPLAY, fontSize: 200, color: 'white', textShadow: '0 10px 0 #000'}}>?</div>
		</div>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 50, textAlign: 'center', fontFamily: UI, fontWeight: 800, fontSize: 24, color: 'rgba(255,255,255,0.7)', letterSpacing: 3}}>CAPA OFICIAL: ROCKSTAR GAMES · MAPA ILUSTRATIVO</div>
	</AbsoluteFill>
);

// Short "GTA 6 no PC: quando lança?" (vertical 1080×1920): monitor com screenshot oficial + "PC: ??/??/????".
export const ThumbExtremePcV: React.FC = () => (
	<AbsoluteFill style={{background: '#030308', overflow: 'hidden'}}>
		{Array.from({length: 5}).map((_, i) => (
			<div key={i} style={{position: 'absolute', left: -300, right: -300, top: 300 + i * 340, height: 30, borderRadius: 15, background: 'linear-gradient(90deg, #ff0040, #ffae00, #3dff8a, #38e1ff, #7b3cff, #ff3e9a)', filter: 'blur(12px)', opacity: 0.6, transform: `rotate(${-8 + i * 3}deg)`}} />
		))}
		<div style={{position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center'}}>
			<div style={{fontFamily: DISPLAY, fontSize: 150, color: 'white', lineHeight: 1, textShadow: '0 10px 0 #000'}}>GTA 6 NO PC</div>
			<div style={{display: 'inline-block', marginTop: 20, background: C.yellow, padding: '10px 40px 2px', borderRadius: 16, transform: 'rotate(-2.5deg)', boxShadow: '0 14px 0 #000'}}>
				<span style={{fontFamily: DISPLAY, fontSize: 150, color: C.ink, whiteSpace: 'nowrap'}}>QUANDO?</span>
			</div>
		</div>
		<div style={{position: 'absolute', left: 80, right: 80, top: 760, height: 620, borderRadius: 26, background: '#0b0b10', border: '18px solid #1c1c24', overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,0.7)'}}>
			<Img src={staticFile('v16/Vice_City_19.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7) saturate(1.2)'}} />
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 40, textAlign: 'center'}}>
				<span style={{fontFamily: DISPLAY, fontSize: 90, color: 'white', background: 'rgba(0,0,0,0.65)', padding: '6px 24px', borderRadius: 14}}>💻 ??/??/????</span>
			</div>
		</div>
		<div style={{position: 'absolute', left: 360, right: 360, top: 1380, height: 110, background: '#1c1c24', clipPath: 'polygon(30% 0, 70% 0, 100% 100%, 0 100%)'}} />
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 50, textAlign: 'center', fontFamily: UI, fontWeight: 800, fontSize: 24, color: 'rgba(255,255,255,0.65)', letterSpacing: 3}}>IMAGEM OFICIAL: ROCKSTAR GAMES</div>
	</AbsoluteFill>
);
