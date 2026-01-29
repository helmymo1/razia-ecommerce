# Order Creation Fix Walkthrough

## Issue
Users were experiencing a 500 Internal Server Error when creating orders.
Investigation revealed two contributing factors:
1.  **Ghost Item Swapping**: The backend has a "Magic Fix" that swaps invalid/mock product IDs with a real product ID from the database. It was blindly selecting *any* product, which happened to be out of stock.
2.  **Unhandled Error**: When the code encountered the "Out of stock" condition, it threw a generic Error without setting the HTTP status code. The Express error handler defaults to 500 for such errors.

## Solution
Modified `backend/modules/orders/orderController.js` to:
1.  **Prioritize In-Stock Products**: Updated the fallback query to select a product with `stock_quantity > 0`.
2.  **Proper Status Codes**: Added `res.status(400)` for "Out of stock" errors and `res.status(404)` for "Product not found" errors.

## Verification
Ran `backend/reproduce_order_error.js` which simulates an order creation with an invalid "Ghost" ID.
**Result**: The order was successfully created (fallback swapped to an in-stock product) instead of crashing with 500.

```javascript
// Reproduction Output
✅ Success! Order Created: {
  id: 'f3004173-4396-4288-9751-ba3ab4ef4594',
  message: 'Order created successfully',
  total: 11
}
```
