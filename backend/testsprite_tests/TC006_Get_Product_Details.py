import requests

BASE_URL = "http://localhost:5000"
API_PREFIX = "/api"
TIMEOUT = 30


def test_get_product_details():
    products_url = f"{BASE_URL}{API_PREFIX}/products"
    try:
        # Step 1: List products to get an ID
        resp_list = requests.get(products_url, timeout=TIMEOUT)
        assert resp_list.status_code == 200, f"Expected 200 OK, got {resp_list.status_code}"
        resp_json = resp_list.json()
        # The response is likely an object containing product list under a key such as 'data' or 'products'
        if isinstance(resp_json, dict):
            if 'data' in resp_json and isinstance(resp_json['data'], list):
                products = resp_json['data']
            elif 'products' in resp_json and isinstance(resp_json['products'], list):
                products = resp_json['products']
            else:
                # Fallback to checking if the dict itself has the expected list of products
                products = []
        elif isinstance(resp_json, list):
            products = resp_json
        else:
            products = []

        assert isinstance(products, list), f"Expected response to be a list, got {type(products)}"
        assert len(products) > 0, "Product list is empty, cannot test product details"

        product_id = None
        for prod in products:
            # Basic validation of product object to find valid id
            if isinstance(prod, dict) and "id" in prod:
                product_id = prod["id"]
                break
            # Sometimes product id might be under '_id' or 'product_id', try alternatives
            if isinstance(prod, dict):
                if "_id" in prod:
                    product_id = prod["_id"]
                    break
                if "product_id" in prod:
                    product_id = prod["product_id"]
                    break
        assert product_id, "No valid product ID found in product list"

        # Step 2: GET product details by ID
        product_detail_url = f"{products_url}/{product_id}"
        resp_detail = requests.get(product_detail_url, timeout=TIMEOUT)
        assert resp_detail.status_code == 200, f"Expected 200 OK for product details, got {resp_detail.status_code}"

        product_detail = resp_detail.json()
        assert isinstance(product_detail, dict), "Product detail response should be a JSON object"

        # Validate some expected keys - based on common product fields and PRD
        expected_keys = ["id", "name", "price", "description"]
        # Allow for multi-language names or alternative keys
        keys_present = product_detail.keys()
        # Check that at least one of the expected keys exists
        key_match = any(k in keys_present for k in expected_keys)
        assert key_match, f"Product detail missing expected keys; found keys: {list(keys_present)}"

    except requests.exceptions.ReadTimeout:
        assert False, "Request timed out"
    except requests.exceptions.ConnectionError:
        assert False, "Failed to connect to API server"


test_get_product_details()
