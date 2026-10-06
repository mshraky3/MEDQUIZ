import appCopy from './appCopy';
import commonCopy from './copy/common.js';
import { useCopy } from './LanguageContext';

export { LanguageProvider, useLang, useCopy, LANGUAGES, dirFor, normalizeLang, detectDeviceLang } from './LanguageContext';
export { formatDate, formatDateTime, formatNumber } from '@/lib/format';

/** Site-wide shell copy (nav, banners, shared error states). */
export const useCommon = () => useCopy(commonCopy);
export { commonCopy };

/** App-only strings (tab labels, the more menu). */
export const useApp = () => useCopy(appCopy);
export { appCopy };
