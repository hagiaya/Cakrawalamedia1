'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/Footer.module.css';

const Footer = () => {
    return (
        <footer>
            <div className={styles.footer}>
                <div className={`container ${styles.footerContainer}`}>

                    <div className={styles.column}>
                        <div className={styles.footerLogo} style={{ display: 'flex', alignItems: 'center' }}>
                            <Image src="/logo-cm.png" alt="Cakrawala Media" width={40} height={40} style={{ marginRight: '10px' }} />
                            <div>
                                CAKRAWALA<span>MEDIA</span>
                            </div>
                        </div>
                        <p className={styles.footerDesc}>
                            Portal berita terpercaya yang menyajikan informasi terkini dan akurat dari seluruh penjuru nusantara dan dunia.
                        </p>
                        <p style={{ marginTop: '20px', color: '#666', fontSize: '0.8rem' }}>
                            Alamat: Gedung Pers, Jl. Kebon Sirih, Jakarta Pusat
                        </p>
                    </div>

                    <div className={styles.column}>
                        <h3 className={styles.heading}>Kategori</h3>
                        <div className={styles.links}>
                            <Link href="/news/nasional">Nasional</Link>
                            <Link href="/news/pemerintahan">Pemerintahan</Link>
                            <Link href="/news/hukum">Hukum</Link>
                            <Link href="/news/bisnis">Bisnis & Ekonomi</Link>
                            <Link href="/news/internasional">Internasional</Link>
                        </div>
                    </div>

                    <div className={styles.column}>
                        <h3 className={styles.heading}>Newsletter</h3>
                        <p className={styles.footerDesc}>
                            Dapatkan berita terbaru langsung di inbox email Anda.
                        </p>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder="Email Anda" className={styles.newsletterInput} />
                            <button className={styles.newsletterBtn}>Langganan</button>
                        </form>
                    </div>

                </div>
            </div>

            <div className={styles.bottomBar}>
                <div className={`container ${styles.bottomContainer}`}>
                    <div>&copy; {new Date().getFullYear()} WebCakrawala. All rights reserved.</div>
                    <div>
                        <Link href="#" style={{ marginRight: '15px' }}>Privacy Policy</Link>
                        <Link href="#">Terms of Use</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
