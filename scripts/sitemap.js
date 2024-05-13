const { createWriteStream } = require('fs');
const { SitemapStream } = require('sitemap');

const langs = ["en", "zh", "es", "ru", "da"];

// Creates a sitemap object given the input configuration with URLs
const sitemap = new SitemapStream({ hostname: 'https://ostable.org' });

const writeStream = createWriteStream('./public/sitemap.xml');
sitemap.pipe(writeStream);

langs.forEach((lng) => {
    sitemap.write({ url: `/${lng === "en" ? "" : lng}`, changefreq: 'daily', priority: 1 });
    sitemap.write({ url: `${lng === "/en" ? "" : `/${lng}`}/trade`, changefreq: 'daily', priority: 0.5 });
    sitemap.write({ url: `${lng === "/en" ? "" : `/${lng}`}/buy`, changefreq: 'monthly', priority: 0.5 });
    sitemap.write({ url: `${lng === "/en" ? "" : `/${lng}`}/create`, changefreq: 'monthly', priority: 0.2 });
    sitemap.write({ url: `${lng === "/en" ? "" : `/${lng}`}/how-it-works`, changefreq: 'monthly', priority: 1 });
    sitemap.write({ url: `${lng === "/en" ? "" : `/${lng}`}/faq`, changefreq: 'monthly', priority: 1 });
});

sitemap.end();
