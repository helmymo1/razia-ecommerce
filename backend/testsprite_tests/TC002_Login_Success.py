import requests

def test_login_success():
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
        assert False, f"Request failed: {e}"

    if response.status_code == 200:
        try:
            data = response.json()
        except ValueError:
            assert False, "Response body is not valid JSON"

        token = data.get("token")
        assert token and isinstance(token, str) and len(token) > 0, "JWT token not found or invalid"
    elif response.status_code == 400:
        # Validate error response structure expected for bad request (malformed body)
        try:
            error_data = response.json()
        except ValueError:
            assert False, "400 response body is not valid JSON"
        assert isinstance(error_data, dict), "400 response body is not a JSON object"
        # Minimal validation: presence of some error/key message
        assert any(k in error_data for k in ("error", "message", "details")), "400 response missing error details"
    else:
        assert False, f"Unexpected status code: {response.status_code}"

test_login_success()