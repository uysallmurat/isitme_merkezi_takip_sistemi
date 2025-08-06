from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth.models import User
from patients.models import Patient
from devices.models import Device, DeviceTransaction
from datetime import datetime, timedelta
from decimal import Decimal

class DeviceAPITests(APITestCase):
    def setUp(self):
        # Test kullanıcısı oluştur
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        
        # Test hastası oluştur
        self.patient = Patient.objects.create(
            first_name="John",
            last_name="Doe",
            birth_date="1990-01-01",
            gender="Male",
            phone="1234567890",
            email="john.doe@example.com",
            address="123 Main St"
        )
        
        # Test cihazı oluştur
        self.device = Device.objects.create(
            device_type='BTE',
            brand='Phonak',
            model='Audeo P90',
            serial_number='SN123456789',
            purchase_date='2024-01-15',
            purchase_price=Decimal('5000.00'),
            warranty_expiry='2027-01-15',
            status='Available',
            notes='Test cihazı'
        )
        
        # URL'leri tanımla
        self.device_list_url = reverse('device-list')
        self.device_detail_url = reverse('device-detail', kwargs={'pk': self.device.pk})

    def test_create_device(self):
        """Cihaz oluşturma testi"""
        new_device_data = {
            "device_type": "ITE",
            "brand": "Oticon",
            "model": "Opn S1",
            "serial_number": "SN987654321",
            "purchase_date": "2024-02-01",
            "purchase_price": "4500.00",
            "warranty_expiry": "2027-02-01",
            "status": "Available",
            "notes": "Yeni test cihazı"
        }
        
        response = self.client.post(self.device_list_url, new_device_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Device.objects.count(), 2)

    def test_list_devices(self):
        """Cihaz listesi testi"""
        response = self.client.get(self.device_list_url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_retrieve_device(self):
        """Tek cihaz görüntüleme testi"""
        response = self.client.get(self.device_detail_url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['brand'], "Phonak")
        self.assertEqual(response.data['model'], "Audeo P90")

    def test_update_device(self):
        """Cihaz güncelleme testi"""
        updated_data = {
            "status": "In_Use",
            "notes": "Güncellenmiş not"
        }
        
        response = self.client.patch(self.device_detail_url, updated_data, format='json')
        self.assertEqual(response.status_code, 200)
        
        self.device.refresh_from_db()
        self.assertEqual(self.device.status, "In_Use")
        self.assertEqual(self.device.notes, "Güncellenmiş not")

    def test_delete_device(self):
        """Cihaz silme testi"""
        response = self.client.delete(self.device_detail_url)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Device.objects.count(), 0)

    def test_device_with_duplicate_serial(self):
        """Aynı seri numarası ile cihaz oluşturma testi"""
        duplicate_data = {
            "device_type": "BTE",
            "brand": "Test",
            "model": "Test Model",
            "serial_number": "SN123456789",  # Aynı seri numarası
            "purchase_date": "2024-01-01",
            "purchase_price": "1000.00",
            "status": "Available"
        }
        
        response = self.client.post(self.device_list_url, duplicate_data, format='json')
        self.assertEqual(response.status_code, 400)

class DeviceTransactionAPITests(APITestCase):
    def setUp(self):
        # Test kullanıcısı oluştur
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        
        # Test hastası oluştur
        self.patient = Patient.objects.create(
            first_name="John",
            last_name="Doe",
            birth_date="1990-01-01",
            gender="Male",
            phone="1234567890",
            email="john.doe@example.com",
            address="123 Main St"
        )
        
        # Test cihazı oluştur
        self.device = Device.objects.create(
            device_type='BTE',
            brand='Phonak',
            model='Audeo P90',
            serial_number='SN123456789',
            purchase_date='2024-01-15',
            purchase_price=Decimal('5000.00'),
            status='Available'
        )
        
        # Test cihaz hareketi oluştur
        self.transaction = DeviceTransaction.objects.create(
            device=self.device,
            patient=self.patient,
            user=self.user,
            transaction_type='Trial',
            transaction_date=datetime.now(),
            return_date=datetime.now() + timedelta(days=7),
            price=Decimal('0.00'),
            notes='Test deneme işlemi'
        )
        
        # URL'leri tanımla
        self.transaction_list_url = reverse('device_transaction-list')
        self.transaction_detail_url = reverse('device_transaction-detail', kwargs={'pk': self.transaction.pk})

    def test_create_transaction(self):
        """Cihaz hareketi oluşturma testi"""
        new_transaction_data = {
            "device": self.device.id,
            "patient": self.patient.id,
            "user": self.user.id,
            "transaction_type": "Sale",
            "transaction_date": datetime.now().isoformat(),
            "price": "5000.00",
            "notes": "Test satış işlemi"
        }
        
        response = self.client.post(self.transaction_list_url, new_transaction_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(DeviceTransaction.objects.count(), 2)

    def test_list_transactions(self):
        """Cihaz hareketi listesi testi"""
        response = self.client.get(self.transaction_list_url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_retrieve_transaction(self):
        """Tek cihaz hareketi görüntüleme testi"""
        response = self.client.get(self.transaction_detail_url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['transaction_type'], "Trial")

    def test_update_transaction(self):
        """Cihaz hareketi güncelleme testi"""
        updated_data = {
            "transaction_type": "Sale",
            "price": "5000.00",
            "notes": "Güncellenmiş işlem notu"
        }
        
        response = self.client.patch(self.transaction_detail_url, updated_data, format='json')
        self.assertEqual(response.status_code, 200)
        
        self.transaction.refresh_from_db()
        self.assertEqual(self.transaction.transaction_type, "Sale")
        self.assertEqual(self.transaction.price, Decimal('5000.00'))

    def test_delete_transaction(self):
        """Cihaz hareketi silme testi"""
        response = self.client.delete(self.transaction_detail_url)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(DeviceTransaction.objects.count(), 0)

    def test_transaction_with_invalid_device(self):
        """Geçersiz cihaz ID'si ile hareket oluşturma testi"""
        invalid_data = {
            "device": 999,  # Var olmayan cihaz ID'si
            "patient": self.patient.id,
            "user": self.user.id,
            "transaction_type": "Trial",
            "transaction_date": datetime.now().isoformat()
        }
        
        response = self.client.post(self.transaction_list_url, invalid_data, format='json')
        self.assertEqual(response.status_code, 400)

    def test_transaction_with_invalid_patient(self):
        """Geçersiz hasta ID'si ile hareket oluşturma testi"""
        invalid_data = {
            "device": self.device.id,
            "patient": 999,  # Var olmayan hasta ID'si
            "user": self.user.id,
            "transaction_type": "Trial",
            "transaction_date": datetime.now().isoformat()
        }
        
        response = self.client.post(self.transaction_list_url, invalid_data, format='json')
        self.assertEqual(response.status_code, 400) 