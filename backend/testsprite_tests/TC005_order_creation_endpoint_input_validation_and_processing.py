import requests
import uuid

BASE_URL = "http://localhost:5000"
API_PREFIX = "/api"
TIMEOUT = 30

def test_order_creation_endpoint_input_validation_and_processing():
    # Credentials for login (assumption: a test user already exists or register new user)
    user_email = f"testuser_{uuid.uuid4().hex[:8]}@example.com"
    user_password = "TestPass123!"

    # Register a new user (to ensure a fresh user for ordering)
    register_url = f"{BASE_URL}{API_PREFIX}/auth/register"
    register_payload = {
        "name": "Test User",
        "email": user_email,
        "password": user_password
    }
    register_resp = requests.post(register_url, json=register_payload, timeout=TIMEOUT)
    assert register_resp.status_code == 201 or register_resp.status_code == 200, f"User registration failed: {register_resp.text}"
    
    try:
        # Login the user to get JWT token
        login_url = f"{BASE_URL}{API_PREFIX}/auth/login"
        login_payload = {"email": user_email, "password": user_password}
        login_resp = requests.post(login_url, json=login_payload, timeout=TIMEOUT)
        assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
        login_data = login_resp.json()
        token = login_data.get("token")
        assert token and isinstance(token, str), "JWT token missing in login response"

        # Headers with Authorization
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        # Fetch some products to build order items
        products_url = f"{BASE_URL}{API_PREFIX}/products"
        products_resp = requests.get(products_url, headers=headers, timeout=TIMEOUT)
        assert products_resp.status_code == 200, f"Failed to get products: {products_resp.text}"
        products_data = products_resp.json()
        assert isinstance(products_data, list) or "items" in products_data, "Invalid product list format"

        # Prepare order items - pick at least one product if available
        order_items = []
        if isinstance(products_data, list):
            if not products_data:
                raise AssertionError("No products available to create an order.")
            first_product = products_data[0]
            product_id = first_product.get("id") or first_product.get("product_id") or first_product.get("_id")
            if not product_id:
                raise AssertionError("Product id missing in product data.")
            order_items.append({
                "product_id": str(product_id),
                "quantity": 2,
                "price": float(first_product.get("price", 10))  # fallback price
            })
        else:
            # Possibly paginated response with items
            items = products_data.get("items") or []
            if not items:
                raise AssertionError("No products found in 'items' to create an order.")
            first_product = items[0]
            product_id = first_product.get("id") or first_product.get("product_id") or first_product.get("_id")
            if not product_id:
                raise AssertionError("Product id missing in product data.")
            order_items.append({
                "product_id": str(product_id),
                "quantity": 2,
                "price": float(first_product.get("price", 10))
            })

        user_id = login_data.get("user_id") or login_data.get("user") and login_data["user"].get("id")
        # If user_id not found in login response, fallback to fetch user info API or register response
        if not user_id:
            # Retry user_id from register resp if available
            reg_json = register_resp.json()
            user_id = reg_json.get("id") or reg_json.get("user_id") or reg_json.get("user", {}).get("id")
        assert user_id, "User ID not found for order creation."

        # Compose valid order payload
        total_amount = sum(item["quantity"] * item["price"] for item in order_items)
        valid_coupon = "DISCOUNT10"  # assume this is a valid coupon code, test will handle if invalid gracefully

        order_url = f"{BASE_URL}{API_PREFIX}/orders"

        # Test case 1: Valid order creation with coupon code
        valid_order_payload = {
            "user_id": str(user_id),
            "total_amount": total_amount,
            "coupon_code": valid_coupon,
            "order_items": order_items
        }
        try:
            valid_order_resp = requests.post(order_url, json=valid_order_payload, headers=headers, timeout=TIMEOUT)
            assert valid_order_resp.status_code in (200,201), f"Order creation failed: {valid_order_resp.text}"
            order_resp_json = valid_order_resp.json()
            # Validate order response structure
            assert order_resp_json.get("id") or order_resp_json.get("order_id"), "Order ID missing in response"
            assert order_resp_json.get("user_id") == str(user_id), "User ID mismatch in order response"
            assert isinstance(order_resp_json.get("order_items"), list) and len(order_resp_json.get("order_items")) > 0, "Order items missing or empty"
            # If coupon is applied, validate it in response
            if "coupon_code" in order_resp_json:
                assert order_resp_json.get("coupon_code") == valid_order_payload["coupon_code"], "Coupon code mismatch in order response"
        finally:
            # Cleanup: attempt to delete order if API supported (not given here, so ignore)
            pass

        # Test case 2: Missing user_id should return 400
        invalid_payload_missing_user = {
            "total_amount": total_amount,
            "coupon_code": valid_coupon,
            "order_items": order_items
        }
        resp = requests.post(order_url, json=invalid_payload_missing_user, headers=headers, timeout=TIMEOUT)
        assert resp.status_code == 400, "Missing user_id should cause 400 error"

        # Test case 3: Missing order_items should return 400
        invalid_payload_missing_items = {
            "user_id": str(user_id),
            "total_amount": total_amount,
            "coupon_code": valid_coupon
        }
        resp = requests.post(order_url, json=invalid_payload_missing_items, headers=headers, timeout=TIMEOUT)
        assert resp.status_code == 400, "Missing order_items should cause 400 error"

        # Test case 4: Invalid total_amount type should return 400
        invalid_payload_bad_amount = {
            "user_id": str(user_id),
            "total_amount": "invalid_amount",
            "order_items": order_items
        }
        resp = requests.post(order_url, json=invalid_payload_bad_amount, headers=headers, timeout=TIMEOUT)
        assert resp.status_code == 400, "Invalid total_amount type should cause 400 error"

        # Test case 5: Empty order_items array should return 400
        invalid_payload_empty_items = {
            "user_id": str(user_id),
            "total_amount": 0,
            "order_items": []
        }
        resp = requests.post(order_url, json=invalid_payload_empty_items, headers=headers, timeout=TIMEOUT)
        assert resp.status_code == 400, "Empty order_items should cause 400 error"

        # Test case 6: Invalid coupon code should still create order without coupon (if system supports)
        invalid_coupon_payload = {
            "user_id": str(user_id),
            "total_amount": total_amount,
            "coupon_code": "INVALIDCOUPONXYZ",
            "order_items": order_items
        }
        resp = requests.post(order_url, json=invalid_coupon_payload, headers=headers, timeout=TIMEOUT)
        # Either success (coupon ignored) or 400 on invalid coupon - accept either and validate accordingly
        assert resp.status_code in (200,201,400), f"Unexpected status for invalid coupon: {resp.status_code}"
        if resp.status_code in (200,201):
            json_resp = resp.json()
            # Ensure coupon_code in response is either missing or different
            coupon_in_resp = json_resp.get("coupon_code")
            if coupon_in_resp:
                assert coupon_in_resp != invalid_coupon_payload["coupon_code"], "Invalid coupon should not be applied"
        else:
            # 400 error path is acceptable
            json_resp = resp.json()
            assert ("coupon" in str(json_resp).lower()) or ("invalid" in str(json_resp).lower()), "Invalid coupon error message expected"

    finally:
        # Cleanup user by deleting if API supports user delete (not specified)
        pass

test_order_creation_endpoint_input_validation_and_processing()