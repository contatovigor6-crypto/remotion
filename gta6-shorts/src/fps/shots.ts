import type {Shot} from '../data/shots';

// "GTA 6 a 60 fps no PS5?" — plano de montagem. Relatos são marcados como relatos; comparação de fluidez é simulação.
export const SHOTS: Shot[] = [
	// ---------- GANCHO
	{id: 'A', from: 0, to: 1.88, src: 'v2/jason-neon.mp4', video: true, rate: 0.5, focus0: [0.6, 0.45], s0: 1.05, s1: 1.15, inT: 'cut', look: 'dark', note: '"GTA 6 vai rodar a" — título'},
	{id: 'B', from: 1.88, to: 4.32, src: 'v2/city-night.mp4', video: true, focus0: [0.5, 0.5], s0: 1.1, s1: 1.25, inT: 'zoom', look: 'dark', note: '"60 fps no PS5?" — contador de FPS'},
	{id: 'C', from: 4.32, to: 7.52, src: 'v2/lucia-car.mp4', video: true, rate: 0.48, focus0: [0.6, 0.45], s0: 1.0, s1: 1.12, inT: 'whipL', look: 'desat', punches: [5.38], note: '"pode decepcionar muita gente"'},
	{id: 'D', from: 7.52, to: 12.74, src: 'v2/skyline-v.mp4', video: true, focus0: [0.5, 0.5], s0: 1.0, s1: 1.15, inT: 'whipR', note: '"tem um PS5... jogar a 60 fps"'},
	{id: 'E1', from: 12.74, to: 15.54, src: 'v2/raul.mp4', video: true, rate: 0.52, focus0: [0.5, 0.45], s0: 1.0, s1: 1.15, inT: 'glitch', punches: [12.84], note: '"presta atenção"'},
	{id: 'E2', from: 15.54, to: 18.6, src: 'img/keyart-v.jpg', focus0: [0.5, 0.45], s0: 1.1, s1: 1.2, inT: 'whipL', look: 'dark', note: '"antes do lançamento" — data oficial'},
	// ---------- O RELATO
	{id: 'F', from: 18.6, to: 25.02, src: 'v2/city-night.mp4', video: true, startFrom: 2, focus0: [0.5, 0.5], s0: 1.2, s1: 1.3, inT: 'glitch', look: 'dark', note: '"relatos... 30 fps durante o desenvolvimento"'},
	{id: 'G', from: 25.02, to: 31.7, src: 'v2/green-car.mp4', video: true, focus0: [0.45, 0.5], s0: 1.05, s1: 1.15, inT: 'whipR', look: 'dark', note: '"modo de 60 fps ainda estava em aberto"'},
	{id: 'H', from: 31.7, to: 35.9, src: 'img/cover-v.jpg', focus0: [0.5, 0.45], s0: 1.1, s1: 1.2, inT: 'glitch', look: 'title', note: '"não era uma confirmação definitiva"'},
	{id: 'I', from: 35.9, to: 38.14, src: 'v2/storm.mp4', video: true, rate: 0.45, focus0: [0.5, 0.5], s0: 1.1, s1: 1.3, inT: 'dip', look: 'title', note: '"por que isso é tão complicado?" — título'},
	// ---------- POR QUE É DIFÍCIL
	{id: 'J', from: 38.14, to: 41.68, src: 'v2/ocean-sunset.mp4', video: true, rate: 0.28, focus0: [0.5, 0.5], s0: 1.0, s1: 1.15, inT: 'flash', note: '"gráficos bonitos"'},
	{id: 'K0', from: 41.68, to: 43.22, src: 'v2/city-night.mp4', video: true, startFrom: 4.5, focus0: [0.5, 0.5], s0: 1.15, s1: 1.25, inT: 'whipL', look: 'dark', note: '"precisa processar"'},
	{id: 'K1', from: 43.22, to: 43.96, src: 'img/traffic.jpg', focus0: [0.35, 0.6], focus1: [0.6, 0.6], s0: 1.05, s1: 1.1, inT: 'cut', note: '"trânsito"'},
	{id: 'K2', from: 43.96, to: 45.06, src: 'v3/club.mp4', video: true, rate: 0.9, focus0: [0.5, 0.45], s0: 1.0, s1: 1.08, inT: 'cut', note: '"multidões"'},
	{id: 'K3', from: 45.06, to: 45.9, src: 'v2/raul.mp4', video: true, startFrom: 0.5, focus0: [0.5, 0.45], s0: 1.0, s1: 1.08, inT: 'cut', note: '"física" — fumaça/ação'},
	{id: 'K4', from: 45.9, to: 47.34, src: 'v3/dimez-rec.mp4', video: true, rate: 0.7, focus0: [0.5, 0.4], s0: 1.0, s1: 1.08, inT: 'cut', note: '"inteligência artificial" — personagens'},
	{id: 'K5', from: 47.34, to: 49.74, src: 'v2/keys.mp4', video: true, rate: 0.42, focus0: [0.5, 0.5], s0: 1.0, s1: 1.15, inT: 'cut', note: '"mundo aberto cheio de detalhes"'},
	{id: 'L', from: 49.74, to: 51.98, src: 'v2/skyline-v.mp4', video: true, startFrom: 4, focus0: [0.5, 0.5], s0: 1.15, s1: 1.3, inT: 'zoom', look: 'dark', note: '"exige bastante do hardware" — medidor'},
	// ---------- A CONFUSÃO
	{id: 'M', from: 51.98, to: 55.34, src: 'v2/jason-night-v.jpg', focus0: [0.5, 0.35], s0: 1.2, s1: 1.25, inT: 'cut', look: 'calm', note: '"a parte que muita gente confunde" — pausa'},
	{id: 'N', from: 55.34, to: 61.14, src: 'img/boats-skyline.jpg', focus0: [0.35, 0.5], focus1: [0.55, 0.5], s0: 1.05, s1: 1.15, inT: 'whipL', look: 'dark', note: '"impressionante não significa 60 fps"'},
	{id: 'O', from: 61.14, to: 67.42, src: 'img/cover-v.jpg', focus0: [0.5, 0.45], s0: 1.1, s1: 1.2, inT: 'glitch', look: 'title', note: '"Rockstar não confirmou oficialmente" — status'},
	{id: 'P', from: 67.42, to: 71.56, src: 'img/masked-v.jpg', focus0: [0.5, 0.45], s0: 1.1, s1: 1.2, inT: 'whipR', look: 'dark', note: '"cuidado com vídeos dizendo garantido"'},
	// ---------- A ESCOLHA
	{id: 'Q', from: 71.56, to: 74.62, src: 'v2/jl-sun.mp4', video: true, rate: 0.4, focus0: [0.5, 0.4], s0: 1.0, s1: 1.12, inT: 'zoom', note: '"esperar anos por GTA 6"'},
	{id: 'R', from: 74.62, to: 87.04, src: 'v2/green-car.mp4', video: true, focus0: [0.45, 0.5], s0: 1.0, s1: 1.0, inT: 'whipL', look: 'dark', note: '"gráficos × fluidez" — comparação (simulação)'},
	// ---------- ENQUETE / INSCRIÇÃO
	{id: 'T', from: 87.04, to: 94.54, src: 'v2/jason-neon.mp4', video: true, rate: 0.27, focus0: [0.6, 0.45], s0: 1.1, s1: 1.2, inT: 'flash', look: 'dark', note: '"time 30 ou time 60?" — enquete'},
	{id: 'U', from: 94.54, to: 100.4, src: 'v2/skyline-v.mp4', video: true, focus0: [0.5, 0.5], s0: 1.2, s1: 1.1, inT: 'zoom', look: 'title', note: '"se inscreve no ZoneGTAVI" — logo'},
];
