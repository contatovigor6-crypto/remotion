import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame} from 'remotion';
import {At, Chip, Stamp, useOut, useSpring} from '../components/Overlays';
import {EndCard} from '../fps/Overlays';
import {C, DISPLAY, GRAD, SAFE, UI, f} from '../theme';

const GREEN = '#3DFF8A';
const useAt = (start: number, at: number, damping = 12, stiffness = 260) => useSpring(at - start, damping, stiffness);

const Hook: React.FC<{dur: number}> = ({dur}) => {
	const a = useSpring(0, 12, 260);
	const b = useSpring(0.9, 10, 300);
	const out = useOut(dur, 3);
	return (
		<AbsoluteFill style={{alignItems: 'center', top: 400, opacity: out}}>
			<div style={{fontFamily: DISPLAY, fontSize: 130, color: 'white', textShadow: '0 6px 0 #000', opacity: a, transform: `scale(${interpolate(a, [0, 1], [1.5, 1])})`}}>A SEMANA MAIS</div>
			<div style={{fontFamily: DISPLAY, fontSize: 170, lineHeight: 1, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 8px 0 #000)', opacity: b, transform: `scale(${interpolate(b, [0, 1], [1.8, 1])})`}}>IMPORTANTE</div>
		</AbsoluteFill>
	);
};

/** Calendário de novembro: 12 → 26 marcado, 19 = lançamento */
const Calendar: React.FC<{start: number; dur: number; launchAt: number; voteAt: number; preloadAt: number}> = ({start, dur, launchAt, voteAt, preloadAt}) => {
	const frame = useCurrentFrame();
	const t = start + frame / 30;
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	const first = 0; // 1º de novembro de 2026 cai num domingo
	const cells = Array.from({length: 35}, (_, i) => i - first + 1);
	const voteGrow = interpolate(t, [voteAt, voteAt + 1.4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 330, left: SAFE.left, right: 140, background: 'rgba(255,255,255,0.96)', borderRadius: 26, padding: '20px 22px', opacity: s, transform: `translateY(${(1 - s) * 80}px)`, boxShadow: '0 20px 50px rgba(0,0,0,0.55)'}}>
				<div style={{fontFamily: DISPLAY, fontSize: 60, color: C.ink, textAlign: 'center'}}>NOVEMBRO 2026</div>
				<div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginTop: 10}}>
					{['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
						<div key={i} style={{fontFamily: UI, fontWeight: 800, fontSize: 22, color: '#888', textAlign: 'center'}}>{d}</div>
					))}
					{cells.map((d, i) => {
						const valid = d >= 1 && d <= 30;
						const inVote = valid && d >= 12 && d <= 26 && t >= voteAt && (d - 12) / 14 <= voteGrow;
						const launch = d === 19 && t >= launchAt;
						const preload = d === 12 && t >= preloadAt;
						return (
							<div key={i} style={{height: 64, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 36, color: launch ? 'white' : valid ? C.ink : 'transparent', background: launch ? C.pink : inVote ? 'rgba(61,255,138,0.45)' : 'transparent', border: preload ? `4px solid ${C.orange}` : '4px solid transparent', transform: launch ? 'scale(1.12)' : 'none'}}>
								{valid ? d : ''}
							</div>
						);
					})}
				</div>
				<div style={{display: 'flex', gap: 14, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap'}}>
					{t >= launchAt ? <Chip bg={C.pink} size={24}>🎮 19 · LANÇAMENTO</Chip> : null}
					{t >= voteAt ? <Chip bg="#159a52" size={24}>🗳️ 12–26 · VOTAÇÃO</Chip> : null}
					{t >= preloadAt ? <Chip bg={C.orange} size={24}>⬇️ 12 · PRÉ-CARREGAMENTO</Chip> : null}
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Urna de votação + IWGB */
const Ballot: React.FC<{start: number; dur: number; ukAt: number; iwgbAt: number}> = ({start, dur, ukAt, iwgbAt}) => {
	const frame = useCurrentFrame();
	const t = start + frame / 30;
	const s = useSpring(0, 12, 240);
	const u = useAt(start, ukAt, 11, 280);
	const w = useAt(start, iwgbAt, 10, 300);
	const out = useOut(dur);
	const drop = ((frame % 45) / 45) * 160;
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 360, left: SAFE.left, opacity: u, transform: `translateX(${(1 - u) * -200}px)`}}>
				<Chip bg={C.ink} size={34}>
					🇬🇧 ROCKSTAR · REINO UNIDO
				</Chip>
			</div>
			<div style={{position: 'absolute', top: 470, left: 330, width: 420, height: 380, opacity: s}}>
				<div style={{position: 'absolute', left: 150, top: drop - 60, width: 120, height: 150, background: 'white', borderRadius: 8, border: '4px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 60, color: GREEN, opacity: drop < 120 ? 1 : 0}}>✓</div>
				<div style={{position: 'absolute', left: 0, right: 0, top: 120, bottom: 0, background: 'linear-gradient(180deg, #2b2b38, #15151d)', borderRadius: 24, border: '6px solid rgba(255,255,255,0.85)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)'}}>
					<div style={{position: 'absolute', left: 90, right: 90, top: -6, height: 16, background: '#000', borderRadius: 8}} />
					<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 64, color: 'white'}}>🗳️ VOTAÇÃO</div>
				</div>
			</div>
			{t >= iwgbAt ? (
				<div style={{position: 'absolute', top: 900, left: 0, right: 0, textAlign: 'center', opacity: w, transform: `scale(${interpolate(w, [0, 1], [1.8, 1])})`}}>
					<Chip bg={C.red} size={40}>
						SINDICATO BRITÂNICO · IWGB
					</Chip>
				</div>
			) : null}
		</AbsoluteFill>
	);
};

const TOPICS: [string, string, number][] = [
	['💰', 'SALÁRIOS', 43.8],
	['⏰', 'HORAS EXTRAS', 44.9],
	['📄', 'DEMISSÕES', 45.7],
	['🏢', 'CONDIÇÕES DE TRABALHO', 46.5],
];
const Topics: React.FC<{start: number; dur: number}> = ({start, dur}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 370, left: SAFE.left, right: 140}}>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 28, letterSpacing: 6, color: C.yellow, textShadow: '0 2px 8px #000', opacity: s}}>SE O "SIM" VENCER…</div>
				<div style={{fontFamily: DISPLAY, fontSize: 84, color: 'white', lineHeight: 1.05, textShadow: '0 6px 0 #000', opacity: s}}>REPRESENTAÇÃO COLETIVA</div>
				{TOPICS.map(([icon, text, at]) => {
					const p = spring({frame: frame - f(at - start), fps: 30, config: {damping: 11, stiffness: 300}});
					return frame >= f(at - start) ? (
						<div key={text} style={{display: 'flex', alignItems: 'center', gap: 18, background: 'rgba(11,6,18,0.9)', borderRadius: 16, padding: '12px 22px', marginTop: 14, borderLeft: `10px solid ${GREEN}`, opacity: p, transform: `translateX(${(1 - p) * 220}px)`}}>
							<span style={{fontSize: 52}}>{icon}</span>
							<span style={{fontFamily: DISPLAY, fontSize: 56, color: 'white'}}>{text}</span>
						</div>
					) : null;
				})}
			</div>
		</AbsoluteFill>
	);
};

/** Dois trilhos lado a lado: jogadores entrando × votação nos estúdios */
const TwoTracks: React.FC<{start: number; dur: number; playersAt: number; studioAt: number}> = ({start, dur, playersAt, studioAt}) => {
	const a = useAt(start, playersAt, 11, 280);
	const b = useAt(start, studioAt, 11, 280);
	const out = useOut(dur);
	const card = (icon: string, title: string, sub: string, p: number, color: string, dx: number) => (
		<div style={{flex: 1, background: 'rgba(11,6,18,0.92)', border: `5px solid ${color}`, borderRadius: 24, padding: '20px 16px', textAlign: 'center', opacity: p, transform: `translateX(${(1 - p) * dx}px)`}}>
			<div style={{fontSize: 84}}>{icon}</div>
			<div style={{fontFamily: DISPLAY, fontSize: 52, color: 'white', lineHeight: 1.05}}>{title}</div>
			<div style={{fontFamily: UI, fontWeight: 800, fontSize: 22, color, marginTop: 6, letterSpacing: 2}}>{sub}</div>
		</div>
	);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 400, left: SAFE.left, right: 140, display: 'flex', gap: 22}}>
				{card('🎮', 'MILHÕES DE JOGADORES', 'ENTRANDO EM LEONIDA', a, C.pink, -300)}
				{card('🗳️', 'DENTRO DOS ESTÚDIOS', 'MOMENTO DECISIVO', b, GREEN, 300)}
			</div>
		</AbsoluteFill>
	);
};

const Clarify: React.FC<{start: number; dur: number; noAt: number}> = ({start, dur, noAt}) => {
	const s = useSpring(0, 13, 240);
	const n = useAt(start, noAt, 11, 280);
	const out = useOut(dur);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: 380, left: SAFE.left, right: 140, opacity: s}}>
				<Chip bg={C.yellow} color={C.ink} size={34}>
					⚠ IMPORTANTE
				</Chip>
				<div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 20}}>
					<Chip bg={C.pink} size={40}>
						🎮 LANÇAMENTO
					</Chip>
					<span style={{fontFamily: DISPLAY, fontSize: 70, color: 'white'}}>≠</span>
					<Chip bg="#159a52" size={40}>
						🗳️ VOTAÇÃO
					</Chip>
				</div>
				<div style={{fontFamily: DISPLAY, fontSize: 64, color: 'white', marginTop: 14, textShadow: '0 5px 0 #000'}}>ACONTECIMENTOS DISTINTOS</div>
				<div style={{marginTop: 18, opacity: n, transform: `translateX(${(1 - n) * 200}px)`, background: 'rgba(11,6,18,0.9)', borderRadius: 16, padding: '14px 22px', borderLeft: `10px solid ${C.orange}`}}>
					<span style={{fontFamily: DISPLAY, fontSize: 50, color: 'white'}}>SEM CONFIRMAÇÃO DE QUE UM AFETE O OUTRO</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ------------------------------------------------------------------ timeline

export const SindicatoOverlays: React.FC = () => (
	<AbsoluteFill>
		<At from={0} to={5.6}>
			<Hook dur={5.6} />
		</At>
		<At from={7.3} to={9.7}>
			<AbsoluteFill style={{alignItems: 'center', top: 470}}>
				<Chip bg={C.pink} size={46}>
					👀 QUASE NINGUÉM ESTÁ VENDO
				</Chip>
			</AbsoluteFill>
		</At>
		<At from={9.7} to={21.7}>
			<Calendar start={9.7} dur={12} launchAt={10.1} voteAt={99} preloadAt={99} />
		</At>
		<At from={21.7} to={27.1}>
			<Calendar start={21.7} dur={5.4} launchAt={21.7} voteAt={22.4} preloadAt={99} />
		</At>
		<At from={27.1} to={34.4}>
			<Ballot start={27.1} dur={7.3} ukAt={27.1} iwgbAt={31.6} />
		</At>
		<At from={34.4} to={36.6}>
			<Stamp text="POR QUE IMPORTA?" top={500} color={C.yellow} />
		</At>
		<At from={38.0} to={47.9}>
			<Topics start={38.0} dur={9.9} />
		</At>
		<At from={47.9} to={49.8}>
			<Stamp text="COINCIDÊNCIA?" top={500} color={C.cyan} />
		</At>
		<At from={49.8} to={58.5}>
			<Calendar start={49.8} dur={8.7} launchAt={56.6} voteAt={50.0} preloadAt={54.0} />
		</At>
		<At from={59.4} to={69.4}>
			<TwoTracks start={59.4} dur={10} playersAt={59.7} studioAt={64.2} />
		</At>
		<At from={69.4} to={79.3}>
			<Clarify start={69.4} dur={9.9} noAt={76.0} />
		</At>
		<At from={81.4} to={86.6}>
			<AbsoluteFill style={{alignItems: 'center', top: 470}}>
				<div style={{fontFamily: DISPLAY, fontSize: 110, color: 'white', textAlign: 'center', textShadow: '0 7px 0 #000', lineHeight: 1}}>NOVEMBRO</div>
				<div style={{fontFamily: DISPLAY, fontSize: 170, lineHeight: 1, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 8px 0 #000)'}}>2026</div>
			</AbsoluteFill>
		</At>
		<At from={86.6} to={90.7}>
			<AbsoluteFill style={{alignItems: 'center', top: 470}}>
				<Chip bg={C.ink} size={44}>
					💬 VOCÊ JÁ SABIA DISSO?
				</Chip>
			</AbsoluteFill>
		</At>
		<At from={90.7} to={95.4}>
			<EndCard start={90.7} subAt={91.8} />
		</At>
	</AbsoluteFill>
);
