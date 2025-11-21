import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import AuthForm from './pages/JSX/LOGIN/AuthForm';
import SuperAdmin from './pages/JSX/PANELES/SuperAdmin';
import Validar from './pages/JSX/LOGIN/Validar';
import Colaborador from './pages/JSX/PANELES/Colaborador';
import Reportes from "./pages/JSX/REPORTES/Reportes";
import Camaras from "./pages/JSX/CAMARAS/Camaras";
import CamaraAdmin from "./pages/JSX/CAMARAS/CamaraAdmin";
import Permisos from "./pages/JSX/REGISTROS/Permisos";
import ReportesAdmin from "./pages/JSX/REPORTES/ReportesAdmin";
import PersonalAdmin from "./pages/JSX/PERSONAL/PersonalAdmin";
import Auditoriable from "./pages/JSX/REGISTROS/Auditoriable";
import AuditoriableAdmin from "./pages/JSX/REGISTROS/AuditoriableAdmin";

const router = createBrowserRouter([

  {
    path: '/auditoriables-admin',
    element: <AuditoriableAdmin/>,
  },
  {
    path: '/auditoriables',
    element: <Auditoriable/>,
  },
   {
    path: '/camara-admin',
    element: <CamaraAdmin />,
  },
   {
    path: '/permisos',
    element: <Permisos />,
  },
   {
    path: '/personal',
    element: <PersonalAdmin />,
  },
   {
    path: '/reportes-admin',
    element: <ReportesAdmin/>,
  },
   {
    path: '/reportes',
    element: <Reportes />,
  },
 {
    path: '/camaras',
    element: <Camaras />,
  },
  {
    path: '/super-admin',
    element: <SuperAdmin />,
  },
   {
    path: '/colaborador',
    element: <Colaborador />,
  },
  {
    path: '/validar',
    element: <Validar />,
  },
    {
    path: '/',
    element: <AuthForm />,
  },


]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


