import React from 'react';
import {AbsoluteFill, CalculateMetadataFunction, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {WATERMARK} from '../brand';
import {At} from '../components/Overlays';
import {ProOutro} from '../components/ProOutro';
import type {Shot} from '../data/shots';
import type {Sfx} from '../data/sfx';
import type {Word} from '../data/words-vicecity';
import {ShortEdit, type Shake} from '../ShortEdit';
import {C, DISPLAY, UI, f} from '../theme';
import {CardView, CutFx, type Card} from './Cards';

// PRODUÇÃO EM SÉRIE — um único modelo para todos os Shorts de GTA 6 no estilo clássico do canal:
// imagens/clipes oficiais em tela cheia (Ken Burns, cortes no ritmo da fala), legendas palavra a palavra,
// selos pontuais por cima das imagens, SFX/tremidas nos impactos e ProOutro. Tudo vem de public/serie/<slug>/spec.json,
// gerado por scripts/serie.py a partir de plans/<slug>.json.

export type Tag = {at: number; to: number; text: string; color: string; kind: 'pill' | 'stamp' | 'big'};
export type Spec = {
	slug: string;
	duration: number;
	outroAt: number;
	voice: string;
	music: string;
	musicGain: number;
	words: Word[];
	keywords: string[];
	hidden: [number, number][];
	shots: Shot[];
	sfx: Sfx[];
	shakes: Shake[];
	tags: Tag[];
	credit: string;
	cards?: Card[];
	/** estilo agressivo: flash RGB/glitch em cada corte */
	cutFx?: number[];
};
export type SerieProps = {slug: string; spec: Spec | null; music: string | null; musicGain: number | null};

export const calcSerie: CalculateMetadataFunction<SerieProps> = async ({props}) => {
	const spec: Spec = await (await fetch(staticFile(`serie/${props.slug}/spec.json`))).json();
	return {durationInFrames: Math.round(spec.duration * 30), props: {...props, spec}};
};

const TagView: React.FC<{tag: Tag}> = ({tag}) => {
	const frame = useCurrentFrame();
	// tamanho da fonte se adapta ao texto para nunca sair da tela (Anton ≈ 0,46 em por caractere)
	const fit = (max: number, width: number, em: number) => Math.min(max, width / (tag.text.length * em));
	const k = spring({frame, fps: 30, config: {damping: 11, stiffness: 280}});
	const out = interpolate(frame, [f(tag.to - tag.at) - 5, f(tag.to - tag.at)], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	if (tag.kind === 'stamp') {
		return (
			<div style={{position: 'absolute', left: 0, right: 0, top: 1330, textAlign: 'center', opacity: k * out, transform: `rotate(-4deg) scale(${interpolate(k, [0, 1], [2.2, 1])})`}}>
				<span style={{display: 'inline-block', fontFamily: DISPLAY, fontSize: fit(82, 860, 0.46), color: tag.color, border: `9px solid ${tag.color}`, borderRadius: 18, padding: '4px 28px 0', background: 'rgba(0,0,0,0.55)', whiteSpace: 'nowrap'}}>{tag.text}</span>
			</div>
		);
	}
	if (tag.kind === 'big') {
		return (
			<div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', opacity: out, transform: `scale(${interpolate(k, [0, 1], [1.8, 1])})`}}>
				<span style={{fontFamily: DISPLAY, fontSize: fit(150, 980, 0.46), color: tag.color, lineHeight: 1, textShadow: '0 10px 0 #000, 0 0 40px rgba(0,0,0,0.6)', whiteSpace: 'nowrap'}}>{tag.text}</span>
			</div>
		);
	}
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: 1340, textAlign: 'center', opacity: k * out, transform: `translateY(${(1 - k) * 70}px)`}}>
			<span style={{display: 'inline-block', background: tag.color, color: tag.color === C.yellow ? '#111' : 'white', fontFamily: UI, fontWeight: 800, fontSize: fit(46, 900, 0.62), padding: '12px 30px', borderRadius: 24, boxShadow: '0 10px 0 rgba(0,0,0,0.55)', whiteSpace: 'nowrap'}}>{tag.text}</span>
		</div>
	);
};

const SerieOverlays: React.FC<{spec: Spec}> = ({spec}) => (
	<AbsoluteFill>
		{(spec.cards ?? []).map((c, i) => (
			<At key={`c${i}`} from={c.from} to={c.to}>
				<CardView card={c} />
			</At>
		))}
		{(spec.cutFx ?? []).map((t, i) => (
			<At key={`x${i}`} from={t} to={t + 0.2}>
				<CutFx />
			</At>
		))}
		{spec.tags.map((t, i) => (
			<At key={i} from={t.at} to={t.to}>
				<TagView tag={t} />
			</At>
		))}
		<At from={0} to={spec.outroAt}>
			<div style={{position: 'absolute', right: 34, bottom: 70, fontFamily: UI, fontWeight: 600, fontSize: 22, color: 'rgba(255,255,255,0.6)', textShadow: '0 2px 4px #000'}}>{spec.credit}</div>
		</At>
		<At from={spec.outroAt} to={spec.duration}>
			<ProOutro subAt={1.6} tagline="INVESTIGANDO CADA DETALHE DE GTA 6" />
		</At>
	</AbsoluteFill>
);

export const GTA6Serie: React.FC<SerieProps> = ({spec, music, musicGain}) => {
	if (!spec) return null;
	return (
		<ShortEdit
			shots={spec.shots}
			sfx={spec.sfx}
			shakes={spec.shakes}
			words={spec.words}
			keywords={new Set(spec.keywords)}
			hidden={spec.hidden}
			voice={spec.voice}
			music={music ?? spec.music}
			musicGain={musicGain ?? spec.musicGain}
			overlays={<SerieOverlays spec={spec} />}
			hud={null}
			watermark={WATERMARK}
		/>
	);
};

/* ---------------------------------------------------------------- thumbnail vertical (sem logo) */
export type ThumbSpec = {bg: string; pos: string; top: string; hl: string; hlColor: string; bottom: string; credit: string};
export type ThumbProps = {slug: string; thumb: ThumbSpec | null};
export const calcThumb: CalculateMetadataFunction<ThumbProps> = async ({props}) => {
	const plan = await (await fetch(staticFile(`serie/${props.slug}/thumb.json`))).json();
	return {props: {...props, thumb: plan}};
};
export const ThumbSerie: React.FC<ThumbProps> = ({thumb}) => {
	if (!thumb) return null;
	return (
		<AbsoluteFill style={{background: '#05040a', overflow: 'hidden'}}>
			<Img src={staticFile(thumb.bg)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: thumb.pos, filter: 'saturate(1.2) contrast(1.1)'}} />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(5,4,10,0.92) 0%, rgba(5,4,10,0.6) 28%, rgba(5,4,10,0) 50%, rgba(5,4,10,0.15) 75%, rgba(5,4,10,0.85) 100%)'}} />
			<div style={{position: 'absolute', left: 40, right: 40, top: 130, textAlign: 'center'}}>
				<div style={{fontFamily: DISPLAY, fontSize: 124, color: 'white', lineHeight: 1.02, textShadow: '0 10px 0 #000'}}>{thumb.top}</div>
				<div style={{display: 'inline-block', marginTop: 20, background: thumb.hlColor, padding: '10px 40px 2px', borderRadius: 16, transform: 'rotate(-2.5deg)', boxShadow: '0 14px 0 #000'}}>
					<span style={{fontFamily: DISPLAY, fontSize: 168, color: thumb.hlColor === C.yellow ? '#111' : 'white', whiteSpace: 'nowrap'}}>{thumb.hl}</span>
				</div>
			</div>
			{thumb.bottom ? (
				<div style={{position: 'absolute', left: 0, right: 0, bottom: 150, textAlign: 'center'}}>
					<span style={{fontFamily: DISPLAY, fontSize: 88, color: C.yellow, textShadow: '0 8px 0 #000, 0 0 30px rgba(0,0,0,0.8)'}}>{thumb.bottom}</span>
				</div>
			) : null}
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 50, textAlign: 'center', fontFamily: UI, fontWeight: 800, fontSize: 24, color: 'rgba(255,255,255,0.75)', letterSpacing: 3}}>{thumb.credit}</div>
		</AbsoluteFill>
	);
};
