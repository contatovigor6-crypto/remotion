// Trilha original "Vice Pulse" (synthwave/retrô à la Miami 80s), gerada 100% em código.
// Sem samples de terceiros => livre de direitos para monetização.
import {writeFileSync} from 'node:fs';

const SR = 44100;
const BPM = 112;
const beat = 60 / BPM;
const DURATION = Number(process.argv[2] ?? 60);
const N = Math.floor(SR * DURATION);
const L = new Float32Array(N);
const R = new Float32Array(N);

const noteHz = (m) => 440 * Math.pow(2, (m - 69) / 12);
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;

const add = (t0, dur, fn, gl = 1, gr = 1) => {
	const s0 = Math.floor(t0 * SR);
	const len = Math.floor(dur * SR);
	for (let i = 0; i < len && s0 + i < N; i++) {
		const v = fn(i / SR);
		L[s0 + i] += v * gl;
		R[s0 + i] += v * gr;
	}
};

const kick = (t) =>
	add(t, 0.35, (x) => Math.sin(2 * Math.PI * (50 * x + 90 * (1 - Math.exp(-x * 30)) / 30)) * Math.exp(-x * 9) * 0.9);
const snare = (t) =>
	add(t, 0.25, (x) => (rnd() * 0.6 + Math.sin(2 * Math.PI * 190 * x) * 0.3) * Math.exp(-x * 16) * 0.45);
const hat = (t, open = false) =>
	add(t, open ? 0.18 : 0.05, (x) => rnd() * Math.exp(-x * (open ? 18 : 70)) * 0.12, 0.7, 1);
const saw = (f, x) => 2 * ((f * x) % 1) - 1;
const bass = (t, m, d) =>
	add(t, d, (x) => {
		const f = noteHz(m);
		const env = Math.min(1, x * 200) * Math.exp(-x * 3);
		return (saw(f, x) * 0.5 + Math.sin(2 * Math.PI * f * x) * 0.6) * env * 0.28;
	});
const pad = (t, notes, d) =>
	add(t, d, (x) => {
		const env = Math.min(1, x / 0.6) * Math.min(1, (d - x) / 0.5);
		let v = 0;
		for (const m of notes) {
			const f = noteHz(m);
			v += saw(f * 1.003, x) + saw(f * 0.997, x);
		}
		return v * env * 0.025;
	}, 0.9, 1.1);
const lead = (t, m, d) =>
	add(t, d, (x) => {
		const f = noteHz(m) * (1 + 0.004 * Math.sin(2 * Math.PI * 5.5 * x));
		const env = Math.min(1, x * 60) * Math.exp(-x * 2.2);
		return (Math.sign(Math.sin(2 * Math.PI * f * x)) * 0.35 + Math.sin(2 * Math.PI * f * x)) * env * 0.07;
	}, 1.1, 0.9);

// Am - F - C - G
const chords = [
	[57, 60, 64],
	[53, 57, 60],
	[48, 52, 55],
	[55, 59, 62],
];
const roots = [33, 29, 36, 31];
const bar = beat * 4;
const bars = Math.ceil(DURATION / bar);
const leadLine = [76, 74, 72, 74, 76, 79, 76, 72];

for (let b = 0; b < bars; b++) {
	const t = b * bar;
	const c = b % 4;
	pad(t, chords[c], bar);
	const intro = b < 2; // tensão: só pulso
	for (let s = 0; s < 8; s++) {
		const ts = t + s * (beat / 2);
		bass(ts, roots[c] + (s % 2 ? 12 : 0), beat / 2);
		if (!intro) hat(ts, s % 4 === 3);
	}
	if (!intro) {
		for (let k = 0; k < 4; k++) kick(t + k * beat);
		snare(t + beat);
		snare(t + 3 * beat);
	} else {
		kick(t);
		kick(t + 2 * beat);
	}
	if (b >= 4 && b % 2 === 0) {
		leadLine.forEach((m, i) => lead(t + i * (bar * 2) / 8, m, bar / 4));
	}
}

// master: soft clip + fade
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const out = Buffer.alloc(44 + N * 4);
out.write('RIFF', 0);
out.writeUInt32LE(36 + N * 4, 4);
out.write('WAVEfmt ', 8);
out.writeUInt32LE(16, 16);
out.writeUInt16LE(1, 20);
out.writeUInt16LE(2, 22);
out.writeUInt32LE(SR, 24);
out.writeUInt32LE(SR * 4, 28);
out.writeUInt16LE(4, 32);
out.writeUInt16LE(16, 34);
out.write('data', 36);
out.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
	const fade = Math.min(1, (N - i) / (SR * 1.5));
	const l = Math.tanh((L[i] / peak) * 1.4) * 0.8 * fade;
	const r = Math.tanh((R[i] / peak) * 1.4) * 0.8 * fade;
	out.writeInt16LE(Math.round(l * 32767), 44 + i * 4);
	out.writeInt16LE(Math.round(r * 32767), 46 + i * 4);
}
writeFileSync(process.argv[3] ?? 'public/music/vice-pulse.wav', out);
console.log('ok', DURATION, 's');
