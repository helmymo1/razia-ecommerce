const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const redisWrapper = require('../config/redis');
const logger = require('../utils/logger');
const emailService = require('../services/emailService');
const ORDER_STATUS = require('../constants/orderStatus');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
  try {
    let query = `
      SELECT o.id, o.total, o.status, o.created_at, u.name as user_name, u.email as user_email,
      (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as total_items
      FROM orders o
      JOIN users u ON o.user_id = u.id
    `;
    const params = [];

    if (req.query.search) {
      query += ' WHERE o.id LIKE ? OR u.name LIKE ?';
      const searchTerm = `%${req.query.search}%`;
      params.push(searchTerm, searchTerm);
    }

    query += ' ORDER BY o.created_at DESC';

    const [orders] = await db.query(query, params);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin Optimized)
// @route   GET /api/orders/admin
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const query = `
        SELECT 
          o.id, o.order_number, o.total, o.status, o.created_at,
          CONCAT(u.first_name, ' ', u.last_name) as user_name, u.email as user_email,
          JSON_ARRAYAGG(
            JSON_OBJECT('product_name', p.name_en, 'quantity', oi.quantity, 'price', oi.unit_price)
          ) as items
        FROM orders o
        JOIN users u ON o.user_id = u.id
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        GROUP BY o.id
        ORDER BY o.created_at DESC;
    `;
    const [orders] = await db.query(query);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private/Admin
const getOrderById = async (req, res, next) => {
  try {
    const [order] = await db.query(`
      SELECT o.id, o.user_id, o.total, o.status, o.created_at, 
             o.shipping_name, o.shipping_address, o.shipping_city, o.shipping_zip, o.shipping_phone,
             CONCAT(u.first_name, ' ', u.last_name) as user_name, u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `, [req.params.id]);

    if (order.length === 0) {
      res.status(404);
      throw new Error('Order not found');
    }

    const [orderItems] = await db.query(`
      SELECT oi.*, oi.unit_price as price, p.name_en as product_name, pi.image_url as image 
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
      WHERE oi.order_id = ?
    `, [req.params.id]);

    res.json({ ...order[0], orderItems });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new order (Atomic Transaction with Security Fix)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  const connection = await db.getConnection();
  try {
    const { order_items } = req.body;
    const user_id = req.user.id; // User ID from auth middleware

    logger.info(`[CreateOrder] Body: ${JSON.stringify(req.body)}`);

    if (!order_items || order_items.length === 0) {
      res.status(400);
      throw new Error('No order items');
    }

    // Start Transaction
    await connection.beginTransaction();

    let calculatedTotalAmount = 0;
    const itemsToInsert = [];

    // Process Items: Check Stock & Calculate Total
    for (const item of order_items) {
      const { product_id, quantity } = item;

      // Lock row for update to prevent race conditions
      const [products] = await connection.query(
        'SELECT price, stock_quantity, name_en FROM products WHERE id = ? FOR UPDATE',
        [product_id]
      );

      if (products.length === 0) {
        throw new Error(`Product ${product_id} not found`);
      }

      const product = products[0];
      if (product.stock_quantity < quantity) {
        throw new Error(`Product ${product_id} is out of stock`);
      }

      const price = parseFloat(product.price);
      calculatedTotalAmount += price * quantity;

      itemsToInsert.push({
        product_id,
        quantity,
        price,
        total_price: price * quantity,
        product_name: product.name_en
      });

      // Deduct stock immediately (part of transaction)
      await connection.query(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [quantity, product_id]
      );
    }

    // --- REFERRAL LOGIC START ---
    const { referralCode } = req.body;
    let referralDiscount = 0;
    let referrerId = null;

    if (referralCode) {
      // 1. Find Referrer
      const [referrers] = await connection.query(
        'SELECT id FROM users WHERE personal_referral_code = ?',
        [referralCode]
      );

      if (referrers.length > 0) {
        referrerId = referrers[0].id; // Assuming ID is CHAR(36) or INT based on schema

        // 2. Anti-Fraud: Self-Referral
        // Note: Ensure types match (string vs int). req.user.id might be string if UUID.
        if (String(referrerId) === String(user_id)) {
          throw new Error('You cannot use your own referral code');
        }

        // 3. One-Time Rule: Has user used a referral before?
        const [previousReferrals] = await connection.query(
          'SELECT id FROM referrals WHERE referee_id = ?',
          [user_id]
        );

        if (previousReferrals.length > 0) {
          throw new Error('You have already used a referral code');
        }

        // 4. Apply Discount (10%)
        referralDiscount = calculatedTotalAmount * 0.10;
        calculatedTotalAmount -= referralDiscount;

        logger.info(`Referral Applied: Code ${referralCode}, Discount ${referralDiscount}, New Total ${calculatedTotalAmount}`);
      } else {
        // Invalid code - standard behavior is to throw error or ignore. 
        // Requirement says "Reject it" for fraud, implied for invalid code too to prevent guessing?
        // Only throw if code was provided but invalid.
        throw new Error('Invalid referral code');
      }
    }
    // --- REFERRAL LOGIC END ---

    // Extract Shipping Info from Request Object (as per requirement) or Fallback
    // Requirement Update: Look for `shipping_info` object in `req.body`
    const { shipping_info, save_to_profile } = req.body;

    if (!shipping_info) {
        res.status(400);
        throw new Error('Shipping address required (shipping_info object)');
    }

    // Destructure shipping info
    const { 
        firstName, lastName, address, city, zip, phone, country 
    } = shipping_info;

    // Validate essential fields
    if (!address || !city || !phone) {
         res.status(400);
         throw new Error('Missing required shipping fields (address, city, phone)');
    }

    const shipping_name = `${firstName} ${lastName}`; // Combine names
    const shipping_zip = zip || shipping_info.zipCode; // Handle naming diff

    // Profile Sync Logic (if requested)
    if (save_to_profile) {
        await connection.query(
            'UPDATE users SET address = ?, city = ?, zip = ?, phone = ?, country = ? WHERE id = ?',
            [address, city, shipping_zip, phone, country, user_id]
        );
    }

    // Create Order Header with Shipping Snapshot
    const orderId = uuidv4();
    const orderNumber = 'ORD-' + Date.now() + Math.floor(Math.random() * 1000);
    
    await connection.query(
      `INSERT INTO orders (
        id, user_id, order_number, subtotal, total, status, created_at,
        shipping_name, shipping_phone, shipping_address, shipping_city, shipping_zip
       ) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?)`,
      [
        orderId, user_id, orderNumber, (calculatedTotalAmount + referralDiscount), calculatedTotalAmount, 'pending',
        shipping_name, phone, JSON.stringify(address), city, shipping_zip
      ]
    );

    // Insert Order Items
    for (const item of itemsToInsert) {
      const orderItemId = uuidv4();
      await connection.query(
        'INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, total_price, product_name) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [orderItemId, orderId, item.product_id, item.quantity, item.price, item.total_price, item.product_name]
      );
    }

    // --- REFERRAL RECORDING ---
    if (referrerId) {
      await connection.query(
        `INSERT INTO referrals (referrer_id, referee_id, referee_order_id, status) 
             VALUES (?, ?, ?, 'pending')`,
        [referrerId, user_id, orderId]
      );
    }
    // --------------------------

    // Commit Transaction
    await connection.commit();

    res.status(201).json({
      id: orderId,
      message: 'Order created successfully',
      total: calculatedTotalAmount,
      referralDiscount: referralDiscount > 0 ? referralDiscount : undefined
    });

  } catch (error) {
    if (connection) await connection.rollback();
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    // Validate status against constants
    const validStatuses = Object.values(ORDER_STATUS);
    if (!validStatuses.includes(status)) {
        res.status(400);
        throw new Error('Invalid order status');
    }

    // Logic: If status is 'refunded', also update payment_status to 'refunded'
    if (status === 'refunded') {
      const [result] = await db.query(
        "UPDATE orders SET status = ?, payment_status = 'refunded' WHERE id = ?",
        [status, req.params.id]
      );
      if (result.affectedRows === 0) {
        res.status(404);
        throw new Error('Order not found');
      }

      // Fetch order and user details to send email
      const [rows] = await db.query(
        `SELECT o.id, u.email, u.name 
         FROM orders o 
         JOIN users u ON o.user_id = u.id 
         WHERE o.id = ?`,
        [req.params.id]
      );

      if (rows.length > 0) {
        const orderInfo = rows[0];
        // Send Refund Processed Email
        await emailService.sendRefundProcessed(orderInfo.email, orderInfo.id, orderInfo.name);
      }

    } else {
      const [result] = await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
      if (result.affectedRows === 0) {
        res.status(404);
        throw new Error('Order not found');
      }
    }

    res.json({ message: 'Order status updated' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res, next) => {
  try {
    const [result] = await db.query('DELETE FROM orders WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      res.status(404);
      throw new Error('Order not found');
    }

    res.json({ message: 'Order deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/mine
// @access  Private
const getUserOrders = async (req, res, next) => {
  try {
    const query = `
      SELECT o.id, o.total, o.status, o.payment_status, o.created_at,
      JSON_ARRAYAGG(
        JSON_OBJECT('name', p.name_en, 'image', p.image_url, 'qty', oi.quantity, 'price', oi.unit_price)
      ) as items
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC;
    `;
    const [orders] = await db.query(query, [req.user.id]);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Request Refund
// @route   POST /api/orders/:id/refund-request
// @access  Private
const requestRefund = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;

    // Verify Order Ownership
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [orderId, userId]);

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orders[0];

    // Validation: Must be paid (Removed 'delivered' check to allow refunds on all paid orders)
    // if (order.status !== 'delivered') {
    //   return res.status(400).json({ message: 'Refund requests are only available for delivered orders' });
    // }

    if (order.payment_status !== 'paid') {
      return res.status(400).json({ message: 'Order must be paid to request a refund' });
    }

    // Check if already requested
    if (order.payment_status === 'refund_requested') {
      return res.status(400).json({ message: 'Refund already requested for this order' });
    }

    // Update DB Status
    await db.query(
      "UPDATE orders SET payment_status = 'refund_requested' WHERE id = ?",
      [orderId]
    );

    // Send Email
    const userEmail = req.user.email;
    await emailService.sendRefundConfirmation(userEmail, order.order_number || order.id);
    await emailService.sendRefundRequestAdminNotification(order.order_number || order.id);

    logger.info(`Refund Requested: Order ${order.id} by User ${userId}`);

    res.json({ message: 'Refund request submitted successfully' });

  } catch (error) {
    next(error);
  }
};

// @desc    Cancel Order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;

    // Verify Ownership
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [orderId, userId]);
    if (orders.length === 0) return res.status(404).json({ message: 'Order not found' });

    const order = orders[0];

    // Validation: Cannot cancel if already delivered or cancelled
    if (['delivered', 'cancelled', 'refunded'].includes(order.status)) {
      return res.status(400).json({ message: `Cannot cancel order with status: ${order.status}` });
    }

    // specific check: if shipped, typically can't cancel, but user said "any". 
    // I will allow 'shipped' to be cancelled but maybe admin needs to know.
    // For now, simple state update.

    // Update Status
    await db.query("UPDATE orders SET status = 'cancelled' WHERE id = ?", [orderId]);

    // If paid, maybe flag for refund?
    if (order.payment_status === 'paid') {
      // Auto-request refund if cancelled after pay
      await db.query("UPDATE orders SET payment_status = 'refund_requested' WHERE id = ?", [orderId]);
    }

    logger.info(`Order ${orderId} cancelled by User ${userId}`);
    res.json({ message: 'Order cancelled successfully' });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrders,
  getAllOrders,
  getUserOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  requestRefund,
  cancelOrder
};
