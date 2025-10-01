import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeContext";

function Actividad({activities, setActivities, duration, setDuration, calories, setCalories}) {
  const [showModal, setShowModal] = useState(false);
  const [activityType, setActivityType] = useState("running");
  const [customActivity, setCustomActivity] = useState("");
  const { darkMode } = useTheme();

  const navigate = useNavigate();

  // Datos quemados para el contador de pasos
  const [stepsData] = useState({
    steps: 8432,
    goal: 10000,
    distance: 6.2, // km
    calories: 320,
    minutes: 85 // minutos de caminata estimados
  });

  // Calcular estadísticas INCLUYENDO los pasos
  const totalMinutes = activities.reduce((total, activity) => total + activity.duration, 0) + stepsData.minutes;
  const totalCalories = activities.reduce((total, activity) => total + (activity.calories || 0), 0) + stepsData.calories;
  const totalExercises = activities.length + 1; // +1 por los pasos

  // Calcular progreso de pasos
  const stepsProgress = Math.min(100, (stepsData.steps / stepsData.goal) * 100);

  const handleAddActivity = () => {
    if (duration <= 0) {
      alert("La duración debe ser mayor a 0");
      return;
    }

    const type = customActivity.trim() !== "" ? customActivity.trim() : activityType;

    const newActivity = {
      id: Date.now(),
      type: type,
      duration: parseInt(duration),
      calories: calories ? parseInt(calories) : 0,
      date: new Date().toLocaleDateString('es-ES')
    };

    setActivities([...activities, newActivity]);
    setShowModal(false);
    setDuration(30);
    setCalories("");
    setCustomActivity("");
  };

  const getActivityName = (type) => {
    const activityNames = {
      running: "Correr",
      walking: "Caminar",
      cycling: "Ciclismo",
      swimming: "Natación",
      gym: "Gimnasio",
      yoga: "Yoga"
    };
    return activityNames[type] || type;
  };

  // Variables de colores para dark mode
  const bgMain = darkMode ? "#1f2937" : "#f9fafb";
  const bgCard = darkMode ? "#374151" : "white";
  const textPrimary = darkMode ? "#f9fafb" : "#2c3e50";
  const textSecondary = darkMode ? "#d1d5db" : "#6b7280";
  const borderInput = darkMode ? "#4b5563" : "#d1d5db";
  const btnBg = darkMode ? "#2563eb" : "#3b82f6";
  const btnBgSecondary = darkMode ? "#4b5563" : "#e5e7eb";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        backgroundColor: bgMain,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ maxWidth: "300px", margin: "0 auto", width: "100%" }}>
          {/* Botón de regreso */}
          <button
            onClick={() => navigate("/")}
            style={{
              marginBottom: "1rem",
              padding: "0.25rem 0.75rem",
              backgroundColor: btnBgSecondary,
              color: textPrimary,
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            ←
          </button>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <h1 style={{ fontSize: "1.25rem", fontWeight: "600", color: textPrimary }}>💪 Actividad</h1>
            <p style={{ fontSize: "0.875rem", color: textSecondary }}>
              Registra tu actividad diaria
            </p>
          </div>
      </div>
      {/* Contenido principal */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "1rem",
          overflowY: "auto",
        }}
      >
        {/* Contenedor de 300px */}
        <div style={{ maxWidth: "300px", margin: "0 auto", width: "100%" }}>

          <div style={{ height: "1px", backgroundColor: borderInput, margin: "1rem 0" }}></div>

          {/* Estadísticas Semanales */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.5rem", color: textPrimary }}>
              Estadísticas Semanales
            </h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              background: bgCard,
              padding: "1rem",
              borderRadius: "1rem",
              boxShadow: darkMode ? "0 4px 6px rgba(0,0,0,0.6)" : "0 4px 6px rgba(0,0,0,0.1)",
              textAlign: "center"
            }}>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#3498db" }}>{totalMinutes}</div>
                <div style={{ fontSize: "0.75rem", color: textSecondary }}>min totales</div>
              </div>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#3498db" }}>{totalCalories}</div>
                <div style={{ fontSize: "0.75rem", color: textSecondary }}>calorías</div>
              </div>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#3498db" }}>{totalExercises}</div>
                <div style={{ fontSize: "0.75rem", color: textSecondary }}>ejercicios</div>
              </div>
            </div>
          </div>

          <div style={{ height: "1px", backgroundColor: borderInput, margin: "1rem 0" }}></div>

          {/* Botón para añadir actividad */}
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <button
              onClick={() => setShowModal(true)}
              style={{
                backgroundColor: btnBg,
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                fontSize: "1.5rem",
                cursor: "pointer",
                boxShadow: darkMode ? "0 4px 6px rgba(0,0,0,0.6)" : "0 4px 6px rgba(0,0,0,0.1)",
              }}
            >
              +
            </button>
          </div>

          <div style={{ height: "1px", backgroundColor: borderInput, margin: "1rem 0" }}></div>

          {/* Actividades de Hoy */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.5rem", color: textPrimary }}>
              Actividades de Hoy
            </h3>
            <div style={{
              background: bgCard,
              padding: "1rem",
              borderRadius: "1rem",
              boxShadow: darkMode ? "0 4px 6px rgba(0,0,0,0.6)" : "0 4px 6px rgba(0,0,0,0.1)",
              minHeight: "100px"
            }}>
              {activities.length === 0 ? (
                <div style={{ textAlign: "center", color: textSecondary, padding: "1rem" }}>
                  No hay actividades registradas hoy
                </div>
              ) : (
                activities.map(activity => (
                  <div 
                    key={activity.id} 
                    style={{
                      padding: "0.5rem 0",
                      borderBottom: `1px solid ${darkMode ? "#4b5563" : "#f3f4f6"}`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <div>
                      <strong style={{ color: textPrimary }}>{getActivityName(activity.type)}</strong>
                      <div style={{ fontSize: "0.875rem", color: textSecondary }}>
                        {activity.duration} min
                        {activity.calories > 0 && ` • ${activity.calories} calorías`}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setActivities(activities.filter(a => a.id !== activity.id));
                      }}
                      style={{
                        backgroundColor: btnBgSecondary,
                        color: textSecondary,
                        border: "none",
                        borderRadius: "0.25rem",
                        padding: "0.25rem 0.5rem",
                        cursor: "pointer",
                        fontSize: "0.75rem"
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Contador de Pasos */}
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.5rem", color: textPrimary }}>
              👟 Contador de Pasos
            </h3>
            <div style={{
              background: bgCard,
              padding: "1rem",
              borderRadius: "1rem",
              boxShadow: darkMode ? "0 4px 6px rgba(0,0,0,0.6)" : "0 4px 6px rgba(0,0,0,0.1)",
            }}>
              <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <div style={{ fontSize: "2rem", fontWeight: "700", color: "#ef4444" }}>
                  {stepsData.steps.toLocaleString()}
                </div>
                <div style={{ fontSize: "0.875rem", color: textSecondary }}>
                  pasos de {stepsData.goal.toLocaleString()}
                </div>
              </div>
              
              {/* Barra de progreso */}
              <div style={{ 
                height: "8px", 
                backgroundColor: borderInput, 
                borderRadius: "4px", 
                overflow: "hidden",
                marginBottom: "0.5rem"
              }}>
                <div style={{ 
                  height: "100%", 
                  backgroundColor: "#ef4444", 
                  width: `${stepsProgress}%` 
                }}></div>
              </div>
              
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                fontSize: "0.75rem",
                color: textSecondary
              }}>
                <span>{Math.round(stepsProgress)}% completado</span>
                <span>{stepsData.goal - stepsData.steps} pasos restantes</span>
              </div>

              {/* Estadísticas adicionales */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "1fr 1fr 1fr", 
                gap: "0.5rem",
                marginTop: "1rem"
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1rem", fontWeight: "600", color: "#3498db" }}>
                    {stepsData.distance} km
                  </div>
                  <div style={{ fontSize: "0.65rem", color: textSecondary }}>Distancia</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1rem", fontWeight: "600", color: "#f59e0b" }}>
                    {stepsData.calories}
                  </div>
                  <div style={{ fontSize: "0.65rem", color: textSecondary }}>Calorías</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1rem", fontWeight: "600", color: "#10b981" }}>
                    {stepsData.minutes}
                  </div>
                  <div style={{ fontSize: "0.65rem", color: textSecondary }}>Minutos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "1rem",
          background: bgMain,
          flexShrink: 0,
        }}
      >
        <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "space-around", marginTop: "0.5rem" }}>
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: btnBgSecondary,
                color: textPrimary,
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              🏠
            </button>
            <button
              onClick={() => navigate("/hidratacion")}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: btnBgSecondary,
                color: textPrimary,
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              💧
            </button>
            <button
              onClick={() => navigate("/actividad")}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: btnBg,
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
              onClick={() => navigate("/sueño")}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: btnBgSecondary,
                color: textPrimary,
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              ⏰
            </button>
            <button
              onClick={() => navigate("/dieta")}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: btnBgSecondary,
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
              }}
            >
              🍽️
            </button>
          </div>
        </div>
      </div>

      {/* Modal para añadir actividad (se mantiene igual) */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: bgCard,
              padding: "1.5rem",
              borderRadius: "1rem",
              width: "90%",
              maxWidth: "400px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: textPrimary }}>
              Añadir Actividad
            </h3>

            {/* Input para actividad personalizada */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", color: textPrimary }}>
                Actividad personalizada (opcional)
              </label>
              <input
                type="text"
                placeholder="Ej: Escalada, Pilates..."
                value={customActivity}
                onChange={(e) => setCustomActivity(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: `1px solid ${borderInput}`,
                  borderRadius: "0.5rem",
                  backgroundColor: bgMain,
                  color: textPrimary,
                }}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", color: textPrimary }}>
                Tipo de actividad
              </label>
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: `1px solid ${borderInput}`,
                  borderRadius: "0.5rem",
                  backgroundColor: bgMain,
                  color: textPrimary,
                }}
              >
                <option value="running">Correr</option>
                <option value="walking">Caminar</option>
                <option value="cycling">Ciclismo</option>
                <option value="swimming">Natación</option>
                <option value="gym">Gimnasio</option>
                <option value="yoga">Yoga</option>
              </select>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", color: textPrimary }}>
                Duración (min)
              </label>
              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: `1px solid ${borderInput}`,
                  borderRadius: "0.5rem",
                  backgroundColor: bgMain,
                  color: textPrimary,
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", color: textPrimary }}>
                Calorías (opcional)
              </label>
              <input
                type="number"
                min="0"
                placeholder="Calorías quemadas"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: `1px solid ${borderInput}`,
                  borderRadius: "0.5rem",
                  backgroundColor: bgMain,
                  color: textPrimary,
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: btnBgSecondary,
                  color: textPrimary,
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleAddActivity}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: btnBg,
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Añadir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Actividad;
