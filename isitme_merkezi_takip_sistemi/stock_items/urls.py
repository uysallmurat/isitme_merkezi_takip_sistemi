from rest_framework.routers import DefaultRouter
from .views import SupplierViewSet, StockItemViewSet, StockTransactionViewSet

router = DefaultRouter()
router.register(r'suppliers', SupplierViewSet, basename='supplier')
router.register(r'stock_items', StockItemViewSet, basename='stock_item')
router.register(r'transactions', StockTransactionViewSet, basename='stock_transaction')

urlpatterns = router.urls 