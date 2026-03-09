import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing Supabase Service Role environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function fetchFromWP(page: number) {
    const url = `https://cakrawalamedia.com/wp-json/wp/v2/posts?_embed&per_page=50&page=${page}`
    console.log(`Fetching from: ${url}`)
    const res = await fetch(url)
    if (!res.ok) {
        if (res.status === 400 && (await res.json()).code === 'rest_post_invalid_page_number') {
            return [] // End of pages
        }
        throw new Error(`WordPress API error: ${res.statusText}`)
    }
    return res.json()
}

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

async function syncAllPosts() {
    console.log('Fetching existing posts from Supabase...')
    const { data: existingPosts, error: fetchErr } = await supabase
        .from('news')
        .select('title, date')

    if (fetchErr) {
        console.error('Error fetching existing posts:', fetchErr)
        process.exit(1)
    }

    const existingTitles = new Set(existingPosts?.map((p) => p.title) || [])
    console.log(`Found ${existingTitles.size} existing posts in Supabase.`)

    let page = 1
    let totalInserted = 0
    let totalSkipped = 0

    while (true) {
        const posts = await fetchFromWP(page)
        if (posts.length === 0) break

        const postsToInsert = []

        for (const post of posts) {
            const title = decodeHtml(post.title.rendered)

            if (existingTitles.has(title)) {
                totalSkipped++
                continue
            }

            const excerpt = post.excerpt.rendered.replace(/<[^>]*>?/gm, '').trim()
            const content = post.content.rendered
            const date = post.date
            const author = post._embedded?.author?.[0]?.name || 'Admin'

            let category = 'Berita'
            const terms = post._embedded?.['wp:term']
            if (terms && terms.length > 0 && terms[0].length > 0) {
                // Take the first category name
                category = terms[0][0].name
            }

            let image = ''
            if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
                image = post._embedded['wp:featuredmedia'][0].source_url
            } else {
                // Fallback to first image in content if any
                const match = content.match(/<img[^>]+src="([^">]+)"/)
                if (match) {
                    image = match[1]
                }
            }

            // Default status usually handled by DB, else published
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
                // removed created_at to use default
            })
            existingTitles.add(title)
        }

        if (postsToInsert.length > 0) {
            const { error } = await supabase
                .from('news')
                .insert(postsToInsert)

            if (error) {
                console.error('Error inserting posts:', error)
            } else {
                totalInserted += postsToInsert.length
                console.log(`Inserted ${postsToInsert.length} posts from page ${page}.`)
            }
        } else {
            console.log(`No new posts to insert from page ${page}.`)
        }

        page++
    }

    console.log('Sync complete!')
    console.log(`Total inserted: ${totalInserted}`)
    console.log(`Total skipped: ${totalSkipped}`)
}

syncAllPosts().catch(console.error)
