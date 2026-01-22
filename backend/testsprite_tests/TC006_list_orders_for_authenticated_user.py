import requests

BASE_URL = "http://localhost:5000"
API_PREFIX = "/api"
AUTH_REGISTER_ENDPOINT = f"{BASE_URL}{API_PREFIX}/auth/register"
AUTH_LOGIN_ENDPOINT = f"{BASE_URL}{API_PREFIX}/auth/login"
ORDERS_ENDPOINT = f"{BASE_URL}{API_PREFIX}/orders"

# Credentials for login - using a placeholder admin user for role-based access control
LOGIN_NAME = "Admin User"
LOGIN_EMAIL = "admin@ebazer.com"
LOGIN_PASSWORD = "123456"

def test_list_orders_for_authenticated_user():
    # Step 0: Register the user first to ensure the user exists
    register_payload = {
        "name": LOGIN_NAME,
        "email": LOGIN_EMAIL,
        "password": LOGIN_PASSWORD
    }
    try:
        register_response = requests.post(
            AUTH_REGISTER_ENDPOINT,
            json=register_payload,
            timeout=30
        )
        # It's valid if user already exists (e.g., 409 or similar) or created successfully (201 or 200 depending on implementation)
        assert register_response.status_code in (200, 201, 409), \
            f"User registration failed with status code {register_response.status_code}"
    except requests.RequestException as e:
        assert False, f"Registration request failed: {str(e)}"

    # Step 1: Authenticate to get JWT token
    login_payload = {
        "email": LOGIN_EMAIL,
        "password": LOGIN_PASSWORD
    }
    try:
        login_response = requests.post(
            AUTH_LOGIN_ENDPOINT,
            json=login_payload,
            timeout=30
        )
        assert login_response.status_code == 200, f"Login failed with status code {login_response.status_code}"
        login_data = login_response.json()
        token = login_data.get("token")
        assert token is not None and isinstance(token, str) and len(token) > 0, "Token not received in login response"
    except requests.RequestException as e:
        assert False, f"Login request failed: {str(e)}"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Step 2: Get list of orders for authenticated user
    try:
        orders_response = requests.get(
            ORDERS_ENDPOINT,
            headers=headers,
            timeout=30
        )
        assert orders_response.status_code == 200, f"Expected 200 OK but got {orders_response.status_code}"
        orders_data = orders_response.json()
        # Assert orders_data is a list or dict containing orders list
        assert isinstance(orders_data, (list, dict)), "Orders response is not a list or dictionary"
        # Additional assertion: If dict, it might have 'orders' key or similar
        if isinstance(orders_data, dict):
            # If 'orders' key exists, assert it is a list
            if "orders" in orders_data:
                assert isinstance(orders_data["orders"], list), "'orders' key is not a list"
    except requests.RequestException as e:
        assert False, f"Orders listing request failed: {str(e)}"

    # OPTIONAL: Test role-based access control by attempting access with a non-auth or invalid token
    invalid_headers = {
        "Authorization": "Bearer invalid.token.here"
    }
    try:
        invalid_response = requests.get(
            ORDERS_ENDPOINT,
            headers=invalid_headers,
            timeout=30
        )
        assert invalid_response.status_code in (401, 403), (
            f"Access with invalid token should be unauthorized or forbidden, got {invalid_response.status_code}"
        )
    except requests.RequestException as e:
        # Network errors acceptable as failure here as well
        assert False, f"Request with invalid token failed: {str(e)}"


test_list_orders_for_authenticated_user()
