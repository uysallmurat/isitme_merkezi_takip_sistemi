from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

# Giriş ekranı

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('dashboard')
        else:
            return render(request, 'frontend/login.html', {'error': 'Kullanıcı adı veya şifre hatalı.'})
    return render(request, 'frontend/login.html')

# Dashboard ekranı
def dashboard_view(request):
    return render(request, 'frontend/dashboard.html')

# Çıkış
def logout_view(request):
    logout(request)
    return redirect('login')

# Hasta Yönetimi
def patients_view(request):
    return render(request, 'frontend/patients.html')

# Randevu Yönetimi
def appointments_view(request):
    return render(request, 'frontend/appointments.html')

# Cihaz Yönetimi
def devices_view(request):
    return render(request, 'frontend/devices.html')

# Test Raporları
def test_reports_view(request):
    return render(request, 'frontend/test-reports.html')

# Stok Yönetimi
def inventory_view(request):
    return render(request, 'frontend/inventory.html')

# Fatura Yönetimi
def invoices_view(request):
    return render(request, 'frontend/invoices.html')

# Tedarikçi Yönetimi
def suppliers_view(request):
    return render(request, 'frontend/suppliers.html')
