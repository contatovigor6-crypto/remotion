import type {Shot} from '../data/shots';

// "Jason mora de favor (Brian Heder)" — só screenshots/artes oficiais INÉDITOS no canal (ver IMAGENS-USADAS.md).
export const SHOTS: Shot[] = [
	// ---------- GANCHO
	{id: 'A', from: 0, to: 2.4, src: 'v8/jason-boat.jpg', focus0: [0.25, 0.45], s0: 1.2, s1: 1.1, inT: 'cut', look: 'dark', note: '"Você sabia que o Jason mora de favor" — título'},
	{id: 'B', from: 2.4, to: 4.6, src: 'v8/safehouse.jpg', focus0: [0.55, 0.55], s0: 1.05, s1: 1.18, inT: 'whipL', punches: [2.76], note: '"de favor em GTA 6" — aluguel R$ 0'},
	{id: 'C', from: 4.6, to: 9.58, src: 'v8/brian-dock.jpg', focus0: [0.55, 0.45], focus1: [0.62, 0.42], s0: 1.05, s1: 1.18, inT: 'glitch', look: 'dark', punches: [8.14], note: '"esse favor pode custar muito mais caro"'},
	{id: 'D', from: 9.58, to: 15.34, src: 'v8/grass-aerial.jpg', focus0: [0.4, 0.5], focus1: [0.6, 0.5], s0: 1.1, s1: 1.2, inT: 'zoom', look: 'dark', note: '"Fica até o final... dono da casa"'},
	// ---------- QUEM É O DONO
	{id: 'E', from: 15.34, to: 19.46, src: 'v8/brian-art.jpg', focus0: [0.54, 0.4], s0: 1.15, s1: 1.05, inT: 'flash', note: '"propriedade de Brian Heder" — arte oficial'},
	{id: 'F', from: 19.46, to: 23.04, src: 'v8/brian-car.jpg', focus0: [0.5, 0.42], s0: 1.05, s1: 1.18, inT: 'whipR', look: 'dark', note: '"criminoso experiente... tráfico de drogas"'},
	{id: 'G', from: 23.04, to: 28.18, src: 'v8/brian-friends.jpg', focus0: [0.47, 0.4], focus1: [0.55, 0.4], s0: 1.05, s1: 1.12, inT: 'whipL', note: '"amigo que empresta o sofá... pizza"'},
	{id: 'H', from: 28.18, to: 31.68, src: 'v8/town-night.jpg', focus0: [0.5, 0.5], s0: 1.2, s1: 1.05, inT: 'glitch', look: 'dark', punches: [30.5], note: '"Aqui a situação é um pouco diferente"'},
	// ---------- O ACORDO
	{id: 'I', from: 31.68, to: 34.62, src: 'v8/willie-garage.jpg', focus0: [0.5, 0.5], s0: 1.05, s1: 1.15, inT: 'whipR', look: 'dark', note: '"Em troca de deixar Jason morar" — contrato'},
	{id: 'J', from: 34.62, to: 39.64, src: 'v8/gellhorn-bat.jpg', focus0: [0.33, 0.45], focus1: [0.62, 0.45], s0: 1.05, s1: 1.15, inT: 'cut', look: 'dark', punches: [35.84], note: '"ajude a cobrar dívidas"'},
	{id: 'K', from: 39.64, to: 45.0, src: 'v8/gellhorn-car.jpg', focus0: [0.33, 0.45], focus1: [0.5, 0.45], s0: 1.05, s1: 1.15, inT: 'whipL', look: 'dark', punches: [43.92], note: '"não chega em forma de boleto, chega em forma de problema"'},
	{id: 'L', from: 45.0, to: 47.78, src: 'v8/keys-aerial.jpg', focus0: [0.55, 0.5], s0: 1.15, s1: 1.05, inT: 'zoom', note: '"diz bastante sobre a situação do Jason"'},
	{id: 'M', from: 47.78, to: 54.04, src: 'v8/grass-gator.jpg', focus0: [0.4, 0.5], focus1: [0.6, 0.45], s0: 1.05, s1: 1.15, inT: 'whipR', look: 'dark', note: '"experiência militar, trabalha com criminosos" — ficha'},
	{id: 'N1', from: 54.04, to: 57.2, src: 'v8/grass-chase.jpg', focus0: [0.45, 0.5], s0: 1.1, s1: 1.2, inT: 'glitch', look: 'dark', note: '"depende de alguém envolvido no crime"'},
	{id: 'N2', from: 57.2, to: 61.02, src: 'v8/biker-couple.jpg', focus0: [0.45, 0.4], s0: 1.05, s1: 1.15, inT: 'cut', look: 'dark', punches: [58.84], note: '"a ajuda pode virar uma obrigação"'},
	{id: 'O1', from: 61.02, to: 67.06, src: 'v8/gellhorn-cabaret.jpg', focus0: [0.45, 0.5], focus1: [0.62, 0.5], s0: 1.05, s1: 1.15, inT: 'whipL', look: 'dark', note: '"conectado ao submundo criminoso" — mapa de conexões'},
	{id: 'O2', from: 67.06, to: 69.8, src: 'v8/lucia-fight.jpg', focus0: [0.55, 0.42], s0: 1.12, s1: 1.04, inT: 'flash', note: '"antes de sua história com Lucia"'},
	// ---------- ATENÇÃO
	{id: 'P1', from: 69.8, to: 73.66, src: 'v8/cal-night.jpg', focus0: [0.5, 0.45], s0: 1.15, s1: 1.05, inT: 'cut', look: 'calm', note: '"a Rockstar confirmou o acordo"'},
	{id: 'P2', from: 73.66, to: 78.9, src: 'v8/raul-club.jpg', focus0: [0.45, 0.45], s0: 1.05, s1: 1.15, inT: 'whipR', look: 'dark', note: '"ainda não revelou todas as consequências"'},
	// ---------- ENQUETE / INSCRIÇÃO
	{id: 'Q1', from: 78.9, to: 85.34, src: 'v8/boobie-drink.jpg', focus0: [0.52, 0.45], s0: 1.05, s1: 1.15, inT: 'whipL', look: 'dark', note: '"você aceitaria morar de graça...?" — enquete A'},
	{id: 'Q2', from: 85.34, to: 88.34, src: 'v8/drequan-purple.jpg', focus0: [0.45, 0.45], s0: 1.1, s1: 1.2, inT: 'cut', look: 'dark', note: '"eu prefiro pagar aluguel" — enquete B'},
	{id: 'R', from: 88.34, to: 92.16, src: 'v8/gellhorn-motel.jpg', focus0: [0.35, 0.45], focus1: [0.5, 0.5], s0: 1.05, s1: 1.15, inT: 'whipR', look: 'dark', note: '"missão secundária na porta"'},
	{id: 'S1', from: 92.16, to: 93.7, src: 'v8/kalaga-kayak.jpg', focus0: [0.55, 0.5], s0: 1.1, s1: 1.15, inT: 'whipL', note: '"Comenta aí, deixa o like"'},
	{id: 'S2', from: 93.7, to: 98.6, src: 'v8/ambrosia-sunset.jpg', focus0: [0.35, 0.5], s0: 1.2, s1: 1.1, inT: 'zoom', look: 'title', note: '"se inscreve no ZoneGTAVI" — logo'},
];
