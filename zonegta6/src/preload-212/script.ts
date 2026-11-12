import type {Word} from '../brand/brand';

// Roteiro + tempos (segundos). Tempos ESTIMADOS até a narração do ElevenLabs (voz "Marcio")
// ser gerada; depois são substituídos pelos tempos reais da transcrição.
// Palavras com * são destacadas na legenda.
export const sentences: {start: number; end: number; text: string}[] = [
	{start: 0.0, end: 2.2, text: 'Seu console tá prestes a *sofrer.'},
	{start: 2.3, end: 5.6, text: 'O pré-load de GTA 6 já abriu... e o jogo pede até *212 *gigas.'},
	{start: 5.9, end: 8.6, text: 'Isso. *Duzentos. *E. *Doze.'},
	{start: 8.8, end: 13.4, text: 'Num PS5 de 825 gigas, é quase *um *terço do espaço que sobra pra você.'},
	{start: 13.6, end: 17.0, text: 'Com internet de 100 mega, são quase *cinco *horas de download.'},
	{start: 17.2, end: 21.6, text: 'Dá tempo de ver dois filmes, tomar banho... e ainda *brigar com o *roteador.'},
	{start: 21.8, end: 24.6, text: 'Quem comprou a versão digital já pode baixar desde o *dia *10.'},
	{start: 24.7, end: 27.0, text: 'O jogo destrava *dia *19 de novembro.'},
	{start: 27.3, end: 33.6, text: 'E ninguém tá ligando pro tamanho: Sony e Microsoft dizem que é o jogo *mais *encomendado da história das lojas delas.'},
	{start: 33.9, end: 38.6, text: 'Então abre o armazenamento, olha pros seus outros jogos... e escolhe quem vai pro *cemitério.'},
	{start: 38.8, end: 40.8, text: 'Comenta aí qual você vai *apagar.'},
	{start: 41.0, end: 44.0, text: 'ZoneGTA6. A gente se vê dia 19.'},
	{start: 44.8, end: 46.6, text: 'Se o download *terminar.'},
];

export const TOTAL_SECONDS = 48;

// Distribui as palavras dentro de cada frase proporcionalmente ao tamanho.
export const words: Word[] = sentences.flatMap((s) => {
	const toks = s.text.split(/\s+/);
	const weights = toks.map((t) => t.replace(/[*.,:]/g, '').length + 2);
	const total = weights.reduce((a, b) => a + b, 0);
	let acc = s.start;
	return toks.map((t, i) => {
		const d = ((s.end - s.start) * weights[i]) / total;
		const w = {text: t.replace('*', ''), start: acc, end: acc + d, hl: t.startsWith('*')};
		acc += d;
		return w;
	});
});
