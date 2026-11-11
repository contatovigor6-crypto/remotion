// Clipes e imagens reais por trecho do roteiro.
// Coloque o arquivo em public/clips/ e preencha `file` (ex.: 'trailer1.mp4' ou 'capa.jpg').
// Use só material que você tem direito de usar (gravação própria, press kit oficial,
// ou clipe com licença/autorização do criador) e preencha `credit` com a fonte.
// Vídeo entra sem som (a narração manda) e `startAt` é o segundo do clipe onde começar.
// Com `file: null` o trecho usa o fundo animado.
export type MediaSlot = {
	from: number;
	to: number;
	file: string | null;
	startAt: number;
	credit: string | null;
};

export const MEDIA: MediaSlot[] = [
	{from: 0, to: 3.4, file: null, startAt: 0, credit: null}, // gancho: cidade/gameplay
	{from: 3.4, to: 7.1, file: null, startAt: 0, credit: null}, // "gastar seu dinheiro"
	{from: 7.1, to: 12.2, file: null, startAt: 0, credit: null}, // "fica até o final"
	{from: 12.2, to: 15.5, file: null, startAt: 0, credit: null}, // "Rockstar confirmou"
	{from: 15.5, to: 22.1, file: null, startAt: 0, credit: null}, // caixa sem disco
	{from: 22.1, to: 29.15, file: null, startAt: 0, credit: null}, // Blu-ray / código
	{from: 29.15, to: 36.0, file: null, startAt: 0, credit: null}, // baixar pela internet
	{from: 37.0, to: 44.6, file: null, startAt: 0, credit: null}, // data de lançamento
	{from: 44.6, to: 50.55, file: null, startAt: 0, credit: null}, // enquete
	{from: 50.55, to: 58.8, file: null, startAt: 0, credit: null}, // CTA
];
