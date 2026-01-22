import requests

BASE_URL = "http://localhost:5000"
API_PRODUCTS = "/api/products"
TIMEOUT = 30

def test_list_products_public():
    url = BASE_URL + API_PRODUCTS
    headers = {
        "Accept": "application/json"
    }

    try:
        response = requests.get(url, headers=headers, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request to list products failed: {e}"

    assert response.status_code == 200, f"Expected status 200, got {response.status_code}"
    
    try:
        data = response.json()
    except ValueError:
        assert False, "Response body is not valid JSON"

    # Accept response as a list (common for list endpoints) or dict
    if isinstance(data, dict):
        # Try to find list in keys like 'data' or fallback
        if 'data' in data and isinstance(data['data'], list):
            products = data['data']
        else:
            assert False, "Response JSON dict does not contain 'data' key with a list"
    elif isinstance(data, list):
        products = data
    else:
        assert False, f"Expected response body to be a dict or list, got {type(data)}"

    assert isinstance(products, list), f"Expected products to be a list, got {type(products)}"

    # Optional: check each item in the products list is a dict
    for product in products:
        assert isinstance(product, dict), f"Each product should be a dict, found {type(product)}"


test_list_products_public()
