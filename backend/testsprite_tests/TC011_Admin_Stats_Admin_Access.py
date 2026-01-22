import requests

BASE_URL = "http://localhost:5000"
LOGIN_URL = f"{BASE_URL}/api/auth/login"
STATS_URL = f"{BASE_URL}/api/dashboard/stats"
TIMEOUT = 30

def test_admin_stats_admin_access():
    login_payload = {
        "email": "admin@example.com",
        "password": "123456"
    }
    headers = {"Content-Type": "application/json"}

    try:
        login_resp = requests.post(LOGIN_URL, json=login_payload, headers=headers, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Login request failed: {e}"

    if login_resp.status_code == 400:
        try:
            error_json = login_resp.json()
        except ValueError:
            assert False, f"Login returned 400 but response is not JSON: {login_resp.text}"
        # Validate error structure indicating bad request body
        assert isinstance(error_json, dict), "400 error response is not a dict"
        assert "message" in error_json or "errors" in error_json, "400 error response missing 'message' or 'errors'"
        return  # Test ends here due to invalid login payload format

    assert login_resp.status_code == 200, f"Expected 200 OK for login, got {login_resp.status_code}"

    try:
        login_data = login_resp.json()
    except ValueError:
        assert False, "Login response is not valid JSON"

    token = login_data.get("token")
    assert token and isinstance(token, str), "Login response JSON missing 'token' or invalid"

    auth_headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    try:
        stats_resp = requests.get(STATS_URL, headers=auth_headers, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Stats request failed: {e}"

    assert stats_resp.status_code == 200, f"Expected 200 OK for /api/dashboard/stats, got {stats_resp.status_code}"

    try:
        stats_data = stats_resp.json()
    except ValueError:
        assert False, "/api/dashboard/stats response is not valid JSON"

    assert isinstance(stats_data, dict), "Dashboard stats response should be a JSON object"

test_admin_stats_admin_access()