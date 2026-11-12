import {AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {body, C, Captions, display, Pop, ViceBackground, Watermark} from '../brand/brand';
import {sentences as S, TOTAL_SECONDS, words} from './script';

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);
export const preload212Duration = f(TOTAL_SECONDS);

// tempo (s) de uma palavra dentro de uma frase, para sincronizar SFX/visuais
const wordAt = (sentence: number, contains: string) => {
	const s = S[sentence];
	const w = words.find((w) => w.start >= s.start - 0.01 && w.start < s.end && w.text.toLowerCase().includes(contains.toLowerCase()));
	return w ? w.start : s.start;
};

const Title: React.FC<{children: React.ReactNode; color?: string; size?: number; top?: number}> = ({children, color = C.white, size = 130, top = 260}) => (
	<div style={{position: 'absolute', top, left: 50, right: 50, textAlign: 'center', fontFamily: display, fontSize: size, lineHeight: 1, color, textTransform: 'uppercase', textShadow: `0 8px 0 #000, 0 0 40px ${color}66`}}>{children}</div>
);

// ---------- CENAS ----------

const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const shake = interpolate(frame, [0, 60], [2, 14], {extrapolateRight: 'clamp'});
	const sweat = (i: number) => ((frame * 6 + i * 40) % 160);
	return (
		<AbsoluteFill>
			<ViceBackground tint="#4A0D2E" shake={shake / 3} />
			<Title top={230}>Seu console</Title>
			<Title top={370} color={C.pink} size={110}>tá em perigo</Title>
			<div style={{position: 'absolute', left: 300, top: 640, transform: `translate(${Math.sin(frame * 2.3) * shake}px, ${Math.cos(frame * 3.1) * shake * 0.5}px) rotate(${Math.sin(frame) * shake * 0.2}deg)`}}>
				{/* console genérico desenhado em CSS */}
				<div style={{width: 480, height: 560, borderRadius: 40, background: 'linear-gradient(160deg, #F4F4F8, #B9B9C8)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)', position: 'relative'}}>
					<div style={{position: 'absolute', left: 40, right: 40, top: 60, height: 300, borderRadius: 24, background: '#15151F'}}>
						{[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{position: 'absolute', left: 30, right: 30, top: 30 + i * 42, height: 14, borderRadius: 7, background: '#2A2A3A'}} />)}
					</div>
					{/* rostinho desesperado */}
					<div style={{position: 'absolute', left: 130, top: 400, width: 50, height: 50, borderRadius: '50%', background: '#15151F'}} />
					<div style={{position: 'absolute', right: 130, top: 400, width: 50, height: 50, borderRadius: '50%', background: '#15151F'}} />
					<div style={{position: 'absolute', left: 190, top: 480, width: 100, height: 40, borderRadius: '50px 50px 0 0', border: '10px solid #15151F', borderBottom: 'none'}} />
					<div style={{position: 'absolute', left: 200, top: 380, width: 80, height: 16, background: C.red, borderRadius: 8, opacity: frame % 10 < 5 ? 1 : 0.2}} />
				</div>
				{[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: i === 1 ? 500 : -40 + i * 10, top: 60 + sweat(i), width: 28, height: 40, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: C.teal, opacity: 1 - sweat(i) / 160}} />)}
			</div>
		</AbsoluteFill>
	);
};

const Counter: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const len = f(S[1].end - S[1].start);
	const value = Math.round(interpolate(frame, [len * 0.35, len * 0.8], [0, 212], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));
	const punch = spring({frame: frame - Math.round(len * 0.8), fps, config: {damping: 8}});
	return (
		<AbsoluteFill>
			<ViceBackground />
			<Pop style={{position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
				<div style={{fontFamily: body, fontWeight: 900, fontSize: 56, color: C.night, background: C.teal, padding: '14px 36px', borderRadius: 16}}>PRÉ-LOAD LIBERADO</div>
			</Pop>
			<div style={{position: 'absolute', top: 560, left: 0, right: 0, textAlign: 'center', fontFamily: display, color: C.white}}>
				<div style={{fontSize: 80, opacity: 0.8}}>ATÉ</div>
				<div style={{fontSize: 360, lineHeight: 1, color: value === 212 ? C.yellow : C.white, transform: `scale(${1 + punch * 0.12 - (punch > 0.99 ? 0.12 : 0)})`, textShadow: '0 12px 0 #000'}}>{value}</div>
				<div style={{fontSize: 140, color: C.pink, marginTop: -10}}>GB</div>
			</div>
		</AbsoluteFill>
	);
};

const Freeze: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const base = f(S[2].start);
	const parts = [
		{t: f(wordAt(2, 'duzentos')) - base, text: 'DUZENTOS', color: C.white},
		{t: f(wordAt(2, 'e.')) - base, text: 'E', color: C.white},
		{t: f(wordAt(2, 'doze')) - base, text: 'DOZE', color: C.red},
	];
	const lastHit = frame - parts[2].t;
	const shake = lastHit >= 0 ? Math.max(0, 20 - lastHit) : 0;
	const zoom = lastHit >= 0 ? 1 + spring({frame: lastHit, fps, config: {damping: 10}}) * 0.08 : 1;
	return (
		<AbsoluteFill style={{background: '#000', transform: `scale(${zoom}) translate(${Math.sin(frame * 3) * shake}px, ${Math.cos(frame * 2) * shake}px)`}}>
			<AbsoluteFill style={{background: `radial-gradient(circle, transparent 30%, ${C.red}44 100%)`, opacity: lastHit >= 0 ? 1 : 0}} />
			<div style={{position: 'absolute', top: 360, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
				{parts.map((p) => frame >= p.t ? (
					<Pop key={p.text} at={p.t}>
						<div style={{fontFamily: display, fontSize: p.text === 'E' ? 140 : 230, color: p.color, lineHeight: 1, textShadow: `0 0 50px ${p.color}88`}}>{p.text}</div>
					</Pop>
				) : null)}
			</div>
		</AbsoluteFill>
	);
};

const Storage: React.FC = () => {
	const frame = useCurrentFrame();
	const fill = interpolate(frame, [10, 60], [0, 31.8], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
	const third = f(wordAt(3, 'terço') - S[3].start);
	return (
		<AbsoluteFill>
			<ViceBackground tint="#1A1446" />
			<Title top={220} size={100}>PS5 de 825 GB</Title>
			<div style={{position: 'absolute', top: 350, left: 0, right: 0, textAlign: 'center', fontFamily: body, fontWeight: 800, fontSize: 44, color: C.teal}}>~667 GB livres de verdade</div>
			<div style={{position: 'absolute', top: 520, left: 90, right: 90, height: 140, borderRadius: 28, background: '#ffffff22', border: '6px solid #fff', overflow: 'hidden'}}>
				<div style={{width: `${fill}%`, height: '100%', background: `linear-gradient(90deg, ${C.pink}, ${C.orange})`}} />
			</div>
			<div style={{position: 'absolute', top: 690, left: 90, fontFamily: body, fontWeight: 900, fontSize: 48, color: C.pink}}>GTA 6 · 212 GB</div>
			{frame >= third ? (
				<Pop at={third} style={{position: 'absolute', top: 820, left: 0, right: 0, textAlign: 'center'}}>
					<div style={{fontFamily: display, fontSize: 300, color: C.yellow, textShadow: '0 12px 0 #000'}}>≈ 1/3</div>
				</Pop>
			) : null}
		</AbsoluteFill>
	);
};

const Download: React.FC = () => {
	const frame = useCurrentFrame();
	const base = f(S[4].start);
	const items = [
		{label: 'FILME 1', at: f(wordAt(5, 'dois')) - base},
		{label: 'FILME 2', at: f(wordAt(5, 'filmes')) - base},
		{label: 'BANHO', at: f(wordAt(5, 'banho')) - base},
		{label: 'BRIGA COM O ROTEADOR', at: f(wordAt(5, 'brigar')) - base, bad: true},
	];
	const pct = interpolate(frame, [0, f(S[5].end - S[4].start)], [0.2, 1.4]);
	const err = f(wordAt(5, 'roteador')) - base;
	return (
		<AbsoluteFill>
			<ViceBackground tint="#0E2A3A" />
			<div style={{position: 'absolute', top: 220, left: 70, right: 70, borderRadius: 28, background: '#0B0620EE', border: `4px solid ${C.teal}`, padding: 40}}>
				<div style={{fontFamily: body, fontWeight: 800, fontSize: 46, color: C.white}}>Baixando Grand Theft Auto VI…</div>
				<div style={{marginTop: 30, height: 40, borderRadius: 20, background: '#ffffff22', overflow: 'hidden'}}>
					<div style={{width: `${pct}%`, height: '100%', background: C.teal}} />
				</div>
				<div style={{marginTop: 20, display: 'flex', justifyContent: 'space-between', fontFamily: body, fontWeight: 800, fontSize: 40, color: C.teal}}>
					<span>{pct.toFixed(1)}%</span><span>100 Mbps</span>
				</div>
				<div style={{marginTop: 24, fontFamily: display, fontSize: 110, color: C.yellow}}>~4H 43MIN</div>
				<div style={{fontFamily: body, fontWeight: 600, fontSize: 36, color: '#ffffffaa'}}>restantes (no melhor cenário)</div>
			</div>
			<div style={{position: 'absolute', top: 820, left: 90, right: 90, display: 'flex', flexDirection: 'column', gap: 22}}>
				{items.map((it) => frame >= it.at ? (
					<Pop key={it.label} at={it.at}>
						<div style={{fontFamily: body, fontWeight: 900, fontSize: 52, color: it.bad ? C.white : C.night, background: it.bad ? C.red : C.yellow, padding: '16px 30px', borderRadius: 18, transform: it.bad ? `rotate(${Math.sin(frame) * 2}deg)` : undefined}}>{it.label}</div>
					</Pop>
				) : null)}
			</div>
			{frame >= err ? (
				<Pop at={err} style={{position: 'absolute', top: 960, left: 120, right: 120}}>
					<div style={{background: '#ECE9D8', border: '4px solid #0A246A', borderRadius: 10, boxShadow: '10px 10px 0 #0008'}}>
						<div style={{background: 'linear-gradient(90deg, #0A246A, #3A6EA5)', color: '#fff', fontFamily: body, fontWeight: 800, fontSize: 34, padding: '10px 18px'}}>Erro</div>
						<div style={{padding: 26, fontFamily: body, fontWeight: 600, fontSize: 38, color: '#000'}}>O roteador decidiu tirar o dia de folga.</div>
					</div>
				</Pop>
			) : null}
		</AbsoluteFill>
	);
};

const Calendar: React.FC = () => {
	const frame = useCurrentFrame();
	const second = f(S[7].start - S[6].start);
	const pulse = 1 + Math.max(0, Math.sin((frame - second) / 4)) * 0.04 * (frame > second ? 1 : 0);
	const Card: React.FC<{day: string; label: string; color: string; scale?: number}> = ({day, label, color, scale = 1}) => (
		<div style={{transform: `scale(${scale})`, width: 820, borderRadius: 30, overflow: 'hidden', background: '#fff', boxShadow: '0 20px 60px #0009'}}>
			<div style={{background: color, fontFamily: body, fontWeight: 900, fontSize: 48, color: '#fff', padding: '14px 0', textAlign: 'center'}}>NOVEMBRO</div>
			<div style={{display: 'flex', alignItems: 'center', gap: 30, padding: '20px 40px'}}>
				<div style={{fontFamily: display, fontSize: 200, color: C.night, lineHeight: 1}}>{day}</div>
				<div style={{fontFamily: body, fontWeight: 900, fontSize: 52, color: C.night, lineHeight: 1.1, whiteSpace: 'pre-line'}}>{label}</div>
			</div>
		</div>
	);
	return (
		<AbsoluteFill>
			<ViceBackground tint="#3A1240" />
			<div style={{position: 'absolute', top: 200, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50}}>
				<Pop><Card day="10" label={'PRÉ-LOAD\n(DIGITAL)'} color={C.teal} /></Pop>
				{frame >= second ? <Pop at={second}><Card day="19" label="O JOGO DESTRAVA" color={C.pink} scale={pulse} /></Pop> : null}
			</div>
		</AbsoluteFill>
	);
};

const Records: React.FC = () => {
	const frame = useCurrentFrame();
	const most = f(wordAt(8, 'mais') - S[8].start);
	return (
		<AbsoluteFill>
			<ViceBackground tint="#20103F" />
			<Pop style={{position: 'absolute', top: 230, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
				<div style={{fontFamily: display, fontSize: 92, maxWidth: 820, textAlign: 'center', lineHeight: 1.05, border: `8px solid ${C.red}`, padding: '14px 30px', transform: 'rotate(-6deg)', color: C.red}}>NINGUÉM LIGA PRO TAMANHO</div>
			</Pop>
			{frame >= most ? (
				<div style={{position: 'absolute', top: 560, left: 80, right: 80, display: 'flex', flexDirection: 'column', gap: 36}}>
					{['PLAYSTATION STORE', 'XBOX STORE'].map((s, i) => (
						<Pop key={s} at={most + i * 6}>
							<div style={{background: '#0B0620EE', border: `4px solid ${C.yellow}`, borderRadius: 24, padding: '26px 34px'}}>
								<div style={{fontFamily: body, fontWeight: 800, fontSize: 40, color: C.teal}}>{s}</div>
								<div style={{fontFamily: display, fontSize: 84, color: C.yellow, lineHeight: 1.05}}>JOGO MAIS ENCOMENDADO DA HISTÓRIA</div>
							</div>
						</Pop>
					))}
					<div style={{fontFamily: body, fontWeight: 600, fontSize: 32, color: '#ffffffaa', textAlign: 'center'}}>segundo a Sony e a Microsoft</div>
				</div>
			) : null}
		</AbsoluteFill>
	);
};

const Cemetery: React.FC = () => {
	const frame = useCurrentFrame();
	const stones = ['AQUELE JOGO QUE VOCÊ NUNCA ZEROU', 'O FUTEBOL DO ANO PASSADO', 'AQUELE OUTRO JOGO DE 150 GB'];
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(180deg, #05030F, #1B1630 70%, #0E0B19)'}} />
			<div style={{position: 'absolute', top: 140, right: 120, width: 180, height: 180, borderRadius: '50%', background: '#EDEBF7', boxShadow: '0 0 120px #EDEBF788'}} />
			<Title top={230} size={120} color="#D9D6EA">Cemitério</Title>
			<div style={{position: 'absolute', top: 360, left: 0, right: 0, textAlign: 'center', fontFamily: body, fontWeight: 800, fontSize: 44, color: '#9A95B8'}}>do armazenamento</div>
			<div style={{position: 'absolute', top: 560, left: 40, right: 40, display: 'flex', justifyContent: 'center', gap: 24, alignItems: 'flex-end'}}>
				{stones.map((s, i) => {
					const rise = interpolate(frame, [i * 12, i * 12 + 18], [400, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.4))});
					return (
						<div key={s} style={{width: 300, height: i === 1 ? 520 : 460, transform: `translateY(${rise}px)`, background: 'linear-gradient(180deg, #8C8AA0, #55536A)', borderRadius: '150px 150px 16px 16px', padding: '70px 22px 0', boxShadow: '0 20px 40px #000a', textAlign: 'center'}}>
							<div style={{fontFamily: display, fontSize: 80, color: '#2C2A3B'}}>RIP</div>
							<div style={{fontFamily: body, fontWeight: 900, fontSize: 34, color: '#22202E', marginTop: 16, lineHeight: 1.15}}>{s}</div>
						</div>
					);
				})}
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1060, height: 300, background: 'linear-gradient(180deg, #1B1630, #0E0B19)'}} />
		</AbsoluteFill>
	);
};

const Outro: React.FC = () => {
	const frame = useCurrentFrame();
	const logoAt = f(S[11].start - S[10].start);
	return (
		<AbsoluteFill>
			<ViceBackground />
			<Pop style={{position: 'absolute', top: 260, left: 0, right: 0, textAlign: 'center'}}>
				<div style={{fontFamily: display, fontSize: 120, color: C.white}}>QUAL VOCÊ</div>
				<div style={{fontFamily: display, fontSize: 150, color: C.pink}}>VAI APAGAR?</div>
				<div style={{fontFamily: display, fontSize: 140, color: C.yellow, transform: `translateY(${Math.abs(Math.sin(frame / 5)) * 30}px)`}}>↓</div>
			</Pop>
			{frame >= logoAt ? (
				<Pop at={logoAt} style={{position: 'absolute', top: 820, left: 0, right: 0, textAlign: 'center'}}>
					<div style={{fontFamily: display, fontSize: 170, color: C.white, textShadow: `0 0 50px ${C.pink}`}}>ZONE<span style={{color: C.pink}}>GTA6</span></div>
					<div style={{fontFamily: body, fontWeight: 900, fontSize: 60, color: C.teal}}>VEJO VOCÊ DIA 19.11</div>
				</Pop>
			) : null}
		</AbsoluteFill>
	);
};

const Punchline: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<div style={{position: 'absolute', top: 560, left: 90, right: 90}}>
				<div style={{fontFamily: body, fontWeight: 800, fontSize: 46, color: '#fff'}}>Baixando Grand Theft Auto VI…</div>
				<div style={{marginTop: 30, height: 50, borderRadius: 25, background: '#ffffff22', overflow: 'hidden'}}>
					<div style={{width: '99%', height: '100%', background: C.teal}} />
				</div>
				<div style={{marginTop: 30, fontFamily: display, fontSize: 200, color: frame % 16 < 8 ? C.yellow : '#665F2A', textAlign: 'center'}}>99%</div>
				<div style={{fontFamily: body, fontWeight: 800, fontSize: 44, color: '#ffffffaa', textAlign: 'center'}}>tempo restante: sim</div>
			</div>
		</AbsoluteFill>
	);
};

// ---------- MONTAGEM ----------

const scenes: {from: number; to: number; C: React.FC}[] = [
	{from: 0, to: S[1].start, C: Hook},
	{from: S[1].start, to: S[2].start, C: Counter},
	{from: S[2].start, to: S[3].start, C: Freeze},
	{from: S[3].start, to: S[4].start, C: Storage},
	{from: S[4].start, to: S[6].start, C: Download},
	{from: S[6].start, to: S[8].start, C: Calendar},
	{from: S[8].start, to: S[9].start, C: Records},
	{from: S[9].start, to: S[10].start, C: Cemetery},
	{from: S[10].start, to: S[12].start - 0.2, C: Outro},
	{from: S[12].start - 0.2, to: TOTAL_SECONDS, C: Punchline},
];

const sfx: {at: number; src: string; vol: number}[] = [
	{at: 0, src: 'dramatic-boomer', vol: 0.55},
	{at: S[1].start - 0.1, src: 'whoosh', vol: 0.7},
	{at: S[1].start + (S[1].end - S[1].start) * 0.8, src: 'vine-boom', vol: 0.5},
	{at: wordAt(2, 'duzentos'), src: 'mouse-click', vol: 0.9},
	{at: wordAt(2, 'e.'), src: 'mouse-click', vol: 0.9},
	{at: wordAt(2, 'doze'), src: 'vine-boom', vol: 0.8},
	{at: S[3].start - 0.1, src: 'whoosh', vol: 0.7},
	{at: wordAt(3, 'terço'), src: 'ding', vol: 0.35},
	{at: S[4].start - 0.1, src: 'whoosh', vol: 0.7},
	{at: wordAt(5, 'roteador'), src: 'windows-xp-error', vol: 0.6},
	{at: S[6].start - 0.1, src: 'whoosh', vol: 0.7},
	{at: S[7].start, src: 'ding', vol: 0.4},
	{at: S[8].start - 0.15, src: 'record-scratch', vol: 0.55},
	{at: S[9].start - 0.1, src: 'whoosh', vol: 0.7},
	{at: wordAt(9, 'cemitério'), src: 'bruh', vol: 0.7},
	{at: S[10].start - 0.1, src: 'whoosh', vol: 0.7},
	{at: S[12].start - 0.2, src: 'loading-lag', vol: 0.45},
];

export const Preload212: React.FC<{narrationSrc: string | null}> = ({narrationSrc}) => {
	const freezeA = f(S[2].start), freezeB = f(S[3].start);
	const punch = f(S[12].start - 0.2);
	return (
		<AbsoluteFill style={{background: C.night}}>
			{scenes.map(({from, to, C: Scene}, i) => (
				<Sequence key={i} from={f(from)} durationInFrames={Math.max(1, f(to) - f(from))}>
					<Scene />
				</Sequence>
			))}
			<Captions words={words.filter((w) => w.start < S[2].start - 0.05 || w.start >= S[3].start - 0.05)} />
			<Watermark />
			{/* trilha original: corta no "Duzentos. E. Doze." e no final */}
			<Audio
				src={staticFile('music/vice-pulse.wav')}
				volume={(fr) => {
					if (fr >= freezeA && fr < freezeB) return 0;
					if (fr >= punch) return 0;
					return interpolate(fr, [0, 15], [0, 0.22], {extrapolateRight: 'clamp'});
				}}
			/>
			{sfx.map((s, i) => (
				<Sequence key={`sfx${i}`} from={f(Math.max(0, s.at))}>
					<Audio src={staticFile(`sfx/${s.src}.wav`)} volume={s.vol} />
				</Sequence>
			))}
			{narrationSrc ? <Audio src={staticFile(narrationSrc)} volume={1} /> : null}
		</AbsoluteFill>
	);
};
