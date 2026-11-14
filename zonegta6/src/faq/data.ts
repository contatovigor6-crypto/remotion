import {Status} from '../theme';

// Conteúdo do vídeo "7 perguntas sobre GTA 6" (pesquisado em 14/11/2026).
// Os tempos de cada bloco ficam em timing.json, gerado por scripts/faq_timing.py.
export type FaqBlock = {
	id: string;
	question: string; // pergunta na tela
	answer: string; // resposta curta, em destaque
	detail: string; // texto de apoio, palavra a palavra
	status: Status | null;
	source: string;
	media: string[]; // capturas oficiais (public/media/, fora do git)
};

export const blocks: FaqBlock[] = [
	{
		id: 'hook',
		question: 'Faltam 5 dias',
		answer: '7 perguntas',
		detail: 'que todo mundo está fazendo, com resposta.',
		status: null,
		source: '',
		media: ['jason_and_lucia_02.jpg', 'vice_city_17.jpg', 'launch_trailer.jpg'],
	},
	{
		id: 'hora',
		question: 'Que horas libera?',
		answer: 'MEIA-NOITE',
		detail: 'Meia-noite no horário local. No Brasil, as lojas indicam 0h de 19/11 (Brasília).',
		status: 'CONFIRMADO',
		source: 'ROCKSTAR · HORÁRIO BR: LOJAS VIA IMPRENSA',
		media: ['vice_city_27.jpg', 'vice_city_22.jpg', 'port_gellhorn_01.jpg'],
	},
	{
		id: 'preco',
		question: 'Quanto custa?',
		answer: 'R$ 449,90',
		detail: 'Edição padrão. A Ultimate sai por R$ 549,90, no PS5 e no Xbox.',
		status: 'REPORTADO',
		source: 'LOJAS PLAYSTATION E XBOX · VIA IMPRENSA',
		media: ['vice_city_24.jpg', 'vice_city_10.jpg', 'vice_city_14.jpg'],
	},
	{
		id: 'dublagem',
		question: 'Vai ser dublado?',
		answer: 'NÃO',
		detail: 'Legendas e menus em português. Áudio só em inglês.',
		status: 'REPORTADO',
		source: 'PÁGINA DA LOJA XBOX · VIA IMPRENSA',
		media: ['jason_and_lucia_06.jpg', 'jason_and_lucia_03.jpg', 'vice_city_09.jpg'],
	},
	{
		id: 'plataformas',
		question: 'Roda no PS4 ou Xbox One?',
		answer: 'PS4: NÃO',
		detail: 'Xbox One: só pela nuvem, com o Xbox Cloud Gaming.',
		status: 'CONFIRMADO',
		source: 'ROCKSTAR · XBOX WIRE',
		media: ['vice_city_15.jpg', 'leonida_keys_02.jpg', 'vice_city_03.jpg'],
	},
	{
		id: 'pc',
		question: 'E no PC?',
		answer: 'NÃO ANUNCIADO',
		detail: 'Uma reportagem fala em início de 2027, sem confirmação da Rockstar.',
		status: 'REPORTADO',
		source: 'GAMESBEAT (FONTES ANÔNIMAS)',
		media: ['jason_and_lucia_07.jpg', 'jason_and_lucia_12.jpg', 'port_gellhorn_03.jpg'],
	},
	{
		id: 'online',
		question: 'Tem modo online?',
		answer: 'SINGLE-PLAYER',
		detail: 'É assim que a descrição oficial define o jogo. Um novo GTA Online não foi anunciado.',
		status: 'CONFIRMADO',
		source: 'XBOX WIRE',
		media: ['vice_city_05.jpg', 'vice_city_13.jpg', 'vice_city_04.jpg'],
	},
	{
		id: 'download',
		question: 'Já dá pra baixar?',
		answer: 'SIM',
		detail: 'Pré-download liberado para quem reservou a versão digital. Separe mais de 200 GB.',
		status: 'CONFIRMADO',
		source: 'ROCKSTAR (PRÉ-LOAD)',
		media: ['vice_city_11.jpg', 'mount_kalaga_national_park_02.jpg', 'grassrivers_02.jpg'],
	},
	{
		id: 'cta',
		question: 'Qual dúvida ficou faltando?',
		answer: '',
		detail: 'Comenta aqui que a gente responde no próximo vídeo.',
		status: null,
		source: '',
		media: ['hero.jpg', 'jason_and_lucia_11.jpg', 'vice_city_01.jpg'],
	},
];
