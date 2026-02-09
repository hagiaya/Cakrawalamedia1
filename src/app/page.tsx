'use client';

import Image from 'next/image';
import Link from 'next/link';
import { articles } from '@/lib/data';
import styles from '@/styles/Home.module.css';
import cardStyles from '@/styles/Card.module.css';
import { Facebook, Twitter, Instagram, Youtube, User, Calendar, Clock } from 'lucide-react';
import { useState } from 'react';
import AdPlaceholder from '@/components/AdPlaceholder';

export default function Home() {
  const featured = articles[0];
  const sideHero = articles.slice(1, 3);
  const featuredSection = articles.slice(3, 5);
  const latest = articles.slice(5);

  // Filter articles by category for the new sections
  const governmentNews = articles.filter(a => a.category === 'Pemerintahan').slice(0, 3);
  const lawNews = articles.filter(a => a.category === 'Hukum').slice(0, 3);
  const nationalNews = articles.filter(a => a.category === 'Nasional').slice(0, 3);

  // Sidebar Tab State
  const [activeTab, setActiveTab] = useState<'popular' | 'recent'>('popular');
  const popularNews = [...articles].slice(0, 5).reverse(); // Deterministic sort to fix hydration mismatch
  const recentSidebar = articles.slice(0, 5);

  return (
    <main>
      {/* ... (Ticker Section remains the same) */}
      <div className={styles.tickerSection}>
        <div className={`container ${styles.tickerContainer}`}>
          <div className={styles.tickerLabel}>Trending News</div>
          <div className={styles.tickerContent}>
            <div className={styles.tickerTrack}>
              {articles.map(a => (
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
          <Link href={`/news/${featured.id}`} className={styles.featuredCard}>
            <Image
              src={featured.image}
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

          {/* Side Hero Articles (Right) */}
          <div className={styles.sideColumn}>
            {sideHero.map(article => (
              <Link href={`/news/${article.id}`} key={article.id} className={cardStyles.card} style={{ flex: 1 }}>
                <div className={cardStyles.imageWrapper}>
                  <Image
                    src={article.image}
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
                    src={article.image}
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
                  <p className={cardStyles.excerpt} style={{ marginBottom: '20px' }}>{article.excerpt}</p>
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
              {governmentNews.map((article, idx) => (
                <div key={article.id} style={{ marginBottom: '20px' }}>
                  {idx === 0 ? (
                    <Link href={`/news/${article.id}`} className={cardStyles.card}>
                      <div className={cardStyles.imageWrapper} style={{ aspectRatio: '4/3' }}>
                        <Image src={article.image} alt={article.title} fill className={cardStyles.image} />
                      </div>
                      <h4 className={cardStyles.title} style={{ fontSize: '1rem' }}>{article.title}</h4>
                    </Link>
                  ) : (
                    <Link href={`/news/${article.id}`} className={styles.smallNewsItem}>
                      <div className={styles.smallNewsImage}>
                        <Image src={article.image} alt={article.title} fill style={{ objectFit: 'cover' }} />
                      </div>
                      <h4 className={styles.smallNewsTitle}>{article.title}</h4>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Law Column */}
            <div>
              <div className={styles.sectionHeader} style={{ marginBottom: '20px' }}>
                <h3 className={styles.sectionTitle}>Hukum</h3>
              </div>
              {lawNews.map((article, idx) => (
                <div key={article.id} style={{ marginBottom: '20px' }}>
                  {idx === 0 ? (
                    <Link href={`/news/${article.id}`} className={cardStyles.card}>
                      <div className={cardStyles.imageWrapper} style={{ aspectRatio: '4/3' }}>
                        <Image src={article.image} alt={article.title} fill className={cardStyles.image} />
                      </div>
                      <h4 className={cardStyles.title} style={{ fontSize: '1rem' }}>{article.title}</h4>
                    </Link>
                  ) : (
                    <Link href={`/news/${article.id}`} className={styles.smallNewsItem}>
                      <div className={styles.smallNewsImage}>
                        <Image src={article.image} alt={article.title} fill style={{ objectFit: 'cover' }} />
                      </div>
                      <h4 className={styles.smallNewsTitle}>{article.title}</h4>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* National Column */}
            <div>
              <div className={styles.sectionHeader} style={{ marginBottom: '20px' }}>
                <h3 className={styles.sectionTitle}>Nasional</h3>
              </div>
              {nationalNews.map((article, idx) => (
                <div key={article.id} style={{ marginBottom: '20px' }}>
                  {idx === 0 ? (
                    <Link href={`/news/${article.id}`} className={cardStyles.card}>
                      <div className={cardStyles.imageWrapper} style={{ aspectRatio: '4/3' }}>
                        <Image src={article.image} alt={article.title} fill className={cardStyles.image} />
                      </div>
                      <h4 className={cardStyles.title} style={{ fontSize: '1rem' }}>{article.title}</h4>
                    </Link>
                  ) : (
                    <Link href={`/news/${article.id}`} className={styles.smallNewsItem}>
                      <div className={styles.smallNewsImage}>
                        <Image src={article.image} alt={article.title} fill style={{ objectFit: 'cover' }} />
                      </div>
                      <h4 className={styles.smallNewsTitle}>{article.title}</h4>
                    </Link>
                  )}
                </div>
              ))}
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
                    src={article.image}
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
                  <p className={cardStyles.excerpt}>{article.excerpt}</p>
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
                    <Image src={article.image} alt={article.title} fill style={{ objectFit: 'cover' }} />
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

          {/* Info Pemerintahan Widget */}
          <div className={styles.sectionHeader} style={{ marginTop: '30px' }}>
            <h3 className={styles.sectionTitle}>Info Pemerintahan</h3>
          </div>
          <div className={styles.trendingList}>
            {governmentNews.map((article, idx) => (
              <div key={`trending-${idx}`} className={styles.trendingItem}>
                <div className={styles.trendingCategory}>
                  {article.category}
                </div>
                <div className={styles.trendingMeta}>
                  <span>By {article.author}</span> {article.date}
                </div>
                <Link href={`/news/${article.id}`}>
                  <h4 className={styles.trendingTitle}>
                    {article.title}
                  </h4>
                </Link>
              </div>
            ))}
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

          {/* Category List Widget */}
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Category</h3>
          </div>
          <div className={styles.categoryListWidget}>
            {[
              { name: 'Life Style', count: 14 },
              { name: 'Photos', count: 4 },
              { name: 'Video', count: 2 },
              { name: 'Trending', count: 8 },
              { name: 'Travel', count: 10 },
            ].map(cat => (
              <Link href="#" key={cat.name} className={styles.categoryListItem}>
                <span>{cat.name}</span>
                <span className={styles.categoryCount}>{cat.count}</span>
              </Link>
            ))}
          </div>

          {/* Ad Placeholder */}
          <AdPlaceholder label="Advertisement" width="100%" height={250} />

        </aside>

      </section >
    </main >
  );
}
