'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { Article, articles } from '@/lib/data';
import cardStyles from '@/styles/Card.module.css';

interface RelatedArticlesProps {
    currentArticleId: string;
    category: string;
}

export default function RelatedArticles({ currentArticleId, category }: RelatedArticlesProps) {
    // Filter articles by category, exclude current, take 3
    const related = articles
        .filter(a => a.category === category && a.id !== currentArticleId)
        .slice(0, 3);

    if (related.length === 0) return null;

    return (
        <div style={{ marginTop: '50px', borderTop: '1px solid var(--border-color)', paddingTop: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', textTransform: 'uppercase', margin: 0, color: 'var(--text-black)', position: 'relative' }}>
                    Baca Juga
                    <span style={{ position: 'absolute', bottom: '-12px', left: 0, width: '100%', height: '2px', background: 'var(--primary-red)' }}></span>
                </h3>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                {related.map(article => (
                    <div key={article.id} className={cardStyles.card}>
                        <Link href={`/news/${article.id}`} className={cardStyles.imageWrapper}>
                            <Image
                                src={article.image}
                                alt={article.title}
                                fill
                                className={cardStyles.image}
                            />
                            <div className={cardStyles.categoryBadge}>{article.category}</div>
                        </Link>
                        <div className={cardStyles.content} style={{ padding: '0' }}>
                            <Link href={`/news/${article.id}`}>
                                <h4 className={cardStyles.title} style={{ fontSize: '1rem', marginTop: '10px' }}>{article.title}</h4>
                            </Link>
                            <div className={cardStyles.meta}>
                                <span><Clock size={12} style={{ marginRight: '4px' }} /> {article.date}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
