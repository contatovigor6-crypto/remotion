import type {Shot} from '../data/shots';

// "A pista no dinheiro: GTA 6 × Red Dead Redemption 2" — só imagens oficiais INÉDITAS no canal (ver IMAGENS-USADAS.md).
// As notas de dinheiro do trailer não estão no material oficial divulgado: aparecem como ilustração marcada.
export const SHOTS: Shot[] = [
	// ---------- GANCHO
	{id: 'A', from: 0, to: 2.8, src: 'v6/keyart-car.jpg', focus0: [0.55, 0.5], s0: 1.18, s1: 1.08, inT: 'cut', look: 'dark', punches: [2.8], note: '"Você acredita... pista escondida" — título'},
	{id: 'B', from: 2.8, to: 5.68, src: 'v6/jason-art.jpg', focus0: [0.6, 0.45], focus1: [0.7, 0.45], s0: 1.0, s1: 1.12, inT: 'whipL', punches: [3.9], note: '"em GTA 6, conectando o jogo"'},
	{id: 'C', from: 5.68, to: 7.6, src: 'v6/rdr2.jpg', focus0: [0.45, 0.4], s0: 1.12, s1: 1.0, inT: 'glitch', note: '"a Red Dead Redemption 2?" — arte oficial'},
	{id: 'D', from: 7.6, to: 11.1, src: 'v6/cash-seat.jpg', focus0: [0.3, 0.6], focus1: [0.36, 0.62], s0: 1.05, s1: 1.25, inT: 'whipR', look: 'dark', punches: [10.06], note: '"a pista está no dinheiro" — dinheiro oficial'},
	{id: 'E', from: 11.1, to: 13.6, src: 'v6/stanier-night.jpg', focus0: [0.5, 0.5], s0: 1.15, s1: 1.05, inT: 'zoom', look: 'dark', note: '"Fica até o final"'},
	{id: 'F', from: 13.6, to: 16.84, src: 'v6/couple-port.jpg', focus0: [0.52, 0.45], s0: 1.0, s1: 1.14, inT: 'whipL', note: '"mudar a forma como você enxerga essa conexão"'},
	// ---------- O ACHADO
	{id: 'G', from: 16.84, to: 19.44, src: 'v6/lucia-art.jpg', focus0: [0.55, 0.45], s0: 1.12, s1: 1.02, inT: 'glitch', look: 'dark', note: '"Durante o segundo trailer de GTA 6"'},
	{id: 'H', from: 19.44, to: 22.14, src: 'v6/neon-tattoo.jpg', focus0: [0.55, 0.5], s0: 1.1, s1: 1.2, inT: 'whipR', look: 'dark', note: '"algo estranho nas notas de dinheiro" — nota ilustrada'},
	{id: 'I', from: 22.14, to: 24.76, src: 'v6/club-night.jpg', focus0: [0.55, 0.45], s0: 1.05, s1: 1.15, inT: 'flash', note: '"cena de clube noturno"'},
	{id: 'J', from: 24.76, to: 29.42, src: 'v6/vintage-gunman.jpg', focus0: [0.5, 0.45], s0: 1.1, s1: 1.25, inT: 'zoom', look: 'dark', note: '"ampliaram as imagens... dois rostos familiares" — lupa'},
	{id: 'K', from: 29.42, to: 31.2, src: 'v6/rdr2.jpg', focus0: [0.5, 0.7], s0: 1.3, s1: 1.15, inT: 'whipL', note: '"para quem conhece Red Dead Redemption 2"'},
	{id: 'L', from: 31.2, to: 35.0, src: 'v6/revolvers-table.jpg', focus0: [0.62, 0.5], s0: 1.05, s1: 1.15, inT: 'glitch', look: 'dark', note: '"Thaddeus Waxman e Franklin Hardin, presidentes fictícios"'},
	{id: 'M', from: 35.0, to: 37.82, src: 'v6/rdr2.jpg', focus0: [0.42, 0.12], s0: 1.55, s1: 1.4, inT: 'whipR', note: '"universo do jogo de faroeste" — arte oficial Red Dead'},
	// ---------- A INVESTIGAÇÃO
	{id: 'N', from: 37.82, to: 40.12, src: 'v6/stanier-tail.jpg', focus0: [0.45, 0.45], s0: 1.1, s1: 1.3, inT: 'dip', look: 'title', note: '"E aqui começa a investigação" — título'},
	{id: 'O', from: 40.12, to: 43.62, src: 'v6/salon-desk.jpg', focus0: [0.45, 0.5], s0: 1.0, s1: 1.12, inT: 'flash', look: 'dark', note: '"não foram escolhidos aleatoriamente pelos fãs"'},
	{id: 'P', from: 43.62, to: 47.2, src: 'v6/revolver-aim.jpg', focus0: [0.25, 0.45], focus1: [0.55, 0.45], s0: 1.1, s1: 1.15, inT: 'whipL', look: 'dark', note: '"já existiam na história de Red Dead Redemption 2"'},
	{id: 'Q', from: 47.2, to: 52.4, src: 'v6/pistols.jpg', focus0: [0.45, 0.5], s0: 1.05, s1: 1.2, inT: 'whipR', look: 'dark', note: '"os mesmos personagens... no dinheiro de GTA 6"'},
	{id: 'R', from: 52.4, to: 53.6, src: 'v6/style-couple.jpg', focus0: [0.42, 0.5], s0: 1.15, s1: 1.25, inT: 'cut', punches: [52.62], note: '"Coincidência?"'},
	{id: 'S', from: 53.6, to: 54.7, src: 'v6/style-boots.jpg', focus0: [0.62, 0.45], s0: 1.15, s1: 1.25, inT: 'cut', punches: [53.66], note: '"Referência escondida?"'},
	{id: 'T', from: 54.7, to: 59.8, src: 'v6/keyart-car.jpg', focus0: [0.5, 0.5], s0: 1, s1: 1, inT: 'whipL', note: '"ligação entre essas duas franquias" — tela dividida'},
	// ---------- CALMA, DETETIVE
	{id: 'U', from: 59.8, to: 63.38, src: 'v6/salon-man.jpg', focus0: [0.66, 0.45], s0: 1.2, s1: 1.1, inT: 'cut', look: 'calm', punches: [62.64], note: '"Calma, detetive! Ainda não podemos bater o martelo."'},
	{id: 'V1', from: 63.38, to: 67.24, src: 'v6/ptt-store.jpg', focus0: [0.3, 0.5], focus1: [0.5, 0.5], s0: 1.05, s1: 1.1, inT: 'whipR', look: 'dark', note: '"referência visual concreta" ✓'},
	{id: 'V2', from: 67.24, to: 71.74, src: 'v6/style-man.jpg', focus0: [0.45, 0.45], s0: 1.05, s1: 1.18, inT: 'glitch', look: 'dark', note: '"não prova que... mesmo universo" ✗'},
	{id: 'W', from: 71.74, to: 75.3, src: 'v6/willie-truck.jpg', focus0: [0.35, 0.5], s0: 1.1, s1: 1.2, inT: 'whipL', look: 'dark', note: '"Rockstar ainda não confirmou oficialmente"'},
	{id: 'X', from: 75.3, to: 78.04, src: 'v6/cheetah-white.jpg', focus0: [0.55, 0.5], s0: 1.0, s1: 1.25, inT: 'zoom', look: 'dark', punches: [76.22], note: '"o detalhe mais interessante"'},
	{id: 'Y', from: 78.04, to: 82.68, src: 'v6/cheetah-door.jpg', focus0: [0.4, 0.5], focus1: [0.5, 0.5], s0: 1.05, s1: 1.15, inT: 'whipR', note: '"colocada de propósito... alguém da Rockstar"'},
	{id: 'Z', from: 82.68, to: 85.8, src: 'v6/van-graffiti.jpg', focus0: [0.3, 0.5], s0: 1.05, s1: 1.15, inT: 'flash', note: '"recompensar os jogadores mais atentos" — conquista'},
	// ---------- ENQUETE / INSCRIÇÃO
	{id: 'P1', from: 85.8, to: 87.44, src: 'v6/drequan-art.jpg', focus0: [0.58, 0.45], s0: 1.15, s1: 1.05, inT: 'whipL', note: '"Agora eu quero saber de você"'},
	{id: 'P2', from: 87.44, to: 91.34, src: 'v6/port-gellhorn.jpg', focus0: [0.35, 0.5], focus1: [0.55, 0.5], s0: 1.05, s1: 1.1, inT: 'cut', look: 'dark', note: '"mesmo universo?" — enquete A'},
	{id: 'P3', from: 91.34, to: 94.66, src: 'v6/ambrosia.jpg', focus0: [0.4, 0.5], s0: 1.05, s1: 1.12, inT: 'cut', look: 'dark', note: '"brincadeira da Rockstar" — enquete B'},
	{id: 'P4', from: 94.66, to: 96.64, src: 'v6/leonida-keys.jpg', focus0: [0.42, 0.5], s0: 1.1, s1: 1.2, inT: 'zoom', look: 'dark', note: '"Deixe a sua teoria nos comentários"'},
	{id: 'E1', from: 96.64, to: 100.6, src: 'v6/kalaga.jpg', focus0: [0.4, 0.45], s0: 1.05, s1: 1.15, inT: 'whipR', look: 'dark', note: '"investigar os mistérios de GTA 6"'},
	{id: 'E2', from: 100.6, to: 107.4, src: 'v6/cal-art.jpg', focus0: [0.5, 0.45], s0: 1.2, s1: 1.1, inT: 'zoom', look: 'title', note: '"se inscreve no ZoneGTAVI... nova pista" — logo'},
];
