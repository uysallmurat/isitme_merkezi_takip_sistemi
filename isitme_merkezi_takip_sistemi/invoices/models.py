from django.db import models
from patients.models import Patient
from django.contrib.auth.models import User

class Invoice(models.Model):
    STATUS_CHOICES = [
        ('Draft', 'Taslak'),
        ('Issued', 'Düzenlendi'),
        ('Paid', 'Ödendi'),
        ('Cancelled', 'İptal Edildi'),
    ]
    patient = models.ForeignKey(Patient, on_delete=models.PROTECT, related_name='invoices')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='invoices', null=True, blank=True, help_text='Kim oluşturdu')
    invoice_date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Fatura: {self.patient.first_name} {self.patient.last_name} - {self.invoice_date} - {self.amount} TL"
