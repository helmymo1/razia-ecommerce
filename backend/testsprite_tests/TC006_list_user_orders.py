import requests
import uuid

BASE_URL = "http://localhost:3000"
TIMEOUT = 30

# Assuming the use of a basic token authentication method but no credential details provided,
# so using a placeholder token. In a real test, replace with valid token.
AUTH_TOKEN = "Bearer PLACEHOLDER_VALID_TOKEN"

def test_list_user_orders():
    headers = {
        "Authorization": AUTH_TOKEN,
        "Accept": "application/json"
    }
    
    user_email = f"testuser_{uuid.uuid4().hex[:8]}@example.com"
    user_password = "TestPass123!"
    user_name = "Test User"
    token = None
    user_id = None
    order_id = None
    
    try:
        # 1. Register a new user
        register_payload = {
            "name": user_name,
            "email": user_email,
            "password": user_password
        }
        register_resp = requests.post(
            f"{BASE_URL}/api/auth/register",
            json=register_payload,
            timeout=TIMEOUT
        )
        assert register_resp.status_code in [200, 201], f"User registration failed: {register_resp.text}"
        
        # 2. Login the user to get JWT token
        login_payload = {
            "email": user_email,
            "password": user_password
        }
        login_resp = requests.post(
            f"{BASE_URL}/api/auth/login",
            json=login_payload,
            timeout=TIMEOUT
        )
        assert login_resp.status_code == 200, f"User login failed: {login_resp.text}"
        login_json = login_resp.json()
        assert "token" in login_json, "JWT token not found in login response"
        token = login_json["token"]
        auth_headers = {
            "Authorization": f"Bearer {token}",
            "Accept": "application/json"
        }
        
        order_payload = {
            "total_amount": 100.0,
            "order_items": [
                {
                    "product_id": "dummy-product-id",
                    "quantity": 1,
                    "price": 100.0
                }
            ]
        }
        order_resp = requests.post(
            f"{BASE_URL}/api/orders",
            json=order_payload,
            headers=auth_headers,
            timeout=TIMEOUT
        )
        assert order_resp.status_code in [200, 201], f"Order creation failed: {order_resp.text}"
        order_json = order_resp.json()
        order_id = order_json.get("id") or order_json.get("_id")
        assert order_id is not None, "Order ID not found in creation response"
        
        list_resp = requests.get(
            f"{BASE_URL}/api/orders",
            headers=auth_headers,
            timeout=TIMEOUT
        )
        assert list_resp.status_code == 200, f"List orders failed: {list_resp.text}"
        list_json = list_resp.json()
        assert isinstance(list_json, (list, dict)), "Expected list or dict response for orders"
        
        orders = []
        if isinstance(list_json, dict):
            if "orders" in list_json and isinstance(list_json["orders"], list):
                orders = list_json["orders"]
            elif "data" in list_json and isinstance(list_json["data"], list):
                orders = list_json["data"]
            else:
                for v in list_json.values():
                    if isinstance(v, list):
                        orders = v
                        break
        elif isinstance(list_json, list):
            orders = list_json
        
        assert any(str(o.get("id") or o.get("_id")) == str(order_id) for o in orders), "Created order not found in order listing"
        
        params = {"page": 1, "limit": 1}
        paginated_resp = requests.get(
            f"{BASE_URL}/api/orders",
            headers=auth_headers,
            params=params,
            timeout=TIMEOUT
        )
        assert paginated_resp.status_code == 200, f"Paginated list orders failed: {paginated_resp.text}"
        paginated_json = paginated_resp.json()
        
        paginated_orders = []
        if isinstance(paginated_json, dict):
            for v in paginated_json.values():
                if isinstance(v, list):
                    paginated_orders = v
                    break
        elif isinstance(paginated_json, list):
            paginated_orders = paginated_json
        
        assert len(paginated_orders) <= 1, "Pagination limit not respected in order listing"
        
    finally:
        if order_id is not None:
            try:
                del_order_resp = requests.delete(
                    f"{BASE_URL}/api/orders/{order_id}",
                    headers=auth_headers,
                    timeout=TIMEOUT
                )
            except Exception:
                pass

test_list_user_orders()
