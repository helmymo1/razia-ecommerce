import requests

BASE_URL = "http://localhost:5000"
API_PREFIX = "/api"
PRODUCTS_ENDPOINT = f"{BASE_URL}{API_PREFIX}/products"
AUTH_HEADER = {"Authorization": "Bearer YOUR_VALID_TOKEN_HERE"}
TIMEOUT = 30


def test_get_product_details_by_id():
    product_id = None
    try:
        list_response = requests.get(PRODUCTS_ENDPOINT, headers=AUTH_HEADER, timeout=TIMEOUT)
        assert list_response.status_code == 200, "Failed to list products to fetch an existing product id."
        products_list = list_response.json()
        # Products response can be dict or list
        if isinstance(products_list, dict):
            # Try to get list from known keys
            if 'data' in products_list and isinstance(products_list['data'], list):
                products = products_list['data']
            else:
                # If no products key, consider empty list
                products = []
        elif isinstance(products_list, list):
            products = products_list
        else:
            products = []

        assert isinstance(products, list) and len(products) > 0, "No products available to test."

        product_id = products[0].get("id")
        assert product_id and isinstance(product_id, str), "Product ID not found or not string in the product listing."

        get_response = requests.get(f"{PRODUCTS_ENDPOINT}/{product_id}", headers=AUTH_HEADER, timeout=TIMEOUT)
        assert get_response.status_code == 200, f"Failed to get product details for ID {product_id}."
        product_details = get_response.json()

        assert isinstance(product_details, dict), "Product details response is not a JSON object."
        assert product_details.get("id") == product_id, "Returned product ID does not match requested ID."

    except requests.exceptions.RequestException as e:
        assert False, f"Request failed: {e}"


test_get_product_details_by_id()
