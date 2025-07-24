def validate_linear_problem(data):
    errors = []
    if "objective" not in data or data["objective"] not in ["min", "max"]:
        errors.append("El objetivo debe ser 'min' o 'max'.")
    if "variables" not in data or not isinstance(data["variables"], list):
        errors.append("Debe definir las variables correctamente.")
    # Validar que todas las restricciones sean '<='
    if "constraints" in data and isinstance(data["constraints"], list):
        for i, constraint in enumerate(data["constraints"]):
            if constraint.get("sign") != "<=":
                errors.append(f"La restricción #{i+1} debe ser de tipo '<=' para el método Simplex.")
    return errors
def validate_transport_problem(data):
    errors = []
    if "supply" not in data or not isinstance(data["supply"], list):
        errors.append("Missing or invalid 'supply' field.")
    if "demand" not in data or not isinstance(data["demand"], list):
        errors.append("Missing or invalid 'demand' field.")
    if "cost_matrix" not in data or not isinstance(data["cost_matrix"], list):
        errors.append("Missing or invalid 'cost_matrix' field.")
    
    return errors if errors else None
