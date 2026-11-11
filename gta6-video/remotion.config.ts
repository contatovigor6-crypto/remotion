import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setCodec('h264');
Config.setCrf(18);
// WebGL para as cenas 3D (Three.js) no Chromium headless
Config.setChromiumOpenGlRenderer('swangle');
