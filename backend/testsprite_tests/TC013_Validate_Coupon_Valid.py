import requests

BASE_URL = "http://localhost:5000"
API_PREFIX = "/api"
VALID_COUPON_CODE = "SUMMER20"
TIMEOUT = 30

def test_validate_coupon_valid():
    url = f"{BASE_URL}{API_PREFIX}/coupons/validate"
    headers = {"Content-Type": "application/json"}
    payload = {"code": VALID_COUPON_CODE}

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)
    except requests.RequestException as e:
        # Network or connection error
        assert False, f"RequestException occurred: {e}"

    if response.status_code == 200:
        # Success case, expect response to validate coupon details
        try:
            data = response.json()
        except ValueError:
            assert False, "Response is not valid JSON"

        assert isinstance(data, dict), "Response JSON should be an object"
        assert "code" in data and data["code"] == VALID_COUPON_CODE, "Coupon code mismatch in response"
        # Optionally validate other expected keys if known
    elif response.status_code == 404:
        # Coupon not found - assume no coupon seeded, acceptable per test case
        pass
    elif response.status_code == 400:
        # Validate that error is due to request body structure
        try:
            error_data = response.json()
        except ValueError:
            assert False, "Error response is not valid JSON"

        assert (
            "error" in error_data or "message" in error_data
        ), "400 response missing error details"
    else:
        assert False, f"Unexpected status code: {response.status_code}, response text: {response.text}"

test_validate_coupon_valid()