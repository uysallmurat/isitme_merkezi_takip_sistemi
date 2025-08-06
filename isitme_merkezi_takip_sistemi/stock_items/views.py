from django.shortcuts import render
from rest_framework import viewsets
from .models import Supplier, StockItem, StockTransaction
from .serializers import SupplierSerializer, StockItemSerializer, StockTransactionSerializer

# Create your views here.

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

class StockItemViewSet(viewsets.ModelViewSet):
    queryset = StockItem.objects.all()
    serializer_class = StockItemSerializer

class StockTransactionViewSet(viewsets.ModelViewSet):
    queryset = StockTransaction.objects.all()
    serializer_class = StockTransactionSerializer
