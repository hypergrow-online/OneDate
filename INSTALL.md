# Central Operativa Personal (COP) - Manual de Instalación y Uso

## Descripción

Central Operativa Personal (COP) es una plataforma web personal para gestión de tareas, notas, objetivos y seguimiento de productividad.

## Stack Tecnológico

- **Backend**: FastAPI (Python)
- **Frontend**: React + Vite + Tailwind CSS
- **Base de Datos**: MongoDB
- **Contenedorización**: Docker

## Requisitos Previos

- Python 3.11+
- Node.js 18+
- MongoDB 7.0+
- Docker y Docker Compose (opcional)

## Instalación

### Opción 1: Con Docker (Recomendado)

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd OneDate
```

2. Iniciar los servicios con Docker Compose:
```bash
docker-compose up -d
```

3. La aplicación estará disponible en:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs
   - MongoDB: localhost:27017

### Opción 2: Instalación Manual

#### Backend

1. Navegar al directorio backend:
```bash
cd backend
```

2. Crear un entorno virtual:
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

4. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tu configuración
```

5. Iniciar MongoDB (si no está corriendo)

6. Ejecutar el backend:
```bash
uvicorn app.main:app --reload
```

O usar el script:
```bash
chmod +x run.sh
./run.sh
```

#### Frontend

1. Navegar al directorio frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env si es necesario
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

## Uso

### Registro e Inicio de Sesión

1. Abrir http://localhost:3000 en tu navegador
2. Hacer clic en "Registrarse"
3. Completar el formulario de registro
4. Iniciar sesión con tus credenciales

### Gestión de Tareas

- **Crear tarea**: Click en "+ Nueva Tarea"
- **Editar tarea**: Click en "Editar" en una tarjeta
- **Eliminar tarea**: Click en "Eliminar"
- **Organización**: Las tareas se organizan en tres columnas:
  - Pendientes
  - En Proceso
  - Completadas

### Gestión de Notas

- **Crear nota**: Click en "+ Nueva Nota"
- **Buscar notas**: Usar la barra de búsqueda
- **Organizar**: Las notas se pueden organizar en carpetas
- **Editar/Eliminar**: Botones en cada tarjeta de nota

### Dashboard

El dashboard muestra un resumen de:
- Total de tareas
- Tareas completadas
- Tareas pendientes
- Total de notas
- Listas de tareas y notas recientes

## API Documentation

La documentación interactiva de la API está disponible en:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Estructura del Proyecto

```
OneDate/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # Endpoints de la API
│   │   ├── core/            # Configuración y seguridad
│   │   ├── crud/            # Operaciones CRUD
│   │   ├── db/              # Conexión a MongoDB
│   │   ├── models/          # Modelos Pydantic
│   │   └── main.py          # Aplicación principal
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── pages/           # Páginas principales
│   │   ├── services/        # Servicios de API
│   │   └── styles/          # Estilos CSS
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Características Implementadas (Fase 1 - MVP)

- ✅ Autenticación JWT
- ✅ Gestión de tareas (CRUD)
- ✅ Sistema de notas con búsqueda
- ✅ Dashboard con estadísticas
- ✅ Interfaz responsive con Tailwind CSS
- ✅ Organización de tareas tipo Kanban
- ✅ Priorización de tareas
- ✅ Organización de notas por carpetas

## Próximas Características (Fases 2 y 3)

- [ ] Pomodoro Tracker
- [ ] Gestión de objetivos (OKR)
- [ ] Matriz de Eisenhower
- [ ] Data Vault (almacenamiento cifrado)
- [ ] Drag & Drop para tareas
- [ ] Editor Markdown para notas
- [ ] Notificaciones
- [ ] Gráficos de productividad

## Solución de Problemas

### El backend no se conecta a MongoDB

Verificar que MongoDB esté corriendo:
```bash
# Si usas Docker
docker ps | grep mongo

# Si MongoDB está instalado localmente
sudo systemctl status mongod
```

### Error de CORS en el frontend

Verificar que `BACKEND_CORS_ORIGINS` en `.env` del backend incluya la URL del frontend.

### Dependencias de Python no se instalan

Asegurarse de tener Python 3.11+ y pip actualizado:
```bash
python --version
pip install --upgrade pip
```

## Contribución

Este es un proyecto personal, pero las sugerencias son bienvenidas.

## Licencia

Este proyecto es de uso personal.

## Contacto

Para más información, consultar el README.md del proyecto.
