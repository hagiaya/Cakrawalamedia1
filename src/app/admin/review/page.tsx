'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from '@/styles/Admin.module.css';
import { Check, X, Eye, FileText, Loader2, Edit } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Article {
    id: string;
    title: string;
    author: string;
    category: string;
    status: string;
    excerpt: string;
    date: string;
    created_at: string;
}

export default function ReviewPage() {
    const { role } = useAuth();
    const router = useRouter();
    const [reviewList, setReviewList] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter logic
    const targetStatus = role === 'redaktur' ? 'pending_admin' : 'pending_editor';

    useEffect(() => {
        if (role !== 'guest') {
            fetchReviewList();
        }
    }, [role]);

    const fetchReviewList = async () => {
        setLoading(true);
        try {
            // Determine status based on role
            // If wartawan, maybe they see their own pending posts? For now stick to Editor/Redaktur flow.
            if (role === 'wartawan') {
                setReviewList([]);
                return;
            }

            const statusToCheck = role === 'redaktur' ? 'pending_admin' : 'pending_editor';

            const { data, error } = await supabase
                .from('news')
                .select('*')
                .eq('status', statusToCheck)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReviewList(data || []);
        } catch (error) {
            console.error('Error fetching review list:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string, title: string) => {
        const nextStatus = role === 'redaktur' ? 'published' : 'pending_admin';
        const actionName = role === 'redaktur' ? 'Publish' : 'Teruskan ke Admin';

        if (!confirm(`Apakah Anda yakin ingin menyetujui "${title}"?\nStatus akan berubah menjadi: ${nextStatus}`)) return;

        try {
            const { error } = await supabase
                .from('news')
                .update({ status: nextStatus })
                .eq('id', id);

            if (error) throw error;

            alert(`Berita berhasil disetujui (${actionName})!`);
            setReviewList(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error approving post:', error);
            alert('Gagal menyetujui berita.');
        }
    };

    const handleReject = async (id: string, title: string) => {
        const reason = prompt(`Masukkan alasan penolakan/revisi untuk "${title}":`);
        if (!reason && reason !== "") return; // Cancelled

        try {
            // We revert to draft. 
            // Ideally we should save the rejection reason somewhere, but for now we just change status.
            // Maybe append [REVISI] to title?

            const { error } = await supabase
                .from('news')
                .update({
                    status: 'draft',
                    // title: `[REVISI] ${title}` // Optional: modifying title might be annoying
                })
                .eq('id', id);

            if (error) throw error;

            alert(`Berita dikembalikan ke Draft.`);
            setReviewList(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error rejecting post:', error);
            alert('Gagal menolak berita.');
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div style={{ padding: '50px', textAlign: 'center', color: '#6b7280' }}>
                    <Loader2 size={30} className="spin-animation" style={{ margin: '0 auto 10px' }} />
                    <p>Memuat daftar review...</p>
                    <style jsx>{`
                        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                        .spin-animation { animation: spin 1s linear infinite; }
                    `}</style>
                </div>
            </div>
        );
    }

    // Redirect if not authorized (after loading)
    if (role === 'wartawan' || role === 'guest') {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.pageTitle}>Akses Ditolak</h1>
                </div>
                <div style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
                    <p>Halaman ini khusus untuk Editor dan Redaktur melakukan review berita.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.pageTitle}>
                    {role === 'redaktur' ? 'Final Review (Redaksi)' : 'Editor Review'}
                </h1>
                <div style={{ fontSize: '0.9rem', color: '#666', background: '#eef2ff', padding: '5px 15px', borderRadius: '20px' }}>
                    {reviewList.length} Berita Menunggu
                </div>
            </div>

            <div className={styles.tableCard}>
                {reviewList.length === 0 ? (
                    <div style={{ padding: '60px 20px', textAlign: 'center', color: '#9ca3af' }}>
                        <div style={{ background: '#f3f4f6', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <Check size={40} color="#10b981" />
                        </div>
                        <h3 style={{ margin: '0 0 10px 0', color: '#374151' }}>Semua Beres!</h3>
                        <p>Tidak ada berita yang perlu direview saat ini.</p>
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ width: '40%' }}>Judul Berita</th>
                                <th>Penulis</th>
                                <th>Kategori</th>
                                <th>Tanggal Masuk</th>
                                <th style={{ minWidth: '150px' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviewList.map(article => (
                                <tr key={article.id}>
                                    <td>
                                        <div style={{ fontWeight: 600, color: '#111827', marginBottom: '5px' }}>{article.title}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.4 }}>
                                            {article.excerpt ? article.excerpt.substring(0, 80) + '...' : 'Tidak ada ringkasan.'}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                {article.author?.charAt(0) || '?'}
                                            </div>
                                            <span style={{ fontWeight: 500 }}>{article.author}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ padding: '2px 10px', background: '#f3f4f6', borderRadius: '12px', fontSize: '0.8rem', color: '#4b5563', fontWeight: 500 }}>
                                            {article.category}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.9rem', color: '#4b5563' }}>
                                        {article.date || new Date(article.created_at).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            <Link href={`/news/${article.id}`} target="_blank" title="Preview Artikel" style={{ textDecoration: 'none' }}>
                                                <button style={{ height: '32px', width: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #d1d5db', background: 'white', borderRadius: '4px', cursor: 'pointer', color: '#6b7280' }}>
                                                    <Eye size={16} />
                                                </button>
                                            </Link>
                                            <Link href={`/admin/edit/${article.id}`} title="Edit / Koreksi" style={{ textDecoration: 'none' }}>
                                                <button style={{ height: '32px', width: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #bfdbfe', background: '#eff6ff', borderRadius: '4px', cursor: 'pointer', color: '#3b82f6' }}>
                                                    <Edit size={16} />
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleApprove(article.id, article.title)}
                                                title={role === 'redaktur' ? 'Publish' : 'Setuju & Teruskan'}
                                                style={{ height: '32px', width: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #bbf7d0', background: '#f0fdf4', borderRadius: '4px', cursor: 'pointer', color: '#16a34a' }}
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleReject(article.id, article.title)}
                                                title="Tolak / Revisi"
                                                style={{ height: '32px', width: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #fecaca', background: '#fef2f2', borderRadius: '4px', cursor: 'pointer', color: '#dc2626' }}
                                            >
                                                <X size={16} />
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
