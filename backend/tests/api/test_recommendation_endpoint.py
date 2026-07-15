from fastapi.testclient import TestClient
from app.main import application


def test_recommendation_endpoint_returns_success():
    client = TestClient(application)
    payload = {
        "crop": "Tomato",
        "quantity": 10.0,
        "state": "Maharashtra",
        "district": "Pune",
        "latitude": 18.5204,
        "longitude": 73.8567,
        "language": "en",
        "query": "Please suggest the best mandi and timing for harvest."
    }

    response = client.post("/api/v1/recommendation", json=payload)

    assert response.status_code == 200, response.text
    body = response.json()
    assert body["success"] is True
    assert "recommendation" in body["data"]
    assert body["data"]["recommendation"]["market_prices"] is not None
    assert body["data"]["recommendation"]["distance_data"] is not None
    assert body["data"]["recommendation"]["decision"] is not None
