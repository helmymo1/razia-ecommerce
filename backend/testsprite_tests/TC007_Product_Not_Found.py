import requests

BASE_URL = "http://localhost:5000"
PRODUCTS_ENDPOINT = f"{BASE_URL}/api/products"
TIMEOUT = 30

def test_product_not_found():
    invalid_product_id = "00000000-0000-0000-0000-000000000000"
    url = f"{PRODUCTS_ENDPOINT}/{invalid_product_id}"
    headers = {
        "Accept": "application/json"
    }
    try:
        response = requests.get(url, headers=headers, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"HTTP request failed: {e}"

    # The test expects 404 Not Found
    assert response.status_code == 404, f"Expected 404 Not Found, got {response.status_code}"

    # Optionally validate response content-type
    content_type = response.headers.get("Content-Type", "")
    assert "application/json" in content_type or content_type == "", "Expected JSON or empty content type in response"

    # Try to parse JSON error message if any
    try:
        data = response.json()
        # Minimal validation: check keys or message field does not raise error
        assert isinstance(data, dict), "Response JSON should be an object"
    except ValueError:
        # Response might be empty or not JSON, which is acceptable for 404
        pass

test_product_not_found()