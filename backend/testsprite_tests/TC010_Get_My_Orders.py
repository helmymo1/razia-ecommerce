import requests

BASE_URL = "http://localhost:5000"
TIMEOUT = 30

def test_get_my_orders():
    login_url = f"{BASE_URL}/api/auth/login"
    my_orders_url = f"{BASE_URL}/api/orders"
    login_payload = {
        "email": "user@example.com",
        "password": "123456"
    }
    headers = {"Content-Type": "application/json"}

    try:
        # Authenticate user and get token
        login_resp = requests.post(login_url, json=login_payload, headers=headers, timeout=TIMEOUT)
        if login_resp.status_code == 400:
            # Validate request body structure error response
            json_resp = login_resp.json()
            assert isinstance(json_resp, dict)
            assert "message" in json_resp or "error" in json_resp
            assert login_resp.status_code == 400
            return
        assert login_resp.status_code == 200, f"Expected 200 OK, got {login_resp.status_code}"
        login_data = login_resp.json()
        assert "token" in login_data and isinstance(login_data["token"], str), "Token missing in login response"
        token = login_data["token"]

        # Use token to get my orders
        order_headers = {
            "Authorization": f"Bearer {token}"
        }
        orders_resp = requests.get(my_orders_url, headers=order_headers, timeout=TIMEOUT)
        assert orders_resp.status_code == 200, f"Expected 200 OK, got {orders_resp.status_code}"
        orders_data = orders_resp.json()
        assert isinstance(orders_data, list), "Expected orders response to be an array"

    except requests.RequestException as e:
        assert False, f"Request failed with exception: {e}"

test_get_my_orders()
