"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { solveTransport } from "../services/transportService";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "react-bootstrap";

export default function TransportPage() {
  const [numSuppliers, setNumSuppliers] = useState(3);
  const [numDemands, setNumDemands] = useState(4);
  const [supply, setSupply] = useState(new Array(numSuppliers).fill(0));
  const [demand, setDemand] = useState(new Array(numDemands).fill(0));
  const [costs, setCosts] = useState(
    Array.from({ length: numSuppliers }, () => new Array(numDemands).fill(0))
  );
  const [method, setMethod] = useState("northwest");
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const router = useRouter();

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    
    // Validar oferta
    if (supply.some(val => val <= 0)) {
      errors.supply = "Todos los valores de oferta deben ser mayores a 0";
    }
    
    // Validar demanda
    if (demand.some(val => val <= 0)) {
      errors.demand = "Todos los valores de demanda deben ser mayores a 0";
    }
    
    // Validar costos
    if (costs.some(row => row.some(cost => cost < 0))) {
      errors.costs = "Todos los costos deben ser mayores o iguales a 0";
    }
    
    // Validar balance (solo advertencia, no error)
    // const totalSupply = supply.reduce((sum, val) => sum + val, 0);
    // const totalDemand = demand.reduce((sum, val) => sum + val, 0);
    // if (Math.abs(totalSupply - totalDemand) > 0.01) {
    //   errors.balance = `El problema debe estar balanceado. Oferta total: ${totalSupply}, Demanda total: ${totalDemand}`;
    // }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNumSuppliersChange = (e) => {
    const newNum = Number(e.target.value);
    setNumSuppliers(newNum);
    setSupply(new Array(newNum).fill(0));
    setCosts(Array.from({ length: newNum }, () => new Array(numDemands).fill(0)));
    setValidationErrors({});
  };

  const handleNumDemandsChange = (e) => {
    const newNum = Number(e.target.value);
    setNumDemands(newNum);
    setDemand(new Array(newNum).fill(0));
    setCosts((prevCosts) =>
      prevCosts.map((row) => new Array(newNum).fill(0))
    );
    setValidationErrors({});
  };

  const handleSupplyChange = (index, value) => {
    const newSupply = [...supply];
    newSupply[index] = Number(value);
    setSupply(newSupply);
    setValidationErrors({});
  };

  const handleDemandChange = (index, value) => {
    const newDemand = [...demand];
    newDemand[index] = Number(value);
    setDemand(newDemand);
    setValidationErrors({});
  };

  const handleCostChange = (i, j, value) => {
    setCosts((prevCosts) => {
      const updatedCosts = prevCosts.map((row) => [...row]);
      updatedCosts[i][j] = Number(value);
      return updatedCosts;
    });
    setValidationErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const requestData = { supply, demand, costs, method };
      console.log("📡 Enviando datos al backend:", requestData);
      const result = await solveTransport(requestData);
      console.log("📩 Respuesta recibida del backend:", result);
      setSolution(result);
      setError(null);
    } catch (err) {
      console.error("❌ Error en la solicitud:", err);
      setError(err.message || "Error en la entrada. Asegúrate de llenar todos los campos.");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para obtener el nombre del método en español
  const getMethodName = (method) => {
    const methodNames = {
      "northwest": "Esquina Noroeste",
      "minimum_cost": "Costo Mínimo",
      "vogel": "Aproximación de Vogel"
    };
    return methodNames[method] || method;
  };

  const renderMatrixTable = (matrix, title, color = "primary") => (
    <div className="card mb-4">
      <div className={`card-header bg-${color} text-white`}>
        <h5 className="mb-0">{title}</h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <tbody>
              {matrix.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="text-center fw-bold">
                      {cell > 0 ? (
                        <span className="badge bg-success">{cell}</span>
                      ) : (
                        <span className="text-muted">0</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Calcula totales para advertencia visual
  const totalSupply = supply.reduce((sum, val) => sum + val, 0);
  const totalDemand = demand.reduce((sum, val) => sum + val, 0);

  return (
    <div className="container-fluid bg-light min-vh-100">
      {/* Navbar mejorado */}
      <nav className="navbar navbar-dark bg-dark p-3 shadow">
        <button onClick={() => router.push("/")} className="btn btn-outline-light">
          ⬅ Regresar al Inicio
        </button>
        <h3 className="text-white mx-auto mb-0">
          📦 Problema de Transporte
        </h3>
        <div className="text-white">
          <small>Optimización de Distribución</small>
        </div>
      </nav>

      {/* Espacio para evitar solapamiento con el Navbar */}
      <div className="pt-5 mt-5">
        <div className="container my-4">
          
          {/* Configuración del Problema - Mejorado */}
          <div className="card shadow-lg p-4 mb-4 border-0" style={{ borderRadius: "15px" }}>
            <h4 className="text-primary text-center mb-4">
              ⚙️ Configuración del Problema de Transporte
            </h4>

            {/* Sección de parámetros */}
            <div className="row mt-3">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">🚛 Número de Suministros</label>
                <input
                  type="number"
                  className="form-select"
                  min="1"
                  max="10"
                  value={numSuppliers}
                  onChange={handleNumSuppliersChange}
                />
                <small className="text-muted">Cantidad de orígenes o proveedores</small>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">🏢 Número de Demandas</label>
                <input
                  type="number"
                  className="form-select"
                  min="1"
                  max="10"
                  value={numDemands}
                  onChange={handleNumDemandsChange}
                />
                <small className="text-muted">Cantidad de destinos o clientes</small>
              </div>
            </div>

            {/* Método de selección */}
            <div className="row mt-3">
              <div className="col-md-12 mb-3">
                <label className="form-label fw-bold">📌 Método Inicial</label>
                <select 
                  className="form-select" 
                  value={method} 
                  onChange={(e) => setMethod(e.target.value)}
                >
                  <option value="northwest">Esquina Noroeste</option>
                  <option value="minimum_cost">Costo Mínimo</option>
                  <option value="vogel">Aproximación de Vogel</option>
                </select>
                <small className="text-muted">Algoritmo para encontrar la solución inicial</small>
              </div>
            </div>
          </div>

          {/* Datos del Problema */}
          <div className="card shadow-lg p-4 mb-4 border-0" style={{ borderRadius: "15px" }}>
            <h4 className="text-primary mb-4">
              📊 Datos del Problema
            </h4>

            {/* Oferta */}
            <div className="mb-4">
              <h5 className="text-success mb-3">
                📦 Oferta (Suministros)
              </h5>
              <div className="row">
                {supply.map((value, i) => (
                  <div key={i} className="col-md-2 mb-2">
                    <label className="form-label small">Origen {i + 1}</label>
                    <input
                      type="number"
                      className={`form-control ${validationErrors.supply ? 'is-invalid' : ''}`}
                      value={value}
                      onChange={(e) => handleSupplyChange(i, e.target.value)}
                      min="0"
                      step="any"
                    />
                  </div>
                ))}
              </div>
              {validationErrors.supply && (
                <div className="alert alert-danger mt-2">
                  {validationErrors.supply}
                </div>
              )}
            </div>

            {/* Demanda */}
            <div className="mb-4">
              <h5 className="text-danger mb-3">
                🏭 Demanda (Destinos)
              </h5>
              <div className="row">
                {demand.map((value, i) => (
                  <div key={i} className="col-md-2 mb-2">
                    <label className="form-label small">Destino {i + 1}</label>
                    <input
                      type="number"
                      className={`form-control ${validationErrors.demand ? 'is-invalid' : ''}`}
                      value={value}
                      onChange={(e) => handleDemandChange(i, e.target.value)}
                      min="0"
                      step="any"
                    />
                  </div>
                ))}
              </div>
              {validationErrors.demand && (
                <div className="alert alert-danger mt-2">
                  {validationErrors.demand}
                </div>
              )}
            </div>

            {/* Matriz de Costos */}
            <div className="mb-4">
              <h5 className="text-dark mb-3">
                💲 Matriz de Costos
              </h5>
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Origen\Destino</th>
                      {Array.from({ length: numDemands }, (_, i) => (
                        <th key={i} className="text-center">Destino {i + 1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {costs.map((row, i) => (
                      <tr key={i}>
                        <td className="table-primary fw-bold">Origen {i + 1}</td>
                        {row.map((cost, j) => (
                          <td key={j}>
                            <input
                              type="number"
                              className={`form-control ${validationErrors.costs ? 'is-invalid' : ''}`}
                              value={cost}
                              onChange={(e) => handleCostChange(i, j, e.target.value)}
                              min="0"
                              step="any"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {validationErrors.costs && (
                <div className="alert alert-danger mt-2">
                  {validationErrors.costs}
                </div>
              )}
            </div>

            {/* Validación de balance - solo advertencia visual */}
            {totalSupply !== totalDemand && (
              <div className="alert alert-warning">
                <strong>⚠️ Advertencia:</strong> El problema debe estar balanceado. Oferta total: {totalSupply}, Demanda total: {totalDemand}
                <br />
                <small>El sistema automáticamente balanceará el problema agregando orígenes o destinos ficticios.</small>
              </div>
            )}

            {/* Botón Resolver - Mejorado */}
            <div className="text-center mt-4">
              <button 
                className={`btn btn-success btn-lg px-5 py-3 ${isLoading ? 'disabled' : ''}`}
                onClick={handleSubmit}
                style={{ borderRadius: "15px", fontSize: "18px" }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Resolviendo...
                  </>
                ) : (
                  <>
                    🚀 Resolver con {getMethodName(method)}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Mostrar errores - Mejorado */}
          {error && (
            <div
              className="alert alert-danger text-center shadow-lg"
              role="alert"
              style={{
                fontSize: "1.2rem",
                border: "2px solid #dc3545",
                borderRadius: "8px",
                margin: "20px auto",
                maxWidth: "600px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <span role="img" aria-label="Advertencia" style={{ fontSize: "2rem" }}>
                ⚠️
              </span>
              <span>{error}</span>
            </div>
          )}

          {/* Resultados - Mejorado */}
          {solution && (
            <div className="mt-5">
              <h2 className="text-success text-center mb-4">
                ✅ Solución Encontrada
              </h2>
              
              {/* Resumen de la solución */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="card bg-warning text-white">
                    <div className="card-body text-center">
                      <h5>💰 Costo Inicial ({getMethodName(method)})</h5>
                      <p className="mb-0 fs-4 fw-bold">{solution.initial_cost?.toFixed(2) || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card bg-primary text-white">
                    <div className="card-body text-center">
                      <h5>🏆 Costo Óptimo (MODI)</h5>
                      <p className="mb-0 fs-4 fw-bold">{solution.total_cost?.toFixed(2) || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Solución Inicial */}
              {solution.initial_solution && (
                <div className="mb-4">
                  <h5 className="text-primary mb-3">
                    🛠️ Solución Inicial ({getMethodName(method)})
                  </h5>
                  {renderMatrixTable(solution.initial_solution, "Solución Inicial", "warning")}
                </div>
              )}

              {/* Solución Óptima */}
              {solution.optimal_solution && (
                <div className="mb-4">
                  <h5 className="text-success mb-3">
                    🏆 Solución Óptima (MODI)
                  </h5>
                  {renderMatrixTable(solution.optimal_solution, "Solución Óptima", "success")}
                </div>
              )}
            </div>
          )}

          {/* Análisis de Sensibilidad - Mejorado */}
          {solution && solution.sensitivity_analysis && (
            <div className="mt-5">
              <h3 className="text-dark text-center mb-4">
                📊 Análisis de Sensibilidad con IA
              </h3>
              <div className="card shadow-lg p-4 bg-white border-0" style={{ borderRadius: "15px" }}>
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0">🤖 Análisis Inteligente</h5>
                </div>
                <div className="card-body">
                  <div className="bg-light p-4 rounded" style={{ textAlign: "left", fontSize: "16px" }}>
                    {solution.sensitivity_analysis.split("\n").map((line, index) => {
                      // Resaltar títulos y secciones en negrita
                      if (line.startsWith("**")) {
                        return (
                          <h5 key={index} className="text-primary mt-3 mb-2">
                            {line.replace(/\*\*/g, "")}
                          </h5>
                        );
                      }
                      // Resaltar elementos de lista
                      else if (line.startsWith("*")) {
                        return (
                          <li key={index} className="text-dark mb-1">
                            {line.replace(/\*/g, "")}
                          </li>
                        );
                      }
                      // Separar párrafos normales
                      else if (line.trim() !== "") {
                        return <p key={index} className="text-muted mb-2">{line}</p>;
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
