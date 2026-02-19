'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { categories, Article as MockArticle } from '@/lib/data'; // Keep MockArticle for type reference or define new one
import Image from 'next/image';
import styles from '@/styles/Home.module.css';
import cardStyles from '@/styles/Card.module.css';
import { User, Calendar, Facebook, Twitter, Clock, Eye } from 'lucide-react';
import Link from 'next/link';
import Pagination from '@/components/Pagination';
import Skeleton, { ArticleSkeleton, CardSkeleton } from '@/components/Skeleton';
import { useState, useEffect } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import FloatingShare from '@/components/FloatingShare';
import RelatedArticles from '@/components/RelatedArticles';
import ArticleComments from '@/components/ArticleComments';
import { supabase } from '@/lib/supabase';

// Define Article type matching DB
interface Article {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    image: string;
    author: string;
    date: string; // we will map created_at or published_at to this
    views: number;
    status: string;
    created_at: string;
    published_at: string;
}

export default function ClientPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const slugValue = params?.slug;
    const slug = (Array.isArray(slugValue) ? slugValue[0] : slugValue) || '';

    const [isLoading, setIsLoading] = useState(true);
    const [article, setArticle] = useState<Article | null>(null);
    const [isCategory, setIsCategory] = useState(false);
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            // Check if slug is a known category
            const categoryMatch = categories.find(c => c.toLowerCase() === slug.toLowerCase());

            if (categoryMatch) {
                setIsCategory(true);
                setCategoryName(categoryMatch);
                setIsLoading(false);
                return;
            }

            // If not category, try to fetch as article ID
            try {
                const { data, error } = await supabase
                    .from('news')
                    .select('*')
                    .eq('id', slug)
                    .single();

                if (data && !error) {
                    setArticle({
                        ...data,
                        date: data.published_at ? new Date(data.published_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date(data.created_at).toLocaleDateString()
                    });
                } else {
                    // Not found or error
                    setArticle(null);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (slug) {
            fetchData();
        }
    }, [slug]);

    if (isLoading) {
        return (
            <div className={`container ${styles.mainContent}`}>
                <div className={styles.newsFeed}><ArticleSkeleton /></div>
                <aside className={styles.sidebar}>
                    <div style={{ background: 'var(--bg-light-grey)', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>
                </aside>
            </div>
        );
    }

    if (isCategory) {
        return <CategoryListView category={categoryName} searchParams={searchParams} router={router} />;
    }

    if (article) {
        return <ArticleDetailView article={article} />;
    }

    return (
        <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
            <h2>404 - Not Found</h2>
            <p>Halaman atau berita yang Anda cari tidak ditemukan.</p>
            <Link href="/" className="btn btn-primary" style={{ marginTop: '20px' }}>Kembali ke Beranda</Link>
        </div>
    );
}

function CategoryListView({ category, searchParams, router }: { category: string, searchParams: any, router: any }) {
    const page = parseInt(searchParams.get('page') || '1');
    const itemsPerPage = 6;
    const [categoryArticles, setCategoryArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryNews = async () => {
            setLoading(true);
            const { data } = await supabase
                .from('news')
                .select('*')
                .eq('category', category)
                .eq('status', 'published')
                .order('created_at', { ascending: false });

            if (data) {
                const formattedOptions = data.map(item => ({
                    ...item,
                    date: item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date(item.created_at).toLocaleDateString()
                }));
                setCategoryArticles(formattedOptions);
            }
            setLoading(false);
        };
        fetchCategoryNews();
    }, [category]);


    const totalPages = Math.ceil(categoryArticles.length / itemsPerPage);
    const displayedArticles = categoryArticles.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const handlePageChange = (newPage: number) => {
        router.push(`/news/${category.toLowerCase()}?page=${newPage}`);
    };

    if (loading) return <CategorySkeleton category={category} />;

    return (
        <div className={`container ${styles.mainContent}`}>
            <div className={styles.newsFeed} style={{ width: '100%' }}>
                <div className={styles.sectionHeader} style={{ marginBottom: '30px' }}>
                    <h3 className={styles.sectionTitle}>
                        Kategori: <span style={{ color: 'var(--primary-red)' }}>{category}</span>
                    </h3>
                </div>

                {displayedArticles.length > 0 ? (
                    <>
                        <div className={styles.latestNewsGrid}>
                            {displayedArticles.map(article => (
                                <div key={article.id} className={cardStyles.cardHorizontal}>
                                    <Link href={`/news/${article.id}`} className={cardStyles.imageWrapper}>
                                        <Image
                                            src={article.image || 'https://placehold.co/600x400?text=No+Image'}
                                            alt={article.title}
                                            fill
                                            className={cardStyles.image}
                                        />
                                    </Link>
                                    <div style={{ flex: 1 }}>
                                        <Link href={`/news/${article.id}`}>
                                            <h3 className={cardStyles.title}>{article.title}</h3>
                                        </Link>
                                        <div className={cardStyles.meta}>
                                            <span style={{ color: 'var(--primary-red)', marginRight: '10px' }}>{article.category}</span>
                                            <span><Clock size={12} style={{ marginRight: '4px' }} />{article.date}</span>
                                        </div>
                                        <p className={cardStyles.excerpt}>{article.excerpt ? article.excerpt.substring(0, 100) + '...' : ''}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                ) : (
                    <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-grey)' }}>
                        <p>Belum ada berita di kategori ini.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function ArticleDetailView({ article }: { article: Article }) {
    const [views, setViews] = useState(article.views || 0);
    const [popularNews, setPopularNews] = useState<Article[]>([]);

    useEffect(() => {
        // Increment view count
        const incrementView = async () => {
            const hasViewed = sessionStorage.getItem(`viewed_${article.id}`);
            if (!hasViewed) {
                await supabase.rpc('increment_view', { row_id: article.id }); // Assuming RPC or just client side update for now
                // Fallback direct update if RPC not set
                // const { error } = await supabase.from('news').update({ views: article.views + 1 }).eq('id', article.id);
                setViews(prev => prev + 1);
                sessionStorage.setItem(`viewed_${article.id}`, 'true');
            }
        };
        incrementView();

        // Fetch popular news
        const fetchPopular = async () => {
            const { data } = await supabase
                .from('news')
                .select('*')
                .eq('status', 'published')
                .order('views', { ascending: false })
                .limit(5);

            if (data) {
                const formatted = data.map(item => ({
                    ...item,
                    date: item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date(item.created_at).toLocaleDateString()
                }));
                setPopularNews(formatted);
            }
        };
        fetchPopular();
    }, [article.id]);

    return (
        <>
            <ReadingProgressBar />
            <FloatingShare title={article.title} url={`https://cakrawalamedia.com/news/${article.id}`} />

            <div className={`container ${styles.mainContent}`}>

                {/* Article Content */}
                <div className={styles.newsFeed}>
                    <Breadcrumbs items={[
                        { label: 'Home', href: '/' },
                        { label: article.category, href: `/news/${article.category.toLowerCase()}` },
                        { label: article.title, href: '#' }
                    ]} />

                    <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', lineHeight: '1.2', marginBottom: '20px' }}>{article.title}</h1>

                    <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-grey)', fontSize: '0.9rem', marginBottom: '25px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
                        <span style={{ background: 'var(--primary-red)', color: 'white', padding: '4px 10px', fontWeight: 'bold', marginRight: '15px', textTransform: 'uppercase', fontSize: '0.75rem', borderRadius: '2px' }}>{article.category}</span>
                        <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                            <User size={16} style={{ marginRight: '6px' }} />
                            <span style={{ fontWeight: '600' }}>{article.author}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                            <Calendar size={16} style={{ marginRight: '6px' }} />
                            <span>{article.date}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Eye size={16} style={{ marginRight: '6px' }} />
                            <span>{views.toLocaleString()} views</span>
                        </div>
                    </div>

                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', marginBottom: '30px', overflow: 'hidden', borderRadius: '4px' }}>
                        <Image src={article.image || 'https://placehold.co/800x450?text=No+Image'} alt={article.title} fill style={{ objectFit: 'cover' }} priority />
                    </div>

                    <article style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-dark-grey)', fontFamily: 'var(--font-body)' }}>
                        <p style={{ fontWeight: '500', fontSize: '1.2rem', marginBottom: '30px', color: 'var(--text-black)' }}>{article.excerpt}</p>

                        {article.content ? (
                            article.content.split('\n\n').map((paragraph, index) => (
                                <p key={index} style={{ marginBottom: '20px' }}>
                                    {paragraph.trim()}
                                </p>
                            ))
                        ) : (
                            <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '4px', textAlign: 'center', fontStyle: 'italic', color: '#6c757d' }}>
                                Konten berita belum tersedia.
                            </div>
                        )}
                    </article>

                    <div style={{ marginTop: '50px', borderTop: '1px solid var(--border-color)', paddingTop: '30px' }}>
                        <h4 style={{ marginBottom: '15px' }}>Bagikan Berita Ini:</h4>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button style={{ background: '#3b5998', color: 'white', border: 'none', padding: '10px 20px', display: 'flex', alignItems: 'center', cursor: 'pointer', borderRadius: '4px' }}>
                                <Facebook size={18} style={{ marginRight: '8px' }} /> Facebook
                            </button>
                            <button style={{ background: '#1da1f2', color: 'white', border: 'none', padding: '10px 20px', display: 'flex', alignItems: 'center', cursor: 'pointer', borderRadius: '4px' }}>
                                <Twitter size={18} style={{ marginRight: '8px' }} /> Twitter
                            </button>
                            <button style={{ background: '#25d366', color: 'white', border: 'none', padding: '10px 20px', display: 'flex', alignItems: 'center', cursor: 'pointer', borderRadius: '4px' }}>
                                Share via WA
                            </button>
                        </div>
                    </div>

                    {/* Use existing component but it likely uses mock data internally. 
                        Ideally RelatedArticles should also be refactored to fetch real data. 
                        For now we pass props just in case it helps. */}
                    <RelatedArticles currentArticleId={article.id} category={article.category} />
                    <ArticleComments articleId={article.id} />
                </div>

                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    <div style={{ marginBottom: '30px' }}>
                        <h3 className={styles.sectionTitle}>Berita Terpopuler</h3>
                        <div style={{ marginTop: '20px' }}>
                            {popularNews.length > 0 ? (
                                popularNews.map((a, i) => (
                                    <div key={a.id} style={{ display: 'flex', marginBottom: '20px', alignItems: 'flex-start' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-meta)', opacity: 0.3, marginRight: '15px', lineHeight: 1 }}>{i + 1}</div>
                                        <div>
                                            <Link href={`/news/${a.id}`} style={{ fontWeight: '700', lineHeight: '1.3', display: 'block', marginBottom: '5px', fontSize: '0.95rem' }} className={styles.hoverLink}>
                                                {a.title}
                                            </Link>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-meta)' }}>{a.date}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: '#888' }}>Memuat berita populer...</p>
                            )}
                        </div>
                    </div>

                    {/* 
                      AD IMPLEMENTATION NOTE:
                      To ensure this does NOT affect Supabase/Vercel bandwidth:
                      1. Use standard <img> tag for external ad servers (Google Ads, etc).
                      2. If using hosted images, upload them to Cloudinary.
                      3. If using next/image, add 'unoptimized' prop to bypass Vercel processing.
                    */}
                    <div style={{ background: 'var(--bg-light-grey)', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-grey)', textTransform: 'uppercase', marginBottom: '30px' }}>
                        Tower Ad (160x600)
                    </div>
                </aside>

            </div>
        </>
    );
}

function CategorySkeleton({ category }: { category: string }) {
    return (
        <div className={`container ${styles.mainContent}`}>
            <div className={styles.newsFeed} style={{ width: '100%' }}>
                <div className={styles.sectionHeader} style={{ marginBottom: '30px' }}>
                    <h3 className={styles.sectionTitle}>
                        Kategori: <span style={{ color: 'var(--primary-red)' }}>{category}</span>
                    </h3>
                </div>
                <div className={styles.latestNewsGrid}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}
