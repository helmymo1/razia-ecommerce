import requests

BASE_URL = "http://localhost:5173"
TIMEOUT = 30
# Basic token auth header placeholder, token should be set here
AUTH_TOKEN = "your_basic_token_here"
HEADERS = {
    "Authorization": f"Basic {AUTH_TOKEN}",
    "Content-Type": "application/json"
}

def test_verify_coupon_code_validity():
    url = f"{BASE_URL}/api/coupons/verify"

    # Prepare test coupon codes
    valid_coupon = "VALIDCOUPON2026"
    invalid_coupon = "INVALIDCOUPON2026"
    expired_coupon = "EXPIREDCOUPON2025"

    # 1. Test valid coupon - expect success
    response_valid = requests.post(url, json={"code": valid_coupon}, headers=HEADERS, timeout=TIMEOUT)
    assert response_valid.status_code == 200, f"Expected 200 OK for valid coupon, got {response_valid.status_code}"
    json_valid = response_valid.json()
    assert "valid" in json_valid and json_valid["valid"] is True, f"Expected coupon to be valid, response: {json_valid}"
    assert "message" in json_valid and isinstance(json_valid["message"], str) and len(json_valid["message"]) > 0

    # 2. Test invalid coupon - expect rejection with error message
    response_invalid = requests.post(url, json={"code": invalid_coupon}, headers=HEADERS, timeout=TIMEOUT)
    assert response_invalid.status_code in (400, 404), f"Expected 400 or 404 for invalid coupon, got {response_invalid.status_code}"
    json_invalid = response_invalid.json()
    assert "valid" in json_invalid and json_invalid["valid"] is False, f"Expected coupon to be invalid, response: {json_invalid}"
    assert "message" in json_invalid and isinstance(json_invalid["message"], str) and len(json_invalid["message"]) > 0

    # 3. Test expired coupon - expect rejection with proper expired message
    response_expired = requests.post(url, json={"code": expired_coupon}, headers=HEADERS, timeout=TIMEOUT)
    assert response_expired.status_code in (400, 404), f"Expected 400 or 404 for expired coupon, got {response_expired.status_code}"
    json_expired = response_expired.json()
    assert "valid" in json_expired and json_expired["valid"] is False, f"Expected coupon to be invalid (expired), response: {json_expired}"
    assert "message" in json_expired and isinstance(json_expired["message"], str) and "expired" in json_expired["message"].lower()

test_verify_coupon_code_validity()