from django.db import models
from django.contrib.auth.models import User

class Supplier(models.Model):
    # Temel Bilgiler
    name = models.CharField(max_length=200, verbose_name='Tedarikçi Adı')
    contact_person = models.CharField(max_length=100, verbose_name='İletişim Kişisi')
    phone = models.CharField(max_length=20, verbose_name='Telefon')
    email = models.EmailField(max_length=100, blank=True, verbose_name='E-posta')
    address = models.TextField(blank=True, verbose_name='Adres')
    tax_number = models.CharField(max_length=50, blank=True, verbose_name='Vergi Numarası')
    
    # Genel Bilgiler
    notes = models.TextField(blank=True, verbose_name='Notlar')
    
    # Sistem Bilgileri
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Oluşturulma Tarihi')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Güncellenme Tarihi')

    class Meta:
        verbose_name = 'Tedarikçi'
        verbose_name_plural = 'Tedarikçiler'
        ordering = ['-created_at']

    def __str__(self):
        return self.name
