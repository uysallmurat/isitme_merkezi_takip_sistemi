from django.shortcuts import render
from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Appointment
from .serializers import AppointmentSerializer
import logging

logger = logging.getLogger(__name__)

# Create your views here.

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'appointment_type']
    search_fields = ['patient__first_name', 'patient__last_name', 'patient__phone', 'patient__email']
    ordering_fields = ['appointment_date', 'appointment_time', 'created_at']
    
    def get_queryset(self):
        queryset = Appointment.objects.all()
        
        # Hasta adı filtreleme
        patient = self.request.query_params.get('patient', None)
        if patient:
            queryset = queryset.filter(
                patient__first_name__icontains=patient
            ) | queryset.filter(
                patient__last_name__icontains=patient
            )
        
        # Tarih aralığı filtreleme
        date_from = self.request.query_params.get('date_from', None)
        date_to = self.request.query_params.get('date_to', None)
        if date_from:
            queryset = queryset.filter(appointment_date__gte=date_from)
        if date_to:
            queryset = queryset.filter(appointment_date__lte=date_to)
        
        # Saat filtreleme
        time = self.request.query_params.get('time', None)
        if time:
            queryset = queryset.filter(appointment_time__icontains=time)
        
        # Tür filtreleme
        appointment_type = self.request.query_params.get('type', None)
        if appointment_type:
            queryset = queryset.filter(appointment_type=appointment_type)
        
        # Durum filtreleme
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
        
        return queryset.select_related('patient')
    
    def create(self, request, *args, **kwargs):
        try:
            logger.info(f"Received appointment data: {request.data}")
            return super().create(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error in appointment creation: {e}")
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
