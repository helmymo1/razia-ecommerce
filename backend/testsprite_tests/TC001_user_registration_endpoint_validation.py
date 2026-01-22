import requests
import uuid

BASE_URL = "http://localhost:5000"
API_PREFIX = "/api"
REGISTER_ENDPOINT = f"{BASE_URL}{API_PREFIX}/auth/register"
LOGIN_ENDPOINT = f"{BASE_URL}{API_PREFIX}/auth/login"
TIMEOUT = 30
HEADERS = {"Content-Type": "application/json"}


def test_user_registration_endpoint_validation():
    # Generate unique user data
    unique_str = str(uuid.uuid4())
    user_data = {
        "name": f"Test User {unique_str}",
        "email": f"testuser_{unique_str}@example.com",
        "password": "StrongP@ssw0rd123"
    }

    try:
        # Attempt registration with valid data
        response = requests.post(REGISTER_ENDPOINT, json=user_data, headers=HEADERS, timeout=TIMEOUT)
        assert response.status_code == 201, f"Expected status 201 Created but got {response.status_code}"
        resp_json = response.json()
        # Expect some user ID or success indication in response
        assert "id" in resp_json or "user" in resp_json or "message" in resp_json, "Response does not contain expected registration result"

        # Try to login with the newly created user to verify password hashing and auth is enforced
        login_payload = {"email": user_data["email"], "password": user_data["password"]}
        login_resp = requests.post(LOGIN_ENDPOINT, json=login_payload, headers=HEADERS, timeout=TIMEOUT)
        assert login_resp.status_code == 200, f"Login failed with status {login_resp.status_code}"
        login_json = login_resp.json()
        # JWT token or access token expected
        assert any(k in login_json for k in ("token", "accessToken", "jwt")), "Login response does not contain JWT token"
        
        # Test registration failure with missing fields - missing password
        invalid_payload = {
            "name": "Invalid User",
            "email": "invalid@example.com"
            # password missing intentionally
        }
        err_resp = requests.post(REGISTER_ENDPOINT, json=invalid_payload, headers=HEADERS, timeout=TIMEOUT)
        assert err_resp.status_code == 400, f"Expected status 400 Bad Request for missing password but got {err_resp.status_code}"
        err_json = err_resp.json()
        # Validate error structure - commonly contains message or details about validation
        assert any(key in err_json for key in ("message", "error", "details")), "Error response missing descriptive message"

        # Test registration failure with invalid email format
        invalid_email_payload = {
            "name": "Invalid Email User",
            "email": "not-an-email",
            "password": "somepassword"
        }
        err_resp2 = requests.post(REGISTER_ENDPOINT, json=invalid_email_payload, headers=HEADERS, timeout=TIMEOUT)
        assert err_resp2.status_code == 400, f"Expected status 400 Bad Request for invalid email but got {err_resp2.status_code}"
        err_json2 = err_resp2.json()
        assert any(key in err_json2 for key in ("message", "error", "details")), "Error response missing descriptive message for invalid email"

        # Test duplicate email registration handling (attempt to register same email again)
        duplicate_resp = requests.post(REGISTER_ENDPOINT, json=user_data, headers=HEADERS, timeout=TIMEOUT)
        # Server might respond with 400 or 409 conflict for duplicates depending on implementation
        assert duplicate_resp.status_code in (400, 409), f"Expected 400 or 409 for duplicate registration but got {duplicate_resp.status_code}"
        duplicate_json = duplicate_resp.json()
        assert any(key in duplicate_json for key in ("message", "error", "details")), "Duplicate registration error response missing message"

    except requests.exceptions.RequestException as e:
        assert False, f"HTTP request failed: {e}"


test_user_registration_endpoint_validation()