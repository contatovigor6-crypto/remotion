import {Composition} from 'remotion';
import {DURATION_IN_FRAMES, FPS, Gta6Short} from './Gta6Short';

export const RemotionRoot: React.FC = () => {
	return (
		<Composition
			id="Gta6Short"
			component={Gta6Short}
			durationInFrames={DURATION_IN_FRAMES}
			fps={FPS}
			width={1080}
			height={1920}
		/>
	);
};
