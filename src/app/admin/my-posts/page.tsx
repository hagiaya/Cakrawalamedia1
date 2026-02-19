'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from '@/styles/Admin.module.css';
import { Edit, Eye, Trash2, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Article {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    status: string;
    date: string;
    created_at: string;
    author_id: string;
}

export default function MyPosts() {
    const { user, role } = useAuth();
    const [myArticles, setMyArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchMyPosts();
        }
    }, [user]);

    const fetchMyPosts = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Fetch posts by author_id
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .eq('author_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMyArticles(data || []);
        } catch (error) {
            console.error('Error fetching my posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus berita "${title}"?`)) return;

        try {
            const { error } = await supabase
                .from('news')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setMyArticles(prev => prev.filter(item => item.id !== id));
            alert('Berita berhasil dihapus.');
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Gagal menghapus berita.');
        }
    };

    if (!user) {
        return (
            <div className={styles.container}>
                <div style={{ padding: '50px', textAlign: 'center', color: '#6b7280' }}>
                    <Loader2 size={30} className="spin-animation" style={{ margin: '0 auto 10px' }} />
                    <p>Memuat data pengguna...</p>
                    <style jsx>{`
                        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                        .spin-animation { animation: spin 1s linear infinite; }
                    `}</style>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.pageTitle}>Berita Saya ({user.name})</h1>
                <Link href="/admin/create" className="btn btn-primary" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', background: 'var(--primary-red)', color: 'white', borderRadius: '4px' }}>
                    <Plus size={16} /> Tulis Baru
                </Link>
            </div>

            <div className={styles.tableCard}>
                {/* Optional Status Filters (Client-side for now) */}
                <div className={styles.tableHeader}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ fontSize: '0.9rem', color: '#666', background: '#f3f4f6', padding: '5px 15px', borderRadius: '4px' }}>
                            Total: <strong>{myArticles.length}</strong> Berita
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '50px', textAlign: 'center', color: '#6b7280' }}>
                        <Loader2 size={30} className="spin-animation" style={{ margin: '0 auto 10px' }} />
                        <p>Memuat berita Anda...</p>
                    </div>
                ) : myArticles.length === 0 ? (
                    <div style={{ padding: '60px 20px', textAlign: 'center', color: '#6b7280' }}>
                        <div style={{ background: '#f3f4f6', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <Edit size={40} color="#9ca3af" />
                        </div>
                        <h3 style={{ margin: '0 0 10px 0', color: '#374151' }}>Belum Ada Berita</h3>
                        <p style={{ marginBottom: '20px' }}>Anda belum menulis berita apapun.</p>
                        <Link href="/admin/create" className="btn btn-primary" style={{ padding: '10px 20px', textDecoration: 'none', background: '#3b82f6', color: 'white', borderRadius: '4px', display: 'inline-block' }}>
                            Mulai Menulis
                        </Link>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
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
                                            <div style={{ fontWeight: 600, color: '#1f2937' }}>{article.title}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '4px' }}>
                                                {article.excerpt ? article.excerpt.substring(0, 60) + '...' : 'Tidak ada ringkasan.'}
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ padding: '2px 10px', background: '#f3f4f6', borderRadius: '12px', fontSize: '0.8rem', color: '#4b5563' }}>
                                                {article.category}
                                            </span>
                                        </td>
                                        <td>
                                            <StatusBadge status={article.status} />
                                        </td>
                                        <td style={{ fontSize: '0.9rem', color: '#4b5563' }}>
                                            {article.date || new Date(article.created_at).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <Link href={`/news/${article.id}`} target="_blank" title="View" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                                                    <div style={{ padding: '6px', borderRadius: '4px', background: '#eff6ff', color: '#3b82f6', cursor: 'pointer' }}>
                                                        <Eye size={16} />
                                                    </div>
                                                </Link>
                                                <Link href={`/admin/edit/${article.id}`} title="Edit" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                                                    <div style={{ padding: '6px', borderRadius: '4px', background: '#f0fdf4', color: '#22c55e', cursor: 'pointer' }}>
                                                        <Edit size={16} />
                                                    </div>
                                                </Link>
                                                <button title="Delete" style={{ border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => handleDelete(article.id, article.title)}>
                                                    <div style={{ padding: '6px', borderRadius: '4px', background: '#fef2f2', color: '#ef4444', border: 'none', cursor: 'pointer' }}>
                                                        <Trash2 size={16} />
                                                    </div>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    let bgColor = '#e5e7eb';
    let textColor = '#374151';
    let label = status;

    switch (status) {
        case 'published':
            bgColor = '#dcfce7';
            textColor = '#166534';
            label = 'Published';
            break;
        case 'draft':
            bgColor = '#f3f4f6';
            textColor = '#4b5563';
            label = 'Draft';
            break;
        case 'pending_editor':
            bgColor = '#fef9c3';
            textColor = '#854d0e';
            label = 'Review Editor';
            break;
        case 'pending_admin':
            bgColor = '#ffedd5';
            textColor = '#9a3412';
            label = 'Review Admin';
            break;
        case 'rejected':
            bgColor = '#fee2e2';
            textColor = '#991b1b';
            label = 'Ditolak/Revisi';
            break;
    }

    return (
        <span style={{
            padding: '4px 10px',
            background: bgColor,
            color: textColor,
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 600,
            display: 'inline-block',
            textTransform: 'capitalize'
        }}>
            {label}
        </span>
    );
}
