/**
 * Cliente de Supabase para Love Galaxy
 * 
 * Gestiona la conexión con la base de datos y el almacenamiento en la nube.
 */

// CONFIGURACIÓN DE SUPABASE
// ------------------------------------------------------------------
const SUPABASE_URL = 'https://rkvygvbsjtrzlnnesgak.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Vng7LX_wQJh1VJEc9PZCgg_GbsM8sce';
// ------------------------------------------------------------------

// Variable global para el cliente
let supabaseClient = null;
let isSupabaseReady = false;

/**
 * Inicializa el cliente de Supabase.
 * Reintenta si la librería aún no ha cargado.
 */
function initSupabase() {
    // Verificar si ya se inicializó
    if (window.supabaseClient) {
        isSupabaseReady = true;
        return window.supabaseClient;
    }

    // Verificar si la librería global 'supabase' está cargada
    if (typeof window.supabase === 'undefined') {
        console.warn('⏳ Librería Supabase no cargada aún. Reintentando en 500ms...');
        setTimeout(initSupabase, 500);
        return null;
    }

    console.log('🔄 Inicializando Supabase...');

    // Validaciones básicas de configuración
    if (!SUPABASE_URL || SUPABASE_URL.includes('TU_SUPABASE_URL')) {
        console.error('❌ Error: URL de Supabase no configurada.');
        showConnectionError('URL no configurada');
        return null;
    }

    if (!SUPABASE_ANON_KEY) {
        console.error('❌ Error: API Key de Supabase no configurada.');
        showConnectionError('API Key faltante');
        return null;
    }

    try {
        // Crear cliente
        const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
            }
        });

        // Asignar a variables globales
        supabaseClient = client;
        window.supabaseClient = client;
        isSupabaseReady = true;

        console.log('✅ Cliente Supabase creado exitosamente.');

        // Escuchar cambios de sesión (login / logout / refresh) y avisar a la app
        client.auth.onAuthStateChange((event, session) => {
            window.dispatchEvent(new CustomEvent('auth-change', { detail: { event, session } }));
        });

        // Emitir el estado inicial de sesión una vez resuelto
        client.auth.getSession().then(({ data }) => {
            window.dispatchEvent(new CustomEvent('auth-change', {
                detail: { event: 'INITIAL_SESSION', session: data ? data.session : null }
            }));
        });

        // Verificar conexión real haciendo un ping simple
        checkConnection();

        return client;

    } catch (error) {
        console.error('❌ Excepción al crear cliente Supabase:', error);
        showConnectionError(error.message);
        return null;
    }
}

/**
 * Verifica si la conexión es válida haciendo una consulta simple.
 */
async function checkConnection() {
    if (!supabaseClient) return;

    try {
        // Intentar leer algo público o simplemente verificar auth
        const { data, error } = await supabaseClient.from('app_config').select('count').limit(1).maybeSingle();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 es "no rows returned" que es ok
            console.warn('⚠️ Supabase conectado pero con posible error de acceso:', error.message);
        } else {
            console.log('🟢 Conexión a Supabase verificada y activa.');
            updateConnectionStatusUI(true);
        }
    } catch (err) {
        console.warn('⚠️ Error de red al verificar Supabase:', err);
        updateConnectionStatusUI(false);
    }
}

function showConnectionError(msg) {
    console.error('Error de conexión Supabase:', msg);
    // Podríamos mostrar un toast aquí si fuera necesario
}

function updateConnectionStatusUI(isConnected) {
    // Buscar o crear indicador en el footer
    let indicator = document.getElementById('supabase-status');
    if (!indicator) {
        const footer = document.querySelector('.main-footer .footer-content');
        if (footer) {
            indicator = document.createElement('div');
            indicator.id = 'supabase-status';
            indicator.style.marginTop = '10px';
            indicator.style.fontSize = '0.8rem';
            footer.appendChild(indicator);
        }
    }

    if (indicator) {
        if (isConnected) {
            indicator.innerHTML = '<span style="color: #4caf50;">●</span> Conectado a la Nube';
            indicator.title = "Base de datos activa";
        } else {
            indicator.innerHTML = '<span style="color: #f44336;">●</span> Sin Conexión';
            indicator.title = "No se pudo conectar a la base de datos";
        }
    }

    // Notificar el estado de conexión al resto de la app (banner offline, etc.)
    window.__cloudOnline = isConnected;
    window.dispatchEvent(new CustomEvent('cloud-status', { detail: { online: isConnected } }));
}

/**
 * Muestra u oculta un banner fijo de "modo sin conexión".
 * Se activa con el evento global 'cloud-status' (emitido aquí y desde db.js
 * cuando una operación cae a localStorage).
 */
function toggleOfflineBanner(show) {
    let banner = document.getElementById('offline-banner');
    if (show) {
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'offline-banner';
            banner.setAttribute('role', 'status');
            banner.setAttribute('aria-live', 'polite');
            banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:30000;background:#b3261e;color:#fff;font-size:.9rem;line-height:1.3;text-align:center;padding:.55rem 2.4rem;box-shadow:0 2px 8px rgba(0,0,0,.25);font-family:inherit;';
            banner.innerHTML = '⚠️ Sin conexión con la nube — los cambios se guardan solo en este dispositivo.' +
                '<button id="offline-banner-close" aria-label="Cerrar" style="position:absolute;right:.6rem;top:50%;transform:translateY(-50%);background:transparent;border:none;color:#fff;font-size:1.2rem;line-height:1;cursor:pointer;">&times;</button>';
            (document.body || document.documentElement).appendChild(banner);
            const closeBtn = banner.querySelector('#offline-banner-close');
            if (closeBtn) closeBtn.addEventListener('click', () => banner.remove());
        } else {
            banner.style.display = '';
        }
    } else if (banner) {
        banner.remove();
    }
}

// Un único listener gestiona el banner según el estado de la nube.
window.addEventListener('cloud-status', (e) => {
    toggleOfflineBanner(!(e.detail && e.detail.online));
});

// Iniciar cuando el DOM esté listo o inmediatamente si ya lo está
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupabase);
} else {
    initSupabase();
}

// Exportar función de reintento manual
window.retrySupabaseConnection = initSupabase;

// ==================================================================
// AUTENTICACIÓN (email + contraseña)
// ==================================================================

/** Registra una cuenta nueva con email y contraseña. */
window.authSignUp = async function(email, password) {
    if (!supabaseClient) return { error: { message: 'Sin conexión con la base de datos. Recarga la página.' } };
    return await supabaseClient.auth.signUp({ email, password });
};

/** Inicia sesión con email y contraseña. */
window.authSignIn = async function(email, password) {
    if (!supabaseClient) return { error: { message: 'Sin conexión con la base de datos. Recarga la página.' } };
    return await supabaseClient.auth.signInWithPassword({ email, password });
};

/** Cierra la sesión actual. */
window.authSignOut = async function() {
    if (!supabaseClient) return;
    return await supabaseClient.auth.signOut();
};

/** Devuelve el usuario autenticado actual (o null). */
window.getCurrentUser = async function() {
    if (!supabaseClient) return null;
    const { data } = await supabaseClient.auth.getUser();
    return data ? data.user : null;
};
