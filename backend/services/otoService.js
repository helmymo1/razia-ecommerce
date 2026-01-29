const axios = require('axios');
const redisWrapper = require('../config/redis');

// Constants
const OTO_API_URL = 'https://api.tryoto.com/rest/v2';
const TOKEN_CACHE_KEY = 'oto_access_token';
const TOKEN_EXPIRY_SECONDS = 3300; // 55 minutes

// Axios Instance
const otoClient = axios.create({
  baseURL: OTO_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request Interceptor: Attach Token
otoClient.interceptors.request.use(async (config) => {
  try {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    return Promise.reject(error);
  }
});

/**
 * Get Valid Auth Token
 * Checks Redis cache first. If missing, refreshes token using Refresh Token.
 */
const getAuthToken = async () => {
  try {
    // 1. Check Cache
    const cachedToken = await redisWrapper.get(TOKEN_CACHE_KEY);
    if (cachedToken) {
      return cachedToken;
    }

    // 2. Refresh Token
    console.log("🔄 [OTO] Refreshing Access Token...");
    const refreshToken = process.env.OTO_REFRESH_TOKEN;
    
    if (!refreshToken) {
      throw new Error("Missing OTO_REFRESH_TOKEN in env");
    }

    const res = await axios.post(`${OTO_API_URL}/refreshToken`, {
      refresh_token: refreshToken
    });

    const { access_token, expires_in } = res.data;

    if (!access_token) {
      throw new Error("Failed to retrieve access token from OTO");
    }

    // 3. Cache Token
    // Cache for slightly less than expiry (e.g., 55 mins)
    await redisWrapper.setex(TOKEN_CACHE_KEY, TOKEN_EXPIRY_SECONDS, access_token);
    
    console.log("✅ [OTO] Token Refreshed & Cached.");
    return access_token;

  } catch (error) {
    console.error("❌ [OTO] Auth Failed:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Create Shipment
 * @param {object} order - The full order object
 */
/**
 * Create Shipment
 * @param {object} order - The full order object with shipping_address and items
 */
const createShipment = async (order) => {
  try {
    console.log(`🚚 [OTO] Creating Shipment for Order ${order.orderNumber}...`);
    
    // 1. Map Address
    // orders.shipping_address is stored as JSON string in DB, but passed as Object here hopefully.
    // We should parse if string.
    let address = order.shipping_address;
    if (typeof address === 'string') address = JSON.parse(address);

    const customer = {
      name: order.shipping_name,
      email: order.user_email || 'no-email@store.com',
      mobile: order.shipping_phone,
      address: address.address,
      city: address.city || order.shipping_city,
      district: address.district || address.city || order.shipping_city, // Fallback
      country: address.country || 'SA', // Default Saudi Arabia
      lat: address.lat || 0,
      lng: address.lng || 0
    };

    // 2. Map Items
    // order.items might be a JSON array from aggregation or DB query
    let items = order.items;
    if (typeof items === 'string') items = JSON.parse(items);

    const mappedItems = items.map(item => ({
      name: item.product_name_en || item.name_en || 'Product',
      quantity: item.quantity,
      price: item.price || item.unit_price,
      sku: item.product_id ? item.product_id.substring(0, 20) : 'N/A'
    }));

    // 3. Payment Method
    // 'cod' if Cash on Delivery, 'paid' otherwise
    const paymentMethod = (order.paymentMethod === 'COD') ? 'cod' : 'paid';
    const amountToCollect = (paymentMethod === 'cod') ? order.total : 0;

    // 4. Payload Construction
    const payload = {
      orderId: order.orderNumber || order.id,
      payment_method: paymentMethod,
      amount: amountToCollect,
      amount_due: amountToCollect, // Amount driver collects
      currency: 'SAR',
      customer,
      items: mappedItems,
      // Default configurations
      service_type: 'delivery', 
      labelling: 'true' 
    };

    console.log("📦 [OTO] Shipment Payload:", JSON.stringify(payload));

    // 5. Call API
    // Ensure we use the endpoint "/orders" or "/shipments/create" depending on OTO V2 docs.
    // User said "Call this automatically... Payload Logic... Post /createOrder"
    // Usually OTO V2 is POST /orders
    const res = await otoClient.post('/orders', payload);
    
    const { orderId: otoId, success } = res.data; // Adjust based on actual response structure
    // If OTO returns { orderId: 12345, ... }

    if (!otoId) {
        // Fallback or error check
        throw new Error('No OTO ID returned');
    }

    console.log(`✅ [OTO] Shipment Created! ID: ${otoId}`);
    return otoId;

  } catch (error) {
    console.error("❌ [OTO] Create Shipment Failed:", error.response?.data || error.message);
    // Don't throw, return null so we don't break the main flow? 
    // Or throw to alert admin? User said "Save returned otoId". 
    // If it fails, we should probably log error and NOT update delivery_id, but order remains confirmed.
    throw error; 
  }
};

/**
 * Get Tracking Status
 * @param {string} otoId - The OTO Shipment ID
 */
const getTrackingStatus = async (otoId) => {
    try {
        if (!otoId) throw new Error("No Delivery ID provided");
        
        console.log(`🔍 [OTO] Fetching tracking for Shipment ${otoId}...`);
        
        // Adjust endpoint based on OTO V2 docs. Usually /shipments/{id}/tracking or similar.
        // Assuming: GET /shipments/{otoId} returns status history
        // Or could be POST /track
        // User prompt says: GET /shipments/{otoId}/tracking
        
        const res = await otoClient.get(`/shipments/${otoId}/tracking`);
        return res.data; // Should contain status and events
        
    } catch (error) {
        console.error("❌ [OTO] Tracking Failed:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Cancel Shipment
 * @param {string} otoId 
 */
const cancelShipment = async (otoId) => {
    try {
        if (!otoId) return { success: true, message: "No ID to cancel" };

        console.log(`🛑 [OTO] Cancelling Shipment ${otoId}...`);
        
        // Endpoint: POST /shipments/{id}/cancel or similar
        // If OTO says "driver assigned", it might fail.
        
        const res = await otoClient.post(`/shipments/${otoId}/cancel`);
        console.log("✅ [OTO] Shipment Cancelled Successfully");
        return res.data;

    } catch (error) {
        console.error("❌ [OTO] Cancellation Failed:", error.response?.data || error.message);
        // If OTO returns 400 "Cannot cancel", we should propagate this error to block admin action?
        // User says: "If OTO returns 'Cannot cancel', throw an error to the Admin."
        throw new Error(error.response?.data?.message || "OTO says cannot cancel shipment");
    }
};

/**
 * Create Return Shipment
 * @param {object} order 
 * @param {array} items - Specific items to return
 */
const createReturn = async (order, items) => {
    try {
        console.log(`↩️ [OTO] Creating Return Shipment for Order ${order.id}...`);

        // Similar to createShipment but Direction: Customer -> Warehouse
        // Assuming OTO has a specific 'return' type or we swap addresses.
        // User says: "From customer.address TO warehouse.address"

        // Warehouse Address (Hardcoded or from Config)
        const warehouse = {
            name: "Razia Store Warehouse",
            email: "returns@raziastore.com",
            mobile: "966500000000",
            address: "Riyadh Logistics Park",
            city: "Riyadh",
            district: "Industrial Zone",
            country: "SA"
        };

        // Map Customer Address (Sender now)
        let customerAddress = order.shipping_address;
        if (typeof customerAddress === 'string') customerAddress = JSON.parse(customerAddress);

         const sender = {
            name: order.shipping_name,
            email: order.user_email,
            mobile: order.shipping_phone,
            address: customerAddress.address,
            city: customerAddress.city || order.shipping_city,
            district: customerAddress.district || customerAddress.city,
            country: customerAddress.country || 'SA'
        };

        // Map Items
        const mappedItems = items.map(item => ({
            name: item.product_name_en || item.name || 'Product',
            quantity: item.quantity || item.refund_quantity || 1, // Refund quantity
            price: item.price || item.unit_price,
            sku: item.product_id ? item.product_id.substring(0,20) : 'N/A'
        }));

        const payload = {
            orderId: `RET-${order.orderNumber || order.id}`,
            service_type: 'return', // OTO 'return' service
            payment_method: 'paid', // Usually returns are prepaid or handled by merchant
            amount: 0,
            amount_due: 0,
            currency: 'SAR',
            customer: sender, // Pickup from Customer
            // OTO might expect 'validation' or 'consignee' as Warehouse?
            // Usually for returns, 'customer' is the pickup location.
            items: mappedItems
        };

        // If OTO API differs for returns, adjust here.
        // Assuming same endpoint /orders with service_type='return' or specific /returns
        // Check docs if available, else assume standard creation with type.
        
        const res = await otoClient.post('/orders', payload);
        const { orderId: otoId } = res.data;

        if (!otoId) throw new Error("No Return ID returned");
        
        console.log(`✅ [OTO] Return Shipment Created! ID: ${otoId}`);
        return otoId;

    } catch (error) {
         console.error("❌ [OTO] Create Return Failed:", error.response?.data || error.message);
         throw error;
    }
};

/**
 * Get Airway Bill (Label)
 * @param {string} otoId 
 */
const getAirwayBill = async (otoId) => {
    try {
        if (!otoId) throw new Error("No Delivery ID provided");

        console.log(`📄 [OTO] Fetching Label for ${otoId}...`);

        // Endpoint: GET /shipments/{id}/label or /airwayBill
        // Response usually contains { url: "https://..." } or raw PDF buffer
        // Assuming OTO returns a URL to the PDF.
        
        const res = await otoClient.get(`/shipments/${otoId}/label`);
        
        // If response is binary (PDF), we might need to handle differently.
        // But usually REST APIs return a public URL for the label.
        
        const { url } = res.data; 
        // If it returns raw bytes, we might need to proxy it. 
        // Let's assume URL for now as per "Action 2: Call OTO API to get the PDF label URL"
        
        if (!url) throw new Error("No label URL returned");

        return url;

    } catch (error) {
        console.error("❌ [OTO] Get Label Failed:", error.response?.data || error.message);
        throw error;
    }
};

module.exports = {
  otoClient,
  getAuthToken,
  createShipment,
  getTrackingStatus,
  cancelShipment,
  createReturn,
  getAirwayBill
};
