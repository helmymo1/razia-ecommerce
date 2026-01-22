import requests

BASE_URL = "http://localhost:5173"
TOKEN = "BasicTokenPlaceholderXYZ"  # Placeholder token for JWT Bearer token auth
TIMEOUT = 30

def test_list_products_with_filters():
    headers = {
        "Authorization": f"Bearer {TOKEN}",
        "Accept": "application/json"
    }
    search_term = "shirt"
    limit = 5
    params = {
        "search": search_term,
        "limit": limit
    }
    try:
        response = requests.get(f"{BASE_URL}/api/products", headers=headers, params=params, timeout=TIMEOUT)
        assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"
        data = response.json()
        assert isinstance(data, list), "Response JSON is not a list"
        assert len(data) <= limit, f"Returned more items than the limit: {len(data)} > {limit}"
        for product in data:
            assert isinstance(product, dict), "Each product should be a dict"
            # Check that the search term is contained in product title or description (case insensitive)
            title = product.get("title", "") or product.get("name", "") or ""
            description = product.get("description", "") or ""
            combined_text = f"{title} {description}".lower()
            assert search_term.lower() in combined_text, f"Search term '{search_term}' not found in product title or description"
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

test_list_products_with_filters()
