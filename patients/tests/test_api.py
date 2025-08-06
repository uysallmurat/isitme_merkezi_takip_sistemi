from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from patients.models import Patient

class PatientApiTests(APITestCase):
    def setUp(self):
        self.patient_data = {
            'first_name': 'Ali',
            'last_name': 'Veli',
            'birth_date': '1990-01-01',
            'gender': 'Erkek',
            'phone': '5551234567',
            'email': 'ali@example.com',
            'address': 'İstanbul'
        }

    def test_create_patient(self):
        url = reverse('patient-list')
        response = self.client.post(url, self.patient_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Patient.objects.count(), 1)

    def test_list_patients(self):
        Patient.objects.create(**self.patient_data)
        url = reverse('patient-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_update_patient(self):
        patient = Patient.objects.create(**self.patient_data)
        url = reverse('patient-detail', args=[patient.id])
        updated_data = self.patient_data.copy()
        updated_data['first_name'] = 'Mehmet'
        response = self.client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        patient.refresh_from_db()
        self.assertEqual(patient.first_name, 'Mehmet')

    def test_delete_patient(self):
        patient = Patient.objects.create(**self.patient_data)
        url = reverse('patient-detail', args=[patient.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Patient.objects.count(), 0)