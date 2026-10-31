import type {Look, Shot, Transition} from '../data/shots';

// Vídeo LONGO 16:9 "Os interiores de GTA 6". O estoque de imagens oficiais inéditas acabou: usa screenshots oficiais
// já vistos no canal (cada um uma vez neste vídeo) + uma arte oficial ainda inédita (v11/art-club).
let n = 0;
const S = (from: number, to: number, src: string, fx: number, fy: number, s0: number, s1: number, inT: Transition, look: Look, note: string, punches: number[] = []): Shot => ({
	id: `I${++n}`,
	from,
	to,
	src,
	focus0: [fx, fy],
	s0,
	s1,
	inT,
	look,
	punches,
	note,
});

export const SHOTS: Shot[] = [
	// ---------------- ABERTURA
	S(0, 5.0, 'v5/rooftop.jpg', 0.5, 0.45, 1.0, 1.1, 'cut', 'base', '"E se eu te dissesse..."'),
	S(5.0, 10.3, 'v5/stilt-house.jpg', 0.5, 0.5, 1.0, 1.12, 'zoom', 'base', '"sair da rua e entrar em uma casa?"', [9.4]),
	S(10.3, 16.7, 'v7/boobie-office.jpg', 0.45, 0.45, 1.0, 1.1, 'whipL', 'base', '"quantidade de interiores muito maior"'),
	S(16.7, 23.4, 'v6/salon-desk.jpg', 0.45, 0.5, 1.0, 1.1, 'whipR', 'base', '"o que podemos encontrar dentro deles"'),
	S(23.4, 32.4, 'v10/jason-247.jpg', 0.5, 0.45, 1.0, 1.12, 'zoom', 'dark', '"Fica comigo... detalhe da demonstração"'),
	// ---------------- CAPÍTULO 1 — O FIM DAS FACHADAS
	S(32.4, 42.8, 'v5/postcard.jpg', 0.5, 0.5, 1.1, 1.2, 'dip', 'title', 'CAPÍTULO 1 — título'),
	S(42.8, 48.0, 'v9/strangers.jpg', 0.5, 0.45, 1.0, 1.1, 'whipL', 'base', '"apartamentos, lojas, casas e comércios"'),
	S(48.0, 55.3, 'v8/gellhorn-cabaret.jpg', 0.5, 0.5, 1.0, 1.12, 'whipR', 'dark', '"tentar abrir uma porta... apenas uma fachada"', [54.8]),
	S(55.3, 61.1, 'v7/vc-aerial.jpg', 0.5, 0.5, 1.0, 1.1, 'zoom', 'base', '"GTA 6 promete dar um passo importante"'),
	// ---------------- CAPÍTULO 2 — DEZ VEZES MAIS?
	S(61.1, 67.0, 'v6/neon-tattoo.jpg', 0.5, 0.5, 1.1, 1.15, 'dip', 'title', 'CAPÍTULO 2 — título'),
	S(67.0, 75.7, 'v6/neon-tattoo.jpg', 0.45, 0.5, 1.0, 1.1, 'flash', 'dark', '"ordem de grandeza a mais de interiores" — Aaron Garbut'),
	S(75.7, 88.7, 'v7/keys-anchor.jpg', 0.5, 0.5, 1.0, 1.1, 'whipL', 'dark', '"não significa que todas as casas estarão abertas"'),
	S(88.7, 99.6, 'v7/dimez-studio.jpg', 0.5, 0.45, 1.0, 1.1, 'whipR', 'dark', '"investindo em ambientes internos"'),
	// ---------------- CAPÍTULO 3 — LUGARES QUE CONTAM HISTÓRIAS
	S(99.6, 111.4, 'v5/tattoo-shop.jpg', 0.5, 0.5, 1.1, 1.2, 'dip', 'title', 'CAPÍTULO 3 — título'),
	S(111.4, 115.7, 'v5/tattoo-back.jpg', 0.55, 0.45, 1.0, 1.1, 'cut', 'base', '"esses lugares contem histórias"'),
	S(115.7, 128.6, 'v9/counter-woman.jpg', 0.55, 0.45, 1.0, 1.12, 'whipL', 'base', '"fotografias, objetos pessoais, móveis"'),
	S(128.6, 139.4, 'v5/tattoo-neon.jpg', 0.45, 0.45, 1.0, 1.1, 'whipR', 'dark', '"características de quem ocupa aquela casa"'),
	S(139.4, 152.1, 'v7/cal-pool-hall.jpg', 0.5, 0.45, 1.0, 1.1, 'zoom', 'base', '"lugares aparentemente comuns"'),
	// ---------------- CAPÍTULO 4 — A CENA DO CACHORRO
	S(152.1, 159.0, 'v10/tattoo-yard.jpg', 0.5, 0.5, 1.1, 1.15, 'dip', 'title', 'CAPÍTULO 4 — título'),
	S(159.0, 166.3, 'v10/tattoo-yard.jpg', 0.25, 0.85, 1.2, 1.4, 'flash', 'base', '"um cachorro havia feito uma bagunça"'),
	S(166.3, 177.3, 'v7/jason-phone.jpg', 0.47, 0.12, 1.35, 1.5, 'whipL', 'dark', '"a reação de Jason... cheiro"', [174.1]),
	S(177.3, 187.3, 'v10/jason-fire.jpg', 0.5, 0.4, 1.05, 1.18, 'glitch', 'dark', '"o próprio ambiente provoca uma reação"'),
	S(187.3, 198.8, 'v8/willie-garage.jpg', 0.5, 0.5, 1.0, 1.1, 'whipR', 'dark', '"sistemas trabalham juntos"'),
	// ---------------- CAPÍTULO 5 — VIDA ACONTECENDO ALI
	S(198.8, 205.0, 'v5/mechanic.jpg', 0.55, 0.5, 1.1, 1.15, 'dip', 'title', 'CAPÍTULO 5 — título'),
	S(205.0, 212.2, 'v5/mechanic.jpg', 0.6, 0.5, 1.0, 1.1, 'flash', 'base', '"encontra objetos, sinais de uso"'),
	S(212.2, 222.8, 'v9/pool-party.jpg', 0.55, 0.45, 1.0, 1.1, 'whipL', 'dark', '"uma vida acontecendo ali"'),
	S(222.8, 231.7, 'v11/art-club.jpg', 0.5, 0.5, 1.0, 1.12, 'zoom', 'base', '"mais ambientes internos disponíveis"'),
	S(231.7, 239.5, 'v6/club-night.jpg', 0.55, 0.45, 1.0, 1.1, 'whipR', 'dark', '"pequenas histórias sem seguir uma missão"'),
	// ---------------- CAPÍTULO 6 — O QUE AINDA NÃO SABEMOS
	S(239.5, 246.0, 'v8/gellhorn-motel.jpg', 0.4, 0.45, 1.1, 1.15, 'dip', 'title', 'CAPÍTULO 6 — título'),
	S(246.0, 251.0, 'v8/gellhorn-motel.jpg', 0.45, 0.45, 1.0, 1.1, 'flash', 'dark', '"não temos a lista completa"'),
	S(251.0, 260.2, 'v7/vc-street.jpg', 0.5, 0.5, 1.0, 1.1, 'whipL', 'dark', '"não seria correto afirmar que poderemos entrar em todas"'),
	S(260.2, 269.8, 'v7/raul-phone.jpg', 0.52, 0.45, 1.0, 1.1, 'whipR', 'dark', '"uma prioridade clara"'),
	// ---------------- CAPÍTULO 7 — A CONEXÃO COM OS NPCs
	S(269.8, 276.0, 'v9/bonfire.jpg', 0.4, 0.45, 1.1, 1.15, 'dip', 'title', 'CAPÍTULO 7 — título'),
	S(276.0, 285.4, 'v9/bonfire.jpg', 0.35, 0.45, 1.0, 1.12, 'flash', 'dark', '"os personagens reagem de maneiras diferentes"'),
	S(285.4, 295.0, 'v9/street-bikers.jpg', 0.5, 0.5, 1.0, 1.1, 'whipL', 'base', '"as pessoas também tornam cada lugar mais interessante"'),
	// ---------------- PERGUNTA / OPINIÃO / CTA
	S(295.0, 304.1, 'v8/safehouse.jpg', 0.55, 0.55, 1.0, 1.1, 'flash', 'base', '"transformar a entrada em uma casa comum"'),
	S(304.1, 315.1, 'v10/skyline.jpg', 0.5, 0.45, 1.0, 1.12, 'zoom', 'base', '"um mapa enorme impressiona"'),
	S(315.1, 323.8, 'v6/cash-seat.jpg', 0.35, 0.6, 1.1, 1.3, 'cut', 'dark', '"prestar atenção nas pequenas coisas"'),
	S(323.8, 340.9, 'v6/salon-man.jpg', 0.65, 0.45, 1.2, 1.3, 'flash', 'title', '"centenas de casas simples ou menos lugares detalhados?" — enquete'),
	S(340.9, 356.2, 'v6/couple-port.jpg', 0.5, 0.45, 1.2, 1.1, 'zoom', 'title', '"inscreva-se no ZoneGTAVI" — logo'),
];
