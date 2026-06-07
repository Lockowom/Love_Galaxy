# CLAUDE.md — Guía del proyecto Love Galaxy

> Memoria del proyecto. Léela al empezar y respétala en cada cambio.

## 📚 Regla permanente: mantener SIEMPRE la documentación actualizada

Cada vez que cambies código, arquitectura, scripts, despliegue o configuración,
**actualiza en el mismo commit la documentación afectada**:

- `README.md` — estructura del proyecto, instalación/uso, scripts npm.
- `DEPLOYMENT.md` — pasos y configuración de despliegue en Render.
- `ANALISIS_PROYECTO.md` — mapa de archivos, diagramas y arquitectura.
- `GUIA_*.md` / `INSTRUCCIONES_RENDER.txt` — guías de usuario relevantes.
- Esta `CLAUDE.md` — si cambian convenciones o arquitectura.

No dejes la documentación desincronizada con el código.

## 🏗️ Arquitectura (resumen)

- SPA estática vanilla (sin bundler) + Supabase (Auth/Postgres/Storage) + Render.
- `main.js` es el **orquestador**: en `DOMContentLoaded` llama al `init()` de cada módulo
  y, tras login, `loadUserData()` llama a sus loaders.
- **Módulos ES** (`type="module"`): `auth-ui.js`, `gallery-manager.js`,
  `playlist-manager.js`, `timeline-manager.js`. Cada uno:
  1. lee helpers globales (`db`, `showToast`, `showNotification`, `escapeHtml`, `gsap`),
  2. **publica en `window`** las funciones usadas por `onclick` inline,
  3. expone `window.XManager = { init, ... }`.
- Scripts **clásicos** (no módulos): `supabase-client.js`, `db.js`, `achievements.js`,
  `animations.js`, `extras.js`, `galaxy-game.js`, `dome-gallery.js`, `main.js`, `love-games.js`.

### Convenciones importantes
- El HTML usa muchos `onclick="fn()"`. Si mueves o creas una función llamada desde el
  HTML (o desde HTML generado en JS), **debe quedar en `window`**.
- La app requiere **servidor HTTP** (los `type="module"` no cargan desde `file://`).
- **Caché:** HTML `no-store`; assets `immutable` + `?v=<buildId>` sellado por
  `scripts/stamp-version.js` (es el `buildCommand` de `render.yaml`). No subas el número
  de versión a mano: el build lo sella solo.
- **Offline:** `db.js` y `supabase-client.js` emiten el evento `cloud-status`; el banner
  de "modo sin conexión" vive en `supabase-client.js`.

## ✅ Flujo de trabajo
- Rama de desarrollo: `claude/project-review-an7jj` (no hacer push a otras sin permiso).
- Antes de commitear: `npm test` debe salir verde.
- El despliegue en Render es **auto-deploy** al hacer push a la rama conectada.
  Para limpiar caché del CDN: Render → Manual Deploy → "Clear build cache & deploy".
