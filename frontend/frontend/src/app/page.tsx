"use client";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [hovered, setHovered] = useState<string | null>(null);

  const modules = [
    {
      id: "linear",
      title: "Programación Lineal",
      description: "Resuelve problemas de optimización lineal con restricciones usando métodos avanzados como Simplex, Dos Fases, Gran M y Dual.",
      features: ["Múltiples algoritmos", "Análisis de sensibilidad", "Visualizaciones", "IA integrada"],
      color: "primary"
    },
    {
      id: "transport",
      title: "Problema de Transporte",
      description: "Optimiza la distribución de productos desde orígenes a destinos minimizando costos totales.",
      features: ["Esquina Noroeste", "Costo Mínimo", "Aproximación de Vogel", "Método MODI"],
      color: "success"
    },
    {
      id: "network",
      title: "Optimización en Redes",
      description: "Analiza grafos para encontrar rutas óptimas, flujos máximos y árboles de expansión mínima.",
      features: ["Ruta más corta", "Flujo máximo", "Árbol de expansión", "Análisis de grafos"],
      color: "info"
    }
  ];

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Header profesional */}
      <nav className="bg-white shadow-sm border-bottom">
        <div className="container py-3 d-flex justify-content-between align-items-center">
          <h1 className="h4 fw-bold text-primary mb-0">Solucionador de Optimización</h1>
          <span className="text-secondary small">Análisis con IA</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white py-5 border-bottom">
        <div className="container">
          <div className="mx-auto" style={{ maxWidth: 700 }}>
            <h1 className="display-4 fw-bold text-dark mb-3 text-center">Plataforma de Optimización Empresarial</h1>
            <p className="lead text-secondary mb-4 text-center">
              Resuelve problemas de optimización con análisis de sensibilidad inteligente y visualizaciones profesionales.
            </p>
            {/* Sección de estadísticas eliminada */}
          </div>
        </div>
      </section>

      {/* Módulos principales */}
      <section className="bg-light py-5 border-bottom">
        <div className="container">
          <h2 className="h3 fw-bold text-dark mb-4 text-center" style={{ borderBottom: '3px solid #0d6efd', display: 'inline-block', paddingBottom: 6 }}>Módulos Principales</h2>
          <div className="row g-4 mt-2">
            {modules.map((module) => (
              <div className="col-12 col-md-4" key={module.id}>
                <Link href={`/${module.id}`} className="text-decoration-none">
                  <div
                    className={`card h-100 border-0 shadow-sm position-relative module-card ${hovered === module.id ? 'shadow-lg border-primary' : ''}`}
                    onMouseEnter={() => setHovered(module.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ transition: 'box-shadow 0.2s, border-color 0.2s', borderRadius: 16 }}
                  >
                    <div className="card-body">
                      <h3 className="h5 fw-bold text-dark mb-2" style={{ borderLeft: '4px solid #0d6efd', paddingLeft: 10 }}>{module.title}</h3>
                      <p className="text-secondary mb-3" style={{ minHeight: '60px' }}>{module.description}</p>
                      <ul className="list-unstyled mb-4">
                        {module.features.map((feature, idx) => (
                          <li key={idx} className="mb-2 text-secondary">
                            <i className="fas fa-check-circle text-primary me-2"></i>{feature}
                          </li>
                        ))}
                      </ul>
                      <span className="btn btn-outline-primary w-100 fw-bold py-2" style={{ borderRadius: 8, fontSize: 16 }}>Explorar módulo</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Solución Completa */}
      <section className="bg-white py-5 border-bottom">
        <div className="container">
          <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: 900, borderRadius: 16 }}>
            <div className="card-body text-center">
              <h2 className="h4 fw-bold text-dark mb-3">Solución Completa</h2>
              <p className="text-secondary mb-4">
                Ejecuta todos los módulos en una sola plataforma integrada con análisis de sensibilidad global.
              </p>
              <div className="row g-3 justify-content-center mb-4">
                <div className="col-12 col-md-4">
                  <div className="border rounded p-3 bg-light text-center h-100">
                    <div className="fw-bold text-primary">Programación Lineal</div>
                    <div className="small text-secondary">Métodos Simplex, Dos Fases, Gran M</div>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="border rounded p-3 bg-light text-center h-100">
                    <div className="fw-bold text-success">Problema de Transporte</div>
                    <div className="small text-secondary">Esquina Noroeste, Costo Mínimo, Vogel</div>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="border rounded p-3 bg-light text-center h-100">
                    <div className="fw-bold text-info">Optimización en Redes</div>
                    <div className="small text-secondary">Rutas, Flujos, Árboles de Expansión</div>
                  </div>
                </div>
              </div>
              <Link href="/solve-all">
                <button className="btn btn-primary px-5 py-2 fw-bold" style={{ borderRadius: 8, fontSize: 16 }}>Ejecutar Solución Completa</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Características avanzadas */}
      <section className="bg-light py-5 border-bottom">
        <div className="container">
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
                <div className="card-body">
                  <h3 className="h5 fw-bold text-dark mb-3">Análisis Inteligente</h3>
                  <p className="text-secondary mb-4">
                    Cada módulo incluye análisis de sensibilidad con IA para proporcionar recomendaciones prácticas y comprensibles sobre la robustez de las soluciones.
                  </p>
                  <ul className="list-unstyled">
                    <li className="mb-2 text-secondary"><i className="fas fa-check-circle text-primary me-2"></i>Interpretación automática de resultados</li>
                    <li className="mb-2 text-secondary"><i className="fas fa-check-circle text-primary me-2"></i>Recomendaciones de gestión</li>
                    <li className="mb-2 text-secondary"><i className="fas fa-check-circle text-primary me-2"></i>Análisis de riesgo y oportunidades</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
                <div className="card-body">
                  <h3 className="h5 fw-bold text-dark mb-3">Visualizaciones Interactivas</h3>
                  <p className="text-secondary mb-4">
                    Gráficos dinámicos y tablas interactivas que facilitan la comprensión de los resultados y la toma de decisiones informada.
                  </p>
                  <ul className="list-unstyled">
                    <li className="mb-2 text-secondary"><i className="fas fa-check-circle text-primary me-2"></i>Gráficos de optimización</li>
                    <li className="mb-2 text-secondary"><i className="fas fa-check-circle text-primary me-2"></i>Matrices de transporte</li>
                    <li className="mb-2 text-secondary"><i className="fas fa-check-circle text-primary me-2"></i>Diagramas de redes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Información técnica */}
      <section className="bg-white py-5">
        <div className="container">
          <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: 900, borderRadius: 16 }}>
            <div className="card-body">
              <h3 className="h5 fw-bold text-dark mb-4 text-center">Tecnologías Utilizadas</h3>
              <div className="row g-4">
                <div className="col-12 col-md-4 text-center">
                  <div className="fw-bold text-primary mb-1">Backend Python</div>
                  <div className="small text-secondary">FastAPI, SciPy, PuLP, Gemini AI</div>
                </div>
                <div className="col-12 col-md-4 text-center">
                  <div className="fw-bold text-success mb-1">Frontend React</div>
                  <div className="small text-secondary">Next.js, Bootstrap, TypeScript</div>
                </div>
                <div className="col-12 col-md-4 text-center">
                  <div className="fw-bold text-info mb-1">Inteligencia Artificial</div>
                  <div className="small text-secondary">Gemini AI para análisis</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer elegante */}
      <footer className="bg-dark text-white py-4 mt-auto border-top">
        <div className="container text-center">
          <h4 className="h6 fw-bold mb-2">© 2025 Solucionador de Optimización</h4>
          <p className="text-secondary mb-2 small">
            Plataforma integral para la resolución de problemas de optimización empresarial
          </p>
          <div className="border-top border-secondary pt-3">
            <h5 className="fw-bold mb-1 small">Creadores:</h5>
            <p className="text-secondary small mb-0">
              CÁCERES PÉREZ DANIELA ELIZABETH · CARRASCO AMAGUA MATEO FELIPE · JIMÉNEZ BASURTO DENNYS WLADIMIR · OLIVARES INTRIAGO MEYBILI TATIANA · SALAS CUEVA LESLY SALOMÉ
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
