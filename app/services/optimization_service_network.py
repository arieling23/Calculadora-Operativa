print(">>> CARGANDO app/services/optimization_service_network.py")

import google.generativeai as genai
import os
from dotenv import load_dotenv
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("models/gemini-1.5-flash")

from algorithms.network_optimization import (
    dijkstra_algorithm, minimum_spanning_tree, sensitivity_analysis_shortest_path
)

def gemini_network_sensitivity_analysis(graph, shortest_path_result):
    print(">>> ENTRANDO a gemini_network_sensitivity_analysis")
    prompt = f"""
    Dado el siguiente grafo dirigido con aristas (origen, destino, peso):
    {graph}
    Y la ruta más corta encontrada es:
    {shortest_path_result.get('node_order', [])} con peso total {shortest_path_result.get('total_weight', 'N/A')}.
    Analiza la sensibilidad de la red: ¿qué aristas son críticas para la ruta más corta?, ¿qué pasaría si se elimina una arista?, ¿cómo se puede mejorar la robustez de la red?, y da recomendaciones para optimización y resiliencia.
    Presenta el análisis de forma clara y estructurada para un usuario de negocios.
    """
    try:
        response = model.generate_content(prompt).text
        print(">>> RESPUESTA DE GEMINI:", response)
    except Exception as e:
        response = f"Error al generar análisis con Gemini: {str(e)}"
        print(">>> ERROR DE GEMINI:", response)
    return response

def solve_optimization_network(problem_type, data):
    print(f">>> solve_optimization_network llamado con problem_type={problem_type}")
    if problem_type == "shortest_path":
        graph = data["graph"]
        start_node = graph[0][0]
        end_node = graph[-1][1]
        shortest = dijkstra_algorithm(graph, start_node)
        sensitivity = sensitivity_analysis_shortest_path(graph, start_node, end_node)
        shortest["sensitivity_analysis"] = sensitivity
        # Gemini
        shortest["sensitivity_analysis_gemini"] = gemini_network_sensitivity_analysis(graph, shortest)
        return shortest
    elif problem_type == "mst":
        return minimum_spanning_tree(data["graph"])
    return {"status": "error", "message": "Unknown problem type"}
