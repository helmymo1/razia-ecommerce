import requests
import uuid

BASE_URL = "http://localhost:5173"
TIMEOUT = 30

# Credentials for test user (can be randomized for isolation)
TEST_USER = {
    "name": "Test User TC008",
    "email": f"testuser_tc008_{uuid.uuid4().hex[:8]}@example.com",
    "password": "TestPassword123!"
}

def test_manage_user_wishlist_items():
    # Register user
    register_url = f"{BASE_URL}/api/auth/register"
    login_url = f"{BASE_URL}/api/auth/login"
    wishlist_url = f"{BASE_URL}/api/wishlist"
    
    headers = {"Content-Type": "application/json"}
    
    # Register the user
    reg_resp = requests.post(register_url, json={
        "name": TEST_USER["name"],
        "email": TEST_USER["email"],
        "password": TEST_USER["password"]
    }, headers=headers, timeout=TIMEOUT)
    
    assert reg_resp.status_code == 201 or reg_resp.status_code == 200, f"User registration failed: {reg_resp.text}"
    
    # Login the user to get JWT token
    login_resp = requests.post(login_url, json={
        "email": TEST_USER["email"],
        "password": TEST_USER["password"]
    }, headers=headers, timeout=TIMEOUT)
    
    assert login_resp.status_code == 200, f"User login failed: {login_resp.text}"
    login_data = login_resp.json()
    assert "token" in login_data and isinstance(login_data["token"], str) and login_data["token"], "No token received on login"
    token = login_data["token"]
    
    auth_headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    # To add an item to wishlist, we first need a product id
    products_url = f"{BASE_URL}/api/products"
    prod_resp = requests.get(products_url, headers=auth_headers, timeout=TIMEOUT)
    assert prod_resp.status_code == 200, f"Failed to get products: {prod_resp.text}"
    products_data = prod_resp.json()
    # check products list is not empty and is a list
    assert isinstance(products_data, list) or ("products" in products_data and isinstance(products_data.get("products"), list)), "Invalid products response structure"
    
    # Extract product id
    product_list = []
    if isinstance(products_data, list):
        product_list = products_data
    else:
        product_list = products_data.get("products", [])
    assert len(product_list) > 0, "No products found to add to wishlist"
    product_id = product_list[0].get("id") if isinstance(product_list[0], dict) else None
    assert product_id, "Product ID not found in product data"
    
    # Keep track of added wishlist item id for cleanup
    wishlist_item_id = None
    
    try:
        # Add item to wishlist
        add_payload = {"product_id": product_id}
        add_resp = requests.post(wishlist_url, json=add_payload, headers=auth_headers, timeout=TIMEOUT)
        assert add_resp.status_code == 201 or add_resp.status_code == 200, f"Failed to add item to wishlist: {add_resp.text}"
        add_data = add_resp.json()
        # Extract wishlist item id from response if present (assumed it returns the added item or its id)
        # Check several common keys
        if isinstance(add_data, dict):
            wishlist_item_id = add_data.get("id") or add_data.get("wishlistItemId") or add_data.get("wishlist_id")
        if not wishlist_item_id:
            # fallback: try to get id by listing wishlist next
            pass
        
        # Retrieve wishlist
        get_resp = requests.get(wishlist_url, headers=auth_headers, timeout=TIMEOUT)
        assert get_resp.status_code == 200, f"Failed to get wishlist: {get_resp.text}"
        wishlist_data = get_resp.json()
        assert isinstance(wishlist_data, list) or ("items" in wishlist_data and isinstance(wishlist_data.get("items"), list)), \
            "Invalid wishlist response structure"

        wishlist_items = []
        if isinstance(wishlist_data, list):
            wishlist_items = wishlist_data
        else:
            wishlist_items = wishlist_data.get("items", [])
        
        # Check that the added product is in the wishlist
        product_in_wishlist = False
        for item in wishlist_items:
            # item can be dict with product id references
            if not isinstance(item, dict):
                continue
            # Possible keys for product id
            p_id = item.get("productId") or item.get("product_id") or item.get("product") or (item.get("product") and item["product"].get("id"))
            if p_id == product_id:
                product_in_wishlist = True
                # Update wishlist_item_id if we did not get it above
                if not wishlist_item_id:
                    wishlist_item_id = item.get("id") or item.get("_id")
                break
        assert product_in_wishlist, "Added product is not present in the wishlist"

        # Remove item from wishlist
        assert wishlist_item_id, "Wishlist item id to delete not found"
        remove_url = f"{wishlist_url}/{wishlist_item_id}"
        del_resp = requests.delete(remove_url, headers=auth_headers, timeout=TIMEOUT)
        assert del_resp.status_code == 200 or del_resp.status_code == 204, f"Failed to remove item from wishlist: {del_resp.text}"

        # Confirm removal
        get_resp_after = requests.get(wishlist_url, headers=auth_headers, timeout=TIMEOUT)
        assert get_resp_after.status_code == 200, f"Failed to get wishlist after deletion: {get_resp_after.text}"
        wishlist_data_after = get_resp_after.json()
        wishlist_items_after = []
        if isinstance(wishlist_data_after, list):
            wishlist_items_after = wishlist_data_after
        else:
            wishlist_items_after = wishlist_data_after.get("items", [])
        # Ensure the product is not in the wishlist anymore
        product_still_in_wishlist = False
        for item in wishlist_items_after:
            if not isinstance(item, dict):
                continue
            p_id = item.get("productId") or item.get("product_id") or item.get("product") or (item.get("product") and item["product"].get("id"))
            if p_id == product_id:
                product_still_in_wishlist = True
                break
        assert not product_still_in_wishlist, "Product still present in wishlist after removal"

    finally:
        # Cleanup: remove wishlist item if it still exists
        if wishlist_item_id:
            try:
                requests.delete(f"{wishlist_url}/{wishlist_item_id}", headers=auth_headers, timeout=TIMEOUT)
            except Exception:
                pass
        # There is no endpoint described for user deletion; skipping user cleanup
    
test_manage_user_wishlist_items()