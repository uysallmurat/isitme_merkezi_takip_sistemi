from django.shortcuts import render
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Patient
from .serializers import PatientSerializer

# Create your views here.

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'gender']
    search_fields = ['first_name', 'last_name', 'phone', 'email']
    ordering_fields = ['created_at', 'first_name', 'last_name']
    
    def get_queryset(self):
        queryset = Patient.objects.all()
        
        # Özel filtreler
        name = self.request.query_params.get('name', None)
        if name:
            queryset = queryset.filter(
                first_name__icontains=name
            ) | queryset.filter(
                last_name__icontains=name
            )
        
        phone = self.request.query_params.get('phone', None)
        if phone:
            queryset = queryset.filter(phone__icontains=phone)
            
        email = self.request.query_params.get('email', None)
        if email:
            queryset = queryset.filter(email__icontains=email)
            
        age_group = self.request.query_params.get('age_group', None)
        if age_group:
            from datetime import date
            today = date.today()
            if age_group == '0-18':
                queryset = queryset.filter(birth_date__gte=today.replace(year=today.year-18))
            elif age_group == '19-30':
                queryset = queryset.filter(
                    birth_date__lt=today.replace(year=today.year-18),
                    birth_date__gte=today.replace(year=today.year-30)
                )
            elif age_group == '31-50':
                queryset = queryset.filter(
                    birth_date__lt=today.replace(year=today.year-30),
                    birth_date__gte=today.replace(year=today.year-50)
                )
            elif age_group == '51+':
                queryset = queryset.filter(birth_date__lt=today.replace(year=today.year-50))
        
        # Doğum tarihi filtreleri
        birth_date_gte = self.request.query_params.get('birth_date_gte', None)
        if birth_date_gte:
            queryset = queryset.filter(birth_date__gte=birth_date_gte)
            
        birth_date_lte = self.request.query_params.get('birth_date_lte', None)
        if birth_date_lte:
            queryset = queryset.filter(birth_date__lte=birth_date_lte)
        
        last_appointment_date_gte = self.request.query_params.get('last_appointment_date_gte', None)
        if last_appointment_date_gte:
            queryset = queryset.filter(last_appointment_date__gte=last_appointment_date_gte)
            
        last_appointment_date_lte = self.request.query_params.get('last_appointment_date_lte', None)
        if last_appointment_date_lte:
            queryset = queryset.filter(last_appointment_date__lte=last_appointment_date_lte)
            
        created_at_gte = self.request.query_params.get('created_at_gte', None)
        if created_at_gte:
            queryset = queryset.filter(created_at__gte=created_at_gte)
            
        created_at_lte = self.request.query_params.get('created_at_lte', None)
        if created_at_lte:
            queryset = queryset.filter(created_at__lte=created_at_lte)
        
        return queryset
