'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'guest' | 'redaktur' | 'editor' | 'wartawan';

interface AuthContextType {
    role: Role;
    setRole: (role: Role) => void;
    user: { name: string; email: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [role, setRole] = useState<Role>('redaktur');

    const user = role === 'guest' ? null : {
        name: role === 'redaktur' ? 'Budi (Redaktur)' : role === 'editor' ? 'Siti (Editor)' : 'Joko (Wartawan)',
        email: `${role}@webcakrawala.com`
    };

    return (
        <AuthContext.Provider value={{ role, setRole, user }}>
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
