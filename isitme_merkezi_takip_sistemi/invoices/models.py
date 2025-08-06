from django.db import models
from patients.models import Patient

class Invoice(models.Model):
    STATUS_CHOICES = [
        ('Draft', 'Taslak'),
        ('Issued', 'Düzenlendi'),
        ('Paid', 'Ödendi'),
        ('Cancelled', 'İptal Edildi'),
    ]
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='invoices')
    invoice_date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Fatura: {self.patient.first_name} {self.patient.last_name} - {self.invoice_date} - {self.amount} TL"
