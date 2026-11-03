import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {WATERMARK} from '../brand';
import {C, DISPLAY, GRAD, UI} from '../theme';

// Encerramento PROFISSIONAL do canal (Shorts 1080×1920 e vídeos longos 1920×1080):
// 1) flash + onda de choque e "slam" da logo original com brilho neon e partículas
// 2) nome do canal digitado letra a letra + tagline
// 3) cursor entra, clica em INSCREVER-SE (vira INSCRITO), aciona o sino (balança) e o LIKE (pulsa)
// 4) faixa "PRÓXIMA INVESTIGAÇÃO EM BREVE" e saída limpa.
// Duração ideal: 4,5 s ou mais. `subAt` = segundos (relativos ao início) em que o cursor clica em inscrever-se.

const CHANNEL = 'ZONEGTAVI';

export const ProOutro: React.FC<{subAt: number; tagline: string; landscape?: boolean}> = ({subAt, tagline, landscape = false}) => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();
	const t = frame / fps;
	const cx = width / 2;
	const logoSize = landscape ? 300 : 430;
	const logoY = landscape ? 150 : 470;

	// fundo: escurece a cena e cria um "palco" com feixes de luz girando
	const bg = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
	const flash = interpolate(frame, [3, 5, 14], [0, 0.9, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const shock = interpolate(frame, [4, 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

	// logo: cai de cima com escala grande e assenta (slam), depois "respira"
	const slam = spring({frame: frame - 3, fps, config: {damping: 11, stiffness: 180, mass: 0.9}});
	const breathe = 1 + 0.02 * Math.sin(t * 3);
	const logoScale = interpolate(slam, [0, 1], [2.6, 1]) * (t > 1 ? breathe : 1);

	// nome digitado
	const typeStart = 0.5;
	const chars = Math.max(0, Math.min(CHANNEL.length, Math.floor((t - typeStart) * 18)));
	const caret = Math.floor(frame / 8) % 2 === 0 && t >= typeStart && t < typeStart + CHANNEL.length / 18 + 0.4;
	const tag = spring({frame: frame - Math.round((typeStart + 0.6) * fps), fps, config: {damping: 14, stiffness: 220}});

	// botões
	const btnIn = spring({frame: frame - Math.round(1.0 * fps), fps, config: {damping: 13, stiffness: 240}});
	const clickF = Math.round(subAt * fps);
	const pressed = frame >= clickF;
	const press = interpolate(frame, [clickF - 2, clickF, clickF + 5], [1, 0.9, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const bellF = clickF + 10;
	const bellSwing = frame >= bellF ? Math.sin((frame - bellF) / 2.2) * 26 * Math.exp(-(frame - bellF) / 14) : 0;
	const likeF = clickF + 22;
	const likePop = spring({frame: frame - likeF, fps, config: {damping: 8, stiffness: 300}});
	const liked = frame >= likeF;

	// cursor: entra pela direita, vai ao botão, clica, depois vai ao like
	const btnY = logoY + logoSize + (landscape ? 210 : 330);
	const subX = cx - (landscape ? 70 : 60);
	const likeX = cx + (landscape ? 310 : 270);
	const cur = (k: number) => interpolate(frame, [clickF - 22, clickF - 2, likeF - 10, likeF], k === 0 ? [width + 80, subX + 40, subX + 40, likeX + 10] : [height * 0.9, btnY + 20, btnY + 20, btnY + 20], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
	const curOn = frame >= clickF - 22;

	const ribbon = spring({frame: frame - Math.round((subAt + 1.4) * fps), fps, config: {damping: 15, stiffness: 200}});

	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<AbsoluteFill style={{background: `rgba(5,3,10,${0.82 * bg})`}} />
			{/* feixes de luz giratórios atrás da logo */}
			<AbsoluteFill style={{opacity: 0.55 * bg}}>
				{Array.from({length: 10}).map((_, i) => (
					<div key={i} style={{position: 'absolute', left: cx - 9, top: logoY + logoSize / 2 - height, width: 18, height: height * 2, background: `linear-gradient(180deg, rgba(255,62,154,0) 0%, ${i % 2 ? 'rgba(255,62,154,0.28)' : 'rgba(123,60,255,0.28)'} 50%, rgba(255,62,154,0) 100%)`, transformOrigin: `9px ${height}px`, transform: `rotate(${i * 18 + t * 14}deg)`, filter: 'blur(6px)'}} />
				))}
			</AbsoluteFill>
			{/* partículas subindo */}
			{Array.from({length: 40}).map((_, i) => {
				const x = random(`ox${i}`) * width;
				const sp = 40 + random(`os${i}`) * 120;
				const y = height - ((t * sp + random(`oy${i}`) * height) % (height + 40));
				const r = 1.5 + random(`or${i}`) * 4;
				return <div key={i} style={{position: 'absolute', left: x, top: y, width: r * 2, height: r * 2, borderRadius: r, background: i % 3 ? C.pink : C.yellow, opacity: 0.5 * bg, boxShadow: `0 0 10px ${i % 3 ? C.pink : C.yellow}`}} />;
			})}
			{/* onda de choque */}
			<div style={{position: 'absolute', left: cx - 40, top: logoY + logoSize / 2 - 40, width: 80, height: 80, borderRadius: 40, border: `8px solid ${C.pink}`, transform: `scale(${1 + shock * 18})`, opacity: (1 - shock) * 0.9}} />
			{/* logo original */}
			{WATERMARK === null ? null : (
				<div style={{position: 'absolute', left: cx - logoSize / 2, top: logoY, width: logoSize, height: logoSize, transform: `scale(${logoScale})`, opacity: interpolate(slam, [0, 0.2], [0, 1], {extrapolateRight: 'clamp'})}}>
					<div style={{position: 'absolute', inset: -10, borderRadius: logoSize * 0.13, background: GRAD, filter: 'blur(26px)', opacity: 0.85}} />
					<div style={{position: 'absolute', inset: 0, padding: 8, borderRadius: logoSize * 0.12, background: GRAD}}>
						<Img src={staticFile(WATERMARK)} style={{display: 'block', width: '100%', height: '100%', borderRadius: logoSize * 0.1}} />
					</div>
				</div>
			)}
			{/* nome + tagline */}
			<div style={{position: 'absolute', left: 0, right: 0, top: logoY + logoSize + (landscape ? 24 : 40), textAlign: 'center'}}>
				<div style={{fontFamily: DISPLAY, fontSize: landscape ? 92 : 120, letterSpacing: 6, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 6px 0 #000)', minHeight: landscape ? 100 : 130}}>
					{CHANNEL.slice(0, chars)}
					{caret ? <span style={{color: 'white', WebkitTextFillColor: 'white'}}>|</span> : null}
				</div>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: landscape ? 28 : 36, letterSpacing: 8, color: 'rgba(255,255,255,0.85)', opacity: tag, transform: `translateY(${(1 - tag) * 20}px)`}}>{tagline}</div>
			</div>
			{/* botões */}
			<div style={{position: 'absolute', left: 0, right: 0, top: btnY - 40, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: landscape ? 26 : 22, opacity: btnIn, transform: `translateY(${(1 - btnIn) * 60}px)`}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 14, background: pressed ? '#2c2c2c' : '#FF0033', padding: landscape ? '16px 34px' : '20px 38px', borderRadius: 60, boxShadow: pressed ? '0 8px 20px rgba(0,0,0,0.6)' : '0 0 40px rgba(255,0,51,0.6), 0 12px 30px rgba(0,0,0,0.6)', transform: `scale(${press})`}}>
					<span style={{fontFamily: UI, fontWeight: 800, fontSize: landscape ? 38 : 46, color: 'white', letterSpacing: 1}}>{pressed ? 'INSCRITO ✓' : 'INSCREVER-SE'}</span>
				</div>
				<div style={{width: landscape ? 84 : 96, height: landscape ? 84 : 96, borderRadius: 50, background: frame >= bellF ? C.yellow : 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${bellSwing}deg)`, transformOrigin: '50% 10%'}}>
					<svg width={landscape ? 46 : 52} height={landscape ? 46 : 52} viewBox="0 0 24 24">
						<path d="M12 22a2.5 2.5 0 002.5-2.5h-5A2.5 2.5 0 0012 22zm7-6V11a7 7 0 00-5.5-6.8V3.5a1.5 1.5 0 00-3 0v.7A7 7 0 005 11v5l-2 2v1h18v-1z" fill={frame >= bellF ? C.ink : 'white'} />
					</svg>
				</div>
				<div style={{width: landscape ? 84 : 96, height: landscape ? 84 : 96, borderRadius: 50, background: liked ? '#1E88FF' : 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${liked ? interpolate(likePop, [0, 1], [1.5, 1]) : 1})`, boxShadow: liked ? '0 0 30px rgba(30,136,255,0.7)' : 'none'}}>
					<svg width={landscape ? 44 : 50} height={landscape ? 44 : 50} viewBox="0 0 24 24">
						<path d="M2 21h4V9H2v12zm20-11a2 2 0 00-2-2h-6.3l1-4.6v-.3a1.5 1.5 0 00-.4-1L13.2 1 6.6 7.6A2 2 0 006 9v10a2 2 0 002 2h9a2 2 0 001.8-1.2l3-7.1c.1-.2.2-.5.2-.7v-2z" fill="white" />
					</svg>
				</div>
			</div>
			{/* cursor */}
			{curOn ? (
				<svg width={56} height={56} viewBox="0 0 24 24" style={{position: 'absolute', left: cur(0), top: cur(1), filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.7))', transform: `scale(${frame >= clickF - 2 && frame < clickF + 4 ? 0.85 : 1})`}}>
					<path d="M4 2l16 9-7 2-3 7z" fill="white" stroke="#000" strokeWidth={1.2} />
				</svg>
			) : null}
			{/* faixa final */}
			<div style={{position: 'absolute', left: 0, right: 0, top: btnY + (landscape ? 90 : 120), textAlign: 'center', opacity: ribbon, transform: `translateY(${(1 - ribbon) * 30}px)`}}>
				<span style={{display: 'inline-block', fontFamily: UI, fontWeight: 800, fontSize: landscape ? 26 : 32, letterSpacing: 6, color: C.ink, background: C.yellow, padding: '8px 22px', borderRadius: 8}}>🔍 PRÓXIMA INVESTIGAÇÃO EM BREVE</span>
			</div>
			<AbsoluteFill style={{background: 'white', opacity: flash}} />
		</AbsoluteFill>
	);
};
