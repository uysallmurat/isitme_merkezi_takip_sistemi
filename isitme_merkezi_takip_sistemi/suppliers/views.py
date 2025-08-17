from django.shortcuts import render
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Supplier
from .serializers import SupplierSerializer

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['name', 'contact_person']
    search_fields = ['name', 'contact_person', 'phone', 'email', 'tax_number']
    ordering_fields = ['created_at', 'name']
    
    def get_queryset(self):
        queryset = Supplier.objects.all()
        
        # Özel filtreler
        name = self.request.query_params.get('name', None)
        if name:
            queryset = queryset.filter(name__icontains=name)
            
        contact_person = self.request.query_params.get('contact_person', None)
        if contact_person:
            queryset = queryset.filter(contact_person__icontains=contact_person)
        
        phone = self.request.query_params.get('phone', None)
        if phone:
            queryset = queryset.filter(phone__icontains=phone)
            
        email = self.request.query_params.get('email', None)
        if email:
            queryset = queryset.filter(email__icontains=email)
            
        tax_number = self.request.query_params.get('tax_number', None)
        if tax_number:
            queryset = queryset.filter(tax_number__icontains=tax_number)
        
        # Tarih filtreleri
        created_at_gte = self.request.query_params.get('created_at_gte', None)
        if created_at_gte:
            queryset = queryset.filter(created_at__gte=created_at_gte)
            
        created_at_lte = self.request.query_params.get('created_at_lte', None)
        if created_at_lte:
            queryset = queryset.filter(created_at__lte=created_at_lte)
        
        return queryset
