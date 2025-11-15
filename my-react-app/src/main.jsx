import { StrictMode } from 'react'
import './index.css'
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client'; 
import Login from './components/login/Login';
import ADD from './components/ADD/ADD.jsx';
import QUIZS from './components/quizs/QUIZS.jsx';
import QUIZ from './components/Quiz/QUIZ.jsx';
import ADDQ from './components/ADD/ADDQ.jsx';
import Analysis from './components/analysis/Analysis.jsx'
import WrongQuestions from './components/analysis/WrongQuestions.jsx';
import Admin from './components/ADD/Admin.jsx';
import Bank from './components/ADD/Bank.jsx';
import AnalysisTemp from './components/login/AnalysisTemp.jsx';
import TempQUIZ from './components/login/TempQUIZ.jsx';
import Signup from './components/signup/Signup.jsx';
import TempLinks from './components/ADD/TempLinks.jsx';
import Contact from './components/contact/Contact.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import Layout from './components/common/Layout.jsx';

import Globals from './global.js';
import { UserProvider } from './UserContext.jsx';

const getHostUrl = Globals.URL;

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/login",
    element: <Layout><Login /></Layout>,
    errorElement: <ErrorBoundary />,
  },
  
  {
    path: "/ADD_ACCOUNT",
    element: <ADD host={getHostUrl} />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/quizs",
    element: <Layout><QUIZS /></Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/temp-quiz/:numQuestions",
    element: <Layout><TempQUIZ /></Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/quiz/:numQuestions",
    element: <Layout><QUIZ /></Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/ADDQ",
    element: <ADDQ host={Globals.URL} />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/analysis",
    element: <Layout><Analysis /></Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/wrong-questions",
    element: <Layout><WrongQuestions /></Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/analysis-temp",
    element: <Layout><AnalysisTemp /></Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/admin",
    element: <Admin/>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/Bank",
    element: <Bank />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/signup",
    element: <Layout><Signup /></Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/signup/:token",
    element: <Layout><Signup /></Layout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/TEMP_LINKS",
    element: <TempLinks host={getHostUrl} />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/contact",
    element: <Layout><Contact /></Layout>,
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
    </UserProvider>
  </StrictMode>,
)
