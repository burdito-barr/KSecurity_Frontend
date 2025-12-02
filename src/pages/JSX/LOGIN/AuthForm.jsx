import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";
import api from "../../../api/axios";

function ViewAuthForm() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  // LOGIN CON BACKEND
  const handleLogin = async () => {
    try {
      const response = await api.post("/users/login", {
        email: loginData.email,
        password: loginData.password
      });

      const { token, user } = response.data;

      // Guardar token
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redireccionar según rol
      if (user.role === "SuperAdmin") {
        navigate("/super-admin");
      } else if (user.role === "admin", "colaborador") {
        navigate("/colaborador");
      } else {
        navigate("/colaborador");
      }

    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Credenciales incorrectas");
    }
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
            onClick={() => navigate("/validar")}
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

          {/* Correo */}
          <Form.Control
            type="email"
            name="email"
            placeholder="Correo electrónico"
            className="mb-2"
            value={loginData.email}
            onChange={handleChange}
          />

          {/* Contraseña */}
          <Form.Control
            type="password"
            name="password"
            placeholder="Contraseña"
            className="mb-2"
            value={loginData.password}
            onChange={handleChange}
          />

          <Button
            onClick={handleLogin}
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