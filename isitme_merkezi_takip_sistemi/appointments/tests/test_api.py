from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth.models import User
from patients.models import Patient
from appointments.models import Appointment
from datetime import datetime, timedelta

class AppointmentAPITests(APITestCase):
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
        
        # Test randevusu oluştur
        self.appointment = Appointment.objects.create(
            patient=self.patient,
            user=self.user,
            appointment_date=datetime.now() + timedelta(days=1),
            notes="Test randevusu",
            status="Planned"
        )
        
        # URL'leri tanımla
        self.list_url = reverse('appointment-list')
        self.detail_url = reverse('appointment-detail', kwargs={'pk': self.appointment.pk})

    def test_create_appointment(self):
        """Randevu oluşturma testi"""
        new_appointment_data = {
            "patient": self.patient.id,
            "user": self.user.id,
            "appointment_date": (datetime.now() + timedelta(days=2)).isoformat(),
            "notes": "Yeni test randevusu",
            "status": "Planned"
        }
        
        response = self.client.post(self.list_url, new_appointment_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Appointment.objects.count(), 2)

    def test_list_appointments(self):
        """Randevu listesi testi"""
        response = self.client.get(self.list_url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_retrieve_appointment(self):
        """Tek randevu görüntüleme testi"""
        response = self.client.get(self.detail_url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['notes'], "Test randevusu")

    def test_update_appointment(self):
        """Randevu güncelleme testi"""
        updated_data = {
            "notes": "Güncellenmiş randevu notu",
            "status": "Completed"
        }
        
        response = self.client.patch(self.detail_url, updated_data, format='json')
        self.assertEqual(response.status_code, 200)
        
        self.appointment.refresh_from_db()
        self.assertEqual(self.appointment.notes, "Güncellenmiş randevu notu")
        self.assertEqual(self.appointment.status, "Completed")

    def test_delete_appointment(self):
        """Randevu silme testi"""
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Appointment.objects.count(), 0)

    def test_appointment_with_invalid_patient(self):
        """Geçersiz hasta ID'si ile randevu oluşturma testi"""
        invalid_data = {
            "patient": 999,  # Var olmayan hasta ID'si
            "user": self.user.id,
            "appointment_date": datetime.now().isoformat(),
            "status": "Planned"
        }
        
        response = self.client.post(self.list_url, invalid_data, format='json')
        self.assertEqual(response.status_code, 400)

    def test_appointment_with_invalid_user(self):
        """Geçersiz kullanıcı ID'si ile randevu oluşturma testi"""
        invalid_data = {
            "patient": self.patient.id,
            "user": 999,  # Var olmayan kullanıcı ID'si
            "appointment_date": datetime.now().isoformat(),
            "status": "Planned"
        }
        
        response = self.client.post(self.list_url, invalid_data, format='json')
        self.assertEqual(response.status_code, 400) 