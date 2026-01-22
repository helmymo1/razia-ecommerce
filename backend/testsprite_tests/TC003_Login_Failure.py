import requests

def test_login_failure():
    base_url = "http://localhost:5000"
    login_url = f"{base_url}/api/auth/login"
    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "email": "user@example.com",
        "password": "WRONGPASS"
    }
    try:
        response = requests.post(login_url, json=payload, headers=headers, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    if response.status_code == 400:
        # Validate 400 error structure - expecting JSON with error details about request body
        try:
            error_body = response.json()
        except ValueError:
            assert False, "400 response is not valid JSON"
        assert isinstance(error_body, dict), "400 error response body should be a JSON object"
        # Check likely keys indicating bad request such as 'message' or 'errors'
        assert any(key in error_body for key in ['message', 'errors']), "400 error body missing expected keys"
    else:
        # Expect 401 Unauthorized
        assert response.status_code == 401, f"Expected 401 Unauthorized but got {response.status_code}"
        # Optionally check response content for auth failure indication
        try:
            body = response.json()
            assert isinstance(body, dict), "Response body should be JSON object"
            # Usually error message or detail under keys like 'message' or 'error'
            assert any(k in body for k in ('message', 'error', 'detail')), "401 response missing error message"
        except ValueError:
            # Some APIs return no JSON on 401, this is acceptable
            pass

test_login_failure()