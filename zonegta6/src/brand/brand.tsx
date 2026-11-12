// Kit de marca ZoneGTAVI: cores, fontes, fundo, marca d'água e legendas.
// Reutilizável entre vídeos — cada vídeo traz seu próprio conceito por cima.
import {loadFont as loadAnton} from '@remotion/google-fonts/Anton';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const {fontFamily: display} = loadAnton('normal', {weights: ['400'], subsets: ['latin']});
export const {fontFamily: body} = loadInter('normal', {weights: ['600', '800', '900'], subsets: ['latin']});

export const C = {
	night: '#0B0620',
	plum: '#2A0E45',
	pink: '#FF2E88',
	orange: '#FF9A3C',
	yellow: '#FFE45E',
	teal: '#2DE2E6',
	white: '#FFFFFF',
	red: '#FF3B3B',
};

export const ViceBackground: React.FC<{tint?: string; shake?: number}> = ({tint = C.plum, shake = 0}) => {
	const frame = useCurrentFrame();
	const gridShift = (frame * 4) % 120;
	return (
		<AbsoluteFill style={{background: `linear-gradient(180deg, ${C.night} 0%, ${tint} 55%, #3D0B3A 100%)`, transform: `translate(${Math.sin(frame * 2.1) * shake}px, ${Math.cos(frame * 1.7) * shake}px)`}}>
			{/* sol retrô */}
			<div style={{position: 'absolute', left: 290, top: 1080, width: 500, height: 500, borderRadius: '50%', background: `linear-gradient(180deg, ${C.yellow}, ${C.orange} 45%, ${C.pink})`, opacity: 0.35, maskImage: 'repeating-linear-gradient(180deg, #000 0 26px, transparent 26px 36px)', WebkitMaskImage: 'repeating-linear-gradient(180deg, #000 0 26px, transparent 26px 36px)'}} />
			{/* grade em perspectiva */}
			<div style={{position: 'absolute', left: -540, right: -540, bottom: -200, height: 760, transform: 'perspective(500px) rotateX(62deg)', backgroundImage: `linear-gradient(${C.pink}55 2px, transparent 2px), linear-gradient(90deg, ${C.pink}55 2px, transparent 2px)`, backgroundSize: '120px 120px', backgroundPosition: `0 ${gridShift}px`}} />
			<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, transparent 40%, rgba(0,0,0,0.55) 100%)'}} />
		</AbsoluteFill>
	);
};

export const Watermark: React.FC = () => (
	<div style={{position: 'absolute', top: 70, right: 60, fontFamily: display, fontSize: 40, letterSpacing: 2, color: C.white, opacity: 0.75, textShadow: '0 2px 10px rgba(0,0,0,0.6)'}}>
		ZONEGTA<span style={{color: C.pink}}>VI</span>
	</div>
);

export type Word = {text: string; start: number; end: number; hl?: boolean};

// Legenda palavra a palavra: mostra a frase atual (grupos curtos), destaca a palavra falada.
export const Captions: React.FC<{words: Word[]; accent?: string; hlColor?: string}> = ({words, accent = C.teal, hlColor = C.yellow}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;
	const groups: Word[][] = [];
	for (const w of words) {
		const last = groups[groups.length - 1];
		if (!last || last.length >= 3 || w.start - last[last.length - 1].end > 0.35 || /[.!?…:]$/.test(last[last.length - 1].text)) groups.push([w]);
		else last.push(w);
	}
	const group = groups.find((g) => t >= g[0].start - 0.05 && t < g[g.length - 1].end + 0.15);
	if (!group) return null;
	const gStart = Math.round(group[0].start * fps);
	const pop = spring({frame: frame - gStart, fps, config: {damping: 12, mass: 0.5}});
	return (
		<div style={{position: 'absolute', left: 60, right: 60, top: 1380, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 34px', transform: `scale(${interpolate(pop, [0, 1], [0.8, 1])})`}}>
			{group.map((w, i) => {
				const active = t >= w.start && t < w.end + 0.05;
				const color = w.hl ? hlColor : active ? accent : C.white;
				return (
					<span key={i} style={{fontFamily: body, fontWeight: 900, fontSize: w.hl ? 92 : 80, textTransform: 'uppercase', color, WebkitTextStroke: '10px #000', paintOrder: 'stroke fill', transform: `scale(${active ? 1.08 : 1})`, display: 'inline-block', lineHeight: 1.15}}>
						{w.text.replace(/[,.:]$/, '')}
					</span>
				);
			})}
		</div>
	);
};

export const Pop: React.FC<{at?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at = 0, children, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: frame - at, fps, config: {damping: 9, mass: 0.6}});
	return <div style={{transform: `scale(${s})`, opacity: Math.min(1, s * 2), ...style}}>{children}</div>;
};
