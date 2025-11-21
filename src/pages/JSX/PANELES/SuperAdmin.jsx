// SuperAdmin.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../CSS/SuperAdmin.css";
import logo from "../../../assets/logo.png";
import camaraIcon from "../../../assets/camara-icon.png";
import reportesIcon from "../../../assets/reportes-icon.png";
import personalIcon from "../../../assets/personal-icon.png";
import permisosIcon from "../../../assets/permisos-icon.png";
import auditoriaIcon from "../../../assets/auditoriable-icon.png";
import Alerta from "../ALERTA/Alerta.jsx";
import "../../CSS/alerta.css";

function SuperAdmin() {
  const [sidebarActive, setSidebarActive] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  return (
    <div id="super-admin">
      {/* Botón para abrir el sidebar */}
      <button
        className={`open-btn ${sidebarActive ? "hide-btn" : ""}`}
        onClick={toggleSidebar}
      >
        ☰ Abrir Menú
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarActive ? "active" : ""}`}>
        <img src={logo} alt="Logo Sidebar" className="logo" />
        <Link to="/super-admin">Inicio</Link>
        <Link to="/">Salir de sesión</Link>
      </div>

      {/* Header con logo central */}
      <header className="header">
        <div className="logo-central">
          <img src={logo} alt="Logo Central" />
        </div>
      </header>

     {/* Tarjetas de funciones */}
<div className="funciones">
  <div
    className="card"
    data-title="Cámaras"
    onClick={() => navigate("/camara-admin")}
  >
    <img src={camaraIcon} alt="Cámaras" className="icon-card" />
    <div className="layer"></div>
    <div className="info"><h1>Cámaras</h1></div>
  </div>

  <div
    className="card"
    data-title="Reportes"
    onClick={() => navigate("/reportes-admin")}
  >
    <img src={reportesIcon} alt="Reportes" className="icon-card" />
    <div className="layer"></div>
    <div className="info"><h1>Reportes</h1></div>
  </div>

  <div
    className="card"
    data-title="Personal"
    onClick={() => navigate("/personal")}
  >
    <img src={personalIcon} alt="Personal" className="icon-card" />
    <div className="layer"></div>
    <div className="info"><h1>Personal</h1></div>
  </div>

  {/* Este div invisible fuerza un salto de fila */}
  <div className="break-row"></div>

  <div
    className="card"
    data-title="Auditoriable"
    onClick={() => navigate("/auditoriables-admin")}
  >
    <img src={auditoriaIcon} alt="Auditoriable" className="icon-card" />
    <div className="layer"></div>
    <div className="info"><h1>Auditoriable</h1></div>
  </div>

  <div
    className="card"
    data-title="Permisos"
    onClick={() => navigate("/permisos")}
  >
    <img src={permisosIcon} alt="Permisos" className="icon-card" />
    <div className="layer"></div>
    <div className="info"><h1>Permisos</h1></div>
  </div>
</div>


      {/* Fondo clickeable para cerrar sidebar */}
      {sidebarActive && (
        <div
          onClick={() => setSidebarActive(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 999,
          }}
        />
      )}

      {/* 🚨 Alerta de emergencia (se repite cada 3 minutos) */}
      <Alerta
        message="Una emergencia"
        intervalMs={8000} // cada 3 minutos
        durationMs={8000}   // visible 8s
      />
    </div>
  );
}

export default SuperAdmin;
