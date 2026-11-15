import React from 'react';
import {AbsoluteFill, Html5Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Slideshow} from '../Background';
import {ChannelLogo, LOGO} from '../faq/Fx';
import {body, C, display, mono} from '../theme';

// Vídeo 5: contagem regressiva sem narração, em estilo de telejornal: vinheta de
// "URGENTE", barra do canal no topo, manchete em terço inferior, letreiro correndo e
// enquete. A linha do tempo segue a trilha (100 BPM: 1 compasso = 72 frames).

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const BEAT = 18;
const BAR = 72;
const DAYS = 4; // dias até 19/11 na data de publicação (15/11). Ajuste se postar outro dia.

const DROP = 2 * BAR; // 144: começam as manchetes
const BREAK = 10 * BAR; // 720: enquete
const OUTRO = 12 * BAR; // 864: data + logo
export const EDIT_DURATION = 15 * BAR; // 1080 frames = 36 s

const NAVY = '#0b0e2a';
const PAPER = '#f4f4fb';

// Uma manchete por compasso, todas confirmadas. Fundos inéditos (scripts/check_media.py).
type Fact = {kicker: string; headline: string; detail: string; media: string[]};
const facts: Fact[] = [
	{kicker: 'LANÇAMENTO', headline: '19 de novembro', detail: 'Data oficial mantida, sem novo adiamento.', media: ['jason_and_lucia_17.jpg', 'jason_and_lucia_19.jpg']},
	{kicker: 'PLATAFORMAS', headline: 'PS5 e Xbox Series', detail: 'Só nos consoles da geração atual.', media: ['jason_duval_05.jpg', 'lucia_caminos_07.jpg', 'jason_duval_07.jpg']},
	{kicker: 'A CIDADE', headline: 'Vice City', detail: 'A cidade mais famosa da série está de volta.', media: ['jason_duval_04.jpg', 'lucia_caminos_02.jpg']},
	{kicker: 'O ESTADO', headline: 'Leonida', detail: 'Um estado inteiro para explorar.', media: ['grassrivers_05.jpg', 'leonida_keys_07.jpg', 'port_gellhorn_06.jpg']},
	{kicker: 'PROTAGONISTA', headline: 'Jason Duval', detail: 'Um dos dois protagonistas da história.', media: ['jason_duval_01.jpg', 'jason_duval_09.jpg']},
	{kicker: 'PROTAGONISTA', headline: 'Lucia Caminos', detail: 'A outra metade da dupla.', media: ['lucia_caminos_01.jpg', 'lucia_caminos_03.jpg', 'lucia_caminos_08.jpg']},
	{kicker: 'JÁ LIBERADO', headline: 'Pré-download', detail: 'Disponível para quem comprou a versão digital.', media: ['jason_duval_08.jpg', 'jason_duval_10.jpg']},
	{kicker: 'LIBERAÇÃO', headline: 'Meia-noite', detail: 'No horário local de cada região.', media: ['port_gellhorn_04.jpg', 'vice_city_07.jpg', 'jason_and_lucia_14.jpg']},
];

const TICKER = `GTA VI CHEGA EM 19 DE NOVEMBRO DE 2026  ●  PS5 E XBOX SERIES X|S  ●  PRÉ-DOWNLOAD LIBERADO  ●  LIBERAÇÃO À MEIA-NOITE, NO HORÁRIO LOCAL  ●  VICE CITY E O ESTADO DE LEONIDA  ●  JASON DUVAL E LUCIA CAMINOS  ●  `;

// Faixa que "abre" da esquerda para a direita, como um gerador de caracteres de TV.
const Wipe: React.FC<{at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, dur = 9, children, style}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [at, at + dur], [0, 1], {...clamp, easing: easeOut});
	return <div style={{clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`, transform: `translateX(${(1 - p) * -40}px)`, alignSelf: 'flex-start', ...style}}>{children}</div>;
};

const RedTag: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = C.red}) => (
	<div style={{background: color, color: C.white, fontFamily: mono, fontWeight: 700, fontSize: 32, letterSpacing: 4, padding: '10px 20px'}}>{children}</div>
);

// Terço inferior: etiquetas, manchete em faixa clara e linha de apoio em faixa escura.
const LowerThird: React.FC<{tag: string; kicker: string; headline: string; detail: string; source: string | null}> = ({tag, kicker, headline, detail, source}) => {
	const size = Math.min(150, 840 / (0.47 * headline.length));
	return (
		<div style={{position: 'absolute', left: 60, right: 60, top: 1080, display: 'flex', flexDirection: 'column', gap: 0}}>
			<Wipe at={2}>
				<div style={{display: 'flex'}}>
					<RedTag>{tag}</RedTag>
					<div style={{background: NAVY, color: C.white, fontFamily: mono, fontWeight: 700, fontSize: 32, letterSpacing: 4, padding: '10px 20px'}}>{kicker}</div>
				</div>
			</Wipe>
			<Wipe at={5} dur={11}>
				<div style={{background: PAPER, color: NAVY, fontFamily: display, fontSize: size, lineHeight: 1.08, textTransform: 'uppercase', padding: '10px 30px 4px', borderLeft: `14px solid ${C.red}`, whiteSpace: 'nowrap'}}>{headline}</div>
			</Wipe>
			<Wipe at={11} dur={11} style={{alignSelf: 'stretch'}}>
				<div style={{background: NAVY, color: C.white, fontFamily: body, fontWeight: 600, fontSize: 44, lineHeight: 1.2, padding: '18px 30px', borderLeft: `14px solid ${C.pink}`}}>{detail}</div>
			</Wipe>
			{source ? (
				<Wipe at={18}>
					<div style={{fontFamily: mono, fontSize: 24, color: PAPER, letterSpacing: 3, padding: '10px 4px', textShadow: '0 2px 8px #000'}}>FONTE: {source}</div>
				</Wipe>
			) : null}
		</div>
	);
};

// ── Vinheta de abertura: URGENTE → FALTAM 4 DIAS ─────────────
const Opening: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const slabIn = interpolate(frame, [0, 8], [0, 1], {...clamp, easing: easeOut});
	const slabOut = interpolate(frame, [BAR - 10, BAR], [0, 1], {...clamp, easing: (t) => t * t});
	const word = spring({frame: frame - 4, fps, config: {damping: 11, mass: 0.6}});
	return (
		<>
			{frame < BAR ? (
				<AbsoluteFill style={{background: C.red, transform: `scaleY(${slabIn}) translateY(${-slabOut * 100}%)`, transformOrigin: 'top', justifyContent: 'center', alignItems: 'center', overflow: 'hidden'}}>
					<div style={{position: 'absolute', inset: -200, backgroundImage: 'repeating-linear-gradient(115deg, rgba(0,0,0,0.14) 0 60px, transparent 60px 120px)', transform: `translateX(${frame * 6}px)`}} />
					<div style={{fontFamily: display, fontSize: 250, color: C.white, letterSpacing: 6, transform: `scale(${interpolate(word, [0, 1], [1.8, 1])})`, opacity: Math.min(1, word * 2)}}>URGENTE</div>
					<div style={{fontFamily: mono, fontWeight: 700, fontSize: 44, color: C.white, letterSpacing: 10, marginTop: 10, opacity: interpolate(frame, [16, 24], [0, 1], clamp)}}>GTA VI</div>
				</AbsoluteFill>
			) : (
				<Sequence from={BAR} layout="none">
					<LowerThird tag="CONTAGEM REGRESSIVA" kicker="GTA VI" headline={`Faltam ${DAYS} dias`} detail="Tudo o que já está confirmado para o lançamento." source={null} />
				</Sequence>
			)}
		</>
	);
};

// ── Enquete ──────────────────────────────────────────────────
const Poll: React.FC = () => {
	const frame = useCurrentFrame();
	const bar = (label: string, at: number, color: string, phase: number) => {
		const p = interpolate(frame, [at, at + 12], [0, 1], {...clamp, easing: easeOut});
		// Sem números inventados: as barras só "respiram" enquanto o público vota.
		const w = p * (55 + Math.sin(frame / 9 + phase) * 18);
		return (
			<div style={{display: 'flex', alignItems: 'center', gap: 20, opacity: p}}>
				<div style={{width: 150, fontFamily: display, fontSize: 70, color: PAPER, textShadow: '0 2px 10px #000'}}>{label}</div>
				<div style={{flex: 1, height: 64, background: 'rgba(11,14,42,0.8)'}}>
					<div style={{height: '100%', width: `${w}%`, background: color}} />
				</div>
				<div style={{fontFamily: display, fontSize: 70, color: PAPER, width: 50}}>?</div>
			</div>
		);
	};
	return (
		<>
			<LowerThird tag="ENQUETE" kicker="ZONE GTA VI" headline="Você está pronto?" detail="Vote nos comentários: sim ou não." source={null} />
			<div style={{position: 'absolute', left: 60, right: 60, top: 760, display: 'flex', flexDirection: 'column', gap: 24}}>
				{bar('SIM', BEAT * 2, C.green, 0)}
				{bar('NÃO', BEAT * 2 + 8, C.red, 2)}
			</div>
		</>
	);
};

// ── Encerramento: data em cartela + logo ─────────────────────
const Closing: React.FC = () => {
	const frame = useCurrentFrame();
	const logoAt = 2 * BAR + 4;
	const out = interpolate(frame, [logoAt - 8, logoAt], [1, 0], clamp);
	return (
		<>
			<AbsoluteFill style={{opacity: out, justifyContent: 'center', padding: '0 60px', display: 'flex', flexDirection: 'column', gap: 0}}>
				<Wipe at={2}>
					<RedTag>DATA DE LANÇAMENTO</RedTag>
				</Wipe>
				<Wipe at={6} dur={12}>
					<div style={{background: PAPER, color: NAVY, fontFamily: display, fontSize: 250, lineHeight: 1.05, padding: '6px 34px 0', borderLeft: `14px solid ${C.red}`, whiteSpace: 'nowrap'}}>19 NOV</div>
				</Wipe>
				<Wipe at={12} dur={12}>
					<div style={{background: NAVY, color: C.white, fontFamily: display, fontSize: 150, lineHeight: 1.1, padding: '6px 34px 0', borderLeft: `14px solid ${C.pink}`}}>2026</div>
				</Wipe>
				<Wipe at={20} dur={12}>
					<div style={{background: C.red, color: C.white, fontFamily: mono, fontWeight: 700, fontSize: 38, letterSpacing: 4, padding: '14px 34px'}}>PS5 · XBOX SERIES X|S</div>
				</Wipe>
			</AbsoluteFill>
			{frame >= logoAt ? (
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 50, background: 'rgba(11,14,42,0.55)'}}>
					<ChannelLogo at={logoAt} size={600} />
					<Sequence from={logoAt + 14} layout="none">
						<Wipe at={0} dur={10} style={{alignSelf: 'center'}}>
							<div style={{background: PAPER, color: NAVY, fontFamily: display, fontSize: 84, padding: '8px 30px 2px', borderLeft: `14px solid ${C.red}`}}>SE INSCREVE NO CANAL</div>
						</Wipe>
					</Sequence>
				</AbsoluteFill>
			) : null}
		</>
	);
};

// ── Sound design enxuto: um som por acontecimento, escolhido pelo que aparece ──
// (efeitos de public/sfx/v2; no máximo 2 usos de cada).
type Ev = [name: string, frame: number, volume: number, why: string];
const sfxPlan = (): Ev[] => {
	const ev: Ev[] = [
		['impact_e', 0, 0.75, 'faixa vermelha de URGENTE bate na tela'],
		['alarm', 10, 0.3, 'alerta de notícia urgente'],
		['whoosh_d', BAR - 10, 0.5, 'faixa vermelha sobe e sai'],
		['swish_f', BAR + 5, 0.45, 'manchete "faltam 4 dias" abre'],
	];
	// Cada manchete: um único "swish" quando a faixa abre.
	const swishes = ['whoosh_a', 'whoosh_c', 'whoosh_b', 'whoosh_e', 'whoosh_a', 'whoosh_c', 'whoosh_b', 'whoosh_e'];
	facts.forEach((f, i) => ev.push([swishes[i], DROP + i * BAR + 1, 0.45, `manchete "${f.headline}" abre`]));
	ev.push(
		['notify', BREAK + 4, 0.45, 'aviso de enquete'],
		['pop_a', BREAK + BEAT * 2, 0.4, 'barra SIM aparece'],
		['pop_b', BREAK + BEAT * 2 + 8, 0.4, 'barra NÃO aparece'],
		['impact_a', OUTRO + 6, 0.65, 'cartela da data entra'],
		['riser_a', OUTRO + 2 * BAR + 4 - 40, 0.4, 'preparação para a logo'],
		['stinger_final', OUTRO + 2 * BAR + 4, 0.75, 'logo do canal entra'],
	);
	const count: Record<string, number> = {};
	for (const [name] of ev) {
		count[name] = (count[name] ?? 0) + 1;
		if (count[name] > 2) throw new Error(`Efeito "${name}" usado mais de 2 vezes`);
	}
	return ev;
};

export const Edit: React.FC<{music: string | null}> = ({music}) => {
	const frame = useCurrentFrame();
	const factIndex = frame >= DROP && frame < BREAK ? Math.floor((frame - DROP) / BAR) : -1;
	const cuts = [DROP, ...facts.map((_, i) => DROP + (i + 1) * BAR), OUTRO];
	return (
		<AbsoluteFill style={{backgroundColor: NAVY}}>
			<Slideshow files={['ambrosia_04.jpg', 'ambrosia_02.jpg']} from={0} dur={DROP} />
			{facts.map((f, i) => (
				<Slideshow key={i} files={f.media} from={DROP + i * BAR} dur={BAR} />
			))}
			<Slideshow files={['lucia_caminos_04.jpg', 'v/cal.mp4']} from={BREAK} dur={OUTRO - BREAK} />
			<Slideshow files={['grassrivers_07.jpg', 'ambrosia_06.jpg']} from={OUTRO} dur={EDIT_DURATION - OUTRO} />
			{/* Imagem bem visível, como em reportagem; escurece só onde há texto. */}
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(11,14,42,0.8) 0%, rgba(11,14,42,0.05) 18%, rgba(11,14,42,0.1) 50%, rgba(11,14,42,0.75) 72%, rgba(11,14,42,0.95) 100%)'}} />

			<Sequence from={0} durationInFrames={DROP} name="abertura">
				<Opening />
			</Sequence>
			{facts.map((f, i) => (
				<Sequence key={i} from={DROP + i * BAR} durationInFrames={BAR} name={f.headline}>
					<LowerThird tag="CONFIRMADO" kicker={f.kicker} headline={f.headline} detail={f.detail} source="ROCKSTAR GAMES" />
				</Sequence>
			))}
			<Sequence from={BREAK} durationInFrames={OUTRO - BREAK} name="enquete">
				<Poll />
			</Sequence>
			<Sequence from={OUTRO} durationInFrames={EDIT_DURATION - OUTRO} name="encerramento">
				<Closing />
			</Sequence>

			{/* Corte de reportagem: uma barra clara atravessa a tela a cada manchete. */}
			{cuts.map((at) => {
				const p = interpolate(frame, [at - 3, at + 6], [0, 1], clamp);
				return p > 0 && p < 1 ? <div key={at} style={{position: 'absolute', top: 0, bottom: 0, width: 220, left: `${p * 130 - 25}%`, background: `linear-gradient(90deg, transparent, ${PAPER}, transparent)`, opacity: 0.8}} /> : null;
			})}

			{/* Barra do canal */}
			<div style={{position: 'absolute', top: 128, left: 60, right: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
				<div style={{display: 'flex', alignItems: 'center', background: NAVY, paddingRight: 22, borderLeft: `10px solid ${C.red}`}}>
					<Img src={staticFile(LOGO)} style={{width: 92, height: 92, objectFit: 'cover'}} />
					<div style={{marginLeft: 18}}>
						<div style={{fontFamily: display, fontSize: 46, color: C.white, lineHeight: 1, letterSpacing: 2}}>ZONE GTA VI</div>
						<div style={{fontFamily: mono, fontWeight: 700, fontSize: 22, color: C.pink, letterSpacing: 6}}>NOTÍCIAS</div>
					</div>
				</div>
				<div style={{background: frame < DROP || factIndex < 0 ? C.red : NAVY, color: C.white, fontFamily: mono, fontWeight: 700, fontSize: 30, letterSpacing: 3, padding: '14px 18px'}}>
					{factIndex >= 0 ? `FATO ${String(factIndex + 1).padStart(2, '0')}/08` : `T-${DAYS} DIAS`}
				</div>
			</div>

			{/* Letreiro */}
			<div style={{position: 'absolute', left: 0, right: 0, top: 1560, height: 66, background: NAVY, display: 'flex', alignItems: 'center', overflow: 'hidden', borderTop: `4px solid ${C.red}`}}>
				<div style={{background: C.red, color: C.white, fontFamily: display, fontSize: 40, padding: '0 22px', height: '100%', display: 'flex', alignItems: 'center', zIndex: 1}}>GTA VI</div>
				<div style={{whiteSpace: 'nowrap', fontFamily: body, fontWeight: 600, fontSize: 34, color: C.white, transform: `translateX(${-frame * 5}px)`, paddingLeft: 30}}>
					{TICKER.repeat(4)}
				</div>
			</div>
			<div style={{position: 'absolute', top: 1640, left: 60, fontFamily: mono, fontSize: 20, color: C.dim, letterSpacing: 2}}>IMAGENS: ROCKSTAR GAMES · GTA VI</div>

			{/* Música baixa, de fundo. */}
			{music ? <Html5Audio src={staticFile(`music/${music}`)} volume={0.42} /> : null}
			{sfxPlan().map(([name, at, vol], i) => (
				<Sequence key={i} from={Math.max(0, at)} durationInFrames={120} name={`sfx-${name}`}>
					<Html5Audio src={staticFile(`sfx/v2/${name}.wav`)} volume={vol} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
