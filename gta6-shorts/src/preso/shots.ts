import type {Shot} from '../data/shots';

// "Preso no GTA 6?" — plano de montagem. Clipes oficiais em 60 fps (rate < 1 = câmera lenta suave).
// Não há material oficial de prisão/abordagem policial: isso é representado por motion design, não por cenas inventadas.
export const SHOTS: Shot[] = [
	// ---------- GANCHO
	{id: 'A', from: 0, to: 1.32, src: 'img/jason-fence.jpg', focus0: [0.7, 0.42], s0: 1.0, s1: 1.1, inT: 'cut', punches: [0.94], note: '"Você pode ser preso" — Jason atrás da grade, luzes de viatura'},
	{id: 'B', from: 1.32, to: 3.54, src: 'v2/jason-neon.mp4', video: true, rate: 0.6, focus0: [0.6, 0.45], s0: 1.05, s1: 1.15, inT: 'whipL', look: 'dark', note: '"de verdade em GTA 6?" — logo'},
	{id: 'C', from: 3.54, to: 5.5, src: 'v2/robbery.mp4', video: true, rate: 0.5, freezeAt: 4.86, focus0: [0.75, 0.42], s0: 1.0, s1: 1.12, inT: 'glitch', note: '"ser capturado" — congela no assalto'},
	{id: 'D', from: 5.5, to: 7.9, src: 'v2/hug.mp4', video: true, focus0: [0.55, 0.45], s0: 1.0, s1: 1.1, inT: 'whipR', punches: [6.62], note: '"não ser o fim da sua história?"'},
	{id: 'E', from: 7.9, to: 10.9, src: 'v2/raul.mp4', video: true, rate: 0.5, focus0: [0.5, 0.45], s0: 1.0, s1: 1.15, inT: 'glitch', punches: [8.54], note: '"Fica até o final" — ação'},
	{id: 'F', from: 10.9, to: 15.3, src: 'img/jason-fence.jpg', focus0: [0.7, 0.42], s0: 1.2, s1: 1.3, inT: 'dip', look: 'dark', note: '"preso × eliminado" — tela dividida'},
	// ---------- CONTEXTO
	{id: 'G', from: 15.3, to: 17.4, src: 'v2/city-night.mp4', video: true, focus0: [0.5, 0.5], s0: 1.0, s1: 1.15, inT: 'zoom', note: '"a polícia promete" — cidade à noite + sirene'},
	{id: 'H', from: 17.4, to: 20.02, src: 'v2/skyline-v.mp4', video: true, focus0: [0.5, 0.5], s0: 1.0, s1: 1.1, inT: 'whipL', note: '"parte importante da experiência"'},
	{id: 'I', from: 20.02, to: 21.54, src: 'v2/jason-night-v.jpg', focus0: [0.5, 0.35], s0: 1.05, s1: 1.15, inT: 'whipR', punches: [21.0], note: '"será que Jason"'},
	{id: 'J', from: 21.54, to: 22.72, src: 'v2/lucia-v.jpg', focus0: [0.5, 0.4], s0: 1.05, s1: 1.15, inT: 'whipL', punches: [21.6], note: '"e Lucia"'},
	{id: 'K', from: 22.72, to: 24.16, src: 'v2/jl-sun-v.jpg', focus0: [0.5, 0.4], s0: 1.05, s1: 1.15, inT: 'cut', note: '"atrás das grades?" — grades caem'},
	// ---------- SITUAÇÃO HIPOTÉTICA
	{id: 'L', from: 24.16, to: 25.84, src: 'v2/gun-v.jpg', focus0: [0.5, 0.4], s0: 1.05, s1: 1.12, inT: 'glitch', punches: [25.32], note: '"cometer um crime"'},
	{id: 'M', from: 25.84, to: 27.56, src: 'v2/storm.mp4', video: true, rate: 0.6, focus0: [0.5, 0.5], s0: 1.1, s1: 1.25, inT: 'zoom', look: 'base', note: '"cercado pelos policiais" — estrelas sobem'},
	{id: 'N', from: 27.56, to: 30.2, src: 'v2/city-night.mp4', video: true, startFrom: 3, focus0: [0.5, 0.5], s0: 1.2, s1: 1.3, inT: 'cut', look: 'dark', note: '"nenhuma rota de fuga" — minimapa'},
	{id: 'O', from: 30.2, to: 31.42, src: 'v2/lucia-car.mp4', video: true, rate: 0.75, focus0: [0.6, 0.45], s0: 1.0, s1: 1.1, inT: 'whipR', look: 'red', note: '"Em vez de morrer"'},
	{id: 'P', from: 31.42, to: 35.1, src: 'img/jason-fence.jpg', focus0: [0.72, 0.4], s0: 1.25, s1: 1.4, inT: 'flash', note: '"capturado e levado sob custódia?" — ficha policial'},
	{id: 'Q', from: 35.1, to: 37.7, src: 'v2/jl-sun.mp4', video: true, rate: 0.55, focus0: [0.5, 0.4], s0: 1.0, s1: 1.1, inT: 'whipL', note: '"possibilidades interessantes"'},
	{id: 'R', from: 37.7, to: 40.58, src: 'img/heist-v.jpg', focus0: [0.5, 0.5], s0: 1.15, s1: 1.05, inT: 'glitch', look: 'dark', note: '"perder dinheiro, equipamentos confiscados"'},
	{id: 'S1', from: 40.58, to: 42.46, src: 'v2/keys.mp4', video: true, rate: 0.5, focus0: [0.5, 0.5], s0: 1.05, s1: 1.15, inT: 'whipR', note: '"voltar à liberdade" — Keys'},
	{id: 'S2', from: 42.46, to: 44.26, src: 'v2/ocean-sunset.mp4', video: true, rate: 0.5, focus0: [0.5, 0.5], s0: 1.0, s1: 1.12, inT: 'cut', punches: [43.26], note: '"liberdade" — mar ao pôr do sol'},
	// ---------- VIRADA: O QUE É CONFIRMADO
	{id: 'T', from: 44.26, to: 48.6, src: 'v2/jason-night-v.jpg', focus0: [0.5, 0.35], s0: 1.2, s1: 1.25, inT: 'cut', look: 'calm', note: '"Mas calma... o detalhe" — pausa'},
	{id: 'U', from: 48.6, to: 54.3, src: 'img/cover-v.jpg', focus0: [0.5, 0.45], s0: 1.1, s1: 1.2, inT: 'glitch', look: 'title', note: '"não confirmadas pela Rockstar" — selo'},
	{id: 'V', from: 54.3, to: 58.3, src: 'v2/skyline-v.mp4', video: true, startFrom: 3.5, focus0: [0.5, 0.5], s0: 1.15, s1: 1.25, inT: 'zoom', look: 'calm', note: '"até que a empresa confirme"'},
	{id: 'W', from: 58.3, to: 62.45, src: 'v2/jason-neon.mp4', video: true, rate: 0.48, focus0: [0.6, 0.42], s0: 1.0, s1: 1.2, inT: 'whipL', punches: [60.46], note: '"não dá para afirmar... preso de verdade"'},
	{id: 'X', from: 62.45, to: 64.3, src: 'img/cover-v.jpg', focus0: [0.5, 0.45], s0: 1.0, s1: 1.4, inT: 'dip', look: 'title', note: '"E a resposta é essa" — riser'},
	{id: 'Y', from: 64.3, to: 67.0, src: 'v2/raul.mp4', video: true, rate: 0.55, focus0: [0.5, 0.45], s0: 1.1, s1: 1.2, inT: 'flash', look: 'dark', note: '"pode ter situações de captura" — veredito 1'},
	{id: 'Z1', from: 67.0, to: 69.78, src: 'img/keyart-v.jpg', focus0: [0.5, 0.45], s0: 1.15, s1: 1.25, inT: 'glitch', look: 'dark', note: '"ainda não há confirmação" — veredito 2'},
	{id: 'Z2', from: 69.78, to: 72.6, src: 'img/masked-v.jpg', focus0: [0.5, 0.45], s0: 1.1, s1: 1.2, inT: 'whipR', look: 'dark', note: '"sistema de prisão como esse"'},
	// ---------- ENQUETE / FECHAMENTO (volta ao plano de abertura para o loop)
	{id: 'AA', from: 72.6, to: 76.6, src: 'img/trailer2-v.jpg', focus0: [0.5, 0.4], s0: 1.1, s1: 1.2, inT: 'zoom', look: 'dark', note: '"me conta" — enquete'},
	{id: 'AB', from: 76.6, to: 82.6, src: 'img/jason-fence.jpg', focus0: [0.7, 0.42], s0: 1.15, s1: 1.0, inT: 'whipL', look: 'dark', note: '"prisão com fuga × atrapalha" — fecha no plano de abertura'},
];
