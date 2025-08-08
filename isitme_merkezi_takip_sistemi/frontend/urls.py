from django.urls import path
from .views import login_view, dashboard_view, logout_view, patients_view, appointments_view, devices_view, test_reports_view, inventory_view, invoices_view
from django.views.generic import TemplateView

urlpatterns = [
    path('login/', login_view, name='login'),
    path('dashboard/', dashboard_view, name='dashboard'),
    path('patients/', patients_view, name='patients'),
    path('appointments/', appointments_view, name='appointments'),
    path('devices/', devices_view, name='devices'),
    path('test-reports/', test_reports_view, name='test-reports'),
    path('inventory/', inventory_view, name='inventory'),
    path('invoices/', invoices_view, name='invoices'),
    path('logout/', logout_view, name='logout'),
    path('router-test/', TemplateView.as_view(template_name='frontend/router-test.html'), name='router-test'),
    path('simple-router-test/', TemplateView.as_view(template_name='frontend/simple-router-test.html'), name='simple-router-test'),
]