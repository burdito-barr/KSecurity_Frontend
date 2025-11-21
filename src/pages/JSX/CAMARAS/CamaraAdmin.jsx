import React, { useState, useEffect, useRef } from 'react';
import "../../CSS/camaras-admin.css";
import logo from "../../../assets/logo.png";
import { Link } from "react-router-dom";
import { Camera, Wifi, WifiOff, AlertCircle, Plus, Trash2 } from 'lucide-react';
import AgregarCamara from "./AgregarCamara";

function CamaraAdmin() {
  const [sidebarActive, setSidebarActive] = useState(false);
  const videoRef = useRef(null);
  const sidebarRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [newCameraName, setNewCameraName] = useState("");
  const [newCameraIP, setNewCameraIP] = useState("");
  const [newCameraArea, setNewCameraArea] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterArea, setFilterArea] = useState(null);

  const toggleSidebar = () => setSidebarActive(!sidebarActive);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarActive(false);
      }
    };
    if (sidebarActive) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarActive]);

  const [cameras, setCameras] = useState([
    { id: 1, name: 'Cámara Entrada', ip: '192.168.1.10', area: 'Entrada', status: 'connected', lastSeen: '2 min' },
    { id: 2, name: 'Cámara Estacionamiento', ip: '192.168.1.11', area: 'Exterior', status: 'disconnected', lastSeen: '15 min' },
    { id: 3, name: 'Cámara Recepción', ip: '192.168.1.12', area: 'Interior', status: 'connected', lastSeen: '1 min' },
  ]);

  const connectedCameras = cameras.filter(cam => cam.status === 'connected').length;
  const disconnectedCameras = cameras.filter(cam => cam.status === 'disconnected').length;

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 360 }
    })
    .then(stream => {
      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        video.onloadedmetadata = () => video.play().catch(console.error);
      }
    })
    .catch(err => console.error("Error accediendo a la cámara:", err));
  }, []);

  const saveCamera = () => {
    if (!newCameraName.trim() || !newCameraIP.trim() || !newCameraArea.trim()) {
      alert("Por favor, completa todos los campos");
      return;
    }

    const newCamera = {
      id: cameras.length + 1,
      name: newCameraName,
      ip: newCameraIP,
      area: newCameraArea,
      status: Math.random() > 0.5 ? 'connected' : 'disconnected',
      lastSeen: '1 min'
    };

    setCameras([...cameras, newCamera]);

    setNewCameraName("");
    setNewCameraIP("");
    setNewCameraArea("");
    setShowModal(false);
  };

  const removeCamera = (id) => {
    if (cameras.length <= 1) return alert('No se puede eliminar la última cámara');
    setCameras(cameras.filter(cam => cam.id !== id));
  };

  const filteredCameras = cameras.filter(cam => {
    const matchesSearch = cam.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = filterArea ? cam.area === filterArea : true;
    return matchesSearch && matchesArea;
  });

  const uniqueAreas = [...new Set(cameras.map(cam => cam.area))];

  return (
    <div id="camaras" className="camaras">

      {showModal && (
        <AgregarCamara 
          newCameraName={newCameraName}
          setNewCameraName={setNewCameraName}
          newCameraIP={newCameraIP}
          setNewCameraIP={setNewCameraIP}
          newCameraArea={newCameraArea}
          setNewCameraArea={setNewCameraArea}
          saveCamera={saveCamera}
          closeModal={() => setShowModal(false)}
        />
      )}

      <button
        className={`open-btn ${sidebarActive ? "hide-btn" : ""}`}
        onClick={toggleSidebar}
      >
        ☰ Abrir Menú
      </button>

      <div ref={sidebarRef} className={`sidebar ${sidebarActive ? "active" : ""}`}>
        <img src={logo} alt="Logo Sidebar" className="logo" />
        <nav className="sidebar-nav">
          <Link to="/super-admin">Inicio</Link>
          <Link to="/reportes-admin">Reportes</Link>
          <Link to="/personal">Personal</Link>
          <Link to="/permisos">Permisos</Link>
          <Link to="/auditoriables-admin">Auditoriable</Link>
          <Link to="/">Salir de sesión</Link>
        </nav>
      </div>

      <div className="main-content">
        <div className="header-info">
          <img src={logo} alt="Logo Central" className="logo-central" />
          <h1 className="title">Panel de Vigilancia</h1>

          <div className="camera-controls">
            <button 
              onClick={() => setShowModal(true)}
              className="btn-add-camera"
            >
              <Plus size={18} /> Agregar Cámara
            </button>

            <input
              type="text"
              placeholder="Buscar cámara..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="area-select"
              value={filterArea || ""}
              onChange={(e) =>
                setFilterArea(e.target.value === "" ? null : e.target.value)
              }
            >
              <option value="">Todas las áreas</option>
              {uniqueAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="stats-cards">
          <div className="card connected-card">
            <div className="card-inner">
              <div>
                <p className="card-label">Cámaras Conectadas</p>
                <p className="card-number">{connectedCameras}</p>
              </div>
              <div className="icon-circle connected-icon-bg">
                <Wifi className="icon card-icon" />
              </div>
            </div>
          </div>

          <div className="card disconnected-card">
            <div className="card-inner">
              <div>
                <p className="card-label">Cámaras Desconectadas</p>
                <p className="card-number">{disconnectedCameras}</p>
              </div>
              <div className="icon-circle disconnected-icon-bg">
                <WifiOff className="icon card-icon" />
              </div>
            </div>
          </div>

          <div className="card total-card">
            <div className="card-inner">
              <div>
                <p className="card-label">Total de Cámaras</p>
                <p className="card-number">{cameras.length}</p>
              </div>
              <div className="icon-circle total-icon-bg">
                <Camera className="icon card-icon" />
              </div>
            </div>
          </div>
        </div>

        <div className="camera-grid">
          {filteredCameras.map((camera, index) => (
            <div
              key={camera.id}
              className={`camera-card ${
                camera.status === 'connected' ? 'camera-connected' : 'camera-disconnected'
              }`}
            >
              <div className="camera-card-header">
                <div className="camera-title-flex">
                  <div className={`status-dot ${camera.status === 'connected' ? 'dot-connected' : 'dot-disconnected'}`}></div>
                  <h3 className="camera-name">{camera.name}</h3>
                </div>
                {camera.status === 'connected' ? (
                  <Wifi className="icon camera-status-icon connected-icon" />
                ) : (
                  <WifiOff className="icon camera-status-icon disconnected-icon" />
                )}
                <button 
                  onClick={() => removeCamera(camera.id)}
                  className="btn-remove-individual"
                  disabled={cameras.length <= 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="camera-stream-box">
                {index === 0 ? (
                  <video
                    ref={videoRef}
                    className="live-video"
                    autoPlay
                    muted
                    playsInline
                  ></video>
                ) : (
                  <div className="no-stream">
                    <AlertCircle className="icon alert-icon" />
                    <p className="stream-text">Inactiva</p>
                  </div>
                )}
              </div>

              <div className="camera-footer">
                <span className="footer-label">IP:</span>
                <span className="footer-value">{camera.ip}</span>
                <br />
                <span className="footer-label">Área:</span>
                <span className="footer-value">{camera.area}</span>
                <br />
                <span className="footer-label">Última conexión:</span>
                <span className="footer-value">
                  {camera.status === 'connected' ? 'Ahora' : camera.lastSeen}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CamaraAdmin;
