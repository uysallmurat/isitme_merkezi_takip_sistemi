from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, Http404
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import HearingTest
from .serializers import HearingTestSerializer
import logging
import os

logger = logging.getLogger(__name__)

# Create your views here.

class HearingTestViewSet(viewsets.ModelViewSet):
    queryset = HearingTest.objects.all()
    serializer_class = HearingTestSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
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
