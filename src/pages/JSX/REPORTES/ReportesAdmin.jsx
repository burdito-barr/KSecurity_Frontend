import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, Download, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from "../../../assets/logo.png";
import "../../CSS/Reportes.css";

const Reportes = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const sidebarRef = useRef(null);

  const [reports, setReports] = useState([
    { id: 1, title: "Robo a mano armada", violenceLevel: 85, urgency: "ALTA", status: "ESPERANDO", date: "2024-01-15", time: "14:30", location: "Centro Comercial Plaza Mayor", description: "Sujeto armado con pistola robó $5000 de una tienda de electrónicos." },
    { id: 2, title: "Riña en bar", violenceLevel: 45, urgency: "MEDIA", status: "RESUELTO", date: "2024-01-15", time: "22:15", location: "Bar La Noche, Zona Rosa", description: "Discusión entre clientes escaló a pelea física, intervención policial." },
    { id: 3, title: "Asalto callejero", violenceLevel: 70, urgency: "ALTA", status: "ESPERANDO", date: "2024-01-15", time: "08:45", location: "Calle Principal #123", description: "Dos sujetos asaltaron a transeúnte, robaron celular y cartera." },
    { id: 4, title: "Robo con arma blanca", violenceLevel: 60, urgency: "MEDIA", status: "ENPROCESO", date: "2024-01-14", time: "19:20", location: "Parque Central", description: "Individuo con cuchillo amenazó a pareja, robó pertenencias." },
    { id: 5, title: "Pelea familiar", violenceLevel: 30, urgency: "BAJA", status: "RESUELTO", date: "2024-01-14", time: "16:00", location: "Residencial Las Palmas", description: "Discusión entre familiares, mediación policial exitosa." }
  ]);

  const [filteredReports, setFilteredReports] = useState(reports);
  const [activeFilter, setActiveFilter] = useState({
    urgency: "TODAS",
    status: "TODOS",
  });

  // ✅ Agregar reportes con ID automático
  const addReport = (newReport) => {
    const nextId = reports.length > 0 ? Math.max(...reports.map(r => r.id)) + 1 : 1;
    const reportWithId = { ...newReport, id: nextId };
    const updated = [...reports, reportWithId];
    setReports(updated);
    setFilteredReports(updated);
  };

  // Ejemplo de uso (puedes reemplazar por tu formulario)
  const handleAddExampleReport = () => {
    addReport({
      title: "Reporte de prueba agregado",
      violenceLevel: 55,
      urgency: "MEDIA",
      status: "ESPERANDO",
      date: "2025-11-07",
      time: "12:00",
      location: "Zona Industrial",
      description: "Este es un ejemplo de reporte agregado dinámicamente."
    });
  };

  const updateStatus = (id, newStatus) => {
    const updated = reports.map(r =>
      r.id === id ? { ...r, status: newStatus } : r
    );
    setReports(updated);

    // Aplicar filtros actuales
    let filtered = updated;
    if (activeFilter.urgency !== "TODAS")
      filtered = filtered.filter(r => r.urgency === activeFilter.urgency);
    if (activeFilter.status !== "TODOS")
      filtered = filtered.filter(r => r.status === activeFilter.status);

    setFilteredReports(filtered);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target))
        setSidebarActive(false);
    };
    if (sidebarActive) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarActive]);

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'ALTA': return 'urgencia-alta';
      case 'MEDIA': return 'urgencia-media';
      case 'BAJA': return 'urgencia-baja';
      default: return '';
    }
  };

  const STATUS_CLASS = {
    RESUELTO: 'status-resuelto',
    ESPERANDO: 'status-esperando',
    INCONCLUSO: 'status-inconcluso',
    ENPROCESO: 'status-enproceso',
  };

  const getStatusColor = (status) => STATUS_CLASS[status] ?? 'status-desconocido';
  const getViolenceColor = (level) =>
    level >= 70 ? 'violence-alta' : level >= 40 ? 'violence-media' : 'violence-baja';

  const totalIncidents = reports.length;
  const averageViolence = Math.round(reports.reduce((acc, r) => acc + r.violenceLevel, 0) / totalIncidents);

  const hourRanges = ["00-06", "06-12", "12-18", "18-24"];
  const incidentsByHour = hourRanges.map(range => {
    const [start, end] = range.split("-").map(Number);
    const count = filteredReports.filter(r => {
      const hour = Number(r.time.split(":")[0]);
      return hour >= start && hour < end;
    }).length;
    return { range, count };
  });
  const maxHourCount = Math.max(...incidentsByHour.map(i => i.count), 1);

  const locations = [...new Set(filteredReports.map(r => r.location))];
  const incidentsByLocation = locations.map(loc => {
    const count = filteredReports.filter(r => r.location === loc).length;
    return { location: loc, count };
  });
  const maxLocationCount = Math.max(...incidentsByLocation.map(i => i.count), 1);

  return (
    <div className="reportes-container" id="reportes">
      <button className={`open-btn ${sidebarActive ? "hide-btn" : ""}`} onClick={() => setSidebarActive(!sidebarActive)}>☰ Abrir Menú</button>
      <div ref={sidebarRef} className={`sidebar ${sidebarActive ? "active" : ""}`}>
        <img src={logo} alt="Logo Sidebar" className="logo" />
        <Link to="/super-admin">Inicio</Link>
        <Link to="/camara-admin">Cámaras</Link>
        <Link to="/personal">Personal</Link>
        <Link to="/permisos">Permisos</Link>
        <Link to="/auditoriables-admin">Auditoriable</Link>
        <Link to="/">Salir de sesión</Link>
      </div>
      {sidebarActive && <div className="overlay" onClick={() => setSidebarActive(false)} />}

      <div className="main-content">
        <div className="content-wrapper">
          <div className="grid-layout">

            <div className="report-panel">
              

              {/* === FILTROS POR URGENCIA Y STATUS === */}
              <div className="filters-section">
                <div className="filter-group">
                  <label>Filtrar por Urgencia:</label>
                  <select
                    className="status-select"
                    value={activeFilter.urgency}
                    onChange={(e) => {
                      const urgency = e.target.value;
                      const status = activeFilter.status;
                      setActiveFilter({ urgency, status });

                      let filtered = reports;
                      if (urgency !== "TODAS")
                        filtered = filtered.filter((r) => r.urgency === urgency);
                      if (status !== "TODOS")
                        filtered = filtered.filter((r) => r.status === status);

                      setFilteredReports(filtered);
                    }}
                  >
                    <option value="TODAS">Todas</option>
                    <option value="ALTA">Alta</option>
                    <option value="MEDIA">Media</option>
                    <option value="BAJA">Baja</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Filtrar por Estado:</label>
                  <select
                    className="status-select"
                    value={activeFilter.status}
                    onChange={(e) => {
                      const status = e.target.value;
                      const urgency = activeFilter.urgency;
                      setActiveFilter({ urgency, status });

                      let filtered = reports;
                      if (urgency !== "TODAS")
                        filtered = filtered.filter((r) => r.urgency === urgency);
                      if (status !== "TODOS")
                        filtered = filtered.filter((r) => r.status === status);

                      setFilteredReports(filtered);
                    }}
                  >
                    <option value="TODOS">Todos</option>
                    <option value="ESPERANDO">Esperando</option>
                    <option value="ENPROCESO">En Proceso</option>
                    <option value="INCONCLUSO">Inconcluso</option>
                    <option value="RESUELTO">Resuelto</option>
                  </select>
                </div>
              </div>

              {/* === LISTA DE REPORTES === */}
              <div className="report-list">
                <h2>Panel de Reportes</h2>
                <div className="report-items">
                  {filteredReports.map(report => (
                    <div key={report.id} className="report-item">
                      <div className="report-header">
                        {/* ← AQUI: ahora mostramos el ID junto al título */}
                        <h3>{`#${report.id} - ${report.title}`}</h3>

                        <div className="report-actions">
                          <button disabled title="Descargar PDF"><Download size={16} /></button>

                          <select
                            className="status-select"
                            value={report.status}
                            onChange={(e) => updateStatus(report.id, e.target.value)}
                          >
                            <option value="ESPERANDO">Esperando</option>
                            <option value="ENPROCESO">En Proceso</option>
                            <option value="INCONCLUSO">Inconcluso</option>
                            <option value="RESUELTO">Resuelto</option>
                          </select>

                          <button title="Eliminar reporte"><Trash2 size={16} /></button>
                        </div>
                      </div>

                      <div className="report-details-grid">
                        <div className="violence-section">
                          <label>Nivel de Violencia</label>
                          <div className="violence-bar-bg">
                            <div
                              className={`violence-bar-fill ${getViolenceColor(report.violenceLevel)}`}
                              style={{ width: `${report.violenceLevel}%` }}
                            ></div>
                          </div>
                          <span>{report.violenceLevel}%</span>
                        </div>

                        <div className="urgency-status-section">
                          <div className="urgency-block">
                            <label>Urgencia</label>
                            <div className={`badge ${getUrgencyColor(report.urgency)}`}>{report.urgency}</div>
                          </div>
                          <div className="status-block">
                            <label>Estado</label>
                            <div className={`badge ${getStatusColor(report.status)}`}>{report.status}</div>
                          </div>
                        </div>
                      </div>

                      <div className="report-info-grid">
                        <div className="date-time"><Clock size={16} /><span>{report.date} • {report.time}</span></div>
                        <div className="location-info"><MapPin size={16} /><span>{report.location}</span></div>
                      </div>

                      <div className="report-description">
                        <label>Descripción</label>
                        <p>{report.description}</p>
                      </div>

                      <button className="btn-view-details">Ver Detalles</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* === PANEL DE ESTADÍSTICAS === */}
            <div className="stats-panel">
              <div className="stats-box">
                <div className="stats-header">
                  <img src={logo} alt="Logo Reportes" className="logo-reportes" />
                  <h3>Análisis de reportes</h3>
                </div>

                <div className="stats-summary">
                  <div className="summary-item">
                    <div className="number">{totalIncidents}</div>
                    <div className="label">Incidentes totales</div>
                  </div>
                  <div className="summary-item">
                    <div className="number">{averageViolence}%</div>
                    <div className="label">Violencia promedio</div>
                  </div>
                </div>

                <div className="by-hour">
                  <h4>Incidentes por Hora</h4>
                  <div className="list-scrollable">
                    {incidentsByHour.map((item, i) => (
                      <div key={i} className="list-item">
                        <div className="list-item-header">
                          <span>{item.range} hrs</span>
                          <span>{item.count}</span>
                        </div>
                        <div className="bar-bg">
                          <div className="bar-fill" style={{ width: `${(item.count / maxHourCount) * 100}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="by-location">
                  <h4>Incidentes por Ubicación</h4>
                  <div className="list-scrollable">
                    {incidentsByLocation.map((item, i) => (
                      <div key={i} className="list-item">
                        <div className="list-item-header">
                          <span>{item.location}</span>
                          <span>{item.count}</span>
                        </div>
                        <div className="bar-bg">
                          <div className="bar-fill" style={{ width: `${(item.count / maxLocationCount) * 100}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
