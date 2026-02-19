
-- To manually grant Admin (Redaktur) access to a user, run this in the Supabase SQL Editor:
-- (Replace 'THE_USER_UUID_FROM_AUTH_USERS_TABLE' with the actual UUID of the user)

-- 1. Find the User ID (UUID) in the Authentication tab of your Supabase Dashboard.
--    Copy the UUID for 'admin@cakrawala.net'.

-- 2. Run this SQL command:

INSERT INTO public.users (id, email, full_name, role)
VALUES (
  'THE_USER_UUID_FROM_AUTH_USERS_TABLE', -- PASTE UUID HERE
  'admin@cakrawala.net',
  'Admin Cakrawala',
  'redaktur'
)
ON CONFLICT (id) DO UPDATE 
SET role = 'redaktur';

-- verification:
SELECT * FROM public.users WHERE email = 'admin@cakrawala.net';
