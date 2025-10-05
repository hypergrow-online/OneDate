# 🧪 Guía de Pruebas - Central Operativa Personal

Esta guía te ayudará a verificar que todas las funcionalidades del MVP están funcionando correctamente.

## Preparación

### Opción A: Usar Docker (Recomendado)

```bash
# 1. Iniciar los servicios
docker-compose up -d

# 2. Verificar que los contenedores están corriendo
docker-compose ps

# Deberías ver:
# cop_mongodb    - Up
# cop_backend    - Up  
# cop_frontend   - Up

# 3. Ver logs si hay problemas
docker-compose logs -f
```

### Opción B: Instalación Manual

```bash
# Terminal 1: MongoDB
docker run -d -p 27017:27017 --name cop_mongodb mongo:7.0

# Terminal 2: Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload

# Terminal 3: Frontend
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 📋 Lista de Verificación - Pruebas Funcionales

### 1. ✅ Backend API

#### 1.1 Health Check
```bash
curl http://localhost:8000/health
# Esperado: {"status":"healthy"}
```

#### 1.2 Documentación API
- Abrir: http://localhost:8000/docs
- ✅ Verificar que se carga Swagger UI
- ✅ Ver lista de endpoints disponibles
- ✅ Expandir secciones: authentication, tasks, notes

#### 1.3 Root Endpoint
```bash
curl http://localhost:8000/
# Esperado: {"message":"Central Operativa Personal API","version":"1.0.0","docs":"/docs"}
```

### 2. 🔐 Autenticación

#### 2.1 Registro de Usuario
1. Abrir: http://localhost:3000
2. Click en "¿No tienes cuenta? Regístrate"
3. Completar formulario:
   - Email: test@example.com
   - Username: testuser
   - Nombre completo: Test User
   - Contraseña: Test123456
   - Confirmar contraseña: Test123456
4. Click "Registrarse"
5. ✅ Verificar redirección a login

**Prueba con curl:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test2@example.com",
    "username": "testuser2",
    "full_name": "Test User 2",
    "password": "Test123456"
  }'
```

#### 2.2 Login
1. En la página de login, ingresar:
   - Email: test@example.com
   - Contraseña: Test123456
2. Click "Iniciar Sesión"
3. ✅ Verificar redirección al Dashboard
4. ✅ Verificar que aparece el nombre de usuario en la barra de navegación

**Prueba con curl:**
```bash
# Obtener token
TOKEN=$(curl -X POST http://localhost:8000/api/v1/auth/login \
  -F "username=test@example.com" \
  -F "password=Test123456" \
  | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"

# Usar token para obtener info del usuario
curl http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

#### 2.3 Protección de Rutas
1. Cerrar sesión (click "Cerrar Sesión")
2. Intentar acceder a: http://localhost:3000/dashboard
3. ✅ Verificar redirección automática a /login

### 3. 📋 Gestión de Tareas

#### 3.1 Crear Tarea
1. Navegar a "Tareas"
2. Click "+ Nueva Tarea"
3. Completar formulario:
   - Título: "Implementar login"
   - Descripción: "Crear sistema de autenticación"
   - Estado: "Pendiente"
   - Prioridad: "Alta"
4. Click "Crear"
5. ✅ Verificar que la tarea aparece en la columna "Pendientes"
6. ✅ Verificar que tiene la etiqueta de prioridad correcta (naranja para "Alta")

**Repetir con diferentes configuraciones:**
- Tarea con prioridad "Urgente" → Debe aparecer con etiqueta roja
- Tarea con estado "En Proceso" → Debe aparecer en columna central
- Tarea con estado "Completada" → Debe aparecer en columna derecha

#### 3.2 Editar Tarea
1. Click "Editar" en una tarea
2. Cambiar título a: "Implementar login - ACTUALIZADO"
3. Cambiar estado a: "En Proceso"
4. Click "Actualizar"
5. ✅ Verificar que la tarea se movió a la columna "En Proceso"
6. ✅ Verificar que el título se actualizó

#### 3.3 Eliminar Tarea
1. Click "Eliminar" en una tarea
2. Confirmar en el diálogo
3. ✅ Verificar que la tarea desapareció del tablero

#### 3.4 Estados y Columnas
Crear al menos una tarea en cada estado y verificar:
- ✅ "Pendientes" muestra solo tareas con estado "todo"
- ✅ "En Proceso" muestra solo tareas con estado "in_progress"
- ✅ "Completadas" muestra solo tareas con estado "done"
- ✅ El contador de cada columna es correcto

#### 3.5 Prioridades Visuales
Crear tareas con cada prioridad:
- ✅ "Baja" → Etiqueta verde
- ✅ "Media" → Etiqueta amarilla
- ✅ "Alta" → Etiqueta naranja
- ✅ "Urgente" → Etiqueta roja

**Prueba con curl:**
```bash
# Crear tarea
curl -X POST http://localhost:8000/api/v1/tasks/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tarea de prueba",
    "description": "Descripción de prueba",
    "status": "todo",
    "priority": "high"
  }'

# Listar tareas
curl http://localhost:8000/api/v1/tasks/ \
  -H "Authorization: Bearer $TOKEN"
```

### 4. 📝 Gestión de Notas

#### 4.1 Crear Nota
1. Navegar a "Notas"
2. Click "+ Nueva Nota"
3. Completar formulario:
   - Título: "Reunión de equipo"
   - Carpeta: "Trabajo"
   - Contenido: "Puntos discutidos en la reunión del 5 de diciembre..."
4. Click "Crear"
5. ✅ Verificar que la nota aparece en el grid
6. ✅ Verificar que muestra el ícono de carpeta "Trabajo"

#### 4.2 Editar Nota
1. Click "Editar" en una nota
2. Modificar el contenido
3. Click "Actualizar"
4. ✅ Verificar que los cambios se guardaron

#### 4.3 Buscar Notas
1. Crear varias notas con diferentes contenidos
2. En la barra de búsqueda, escribir: "reunión"
3. Click "Buscar"
4. ✅ Verificar que solo aparecen notas que contienen "reunión" en título o contenido
5. Click "Limpiar"
6. ✅ Verificar que vuelven a aparecer todas las notas

#### 4.4 Organización por Carpetas
Crear notas en diferentes carpetas:
- ✅ "General"
- ✅ "Trabajo"
- ✅ "Personal"
- ✅ "Ideas"

Verificar que cada nota muestra su carpeta correctamente.

#### 4.5 Eliminar Nota
1. Click "Eliminar" en una nota
2. Confirmar en el diálogo
3. ✅ Verificar que la nota desapareció

**Prueba con curl:**
```bash
# Crear nota
curl -X POST http://localhost:8000/api/v1/notes/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nota de prueba",
    "content": "Contenido de la nota de prueba",
    "folder": "Test",
    "tags": ["prueba", "test"]
  }'

# Buscar notas
curl "http://localhost:8000/api/v1/notes/search?q=prueba" \
  -H "Authorization: Bearer $TOKEN"
```

### 5. 📊 Dashboard

#### 5.1 Estadísticas
1. Navegar al Dashboard
2. Verificar que se muestran las tarjetas de estadísticas:
   - ✅ Total Tareas (número correcto)
   - ✅ Completadas (número correcto)
   - ✅ Pendientes (número correcto)
   - ✅ Total Notas (número correcto)

#### 5.2 Listas Recientes
1. ✅ Verificar que "Tareas Recientes" muestra hasta 5 tareas
2. ✅ Verificar que "Notas Recientes" muestra hasta 5 notas
3. ✅ Verificar que los íconos de estado son correctos (✅ para completadas, ⏳ para pendientes)

#### 5.3 Actualización en Tiempo Real
1. Crear una nueva tarea desde la página de Tareas
2. Volver al Dashboard
3. ✅ Verificar que las estadísticas se actualizaron
4. ✅ Verificar que la nueva tarea aparece en "Tareas Recientes"

### 6. 🎨 Interfaz de Usuario

#### 6.1 Navegación
1. ✅ Click en "Dashboard" → Redirige correctamente
2. ✅ Click en "Tareas" → Redirige correctamente
3. ✅ Click en "Notas" → Redirige correctamente
4. ✅ El menú activo está resaltado

#### 6.2 Responsive Design
1. Redimensionar la ventana del navegador
2. ✅ Verificar que el diseño se adapta a pantallas pequeñas
3. ✅ Verificar que el grid de notas cambia a 1 columna en móvil
4. ✅ Verificar que el tablero Kanban es scrolleable horizontalmente en móvil

#### 6.3 Modales
1. ✅ Los modales se abren correctamente
2. ✅ El fondo se oscurece cuando hay un modal abierto
3. ✅ Se puede cerrar con el botón "Cancelar"
4. ✅ Los formularios validan campos requeridos

### 7. 🔒 Seguridad

#### 7.1 Sesiones
1. Iniciar sesión
2. Cerrar el navegador
3. Abrir nuevamente
4. ✅ La sesión debería persistir (token en localStorage)

#### 7.2 Tokens Expirados
1. Esperar 30 minutos sin actividad
2. Intentar hacer una acción
3. ✅ Debería redirigir al login automáticamente

#### 7.3 Aislamiento de Datos
1. Crear un segundo usuario
2. Iniciar sesión con el segundo usuario
3. ✅ No debería ver las tareas del primer usuario
4. ✅ No debería ver las notas del primer usuario

## 🐛 Escenarios de Error

### E.1 Login Incorrecto
1. Intentar login con credenciales incorrectas
2. ✅ Verificar mensaje de error: "Incorrect email or password"

### E.2 Email Duplicado
1. Intentar registrar con un email ya usado
2. ✅ Verificar mensaje de error apropiado

### E.3 Sin Conexión a MongoDB
1. Detener MongoDB: `docker stop cop_mongodb`
2. Intentar crear una tarea
3. ✅ Debería mostrar error de conexión
4. Reiniciar MongoDB: `docker start cop_mongodb`

### E.4 Validación de Formularios
1. Intentar crear tarea sin título
2. ✅ El navegador debería prevenir el envío
3. Intentar crear nota sin contenido
4. ✅ El navegador debería prevenir el envío

## 📊 Pruebas de Rendimiento (Básicas)

### P.1 Carga de Tareas
1. Crear 50 tareas
2. ✅ Verificar que el tablero carga rápidamente (< 2 segundos)
3. ✅ Verificar que no hay lag al scrollear

### P.2 Búsqueda de Notas
1. Crear 20 notas
2. Realizar búsqueda
3. ✅ Los resultados deberían aparecer instantáneamente

### P.3 Navegación
1. ✅ Cambiar entre páginas debería ser instantáneo
2. ✅ No debería haber parpadeos o recargas innecesarias

## ✅ Checklist Final

Antes de dar por completadas las pruebas, verificar:

**Backend:**
- [ ] API responde en http://localhost:8000
- [ ] Swagger UI funciona en /docs
- [ ] Health check retorna OK
- [ ] Todos los endpoints de auth funcionan
- [ ] Todos los endpoints de tasks funcionan
- [ ] Todos los endpoints de notes funcionan
- [ ] Búsqueda de notas funciona

**Frontend:**
- [ ] Aplicación carga en http://localhost:3000
- [ ] Login funciona
- [ ] Registro funciona
- [ ] Dashboard muestra estadísticas correctas
- [ ] CRUD de tareas funciona
- [ ] Tablero Kanban muestra columnas correctas
- [ ] CRUD de notas funciona
- [ ] Búsqueda de notas funciona
- [ ] Navegación funciona
- [ ] Logout funciona
- [ ] Diseño responsive

**Seguridad:**
- [ ] Rutas protegidas redirigen a login
- [ ] JWT tokens funcionan
- [ ] Usuarios solo ven sus propios datos
- [ ] Passwords no se muestran en respuestas

**Documentación:**
- [ ] QUICKSTART.md es claro
- [ ] INSTALL.md es completo
- [ ] PROJECT_STATUS.md está actualizado
- [ ] ARCHITECTURE.md describe el sistema

## 🎉 Resultado Esperado

Si todas las pruebas pasan, el sistema está listo para:
- ✅ Uso diario básico
- ✅ Desarrollo de Fase 2
- ✅ Demostración a usuarios

## 🆘 Soporte

Si encuentras problemas:
1. Revisar logs: `docker-compose logs -f`
2. Revisar console del navegador (F12)
3. Verificar que MongoDB está corriendo
4. Verificar puertos no ocupados (3000, 8000, 27017)
5. Revisar `INSTALL.md` para troubleshooting

---

**¡Buena suerte con las pruebas! 🚀**
