import React, { useState, useEffect } from "react";
import { XCircle, Clock ,CircleCheck,CircleUser} from "lucide-react"; 
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";
import "../../CSS/permisos.css";

function Permisos() {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [filtro, setFiltro] = useState("total"); //
  const [solicitudes, setSolicitudes] = useState([
    {
      id: 1,
      nombre: "Ana Martínez",
      correo: "ana.martinez@email.com",
      fecha: "2024-01-15T10:30:00",
      estado: "pendiente",
      codigo: "ABC123",
      rolSolicitado: "colaborador",
    },
    {
      id: 2,
      nombre: "Roberto Sánchez",
      correo: "roberto.sanchez@email.com",
      fecha: "2024-01-15T09:15:00",
      estado: "aprobada",
      codigo: "DEF456",
      rolSolicitado: "admin",
    },
    {
      id: 3,
      nombre: "Laura Torres",
      correo: "laura.torres@email.com",
      fecha: "2024-01-14T16:45:00",
      estado: "rechazada",
      codigo: "GHI789",
      rolSolicitado: "colaborador",
    },
  ]);
  const [showSuccess, setShowSuccess] = useState(false);

  const toggleSidebar = () => setSidebarActive(!sidebarActive);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const newSolicitud = {
          id: Math.max(...solicitudes.map((s) => s.id), 0) + 1,
          nombre: `Usuario ${Math.floor(Math.random() * 1000)}`,
          correo: `usuario${Math.floor(Math.random() * 1000)}@email.com`,
          fecha: new Date().toISOString(),
          estado: "pendiente",
          codigo: Math.random().toString(36).substring(2, 8).toUpperCase(),
          rolSolicitado: Math.random() > 0.5 ? "admin" : "colaborador",
        };
        setSolicitudes((prev) => [newSolicitud, ...prev]);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [solicitudes]);

  const aprobarSolicitud = (id) => {
    setSolicitudes(
      solicitudes.map((s) =>
        s.id === id ? { ...s, estado: "aprobada", fecha: new Date().toISOString() } : s
      )
    );
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const rechazarSolicitud = (id) => {
    setSolicitudes(
      solicitudes.map((s) =>
        s.id === id ? { ...s, estado: "rechazada", fecha: new Date().toISOString() } : s
      )
    );
  };

  const reenviarCodigo = (id) => {
    const newCodigo = Math.random().toString(36).substring(2, 8).toUpperCase();
    setSolicitudes(
      solicitudes.map((s) =>
        s.id === id ? { ...s, codigo: newCodigo, fecha: new Date().toISOString() } : s
      )
    );
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "aprobada":
        return "estado-aprobada";
      case "rechazada":
        return "estado-rechazada";
      case "pendiente":
        return "estado-pendiente";
      default:
        return "";
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "aprobada":
        return <CircleCheck className="w-4 h-4" />;
      case "rechazada":
        return <XCircle className="w-4 h-4" />;
      case "pendiente":
        return <Clock className="w-4 h-4" />;
      default:
        return <CircleUser className="w-4 h-4" />;
    }
  };

  // 👇 Filtrar solicitudes según el estado seleccionado
  const solicitudesFiltradas = filtro === "total"
    ? solicitudes
    : solicitudes.filter((s) => s.estado === filtro);

  return (
    <div id="permisos">
      {/* Sidebar */}
      <button
        className={`open-btn ${sidebarActive ? "hide-btn" : ""}`}
        onClick={toggleSidebar}
      >
        ☰ Abrir Menú
      </button>
      <div className={`sidebar ${sidebarActive ? "active" : ""}`}>
        <img src={logo} alt="Logo Sidebar" className="logo" />
        <Link to="/super-admin">Inicio</Link>
        <Link to="/camara-admin">Cámaras</Link>
        <Link to="/reportes-admin">Reportes</Link>
        <Link to="/personal">Personal</Link>
        <Link to="/auditoriables-admin">Auditoriable</Link>
        <Link to="/">Salir</Link>
      </div>
      {sidebarActive && (
        <div className="overlay" onClick={() => setSidebarActive(false)} />
      )}

      {/* Header */}
      <div className="main-content">
              <div className="header-info">
              
                <div className="header-texts">
                  <img src={logo} alt="Logo Central" className="logo-central" />
                  <h1 className="title">Panel de permisos</h1>
                </div>
              </div>
      

    
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Tarjeta Total */}
            <div
              className="card-estado"
              onClick={() => setFiltro("total")}
              style={{ backgroundColor: "#1a3d63" }}
            >
              <div className="flex items-center gap-4">
                <div className="icon bg-blue-900/50">
                  <CircleUser  className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p>Total</p>
                  <p>{solicitudes.length}</p>
                </div>
              </div>
            </div>

            {/* Pendientes */}
            <div
              className="card-estado estado-pendiente"
              onClick={() => setFiltro("pendiente")}
            >
              <div className="flex items-center gap-4">
                <div className="icon bg-yellow-900/50">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p>Pendientes</p>
                  <p>
                    {solicitudes.filter((s) => s.estado === "pendiente").length}
                  </p>
                </div>
              </div>
            </div>

            {/* Aprobadas */}
            <div
              className="card-estado estado-aprobada"
              onClick={() => setFiltro("aprobada")}
            >
              <div className="flex items-center gap-4">
                <div className="icon bg-green-900/50">
                  <CircleCheck className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p>Aprobadas</p>
                  <p>
                    {solicitudes.filter((s) => s.estado === "aprobada").length}
                  </p>
                </div>
              </div>
            </div>

            {/* Rechazadas */}
            <div
              className="card-estado estado-rechazada"
              onClick={() => setFiltro("rechazada")}
            >
              <div className="flex items-center gap-4">
                <div className="icon bg-red-900/50">
                  <XCircle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <p>Rechazadas</p>
                  <p>
                    {solicitudes.filter((s) => s.estado === "rechazada").length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="alert-success">
              ¡Solicitud aprobada! Código generado.
            </div>
          )}

          {/* Tabla Solicitudes */}
          <div className="solicitudes-container">
            <table>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Rol Solicitado</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Código</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudesFiltradas.map((s) => (
                  <tr key={s.id}>
                    <td>{s.nombre}</td>
                    <td>{s.correo}</td>
                    <td>
                      <span className={`rol-badge ${s.rolSolicitado}`}>
                        {s.rolSolicitado === "admin"
                          ? "Administrador"
                          : "Colaborador"}
                      </span>
                    </td>
                    <td>{new Date(s.fecha).toLocaleString("es-ES")}</td>
                    <td>
                      <span className={`estado ${getEstadoColor(s.estado)}`}>
                        {getEstadoIcon(s.estado)}{" "}
                        {s.estado.charAt(0).toUpperCase() + s.estado.slice(1)}
                      </span>
                    </td>
                    <td>
                      <code>{s.codigo}</code>
                    </td>
                    <td className="flex gap-2">
                      {s.estado === "pendiente" && (
                        <>
                          <button
                            onClick={() => aprobarSolicitud(s.id)}
                            className="btn-aprobar"
                          >
                            Aprobar
                          </button>
                          <button
                            onClick={() => rechazarSolicitud(s.id)}
                            className="btn-rechazar"
                          >
                            Rechazar
                          </button>
                        </>
                      )}
                      {s.estado === "aprobada" && (
                        <button
                          onClick={() => reenviarCodigo(s.id)}
                          className="btn-reenviar"
                        >
                          Reenviar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  
  );

}

export default Permisos;