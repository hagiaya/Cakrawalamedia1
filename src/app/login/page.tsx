'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { User, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
    const { setRole } = useAuth(); // We might use setRole tentatively, but AuthContext updates automatically
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                // Check specifically for network failure
                if (error.message === 'Failed to fetch') {
                    throw new Error('Gagal terhubung ke server. Periksa koneksi internet Anda atau coba lagi nanti.');
                }
                throw error;
            }

            if (data.session) {
                // Login successful
                router.push('/admin');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'Email atau password salah.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f4f6f8',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
        }}>
            <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        marginBottom: '10px',
                        color: 'var(--text-black)'
                    }}>Login</h1>
                    <p style={{ color: '#666' }}>Masuk ke akun Anda</p>
                </div>

                {error && (
                    <div style={{
                        background: '#fff0f0',
                        color: '#d32f2f',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem' }}>Email</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="nama@email.com"
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 40px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    outline: 'none',
                                    fontSize: '0.95rem'
                                }}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 40px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    outline: 'none',
                                    fontSize: '0.95rem'
                                }}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: 'var(--primary-red)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '1rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            transition: 'opacity 0.2s',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        {loading ? 'Memproses...' : 'Login'} <ArrowRight size={18} />
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <Link href="/" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9rem' }}>
                        &larr; Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    );
}
