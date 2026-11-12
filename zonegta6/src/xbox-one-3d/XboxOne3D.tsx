import {AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {body, C, Captions, display, Watermark} from '../brand/brand';
import {sentences as S, wordAt, words} from '../xbox-one-cloud/timing';
import {Beach, BedroomRise, CityFlythrough, CloudDescent, DiscShatter, Garage, RainyNight, ServerAisle, StopVoid, StudioHook, ViceStreet} from './scenes';

// Versão 3D do episódio "GTA 6 no Xbox One?" — cada frase importante tem seu próprio cenário tridimensional.
const FPS = 30;
const f = (s: number) => Math.round(s * FPS);
const G = '#39FF7A';
const END = S[S.length - 1].end + 1.6;
export const xboxOne3DDuration = f(END);
const rel = (sentence: number, word: string, base: number) => f(wordAt(sentence, word)) - f(base);

// Tipografia sobre o 3D (sem painéis): só palavras de impacto.
const Type: React.FC<{text: string; top: number; size?: number; color?: string; at?: number}> = ({text, top, size = 130, color = C.white, at = 0}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < at) return null;
	const s = spring({frame: frame - at, fps, config: {damping: 10, mass: 0.6}});
	return (
		<div style={{position: 'absolute', top, left: 30, right: 30, textAlign: 'center', fontFamily: display, fontSize: size, lineHeight: 1, color, textTransform: 'uppercase', transform: `scale(${s})`, textShadow: '0 6px 0 #000, 0 0 30px #000a'}}>{text}</div>
	);
};

const Year: React.FC<{from: number; to: number}> = ({from, to}) => {
	const frame = useCurrentFrame();
	const y = Math.round(interpolate(frame, [from, to], [2013, 2026], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
	return <div style={{position: 'absolute', top: 200, left: 0, right: 0, textAlign: 'center', fontFamily: display, fontSize: 220, color: y === 2026 ? G : C.white, textShadow: '0 8px 0 #000'}}>{y}</div>;
};

type Shot = {from: number; to: number; el: React.ReactNode; overlay?: React.ReactNode};

export const XboxOne3D: React.FC<{narrationSrc: string | null}> = ({narrationSrc}) => {
	const shots: Shot[] = [
		{
			from: 0, to: S[2].start,
			el: <StudioHook realAt={f(S[1].start)} />,
			overlay: <><Type text="GTA 6 no" top={230} size={130} /><Type text="Xbox One?" top={370} size={170} color={G} /><Type text="É real" top={1080} size={150} color={G} at={f(S[1].start)} /></>,
		},
		{from: S[2].start, to: S[4].start, el: <BedroomRise riseFrom={rel(2, 'jogadores', S[2].start)} riseTo={rel(2, 'poderão', S[2].start)} snapAt={f(S[3].start - S[2].start)} />},
		{from: S[4].start, to: S[5].start, el: <CityFlythrough />, overlay: <Type text="Como funciona?" top={260} size={130} color={C.yellow} />},
		{from: S[5].start, to: wordAt(6, 'vice') - 0.15, el: <CloudDescent dayAt={rel(5, '19', S[5].start)} />, overlay: <Type text="19 de novembro" top={240} size={110} color={G} at={rel(5, '19', S[5].start)} />},
		{from: wordAt(6, 'vice') - 0.15, to: S[7].start, el: <ViceStreet viceAt={0} jlAt={rel(6, 'jason', wordAt(6, 'vice') - 0.15)} />, overlay: <Sequence from={rel(6, 'jason', wordAt(6, 'vice') - 0.15)}><div style={{position: 'absolute', top: 1260, left: 0, right: 0, textAlign: 'center', fontFamily: body, fontWeight: 800, fontSize: 30, color: '#ffffffcc', letterSpacing: 2}}>REPRESENTAÇÃO 3D ILUSTRATIVA</div></Sequence>},
		{from: S[7].start, to: S[9].start, el: <StopVoid detailAt={f(S[8].start - S[7].start)} />, overlay: <Type text="Calma!" top={240} size={170} color={C.white} />},
		{from: S[9].start, to: S[10].start, el: <DiscShatter breakAt={rel(9, 'nativa', S[9].start)} />, overlay: <Type text="Sem versão nativa" top={240} size={110} color={C.red} at={rel(9, 'nativa', S[9].start)} />},
		{from: S[10].start, to: S[11].start, el: <ServerAisle />, overlay: <Type text="Roda na nuvem" top={240} size={120} color={G} />},
		{
			from: S[11].start, to: S[13].start,
			el: <Garage lights={[rel(12, 'região', S[11].start), rel(12, 'serviço', S[11].start), rel(12, 'comprar', S[11].start)]} />,
			overlay: <><Type text="Tem mais!" top={200} size={150} color={C.yellow} /><Type text="1. Sua região" top={420} size={80} at={rel(12, 'região', S[11].start)} /><Type text="2. Jogo em nuvem" top={520} size={80} color={G} at={rel(12, 'serviço', S[11].start)} /><Type text="3. Comprar à parte" top={620} size={80} color={C.yellow} at={rel(12, 'comprar', S[11].start)} /></>,
		},
		{from: S[13].start, to: S[14].start, el: <Beach coolAt={rel(13, 'console', S[13].start)} />, overlay: <><Year from={rel(13, 'tantos', S[13].start)} to={rel(13, 'descobrir', S[13].start)} /><Type text="Eu sobrevivi" top={1120} size={110} color={C.yellow} at={rel(13, 'console', S[13].start)} /></>},
		{
			from: S[14].start, to: END,
			el: <RainyNight followAt={f(S[15].start - S[14].start)} />,
			overlay: <><Sequence durationInFrames={f(S[15].start - S[14].start)}><Type text="Ainda tem Xbox One" top={240} size={95} color={G} at={rel(14, 'ainda', S[14].start)} /><Type text="ou já migrou?" top={350} size={95} color={C.pink} at={rel(14, 'migrou', S[14].start)} /></Sequence><Sequence from={f(S[15].start - S[14].start)}><Type text="Segue a" top={230} size={100} /><Type text="ZoneGTA6" top={340} size={170} color={C.pink} /></Sequence></>,
		},
	];

	const sfx: {at: number; src: string; vol: number; max?: number}[] = [
		{at: 0.0, src: 'record-scratch', vol: 0.4},
		{at: S[1].start, src: 'vine-boom', vol: 0.6},
		{at: wordAt(2, 'poderão'), src: 'anime-wow', vol: 0.4, max: 2.2},
		{at: wordAt(3, 'brincadeira'), src: 'bruh', vol: 0.55},
		...[S[2].start, S[4].start, S[5].start, wordAt(6, 'vice') - 0.15, S[9].start, S[10].start, S[11].start, S[13].start, S[14].start].map((at) => ({at: at - 0.12, src: 'whoosh', vol: 0.75})),
		{at: wordAt(5, '19'), src: 'ding', vol: 0.35},
		{at: S[7].start + 0.2, src: 'vine-boom', vol: 0.7},
		{at: S[8].start, src: 'illuminati-confirmed', vol: 0.22, max: 2.3},
		{at: wordAt(9, 'nativa'), src: 'windows-xp-error', vol: 0.5},
		...['região', 'serviço', 'comprar'].map((w) => ({at: wordAt(12, w), src: 'snapchat-notification', vol: 0.6})),
		{at: wordAt(13, 'console'), src: 'yippee', vol: 0.4, max: 1.8},
		{at: S[15].start, src: 'ding', vol: 0.4},
	];
	const calmA = f(S[7].start), calmB = f(S[9].start);

	return (
		<AbsoluteFill style={{background: '#000'}}>
			{shots.map((s, i) => (
				<Sequence key={i} from={f(s.from)} durationInFrames={Math.max(1, f(s.to) - f(s.from))}>
					{s.el}
					<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, transparent 55%, rgba(0,0,0,0.5) 100%)'}} />
					{s.overlay}
				</Sequence>
			))}
			<Captions words={words} accent={G} hlColor={C.yellow} />
			<Watermark />
			<Audio
				src={staticFile('music/cloud-drip.wav')}
				volume={(fr) => (fr >= calmA && fr < calmB ? interpolate(fr, [calmA, calmA + 4], [0.16, 0], {extrapolateRight: 'clamp'}) : interpolate(fr, [0, 12], [0, 0.16], {extrapolateRight: 'clamp'}))}
			/>
			{sfx.map((s, i) => (
				<Sequence key={`sfx${i}`} from={f(Math.max(0, s.at))} durationInFrames={s.max ? f(s.max) : undefined}>
					<Audio src={staticFile(`sfx/${s.src}.wav`)} volume={(fr) => (s.max ? s.vol * interpolate(fr, [f(s.max) - 8, f(s.max)], [1, 0], {extrapolateLeft: 'clamp'}) : s.vol)} />
				</Sequence>
			))}
			{narrationSrc ? <Audio src={staticFile(narrationSrc)} /> : null}
		</AbsoluteFill>
	);
};
