
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const TARGET_EMAIL = 'admin@cakrawala.net';
// We don't need the password if we are just updating the role using the Service Role Key

async function setAdminRole() {
    console.log(`Searching for user: ${TARGET_EMAIL}...`);

    // 1. Find the user by email in Auth
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error('Error listing users:', listError);
        process.exit(1);
    }

    const user = users.find(u => u.email === TARGET_EMAIL);

    if (!user) {
        console.error(`User ${TARGET_EMAIL} not found in Supabase Auth!`);
        console.log('Please create the user in the Supabase Dashboard or Sign Up first.');
        process.exit(1);
    }

    console.log(`Found user ID: ${user.id}`);

    // 2. Update/Insert into public.users with role 'redaktur'
    const { error: upsertError } = await supabase
        .from('users')
        .upsert({
            id: user.id,
            email: TARGET_EMAIL,
            full_name: user.user_metadata?.full_name || 'Admin Cakrawala',
            role: 'redaktur'
        }, { onConflict: 'id' as any });

    if (upsertError) {
        console.error('Error updating role in public.users:', upsertError);
        process.exit(1);
    }

    console.log('---------------------------------------------------');
    console.log('✅ SUCCESS!');
    console.log(`User ${TARGET_EMAIL} is now an Admin (redaktur).`);
    console.log('You can now log in at /login');
    console.log('---------------------------------------------------');
}

setAdminRole().catch(console.error);
