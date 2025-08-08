"""
URL configuration for isitme_merkezi_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from backend.api.views import dashboard_statistics

schema_view = get_schema_view(
   openapi.Info(
      title="İşitme Merkezi Takip Sistemi API",
      default_version='v1',
      description="Tüm modüller için otomatik API dokümantasyonu",
      contact=openapi.Contact(email="uysallmurat@gmail.com"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('frontend.urls')),
    path('api/dashboard/statistics/', dashboard_statistics, name='dashboard-statistics'),
    path('api/users/', include('users.urls')),
    path('api/patients/', include('patients.urls')),
    path('api/appointments/', include('appointments.urls')),
    path('api/hearing_tests/', include('hearing_tests.urls')),
    path('api/devices/', include('devices.urls')),
    path('api/stock_items/', include('stock_items.urls')),
    path('api/invoices/', include('invoices.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
