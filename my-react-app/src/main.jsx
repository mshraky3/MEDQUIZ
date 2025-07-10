import { StrictMode } from 'react'
import './index.css'
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client'; 
import { HelmetProvider } from 'react-helmet-async';
import Login from './components/login/Login';
import ADD from './components/ADD/ADD.jsx';
import QUIZS from './components/quizs/QUIZS.jsx';
import QUIZ from './components/Quiz/QUIZ.jsx';
import ADDQ from './components/ADD/ADDQ.jsx';
import Analysis from './components/analysis/Analysis.jsx'
import Admin from './components/ADD/Admin.jsx';
import Bank from './components/ADD/Bank.jsx';
import TrialAnalysis from './components/analysis/TrialAnalysis.jsx';
import Globals from "./global.js"

const getHostUrl = Globals.URL;

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/ADD_ACCOUNT",
    element: <ADD host={getHostUrl} />,
  },
  {
    path: "/quizs",
    element: <QUIZS />,
  },
  {
    path: "/quiz/:numQuestions",
    element: <QUIZ />,
  },
  {
    path: "/ADDQ",
    element: <ADDQ host={Globals.URL} />,
  },
  {
    path: "/analysis",
    element: <Analysis />,
  },
  {
    path: "/trial-analysis",
    element: <TrialAnalysis />,
  },
  {
    path: "/admin",
    element: <Admin/>,
  },
  {
    path: "/Bank",
    element: <Bank />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </StrictMode>,
)
