// Configuração das legendas do Short "1 hora parado"
// Palavras destacadas (seletivo: o que carrega o sentido da frase)
export const KEYWORDS = new Set([
	'parado', 'parado,', 'gta', '6', '6.', 'hora', 'hora,', 'testes', 'curiosos', 'pula', 'final', 'experimento.',
	'jason', 'vice', 'city,', 'andar,', 'dirigir', 'nada.', 'nada', 'cidade', 'inteira', 'carros', 'pedestres',
	'inesperadas', 'interessante.', 'mudou,', 'personagens', 'normalmente?', 'vivo,', 'testar', 'desafio.',
	'nenhum', 'botão,', 'realismo', 'coragem”', '“eu', 'teria', 'chegar,', 'verdade.',
]);

// Trechos em que um título grande já mostra a fala (evita duplicar texto)
export const HIDDEN: [number, number][] = [
	[2.1, 2.8],
	[38.2, 41.3],
	[44.88, 45.7],
	[58.7, 61.1],
];

