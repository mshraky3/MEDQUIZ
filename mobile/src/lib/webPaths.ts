import type { Href } from 'expo-router';

/**
 * The server sends website paths (notification CTAs such as "/quizs"). This maps
 * them onto the app's routes. Unknown paths return null so the caller can ignore
 * them rather than navigate somewhere that does not exist.
 */
export function appRouteForWebPath(webPath: string | null | undefined): Href | null {
  if (!webPath) return null;
  const clean = webPath.split('#')[0];
  const [pathname, query = ''] = clean.split('?');
  const p = pathname.replace(/^\/en(?=\/|$)/, '') || '/';

  if (p === '/' || p === '/quizs') return query.includes('view=custom') ? '/launcher' : '/(tabs)';
  if (p === '/analysis') return '/(tabs)/analysis';
  if (p === '/wrong-questions') return '/(tabs)/review';
  if (p === '/summaries') return '/(tabs)/summaries';
  const deck = /^\/summaries\/([^/]+)$/.exec(p);
  if (deck) return { pathname: '/summaries/[slug]', params: { slug: deck[1] } };
  if (p === '/subscribe' || p === '/payment/callback') return '/subscribe';
  if (p === '/account') return '/account';
  if (p === '/groups') return '/groups';
  if (p === '/contact') return '/contact';
  if (p === '/suggestions') return '/suggestions';
  if (p === '/faq') return '/faq';
  if (p === '/about') return '/about';
  if (p === '/terms') return '/terms';
  if (p === '/privacy') return '/privacy';
  if (p === '/refund-policy') return '/refund-policy';
  if (p === '/guides') return '/guides';
  const guide = /^\/guides\/([a-z0-9-]+)$/.exec(p);
  if (guide) return { pathname: '/guides/[slug]', params: { slug: guide[1] } };
  if (p === '/exams') return '/exams';
  if (/^\/exams\/[a-z0-9-]+(\/[a-z0-9-]+)?$/.test(p)) return p as Href;
  if (p === '/questions') return '/questions';
  const specialty = /^\/questions\/([a-z0-9-]+)$/.exec(p);
  if (specialty) return { pathname: '/questions/[specialty]', params: { specialty: specialty[1] } };
  const question = /^\/questions\/([a-z0-9-]+)\/([a-z0-9-]+)$/.exec(p);
  if (question) return { pathname: '/questions/[specialty]/[slug]', params: { specialty: question[1], slug: question[2] } };
  if (p === '/past-papers') return '/past-papers';
  const paper = /^\/past-papers\/([a-z0-9-]+)$/.exec(p);
  if (paper) return { pathname: '/past-papers/[slug]', params: { slug: paper[1] } };
  if (p === '/success-stories') return '/success-stories';
  return null;
}
