import requests
import json
from datetime import datetime

# Test verisi - Stok girişi
test_stock_in = {
    "stock_item": "1",  # Ürün ID'si
    "transaction_type": "In",
    "quantity": "50",
    "unit_price": "12.50",
    "supplier": "1",  # Tedarikçi ID'si
    "reference_number": "FAT-2024-001",
    "transaction_date": datetime.now().strftime("%Y-%m-%d"),
    "notes": "Test stok girişi"
}

# API endpoint
url = "http://127.0.0.1:8000/api/stock_items/transactions/"

# Headers
headers = {
    'Content-Type': 'application/json',
}

try:
    print("Stok girişi test ediliyor...")
    print(f"URL: {url}")
    print(f"Veri: {json.dumps(test_stock_in, indent=2)}")
    
    # POST isteği gönder
    response = requests.post(url, data=json.dumps(test_stock_in), headers=headers)
    
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}")
    print(f"Response: {response.text}")
    
    if response.status_code == 201:
        print("✅ Stok girişi başarıyla yapıldı!")
        
        # Stok miktarını kontrol et
        stock_url = "http://127.0.0.1:8000/api/stock_items/stock_items/1/"
        stock_response = requests.get(stock_url)
        if stock_response.status_code == 200:
            stock_data = stock_response.json()
            print(f"📦 Güncel stok miktarı: {stock_data['current_stock']}")
    else:
        print("❌ Stok girişi başarısız!")
        
except requests.exceptions.ConnectionError:
    print("❌ Django sunucusu çalışmıyor. Lütfen 'python manage.py runserver' komutunu çalıştırın.")
except Exception as e:
    print(f"❌ Hata: {str(e)}")
