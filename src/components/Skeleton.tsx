import React from 'react';
interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    style?: React.CSSProperties;
}

export default function Skeleton({ className = '', width, height, style }: SkeletonProps) {
    const computedStyle: React.CSSProperties = {
        width: width,
        height: height,
        ...style,
    };

    return (
        <div
            className={`skeleton ${className}`}
            style={computedStyle}
        ></div>
    );
}

export function ArticleSkeleton() {
    return (
        <div style={{ marginBottom: '30px', paddingBottom: '30px', borderBottom: '1px solid var(--border-color)' }}>
            <Skeleton className="skeleton-text" width="30%" />
            <Skeleton className="skeleton-title" width="80%" height="2.5rem" />

            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <Skeleton width={100} height={20} />
                <Skeleton width={100} height={20} />
            </div>

            <Skeleton className="skeleton-rect" height="400px" style={{ marginBottom: '30px' }} />

            <div style={{ marginTop: '20px' }}>
                <Skeleton className="skeleton-text" />
                <Skeleton className="skeleton-text" />
                <Skeleton className="skeleton-text" />
                <Skeleton className="skeleton-text" width="60%" />
            </div>
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <Skeleton width={260} height={150} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
                <Skeleton width="90%" height={24} style={{ marginBottom: '10px' }} />
                <Skeleton width="40%" height={16} style={{ marginBottom: '10px' }} />
                <Skeleton width="100%" height={16} />
                <Skeleton width="80%" height={16} style={{ marginTop: '5px' }} />
            </div>
        </div>
    );
}
