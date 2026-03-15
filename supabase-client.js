/**
 * Cliente de Supabase para Love Galaxy
 * 
 * INSTRUCCIONES PARA EL USUARIO:
 * 1. Crea una cuenta en https://supabase.com
 * 2. Crea un nuevo proyecto.
 * 3. Ve a Project Settings > API.
 * 4. Copia la "Project URL" y pégala abajo en SUPABASE_URL.
 * 5. Copia la "anon" / "public" key y pégala abajo en SUPABASE_ANON_KEY.
 */

// REEMPLAZA LA URL CON LA DE TU PROYECTO SUPABASE
// La key ya ha sido actualizada con la que proporcionaste.
const SUPABASE_URL = 'https://rkvygvbsjtrzlnnesgak.supabase.co'; // <-- ¡Pega tu URL aquí!
const SUPABASE_ANON_KEY = 'sb_publishable_Vng7LX_wQJh1VJEc9PZCgg_GbsM8sce';

// Inicialización del cliente
let supabaseClient = null;

// Función para inicializar
function initSupabase() {
    if (typeof supabase === 'undefined') {
        console.error('❌ La librería de Supabase no se cargó.');
        return;
    }

    if (SUPABASE_URL === 'TU_SUPABASE_URL_AQUI' || !SUPABASE_URL) {
        console.warn('⚠️ Falta configurar la URL de Supabase.');
        return;
    }

    // Validación básica de la key
    if (!SUPABASE_ANON_KEY) {
        console.error('❌ Falta la clave de Supabase.');
        return;
    }

    // Soporte para claves nuevas (sb_publishable_) y antiguas (eyJ...)
    if (!SUPABASE_ANON_KEY.startsWith('sb_publishable_') && !SUPABASE_ANON_KEY.startsWith('eyJ')) {
        console.warn('⚠️ La clave no tiene un formato conocido (debería empezar con sb_publishable_ o eyJ). Verifica si es correcta.');
    }

    try {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Cliente Supabase creado.');
        
        // Hacer disponible globalmente
        window.supabaseClient = supabaseClient;

    } catch (error) {
        console.error('❌ Error crítico al crear cliente Supabase:', error);
    }
}

// Ejecutar inicialización
initSupabase();

// Notificar estado en la UI cuando todo esté cargado
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (!window.supabaseClient) {
            if (typeof showNotification === 'function') {
                showNotification('⚠️ Supabase no conectado: Verifica la API Key', 'error');
            }
        } else {
            console.log('📡 Supabase listo para usar');
        }
    }, 2000);
});
