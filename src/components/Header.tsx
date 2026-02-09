'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, User, Menu, Facebook, Twitter, Instagram, Youtube, X } from 'lucide-react';
import styles from '@/styles/Header.module.css';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { CMLogo } from './Logo';
import ThemeToggle from './ThemeToggle';
import { useRouter } from 'next/navigation';

const Header = () => {
    const { role, setRole, user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();

    const formattedDate = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
        }
    };

    return (
        <header>
            {/* Top Bar */}
            <div className={styles.topBar}>
                <div className={`container ${styles.topBarContainer}`}>
                    <div>{formattedDate}</div>
                    <div className={styles.topBarLinks}>
                        <Link href="#">Karir</Link>
                        <Link href="#">Kontak</Link>

                        <div style={{ marginLeft: '15px', borderLeft: '1px solid #444', paddingLeft: '15px', display: 'flex', alignItems: 'center' }}>
                            <ThemeToggle />
                        </div>

                        {/* Role Switcher for Demo */}
                        <span style={{ marginLeft: '20px', color: '#888', borderLeft: '1px solid #444', paddingLeft: '10px', display: 'flex', alignItems: 'center' }}>
                            Mode:
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value as any)}
                                style={{ background: '#333', color: '#fff', border: 'none', marginLeft: '5px', padding: '2px' }}
                            >
                                <option value="guest">Pengunjung</option>
                                <option value="redaktur">Redaktur</option>
                                <option value="editor">Admin Editorial</option>
                                <option value="wartawan">Wartawan</option>
                            </select>
                        </span>

                        {user && (
                            <span style={{ marginLeft: '10px' }}>
                                <User size={14} style={{ display: 'inline', marginRight: '5px' }} />
                                {user.name}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Logo Area */}
            <div className={styles.logoArea}>
                <div className={`container ${styles.logoAreaContainer}`}>
                    <div className={styles.logo} style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ marginRight: '15px' }}>
                            <CMLogo width={60} height={60} color="white" />
                        </div>
                        <div>
                            CAKRAWALA<span>MEDIA</span>
                        </div>
                    </div>
                    <div className={styles.adSpace}>
                        Space Iklan (728x90)
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className={styles.navBar}>
                <div className={`container ${styles.navContainer}`}>
                    {/* Mobile Menu Button */}
                    <button className={styles.mobileMenuBtn} onClick={() => setIsMobileMenuOpen(true)}>
                        <Menu size={24} />
                    </button>

                    <div className={styles.navLinks}>
                        <Link href="/" className={`${styles.navItem} ${styles.active}`}>Home</Link>
                        <Link href="/news/nasional" className={styles.navItem}>Nasional</Link>
                        <Link href="/news/pemerintahan" className={styles.navItem}>Pemerintahan</Link>
                        <Link href="/news/hukum" className={styles.navItem}>Hukum</Link>
                        <Link href="/news/bisnis" className={styles.navItem}>Bisnis</Link>
                        <Link href="/news/internasional" className={styles.navItem}>Internasional</Link>

                        {role !== 'guest' && (
                            <Link href="/admin" className={styles.navItem} style={{ color: 'var(--primary-red)' }}>
                                Dashboard
                            </Link>
                        )}
                    </div>

                    <div className={styles.searchContainer} style={{ display: 'flex', alignItems: 'center' }}>
                        {isSearchOpen ? (
                            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    placeholder="Cari berita..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        padding: '5px 10px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        marginRight: '5px',
                                        outline: 'none',
                                        fontFamily: 'var(--font-body)',
                                        width: '150px'
                                    }}
                                    autoFocus
                                />
                                <button type="submit" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--primary-red)' }}>
                                    <Search size={20} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsSearchOpen(false)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        marginLeft: '5px',
                                        fontSize: '1.2rem',
                                        color: '#888'
                                    }}
                                >
                                    &times;
                                </button>
                            </form>
                        ) : (
                            <div className={styles.searchIcon} onClick={() => setIsSearchOpen(true)}>
                                <Search size={20} />
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Nav Drawer */}
            <div className={`${styles.mobileNav} ${isMobileMenuOpen ? styles.open : ''}`}>
                <div className={styles.mobileNavHeader}>
                    <div className={styles.logo} style={{ color: 'var(--text-black)' }}>
                        CAKRAWALA<span style={{ color: 'var(--primary-red)' }}>MEDIA</span>
                    </div>
                    <button className={styles.mobileMenuBtn} onClick={() => setIsMobileMenuOpen(false)}>
                        <X size={24} />
                    </button>
                </div>
                <div className={styles.mobileNavLinks}>
                    <Link href="/" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                    <Link href="/news/nasional" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Nasional</Link>
                    <Link href="/news/pemerintahan" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Pemerintahan</Link>
                    <Link href="/news/hukum" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Hukum</Link>
                    <Link href="/news/bisnis" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Bisnis</Link>
                    <Link href="/news/internasional" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Internasional</Link>
                    {role !== 'guest' && (
                        <Link href="/admin" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--primary-red)' }}>Dashboard</Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
