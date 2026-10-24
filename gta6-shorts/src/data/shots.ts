// Plano de montagem: cada plano ilustra a fala correspondente (tempos em segundos).
// focus = ponto de interesse [x, y] (0–1) usado no reenquadramento 16:9 -> 9:16.
// move  = escala/foco no início e no fim do plano (câmera simulada).

export type Transition = 'cut' | 'whipL' | 'whipR' | 'zoom' | 'glitch' | 'flash' | 'dip';
export type Look = 'base' | 'desat' | 'calm' | 'red' | 'freeze' | 'dark' | 'title';

export type Shot = {
	id: string;
	from: number;
	to: number;
	src: string;
	video?: boolean;
	/** início da mídia de vídeo (s) */
	startFrom?: number;
	/** congela o vídeo a partir deste instante (s, tempo da timeline) */
	freezeAt?: number;
	focus0: [number, number];
	focus1?: [number, number];
	s0: number;
	s1: number;
	inT: Transition;
	look?: Look;
	/** instantes (s) de punch-in sincronizado com a fala */
	punches?: number[];
	/** encaixa a imagem inteira com fundo desfocado em vez de cortar */
	fit?: boolean;
	note: string;
};

export const SHOTS: Shot[] = [
	// ---------- GANCHO
	{id: 'A', from: 0, to: 2.14, src: 'img/pool-v.jpg', focus0: [0.5, 0.55], s0: 1.12, s1: 1.22, inT: 'cut', punches: [1.58], note: '"ficar parado" — personagem imóvel boiando'},
	{id: 'B', from: 2.14, to: 2.8, src: 'img/keyart-v.jpg', focus0: [0.5, 0.45], s0: 1.25, s1: 1.15, inT: 'flash', look: 'dark', note: '"GTA 6" — logo oficial'},
	{id: 'C', from: 2.8, to: 4.22, src: 'img/vc-day.jpg', focus0: [0.36, 0.5], focus1: [0.5, 0.5], s0: 1.0, s1: 1.15, inT: 'zoom', look: 'dark', note: '"por apenas uma hora" — cronômetro 01:00:00'},
	{id: 'D', from: 4.22, to: 6.1, src: 'img/trailer2-v.jpg', focus0: [0.5, 0.4], s0: 1.05, s1: 1.12, inT: 'whipL', punches: [5.22], note: '"um dos testes" — Jason e Lucia'},
	{id: 'E', from: 6.1, to: 8.5, src: 'img/keyart-v.jpg', focus0: [0.5, 0.3], focus1: [0.5, 0.6], s0: 1.15, s1: 1.15, inT: 'cut', punches: [6.12], note: '"curiosos... nesse jogo"'},
	{id: 'F', from: 8.5, to: 11.42, src: 'img/masked-v.jpg', focus0: [0.5, 0.45], s0: 1.05, s1: 1.18, inT: 'glitch', punches: [8.9], note: '"Não pula esse vídeo"'},
	{id: 'G', from: 11.42, to: 14.6, src: 'img/heist-v.jpg', focus0: [0.5, 0.5], s0: 1.2, s1: 1.05, inT: 'whipR', punches: [13.72], note: '"o que precisamos descobrir nesse experimento"'},
	// ---------- PREMISSA
	{id: 'H', from: 14.6, to: 16.24, src: 'img/jason-fence.jpg', focus0: [0.66, 0.42], focus1: [0.7, 0.4], s0: 1.0, s1: 1.1, inT: 'zoom', punches: [15.54], freezeAt: 15.8, note: '"deixar o Jason parado" — congela em "parado"'},
	{id: 'I', from: 16.24, to: 17.82, src: 'img/vc-day.jpg', focus0: [0.45, 0.5], s0: 1.45, s1: 1.0, inT: 'whipL', note: '"no meio de Vice City" — revelação aérea'},
	{id: 'J', from: 17.82, to: 18.56, src: 'img/duo-walk.jpg', focus0: [0.5, 0.5], s0: 1.1, s1: 1.16, inT: 'cut', note: '"sem andar"'},
	{id: 'K', from: 18.56, to: 19.54, src: 'img/cheetah-night.jpg', focus0: [0.55, 0.5], s0: 1.1, s1: 1.18, inT: 'cut', note: '"sem dirigir"'},
	{id: 'L', from: 19.54, to: 22.0, src: 'img/pool.jpg', focus0: [0.36, 0], s0: 1.06, s1: 1.12, inT: 'cut', punches: [21.18], note: '"sem fazer absolutamente nada"'},
	{id: 'M', from: 22.0, to: 25.95, src: 'img/vc-night-v.jpg', focus0: [0.5, 0.5], s0: 1.04, s1: 1.1, inT: 'dip', look: 'calm', note: '"parece que não vai acontecer nada" — respiro, relógio'},
	// ---------- DESENVOLVIMENTO
	{id: 'N', from: 25.95, to: 28.9, src: 'img/pool-v.jpg', focus0: [0.5, 0.55], s0: 1.3, s1: 1.18, inT: 'whipR', punches: [28.22], note: '"Mas pensa comigo... você está parado"'},
	{id: 'O', from: 28.9, to: 32.0, src: 'img/vc-night.jpg', focus0: [0.3, 0.5], focus1: [0.7, 0.5], s0: 1.05, s1: 1.15, inT: 'zoom', note: '"a cidade inteira... ao seu redor" — radar'},
	{id: 'P', from: 32.0, to: 33.14, src: 'img/traffic.jpg', focus0: [0.2, 0.6], focus1: [0.75, 0.6], s0: 1.05, s1: 1.05, inT: 'whipL', note: '"Os carros passam"'},
	{id: 'Q', from: 33.14, to: 34.56, src: 'img/people-car.jpg', focus0: [0.33, 0.45], focus1: [0.4, 0.45], s0: 1.0, s1: 1.1, inT: 'cut', note: '"os pedestres circulam"'},
	{id: 'R', from: 34.56, to: 36.36, src: 'video/lucia-clip-slow.mp4', video: true, focus0: [0.58, 0.45], s0: 1.0, s1: 1.08, inT: 'glitch', note: '"situações inesperadas" — clipe oficial Lucia'},
	{id: 'S', from: 36.36, to: 38.2, src: 'video/jason-clip-slow.mp4', video: true, focus0: [0.55, 0.45], s0: 1.0, s1: 1.1, inT: 'cut', punches: [36.92], note: '"bem na sua frente" — arma apontada para a câmera'},
	{id: 'T', from: 38.2, to: 41.36, src: 'img/cover-v.jpg', focus0: [0.5, 0.5], s0: 1.0, s1: 1.6, inT: 'dip', look: 'title', note: '"Agora vem a parte..." — riser, zoom acelerando'},
	// ---------- VIRADA
	{id: 'U', from: 41.36, to: 43.36, src: 'img/pool-v.jpg', focus0: [0.5, 0.55], s0: 1.35, s1: 1.2, inT: 'flash', look: 'base', note: '"voltar depois de uma hora" — volta ao personagem'},
	{id: 'V', from: 43.36, to: 45.7, src: 'img/vc-day.jpg', focus0: [0.5, 0.5], s0: 1, s1: 1, inT: 'whipL', note: '"alguma coisa mudou" — tela dividida antes/depois'},
	{id: 'W', from: 45.7, to: 48.74, src: 'img/lucia-gym.jpg', focus0: [0.5, 0], s0: 1.3, s1: 1.4, inT: 'whipR', punches: [46.22], note: '"os personagens... agindo normalmente" — tracking'},
	{id: 'X', from: 48.74, to: 50.96, src: 'img/boats-skyline.jpg', focus0: [0.25, 0.55], focus1: [0.45, 0.5], s0: 1.05, s1: 1.1, inT: 'zoom', note: '"Será que o mundo"'},
	{id: 'Y', from: 50.96, to: 53.44, src: 'img/dolphin.jpg', focus0: [0.4, 0.5], focus1: [0.72, 0.45], s0: 1.05, s1: 1.15, inT: 'cut', punches: [50.96], note: '"completamente vivo" — golfinho ao lado do barco'},
	{id: 'Z', from: 53.44, to: 58.7, src: 'img/cover-v.jpg', focus0: [0.5, 0.35], focus1: [0.5, 0.6], s0: 1.12, s1: 1.2, inT: 'glitch', look: 'title', punches: [57.78], note: '"ainda precisa testar" — selo AINDA NÃO TESTADO'},
	// ---------- DESAFIO
	{id: 'AA', from: 58.7, to: 61.18, src: 'img/jason-fence.jpg', focus0: [0.72, 0.42], s0: 1.4, s1: 1.5, inT: 'dip', look: 'dark', note: '"o verdadeiro desafio" — título'},
	{id: 'AB', from: 61.18, to: 63.92, src: 'img/jason-fence.jpg', focus0: [0.7, 0.4], s0: 1.05, s1: 1.25, inT: 'flash', look: 'red', note: '"uma hora inteira parado" — Jason encara'},
	{id: 'AC', from: 63.92, to: 65.58, src: 'img/pool.jpg', focus0: [0.4, 0.5], s0: 1.2, s1: 1.25, inT: 'glitch', look: 'dark', note: '"sem tocar em nenhum botão" — controle'},
	{id: 'AD', from: 65.58, to: 68.9, src: 'img/lucia-car.jpg', focus0: [0.55, 0.42], focus1: [0.56, 0.4], s0: 1.0, s1: 1.22, inT: 'whipL', punches: [67.66], note: '"até onde vai o realismo"'},
	// ---------- CTA / FECHAMENTO
	{id: 'AE', from: 68.9, to: 72.52, src: 'img/trailer2-v.jpg', focus0: [0.5, 0.4], s0: 1.1, s1: 1.2, inT: 'zoom', look: 'dark', note: 'CTA "eu teria coragem" — balão de comentário'},
	{id: 'AF', from: 72.52, to: 74.68, src: 'img/keyart-v.jpg', focus0: [0.5, 0.45], s0: 1.2, s1: 1.08, inT: 'whipR', punches: [73.36], note: '"quando o GTA 6 chegar" — logo + data oficial'},
	{id: 'AG', from: 74.68, to: 78.9, src: 'img/pool-v.jpg', focus0: [0.5, 0.55], s0: 1.2, s1: 1.12, inT: 'dip', note: 'fecha no plano de abertura (loop do Shorts)'},
];
