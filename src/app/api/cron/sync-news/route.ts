import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic' // Static pages cannot do this

function decodeHtml(html: string) {
    return html
        .replace(/&#8211;/g, '-')
        .replace(/&#8217;/g, "'")
        .replace(/&#8220;/g, '"')
        .replace(/&#8221;/g, '"')
        .replace(/&#038;/g, '&')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
}

export async function GET(request: Request) {
    try {
        // Only fetch the latest page (e.g. 50 posts) to keep sync fast
        const url = `https://cakrawalamedia.com/wp-json/wp/v2/posts?_embed&per_page=50&page=1`
        const res = await fetch(url)

        if (!res.ok) {
            return NextResponse.json({ error: `WP API error: ${res.statusText}` }, { status: 500 })
        }

        const posts = await res.json()

        // Fetch recent posts from db to prevent duplicates
        const { data: existingPosts, error: fetchErr } = await supabaseAdmin
            .from('news')
            .select('title')
            .order('created_at', { ascending: false })
            .limit(100)

        if (fetchErr) {
            return NextResponse.json({ error: fetchErr.message }, { status: 500 })
        }

        const existingTitles = new Set(existingPosts.map(p => p.title))
        const postsToInsert = []

        for (const post of posts) {
            const title = decodeHtml(post.title.rendered)

            if (existingTitles.has(title)) {
                continue // Already exists
            }

            const excerpt = post.excerpt.rendered.replace(/<[^>]*>?/gm, '').trim()
            const content = post.content.rendered
            const date = post.date
            const author = post._embedded?.author?.[0]?.name || 'Admin'

            let category = 'Berita'
            const terms = post._embedded?.['wp:term']
            if (terms && terms.length > 0 && terms[0].length > 0) {
                category = terms[0][0].name
            }

            let image = ''
            if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
                image = post._embedded['wp:featuredmedia'][0].source_url
            } else {
                const match = content.match(/<img[^>]+src="([^">]+)"/)
                if (match) {
                    image = match[1]
                }
            }

            postsToInsert.push({
                title,
                excerpt,
                category,
                author,
                date,
                image,
                content,
                status: 'published',
                isFeatured: false,
                views: 0
            })
        }

        if (postsToInsert.length > 0) {
            // Reverse to insert oldest first so that sorted display makes sense if needed
            postsToInsert.reverse()

            const { error } = await supabaseAdmin
                .from('news')
                .insert(postsToInsert)

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 })
            }

            return NextResponse.json({ success: true, inserted: postsToInsert.length })
        }

        return NextResponse.json({ success: true, inserted: 0, message: 'No new posts' })

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
