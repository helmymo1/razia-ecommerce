import requests

BASE_URL = "http://localhost:5000"
LOGIN_ENDPOINT = f"{BASE_URL}/api/auth/login"
TIMEOUT = 30

def test_user_login_endpoint_authentication():
    headers = {"Content-Type": "application/json"}

    # Valid credentials for testing (should exist in seeded test data)
    valid_payload = {
        "email": "admin@ebazer.com",
        "password": "123456"
    }

    # Invalid credentials for negative test
    invalid_payload = {
        "email": "admin@ebazer.com",
        "password": "wrongpassword"
    }

    # Malformed payload for 400 error simulation (missing password field)
    malformed_payload = {
        "email": "admin@ebazer.com"
    }

    # Test successful login
    try:
        response = requests.post(LOGIN_ENDPOINT, json=valid_payload, headers=headers, timeout=TIMEOUT)
        assert response.status_code == 200, f"Expected 200 OK, got {response.status_code}"
        data = response.json()
        assert isinstance(data, dict), "Response JSON should be a dictionary"
        # Check for presence of JWT token (commonly under 'token' or 'accessToken')
        token = data.get("token") or data.get("accessToken")
        assert token is not None and isinstance(token, str) and len(token) > 10, "JWT token missing or invalid in response"
    except requests.RequestException as e:
        assert False, f"Request failed during valid login test: {e}"

    # Test invalid login (wrong password)
    try:
        response = requests.post(LOGIN_ENDPOINT, json=invalid_payload, headers=headers, timeout=TIMEOUT)
        # Assuming API returns 401 or 400 for invalid credentials
        assert response.status_code in (400, 401, 403), f"Expected 400/401/403 for invalid login, got {response.status_code}"
        data = response.json()
        # Expect some error message in response
        assert "error" in data or "message" in data, "Error message missing in invalid login response"
    except requests.RequestException as e:
        assert False, f"Request failed during invalid login test: {e}"

    # Test malformed login payload (missing password)
    try:
        response = requests.post(LOGIN_ENDPOINT, json=malformed_payload, headers=headers, timeout=TIMEOUT)
        # Expecting 400 Bad Request due to missing fields
        assert response.status_code == 400, f"Expected 400 Bad Request for malformed payload, got {response.status_code}"
        data = response.json()
        assert "error" in data or "message" in data, "Error message missing in malformed payload response"
    except requests.RequestException as e:
        assert False, f"Request failed during malformed payload test: {e}"

test_user_login_endpoint_authentication()