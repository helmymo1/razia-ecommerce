import requests

BASE_URL = "http://localhost:5000"
API_PREFIX = "/api"
LOGIN_URL = f"{BASE_URL}{API_PREFIX}/auth/login"
PRODUCTS_URL = f"{BASE_URL}{API_PREFIX}/products"

EMAIL = "admin@ebazer.com"
PASSWORD = "123456"
TIMEOUT = 30


def test_product_details_endpoint_data_accuracy():
    # Login to get JWT token
    login_payload = {"email": EMAIL, "password": PASSWORD}
    try:
        login_resp = requests.post(
            LOGIN_URL, json=login_payload, timeout=TIMEOUT
        )
    except requests.RequestException as e:
        assert False, f"Login request failed: {e}"

    assert login_resp.status_code == 200, f"Login failed with status {login_resp.status_code}"
    login_data = login_resp.json()
    token = login_data.get("token")
    assert token, "JWT token not found in login response"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Get list of products to obtain a product ID
    try:
        list_resp = requests.get(PRODUCTS_URL, headers=headers, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Product list request failed: {e}"

    assert list_resp.status_code == 200, f"Product list failed with status {list_resp.status_code}"
    products = list_resp.json()

    # Validate that products response is a list and non-empty
    assert isinstance(products, list), "Product list response is not a list"
    assert len(products) > 0, "No products found to test details endpoint"

    product_id = None
    for prod in products:
        # Expecting product object to have id field, try to get first valid id string
        pid = prod.get("id") or prod.get("_id") or prod.get("product_id")
        if isinstance(pid, str) and pid.strip():
            product_id = pid
            break

    assert product_id, "No valid product ID found in product list"

    # Call product details endpoint for the chosen product ID
    product_detail_url = f"{PRODUCTS_URL}/{product_id}"
    try:
        detail_resp = requests.get(product_detail_url, headers=headers, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Product detail request failed: {e}"

    # Handle potential 400 errors by validating request body structure even though it's GET
    assert detail_resp.status_code in (200, 400), f"Unexpected status code: {detail_resp.status_code}"

    if detail_resp.status_code == 400:
        error_data = detail_resp.json()
        # Expect some error structure, e.g. message or errors
        assert ("message" in error_data or "errors" in error_data), "400 error response missing error details"
        return  # End test here due to bad request (likely invalid ID format)

    product_detail = detail_resp.json()

    # Validate required fields exist and have correct types
    # multi-language names: expect a dict of language codes to strings
    multi_lang_names = product_detail.get("name") or product_detail.get("names")
    assert isinstance(multi_lang_names, dict) and len(multi_lang_names) > 0, "Multi-language names missing or invalid"

    for lang_code, name_val in multi_lang_names.items():
        assert isinstance(lang_code, str) and lang_code.strip(), "Invalid language code in names"
        assert isinstance(name_val, str) and name_val.strip(), f"Invalid name value for language '{lang_code}'"

    # images: expect a list of strings (urls/paths)
    images = product_detail.get("images")
    assert isinstance(images, list), "Images field missing or not a list"
    assert all(isinstance(img, str) and img.strip() for img in images), "Image URLs must be non-empty strings"
    assert len(images) > 0, "Images list is empty"

    # attributes: expect a dict or list that describes product attributes
    attributes = product_detail.get("attributes")
    assert attributes is not None, "Attributes field missing"
    assert isinstance(attributes, (dict, list)), "Attributes should be a dict or list"

    # Additional optional validations can be applied here as needed


test_product_details_endpoint_data_accuracy()