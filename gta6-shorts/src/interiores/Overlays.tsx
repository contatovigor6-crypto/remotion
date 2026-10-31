import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame} from 'remotion';
import {At, useOut, useSpring} from '../components/Overlays';
import {Chapter, ChipRow, EndCard, Label, Pill, Quote} from '../edge/Overlays';
import {C, DISPLAY, GRAD, UI, f} from '../theme';

// Overlays do vídeo LONGO "Os interiores de GTA 6" (1920×1080).
const GREEN = '#3DFF8A';
const useAt = (start: number, at: number, damping = 12, stiffness = 260) => useSpring(at - start, damping, stiffness);

const Hook: React.FC<{dur: number}> = ({dur}) => {
	const a = useSpring(0.2, 12, 240);
	const b = useSpring(0.9, 10, 280);
	const out = useOut(dur, 6);
	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: out, background: `rgba(11,6,18,${0.35 * out})`}}>
			<div style={{fontFamily: DISPLAY, fontSize: 140, color: 'white', textShadow: '0 8px 0 #000', opacity: a, transform: `scale(${interpolate(a, [0, 1], [1.4, 1])})`, marginTop: -140}}>O QUE TEM ATRÁS</div>
			<div style={{fontFamily: DISPLAY, fontSize: 190, lineHeight: 1, backgroundImage: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 10px 0 #000)', opacity: b, transform: `scale(${interpolate(b, [0, 1], [1.8, 1])})`}}>DA PORTA?</div>
		</AbsoluteFill>
	);
};

/** "Fachada": porta que não abre (ILUSTRAÇÃO) */
const Facade: React.FC<{start: number; dur: number; doorAt: number; facadeAt: number}> = ({start, dur, doorAt, facadeAt}) => {
	const frame = useCurrentFrame();
	const t = start + frame / 30;
	const d = useAt(start, doorAt, 12, 260);
	const fa = useAt(start, facadeAt, 9, 320);
	const out = useOut(dur);
	const shake = t >= doorAt && t < doorAt + 0.8 ? Math.sin(frame * 2.2) * 8 : 0;
	return (
		<div style={{position: 'absolute', top: 150, right: 120, opacity: out}}>
			<div style={{position: 'relative', width: 260, height: 420, background: '#5b3a24', border: '14px solid #2b1a0e', borderRadius: 10, opacity: d, transform: `translateX(${shake}px) scale(${interpolate(d, [0, 1], [0.6, 1])})`, boxShadow: '0 20px 50px rgba(0,0,0,0.6)'}}>
				<div style={{position: 'absolute', right: 26, top: 200, width: 30, height: 30, borderRadius: 15, background: C.yellow}} />
				<div style={{position: 'absolute', inset: 30, border: '6px solid rgba(0,0,0,0.25)', borderRadius: 6}} />
			</div>
			{t >= facadeAt ? (
				<div style={{position: 'absolute', top: 160, left: -80, opacity: fa, transform: `rotate(-12deg) scale(${interpolate(fa, [0, 1], [2.2, 1])})`}}>
					<span style={{display: 'inline-block', fontFamily: DISPLAY, fontSize: 96, color: C.red, border: `10px solid ${C.red}`, borderRadius: 14, padding: '0 26px', background: 'rgba(255,255,255,0.9)'}}>SÓ FACHADA</span>
				</div>
			) : null}
		</div>
	);
};

const XRow: React.FC<{start: number; dur: number; rows: [boolean, string, number][]; title?: string}> = ({start, dur, rows, title}) => {
	const frame = useCurrentFrame();
	const out = useOut(dur);
	return (
		<div style={{position: 'absolute', top: 170, right: 60, width: 860, opacity: out}}>
			{title ? <div style={{fontFamily: UI, fontWeight: 800, fontSize: 28, letterSpacing: 6, color: C.yellow, textShadow: '0 2px 8px #000'}}>{title}</div> : null}
			{rows.map(([ok, text, at]) => {
				const p = spring({frame: frame - f(at - start), fps: 30, config: {damping: 11, stiffness: 280}});
				return frame >= f(at - start) ? (
					<div key={text} style={{display: 'flex', alignItems: 'center', gap: 18, background: 'rgba(11,6,18,0.9)', borderRadius: 14, padding: '14px 24px', marginTop: 14, borderLeft: `10px solid ${ok ? GREEN : C.red}`, opacity: p, transform: `translateX(${(1 - p) * 300}px)`}}>
						<span style={{fontFamily: DISPLAY, fontSize: 54, color: ok ? GREEN : C.red}}>{ok ? '✓' : '✗'}</span>
						<span style={{fontFamily: DISPLAY, fontSize: 48, color: 'white'}}>{text}</span>
					</div>
				) : null;
			})}
		</div>
	);
};

/** Cômodo "comum" vs cômodo que conta história */
const RoomStory: React.FC<{start: number; dur: number; items: [string, string, number][]}> = ({start, dur, items}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	return (
		<div style={{position: 'absolute', top: 160, right: 60, width: 640, opacity: out}}>
			<div style={{background: 'rgba(11,6,18,0.92)', borderRadius: 18, padding: '20px 24px', borderLeft: `12px solid ${C.orange}`, opacity: s}}>
				<div style={{fontFamily: DISPLAY, fontSize: 54, color: 'white'}}>🏠 O QUE A CASA CONTA</div>
				{items.map(([icon, text, at]) => {
					const p = spring({frame: frame - f(at - start), fps: 30, config: {damping: 12, stiffness: 280}});
					return frame >= f(at - start) ? (
						<div key={text} style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 12, opacity: p, transform: `translateX(${(1 - p) * 120}px)`}}>
							<span style={{fontSize: 48}}>{icon}</span>
							<span style={{fontFamily: DISPLAY, fontSize: 44, color: 'white'}}>{text}</span>
						</div>
					) : null;
				})}
			</div>
		</div>
	);
};

/** Ondas de "cheiro" + reação do Jason */
const Smell: React.FC<{start: number; dur: number; smellAt: number}> = ({start, dur, smellAt}) => {
	const frame = useCurrentFrame();
	const t = start + frame / 30;
	const out = useOut(dur);
	const s = useAt(start, smellAt, 10, 280);
	return (
		<AbsoluteFill style={{opacity: out}}>
			{t >= smellAt
				? [0, 1, 2].map((i) => {
						const k = ((frame - f(smellAt - start)) / 30 + i * 0.45) % 1.4;
						return (
							<svg key={i} width={200} height={300} style={{position: 'absolute', left: 1180 + i * 70, top: 520 - k * 260, opacity: interpolate(k, [0, 0.3, 1.2, 1.4], [0, 1, 1, 0])}}>
								<path d="M100 290 C 40 230, 160 180, 100 120 C 40 60, 160 30, 100 0" stroke="#9BE07F" strokeWidth={12} fill="none" strokeLinecap="round" />
							</svg>
						);
					})
				: null}
			<div style={{position: 'absolute', top: 190, right: 80, opacity: s, transform: `scale(${interpolate(s, [0, 1], [1.8, 1])})`}}>
				<Pill bg={GREEN} color={C.ink} size={44}>
					🤢 JASON REAGE AO CHEIRO
				</Pill>
			</div>
		</AbsoluteFill>
	);
};

const Poll: React.FC<{start: number; dur: number; aAt: number; bAt: number}> = ({start, dur, aAt, bAt}) => {
	const frame = useCurrentFrame();
	const s = useSpring(0, 13, 240);
	const out = useOut(dur);
	const opt = (l: string, text: string, sub: string, at: number, color: string) => {
		const p = spring({frame: frame - f(at - start), fps: 30, config: {damping: 11, stiffness: 280}});
		return (
			<div style={{flex: 1, background: 'rgba(255,255,255,0.96)', borderRadius: 22, padding: '20px 24px', opacity: frame >= f(at - start) ? p : 0, transform: `scale(${interpolate(p, [0, 1], [0.7, 1])})`, boxShadow: '0 14px 34px rgba(0,0,0,0.45)'}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
					<div style={{width: 76, height: 76, borderRadius: 16, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
						<span style={{fontFamily: DISPLAY, fontSize: 56, color: 'white'}}>{l}</span>
					</div>
					<span style={{fontFamily: DISPLAY, fontSize: 56, color: C.ink, lineHeight: 1}}>{text}</span>
				</div>
				<div style={{fontFamily: UI, fontWeight: 800, fontSize: 26, color: '#555', marginTop: 10}}>{sub}</div>
			</div>
		);
	};
	return (
		<div style={{position: 'absolute', top: 120, left: 260, right: 260, opacity: out}}>
			<div style={{textAlign: 'center', opacity: s}}>
				<Pill bg={C.pink} size={34}>
					💬 COMENTE A OU B
				</Pill>
			</div>
			<div style={{display: 'flex', gap: 26, marginTop: 24}}>
				{opt('A', '🏘️ CENTENAS DE CASAS', 'mesmo com interiores mais simples', aAt, '#1FA7C9')}
				{opt('B', '💎 MENOS LUGARES', 'mas cada um extremamente detalhado', bAt, C.red)}
			</div>
		</div>
	);
};

// ------------------------------------------------------------------ timeline

export const InterioresOverlays: React.FC = () => (
	<AbsoluteFill>
		<At from={0} to={5.0}>
			<Hook dur={5.0} />
		</At>
		<At from={13.4} to={16.7}>
			<Label text="🚪 MUITO MAIS INTERIORES" dur={3.3} color={C.orange} />
		</At>
		<At from={25.5} to={32.4}>
			<Label text="🔍 UM DETALHE DA DEMONSTRAÇÃO" dur={6.9} color={C.cyan} />
		</At>
		<At from={32.4} to={42.8}>
			<Chapter n={1} title="O FIM DAS FACHADAS?" sub="PRÉDIOS QUE ERAM SÓ CENÁRIO" dur={10.4} />
		</At>
		<At from={42.8} to={48.0}>
			<ChipRow
				start={42.8}
				dur={5.2}
				items={[
					['🏢 APARTAMENTOS', 43.5, C.purple],
					['🛍️ LOJAS', 44.6, C.pink],
					['🏠 CASAS', 45.6, C.orange],
					['🏪 COMÉRCIOS', 46.1, C.ink],
				]}
			/>
		</At>
		<At from={48.0} to={55.3}>
			<Facade start={48.0} dur={7.3} doorAt={51.2} facadeAt={54.8} />
		</At>
		<At from={61.1} to={67.0}>
			<Chapter n={2} title="UMA ORDEM DE GRANDEZA" sub="A MAIS DE INTERIORES" dur={5.9} />
		</At>
		<At from={67.0} to={75.7}>
			<Quote dur={8.7} who="SEGUNDO AARON GARBUT" role="ROCKSTAR NORTH · REVISTA EDGE" text="GTA 6 tem uma ordem de grandeza a mais de interiores que os jogos anteriores." />
		</At>
		<At from={80.5} to={88.7}>
			<XRow
				start={80.5}
				dur={8.2}
				title="ISSO NÃO SIGNIFICA…"
				rows={[
					[false, 'TODAS AS CASAS DO MAPA ABERTAS', 82.5],
					[false, 'ENTRAR EM QUALQUER EDIFÍCIO', 86.1],
				]}
			/>
		</At>
		<At from={88.7} to={99.6}>
			<XRow
				start={88.7}
				dur={10.9}
				title="O QUE A INFORMAÇÃO INDICA"
				rows={[
					[true, 'MUITO MAIS AMBIENTES INTERNOS', 93.7],
					[true, 'MAIS LUGARES PARA EXPLORAR', 96.7],
				]}
			/>
		</At>
		<At from={99.6} to={111.4}>
			<Chapter n={3} title="LUGARES QUE CONTAM HISTÓRIAS" sub="NÃO SÓ QUATRO PAREDES E UMA PORTA" dur={11.8} />
		</At>
		<At from={115.7} to={128.6}>
			<RoomStory
				start={115.7}
				dur={12.9}
				items={[
					['🖼️', 'FOTOS DE FAMÍLIA', 118.2],
					['🧸', 'OBJETOS PESSOAIS', 120.0],
					['🛋️', 'MÓVEIS NO ESTILO DOS MORADORES', 121.6],
					['☕', 'SINAIS DE QUE ALGUÉM VIVE ALI', 125.0],
				]}
			/>
		</At>
		<At from={144.7} to={152.1}>
			<Label text="✨ PERSONALIDADE ATÉ EM LUGARES COMUNS" dur={7.4} color={C.purple} />
		</At>
		<At from={152.1} to={159.0}>
			<Chapter n={4} title="A CENA DO CACHORRO" sub="UM DETALHE MOSTRADO NA DEMONSTRAÇÃO" dur={6.9} />
		</At>
		<At from={160.0} to={166.3}>
			<Label text="🐕 BAGUNÇA FEITA POR UM CACHORRO" dur={6.3} color={C.orange} />
		</At>
		<At from={169.3} to={177.3}>
			<Smell start={169.3} dur={8.0} smellAt={172.4} />
		</At>
		<At from={185.0} to={198.8}>
			<Label text="⚙️ SISTEMAS TRABALHANDO JUNTOS" dur={13.8} color={C.cyan} />
		</At>
		<At from={198.8} to={205.0}>
			<Chapter n={5} title="VIDA ACONTECENDO ALI" sub="MESMO QUANDO VOCÊ NÃO ESTÁ" dur={6.2} />
		</At>
		<At from={228.3} to={239.5}>
			<ChipRow
				start={228.3}
				dur={11.2}
				items={[
					['🔍 LUGARES CURIOSOS', 229.9, C.purple],
					['👀 DETALHES DO MUNDO', 232.1, C.cyan],
					['📖 PEQUENAS HISTÓRIAS', 235.1, C.orange],
				]}
			/>
		</At>
		<At from={239.5} to={246.0}>
			<Chapter n={6} title="O QUE AINDA NÃO SABEMOS" sub="SEM LISTA COMPLETA DE INTERIORES" dur={6.5} />
		</At>
		<At from={251.0} to={260.2}>
			<XRow
				start={251.0}
				dur={9.2}
				title="NÃO DÁ PARA AFIRMAR QUE PODEREMOS…"
				rows={[
					[false, 'ENTRAR EM TODAS AS CASAS', 254.4],
					[false, 'EXPLORAR TODOS OS APARTAMENTOS', 255.7],
					[false, 'VASCULHAR QUALQUER COMÉRCIO', 257.9],
				]}
			/>
		</At>
		<At from={262.8} to={269.8}>
			<Label text="🎯 PRIORIDADE: INTERIORES MAIS IMPORTANTES" dur={7.0} color={GREEN} />
		</At>
		<At from={269.8} to={276.0}>
			<Chapter n={7} title="A CONEXÃO COM OS NPCs" sub="PERSONALIDADES, AMBIENTE E SITUAÇÕES" dur={6.2} />
		</At>
		<At from={278.5} to={285.4}>
			<ChipRow
				start={278.5}
				dur={6.9}
				title="OS PERSONAGENS REAGEM CONFORME…"
				items={[
					['🎭 PERSONALIDADE', 281.2, C.purple],
					['🏠 AMBIENTE', 282.7, C.orange],
					['⚡ SITUAÇÕES', 283.8, C.red],
				]}
			/>
		</At>
		<At from={297.5} to={304.1}>
			<Label text="🏠 ATÉ UMA CASA COMUM VALE A PENA?" dur={6.6} color={C.pink} />
		</At>
		<At from={308.4} to={323.8}>
			<ChipRow
				start={308.4}
				dur={15.4}
				items={[
					['🗺️ MAPA ENORME IMPRESSIONA AO OLHAR', 309.5, C.ink],
					['🔎 MUNDO BEM FEITO IMPRESSIONA NOS DETALHES', 314.3, C.pink],
				]}
			/>
		</At>
		<At from={325.0} to={340.9}>
			<Poll start={325.0} dur={15.9} aAt={328.0} bAt={332.8} />
		</At>
		<At from={340.9} to={356.2}>
			<EndCard start={340.9} subAt={345.9} />
		</At>
	</AbsoluteFill>
);
