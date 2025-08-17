#!/usr/bin/env python
import os
import sys
import django
from datetime import datetime, timedelta
import random

# Django setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'isitme_merkezi_takip_sistemi.settings')
django.setup()

from django.contrib.auth.models import User
from patients.models import Patient
from hearing_tests.models import HearingTest
from appointments.models import Appointment
from django.utils import timezone

def create_test_data():
    print("Test verisi oluşturuluyor...")
    
    # Create test users if they don't exist
    if not User.objects.filter(username='test_doctor').exists():
        test_doctor = User.objects.create_user(
            username='test_doctor',
            first_name='Dr. Ahmet',
            last_name='Yılmaz',
            email='ahmet.yilmaz@test.com',
            password='test123'
        )
        print(f"Test doktor oluşturuldu: {test_doctor.get_full_name()}")
    else:
        test_doctor = User.objects.get(username='test_doctor')
        print(f"Mevcut test doktor kullanıldı: {test_doctor.get_full_name()}")
    
    # Create test patients if they don't exist
    test_patients = []
    patient_names = [
        ('Mehmet', 'Demir'),
        ('Ayşe', 'Kaya'),
        ('Ali', 'Özkan'),
        ('Fatma', 'Çelik'),
        ('Mustafa', 'Arslan'),
        ('Zeynep', 'Koç'),
        ('Hasan', 'Yıldız'),
        ('Elif', 'Şahin'),
        ('İbrahim', 'Kurt'),
        ('Hatice', 'Özdemir')
    ]
    
    for first_name, last_name in patient_names:
        if not Patient.objects.filter(first_name=first_name, last_name=last_name).exists():
            patient = Patient.objects.create(
                first_name=first_name,
                last_name=last_name,
                birth_date=datetime.now().date() - timedelta(days=random.randint(6570, 25550)),  # 18-70 yaş
                phone='05' + str(random.randint(100000000, 999999999)),
                email=f'{first_name.lower()}.{last_name.lower()}@test.com',
                address=f'{first_name} {last_name} Test Adresi',
                status='active'
            )
            test_patients.append(patient)
            print(f"Test hasta oluşturuldu: {patient}")
        else:
            patient = Patient.objects.get(first_name=first_name, last_name=last_name)
            test_patients.append(patient)
            print(f"Mevcut test hasta kullanıldı: {patient}")
    
    # Create test hearing tests
    test_types = ['Pure_Tone', 'Speech', 'Impedance', 'ABR', 'OAE', 'Other']
    statuses = ['Completed', 'Incomplete', 'Cancelled']
    diagnoses = [
        'Normal işitme',
        'Hafif işitme kaybı',
        'Orta işitme kaybı',
        'İleri işitme kaybı',
        'Çok ileri işitme kaybı',
        'Tek taraflı işitme kaybı',
        'İki taraflı işitme kaybı'
    ]
    
    # Clear existing test data (optional - comment out if you want to keep existing data)
    # HearingTest.objects.all().delete()
    
    for i in range(20):  # Create 20 test reports
        patient = random.choice(test_patients)
        test_type = random.choice(test_types)
        status = random.choice(statuses)
        diagnosis = random.choice(diagnoses)
        
        # Random date within last 6 months
        test_date = timezone.now() - timedelta(days=random.randint(0, 180))
        
        hearing_test = HearingTest.objects.create(
            patient=patient,
            test_type=test_type,
            test_date=test_date,
            user=test_doctor,
            status=status,
            diagnosis=diagnosis,
            notes=f'Test notu {i+1}: {patient} için {test_type} testi yapıldı.',
            left_ear_250=random.randint(0, 100),
            left_ear_500=random.randint(0, 100),
            left_ear_1000=random.randint(0, 100),
            left_ear_2000=random.randint(0, 100),
            left_ear_4000=random.randint(0, 100),
            left_ear_8000=random.randint(0, 100),
            right_ear_250=random.randint(0, 100),
            right_ear_500=random.randint(0, 100),
            right_ear_1000=random.randint(0, 100),
            right_ear_2000=random.randint(0, 100),
            right_ear_4000=random.randint(0, 100),
            right_ear_8000=random.randint(0, 100)
        )
        print(f"Test raporu oluşturuldu: {patient} - {test_type} - {status}")
    
    # Create test appointments
    appointment_types = ['consultation', 'hearing_test', 'device_fitting', 'follow_up', 'maintenance']
    appointment_statuses = ['scheduled', 'pending', 'completed', 'cancelled']
    
    # Clear existing appointment data (optional - comment out if you want to keep existing data)
    # Appointment.objects.all().delete()
    
    for i in range(15):  # Create 15 appointments
        patient = random.choice(test_patients)
        appointment_type = random.choice(appointment_types)
        status = random.choice(appointment_statuses)
        
        # Random date within next 30 days for scheduled/pending, past 30 days for completed
        if status in ['scheduled', 'pending']:
            appointment_date = timezone.now() + timedelta(days=random.randint(1, 30))
        else:
            appointment_date = timezone.now() - timedelta(days=random.randint(1, 30))
        
        appointment = Appointment.objects.create(
            patient=patient,
            appointment_date=appointment_date,
            appointment_type=appointment_type,
            status=status,
            notes=f'Randevu notu {i+1}: {patient} için {appointment_type} randevusu.',
            user=test_doctor
        )
        print(f"Randevu oluşturuldu: {patient} - {appointment_type} - {status} - {appointment_date.strftime('%Y-%m-%d %H:%M')}")
    
    print(f"\nToplam {len(test_patients)} hasta, 20 test raporu ve 15 randevu oluşturuldu.")
    print("Test verisi başarıyla oluşturuldu!")

if __name__ == '__main__':
    create_test_data()
