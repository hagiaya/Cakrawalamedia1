'use client';
import React from 'react';

interface AdPlaceholderProps {
    width?: string | number;
    height?: string | number;
    className?: string;
    label?: string;
    style?: React.CSSProperties;
}

export default function AdPlaceholder({ width = '100%', height = '250px', className = '', label = 'Advertisement', style }: AdPlaceholderProps) {
    return (
        <div
            className={className}
            style={{
                width: width,
                height: height,
                background: 'var(--bg-light-grey)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-meta)',
                textTransform: 'uppercase',
                fontSize: '0.8rem',
                border: '1px dashed var(--border-color)',
                margin: '20px 0',
                ...style
            }}
        >
            {label} ({width}x{height})
        </div>
    );
}
