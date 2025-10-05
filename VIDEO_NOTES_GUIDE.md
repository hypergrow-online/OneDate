# Video Notas - Guía de Usuario

## 📹 Introducción

La funcionalidad de Video Notas te permite grabar notas en formato de video usando tu cámara y micrófono. Los videos se guardan automáticamente en Google Drive (carpeta "Video/Notas") como respaldo, además de almacenarse localmente en el servidor.

## 🎯 Características

- ✅ Grabación de video con cámara y micrófono
- ✅ Previsualización antes de guardar
- ✅ Respaldo automático en Google Drive (carpeta Video/Notas)
- ✅ Almacenamiento local como backup
- ✅ Reproducción directa en la interfaz
- ✅ Organización por carpetas igual que notas de texto

## 🚀 Cómo Usar

### Grabar una Video Nota

1. **Accede a Notas**: Desde el menú lateral, haz clic en "Notas"

2. **Inicia la Grabación**: 
   - Haz clic en el botón **"Video Nota"** (con ícono de cámara)
   - El navegador te pedirá permisos para acceder a tu cámara y micrófono
   - Permite el acceso para continuar

3. **Graba tu Video**:
   - Aparecerá la vista previa de tu cámara
   - Haz clic en **"Iniciar Grabación"** cuando estés listo
   - Verás un indicador rojo "Grabando..." mientras grabas
   - Haz clic en **"Detener Grabación"** cuando termines

4. **Revisa y Guarda**:
   - Después de grabar, puedes reproducir el video para revisarlo
   - Si no te gusta, haz clic en **"Descartar"** para volver a grabar
   - Ingresa un **título** para tu video nota
   - Opcionalmente, especifica una **carpeta** (por defecto: "General")
   - Haz clic en **"Guardar Video Nota"**

5. **Espera la Subida**:
   - El video se subirá al servidor
   - Si Google Drive está configurado, también se respaldará ahí
   - Una vez completado, verás tu video nota en la lista

### Ver Video Notas

Las video notas aparecen en el grid de notas con:
- Un ícono de video 🎥 junto al título
- Un reproductor de video integrado
- La etiqueta "video" automáticamente asignada

Para reproducir:
- Simplemente haz clic en el botón ▶️ en el reproductor
- Puedes controlar el volumen, pausar, y usar pantalla completa

### Eliminar Video Notas

- Haz clic en **"Eliminar"** en la tarjeta de la video nota
- Confirma la eliminación
- El video se eliminará tanto localmente como de Google Drive (si está configurado)

## 🔧 Configuración

### Requisitos del Navegador

- **Navegadores Compatibles**: Chrome, Edge, Firefox, Safari (moderno)
- **Permisos Necesarios**: Cámara y micrófono
- **Formato de Video**: WebM (codec VP9)

### Google Drive (Opcional)

Para habilitar el respaldo en Google Drive, sigue la guía en `GOOGLE_DRIVE_SETUP.md`.

**Sin Google Drive:**
- Los videos se guardarán únicamente en el servidor local
- Todo funcionará normalmente, solo sin el respaldo en la nube

**Con Google Drive:**
- Los videos se guardan en servidor local Y en Google Drive
- Carpeta de destino: `Video/Notas`
- Respaldo automático para mayor seguridad

## ⚙️ Configuración Técnica

### Backend

El backend gestiona:
- Recepción de archivos de video (multipart/form-data)
- Almacenamiento local en carpeta `uploads/`
- Subida a Google Drive (si está configurado)
- Registro en MongoDB con la URL del video

### Frontend

El frontend utiliza:
- **MediaRecorder API** para capturar video y audio
- **navigator.mediaDevices.getUserMedia()** para acceder a cámara/micrófono
- Formato WebM con codec VP9 para compatibilidad

## 🐛 Solución de Problemas

### No puedo acceder a la cámara

**Problema:** El navegador no solicita permisos o muestra error

**Soluciones:**
1. Verifica que estás usando HTTPS (o localhost)
2. Revisa los permisos del navegador para el sitio
3. Intenta con otro navegador
4. Verifica que tu cámara no está siendo usada por otra aplicación

### El video no se sube

**Problema:** Error al guardar la video nota

**Soluciones:**
1. Verifica tu conexión a internet
2. Revisa que el servidor backend está corriendo
3. Verifica los logs del backend para más detalles
4. Intenta con un video más corto

### El video no se reproduce

**Problema:** El reproductor no muestra el video

**Soluciones:**
1. Verifica que el servidor backend está sirviendo archivos estáticos
2. Revisa la consola del navegador para errores
3. Intenta refrescar la página
4. Verifica que la URL del video es accesible

### Google Drive no está funcionando

**Problema:** Los videos no se respaldan en Google Drive

**Soluciones:**
1. Verifica que configuraste las credenciales correctamente (ver `GOOGLE_DRIVE_SETUP.md`)
2. Revisa los logs del backend
3. Verifica que la API de Google Drive está habilitada
4. Confirma que el archivo de credenciales tiene permisos de lectura

**Nota:** Sin Google Drive configurado, las video notas seguirán funcionando con almacenamiento local.

## 📊 Limitaciones Actuales

- **Tamaño de Video**: Depende de la configuración del servidor
- **Formatos**: Solo WebM (altamente compatible)
- **Edición**: No se pueden editar video notas después de crearlas
- **Duración**: Sin límite de duración, pero videos largos tardan más en subir

## 🔮 Futuras Mejoras

Posibles mejoras planificadas:
- [ ] Soporte para múltiples formatos de video
- [ ] Límite de duración configurable
- [ ] Compresión automática de videos
- [ ] Thumbnails/miniaturas de video
- [ ] Transcripción automática (con IA)
- [ ] Edición básica de video (recortar inicio/fin)

## 💡 Consejos

1. **Iluminación**: Graba en un lugar bien iluminado para mejor calidad
2. **Audio**: Habla claramente y cerca del micrófono
3. **Prueba primero**: Haz una grabación de prueba para verificar audio y video
4. **Duración**: Mantén videos cortos y concisos (1-5 minutos idealmente)
5. **Organización**: Usa carpetas para organizar tus video notas por tema

## 🔒 Privacidad y Seguridad

- Las video notas están protegidas por autenticación JWT
- Solo tú puedes ver y acceder a tus video notas
- Los videos en Google Drive se guardan en la cuenta de servicio configurada
- No se comparten públicamente a menos que lo configures manualmente

---

Para más información sobre la configuración técnica, consulta:
- `GOOGLE_DRIVE_SETUP.md` - Configuración de Google Drive
- `INSTALL.md` - Instalación general del sistema
- `PROJECT_STATUS.md` - Estado actual del proyecto
