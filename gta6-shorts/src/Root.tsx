import React from 'react';
import {Composition, Still} from 'remotion';
import {ThumbInternet} from './thumbs/ThumbInternet';
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
	</>
);
