import requests

BASE_URL = "http://localhost:5000"
API_PREFIX = "/api"
DASHBOARD_STATS_ENDPOINT = f"{BASE_URL}{API_PREFIX}/dashboard/stats"
TIMEOUT = 30

# Assuming the token is available; since credential is empty, normally you'd get this from a login or config
# Here we put a placeholder token string that should be replaced with a valid admin token for the test to work.
ADMIN_TOKEN = "your_admin_jwt_token_here"

def test_get_admin_dashboard_statistics():
    headers = {
        "Authorization": f"Bearer {ADMIN_TOKEN}",
        "Accept": "application/json"
    }
    try:
        response = requests.get(DASHBOARD_STATS_ENDPOINT, headers=headers, timeout=TIMEOUT)
        assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"
        data = response.json()
        # Validate expected keys in the response data
        # Since the PRD mentions statistics data for products, orders, and users,
        # we assert that these keys exist and their values are of a plausible type.
        assert isinstance(data, dict), "Response data should be a JSON object/dict"
        assert "products" in data, "Response missing 'products' key"
        assert "orders" in data, "Response missing 'orders' key"
        assert "users" in data, "Response missing 'users' key"
        # Further validation can check types and values if known, example:
        assert isinstance(data["products"], dict) or isinstance(data["products"], list), "'products' should be dict or list"
        assert isinstance(data["orders"], dict) or isinstance(data["orders"], list), "'orders' should be dict or list"
        assert isinstance(data["users"], dict) or isinstance(data["users"], list), "'users' should be dict or list"
    except requests.exceptions.RequestException as e:
        assert False, f"Request to dashboard stats endpoint failed: {e}"

test_get_admin_dashboard_statistics()