import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, full_name, role } = body;

        if (!email || !password || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Create User in Supabase Auth
        const { data: userData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Confirm email automatically so they can login immediately
            user_metadata: { full_name }
        });

        if (authError) {
            console.error('Supabase Auth Create Error:', authError);
            return NextResponse.json({ error: authError.message }, { status: 500 });
        }

        if (!userData.user) {
            return NextResponse.json({ error: 'User creation failed' }, { status: 500 });
        }

        // 2. Insert User Profile into public.users table
        const { error: profileError } = await supabaseAdmin
            .from('users')
            .upsert({
                id: userData.user.id,
                email: email,
                full_name: full_name,
                role: role,
                created_at: new Date().toISOString()
            });

        if (profileError) {
            console.error('Profile Creation Error:', profileError);
            // Optionally rollback auth user deletion here if strict consistency is needed
            return NextResponse.json({ error: 'Profile creation failed: ' + profileError.message }, { status: 500 });
        }

        return NextResponse.json({ user: userData.user });

    } catch (err: any) {
        console.error('Server Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
