import requests

def test_verify_login_response_structure():
    base_url = "http://localhost:5000"
    login_url = f"{base_url}/api/auth/login"
    payload = {
        "email": "user@example.com",
        "password": "123456"
    }
    headers = {
        "Content-Type": "application/json"
    }
    timeout = 30

    try:
        response = requests.post(login_url, json=payload, headers=headers, timeout=timeout)
    except requests.RequestException as e:
        assert False, f"Request to login endpoint failed: {e}"

    if response.status_code == 400:
        # Validate request body structure error response
        try:
            error_data = response.json()
        except ValueError:
            assert False, "Response with status 400 is not valid JSON"
        assert "message" in error_data or "error" in error_data, \
            "400 response does not contain error details to explain invalid request body"
        return  # Test ends here as request body is invalid
    else:
        assert response.status_code == 200, f"Expected 200 OK but got {response.status_code}"

    try:
        data = response.json()
    except ValueError:
        assert False, "Response body is not valid JSON"

    for key in ["email", "token"]:
        assert key in data, f"Response JSON missing expected key: '{key}'"

test_verify_login_response_structure()
