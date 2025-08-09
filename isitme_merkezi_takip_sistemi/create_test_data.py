import os
import django

# Django ayarlarını yükle
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'isitme_merkezi_takip_sistemi.settings')
django.setup()

from stock_items.models import Supplier
from patients.models import Patient
from appointments.models import Appointment
from hearing_tests.models import HearingTest
from django.contrib.auth.models import User
from datetime import datetime, timedelta

# Test supplier'ları oluştur
suppliers = [
    {
        'name': 'Phonak Türkiye',
        'contact_person': 'Ahmet Yılmaz',
        'phone': '0212 555 1234',
        'email': 'info@phonak.com.tr',
        'address': 'İstanbul, Türkiye'
    },
    {
        'name': 'Oticon Türkiye',
        'contact_person': 'Mehmet Demir',
        'phone': '0216 555 5678',
        'email': 'info@oticon.com.tr',
        'address': 'İstanbul, Türkiye'
    },
    {
        'name': 'ReSound Türkiye',
        'contact_person': 'Ayşe Kaya',
        'phone': '0312 555 9012',
        'email': 'info@resound.com.tr',
        'address': 'Ankara, Türkiye'
    },
    {
        'name': 'Starkey Türkiye',
        'contact_person': 'Fatma Özkan',
        'phone': '0232 555 3456',
        'email': 'info@starkey.com.tr',
        'address': 'İzmir, Türkiye'
    }
]

for supplier_data in suppliers:
    supplier, created = Supplier.objects.get_or_create(
        name=supplier_data['name'],
        defaults=supplier_data
    )
    if created:
        print(f"✅ Supplier oluşturuldu: {supplier.name} (ID: {supplier.id})")
    else:
        print(f"ℹ️ Supplier zaten mevcut: {supplier.name} (ID: {supplier.id})")

print("\nTüm supplier'lar hazır!")

# Test randevuları oluştur
print("\n📅 Test randevuları oluşturuluyor...")

# Mevcut hastaları al
patients = Patient.objects.all()
if patients.exists():
    # Bugünden itibaren çeşitli tarihlerde randevular oluştur
    base_date = datetime.now()
    
    test_appointments = [
        {
            'patient': patients[0],
            'appointment_date': base_date + timedelta(days=1, hours=9),
            'appointment_type': 'consultation',
            'status': 'scheduled',
            'notes': 'İlk muayene randevusu'
        },
        {
            'patient': patients[0] if len(patients) > 0 else patients[0],
            'appointment_date': base_date + timedelta(days=3, hours=14),
            'appointment_type': 'hearing_test',
            'status': 'scheduled',
            'notes': 'Detaylı işitme testi'
        },
        {
            'patient': patients[1] if len(patients) > 1 else patients[0],
            'appointment_date': base_date + timedelta(days=7, hours=10, minutes=30),
            'appointment_type': 'device_fitting',
            'status': 'scheduled',
            'notes': 'Cihaz takma ve ayarlama'
        },
        {
            'patient': patients[2] if len(patients) > 2 else patients[0],
            'appointment_date': base_date + timedelta(days=-2, hours=15),
            'appointment_type': 'consultation',
            'status': 'completed',
            'notes': 'Tamamlanmış kontrol randevusu'
        },
        {
            'patient': patients[1] if len(patients) > 1 else patients[0],
            'appointment_date': base_date + timedelta(days=14, hours=11),
            'appointment_type': 'follow_up',
            'status': 'scheduled',
            'notes': 'Takip randevusu'
        }
    ]
    
    for appointment_data in test_appointments:
        appointment, created = Appointment.objects.get_or_create(
            patient=appointment_data['patient'],
            appointment_date=appointment_data['appointment_date'],
            defaults={
                'appointment_type': appointment_data['appointment_type'],
                'status': appointment_data['status'],
                'notes': appointment_data['notes']
            }
        )
        if created:
            print(f"✅ Randevu oluşturuldu: {appointment.patient.first_name} {appointment.patient.last_name} - {appointment.appointment_date.strftime('%d.%m.%Y %H:%M')} (ID: {appointment.id})")
        else:
            print(f"ℹ️ Randevu zaten mevcut: {appointment.patient.first_name} {appointment.patient.last_name} - {appointment.appointment_date.strftime('%d.%m.%Y %H:%M')} (ID: {appointment.id})")
    
    print(f"✅ Test randevu verileri hazırlandı! Toplam: {Appointment.objects.count()} randevu")
else:
    print("❌ Randevu oluşturmak için hasta verisi bulunamadı!")

# Test raporları oluştur
print("\n🔊 Test raporları oluşturuluyor...")

patients = Patient.objects.all()
# Default user oluştur veya al
user, created = User.objects.get_or_create(
    username='test_doctor',
    defaults={
        'first_name': 'Dr. Test',
        'last_name': 'Odyolog',
        'email': 'test@example.com'
    }
)
if created:
    print(f"✅ Test kullanıcısı oluşturuldu: {user.username}")

if patients.exists():
    test_reports = [
        {
            'patient': patients[0],
            'user': user,
            'test_date': base_date - timedelta(days=1),
            'test_type': 'Pure_Tone',
            'status': 'Completed',
            'notes': 'Normal işitme seviyesi tespit edildi',
            'diagnosis': 'Normal işitme',
            'recommendations': 'Yıllık kontrol önerilir',
            'right_ear_250': 15,
            'right_ear_500': 20,
            'right_ear_1000': 25,
            'right_ear_2000': 30,
            'left_ear_250': 20,
            'left_ear_500': 25,
            'left_ear_1000': 30,
            'left_ear_2000': 35,
        },
        {
            'patient': patients[1] if len(patients) > 1 else patients[0],
            'user': user,
            'test_date': base_date - timedelta(days=7),
            'test_type': 'Speech',
            'status': 'Completed',
            'notes': 'Hafif işitme kaybı tespit edildi',
            'diagnosis': 'Hafif işitme kaybı',
            'recommendations': 'İşitme cihazı değerlendirmesi',
            'right_ear_srt': 25,
            'left_ear_srt': 30,
            'right_ear_sds': 85,
            'left_ear_sds': 80,
        },
        {
            'patient': patients[2] if len(patients) > 2 else patients[0],
            'user': user,
            'test_date': base_date - timedelta(days=14),
            'test_type': 'Impedance',
            'status': 'Completed',
            'notes': 'Orta kulak problemi şüphesi',
            'diagnosis': 'Orta kulak disfonksiyonu şüphesi',
            'recommendations': 'KBB konsültasyonu önerilir',
        }
    ]
    
    for report_data in test_reports:
        report, created = HearingTest.objects.get_or_create(
            patient=report_data['patient'],
            test_date=report_data['test_date'],
            test_type=report_data['test_type'],
            defaults=report_data
        )
        if created:
            print(f"✅ Test raporu oluşturuldu: {report.patient.first_name} {report.patient.last_name} - {report.test_type} - {report.test_date.strftime('%d.%m.%Y')} (ID: {report.id})")
        else:
            print(f"ℹ️ Test raporu zaten mevcut: {report.patient.first_name} {report.patient.last_name} - {report.test_type} - {report.test_date.strftime('%d.%m.%Y')} (ID: {report.id})")
    
    print(f"✅ Test raporu verileri hazırlandı! Toplam: {HearingTest.objects.count()} test raporu")
else:
    print("❌ Test raporu oluşturmak için hasta verisi bulunamadı!")
