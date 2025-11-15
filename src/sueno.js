import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeContext";

function Sueno() {
  const STORAGE_KEY = "sueno_registros_v1";
  const STORAGE_META = "sueno_meta_v1";

  const { darkMode } = useTheme();
  const navigate = useNavigate();

  // Meta diaria
  const [metaHoras, setMetaHoras] = useState(() => {
    const m = localStorage.getItem(STORAGE_META);
    return m ? Number(m) : 8;
  });

  // Registros de sueño
  const [registros, setRegistros] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    try {
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Modal
  const [showModal, setShowModal] = useState(false);

  // Inputs
  const hoy = new Date();
  const hoyStr = hoy.toISOString().slice(0, 10);
  const [fecha, setFecha] = useState(hoyStr);
  const [horas, setHoras] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
  }, [registros]);

  useEffect(() => {
    localStorage.setItem(STORAGE_META, String(metaHoras));
  }, [metaHoras]);

  // Agregar o actualizar registro
  const handleSave = () => {
    const h = parseFloat(horas);
    if (Number.isNaN(h) || h <= 0 || h > 24) {
      alert("Ingresa un número válido de horas (1-24)");
      return;
    }
    const fechaSeleccionada = new Date(fecha);
    if (fechaSeleccionada > hoy) {
      alert("No puedes agregar registros para fechas futuras");
      return;
    }
    if (editingId) {
      setRegistros((prev) =>
        prev.map((r) => (r.id === editingId ? { ...r, fecha, horas: h } : r))
      );
      setEditingId(null);
    } else {
      const nuevo = { id: Date.now(), fecha, horas: h };
      setRegistros([nuevo, ...registros]);
    }
    setHoras("");
    setFecha(hoyStr);
    setShowModal(false);
  };

  // Editar
  const editar = (id) => {
    const r = registros.find((x) => x.id === id);
    if (!r) return;
    setFecha(r.fecha);
    setHoras(String(r.horas));
    setEditingId(id);
    setShowModal(true);
  };

  // Eliminar
  const eliminar = (id) => {
    if (!window.confirm("¿Eliminar este registro?")) return;
    setRegistros(registros.filter((r) => r.id !== id));
  };

  // Estadísticas
  const sumaHoy = registros
    .filter((r) => r.fecha === hoyStr)
    .reduce((s, r) => s + r.horas, 0);

  const progreso = Math.min(100, Math.round((sumaHoy / metaHoras) * 100));

  // Últimos 7 días
  const ult7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const promedio7 = Math.round(
    (ult7.reduce(
      (total, d) =>
        total +
        registros
          .filter((r) => r.fecha === d)
          .reduce((s, r) => s + r.horas, 0),
      0
    ) /
      7) *
      10
  ) / 10;

  const datosGrafico = ult7.map((fecha) => {
    const horasDia = registros
      .filter((r) => r.fecha === fecha)
      .reduce((total, r) => total + r.horas, 0);
    const fechaObj = new Date(fecha);
    const nombreDia = fechaObj.toLocaleDateString("es-ES", { weekday: "short" });
    const diaMes = fechaObj.getDate();
    return { fecha, nombreDia, diaMes, horas: horasDia, esHoy: fecha === hoyStr };
  });

  const renderGrafico = () => {
    const maxHoras = Math.max(metaHoras, ...datosGrafico.map((d) => d.horas), 1);
    return (
      <div style={{ marginTop: "1rem" }}>
        <div
          style={{
            fontSize: "0.6rem",
            color: darkMode ? "#9ca3af" : "#9ca3af",
            textAlign: "center",
            marginBottom: "8px",
          }}
        >
          Hoy: {hoyStr} | Rango: {datosGrafico[0]?.fecha} - {datosGrafico[6]?.fecha}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            height: "140px",
            gap: "4px",
          }}
        >
          {datosGrafico.map((dia) => (
            <div
              key={dia.fecha}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}
            >
              <div
                style={{
                  fontSize: "0.7rem",
                  color: darkMode ? "#d1d5db" : "#6b7280",
                  marginBottom: "4px",
                  fontWeight: dia.esHoy ? "600" : "400",
                  textAlign: "center",
                }}
              >
                <div>{dia.nombreDia}</div>
                <div style={{ fontSize: "0.6rem", color: darkMode ? "#9ca3af" : "#9ca3af" }}>
                  {dia.diaMes}
                </div>
                {dia.horas > 0 && (
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: darkMode ? "#f3f4f6" : "#374151",
                      fontWeight: "600",
                      marginTop: "2px",
                    }}
                  >
                    {dia.horas}h
                  </div>
                )}
              </div>
              <div
                style={{
                  width: "100%",
                  backgroundColor:
                    dia.horas >= metaHoras
                      ? "#34d399"
                      : dia.horas > metaHoras / 2
                      ? "#3498db"
                      : dia.horas <= metaHoras / 2 && dia.horas > 0
                      ? "#ef4444"
                      : darkMode
                      ? "#374151"
                      : "#e5e7eb",
                  height: `${(dia.horas / maxHoras) * 80}px`,
                  borderRadius: "4px 4px 0 0",
                  minHeight: "4px",
                }}
              ></div>
            </div>
          ))}
        </div>
        <div
          style={{
            position: "relative",
            height: "1px",
            backgroundColor: "#ef4444",
            marginTop: "8px",
            marginBottom: "16px",
          }}
        >
          <span
            style={{
              position: "absolute",
              right: "0",
              top: "-8px",
              fontSize: "0.7rem",
              color: "#ef4444",
              backgroundColor: darkMode ? "#111827" : "white",
              padding: "0 4px",
            }}
          >
            Meta: {metaHoras}h
          </span>
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
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <h1 style={{ fontSize: "1.25rem", fontWeight: "600" }}>⏰ Sueño</h1>
          <p style={{ fontSize: "0.875rem", color: darkMode ? "#d1d5db" : "#6b7280" }}>
            Registra tus horas de descanso
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "1rem", overflowY: "auto" }}>
        <div style={{ maxWidth: "300px", margin: "0 auto", width: "100%" }}>
          {/* Input para meta diaria */}
          <div style={{ marginBottom: "1rem", textAlign: "center" }}>
            <label style={{ fontSize: "0.875rem", color: darkMode ? "#d1d5db" : "#6b7280", marginRight: "0.5rem" }}>
              Meta diaria:
            </label>
            <input
              type="number"
              value={metaHoras}
              onChange={(e) => setMetaHoras(Number(e.target.value))}
              min={1}
              style={{
                width: "60px",
                padding: "0.25rem",
                borderRadius: "0.25rem",
                border: `1px solid ${darkMode ? "#4b5563" : "#d1d5db"}`,
                textAlign: "center",
                backgroundColor: darkMode ? "#374151" : "white",
                color: darkMode ? "#f9fafb" : "#111827",
              }}
            />
          </div>

          {/* Estadísticas */}
          <div
            style={{
              background: darkMode ? "#374151" : "white",
              padding: "1rem",
              borderRadius: "1rem",
              boxShadow: darkMode ? "0 4px 6px rgba(0,0,0,0.5)" : "0 4px 6px rgba(0,0,0,0.1)",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2rem", fontWeight: "700" }}>{sumaHoy} h</div>
            <p style={{ fontSize: "0.75rem", color: darkMode ? "#d1d5db" : "#6b7280" }}>
              Hoy ({progreso}% de tu meta diaria)
            </p>
            <p style={{ fontSize: "0.75rem", color: darkMode ? "#d1d5db" : "#6b7280" }}>
              Promedio últimos 7 días: {promedio7} h
            </p>
          </div>

          {/* Gráfico */}
          <div
            style={{
              background: darkMode ? "#374151" : "white",
              padding: "1rem",
              borderRadius: "1rem",
              boxShadow: darkMode ? "0 4px 6px rgba(0,0,0,0.5)" : "0 4px 6px rgba(0,0,0,0.1)",
              marginBottom: "1rem",
            }}
          >
            {renderGrafico()}
          </div>

          {/* Lista de registros */}
          <div
            style={{
              background: darkMode ? "#374151" : "white",
              padding: "1rem",
              borderRadius: "1rem",
              boxShadow: darkMode ? "0 4px 6px rgba(0,0,0,0.5)" : "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
              <button
                onClick={() => {
                  setEditingId(null);
                  setFecha(hoyStr);
                  setHoras("");
                  setShowModal(true);
                }}
                style={{
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                + Agregar registro
              </button>
            </div>

            {registros.length === 0 ? (
              <p style={{ textAlign: "center", color: darkMode ? "#d1d5db" : "#6b7280" }}>
                No hay registros aún
              </p>
            ) : (
              registros.map((r) => (
                <div
                  key={r.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.25rem 0",
                  }}
                >
                  <div>
                    <strong style={{ color: darkMode ? "#f9fafb" : "#111827" }}>{r.horas} h</strong>
                    <div style={{ fontSize: "0.75rem", color: darkMode ? "#d1d5db" : "#6b7280" }}>
                      {r.fecha}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.25rem" }}>
                    <button
                      onClick={() => editar(r.id)}
                      style={{
                        backgroundColor: darkMode ? "#4b5563" : "#e5e7eb",
                        border: "none",
                        borderRadius: "0.25rem",
                        padding: "0.25rem 0.5rem",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminar(r.id)}
                      style={{
                        backgroundColor: "#ef4444",
                        border: "none",
                        borderRadius: "0.25rem",
                        padding: "0.25rem 0.5rem",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        color: "white",
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
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
                fontWeight: "600",
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
                fontWeight: "600",
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
                fontWeight: "600",
              }}
            >
              💪
            </button>
            <button
              onClick={() => navigate("/sueño")}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              ⏰
            </button>
            <button
              onClick={() => navigate("/dieta")}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: darkMode ? "#374151" : "#e5e7eb",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                color: "white",
              }}
            >
              🍽️
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: darkMode ? "#1f2937" : "white",
              padding: "1.5rem",
              borderRadius: "1rem",
              width: "90%",
              maxWidth: "300px",
            }}
          >
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: darkMode ? "#f3f4f6" : "#111827" }}>
              {editingId ? "Editar registro" : "Nuevo registro"}
            </h2>

            <label style={{ display: "block", marginBottom: "0.25rem", color: darkMode ? "#f3f4f6" : "#111827" }}>
              Fecha
            </label>
            <input
              type="date"
              value={fecha}
              max={hoyStr}
              onChange={(e) => setFecha(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                border: "1px solid " + (darkMode ? "#4b5563" : "#d1d5db"),
                marginBottom: "1rem",
                background: darkMode ? "#111827" : "white",
                color: darkMode ? "#f3f4f6" : "#111827",
              }}
            />

            <label style={{ display: "block", marginBottom: "0.25rem", color: darkMode ? "#f3f4f6" : "#111827" }}>
              Horas
            </label>
            <input
              type="number"
              value={horas}
              onChange={(e) => setHoras(e.target.value)}
              min="0"
              max="24"
              step="0.1"
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                border: "1px solid " + (darkMode ? "#4b5563" : "#d1d5db"),
                marginBottom: "1rem",
                background: darkMode ? "#111827" : "white",
                color: darkMode ? "#f3f4f6" : "#111827",
              }}
            />

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  backgroundColor: "#ef4444",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  backgroundColor: "#34d399",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sueno;