# Supabase Setup for Authentication & Roles

Please run the following SQL commands in your Supabase Dashboard -> SQL Editor to set up the user roles and permissions.

## 1. Create Users Table (Profiles)

This table will store the role and additional information for each user, linked to the Supabase Auth system.

```sql
-- Create a table for public user profiles
create table public.users (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  role text check (role in ('redaktur', 'editor', 'wartawan', 'guest')) default 'guest',
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;

-- Create policies
-- 1. Users can view their own profile
create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);

-- 2. Users can update their own profile
create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

-- 3. Redaktur (Admin) can view all profiles
create policy "Redaktur can view all profiles" on public.users
  for select using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'redaktur'
    )
  );
```

## 2. Auto-create Profile on Signup (Optional)

This trigger automatically creates an entry in `public.users` when a new user signs up.

```sql
-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'guest');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## 3. Setting Up Roles for Existing Users

If you have already created users in the Authentication tab, you need to manually insert their roles into the `public.users` table.

First, identify the UUID of your users from the Authentication > Users page. Then run:

```sql
-- Replace 'USER_UUID_HERE' with the actual UUID from Supabase Auth
-- Example for an Admin (Redaktur)
INSERT INTO public.users (id, email, full_name, role)
VALUES 
  ('USER_UUID_HERE', 'admin@example.com', 'Nama Admin', 'redaktur')
ON CONFLICT (id) DO UPDATE SET role = 'redaktur';

-- Example for an Editor
INSERT INTO public.users (id, email, full_name, role)
VALUES 
  ('USER_UUID_HERE', 'editor@example.com', 'Nama Editor', 'editor')
ON CONFLICT (id) DO UPDATE SET role = 'editor';

-- Example for a Journalist (Wartawan)
INSERT INTO public.users (id, email, full_name, role)
VALUES 
  ('USER_UUID_HERE', 'wartawan@example.com', 'Nama Wartawan', 'wartawan')
ON CONFLICT (id) DO UPDATE SET role = 'wartawan';
```
