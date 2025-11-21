import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../CSS/colaborador.css"; // Tu CSS adaptado con #colaborador
import logo from "../../../assets/logo.png";
import reporteIcon from "../../../assets/reportes-icon.png";
import camaraicon from "../../../assets/camara-icon.png";
import auditoriaIcon from "../../../assets/auditoriable-icon.png";

function Colaborador() {
  const [sidebarActive, setSidebarActive] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  return (
    <div id="colaborador">
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

        <Link to="/colaborador">Inicio</Link>
        <Link to="/">Salir de sesión</Link>
      </div>

      {/* Header con logo central */}
      <header className="header">
        <img src={logo} alt="Logo Central" className="logo-central" />
      </header>

      
      <div className="funciones">
      
        <div
          className="card"
          data-title="Reportes"
          onClick={() => navigate("/reportes")}
        >
          <img src={reporteIcon} alt="Icono Reportes" className="icon-card" />
          <div className="layer"></div>
          <div className="info">
            <h1>Reportes</h1>
          </div>
        </div>

        <div
            className="card"
            data-title="Auditoriable"
            onClick={() => navigate("/auditoriables")}
          >
            <img src={auditoriaIcon} alt="Auditoriable" className="icon-card" />
            <div className="layer"></div>
            <div className="info"><h1>Auditoriable</h1></div>
          </div>

        <div
          className="card"
          data-title="Cámaras"
          onClick={() => navigate("/camaras")}
        >
          <img src={camaraicon} alt="Icono Cámaras" className="icon-card" />
          <div className="layer"></div>
          <div className="info">
            <h1>Cámaras</h1>
          </div>
        </div>
      </div>

      {/* Cierre del sidebar al hacer click fuera */}
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
    </div>
  );
}

export default Colaborador;
