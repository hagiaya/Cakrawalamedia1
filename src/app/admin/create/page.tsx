'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from '@/styles/Admin.module.css';
import { useRouter } from 'next/navigation';
import { categories } from '@/lib/data';
import { Sparkles, ArrowRight, Check, X, Loader2 } from 'lucide-react';

export default function CreatePost() {
    const { role, user } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: categories[0],
        image: '',
    });

    const [isOptimizing, setIsOptimizing] = useState(false);
    const [suggestions, setSuggestions] = useState<{ title: string; content: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOptimizeSEO = () => {
        if (!formData.title || !formData.content) {
            alert("Mohon isi Judul dan Konten terlebih dahulu untuk analisis SEO.");
            return;
        }

        setIsOptimizing(true);
        setSuggestions(null);

        // Simulate AI Processing
        setTimeout(() => {
            let optimizedTitle = formData.title;
            // SEO Rule 1: Add year or urgency words if missing
            if (!/2026|terbaru|update|resmi/i.test(optimizedTitle)) {
                optimizedTitle = `${optimizedTitle} (Update Terbaru 2026)`;
            }
            // SEO Rule 2: Title Case
            optimizedTitle = optimizedTitle.replace(/\w\S*/g, (txt) => {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });

            let optimizedContent = formData.content;
            // SEO Rule 3: Ensure content length and keywords
            const wordCount = optimizedContent.split(/\s+/).length;
            if (wordCount < 300) {
                optimizedContent += `\n\n[Saran AI: Artikel ini agak pendek (${wordCount} kata). Disarankan minimal 300 kata untuk SEO yang lebih baik. Tambahkan opini ahli atau data statistik pendukung.]`;
            }

            // SEO Rule 4: Keyword injection
            if (!optimizedContent.toLowerCase().includes(formData.category.toLowerCase())) {
                optimizedContent = `Dalam perkembangan berita seputar ${formData.category} ini, ` + optimizedContent;
            }

            // Cleanup whitespace
            optimizedContent = optimizedContent.replace(/\s+/g, ' ').trim();

            setSuggestions({
                title: optimizedTitle,
                content: optimizedContent
            });
            setIsOptimizing(false);
        }, 2000);
    };

    const applySuggestion = (type: 'title' | 'content' | 'all') => {
        if (suggestions) {
            setFormData(prev => ({
                ...prev,
                title: (type === 'title' || type === 'all') ? suggestions.title : prev.title,
                content: (type === 'content' || type === 'all') ? suggestions.content : prev.content
            }));
            if (type === 'all') setSuggestions(null);
        }
    };

    const handleSave = (status: string) => {
        // Simulation of API call
        alert(`Berita "${formData.title}" berhasil disimpan sebagai ${status.toUpperCase()} oleh ${user?.name}.`);

        // In reality, this would save to DB with status.
        // Redirect based on role
        if (role === 'wartawan') {
            router.push('/admin/my-posts');
        } else {
            router.push('/admin/posts');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.pageTitle}>Tulis Berita Baru</h1>
                <button onClick={() => router.back()} className="btn btn-outline" style={{ background: 'white', border: '1px solid #ddd', padding: '8px 15px', borderRadius: '4px' }}>Batal</button>
            </div>

            <div className={styles.formCard} style={{ background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>

                    {/* Main Form Fields */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {suggestions && (
                            <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '8px', border: '1px solid #bae6fd', marginBottom: '20px' }}>
                                <h3 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '10px', color: '#0284c7' }}>
                                    <Sparkles size={20} /> Saran Ioptimasi AI Ditemukan!
                                </h3>

                                <div style={{ display: 'grid', gap: '15px' }}>
                                    {/* Title Comparison */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                            <strong>Original:</strong><br />{formData.title}
                                        </div>
                                        <ArrowRight size={16} color="#999" />
                                        <div style={{ fontSize: '0.9rem', color: '#0369a1', fontWeight: 600 }}>
                                            <strong>Saran AI:</strong><br />{suggestions.title}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => applySuggestion('title')}
                                        style={{ justifySelf: 'start', padding: '5px 10px', fontSize: '0.8rem', background: '#e0f2fe', color: '#0284c7', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Terapkan Judul Ini
                                    </button>

                                    <hr style={{ border: 'none', borderTop: '1px solid #e0f2fe', width: '100%' }} />

                                    {/* Content Comparison */}
                                    <div>
                                        <div style={{ fontSize: '0.9rem', color: '#0369a1', marginBottom: '5px' }}><strong>Saran Konten:</strong></div>
                                        <div style={{ fontSize: '0.85rem', color: '#555', maxHeight: '100px', overflowY: 'auto', background: 'white', padding: '10px', borderRadius: '4px', border: '1px solid #e0f2fe' }}>
                                            {suggestions.content}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => applySuggestion('content')}
                                        style={{ justifySelf: 'start', padding: '5px 10px', fontSize: '0.8rem', background: '#e0f2fe', color: '#0284c7', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Terapkan Perbaikan Konten
                                    </button>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', gap: '10px' }}>
                                        <button
                                            onClick={() => setSuggestions(null)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 15px', background: 'white', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            <X size={16} /> Abaikan
                                        </button>
                                        <button
                                            onClick={() => applySuggestion('all')}
                                            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 15px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            <Check size={16} /> Terapkan Semua
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className={styles.formGroup}>
                            <label className={styles.label} style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Judul Berita</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={styles.input}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                placeholder="Masukkan judul berita yang menarik"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label} style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Ringkasan (Excerpt)</label>
                            <textarea
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleChange}
                                className={styles.textarea}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }}
                                placeholder="Tulis ringkasan singkat untuk tampilan awal"
                            ></textarea>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label} style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Isi Berita (Konten)</label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                className={styles.textarea}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '300px' }}
                                placeholder="Tulis isi berita lengkap di sini..."
                            ></textarea>
                        </div>
                    </div>

                    {/* Sidebar Options */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* AI SEO Assistant Widget */}
                        {role === 'wartawan' && (
                            <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', padding: '20px', borderRadius: '8px', color: 'white', boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                    <Sparkles size={24} color="#ffd700" />
                                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>AI SEO Assistant</h3>
                                </div>
                                <p style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '15px' }}>
                                    Optimalkan judul dan tulisan Anda agar lebih mudah ditemukan di mesin pencari.
                                </p>
                                <button
                                    onClick={handleOptimizeSEO}
                                    disabled={isOptimizing}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        background: 'white',
                                        color: '#4f46e5',
                                        border: 'none',
                                        borderRadius: '4px',
                                        fontWeight: 700,
                                        cursor: isOptimizing ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    {isOptimizing ? (
                                        <>
                                            <Loader2 size={18} className="spin-animation" /> Menganalisis...
                                        </>
                                    ) : (
                                        'Uji & Optimalkan SEO'
                                    )}
                                </button>
                                <style jsx>{`
                                    @keyframes spin {
                                        0% { transform: rotate(0deg); }
                                        100% { transform: rotate(360deg); }
                                    }
                                    .spin-animation {
                                        animation: spin 1s linear infinite;
                                    }
                                `}</style>
                            </div>
                        )}

                        <div className={styles.formGroup}>
                            <label className={styles.label} style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Kategori</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={styles.select}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label} style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Gambar Utama (URL)</label>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                className={styles.input}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                placeholder="https://example.com/image.jpg"
                            />
                            {formData.image && (
                                <div style={{ marginTop: '10px', width: '100%', height: '150px', position: 'relative', overflow: 'hidden', borderRadius: '4px', border: '1px solid #eee' }}>
                                    <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            )}
                        </div>

                        <div className={styles.actionButtons} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button
                                onClick={() => handleSave('draft')}
                                className="btn btn-secondary"
                                style={{ padding: '10px', background: '#ecf0f1', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, color: '#2c3e50' }}
                            >
                                Simpan Draft
                            </button>

                            {role === 'wartawan' && (
                                <button
                                    onClick={() => handleSave('pending_editor')}
                                    className="btn btn-primary"
                                    style={{ padding: '10px', background: '#3498db', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, color: 'white' }}
                                >
                                    Ajukan ke Editor
                                </button>
                            )}

                            {role === 'editor' && (
                                <button
                                    onClick={() => handleSave('pending_admin')}
                                    className="btn btn-primary"
                                    style={{ padding: '10px', background: '#e67e22', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, color: 'white' }}
                                >
                                    Setuju & Teruskan ke Admin
                                </button>
                            )}

                            {role === 'redaktur' && (
                                <button
                                    onClick={() => handleSave('published')}
                                    className="btn btn-success"
                                    style={{ padding: '10px', background: '#27ae60', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, color: 'white' }}
                                >
                                    Publish Sekarang
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
