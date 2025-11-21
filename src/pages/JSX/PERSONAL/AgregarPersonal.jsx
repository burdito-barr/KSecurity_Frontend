import React from "react";
import { Save, X } from "lucide-react";

function AgregarPersonal({
  showModal,
  setShowModal,
  formData,
  setFormData,
  handleFormSubmit,
  editingUser
}) {
  if (!showModal) return null;

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        {/* ======= Encabezado ======= */}
        <div className="modal-header">
          <h2>{editingUser ? "Editar Usuario" : "Agregar Usuario"}</h2>
          <button onClick={() => setShowModal(false)}>
            <X />
          </button>
        </div>

        {/* ======= Formulario ======= */}
        <form onSubmit={handleFormSubmit}>
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleFormChange}
            placeholder="Nombre"
            required
          />
          <input
            name="apellido"
            value={formData.apellido}
            onChange={handleFormChange}
            placeholder="Apellido"
            required
          />
          <input
            name="correo"
            value={formData.correo}
            onChange={handleFormChange}
            placeholder="Correo"
            type="email"
            required
          />
          <input
            name="contraseña"
            value={formData.contraseña}
            onChange={handleFormChange}
            placeholder="Contraseña"
            type="password"
            required
          />

          <select
            name="rol"
            value={formData.rol}
            onChange={handleFormChange}
            required
          >
            <option value="admin">Administrador</option>
            <option value="colaborador">Colaborador</option>
          </select>

          {/* ======= Checkbox Activo/Inactivo centrado ======= */}
          <div className="estado-container">
            <label htmlFor="activo">
              {formData.activo ? "Activo" : "Inactivo"}
            </label>
            <input
              type="checkbox"
              id="activo"
              name="activo"
              checked={formData.activo}
              onChange={handleFormChange}
            />
          </div>

          {/* ======= Botones ======= */}
          <div className="modal-actions">
            <button type="submit">
              <Save /> {editingUser ? "Actualizar" : "Guardar"}
            </button>
            <button type="button" onClick={() => setShowModal(false)}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AgregarPersonal;
