import {Config} from '@remotion/cli/config';
Config.setVideoImageFormat('jpeg');
Config.setEntryPoint('src/index.ts');
Config.setChromiumOpenGlRenderer('swangle');
Config.setBrowserExecutable('/opt/pw-browsers/chromium');
