import {Composition} from 'remotion';
import {Preload212, preload212Duration} from './preload-212/Preload212';

export const Root: React.FC = () => {
	return (
		<Composition
			id="Preload212"
			component={Preload212}
			width={1080}
			height={1920}
			fps={30}
			durationInFrames={preload212Duration}
			defaultProps={{narrationSrc: null as string | null}}
		/>
	);
};
