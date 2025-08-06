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
@login_required
def dashboard_view(request):
    return render(request, 'frontend/dashboard.html')

# Çıkış
@login_required
def logout_view(request):
    logout(request)
    return redirect('login')
