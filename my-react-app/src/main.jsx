import { StrictMode, Suspense, lazy } from 'react'
import './index.css'
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

// Shell components are part of every route, so they stay eagerly bundled with
// the landing chunk. App (the "/" landing route) is also eager because it is
// the LCP route — splitting it would only add a round-trip before first paint.
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import NotFound from './components/common/NotFound.jsx';
import Layout from './components/common/Layout.jsx';
import RequireAuth from './components/common/RequireAuth.jsx';
import AdminGate from './components/common/AdminGate.jsx';
import CookieConsent from './components/common/CookieConsent.jsx';
import Spinner from './components/common/Spinner.jsx';

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
const SmleStudyPlanGuide = lazy(() => import('./components/guides/SmleStudyPlanGuide.jsx'));
const WrongQuestionsMethodGuide = lazy(() => import('./components/guides/WrongQuestionsMethodGuide.jsx'));
const SmleVsPrometricGuide = lazy(() => import('./components/guides/SmleVsPrometricGuide.jsx'));
const SmleHighYieldTopicsGuide = lazy(() => import('./components/guides/SmleHighYieldTopicsGuide.jsx'));
const TempLinks = lazy(() => import('./components/ADD/TempLinks.jsx'));
const QuestionReports = lazy(() => import('./components/ADD/QuestionReports.jsx'));
const ForgotPassword = lazy(() => import('./components/login/ForgotPassword'));
const SummariesPage = lazy(() => import('./components/summaries/SummariesPage.jsx'));
const Subscribe = lazy(() => import('./components/subscribe/Subscribe.jsx'));
const PaymentCallback = lazy(() => import('./components/subscribe/PaymentCallback.jsx'));

import Globals from './global.js';
import { UserProvider } from './UserContext.jsx';

import { initErrorTracking } from './utils/errorTracking.js';
import { reloadOnceForStaleChunk } from './utils/staleChunkReload.js';
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
const lazyEl = (node) => (
  <Suspense fallback={<Spinner fullScreen label="جاري التحميل" />}>{node}</Suspense>
);

// ---- Route builders --------------------------------------------------------
// Every route carries the same errorElement, and each one belongs to exactly
// one of three access tiers. Naming the tiers makes the table below readable at
// a glance — and makes it impossible to add a private page without saying so.
//
//   pub(...)    public page inside the standard Layout (navbar + footer)
//   authed(...) signed-in users only
//   admin(...)  admin only
const withBoundary = (path, element) => ({ path, element, errorElement: <ErrorBoundary /> });
const pub = (path, node) => withBoundary(path, <Layout>{lazyEl(node)}</Layout>);
const authed = (path, node) => withBoundary(path, <Layout><RequireAuth>{lazyEl(node)}</RequireAuth></Layout>);
const admin = (path, node) => withBoundary(path, <AdminGate>{lazyEl(node)}</AdminGate>);

const router = createBrowserRouter([
  // Landing — its own shell (own topbar/footer), so not wrapped in Layout.
  withBoundary('/', <App />),

  // Public
  pub('/login', <Login />),
  pub('/signup', <Signup />),
  pub('/signup/:token', <Signup />),
  pub('/forgot-password', <ForgotPassword />),
  pub('/contact', <Contact />),
  pub('/about', <About />),
  pub('/faq', <FAQ />),
  pub('/privacy', <Privacy />),
  pub('/terms', <Terms />),
  pub('/refund-policy', <RefundPolicy />),
  pub('/suggestions', <Suggestions />),
  pub('/guides', <GuidesHub />),
  pub('/guides/smle-study-plan', <SmleStudyPlanGuide />),
  pub('/guides/wrong-questions-method', <WrongQuestionsMethodGuide />),
  pub('/guides/smle-vs-prometric-differences', <SmleVsPrometricGuide />),
  pub('/guides/smle-high-yield-topics', <SmleHighYieldTopicsGuide />),

  // Signed-in
  authed('/quizs', <QUIZS />),
  authed('/quiz/:numQuestions', <QUIZ />),
  authed('/analysis', <Analysis />),
  authed('/wrong-questions', <WrongQuestions />),
  authed('/summaries', <SummariesPage />),
  authed('/summaries/:slug', <SummariesPage />),
  authed('/subscribe', <Subscribe />),
  authed('/payment/callback', <PaymentCallback />),

  // Admin
  admin('/admin', <Admin />),
  admin('/admin/email', <AdminBroadcast />),
  admin('/admin/accounting', <Accounting />),
  admin('/ADD_ACCOUNT', <ADD host={getHostUrl} />),
  admin('/ADDQ', <ADDQ host={getHostUrl} />),
  admin('/Bank', <Bank />),
  admin('/TEMP_LINKS', <TempLinks host={getHostUrl} />),
  admin('/question-reports', <QuestionReports />),

  // Anything else. A real 404 page — NOT the error boundary, which renders
  // nothing when there is no router error.
  { path: '*', element: <Layout><NotFound /></Layout> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
      <CookieConsent />
    </UserProvider>
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
