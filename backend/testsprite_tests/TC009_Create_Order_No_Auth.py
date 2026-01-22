import requests

def test_create_order_no_auth():
    base_url = "http://localhost:5000"
    url = f"{base_url}/api/orders"
    headers = {
        "Content-Type": "application/json"
    }
    # Sample payload resembling order creation schema but no auth header
    payload = {
        "user_id": "dummy-user-id",
        "total_amount": 100.0,
        "coupon_code": None,
        "order_items": [
            {"product_id": "dummy-product-id", "quantity": 1}
        ]
    }
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    # Validate response status code is 401 Unauthorized
    assert response.status_code == 401, f"Expected 401 Unauthorized, got {response.status_code}"

    # Optionally, if response is 400, validate structure error in request body (defensive)
    if response.status_code == 400:
        try:
            json_resp = response.json()
            # Expect some standard error keys or message about request body
            assert isinstance(json_resp, dict), "400 response body not a dict"
            assert "error" in json_resp or "message" in json_resp, "400 error response missing expected keys"
        except Exception:
            assert False, "Invalid JSON in 400 error response"

test_create_order_no_auth()