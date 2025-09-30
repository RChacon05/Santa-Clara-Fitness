import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Actividad({activities, setActivities, duration, setDuration, calories, setCalories}) {
  const [showModal, setShowModal] = useState(false);
  const [activityType, setActivityType] = useState("running");
  const [customActivity, setCustomActivity] = useState("");

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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        backgroundColor: "#f9fafb",
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
              backgroundColor: "#f3f4f6",
              color: "#111827",
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
            <h1 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#2c3e50" }}>💪 Actividad</h1>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
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

          <div style={{ height: "1px", backgroundColor: "#e5e7eb", margin: "1rem 0" }}></div>

          {/* Estadísticas Semanales */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.5rem", color: "#2c3e50" }}>
              Estadísticas Semanales
            </h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              background: "white",
              padding: "1rem",
              borderRadius: "1rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              textAlign: "center"
            }}>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#3498db" }}>{totalMinutes}</div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>min totales</div>
              </div>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#3498db" }}>{totalCalories}</div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>calorías</div>
              </div>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#3498db" }}>{totalExercises}</div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>ejercicios</div>
              </div>
            </div>
          </div>

          <div style={{ height: "1px", backgroundColor: "#e5e7eb", margin: "1rem 0" }}></div>

          {/* Botón para añadir actividad */}
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <button
              onClick={() => setShowModal(true)}
              style={{
                backgroundColor: "#3498db",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                fontSize: "1.5rem",
                cursor: "pointer",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
            >
              +
            </button>
          </div>

          <div style={{ height: "1px", backgroundColor: "#e5e7eb", margin: "1rem 0" }}></div>

          {/* Actividades de Hoy */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.5rem", color: "#2c3e50" }}>
              Actividades de Hoy
            </h3>
            <div style={{
              background: "white",
              padding: "1rem",
              borderRadius: "1rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              minHeight: "100px"
            }}>
              {activities.length === 0 ? (
                <div style={{ textAlign: "center", color: "#6b7280", padding: "1rem" }}>
                  No hay actividades registradas hoy
                </div>
              ) : (
                activities.map(activity => (
                  <div 
                    key={activity.id} 
                    style={{
                      padding: "0.5rem 0",
                      borderBottom: "1px solid #f3f4f6",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <div>
                      <strong>{getActivityName(activity.type)}</strong>
                      <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                        {activity.duration} min
                        {activity.calories > 0 && ` • ${activity.calories} calorías`}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setActivities(activities.filter(a => a.id !== activity.id));
                      }}
                      style={{
                        backgroundColor: "#f3f4f6",
                        color: "#6b7280",
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

          {/* Contador de Pasos - MOVIDO AL FINAL */}
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.5rem", color: "#2c3e50" }}>
              👟 Contador de Pasos
            </h3>
            <div style={{
              background: "white",
              padding: "1rem",
              borderRadius: "1rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}>
              <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <div style={{ fontSize: "2rem", fontWeight: "700", color: "#ef4444" }}>
                  {stepsData.steps.toLocaleString()}
                </div>
                <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  pasos de {stepsData.goal.toLocaleString()}
                </div>
              </div>
              
              {/* Barra de progreso */}
              <div style={{ 
                height: "8px", 
                backgroundColor: "#e5e7eb", 
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
                color: "#6b7280"
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
                  <div style={{ fontSize: "0.65rem", color: "#6b7280" }}>Distancia</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1rem", fontWeight: "600", color: "#f59e0b" }}>
                    {stepsData.calories}
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "#6b7280" }}>Calorías</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1rem", fontWeight: "600", color: "#10b981" }}>
                    {stepsData.minutes}
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "#6b7280" }}>Minutos</div>
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
          background: "#f9fafb",
          flexShrink: 0,
        }}
      >
        <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "space-around", marginTop: "0.5rem" }}>
            <button
              onClick={() => navigate("/")}
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
              🏠
            </button>
            <button
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
              onClick={() => navigate("/actividad")}
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
              💪
            </button>
            <button
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
            <button
              onClick={() => navigate("/dieta")}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#e5e7eb",
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
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "1rem",
              width: "90%",
              maxWidth: "400px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: "#2c3e50" }}>
              Añadir Actividad
            </h3>

            {/* Input para actividad personalizada */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "#2c3e50" }}>
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
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                }}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "#2c3e50" }}>
                Tipo de actividad
              </label>
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
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
              <label style={{ display: "block", marginBottom: "0.5rem", color: "#2c3e50" }}>
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
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "#2c3e50" }}>
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
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#e5e7eb",
                  color: "#374151",
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
                  backgroundColor: "#3b82f6",
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