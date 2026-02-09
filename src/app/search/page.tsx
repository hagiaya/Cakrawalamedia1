'use client';

import { useSearchParams } from 'next/navigation';
import { articles } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';
import cardStyles from '@/styles/Card.module.css';
import { Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Pagination from '@/components/Pagination';
import { Suspense, useState, useEffect } from 'react';

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get('q');
    // Default to page 1 if not present
    const currentPageParam = searchParams.get('page');
    const page = currentPageParam ? parseInt(currentPageParam) : 1;
    const itemsPerPage = 6;

    // Filter articles based on query
    const filteredArticles = articles.filter(article => {
        if (!query) return false;
        const lowerQuery = query.toLowerCase();
        return (
            article.title.toLowerCase().includes(lowerQuery) ||
            article.excerpt.toLowerCase().includes(lowerQuery) ||
            article.category.toLowerCase().includes(lowerQuery)
        );
    });

    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);

    // Calculate displayed articles for the current page
    const displayedArticles = filteredArticles.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const handlePageChange = (newPage: number) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set('page', newPage.toString());
        if (query) {
            newParams.set('q', query);
            // We use router.push with the new search string
            router.push(`/search?${newParams.toString()}`);
        }
    };

    if (!query) {
        return (
            <div className={`container ${styles.mainContent}`}>
                <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-grey)' }}>
                    <p>Please enter a search term.</p>
                    <Link href="/" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={`container ${styles.mainContent}`}>
            <div className={styles.newsFeed} style={{ width: '100%' }}>
                <div className={styles.sectionHeader} style={{ marginBottom: '30px' }}>
                    <h3 className={styles.sectionTitle}>
                        Search Results for: <span style={{ color: 'var(--primary-red)' }}>"{query}"</span>
                    </h3>
                </div>

                {displayedArticles.length > 0 ? (
                    <>
                        <div className={styles.latestNewsGrid}>
                            {displayedArticles.map(article => (
                                <div key={article.id} className={cardStyles.cardHorizontal}>
                                    <Link href={`/news/${article.id}`} className={cardStyles.imageWrapper}>
                                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                            <Image
                                                src={article.image}
                                                alt={article.title}
                                                fill
                                                className={cardStyles.image}
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>
                                    </Link>
                                    <div style={{ flex: 1, padding: '0 1rem' }}>
                                        <Link href={`/news/${article.id}`}>
                                            <h3 className={cardStyles.title}>{article.title}</h3>
                                        </Link>
                                        <div className={cardStyles.meta}>
                                            <span style={{ color: 'var(--primary-red)', marginRight: '10px' }}>{article.category}</span>
                                            <span><Clock size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />{article.date}</span>
                                        </div>
                                        <p className={cardStyles.excerpt}>{article.excerpt}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                ) : (
                    <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-grey)' }}>
                        <p>No articles found matching your search.</p>
                        <Link href="/" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
                            Back to Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="container" style={{ padding: '20px', textAlign: 'center' }}>Loading search results...</div>}>
            <SearchContent />
        </Suspense>
    );
}
