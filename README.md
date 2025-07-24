# Calculadora Operativa

Este proyecto contiene un backend (API en FastAPI) y un frontend (Next.js) para resolver problemas de optimización lineal, transporte y redes.

## Instalación y ejecución

Solo necesitas instalar las dependencias y ejecutar los siguientes comandos para levantar el backend y el frontend.

### Backend (FastAPI)

1. (Recomendado) Crea y activa un entorno virtual de Python:

```bash
cd app
python -m venv venv
```

- En **Windows**:

```bash
venv\Scripts\activate
```

- En **Mac/Linux**:

```bash
source venv/bin/activate
```

2. Instala las dependencias:

```bash
pip install -r requirements.txt
```

3. Ejecuta el backend:

```bash
uvicorn main:app --reload
```

El backend estará disponible en [http://localhost:8000](http://localhost:8000)

### Frontend (Next.js)

1. Instala las dependencias:

```bash
cd frontend/frontend
npm install
```

2. Ejecuta el frontend:

```bash
npm run dev
```

El frontend estará disponible en [http://localhost:3000](http://localhost:3000)

---

¡Eso es todo! Solo instala y ejecuta los comandos anteriores para comenzar a usar la calculadora operativa.
