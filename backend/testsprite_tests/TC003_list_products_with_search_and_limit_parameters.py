import requests

BASE_URL = "http://localhost:5000"
TOKEN = "YOUR_BASIC_TOKEN_HERE"  # Replace with the actual token if available

def test_list_products_with_search_and_limit():
    url = f"{BASE_URL}/api/products"
    headers = {
        "Authorization": f"Basic {TOKEN}"
    }
    params = {
        "search": "shirt",
        "limit": 5
    }
    try:
        response = requests.get(url, headers=headers, params=params, timeout=30)
        response.raise_for_status()
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"
    try:
        data = response.json()
    except ValueError:
        assert False, "Response is not a valid JSON"
    # According to PRD, the response JSON for products list is an array
    assert isinstance(data, list), "Response JSON should be a list"
    assert len(data) <= 5, "Number of products returned exceeds the limit parameter"
    for product in data:
        assert isinstance(product, dict), "Each product should be a dictionary"
        # If search is applied, product name or description should contain the search string (case insensitive)
        name = product.get("name", "").lower()
        description = product.get("description", "").lower() if "description" in product else ""
        search_term = params["search"].lower()
        assert search_term in name or search_term in description, (
            f"Product does not match search term '{params['search']}'"
        )

test_list_products_with_search_and_limit()
