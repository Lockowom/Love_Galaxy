-- ==============================================================================
-- LOVE GALAXY — ESPACIO COMPARTIDO PARA 2 USUARIOS (PAREJA)
--
-- Convierte la instalación de "cada usuario ve solo lo suyo" (RLS por dueño) en
-- un ESPACIO COMPARTIDO entre 2 cuentas: ambos ven y editan las MISMAS fotos,
-- recuerdos, chat, marcadores, timeline y playlist. El acceso queda restringido
-- EXACTAMENTE a los 2 emails que indiques (cualquier otra cuenta no ve nada).
--
-- CÓMO USARLO:
--   1) Authentication > Providers: ten "Email" activado y crea las 2 cuentas
--      (una para cada uno). Apunta sus 2 emails.
--   2) (Recomendado) Authentication > Sign In / Providers > desactiva
--      "Allow new users to sign up" para que NADIE más pueda registrarse.
--   3) Edita abajo EMAIL_1 y EMAIL_2 con vuestros 2 correos.
--   4) Pega TODO este script en el "SQL Editor" de Supabase y ejecútalo.
--
-- Se conserva la columna user_id (autor de cada fila) para saber quién creó qué
-- (p.ej. quién envió cada mensaje del chat). Es idempotente: puedes re-ejecutarlo.
-- ==============================================================================

-- 1) ¿Quién pertenece a la pareja? (los 2 emails autorizados) --------------------
create or replace function public.is_couple()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select auth.uid() in (
    select id from auth.users
    where lower(email) in (
      lower('EMAIL_1@ejemplo.com'),   -- 👈 EDITA: email del usuario 1
      lower('EMAIL_2@ejemplo.com')    -- 👈 EDITA: email del usuario 2
    )
  );
$$;

-- 2) Políticas COMPARTIDAS en todas las tablas de datos -------------------------
do $$
declare
    t text;
    tables text[] := array[
        'app_config','timeline_events','memories','gallery_photos',
        'question_answers','game_scores','custom_messages','playlist_songs'
    ];
begin
    foreach t in array tables loop
        execute format('alter table public.%I enable row level security;', t);
        -- Asegurar columna user_id con autor automático
        execute format('alter table public.%I add column if not exists user_id uuid default auth.uid();', t);

        -- Quitar políticas anteriores (las de "solo dueño" y las de pareja previas)
        execute format('drop policy if exists "Owner can select %s" on public.%I;', t, t);
        execute format('drop policy if exists "Owner can insert %s" on public.%I;', t, t);
        execute format('drop policy if exists "Owner can update %s" on public.%I;', t, t);
        execute format('drop policy if exists "Owner can delete %s" on public.%I;', t, t);
        execute format('drop policy if exists "Couple select %s" on public.%I;', t, t);
        execute format('drop policy if exists "Couple insert %s" on public.%I;', t, t);
        execute format('drop policy if exists "Couple update %s" on public.%I;', t, t);
        execute format('drop policy if exists "Couple delete %s" on public.%I;', t, t);

        -- Nuevas: cualquiera de la pareja accede a TODAS las filas
        execute format('create policy "Couple select %s" on public.%I for select using (public.is_couple());', t, t);
        execute format('create policy "Couple insert %s" on public.%I for insert with check (public.is_couple());', t, t);
        execute format('create policy "Couple update %s" on public.%I for update using (public.is_couple()) with check (public.is_couple());', t, t);
        execute format('create policy "Couple delete %s" on public.%I for delete using (public.is_couple());', t, t);
    end loop;
end $$;

-- 3) Storage COMPARTIDO (fotos y canciones visibles para los dos) ---------------
-- Los buckets siguen privados; ambos miembros pueden leer/subir/borrar.
drop policy if exists "Auth read love buckets"   on storage.objects;
drop policy if exists "Auth upload love buckets" on storage.objects;
drop policy if exists "Owner update love buckets" on storage.objects;
drop policy if exists "Owner delete love buckets" on storage.objects;
drop policy if exists "Couple read love buckets"   on storage.objects;
drop policy if exists "Couple upload love buckets" on storage.objects;
drop policy if exists "Couple update love buckets" on storage.objects;
drop policy if exists "Couple delete love buckets" on storage.objects;

create policy "Couple read love buckets"
on storage.objects for select to authenticated
using ( bucket_id in ('love_songs','love_gallery') and public.is_couple() );

create policy "Couple upload love buckets"
on storage.objects for insert to authenticated
with check ( bucket_id in ('love_songs','love_gallery') and public.is_couple() );

create policy "Couple update love buckets"
on storage.objects for update to authenticated
using ( bucket_id in ('love_songs','love_gallery') and public.is_couple() );

create policy "Couple delete love buckets"
on storage.objects for delete to authenticated
using ( bucket_id in ('love_songs','love_gallery') and public.is_couple() );

-- ==============================================================================
-- LISTO. A partir de ahora, los 2 usuarios comparten TODO:
--   • Fotos de la galería        • Recuerdos          • Timeline
--   • Chat (mensajes de ambos)   • Marcadores juegos  • Playlist
-- Si necesitas saber los UUID de las cuentas:  select id, email from auth.users;
-- ==============================================================================
