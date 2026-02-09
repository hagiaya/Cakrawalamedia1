'use client';

import { useAuth } from '@/context/AuthContext';
import styles from '@/styles/Admin.module.css';
import { articles, ArticleStatus } from '@/lib/data';
import { Edit, Eye, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';

export default function MyPosts() {
    const { user, role } = useAuth();

    // Filter logic for simulation
    // In real app, filter by user.id
    const myArticles = articles.filter(a => {
        if (!user) return false;
        if (role === 'redaktur') return a.author === 'Redaksi';
        // Match partial name for simulation
        return a.author.includes(user.name.split(' ')[0]);
    });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.pageTitle}>Berita Saya ({user?.name})</h1>
                <Link href="/admin/create" className="btn btn-primary" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', background: 'var(--primary-red)', color: 'white', borderRadius: '4px' }}>
                    <Plus size={16} /> Tulis Baru
                </Link>
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button style={{ padding: '5px 15px', background: '#eee', borderRadius: '4px', border: 'none', fontWeight: 600 }}>Semua</button>
                        <button style={{ padding: '5px 15px', background: 'white', borderRadius: '4px', border: '1px solid #eee' }}>Published</button>
                        <button style={{ padding: '5px 15px', background: 'white', borderRadius: '4px', border: '1px solid #eee' }}>Draft</button>
                    </div>
                </div>

                {myArticles.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                        <p>Anda belum memiliki berita. Mulai menulis sekarang!</p>
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ width: '40%' }}>Judul</th>
                                <th>Kategori</th>
                                <th>Status</th>
                                <th>Tanggal</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myArticles.map(article => (
                                <tr key={article.id}>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{article.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{article.excerpt.substring(0, 50)}...</div>
                                    </td>
                                    <td>{article.category}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} 
                                            ${article.status === 'published' ? styles.statusPublished :
                                                article.status === 'draft' ? styles.statusDraft :
                                                    styles.statusReview}`}>
                                            {article.status || 'Published'}
                                        </span>
                                    </td>
                                    <td>{article.date}</td>
                                    <td style={{ display: 'flex', gap: '10px' }}>
                                        <Link href={`/news/${article.id}`} title="View" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                                            <Eye size={18} color="#555" />
                                        </Link>
                                        <Link href={`/admin/edit/${article.id}`} title="Edit" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                                            <Edit size={18} color="#0070f3" />
                                        </Link>
                                        <button title="Delete" style={{ border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => alert('Fitur Delete (Simulasi)')}>
                                            <Trash2 size={18} color="#cc0000" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
