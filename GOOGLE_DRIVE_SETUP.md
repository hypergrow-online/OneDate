# Configuración de Google Drive para Video Notas

Este documento explica cómo configurar la integración con Google Drive para respaldar automáticamente las video notas en la carpeta "Video/Notas".

## Resumen

Las video notas se guardan:
1. **Localmente** en el servidor (carpeta `uploads/`) - siempre disponible
2. **Google Drive** (carpeta `Video/Notas`) - respaldo en la nube (opcional)

Si no configuras Google Drive, las video notas funcionarán igualmente, solo que se guardarán únicamente en el servidor local.

## Configuración de Google Drive (Opcional)

### Paso 1: Crear un Proyecto en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Anota el nombre del proyecto

### Paso 2: Habilitar la API de Google Drive

1. En el menú lateral, ve a **APIs & Services** > **Library**
2. Busca "Google Drive API"
3. Click en "Google Drive API" y luego en **Enable**

### Paso 3: Crear Credenciales de Cuenta de Servicio

1. Ve a **APIs & Services** > **Credentials**
2. Click en **Create Credentials** > **Service Account**
3. Completa los detalles:
   - Nombre: `cop-video-notes`
   - Descripción: `Service account for COP video notes backup`
4. Click **Create and Continue**
5. En "Grant this service account access to project":
   - Selecciona rol: **Basic** > **Editor** (o crea un rol personalizado con permisos de Drive)
6. Click **Continue** y luego **Done**

### Paso 4: Generar la Clave JSON

1. En la lista de cuentas de servicio, encuentra la que acabas de crear
2. Click en el email de la cuenta de servicio
3. Ve a la pestaña **Keys**
4. Click **Add Key** > **Create new key**
5. Selecciona **JSON** como tipo de clave
6. Click **Create** - se descargará un archivo JSON

### Paso 5: Configurar la Aplicación

1. Guarda el archivo JSON descargado en una ubicación segura
   - Ejemplo: `/home/runner/work/OneDate/OneDate/backend/google-credentials.json`
   - **IMPORTANTE**: Este archivo contiene credenciales sensibles, no lo subas a git

2. Actualiza el archivo `.env` en el backend:
   ```bash
   GOOGLE_DRIVE_CREDENTIALS_FILE=/ruta/completa/al/archivo/credentials.json
   ```

3. Reinicia el servidor backend para aplicar los cambios

### Paso 6: Compartir la Carpeta de Drive (Opcional)

Si deseas acceder a las video notas desde tu cuenta personal de Google Drive:

1. Abre [Google Drive](https://drive.google.com/)
2. Busca el email de la cuenta de servicio (está en el archivo JSON, campo `client_email`)
3. Las video notas se guardarán en el Drive de la cuenta de servicio
4. Para verlas desde tu cuenta personal:
   - Comparte la carpeta "Video/Notas" con tu email personal desde la cuenta de servicio
   - O usa el Google Cloud Console para dar acceso

## Verificación

Para verificar que la configuración funciona:

1. Inicia sesión en la aplicación
2. Ve a la sección de **Notas**
3. Click en **Video Nota**
4. Graba un video corto
5. Guarda la video nota
6. Verifica los logs del backend:
   - Si ves "Video uploaded to Google Drive", ¡funciona!
   - Si ves "Google Drive service not initialized", revisa la configuración

## Solución de Problemas

### Error: "Could not initialize Google Drive service"

- Verifica que el archivo de credenciales existe en la ruta especificada
- Verifica que el path en `.env` es absoluto y correcto
- Verifica que el archivo JSON tiene permisos de lectura

### Error: "Error uploading video to Google Drive"

- Verifica que la API de Google Drive está habilitada
- Verifica que la cuenta de servicio tiene permisos adecuados
- Revisa los logs del backend para más detalles

### Las video notas no aparecen en mi Google Drive personal

- Las notas se guardan en el Drive de la cuenta de servicio, no en tu cuenta personal
- Para verlas, comparte la carpeta con tu cuenta personal (ver Paso 6)

## Seguridad

- **NUNCA** subas el archivo de credenciales JSON a repositorios públicos
- El archivo ya está excluido en `.gitignore`
- Mantén las credenciales seguras y con acceso restringido
- Considera usar variables de entorno o servicios de secretos para producción

## Desactivar Google Drive

Si deseas desactivar el respaldo en Google Drive:

1. Elimina o deja vacía la variable en `.env`:
   ```bash
   GOOGLE_DRIVE_CREDENTIALS_FILE=
   ```
2. Reinicia el backend
3. Las video notas seguirán funcionando, solo se guardarán localmente

## Notas Adicionales

- Cada video nota se guarda con un nombre único: `video_note_YYYYMMDD_HHMMSS_<uuid>.webm`
- Los videos se guardan en la carpeta `Video/Notas` en Google Drive
- Los videos también se mantienen localmente en `uploads/` como respaldo
- El formato por defecto es WebM (compatible con la mayoría de navegadores)
