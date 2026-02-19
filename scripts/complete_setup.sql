
-- 1. Create the 'users' table if it doesn't exist
create table if not exists public.users (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  role text check (role in ('redaktur', 'editor', 'wartawan', 'guest')) default 'guest',
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.users enable row level security;

-- 3. Create policies (drop if exists to avoid errors on re-run)
-- Helper Function to check role securely (Avoids infinite recursion)
create or replace function public.is_redaktur()
returns boolean as $$
begin
  return exists (
    select 1 from public.users
    where id = auth.uid() and role = 'redaktur'
  );
end;
$$ language plpgsql security definer;

-- 3. Create policies (drop if exists to avoid errors on re-run)
drop policy if exists "Users can view own profile" on public.users;
create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.users;
create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

drop policy if exists "Redaktur can view all profiles" on public.users;
create policy "Redaktur can view all profiles" on public.users
  for select using (public.is_redaktur());

drop policy if exists "Redaktur can update all profiles" on public.users;
create policy "Redaktur can update all profiles" on public.users
  for update using (public.is_redaktur());

drop policy if exists "Redaktur can delete profiles" on public.users;
create policy "Redaktur can delete profiles" on public.users
  for delete using (public.is_redaktur());

drop policy if exists "Redaktur can insert profiles" on public.users;
create policy "Redaktur can insert profiles" on public.users
  for insert with check (public.is_redaktur());



-- 4. Insert the Admin User (using the UUID found for admin@cakrawala.net)
-- UUID: cd9b6245-8ee5-449f-b6a2-40b7d4c62074

INSERT INTO public.users (id, email, full_name, role)
VALUES (
  'cd9b6245-8ee5-449f-b6a2-40b7d4c62074', 
  'admin@cakrawala.net', 
  'Admin Pusat', 
  'redaktur'
)
ON CONFLICT (id) DO UPDATE 
SET role = 'redaktur';

-- 5. Verification
SELECT * FROM public.users;
