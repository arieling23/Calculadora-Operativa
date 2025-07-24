"use client";
import React, { useState } from "react";
import { solveLinear } from "../services/linearService";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "react-bootstrap";

export default function LinearPage() {
  const [method, setMethod] = useState("simplex");
  const [objective, setObjective] = useState("max");
  const [numVariables, setNumVariables] = useState(2);
  const [numConstraints, setNumConstraints] = useState(2);
  const [modelGenerated, setModelGenerated] = useState(false);
  const [objectiveCoeffs, setObjectiveCoeffs] = useState([]);
  const [constraints, setConstraints] = useState([]);
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const router = useRouter();

  // Validar que todos los campos estén completos
  const validateForm = () => {
    const errors = {};
    
    // Validar función objetivo
    if (objectiveCoeffs.length === 0) {
      errors.objective = "Debe generar el modelo primero";
    } else {
      const emptyCoeffs = objectiveCoeffs.some(coeff => coeff === "" || coeff === null);
      if (emptyCoeffs) {
        errors.objective = "Complete todos los coeficientes de la función objetivo";
      }
    }

    // Validar restricciones
    if (constraints.length === 0) {
      errors.constraints = "Debe generar el modelo primero";
    } else {
      constraints.forEach((constraint, index) => {
        const emptyCoeffs = constraint.coeffs.some(coeff => coeff === "" || coeff === null);
        if (emptyCoeffs) {
          errors.constraints = `Complete todos los coeficientes de la restricción ${index + 1}`;
        }
        if (constraint.rhs === "" || constraint.rhs === null) {
          errors.constraints = `Complete el valor de la restricción ${index + 1}`;
        }
      });
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Genera el modelo dinámico (función objetivo y restricciones)
  const generateModel = () => {
    const n = Number(numVariables);
    const m = Number(numConstraints);
    setObjectiveCoeffs(new Array(n).fill(""));
    setConstraints(
      new Array(m).fill(null).map(() => ({
        coeffs: new Array(n).fill(""),
        sign: "<=",
        rhs: ""
      }))
    );
    setModelGenerated(true);
    setSolution(null);
    setError(null);
    setValidationErrors({});
  };

  // Limpia el formulario (reset de todos los estados)
  const clearForm = () => {
    setMethod("simplex");
    setObjective("max");
    setNumVariables(2);
    setNumConstraints(2);
    setObjectiveCoeffs([]);
    setConstraints([]);
    setModelGenerated(false);
    setSolution(null);
    setError(null);
    setValidationErrors({});
  };

  // Actualiza el valor de un coeficiente de la función objetivo
  const handleObjectiveCoeffChange = (index, value) => {
    const newCoeffs = [...objectiveCoeffs];
    newCoeffs[index] = value;
    setObjectiveCoeffs(newCoeffs);
    setValidationErrors({});
  };

  // Actualiza el coeficiente de una restricción dada (fila y columna)
  const handleConstraintCoeffChange = (row, col, value) => {
    const newConstraints = constraints.map((rowData, i) =>
      i === row
        ? { ...rowData, coeffs: rowData.coeffs.map((c, j) => (j === col ? value : c)) }
        : rowData
    );
    setConstraints(newConstraints);
    setValidationErrors({});
  };

  // Actualiza el signo de una restricción
  const handleConstraintSignChange = (row, value) => {
    const newConstraints = constraints.map((rowData, i) =>
      i === row ? { ...rowData, sign: value } : rowData
    );
    setConstraints(newConstraints);
  };

  // Actualiza el RHS de una restricción
  const handleConstraintRHSChange = (row, value) => {
    const newConstraints = constraints.map((rowData, i) =>
      i === row ? { ...rowData, rhs: value } : rowData
    );
    setConstraints(newConstraints);
    setValidationErrors({});
  };

  // Recopila los datos y envía la petición al backend
  const solveProblem = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    // Genera nombres de variables: x1, x2, ..., x_n
    const variables = Array.from({ length: objectiveCoeffs.length }, (_, i) => `x${i + 1}`);
    const requestData = {
      objective,
      variables,
      objective_coeffs: objectiveCoeffs.map(Number),
      constraints: constraints.map((c) => ({
        coeffs: c.coeffs.map(Number),
        sign: c.sign,
        rhs: Number(c.rhs)
      })),
      method
    };

    try {
      const result = await solveLinear(requestData);
      console.log("Respuesta completa del backend:", result);
      console.log("Estructura de solution:", result.solution);
      console.log("Valores de variables:", result.solution?.variable_values);
      setSolution(result);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al conectar con el backend.");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para obtener el nombre del método en español
  const getMethodName = (method) => {
    const methodNames = {
      "simplex": "Método Simplex",
      "two_phase": "Método de Dos Fases",
      "m_big": "Método Gran M",
      "dual": "Método Dual",
      "graphical": "Método Gráfico"
    };
    return methodNames[method] || method;
  };

  // Función para obtener el color del método
  const getMethodColor = (method) => {
    const colors = {
      "simplex": "primary",
      "two_phase": "success",
      "m_big": "warning",
      "dual": "info",
      "graphical": "secondary"
    };
    return colors[method] || "primary";
  };

  return (
    <div className="min-h-screen bg-light">
      {/* Navbar profesional */}
      <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" style={{
        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
      }}>
        <div className="container-fluid">
          <button onClick={() => router.push("/")} className="btn btn-outline-light btn-sm">
            <i className="fas fa-arrow-left me-2"></i>Regresar al Inicio
          </button>
          <h3 className="text-white mx-auto mb-0 fw-bold">
            <i className="fas fa-calculator me-2"></i>
            Solucionador de Programación Lineal
          </h3>
          <div className="text-white text-end">
            <small className="d-block">Análisis Inteligente con IA</small>
            <small className="d-block opacity-75">Google Gemini AI</small>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="container my-4">
        
        {/* Configuración del Modelo - Diseño serio */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px" }}>
          <div className="card-header bg-white border-bottom" style={{ borderRadius: "8px 8px 0 0" }}>
            <h4 className="mb-0 fw-bold text-dark">
              <i className="fas fa-cog me-2 text-primary"></i>
              Configuración del Modelo
            </h4>
          </div>
          <div className="card-body p-4">
            
            <div className="row g-3">
              <div className="col-md-3">
                <div className="border rounded p-3 text-center bg-light">
                  <label className="form-label fw-bold text-dark">Método de Solución</label>
                  <select
                    className="form-select border"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    style={{ borderRadius: "4px" }}
                  >
                    <option value="simplex">Método Simplex</option>
                    <option value="two_phase">Método de Dos Fases</option>
                    <option value="m_big">Método Gran M</option>
                    <option value="dual">Método Dual</option>
                    <option value="graphical">Método Gráfico</option>
                  </select>
                  <small className="text-muted d-block mt-2">Algoritmo de optimización</small>
                </div>
              </div>

              <div className="col-md-3">
                <div className="border rounded p-3 text-center bg-light">
                  <label className="form-label fw-bold text-dark">Tipo de Objetivo</label>
                  <select
                    className="form-select border"
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    style={{ borderRadius: "4px" }}
                  >
                    <option value="max">Maximizar</option>
                    <option value="min">Minimizar</option>
                  </select>
                  <small className="text-muted d-block mt-2">Función objetivo</small>
                </div>
              </div>

              <div className="col-md-3">
                <div className="border rounded p-3 text-center bg-light">
                  <label className="form-label fw-bold text-dark">Variables</label>
                  <select
                    className="form-select border"
                    value={numVariables}
                    onChange={(e) => setNumVariables(e.target.value)}
                    style={{ borderRadius: "4px" }}
                  >
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1} Variable{i + 1 !== 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                  <small className="text-muted d-block mt-2">Variables de decisión</small>
                </div>
              </div>

              <div className="col-md-3">
                <div className="border rounded p-3 text-center bg-light">
                  <label className="form-label fw-bold text-dark">Restricciones</label>
                  <select
                    className="form-select border"
                    value={numConstraints}
                    onChange={(e) => setNumConstraints(e.target.value)}
                    style={{ borderRadius: "4px" }}
                  >
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1} Restricción{i + 1 !== 1 ? 'es' : ''}
                      </option>
                    ))}
                  </select>
                  <small className="text-muted d-block mt-2">Restricciones del sistema</small>
                </div>
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-md-6">
                <button
                  className="btn btn-primary btn-lg w-100 fw-bold"
                  onClick={generateModel}
                  style={{ borderRadius: "6px", fontSize: "16px" }}
                >
                  <i className="fas fa-magic me-2"></i>
                  Generar Modelo
                </button>
              </div>
              <div className="col-md-6">
                <button
                  className="btn btn-outline-secondary btn-lg w-100 fw-bold"
                  onClick={clearForm}
                  style={{ borderRadius: "6px", fontSize: "16px" }}
                >
                  <i className="fas fa-trash me-2"></i>
                  Limpiar Todo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Si se generó el modelo, se muestran las secciones */}
        {/* Función Objetivo - Diseño serio */}
        {modelGenerated && (
          <>
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px" }}>
              <div className="card-header bg-white border-bottom" style={{ borderRadius: "8px 8px 0 0" }}>
                <h4 className="mb-0 fw-bold text-dark">
                  <i className="fas fa-bullseye me-2 text-primary"></i>
                  Función Objetivo
                </h4>
              </div>
              <div className="card-body p-4">
                <div className="alert alert-light border mb-3" style={{ borderRadius: "6px" }}>
                  <div className="d-flex align-items-center">
                    <i className="fas fa-info-circle text-primary me-2"></i>
                    <span className="fw-bold">Objetivo:</span>
                    <span className="ms-2 text-capitalize">{objective === "max" ? "Maximizar" : "Minimizar"}</span>
                    <span className="ms-3 fw-bold">Z =</span>
                    <span className="ms-2">
                      {objectiveCoeffs.map((coef, index) => (
                        <span key={index}>
                          {index > 0 && coef >= 0 && "+"}
                          {coef}x<sub>{index + 1}</sub>
                        </span>
                      )).reduce((prev, curr) => [prev, curr], [])}
                    </span>
                  </div>
                </div>

                <div className="row g-3">
                  {objectiveCoeffs.map((coef, index) => (
                    <div key={index} className="col-md-2">
                      <div className="border rounded p-3 text-center bg-light">
                        <label className="form-label small text-muted">Coeficiente x<sub>{index + 1}</sub></label>
                        <input
                          type="number"
                          className={`form-control border ${validationErrors.objectiveCoeffs ? 'is-invalid' : ''}`}
                          placeholder={`x${index + 1}`}
                          value={coef}
                          onChange={(e) => handleObjectiveCoeffChange(index, e.target.value)}
                          required
                          step="any"
                          style={{ borderRadius: "4px" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {validationErrors.objectiveCoeffs && (
                  <div className="alert alert-danger mt-3 border" style={{ borderRadius: "6px" }}>
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {validationErrors.objectiveCoeffs}
                  </div>
                )}
              </div>
            </div>

            {/* Restricciones - Diseño serio */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px" }}>
              <div className="card-header bg-white border-bottom" style={{ borderRadius: "8px 8px 0 0" }}>
                <h4 className="mb-0 fw-bold text-dark">
                  <i className="fas fa-link me-2 text-primary"></i>
                  Restricciones del Sistema
                </h4>
              </div>
              <div className="card-body p-4">
                {constraints.map((constraint, i) => (
                  <div key={i} className="card border mb-3" style={{ borderRadius: "6px" }}>
                    <div className="card-header bg-light border-bottom" style={{ borderRadius: "6px 6px 0 0" }}>
                      <h6 className="mb-0 fw-bold text-dark">Restricción {i + 1}</h6>
                    </div>
                    <div className="card-body">
                      
                      <div className="row g-3 align-items-end">
                        {constraint.coeffs.map((coef, j) => (
                          <div key={j} className="col-md-2">
                            <div className="border rounded p-2 text-center bg-light">
                              <label className="form-label small text-muted">Coef. x<sub>{j + 1}</sub></label>
                              <input
                                type="number"
                                className={`form-control border ${validationErrors.constraints ? 'is-invalid' : ''}`}
                                placeholder={`x${j + 1}`}
                                value={coef}
                                onChange={(e) => handleConstraintCoeffChange(i, j, e.target.value)}
                                required
                                step="any"
                                style={{ borderRadius: "4px" }}
                              />
                            </div>
                          </div>
                        ))}
                        
                        <div className="col-md-2">
                          <div className="border rounded p-2 text-center bg-light">
                            <label className="form-label small text-muted">Signo</label>
                            <select
                              className="form-select border"
                              value={constraint.sign}
                              onChange={(e) => handleConstraintSignChange(i, e.target.value)}
                              style={{ borderRadius: "4px" }}
                            >
                              <option value="<=">≤ (Menor o igual)</option>
                              <option value=">=">≥ (Mayor o igual)</option>
                              <option value="=">= (Igual)</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="col-md-2">
                          <div className="border rounded p-2 text-center bg-light">
                            <label className="form-label small text-muted">Valor</label>
                            <input
                              type="number"
                              className={`form-control border ${validationErrors.constraints ? 'is-invalid' : ''}`}
                              placeholder="RHS"
                              value={constraint.rhs}
                              onChange={(e) => handleConstraintRHSChange(i, e.target.value)}
                              required
                              step="any"
                              style={{ borderRadius: "4px" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {validationErrors.constraints && (
                  <div className="alert alert-danger mt-3 border" style={{ borderRadius: "6px" }}>
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {validationErrors.constraints}
                  </div>
                )}
              </div>
            </div>

            {/* Botón de Resolver - Diseño serio */}
            <div className="text-center mb-4">
              <button 
                className={`btn btn-lg px-5 py-3 fw-bold ${isLoading ? 'btn-secondary' : 'btn-success'}`}
                onClick={solveProblem}
                style={{ 
                  borderRadius: "6px", 
                  fontSize: "18px",
                  background: isLoading 
                    ? '#6c757d'
                    : '#28a745',
                  border: 'none',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  color: 'white',
                  minWidth: '300px'
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
                    <i className="fas fa-cogs me-2"></i>
                    Resolviendo...
                  </>
                ) : (
                  <>
                    <i className="fas fa-rocket me-2"></i>
                    Resolver con {getMethodName(method)}
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* Mostrar errores - Diseño serio */}
        {error && (
          <div className="alert alert-danger text-center border" style={{
            fontSize: "1.1rem",
            borderRadius: "6px",
            margin: "20px auto",
            maxWidth: "600px"
          }}>
            <div className="d-flex align-items-center justify-content-center">
              <i className="fas fa-exclamation-triangle me-3"></i>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Resultados - Diseño serio */}
        {solution && solution.solution && (
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px" }}>
            <div className="card-header bg-white border-bottom" style={{ borderRadius: "8px 8px 0 0" }}>
              <h4 className="mb-0 fw-bold text-dark">
                <i className="fas fa-check-circle me-2 text-success"></i>
                Solución Encontrada
              </h4>
            </div>
            <div className="card-body p-4">
              
              {/* Estado de la solución */}
              <div className="row mb-4">
                <div className="col-md-4">
                  <div className="card border shadow-sm" style={{ borderRadius: "6px" }}>
                    <div className="card-body text-center">
                      <i className="fas fa-info-circle fa-2x mb-2 text-primary"></i>
                      <h5 className="text-dark">Estado</h5>
                      <p className="mb-0 fw-bold text-primary">{solution.solution.status}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border shadow-sm" style={{ borderRadius: "6px" }}>
                    <div className="card-body text-center">
                      <i className="fas fa-chart-line fa-2x mb-2 text-success"></i>
                      <h5 className="text-dark">Valor Óptimo</h5>
                      <p className="mb-0 fs-4 fw-bold text-success">{solution.solution.objective_value?.toFixed(2) || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border shadow-sm" style={{ borderRadius: "6px" }}>
                    <div className="card-body text-center">
                      <i className="fas fa-cogs fa-2x mb-2 text-info"></i>
                      <h5 className="text-dark">Método</h5>
                      <p className="mb-0 fw-bold text-info">{getMethodName(method)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Valores de Variables */}
              <div className="card mb-4 border shadow-sm" style={{ borderRadius: "6px" }}>
                <div className="card-header bg-light border-bottom" style={{ borderRadius: "6px 6px 0 0" }}>
                  <h5 className="mb-0 fw-bold text-dark">
                    <i className="fas fa-chart-bar me-2 text-primary"></i>
                    Valores de Variables
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    {solution.solution.variable_values && Object.entries(solution.solution.variable_values).length > 0 ? (
                      Object.entries(solution.solution.variable_values).map(([key, val]) => (
                        <div key={key} className="col-md-3 mb-3">
                          <div className="border rounded p-3 text-center shadow-sm bg-light">
                            <div className="fw-bold fs-5 text-primary">{key}</div>
                            <div className="fs-4 fw-bold text-dark">{typeof val === 'number' ? val.toFixed(4) : val}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-12 text-center">
                        <div className="alert alert-info border" style={{ borderRadius: "6px" }}>
                          <i className="fas fa-info-circle me-2"></i>
                          No se encontraron valores de variables en la solución
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Variables Artificiales (si existen) */}
              {solution.solution.artificial_variables && (
                <div className="card mb-4 border shadow-sm" style={{ borderRadius: "6px" }}>
                  <div className="card-header bg-warning border-bottom" style={{ borderRadius: "6px 6px 0 0" }}>
                    <h5 className="mb-0 fw-bold text-dark">
                      <i className="fas fa-robot me-2"></i>
                      Variables Artificiales
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      {Object.entries(solution.solution.artificial_variables).map(([key, val]) => (
                        <div key={key} className="col-md-3 mb-3">
                          <div className="border rounded p-3 text-center shadow-sm bg-light">
                            <div className="fw-bold fs-5 text-warning">{key}</div>
                            <div className="fs-4 fw-bold text-dark">{val.toFixed(4)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Visualización Gráfica */}
              {solution.solution.graph && (
                <div className="card mb-4 border shadow-sm" style={{ borderRadius: "6px" }}>
                  <div className="card-header bg-light border-bottom" style={{ borderRadius: "6px 6px 0 0" }}>
                    <h5 className="mb-0 fw-bold text-dark">
                      <i className="fas fa-chart-area me-2 text-primary"></i>
                      Visualización Gráfica
                    </h5>
                  </div>
                  <div className="card-body text-center">
                    <img 
                      src={solution.solution.graph} 
                      alt="Gráfico de la solución" 
                      className="img-fluid rounded border"
                      style={{ maxHeight: "400px" }}
                    />
                    <button 
                      className="btn btn-primary mt-3"
                      onClick={() => setShowModal(true)}
                      style={{ borderRadius: "6px" }}
                    >
                      <i className="fas fa-expand me-2"></i>
                      Ver en Pantalla Completa
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Análisis de Sensibilidad - Diseño serio */}
        {solution && solution.sensitivity && Object.keys(solution.sensitivity).length > 0 && (
          <div className="card mb-4 border shadow-sm" style={{ borderRadius: "8px" }}>
            <div className="card-header bg-white border-bottom" style={{ borderRadius: "8px 8px 0 0" }}>
              <h5 className="mb-0 fw-bold text-dark">
                <i className="fas fa-chart-line me-2 text-primary"></i>
                Análisis de Sensibilidad
              </h5>
            </div>
            <div className="card-body">
              
              {/* Explicación de los dos tipos de análisis */}
              <div className="alert alert-light border mb-4" style={{ borderRadius: "6px" }}>
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="fw-bold text-primary">
                      <i className="fas fa-calculator me-2"></i>
                      Análisis Numérico
                    </h6>
                    <small className="text-muted">
                      Valores exactos que indican cuánto cambiaría el valor óptimo si el coeficiente de cada variable aumenta en 1 unidad.
                    </small>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold text-success">
                      <i className="fas fa-brain me-2"></i>
                      Análisis Inteligente
                    </h6>
                    <small className="text-muted">
                      Interpretación contextual y recomendaciones prácticas basadas en IA.
                    </small>
                  </div>
                </div>
              </div>

              {/* Valores Numéricos */}
              <div className="mb-4">
                <h6 className="fw-bold text-primary mb-3">
                  <i className="fas fa-chart-bar me-2"></i>
                  Valores de Sensibilidad
                </h6>
                <div className="row">
                  {Object.entries(solution.sensitivity).map(([variable, sensitivity]) => {
                    const isHighSensitivity = Math.abs(sensitivity) > 10;
                    const isMediumSensitivity = Math.abs(sensitivity) > 1;
                    let sensitivityLevel, borderColor, textColor;
                    
                    if (isHighSensitivity) {
                      sensitivityLevel = "Alta sensibilidad";
                      borderColor = '#dc3545';
                      textColor = '#dc3545';
                    } else if (isMediumSensitivity) {
                      sensitivityLevel = "Sensibilidad media";
                      borderColor = '#ffc107';
                      textColor = '#856404';
                    } else {
                      sensitivityLevel = "Sensibilidad normal";
                      borderColor = '#17a2b8';
                      textColor = '#0c5460';
                    }
                    
                    return (
                      <div key={variable} className="col-md-3 mb-3">
                        <div className="border rounded p-3 text-center shadow-sm bg-light" style={{
                          borderColor: borderColor,
                          borderWidth: '2px'
                        }}>
                          <div className="fw-bold fs-5 text-dark">{variable}</div>
                          <div className="fs-4 fw-bold" style={{ color: textColor }}>{sensitivity.toFixed(4)}</div>
                          <div className="small text-muted">{sensitivityLevel}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Análisis Inteligente */}
              {solution.intelligent_analysis && (
                <div className="mt-4">
                  <h6 className="fw-bold text-success mb-3">
                    <i className="fas fa-robot me-2"></i>
                    Análisis Inteligente con IA
                  </h6>
                  <div className="border rounded p-4 bg-light" style={{ borderLeft: '4px solid #28a745' }}>
                    <div className="d-flex align-items-start">
                      <i className="fas fa-lightbulb text-success me-3 mt-1"></i>
                      <div>
                        <p className="mb-0" style={{ lineHeight: "1.6" }}>
                          {solution.intelligent_analysis}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal para mostrar el gráfico ampliado */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton style={{ borderRadius: "20px 20px 0 0" }}>
          <Modal.Title className="text-primary fw-bold">
            <i className="fas fa-chart-area me-2"></i>
            Detalles del Gráfico
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {solution && solution.solution && solution.solution.graph && (
            <Image
              src={`http://127.0.0.1:8000${solution.solution.graph}`}
              alt="Gráfico ampliado"
              width={600}
              height={600}
              className="img-fluid rounded shadow"
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}