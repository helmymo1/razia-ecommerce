import requests

BASE_URL = "http://localhost:5173"
TOKEN = ""  # Insert a valid admin token here

def test_retrieve_admin_dashboard_statistics():
    url = f"{BASE_URL}/api/dashboard/stats"
    headers = {
        "Authorization": f"Bearer {TOKEN}",
        "Accept": "application/json"
    }
    try:
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 200, f"Expected status 200 but got {response.status_code}"
    try:
        data = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    # Basic validations for presence of expected keys in the dashboard stats
    expected_keys = ['totalUsers', 'totalOrders', 'totalRevenue', 'lastUpdated']
    missing_keys = [key for key in expected_keys if key not in data]
    assert not missing_keys, f"Missing keys in response data: {missing_keys}"

    # Additional basic assertions for data sanity (optional, depends on actual data)
    assert isinstance(data['totalUsers'], int) and data['totalUsers'] >= 0, "Invalid totalUsers value"
    assert isinstance(data['totalOrders'], int) and data['totalOrders'] >= 0, "Invalid totalOrders value"
    assert isinstance(data['totalRevenue'], (int, float)) and data['totalRevenue'] >= 0, "Invalid totalRevenue value"
    assert isinstance(data['lastUpdated'], str) and len(data['lastUpdated']) > 0, "Invalid lastUpdated value"

test_retrieve_admin_dashboard_statistics()