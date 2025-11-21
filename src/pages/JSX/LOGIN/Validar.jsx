import React from "react";
import { Form, Button } from "react-bootstrap";
import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import "../../CSS/Validar.css";

function Validar() {
  const navigate = useNavigate();

  const handleSalir = () => {
    navigate("/"); 
  };

  return (
    <div id="validar">
      {/* Botón Salir flotante */}
      <button 
        onClick={handleSalir} 
        className="boton-salir" 
        aria-label="Salir"
      >
        ×
      </button>

      {/* Contenedor principal */}
      <div className="container">
        <img src={logo} className="logo" alt="Logo" />
        <h1 className="titulo">Validar Usuario</h1>

        <Form>
          <Form.Control 
            type="text" 
            placeholder="ID" 
            className="input-field" 
          />
          <Form.Control 
            type="password" 
            placeholder="Contraseña" 
            className="input-field" 
          />
          <Button
            onClick={() => navigate("/colaborador")}
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
