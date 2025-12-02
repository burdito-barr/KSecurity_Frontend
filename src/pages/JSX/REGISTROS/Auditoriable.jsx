import React, { useState, useRef, useEffect } from "react";
import {Trash2, Camera, Plus, Minus,UserPlus, UserMinus, CheckCircle, XCircle, Ban, Info} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";
import "../../CSS/auditoriable.css";
import api from "../../../api/axios";

export default function Auditoriable() {

  const [sidebarActive, setSidebarActive] = useState(false);
  const sidebarRef = useRef(null);

  const [filter, setFilter] = useState("all");
  const [logsData, setLogsData] = useState([]); 

  useEffect(() => {
    cargarEventos();
  }, []);

  const cargarEventos = async () => {
    try {
      const response = await api.get("/events/list");

      // Tu backend usa to_frontend()
      setLogsData(response.data);

    } catch (error) {
      console.error("Error cargando eventos:", error);
    }
  };

  const getFilteredEvents = async (type) => {
    try {
      if (type === "all") {
        await cargarEventos();
        return;
      }

      const response = await api.get(`/events/type/${type}`);
      setLogsData(response.data);

    } catch (error) {
      console.error("Error filtrando eventos:", error);
    }
  };

  // -------- ICONOS --------
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

  return (
    <div id="auditoriale">
      
      {/* Sidebar Btn */}
      <button className={`open-btn ${sidebarActive ? "hide-btn" : ""}`} 
        onClick={() => setSidebarActive(true)}>
        ☰ Abrir Menú
      </button>

      {/* Sidebar */}
      <div ref={sidebarRef} className={`sidebar ${sidebarActive ? "active" : ""}`}>
        <img src={logo} className="logo" alt="logo" />
        <nav className="sidebar-nav">
          <Link to="/colaborador">Inicio</Link>
          <Link to="/camaras">Cámaras</Link>
          <Link to="/reportes">Reportes</Link>
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

        {/* BOTONES FILTRO */}
        <div className="filters">
          {["all","report","camera","user","access"].map((f)=>( 
            <button
              key={f}
              className={filter===f ? "active" : ""}
              onClick={()=>{
                setFilter(f);
                getFilteredEvents(f);
              }}
            >
              {f==="all" ? "All" : f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>

        {/* REGISTROS */}
        <div className="logs">
          {logsData.length === 0 ? (
            <p className="empty">No hay registros que coincidan.</p>
          ) : logsData.map((log) => (
            <div className="log-item" key={log.id}>
              <div className="log-icon">{getIcon(log.type)}</div>

              <div className="log-content">
                <p>
                  <strong>{log.user}</strong> {log.action} 
                  <span className="target"> {log.target}</span>
                </p>

                <small className="timestamp">
                  {log.timestamp}
                </small>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
