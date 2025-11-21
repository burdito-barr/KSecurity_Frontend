import React from "react";

function AgregarCamara({
  newCameraName,
  setNewCameraName,
  newCameraIP,
  setNewCameraIP,
  newCameraArea,
  setNewCameraArea,
  saveCamera,
  closeModal
}) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Agregar Nueva Cámara</h2>

        <label>Nombre de la cámara:</label>
        <input 
          type="text" 
          value={newCameraName} 
          onChange={(e) => setNewCameraName(e.target.value)} 
          placeholder="Ej: Cámara Oficina"
        />

        <label>Dirección IP:</label>
        <input 
          type="text" 
          value={newCameraIP} 
          onChange={(e) => setNewCameraIP(e.target.value)} 
          placeholder="Ej: 192.168.1.50"
        />

        <label>Área:</label>
        <input 
          type="text" 
          value={newCameraArea} 
          onChange={(e) => setNewCameraArea(e.target.value)} 
          placeholder="Ej: Estacionamiento"
        />

        <div className="modal-actions">
          <button onClick={saveCamera} className="btn-save">Guardar</button>
          <button onClick={closeModal} className="btn-cancel">Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default AgregarCamara;
