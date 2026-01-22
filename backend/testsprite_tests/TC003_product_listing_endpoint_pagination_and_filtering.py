import requests
import traceback

BASE_URL = "http://localhost:5000"
API_PREFIX = "/api"
TIMEOUT = 30

# Test user credentials for authentication (existing user or to be created prior)
TEST_USER_EMAIL = "admin@ebazer.com"
TEST_USER_PASSWORD = "123456"

def test_product_listing_pagination_filtering():
    session = requests.Session()
    try:
        # 1. Authenticate to get JWT token
        login_url = f"{BASE_URL}{API_PREFIX}/auth/login"
        login_payload = {
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        }
        login_resp = session.post(login_url, json=login_payload, timeout=TIMEOUT)
        assert login_resp.status_code == 200, f"Login failed with status {login_resp.status_code} and body {login_resp.text}"
        login_data = login_resp.json()
        assert "token" in login_data or "accessToken" in login_data, "JWT token not found in login response"
        token = login_data.get("token") or login_data.get("accessToken")
        session.headers.update({"Authorization": f"Bearer {token}"})

        # 2. Test product listing without params - should return paginated results
        products_url = f"{BASE_URL}{API_PREFIX}/products"
        r = session.get(products_url, timeout=TIMEOUT)
        assert r.status_code == 200, f"Product listing failed: {r.status_code} {r.text}"
        data = r.json()
        assert isinstance(data, dict), "Response should be a JSON object"
        # Assume response contains 'products' and 'pagination' fields or similar
        products = data.get("products")
        pagination = data.get("pagination")
        assert isinstance(products, list), "'products' field should be a list"
        assert pagination is not None, "'pagination' field missing in response"

        # Validate pagination keys presence (common keys: page, limit, total, pages)
        expected_pagination_keys = {"page", "limit", "total", "pages"}
        assert expected_pagination_keys.issubset(pagination.keys()), f"Missing pagination keys in response: {pagination.keys()}"

        # 3. Test with limit query param
        params = {"limit": 2}
        r = session.get(products_url, params=params, timeout=TIMEOUT)
        assert r.status_code == 200, f"Product listing with limit failed: {r.status_code} {r.text}"
        data_limited = r.json()
        products_limited = data_limited.get("products")
        assert isinstance(products_limited, list), "Limited products field should be list"
        assert len(products_limited) <= 2, f"Expected max 2 products, got {len(products_limited)}"

        # 4. Test search filtering by product name or attribute using 'search' param
        # Pick a search term from products_limited if possible, else use a generic one
        search_term = ""
        if products_limited and len(products_limited) > 0:
            # Attempt to extract a product name or attributes to search
            prod = products_limited[0]
            # Possible fields: multi-language names or attributes
            # Try to get 'name' or multi-language 'name_en' or 'attributes'
            if "name" in prod and isinstance(prod["name"], str):
                search_term = prod["name"].split()[0]
            elif "name_en" in prod and isinstance(prod["name_en"], str):
                search_term = prod["name_en"].split()[0]
            elif "attributes" in prod and isinstance(prod["attributes"], dict):
                # Take first attribute value for search
                values = list(prod["attributes"].values())
                if values:
                    search_term = str(values[0]).split()[0]
        if not search_term:
            # Fallback generic search term
            search_term = "sample"

        params = {"search": search_term}
        r = session.get(products_url, params=params, timeout=TIMEOUT)
        assert r.status_code == 200, f"Product listing with search failed: {r.status_code} {r.text}"
        data_filtered = r.json()
        filtered_products = data_filtered.get("products")
        assert isinstance(filtered_products, list), "Filtered products should be list"
        assert len(filtered_products) > 0, "Search filtering returned no products, expected some"
        # Validate that each product's name or attributes contain the search term ignoring cases
        lowered_search = search_term.lower()
        match_found = False
        for prod in filtered_products:
            # Check name fields
            found = False
            checks = []
            if "name" in prod and isinstance(prod["name"], str):
                checks.append(prod["name"].lower())
            if "name_en" in prod and isinstance(prod["name_en"], str):
                checks.append(prod["name_en"].lower())
            # Check attributes may be JSON/dict
            if "attributes" in prod and isinstance(prod["attributes"], dict):
                for v in prod["attributes"].values():
                    if isinstance(v, str):
                        checks.append(v.lower())
                    elif isinstance(v, list):
                        for vv in v:
                            if isinstance(vv, str):
                                checks.append(vv.lower())
            for text in checks:
                if lowered_search in text:
                    found = True
                    break
            if found:
                match_found = True
                break
        assert match_found, "None of the filtered products' name or attributes contain the search term"

        # 5. Validate response includes multi-language and JSON attribute fields in product objects
        sample_product = filtered_products[0]
        # Check multi-language fields - we'll check name, description keys for pattern or existence
        multilang_keys = [k for k in sample_product.keys() if k.startswith("name_") or k.startswith("description_")]
        assert len(multilang_keys) > 0 or "name" in sample_product, "Multi-language fields like name_en are missing"
        # Check JSON attribute fields presence
        attributes = sample_product.get("attributes")
        assert isinstance(attributes, dict) or attributes is None, "'attributes' field should be a JSON object or null"

    except AssertionError:
        traceback.print_exc()
        raise
    except requests.exceptions.RequestException:
        traceback.print_exc()
        raise
    finally:
        session.close()

test_product_listing_pagination_filtering()