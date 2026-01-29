
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BASE_URL = 'https://raziachic.com'; // Replace with actual domain
const TARGET_DIR = path.join(__dirname, '../public');
const SITEMAP_PATH = path.join(TARGET_DIR, 'sitemap.xml');

// Data Sources (Mocked - in production fetch from API/DB)
const CATEGORIES = [
    'abay', 'dresses', 'hijabs', 'accessories', 'kaftans', 'perfumes'
];

const CITIES = [
    'Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Taif', 'Tabuk', 
    'Buraydah', 'Khamis Mushait', 'Abha', 'Al Hofuf', 'Al Jubail', 
    'Hail', 'Najran', 'Yanbu', 'Al Qatif'
];

const generateSitemap = () => {
    console.log('🚀 Generating Programmatic Sitemap...');

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // 1. Static Routes (Priority 1.0)
    const staticRoutes = ['', 'shop', 'about', 'contact', 'categories'];
    staticRoutes.forEach(route => {
        xml += `
  <url>
    <loc>${BASE_URL}/${route}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;
    });

    // 2. Programmatic Routes (Priority 0.8)
    // Structure: /shop/[category]/in/[city]
    let count = 0;
    CATEGORIES.forEach(category => {
        CITIES.forEach(city => {
            const citySlug = city.toLowerCase().replace(' ', '-');
            const categorySlug = category.toLowerCase();
            
            xml += `
  <url>
    <loc>${BASE_URL}/shop/${categorySlug}/in/${citySlug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
            count++;
        });
    });

    xml += `
</urlset>`;

    // Ensure public dir exists
    if (!fs.existsSync(TARGET_DIR)){
        fs.mkdirSync(TARGET_DIR);
    }

    fs.writeFileSync(SITEMAP_PATH, xml);
    console.log(`✅ Sitemap created successfully with ${count} programmatic pages.`);
    console.log(`📂 Location: ${SITEMAP_PATH}`);
};

generateSitemap();
