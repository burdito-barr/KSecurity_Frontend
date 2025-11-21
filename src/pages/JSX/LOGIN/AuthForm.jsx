import React, { useState, } from "react";
import {  Form, Button } from "react-bootstrap";
import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import './AuthForm.css';


function ViewAuthForm() {

 const navigate =useNavigate();

 const [isActive, setIsActive] = useState(false);

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  return (
    <div className={`container ${isActive ? "active" : ""}`} id="container">
      {/* Registro */}
      <div className="form-container sign-up">
        <Form>
          <img src={logo} className="logo" alt="Logo" />
          <Form.Control type="text" placeholder="Nombre" className="mb-2" />
          <Form.Control
            type="email"
            placeholder="Correo Electrónico"
            className="mb-2"
          />
          <Button
            onClick={ () => navigate("/validar")}
            className="boton-enter"
            variant="primary"
          >
            Validar usuario
          </Button>
        </Form>
      </div>

      {/* Login */}
      <div className="form-container sign-in">
        <Form>
          <img src={logo} className="logo" alt="Logo" />
          <Form.Control type="text" placeholder="ID" className="mb-2" />
          <Form.Control
            type="password"
            placeholder="Contraseña"
            className="mb-2"
          />
          <Button
            onClick={ () => navigate("/super-admin")}
            className="boton-enter"
            variant="primary"
          >
            Entrar
          </Button>
        </Form>
      </div>

      {/* Toggle */}
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>¡Qué gusto verte de nuevo!</h1>
            <p>Nos alegra tenerte de vuelta</p>
            <Button
              variant="outline-light"
              id="login"
              className="hidden"
              onClick={handleLoginClick}
            >
              Soy administrador
            </Button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>¡Qué gusto verte de nuevo Administrador!</h1>
            <p>Nos alegra tenerte de vuelta</p>
            <Button
              variant="outline-light"
              id="register"
              className="hidden"
              onClick={handleRegisterClick}
            >
              Soy colaborador
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewAuthForm;
