'use client';

import { useState } from 'react';
import { User, MessageCircle } from 'lucide-react';
import styles from '@/styles/Home.module.css';

interface Comment {
    id: string;
    name: string;
    date: string;
    content: string;
    avatar?: string;
}

export default function ArticleComments({ articleId }: { articleId: string }) {
    // Initial dummy data
    const [comments, setComments] = useState<Comment[]>([
        {
            id: '1',
            name: 'Budi Santoso',
            date: '2 jam yang lalu',
            content: 'Berita yang sangat informatif. Semoga pemerintah segera mengambil tindakan nyata terkait isu ini.',
        },
        {
            id: '2',
            name: 'Siti Aminah',
            date: '5 jam yang lalu',
            content: 'Sepakat dengan analisis di atas. Perlu ada regulasi yang lebih ketat.',
        }
    ]);

    const [newComment, setNewComment] = useState('');
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !name.trim()) return;

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            const comment: Comment = {
                id: Date.now().toString(),
                name: name,
                date: 'Baru saja',
                content: newComment,
            };

            setComments([comment, ...comments]);
            setNewComment('');
            setName('');
            setIsSubmitting(false);
        }, 800);
    };

    return (
        <div style={{ marginTop: '50px', borderTop: '1px solid var(--border-color)', paddingTop: '30px' }}>
            <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>
                    Komentar <span style={{ color: 'var(--text-grey)', fontSize: '1rem', fontWeight: 400 }}>({comments.length})</span>
                </h3>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '40px', background: 'var(--bg-light-grey)', padding: '20px', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '15px' }}>Tulis Komentar</h4>
                <div style={{ marginBottom: '15px' }}>
                    <input
                        type="text"
                        placeholder="Nama Anda"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'var(--font-body)' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <textarea
                        placeholder="Tulis komentar Anda di sini..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '100px', fontFamily: 'var(--font-body)', resize: 'vertical' }}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                    style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                >
                    {isSubmitting ? 'Mengirim...' : 'Kirim Komentar'}
                </button>
            </form>

            {/* Comment List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {comments.map((comment) => (
                    <div key={comment.id} style={{ display: 'flex', gap: '15px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: '#ddd',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <User size={20} color="#666" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <h5 style={{ margin: 0, fontSize: '1rem' }}>{comment.name}</h5>
                                <span style={{ fontSize: '0.8rem', color: '#888' }}>{comment.date}</span>
                            </div>
                            <p style={{ fontSize: '0.95rem', color: '#444', lineHeight: '1.5' }}>{comment.content}</p>
                            <button style={{ background: 'none', border: 'none', color: 'var(--primary-red)', fontSize: '0.8rem', marginTop: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}>
                                <MessageCircle size={14} /> Balas
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
