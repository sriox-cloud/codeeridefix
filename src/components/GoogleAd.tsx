"use client";

import { useEffect } from 'react';

interface GoogleAdProps {
    adSlot: string;
    adFormat?: string;
    style?: React.CSSProperties;
    className?: string;
}

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

export default function GoogleAd({
    adSlot,
    adFormat = "auto",
    style = { display: 'block' },
    className = ""
}: GoogleAdProps) {
    useEffect(() => {
        try {
            if (typeof window !== 'undefined' && window.adsbygoogle) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (error) {
            console.error('AdSense error:', error);
        }
    }, []);

    return (
        <div className={`adsense-container ${className}`}>
            <ins
                className="adsbygoogle"
                style={style}
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your actual AdSense client ID
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive="true"
            />
        </div>
    );
}

// AdSense Script Component to be added to layout
export function AdSenseScript() {
    return (
        <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
            crossOrigin="anonymous"
        />
    );
}

// Predefined ad components for common placements
export function HeaderAd() {
    return (
        <GoogleAd
            adSlot="1234567890" // Replace with actual ad slot ID
            adFormat="horizontal"
            className="w-full max-w-4xl mx-auto mb-4"
            style={{ display: 'block', height: '90px' }}
        />
    );
}

export function SidebarAd() {
    return (
        <GoogleAd
            adSlot="1234567891" // Replace with actual ad slot ID
            adFormat="rectangle"
            className="w-full max-w-sm"
            style={{ display: 'block', width: '300px', height: '250px' }}
        />
    );
}

export function FooterAd() {
    return (
        <GoogleAd
            adSlot="1234567892" // Replace with actual ad slot ID
            adFormat="horizontal"
            className="w-full max-w-6xl mx-auto mt-4"
            style={{ display: 'block', height: '90px' }}
        />
    );
}

export function InlineAd() {
    return (
        <GoogleAd
            adSlot="1234567893" // Replace with actual ad slot ID
            adFormat="fluid"
            className="w-full my-4"
            style={{ display: 'block', minHeight: '50px' }}
        />
    );
}
