'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from '@/styles/Admin.module.css';
import {
    LayoutDashboard, FileText, Users, Settings,
    PenTool, CheckSquare, LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { role, user, setRole, loading, signOut } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: '#f4f6f8',
                color: '#666'
            }}>
                Wait a moment...
            </div>
        );
    }

    if (role === 'guest') {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: '#f4f6f8',
                flexDirection: 'column'
            }}>
                <h1 style={{ marginBottom: '20px', color: '#333' }}>Akses Ditolak</h1>
                <p style={{ marginBottom: '30px', color: '#666' }}>Anda harus login sebagai Admin atau Wartawan.</p>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <button onClick={() => router.push('/')} className="style-btn-primary" style={{ padding: '10px 20px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Kembali ke Home</button>
                    <button onClick={() => router.push('/login')} className="style-btn-secondary" style={{ padding: '10px 20px', background: '#cc0000', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Login</button>
                </div>
            </div>
        );
    }

    const isActive = (path: string) => pathname === path ? styles.menuItemActive : '';

    return (
        <div className={styles.adminLayout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.header}>
                    <div className={styles.logo} style={{ paddingLeft: '20px' }}>
                        WEB<span>ADMIN</span>
                    </div>
                </div>

                <nav className={styles.menu}>
                    <div className={styles.menuLabel}>Menu Utama</div>

                    <Link href="/admin" className={`${styles.menuItem} ${isActive('/admin')}`}>
                        <LayoutDashboard size={18} style={{ marginRight: '10px' }} /> Dashboard
                    </Link>

                    {/* Redaktur & Editor Menu */}
                    {(role === 'redaktur' || role === 'editor') && (
                        <>
                            <div className={styles.menuLabel} style={{ marginTop: '20px' }}>Redaksi</div>
                            <Link href="/admin/posts" className={`${styles.menuItem} ${isActive('/admin/posts')}`}>
                                <FileText size={18} style={{ marginRight: '10px' }} /> Semua Berita
                            </Link>
                            <Link href="/admin/review" className={`${styles.menuItem} ${isActive('/admin/review')}`}>
                                <CheckSquare size={18} style={{ marginRight: '10px' }} /> Perlu Review
                            </Link>
                        </>
                    )}

                    {/* Wartawan Menu */}
                    {(role === 'wartawan' || role === 'redaktur') && (
                        <>
                            <div className={styles.menuLabel} style={{ marginTop: '20px' }}>Kontribusi</div>
                            <Link href="/admin/create" className={`${styles.menuItem} ${isActive('/admin/create')}`}>
                                <PenTool size={18} style={{ marginRight: '10px' }} /> Tulis Berita
                            </Link>
                            <Link href="/admin/my-posts" className={`${styles.menuItem} ${isActive('/admin/my-posts')}`}>
                                <FileText size={18} style={{ marginRight: '10px' }} /> Berita Saya
                            </Link>
                        </>
                    )}

                    {/* Redaktur Only */}
                    {role === 'redaktur' && (
                        <>
                            <div className={styles.menuLabel} style={{ marginTop: '20px' }}>Admin</div>
                            <Link href="/admin/users" className={`${styles.menuItem} ${isActive('/admin/users')}`}>
                                <Users size={18} style={{ marginRight: '10px' }} /> Pengguna
                            </Link>
                            <Link href="/admin/settings" className={`${styles.menuItem} ${isActive('/admin/settings')}`}>
                                <Settings size={18} style={{ marginRight: '10px' }} /> Pengaturan
                            </Link>
                        </>
                    )}

                </nav>

                <div className={styles.userProfile}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'capitalize' }}>{role}</div>
                    </div>
                    <button
                        onClick={signOut}
                        className={styles.menuItem}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '5px' }}
                        title="Logout"
                    >
                        <LogOut size={18} color="#cc0000" />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
