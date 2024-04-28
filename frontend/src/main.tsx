import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import LoginFormContainer from "./loginRegister/LoginFormContainer.tsx";
import RegisterFormContainer from "./loginRegister/RegisterFormContainer.tsx";
import {SessoinProvider} from "./context/SessionContext.tsx";
import {ToasterProvider} from "./context/ToasterContext.tsx";
import PublicRoute from "./utils/PublicRoute.tsx";
import PrivateRoute from "./utils/PrivateRoute.tsx";
import Error from "./components/Error.tsx";
import Home from "./dashboard/Home.tsx";
import Annotation from "./dashboard/Annotation.tsx";

axios.defaults.baseURL = "http://localhost:8000"

const router = createBrowserRouter([
  {
    path: '/',
    element:
        <PrivateRoute>
          <App/>
        </PrivateRoute>,
    children: [
      {
        path: '/',
        element: <Home/>
      },
      {
        path: '/annotation',
        element: <Annotation/>
      }
    ],
  },
  {
    path: '/login',
    element:
        <PublicRoute>
          <LoginFormContainer/>
        </PublicRoute>
  },
  {
    path: '/register',
    element:
        <PublicRoute>
          <RegisterFormContainer/>
        </PublicRoute>
  },
  {
    path: '*',
    element: <Error/>
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <SessoinProvider>
        <ToasterProvider delay={4000}>
          <RouterProvider router={router}/>
        </ToasterProvider>
      </SessoinProvider>
    </React.StrictMode>,
)
