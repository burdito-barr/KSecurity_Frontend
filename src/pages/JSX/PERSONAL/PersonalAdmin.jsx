import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { UserPlus, UserMinus, Edit3 } from "lucide-react";
import "../../CSS/personal.css";
import AddPersonalModal from "./AgregarPersonal";

function Personal() {
  const [sidebarActive, setSidebarActive] = useState(false);
  const toggleSidebar = () => setSidebarActive(!sidebarActive);

  const [users, setUsers] = useState([
    { id: 1, nombre: "Juan", apellido: "Pérez", correo: "juan.perez@email.com", rol: "admin", activo: true, contraseña: "password123" },
    { id: 2, nombre: "María", apellido: "García", correo: "maria.garcia@email.com", rol: "colaborador", activo: true, contraseña: "password456" },
    { id: 3, nombre: "Carlos", apellido: "Rodríguez", correo: "carlos.rodriguez@email.com", rol: "colaborador", activo: false, contraseña: "password789" }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    rol: "colaborador",
    activo: true,
    contraseña: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const term = searchTerm.toLowerCase();
    return users.filter(user =>
      user.nombre.toLowerCase().includes(term) ||
      user.apellido.toLowerCase().includes(term) ||
      user.correo.toLowerCase().includes(term) ||
      user.id.toString().includes(term)
    );
  }, [users, searchTerm]);

  const getStatusColor = (activo) => activo ? "activo" : "inactivo";

  const handleEdit = (user) => {
    setFormData(user);
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = (userId) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...formData, id: editingUser.id } : u));
    } else {
      const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
      setUsers([...users, { ...formData, id: nextId }]);
    }
    setShowModal(false);
    setEditingUser(null);

    setFormData({
      nombre: "",
      apellido: "",
      correo: "",
      rol: "colaborador",
      activo: true,
      contraseña: ""
    });
  };

  return (
    <div id="personal">

      {/* Sidebar button */}
      <button className={`open-btn ${sidebarActive ? "hide-btn" : ""}`} onClick={toggleSidebar}>
        ☰ Abrir Menú
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarActive ? "active" : ""}`}>
        <img src={logo} alt="Logo Sidebar" className="logo" />
        <Link to="/super-admin">Inicio</Link>
        <Link to="/camara-admin">Cámaras</Link>
        <Link to="/reportes-admin">Reportes</Link>
        <Link to="/permisos">Permisos</Link>
        <Link to="/auditoriables-admin">Auditoriable</Link>
        <Link to="/">Salir de sesión</Link>
      </div>

      {sidebarActive && <div className="overlay active" onClick={() => setSidebarActive(false)} />}

      <main className={`main-content ${sidebarActive ? "sidebar-open" : ""}`}>
        <div className="header-info">
          <img src={logo} alt="Logo Central" className="logo-central" />
          <h1 className="title">Personal y Registros</h1>
        </div>

        <div className="user-table-container">
          <div className="controls">
            <input
              type="text"
              placeholder="Buscar por nombre, apellido, correo o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => setShowModal(true)}>
              <UserPlus /> Agregar Personal
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length === 0 && <tr><td colSpan="6">No se encontraron usuarios</td></tr>}
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.nombre} {user.apellido}</td>
                  <td>{user.correo}</td>
                  <td>{user.rol}</td>
                  <td className={getStatusColor(user.activo)}>
                    {user.activo ? "✔️ Activo" : "❌ Inactivo"}
                  </td>

                  <td className="actions">
                    <button onClick={() => handleEdit(user)} title="Editar"><Edit3 /></button>
                    <button onClick={() => handleDelete(user.id)} title="Eliminar"><UserMinus /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AddPersonalModal
          showModal={showModal}
          setShowModal={setShowModal}
          formData={formData}
          setFormData={setFormData}
          handleFormSubmit={handleFormSubmit}
          editingUser={editingUser}
        />

      </main>
    </div>
  );
}

export default Personal;
