import requests

BASE_URL = "http://localhost:5000"
TIMEOUT = 30

def test_validate_coupon_invalid():
    url = f"{BASE_URL}/api/coupons/validate"
    headers = {"Content-Type": "application/json"}
    payload = {"code": "FAKE123"}

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)
        if response.status_code == 400:
            # Validate that the response body indicates a bad request about the request body structure
            json_resp = response.json()
            assert any(
                key in json_resp for key in ["message", "error", "details"]
            ), "400 response does not contain expected error info."
        else:
            # Expect 404 Not Found for invalid coupon
            assert response.status_code == 404, f"Expected 404 or 400 but got {response.status_code}"
    except requests.exceptions.RequestException as e:
        assert False, f"Request failed: {e}"

test_validate_coupon_invalid()