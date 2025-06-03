import { StrictMode } from 'react'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client'; // Correct import path
import ADD from './components/ADD/ADD.JSX';
import QUIZS from './components/quizs/QUIZS.jsx';
import QUIZ from './components/Quiz/QUIZ.jsx';
import ADDQ from './components/ADD/ADDQ.jsx';
import Analysis from './components/analysis/analysis.JSX'

const getHostUrl = "http://localhost:3000"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/ADD_ACCOUNT",
    element: <ADD host={getHostUrl} />,
  },
  {
    path: "/quizs",
    element: <QUIZS/>, 
  },
  {
    path: "/quiz/:numQuestions",
    element: <QUIZ/>,
  },
  {
    path: "/ADDQ",
    element: <ADDQ host={getHostUrl} />,
  },
  {
    path: "/analysis",
    element: <Analysis/>,
  },


]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
