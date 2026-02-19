import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, excerpt, content, category, image, status, author, author_id, published_at } = body;

        if (!title || !status) {
            return NextResponse.json({ error: 'Missing required fields (Title or Status)' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('news')
            .insert([
                {
                    title,
                    excerpt,
                    content,
                    category,
                    image,
                    author,
                    author_id,
                    status,
                    published_at: published_at || (status === 'published' ? new Date().toISOString() : null),
                    // Let DB handle defaults for id, created_at, views, isFeatured
                },
            ])
            .select()
            .single();

        if (error) {
            console.error('Supabase Insert Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (err: any) {
        console.error('Server Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
        const { data, error } = await supabaseAdmin
            .from('news')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        return NextResponse.json({ data });
    }

    // Fetch news list (for admin or public)
    const { data, error } = await supabaseAdmin
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, title, excerpt, content, category, image, status } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing article ID' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('news')
            .update({
                title,
                excerpt,
                content,
                category,
                image,
                status,
                // updated_at: new Date().toISOString() // Assuming you might have this field
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Supabase Update Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (err: any) {
        console.error('Server Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
