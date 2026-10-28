import type {Shot} from '../data/shots';

// "O celular de GTA 6" — só screenshots oficiais INÉDITOS no canal (páginas de personagens e lugares do site; ver IMAGENS-USADAS.md).
// Telas de celular e redes sociais são motion design ilustrativo: nada disso foi mostrado como mecânica confirmada.
export const SHOTS: Shot[] = [
	// ---------- GANCHO
	{id: 'A', from: 0, to: 2.36, src: 'v7/jason-phone.jpg', focus0: [0.47, 0.45], s0: 1.25, s1: 1.12, inT: 'cut', look: 'dark', note: '"O celular de GTA 6" — Jason com celular na mão'},
	{id: 'B', from: 2.36, to: 5.28, src: 'v7/boobie-phone.jpg', focus0: [0.3, 0.45], s0: 1.05, s1: 1.18, inT: 'whipL', look: 'dark', note: '"uma das mecânicas mais interessantes"'},
	{id: 'C', from: 5.28, to: 8.5, src: 'v7/raul-phone.jpg', focus0: [0.52, 0.45], s0: 1.15, s1: 1.05, inT: 'glitch', look: 'dark', note: '"apenas para receber mensagens"'},
	{id: 'D', from: 8.5, to: 12.62, src: 'v7/lucia-gun.jpg', focus0: [0.3, 0.45], focus1: [0.36, 0.45], s0: 1.05, s1: 1.2, inT: 'whipR', look: 'dark', punches: [9.5], note: '"mudar completamente a história"'},
	{id: 'E', from: 12.62, to: 16.84, src: 'v7/vc-night.jpg', focus0: [0.45, 0.5], focus1: [0.6, 0.5], s0: 1.1, s1: 1.2, inT: 'zoom', look: 'dark', note: '"Fica até o final"'},
	// ---------- O QUE OS TRAILERS MOSTRAM
	{id: 'F', from: 16.84, to: 18.9, src: 'v7/jason-bike.jpg', focus0: [0.66, 0.4], s0: 1.12, s1: 1.04, inT: 'whipL', note: '"Nos trailers... Jason"'},
	{id: 'F2', from: 18.9, to: 21.44, src: 'v7/lucia-pool.jpg', focus0: [0.62, 0.5], focus1: [0.75, 0.5], s0: 1.0, s1: 1.1, inT: 'whipR', note: '"e Lucia... celulares, vídeos"'},
	{id: 'G', from: 21.44, to: 24.52, src: 'v7/dimez-studio.jpg', focus0: [0.52, 0.45], s0: 1.05, s1: 1.15, inT: 'cut', look: 'dark', note: '"redes sociais fazem parte da rotina"'},
	{id: 'H', from: 24.52, to: 27.36, src: 'v7/vc-sign.jpg', focus0: [0.45, 0.45], focus1: [0.6, 0.45], s0: 1.1, s1: 1.15, inT: 'zoom', note: '"combina perfeitamente com Vice City"'},
	{id: 'I', from: 27.36, to: 32.38, src: 'v7/vc-posers.jpg', focus0: [0.3, 0.45], focus1: [0.55, 0.45], s0: 1.05, s1: 1.12, inT: 'whipL', punches: [30.38], note: '"famosa da noite para o dia" — contador de seguidores'},
	// ---------- IMAGINA
	{id: 'J', from: 32.38, to: 34.5, src: 'v7/vc-street.jpg', focus0: [0.5, 0.5], s0: 1.1, s1: 1.3, inT: 'dip', look: 'title', note: '"Agora imagina a seguinte situação" — título'},
	{id: 'K', from: 34.5, to: 36.86, src: 'v7/keys-iguana.jpg', focus0: [0.45, 0.55], s0: 1.05, s1: 1.15, inT: 'flash', punches: [35.4], note: '"alguma coisa absurda na rua"'},
	{id: 'L', from: 36.86, to: 39.8, src: 'v7/dimez-car.jpg', focus0: [0.6, 0.4], focus1: [0.75, 0.45], s0: 1.05, s1: 1.15, inT: 'whipR', note: '"alguém grava, publica" — gravando/postando'},
	{id: 'M', from: 39.8, to: 43.42, src: 'v7/cal-pool.jpg', focus0: [0.4, 0.5], s0: 1.0, s1: 1.15, inT: 'zoom', note: '"sua cara está circulando por toda a parte" — viralizou'},
	{id: 'N', from: 43.42, to: 46.18, src: 'v7/dimez-mic.jpg', focus0: [0.5, 0.45], s0: 1.12, s1: 1.04, inT: 'flash', note: '"Parabéns, você virou influencer"'},
	{id: 'O', from: 46.18, to: 49.68, src: 'v7/vc-police.jpg', focus0: [0.2, 0.45], focus1: [0.3, 0.45], s0: 1.1, s1: 1.15, inT: 'glitch', look: 'dark', punches: [48.08], note: '"esqueceu de avisar o departamento de polícia"'},
	// ---------- MAIS QUE UM MENU
	{id: 'P', from: 49.68, to: 54.7, src: 'v7/jason-car.jpg', focus0: [0.42, 0.45], s0: 1.05, s1: 1.15, inT: 'whipL', look: 'dark', note: '"muito mais do que um simples menu"'},
	{id: 'Q1', from: 54.7, to: 58.84, src: 'v7/brian-papers.jpg', focus0: [0.62, 0.45], s0: 1.05, s1: 1.15, inT: 'whipR', look: 'dark', note: '"contatos, informações"'},
	{id: 'Q2', from: 58.84, to: 62.26, src: 'v7/boobie-office.jpg', focus0: [0.45, 0.45], s0: 1.1, s1: 1.2, inT: 'cut', look: 'dark', note: '"oportunidades e acontecimentos da trama"'},
	{id: 'R', from: 62.26, to: 64.4, src: 'v7/drequan-studio.jpg', focus0: [0.5, 0.45], s0: 1.15, s1: 1.05, inT: 'glitch', look: 'dark', note: '"E existe outra possibilidade"'},
	{id: 'S', from: 64.4, to: 70.56, src: 'v7/vc-beach.jpg', focus0: [0.55, 0.4], focus1: [0.7, 0.4], s0: 1.05, s1: 1.12, inT: 'whipL', note: '"como as pessoas reagem às ações de Jason e Lucia" — reações'},
	{id: 'T', from: 70.56, to: 74.22, src: 'v7/vc-aerial.jpg', focus0: [0.4, 0.5], focus1: [0.6, 0.5], s0: 1.1, s1: 1.2, inT: 'zoom', note: '"sensação de estar vivo"'},
	// ---------- O DETALHE / NÃO CONFIRMADO
	{id: 'U', from: 74.22, to: 76.8, src: 'v7/lucia-bar.jpg', focus0: [0.4, 0.45], s0: 1.2, s1: 1.1, inT: 'cut', look: 'calm', note: '"o detalhe mais importante"'},
	{id: 'V1', from: 76.8, to: 80.74, src: 'v7/jason-bar.jpg', focus0: [0.58, 0.45], s0: 1.05, s1: 1.15, inT: 'glitch', look: 'dark', note: '"Não está confirmado que as publicações vão alterar a história"'},
	{id: 'V2', from: 80.74, to: 84.7, src: 'v7/lucia-prison.jpg', focus0: [0.45, 0.45], s0: 1.05, s1: 1.15, inT: 'whipR', look: 'dark', note: '"ou provocar consequências na jogabilidade"'},
	{id: 'W1', from: 84.7, to: 88.4, src: 'v7/dimez-fur.jpg', focus0: [0.6, 0.45], s0: 1.05, s1: 1.15, inT: 'whipL', look: 'dark', note: '"presença de celulares e conteúdos digitais"'},
	{id: 'W2', from: 88.4, to: 92.36, src: 'v7/jason-rifle.jpg', focus0: [0.42, 0.45], s0: 1.1, s1: 1.2, inT: 'cut', look: 'dark', note: '"mas não comprova todas essas possibilidades"'},
	{id: 'X', from: 92.36, to: 96.8, src: 'v7/lucia-club.jpg', focus0: [0.5, 0.45], s0: 1.05, s1: 1.15, inT: 'flash', look: 'dark', note: '"se a Rockstar transformar em mecânica profunda"'},
	{id: 'Y', from: 96.8, to: 102.96, src: 'v7/keys-boats.jpg', focus0: [0.4, 0.5], focus1: [0.6, 0.5], s0: 1.05, s1: 1.15, inT: 'whipR', look: 'dark', note: '"de acessório a parte importante da experiência"'},
	// ---------- ENQUETE / INSCRIÇÃO
	{id: 'Z', from: 102.96, to: 104.16, src: 'v7/cal-pool-hall.jpg', focus0: [0.45, 0.45], s0: 1.15, s1: 1.05, inT: 'flash', note: '"Agora me responde"'},
	{id: 'P1', from: 104.16, to: 111.26, src: 'v7/drequan-club.jpg', focus0: [0.55, 0.45], focus1: [0.7, 0.45], s0: 1.05, s1: 1.12, inT: 'cut', look: 'dark', note: '"viralizassem... NPCs reagirem" — enquete A'},
	{id: 'P2', from: 111.26, to: 114.64, src: 'v7/keys-anchor.jpg', focus0: [0.55, 0.5], s0: 1.05, s1: 1.15, inT: 'cut', look: 'dark', note: '"irritante depois de 5 minutos" — enquete B'},
	{id: 'E1', from: 114.64, to: 116.4, src: 'v7/raul-yacht.jpg', focus0: [0.6, 0.45], s0: 1.1, s1: 1.15, inT: 'whipL', look: 'dark', note: '"Comenta aqui, deixe o like"'},
	{id: 'E2', from: 116.4, to: 122.6, src: 'v7/outro-art.jpg', focus0: [0.5, 0.45], s0: 1.2, s1: 1.1, inT: 'zoom', look: 'title', note: '"se inscreve no ZoneGTAVI" — logo'},
];
