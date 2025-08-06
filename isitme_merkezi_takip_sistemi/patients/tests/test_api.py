from rest_framework.test import APITestCase
from django.urls import reverse
from .models import Patient

class PatientAPITests(APITestCase):
    def setUp(self):
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
        
        # URL'leri tanımla
        self.list_url = reverse('patient-list')
        self.detail_url = reverse('patient-detail', kwargs={'pk': self.patient.pk})

    def test_create_patient(self):
        """Hasta oluşturma testi"""
        new_patient_data = {
            "first_name": "Jane",
            "last_name": "Doe",
            "birth_date": "1992-05-15",
            "gender": "Female",
            "phone": "0987654321",
            "email": "jane.doe@example.com",
            "address": "456 Oak Ave"
        }
        
        response = self.client.post(self.list_url, new_patient_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Patient.objects.count(), 2)

    def test_list_patients(self):
        """Hasta listesi testi"""
        response = self.client.get(self.list_url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_retrieve_patient(self):
        """Tek hasta görüntüleme testi"""
        response = self.client.get(self.detail_url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['first_name'], "John")

    def test_update_patient(self):
        """Hasta güncelleme testi"""
        updated_data = {"first_name": "Jonathan"}
        response = self.client.patch(self.detail_url, updated_data, format='json')
        self.assertEqual(response.status_code, 200)
        
        self.patient.refresh_from_db()
        self.assertEqual(self.patient.first_name, "Jonathan")

    def test_delete_patient(self):
        """Hasta silme testi"""
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Patient.objects.count(), 0) 

    def test_patient_not_found(self):
        """Var olmayan hasta için 404 ve Türkçe hata mesajı dönmeli"""
        response = self.client.get(reverse('patient-detail', kwargs={'pk': 9999}))
        self.assertEqual(response.status_code, 404)
        self.assertIn('hata', response.data)
        self.assertEqual(response.data['hata'], 'Kayıt bulunamadı') 