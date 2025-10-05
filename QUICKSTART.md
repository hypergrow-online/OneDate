# 🚀 Guía de Inicio Rápido - COP

## ⚡ Opción 1: Docker (Más Rápido)

```bash
# 1. Iniciar todos los servicios
docker-compose up -d

# 2. Esperar a que los servicios estén listos (30-60 segundos)

# 3. Abrir el navegador
# Frontend: http://localhost:3000
# API Docs: http://localhost:8000/docs
```

## 💻 Opción 2: Desarrollo Local

### Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env

# Iniciar MongoDB (debe estar corriendo)
# Ejemplo con Docker: docker run -d -p 27017:27017 mongo:7.0

# Iniciar backend
uvicorn app.main:app --reload
```

Backend corriendo en: http://localhost:8000

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

Frontend corriendo en: http://localhost:3000

## 📝 Primer Uso

1. **Registrar Usuario**
   - Ir a http://localhost:3000
   - Click en "Registrarse"
   - Completar formulario
   - Iniciar sesión

2. **Explorar Dashboard**
   - Ver estadísticas iniciales
   - Navegar entre secciones

3. **Crear Primera Tarea**
   - Ir a "Tareas"
   - Click "+ Nueva Tarea"
   - Completar información
   - Ver tarea en tablero Kanban

4. **Crear Primera Nota**
   - Ir a "Notas"
   - Click "+ Nueva Nota"
   - Escribir contenido
   - Guardar

## 🛠️ Comandos Útiles

### Docker

```bash
# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Reiniciar servicios
docker-compose restart

# Eliminar todo (incluyendo volúmenes)
docker-compose down -v
```

### Backend

```bash
# Ver documentación de API
# Abrir http://localhost:8000/docs

# Ejecutar en modo desarrollo
uvicorn app.main:app --reload

# Verificar estructura
python test_structure.py
```

### Frontend

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🔧 Solución de Problemas

### MongoDB no conecta

```bash
# Verificar que MongoDB está corriendo
docker ps | grep mongo

# O iniciar MongoDB con Docker
docker run -d -p 27017:27017 --name cop_mongodb mongo:7.0
```

### Puerto ocupado

```bash
# Backend (8000)
lsof -i :8000
kill -9 <PID>

# Frontend (3000)
lsof -i :3000
kill -9 <PID>
```

### Error de dependencias

```bash
# Backend
cd backend
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📚 Próximos Pasos

1. Explorar la API en http://localhost:8000/docs
2. Leer `INSTALL.md` para más detalles
3. Ver `PROJECT_STATUS.md` para características implementadas
4. Comenzar a usar las tareas y notas

## 🎯 URLs Importantes

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs (Swagger)**: http://localhost:8000/docs
- **API Docs (ReDoc)**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

¡Listo para comenzar! 🎉
