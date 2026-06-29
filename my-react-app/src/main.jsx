import { StrictMode, Suspense, lazy } from 'react'
import './index.css'
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

// Shell components are part of every route, so they stay eagerly bundled with
// the landing chunk. App (the "/" landing route) is also eager because it is
// the LCP route — splitting it would only add a round-trip before first paint.
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import Layout from './components/common/Layout.jsx';
import RequireAuth from './components/common/RequireAuth.jsx';
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
const Bank = lazy(() => import('./components/ADD/Bank.jsx'));
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
initErrorTracking();

const getHostUrl = Globals.URL;

// Wrap a lazily-loaded route element so its chunk can suspend while loading,
// showing the one canonical spinner instead of a blank screen.
const lazyEl = (node) => (
  <Suspense fallback={<Spinner fullScreen label="جاري التحميل" />}>{node}</Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/login",
    element: <Layout>{lazyEl(<Login />)}</Layout>,
    errorElement: <ErrorBoundary />,
  },

  {
    path: "/ADD_ACCOUNT",
    element: lazyEl(<ADD host={getHostUrl} />),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/quizs",
    element: <Layout><RequireAuth>{lazyEl(<QUIZS />)}</RequireAuth></Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/quiz/:numQuestions",
    element: <Layout><RequireAuth>{lazyEl(<QUIZ />)}</RequireAuth></Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/ADDQ",
    element: lazyEl(<ADDQ host={Globals.URL} />),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/analysis",
    element: <Layout><RequireAuth>{lazyEl(<Analysis />)}</RequireAuth></Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/wrong-questions",
    element: <Layout><RequireAuth>{lazyEl(<WrongQuestions />)}</RequireAuth></Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/summaries",
    element: <Layout><RequireAuth>{lazyEl(<SummariesPage />)}</RequireAuth></Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/summaries/:slug",
    element: <Layout><RequireAuth>{lazyEl(<SummariesPage />)}</RequireAuth></Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/admin",
    element: lazyEl(<Admin />),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/Bank",
    element: lazyEl(<Bank />),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/TEMP_LINKS",
    element: lazyEl(<TempLinks host={Globals.URL} />),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/question-reports",
    element: lazyEl(<QuestionReports />),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/subscribe",
    element: <Layout><RequireAuth>{lazyEl(<Subscribe />)}</RequireAuth></Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/payment/callback",
    element: <Layout><RequireAuth>{lazyEl(<PaymentCallback />)}</RequireAuth></Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/signup",
    element: <Layout>{lazyEl(<Signup />)}</Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/signup/:token",
    element: <Layout>{lazyEl(<Signup />)}</Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/forgot-password",
    element: <Layout>{lazyEl(<ForgotPassword />)}</Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/contact",
    element: <Layout>{lazyEl(<Contact />)}</Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/privacy",
    element: <Layout>{lazyEl(<Privacy />)}</Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/terms",
    element: <Layout>{lazyEl(<Terms />)}</Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/refund-policy",
    element: <Layout>{lazyEl(<RefundPolicy />)}</Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/about",
    element: <Layout>{lazyEl(<About />)}</Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/faq",
    element: <Layout>{lazyEl(<FAQ />)}</Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/suggestions",
    element: <Layout>{lazyEl(<Suggestions />)}</Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/guides",
    element: <Layout>{lazyEl(<GuidesHub />)}</Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/guides/smle-study-plan",
    element: <Layout>{lazyEl(<SmleStudyPlanGuide />)}</Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/guides/wrong-questions-method",
    element: <Layout>{lazyEl(<WrongQuestionsMethodGuide />)}</Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/guides/smle-vs-prometric-differences",
    element: <Layout>{lazyEl(<SmleVsPrometricGuide />)}</Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/guides/smle-high-yield-topics",
    element: <Layout>{lazyEl(<SmleHighYieldTopicsGuide />)}</Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "*",
    element: <ErrorBoundary />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
      <CookieConsent />
    </UserProvider>
  </StrictMode>,
)