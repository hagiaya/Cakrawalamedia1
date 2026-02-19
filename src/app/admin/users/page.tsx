'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import styles from '@/styles/Admin.module.css'; // We'll leverage existing admin styles or inline needed ones
import { User, Shield, Mail, Calendar, Edit2, Trash2, Search, Loader2, Save, X } from 'lucide-react';

interface UserData {
    id: string;
    email: string;
    full_name: string;
    role: 'redaktur' | 'editor' | 'wartawan' | 'guest';
    created_at: string;
    avatar_url?: string;
}

export default function UsersPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({ email: '', password: '', full_name: '', role: 'wartawan' });
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editRole, setEditRole] = useState<string>('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) {
                setUsers(data as UserData[]);
            }
            if (error) {
                console.error('Error fetching users:', error.message);
            }

        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);

        try {
            const res = await fetch('/api/admin/users/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Gagal membuat user');
            }

            alert('User berhasil dibuat!');
            setShowAddModal(false);
            setNewUser({ email: '', password: '', full_name: '', role: 'wartawan' });
            fetchUsers(); // Refresh list

        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsCreating(false);
        }
    };


    const handleEditClick = (u: UserData) => {
        setEditingId(u.id);
        setEditRole(u.role);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditRole('');
    };

    const handleSaveRole = async (id: string) => {
        try {
            const { error } = await supabase
                .from('users')
                .update({ role: editRole })
                .eq('id', id);

            if (error) {
                alert('Gagal mengupdate role: ' + error.message);
            } else {
                setUsers(users.map(u => u.id === id ? { ...u, role: editRole as any } : u));
                setEditingId(null);
            }
        } catch (err) {
            console.error('Error updating role:', err);
            alert('Terjadi kesalahan saat mengupdate role.');
        }
    };

    const handleDeleteUser = async (id: string, name: string) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus pengguna "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return;

        try {
            // Note: Deleting from public.users usually doesn't delete from auth.users automatically unless trigger exists.
            // For this UI, we will just delete from public.users to remove them from the app list.
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', id);

            if (error) {
                alert('Gagal menghapus pengguna: ' + error.message);
            } else {
                setUsers(users.filter(u => u.id !== id));
            }
        } catch (err) {
            console.error('Error deleting user:', err);
        }
    }

    const filteredUsers = users.filter(u =>
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'redaktur': return '#dc3545'; // Red
            case 'editor': return '#0d6efd'; // Blue
            case 'wartawan': return '#198754'; // Green
            default: return '#6c757d'; // Grey
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Loader2 size={32} className="spin-animation" style={{ color: 'var(--primary-red)' }} />
                <style jsx>{`
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    .spin-animation { animation: spin 1s linear infinite; }
                `}</style>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className={styles.pageTitle} style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Manajemen Pengguna</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                        <input
                            type="text"
                            placeholder="Cari pengguna..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '10px 10px 10px 35px',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                width: '250px'
                            }}
                        />
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        style={{
                            padding: '10px 20px',
                            background: 'var(--primary-red)', // Assuming red based on your theme
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        + Tambah User
                    </button>
                </div>
            </div>

            <div className="table-responsive" style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                        <tr>
                            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#555' }}>Pengguna</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#555' }}>Role</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#555' }}>Bergabung</th>
                            <th style={{ padding: '15px', textAlign: 'right', fontWeight: '600', color: '#555' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(u => (
                                <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div style={{
                                                width: '40px', height: '40px', borderRadius: '50%', background: '#eee',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px',
                                                overflow: 'hidden'
                                            }}>
                                                {u.avatar_url ? (
                                                    <img src={u.avatar_url} alt={u.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <User size={20} color="#888" />
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600' }}>{u.full_name || 'Tanpa Nama'}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#888', display: 'flex', alignItems: 'center' }}>
                                                    <Mail size={12} style={{ marginRight: '4px' }} /> {u.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        {editingId === u.id ? (
                                            <select
                                                value={editRole}
                                                onChange={(e) => setEditRole(e.target.value)}
                                                style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
                                            >
                                                <option value="redaktur">Redaktur</option>
                                                <option value="editor">Editor</option>
                                                <option value="wartawan">Wartawan</option>
                                                <option value="guest">Guest</option>
                                            </select>
                                        ) : (
                                            <span style={{
                                                padding: '5px 10px',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                color: 'white',
                                                background: getRoleBadgeColor(u.role),
                                                textTransform: 'capitalize'
                                            }}>
                                                {u.role}
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: '15px', color: '#666', fontSize: '0.9rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Calendar size={14} style={{ marginRight: '6px' }} />
                                            {new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'right' }}>
                                        {editingId === u.id ? (
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
                                                <button
                                                    onClick={() => handleSaveRole(u.id)}
                                                    style={{ padding: '6px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                    title="Simpan"
                                                >
                                                    <Save size={16} />
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    style={{ padding: '6px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                    title="Batal"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
                                                <button
                                                    onClick={() => handleEditClick(u)}
                                                    style={{ padding: '6px', background: 'transparent', color: '#0d6efd', border: '1px solid #0d6efd', borderRadius: '4px', cursor: 'pointer' }}
                                                    title="Edit Role"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                {currentUser?.id !== u.id && (
                                                    <button
                                                        onClick={() => handleDeleteUser(u.id, u.full_name)}
                                                        style={{ padding: '6px', background: 'transparent', color: '#dc3545', border: '1px solid #dc3545', borderRadius: '4px', cursor: 'pointer' }}
                                                        title="Hapus User"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: '#888' }}>
                                    Tidak ada pengguna ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '400px', maxWidth: '90%' }}>
                        <h3 style={{ marginBottom: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>Tambah User Baru</h3>
                        <form onSubmit={handleCreateUser}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '600' }}>Email</label>
                                <input
                                    type="email"
                                    required
                                    value={newUser.email}
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '600' }}>Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={newUser.password}
                                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '600' }}>Nama Lengkap</label>
                                <input
                                    type="text"
                                    required
                                    value={newUser.full_name}
                                    onChange={e => setNewUser({ ...newUser, full_name: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                                />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '600' }}>Role</label>
                                <select
                                    value={newUser.role}
                                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                                >
                                    <option value="editor">Editor</option>
                                    <option value="wartawan">Wartawan</option>
                                    <option value="redaktur">Redaktur</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    style={{ padding: '10px 20px', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    style={{ padding: '10px 20px', background: '#0d6efd', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isCreating ? 0.7 : 1 }}
                                >
                                    {isCreating ? 'Menyimpan...' : 'Simpan User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

}
