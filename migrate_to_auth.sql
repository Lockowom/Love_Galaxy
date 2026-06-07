-- ==============================================================================
-- LOVE GALAXY — MIGRACIÓN de instalación PÚBLICA (insegura) a AUTH + RLS por usuario
--
-- Úsalo SÓLO si ya tenías la app funcionando con acceso público y datos creados.
-- Para instalaciones nuevas usa directamente supabase-setup.sql.
--
-- IMPORTANTE — antes de ejecutar:
--   1) Activa el proveedor "Email" en Authentication > Providers.
--   2) Crea (o ten a mano) la cuenta que será DUEÑA de los datos existentes:
--      regístrate en la app o créala en Authentication > Users.
--   3) Copia su UUID y pégalo abajo en  v_owner.
--
-- Este script: añade user_id a cada tabla, asigna las filas existentes al dueño
-- indicado, reemplaza las políticas públicas por políticas por usuario y deja
-- los buckets privados con acceso sólo para el dueño de cada archivo.
-- ==============================================================================

do $$
declare
    -- 👇 PEGA AQUÍ EL UUID DEL USUARIO DUEÑO DE LOS DATOS EXISTENTES
    v_owner uuid := '00000000-0000-0000-0000-000000000000';
    t text;
    tables text[] := array[
        'app_config','timeline_events','memories','gallery_photos',
        'question_answers','game_scores','custom_messages','playlist_songs'
    ];
begin
    if v_owner = '00000000-0000-0000-0000-000000000000' then
        raise exception 'Debes establecer v_owner con el UUID del usuario dueño antes de ejecutar.';
    end if;

    foreach t in array tables loop
        -- Añadir columna user_id si no existe
        execute format('alter table public.%I add column if not exists user_id uuid;', t);
        -- Asignar las filas existentes al dueño indicado
        execute format('update public.%I set user_id = %L where user_id is null;', t, v_owner);
        -- Forzar NOT NULL + default + FK
        execute format('alter table public.%I alter column user_id set not null;', t);
        execute format('alter table public.%I alter column user_id set default auth.uid();', t);
        begin
            execute format('alter table public.%I add constraint %I foreign key (user_id) references auth.users(id) on delete cascade;', t, t || '_user_id_fkey');
        exception when duplicate_object then null;
        end;

        -- Reemplazar políticas
        execute format('alter table public.%I enable row level security;', t);
        execute format('drop policy if exists "Public Access %s" on public.%I;', initcap(t), t);
        execute format('drop policy if exists "Enable all access for all users" on public.%I;', t);
        execute format('drop policy if exists "Owner can select %s" on public.%I;', t, t);
        execute format('drop policy if exists "Owner can insert %s" on public.%I;', t, t);
        execute format('drop policy if exists "Owner can update %s" on public.%I;', t, t);
        execute format('drop policy if exists "Owner can delete %s" on public.%I;', t, t);
        execute format('create policy "Owner can select %s" on public.%I for select using (auth.uid() = user_id);', t, t);
        execute format('create policy "Owner can insert %s" on public.%I for insert with check (auth.uid() = user_id);', t, t);
        execute format('create policy "Owner can update %s" on public.%I for update using (auth.uid() = user_id) with check (auth.uid() = user_id);', t, t);
        execute format('create policy "Owner can delete %s" on public.%I for delete using (auth.uid() = user_id);', t, t);
    end loop;

    -- Buckets a privados
    update storage.buckets set public = false where id in ('love_songs','love_gallery');
end $$;

-- Asignar los archivos de storage existentes al dueño (ejecútalo con el mismo UUID)
-- update storage.objects set owner = '<UUID_DUEÑO>'
--   where bucket_id in ('love_songs','love_gallery') and owner is null;

-- Políticas de storage por dueño
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

create policy "Auth read love buckets"
on storage.objects for select to authenticated
using ( bucket_id in ('love_songs','love_gallery') and owner = auth.uid() );

create policy "Auth upload love buckets"
on storage.objects for insert to authenticated
with check ( bucket_id in ('love_songs','love_gallery') );

create policy "Owner update love buckets"
on storage.objects for update to authenticated
using ( bucket_id in ('love_songs','love_gallery') and owner = auth.uid() );

create policy "Owner delete love buckets"
on storage.objects for delete to authenticated
using ( bucket_id in ('love_songs','love_gallery') and owner = auth.uid() );
