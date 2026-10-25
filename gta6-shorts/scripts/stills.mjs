// Renderiza stills de checagem: node scripts/stills.mjs 0.5 4.05 ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
const browserExecutable = process.env.BROWSER || null;
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: process.env.COMP || 'GTA6Parado', browserExecutable});
for (const t of process.argv.slice(2)) {
	const frame = Math.round(Number(t) * 30);
	await renderStill({serveUrl, composition, frame, output: `.qc/${process.env.COMP || 'GTA6Parado'}-${t}.jpg`, imageFormat: 'jpeg', scale: 0.5, browserExecutable});
	console.log('ok', t);
}
