import React from 'react';
import {Composition, Still} from 'remotion';
import {ThumbInternet} from './thumbs/ThumbInternet';
import {ThumbFps} from './thumbs/ThumbFps';
import {ThumbPista} from './thumbs/ThumbPista';
import {ThumbCelular} from './thumbs/ThumbCelular';
import {ThumbBrian} from './thumbs/ThumbBrian';
import {ThumbProLongEdge, ThumbProLongInteriores, ThumbProNpc, ThumbProPolicia} from './thumbs/ThumbPro';
import {GTA6Interiores} from './interiores/Video';
import {ThumbExtremeContagem, ThumbExtremeInteriores, ThumbExtremeSindicato, ThumbExtremeSindicatoV, ThumbExtremeReacaoV, ThumbExtremeArmazenamentoV, ThumbExtremeGaleriaV, ThumbExtremeVazamentoV, ThumbExtremeGloboV, ThumbExtremeCodigoV, ThumbExtremeCarrosV, ThumbExtremeArquivosV, ThumbExtremeGoldV, ThumbExtremePosterV, ThumbExtremePcV, ThumbExtremeFestivalV} from './thumbs/ThumbExtreme';
import {GTA6Festival, DURATION_S as FESTIVAL_DURATION} from './festival/Video';
import {GTA6Pc, DURATION_S as PC_DURATION} from './pc/Video';
import {GTA6Poster, DURATION_S as POSTER_DURATION} from './poster/Video';
import {GTA6Gold} from './gold/Video';
import {DURATION_S as GOLD_DURATION} from './gold/data';
import {GTA6Arquivos} from './arquivos/Video';
import {DURATION_S as ARQUIVOS_DURATION} from './arquivos/data';
import {GTA6Armadilha} from './armadilha/Video';
import {DURATION_S as ARMADILHA_DURATION} from './armadilha/data';
import {GTA6Carros} from './carros/Video';
import {DURATION_S as CARROS_DURATION} from './carros/data';
import {GTA6Codigo} from './codigo/Video';
import {DURATION_S as CODIGO_DURATION} from './codigo/data';
import {GTA6Globo} from './globo/Video';
import {DURATION_S as GLOBO_DURATION} from './globo/data';
import {GTA6Galeria} from './galeria/Video';
import {DURATION_S as GALERIA_DURATION} from './galeria/data';
import {GTA6Armazenamento} from './armazenamento/Video';
import {DURATION_S as ARMAZENAMENTO_DURATION} from './armazenamento/data';
import {GTA6Reacao} from './reacao/Video';
import {DURATION_S as REACAO_DURATION} from './reacao/data';
import {GTA6Sindicato} from './sindicato/Video';
import {DURATION_S as SINDICATO_DURATION} from './sindicato/data';
import {GTA6Contagem} from './contagem/Video';
import {DURATION_S as CONTAGEM_DURATION} from './contagem/data';
import {DURATION_S as INTERIORES_DURATION} from './interiores/data';
import {GTA6Npc} from './npc/Video';
import {GTA6Edge} from './edge/Video';
import {DURATION_S as EDGE_DURATION} from './edge/data';
import {DURATION_S as NPC_DURATION} from './npc/data';
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
		{/* "NPCs com personalidade" — trilha "Exit the Premises" (Kevin MacLeod, CC BY 4.0) */}
		<Composition id="GTA6Npc" component={GTA6Npc} defaultProps={{music: 'audio/music-npc-exit.wav', musicGain: 0.83}} durationInFrames={Math.round(NPC_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Still id="ThumbProNpc" component={ThumbProNpc} width={1080} height={1920} />
		{/* VÍDEO LONGO 16:9 "Novas imagens de GTA 6 (Edge 430)" — trilha de 4 faixas de Kevin MacLeod (CC BY 4.0) */}
		<Still id="ThumbProLongEdge" component={ThumbProLongEdge} width={1280} height={720} />
		{/* VÍDEO LONGO 16:9 "Os interiores de GTA 6" — trilha de 3 faixas de Kevin MacLeod (CC BY 4.0) */}
		<Composition id="GTA6Interiores" component={GTA6Interiores} defaultProps={{music: 'audio/music-interiores-long.wav', musicGain: 0.8}} durationInFrames={Math.round(INTERIORES_DURATION * FPS)} fps={FPS} width={1920} height={1080} />
		<Still id="ThumbProLongInteriores" component={ThumbProLongInteriores} width={1280} height={720} />
		<Still id="ThumbExtremeInteriores" component={ThumbExtremeInteriores} width={1280} height={720} />
		{/* Short "Faltam 17 dias" — trilha eletrizante "Cut and Run" (Kevin MacLeod, CC BY 4.0) */}
		<Composition id="GTA6Contagem" component={GTA6Contagem} defaultProps={{music: 'audio/music-contagem-cutrun.wav', musicGain: 1.5}} durationInFrames={Math.round(CONTAGEM_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Still id="ThumbExtremeContagem" component={ThumbExtremeContagem} width={1280} height={720} />
		{/* Short "Votação sindical na Rockstar UK" — trilha eletrizante "Movement Proposition" (Kevin MacLeod, CC BY 4.0) */}
		<Composition id="GTA6Sindicato" component={GTA6Sindicato} defaultProps={{music: 'audio/music-sindicato-movement.wav', musicGain: 1.5}} durationInFrames={Math.round(SINDICATO_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Still id="ThumbExtremeSindicato" component={ThumbExtremeSindicato} width={1280} height={720} />
		<Still id="ThumbExtremeSindicatoV" component={ThumbExtremeSindicatoV} width={1080} height={1920} />
		{/* Short "Os NPCs reagem à sua arma" — trilha épica "Five Armies" (Kevin MacLeod, CC BY 4.0) */}
		<Composition id="GTA6Reacao" component={GTA6Reacao} defaultProps={{music: 'audio/music-reacao-fivearmies.wav', musicGain: 0.79}} durationInFrames={Math.round(REACAO_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Still id="ThumbExtremeReacaoV" component={ThumbExtremeReacaoV} width={1080} height={1920} />
		<Composition id="GTA6Armazenamento" component={GTA6Armazenamento} defaultProps={{music: 'audio/music-armazenamento-cabello.wav', musicGain: 1.1}} durationInFrames={Math.round(ARMAZENAMENTO_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Still id="ThumbExtremeArmazenamentoV" component={ThumbExtremeArmazenamentoV} width={1080} height={1920} />
		<Composition id="GTA6Galeria" component={GTA6Galeria} defaultProps={{music: 'audio/music-galeria-iceflow.wav', musicGain: 0.92}} durationInFrames={Math.round(GALERIA_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Still id="ThumbExtremeGaleriaV" component={ThumbExtremeGaleriaV} width={1080} height={1920} />
		<Still id="ThumbExtremeVazamentoV" component={ThumbExtremeVazamentoV} width={1080} height={1920} />
		<Composition id="GTA6Globo" component={GTA6Globo} defaultProps={{music: 'audio/music-globo-heroic.wav', musicGain: 0.95}} durationInFrames={Math.round(GLOBO_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Still id="ThumbExtremeGloboV" component={ThumbExtremeGloboV} width={1080} height={1920} />
		<Composition id="GTA6Codigo" component={GTA6Codigo} defaultProps={{music: 'audio/music-codigo-mechanolith.wav', musicGain: 1.15}} durationInFrames={Math.round(CODIGO_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Still id="ThumbExtremeCodigoV" component={ThumbExtremeCodigoV} width={1080} height={1920} />
		<Composition id="GTA6Carros" component={GTA6Carros} defaultProps={{music: 'audio/music-carros-dangerstorm.wav', musicGain: 1.7}} durationInFrames={Math.round(CARROS_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Still id="ThumbExtremeCarrosV" component={ThumbExtremeCarrosV} width={1080} height={1920} />
		<Composition id="GTA6Arquivos" component={GTA6Arquivos} defaultProps={{music: 'audio/music-arquivos-beautyflow.wav', musicGain: 1.6}} durationInFrames={Math.round(ARQUIVOS_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Still id="ThumbExtremeArquivosV" component={ThumbExtremeArquivosV} width={1080} height={1920} />
		<Composition id="GTA6Gold" component={GTA6Gold} defaultProps={{music: 'audio/music-gold-werq.wav', musicGain: 0.95}} durationInFrames={Math.round(GOLD_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Still id="ThumbExtremeGoldV" component={ThumbExtremeGoldV} width={1080} height={1920} />
		<Composition id="GTA6Poster" component={GTA6Poster} defaultProps={{music: 'audio/music-poster-hyperfun.wav', musicGain: 1.12}} durationInFrames={Math.round(POSTER_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Still id="ThumbExtremePosterV" component={ThumbExtremePosterV} width={1080} height={1920} />
		<Composition id="GTA6Pc" component={GTA6Pc} defaultProps={{music: 'audio/music-pc-bitshift.wav', musicGain: 0.56}} durationInFrames={Math.round(PC_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Still id="ThumbExtremePcV" component={ThumbExtremePcV} width={1080} height={1920} />
		<Composition id="GTA6Festival" component={GTA6Festival} defaultProps={{music: 'audio/music-festival-electrodoodle.wav', musicGain: 0.66}} durationInFrames={Math.round(FESTIVAL_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Still id="ThumbExtremeFestivalV" component={ThumbExtremeFestivalV} width={1080} height={1920} />
		<Composition id="GTA6Armadilha" component={GTA6Armadilha} defaultProps={{music: 'audio/music-armadilha-hotpursuit.wav', musicGain: 0.75}} durationInFrames={Math.round(ARMADILHA_DURATION * FPS)} fps={FPS} width={W} height={H} />
		<Composition id="GTA6Edge" component={GTA6Edge} defaultProps={{music: 'audio/music-edge-long.wav', musicGain: 0.8}} durationInFrames={Math.round(EDGE_DURATION * FPS)} fps={FPS} width={1920} height={1080} />
	</>
);
