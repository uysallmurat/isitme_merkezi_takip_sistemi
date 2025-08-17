from django.contrib import admin
from .models import Supplier

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ['name', 'contact_person', 'phone', 'email', 'tax_number', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'contact_person', 'phone', 'email', 'tax_number']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Temel Bilgiler', {
            'fields': ('name', 'contact_person', 'phone', 'email')
        }),
        ('Adres Bilgileri', {
            'fields': ('address', 'tax_number')
        }),
        ('Genel Bilgiler', {
            'fields': ('notes',)
        }),
        ('Sistem Bilgileri', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    ordering = ['-created_at']
    list_per_page = 25
