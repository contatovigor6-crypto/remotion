import type {Word} from '../brand/brand';
import raw from './narration-captions.json';

// Tempos reais da narração (whisper.cpp, timestamps por token).
type Tok = {text: string; startMs: number; endMs: number};
const toks = raw as Tok[];

const HL = new Set(['xbox', 'one', 'real', 'brincadeira', 'cloud', 'gaming', '19', 'vice', 'city', 'jason', 'lucia', 'calma', 'importante', 'nativa', 'nuvem', 'mais', 'separadamente', 'console', 'migrou', 'zone']);

export const words: Word[] = [];
for (const t of toks) {
	const isPunct = /^[.,!?;:]+$/.test(t.text.trim());
	const startsWord = t.text.startsWith(' ') && !isPunct;
	if (startsWord || words.length === 0) {
		words.push({text: t.text.trim(), start: t.startMs / 1000, end: t.endMs / 1000});
	} else {
		const w = words[words.length - 1];
		w.text += t.text.trim();
		w.end = Math.max(w.end, t.endMs / 1000);
	}
}
for (let i = 0; i < words.length; i++) {
	const next = words[i + 1];
	if (next) words[i].end = Math.min(Math.max(words[i].end, words[i].start + 0.12), next.start);
	words[i].hl = HL.has(words[i].text.toLowerCase().replace(/[.,!?]/g, ''));
}
// "Zone GTA 6" => marca
for (let i = 0; i < words.length - 2; i++) {
	if (words[i].text === 'Zone' && words[i + 1].text === 'GTA') {
		words[i].text = 'ZoneGTA6';
		words[i].end = words[i + 2].end;
		words.splice(i + 1, 2);
	}
}

export type Sentence = {start: number; end: number; text: string};
export const sentences: Sentence[] = [];
{
	let cur: Word[] = [];
	for (const w of words) {
		cur.push(w);
		if (/[.!?]$/.test(w.text)) {
			sentences.push({start: cur[0].start, end: cur[cur.length - 1].end, text: cur.map((c) => c.text).join(' ')});
			cur = [];
		}
	}
	if (cur.length) sentences.push({start: cur[0].start, end: cur[cur.length - 1].end, text: cur.map((c) => c.text).join(' ')});
}

export const wordAt = (sentence: number, contains: string) => {
	const s = sentences[sentence];
	const w = words.find((w) => w.start >= s.start - 0.01 && w.start <= s.end && w.text.toLowerCase().includes(contains.toLowerCase()));
	return w ? w.start : s.start;
};
