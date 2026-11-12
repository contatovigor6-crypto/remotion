import {Composition} from 'remotion';
import {Preload212, preload212Duration} from './preload-212/Preload212';
import {XboxOne3D, xboxOne3DDuration} from './xbox-one-3d/XboxOne3D';
import {XboxOneCloud, xboxOneCloudDuration} from './xbox-one-cloud/XboxOneCloud';

export const Root: React.FC = () => {
	return (
		<>
			<Composition id="XboxOne3D" component={XboxOne3D} width={1080} height={1920} fps={30} durationInFrames={xboxOne3DDuration} defaultProps={{narrationSrc: 'voice/xbox-one-cloud.mp3' as string | null, logoSrc: null as string | null}} />
			<Composition id="XboxOneCloud" component={XboxOneCloud} width={1080} height={1920} fps={30} durationInFrames={xboxOneCloudDuration} defaultProps={{narrationSrc: 'voice/xbox-one-cloud.mp3' as string | null}} />
			<Composition id="Preload212" component={Preload212} width={1080} height={1920} fps={30} durationInFrames={preload212Duration} defaultProps={{narrationSrc: null as string | null}} />
		</>
	);
};
