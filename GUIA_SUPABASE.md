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

## Paso 4: Activar el inicio de sesión por Email

La app protege tus datos con cuentas (email + contraseña), así nadie más puede leerlos o modificarlos.

1. En el panel de Supabase ve a **Authentication > Providers**.
2. Activa el proveedor **Email**.
3. (Opcional, recomendado para uso personal) En **Authentication > Providers > Email**, desactiva *"Confirm email"* para poder entrar inmediatamente tras registrarte sin tener que confirmar el correo.

## Paso 5: Crear las Tablas y la Seguridad (Base de Datos)

1. En el panel de Supabase, ve al **SQL Editor** (icono de terminal `>_` en la barra lateral).
2. Haz clic en **"New Query"**.
3. Abre el archivo `supabase-setup.sql` de este proyecto, copia **todo** su contenido y pégalo en el editor.
4. Haz clic en **Run** (botón verde).
   - Esto crea todas las tablas, activa la seguridad **RLS por usuario** (cada cuenta sólo ve sus propios datos) y crea los buckets de **Storage privados** para fotos y canciones.

> ¿Ya tenías la app funcionando con acceso público y datos creados? Usa
> `migrate_to_auth.sql` en lugar de `supabase-setup.sql` (sigue las instrucciones
> dentro del archivo para asignar los datos existentes a tu cuenta).

## Paso 6: Crear tu cuenta e iniciar sesión

1. Abre la app. Verás la pantalla de **Love Galaxy** con el formulario de acceso.
2. Pulsa **"Crear cuenta"**, introduce un email y una contraseña (mínimo 6 caracteres) y confirma.
3. Inicia sesión y ¡listo!

> 💑 **Consejo para parejas:** si quieren compartir los mismos recuerdos, usen
> **una única cuenta** (mismo email y contraseña) en ambos dispositivos. Como la
> seguridad es por usuario, cada cuenta distinta tendría sus propios datos
> separados.

## ¡Listo! 🎉

Ahora tu proyecto "Love Galaxy" guardará de forma segura y privada:
- ✨ Eventos de la historia
- 📸 Fotos de la galería (Storage privado con URLs firmadas)
- 📖 Recuerdos del libro
- 🎮 Puntuaciones de juegos
- 💌 Respuestas a preguntas y mensajes
- 🎵 Playlist de canciones

Si Supabase no está conectado (o hay un error de red), la app avisa y usa la
memoria local del navegador (`localStorage`) como respaldo temporal de algunos
datos.
