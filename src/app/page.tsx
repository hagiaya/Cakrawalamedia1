'use client';

import Image from 'next/image';
import Link from 'next/link';
// import { articles } from '@/lib/data'; // Remove static data
import styles from '@/styles/Home.module.css';
import cardStyles from '@/styles/Card.module.css';
import { Facebook, Twitter, Instagram, Youtube, User, Calendar, Clock, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import AdPlaceholder from '@/components/AdPlaceholder';
import { supabase } from '@/lib/supabase';

// Define Interface
interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  date: string;
  views: number;
  status: string;
  created_at: string;
  published_at: string;
}

export default function Home() {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Sidebar Tab State
  const [activeTab, setActiveTab] = useState<'popular' | 'recent'>('popular');

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const formattedData = data.map((item: any) => ({
            ...item,
            date: item.published_at
              ? new Date(item.published_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
              : new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
          }));
          setNews(formattedData);
        }
      } catch (err) {
        console.error('Error fetching home news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '15px' }}>
        <Loader2 size={48} className="spin-animation" style={{ color: 'var(--primary-red)' }} />
        <p style={{ color: '#666' }}>Memuat Berita Terkini...</p>
        <style jsx>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .spin-animation { animation: spin 1s linear infinite; }
            `}</style>
      </div>
    );
  }

  // Distribute Data
  // Ensure we have at least some data to avoid crashes, though normally logic handles undefined gracefully
  const featured = news[0] || null;
  const sideHero = news.slice(1, 3);
  const featuredSection = news.slice(3, 5);
  const latest = news.slice(5);

  // Filter articles by category
  const governmentNews = news.filter(a => a.category === 'Pemerintahan').slice(0, 3);
  const lawNews = news.filter(a => a.category === 'Hukum').slice(0, 3);
  const nationalNews = news.filter(a => a.category === 'Nasional').slice(0, 3);

  // Sidebar Data
  // Create a copy for sorting to avoid mutating state directly in a way that affects other views if we were using same reference
  const popularNews = [...news].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
  const recentSidebar = news.slice(0, 5);

  return (
    <main>
      {/* Ticker Section */}
      <div className={styles.tickerSection}>
        <div className={`container ${styles.tickerContainer}`}>
          <div className={styles.tickerLabel}>Trending News</div>
          <div className={styles.tickerContent}>
            <div className={styles.tickerTrack}>
              {news.slice(0, 5).map(a => (
                <span key={a.id} style={{ marginRight: '30px' }}>
                  <span style={{ color: '#cc0000' }}>■</span> {a.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={`container ${styles.heroGrid}`}>

          {/* Main Featured Article (Left) */}
          {featured ? (
            <Link href={`/news/${featured.id}`} className={styles.featuredCard}>
              <Image
                src={featured.image || 'https://placehold.co/800x600?text=No+Image'}
                alt={featured.title}
                fill
                className={styles.featuredImage}
                priority
              />
              <div className={styles.featuredOverlay}></div>
              <div className={styles.featuredContent}>
                <span className={styles.heroCategory}>{featured.category}</span>
                <h2 className={styles.featuredTitle}>{featured.title}</h2>
                <div className={styles.featuredMeta}>
                  <span style={{ marginRight: '15px' }}><User size={14} style={{ marginRight: '5px' }} /> {featured.author}</span>
                  <span><Calendar size={14} style={{ marginRight: '5px' }} /> {featured.date}</span>
                </div>
              </div>
            </Link>
          ) : (
            <div className={styles.featuredCard} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eee' }}>
              <p>Belum ada berita utama.</p>
            </div>
          )}

          {/* Side Hero Articles (Right) */}
          <div className={styles.sideColumn}>
            {sideHero.map(article => (
              <Link href={`/news/${article.id}`} key={article.id} className={cardStyles.card} style={{ flex: 1 }}>
                <div className={cardStyles.imageWrapper}>
                  <Image
                    src={article.image || 'https://placehold.co/600x400?text=No+Image'}
                    alt={article.title}
                    fill
                    className={cardStyles.image}
                  />
                  <div className={cardStyles.categoryBadge}>{article.category}</div>
                </div>
                <div className={cardStyles.content} style={{ padding: '0 5px' }}>
                  <h3 className={cardStyles.title} style={{ fontSize: '1.1rem' }}>{article.title}</h3>
                  <div className={cardStyles.meta}>
                    <span><Clock size={12} style={{ marginRight: '4px' }} /> {article.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <section className={`container ${styles.mainContent}`}>

        {/* Left Column: News Feed */}
        <div className={styles.newsFeed}>

          {/* Featured Section (New) */}
          <div className={styles.sectionHeader} style={{ marginBottom: '30px' }}>
            <h3 className={styles.sectionTitle}>Featured</h3>
          </div>

          <div className={styles.featuredHighlightRow}>
            {featuredSection.map(article => (
              <div key={article.id} className={cardStyles.card}>
                <div className={cardStyles.imageWrapper}>
                  <Image
                    src={article.image || 'https://placehold.co/600x400?text=No+Image'}
                    alt={article.title}
                    fill
                    className={cardStyles.image}
                  />
                  <div className={cardStyles.categoryBadge}>{article.category}</div>
                </div>
                <div className={cardStyles.content}>
                  <div className={cardStyles.meta} style={{ color: '#cc0000', fontWeight: 'bold' }}>
                    <span style={{ marginRight: '10px' }}>By {article.author}</span>
                    <span style={{ color: '#888' }}>{article.date}</span>
                  </div>
                  <h3 className={cardStyles.title} style={{ fontSize: '1.5rem', marginBottom: '15px' }}>
                    <Link href={`/news/${article.id}`}>{article.title}</Link>
                  </h3>
                  <p className={cardStyles.excerpt} style={{ marginBottom: '20px' }}>{article.excerpt ? article.excerpt.substring(0, 100) + '...' : ''}</p>
                  <Link href={`/news/${article.id}`} className="btn btn-outline" style={{ display: 'inline-block', padding: '8px 20px', fontSize: '0.8rem' }}>
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Category Columns (New) */}
          <div className={styles.categoryGrid}>

            {/* Government Column */}
            <div>
              <div className={styles.sectionHeader} style={{ marginBottom: '20px' }}>
                <h3 className={styles.sectionTitle}>Pemerintahan</h3>
              </div>
              {governmentNews.length > 0 ? governmentNews.map((article, idx) => (
                <div key={article.id} style={{ marginBottom: '20px' }}>
                  {idx === 0 ? (
                    <Link href={`/news/${article.id}`} className={cardStyles.card}>
                      <div className={cardStyles.imageWrapper} style={{ aspectRatio: '4/3' }}>
                        <Image src={article.image || 'https://placehold.co/600x400?text=No+Image'} alt={article.title} fill className={cardStyles.image} />
                      </div>
                      <h4 className={cardStyles.title} style={{ fontSize: '1rem' }}>{article.title}</h4>
                    </Link>
                  ) : (
                    <Link href={`/news/${article.id}`} className={styles.smallNewsItem}>
                      <div className={styles.smallNewsImage}>
                        <Image src={article.image || 'https://placehold.co/100x100?text=No+Image'} alt={article.title} fill style={{ objectFit: 'cover' }} />
                      </div>
                      <h4 className={styles.smallNewsTitle}>{article.title}</h4>
                    </Link>
                  )}
                </div>
              )) : <p style={{ fontSize: '0.8rem', color: '#888' }}>Belum ada berita pemerintahan.</p>}
            </div>

            {/* Law Column */}
            <div>
              <div className={styles.sectionHeader} style={{ marginBottom: '20px' }}>
                <h3 className={styles.sectionTitle}>Hukum</h3>
              </div>
              {lawNews.length > 0 ? lawNews.map((article, idx) => (
                <div key={article.id} style={{ marginBottom: '20px' }}>
                  {idx === 0 ? (
                    <Link href={`/news/${article.id}`} className={cardStyles.card}>
                      <div className={cardStyles.imageWrapper} style={{ aspectRatio: '4/3' }}>
                        <Image src={article.image || 'https://placehold.co/600x400?text=No+Image'} alt={article.title} fill className={cardStyles.image} />
                      </div>
                      <h4 className={cardStyles.title} style={{ fontSize: '1rem' }}>{article.title}</h4>
                    </Link>
                  ) : (
                    <Link href={`/news/${article.id}`} className={styles.smallNewsItem}>
                      <div className={styles.smallNewsImage}>
                        <Image src={article.image || 'https://placehold.co/100x100?text=No+Image'} alt={article.title} fill style={{ objectFit: 'cover' }} />
                      </div>
                      <h4 className={styles.smallNewsTitle}>{article.title}</h4>
                    </Link>
                  )}
                </div>
              )) : <p style={{ fontSize: '0.8rem', color: '#888' }}>Belum ada berita hukum.</p>}
            </div>

            {/* National Column */}
            <div>
              <div className={styles.sectionHeader} style={{ marginBottom: '20px' }}>
                <h3 className={styles.sectionTitle}>Nasional</h3>
              </div>
              {nationalNews.length > 0 ? nationalNews.map((article, idx) => (
                <div key={article.id} style={{ marginBottom: '20px' }}>
                  {idx === 0 ? (
                    <Link href={`/news/${article.id}`} className={cardStyles.card}>
                      <div className={cardStyles.imageWrapper} style={{ aspectRatio: '4/3' }}>
                        <Image src={article.image || 'https://placehold.co/600x400?text=No+Image'} alt={article.title} fill className={cardStyles.image} />
                      </div>
                      <h4 className={cardStyles.title} style={{ fontSize: '1rem' }}>{article.title}</h4>
                    </Link>
                  ) : (
                    <Link href={`/news/${article.id}`} className={styles.smallNewsItem}>
                      <div className={styles.smallNewsImage}>
                        <Image src={article.image || 'https://placehold.co/100x100?text=No+Image'} alt={article.title} fill style={{ objectFit: 'cover' }} />
                      </div>
                      <h4 className={styles.smallNewsTitle}>{article.title}</h4>
                    </Link>
                  )}
                </div>
              )) : <p style={{ fontSize: '0.8rem', color: '#888' }}>Belum ada berita nasional.</p>}
            </div>

          </div>

          {/* Mid Content Ad */}
          <AdPlaceholder label="Mid Banner" width="100%" height={90} style={{ margin: '30px 0' }} />

          {/* Latest News */}
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Berita Terbaru</h3>
          </div>

          <div className={styles.latestNewsGrid}>
            {latest.map(article => (
              <div key={article.id} className={cardStyles.cardHorizontal}>
                <Link href={`/news/${article.id}`} className={cardStyles.imageWrapper}>
                  <Image
                    src={article.image || 'https://placehold.co/600x400?text=No+Image'}
                    alt={article.title}
                    fill
                    className={cardStyles.image}
                  />
                </Link>
                <div style={{ flex: 1 }}>
                  <Link href={`/news/${article.id}`}>
                    <h3 className={cardStyles.title}>{article.title}</h3>
                  </Link>
                  <div className={cardStyles.meta}>
                    <span style={{ color: 'var(--primary-red)', marginRight: '10px' }}>{article.category}</span>
                    <span>{article.date}</span>
                  </div>
                  <p className={cardStyles.excerpt}>{article.excerpt ? article.excerpt.substring(0, 100) + '...' : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <aside className={styles.sidebar}>

          {/* Social Widget */}
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Stay Connected</h3>
          </div>
          <div className={styles.socialWidget}>
            <Link href="#" className={`${styles.socialBtn} ${styles.socialFb}`}>
              <div className={styles.socialIconBox}><Facebook size={20} /></div>
              <div className={styles.socialCount}>19,243 Fans</div>
              <div className={styles.socialAction}>Like</div>
            </Link>
            <Link href="#" className={`${styles.socialBtn} ${styles.socialTw}`}>
              <div className={styles.socialIconBox}><Twitter size={20} /></div>
              <div className={styles.socialCount}>2,076 Followers</div>
              <div className={styles.socialAction}>Follow</div>
            </Link>
            <Link href="#" className={`${styles.socialBtn} ${styles.socialYt}`}>
              <div className={styles.socialIconBox}><Youtube size={20} /></div>
              <div className={styles.socialCount}>15,200 Subscribers</div>
              <div className={styles.socialAction}>Subscribe</div>
            </Link>
          </div>

          {/* Sidebar Top Ad */}
          <AdPlaceholder width="100%" height={250} style={{ marginBottom: '30px' }} />

          {/* Tabbed Widget (Popular/Recent) */}
          <div className="tab-widget" style={{ marginBottom: '30px' }}>
            <div className={styles.tabHeader}>
              <button
                onClick={() => setActiveTab('popular')}
                className={`${styles.tabButton} ${activeTab === 'popular' ? styles.tabButtonActive : ''}`}
              >
                Popular
              </button>
              <button
                onClick={() => setActiveTab('recent')}
                className={`${styles.tabButton} ${activeTab === 'recent' ? styles.tabButtonActive : ''}`}
              >
                Recent
              </button>
            </div>

            <div className="tab-content">
              {(activeTab === 'popular' ? popularNews : recentSidebar).map((article, idx) => (
                <div key={idx} className={styles.tabItem}>
                  <div className={styles.tabImageWrapper}>
                    <Image src={article.image || 'https://placehold.co/100x100?text=No+Image'} alt={article.title} fill style={{ objectFit: 'cover' }} />
                    <div className={styles.tabRank}>
                      {idx + 1}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 className={styles.tabTitle}>
                      <Link href={`/news/${article.id}`}>{article.title}</Link>
                    </h4>
                    <span className={styles.tabMeta}>{article.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter Widget */}
          <div className={styles.sectionHeader} style={{ marginTop: '30px' }}>
            <h3 className={styles.sectionTitle}>Newsletter</h3>
          </div>
          <div className={styles.newsletterWidget}>
            <h3 className={styles.newsletterTitle}>The most important world news and events of the day.</h3>
            <p className={styles.newsletterDesc}>Get webcakrawala daily newsletter on your inbox.</p>
            <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email address" className={styles.newsletterInput} />
              <button className={styles.newsletterBtn}>Sign Up</button>
            </form>
          </div>

          {/* Video Widget */}
          <div className={styles.sectionHeader} style={{ marginTop: '30px' }}>
            <h3 className={styles.sectionTitle}>Video Pilihan</h3>
          </div>
          <div style={{ marginBottom: '30px' }}>
            <div className={styles.videoWrapper}>
              <iframe
                className={styles.videoFrame}
                src="https://www.youtube.com/embed/LXb3EKWsInQ"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <h4 className={styles.videoTitle}>
              Eksklusif: Wawancara Khusus dengan Pakar Ekonomi Digital
            </h4>
          </div>

          {/* Tags Widget */}
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Tags</h3>
          </div>
          <div className={styles.tagsCloud}>
            {['Property', 'Sea', 'Programming', 'Life Style', 'Technology', 'Framework', 'Sport', 'Game', 'WFH'].map(tag => (
              <Link href="#" key={tag} className={styles.tagItem}>#{tag}</Link>
            ))}
          </div>

          {/* Ad Placeholder */}
          <AdPlaceholder label="Advertisement" width="100%" height={250} />

        </aside>

      </section >
    </main >
  );
}
