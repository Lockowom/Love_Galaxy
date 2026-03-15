-- ==============================================================================
-- SCRIPT DE CONFIGURACIÓN MAESTRA - LOVE GALAXY
-- Ejecuta este script COMPLETO en el "SQL Editor" de Supabase para arreglar todo.
-- ==============================================================================

-- 1. Habilitar extensiones necesarias (opcional pero recomendado)
create extension if not exists "uuid-ossp";

-- ==============================================================================
-- SECCIÓN A: STORAGE (ARCHIVOS)
-- ==============================================================================

-- A.1 Crear Bucket para Canciones ('love_songs')
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('love_songs', 'love_songs', true, 10485760, ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav']) -- 10MB
on conflict (id) do update set public = true;

-- A.2 Crear Bucket para Galería ('love_gallery')
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('love_gallery', 'love_gallery', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']) -- 5MB
on conflict (id) do update set public = true;

-- A.3 ELIMINAR POLÍTICAS ANTIGUAS (Limpieza para evitar conflictos)
drop policy if exists "Public Uploads Songs" on storage.objects;
drop policy if exists "Public Select Songs" on storage.objects;
drop policy if exists "Public Update Songs" on storage.objects;
drop policy if exists "Public Delete Songs" on storage.objects;
drop policy if exists "Public Access Gallery" on storage.objects;
drop policy if exists "Public Insert Gallery" on storage.objects;

-- A.4 CREAR POLÍTICAS PERMISIVAS MAESTRAS PARA STORAGE
-- Permitir acceso público TOTAL a los buckets del proyecto.
-- NOTA: Esto permite a cualquiera con la clave anon subir/borrar. Ideal para proyectos personales.

-- Política de LECTURA (Ver archivos)
create policy "Public Access Read"
on storage.objects for select
to public
using ( bucket_id in ('love_songs', 'love_gallery') );

-- Política de INSERTAR (Subir archivos)
create policy "Public Access Upload"
on storage.objects for insert
to public
with check ( bucket_id in ('love_songs', 'love_gallery') );

-- Política de ACTUALIZAR (Cambiar archivos)
create policy "Public Access Update"
on storage.objects for update
to public
using ( bucket_id in ('love_songs', 'love_gallery') );

-- Política de ELIMINAR (Borrar archivos)
create policy "Public Access Delete"
on storage.objects for delete
to public
using ( bucket_id in ('love_songs', 'love_gallery') );


-- ==============================================================================
-- SECCIÓN B: BASE DE DATOS (TABLAS)
-- ==============================================================================

-- B.1 Tabla: playlist_songs
create table if not exists public.playlist_songs (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    artist text,
    url text not null,
    storage_path text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.playlist_songs enable row level security;

-- B.2 Tabla: gallery_photos
create table if not exists public.gallery_photos (
    id uuid default uuid_generate_v4() primary key,
    url text not null,
    storage_path text,
    category text,
    caption text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.gallery_photos enable row level security;

-- B.3 Tabla: memories
create table if not exists public.memories (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    memory_date date,
    description text,
    mood text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.memories enable row level security;

-- B.4 Tabla: custom_messages
create table if not exists public.custom_messages (
    id uuid default uuid_generate_v4() primary key,
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.custom_messages enable row level security;

-- B.5 Tabla: timeline_events
create table if not exists public.timeline_events (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    date_str text,
    description text,
    icon text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.timeline_events enable row level security;

-- B.6 Tabla: app_config
create table if not exists public.app_config (
    key text primary key,
    value text,
    updated_at timestamp with time zone default timezone('utc'::text, now())
);
alter table public.app_config enable row level security;

-- B.7 Tabla: game_scores
create table if not exists public.game_scores (
    id uuid default uuid_generate_v4() primary key,
    game_name text not null,
    score integer not null,
    details jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.game_scores enable row level security;

-- B.8 Tabla: question_answers
create table if not exists public.question_answers (
    id uuid default uuid_generate_v4() primary key,
    question text not null,
    answer text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.question_answers enable row level security;


-- ==============================================================================
-- SECCIÓN C: POLÍTICAS DE BASE DE DATOS (RLS)
-- ==============================================================================

-- Eliminar políticas existentes para evitar errores de "policy already exists"
drop policy if exists "Enable all access for all users" on public.playlist_songs;
drop policy if exists "Enable all access for all users" on public.gallery_photos;
drop policy if exists "Enable all access for all users" on public.memories;
drop policy if exists "Enable all access for all users" on public.custom_messages;
drop policy if exists "Enable all access for all users" on public.timeline_events;
drop policy if exists "Enable all access for all users" on public.app_config;
drop policy if exists "Enable all access for all users" on public.game_scores;
drop policy if exists "Enable all access for all users" on public.question_answers;

-- Crear políticas universales (Permitir TODO a CUALQUIERA - Anon Key)
create policy "Enable all access for all users" on public.playlist_songs for all using (true) with check (true);
create policy "Enable all access for all users" on public.gallery_photos for all using (true) with check (true);
create policy "Enable all access for all users" on public.memories for all using (true) with check (true);
create policy "Enable all access for all users" on public.custom_messages for all using (true) with check (true);
create policy "Enable all access for all users" on public.timeline_events for all using (true) with check (true);
create policy "Enable all access for all users" on public.app_config for all using (true) with check (true);
create policy "Enable all access for all users" on public.game_scores for all using (true) with check (true);
create policy "Enable all access for all users" on public.question_answers for all using (true) with check (true);

-- Fin del script
