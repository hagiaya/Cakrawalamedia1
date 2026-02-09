'use client';

import styles from '@/styles/Admin.module.css';
import { articles } from '@/lib/data';
import { Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AllPosts() {
    const { role } = useAuth();

    // Only Refaktur and Editor should see this usually, but maybe Wartawan wants to see all published news relative to them?
    // Let's assume this is the main news management table.

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.pageTitle}>Semua Berita</h1>
                <Link href="/admin/create" className="btn btn-primary" style={{ padding: '10px 20px', textDecoration: 'none', background: 'var(--primary-red)', color: 'white', borderRadius: '4px' }}>
                    + Tulis Baru
                </Link>
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button style={{ padding: '5px 15px', background: '#eee', borderRadius: '4px', border: 'none', fontWeight: 600 }}>Semua</button>
                        <button style={{ padding: '5px 15px', background: 'white', borderRadius: '4px', border: '1px solid #eee' }}>Published</button>
                        <button style={{ padding: '5px 15px', background: 'white', borderRadius: '4px', border: '1px solid #eee' }}>Pending</button>
                    </div>
                    <input type="text" placeholder="Cari berita..." style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #ddd' }} />
                </div>

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '40%' }}>Judul</th>
                            <th>Penulis</th>
                            <th>Kategori</th>
                            <th>Status</th>
                            <th>Tanggal</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map(article => (
                            <tr key={article.id}>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{article.title}</div>
                                </td>
                                <td>{article.author}</td>
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
                                    {(role === 'redaktur' || role === 'editor') && (
                                        <>
                                            <Link href={`/admin/edit/${article.id}`} title="Edit" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                                                <Edit size={18} color="#0070f3" />
                                            </Link>
                                            <button title="Delete" style={{ border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => alert('Hapus Berita (Simulasi)')}>
                                                <Trash2 size={18} color="#cc0000" />
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
