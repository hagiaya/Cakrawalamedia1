'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { articles, categories, Article } from '@/lib/data';
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

export default function ClientPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const slugValue = params?.slug;
    const slug = (Array.isArray(slugValue) ? slugValue[0] : slugValue) || '';

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate network delay
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, [slug]);

    // Check if it's a category
    const categoryMatch = categories.find(c => c.toLowerCase() === slug.toLowerCase());

    if (categoryMatch) {
        return isLoading
            ? <CategorySkeleton category={categoryMatch} />
            : <CategoryListView category={categoryMatch} searchParams={searchParams} router={router} />;
    }

    // Check if it's an article
    const article = articles.find(a => a.id === slug);

    if (article) {
        return isLoading
            ? <div className={`container ${styles.mainContent}`}><div className={styles.newsFeed}><ArticleSkeleton /></div><aside className={styles.sidebar}><div style={{ background: 'var(--bg-light-grey)', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div></aside></div>
            : <ArticleDetailView article={article} />;
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

    const categoryArticles = articles.filter(a => a.category.toLowerCase() === category.toLowerCase());

    // Sort logic if needed (e.g. by date desc) - assuming data is already sorted or we sort
    // categoryArticles.sort(...) 

    const totalPages = Math.ceil(categoryArticles.length / itemsPerPage);
    const displayedArticles = categoryArticles.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const handlePageChange = (newPage: number) => {
        router.push(`/news/${category.toLowerCase()}?page=${newPage}`);
    };

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
                                            src={article.image}
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
                                        <p className={cardStyles.excerpt}>{article.excerpt}</p>
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
    const [views, setViews] = useState(article.views || Math.floor(Math.random() * 1000) + 100);

    useEffect(() => {
        // Simulate incrementing view count on client side mount
        const hasViewed = sessionStorage.getItem(`viewed_${article.id}`);
        if (!hasViewed) {
            setViews(prev => prev + 1);
            sessionStorage.setItem(`viewed_${article.id}`, 'true');
        }
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
                        <Image src={article.image} alt={article.title} fill style={{ objectFit: 'cover' }} priority />
                    </div>

                    <article style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-dark-grey)', fontFamily: 'var(--font-body)' }}>
                        <p style={{ fontWeight: '500', fontSize: '1.2rem', marginBottom: '30px', color: 'var(--text-black)' }}>{article.excerpt}</p>

                        <p style={{ marginBottom: '20px' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>

                        <p style={{ marginBottom: '20px' }}>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>

                        <h3 style={{ marginTop: '40px', marginBottom: '20px', fontSize: '1.5rem' }}>Analisis Mendalam</h3>

                        <p style={{ marginBottom: '20px' }}>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>

                        <div style={{ background: 'var(--bg-light-grey)', padding: '20px', borderLeft: '4px solid var(--primary-red)', margin: '30px 0', fontStyle: 'italic' }}>
                            "Kami berkomitmen untuk terus meningkatkan kualitas layanan digital di Indonesia demi masa depan yang lebih baik." - Kutipan Narasumber
                        </div>

                        <p style={{ marginBottom: '20px' }}>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>
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

                    <RelatedArticles currentArticleId={article.id} category={article.category} />
                    <ArticleComments articleId={article.id} />
                </div>

                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    <div style={{ marginBottom: '30px' }}>
                        <h3 className={styles.sectionTitle}>Berita Terpopuler</h3>
                        <div style={{ marginTop: '20px' }}>
                            {articles.slice(0, 4).map((a, i) => (
                                <div key={a.id} style={{ display: 'flex', marginBottom: '20px', alignItems: 'flex-start' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-meta)', opacity: 0.3, marginRight: '15px', lineHeight: 1 }}>{i + 1}</div>
                                    <div>
                                        <Link href={`/news/${a.id}`} style={{ fontWeight: '700', lineHeight: '1.3', display: 'block', marginBottom: '5px', fontSize: '0.95rem' }} className={styles.hoverLink}>
                                            {a.title}
                                        </Link>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-meta)' }}>{a.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

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
