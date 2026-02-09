'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { articles, Article, ArticleStatus } from '@/lib/data';
import styles from '@/styles/Admin.module.css';
import { Check, X, Eye, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ReviewPage() {
    const { role } = useAuth();
    const router = useRouter();

    // Redirect if not authorized
    if (role === 'wartawan' || role === 'guest') {
        return <div className={styles.container}>Akses Ditolak. Halaman ini khusus Editor dan Redaktur.</div>;
    }

    // Filter logic
    const targetStatus = role === 'redaktur' ? 'pending_admin' : 'pending_editor';
    const [reviewList, setReviewList] = useState(articles.filter(a => a.status === targetStatus));

    const handleApprove = (id: string) => {
        // In a real app, this would be an API call
        alert(`Berita ID ${id} disetujui! Status akan berubah menjadi ${role === 'redaktur' ? 'published' : 'pending_admin'}.`);

        // Optimistic update for UI demo
        setReviewList(prev => prev.filter(item => item.id !== id));
    };

    const handleReject = (id: string) => {
        const reason = prompt("Masukkan alasan penolakan:");
        if (reason) {
            alert(`Berita ID ${id} ditolak dengan alasan: ${reason}`);
            setReviewList(prev => prev.filter(item => item.id !== id));
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.pageTitle}>
                    {role === 'redaktur' ? 'Final Review (Redaksi)' : 'Editor Review'}
                </h1>
            </div>

            <div className={styles.tableCard}>
                {reviewList.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                        <FileText size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
                        <p>Tidak ada berita yang perlu direview saat ini.</p>
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Judul Berita</th>
                                <th>Penulis</th>
                                <th>Kategori</th>
                                <th>Tanggal Masuk</th>
                                <th style={{ textAlign: 'center' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviewList.map(article => (
                                <tr key={article.id}>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{article.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{article.excerpt.substring(0, 60)}...</div>
                                    </td>
                                    <td>{article.author}</td>
                                    <td>{article.category}</td>
                                    <td>{article.date}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                            <Link href={`/admin/preview/${article.id}`} className="btn-icon" title="Lihat Preview">
                                                <Eye size={18} color="#0070f3" />
                                            </Link>
                                            <button
                                                onClick={() => handleApprove(article.id)}
                                                className="btn-icon"
                                                title={role === 'redaktur' ? 'Publish' : 'Setuju & Teruskan'}
                                                style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                                            >
                                                <Check size={18} color="#047857" />
                                            </button>
                                            <button
                                                onClick={() => handleReject(article.id)}
                                                className="btn-icon"
                                                title="Tolak / Revisi"
                                                style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                                            >
                                                <X size={18} color="#cc0000" />
                                            </button>
                                        </div>
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
