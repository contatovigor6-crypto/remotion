import depois from '../edit/depois-timeline.json';
import {ZoneConfig, ZoneData} from './ZoneStyle';

// Configuração de cada vídeo no Estilo ZoneGTA6. Para um vídeo novo: gerar a linha do
// tempo a partir da narração (scripts/*_timeline.py) e preencher gancho e virada.
const d = depois as unknown as ZoneData & {segments: Array<{flashes?: Array<[string, number]>; lineAt?: number; subAt?: number}>};

export const depoisCfg: ZoneConfig = {
	data: d,
	vo: 'depois-marcio.mp3',
	music: 'trilha-depois-motion.mp3',
	days: 3,
	hook: {flashes: d.segments[0].flashes ?? [], kicker: 'FALTAM APENAS', big: '3', small: 'DIAS', line: 'PARA O LANÇAMENTO DE GTA VI', lineAt: d.segments[0].lineAt ?? 50},
	hook2: {lines: ['MAS EXISTE', 'UMA PERGUNTA'], sub: 'QUE MUITA GENTE AINDA NÃO ESTÁ FAZENDO', subAt: d.segments[1].subAt ?? 48},
	keywords: ['strauss', 'investidores', 'expectativas', 'futuro', 'franquia', 'atualizacoes', 'conteudos', 'eventos', 'comunidade', 'fim', 'universo', 'relevante', 'historico', 'planos', 'estreia', 'novidades', 'expansoes', 'incognita', 'clara', 'capitulo', 'franquias', 'nova', 'preparado', 'depois', 'jogadores', 'pista', 'detalhe', 'pergunta'],
};
