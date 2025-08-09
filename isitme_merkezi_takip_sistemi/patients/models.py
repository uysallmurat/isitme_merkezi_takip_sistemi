from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Patient(models.Model):
    STATUS_CHOICES = [
        ('active', 'Aktif'),
        ('inactive', 'Pasif'),
    ]
    
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    birth_date = models.DateField()
    gender = models.CharField(max_length=10)
    phone = models.CharField(max_length=20)
    email = models.EmailField(max_length=100, blank=True)
    address = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patients', null=True, blank=True, help_text='Kim ekledi')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
