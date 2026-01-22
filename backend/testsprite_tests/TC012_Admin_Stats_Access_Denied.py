import requests

BASE_URL = "http://localhost:5000"
LOGIN_URL = f"{BASE_URL}/api/auth/login"
DASHBOARD_STATS_URL = f"{BASE_URL}/api/dashboard/stats"
TIMEOUT = 30

def test_admin_stats_access_denied():
    login_payload = {
        "email": "user@example.com",
        "password": "123456"
    }

    try:
        login_resp = requests.post(LOGIN_URL, json=login_payload, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Login request failed with exception: {e}"

    # If bad request, check structure and fail test
    if login_resp.status_code == 400:
        try:
            body = login_resp.json()
            assert "email" in login_payload and "password" in login_payload, \
                "Login payload missing required fields"
        except Exception:
            assert False, "400 response but could not validate request body"
        assert False, f"Login failed with 400 Bad Request and payload was valid"

    assert login_resp.status_code == 200, f"Expected 200 OK on login, got {login_resp.status_code}"

    token = None
    try:
        resp_json = login_resp.json()
        token = resp_json.get("token")
    except Exception:
        assert False, "Login response is not valid JSON or missing token"

    assert token and isinstance(token, str), "Login response missing valid 'token'"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    try:
        stats_resp = requests.get(DASHBOARD_STATS_URL, headers=headers, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Dashboard stats request failed with exception: {e}"

    assert stats_resp.status_code in (401, 403), \
        f"Expected 401 Unauthorized or 403 Forbidden, got {stats_resp.status_code}"

test_admin_stats_access_denied()