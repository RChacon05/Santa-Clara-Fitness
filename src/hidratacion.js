import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Hidratacion({ vasos, setVasos, metaAgua, setMetaAgua }) {
  const progreso = (vasos / metaAgua) * 100;
  const aguaConsumida = vasos * 250; // suponiendo 250ml por vaso
  const vasosRestantes = Math.max(metaAgua - vasos, 0);

  const navigate = useNavigate(); 

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
            <h1 style={{ fontSize: "1.25rem", fontWeight: "600" }}>💧 Hidratación</h1>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              Mantén tu cuerpo hidratado
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

          {/* Input para cambiar meta diaria */}
          <div style={{ marginBottom: "1rem", textAlign: "center" }}>
            <label style={{ fontSize: "0.875rem", color: "#6b7280", marginRight: "0.5rem" }}>
              Meta diaria:
            </label>
            <input 
              type="number" 
              value={metaAgua} 
              onChange={(e) => setMetaAgua(Number(e.target.value))} 
              min={1}
              style={{ width: "60px", padding: "0.25rem", borderRadius: "0.25rem", border: "1px solid #d1d5db", textAlign: "center" }}
            />
          </div>

          {/* Contador */}
          <div style={{ 
            background: "white", 
            padding: "1rem", 
            borderRadius: "1rem", 
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)", 
            marginBottom: "1rem" 
          }}>
            <p style={{ fontSize: "2rem", fontWeight: "700", textAlign: "center" }}>
              {vasos} / {metaAgua} vasos
            </p>
            <div style={{ 
              background: "#e5e7eb", 
              borderRadius: "9999px", 
              height: "0.5rem", 
              margin: "0.5rem 0" 
            }}>
              <div style={{ 
                background: "#3b82f6", 
                height: "0.5rem", 
                borderRadius: "9999px", 
                width: `${Math.min(progreso, 100)}%` 
              }}></div>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", textAlign: "center" }}>
              {Math.round(progreso)}% de tu meta diaria
            </p>

            {/* Botones */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-around", 
              marginTop: "0.5rem" 
            }}>
              <button
                  key={'-'}
                  onClick={() => setVasos((prev) => Math.max(prev - 1, 0))}
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
                  -
                </button>
                <button
                  key={'+'}
                  onClick={() => setVasos((prev) => prev + 1)}
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
                  +
                </button>
            </div>
          </div>

          {/* Información adicional */}
          <div style={{ 
            background: "white", 
            padding: "1rem", 
            borderRadius: "1rem", 
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)", 
            display: "flex", 
            justifyContent: "space-between" 
          }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#3b82f6", fontWeight: "700" }}>{aguaConsumida}ml</p>
              <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>Agua consumida</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#10b981", fontWeight: "700" }}>{vasosRestantes}</p>
              <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>Vasos restantes</p>
            </div>
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
                key={'agua'}
                onClick={() => navigate("/hidratacion")}
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
    </div>
  );
}

export default Hidratacion;
