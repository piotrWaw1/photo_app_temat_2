import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import LoginFormContainer from "./loginRegister/LoginFormContainer.tsx";
import RegisterFormContainer from "./loginRegister/RegisterFormContainer.tsx";

axios.defaults.baseURL = "http://localhost:8000"

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>
  },
  {
    path: '/login',
    element: <LoginFormContainer/>
  },
  {
    path: '/register',
    element: <RegisterFormContainer/>
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <RouterProvider router={router}/>
    </React.StrictMode>,
)
