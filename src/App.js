import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Hidratacion from "./hidratacion";
import Actividad from "./actividad";
import Sueño from "./sueno";
import Dieta from "./dieta"; 
import { ThemeProvider, useTheme } from "./ThemeContext"; // ⬅️ Importamos el contexto

// =======================
// COMPONENTE HOME
// =======================
function Home({ vasos, metaAgua, activities, registrosSueno, metaSueno, meals }) {
  const now = new Date();
  const progreso = (vasos / metaAgua) * 100;
  const totalExercises = activities.length;
  const totalMeals = meals.length;

  const navigate = useNavigate();

  // Dark mode desde el contexto
  const { darkMode, toggleTheme } = useTheme();

  // -------------------------
  // Estadísticas de sueño
  // -------------------------
  const hoyStr = new Date().toISOString().slice(0, 10);

  const horasHoy = registrosSueno
    .filter((r) => r.fecha === hoyStr)
    .reduce((sum, r) => sum + r.horas, 0);

  function fechasUltimos7() {
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      arr.push(d.toISOString().slice(0, 10));
    }
    return arr;
  }

  const ult7 = fechasUltimos7();
  const promedio7 =
    Math.round(
      (ult7.reduce(
        (total, d) =>
          total +
          registrosSueno
            .filter((r) => r.fecha === d)
            .reduce((s, r) => s + r.horas, 0),
        0
      ) / 7) * 10
    ) / 10;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        backgroundColor: darkMode ? "#1f2937" : "#f9fafb",
        color: darkMode ? "white" : "black",
        fontFamily: "sans-serif",
      }}
    >
      {/* BOTÓN MODO OSCURO/CLARO */}
      <button
        onClick={toggleTheme}
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          background: darkMode ? "#111827" : "#e5e7eb",
          color: darkMode ? "white" : "black",
          border: "none",
          borderRadius: "9999px",
          padding: "0.5rem 0.75rem",
          cursor: "pointer",
          fontSize: "0.875rem",
        }}
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      {/* HEADER */}
      <div
        style={{
          padding: "1rem",
          background: darkMode ? "#111827" : "#f9fafb",
          flexShrink: 0,
        }}
      >
        <div style={{ maxWidth: "300px", margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.25rem", fontWeight: "600" }}>Mi Salud</h1>
          <p style={{ fontSize: "0.875rem", color: darkMode ? "#d1d5db" : "#6b7280" }}>
            {now.toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* CONTENIDO */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem",
        }}
      >
        <div style={{ maxWidth: "300px", margin: "0 auto" }}>
          {/* Tarjeta Hidratación */}
          <div
            onClick={() => navigate("/hidratacion")}
            style={{
              cursor: "pointer",
              background: darkMode ? "#374151" : "white",
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
              background: darkMode ? "#374151" : "white",
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
                {totalExercises === 1 ? "ejercicio" : "ejercicios"}
              </span>
            </p>
            <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>
              {totalExercises === 0
                ? "No hay actividades registradas hoy"
                : "Ver actividades"}
            </p>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: "0.25rem 0" }}>
              👟 8432 pasos
            </p>
          </div>

          {/* Tarjeta Sueño */}
          <div
            onClick={() => navigate("/sueño")}
            style={{
              cursor: "pointer",
              background: darkMode ? "#374151" : "white",
              padding: "1rem",
              borderRadius: "1rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ color: "#8b5cf6", fontWeight: "600" }}>⏰ Sueño</h2>
            {horasHoy === 0 ? (
              <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                No hay registro de sueño
              </p>
            ) : (
              <>
                <p style={{ fontSize: "2rem", fontWeight: "700" }}>
                  {horasHoy}{" "}
                  <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    / {metaSueno} horas
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
                      background: "#8b5cf6",
                      height: "0.5rem",
                      borderRadius: "9999px",
                      width: `${Math.min((horasHoy / metaSueno) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
                  {Math.round((horasHoy / metaSueno) * 100)}% de tu meta diaria • Promedio 7 días: {promedio7} h
                </p>
              </>
            )}
          </div>

          {/* Tarjeta Dieta */}
          <div
            onClick={() => navigate("/dieta")}
            style={{
              cursor: "pointer",
              background: darkMode ? "#374151" : "white",
              padding: "1rem",
              borderRadius: "1rem",
              marginTop: "1rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ color: "#34d399", fontWeight: "600" }}>🍽️ Dieta</h2>
            <p style={{ fontSize: "2rem", fontWeight: "700" }}>
              {totalMeals}{" "}
              <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                {totalMeals === 1 ? "comida" : "comidas"}
              </span>
            </p>
            <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>
              {totalMeals === 0 ? "No hay comidas registradas hoy" : "Ver comidas"}
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div
        style={{
          padding: "1rem",
          background: darkMode ? "#111827" : "#f9fafb",
          flexShrink: 0,
        }}
      >
        <div
          style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "0.5rem",
            }}
          >
            <button onClick={() => navigate("/")} style={{ padding: "0.5rem 1rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}>🏠</button>
            <button onClick={() => navigate("/hidratacion")} style={{ padding: "0.5rem 1rem", backgroundColor: "#e5e7eb", border: "none", borderRadius: "0.5rem", cursor: "pointer" }}>💧</button>
            <button onClick={() => navigate("/actividad")} style={{ padding: "0.5rem 1rem", backgroundColor: "#e5e7eb", border: "none", borderRadius: "0.5rem", cursor: "pointer" }}>💪</button>
            <button onClick={() => navigate("/sueño")} style={{ padding: "0.5rem 1rem", backgroundColor: "#e5e7eb", border: "none", borderRadius: "0.5rem", cursor: "pointer" }}>⏰</button>
            <button onClick={() => navigate("/dieta")} style={{ padding: "0.5rem 1rem", backgroundColor: "#e5e7eb", border: "none", borderRadius: "0.5rem", cursor: "pointer" }}>🍽️</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =======================
// COMPONENTE APP (Estados globales)
// =======================
function App() {
  const [metaAgua, setMetaAgua] = useState(8);
  const [vasos, setVasos] = useState(0);

  const [activities, setActivities] = useState([]);
  const [duration, setDuration] = useState(30);
  const [calories, setCalories] = useState("");

  // 🌙 Sueño
  const [metaSueno, setMetaSueno] = useState(8);
  const [registrosSueno, setRegistrosSueno] = useState(() => {
    const raw = localStorage.getItem("sueno_registros_v1");
    try {
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // 🍴 Dieta
  const [meals, setMeals] = useState(() => {
    const raw = localStorage.getItem("dieta_meals_v1");
    try {
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem("sueno_registros_v1", JSON.stringify(registrosSueno));
  }, [registrosSueno]);

  useEffect(() => {
    localStorage.setItem("dieta_meals_v1", JSON.stringify(meals));
  }, [meals]);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                vasos={vasos}
                metaAgua={metaAgua}
                activities={activities}
                registrosSueno={registrosSueno}
                metaSueno={metaSueno}
                meals={meals}
              />
            }
          />
          <Route
            path="/hidratacion"
            element={
              <Hidratacion
                vasos={vasos} 
                setVasos={setVasos} 
                metaAgua={metaAgua} 
                setMetaAgua={setMetaAgua}
              />
            }
          />
          <Route
            path="/actividad"
            element={
              <Actividad
                activities={activities}
                setActivities={setActivities}
                duration={duration}
                setDuration={setDuration}
                calories={calories}
                setCalories={setCalories}
              />
            }
          />
          <Route
            path="/sueño"
            element={
              <Sueño
                metaSueno={metaSueno}
                setMetaSueno={setMetaSueno}
                registrosSueno={registrosSueno}
                setRegistrosSueno={setRegistrosSueno}
              />
            }
          />
          <Route
            path="/dieta"
            element={
              <Dieta
                meals={meals}
                setMeals={setMeals}
              />
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
