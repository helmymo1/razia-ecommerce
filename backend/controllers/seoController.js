const db = require('../config/db');

// @desc    Generate XML Sitemap
// @route   GET /sitemap.xml
// @access  Public
const generateSitemap = async (req, res) => {
  try {
    // 1. Fetch Data
    const [products] = await db.query('SELECT id, updated_at FROM products');
    const [categories] = await db.query('SELECT slug FROM categories');

    // 2. Start XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // 3. Static Pages
    const staticPages = [
      'https://raziastore.com/',
      'https://raziastore.com/about',
      'https://raziastore.com/contact',
      'https://raziastore.com/shop'
    ];

    staticPages.forEach(url => {
      xml += `
  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    // 4. Products Loop
    products.forEach(product => {
      const lastMod = product.updated_at ? new Date(product.updated_at).toISOString() : new Date().toISOString();
      xml += `
  <url>
    <loc>https://raziastore.com/product/${product.id}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
    });

    // 5. Categories Loop
    categories.forEach(category => {
      xml += `
  <url>
    <loc>https://raziastore.com/category/${category.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    // 6. Close XML
    xml += `
</urlset>`;

    // 7. Send Response
    res.header('Content-Type', 'application/xml');
    res.send(xml);

  } catch (error) {
    console.error('Sitemap Error:', error);
    res.status(500).send('Error generating sitemap');
  }
};

module.exports = {
  generateSitemap
};
