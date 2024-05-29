import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css"
import axios from "axios";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {SessoinProvider} from "./context/SessionContext.tsx";
import {ToasterProvider} from "./context/ToasterContext.tsx";
import PublicRoute from "./utils/PublicRoute.tsx";
import PrivateRoute from "./utils/PrivateRoute.tsx";
import Error from "./components/Error.tsx";
import Home from "./dashboard/Home.tsx";
import AuthContainer from "./loginRegister/AuthContainer.tsx";
import Login from "./loginRegister/components/Login.tsx";
import Register from "./loginRegister/components/Register.tsx";
import AddImage from "./components/addImage/AddImage.tsx";
import Picture from "./components/picture/Picture.tsx";


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
        path: '/:id',
        element: <Picture/>
      },
      {
        path: '/addimage',
        element: <AddImage/>
      },
    ],
  },
  {
    path: '/',
    element:
        <PublicRoute>
          <AuthContainer/>
        </PublicRoute>,
    children: [
      {
        path: "/login",
        element: <Login/>
      },
      {
        path: "/register",
        element: <Register/>
      }
    ]
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
