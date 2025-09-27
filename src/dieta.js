import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Dieta({ meals, setMeals }) {
  const [showModal, setShowModal] = useState(false);
  const [foodName, setFoodName] = useState("");
  const [proteins, setProteins] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");

  const navigate = useNavigate();

  // Calcular totales del día
  const totalProteins = meals.reduce((total, meal) => total + (meal.proteins || 0), 0);
  const totalCarbs = meals.reduce((total, meal) => total + (meal.carbs || 0), 0);
  const totalFats = meals.reduce((total, meal) => total + (meal.fats || 0), 0);
  const totalCalories = meals.reduce((total, meal) => total + meal.calories, 0);

  const handleAddMeal = () => {
    if (!foodName.trim()) {
      alert("El nombre de la comida no puede estar vacío");
      return;
    }

    const meal = {
      id: Date.now(),
      name: foodName.trim(),
      proteins: parseInt(proteins) || 0,
      carbs: parseInt(carbs) || 0,
      fats: parseInt(fats) || 0,
      calories: ((parseInt(proteins) || 0) * 4) + ((parseInt(carbs) || 0) * 4) + ((parseInt(fats) || 0) * 9),
      date: new Date().toLocaleDateString('es-ES')
    };

    setMeals([...meals, meal]);
    setShowModal(false);
    setFoodName("");
    setProteins("");
    setCarbs("");
    setFats("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
      
      {/* Contenido principal */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "1rem", overflowY: "auto" }}>
        <div style={{ maxWidth: "300px", margin: "0 auto", width: "100%" }}>

          {/* Botón de regreso */}
          <button
            onClick={() => navigate("/")}
            style={{ marginBottom: "1rem", padding: "0.25rem 0.75rem", backgroundColor: "#f3f4f6", color: "#111827", borderRadius: "0.5rem", border: "none", cursor: "pointer", fontWeight: "600" }}
          >
            ←
          </button>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <h1 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#2c3e50" }}>🍽️ Dieta</h1>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              Controla tus comidas y macros
            </p>
          </div>

          <div style={{ height: "1px", backgroundColor: "#e5e7eb", margin: "1rem 0" }}></div>

          {/* Estadísticas del día */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.5rem", color: "#2c3e50" }}>Totales del día</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", background: "white", padding: "1rem", borderRadius: "1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", textAlign: "center" }}>
              <div>
                <div style={{ fontSize: "1.25rem", fontWeight: "700", color: "#3498db" }}>{totalProteins}g</div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>Proteínas</div>
              </div>
              <div>
                <div style={{ fontSize: "1.25rem", fontWeight: "700", color: "#34d399" }}>{totalCarbs}g</div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>Carbs</div>
              </div>
              <div>
                <div style={{ fontSize: "1.25rem", fontWeight: "700", color: "#fbbf24" }}>{totalFats}g</div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>Grasas</div>
              </div>
              <div>
                <div style={{ fontSize: "1.25rem", fontWeight: "700", color: "#ef4444" }}>{totalCalories}</div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>Calorías</div>
              </div>
            </div>
          </div>

          {/* Botón para añadir comida */}
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <button
              onClick={() => setShowModal(true)}
              style={{ backgroundColor: "#34d399", color: "white", border: "none", borderRadius: "50%", width: "50px", height: "50px", fontSize: "1.5rem", cursor: "pointer", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
            >
              +
            </button>
          </div>

          {/* Lista de comidas */}
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.5rem", color: "#2c3e50" }}>Comidas de Hoy</h3>
            <div style={{ background: "white", padding: "1rem", borderRadius: "1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", minHeight: "100px" }}>
              {meals.length === 0 ? (
                <div style={{ textAlign: "center", color: "#6b7280", padding: "1rem" }}>No hay comidas registradas hoy</div>
              ) : (
                meals.map(meal => (
                  <div key={meal.id} style={{ padding: "0.5rem 0", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong>{meal.name}</strong>
                      <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                        {meal.proteins}g P • {meal.carbs}g C • {meal.fats}g F • {meal.calories} kcal
                      </div>
                    </div>
                    <button
                      onClick={() => setMeals(meals.filter(m => m.id !== meal.id))}
                      style={{ backgroundColor: "#f3f4f6", color: "#6b7280", border: "none", borderRadius: "0.25rem", padding: "0.25rem 0.5rem", cursor: "pointer", fontSize: "0.75rem" }}
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "1rem", background: "#f9fafb", flexShrink: 0 }}>
        <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "space-around", marginTop: "0.5rem" }}>
            <button onClick={() => navigate("/")} style={{ padding: "0.5rem 1rem", backgroundColor: "#e5e7eb", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}>🏠</button>
            <button onClick={() => navigate("/hidratacion")} style={{ padding: "0.5rem 1rem", backgroundColor: "#e5e7eb", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}>💧</button>
            <button onClick={() => navigate("/actividad")} style={{ padding: "0.5rem 1rem", backgroundColor: "#e5e7eb", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}>💪</button>
            <button onClick={() => navigate("/sueño")} style={{ padding: "0.5rem 1rem", backgroundColor: "#e5e7eb", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}>⏰</button>
          </div>
        </div>
      </div>

      {/* Modal para añadir comida */}
      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }} onClick={() => setShowModal(false)}>
          <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "1rem", width: "90%", maxWidth: "400px" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: "#2c3e50" }}>Añadir Comida</h3>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "#2c3e50" }}>Nombre de la comida</label>
              <input type="text" value={foodName} onChange={(e) => setFoodName(e.target.value)} style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }} />
            </div>

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "0.25rem", color: "#2c3e50" }}>Proteínas (g)</label>
                <input type="number" min="0" value={proteins} onChange={(e) => setProteins(e.target.value)} style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "0.25rem", color: "#2c3e50" }}>Carbs (g)</label>
                <input type="number" min="0" value={carbs} onChange={(e) => setCarbs(e.target.value)} style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "0.25rem", color: "#2c3e50" }}>Grasas (g)</label>
                <input type="number" min="0" value={fats} onChange={(e) => setFats(e.target.value)} style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }} />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button onClick={() => setShowModal(false)} style={{ padding: "0.5rem 1rem", backgroundColor: "#e5e7eb", color: "#374151", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}>Cancelar</button>
              <button onClick={handleAddMeal} style={{ padding: "0.5rem 1rem", backgroundColor: "#34d399", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}>Añadir</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Dieta;
