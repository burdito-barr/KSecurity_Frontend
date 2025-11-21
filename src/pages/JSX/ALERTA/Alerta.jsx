import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../../CSS/alerta.css";


export default function Alerta({
  title = "Evento de emergencia",
  urgency = "ALTA", // BAJA | MEDIA | ALTA
  status = "ESPERANDO",
  detailsLink = "/reportes-admin",
  intervalMs = 8000,
  durationMs = 8000,
  startImmediately = false,
}) {
  const [visible, setVisible] = useState(startImmediately);
  const timerRef = useRef(null);
  const intervalRef = useRef(null);

  const showAlert = () => {
    if (visible) return;
    setVisible(true);
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setVisible(false);
    }, durationMs);
  };

  useEffect(() => {
    intervalRef.current = setInterval(showAlert, intervalMs);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timerRef.current);
    };
  }, [intervalMs, durationMs, visible]);

  const handleClose = () => {
    setVisible(false);
    clearTimeout(timerRef.current);
  };

  const urgencyClass = urgency.toLowerCase(); // "baja", "media", "alta"

  return (
    <div id="alerta">
      <div className={`alerta-card-container ${visible ? "show" : ""}`}>
        <div className={`alerta-card ${urgencyClass}`}>
          <button className="alerta-close" onClick={handleClose}>×</button>

          <div className="alerta-content">
            <h2 className="alerta-title">{title}</h2>
            <p>Urgencia: <strong>{urgency}</strong></p>
            <p>Estado: <strong>{status}</strong></p>
            <Link to={detailsLink} className="alerta-link">
              Ver detalles →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
