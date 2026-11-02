import type {Shot} from '../data/shots';

// Short "Faltam 17 dias para GTA 6" — clipes de VÍDEO oficiais da Rockstar + screenshots/artes oficiais (o estoque inédito acabou: reaproveitadas, uma vez cada neste vídeo).
export const SHOTS: Shot[] = [
	{id: 'A', from: 0, to: 2.4, src: 'v2/skyline-v.mp4', video: true, rate: 1, focus0: [0.5, 0.5], s0: 1.05, s1: 1.12, inT: 'cut', look: 'dark', note: '"Faltam apenas 17 dias" — vídeo oficial (skyline)'},
	{id: 'B', from: 2.4, to: 4.6, src: 'v2/jl-sun.mp4', video: true, rate: 0.82, focus0: [0.5, 0.45], s0: 1.05, s1: 1.12, inT: 'whipL', look: 'base', note: '"para GTA 6" — vídeo oficial', punches: [2.8]},
	{id: 'C1', from: 4.6, to: 7.2, src: 'v3/club.mp4', video: true, rate: 0.4, focus0: [0.5, 0.5], s0: 1.05, s1: 1.12, inT: 'glitch', look: 'dark', note: '"informações" — vídeo oficial (clube)'},
	{id: 'C2', from: 7.2, to: 10.0, src: 'v10/lucia-club.jpg', focus0: [0.55, 0.4], s0: 1.05, s1: 1.15, inT: 'cut', look: 'dark', note: '"que todo fã precisa conhecer"'},
	{id: 'D', from: 10.0, to: 12.2, src: 'v5/vc-bay.mp4', video: true, rate: 0.45, focus0: [0.5, 0.5], s0: 1.05, s1: 1.12, inT: 'zoom', look: 'base', note: '"A Rockstar já confirmou" — vídeo oficial (baía)'},
	{id: 'E', from: 12.2, to: 17.0, src: 'v12/box.jpg', focus0: [0.5, 0.5], s0: 1.1, s1: 1.2, inT: 'flash', look: 'title', note: '"19 de novembro, PS5 e Xbox Series X|S" — data'},
	{id: 'F', from: 17.0, to: 22.7, src: 'v2/city-night.mp4', video: true, rate: 1, focus0: [0.5, 0.5], s0: 1.05, s1: 1.12, inT: 'whipR', look: 'dark', note: '"pré-carregamento 12 de novembro" — vídeo oficial (cidade à noite)'},
	{id: 'G', from: 22.7, to: 27.7, src: 'v2/green-car.mp4', video: true, rate: 1, focus0: [0.45, 0.5], s0: 1.05, s1: 1.12, inT: 'whipL', look: 'dark', note: '"uma semana antes" — vídeo oficial (carro)'},
	{id: 'H', from: 27.7, to: 31.0, src: 'v2/hug.mp4', video: true, rate: 0.9, focus0: [0.5, 0.45], s0: 1.05, s1: 1.12, inT: 'glitch', look: 'dark', note: '"outro detalhe interessante" — vídeo oficial'},
	{id: 'I', from: 31.0, to: 37.5, src: 'v10/cover-landscape.jpg', focus0: [0.5, 0.5], s0: 1.0, s1: 1.1, inT: 'zoom', look: 'title', note: '"versão física com código na caixa, sem disco"'},
	{id: 'J', from: 37.5, to: 40.0, src: 'v2/ocean-sunset.mp4', video: true, rate: 0.4, focus0: [0.5, 0.5], s0: 1.05, s1: 1.12, inT: 'whipR', look: 'base', note: '"a música também" — vídeo oficial (pôr do sol)'},
	{id: 'K', from: 40.0, to: 42.6, src: 'v10/album-cover.jpg', focus0: [0.62, 0.45], s0: 1.05, s1: 1.15, inT: 'flash', note: '"álbum oficial chega no dia 19"'},
	{id: 'L', from: 42.6, to: 47.7, src: 'v10/score-cover.jpg', focus0: [0.5, 0.45], s0: 1.0, s1: 1.12, inT: 'whipL', note: '"trilha original do Justice, 11 de dezembro"'},
	{id: 'M1', from: 47.7, to: 49.3, src: 'v2/jason-neon.mp4', video: true, rate: 1, focus0: [0.5, 0.45], s0: 1.05, s1: 1.12, inT: 'glitch', look: 'dark', note: '"Agora vem a pergunta" — vídeo oficial'},
	{id: 'M2', from: 49.3, to: 52.5, src: 'video/lucia-clip-slow.mp4', video: true, rate: 0.93, focus0: [0.58, 0.45], s0: 1.05, s1: 1.12, inT: 'whipL', look: 'dark', note: '"mais alguma surpresa" — vídeo oficial (Lucia)'},
	{id: 'N', from: 52.5, to: 55.6, src: 'v2/raul.mp4', video: true, rate: 0.48, focus0: [0.5, 0.45], s0: 1.05, s1: 1.12, inT: 'zoom', look: 'dark', note: '"abrir as portas de Leonida" — vídeo oficial (Raul)'},
	{id: 'O', from: 55.6, to: 56.5, src: 'v10/shark.jpg', focus0: [0.45, 0.4], s0: 1.2, s1: 1.25, inT: 'cut', look: 'calm', note: '"Ainda não sabemos"'},
	{id: 'P', from: 56.5, to: 61.1, src: 'v10/skyline.jpg', focus0: [0.3, 0.5], s0: 1.3, s1: 1.15, inT: 'flash', look: 'dark', note: '"a contagem regressiva já começou"'},
	{id: 'Q', from: 61.1, to: 62.4, src: 'video/jason-clip-slow.mp4', video: true, rate: 1.5, focus0: [0.55, 0.45], s0: 1.05, s1: 1.12, inT: 'cut', look: 'dark', note: '"Você está preparado?" — vídeo oficial (Jason)', punches: [61.5]},
	{id: 'R', from: 62.4, to: 67.4, src: 'v10/jl-moto.jpg', focus0: [0.5, 0.45], s0: 1.2, s1: 1.1, inT: 'zoom', look: 'title', note: '"Comenta e se inscreve no ZoneGTAVI" — logo'},
];
