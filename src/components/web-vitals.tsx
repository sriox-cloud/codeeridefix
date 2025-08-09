'use client';

import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
    // Send to your analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', metric.name, {
            event_category: 'Web Vitals',
            event_label: metric.id,
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            non_interaction: true,
        });
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
        console.log('Web Vital:', metric);
    }
}

export function WebVitals() {
    if (typeof window !== 'undefined') {
        onCLS(sendToAnalytics);
        onFCP(sendToAnalytics);
        onINP(sendToAnalytics);
        onLCP(sendToAnalytics);
        onTTFB(sendToAnalytics);
    }

    return null;
}