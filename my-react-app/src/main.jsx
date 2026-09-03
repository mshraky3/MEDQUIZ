import { StrictMode, Suspense, lazy } from 'react'
// Self-hosted via @fontsource — each weight file declares @font-face rules
// split by unicode-range (latin / latin-ext / arabic / ...) with
// font-display: swap already built in, so a visitor only downloads the
// glyph ranges their own text actually uses. Before this, --font-family-primary
// named 'Inter' but nothing on the page ever requested it — every visitor
// silently rendered in the OS's system-ui fallback instead.
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
import '@fontsource/inter/900.css'
import '@fontsource/cairo/400.css'
import '@fontsource/cairo/500.css'
import '@fontsource/cairo/600.css'
import '@fontsource/cairo/700.css'
import '@fontsource/cairo/800.css'
import '@fontsource/cairo/900.css'
import './index.css'
import App from './App.jsx';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Shell components are part of every route, so they stay eagerly bundled with
// the landing chunk. App (the "/" landing route) is also eager because it is
// the LCP route — splitting it would only add a round-trip before first paint.
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import NotFound from './components/common/NotFound.jsx';
import Layout from './components/common/Layout.jsx';
import RequireAuth from './components/common/RequireAuth.jsx';
import CookieConsent from './components/common/CookieConsent.jsx';
import Spinner from './components/common/Spinner.jsx';
import LocaleSync from './components/common/LocaleSync.jsx';

// Every other page is code-split: the landing page no longer downloads the
// admin panel, quiz engine, summaries, guides, etc. it never uses. Each lazy()
// becomes its own chunk that loads only when its route is visited.
const Login = lazy(() => import('./components/login/Login'));
const ADD = lazy(() => import('./components/ADD/ADD.jsx'));
const QUIZS = lazy(() => import('./components/quizs/QUIZS.jsx'));
const QUIZ = lazy(() => import('./components/Quiz/QUIZ.jsx'));
const ADDQ = lazy(() => import('./components/ADD/ADDQ.jsx'));
const Analysis = lazy(() => import('./components/analysis/Analysis.jsx'));
const WrongQuestions = lazy(() => import('./components/analysis/WrongQuestions.jsx'));
const Admin = lazy(() => import('./components/ADD/Admin.jsx'));
const Growth = lazy(() => import('./components/ADD/Growth.jsx'));
const Behavior = lazy(() => import('./components/ADD/Behavior.jsx'));
const AdminBroadcast = lazy(() => import('./components/ADD/AdminBroadcast.jsx'));
const Bank = lazy(() => import('./components/ADD/Bank.jsx'));
const Accounting = lazy(() => import('./components/ADD/Accounting.jsx'));
const Signup = lazy(() => import('./components/signup/Signup.jsx'));
const Contact = lazy(() => import('./components/contact/Contact.jsx'));
const Privacy = lazy(() => import('./components/legal/Privacy.jsx'));
const Terms = lazy(() => import('./components/legal/Terms.jsx'));
const RefundPolicy = lazy(() => import('./components/legal/RefundPolicy.jsx'));
const About = lazy(() => import('./components/legal/About.jsx'));
const FAQ = lazy(() => import('./components/legal/FAQ.jsx'));
const Suggestions = lazy(() => import('./components/suggestions/Suggestions.jsx'));
const GuidesHub = lazy(() => import('./components/guides/GuidesHub.jsx'));
const HowToUseQuestionBankGuide = lazy(() => import('./components/guides/HowToUseQuestionBankGuide.jsx'));
const SmleStudyPlanGuide = lazy(() => import('./components/guides/SmleStudyPlanGuide.jsx'));
const WrongQuestionsMethodGuide = lazy(() => import('./components/guides/WrongQuestionsMethodGuide.jsx'));
const SmleVsPrometricGuide = lazy(() => import('./components/guides/SmleVsPrometricGuide.jsx'));
const SmleHighYieldTopicsGuide = lazy(() => import('./components/guides/SmleHighYieldTopicsGuide.jsx'));
// The exam logistics section (/exams). One component serves all thirteen
// routes — see components/exams/ExamPage.jsx — so this is one chunk, not
// thirteen, and the copy it renders is the copy the prerender renders.
const ExamPage = lazy(() => import('./components/exams/ExamPage.jsx'));
// The public question library. Its data file is ~415 KB, so the components
// pull it in with their own dynamic import (see usePublicQuestions.js) — these
// three lazy() calls only split the UI.
const QuestionsHub = lazy(() => import('./components/questions/QuestionsHub.jsx'));
const QuestionsSpecialty = lazy(() => import('./components/questions/QuestionsSpecialty.jsx'));
const QuestionPage = lazy(() => import('./components/questions/QuestionPage.jsx'));
// Renders an honest empty state (and noindex) until real stories are
// exported — see components/successStories/SuccessStories.jsx.
const SuccessStories = lazy(() => import('./components/successStories/SuccessStories.jsx'));
const PastPapersHub = lazy(() => import('./components/pastPapers/PastPapersHub.jsx'));
const PastPaperCollection = lazy(() => import('./components/pastPapers/PastPaperCollection.jsx'));
const TempLinks = lazy(() => import('./components/ADD/TempLinks.jsx'));
const QuestionReports = lazy(() => import('./components/ADD/QuestionReports.jsx'));
const SuccessStoriesAdmin = lazy(() => import('./components/ADD/SuccessStoriesAdmin.jsx'));
const ForgotPassword = lazy(() => import('./components/login/ForgotPassword'));
const SummariesPage = lazy(() => import('./components/summaries/SummariesPage.jsx'));
const Subscribe = lazy(() => import('./components/subscribe/Subscribe.jsx'));
const PaymentCallback = lazy(() => import('./components/subscribe/PaymentCallback.jsx'));
const GroupsPage = lazy(() => import('./components/groups/GroupsPage.jsx'));
const AccountPage = lazy(() => import('./components/account/AccountPage.jsx'));
// Only ever used inside admin(...) below, whose children are all already
// lazy — but AdminGate itself imports utils/adminApi.js, a static `import
// axios from 'axios'`. Left eager, that shipped the 34KB axios bundle to
// every visitor (including anonymous landing-page ones) even though nothing
// but the admin panel ever uses it.
const AdminGate = lazy(() => import('./components/common/AdminGate.jsx'));

import Globals from './global.js';
import { UserProvider } from './UserContext.jsx';
import { LanguageProvider, AdminShell, useCommon } from './i18n';
import { hasEnglishTwin, localizedPath } from './seo/locales.js';
import { examRoutePaths } from './seo/examGuides.js';

import { initErrorTracking } from './utils/errorTracking.js';
import { reloadOnceForStaleChunk } from './utils/staleChunkReload.js';
import { installTranslationGuard } from './utils/translationGuard.js';
// Must run BEFORE the first render: it patches the two DOM methods React uses
// to commit updates, so that a browser translating the page mid-session cannot
// crash the tree. See translationGuard.js — this was taking out the landing
// page for anonymous mobile visitors.
installTranslationGuard();
initErrorTracking();

// After a deploy, users holding the previous entry script fail to lazy-load
// route chunks ("Unable to preload CSS for ..."). Vite signals this exact
// case; one reload picks up the new asset hashes transparently.
window.addEventListener('vite:preloadError', (event) => {
  if (reloadOnceForStaleChunk()) event.preventDefault();
});

const getHostUrl = Globals.URL;

// Wrap a lazily-loaded route element so its chunk can suspend while loading,
// showing the one canonical spinner instead of a blank screen.
const RouteFallback = () => <Spinner fullScreen label={useCommon().loading} />;
const lazyEl = (node) => (
  <Suspense fallback={<RouteFallback />}>{node}</Suspense>
);

// ---- Route builders --------------------------------------------------------
// Every route carries the same errorElement, and each one belongs to exactly
// one of three access tiers. Naming the tiers makes the table below readable at
// a glance — and makes it impossible to add a private page without saying so.
//
//   pub(...)         public page inside the standard Layout (navbar + footer)
//   pubNoFooter(...) same, minus the footer — login/signup, where a page of
//                    site links just adds scroll to a form mid-transaction
//   authed(...)      signed-in users only
//   authedNoFooter() same, minus the footer — checkout and its result page,
//                    for exactly the reason login/signup skip it
//   admin(...)       admin only
const withBoundary = (path, element) => ({ path, element, errorElement: <ErrorBoundary /> });
const pub = (path, node) => withBoundary(path, <Layout>{lazyEl(node)}</Layout>);
const pubNoFooter = (path, node) => withBoundary(path, <Layout hideFooter>{lazyEl(node)}</Layout>);
const authed = (path, node) => withBoundary(path, <Layout><RequireAuth>{lazyEl(node)}</RequireAuth></Layout>);
const authedNoFooter = (path, node) => withBoundary(path, <Layout hideFooter><RequireAuth>{lazyEl(node)}</RequireAuth></Layout>);
// Admin stays English/LTR regardless of the site language — AdminShell pins it.
const admin = (path, node) => withBoundary(path, <AdminShell>{lazyEl(<AdminGate>{lazyEl(node)}</AdminGate>)}</AdminShell>);

// Public content is served in two languages at two URLs — Arabic on the bare
// path, English under /en — so every route that has an English version needs
// to be reachable at both. Registering the twin here (rather than by hand,
// twice) is what keeps the router in step with what postbuild-seo.mjs actually
// prerenders; the two read the same list out of src/seo/locales.js.
//
// Routes with no English twin (the signed-in app, admin, invite links) pass
// through untouched: /en/analysis is not a page, and pretending otherwise
// would turn a language toggle into a 404.
const withEnglishTwins = (routes) =>
  routes.flatMap((route) =>
    hasEnglishTwin(route.path)
      ? [route, { ...route, path: localizedPath(route.path, 'en') }]
      : [route]
  );

// Pathless root. LocaleSync has to see every navigation, and Layout cannot
// give it that — the landing route has its own shell and never mounts one.
const RootShell = () => (
  <>
    <LocaleSync />
    <Outlet />
  </>
);

const router = createBrowserRouter([{
  element: <RootShell />,
  errorElement: <ErrorBoundary />,
  children: withEnglishTwins([
  // Landing — its own shell (own topbar/footer), so not wrapped in Layout.
  withBoundary('/', <App />),

  // Public
  pubNoFooter('/login', <Login />),
  pubNoFooter('/signup', <Signup />),
  pubNoFooter('/signup/:token', <Signup />),
  // Paid group seat. A separate path from /signup/:token so the page can tell
  // an admin invite (free account) from a bought seat (paid, with an end date).
  pubNoFooter('/join/:token', <Signup />),
  pub('/forgot-password', <ForgotPassword />),
  pub('/contact', <Contact />),
  pub('/about', <About />),
  pub('/faq', <FAQ />),
  pub('/privacy', <Privacy />),
  pub('/terms', <Terms />),
  pub('/refund-policy', <RefundPolicy />),
  pub('/suggestions', <Suggestions />),
  // Public on purpose. It is a price page for a guest and a seat manager for
  // the person who bought one — GroupsPage picks which, and only the guest
  // half is indexable. Behind RequireAuth, group plans were undiscoverable to
  // anyone who had not already been told they exist.
  pub('/groups', <GroupsPage />),
  pub('/guides', <GuidesHub />),
  pub('/guides/how-to-use-a-question-bank', <HowToUseQuestionBankGuide />),
  pub('/guides/smle-study-plan', <SmleStudyPlanGuide />),
  pub('/guides/wrong-questions-method', <WrongQuestionsMethodGuide />),
  pub('/guides/smle-vs-prometric-differences', <SmleVsPrometricGuide />),
  pub('/guides/smle-high-yield-topics', <SmleHighYieldTopicsGuide />),

  // Exam logistics — what the SCFHS applicant guides say about the SMLE and
  // the SNLE. Registered from the same list the prerender walks, so a page
  // cannot exist in one and not the other.
  ...examRoutePaths().map((path) => pub(path, <ExamPage />)),

  // Public question library — the only pages a stranger can read in full with
  // no account, and the reason they exist: 5,033 explained questions that
  // Google has never been shown. Prerendered at build time by
  // scripts/postbuild-seo.mjs from src/seo/data/publicQuestions.json.
  pub('/questions', <QuestionsHub />),
  pub('/questions/:specialty', <QuestionsSpecialty />),
  pub('/questions/:specialty/:slug', <QuestionPage />),

  // Collections. "smle past papers" already earns impressions with nothing to
  // serve it, and the bank is organised by named collection — these pages say
  // what each one is, and link into the public questions drawn from it.
  pub('/success-stories', <SuccessStories />),

  pub('/past-papers', <PastPapersHub />),
  pub('/past-papers/:slug', <PastPaperCollection />),

  // Signed-in
  authed('/quizs', <QUIZS />),
  authed('/quiz/:numQuestions', <QUIZ />),
  authed('/analysis', <Analysis />),
  authed('/wrong-questions', <WrongQuestions />),
  authed('/summaries', <SummariesPage />),
  authed('/summaries/:slug', <SummariesPage />),
  // Checkout and its result page get the same treatment as login/signup above:
  // a footer full of site links is a page-height of scroll appended to a form
  // someone is mid-payment on. These two were the only transaction pages that
  // still carried it.
  authedNoFooter('/subscribe', <Subscribe />),
  authed('/account', <AccountPage />),
  authedNoFooter('/payment/callback', <PaymentCallback />),

  // Admin — one hub (/admin) with sub-sections. Old URLs redirect so any
  // bookmark or saved link still works.
  admin('/admin', <Admin />),
  admin('/admin/growth', <Growth />),
  admin('/admin/behavior', <Behavior />),
  admin('/admin/accounting', <Accounting />),
  admin('/admin/users', <ADD host={getHostUrl} />),
  admin('/admin/questions', <ADDQ host={getHostUrl} />),
  admin('/admin/bank', <Bank />),
  admin('/admin/reports', <QuestionReports />),
  admin('/admin/stories', <SuccessStoriesAdmin />),
  admin('/admin/links', <TempLinks host={getHostUrl} />),
  admin('/admin/email', <AdminBroadcast />),

  withBoundary('/ADD_ACCOUNT', <Navigate to="/admin/users" replace />),
  withBoundary('/ADDQ', <Navigate to="/admin/questions" replace />),
  withBoundary('/Bank', <Navigate to="/admin/bank" replace />),
  withBoundary('/TEMP_LINKS', <Navigate to="/admin/links" replace />),
  withBoundary('/question-reports', <Navigate to="/admin/reports" replace />),

  // Anything else. A real 404 page — NOT the error boundary, which renders
  // nothing when there is no router error.
  { path: '*', element: <Layout><NotFound /></Layout> },
  ]),
}]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <UserProvider>
        <RouterProvider router={router} />
        <CookieConsent />
        {/* Mounted at the root (not inside the "/" route element) so every
            route is tracked, not just landing — a visitor arriving directly
            on /signup or /subscribe used to be invisible to analytics. */}
        {import.meta.env.PROD && <Analytics />}
        {import.meta.env.PROD && <SpeedInsights />}
      </UserProvider>
    </LanguageProvider>
  </StrictMode>,
)

// Register the minimal service worker so the app is installable ("Add to Home
// Screen"). It caches nothing — see public/sw.js.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Non-fatal: install prompt simply won't be offered.
    });
  });
}
