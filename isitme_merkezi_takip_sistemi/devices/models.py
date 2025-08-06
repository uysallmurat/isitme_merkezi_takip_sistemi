from django.db import models
from patients.models import Patient
from django.contrib.auth.models import User

class Device(models.Model):
    """İşitme cihazı modeli"""
    DEVICE_TYPES = [
        ('BTE', 'Behind The Ear (Kulak Arkası)'),
        ('ITE', 'In The Ear (Kulak İçi)'),
        ('ITC', 'In The Canal (Kanal İçi)'),
        ('CIC', 'Completely In Canal (Tam Kanal İçi)'),
        ('RIC', 'Receiver In Canal (Kanal İçi Alıcı)'),
        ('Accessory', 'Aksesuar'),
        ('Other', 'Diğer')
    ]
    
    DEVICE_STATUS = [
        ('Available', 'Mevcut'),
        ('In_Use', 'Kullanımda'),
        ('Maintenance', 'Bakımda'),
        ('Retired', 'Emekli'),
        ('Lost', 'Kayıp')
    ]
    
    device_type = models.CharField(max_length=20, choices=DEVICE_TYPES)
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    serial_number = models.CharField(max_length=100, unique=True)
    purchase_date = models.DateField()
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    warranty_expiry = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=DEVICE_STATUS, default='Available')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.brand} {self.model} - {self.serial_number}"

    class Meta:
        ordering = ['-created_at']

class DeviceTransaction(models.Model):
    """Cihaz hareketleri modeli"""
    TRANSACTION_TYPES = [
        ('Sale', 'Satış'),
        ('Trial', 'Deneme'),
        ('Return', 'İade'),
        ('Maintenance', 'Bakım'),
        ('Repair', 'Tamir'),
        ('Exchange', 'Değişim'),
        ('Other', 'Diğer')
    ]
    
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='transactions')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='device_transactions')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='device_transactions')  # Tekniker/Odyolog
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    transaction_date = models.DateTimeField()
    return_date = models.DateTimeField(blank=True, null=True)  # Deneme/iade için
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.device} - {self.transaction_type} - {self.patient.first_name} {self.patient.last_name}"

    class Meta:
        ordering = ['-transaction_date']
