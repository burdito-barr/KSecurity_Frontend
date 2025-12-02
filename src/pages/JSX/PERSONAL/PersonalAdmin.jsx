import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { UserPlus, UserMinus, Edit3 } from "lucide-react";
import "../../CSS/personal.css";
import api from "../../../api/axios";
import AgregarPersonal from "./AgregarPersonal";

function Personal() {
  const [sidebarActive, setSidebarActive] = useState(false);
  const toggleSidebar = () => setSidebarActive(!sidebarActive);

  const [users, setUsers] = useState([]);

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

  // Cargar usuarios del backend
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users/list");

      const mappedUsers = res.data.map(user => {
        const [nombre, ...rest] = user.name.split(" ");
        const apellido = rest.join(" ");

        return {
          id: user.id,
          nombre: nombre,
          apellido: apellido || "",
          correo: user.email,
          rol: user.role,
          activo: user.active,
          contraseña: ""
        };
      });

      setUsers(mappedUsers);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  // Filtro de búsqueda
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

  // Eliminar usuario
  const handleDelete = async (userId) => {
    try {
      await api.delete(`/users/delete/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  // Crear / Editar usuario
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const fullName = `${formData.nombre} ${formData.apellido}`;

      if (editingUser) {
        // EDITAR
        await api.put(`/users/update/${editingUser.id}`, {
          name: fullName,
          email: formData.correo,
          role: formData.rol,
          active: formData.activo
        });
      } else {
        // CREAR
        await api.post("/users/register", {
          name: fullName,
          email: formData.correo,
          password: formData.contraseña,
          role: formData.rol
        });
      }

      await fetchUsers();
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

    } catch (error) {
      console.error("Error guardando usuario:", error);
    }
  };

  return (
    <div id="personal">

      {/* Sidebar Button */}
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
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6">No se encontraron usuarios</td>
                </tr>
              )}

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
                    <button onClick={() => handleEdit(user)} title="Editar">
                      <Edit3 />
                    </button>

                    <button onClick={() => handleDelete(user.id)} title="Eliminar">
                      <UserMinus />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AgregarPersonal
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
