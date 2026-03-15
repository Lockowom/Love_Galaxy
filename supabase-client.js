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

/**
 * Inicializa el cliente de Supabase.
 * Reintenta si la librería aún no ha cargado.
 */
function initSupabase() {
    // Verificar si ya se inicializó
    if (window.supabaseClient) return;

    // Verificar si la librería global 'supabase' está cargada
    if (typeof window.supabase === 'undefined') {
        console.warn('⏳ Librería Supabase no cargada aún. Reintentando en 500ms...');
        setTimeout(initSupabase, 500);
        return;
    }

    console.log('🔄 Inicializando Supabase...');

    // Validaciones básicas de configuración
    if (!SUPABASE_URL || SUPABASE_URL.includes('TU_SUPABASE_URL')) {
        console.error('❌ Error: URL de Supabase no configurada.');
        return;
    }

    if (!SUPABASE_ANON_KEY) {
        console.error('❌ Error: API Key de Supabase no configurada.');
        return;
    }

    try {
        // Crear cliente
        // Nota: createClient no verifica conexión inmediatamente, solo crea la instancia.
        const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
            }
        });

        // Asignar a variables globales
        supabaseClient = client;
        window.supabaseClient = client;

        console.log('✅ Cliente Supabase creado exitosamente.');
        
        // Verificar conexión real haciendo un ping simple
        checkConnection();

    } catch (error) {
        console.error('❌ Excepción al crear cliente Supabase:', error);
        alert('Error crítico: No se pudo iniciar el servicio de base de datos. ' + error.message);
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
        }
    } catch (err) {
        console.warn('⚠️ Error de red al verificar Supabase:', err);
    }
}

// Iniciar cuando el DOM esté listo o inmediatamente si ya lo está
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupabase);
} else {
    initSupabase();
}
