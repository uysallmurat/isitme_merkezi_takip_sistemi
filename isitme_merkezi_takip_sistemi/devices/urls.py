from rest_framework.routers import DefaultRouter
from .views import DeviceViewSet, DeviceTransactionViewSet

router = DefaultRouter()
router.register(r'devices', DeviceViewSet, basename='device')
router.register(r'transactions', DeviceTransactionViewSet, basename='device_transaction')

urlpatterns = router.urls 