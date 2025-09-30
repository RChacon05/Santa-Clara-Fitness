import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Dieta({ meals, setMeals }) {
  const [showModal, setShowModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [foodName, setFoodName] = useState("");
  const [proteins, setProteins] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");
  const [mealType, setMealType] = useState("desayuno");
  const [goals, setGoals] = useState({
    calories: 2200
  });

  // Calcular objetivos de macronutrientes basados en distribución estándar
  const macroGoals = {
    proteins: Math.round((goals.calories * 0.3) / 4), // 30% de calorías de proteínas
    carbs: Math.round((goals.calories * 0.5) / 4),    // 50% de calorías de carbohidratos
    fats: Math.round((goals.calories * 0.2) / 9)      // 20% de calorías de grasas
  };

  const navigate = useNavigate();

  // Calcular totales del día
  const totalProteins = meals.reduce((total, meal) => total + (meal.proteins || 0), 0);
  const totalCarbs = meals.reduce((total, meal) => total + (meal.carbs || 0), 0);
  const totalFats = meals.reduce((total, meal) => total + (meal.fats || 0), 0);
  const totalCalories = meals.reduce((total, meal) => total + meal.calories, 0);

  // Calcular distribución calórica CORRECTA
  const proteinCalories = totalProteins * 4;
  const carbCalories = totalCarbs * 4;
  const fatCalories = totalFats * 9;
  const totalCaloriesFromMacros = proteinCalories + carbCalories + fatCalories;

  // Calcular porcentajes basados en el total real
  const proteinPercentage = totalCaloriesFromMacros ? Math.round((proteinCalories / totalCaloriesFromMacros) * 100) : 0;
  const carbPercentage = totalCaloriesFromMacros ? Math.round((carbCalories / totalCaloriesFromMacros) * 100) : 0;
  const fatPercentage = totalCaloriesFromMacros ? Math.round((fatCalories / totalCaloriesFromMacros) * 100) : 0;

  // Agrupar comidas por tipo
  const mealsByType = {
    desayuno: meals.filter(meal => meal.type === "desayuno"),
    almuerzo: meals.filter(meal => meal.type === "almuerzo"),
    merienda: meals.filter(meal => meal.type === "merienda"),
    cena: meals.filter(meal => meal.type === "cena")
  };

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
      date: new Date().toLocaleDateString('es-ES'),
      type: mealType
    };

    setMeals([...meals, meal]);
    setShowModal(false);
    setFoodName("");
    setProteins("");
    setCarbs("");
    setFats("");
    setMealType("desayuno");
  };

  // Función para renderizar el gráfico de distribución calórica
  const renderCalorieDistribution = () => {
    return (
      <div style={{ display: "flex", justifyContent: "center", margin: "1.5rem 0" }}>
        <div style={{ 
          width: "120px", 
          height: "120px", 
          borderRadius: "50%", 
          background: totalCaloriesFromMacros ? `conic-gradient(
            #3498db 0% ${proteinPercentage}%,
            #34d399 ${proteinPercentage}% ${proteinPercentage + carbPercentage}%,
            #fbbf24 ${proteinPercentage + carbPercentage}% ${proteinPercentage + carbPercentage + fatPercentage}%
          )` : "#e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative"
        }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.875rem",
            fontWeight: "600",
            color: "#2c3e50"
          }}>
            Distribución
          </div>
        </div>
      </div>
    );
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
            style={{ marginBottom: "1rem", padding: "0.25rem 0.75rem", backgroundColor: "#f3f4f6", color: "#111827", borderRadius: "0.5rem", border: "none", cursor: "pointer", fontWeight: "600" }}
          >
            ←
          </button>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "1rem", position: "relative" }}>
            <h1 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#2c3e50" }}>🍽️ Control de Dieta</h1>
          </div>
      </div>
      
      {/* Contenido principal */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "1rem", overflowY: "auto" }}>
        <div style={{ maxWidth: "300px", margin: "0 auto", width: "100%" }}>

          <div style={{ height: "1px", backgroundColor: "#e5e7eb", margin: "1rem 0" }}></div>

          {/* Estadísticas del día con objetivos */}
          <div style={{ marginBottom: "1.5rem" }}>
            
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.5rem", color: "#2c3e50" }}>Resumen del Día</h3>
            <div style={{ background: "white", padding: "1rem", borderRadius: "1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "#2c3e50" }}>Objetivos Diarios</span>
                  <button 
                    onClick={() => setShowGoalsModal(true)}
                    style={{ backgroundColor: "#e5e7eb", color: "white", border: "none", borderRadius: "0.5rem", padding: "0.25rem 0.75rem", cursor: "pointer", fontWeight: "600", fontSize: "1rem" }}
                  >
                    ⚙️
                  </button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>Calorías</span>
                  <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "#2c3e50" }}>{totalCalories}/{goals.calories}</span>
                </div>
                <div style={{ height: "8px", backgroundColor: "#e5e7eb", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ 
                    height: "100%", 
                    backgroundColor: "#ef4444", 
                    width: `${Math.min(100, (totalCalories / goals.calories) * 100)}%` 
                  }}></div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Proteínas</div>
                  <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#3498db" }}>{totalProteins}g/{macroGoals.proteins}g</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Carbohidratos</div>
                  <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#34d399" }}>{totalCarbs}g/{macroGoals.carbs}g</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Grasas</div>
                  <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#fbbf24" }}>{totalFats}g/{macroGoals.fats}g</div>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico de distribución calórica */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.5rem", color: "#2c3e50" }}>Distribución Calórica</h3>
            <div style={{ background: "white", padding: "1rem", borderRadius: "1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
              {renderCalorieDistribution()}
              <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#3498db" }}>{proteinPercentage}%</div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>Proteínas</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#34d399" }}>{carbPercentage}%</div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>Carbohidratos</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#fbbf24" }}>{fatPercentage}%</div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>Grasas</div>
                </div>
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

          {/* Lista de comidas por tipo */}
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.5rem", color: "#2c3e50" }}>Comidas de Hoy</h3>
            
            {["desayuno", "almuerzo", "merienda", "cena"].map(type => (
              <div key={type} style={{ marginBottom: "1rem" }}>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  marginBottom: "0.5rem",
                  padding: "0.5rem 0"
                }}>
                  <h4 style={{ fontSize: "1rem", fontWeight: "600", color: "#2c3e50", textTransform: "capitalize" }}>
                    {type}
                  </h4>
                  <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    {mealsByType[type].reduce((sum, meal) => sum + meal.calories, 0)} cal
                  </span>
                </div>
                
                <div style={{ background: "white", padding: "1rem", borderRadius: "1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                  {mealsByType[type].length === 0 ? (
                    <div style={{ textAlign: "center", color: "#6b7280", padding: "0.5rem", fontSize: "0.875rem" }}>
                      No hay alimentos registrados
                    </div>
                  ) : (
                    mealsByType[type].map(meal => (
                      <div key={meal.id} style={{ padding: "0.75rem 0", borderBottom: "1px solid #f3f4f6" }}>
                        <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>{meal.name}</div>
                        <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                          P: {meal.proteins}g | C: {meal.carbs}g | G: {meal.fats}g | {meal.calories} kcal
                        </div>
                        <button
                          onClick={() => setMeals(meals.filter(m => m.id !== meal.id))}
                          style={{ 
                            marginTop: "0.5rem",
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
            ))}
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
            <button onClick={() => navigate("/dieta")} style={{ padding: "0.5rem 1rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}>🍽️</button>
          </div>
        </div>
      </div>

      {/* Modal para añadir comida */}
      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }} onClick={() => setShowModal(false)}>
          <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "1rem", width: "90%", maxWidth: "400px" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: "#2c3e50" }}>Añadir Comida</h3>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "#2c3e50" }}>Tipo de comida</label>
              <select 
                value={mealType} 
                onChange={(e) => setMealType(e.target.value)}
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }}
              >
                <option value="desayuno">Desayuno</option>
                <option value="almuerzo">Almuerzo</option>
                <option value="merienda">Merienda</option>
                <option value="cena">Cena</option>
              </select>
            </div>

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

      {/* Modal para configurar objetivos */}
      {showGoalsModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }} onClick={() => setShowGoalsModal(false)}>
          <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "1rem", width: "90%", maxWidth: "400px" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: "#2c3e50" }}>Configurar Objetivos</h3>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "#2c3e50" }}>Calorías Diarias (kcal)</label>
              <input 
                type="number" 
                min="0"
                value={goals.calories} 
                onChange={(e) => setGoals({ calories: parseInt(e.target.value) || 0 })} 
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }} 
              />
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.5rem" }}>
                Los macronutrientes se ajustarán automáticamente:
                <br />• Proteínas: {macroGoals.proteins}g
                <br />• Carbohidratos: {macroGoals.carbs}g  
                <br />• Grasas: {macroGoals.fats}g
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button onClick={() => setShowGoalsModal(false)} style={{ padding: "0.5rem 1rem", backgroundColor: "#e5e7eb", color: "#374151", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}>Cancelar</button>
              <button onClick={() => setShowGoalsModal(false)} style={{ padding: "0.5rem 1rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dieta;