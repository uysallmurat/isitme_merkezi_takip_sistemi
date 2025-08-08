from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count
from datetime import datetime, timedelta

from patients.models import Patient
from appointments.models import Appointment
from hearing_tests.models import HearingTest
from devices.models import Device

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_statistics(request):
    """
    Dashboard için istatistikleri döndür
    """
    try:
        # Toplam hasta sayısı
        total_patients = Patient.objects.count()
        
        # Toplam randevu sayısı
        total_appointments = Appointment.objects.count()
        
        # Toplam test raporu sayısı
        total_test_reports = HearingTest.objects.count()
        
        # Bugünkü randevular
        today = datetime.now().date()
        today_appointments = Appointment.objects.filter(
            appointment_date=today
        ).count()
        
        # Bu haftaki randevular
        week_start = today - timedelta(days=today.weekday())
        week_end = week_start + timedelta(days=6)
        weekly_appointments = Appointment.objects.filter(
            appointment_date__range=[week_start, week_end]
        ).count()
        
        # Bu ayki randevular
        month_start = today.replace(day=1)
        if today.month == 12:
            month_end = today.replace(year=today.year + 1, month=1, day=1) - timedelta(days=1)
        else:
            month_end = today.replace(month=today.month + 1, day=1) - timedelta(days=1)
        
        monthly_appointments = Appointment.objects.filter(
            appointment_date__range=[month_start, month_end]
        ).count()
        
        # Son 7 günde eklenen hastalar
        recent_patients = Patient.objects.filter(
            created_at__gte=today - timedelta(days=7)
        ).count()
        
        # Aktif cihaz sayısı
        active_devices = Device.objects.filter(status='Available').count()
        
        # Stok durumu kritik olan cihazlar (eğer stock_quantity alanı yoksa 0 döner)
        low_stock_devices = getattr(Device, 'objects', None)
        if low_stock_devices is not None and hasattr(Device, 'stock_quantity'):
            low_stock_count = Device.objects.filter(stock_quantity__lte=5).count()
        else:
            low_stock_count = 0
        
        statistics = {
            'total_patients': total_patients,
            'total_appointments': total_appointments,
            'total_test_reports': total_test_reports,
            'today_appointments': today_appointments,
            'weekly_appointments': weekly_appointments,
            'monthly_appointments': monthly_appointments,
            'recent_patients': recent_patients,
            'active_devices': active_devices,
            'low_stock_devices': low_stock_count,
            'last_updated': datetime.now().isoformat()
        }
        
        return Response(statistics)
        
    except Exception as e:
        return Response(
            {'error': 'İstatistikler alınırken hata oluştu', 'detail': str(e)},
            status=500
        ) 