'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

export type Role = 'guest' | 'redaktur' | 'editor' | 'wartawan';

interface AuthContextType {
    role: Role;
    user: { id: string; name: string; email: string } | null;
    loading: boolean;
    setRole: (role: Role) => void;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [role, setRole] = useState<Role>('guest');
    const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserRole = useCallback(async (authUser: User) => {
        try {
            // 1. HARDCODED ADMIN CHECK (Bypass missing DB table)
            if (authUser.email === 'admin@cakrawala.net') {
                console.log('⚡ Admin email detected. Granting REDAKTUR role immediately.');
                setRole('redaktur');
                setUser({
                    id: authUser.id,
                    email: authUser.email || '',
                    name: authUser.user_metadata?.full_name || 'Admin Pusat'
                });
                return;
            }

            const { data, error } = await supabase
                .from('users')
                .select('role, full_name')
                .eq('id', authUser.id)
                .single();

            if (data && !error) {
                setRole((data.role as Role) || 'guest');
                setUser({
                    id: authUser.id,
                    email: authUser.email || '',
                    name: data.full_name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User'
                });
            } else {
                console.warn('No user profile found for ID:', authUser.id);
                setRole('guest');
                setUser({
                    id: authUser.id,
                    email: authUser.email || '',
                    name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User'
                });
            }
        } catch (error) {
            console.error('Error fetching user role:', error);
            setRole('guest');
        }
    }, []);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    await fetchUserRole(session.user);
                } else {
                    setRole('guest');
                    setUser(null);
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT') {
                setRole('guest');
                setUser(null);
                setLoading(false);
            } else if (session?.user) {
                await fetchUserRole(session.user);
                setLoading(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [fetchUserRole]);

    const signOut = async () => {
        await supabase.auth.signOut();
        setRole('guest');
        setUser(null);
        window.location.href = '/login'; // Redirect to login page after logout
    };

    return (
        <AuthContext.Provider value={{ role, setRole, user, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
