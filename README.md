# 💖 Love Galaxy - Una Aplicación Web del Amor para Tamara

<div align="center">

![Love Galaxy](https://img.shields.io/badge/Love-Galaxy-ff1493?style=for-the-badge&logo=heart)
![Version](https://img.shields.io/badge/version-1.0.0-ff69b4?style=for-the-badge)
![Made with Love](https://img.shields.io/badge/Made%20with-Love-ff6b9d?style=for-the-badge&logo=heart)

**Una experiencia digital romántica e interactiva dedicada completamente al amor** ✨

[🚀 Demo en Vivo](#) | [📖 Documentación](#características) | [💕 Personalizar](#personalización)

</div>

---

## 🌟 Descripción

**Love Galaxy** es una aplicación web completamente interactiva y romántica, diseñada para celebrar y preservar los momentos especiales del amor. Con animaciones cautivadoras, juegos interactivos, y múltiples secciones dedicadas a crear recuerdos inolvidables, esta aplicación es el regalo perfecto para expresar tu amor de una manera única y tecnológica.

### ¿Por qué Love Galaxy?

- 💝 **Totalmente Personalizable**: Cada elemento puede ser adaptado a tu historia de amor
- ✨ **Efectos Visuales Impresionantes**: Partículas animadas, corazones flotantes y efectos especiales
- 🎮 **Juegos Interactivos**: Diversión romántica para compartir en pareja
- 📱 **Diseño Responsivo**: Perfecto en cualquier dispositivo
- 💾 **Almacenamiento en la Nube**: Guarda tus recuerdos en Supabase de forma privada y segura (con respaldo local)
- 🎨 **Interfaz Moderna**: Gradientes, animaciones y experiencia de usuario excepcional

---

## 🎯 Características

### 📍 Secciones Principales

#### 🏠 **Página de Inicio**
- Hero section con nombre personalizado (Tamara)
- Contadores en tiempo real: días juntos, horas y latidos del corazón
- Animaciones de corazones flotantes
- Estadísticas de relación animadas

#### 📖 **Nuestra Historia (Timeline)**
- **Línea de tiempo interactiva** con eventos clave
- **✨ CREAR nuevos eventos** con modalformulario elegante
- **✏️ EDITAR eventos existentes** con todos sus detalles
- **🗑️ ELIMINAR eventos** con confirmación
- **Personalización completa**: título, fecha, descripción, icono emoji
- **Almacenamiento persistente** en localStorage
- **Diseño visual atractivo** con iconos animados
- **Animaciones smooth** al hacer scroll
- **Botón \"Agregar Evento\"** integrado en el timeline
- **100% editable** - crea tu propia historia de amor

#### 🖼️ **Galería de Fotos**
- **Sistema de categorías completo** (Juntos, Especiales, Viajes, Celebraciones)
- **Subir fotos con validación** (máximo 2MB)
- **Almacenamiento persistente** con localStorage
- **Vista fullscreen** con modal táctil
- **Gestión completa**: Ver, Cambiar, Eliminar fotos
- **Diseño tipo dome/cúpula** con efectos hover
- **Carga automática** al iniciar la app
- **Toast notifications** para feedback del usuario
- **100% funcional en móviles** con controles táctiles

#### 📝 **Libro de Recuerdos**
- Crear y guardar recuerdos con fecha
- Estados de ánimo con emojis
- Organización cronológica
- Sistema de almacenamiento persistente

#### 🎮 **Galaxia del Amor** (único juego, motor en C++ → WebAssembly)
Pilota una nave por la galaxia capturando corazones y mensajes de amor mientras
esquivas asteroides. El motor (física, colisiones, puntuación) está escrito en
**C++** y compilado a **WebAssembly** (`galaxy.wasm`); el renderizado va en
`<canvas>` con JavaScript.
- Captura corazones 💖 (+10), mensajes 💌 (+30, con frase) y estrellas ⭐ (+50)
- **Power-ups**: ⚡ boost x2 · 🧲 imán (atrae objetos) · 🛡️ escudo · 💗 vida extra
- **Combos**: encadena recogidas sin chocar para sumar bonus 🔥
- **Skins** de nave seleccionables (🚀 💖 🦋 🌟 🛸 🐉), guardadas en `localStorage`
- **Música** procedural (WebAudio) con botón de silencio 🎵/🔇
- **Tabla de marcadores** (top 10 local + Supabase) y récord guardado
- Esquiva asteroides ☄️ (hasta 5 vidas); dificultad progresiva
- Control táctil (deslizar), ratón o flechas ↑↓; pausa con **P**
- Estrellas con parallax, nebulosas, viñeta, estela y frases flotantes por hitos

#### 💗 **Amor-ómetro**
- Medidor visual del nivel de amor (sempre al 100%)
- Calculadora de tiempo juntos
- Estadísticas detalladas (años, meses, semanas, días, horas, minutos, segundos)
- Interfaz circular animada

#### 💌 **Mensajes de Amor**
- Mensaje especial dedicado
- Generador de mensajes diarios
- Frases de amor aleatorias
- Editor de mensajes personalizados

#### 🎵 **Playlist del Amor**
- Reproductor de música visual
- **Optimización automática**: Reduce partículas en dispositivos móviles

#### 🌊 Animaciones Avanzadas
- **Parallax scrolling**: Efecto de profundidad al navegar (desactivado en móvil)
- **Scroll reveal**: Elementos que aparecen al hacer scroll
- **Typing effect**: Texto que se escribe automáticamente
- **3D text hover**: Efecto tridimensional en títulos
- **Wave animations**: Ondas animadas de fondo
- **Confetti effect**: Lluvia de confeti programable
- **Animaciones reducidas en móvil**: Mejor rendimiento

#### 💕 **Efectos Románticos Adicionales**
- **Burbujas de Amor Flotantes**: 15 burbujas con emojis románticos que suben constantemente
- **Lluvia de Estrellas**: Estrellas cayendo del cielo de forma continua
- **Corazones al Click**: Explosión de corazones al hacer clic en cualquier parte
- **Mensajes Flotantes**: Mensajes de amor que aparecen periódicamente
- **Cursor Romántico**: Cursor personalizado con trail de corazones
- **Panel de Control**: Control interactivo para activar/desactivar cada efecto
- **Efectos de Hover**: Brillo y animaciones especiales en elementos
- **Texto Brillante**: Efecto de degradado animado en textos especiales
- **Optimizado para móviles**: Panel adaptado a pantallas pequeñas

### 📱 **RESPONSIVE Y MÓVIL** ¡NUEVO!

#### 🎯 Optimización Completa para Móviles
- **✅ 100% Funcional en iOS, Android y tablets**
- **Meta tags optimizados** para viewport móvil
- **Viewport height fix** para iOS y Android (--vh variable)
- **Detección automática de dispositivos** móviles
- **Touch-friendly**: Áreas de toque mínimas 44x44px
- **Feedback visual en touch**: Animaciones de scale al tocar
- **Navegación móvil mejorada**: Menú hamburguesa con animaciones
- **Soporte orientación**: Portrait y landscape
- **Grids adaptativos**: 
  - Desktop: 3-4 columnas
  - Tablet (1024px): 2-3 columnas
  - Móvil (768px): 1-2 columnas
  - Móvil pequeño (480px): 1 columna

#### 🎨 Estilos Móviles (mobile-styles.css - 700+ líneas)
- **Toast notifications responsive**: Adaptadas a ancho de pantalla
- **Modales fullscreen**: Optimizados para touch
- **Galería táctil**: Swipe y zoom en fotos
- **Timeline compacto**: Diseño vertical optimizado
- **Juegos adaptados**: Controles táctiles mejorados
- **Panel de efectos móvil**: Posición y tamaño optimizado
- **Formularios touch-friendly**: Inputs grandes y accesibles
- **Botones grandes**: Fáciles de tocar
- **Reducción de animaciones**: Mejor performance
- **Landscape mode**: Ajustes para orientación horizontal

#### ♿ Accesibilidad
- **Focus visible**: Navegación con teclado
- **Prefers-reduced-motion**: Respeta preferencias de usuario
- **Alto contraste**: Soporte para modos de contraste alto
- **Tap highlights**: Feedback visual al tocar
- **Áreas de toque expandidas**: Elementos pequeños con área touch mayor
- **Confetti effect**: Lluvia de confeti programable

#### 💕 **Efectos Románticos Adicionales ¡NUEVO!**
- **Burbujas de Amor Flotantes**: 15 burbujas con emojis románticos que suben constantemente
- **Lluvia de Estrellas**: Estrellas cayendo del cielo de forma continua
- **Corazones al Click**: Explosión de corazones al hacer clic en cualquier parte
- **Mensajes Flotantes**: Mensajes de amor que aparecen periódicamente
- **Cursor Romántico**: Cursor personalizado con trail de corazones
- **Panel de Control**: Control interactivo para activar/desactivar cada efecto
- **Efectos de Hover**: Brillo y animaciones especiales en elementos
- **Texto Brillante**: Efecto de degradado animado en textos especiales
- **Cursor personalizado**: Cursor con efecto de seguimiento
- **Ripple effect**: Ondas al hacer clic

#### 🎭 Interacciones
- Navegación suave entre secciones
- Transiciones fluidas en todos los elementos
- Hover effects en botones y tarjetas
- Modales animados
- Formularios con validación visual

---

## 🚀 Instalación y Uso

> ⚠️ **Importante:** la app usa módulos ES (`<script type="module">`), que **no
> cargan desde `file://`**. Debes abrirla a través de un **servidor HTTP** (local o
> Render). Abrir `index.html` con doble clic ya **no** funciona.

### Opción 1: Servidor Local (Recomendado)

1. **Clona el repositorio**:
```bash
git clone https://github.com/Lockowom/Love_Galaxy.git
cd Love_Galaxy
```

2. **Arranca un servidor estático**:
```bash
# Con Python 3
python -m http.server 8000      # o:  npm run dev

# Con Node.js y http-server
npx http-server

# Luego abre: http://localhost:8000
```

### Scripts de npm

```bash
npm test          # Tests (Jest + jsdom): db, juego y motor WASM
npm run build     # Sella ?v=<buildId> en index.html (cache-busting; lo usa Render)
npm run build:wasm # Recompila wasm/galaxy.cpp → galaxy.wasm (requiere clang+wasm32)
npm run dev       # Servidor local de desarrollo (python http.server)
```

### Opción 3: GitHub Pages

1. Sube los archivos a tu repositorio de GitHub
2. Ve a Settings → Pages
3. Selecciona la rama `main` y la carpeta `root`
4. Tu sitio estará disponible en: `https://tuusuario.github.io/Love_Galaxy`

---

## ⚙️ Personalización

### 🎨 Cambiar Colores

Edita las variables en `styles.css` (líneas 5-30):

```css
:root {
    --primary-color: #ff1493;      /* Color principal */
    --secondary-color: #ff69b4;    /* Color secundario */
    --accent-color: #ff6b9d;       /* Color de acento */
    /* ... más colores */
}
```

### 🎵 Cambiar Música

En la sección Playlist del `index.html`, edita las canciones:

```html
<h4>Nombre de tu Canción</h4>
<p>Descripción o recuerdo especial</p>
```

### 📝 Agregar Frases Personalizadas

En `main.js`, agrega tus frases al array `loveQuotes`:

```javascript
const loveQuotes = [
    "Tu frase personalizada aquí",
    "Otra frase romántica",
    // ... más frases
];
```

---

## 📁 Estructura del Proyecto

```
Love_Galaxy/
│
├── index.html              # Página principal (todas las secciones)
├── styles.css              # Estilos globales y componentes
├── mobile-styles.css       # Estilos específicos para móviles y touch
├── theme-minimal.css       # Tema pastel minimalista
│
├── supabase-client.js      # Inicialización de Supabase, auth y banner offline
├── db.js                   # Capa de datos (Supabase + respaldo localStorage)
├── main.js                 # Orquestador: init, navegación, contadores, mensajes,
│                           #   recuerdos, modales y carga de los módulos
│
│   # Módulos ES (type="module") extraídos de main.js:
├── auth-ui.js              # Gate de autenticación (login/registro)
├── gallery-manager.js      # Galería de fotos
├── playlist-manager.js     # Música y playlist (HTML5 + YouTube)
├── timeline-manager.js     # Historia / línea de tiempo editable
│
├── galaxy-game.js          # Galaxia del Amor: carga el WASM y dibuja en canvas
├── wasm/galaxy.cpp         # Motor del juego en C++ (fuente)
├── galaxy.wasm             # Motor compilado a WebAssembly (se versiona en git)
├── achievements.js         # Sistema de logros
├── animations.js           # Animaciones (cursor, partículas, scroll-reveal)
├── extras.js               # Poemas, estadísticas, exportar datos
├── dome-gallery.js         # Galería tipo cúpula 3D
│
├── scripts/stamp-version.js  # Cache-busting: sella ?v=<buildId> en el build
├── scripts/build-wasm.sh     # Compila wasm/galaxy.cpp → galaxy.wasm (clang)
├── love-galaxy.test.js     # Tests (Jest + jsdom + motor WASM)
├── render.yaml             # Config de despliegue (cache headers + build)
└── README.md               # Documentación (este archivo)
```

### 📄 Descripción de Archivos

- **index.html**: Estructura completa con todas las secciones + modales. Carga los
  scripts clásicos y los 4 módulos ES.
- **supabase-client.js**: Cliente de Supabase, autenticación, evento `cloud-status`
  y banner de "modo sin conexión".
- **db.js**: Capa de datos con persistencia en Supabase y respaldo en localStorage.
- **main.js** (~1.058 líneas): Orquestador. Inicializa los módulos
  (`AuthUI/GalleryManager/PlaylistManager/TimelineManager`), navegación, contadores,
  mensajes/chat, recuerdos, poemas, modales y helpers compartidos
  (`showToast`, `showNotification`, `escapeHtml`, ...).
- **auth-ui.js / gallery-manager.js / playlist-manager.js / timeline-manager.js**:
  Módulos ES que encapsulan cada dominio. Cada uno expone `window.XManager = { init }`
  y publica en `window` las funciones que usan los `onclick` inline.
- **galaxy-game.js**: "Galaxia del Amor". Carga `galaxy.wasm`, lee su estado cada
  frame y lo dibuja en `<canvas>`; gestiona entrada (táctil/ratón/teclado), HUD,
  sonidos y récord. Es el único juego.
- **wasm/galaxy.cpp → galaxy.wasm**: motor del juego en C++ (freestanding) compilado
  a WebAssembly con clang. Recompílalo con `npm run build:wasm` tras editar el `.cpp`
  y commitea el `.wasm` (Render no compila C++; solo sirve el binario).
- **achievements.js / animations.js / extras.js / dome-gallery.js**: Logros,
  animaciones, extras (poemas/estadísticas) y galería 3D.
- **scripts/stamp-version.js**: Reescribe `?v=<buildId>` en index.html durante el build.
- **scripts/build-wasm.sh**: Compila el motor C++ a `galaxy.wasm` (requiere clang con target wasm32).
- **love-galaxy.test.js**: Tests de humo con Jest + jsdom.

> Nota de arquitectura: `main.js` se dividió en módulos por dominio para reducir su
> tamaño y acoplamiento. Se eliminó código muerto (`particles.js`,
> `romantic-effects.js`, `audio-visualizer.js`) que no se cargaba.

---

## 💡 Funcionalidades Técnicas

### 🔧 Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: 
  - Variables CSS personalizadas
  - Grid y Flexbox
  - Animaciones y transiciones
  - Gradientes y efectos visuales
  - Media queries para responsive design
- **JavaScript Vanilla**:
  - ES6+ (clases, arrow functions, destructuring)
  - Canvas API para animaciones
  - LocalStorage para persistencia
  - Intersection Observer API
  - RequestAnimationFrame para animaciones fluidas

### 📦 Almacenamiento y Cuentas

La aplicación guarda los datos en **Supabase** (base de datos + Storage en la nube),
protegidos por **cuentas de usuario (email + contraseña)** y seguridad por fila (RLS):
cada cuenta sólo accede a sus propios recuerdos, fotos, mensajes, playlist, etc.

`localStorage` se usa como **respaldo/caché** local cuando no hay conexión con la nube.

Configuración paso a paso (crear las tablas, activar el login y los buckets privados):
ver **[GUIA_SUPABASE.md](GUIA_SUPABASE.md)**.

### 🎯 Características de Rendimiento

- **Sin dependencias externas**: Todo vanilla JavaScript
- **Optimizado para performance**: RequestAnimationFrame para animaciones
- **Lazy loading**: Animaciones solo cuando son visibles
- **Responsive**: Mobile-first approach
- **Cross-browser**: Compatible con navegadores modernos

---

## 🎮 Guía del juego: Galaxia del Amor

**Objetivo**: sumar la mayor puntuación pilotando la nave por la galaxia.

- **Mueve la nave**: en móvil desliza el dedo arriba/abajo; en PC mueve el ratón
  o usa las flechas **↑ ↓**. Pulsa **P** para pausar.
- **Elige tu skin** en la pantalla de inicio (🚀 💖 🦋 🌟 🛸 🐉) y activa/silencia la **música** 🎵.
- **Captura** corazones 💖 (+10), mensajes 💌 (+30, con frase) y estrellas ⭐ (+50).
- **Power-ups**: ⚡ boost x2 · 🧲 imán · 🛡️ escudo · 💗 vida extra. Encadena **combos** 🔥 para más puntos.
- **Esquiva** los asteroides ☄️: empiezas con **3 vidas** (hasta 5 con 💗).
- **Tabla de marcadores** (top 10) y récord guardados; la dificultad sube con el tiempo.

### 🛠️ ¿Cómo está hecho? (C++ → WebAssembly)

- El motor del juego (movimiento, aparición de objetos, colisiones, puntuación) está
  en **`wasm/galaxy.cpp`**, escrito en C++ *freestanding* (sin librerías).
- Se compila a **`galaxy.wasm`** con **clang** (`npm run build:wasm`). El `.wasm` se
  versiona en git ya compilado: Render no necesita compilador de C++.
- **`galaxy-game.js`** carga el `.wasm`, lee su estado cada frame y lo **dibuja en
  `<canvas>`** (estrellas con parallax, nave con estela, HUD, sonidos).

> ⚠️ Si editas `wasm/galaxy.cpp`, ejecuta `npm run build:wasm` y commitea el
> `galaxy.wasm` resultante. Requiere `clang`/`clang++` con target `wasm32`.

---

## 📱 Responsive Design

La aplicación está optimizada para todos los tamaños de pantalla:

- **Desktop** (>1024px): Experiencia completa con todas las animaciones
- **Tablet** (768px - 1024px): Diseño adaptado con navegación optimizada
- **Mobile** (<768px): Interfaz simplificada con menú hamburguesa

### Breakpoints:

```css
/* Tablet */
@media (max-width: 1024px) { ... }

/* Mobile */
@media (max-width: 768px) { ... }
```

---

## 🎨 Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| Rosa Primario | `#ff1493` | Acentos principales, botones |
| Rosa Claro | `#ff69b4` | Secundario, gradientes |
| Rosa Medio | `#ff6b9d` | Acentos, hover effects |
| Rosa Oscuro | `#c71585` | Bordes, sombras |
| Fondo Oscuro | `#0a0a0f` | Fondo principal |
| Texto Primario | `#ffffff` | Texto principal |
| Texto Secundario | `#e0e0e0` | Texto descriptivo |

---

## 🔐 Privacidad y Datos

- **Datos privados por cuenta**: Cada usuario sólo puede ver y modificar sus propios datos, gracias a la autenticación (email + contraseña) y a la seguridad por fila (RLS) de Supabase
- **Storage privado**: Las fotos y canciones se sirven mediante URLs firmadas temporales, no son públicas
- **Sin analytics**: Sin Google Analytics ni tracking
- **Respaldo local**: Si no hay conexión con la nube, se usa `localStorage` como caché temporal
- **Tú controlas tus credenciales**: La URL y la clave pública (`anon`) de Supabase van en `supabase-client.js`; la `anon key` es pública por diseño y es segura porque la RLS restringe el acceso

---

## 🐛 Solución de Problemas

### Las animaciones no se ven fluidas
- Cierra otras pestañas del navegador
- Desactiva extensiones que puedan interferir
- Verifica la aceleración de hardware en tu navegador
- Usa el panel de control de efectos (botón ✨ abajo a la izquierda) para desactivar algunos efectos

### Los efectos románticos afectan el rendimiento
- Haz clic en el botón ✨ en la esquina inferior izquierda
- Desactiva individualmente los efectos que no necesites:
  - 💕 Burbujas de Amor
  - ⭐ Lluvia de Estrellas
  - 💖 Corazones al Click
  - 💌 Mensajes Flotantes
  - 🖱️ Cursor Romántico

### Las fotos no se guardan
- Verifica que tienes espacio en localStorage (límite ~5MB)
- Comprime las imágenes antes de subirlas
- Limpia el localStorage si es necesario

### El audio no funciona
- Nota: Esta versión no incluye archivos de audio reales
- Puedes integrar Spotify, YouTube o archivos MP3 locales

### Problemas en móvil
- Asegúrate de usar un navegador moderno
- Safari puede tener limitaciones con algunos efectos
- Chrome Mobile es la opción recomendada

---

## 🚀 Mejoras Futuras

Ideas para expandir la aplicación:

- [x] Juego espacial interactivo (Galaxia del Amor)
- [x] Sistema de efectos románticos personalizables
- [x] Panel de control de efectos visuales
- [x] Sistema de logros y insignias
- [ ] Integración con Spotify API
- [ ] Sistema de notificaciones de aniversarios
- [ ] Exportar recuerdos como PDF
- [ ] Modo oscuro/claro
- [ ] Más juegos interactivos
- [ ] Integración con redes sociales
- [ ] PWA (Progressive Web App)
- [ ] Backend para sincronizar entre dispositivos
- [ ] Video player integrado
- [ ] Calendario de eventos especiales
- [ ] Chat privado en tiempo real

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si quieres mejorar Love Galaxy:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

Eres libre de:
- ✅ Usar comercialmente
- ✅ Modificar
- ✅ Distribuir
- ✅ Uso privado

---

## 💖 Créditos

**Desarrollado con amor para Tamara** 💕

- **Concepto y Diseño**: Original
- **Desarrollo**: Love Galaxy Team
- **Inspiración**: El amor verdadero
- **Fuentes**: Google Fonts (Dancing Script, Playfair Display, Poppins)
- **Iconos**: Emojis Unicode

---

## 📞 Soporte

¿Necesitas ayuda o tienes preguntas?

- 📧 Email: [tu-email@ejemplo.com]
- 💬 Issues: [GitHub Issues](https://github.com/Lockowom/Love_Galaxy/issues)
- 🌟 Star el proyecto si te gusta!

---

## 🎉 Agradecimientos

Gracias por usar Love Galaxy. Que esta aplicación te ayude a expresar y celebrar tu amor de una manera única y especial.

**Recuerda**: El mejor regalo es el tiempo y el amor que compartes con quien amas. Esta aplicación es solo una herramienta para hacer esos momentos aún más especiales. 💝

---

<div align="center">

**Hecho con 💖 para celebrar el amor**

[![Star on GitHub](https://img.shields.io/github/stars/Lockowom/Love_Galaxy?style=social)](https://github.com/Lockowom/Love_Galaxy)

</div>