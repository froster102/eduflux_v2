import { envVariables } from '@shared/env/envVariables';

export class LiveKitConfig {
  static readonly LIVEKIT_API_KEY = envVariables.LIVEKIT_API_KEY;
  static readonly LIVEKIT_API_SECRET = envVariables.LIVEKIT_API_SECRET;
  static readonly LIVEKIT_HOST = envVariables.LIVEKIT_HOST;
}
