from django.shortcuts import render
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Device, DeviceTransaction
from .serializers import DeviceSerializer, DeviceTransactionSerializer

# Create your views here.

class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'device_type', 'brand']
    search_fields = ['name', 'brand', 'model', 'serial_number']
    ordering_fields = ['created_at', 'updated_at', 'name', 'brand']
    
    def get_queryset(self):
        queryset = Device.objects.all()
        
        # Ana arama filtresi
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                name__icontains=search
            ) | queryset.filter(
                brand__icontains=search
            ) | queryset.filter(
                model__icontains=search
            ) | queryset.filter(
                serial_number__icontains=search
            )
        
        # Durum filtresi
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
        
        # Marka filtresi
        brand = self.request.query_params.get('brand', None)
        if brand:
            queryset = queryset.filter(brand=brand)
        
        # Cihaz türü filtresi
        device_type = self.request.query_params.get('device_type', None)
        if device_type:
            queryset = queryset.filter(device_type=device_type)
        
        # Model filtresi
        model = self.request.query_params.get('model', None)
        if model:
            queryset = queryset.filter(model__icontains=model)
        
        # Stok filtresi
        stock_filter = self.request.query_params.get('stock_filter', None)
        if stock_filter:
            if stock_filter == 'low_stock':
                queryset = queryset.filter(current_stock__lte=5)
            elif stock_filter == 'out_of_stock':
                queryset = queryset.filter(current_stock=0)
            elif stock_filter == 'in_stock':
                queryset = queryset.filter(current_stock__gt=0)
        
        # Güncelleme tarihi filtresi
        updated_at_gte = self.request.query_params.get('updated_at_gte', None)
        updated_at_lte = self.request.query_params.get('updated_at_lte', None)
        if updated_at_gte:
            queryset = queryset.filter(updated_at__gte=updated_at_gte)
        if updated_at_lte:
            queryset = queryset.filter(updated_at__lte=updated_at_lte)
        
        return queryset

class DeviceTransactionViewSet(viewsets.ModelViewSet):
    queryset = DeviceTransaction.objects.all()
    serializer_class = DeviceTransactionSerializer
