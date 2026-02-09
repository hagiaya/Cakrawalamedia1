
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Import data - copying directly to avoid build/import issues with mixed modules
const articles = [
    {
        id: '1',
        title: 'Akar Rumput Solid Dukung Pepep Sebagai Ketua DPW PPP Jabar',
        excerpt: 'Dukungan terus mengalir dari akar rumput untuk Pepep Saeful Hidayat memimpin DPW PPP Jawa Barat.',
        category: 'Nasional',
        author: 'Redaksi',
        date: '01 Feb, 2026',
        image: 'https://cakrawalamedia.com/wp-content/uploads/2026/02/thumbnail-50-1.png',
        isFeatured: true,
        views: 12543,
        status: 'published',
        content: 'Konten lengkap berita...'
    },
    {
        id: '2',
        title: 'PPP Jawa Barat Siap Gelar Muswil, Status Plt Ketua Masih Pepep Saeful Hidayat',
        excerpt: 'Persiapan Musyawarah Wilayah PPP Jawa Barat terus dimatangkan di tengah dinamika partai.',
        category: 'Nasional',
        author: 'Redaksi',
        date: '28 Jan, 2026',
        image: 'https://cakrawalamedia.com/wp-content/uploads/2026/01/thumbnail-48.png',
        status: 'published'
    },
    {
        id: '3',
        title: '300 Rumah Warga di Majalengka Terdampak Banjir',
        excerpt: 'Hujan deras yang mengguyur wilayah Majalengka menyebabkan ratusan rumah terendam banjir.',
        category: 'Nasional',
        author: 'Redaksi',
        date: '25 Jan, 2026',
        image: 'https://cakrawalamedia.com/wp-content/uploads/2026/01/thumbnail-47.png',
        status: 'published'
    },
    {
        id: '4',
        title: 'Banjir dan Longsor Landa Sejumlah Wilayah di Majalengka',
        excerpt: 'BPBD mencatat beberapa titik longsor dan banjir yang perlu diwaspadai warga.',
        category: 'Nasional',
        author: 'Redaksi',
        date: '24 Jan, 2026',
        image: 'https://cakrawalamedia.com/wp-content/uploads/2026/01/thumbnail-46.png',
        status: 'published'
    },
    {
        id: '5',
        title: 'BPBD Imbau Masyarakat Majalengka Waspada Cuaca Ekstrem',
        excerpt: 'Masyarakat diminta tetap waspada terhadap potensi hujan lebat dan angin kencang.',
        category: 'Pemerintahan',
        author: 'Redaksi',
        date: '21 Jan, 2026',
        image: 'https://cakrawalamedia.com/wp-content/uploads/2026/01/thumbnail-62.png',
        status: 'published'
    },
    // Mock Data for Workflow Testing
    {
        id: '101',
        title: 'Draf Berita Ekonomi Mikro (Wartawan)',
        excerpt: 'Analisis mendalam mengenai perkembangan UMKM di daerah pedesaan.',
        category: 'Bisnis',
        author: 'Joko (Wartawan)',
        date: '08 Feb, 2026',
        image: 'https://placehold.co/800x450/333333/white?text=Draft+Wartawan',
        status: 'draft'
    },
    {
        id: '102',
        title: 'Berita Menunggu Review Editor',
        excerpt: 'Laporan lapangan mengenai kondisi jalan rusak di wilayah selatan.',
        category: 'Nasional',
        author: 'Joko (Wartawan)',
        date: '07 Feb, 2026',
        image: 'https://placehold.co/800x450/444444/white?text=Pending+Editor',
        status: 'pending_editor'
    },
    {
        id: '103',
        title: 'Berita Siap Publish (Pending Admin)',
        excerpt: 'Wawancara eksklusif dengan tokoh masyarakat setempat.',
        category: 'Nasional',
        author: 'Siti (Editor)',
        date: '06 Feb, 2026',
        image: 'https://placehold.co/800x450/555555/white?text=Pending+Admin',
        status: 'pending_admin'
    },
    {
        id: '6',
        title: 'Pemulihan Layanan Pendidikan di Wilayah Terdampak Banjir Sumatera',
        excerpt: 'Kementerian Pendidikan mempercepat pemulihan fasilitas sekolah pasca banjir.',
        category: 'Nasional',
        author: 'Redaksi',
        date: '20 Jan, 2026',
        image: 'https://cakrawalamedia.com/wp-content/uploads/2026/01/thumbnail-43.png',
        status: 'published'
    }
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role Key for seeding!

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('Seeding data to Supabase...');

    // First, verify connection by checking a simple query or listing tables if possible (not directly via JS client usually, needs management API)
    // We will just try to select from 'news' to see if it exists
    const { error: checkError } = await supabase.from('news').select('count', { count: 'exact', head: true });

    if (checkError) {
        if (checkError.code === '42P01') { // undefined_table
            console.error('Table "news" does not exist! Please create the table first.');
            console.log(`
SQL to create table:

create table public.news (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  excerpt text,
  category text,
  author text,
  date text,
  image text,
  status text,
  content text,
  "isFeatured" boolean default false,
  views integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Note: RLS policies should also be enabled.
`);
            process.exit(1);
        } else {
            console.error('Error checking table:', checkError);
            process.exit(1);
        }
    }

    // Insert data
    for (const article of articles) {
        // Map fields if necessary. 
        // We handle 'date' as text because the mock data has '01 Feb, 2026'. 
        // Ideally should parse to Date object for a 'published_at' timestamp column, but keeping it simple as text for now if schema allows text.
        // If the table expects timestamp, this might fail.

        // Let's assume the table structure matches the object keys mostly.
        // Omit 'id' let Supabase generate UUIDs? Or use the provided IDs if they are UUIDs?
        // The mock IDs are strings like '1', '2'. These are NOT valid UUIDs.
        // If the ID column is UUID, this will fail.
        // We should let Supabase generate IDs and store the 'old_id' or just ignore it.
        // BUT, to prevent duplicates on re-seed, we need a unique constraint. Title?

        const { data: existing } = await supabase
            .from('news')
            .select('id')
            .eq('title', article.title)
            .single();

        if (existing) {
            console.log(`Skipping existing article: ${article.title}`);
            continue;
        }

        // Prepare payload - remove id to let DB generate UUID if it's UUID type
        // OR try to insert with the string ID if the column is text.
        // Safer to omit ID and let DB handle it if it's auto-increment or UUID.
        const { id, ...articleData } = article;

        const { error } = await supabase
            .from('news')
            .insert([
                {
                    ...articleData,
                    // If date column is timestamp, we might need new Date(article.date).toISOString() but article.date is '01 Feb, 2026'
                    // Let's try inserting as string first.
                    // If it is 'published_at' (timestamp), 'date' (text) mismatch. 
                    // We will map 'date' to 'created_at' maybe?
                }
            ]);

        if (error) {
            console.error(`Error inserting ${article.title}:`, error);
        } else {
            console.log(`Inserted: ${article.title}`);
        }
    }

    console.log('Seeding complete!');
}

seed().catch(console.error);
