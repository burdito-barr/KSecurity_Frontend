import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, Download, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from "../../../assets/logo.png";
import "../../CSS/Reportes.css";
import api from "../../../api/axios";  // <--- IMPORTANTE

const Reportes= () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const sidebarRef = useRef(null);

  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);

  const [activeFilter, setActiveFilter] = useState({
    urgency: "TODAS",
    status: "TODOS",
  });

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    try {
      const response = await api.get("/reports/get-all");

      const formateados = response.data.map(report => {
        const fecha = report.created_at 
          ? new Date(report.created_at) 
          : new Date();

        return {
          id: report.id,
          title: report.title,
          violenceLevel: report.violence_level,
          urgency: report.urgency,
          status: report.status,
          date: fecha.toISOString().split("T")[0],
          time: fecha.toTimeString().slice(0, 5),
          location: report.location,
          description: report.description,
          camera_id: report.camera_id
        };
      });

      setReports(formateados);
      setFilteredReports(formateados);

    } catch (error) {
      console.error("Error cargando reportes:", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/reports/update/${id}/status`, {
        newStatus: newStatus
      });

      const updated = reports.map(r =>
        r.id === id ? { ...r, status: newStatus } : r
      );

      setReports(updated);
      aplicarFiltros(updated, activeFilter);

    } catch (error) {
      console.error("Error actualizando estado:", error);
      alert("Error al actualizar el estado");
    }
  };


  const aplicarFiltros = (lista, filtros) => {
    let filtered = lista;

    if (filtros.urgency !== "TODAS") {
      filtered = filtered.filter(r => r.urgency === filtros.urgency);
    }

    if (filtros.status !== "TODOS") {
      filtered = filtered.filter(r => r.status === filtros.status);
    }

    setFilteredReports(filtered);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target))
        setSidebarActive(false);
    };

    if (sidebarActive)
      document.addEventListener('mousedown', handleClickOutside);

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
  const averageViolence = totalIncidents > 0
    ? Math.round(reports.reduce((acc, r) => acc + r.violenceLevel, 0) / totalIncidents)
    : 0;

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

      <button 
        className={`open-btn ${sidebarActive ? "hide-btn" : ""}`} 
        onClick={() => setSidebarActive(!sidebarActive)}>
        ☰ Abrir Menú
      </button>

      <div ref={sidebarRef} className={`sidebar ${sidebarActive ? "active" : ""}`}>
        <img src={logo} alt="Logo Sidebar" className="logo" />
        <Link to="/colaborador">Inicio</Link>
        <Link to="/camaras">Cámaras</Link>
        <Link to="/auditoriables">Auditoriable</Link>
        <Link to="/">Salir de sesión</Link>
      </div>

      {sidebarActive && <div className="overlay" onClick={() => setSidebarActive(false)} />}

      <div className="main-content">
        <div className="content-wrapper">
          <div className="grid-layout">

            <div className="report-panel">

              {/* FILTROS */}
              <div className="filters-section">
                <div className="filter-group">
                  <label>Filtrar por Urgencia:</label>
                  <select
                    className="status-select"
                    value={activeFilter.urgency}
                    onChange={(e) => {
                      const newFilters = {
                        ...activeFilter,
                        urgency: e.target.value
                      };
                      setActiveFilter(newFilters);
                      aplicarFiltros(reports, newFilters);
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
                      const newFilters = {
                        ...activeFilter,
                        status: e.target.value
                      };
                      setActiveFilter(newFilters);
                      aplicarFiltros(reports, newFilters);
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

              {/* LISTA DE REPORTES */}
              <div className="report-list">
                <h2>Panel de Reportes</h2>

                <div className="report-items">
                  {filteredReports.map(report => (
                    <div key={report.id} className="report-item">

                      <div className="report-header">
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
                        <div className="date-time">
                          <Clock size={16} />
                          <span>{report.date} • {report.time}</span>
                        </div>
                        <div className="location-info">
                          <MapPin size={16} />
                          <span>{report.location}</span>
                        </div>
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

            {/* PANEL ESTADÍSTICAS */}
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
