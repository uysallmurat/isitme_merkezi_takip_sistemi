import requests
import json

# Test verisi
test_product = {
    "product_name": "Test Pil 312",
    "product_code": "PIL312",
    "category": "Battery",
    "description": "Test pil açıklaması",
    "price": "15.50",
    "stock_quantity": "100",
    "supplier": "1",
    "min_stock_level": "10"
}

# API endpoint
url = "http://localhost:8000/api/stock_items/"

# Headers
headers = {
    'Content-Type': 'application/json',
}

try:
    # POST isteği gönder
    response = requests.post(url, data=json.dumps(test_product), headers=headers)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 201:
        print("✅ Ürün başarıyla eklendi!")
        
        # Eklenen ürünü kontrol et
        product_id = response.json()['id']
        get_response = requests.get(f"{url}{product_id}/")
        print(f"Eklenen ürün: {get_response.json()}")
    else:
        print("❌ Hata oluştu!")
        
except Exception as e:
    print(f"Bağlantı hatası: {e}")
