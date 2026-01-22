import requests
import string
import random

BASE_URL = "http://localhost:5000"
REGISTER_ENDPOINT = "/api/auth/register"
TIMEOUT = 30

def generate_random_email():
    local_part = ''.join(random.choices(string.ascii_lowercase + string.digits, k=12))
    return f"{local_part}@example.com"

def test_register_new_user():
    url = BASE_URL + REGISTER_ENDPOINT
    headers = {"Content-Type": "application/json"}
    # Generate unique user data
    email = generate_random_email()
    payload = {
        "name": "Test User",
        "email": email,
        "password": "StrongPass123!"
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    # Check for created status or bad request
    if response.status_code == 201:
        # Expect a response body containing 'token'
        try:
            resp_json = response.json()
        except ValueError:
            assert False, "Response is not valid JSON"
        assert "token" in resp_json, "Response JSON does not contain 'token'"
    elif response.status_code == 400:
        # Validate error response related to request body structure
        try:
            resp_json = response.json()
        except ValueError:
            assert False, "400 response is not valid JSON"
        # Typically expect some error details about validation - check keys presence
        assert isinstance(resp_json, dict), "400 response body should be a JSON object"
        # It should indicate something about the body structure
        error_found = any(key in resp_json for key in ["error", "message", "errors"])
        assert error_found, "400 response does not contain error details"
    else:
        assert False, f"Unexpected status code: {response.status_code}, response: {response.text}"

test_register_new_user()