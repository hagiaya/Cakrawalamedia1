import React from 'react';

const Logo = ({ width = 60, height = 60, color = 'white' }: { width?: number; height?: number; color?: string }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" stroke={color} strokeWidth="4" />
            <path
                d="M30 65V35C30 32.2386 32.2386 30 35 30H45C47.7614 30 50 32.2386 50 35V50L50 35C50 32.2386 52.2386 30 55 30H65C67.7614 30 70 32.2386 70 35V65"
                stroke={color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Refined clean 'CM' look - simplified for better visibility */}
        </svg>
    );
};

export const CMLogo = ({ width = 60, height = 60, color = 'white' }: { width?: number; height?: number; color?: string }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {/* Circle Ring */}
            <circle cx="50" cy="50" r="45" stroke={color} strokeWidth="5" fill="none" />

            {/* C Shape */}
            <path d="M48 65C38 65 30 58 30 50C30 42 38 35 48 35" stroke={color} strokeWidth="8" strokeLinecap="round" fill="none" />

            {/* M Shape */}
            <path d="M52 65V35L62 55L72 35V65" stroke={color} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
    )
}

export default CMLogo;
