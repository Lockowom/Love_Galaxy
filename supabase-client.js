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

if (typeof supabase !== 'undefined' && SUPABASE_URL !== 'TU_SUPABASE_URL_AQUI') {
    try {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase conectado correctamente');
    } catch (error) {
        console.error('❌ Error al inicializar Supabase:', error);
    }
} else {
    console.warn('⚠️ Supabase no está configurado. La aplicación usará localStorage temporalmente.');
    console.warn('   Por favor, configura SUPABASE_URL y SUPABASE_ANON_KEY en js/supabase-client.js');
}

// Hacer disponible globalmente
window.supabaseClient = supabaseClient;
