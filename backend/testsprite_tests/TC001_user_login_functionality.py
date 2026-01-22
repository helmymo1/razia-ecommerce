import requests

BASE_URL = "http://localhost:3000"
LOGIN_ENDPOINT = "/api/auth/login"
TIMEOUT = 30

def test_user_login_functionality():
    url = BASE_URL + LOGIN_ENDPOINT
    headers = {
        "Content-Type": "application/json"
    }

    # Valid credentials (these must be valid in the system for the test to pass)
    valid_payload = {
        "email": "validuser@example.com",
        "password": "validPassword123"
    }

    # Invalid credentials
    invalid_payload = {
        "email": "invaliduser@example.com",
        "password": "wrongPassword"
    }

    # Test with valid credentials - expect success and JWT token in response
    try:
        valid_response = requests.post(url, json=valid_payload, headers=headers, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request failed with exception: {e}"

    assert valid_response.status_code == 200, f"Expected status code 200 for valid login but got {valid_response.status_code}"
    try:
        valid_response_json = valid_response.json()
    except ValueError:
        assert False, "Response is not valid JSON for valid login"

    assert "token" in valid_response_json, "JWT token not found in response for valid login"
    assert isinstance(valid_response_json["token"], str) and len(valid_response_json["token"]) > 0, "Token is empty or invalid"

    # Test with invalid credentials - expect 401 Unauthorized or appropriate error
    try:
        invalid_response = requests.post(url, json=invalid_payload, headers=headers, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request failed with exception: {e}"

    assert invalid_response.status_code in (400, 401), (
        f"Expected status code 400 or 401 for invalid login but got {invalid_response.status_code}")

    # Optional: check error message in response JSON if JSON is returned
    try:
        invalid_response_json = invalid_response.json()
        assert ("error" in invalid_response_json or "message" in invalid_response_json), \
            "No error message returned for invalid login attempt"
    except ValueError:
        # If no JSON, may still be acceptable as long as status is correct
        pass

test_user_login_functionality()
