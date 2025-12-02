import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import "../../CSS/Validar.css";

function Validar() {
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSalir = () => {
    navigate("/");
  };

  const handleValidar = async () => {
    try {
      const res = await api.post("/users/validar-usuario", {
        id,
        password,
      });

      const roleRaw = res?.data?.user?.role || "";
      const role = roleRaw.trim().toLowerCase(); 


      if (role === "admin") {
        navigate("/colaborador");
      } 
      else if (role === "operator" || role === "colaborador") {
        navigate("/colaborador");
      } 
      else if (role === "superadmin") {
        navigate("/superadmin");
      } 
      else {
        navigate("/");
      }

    } catch (err) {
      setError(
        err.response?.data?.error || "Error al validar usuario"
      );
    }
  };

  return (
    <div id="validar">
      <button onClick={handleSalir} className="boton-salir">×</button>

      <div className="container">
        <img src={logo} className="logo" alt="Logo" />
        <h1 className="titulo">Validar Usuario</h1>

        {error && <Alert variant="danger">{error}</Alert>}


        <Form onSubmit={(e) => e.preventDefault()}>
          <Form.Control
            type="text"
            placeholder="ID"
            className="input-field"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />

          <Form.Control
            type="password"
            placeholder="Contraseña"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="button" 
            onClick={handleValidar}
            className="boton-enter"
            variant="primary"
          >
            Validar usuario
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Validar;
