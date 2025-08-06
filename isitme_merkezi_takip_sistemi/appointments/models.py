from django.db import models
from patients.models import Patient
from django.contrib.auth.models import User

class Appointment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    appointment_date = models.DateTimeField()
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=[('Planned', 'Planned'), ('Completed', 'Completed'), ('Cancelled', 'Cancelled')], default='Planned')

    def __str__(self):
        return f"{self.patient} - {self.appointment_date}"
