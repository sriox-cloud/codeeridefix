/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://codeer.org',
    generateRobotsTxt: true,
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/'],
            },
        ],
        additionalSitemaps: [
            'https://codeer.org/sitemap.xml',
        ],
    },
    exclude: ['/admin/*', '/api/*'],
    changefreq: 'daily',
    priority: 0.7,
    transform: async (config, path) => {
        // Custom priority for important pages
        const priorities = {
            '/': 1.0,
            '/ide': 0.9,
            '/login': 0.8,
            '/dashboard': 0.8,
            '/explore': 0.7,
            '/privacy': 0.8,
            '/terms': 0.8,
        };

        return {
            loc: path,
            changefreq: config.changefreq,
            priority: priorities[path] || config.priority,
            lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
        };
    },
};
