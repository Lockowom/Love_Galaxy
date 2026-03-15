-- ==============================================================================
-- SCRIPT DE CONFIGURACIÓN MAESTRA - LOVE GALAXY (CORREGIDO)
-- Ejecuta este script COMPLETO en el "SQL Editor" de Supabase.
-- ==============================================================================

-- 1. Habilitar extensiones necesarias
create extension if not exists "uuid-ossp";

-- ==============================================================================
-- SECCIÓN A: STORAGE (ARCHIVOS)
-- ==============================================================================

-- A.1 Crear Buckets (Si no existen)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('love_songs', 'love_songs', true, 10485760, ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav'])
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('love_gallery', 'love_gallery', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
on conflict (id) do update set public = true;

-- A.2 LIMPIEZA TOTAL DE POLÍTICAS DE STORAGE
-- Borramos cualquier política previa para evitar el error "policy already exists"
drop policy if exists "Public Access Read" on storage.objects;
drop policy if exists "Public Access Upload" on storage.objects;
drop policy if exists "Public Access Update" on storage.objects;
drop policy if exists "Public Access Delete" on storage.objects;
-- Borramos también nombres antiguos por si acaso
drop policy if exists "Public Uploads Songs" on storage.objects;
drop policy if exists "Public Select Songs" on storage.objects;
drop policy if exists "Public Access Gallery" on storage.objects;
drop policy if exists "Give me access to everything" on storage.objects;

-- A.3 CREAR POLÍTICAS PERMISIVAS MAESTRAS
-- Permitir acceso público TOTAL a los buckets del proyecto.

create policy "Public Access Read"
on storage.objects for select
to public
using ( bucket_id in ('love_songs', 'love_gallery') );

create policy "Public Access Upload"
on storage.objects for insert
to public
with check ( bucket_id in ('love_songs', 'love_gallery') );

create policy "Public Access Update"
on storage.objects for update
to public
using ( bucket_id in ('love_songs', 'love_gallery') );

create policy "Public Access Delete"
on storage.objects for delete
to public
using ( bucket_id in ('love_songs', 'love_gallery') );


-- ==============================================================================
-- SECCIÓN B: BASE DE DATOS (TABLAS)
-- ==============================================================================

-- Crear tablas si no existen
create table if not exists public.playlist_songs (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    artist text,
    url text not null,
    storage_path text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.playlist_songs enable row level security;

create table if not exists public.gallery_photos (
    id uuid default uuid_generate_v4() primary key,
    url text not null,
    storage_path text,
    category text,
    caption text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.gallery_photos enable row level security;

create table if not exists public.memories (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    memory_date date,
    description text,
    mood text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.memories enable row level security;

create table if not exists public.custom_messages (
    id uuid default uuid_generate_v4() primary key,
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.custom_messages enable row level security;

create table if not exists public.timeline_events (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    date_str text,
    description text,
    icon text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.timeline_events enable row level security;

create table if not exists public.app_config (
    key text primary key,
    value text,
    updated_at timestamp with time zone default timezone('utc'::text, now())
);
alter table public.app_config enable row level security;

create table if not exists public.game_scores (
    id uuid default uuid_generate_v4() primary key,
    game_name text not null,
    score integer not null,
    details jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.game_scores enable row level security;

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

-- 1. Limpieza de políticas de tablas
drop policy if exists "Enable all access for all users" on public.playlist_songs;
drop policy if exists "Enable all access for all users" on public.gallery_photos;
drop policy if exists "Enable all access for all users" on public.memories;
drop policy if exists "Enable all access for all users" on public.custom_messages;
drop policy if exists "Enable all access for all users" on public.timeline_events;
drop policy if exists "Enable all access for all users" on public.app_config;
drop policy if exists "Enable all access for all users" on public.game_scores;
drop policy if exists "Enable all access for all users" on public.question_answers;

-- 2. Crear políticas universales (Acceso total)
create policy "Enable all access for all users" on public.playlist_songs for all using (true) with check (true);
create policy "Enable all access for all users" on public.gallery_photos for all using (true) with check (true);
create policy "Enable all access for all users" on public.memories for all using (true) with check (true);
create policy "Enable all access for all users" on public.custom_messages for all using (true) with check (true);
create policy "Enable all access for all users" on public.timeline_events for all using (true) with check (true);
create policy "Enable all access for all users" on public.app_config for all using (true) with check (true);
create policy "Enable all access for all users" on public.game_scores for all using (true) with check (true);
create policy "Enable all access for all users" on public.question_answers for all using (true) with check (true);
