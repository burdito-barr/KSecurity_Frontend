import React, { useState, useRef } from "react";
import {Trash2, Camera, Plus, Minus,UserPlus, UserMinus, CheckCircle, XCircle, Ban, Info} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";
import "../../CSS/auditoriable.css";

export default function Auditoriable() {
  const [sidebarActive, setSidebarActive] = useState(false);
  const sidebarRef = useRef(null);
  const [filter, setFilter] = useState("all");

  const logsData = [
    { id: 1, user: "Ana Martínez", action: "eliminó", target: "reporte #452", timestamp: "2025-11-04 14:22", type: "report-delete" },
    { id: 2, user: "Carlos López", action: "agregó", target: "cámara 'Entrada Principal'", timestamp: "2025-11-04 15:10", type: "camera-add" },
    { id: 3, user: "Sistema", action: "rechazó acceso a", target: "usuario: juan@empresa.com", timestamp: "2025-11-04 16:03", type: "access-denied" },
    { id: 4, user: "María Gómez", action: "eliminó", target: "usuario: pedro@empresa.com", timestamp: "2025-11-04 16:45", type: "user-delete" },
    { id: 5, user: "Admin", action: "concedió acceso a", target: "nuevo usuario: lucia@empresa.com", timestamp: "2025-11-05 09:12", type: "access-granted" },
    { id: 6, user: "Roberto Díaz", action: "eliminó", target: "cámara 'Estacionamiento'", timestamp: "2025-11-05 10:00", type: "camera-remove" },
    { id: 7, user: "Sistema", action: "eliminó", target: "reporte #489 (automático)", timestamp: "2025-11-05 11:30", type: "report-delete" },
  ];

  const iconMap = {
    "report-delete": <Trash2 />,
    "camera-add": <><Camera /><Plus className="mini"/></>,
    "camera-remove": <><Camera /><Minus className="mini"/></>,
    "user-add": <UserPlus />,
    "user-delete": <UserMinus />,
    "access-granted": <CheckCircle />,
    "access-denied": <XCircle />,
    "access-rejected": <Ban />
  };

  const getIcon = (type) => iconMap[type] || <Info />;

  const filteredLogs = filter === "all"
    ? logsData
    : logsData.filter((log) => log.type.startsWith(filter));

  return (
    <div id="auditoriale">
      
      {/* Sidebar Btn */}
      <button className={`open-btn ${sidebarActive ? "hide-btn" : ""}`} onClick={() => setSidebarActive(true)}>
        ☰ Abrir Menú
      </button>

      {/* Sidebar */}
      <div ref={sidebarRef} className={`sidebar ${sidebarActive ? "active" : ""}`}>
        <img src={logo} className="logo" alt="logo" />
        <nav className="sidebar-nav">
          <Link to="/super-admin">Inicio</Link>
          <Link to="/camara-admin">Cámaras</Link>
          <Link to="/reportes-admin">Reportes</Link>
          <Link to="/personal">Personal</Link>
          <Link to="/permisos">Permisos</Link>
          <Link to="/">Cerrar sesión</Link>
        </nav>
      </div>

      {sidebarActive && <div className="overlay" onClick={() => setSidebarActive(false)} />}

      {/* Contenido */}
      <div className="main-content">
        <div className="header">
          <img src={logo} className="logocentral" alt="logo" />
          <h1>Registro de Auditoría</h1>
          <p>Acciones relevantes del sistema en tiempo real</p>
        </div>

        <div className="filters">
          {["all","report","camera","user","access"].map((f)=>(
            <button
              key={f}
              className={filter===f ? "active" : ""}
              onClick={()=>setFilter(f)}
            >
              {f==="all" ? "All" : f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>

        <div className="logs">
          {filteredLogs.length === 0 ? (
            <p className="empty">No hay registros que coincidan.</p>
          ) : filteredLogs.map((log) => (
            <div className="log-item" key={log.id}>
              <div className="log-icon">{getIcon(log.type)}</div>
              <div className="log-content">
                <p><strong>{log.user}</strong> {log.action} <span className="target">{log.target}</span></p>
                <small className="timestamp">{log.timestamp}</small>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
