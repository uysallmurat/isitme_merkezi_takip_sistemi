from rest_framework.routers import DefaultRouter
from .views import HearingTestViewSet

router = DefaultRouter()
router.register(r'hearing_tests', HearingTestViewSet, basename='hearing_test')

urlpatterns = router.urls 