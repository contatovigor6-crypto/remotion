import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';

/** Glitch: separa os canais R/G/B e desloca faixas horizontais. amount=0 renderiza só uma cópia. */
export const RGBSplit: React.FC<{amount: number; children: React.ReactNode}> = ({amount, children}) => {
	const frame = useCurrentFrame();
	if (amount < 0.5) {
		return <AbsoluteFill>{children}</AbsoluteFill>;
	}
	const id = `rgb-${Math.round(amount * 10)}-${frame}`;
	const bands = Array.from({length: 5}, (_, i) => {
		const y = random(`y${frame}${i}`) * 100;
		const h = 2 + random(`h${frame}${i}`) * 8;
		const dx = (random(`x${frame}${i}`) - 0.5) * amount * 3;
		return {y, h, dx};
	});
	const channel = (m: string, dx: number) => (
		<AbsoluteFill style={{transform: `translateX(${dx}px)`, filter: `url(#${id}-${m})`, mixBlendMode: 'screen'}}>
			{children}
		</AbsoluteFill>
	);
	return (
		<AbsoluteFill style={{background: 'black', isolation: 'isolate'}}>
			<svg width={0} height={0} style={{position: 'absolute'}}>
				<filter id={`${id}-r`}>
					<feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
				</filter>
				<filter id={`${id}-g`}>
					<feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" />
				</filter>
				<filter id={`${id}-b`}>
					<feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" />
				</filter>
			</svg>
			{channel('r', -amount)}
			{channel('g', 0)}
			{channel('b', amount)}
			{bands.map((b, i) => (
				<AbsoluteFill
					key={i}
					style={{clipPath: `inset(${b.y}% 0 ${Math.max(0, 100 - b.y - b.h)}% 0)`, transform: `translateX(${b.dx}px)`}}
				>
					{children}
				</AbsoluteFill>
			))}
		</AbsoluteFill>
	);
};
