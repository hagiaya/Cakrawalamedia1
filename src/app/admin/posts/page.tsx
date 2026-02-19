'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/Admin.module.css';
import { Eye, Edit, Trash2, Loader2, Search } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

// Define Interface for Article
interface Article {
    id: string;
    title: string;
    author: string;
    category: string;
    status: string;
    date: string;
    created_at: string;
}

export default function AllPosts() {
    const { role } = useAuth();
    const [posts, setPosts] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'published', 'pending'
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
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

            // Remove from local state
            setPosts(prev => prev.filter(post => post.id !== id));
            alert('Berita berhasil dihapus.');
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Gagal menghapus berita.');
        }
    };

    // Filter Logic
    const filteredPosts = posts.filter(post => {
        const matchesFilter = filter === 'all'
            ? true
            : filter === 'published'
                ? post.status === 'published'
                : post.status !== 'published'; // Pending includes draft, pending_editor, pending_admin

        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.author?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.pageTitle}>Semua Berita</h1>
                <Link href="/admin/create" className="btn btn-primary" style={{ padding: '10px 20px', textDecoration: 'none', background: 'var(--primary-red)', color: 'white', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    + Tulis Baru
                </Link>
            </div>

            <div className={styles.tableCard}>
                {/* Filters & Search */}
                <div className={styles.tableHeader} style={{ flexWrap: 'wrap', gap: '15px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => setFilter('all')}
                            style={{
                                padding: '6px 16px',
                                background: filter === 'all' ? '#333' : '#f4f4f5',
                                color: filter === 'all' ? 'white' : '#333',
                                borderRadius: '6px',
                                border: 'none',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            Semua
                        </button>
                        <button
                            onClick={() => setFilter('published')}
                            style={{
                                padding: '6px 16px',
                                background: filter === 'published' ? '#22c55e' : 'white',
                                color: filter === 'published' ? 'white' : '#333',
                                borderRadius: '6px',
                                border: filter === 'published' ? 'none' : '1px solid #e4e4e7',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            Published
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            style={{
                                padding: '6px 16px',
                                background: filter === 'pending' ? '#eab308' : 'white',
                                color: filter === 'pending' ? 'white' : '#333',
                                borderRadius: '6px',
                                border: filter === 'pending' ? 'none' : '1px solid #e4e4e7',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            Pending
                        </button>
                    </div>

                    <div style={{ position: 'relative', minWidth: '250px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input
                            type="text"
                            placeholder="Cari judul atau penulis..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px 10px 8px 35px',
                                borderRadius: '6px',
                                border: '1px solid #e4e4e7',
                                outline: 'none',
                                fontSize: '0.9rem'
                            }}
                        />
                    </div>
                </div>

                {/* Table Content */}
                {loading ? (
                    <div style={{ padding: '50px', textAlign: 'center', color: '#6b7280' }}>
                        <Loader2 size={30} className="spin-animation" style={{ margin: '0 auto 10px' }} />
                        <p>Memuat data berita...</p>
                        <style jsx>{`
                            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                            .spin-animation { animation: spin 1s linear infinite; }
                        `}</style>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
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
                                {filteredPosts.length > 0 ? (
                                    filteredPosts.map(post => (
                                        <tr key={post.id} className={styles.tableRow}>
                                            <td>
                                                <div style={{ fontWeight: 600, color: '#1f2937' }}>{post.title}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>ID: {post.id.substring(0, 8)}...</div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                                        {post.author?.charAt(0) || '?'}
                                                    </div>
                                                    {post.author || 'Anonim'}
                                                </div>
                                            </td>
                                            <td>
                                                <span style={{ padding: '2px 8px', background: '#f3f4f6', borderRadius: '12px', fontSize: '0.8rem', color: '#4b5563' }}>
                                                    {post.category}
                                                </span>
                                            </td>
                                            <td>
                                                <StatusBadge status={post.status} />
                                            </td>
                                            <td style={{ fontSize: '0.9rem', color: '#4b5563' }}>
                                                {post.date || new Date(post.created_at).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <Link href={`/news/${post.id}`} target="_blank" title="View Article">
                                                        <div style={{ padding: '6px', borderRadius: '4px', background: '#eff6ff', color: '#3b82f6', cursor: 'pointer' }}>
                                                            <Eye size={16} />
                                                        </div>
                                                    </Link>
                                                    {(role === 'redaktur' || role === 'editor' || role === 'wartawan') && (
                                                        <Link href={`/admin/edit/${post.id}`} title="Edit Article">
                                                            <div style={{ padding: '6px', borderRadius: '4px', background: '#f0fdf4', color: '#22c55e', cursor: 'pointer' }}>
                                                                <Edit size={16} />
                                                            </div>
                                                        </Link>
                                                    )}
                                                    {(role === 'redaktur' || role === 'editor') && (
                                                        <button
                                                            onClick={() => handleDelete(post.id, post.title)}
                                                            title="Delete Article"
                                                            style={{ padding: '6px', borderRadius: '4px', background: '#fef2f2', color: '#ef4444', border: 'none', cursor: 'pointer' }}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                                            Tidak ada berita yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper Component for Status Badge
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
