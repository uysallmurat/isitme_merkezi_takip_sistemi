from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth.models import User
from patients.models import Patient
from hearing_tests.models import HearingTest
from datetime import datetime, timedelta

class HearingTestAPITests(APITestCase):
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
        
        # Test işitme testi oluştur
        self.hearing_test = HearingTest.objects.create(
            patient=self.patient,
            user=self.user,
            test_date=datetime.now(),
            test_type='Pure_Tone',
            right_ear_250=20,
            right_ear_500=25,
            right_ear_1000=30,
            right_ear_2000=35,
            right_ear_4000=40,
            right_ear_8000=45,
            left_ear_250=15,
            left_ear_500=20,
            left_ear_1000=25,
            left_ear_2000=30,
            left_ear_4000=35,
            left_ear_8000=40,
            right_ear_srt=25,
            left_ear_srt=20,
            right_ear_sds=90,
            left_ear_sds=95,
            status='Completed',
            notes="Test notu",
            diagnosis="Hafif işitme kaybı",
            recommendations="İşitme cihazı önerilir"
        )
        
        # URL'leri tanımla
        self.list_url = reverse('hearing_test-list')
        self.detail_url = reverse('hearing_test-detail', kwargs={'pk': self.hearing_test.pk})

    def test_create_hearing_test(self):
        """İşitme testi oluşturma testi"""
        new_test_data = {
            "patient": self.patient.id,
            "user": self.user.id,
            "test_date": datetime.now().isoformat(),
            "test_type": "Speech",
            "right_ear_250": 30,
            "right_ear_500": 35,
            "right_ear_1000": 40,
            "right_ear_2000": 45,
            "right_ear_4000": 50,
            "right_ear_8000": 55,
            "left_ear_250": 25,
            "left_ear_500": 30,
            "left_ear_1000": 35,
            "left_ear_2000": 40,
            "left_ear_4000": 45,
            "left_ear_8000": 50,
            "right_ear_srt": 35,
            "left_ear_srt": 30,
            "right_ear_sds": 85,
            "left_ear_sds": 90,
            "status": "Completed",
            "notes": "Yeni test notu",
            "diagnosis": "Orta derece işitme kaybı",
            "recommendations": "İşitme cihazı gerekli"
        }
        
        response = self.client.post(self.list_url, new_test_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(HearingTest.objects.count(), 2)

    def test_list_hearing_tests(self):
        """İşitme testi listesi testi"""
        response = self.client.get(self.list_url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_retrieve_hearing_test(self):
        """Tek işitme testi görüntüleme testi"""
        response = self.client.get(self.detail_url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['test_type'], "Pure_Tone")
        self.assertEqual(response.data['diagnosis'], "Hafif işitme kaybı")

    def test_update_hearing_test(self):
        """İşitme testi güncelleme testi"""
        updated_data = {
            "diagnosis": "Güncellenmiş tanı",
            "recommendations": "Güncellenmiş öneriler",
            "status": "Incomplete"
        }
        
        response = self.client.patch(self.detail_url, updated_data, format='json')
        self.assertEqual(response.status_code, 200)
        
        self.hearing_test.refresh_from_db()
        self.assertEqual(self.hearing_test.diagnosis, "Güncellenmiş tanı")
        self.assertEqual(self.hearing_test.status, "Incomplete")

    def test_delete_hearing_test(self):
        """İşitme testi silme testi"""
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(HearingTest.objects.count(), 0)

    def test_hearing_test_with_invalid_patient(self):
        """Geçersiz hasta ID'si ile işitme testi oluşturma testi"""
        invalid_data = {
            "patient": 999,  # Var olmayan hasta ID'si
            "user": self.user.id,
            "test_date": datetime.now().isoformat(),
            "test_type": "Pure_Tone",
            "status": "Completed"
        }
        
        response = self.client.post(self.list_url, invalid_data, format='json')
        self.assertEqual(response.status_code, 400)

    def test_hearing_test_with_invalid_user(self):
        """Geçersiz kullanıcı ID'si ile işitme testi oluşturma testi"""
        invalid_data = {
            "patient": self.patient.id,
            "user": 999,  # Var olmayan kullanıcı ID'si
            "test_date": datetime.now().isoformat(),
            "test_type": "Pure_Tone",
            "status": "Completed"
        }
        
        response = self.client.post(self.list_url, invalid_data, format='json')
        self.assertEqual(response.status_code, 400)

    def test_hearing_test_ordering(self):
        """İşitme testlerinin tarih sırasına göre sıralanması testi"""
        # Eski bir test oluştur
        old_test = HearingTest.objects.create(
            patient=self.patient,
            user=self.user,
            test_date=datetime.now() - timedelta(days=30),
            test_type='Pure_Tone',
            status='Completed'
        )
        
        response = self.client.get(self.list_url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        # İlk test yeni tarihli olmalı (ordering = ['-test_date'])
        self.assertEqual(response.data[0]['id'], self.hearing_test.id) 