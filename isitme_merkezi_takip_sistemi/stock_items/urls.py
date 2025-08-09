from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SupplierViewSet, StockItemViewSet, StockTransactionViewSet

router = DefaultRouter()
router.register(r'suppliers', SupplierViewSet)
router.register(r'stock_items', StockItemViewSet)
router.register(r'transactions', StockTransactionViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 