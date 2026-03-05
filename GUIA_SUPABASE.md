# 🚀 Guía de Configuración de Supabase para Love Galaxy

Para que tu proyecto "Love Galaxy" funcione al máximo con una base de datos real en la nube, sigue estos pasos para configurar **Supabase**.

## Paso 1: Crear una cuenta y proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com/) y regístrate (es gratis).
2. Haz clic en **"New Project"**.
3. Elige tu organización, ponle un nombre (ej. `Love Galaxy`), establece una contraseña segura para la base de datos y selecciona una región cercana a ti.
4. Espera unos minutos a que se cree el proyecto.

## Paso 2: Obtener las credenciales

1. Una vez creado el proyecto, ve a **Project Settings** (icono de engranaje ⚙️ abajo a la izquierda).
2. Selecciona **API**.
3. Copia la **Project URL**.
4. Copia la **anon public** key (API Key).

## Paso 3: Conectar tu código

1. Abre el archivo `supabase-client.js` en tu proyecto.
2. Reemplaza los valores de ejemplo con tus credenciales reales:

```javascript
const SUPABASE_URL = 'TU_URL_DE_SUPABASE_AQUI';
const SUPABASE_ANON_KEY = 'TU_KEY_ANON_AQUI';
```

## Paso 4: Crear las Tablas (Base de Datos)

1. En el panel de Supabase, ve al **SQL Editor** (icono de terminal `>_` en la barra lateral).
2. Haz clic en **"New Query"**.
3. Abre el archivo `supabase-setup.sql` de este proyecto, copia todo su contenido y pégalo en el editor de Supabase.
4. Haz clic en **Run** (botón verde).
   - Esto creará automáticamente todas las tablas necesarias (`timeline_events`, `memories`, `gallery_photos`, etc.) y configurará la seguridad.

## Paso 5: Configurar el Almacenamiento (Storage) para Fotos

El script SQL del paso anterior intenta crear el "bucket" para las fotos, pero a veces es mejor verificarlo manualmente:

1. Ve a **Storage** (icono de carpeta 📁).
2. Si no ves un bucket llamado `love_gallery`, haz clic en **"New Bucket"**.
3. Llámalo `love_gallery`.
4. **IMPORTANTE**: Asegúrate de marcarlo como **"Public bucket"** (para que las fotos se puedan ver en la web).
5. Guarda los cambios.

## ¡Listo! 🎉

Ahora tu proyecto "Love Galaxy" guardará automáticamente:
- ✨ Eventos de la historia
- 📸 Fotos de la galería
- 📖 Recuerdos del libro
- 🎮 Puntuaciones de juegos
- 💌 Respuestas a preguntas

Si Supabase no está conectado (o si hay un error de red), la aplicación seguirá funcionando usando la memoria local del navegador (`localStorage`) como respaldo.
