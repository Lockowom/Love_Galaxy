# 🚀 Guía de Despliegue en Render

## ⚙️ Configuración actual (automática vía `render.yaml`)

El repositorio incluye `render.yaml`, que define TODO el despliegue. No necesitas
configurar el build a mano si conectas el repo como **Blueprint**:

- **Build Command:** `node scripts/stamp-version.js` → sella `?v=<buildId>` en
  `index.html` para invalidar la caché de los assets en cada deploy.
- **Publish directory:** `.`
- **Caché (cabeceras):**
  - HTML (`/`, `/index.html`, `/*.html`) → `no-store, must-revalidate` (siempre fresco).
  - Assets (`/*.js`, `/*.css`, `/*.png`) → `public, max-age=31536000, immutable`.
- **Seguridad:** CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`.
- **Rewrite SPA:** `/* → /index.html`.

> Resultado: el HTML nunca se queda pegado en caché y los assets se cachean fuerte
> pero se invalidan solos al cambiar `?v=`. Esto elimina el problema de "los cambios
> no se ven".

### 🔄 Forzar un deploy limpio (y limpiar caché del CDN)

```bash
# 1) Cualquier push a la rama conectada dispara el auto-deploy:
git push origin <rama-conectada>

# 2) Para limpiar también la caché del CDN de Render:
#    Dashboard → servicio love-galaxy → Manual Deploy → "Clear build cache & deploy"
```

Antes de desplegar conviene ejecutar `npm test` (debe salir verde).

> Nota: `render.yaml` incluye `healthCheckPath: /`. Es propio de *web services*; en
> *static sites* Render suele ignorarlo. Si un deploy fallara por validación de ese
> campo, elimínalo del `render.yaml` (no es necesario para un sitio estático).

---

## Opción 1: Despliegue Automático desde GitHub (Recomendado)

### Paso 1: Preparar el Repositorio

1. **Asegúrate de que todos los archivos estén en GitHub**:
   ```bash
   git add .
   git commit -m "Preparar para deployment en Render"
   git push origin main
   ```

### Paso 2: Crear Servicio en Render

1. **Ir a Render**: https://render.com
2. **Crear cuenta gratuita** si no la tienes
3. **Hacer clic en "New +"** → Seleccionar **"Static Site"**

### Paso 3: Configurar el Proyecto

En el formulario de configuración:

- **Name**: `love-galaxy` (o el nombre que prefieras)
- **Repository**: Conecta tu repositorio `Lockowom/Love_Galaxy`
- **Branch**: la rama que quieras desplegar (este proyecto se desarrolla en
  `claude/project-review-an7jj`; usa la rama que tengas conectada en Render)
- **Build Command**: `node scripts/stamp-version.js` (lo define `render.yaml`)
- **Publish Directory**: `.` (raíz del proyecto)

### Paso 4: Configuración Avanzada (Opcional)

Si quieres configuración adicional:

```yaml
Headers:
  - Key: Cache-Control
    Value: public, max-age=31536000
```

### Paso 5: Desplegar

1. Hacer clic en **"Create Static Site"**
2. Render automáticamente:
   - Clonará tu repositorio
   - Desplegará los archivos
   - Generará una URL pública
3. **¡Listo!** Tu sitio estará disponible en: `https://love-galaxy.onrender.com`

---

## Opción 2: Despliegue Manual (Rápido)

### Usando Render Dashboard

1. Ve a https://render.com/dashboard
2. Clic en **"New +"** → **"Static Site"**
3. Selecciona **"Deploy from GitHub"**
4. Conecta el repositorio `Lockowom/Love_Galaxy`
5. Configuración:
   - Build Command: `node scripts/stamp-version.js`
   - Publish directory: `.`
6. Clic en **"Create Static Site"**

---

## Opción 3: Despliegue con Git Manual

Si prefieres control manual:

```bash
# 1. Inicializar repositorio si no existe
git init
git add .
git commit -m "Initial commit for Render deployment"

# 2. Agregar remote de GitHub
git remote add origin https://github.com/Lockowom/Love_Galaxy.git
git branch -M main
git push -u origin main

# 3. Luego sigue los pasos de la Opción 1
```

---

## 🔧 Configuración Adicional

### Variables de Entorno (No necesarias para esta app)

Si en el futuro quieres agregar APIs o configuraciones:

1. En Render Dashboard → Tu proyecto
2. Ir a **"Environment"**
3. Agregar variables necesarias

### Dominio Personalizado

1. En Render Dashboard → Tu proyecto
2. Ir a **"Settings"** → **"Custom Domain"**
3. Agregar tu dominio (requiere configurar DNS)

Ejemplo:
```
lovegalaxytamara.com → CNAME → love-galaxy.onrender.com
```

---

## 📊 Características del Plan Gratuito de Render

✅ **SSL/HTTPS automático** - Certificado gratuito  
✅ **CDN global** - Entrega rápida en todo el mundo  
✅ **100 GB bandwidth/mes** - Suficiente para un sitio personal  
✅ **Auto-despliegue** - Cada push a main despliega automáticamente  
✅ **Sin límite de tiempo** - El sitio permanece online  

---

## 🚨 Troubleshooting

### Problema: "Build Failed"
**Solución**: El Build Command es `node scripts/stamp-version.js` (requiere Node, que
Render provee por defecto). Si falla por el campo `healthCheckPath`, elimínalo de
`render.yaml`. Verifica también que `scripts/stamp-version.js` exista en el repo.

### Problema: "404 Not Found"
**Solución**: Verifica que `index.html` esté en la raíz del proyecto.

### Problema: "Assets no cargan"
**Solución**: Verifica que las rutas de archivos JS/CSS sean relativas:
```html
✅ Correcto: <script src="main.js"></script>
❌ Incorrecto: <script src="/main.js"></script>
```

### Problema: "El sitio es lento"
**Solución**: 
- Activa el caché en Headers
- Comprime imágenes
- Considera un plan de pago para mejor rendimiento

---

## 🔄 Actualizaciones Automáticas

Una vez configurado:

```bash
# 1. Hacer cambios en el código
# 2. Commit y push
git add .
git commit -m "Actualizar contenido"
git push origin main

# 3. Render automáticamente detecta el cambio y redespliega
# 4. En 1-2 minutos, los cambios estarán en vivo
```

---

## 📱 URLs del Proyecto

Después del despliegue, tendrás:

- **URL de Render**: `https://love-galaxy.onrender.com`
- **Dashboard**: `https://dashboard.render.com/`
- **Logs**: Disponibles en el dashboard para debugging

---

## 🎯 Siguiente Paso: Personalización

Una vez desplegado, puedes:

1. **Compartir la URL** con Tamara 💕
2. **Agregar dominio personalizado** (opcional)
3. **Configurar analytics** (opcional)
4. **Habilitar PWA** para app móvil (opcional)

---

## 💡 Alternativas a Render

Si prefieres otras plataformas:

### GitHub Pages (Gratis)
```bash
# Ya tienes el repo en GitHub
# 1. Settings → Pages
# 2. Source: main branch
# 3. Listo: https://lockowom.github.io/Love_Galaxy
```

### Netlify (Gratis)
- Similar a Render
- Drag & drop de carpeta
- URL: `https://love-galaxy.netlify.app`

### Vercel (Gratis)
- Optimizado para web apps
- Deploy automático
- URL: `https://love-galaxy.vercel.app`

---

## ✅ Checklist de Pre-Despliegue

Antes de desplegar, verifica:

- [x] Todos los archivos comprometidos en Git
- [x] `index.html` en la raíz
- [x] Todos los archivos JS/CSS referenced correctamente
- [x] Sin rutas absolutas en el código
- [x] `.gitignore` configurado
- [x] `README.md` actualizado
- [x] Repositorio público o acceso configurado

---

## 🎉 ¡Ya está listo para desplegar!

Sigue los pasos de la **Opción 1** (Despliegue Automático) para el método más fácil.

**Tiempo estimado**: 5-10 minutos desde cero.

---

## 📞 Soporte

Si tienes problemas:
- 📖 [Documentación de Render](https://render.com/docs/static-sites)
- 💬 [Community Forum](https://community.render.com/)
- 📧 Soporte de Render: support@render.com

---

**¡Buena suerte con el despliegue!** 🚀💕
