  import React, { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { useTheme } from "./ThemeContext";

  function Dieta({ meals, setMeals }) {
    const { darkMode } = useTheme();
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

    const macroGoals = {
      proteins: Math.round((goals.calories * 0.3) / 4),
      carbs: Math.round((goals.calories * 0.5) / 4),
      fats: Math.round((goals.calories * 0.2) / 9)
    };

    const navigate = useNavigate();

    const totalProteins = meals.reduce((total, meal) => total + (meal.proteins || 0), 0);
    const totalCarbs = meals.reduce((total, meal) => total + (meal.carbs || 0), 0);
    const totalFats = meals.reduce((total, meal) => total + (meal.fats || 0), 0);
    const totalCalories = meals.reduce((total, meal) => total + meal.calories, 0);

    const proteinCalories = totalProteins * 4;
    const carbCalories = totalCarbs * 4;
    const fatCalories = totalFats * 9;
    const totalCaloriesFromMacros = proteinCalories + carbCalories + fatCalories;

    const proteinPercentage = totalCaloriesFromMacros ? Math.round((proteinCalories / totalCaloriesFromMacros) * 100) : 0;
    const carbPercentage = totalCaloriesFromMacros ? Math.round((carbCalories / totalCaloriesFromMacros) * 100) : 0;
    const fatPercentage = totalCaloriesFromMacros ? Math.round((fatCalories / totalCaloriesFromMacros) * 100) : 0;

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
            )` : (darkMode ? "#4b5563" : "#e5e7eb"),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative"
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: darkMode ? "#1f2937" : "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: darkMode ? "#f9fafb" : "#2c3e50"
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
          backgroundColor: darkMode ? "#1f2937" : "#f9fafb",
          fontFamily: "sans-serif",
          color: darkMode ? "#f9fafb" : "#111827",
        }}
      >
        <div style={{ maxWidth: "300px", margin: "0 auto", width: "100%" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              marginBottom: "1rem",
              padding: "0.25rem 0.75rem",
              backgroundColor: darkMode ? "#374151" : "#f3f4f6",
              color: darkMode ? "#f9fafb" : "#111827",
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            ←
          </button>

          <div style={{ textAlign: "center", marginBottom: "1rem", position: "relative" }}>
            <h1 style={{ fontSize: "1.25rem", fontWeight: "600", color: darkMode ? "#f9fafb" : "#2c3e50" }}>🍽️ Control de Dieta</h1>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "1rem", overflowY: "auto" }}>
          <div style={{ maxWidth: "300px", margin: "0 auto", width: "100%" }}>
            <div style={{ height: "1px", backgroundColor: darkMode ? "#4b5563" : "#e5e7eb", margin: "1rem 0" }}></div>

            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.5rem", color: darkMode ? "#f9fafb" : "#2c3e50" }}>Resumen del Día</h3>
              <div style={{
                background: darkMode ? "#374151" : "white",
                padding: "1rem",
                borderRadius: "1rem",
                boxShadow: darkMode ? "0 4px 6px rgba(0,0,0,0.5)" : "0 4px 6px rgba(0,0,0,0.1)"
              }}>
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.875rem", fontWeight: "600", color: darkMode ? "#f9fafb" : "#2c3e50" }}>Objetivos Diarios</span>
                    <button 
                      onClick={() => setShowGoalsModal(true)}
                      style={{ backgroundColor: darkMode ? "#4b5563" : "#e5e7eb", color: darkMode ? "#f9fafb" : "white", border: "none", borderRadius: "0.5rem", padding: "0.25rem 0.75rem", cursor: "pointer", fontWeight: "600", fontSize: "1rem" }}
                    >
                      ⚙️
                    </button>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.875rem", color: darkMode ? "#d1d5db" : "#6b7280" }}>Calorías</span>
                    <span style={{ fontSize: "0.875rem", fontWeight: "600", color: darkMode ? "#f9fafb" : "#2c3e50" }}>{totalCalories}/{goals.calories}</span>
                  </div>
                  <div style={{ height: "8px", backgroundColor: darkMode ? "#4b5563" : "#e5e7eb", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ 
                      height: "100%", 
                      backgroundColor: "#ef4444", 
                      width: `${Math.min(100, (totalCalories / goals.calories) * 100)}%` 
                    }}></div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: darkMode ? "#d1d5db" : "#6b7280", marginBottom: "0.25rem" }}>Proteínas</div>
                    <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#3498db" }}>{totalProteins}g/{macroGoals.proteins}g</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: darkMode ? "#d1d5db" : "#6b7280", marginBottom: "0.25rem" }}>Carbohidratos</div>
                    <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#34d399" }}>{totalCarbs}g/{macroGoals.carbs}g</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: darkMode ? "#d1d5db" : "#6b7280", marginBottom: "0.25rem" }}>Grasas</div>
                    <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#fbbf24" }}>{totalFats}g/{macroGoals.fats}g</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.5rem", color: darkMode ? "#f9fafb" : "#2c3e50" }}>Distribución Calórica</h3>
              <div style={{ background: darkMode ? "#374151" : "white", padding: "1rem", borderRadius: "1rem", boxShadow: darkMode ? "0 4px 6px rgba(0,0,0,0.5)" : "0 4px 6px rgba(0,0,0,0.1)" }}>
                {renderCalorieDistribution()}
                <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#3498db" }}>{proteinPercentage}%</div>
                    <div style={{ fontSize: "0.75rem", color: darkMode ? "#d1d5db" : "#6b7280" }}>Proteínas</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#34d399" }}>{carbPercentage}%</div>
                    <div style={{ fontSize: "0.75rem", color: darkMode ? "#d1d5db" : "#6b7280" }}>Carbohidratos</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#fbbf24" }}>{fatPercentage}%</div>
                    <div style={{ fontSize: "0.75rem", color: darkMode ? "#d1d5db" : "#6b7280" }}>Grasas</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <button
                onClick={() => setShowModal(true)}
                style={{ backgroundColor: "#34d399", color: "white", border: "none", borderRadius: "50%", width: "50px", height: "50px", fontSize: "1.5rem", cursor: "pointer", boxShadow: darkMode ? "0 4px 6px rgba(0,0,0,0.5)" : "0 4px 6px rgba(0,0,0,0.1)" }}
              >
                +
              </button>
            </div>

            {/* Lista de comidas */}
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.5rem", color: darkMode ? "#f9fafb" : "#2c3e50" }}>Comidas de Hoy</h3>
              {["desayuno","almuerzo","merienda","cena"].map(type => (
                <div key={type} style={{ marginBottom: "1rem" }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                    padding: "0.5rem 0"
                  }}>
                    <h4 style={{ fontSize: "1rem", fontWeight: "600", color: darkMode ? "#f9fafb" : "#2c3e50", textTransform: "capitalize" }}>
                      {type}
                    </h4>
                    <span style={{ fontSize: "0.875rem", color: darkMode ? "#d1d5db" : "#6b7280" }}>
                      {mealsByType[type].reduce((sum, meal) => sum + meal.calories, 0)} cal
                    </span>
                  </div>
                  <div style={{
                    background: darkMode ? "#1f2937" : "white",
                    padding: "1rem",
                    borderRadius: "1rem",
                    boxShadow: darkMode ? "0 4px 6px rgba(0,0,0,0.5)" : "0 4px 6px rgba(0,0,0,0.1)"
                  }}>
                    {mealsByType[type].length === 0 ? (
                      <div style={{ textAlign: "center", color: darkMode ? "#d1d5db" : "#6b7280", padding: "0.5rem", fontSize: "0.875rem" }}>
                        No hay alimentos registrados
                      </div>
                    ) : (
                      mealsByType[type].map(meal => (
                        <div key={meal.id} style={{ padding: "0.75rem 0", borderBottom: darkMode ? "1px solid #4b5563" : "1px solid #f3f4f6" }}>
                          <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>{meal.name}</div>
                          <div style={{ fontSize: "0.875rem", color: darkMode ? "#d1d5db" : "#6b7280" }}>
                            P: {meal.proteins}g | C: {meal.carbs}g | G: {meal.fats}g | {meal.calories} kcal
                          </div>
                          <button
                            onClick={() => setMeals(meals.filter(m => m.id !== meal.id))}
                            style={{ 
                              marginTop: "0.5rem",
                              backgroundColor: darkMode ? "#374151" : "#f3f4f6", 
                              color: darkMode ? "#f9fafb" : "#6b7280", 
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

        {/* FOOTER */}
  <div style={{ padding: "1rem", background: darkMode ? "#1f2937" : "#f9fafb", flexShrink: 0 }}>
    <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: "0.5rem" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: darkMode ? "#374151" : "#e5e7eb",
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
            backgroundColor: darkMode ? "#374151" : "#e5e7eb",
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
            backgroundColor: darkMode ? "#374151" : "#e5e7eb",
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
          onClick={() => navigate("/sueno")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: darkMode ? "#374151" : "#e5e7eb",
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
            backgroundColor: "#3b82f6",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            color: "white",
            fontWeight: "600"
          }}
        >
          🍽️
        </button>
      </div>
    </div>
  </div>


        {/* Modales */}
        {showModal && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
            alignItems: "center", justifyContent: "center", zIndex: 50
          }}>
            <div style={{ backgroundColor: darkMode ? "#374151" : "white", padding: "1.5rem", borderRadius: "1rem", width: "90%", maxWidth: "400px" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: darkMode ? "#f9fafb" : "#2c3e50" }}>Agregar Comida</h2>
              <input placeholder="Nombre de comida" value={foodName} onChange={e => setFoodName(e.target.value)} style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #d1d5db", background: darkMode ? "#1f2937" : "white", color: darkMode ? "#f9fafb" : "#111827" }} />
              <input type="number" placeholder="Proteínas (g)" value={proteins} onChange={e => setProteins(e.target.value)} style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #d1d5db", background: darkMode ? "#1f2937" : "white", color: darkMode ? "#f9fafb" : "#111827" }} />
              <input type="number" placeholder="Carbohidratos (g)" value={carbs} onChange={e => setCarbs(e.target.value)} style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #d1d5db", background: darkMode ? "#1f2937" : "white", color: darkMode ? "#f9fafb" : "#111827" }} />
              <input type="number" placeholder="Grasas (g)" value={fats} onChange={e => setFats(e.target.value)} style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #d1d5db", background: darkMode ? "#1f2937" : "white", color: darkMode ? "#f9fafb" : "#111827" }} />
              <select value={mealType} onChange={e => setMealType(e.target.value)} style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #d1d5db", background: darkMode ? "#1f2937" : "white", color: darkMode ? "#f9fafb" : "#111827" }}>
                <option value="desayuno">Desayuno</option>
                <option value="almuerzo">Almuerzo</option>
                <option value="merienda">Merienda</option>
                <option value="cena">Cena</option>
              </select>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
                <button onClick={() => setShowModal(false)} style={{ padding: "0.5rem 1rem", borderRadius: "0.5rem", border: "none", backgroundColor: darkMode ? "#4b5563" : "#f3f4f6", color: darkMode ? "#f9fafb" : "#111827", cursor: "pointer" }}>Cancelar</button>
                <button onClick={handleAddMeal} style={{ padding: "0.5rem 1rem", borderRadius: "0.5rem", border: "none", backgroundColor: "#34d399", color: "white", cursor: "pointer" }}>Agregar</button>
              </div>
            </div>
          </div>
        )}

        {showGoalsModal && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
            alignItems: "center", justifyContent: "center", zIndex: 50
          }}>
            <div style={{ backgroundColor: darkMode ? "#374151" : "white", padding: "1.5rem", borderRadius: "1rem", width: "90%", maxWidth: "400px" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: darkMode ? "#f9fafb" : "#2c3e50" }}>Objetivo Calórico</h2>
              <input type="number" value={goals.calories} onChange={e => setGoals({ ...goals, calories: parseInt(e.target.value) })} style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #d1d5db", background: darkMode ? "#1f2937" : "white", color: darkMode ? "#f9fafb" : "#111827" }} />
              <button onClick={() => setShowGoalsModal(false)} style={{ width: "100%", padding: "0.5rem", borderRadius: "0.5rem", border: "none", backgroundColor: "#34d399", color: "white", cursor: "pointer" }}>Guardar</button>
            </div>
          </div>
        )}

      </div>
    );
  }

  export default Dieta;
