const db = require('../../config/db');
const geoip = require('geoip-lite');
const bus = require('../../src/events/eventBus'); // Adjust path as needed

// Initialize Table
const initAnalyticsService = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS analytics_events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      event_type ENUM('page_view', 'product_view', 'add_to_cart', 'checkout_start', 'purchase') NOT NULL,
      user_id VARCHAR(36) NULL,
      visitor_id VARCHAR(100) NOT NULL,
      ip_address VARCHAR(45) NOT NULL,
      country VARCHAR(100) NULL,
      city VARCHAR(100) NULL,
      metadata JSON NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  try {
    await db.query(query);
    console.log("📊 Analytics: Table initialized.");
  } catch (err) {
    console.error("Analytics Init Error:", err);
  }
};

// Track Event
const trackEvent = async (data) => {
  const { eventType, userId, visitorId, ip, metadata } = data;
  
  // Resolve Geo
  const geo = geoip.lookup(ip) || {};
  const country = geo.country || 'Unknown';
  const city = geo.city || 'Unknown';

  try {
    // Save to DB
    const sql = `
      INSERT INTO analytics_events (event_type, user_id, visitor_id, ip_address, country, city, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [
      eventType, 
      userId || null, 
      visitorId, 
      ip, 
      country, 
      city, 
      metadata ? JSON.stringify(metadata) : null
    ]);

    // Emit live update
    bus.emit('ANALYTICS_NEW_EVENT', {
      eventType,
      country,
      city,
      timestamp: new Date()
    });

    return result.insertId;
  } catch (err) {
    console.error("Track Event Error:", err);
    throw err;
  }
};

// Get Dashboard Stats
const getDashboardStats = async () => {
  try {
    // 1. Funnel: Count distinct visitors per event
    // Note: This is simplified. Real funnels are ordered.
    // We group by event_type.
    const [funnel] = await db.query(`
      SELECT event_type, COUNT(DISTINCT visitor_id) as count 
      FROM analytics_events 
      WHERE created_at >= NOW() - INTERVAL 30 DAY
      GROUP BY event_type
    `);

    // 2. Geography: Top 5 Cities
    const [geo] = await db.query(`
      SELECT city, country, COUNT(*) as count 
      FROM analytics_events 
      WHERE created_at >= NOW() - INTERVAL 30 DAY
      GROUP BY city, country 
      ORDER BY count DESC 
      LIMIT 5
    `);

    // 3. Active Users (Last 15 mins)
    const [active] = await db.query(`
      SELECT COUNT(DISTINCT visitor_id) as count 
      FROM analytics_events 
      WHERE created_at >= NOW() - INTERVAL 15 MINUTE
    `);

    // 4. Conversion Rate
    // Visitors (page_view) vs Purchase
    const visitorCount = funnel.find(f => f.event_type === 'page_view')?.count || 1;
    const purchaseCount = funnel.find(f => f.event_type === 'purchase')?.count || 0;
    const conversionRate = ((purchaseCount / visitorCount) * 100).toFixed(2);

    return {
      funnel: funnel,
      geo: geo,
      activeUsers: active[0].count,
      conversionRate
    };
  } catch (err) {
    console.error("Get Stats Error:", err);
    throw err;
  }
};

// Get All Data for Export
const getAllAnalyticsData = async () => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM analytics_events ORDER BY created_at DESC
    `);
    return rows;
  } catch (err) {
    console.error("Get All Analytics Error:", err);
    throw err;
  }
};

module.exports = {
  initAnalyticsService,
  trackEvent,
  getDashboardStats,
  getAllAnalyticsData
};
