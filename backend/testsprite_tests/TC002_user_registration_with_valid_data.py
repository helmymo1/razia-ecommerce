import requests
import uuid

BASE_URL = "http://localhost:5000"
REGISTER_ENDPOINT = f"{BASE_URL}/api/auth/register"
TIMEOUT = 30

def test_user_registration_with_valid_data():
    unique_email = f"testuser_{uuid.uuid4().hex[:8]}@example.com"
    payload = {
        "name": "Test User",
        "email": unique_email,
        "password": "SecurePass123!"
    }
    headers = {
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(REGISTER_ENDPOINT, json=payload, headers=headers, timeout=TIMEOUT)
        assert response.status_code == 201 or response.status_code == 200, \
            f"Expected status code 200 or 201 but got {response.status_code}. Response: {response.text}"

        data = response.json()
        # Validate returned user data
        assert "name" in data and data["name"] == payload["name"], "Name mismatch in response"
        assert "email" in data and data["email"] == payload["email"], "Email mismatch in response"
        # Password should not be returned for security reasons
        assert "password" not in data, "Password should not be present in response data"

        # Optionally validate presence of user id or token if returned
        assert ("id" in data and data["id"]) or ("token" in data and data["token"]), \
            "Response should contain user ID or authentication token"

    except requests.exceptions.RequestException as e:
        assert False, f"HTTP request failed: {e}"

test_user_registration_with_valid_data()