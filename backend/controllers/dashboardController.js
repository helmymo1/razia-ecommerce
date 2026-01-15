const db = require('../config/db');

// @desc    Get dashboard aggregated stats
// @route   GET /api/dashboard/stats
// @access  Private/Admin
const getStats = async (req, res, next) => {
  try {
    // Parallel queries for performance
    const [orders] = await db.query('SELECT COUNT(*) as count FROM orders');
    const [revenue] = await db.query('SELECT SUM(total) as revenue FROM orders WHERE status = "delivered"');
    const [products] = await db.query('SELECT COUNT(*) as count FROM products');
    const [customers] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = "customer"');
    
    // Monthly Earning (Naive approach: sum distinct total from orders created in current month)
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const [monthlyRevenue] = await db.query(
        'SELECT SUM(total) as revenue FROM orders WHERE created_at LIKE ? AND status = "delivered"', 
        [`${currentMonth}%`]
    );

    const [pendingOrders] = await db.query('SELECT COUNT(*) as count FROM orders WHERE status = "pending"');

    res.status(200).json({
      revenue: revenue[0].revenue || 0,
      totalOrders: orders[0].count || 0,
      totalProducts: products[0].count || 0,
      totalCustomers: customers[0].count || 0,
      monthlyEarning: monthlyRevenue[0].revenue || 0,
      pendingOrders: pendingOrders[0].count || 0
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sales chart data
// @route   GET /api/dashboard/sales-chart
// @access  Private/Admin
const getSalesChart = async (req, res, next) => {
    try {
        // Get sales for last 12 months (Delivered only)
        const query = `
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m') as date, 
                SUM(total) as revenue 
            FROM orders 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH) AND status = "delivered"
            GROUP BY date 
            ORDER BY date ASC
        `;
        const [rows] = await db.query(query);
        
        // Format for frontend (labels: date, data: revenue)
        const labels = rows.map(r => r.date);
        const data = rows.map(r => r.revenue);

        res.status(200).json({ labels, data });
    } catch (error) {
        next(error);
    }
};

// @desc    Get recent orders
// @route   GET /api/dashboard/recent-orders
// @access  Private/Admin
const getRecentOrders = async (req, res, next) => {
    try {
        const [rows] = await db.query(`
            SELECT o.id, o.total_amount, o.status, o.created_at, u.name as user_name 
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC 
            LIMIT 5
        `);
        res.status(200).json(rows);
    } catch (error) {
        next(error);
    }
}

// @desc    Get Best Sellers
// @route   GET /api/dashboard/best-sellers
// @access  Private/Admin
const getBestSellers = async (req, res, next) => {
    try {
        const [rows] = await db.query(`
            SELECT p.name, SUM(oi.quantity) as sold, p.image_url as image, p.price
            FROM order_items oi 
            JOIN products p ON oi.product_id = p.id 
            GROUP BY p.id 
            ORDER BY sold DESC 
            LIMIT 5
        `);
        res.status(200).json(rows);
    } catch (error) {
        next(error);
    }
}

// @desc    Get Low Stock Alerts
// @route   GET /api/dashboard/low-stock
// @access  Private/Admin
const getLowStock = async (req, res, next) => {
    try {
        const [rows] = await db.query(`
            SELECT id, name, stock, image_url as image, sku
            FROM products 
            WHERE stock < 5 
            ORDER BY stock ASC
            LIMIT 10
        `);
        res.status(200).json(rows);
    } catch (error) {
        next(error);
    }
}

module.exports = {
  getStats,
  getSalesChart,
  getRecentOrders,
  getBestSellers,
  getLowStock
};
