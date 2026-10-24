import '@fontsource/anton/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/800.css';
import {continueRender, delayRender} from 'remotion';

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const VOICE_DURATION = 78.262;
export const DURATION_S = 78.9;

/** segundos -> frame */
export const f = (s: number) => Math.round(s * FPS);

// Paleta inspirada na identidade oficial de GTA VI (pôr do sol rosa/laranja/roxo)
export const C = {
	pink: '#FF3E9A',
	orange: '#FF9A3C',
	yellow: '#FFD84A',
	purple: '#7B3CFF',
	cyan: '#38E1FF',
	red: '#FF2D3D',
	white: '#FFFFFF',
	ink: '#0B0612',
};
export const GRAD = `linear-gradient(180deg, ${C.yellow} 0%, ${C.orange} 45%, ${C.pink} 100%)`;

export const DISPLAY = 'Anton, Impact, sans-serif';
export const UI = 'Inter, sans-serif';

// Garante que as fontes estão carregadas antes de capturar os quadros
const handle = delayRender('fonts');
Promise.all([
	document.fonts.load('100px Anton'),
	document.fonts.load('600 40px Inter'),
	document.fonts.load('800 40px Inter'),
]).then(() => continueRender(handle));

// Áreas seguras do YouTube Shorts (1080x1920): topo ~180px, base ~480px, coluna direita ~120px
export const SAFE = {top: 190, bottom: 1440, left: 70, right: 960};
