from rest_framework.test import APITestCase
from django.urls import reverse
from patients.models import Patient
from invoices.models import Invoice
from datetime import date
from decimal import Decimal

class InvoiceAPITests(APITestCase):
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
        # Test faturası oluştur
        self.invoice = Invoice.objects.create(
            patient=self.patient,
            invoice_date=date.today(),
            amount=Decimal('1500.00'),
            description="İlk fatura",
            status="Issued"
        )
        # URL'leri tanımla
        self.list_url = reverse('invoice-list')
        self.detail_url = reverse('invoice-detail', kwargs={'pk': self.invoice.pk})

    def test_create_invoice(self):
        """Fatura oluşturma testi"""
        new_invoice_data = {
            "patient": self.patient.id,
            "invoice_date": date.today().isoformat(),
            "amount": "2000.00",
            "description": "Yeni fatura",
            "status": "Draft"
        }
        response = self.client.post(self.list_url, new_invoice_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Invoice.objects.count(), 2)

    def test_list_invoices(self):
        """Fatura listesi testi"""
        response = self.client.get(self.list_url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_retrieve_invoice(self):
        """Tek fatura görüntüleme testi"""
        response = self.client.get(self.detail_url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['amount'], '1500.00')
        self.assertEqual(response.data['status'], 'Issued')

    def test_update_invoice(self):
        """Fatura güncelleme testi"""
        updated_data = {
            "amount": "1750.00",
            "status": "Paid"
        }
        response = self.client.patch(self.detail_url, updated_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.invoice.refresh_from_db()
        self.assertEqual(str(self.invoice.amount), "1750.00")
        self.assertEqual(self.invoice.status, "Paid")

    def test_delete_invoice(self):
        """Fatura silme testi"""
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Invoice.objects.count(), 0)

    def test_invoice_with_invalid_patient(self):
        """Geçersiz hasta ID'si ile fatura oluşturma testi"""
        invalid_data = {
            "patient": 999,  # Var olmayan hasta ID'si
            "invoice_date": date.today().isoformat(),
            "amount": "1000.00",
            "status": "Draft"
        }
        response = self.client.post(self.list_url, invalid_data, format='json')
        self.assertEqual(response.status_code, 400)