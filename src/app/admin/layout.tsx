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
    const { role, user, setRole } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

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
                <button onClick={() => router.push('/')} className="btn btn-primary">Kembali ke Home</button>
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

                    {/* Role Switcher (Dev Only) */}
                    <div className={styles.menuLabel} style={{ marginTop: '20px', color: '#cc0000' }}>Dev Mode: Switch Role</div>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        <button onClick={() => setRole('redaktur')} style={{ fontSize: '0.7rem', padding: '5px', cursor: 'pointer', background: role === 'redaktur' ? '#cc0000' : '#eee', color: role === 'redaktur' ? 'white' : '#333', border: 'none', borderRadius: '4px' }}>Redaksi</button>
                        <button onClick={() => setRole('editor')} style={{ fontSize: '0.7rem', padding: '5px', cursor: 'pointer', background: role === 'editor' ? '#cc0000' : '#eee', color: role === 'editor' ? 'white' : '#333', border: 'none', borderRadius: '4px' }}>Editor</button>
                        <button onClick={() => setRole('wartawan')} style={{ fontSize: '0.7rem', padding: '5px', cursor: 'pointer', background: role === 'wartawan' ? '#cc0000' : '#eee', color: role === 'wartawan' ? 'white' : '#333', border: 'none', borderRadius: '4px' }}>Wartawan</button>
                    </div>
                </nav>

                <div className={styles.userProfile}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'capitalize' }}>{role}</div>
                    </div>
                    <button
                        onClick={() => { setRole('guest'); router.push('/'); }}
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
