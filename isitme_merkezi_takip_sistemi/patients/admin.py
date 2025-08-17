from django.contrib import admin
from .models import Patient

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['tc_number', 'first_name', 'last_name', 'birth_date', 'gender', 'phone', 'city', 'status', 'created_at']
    list_filter = ['status', 'gender', 'city', 'hearing_aid_type', 'created_at']
    search_fields = ['tc_number', 'first_name', 'last_name', 'phone', 'email']
    readonly_fields = ['created_at', 'updated_at', 'total_appointments']
    
    fieldsets = (
        ('Temel Bilgiler', {
            'fields': ('tc_number', 'first_name', 'last_name', 'birth_date', 'gender', 'occupation')
        }),
        ('İletişim Bilgileri', {
            'fields': ('phone', 'email', 'city', 'district', 'address')
        }),
        ('Tıbbi Bilgiler', {
            'fields': ('medical_history', 'allergies', 'current_medications'),
            'classes': ('collapse',)
        }),
        ('Acil Durum Bilgileri', {
            'fields': ('emergency_contact', 'emergency_phone'),
            'classes': ('collapse',)
        }),
        ('İşitme Cihazı Bilgileri', {
            'fields': ('hearing_aid_type', 'hearing_aid_brand', 'hearing_aid_model', 'hearing_aid_serial'),
            'classes': ('collapse',)
        }),
        ('Sigorta ve Referans Bilgileri', {
            'fields': ('insurance_provider', 'insurance_number', 'referring_doctor'),
            'classes': ('collapse',)
        }),
        ('Sistem Bilgileri', {
            'fields': ('status', 'user', 'notes', 'created_at', 'updated_at', 'total_appointments'),
            'classes': ('collapse',)
        }),
    )
    
    ordering = ['-created_at']
    list_per_page = 25
