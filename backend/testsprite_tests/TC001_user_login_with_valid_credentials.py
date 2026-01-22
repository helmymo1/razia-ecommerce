import requests

BASE_URL = "http://localhost:5000"
LOGIN_ENDPOINT = "/api/auth/login"
TIMEOUT = 30

def test_user_login_with_valid_credentials():
    url = BASE_URL + LOGIN_ENDPOINT
    payload = {
        "email": "admin@ebazer.com",
        "password": "123456"
    }
    headers = {
        "Content-Type": "application/json"
    }
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"

    json_response = response.json()
    assert "token" in json_response, "Response JSON does not contain 'token'"
    token = json_response["token"]
    assert isinstance(token, str) and len(token.split('.')) == 3, "Invalid JWT token format"

test_user_login_with_valid_credentials()