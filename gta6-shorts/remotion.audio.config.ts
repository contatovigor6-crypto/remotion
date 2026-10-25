// Config para renders só de áudio (troca de trilha sem re-renderizar os quadros)
import {Config} from '@remotion/cli/config';

Config.setEntryPoint('src/index.ts');
Config.setCodec('wav');
Config.setConcurrency(4);
