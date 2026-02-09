export type ArticleStatus = 'draft' | 'pending_editor' | 'pending_admin' | 'published' | 'rejected';

export interface Article {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    author: string;
    date: string;
    image: string;
    isFeatured?: boolean;
    views?: number;
    status: ArticleStatus;
    content?: string; // Adding content field for full article
}

export const articles: Article[] = [
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

export const categories = [
    'Nasional', 'Internasional', 'Bisnis', 'Olahraga', 'Teknologi', 'Gaya Hidup', 'Otomotif', 'Kesehatan', 'Pemerintahan', 'Hukum', 'Hiburan'
];
