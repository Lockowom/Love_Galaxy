-- ==============================================================================
-- LOVE GALAXY — CONFIGURACIÓN SEGURA (Autenticación + RLS por usuario)
-- Ejecuta este script COMPLETO en el "SQL Editor" de tu proyecto Supabase.
--
-- Cada fila pertenece al usuario que la creó (columna user_id = auth.uid()).
-- Sólo el dueño puede leer/escribir sus propios datos. Para una "app de pareja"
-- lo más sencillo es que ambos usen UNA cuenta compartida (mismo email/clave),
-- así comparten los mismos recuerdos. Si usan cuentas distintas, cada cuenta
-- verá únicamente sus propios datos.
--
-- Requisito: activa el proveedor "Email" en Authentication > Providers.
-- ==============================================================================

create extension if not exists "uuid-ossp";

-- ==============================================================================
-- TABLAS
-- ==============================================================================

-- 1. Configuración (clave/valor por usuario, p.ej. fecha de inicio)
create table if not exists public.app_config (
    user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
    key text not null,
    value text,
    updated_at timestamptz default now(),
    primary key (user_id, key)
);

-- 2. Eventos del Timeline
create table if not exists public.timeline_events (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
    title text not null,
    date_str text,
    description text,
    icon text default '💕',
    created_at timestamptz default now()
);

-- 3. Recuerdos
create table if not exists public.memories (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
    title text not null,
    memory_date date,
    description text,
    mood text,
    created_at timestamptz default now()
);

-- 4. Fotos de la galería
create table if not exists public.gallery_photos (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
    url text not null,
    storage_path text,
    category text,
    caption text,
    created_at timestamptz default now()
);

-- 5. Respuestas a preguntas
create table if not exists public.question_answers (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
    question text not null,
    answer text not null,
    created_at timestamptz default now()
);

-- 6. Puntuaciones de juegos
create table if not exists public.game_scores (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
    game_name text not null,
    score integer not null,
    details jsonb,
    created_at timestamptz default now()
);

-- 7. Mensajes personalizados (chat)
create table if not exists public.custom_messages (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
    content text not null,
    created_at timestamptz default now()
);

-- 8. Playlist de canciones
create table if not exists public.playlist_songs (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
    title text not null,
    artist text,
    url text not null,
    storage_path text,
    created_at timestamptz default now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (cada usuario sólo accede a sus filas)
-- ==============================================================================

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
        -- Limpiar políticas previas (incluida la versión pública insegura antigua)
        execute format('drop policy if exists "Public Access %s" on public.%I;', initcap(t), t);
        execute format('drop policy if exists "Enable all access for all users" on public.%I;', t);
        execute format('drop policy if exists "Owner can select %s" on public.%I;', t, t);
        execute format('drop policy if exists "Owner can insert %s" on public.%I;', t, t);
        execute format('drop policy if exists "Owner can update %s" on public.%I;', t, t);
        execute format('drop policy if exists "Owner can delete %s" on public.%I;', t, t);
        -- Políticas por operación basadas en el dueño
        execute format('create policy "Owner can select %s" on public.%I for select using (auth.uid() = user_id);', t, t);
        execute format('create policy "Owner can insert %s" on public.%I for insert with check (auth.uid() = user_id);', t, t);
        execute format('create policy "Owner can update %s" on public.%I for update using (auth.uid() = user_id) with check (auth.uid() = user_id);', t, t);
        execute format('create policy "Owner can delete %s" on public.%I for delete using (auth.uid() = user_id);', t, t);
    end loop;
end $$;

-- ==============================================================================
-- STORAGE (buckets PRIVADOS; sólo el dueño accede a sus archivos)
-- ==============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('love_songs', 'love_songs', false, 10485760, array['audio/mpeg','audio/mp3','audio/wav'])
on conflict (id) do update set public = false;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('love_gallery', 'love_gallery', false, 5242880, array['image/jpeg','image/png','image/gif','image/webp'])
on conflict (id) do update set public = false;

-- Limpiar políticas de storage previas (incluidas las públicas antiguas)
drop policy if exists "Public Access Read" on storage.objects;
drop policy if exists "Public Access Upload" on storage.objects;
drop policy if exists "Public Access Update" on storage.objects;
drop policy if exists "Public Access Delete" on storage.objects;
drop policy if exists "Public Access Bucket" on storage.objects;
drop policy if exists "Public Access Songs Bucket" on storage.objects;
drop policy if exists "Auth read love buckets" on storage.objects;
drop policy if exists "Auth upload love buckets" on storage.objects;
drop policy if exists "Owner update love buckets" on storage.objects;
drop policy if exists "Owner delete love buckets" on storage.objects;

-- Lectura: sólo el dueño del objeto (necesario para generar URLs firmadas)
create policy "Auth read love buckets"
on storage.objects for select to authenticated
using ( bucket_id in ('love_songs','love_gallery') and owner = auth.uid() );

-- Subida: cualquier usuario autenticado (queda como dueño automáticamente)
create policy "Auth upload love buckets"
on storage.objects for insert to authenticated
with check ( bucket_id in ('love_songs','love_gallery') );

-- Actualizar / borrar: sólo el dueño del objeto
create policy "Owner update love buckets"
on storage.objects for update to authenticated
using ( bucket_id in ('love_songs','love_gallery') and owner = auth.uid() );

create policy "Owner delete love buckets"
on storage.objects for delete to authenticated
using ( bucket_id in ('love_songs','love_gallery') and owner = auth.uid() );
