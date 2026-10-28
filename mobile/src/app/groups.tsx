import { PLAY_BUILD } from '@/config';
import GroupsScreen from '@/features/subscribe/GroupsScreen';
import PlayAccessScreen from '@/features/subscribe/PlayAccessScreen';

// Group plans are a purchase: the Google Play build shows the neutral screen instead.
export default PLAY_BUILD ? PlayAccessScreen : GroupsScreen;
