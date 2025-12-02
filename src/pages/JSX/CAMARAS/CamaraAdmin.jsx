import React, { useState, useEffect, useRef } from 'react';
import "../../CSS/camaras-admin.css";
import logo from "../../../assets/logo.png";
import { Link } from "react-router-dom";
import { AlertCircle, Plus, Trash2 } from 'lucide-react';
import AgregarCamara from "./AgregarCamara";
import api from "../../../api/axios";

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
  const [cameras, setCameras] = useState([]);

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

  useEffect(() => {
    obtenerCamaras();
  }, []);

  const obtenerCamaras = async () => {
    try {
      const response = await api.get("/cameras/get-all");
      setCameras(response.data);
    } catch (error) {
      console.error("Error al obtener cámaras:", error);
    }
  };

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

  const saveCamera = async () => {
    if (!newCameraName.trim() || !newCameraIP.trim() || !newCameraArea.trim()) {
      alert("Por favor, completa todos los campos");
      return;
    }

    const newCamera = {
      name: newCameraName,
      ip: newCameraIP,
      area: newCameraArea,
      status: "connected"
    };

    try {
      await api.post("/cameras/create", newCamera);
      obtenerCamaras();

      setNewCameraName("");
      setNewCameraIP("");
      setNewCameraArea("");
      setShowModal(false);
    } catch (error) {
      console.error("Error creando cámara:", error);
      alert("No se pudo crear la cámara");
    }
  };

  const removeCamera = async (id) => {
    if (cameras.length <= 1) {
      return alert("No se puede eliminar la última cámara");
    }

    try {
      await api.delete(`/cameras/delete/${id}`);
      obtenerCamaras();
    } catch (error) {
      console.error("Error eliminando cámara:", error);
    }
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
            <button onClick={() => setShowModal(true)} className="btn-add-camera">
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
          <div className="card">
            <p>Cámaras Conectadas</p>
            <h2>{connectedCameras}</h2>
          </div>

          <div className="card">
            <p>Cámaras Desconectadas</p>
            <h2>{disconnectedCameras}</h2>
          </div>

          <div className="card">
            <p>Total de Cámaras</p>
            <h2>{cameras.length}</h2>
          </div>
        </div>

        <div className="camera-grid">
          {filteredCameras.map((camera, index) => (
            <div key={camera.id} className={`camera-card ${camera.status}`}>
              
              <div className="camera-card-header">
                <div className="camera-title-flex">
                  <span className={`status-dot ${camera.status === "connected" ? "dot-connected" : "dot-disconnected"}`}></span>
                  <h3>{camera.name}</h3>
                </div>

                <button
                  onClick={() => removeCamera(camera.id)}
                  className="btn-remove-individual"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="camera-stream-box">
                {index === 0 ? (
                  <video ref={videoRef} autoPlay muted playsInline className="live-video"/>
                ) : (
                  <div className="no-stream">
                    <AlertCircle className="alert-icon" />
                    <p>Inactiva</p>
                  </div>
                )}
              </div>

              <div className="camera-footer">
                <p><span className="footer-label">IP:</span> <span className="footer-value">{camera.ip}</span></p>
                <p><span className="footer-label">Área:</span> <span className="footer-value">{camera.area}</span></p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default CamaraAdmin;
