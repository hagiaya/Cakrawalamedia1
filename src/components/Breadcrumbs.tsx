'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" style={{ marginBottom: '20px', fontSize: '0.85rem', color: 'var(--text-grey)' }}>
            <ol style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '5px', listStyle: 'none', padding: 0, margin: 0 }}>
                <li>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', color: 'var(--text-grey)', transition: 'color 0.2s' }}>
                        <Home size={14} />
                    </Link>
                </li>

                {items.map((item, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
                        <ChevronRight size={14} style={{ margin: '0 5px', color: '#ccc' }} />
                        {index === items.length - 1 ? (
                            <span style={{ color: 'var(--primary-red)', fontWeight: '600', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.label}
                            </span>
                        ) : (
                            <Link href={item.href} style={{ color: 'var(--text-grey)', transition: 'color 0.2s' }}>
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
