-- =====================================================================
--  RULETA DE PLANES — Esquema completo de Supabase
--  Ejecuta este fichero entero en:  Supabase Dashboard -> SQL Editor
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. Lista blanca: SOLO las personas de `pareja_autorizada` entran.
--
--    Este fichero NO contiene ningún correo a propósito, para poder subirlo
--    a un repositorio público sin exponer datos personales. Los correos van
--    en `supabase/emails.local.sql`, que git ignora.
--
--    Orden de ejecución:  1) este fichero   2) emails.local.sql
-- ---------------------------------------------------------------------
create table if not exists public.pareja_autorizada (
  email      text primary key,
  añadido_el timestamptz not null default now()
);

-- Sin políticas y con RLS activo: ningún cliente puede leerla ni tocarla.
-- La función de abajo sí puede, porque es SECURITY DEFINER.
alter table public.pareja_autorizada enable row level security;

create or replace function public.es_pareja()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
      from public.pareja_autorizada
     where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

comment on function public.es_pareja() is
  'True solo si el email del usuario autenticado está en pareja_autorizada.';

-- ---------------------------------------------------------------------
-- 1. Tabla PLANS — los planes que habéis aceptado en la ruleta
-- ---------------------------------------------------------------------
create table if not exists public.plans (
  id           uuid primary key default gen_random_uuid(),
  idea_id      text        not null,                       -- slug del plan en el catálogo local
  title        text        not null,
  category     text        not null check (category in ('casa', 'madrid', 'escapada')),
  emoji        text,
  description  text,
  tips         text[]      not null default '{}',
  budget       text        not null default '€' check (budget in ('€', '€€')),
  drive_time   text,                                       -- ej: '1 h 15 min desde Madrid'
  gluten_free  text,                                       -- notas 100% sin gluten
  status       text        not null default 'pendiente'
                           check (status in ('pendiente', 'completado')),
  accepted_at  timestamptz not null default now(),
  completed_at timestamptz,
  created_by   uuid        references auth.users (id) on delete set null,
  created_at   timestamptz not null default now()
);

create index if not exists plans_status_idx    on public.plans (status, accepted_at desc);
create index if not exists plans_completed_idx on public.plans (completed_at desc);

-- ---------------------------------------------------------------------
-- 2. Tabla MEMORIES — el recuerdo (fecha, nota y fotos) de un plan
-- ---------------------------------------------------------------------
create table if not exists public.memories (
  id          uuid primary key default gen_random_uuid(),
  plan_id     uuid        not null references public.plans (id) on delete cascade,
  happened_on date        not null default current_date,
  note        text,
  photos      text[]      not null default '{}',            -- rutas dentro del bucket 'recuerdos'
  created_by  uuid        references auth.users (id) on delete set null,
  created_at  timestamptz not null default now()
);

create index if not exists memories_plan_idx on public.memories (plan_id);
create index if not exists memories_date_idx on public.memories (happened_on desc);

-- ---------------------------------------------------------------------
-- 3. Row Level Security
-- ---------------------------------------------------------------------
alter table public.plans    enable row level security;
alter table public.memories enable row level security;

drop policy if exists "pareja lee planes"   on public.plans;
drop policy if exists "pareja crea planes"  on public.plans;
drop policy if exists "pareja edita planes" on public.plans;
drop policy if exists "pareja borra planes" on public.plans;

create policy "pareja lee planes"   on public.plans for select to authenticated using (public.es_pareja());
create policy "pareja crea planes"  on public.plans for insert to authenticated with check (public.es_pareja());
create policy "pareja edita planes" on public.plans for update to authenticated using (public.es_pareja()) with check (public.es_pareja());
create policy "pareja borra planes" on public.plans for delete to authenticated using (public.es_pareja());

drop policy if exists "pareja lee recuerdos"   on public.memories;
drop policy if exists "pareja crea recuerdos"  on public.memories;
drop policy if exists "pareja edita recuerdos" on public.memories;
drop policy if exists "pareja borra recuerdos" on public.memories;

create policy "pareja lee recuerdos"   on public.memories for select to authenticated using (public.es_pareja());
create policy "pareja crea recuerdos"  on public.memories for insert to authenticated with check (public.es_pareja());
create policy "pareja edita recuerdos" on public.memories for update to authenticated using (public.es_pareja()) with check (public.es_pareja());
create policy "pareja borra recuerdos" on public.memories for delete to authenticated using (public.es_pareja());

-- ---------------------------------------------------------------------
-- 4. Storage — bucket PRIVADO para las fotos
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('recuerdos', 'recuerdos', false)
on conflict (id) do nothing;

drop policy if exists "pareja ve fotos"    on storage.objects;
drop policy if exists "pareja sube fotos"  on storage.objects;
drop policy if exists "pareja edita fotos" on storage.objects;
drop policy if exists "pareja borra fotos" on storage.objects;

create policy "pareja ve fotos" on storage.objects for select to authenticated
  using (bucket_id = 'recuerdos' and public.es_pareja());

create policy "pareja sube fotos" on storage.objects for insert to authenticated
  with check (bucket_id = 'recuerdos' and public.es_pareja());

create policy "pareja edita fotos" on storage.objects for update to authenticated
  using (bucket_id = 'recuerdos' and public.es_pareja())
  with check (bucket_id = 'recuerdos' and public.es_pareja());

create policy "pareja borra fotos" on storage.objects for delete to authenticated
  using (bucket_id = 'recuerdos' and public.es_pareja());

-- ---------------------------------------------------------------------
-- 5. Vista cómoda: cada plan completado junto a su recuerdo
-- ---------------------------------------------------------------------
create or replace view public.v_album
with (security_invoker = true) as
  select
    p.id  as plan_id,
    p.title,
    p.category,
    p.emoji,
    p.budget,
    p.drive_time,
    m.id  as memory_id,
    m.happened_on,
    m.note,
    m.photos
  from public.plans p
  join public.memories m on m.plan_id = p.id
  order by m.happened_on desc;

-- ---------------------------------------------------------------------
-- 6. Al borrar el último recuerdo de un plan, el plan vuelve a pendiente
-- ---------------------------------------------------------------------
create or replace function public.plan_vuelve_a_pendiente()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.plans
     set status = 'pendiente', completed_at = null
   where id = old.plan_id
     and not exists (select 1 from public.memories where plan_id = old.plan_id);
  return old;
end;
$$;

drop trigger if exists trg_plan_vuelve_a_pendiente on public.memories;
create trigger trg_plan_vuelve_a_pendiente
  after delete on public.memories
  for each row execute function public.plan_vuelve_a_pendiente();
