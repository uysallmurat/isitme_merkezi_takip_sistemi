from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, Http404
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters import rest_framework as filters
from django.db.models import Q
from .models import HearingTest
from .serializers import HearingTestSerializer
import logging
import os

logger = logging.getLogger(__name__)

# Create your views here.

class HearingTestFilter(filters.FilterSet):
    """HearingTest için filtre sınıfı"""
    search = filters.CharFilter(method='search_filter')
    patient_name = filters.CharFilter(method='patient_name_filter')
    doctor_name = filters.CharFilter(method='doctor_name_filter')
    test_date_gte = filters.DateTimeFilter(field_name='test_date', lookup_expr='gte')
    test_date_lte = filters.DateTimeFilter(field_name='test_date', lookup_expr='lte')
    
    class Meta:
        model = HearingTest
        fields = {
            'test_type': ['exact'],
            'status': ['exact'],
            'diagnosis': ['icontains'],
        }
    
    def search_filter(self, queryset, name, value):
        """Genel arama filtresi - hasta adı, test türü, doktor, durum"""
        if value:
            return queryset.filter(
                Q(patient__first_name__icontains=value) |
                Q(patient__last_name__icontains=value) |
                Q(test_type__icontains=value) |
                Q(user__first_name__icontains=value) |
                Q(user__last_name__icontains=value) |
                Q(status__icontains=value) |
                Q(diagnosis__icontains=value)
            )
        return queryset
    
    def patient_name_filter(self, queryset, name, value):
        """Hasta adı filtresi"""
        if value:
            return queryset.filter(
                Q(patient__first_name__icontains=value) |
                Q(patient__last_name__icontains=value)
            )
        return queryset
    
    def doctor_name_filter(self, queryset, name, value):
        """Doktor adı filtresi"""
        if value:
            return queryset.filter(
                Q(user__first_name__icontains=value) |
                Q(user__last_name__icontains=value)
            )
        return queryset

class HearingTestViewSet(viewsets.ModelViewSet):
    queryset = HearingTest.objects.all()
    serializer_class = HearingTestSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filterset_class = HearingTestFilter
    search_fields = ['patient__first_name', 'patient__last_name', 'test_type', 'user__first_name', 'user__last_name', 'status', 'diagnosis']
    ordering_fields = ['test_date', 'created_at', 'patient__first_name']
    ordering = ['-test_date']
    
    def get_queryset(self):
        """Filtreleme ve arama için queryset'i özelleştir"""
        queryset = super().get_queryset()
        
        # Manuel filtreleme (Django Filter paketi yeterli değilse)
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(patient__first_name__icontains=search) |
                Q(patient__last_name__icontains=search) |
                Q(test_type__icontains=search) |
                Q(user__first_name__icontains=search) |
                Q(user__last_name__icontains=search) |
                Q(status__icontains=search) |
                Q(diagnosis__icontains=search)
            )
        
        patient_name = self.request.query_params.get('patient_name', None)
        if patient_name:
            queryset = queryset.filter(
                Q(patient__first_name__icontains=patient_name) |
                Q(patient__last_name__icontains=patient_name)
            )
        
        doctor_name = self.request.query_params.get('doctor_name', None)
        if doctor_name:
            queryset = queryset.filter(
                Q(user__first_name__icontains=doctor_name) |
                Q(user__last_name__icontains=doctor_name)
            )
        
        test_date_gte = self.request.query_params.get('test_date_gte', None)
        if test_date_gte:
            queryset = queryset.filter(test_date__gte=test_date_gte)
        
        test_date_lte = self.request.query_params.get('test_date_lte', None)
        if test_date_lte:
            queryset = queryset.filter(test_date__lte=test_date_lte)
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        logger.info(f"HearingTest create request data: {request.data}")
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                logger.error(f"HearingTest save error: {str(e)}")
                return Response(
                    {"error": f"Database save error: {str(e)}"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            logger.error(f"HearingTest validation errors: {serializer.errors}")
            return Response(
                {
                    "error": "Validation failed", 
                    "details": serializer.errors,
                    "received_data": request.data
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def update(self, request, *args, **kwargs):
        """Test raporu güncelleme"""
        logger.info(f"HearingTest update request data: {request.data}")
        logger.info(f"HearingTest update request method: {request.method}")
        logger.info(f"HearingTest update request content type: {request.content_type}")
        logger.info(f"HearingTest update request headers: {dict(request.headers)}")
        
        try:
            partial = kwargs.pop('partial', False)
            logger.info(f"HearingTest update partial: {partial}")
            
            instance = self.get_object()
            logger.info(f"HearingTest update instance ID: {instance.id}")
            
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            logger.info(f"HearingTest update serializer created")
            
            if serializer.is_valid():
                logger.info(f"HearingTest update serializer is valid")
                try:
                    saved_instance = serializer.save()
                    logger.info(f"HearingTest update saved successfully: {saved_instance.id}")
                    return Response(serializer.data)
                except Exception as e:
                    logger.error(f"HearingTest update save error: {str(e)}")
                    logger.error(f"HearingTest update save error type: {type(e)}")
                    import traceback
                    logger.error(f"HearingTest update save error traceback: {traceback.format_exc()}")
                    return Response(
                        {"error": f"Database update error: {str(e)}"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                logger.error(f"HearingTest update validation errors: {serializer.errors}")
                logger.error(f"HearingTest update validation errors type: {type(serializer.errors)}")
                return Response(
                    {
                        "error": "Update validation failed", 
                        "details": serializer.errors,
                        "received_data": request.data
                    }, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            logger.error(f"HearingTest update unexpected error: {str(e)}")
            logger.error(f"HearingTest update unexpected error type: {type(e)}")
            import traceback
            logger.error(f"HearingTest update unexpected error traceback: {traceback.format_exc()}")
            return Response(
                {"error": f"Unexpected error: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Test raporu PDF dosyasını indir"""
        try:
            hearing_test = get_object_or_404(HearingTest, pk=pk)
            
            if not hearing_test.report_pdf:
                return Response(
                    {"error": "Bu test raporu için PDF dosyası yüklenmemiş"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Dosya var mı kontrol et
            if not os.path.exists(hearing_test.report_pdf.path):
                return Response(
                    {"error": "PDF dosyası bulunamadı"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Dosyayı oku ve response olarak döndür
            with open(hearing_test.report_pdf.path, 'rb') as pdf_file:
                response = HttpResponse(
                    pdf_file.read(), 
                    content_type='application/pdf'
                )
                filename = f"test_raporu_{hearing_test.patient.first_name}_{hearing_test.patient.last_name}_{hearing_test.test_date.strftime('%Y%m%d')}.pdf"
                response['Content-Disposition'] = f'attachment; filename="{filename}"'
                return response
                
        except Exception as e:
            logger.error(f"PDF download error: {str(e)}")
            return Response(
                {"error": f"Dosya indirme hatası: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
