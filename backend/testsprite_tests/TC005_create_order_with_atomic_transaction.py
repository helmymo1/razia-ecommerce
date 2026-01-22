import requests

BASE_URL = "http://localhost:5000"
API_ORDERS = "/api/orders"
AUTH_TOKEN = "Bearer your_actual_token_here"  # Replace with valid token

def test_create_order_with_atomic_transaction():
    url = BASE_URL + API_ORDERS
    headers = {
        "Authorization": AUTH_TOKEN,
        "Content-Type": "application/json"
    }
    # Sample payload for creating an order atomically
    payload = {
        "user_id": "test-user-123",
        "total_amount": 149.99,
        "coupon_code": "NEWYEAR2026",
        "order_items": [
            {"product_id": "prod-001", "quantity": 2, "price": 49.99},
            {"product_id": "prod-002", "quantity": 1, "price": 49.99}
        ]
    }

    # Attempt to create the order
    response = requests.post(url, json=payload, headers=headers, timeout=30)

    # Validate response success and atomic order creation
    assert response.status_code == 201 or response.status_code == 200, f"Failed to create order: {response.text}"
    data = response.json()
    assert "order_id" in data and data["order_id"], "Order ID not returned in response"
    # Confirm returned order data matches request (partial validation)
    assert data.get("user_id") == payload["user_id"]
    assert abs(data.get("total_amount", 0) - payload["total_amount"]) < 0.01
    assert "order_items" in data and len(data["order_items"]) == len(payload["order_items"])
    # Optional: Check coupon_code if present in response
    if "coupon_code" in data:
        assert data["coupon_code"] == payload["coupon_code"]

    # Additional checks for stock locking would be on backend side (not in scope here)
    # Optionally check that stock quantities are updated if API provides that info

test_create_order_with_atomic_transaction()