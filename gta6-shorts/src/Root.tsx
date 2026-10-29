import React from 'react';
import {Composition, Still} from 'remotion';
import {ThumbInternet} from './thumbs/ThumbInternet';
import {ThumbFps} from './thumbs/ThumbFps';
import {ThumbPista} from './thumbs/ThumbPista';
import {ThumbCelular} from './thumbs/ThumbCelular';
import {ThumbBrian} from './thumbs/ThumbBrian';
import {ThumbProPolicia} from './thumbs/ThumbPro';
import {ThumbShortBrian, ThumbShortCelular, ThumbShortFps, ThumbShortInternet, ThumbShortParado, ThumbShortPista, ThumbShortPreso} from './thumbs/ThumbShorts';
import {GTA6Brian} from './brian/Video';
import {DURATION_S as BRIAN_DURATION} from './brian/data';
import {GTA6Celular} from './celular/Video';
import {DURATION_S as CELULAR_DURATION} from './celular/data';
import {GTA6Pista} from './pista/Video';
import {DURATION_S as PISTA_DURATION} from './pista/data';
import {GTA6Fps} from './fps/Video';
import {DURATION_S as FPS_DURATION} from './fps/data';
import {GTA6Internet} from './internet/Video';
import {DURATION_S as INTERNET_DURATION} from './internet/data';
import {GTA6Preso} from './preso/Video';
import {DURATION_S as PRESO_DURATION} from './preso/data';
import {GTA6Parado} from './Video';
import {DURATION_S, FPS, H, W} from './theme';

export const Root: React.FC = () => (
	<>
		<Composition id="GTA6Parado" component={GTA6Parado} durationInFrames={Math.round(DURATION_S * FPS)} fps={FPS} width={W} height={H} />
		{/* Mesma edição, trilhas diferentes */}
		<Composition id="GTA6Preso" component={GTA6Preso} defaultProps={{music: 'audio/music-preso.wav', musicGain: 1}} durationInFrames={Math.round(PRESO_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Composition id="GTA6PresoPhonk" component={GTA6Preso} defaultProps={{music: 'audio/music-phonk.wav', musicGain: 0.75}} durationInFrames={Math.round(PRESO_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Composition id="GTA6PresoTrap" component={GTA6Preso} defaultProps={{music: 'audio/music-trap.wav', musicGain: 1.25}} durationInFrames={Math.round(PRESO_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Composition id="GTA6PresoFunk" component={GTA6Preso} defaultProps={{music: 'audio/music-funk.wav', musicGain: 1}} durationInFrames={Math.round(PRESO_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Composition id="GTA6PresoEmpolgante" component={GTA6Preso} defaultProps={{music: 'audio/music-hype.wav', musicGain: 1.37}} durationInFrames={Math.round(PRESO_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Composition id="GTA6PresoAmbiente" component={GTA6Preso} defaultProps={{music: 'audio/music-ambient.wav', musicGain: 1.6}} durationInFrames={Math.round(PRESO_DURATION * FPS)} fps={FPS} width={W} height={H} />
		{/* Trilhas de Kevin MacLeod (incompetech.com) — CC BY 4.0, crédito obrigatório na descrição */}
		<Composition id="GTA6PresoInvestigations" component={GTA6Preso} defaultProps={{music: 'audio/music-investigations.wav', musicGain: 1.41}} durationInFrames={Math.round(PRESO_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Composition id="GTA6PresoHitman" component={GTA6Preso} defaultProps={{music: 'audio/music-hitman.wav', musicGain: 1.06}} durationInFrames={Math.round(PRESO_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Composition id="GTA6PresoSemMusica" component={GTA6Preso} defaultProps={{music: null, musicGain: 1}} durationInFrames={Math.round(PRESO_DURATION * FPS)} fps={FPS} width={W} height={H} />
		{/* "Internet no GTA 6" — trilha "Investigations" (Kevin MacLeod, CC BY 4.0) */}
		<Composition id="GTA6Internet" component={GTA6Internet} defaultProps={{music: 'audio/music-internet-investigations.wav', musicGain: 1.41}} durationInFrames={Math.round(INTERNET_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Composition id="GTA6InternetVolatile" component={GTA6Internet} defaultProps={{music: 'audio/music-internet-volatile.wav', musicGain: 0.38}} durationInFrames={Math.round(INTERNET_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Composition id="GTA6InternetOuroboros" component={GTA6Internet} defaultProps={{music: 'audio/music-internet-ouroboros.wav', musicGain: 0.6}} durationInFrames={Math.round(INTERNET_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Composition id="GTA6InternetSemMusica" component={GTA6Internet} defaultProps={{music: null, musicGain: 1}} durationInFrames={Math.round(INTERNET_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Still id="ThumbInternet" component={ThumbInternet} width={1280} height={720} />
		{/* "GTA 6 a 60 fps no PS5?" — trilha "Cyborg Ninja" (Kevin MacLeod, CC BY 4.0); músicas nunca se repetem: ver MUSICAS-USADAS.md */}
		<Composition id="GTA6Fps" component={GTA6Fps} defaultProps={{music: 'audio/music-fps-cyborg.wav', musicGain: 0.63}} durationInFrames={Math.round(FPS_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Still id="ThumbFps" component={ThumbFps} width={1280} height={720} />
		{/* "A pista no dinheiro: GTA 6 × Red Dead" — trilha "Spy Glass" (Kevin MacLeod, CC BY 4.0) */}
		<Composition id="GTA6Pista" component={GTA6Pista} defaultProps={{music: 'audio/music-pista-spyglass.wav', musicGain: 2.8}} durationInFrames={Math.round(PISTA_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Still id="ThumbPista" component={ThumbPista} width={1280} height={720} />
		{/* "O celular de GTA 6" — trilha "Raving Energy" (Kevin MacLeod, CC BY 4.0) */}
		<Composition id="GTA6Celular" component={GTA6Celular} defaultProps={{music: 'audio/music-celular-raving.wav', musicGain: 1}} durationInFrames={Math.round(CELULAR_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Still id="ThumbCelular" component={ThumbCelular} width={1280} height={720} />
		{/* "Jason mora de favor (Brian Heder)" — trilha "Mistake the Getaway" (Kevin MacLeod, CC BY 4.0) */}
		<Composition id="GTA6Brian" component={GTA6Brian} defaultProps={{music: 'audio/music-brian-getaway.wav', musicGain: 0.95}} durationInFrames={Math.round(BRIAN_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Still id="ThumbBrian" component={ThumbBrian} width={1280} height={720} />
		{/* Thumbnails verticais (formato Shorts) — padrão atual do canal */}
		<Still id="ThumbShortBrian" component={ThumbShortBrian} width={1080} height={1920} />
		<Still id="ThumbShortCelular" component={ThumbShortCelular} width={1080} height={1920} />
		<Still id="ThumbShortPista" component={ThumbShortPista} width={1080} height={1920} />
		<Still id="ThumbShortFps" component={ThumbShortFps} width={1080} height={1920} />
		<Still id="ThumbShortParado" component={ThumbShortParado} width={1080} height={1920} />
		<Still id="ThumbShortPreso" component={ThumbShortPreso} width={1080} height={1920} />
		<Still id="ThumbShortInternet" component={ThumbShortInternet} width={1080} height={1920} />
		<Still id="ThumbProPolicia" component={ThumbProPolicia} width={1080} height={1920} />
	</>
);
