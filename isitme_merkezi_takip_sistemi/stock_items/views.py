from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
import logging
from .models import Supplier, StockItem, StockTransaction
from .serializers import SupplierSerializer, StockItemSerializer, StockTransactionSerializer

# Logger ayarla
logger = logging.getLogger(__name__)

# Create your views here.

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

class StockItemViewSet(viewsets.ModelViewSet):
    queryset = StockItem.objects.all()
    serializer_class = StockItemSerializer
    
    def create(self, request, *args, **kwargs):
        try:
            logger.info(f"Gelen veri: {request.data}")
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            logger.info(f"Validated data: {serializer.validated_data}")
            self.perform_create(serializer)
            logger.info(f"Ürün oluşturuldu: {serializer.instance}")
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            logger.error(f"Ürün oluşturma hatası: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class StockTransactionViewSet(viewsets.ModelViewSet):
    queryset = StockTransaction.objects.all()
    serializer_class = StockTransactionSerializer
    
    def create(self, request, *args, **kwargs):
        try:
            logger.info(f"Stok transaction verisi: {request.data}")
            serializer = self.get_serializer(data=request.data)
            
            if not serializer.is_valid():
                logger.error(f"Serializer validation errors: {serializer.errors}")
                logger.error(f"Received data: {request.data}")
                return Response({
                    'error': 'Validation failed',
                    'details': serializer.errors,
                    'received_data': request.data
                }, status=status.HTTP_400_BAD_REQUEST)
            
            logger.info(f"Validated transaction data: {serializer.validated_data}")
            self.perform_create(serializer)
            logger.info(f"Transaction oluşturuldu: {serializer.instance}")
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            logger.error(f"Transaction oluşturma hatası: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
