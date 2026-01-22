import requests
import uuid

BASE_URL = "http://localhost:5000"
REGISTER_ENDPOINT = "/api/auth/register"
TIMEOUT = 30

# Using a basic token with empty credentials as per instructions (no credential details provided)
HEADERS = {
    "Authorization": "Basic ",
    "Content-Type": "application/json"
}


def test_user_registration_process():
    # Generate unique email for testing valid registration
    unique_email = f"testuser_{uuid.uuid4().hex}@example.com"
    password = "StrongPass123!"
    name = "Test User"

    # Valid user registration payload
    valid_payload = {
        "name": name,
        "email": unique_email,
        "password": password
    }

    # Invalid user registration payloads
    invalid_payloads = [
        # Missing email
        {"name": name, "password": password},
        # Missing password
        {"name": name, "email": f"missingpass_{uuid.uuid4().hex}@example.com"},
        # Invalid email format
        {"name": name, "email": "invalid-email-format", "password": password},
        # Empty name
        {"name": "", "email": f"emptyname_{uuid.uuid4().hex}@example.com", "password": password},
    ]

    # Register with valid data should succeed
    response = requests.post(
        BASE_URL + REGISTER_ENDPOINT,
        json=valid_payload,
        headers=HEADERS,
        timeout=TIMEOUT
    )
    try:
        assert response.status_code == 201 or response.status_code == 200, f"Expected 200 or 201, got {response.status_code}"
        data = response.json()
        # Expect at least success indication or a user id / token (schema not specified exactly)
        assert ("id" in data or "user" in data or "token" in data), "Expected user id or token in response"
    except Exception as e:
        raise AssertionError(f"Valid registration failed: {e}")

    # Register with duplicate email should fail
    dup_response = requests.post(
        BASE_URL + REGISTER_ENDPOINT,
        json=valid_payload,
        headers=HEADERS,
        timeout=TIMEOUT
    )
    try:
        assert dup_response.status_code != 200 and dup_response.status_code != 201, f"Expected failure status for duplicate email but got {dup_response.status_code}"
        dup_data = dup_response.json()
        # Expect an error message indicating duplicate or conflict
        assert any(
            x in dup_data.get("message", "").lower()
            for x in ["duplicate", "already", "exists", "conflict"]
        ), "Expected duplicate email error message"
    except Exception as e:
        raise AssertionError(f"Duplicate registration check failed: {e}")

    # Register with various invalid payloads should fail
    for invalid_payload in invalid_payloads:
        resp = requests.post(
            BASE_URL + REGISTER_ENDPOINT,
            json=invalid_payload,
            headers=HEADERS,
            timeout=TIMEOUT
        )
        try:
            assert resp.status_code == 400 or resp.status_code == 422, f"Expected 400/422 for invalid payload but got {resp.status_code}"
            err_data = resp.json()
            assert "error" in err_data or "message" in err_data, "Expected error message in response"
        except Exception as e:
            raise AssertionError(f"Invalid registration payload check failed: {e}")


test_user_registration_process()