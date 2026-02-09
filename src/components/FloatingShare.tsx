'use client';

import { Facebook, Twitter, Link as LinkIcon, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function FloatingShare({ title, url }: { title: string, url: string }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            left: '20px',
            bottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            zIndex: 100,
            animation: 'fadeIn 0.3s ease'
        }}>
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .share-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    transition: transform 0.2s;
                    border: none;
                    cursor: pointer;
                }
                .share-btn:hover {
                    transform: translateY(-3px);
                }
            `}</style>

            <button className="share-btn" style={{ background: '#3b5998' }} title="Share on Facebook">
                <Facebook size={20} />
            </button>
            <button className="share-btn" style={{ background: '#1da1f2' }} title="Share on Twitter">
                <Twitter size={20} />
            </button>
            <button className="share-btn" style={{ background: '#25d366' }} title="Share on WhatsApp">
                <MessageCircle size={20} />
            </button>
            <button className="share-btn" style={{ background: '#333' }} title="Copy Link" onClick={() => navigator.clipboard.writeText(shareUrl)}>
                <LinkIcon size={20} />
            </button>
        </div>
    );
}
