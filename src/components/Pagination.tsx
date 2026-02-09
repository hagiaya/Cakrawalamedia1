import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '@/styles/Home.module.css'; // Re-using existing styles or inline

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = [];
    // Simple pagination logic: show all if <= 7, otherwise show range
    // For simplicity, let's just show standard Prev [1] [2] ... [Has] Next
    // Or just all numbers if small amount, which is likely for now.

    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '40px' }}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 12px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-white)',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    borderRadius: '4px',
                    opacity: currentPage === 1 ? 0.5 : 1,
                    color: 'var(--text-black)'
                }}
            >
                <ChevronLeft size={16} />
                <span style={{ marginLeft: '5px' }}>Prev</span>
            </button>

            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    style={{
                        padding: '8px 14px',
                        border: '1px solid var(--border-color)',
                        background: currentPage === page ? 'var(--primary-red)' : 'var(--bg-white)',
                        color: currentPage === page ? 'white' : 'var(--text-black)',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                    }}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 12px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-white)',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    borderRadius: '4px',
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    color: 'var(--text-black)'
                }}
            >
                <span style={{ marginRight: '5px' }}>Next</span>
                <ChevronRight size={16} />
            </button>
        </div>
    );
}
