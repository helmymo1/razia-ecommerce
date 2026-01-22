import requests
import uuid

BASE_URL = "http://localhost:5173"
TIMEOUT = 30

def test_create_order_with_transaction_safety():
    register_url = f"{BASE_URL}/api/auth/register"
    login_url = f"{BASE_URL}/api/auth/login"
    coupons_verify_url = f"{BASE_URL}/api/coupons/verify"
    products_url = f"{BASE_URL}/api/products"
    orders_url = f"{BASE_URL}/api/orders"
    headers = {"Content-Type": "application/json"}

    test_email = f"testuser_{uuid.uuid4().hex[:8]}@example.com"
    test_password = "TestPass123!"

    register_payload = {
        "name": "Test User",
        "email": test_email,
        "password": test_password
    }
    register_resp = requests.post(register_url, json=register_payload, headers=headers, timeout=TIMEOUT)
    assert register_resp.status_code == 200

    login_payload = {
        "email": test_email,
        "password": test_password
    }
    login_resp = requests.post(login_url, json=login_payload, headers=headers, timeout=TIMEOUT)
    assert login_resp.status_code == 200
    login_data = login_resp.json()
    assert "token" in login_data and isinstance(login_data["token"], str)
    token = login_data["token"]

    auth_headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }

    products_resp = requests.get(products_url, headers=auth_headers, timeout=TIMEOUT)
    assert products_resp.status_code == 200
    products_data = products_resp.json()
    assert isinstance(products_data, list) or ("products" in products_data and isinstance(products_data["products"], list))

    products_list = products_data if isinstance(products_data, list) else products_data.get("products", [])
    assert len(products_list) > 0

    product = products_list[0]
    product_id = product.get("id")
    assert product_id is not None

    order_items = [{"product_id": product_id, "quantity": 1}]

    test_coupon_code = "TESTCOUPON123"
    verify_coupon_payload = {"code": test_coupon_code}
    coupon_verify_resp = requests.post(coupons_verify_url, json=verify_coupon_payload, headers=auth_headers, timeout=TIMEOUT)

    apply_coupon = False
    if coupon_verify_resp.status_code == 200:
        cdata = coupon_verify_resp.json()
        if cdata.get("valid") is True or cdata.get("isValid") is True:
            apply_coupon = True

    # Use user_id from login data or fallback empty string
    user_id = login_data.get("user_id") or login_data.get("id") or ""

    order_payload = {
        "user_id": user_id,
        "total_amount": product.get("price") if product.get("price") is not None else 10.0,
        "order_items": order_items
    }
    if apply_coupon:
        order_payload["coupon_code"] = test_coupon_code

    created_order_id = None

    try:
        order_resp = requests.post(orders_url, json=order_payload, headers=auth_headers, timeout=TIMEOUT)
        assert order_resp.status_code in (200, 201)
        order_data = order_resp.json()
        assert "id" in order_data
        created_order_id = order_data["id"]

        if apply_coupon:
            assert order_data.get("total_amount") is not None
            assert order_data["total_amount"] <= order_payload["total_amount"]

        bad_order_items = [{"product_id": product_id, "quantity": 10000}]
        bad_order_payload = {
            "user_id": order_payload["user_id"],
            "total_amount": 1000000,
            "order_items": bad_order_items
        }
        bad_order_resp = requests.post(orders_url, json=bad_order_payload, headers=auth_headers, timeout=TIMEOUT)
        assert 400 <= bad_order_resp.status_code < 500
        bad_order_data = bad_order_resp.json()
        assert "id" not in bad_order_data

    finally:
        if created_order_id:
            del_url = f"{orders_url}/{created_order_id}"
            try:
                del_resp = requests.delete(del_url, headers=auth_headers, timeout=TIMEOUT)
                assert del_resp.status_code in (200, 204)
            except Exception:
                pass

test_create_order_with_transaction_safety()
