-- Create the 'news' table
create table public.news (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  excerpt text,
  category text,
  author text,
  date text,
  image text,
  status text check (status in ('draft', 'pending_editor', 'pending_admin', 'published', 'rejected')),
  content text,
  "isFeatured" boolean default false,
  views integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.news enable row level security;

-- Create Policy: Allow read access to everyone for published news
create policy "Enable read access for all users" on public.news
  for select using (true); -- Or (status = 'published') if you want to restrict

-- Create Policy: Allow insert/update/delete for authenticated service roles or specific users
-- For simplicity, we allow all for now if you are using the service role key which bypasses RLS anyway.
-- But if you use the anon key from the client, you need policies.
-- Let's allow anon read.

-- Policy for inserting (e.g. from admin panel) - assuming authenticated
create policy "Enable insert for authenticated users only" on public.news
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users only" on public.news
  for update using (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users only" on public.news
  for delete using (auth.role() = 'authenticated');
