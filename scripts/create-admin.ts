
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials! Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const ADMIN_EMAIL = 'admin@cakrawalamedia.com';
const ADMIN_PASSWORD = 'admin123'; // Change this after logging in!
const ADMIN_NAME = 'Admin Pusat';

async function createAdmin() {
    console.log(`Setting up admin access for ${ADMIN_EMAIL}...`);

    // 1. Check if user exists in Auth
    // We can't identify users by email directly with admin client easily without listUsers, 
    // but createUser will fail if it exists, or we can assume we want to update if we find it.
    // listUsers is cleaner.

    // Note: listUsers might require pagination if there are many users, but for now we assume small count.
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error('Error listing users:', listError);
        process.exit(1);
    }

    let userId = users.find(u => u.email === ADMIN_EMAIL)?.id;

    if (!userId) {
        console.log('User not found. Creating new admin user...');
        const { data, error: createError } = await supabase.auth.admin.createUser({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            email_confirm: true,
            user_metadata: { full_name: ADMIN_NAME }
        });

        if (createError) {
            console.error('Error creating user:', createError);
            process.exit(1);
        }

        userId = data.user.id;
        console.log('User created successfully.');
    } else {
        console.log(`User already exists (ID: ${userId}). ensuring role is set...`);
        // Optional: Update password checking? No, we shouldn't reset password blindly unless requested.
    }

    // 2. Assign Role in public.users
    // We assume the table public.users exists as per SUPABASE_SETUP.md

    const { error: upsertError } = await supabase
        .from('users')
        .upsert({
            id: userId,
            email: ADMIN_EMAIL,
            full_name: ADMIN_NAME,
            role: 'redaktur', // 'redaktur' is the admin role based on SUPABASE_SETUP.md
            // avatar_url: ...
        }, { onConflict: 'id' as any }); // Cast as any if TS complains about string literal types for onConflict

    if (upsertError) {
        console.error('Error assigning role:', upsertError);
        process.exit(1);
    }

    console.log('---------------------------------------------------');
    console.log('Admin Access Configured Successfully!');
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD} (if new user)`);
    console.log(`Role: redaktur (Admin)`);
    console.log('---------------------------------------------------');
}

createAdmin().catch(console.error);
