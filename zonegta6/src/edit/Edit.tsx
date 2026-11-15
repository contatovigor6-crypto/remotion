import React from 'react';
import {AbsoluteFill, Html5Audio, interpolate, random, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Grade, Slideshow} from '../Background';
import {Backdrop, Flash, MaskTitle, Panel, Shake, Tag, useIn, Words} from '../components';
import {ChannelLogo, HudBrand} from '../faq/Fx';
import {C, display, mono} from '../theme';

// Vídeo 5: contagem regressiva sem narração, no padrão de edição clássico do canal
// (igual aos primeiros vídeos): fundo com troca suave de imagens, painéis, títulos com
// máscara, texto palavra a palavra e etiqueta de verificação. Sem 3D.
// A linha do tempo segue a trilha (100 BPM: 1 tempo = 18 frames, 1 compasso = 72 frames).

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const BEAT = 18;
const BAR = 72;
const DAYS = 4; // dias até 19/11 na data de publicação (15/11). Ajuste se postar outro dia.

const DROP = 2 * BAR; // 144: começam os fatos
const BREAK = 10 * BAR; // 720: pergunta
const OUTRO = 12 * BAR; // 864: data + logo
export const EDIT_DURATION = 15 * BAR; // 1080 frames = 36 s

// Um fato confirmado por compasso. Fundos inéditos (ver scripts/check_media.py).
type Fact = {kicker: string; lines: string[]; detail: string; color: string; media: string[]};
const facts: Fact[] = [
	{kicker: 'LANÇAMENTO', lines: ['19 de', 'novembro'], detail: 'Data oficial, sem novo adiamento.', color: C.pink, media: ['jason_and_lucia_17.jpg', 'jason_and_lucia_19.jpg']},
	{kicker: 'PLATAFORMAS', lines: ['PS5 e', 'Xbox Series'], detail: 'Só nos consoles da geração atual.', color: C.cyan, media: ['jason_duval_05.jpg', 'lucia_caminos_07.jpg', 'jason_duval_07.jpg']},
	{kicker: 'A CIDADE', lines: ['Vice City'], detail: 'Ela está de volta.', color: C.amber, media: ['jason_duval_04.jpg', 'lucia_caminos_02.jpg']},
	{kicker: 'O ESTADO', lines: ['Leonida'], detail: 'Um estado inteiro para explorar.', color: C.green, media: ['grassrivers_05.jpg', 'leonida_keys_07.jpg', 'port_gellhorn_06.jpg']},
	{kicker: 'PROTAGONISTA', lines: ['Jason', 'Duval'], detail: 'Um dos dois protagonistas.', color: C.cyan, media: ['jason_duval_01.jpg', 'jason_duval_09.jpg']},
	{kicker: 'PROTAGONISTA', lines: ['Lucia', 'Caminos'], detail: 'A outra metade da dupla.', color: C.pink, media: ['lucia_caminos_01.jpg', 'lucia_caminos_03.jpg', 'lucia_caminos_08.jpg']},
	{kicker: 'JÁ LIBERADO', lines: ['Pré-', 'download'], detail: 'Para quem comprou a versão digital.', color: C.green, media: ['jason_duval_08.jpg', 'jason_duval_10.jpg']},
	{kicker: 'LIBERAÇÃO', lines: ['Meia-noite'], detail: 'No horário local de cada região.', color: C.amber, media: ['port_gellhorn_04.jpg', 'vice_city_07.jpg', 'jason_and_lucia_14.jpg']},
];

const Stack: React.FC<{children: React.ReactNode; top?: number; gap?: number}> = ({children, top = 430, gap = 30}) => (
	<AbsoluteFill style={{padding: `${top}px 80px 0`, display: 'flex', flexDirection: 'column', gap}}>{children}</AbsoluteFill>
);

// ── Gancho: FALTAM 4 DIAS ────────────────────────────────────
const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const scale = interpolate(frame, [0, 6, 144], [2.4, 1, 0.92], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
	const g = frame < 8 ? (random(`h${frame}`) - 0.5) * 50 : 0;
	const layer = (color: string, dx: number, blend: boolean) => (
		<div style={{position: blend ? 'absolute' : 'relative', inset: 0, fontFamily: display, fontSize: 330, lineHeight: 0.9, color, transform: `translateX(${dx}px)`, mixBlendMode: blend ? 'screen' : undefined, textAlign: 'center', textShadow: blend ? undefined : `0 0 60px ${C.pink}`}}>
			{DAYS} DIAS
		</div>
	);
	return (
		<Shake at={0} strength={40}>
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 50}}>
				<div style={{fontFamily: mono, fontSize: 40, color: C.cyan, letterSpacing: 8}}>GTA 6 · FALTAM</div>
				<div style={{position: 'relative', transform: `scale(${scale})`}}>
					{layer(C.white, 0, false)}
					{g !== 0 ? layer(C.pink, g, true) : null}
					{g !== 0 ? layer(C.cyan, -g, true) : null}
				</div>
				<div style={{width: 860, textAlign: 'center'}}>
					<Words text="E tudo isto já está confirmado." delay={BAR} size={62} every={5} />
				</div>
			</AbsoluteFill>
		</Shake>
	);
};

// ── Um fato ──────────────────────────────────────────────────
const FactScene: React.FC<{f: Fact; n: number}> = ({f, n}) => (
	<>
		<Shake at={0} strength={18}>
			<Stack>
				<div style={{fontFamily: mono, fontSize: 36, color: f.color, letterSpacing: 6}}>
					{String(n).padStart(2, '0')} · {f.kicker}
				</div>
				<div>
					{f.lines.map((l, i) => (
						<MaskTitle key={l} text={l} delay={i * 4} size={l.length > 9 ? 150 : 190} color={i === f.lines.length - 1 ? f.color : C.white} glow={i === f.lines.length - 1 ? f.color : undefined} />
					))}
				</div>
				<Words text={f.detail} delay={12} size={54} every={3} />
				<Tag status="CONFIRMADO" delay={22} source="ROCKSTAR GAMES" />
			</Stack>
		</Shake>
		<Flash at={0} />
	</>
);

// ── Pergunta ─────────────────────────────────────────────────
const Question: React.FC = () => (
	<Stack top={560}>
		<MaskTitle text="Você está" delay={2} size={170} />
		<MaskTitle text="pronto?" delay={BEAT} size={240} color={C.pink} glow={C.pink} />
		<Words text="Comenta aqui embaixo: sim ou não?" delay={BAR} size={56} every={4} color={C.dim} />
	</Stack>
);

// ── Final: data + logo ───────────────────────────────────────
const Outro: React.FC = () => {
	const frame = useCurrentFrame();
	const logoAt = 2 * BAR + 4;
	const out = interpolate(frame, [logoAt - 8, logoAt], [1, 0], clamp);
	const cta = useIn(logoAt + 14, 14);
	return (
		<>
			<Shake at={0} strength={24}>
				<AbsoluteFill style={{opacity: out}}>
					<Stack top={470}>
						<Words text="GTA VI chega em" size={58} color={C.dim} />
						<Panel accent={C.cyan} delay={4}>
							<div style={{display: 'flex', alignItems: 'baseline', gap: 30}}>
								<div style={{fontFamily: display, fontSize: 300, color: C.white, lineHeight: 0.9}}>{Math.round(interpolate(frame, [4, 28], [1, 19], clamp))}</div>
								<div style={{fontFamily: display, fontSize: 150, color: C.cyan, lineHeight: 0.9}}>NOV</div>
							</div>
							<div style={{fontFamily: mono, fontSize: 40, color: C.dim, marginTop: 20, letterSpacing: 4}}>2026 · PS5 · XBOX SERIES X|S</div>
						</Panel>
						<Tag status="CONFIRMADO" delay={30} source="ROCKSTAR NEWSWIRE" />
					</Stack>
				</AbsoluteFill>
			</Shake>
			{frame >= logoAt ? (
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 50}}>
					<ChannelLogo at={logoAt} size={600} />
					<div style={{fontFamily: display, fontSize: 92, color: C.white, letterSpacing: 4, opacity: cta, transform: `translateY(${(1 - cta) * 30}px)`}}>SE INSCREVE NO CANAL</div>
				</AbsoluteFill>
			) : null}
			<Flash at={0} />
		</>
	);
};

// ── Sound design: efeitos de public/sfx/v2, no máximo 2 usos de cada ──
type Ev = [name: string, frame: number, volume: number];
const sfxPlan = (): Ev[] => {
	const ev: Ev[] = [
		['stinger_intro', 0, 0.7],
		['glitch_b', 2, 0.35],
		['alarm', BEAT * 2, 0.3],
		['typing', BAR, 0.35],
		['riser_a', DROP - 45, 0.5],
	];
	const impact = ['impact_a', 'impact_b', 'impact_c', 'impact_e', 'impact_a', 'impact_b', 'impact_c', 'impact_e'];
	const whoosh = ['whoosh_a', 'whoosh_b', 'whoosh_c', 'whoosh_d', 'whoosh_e', 'whoosh_a', 'whoosh_b', 'whoosh_c'];
	const title = ['swish_f', 'glitch_a', 'pop_a', 'click_a', 'pop_b', 'swish_f', 'glitch_a', 'pop_a'];
	const tag = ['blip_a', 'blip_b', 'blip_c', 'blip_d', 'blip_a', 'blip_b', 'blip_c', 'blip_d'];
	const themed = ['scan', 'power_up', 'cloud', 'success', 'check_a', 'check_b', 'download', 'clock'];
	facts.forEach((_, i) => {
		const s = DROP + i * BAR;
		ev.push([whoosh[i], s - 5, 0.5], [impact[i], s, 0.65], [title[i], s + 5, 0.4], [themed[i], s + 12, 0.4], [tag[i], s + 22, 0.35]);
	});
	ev.push(
		['whoosh_d', BREAK - 5, 0.5],
		['power_down', BREAK, 0.45],
		['pop_b', BREAK + BEAT, 0.45],
		['notify', BREAK + BAR, 0.4],
		['riser_b', OUTRO - 36, 0.5],
		['whoosh_e', OUTRO - 5, 0.5],
		['impact_d', OUTRO, 0.75],
		['check_c', OUTRO + 30, 0.4],
		['riser_a', OUTRO + 2 * BAR + 4 - 45, 0.45],
		['stinger_final', OUTRO + 2 * BAR + 4, 0.75],
		['tally', OUTRO + 2 * BAR + 20, 0.35],
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
	const acc = factIndex >= 0 ? facts[factIndex].color : frame >= BREAK && frame < OUTRO ? C.pink : frame >= OUTRO ? C.cyan : C.pink;
	return (
		<AbsoluteFill style={{backgroundColor: C.bg}}>
			<Slideshow files={['ambrosia_04.jpg', 'ambrosia_02.jpg']} from={0} dur={DROP} />
			{facts.map((f, i) => (
				<Slideshow key={i} files={f.media} from={DROP + i * BAR} dur={BAR} />
			))}
			<Slideshow files={['lucia_caminos_04.jpg', 'v/cal.mp4']} from={BREAK} dur={OUTRO - BREAK} />
			<Slideshow files={['grassrivers_07.jpg', 'ambrosia_06.jpg']} from={OUTRO} dur={EDIT_DURATION - OUTRO} />
			<Grade accent={acc} />
			<Backdrop accent={acc} overlay />
			<Sequence from={0} durationInFrames={DROP} name="gancho">
				<Hook />
			</Sequence>
			{facts.map((f, i) => (
				<Sequence key={i} from={DROP + i * BAR} durationInFrames={BAR} name={f.lines.join(' ')}>
					<FactScene f={f} n={i + 1} />
				</Sequence>
			))}
			<Sequence from={BREAK} durationInFrames={OUTRO - BREAK} name="pergunta">
				<Question />
			</Sequence>
			<Sequence from={OUTRO} durationInFrames={EDIT_DURATION - OUTRO} name="final">
				<Outro />
			</Sequence>
			<AbsoluteFill style={{pointerEvents: 'none'}}>
				<HudBrand />
				<div style={{position: 'absolute', top: 160, right: 80, fontFamily: mono, fontSize: 30, color: C.red, letterSpacing: 3}}>
					<span style={{opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0.2}}>●</span> T-{DAYS} DIAS
				</div>
				<div style={{position: 'absolute', bottom: 250, left: 80, fontFamily: mono, fontSize: 20, color: C.dim, letterSpacing: 2}}>IMAGENS: ROCKSTAR GAMES · GTA VI</div>
				<div style={{position: 'absolute', bottom: 230, left: 80, right: 80, height: 6, background: 'rgba(255,255,255,0.12)'}}>
					<div style={{height: '100%', width: `${(frame / EDIT_DURATION) * 100}%`, background: `linear-gradient(90deg, ${C.cyan}, ${C.pink})`}} />
				</div>
			</AbsoluteFill>
			{/* Música baixa, de fundo; a edição e os efeitos ficam na frente. */}
			{music ? <Html5Audio src={staticFile(`music/${music}`)} volume={0.42} /> : null}
			{sfxPlan().map(([name, at, vol], i) => (
				<Sequence key={i} from={Math.max(0, at)} durationInFrames={120} name={`sfx-${name}`}>
					<Html5Audio src={staticFile(`sfx/v2/${name}.wav`)} volume={vol} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
