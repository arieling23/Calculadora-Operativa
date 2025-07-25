"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { solveNetwork } from "../services/networkService";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "react-bootstrap";

export default function NetworkPage() {
  const [graph, setGraph] = useState([]);
  const [solution, setSolution] = useState(null);
  const [edgeData, setEdgeData] = useState({ from: "", to: "", weight: "" });
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const router = useRouter();

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    
    // Validar que haya al menos 2 nodos
    const nodes = new Set();
    graph.forEach(([from, to]) => {
      nodes.add(from);
      nodes.add(to);
    });
    
    if (nodes.size < 2) {
      errors.graph = "Se necesitan al menos 2 nodos para formar una red";
    }
    
    // Validar que no haya aristas duplicadas
    const edges = new Set();
    graph.forEach(([from, to]) => {
      const edge = `${from}-${to}`;
      if (edges.has(edge)) {
        errors.graph = "No se permiten aristas duplicadas";
      }
      edges.add(edge);
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addEdge = () => {
    if (!edgeData.from || !edgeData.to || !edgeData.weight) {
      setValidationErrors({ edge: "Todos los campos son obligatorios" });
      return;
    }
    
    if (edgeData.from === edgeData.to) {
      setValidationErrors({ edge: "El nodo origen y destino no pueden ser iguales" });
      return;
    }
    
    if (parseInt(edgeData.weight) <= 0) {
      setValidationErrors({ edge: "El peso debe ser mayor a 0" });
      return;
    }
    
    // Verificar si la arista ya existe
    const edgeExists = graph.some(([from, to]) => 
      (from === edgeData.from && to === edgeData.to) || 
      (from === edgeData.to && to === edgeData.from)
    );
    
    if (edgeExists) {
      setValidationErrors({ edge: "Esta arista ya existe en el grafo" });
      return;
    }
    
    setGraph((prevGraph) => [...prevGraph, [edgeData.from, edgeData.to, parseInt(edgeData.weight)]]);
    setEdgeData({ from: "", to: "", weight: "" });
    setValidationErrors({});
  };

  const removeEdge = (index) => {
    setGraph((prevGraph) => prevGraph.filter((_, i) => i !== index));
    setValidationErrors({});
  };

  const clearGraph = () => {
    setGraph([]);
    setSolution(null);
    setValidationErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (graph.length === 0) {
      setValidationErrors({ graph: "Debe agregar al menos una arista al grafo" });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Enviando datos al backend:", graph);
      const data = { graph };
      const result = await solveNetwork(data);
      setSolution(result);
    } catch (err) {
      console.error("Error en la solicitud:", err);
      setValidationErrors({ submit: err.message || "Error al procesar la solicitud" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = (imageData) => {
    setSelectedImage(imageData);
    setShowModal(true);
  };

  const metodoNombres = {
    shortest_path: "Ruta Más Corta",
    mst: "Árbol de Expansión Mínima",
    max_flow: "Flujo Máximo",
    min_cost_flow: "Flujo de Costo Mínimo",
  };

  return (
    <div className="container-fluid bg-light min-vh-100">
      {/* Navbar mejorado */}
      <nav className="navbar navbar-dark bg-dark p-3 shadow">
        <button onClick={() => router.push("/")} className="btn btn-outline-light">
          ⬅ Regresar al Inicio
        </button>
        <h3 className="text-white mx-auto mb-0">
          🌐 Optimización en Redes
        </h3>
        <div className="text-white">
          <small>Análisis de Grafos</small>
        </div>
      </nav>

      {/* Espacio para evitar solapamiento con el Navbar */}
      <div className="pt-5 mt-5">
        <div className="container my-4">
          
          {/* Configuración del Grafo - Mejorado */}
          <div className="card shadow-lg p-4 mb-4 border-0" style={{ borderRadius: "15px" }}>
            <h4 className="text-primary text-center mb-4">
              ⚙️ Configuración del Grafo
            </h4>
            
            {/* Agregar Nueva Arista */}
            <div className="row">
              <div className="col-md-8">
                <div className="card border-0 bg-light">
                  <div className="card-body">
                    <h5 className="text-primary mb-3">➕ Agregar Nueva Arista</h5>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label fw-bold">Nodo Origen</label>
                        <input
                          type="text"
                          className={`form-control ${validationErrors.edge ? 'is-invalid' : ''}`}
                          placeholder="Ej: A"
                          value={edgeData.from}
                          onChange={(e) => setEdgeData({ ...edgeData, from: e.target.value })}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-bold">Nodo Destino</label>
                        <input
                          type="text"
                          className={`form-control ${validationErrors.edge ? 'is-invalid' : ''}`}
                          placeholder="Ej: B"
                          value={edgeData.to}
                          onChange={(e) => setEdgeData({ ...edgeData, to: e.target.value })}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-bold">Peso</label>
                        <input
                          type="number"
                          className={`form-control ${validationErrors.edge ? 'is-invalid' : ''}`}
                          placeholder="Ej: 5"
                          value={edgeData.weight}
                          onChange={(e) => setEdgeData({ ...edgeData, weight: e.target.value })}
                          min="1"
                        />
                      </div>
                    </div>
                    {validationErrors.edge && (
                      <div className="alert alert-danger mt-2">
                        {validationErrors.edge}
                      </div>
                    )}
                    <button className="btn btn-primary mt-3" onClick={addEdge}>
                      ➕ Agregar Arista
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="card border-0 bg-light">
                  <div className="card-body">
                    <h5 className="text-success mb-3">📊 Estadísticas</h5>
                    <div className="row text-center">
                      <div className="col-6">
                        <div className="border rounded p-2">
                          <strong>Aristas</strong>
                          <br />
                          <span className="text-primary fs-4">{graph.length}</span>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="border rounded p-2">
                          <strong>Nodos</strong>
                          <br />
                          <span className="text-success fs-4">
                            {new Set(graph.flatMap(([from, to]) => [from, to])).size}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      className="btn btn-danger btn-sm w-100 mt-3" 
                      onClick={clearGraph}
                      disabled={graph.length === 0}
                    >
                      🗑️ Limpiar Grafo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Aristas Ingresadas - Mejorado */}
          {graph.length > 0 && (
            <div className="card shadow-lg p-4 mb-4 border-0" style={{ borderRadius: "15px" }}>
              <h4 className="text-success mb-4">
                📌 Aristas del Grafo
              </h4>
              <div className="row">
                {graph.map(([u, v, w], index) => (
                  <div key={index} className="col-md-3 mb-2">
                    <div className="card border-primary">
                      <div className="card-body text-center p-2">
                        <div className="fw-bold text-primary">{u}</div>
                        <div className="text-muted">→</div>
                        <div className="fw-bold text-success">{v}</div>
                        <div className="badge bg-info mt-1">Peso: {w}</div>
                        <button 
                          className="btn btn-danger btn-sm mt-2"
                          onClick={() => removeEdge(index)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Validaciones del grafo */}
          {validationErrors.graph && (
            <div className="alert alert-warning text-center">
              <strong>⚠️ Advertencia:</strong> {validationErrors.graph}
            </div>
          )}

          {/* Botón Resolver - Mejorado */}
          <div className="text-center mb-4">
            <button 
              className={`btn btn-success btn-lg px-5 py-3 ${isLoading ? 'disabled' : ''}`}
              onClick={handleSubmit}
              style={{ borderRadius: "15px", fontSize: "18px" }}
              disabled={isLoading || graph.length === 0}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Analizando Red...
                </>
              ) : (
                <>
                  🚀 Analizar Red Completa
                </>
              )}
            </button>
          </div>

          {/* Mostrar errores - Mejorado */}
          {validationErrors.submit && (
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
              <span>{validationErrors.submit}</span>
            </div>
          )}

          {/* Resultados - Mejorado */}
          {solution && (
            <div className="mt-5">
              <h2 className="text-success text-center mb-4">
                ✅ Resultados de la Optimización
              </h2>

              {/* Resumen de resultados */}
              <div className="row mb-4">
                <div className="col-md-3">
                  <div className="card bg-primary text-white">
                    <div className="card-body text-center">
                      <h5>🔗 Aristas</h5>
                      <p className="mb-0 fs-4 fw-bold">{graph.length}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-success text-white">
                    <div className="card-body text-center">
                      <h5>🌐 Nodos</h5>
                      <p className="mb-0 fs-4 fw-bold">
                        {new Set(graph.flatMap(([from, to]) => [from, to])).size}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-info text-white">
                    <div className="card-body text-center">
                      <h5>📊 Algoritmos</h5>
                      <p className="mb-0 fs-4 fw-bold">
                        {Object.keys(solution).filter(key => solution[key]).length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-warning text-white">
                    <div className="card-body text-center">
                      <h5>⚡ Estado</h5>
                      <p className="mb-0">Completado</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenedor de Resultados */}
              <div className="row">
                {Object.keys(metodoNombres).map((key) => {
                  if (solution[key]) {
                    return (
                      <div className="col-md-6 mb-4" key={key}>
                        <div className="card shadow-lg border-0" style={{ borderRadius: "15px" }}>
                          <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">🔹 {metodoNombres[key]}</h5>
                          </div>
                          <div className="card-body text-center">
                            <div className="mb-3">
                              {key === "max_flow" ? (
                                <div className="alert alert-info">
                                  <strong>Flujo Total:</strong> {solution[key].max_flow}
                                </div>
                              ) : key === "min_cost_flow" ? (
                                <div className="alert alert-info">
                                  <strong>Costo Mínimo:</strong> {solution[key].min_cost}
                                </div>
                              ) : (
                                <div className="alert alert-success">
                                  <strong>Peso Total:</strong> {solution[key].total_weight}
                                  {solution[key].node_order && solution[key].node_order.length > 0 && (
                                    <div className="mt-2 text-dark">
                                      <strong>Camino:</strong> {solution[key].node_order.join(' → ')}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            {key === "mst" && solution[key].edges && solution[key].edges.length > 0 && (
                              <div className="mt-2 text-dark">
                                <strong>Aristas del Árbol:</strong>
                                <ul className="list-unstyled mb-0">
                                  {solution[key].edges.map(([from, to, weight], idx) => (
                                    <li key={idx}>
                                      {from} — {to} <span className="badge bg-secondary">{weight}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {key !== "min_cost_flow" && solution[key].graph_image && (
                              <img
                                src={`data:image/png;base64,${solution[key].graph_image}`}
                                alt={metodoNombres[key]}
                                className="img-fluid rounded shadow"
                                style={{ cursor: "pointer", maxHeight: "300px" }}
                                onClick={() => handleImageClick(solution[key])}
                              />
                            )}
                            {/* Análisis de Sensibilidad para Ruta Más Corta */}
                            {/* Iteraciones del Flujo Máximo */}
                            {key === "max_flow" && solution.max_flow.iterations && solution.max_flow.iterations.length > 0 && (
                              <div className="mt-3">
                                <h6 className="text-primary">🔄 Iteraciones</h6>
                                <div className="table-responsive">
                                  <table className="table table-sm">
                                    <thead className="table-light">
                                      <tr>
                                        <th>#</th>
                                        <th>Camino</th>
                                        <th>Capacidad</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {solution.max_flow.iterations.map((step, index) => (
                                        <tr key={index}>
                                          <td>{index + 1}</td>
                                          <td>{step.path}</td>
                                          <td>{step.capacity}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                            {/* Flujo de Costo Mínimo: mostrar tabla de flujo */}
                            {key === "min_cost_flow" && solution[key].flow && Object.keys(solution[key].flow).length > 0 && (
                              <div className="mt-4">
                                <h6 className="fw-bold text-primary mb-2">Flujo de Costo Mínimo (por arista)</h6>
                                <div className="table-responsive">
                                  <table className="table table-bordered table-sm">
                                    <thead className="table-light">
                                      <tr>
                                        <th>De</th>
                                        <th>Hacia</th>
                                        <th>Flujo</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {Object.entries(solution[key].flow).flatMap(([from, tos]) => (
                                        Object.entries(tos).map(([to, flow]) => (
                                          <tr key={from + '-' + to}>
                                            <td>{from}</td>
                                            <td>{to}</td>
                                            <td>{flow}</td>
                                          </tr>
                                        ))
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}

          {/* Análisis de Sensibilidad - Mejorado */}
          <div className="mt-5">
            <h3 className="text-dark text-center mb-4">
              📊 Análisis de Sensibilidad
            </h3>
            <div className="card shadow-lg p-4 bg-white border-0" style={{ borderRadius: "15px" }}>
              <p className="text-muted text-center mb-4">
                Aquí se mostrarán los análisis y conclusiones sobre los resultados obtenidos en la optimización de redes.
              </p>
              {solution && solution.shortest_path && solution.shortest_path.sensitivity_analysis_gemini ? (
                <div className="bg-light p-4 rounded" style={{ textAlign: "left", fontSize: "16px" }}>
                  <h6 className="fw-bold text-success mb-3">
                    <i className="fas fa-robot me-2"></i>
                    Análisis Inteligente con Gemini IA
                  </h6>
                  {solution.shortest_path.sensitivity_analysis_gemini.split("\n").map((line, index) => (
                    <p key={index} className="text-muted mb-2">{line}</p>
                  ))}
                </div>
              ) : (
                <div
                  className="border p-4 bg-light rounded text-center"
                  style={{ minHeight: "200px", fontSize: "18px" }}
                >
                  <span role="img" aria-label="lupa" style={{ fontSize: "3rem" }}>🔎</span>
                  <p className="mt-3">Espacio reservado para futuros cálculos y análisis.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para mostrar la imagen expandida */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">🔹 Detalles de la Solución</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedImage && (
            <>
              <div className="alert alert-info">
                {selectedImage.total_weight !== undefined && (
                  <strong>Peso total: {selectedImage.total_weight}</strong>
                )}
                {selectedImage.max_flow !== undefined && (
                  <strong>Flujo total: {selectedImage.max_flow}</strong>
                )}
              </div>
              <img
                src={`data:image/png;base64,${selectedImage.graph_image}`}
                alt="Detalle de la imagen"
                className="img-fluid rounded shadow"
              />
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
