import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Hidratacion from "./hidratacion";
import Actividad from "./actividad";
import Sueño from "./sueño";

function Home({ vasos, metaAgua, activities }) {
  const now = new Date();
  const progreso = (vasos / 8) * 100;
  const totalExercises = activities.length;

  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column", // organiza en columna
        height: "100vh",         // ocupa toda la pantalla
        width: "100%",           // ancho completo
        backgroundColor: "#f9fafb",
        fontFamily: "sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "1rem",
          background: "#f9fafb",
          flexShrink: 0,
        }}
      >
        <div style={{ maxWidth: "300px", margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.25rem", fontWeight: "600" }}>Mi Salud</h1>
          <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            {now.toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

        {/* Contenido scrollable */}
        <div
          style={{
            flex: 1, // ocupa todo el espacio disponible
            overflowY: "auto", // scroll solo aquí
            padding: "1rem",
          }}
        >
          {/* Contenedor centrado */}
        <div style={{ maxWidth: "300px", margin: "0 auto" }}>

          {/* Tarjeta Hidratación */}
          <div
            onClick={() => navigate("/hidratacion")}
            style={{
              cursor: "pointer",
              background: "white",
              padding: "1rem",
              borderRadius: "1rem",
              marginBottom: "1rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ color: "#3b82f6", fontWeight: "600" }}>💧 Hidratación</h2>
            <p style={{ fontSize: "2rem", fontWeight: "700" }}>
              {vasos}{" "}
              <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                / {metaAgua} vasos
              </span>
            </p>
            <div
              style={{
                background: "#e5e7eb",
                borderRadius: "9999px",
                height: "0.5rem",
              }}
            >
              <div
                style={{
                  background: "#3b82f6",
                  height: "0.5rem",
                  borderRadius: "9999px",
                  width: `${Math.min(progreso, 100)}%`,
                }}
              />
            </div>
            <p
              style={{
                fontSize: "0.75rem",
                color: "#6b7280",
                marginTop: "0.25rem",
              }}
            >
              {Math.round(progreso)}% de tu meta diaria
            </p>
          </div>

          {/* Tarjeta Actividad */}
          <div
            onClick={() => navigate("/actividad")}
            style={{
              cursor: "pointer",
              background: "white",
              padding: "1rem",
              borderRadius: "1rem",
              marginBottom: "1rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ color: "#f97316", fontWeight: "600" }}>💪 Actividad</h2>
            <p style={{ fontSize: "2rem", fontWeight: "700" }}>
              {totalExercises}{" "}
              <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                {totalExercises === 1 ? 'ejercicio' : 'ejercicios'}
              </span>
            </p>
            <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>
              {totalExercises === 0 ? 'No hay actividades registradas hoy' : 'Ver actividades'}
            </p>
          </div>

          {/* Tarjeta Sueño */}
          <div
            onClick={() => navigate("/sueño")}
            style={{
              cursor: "pointer",
              background: "white",
              padding: "1rem",
              borderRadius: "1rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ color: "#8b5cf6", fontWeight: "600" }}>⏰ Sueño</h2>
            <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>
              No hay registro de sueño
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div
        style={{
          padding: "1rem",
          background: "#f9fafb",
          flexShrink: 0,
        }}
      >
        <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "space-around", marginTop: "0.5rem" }}>
            <button
                key= {'home'}
                onClick={() => navigate("/")}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                🏠
              </button>
              <button
                key={'agua'}
                onClick={() => navigate("/hidratacion")}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#e5e7eb",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                💧
              </button>
              <button
                key={'actividad'}
                onClick={() => navigate("/actividad")}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#e5e7eb",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                💪
              </button>
              <button
                key={'sueño'}
                onClick={() => navigate("/sueño")}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#e5e7eb",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                ⏰
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const metaAgua = 8;
  const [vasos, setVasos] = useState(0);

  const [activities, setActivities] = useState([]);
  const [duration, setDuration] = useState(30);
  const [calories, setCalories] = useState("");

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Home vasos={vasos} setVasos={setVasos} metaAgua={metaAgua} activities={activities}/>}
        />
        <Route
          path="/hidratacion"
          element={<Hidratacion vasos={vasos} setVasos={setVasos} metaAgua={metaAgua} />}
        />
        <Route
          path="/actividad"
          element={<Actividad activities={activities} setActivities={setActivities} duration={duration} setDuration={setDuration} calories={calories} setCalories={setCalories}/>}
        />
        <Route
          path="/sueño"
          element={<Sueño/>}
        />
      </Routes>
    </Router>
  );
}
export default App;
