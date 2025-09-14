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
import Admin from './components/ADD/Admin.jsx';
import Bank from './components/ADD/Bank.jsx';
import AnalysisTemp from './components/login/AnalysisTemp.jsx';
import TempQUIZ from './components/login/TempQUIZ.jsx';
import Payment from './components/payment/Payment.jsx';
import PayButton from './components/payment/PayButton.jsx';
import WaitingForPayment from './components/payment/WaitingForPayment.jsx';
import Signup from './components/signup/Signup.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';

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
    element: <Login />,
    errorElement: <ErrorBoundary />,
  },
  
  {
    path: "/ADD_ACCOUNT",
    element: <ADD host={getHostUrl} />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/quizs",
    element: <QUIZS />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/temp-quiz/:numQuestions",
    element: <TempQUIZ />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/quiz/:numQuestions",
    element: <QUIZ />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/ADDQ",
    element: <ADDQ host={Globals.URL} />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/analysis",
    element: <Analysis />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/analysis-temp",
    element: <AnalysisTemp />,
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
    path: "/payment",
    element: <Payment />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/waiting-for-payment",
    element: <WaitingForPayment />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/signup",
    element: <Signup />,
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
