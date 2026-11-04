import type {Shot} from '../data/shots';

// Short "GTA 6 vai exigir até 212 GB" — imagem oficial NOVA do Newswire (03/11/2026) em vários enquadramentos,
// clipes oficiais que não aparecem nos últimos Shorts e fotos oficiais nunca usadas em Shorts.
const V = (id: string, from: number, to: number, src: string, rate: number, fx: number, fy: number, inT: Shot['inT'], look: Shot['look'], note: string, punches: number[] = [], startFrom = 0): Shot => ({id, from, to, src, video: true, rate, startFrom, focus0: [fx, fy], s0: 1.05, s1: 1.12, inT, look, punches, note});
const P = (id: string, from: number, to: number, src: string, fx: number, fy: number, s0: number, s1: number, inT: Shot['inT'], look: Shot['look'], note: string, punches: number[] = []): Shot => ({id, from, to, src, live: true, focus0: [fx, fy], s0, s1, inT, look, punches, note});

export const SHOTS: Shot[] = [
	// ---------- GANCHO
	P('A', 0, 2.5, 'v15/hero-towers.jpg', 0.5, 0.4, 1.18, 1.05, 'cut', 'dark', '"212 GB" — Vice City (Newswire)', [0.8]),
	V('B', 2.5, 4.9, 'v2/keys.mp4', 0.42, 0.5, 0.5, 'whipL', 'dark', '"o espaço que GTA 6 pode exigir"'),
	P('C', 4.9, 6.4, 'v15/hero-bridge.jpg', 0.5, 0.5, 1.05, 1.16, 'glitch', 'dark', '"no seu console"'),
	V('D', 6.4, 8.6, 'v5/factory.mp4', 0.41, 0.5, 0.5, 'whipR', 'dark', '"por que um único jogo"'),
	P('E', 8.6, 10.5, 'v5/ocean-view.jpg', 0.5, 0.4, 1.08, 1.2, 'zoom', 'dark', '"tanto armazenamento?"', [9.2]),
	V('F', 10.5, 12.9, 'v5/jungle.mp4', 0.42, 0.5, 0.5, 'whipL', 'dark', '"esse tamanho revela alguma coisa"'),
	P('G', 12.9, 15.4, 'v15/hero-beach.jpg', 0.5, 0.55, 1.05, 1.18, 'dip', 'dark', '"o que vamos encontrar em Leonida?"', [14.4]),
	// ---------- CONFIRMAÇÃO OFICIAL
	P('H', 15.4, 19.0, 'v15/hero.jpg', 0.72, 0.4, 1.0, 1.12, 'flash', 'dark', '"A própria Rockstar confirmou" — imagem do anúncio no Newswire'),
	P('I', 19.0, 22.9, 'v5/speedboats.jpg', 0.5, 0.5, 1.05, 1.18, 'whipR', 'dark', '"até 212 GB, dependendo do dispositivo"', [19.0]),
	V('J', 22.9, 25.3, 'v2/robbery.mp4', 0.4, 0.5, 0.45, 'glitch', 'dark', '"atenção, isso não é mais um rumor"'),
	V('K', 25.3, 26.7, 'v3/brian.mp4', 0.72, 0.5, 0.45, 'flash', 'dark', '"da internet"', [25.4]),
	P('L', 26.7, 29.7, 'v5/kayak.jpg', 0.45, 0.45, 1.05, 1.16, 'whipL', 'dark', '"existe um detalhe interessante"'),
	// ---------- O MUNDO
	P('M', 29.7, 33.7, 'v10/canyon.jpg', 0.55, 0.5, 1.2, 1.05, 'zoom', 'dark', '"um mundo enorme"', [32.6]),
	P('N', 33.7, 34.6, 'v15/hero-downtown.jpg', 0.5, 0.35, 1.05, 1.15, 'cut', 'dark', '"cidades"'),
	P('O', 34.6, 35.7, 'v10/airboat-swamp.jpg', 0.55, 0.5, 1.05, 1.15, 'cut', 'dark', '"áreas rurais"'),
	V('P', 35.7, 37.0, 'v3/dimez-rec.mp4', 0.77, 0.5, 0.45, 'cut', 'dark', '"ambientes internos"'),
	V('Q', 37.0, 38.0, 'v2/lucia-car.mp4', 1, 0.5, 0.5, 'cut', 'dark', '"veículos"'),
	V('R', 38.0, 38.9, 'v3/boobie-boat.mp4', 1, 0.5, 0.45, 'cut', 'dark', '"personagens"'),
	P('S', 38.9, 39.7, 'v10/underwater.jpg', 0.5, 0.5, 1.05, 1.15, 'cut', 'dark', '"animais"'),
	P('T', 39.7, 40.4, 'v10/radio-country.jpg', 0.42, 0.45, 1.05, 1.15, 'cut', 'dark', '"músicas"'),
	P('U', 40.4, 42.5, 'v5/yacht.jpg', 0.5, 0.5, 1.05, 1.16, 'whipR', 'dark', '"muitos elementos diferentes"'),
	// ---------- ARQUIVOS
	P('W', 42.5, 46.4, 'v10/car-teal.jpg', 0.4, 0.5, 1.05, 1.2, 'whipL', 'dark', '"texturas, modelos" — detalhe do carro'),
	P('X', 46.4, 50.4, 'v10/car-cream.jpg', 0.55, 0.5, 1.2, 1.06, 'whipR', 'dark', '"áudio, animações... armazenados no console"'),
	// ---------- FATOS × TEORIAS
	P('Y', 50.4, 54.1, 'v5/ganado-road.jpg', 0.5, 0.5, 1.05, 1.18, 'flash', 'dark', '"separar os fatos das teorias"', [52.6]),
	P('Z', 54.1, 59.8, 'v10/buggy-front.jpg', 0.5, 0.5, 1.05, 1.2, 'whipL', 'dark', '"a Rockstar ainda não explicou"'),
	P('AA', 59.8, 63.2, 'v15/hero.jpg', 0.16, 0.55, 1.4, 1.28, 'zoom', 'dark', '"não dá para afirmar"'),
	P('AB', 63.2, 66.9, 'v15/hero-beach.jpg', 0.5, 0.75, 1.3, 1.15, 'whipR', 'dark', '"mais missões, mais cidades ou mais conteúdo"'),
	// ---------- DATA OFICIAL
	P('AC', 66.9, 71.4, 'v15/hero-towers.jpg', 0.5, 0.2, 1.3, 1.4, 'flash', 'dark', '"o número é oficial"'),
	P('AD', 71.4, 76.9, 'v15/hero-bridge.jpg', 0.5, 0.35, 1.25, 1.1, 'whipL', 'dark', '"pré-download em 10 de novembro... 19 de novembro"'),
	// ---------- PERGUNTA / CTA
	P('AE', 76.9, 86.0, 'v15/hero.jpg', 0.5, 0.5, 1.0, 1.14, 'zoom', 'dark', '"liberar mais de 200 GB... limpeza?"'),
	P('AF', 86.0, 93.6, 'v15/hero-downtown.jpg', 0.5, 0.4, 1.15, 1.05, 'cut', 'title', '"Comenta e segue o ZoneGTAVI" — encerramento'),
];
