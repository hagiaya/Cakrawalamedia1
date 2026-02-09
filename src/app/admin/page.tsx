'use client';

import { useAuth } from '@/context/AuthContext';
import styles from '@/styles/Admin.module.css';
import { articles } from '@/lib/data';
import Link from 'next/link';

export default function AdminDashboard() {
    const { user, role } = useAuth();

    // Calculate stats based on role
    const totalPublished = articles.filter(a => a.status === 'published').length;
    const pendingReview = articles.filter(a => a.status === 'pending_editor').length;
    const pendingAdmin = articles.filter(a => a.status === 'pending_admin').length;

    // My Posts Stats (Simulated)
    const myDrafts = articles.filter(a => a.status === 'draft' && a.author.includes(role === 'wartawan' ? 'Wartawan' : '')).length;
    const myPublished = articles.filter(a => a.status === 'published' && a.author.includes(role === 'wartawan' ? 'Wartawan' : '')).length;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.pageTitle}>Dashboard Overview ({role})</h1>
                {(role === 'wartawan' || role === 'redaktur') && (
                    <Link href="/admin/create" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem', color: 'white', textDecoration: 'none', background: 'var(--primary-red)', borderRadius: '4px' }}>
                        + Tulis Berita
                    </Link>
                )}
            </div>

            <div className={styles.statsGrid}>
                {role === 'redaktur' && (
                    <>
                        <div className={styles.statCard}>
                            <span className={styles.statLabel}>Total Berita Published</span>
                            <span className={styles.statValue}>{totalPublished}</span>
                            <span style={{ color: '#047857', fontSize: '0.8rem', fontWeight: 600 }}>+12% bulan ini</span>
                        </div>
                        <div className={styles.statCard} style={{ borderLeft: '4px solid #f59e0b' }}>
                            <span className={styles.statLabel}>Perlu Persetujuan (Admin)</span>
                            <span className={styles.statValue}>{pendingAdmin}</span>
                            <span style={{ color: '#b45309', fontSize: '0.8rem', fontWeight: 600 }}>Segera Review</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statLabel}>Menunggu Editor</span>
                            <span className={styles.statValue}>{pendingReview}</span>
                            <span style={{ color: '#666', fontSize: '0.8rem' }}>Dalam proses edit</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statLabel}>Total Trafik</span>
                            <span className={styles.statValue}>8,492</span>
                            <span style={{ color: '#047857', fontSize: '0.8rem', fontWeight: 600 }}>+5% dari kemarin</span>
                        </div>
                    </>
                )}

                {role === 'editor' && (
                    <>
                        <div className={styles.statCard} style={{ borderLeft: '4px solid #f59e0b' }}>
                            <span className={styles.statLabel}>Artikel Masuk (Perlu Review)</span>
                            <span className={styles.statValue}>{pendingReview}</span>
                            <span style={{ color: '#b45309', fontSize: '0.8rem', fontWeight: 600 }}>Dari Wartawan</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statLabel}>Sudah Diteruskan ke Admin</span>
                            <span className={styles.statValue}>{pendingAdmin}</span>
                            <span style={{ color: '#047857', fontSize: '0.8rem' }}>Menunggu ACC Redaktur</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statLabel}>Total Published</span>
                            <span className={styles.statValue}>{totalPublished}</span>
                            <span style={{ color: '#666', fontSize: '0.8rem' }}>Semua Kategori</span>
                        </div>
                    </>
                )}

                {role === 'wartawan' && (
                    <>
                        <div className={styles.statCard}>
                            <span className={styles.statLabel}>Berita Saya (Published)</span>
                            <span className={styles.statValue}>{myPublished}</span>
                            <span style={{ color: '#047857', fontSize: '0.8rem', fontWeight: 600 }}>Mantap!</span>
                        </div>
                        <div className={styles.statCard} style={{ borderLeft: '4px solid #6366f1' }}>
                            <span className={styles.statLabel}>Draft Saya</span>
                            <span className={styles.statValue}>{myDrafts}</span>
                            <span style={{ color: '#666', fontSize: '0.8rem' }}>Belum diajukan</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statLabel}>Sedang Direview</span>
                            <span className={styles.statValue}>2</span> {/* Mock for simplicity */}
                            <span style={{ color: '#b45309', fontSize: '0.8rem' }}>Menunggu Editor/Admin</span>
                        </div>
                    </>
                )}
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                        {role === 'wartawan' ? 'Berita Terakhir Saya' : 'Aktivitas Terkini'}
                    </h3>
                    <Link href={role === 'wartawan' ? "/admin/my-posts" : "/admin/posts"} style={{ background: 'none', border: 'none', color: '#cc0000', cursor: 'pointer', fontWeight: 600, textDecoration: 'none' }}>
                        Lihat Semua
                    </Link>
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Judul Berita</th>
                            <th>Kategori</th>
                            <th>Status</th>
                            <th>Tanggal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.slice(0, 5).map((article, idx) => (
                            <tr key={idx}>
                                <td>{article.title}</td>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
