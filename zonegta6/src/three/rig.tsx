import {useThree} from '@react-three/fiber';
import {useLayoutEffect} from 'react';
import {Easing, interpolate} from 'remotion';
import * as THREE from 'three';

export type V3 = [number, number, number];

// Posiciona a câmera a cada frame (determinístico) + tremida opcional.
export const Rig: React.FC<{pos: V3; look: V3; fov?: number; shake?: number; frame: number; roll?: number}> = ({pos, look, fov = 40, shake = 0, frame, roll = 0}) => {
	const {camera} = useThree();
	useLayoutEffect(() => {
		const cam = camera as THREE.PerspectiveCamera;
		const sx = shake ? Math.sin(frame * 2.3) * shake : 0;
		const sy = shake ? Math.cos(frame * 3.7) * shake : 0;
		cam.position.set(pos[0] + sx, pos[1] + sy, pos[2]);
		cam.lookAt(look[0], look[1], look[2]);
		if (roll) cam.rotateZ(roll);
		if (cam.fov !== fov) {
			cam.fov = fov;
			cam.updateProjectionMatrix();
		}
	});
	return null;
};

// Interpola um vetor 3D por keyframes [frame, valor].
export const path = (frame: number, keys: [number, V3][], ease = Easing.inOut(Easing.cubic)): V3 => {
	const fs = keys.map((k) => k[0]);
	return [0, 1, 2].map((i) => interpolate(frame, fs, keys.map((k) => k[1][i]), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease})) as V3;
};
