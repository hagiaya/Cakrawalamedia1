'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from '@/styles/Admin.module.css';
import { useRouter, useParams } from 'next/navigation';
import { categories, articles } from '@/lib/data'; // Import articles data
import { Sparkles, ArrowRight, Check, X, Loader2, Save } from 'lucide-react';

export default function EditPost() {
    const { role, user } = useAuth();
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: categories[0],
        image: '',
    });

    const [isOptimizing, setIsOptimizing] = useState(false);
    const [suggestions, setSuggestions] = useState<{ title: string; content: string } | null>(null);

    // Fetch existing data
    useEffect(() => {
        if (id) {
            // Simulate fetching from DB
            const article = articles.find(a => a.id === id);
            if (article) {
                setFormData({
                    title: article.title,
                    excerpt: article.excerpt,
                    content: article.content || 'Konten berita belum tersedia di mock data...',
                    category: article.category,
                    image: article.image,
                });
            } else {
                alert('Berita tidak ditemukan!');
                router.push('/admin/posts');
            }
            setLoading(false);
        }
    }, [id, router]);

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

    const handleSave = async () => {
        try {
            setLoading(true); // Reuse loading state or add a saving state
            const response = await fetch('/api/news', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    title: formData.title,
                    excerpt: formData.excerpt,
                    content: formData.content,
                    category: formData.category,
                    image: formData.image,
                    // Preserve status or allow editing status? Let's assume we keep it for now or fetch it.
                    // For simplicity, we are just updating content fields.
                    // If we need status, we should have fetched it.
                }),
            });

            if (!response.ok) {
                const result = await response.json();
                // If ID not found in Supabase (because it's a mock ID), show specific message
                if (result.error && result.error.includes('JSON')) {
                    // Fallback for mock data that isn't in DB yet
                    alert(`Simulasi: Perubahan pada berita "${formData.title}" berhasil disimpan (Mock Data).`);
                } else {
                    alert(`Gagal menyimpan: ${result.error || 'Terjadi kesalahan'}`);
                    setLoading(false);
                    return;
                }
            } else {
                alert(`Perubahan pada berita "${formData.title}" berhasil disimpan di Database.`);
            }

            // Redirect back
            if (role === 'wartawan') {
                router.push('/admin/my-posts');
            } else {
                router.push('/admin/posts');
            }
        } catch (error) {
            console.error('Error saving:', error);
            alert('Terjadi kesalahan saat menyimpan.');
            setLoading(false);
        }
    };

    if (loading) {
        return <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}><Loader2 className="spin-animation" size={40} color="#0070f3" /></div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.pageTitle}>Edit Berita</h1>
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
                            <label className={styles.label} style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Gambar Utama</label>

                            {/* Hidden actual input for form submission */}
                            <input type="hidden" name="image" value={formData.image} />

                            {!formData.image ? (
                                <div style={{
                                    border: '2px dashed #cbd5e1',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    textAlign: 'center',
                                    background: '#f8fafc',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                    onClick={() => document.getElementById('imageUpload')?.click()}
                                >
                                    <input
                                        id="imageUpload"
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            // Show loading state
                                            const loadingBtn = e.target.parentElement as HTMLElement;
                                            const originalText = loadingBtn.innerHTML;
                                            loadingBtn.style.opacity = '0.5';
                                            loadingBtn.innerText = 'Mengupload gambar...';

                                            const formDataUpload = new FormData();
                                            formDataUpload.append('file', file);
                                            // Upload via internal API route
                                            try {
                                                const res = await fetch('/api/upload', {
                                                    method: 'POST',
                                                    body: formDataUpload
                                                });

                                                if (!res.ok) {
                                                    const errorData = await res.json();
                                                    throw new Error(errorData.error || 'Upload failed');
                                                }

                                                const data = await res.json();
                                                if (data.secure_url) {
                                                    setFormData(prev => ({ ...prev, image: data.secure_url }));
                                                } else {
                                                    alert('Gagal upload: Unknown error');
                                                }
                                            } catch (err: any) {
                                                console.error(err);
                                                alert('Terjadi kesalahan saat upload: ' + err.message);
                                            } finally {
                                                // Reset UI loading state
                                                if (loadingBtn) {
                                                    loadingBtn.style.opacity = '1';
                                                    loadingBtn.innerHTML = originalText;
                                                }
                                            }
                                        }}
                                        style={{ display: 'none' }}
                                    />
                                    <div style={{ color: '#64748b' }}>
                                        <p style={{ margin: '0 0 5px 0', fontWeight: 600 }}>Klik untuk Ganti Gambar</p>
                                        <p style={{ margin: 0, fontSize: '0.8rem' }}>JPG, PNG max 5MB</p>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                    <img
                                        src={formData.image}
                                        alt="Preview"
                                        style={{ width: '100%', height: '250px', objectFit: 'cover', display: 'block' }}
                                    />
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                        style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            background: 'rgba(255, 255, 255, 0.9)',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '32px',
                                            height: '32px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                        title="Hapus gambar"
                                    >
                                        <X size={18} color="#ef4444" />
                                    </button>
                                </div>
                            )}

                            {/* Fallback Manual URL Input */}
                            <div style={{ marginTop: '10px' }}>
                                <details>
                                    <summary style={{ fontSize: '0.8rem', color: '#64748b', cursor: 'pointer' }}>Atau gunakan URL eksternal</summary>
                                    <input
                                        type="text"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        className={styles.input}
                                        style={{ width: '100%', marginTop: '5px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem' }}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </details>
                            </div>
                        </div>

                        <div className={styles.actionButtons} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button
                                onClick={handleSave}
                                className="btn btn-primary"
                                style={{ padding: '12px', background: '#2563eb', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                                <Save size={18} /> Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
