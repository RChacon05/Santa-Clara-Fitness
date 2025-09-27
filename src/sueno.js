import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Sueno() {
  const STORAGE_KEY = "sueno_registros_v1";
  const STORAGE_META = "sueno_meta_v1";

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
  const hoyStr = new Date().toISOString().slice(0, 10);
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
          registros
            .filter((r) => r.fecha === d)
            .reduce((s, r) => s + r.horas, 0),
        0
      ) /
        7) *
        10
    ) / 10;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        fontFamily: "sans-serif",
      }}
    >
      {/* Contenido */}
      <div style={{ flex: 1, padding: "1rem" }}>
        <div style={{ maxWidth: "300px", margin: "0 auto" }}>
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
            <h1
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#2c3e50",
              }}
            >
              ⏰ Sueño
            </h1>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              Registra tus horas de descanso
            </p>
          </div>

          <div
            style={{ height: "1px", backgroundColor: "#e5e7eb", margin: "1rem 0" }}
          />

          {/* Estadísticas */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
                color: "#2c3e50",
              }}
            >
              Estadísticas
            </h3>
            <div
              style={{
                background: "white",
                padding: "1rem",
                borderRadius: "1rem",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#3498db",
                }}
              >
                {sumaHoy} h
              </div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                Hoy ({progreso}% de {metaHoras}h)
              </div>
              <div
                style={{
                  marginTop: "0.5rem",
                  fontSize: "0.875rem",
                  color: "#2c3e50",
                }}
              >
                Promedio 7 días: <strong>{promedio7} h</strong>
              </div>
            </div>
          </div>

          <div
            style={{ height: "1px", backgroundColor: "#e5e7eb", margin: "1rem 0" }}
          />

          {/* Botón añadir */}
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <button
              onClick={() => {
                setEditingId(null);
                setFecha(hoyStr);
                setHoras("");
                setShowModal(true);
              }}
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

          {/* Lista de registros */}
          <h3
            style={{
              fontSize: "1.1rem",
              fontWeight: "600",
              marginBottom: "0.5rem",
              color: "#2c3e50",
            }}
          >
            Registros
          </h3>
          <div
            style={{
              background: "white",
              padding: "1rem",
              borderRadius: "1rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              minHeight: "100px",
            }}
          >
            {registros.length === 0 ? (
              <div
                style={{ textAlign: "center", color: "#6b7280", padding: "1rem" }}
              >
                No hay registros aún
              </div>
            ) : (
              registros.map((r) => (
                <div
                  key={r.id}
                  style={{
                    padding: "0.5rem 0",
                    borderBottom: "1px solid #f3f4f6",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>{r.horas} h</strong>
                    <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      {r.fecha}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.25rem" }}>
                    <button
                      onClick={() => editar(r.id)}
                      style={{
                        backgroundColor: "#f3f4f6",
                        border: "none",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.25rem",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminar(r.id)}
                      style={{
                        backgroundColor: "#ffdddd",
                        border: "none",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.25rem",
                        cursor: "pointer",
                        fontSize: "0.75rem",
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
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "1rem",
                color: "#2c3e50",
              }}
            >
              {editingId ? "Editar registro" : "Añadir sueño"}
            </h3>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>Fecha</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Horas dormidas
              </label>
              <input
                type="number"
                min="0"
                max="24"
                step="0.1"
                placeholder="ej. 7.5"
                value={horas}
                onChange={(e) => setHoras(e.target.value)}
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
                  fontWeight: "600",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
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
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

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
                key={'home'}
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
                key={'sueno'}
                onClick={() => navigate("/sueno")}
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
                ⏰
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sueno;
