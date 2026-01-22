import requests

BASE_URL = "http://localhost:5000"
API_PREFIX = "/api"
TIMEOUT = 30

def test_dashboard_statistics_endpoint_data_accuracy():
    login_url = f"{BASE_URL}{API_PREFIX}/auth/login"
    dashboard_url = f"{BASE_URL}{API_PREFIX}/dashboard/stats"
    headers = {"Content-Type": "application/json"}

    # Admin credentials; adjust as needed to match seeded test admin user
    login_payload = {
        "email": "admin@ebazer.com",
        "password": "123456"
    }

    try:
        # Step 1: Login as admin to get JWT token
        login_resp = requests.post(login_url, json=login_payload, headers=headers, timeout=TIMEOUT)
        assert login_resp.status_code in (200, 201), f"Login failed with status {login_resp.status_code}"
        login_data = login_resp.json()

        # Validate response structure contains token
        assert isinstance(login_data, dict), "Login response is not a JSON object"
        token = login_data.get("token")
        assert token and isinstance(token, str), "JWT token not found in login response"

        auth_headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        # Step 2: Request dashboard stats with valid admin token
        stats_resp = requests.get(dashboard_url, headers=auth_headers, timeout=TIMEOUT)
        assert stats_resp.status_code == 200, f"Dashboard stats request failed with status {stats_resp.status_code}"

        stats_data = stats_resp.json()
        assert isinstance(stats_data, dict), "Dashboard stats response is not a JSON object"
        # Check for expected keys that represent business metrics (example keys used)
        expected_metrics = [
            "total_users",
            "total_orders",
            "total_revenue",
            "active_customers",
            "pending_orders",
            "completed_orders"
        ]
        # At least one expected metric should be present (adjust based on actual API definition)
        assert any(key in stats_data for key in expected_metrics), "No expected dashboard metrics found in response"

        # Optional: Validate some metrics are non-negative numbers
        for key in expected_metrics:
            if key in stats_data:
                value = stats_data[key]
                assert isinstance(value, (int, float)), f"Metric '{key}' is not a number"
                assert value >= 0, f"Metric '{key}' has negative value"

        # Step 3: Attempt dashboard stats request with no auth / invalid token to validate access control

        # No auth header
        unauth_resp = requests.get(dashboard_url, timeout=TIMEOUT)
        assert unauth_resp.status_code in (401, 403), f"Unauthenticated access should be denied, got {unauth_resp.status_code}"

        # Invalid token
        invalid_headers = {
            "Authorization": "Bearer invalidtoken",
            "Content-Type": "application/json"
        }
        invalid_resp = requests.get(dashboard_url, headers=invalid_headers, timeout=TIMEOUT)
        assert invalid_resp.status_code in (401, 403), f"Invalid token access should be denied, got {invalid_resp.status_code}"

    except requests.exceptions.RequestException as e:
        assert False, f"Request failed: {e}"

test_dashboard_statistics_endpoint_data_accuracy()