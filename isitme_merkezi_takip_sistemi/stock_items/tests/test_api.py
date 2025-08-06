from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth.models import User
from stock_items.models import Supplier, StockItem, StockTransaction
from datetime import datetime
from decimal import Decimal

class SupplierAPITests(APITestCase):
    def setUp(self):
        # Test kullanıcısı oluştur
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        
        # Test tedarikçisi oluştur
        self.supplier = Supplier.objects.create(
            name="Test Tedarikçi A.Ş.",
            contact_person="Ahmet Yılmaz",
            phone="0212 555 1234",
            email="info@testtedarikci.com",
            address="İstanbul, Türkiye",
            tax_number="1234567890",
            notes="Test tedarikçi notu"
        )
        
        # URL'leri tanımla
        self.list_url = reverse('supplier-list')
        self.detail_url = reverse('supplier-detail', kwargs={'pk': self.supplier.pk})

    def test_create_supplier(self):
        """Tedarikçi oluşturma testi"""
        new_supplier_data = {
            "name": "Yeni Tedarikçi Ltd.",
            "contact_person": "Mehmet Demir",
            "phone": "0216 555 5678",
            "email": "info@yenitedarikci.com",
            "address": "Ankara, Türkiye",
            "tax_number": "9876543210",
            "notes": "Yeni tedarikçi notu"
        }
        
        response = self.client.post(self.list_url, new_supplier_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Supplier.objects.count(), 2)

    def test_list_suppliers(self):
        """Tedarikçi listesi testi"""
        response = self.client.get(self.list_url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_retrieve_supplier(self):
        """Tek tedarikçi görüntüleme testi"""
        response = self.client.get(self.detail_url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], "Test Tedarikçi A.Ş.")

    def test_update_supplier(self):
        """Tedarikçi güncelleme testi"""
        updated_data = {
            "contact_person": "Güncellenmiş Kişi",
            "phone": "0212 555 9999"
        }
        
        response = self.client.patch(self.detail_url, updated_data, format='json')
        self.assertEqual(response.status_code, 200)
        
        self.supplier.refresh_from_db()
        self.assertEqual(self.supplier.contact_person, "Güncellenmiş Kişi")

    def test_delete_supplier(self):
        """Tedarikçi silme testi"""
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Supplier.objects.count(), 0)

class StockItemAPITests(APITestCase):
    def setUp(self):
        # Test kullanıcısı oluştur
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        
        # Test tedarikçisi oluştur
        self.supplier = Supplier.objects.create(
            name="Test Tedarikçi",
            phone="0212 555 1234"
        )
        
        # Test stok malzemesi oluştur
        self.stock_item = StockItem.objects.create(
            name="Duracell AAA Pil",
            item_type='Battery',
            brand='Duracell',
            model='AAA',
            description='AAA boyutunda alkalin pil',
            unit='Adet',
            current_stock=100,
            minimum_stock=20,
            unit_price=Decimal('5.00'),
            supplier=self.supplier,
            location='Depo A - Raf 1',
            notes='Test stok malzemesi'
        )
        
        # URL'leri tanımla
        self.list_url = reverse('stock_item-list')
        self.detail_url = reverse('stock_item-detail', kwargs={'pk': self.stock_item.pk})

    def test_create_stock_item(self):
        """Stok malzemesi oluşturma testi"""
        new_item_data = {
            "name": "Kulak Ucu Seti",
            "item_type": "Ear_Tip",
            "brand": "Phonak",
            "model": "Size S",
            "description": "Küçük boyut kulak ucu seti",
            "unit": "Set",
            "current_stock": 50,
            "minimum_stock": 10,
            "unit_price": "25.00",
            "supplier": self.supplier.id,
            "location": "Depo B - Raf 2",
            "notes": "Yeni stok malzemesi"
        }
        
        response = self.client.post(self.list_url, new_item_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(StockItem.objects.count(), 2)

    def test_list_stock_items(self):
        """Stok malzemesi listesi testi"""
        response = self.client.get(self.list_url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_retrieve_stock_item(self):
        """Tek stok malzemesi görüntüleme testi"""
        response = self.client.get(self.detail_url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], "Duracell AAA Pil")
        self.assertEqual(response.data['current_stock'], 100)

    def test_update_stock_item(self):
        """Stok malzemesi güncelleme testi"""
        updated_data = {
            "current_stock": 80,
            "minimum_stock": 15,
            "notes": "Güncellenmiş not"
        }
        
        response = self.client.patch(self.detail_url, updated_data, format='json')
        self.assertEqual(response.status_code, 200)
        
        self.stock_item.refresh_from_db()
        self.assertEqual(self.stock_item.current_stock, 80)
        self.assertEqual(self.stock_item.minimum_stock, 15)

    def test_delete_stock_item(self):
        """Stok malzemesi silme testi"""
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(StockItem.objects.count(), 0)

class StockTransactionAPITests(APITestCase):
    def setUp(self):
        # Test kullanıcısı oluştur
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        
        # Test tedarikçisi oluştur
        self.supplier = Supplier.objects.create(
            name="Test Tedarikçi",
            phone="0212 555 1234"
        )
        
        # Test stok malzemesi oluştur
        self.stock_item = StockItem.objects.create(
            name="Test Malzeme",
            item_type='Battery',
            brand='Test',
            current_stock=100,
            minimum_stock=20,
            unit_price=Decimal('5.00'),
            supplier=self.supplier
        )
        
        # Test stok hareketi oluştur
        self.transaction = StockTransaction.objects.create(
            stock_item=self.stock_item,
            transaction_type='In',
            quantity=50,
            unit_price=Decimal('5.00'),
            user=self.user,
            transaction_date=datetime.now(),
            reference_number='INV-001',
            notes='Test giriş işlemi'
        )
        
        # URL'leri tanımla
        self.list_url = reverse('stock_transaction-list')
        self.detail_url = reverse('stock_transaction-detail', kwargs={'pk': self.transaction.pk})

    def test_create_transaction(self):
        """Stok hareketi oluşturma testi"""
        new_transaction_data = {
            "stock_item": self.stock_item.id,
            "transaction_type": "Out",
            "quantity": 10,
            "unit_price": "5.00",
            "user": self.user.id,
            "transaction_date": datetime.now().isoformat(),
            "reference_number": "OUT-001",
            "notes": "Test çıkış işlemi"
        }
        
        response = self.client.post(self.list_url, new_transaction_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(StockTransaction.objects.count(), 2)

    def test_list_transactions(self):
        """Stok hareketi listesi testi"""
        response = self.client.get(self.list_url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_retrieve_transaction(self):
        """Tek stok hareketi görüntüleme testi"""
        response = self.client.get(self.detail_url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['transaction_type'], "In")
        self.assertEqual(response.data['quantity'], 50)

    def test_update_transaction(self):
        """Stok hareketi güncelleme testi"""
        updated_data = {
            "quantity": 60,
            "notes": "Güncellenmiş işlem notu"
        }
        
        response = self.client.patch(self.detail_url, updated_data, format='json')
        self.assertEqual(response.status_code, 200)
        
        self.transaction.refresh_from_db()
        self.assertEqual(self.transaction.quantity, 60)

    def test_delete_transaction(self):
        """Stok hareketi silme testi"""
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(StockTransaction.objects.count(), 0)

    def test_transaction_stock_update(self):
        """Stok hareketi sonrası stok miktarı güncelleme testi"""
        # Çıkış işlemi oluştur
        out_transaction_data = {
            "stock_item": self.stock_item.id,
            "transaction_type": "Out",
            "quantity": 20,
            "user": self.user.id,
            "transaction_date": datetime.now().isoformat()
        }
        
        response = self.client.post(self.list_url, out_transaction_data, format='json')
        self.assertEqual(response.status_code, 201)
        
        # Stok miktarının güncellendiğini kontrol et
        self.stock_item.refresh_from_db()
        self.assertEqual(self.stock_item.current_stock, 130)  # 100 + 50 - 20 = 130 