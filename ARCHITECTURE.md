# Arquitectura del Sistema - Central Operativa Personal

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USUARIO / NAVEGADOR                          │
│                      http://localhost:3000                          │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ HTTP/HTTPS
                             │
┌────────────────────────────▼────────────────────────────────────────┐
│                     FRONTEND (React + Vite)                          │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Pages:                                                       │  │
│  │  • Login/Register (Autenticación)                            │  │
│  │  • Dashboard (Estadísticas y Resumen)                        │  │
│  │  • Tasks (Gestión de Tareas - Kanban)                        │  │
│  │  • Notes (Gestión de Notas - Búsqueda)                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Services:                                                    │  │
│  │  • api.js (Axios con interceptors)                           │  │
│  │  • auth.js (Autenticación)                                   │  │
│  │  • tasks.js (API de Tareas)                                  │  │
│  │  • notes.js (API de Notas)                                   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  Tailwind CSS + React Router DOM                                    │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ REST API (JSON)
                             │ JWT Token in Headers
                             │
┌────────────────────────────▼────────────────────────────────────────┐
│                    BACKEND (FastAPI + Python)                        │
│                     http://localhost:8000                           │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  API Endpoints (v1):                                          │  │
│  │  • /api/v1/auth/*     (Autenticación JWT)                    │  │
│  │  • /api/v1/tasks/*    (CRUD de Tareas)                       │  │
│  │  • /api/v1/notes/*    (CRUD + Búsqueda de Notas)             │  │
│  │  • /docs              (Documentación Swagger)                │  │
│  │  • /health            (Health Check)                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Core:                                                        │  │
│  │  • config.py (Configuración centralizada)                    │  │
│  │  • security.py (JWT, Password Hashing)                       │  │
│  │  • deps.py (Dependency Injection)                            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Models (Pydantic):                                           │  │
│  │  • User, UserCreate, UserResponse                            │  │
│  │  • Task, TaskCreate, TaskUpdate, TaskResponse                │  │
│  │  • Note, NoteCreate, NoteUpdate, NoteResponse                │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  CRUD Operations:                                             │  │
│  │  • crud_user.py                                              │  │
│  │  • crud_task.py                                              │  │
│  │  • crud_note.py                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ PyMongo
                             │
┌────────────────────────────▼────────────────────────────────────────┐
│                        MongoDB Database                              │
│                       mongodb://localhost:27017                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Collections:                                                 │  │
│  │  • users     (Usuarios del sistema)                          │  │
│  │  • tasks     (Tareas con estado y prioridad)                 │  │
│  │  • notes     (Notas con búsqueda de texto)                   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  NoSQL - Esquema flexible                                           │
└──────────────────────────────────────────────────────────────────────┘
```

## Flujo de Datos

### 1. Autenticación
```
Usuario → Login Form → POST /api/v1/auth/login
                    ↓
                MongoDB (verificar usuario)
                    ↓
                JWT Token generado
                    ↓
           Token guardado en localStorage
                    ↓
         Todas las requests incluyen token
```

### 2. Crear Tarea
```
Usuario → Formulario Nueva Tarea → POST /api/v1/tasks/
                                 ↓
                         Validación Pydantic
                                 ↓
                         Verificar JWT token
                                 ↓
                         MongoDB.insert_one()
                                 ↓
                         Retornar TaskResponse
                                 ↓
                         Actualizar UI
```

### 3. Buscar Notas
```
Usuario → Input búsqueda → GET /api/v1/notes/search?q=query
                        ↓
                Verificar JWT token
                        ↓
                MongoDB regex search
                        ↓
                Retornar lista de notas
                        ↓
                Mostrar resultados
```

## Tecnologías por Capa

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **Routing**: React Router DOM 6.20.0
- **HTTP Client**: Axios 1.6.2
- **Styling**: Tailwind CSS 3.3.6
- **Date Utils**: date-fns 2.30.0

### Backend
- **Framework**: FastAPI 0.104.1
- **ASGI Server**: Uvicorn 0.24.0
- **Validation**: Pydantic 2.5.0
- **Database Driver**: PyMongo 4.6.0
- **Authentication**: python-jose 3.3.0
- **Password Hashing**: passlib 1.7.4

### Base de Datos
- **Database**: MongoDB 7.0
- **Type**: NoSQL Document Store
- **Collections**: users, tasks, notes

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Environment**: .env files

## Seguridad

```
┌─────────────────────────────────────────┐
│         Medidas de Seguridad            │
├─────────────────────────────────────────┤
│ 1. JWT Tokens                           │
│    • Stateless authentication           │
│    • 30 min expiration                  │
│    • HMAC SHA-256 signature             │
│                                         │
│ 2. Password Hashing                     │
│    • bcrypt algorithm                   │
│    • Automatic salt generation          │
│    • Verify on login                    │
│                                         │
│ 3. CORS Protection                      │
│    • Configured origins                 │
│    • Credentials allowed                │
│                                         │
│ 4. Data Validation                      │
│    • Pydantic models                    │
│    • Type checking                      │
│    • Email validation                   │
│                                         │
│ 5. User Isolation                       │
│    • User ID in all queries             │
│    • No cross-user data access          │
└─────────────────────────────────────────┘
```

## Escalabilidad Futura

### Fase 2 - Expansión
- Agregar Redis para caché
- WebSockets para actualizaciones en tiempo real
- File storage para adjuntos
- Búsqueda full-text con índices MongoDB

### Fase 3 - IA Integration
- Vector database (pgvector/Pinecone)
- Embeddings para búsqueda semántica
- ML models para sugerencias
- Analytics avanzado

## Deployment

### Desarrollo
```bash
docker-compose up -d
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# MongoDB: localhost:27017
```

### Producción (Futuro)
- Frontend: Vercel/Netlify (Static hosting)
- Backend: Railway/Render (Container hosting)
- Database: MongoDB Atlas (Cloud)
- Domain: Custom DNS
- SSL: Let's Encrypt

## Monitoreo (Futuro)

```
┌──────────────────────────────┐
│       Logging Layer          │
│  • Application logs          │
│  • Error tracking            │
│  • Performance metrics       │
└──────────────────────────────┘
         ↓
┌──────────────────────────────┐
│    Monitoring Service        │
│  • Sentry (errors)           │
│  • Prometheus (metrics)      │
│  • Grafana (dashboards)      │
└──────────────────────────────┘
```
