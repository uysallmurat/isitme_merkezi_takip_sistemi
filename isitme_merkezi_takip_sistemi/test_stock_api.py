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
url = "http://127.0.0.1:8000/api/stock_items/stock_items/"

# Headers
headers = {
    'Content-Type': 'application/json',
}

try:
    print("Test verisi gönderiliyor...")
    print(f"URL: {url}")
    print(f"Veri: {json.dumps(test_product, indent=2)}")
    
    # POST isteği gönder
    response = requests.post(url, data=json.dumps(test_product), headers=headers)
    
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}")
    print(f"Response Body: {response.text}")
    
    if response.status_code == 201:
        print("\n✅ Ürün başarıyla eklendi!")
        
        # Eklenen ürünü kontrol et
        product_data = response.json()
        product_id = product_data.get('id')
        if product_id:
            get_response = requests.get(f"{url}{product_id}/")
            print(f"\nEklenen ürün: {get_response.json()}")
    else:
        print(f"\n❌ Hata oluştu! Status: {response.status_code}")
        
except Exception as e:
    print(f"Bağlantı hatası: {e}")
