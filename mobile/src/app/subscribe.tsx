import { PLAY_BUILD } from '@/config';
import PlayAccessScreen from '@/features/subscribe/PlayAccessScreen';
import SubscribeScreen from '@/features/subscribe/SubscribeScreen';

// The Google Play build is sign-in only: no plans or prices (docs/PLAY-LAUNCH-CHECKLIST.md).
export default PLAY_BUILD ? PlayAccessScreen : SubscribeScreen;
