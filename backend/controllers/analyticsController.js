const { trackEvent, getDashboardStats } = require('../modules/analytics/analyticsService');

// @desc    Track User Event
// @route   POST /api/analytics/track
// @access  Public
const track = async (req, res, next) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
    const { eventType, userId, visitorId, metadata } = req.body;

    await trackEvent({
      eventType,
      userId,
      visitorId,
      ip,
      metadata
    });

    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

// @desc    Get Analytics Dashboard
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
const getDashboard = async (req, res, next) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

// @desc    Export Analytics Data (CSV)
// @route   GET /api/analytics/export
// @access  Private/Admin
const exportData = async (req, res, next) => {
  try {
    const { getAllAnalyticsData } = require('../modules/analytics/analyticsService');
    const data = await getAllAnalyticsData();

    // Convert to CSV
    const headers = ['ID', 'Event Type', 'User ID', 'Visitor ID', 'IP Address', 'Country', 'City', 'Created At'];
    const csvRows = [headers.join(',')];

    data.forEach(row => {
      const values = [
        row.id,
        row.event_type,
        row.user_id || 'N/A',
        row.visitor_id,
        row.ip_address,
        row.country,
        row.city,
        new Date(row.created_at).toISOString()
      ].map(val => `"${val}"`); // Quote values
      csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=analytics_report.csv');
    res.status(200).send(csvString);
  } catch (err) {
    next(err);
  }
};

module.exports = { track, getDashboard, exportData };
