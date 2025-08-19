const API_BASE_URL = '/api';
let dashboardData = {};

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    // ErrorHandler zaten error-handler.js'de initialize edildi
    // Sadece global errorHandler'ı kullan
    const errorHandler = window.errorHandler;
    
    loadDashboardData();
    
    // Welcome toast kaldırıldı
});

// Dashboard verilerini yükle
async function loadDashboardData() {
    try {
        // Tüm verileri paralel olarak al
        const [patientsResponse, appointmentsResponse, testsResponse, devicesResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/patients/`),
            fetch(`${API_BASE_URL}/appointments/`),
            fetch(`${API_BASE_URL}/hearing_tests/hearing_tests/`),
            fetch(`${API_BASE_URL}/devices/devices/`)
        ]);
        
        if (!patientsResponse.ok || !appointmentsResponse.ok || !testsResponse.ok || !devicesResponse.ok) {
            throw new Error('Veriler alınamadı');
        }
        
        const [patients, appointments, tests, devices] = await Promise.all([
            patientsResponse.json(),
            appointmentsResponse.json(),
            testsResponse.json(),
            devicesResponse.json()
        ]);
        
        console.log('Dashboard verileri:', { patients, appointments, tests, devices });
        
        // İstatistikleri hesapla ve güncelle
        const stats = calculateDashboardStats(patients, appointments, tests, devices);
        dashboardData = stats;
        updateDashboardStats(stats);
        
        // Diğer bölümleri yükle
        loadRecentPatients();
        loadUpcomingAppointments();
        loadDeviceInventory();
        loadRecentTests();
        
    } catch (error) {
        console.error('Dashboard verileri yüklenemedi:', error);
        // Hata durumunda sıfır değerleri göster
        updateDashboardStats({
            total_patients: 0,
            total_appointments: 0,
            total_tests: 0,
            total_devices: 0
        });
    }
}

// Dashboard istatistiklerini hesapla
function calculateDashboardStats(patients, appointments, tests, devices) {
    const stats = {
        total_patients: patients.length,
        total_appointments: appointments.length,
        total_tests: tests.length,
        total_devices: devices.length
    };
    
    console.log('Dashboard istatistikleri:', stats);
    return stats;
}

// Dashboard istatistiklerini güncelle
function updateDashboardStats(data) {
    // Animasyonlu sayı güncelleme
    animateNumber('totalPatients', data.total_patients || 0);
    animateNumber('totalAppointments', data.total_appointments || 0);
    animateNumber('totalTests', data.total_tests || 0);
    animateNumber('totalDevices', data.total_devices || 0);
}

// Sayıları animasyonlu güncelle
function animateNumber(elementId, targetValue) {
    const element = document.getElementById(elementId);
    const spinner = element.querySelector('.loading-spinner');
    
    if (spinner) {
        spinner.remove();
    }
    
    const startValue = parseInt(element.textContent) || 0;
    const duration = 1000;
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart(progress));
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = targetValue;
            element.parentElement.parentElement.classList.add('success-animation');
            setTimeout(() => {
                element.parentElement.parentElement.classList.remove('success-animation');
            }, 600);
        }
    }
    
    requestAnimationFrame(animate);
}

// Easing function
function easeOutQuart(t) {
    return 1 - (--t) * t * t * t;
}

// Advanced Feedback Systems

// Toast Notification System
function showToast(type, title, message, duration = 5000) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fa-solid ${iconMap[type]}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="closeToast(this)">
            <i class="fa-solid fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto remove
    setTimeout(() => {
        closeToast(toast.querySelector('.toast-close'));
    }, duration);
    
    return toast;
}

function closeToast(button) {
    const toast = button.closest('.toast');
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
}

// Page Transition System
function showPageTransition(text = 'Yükleniyor...') {
    const transition = document.getElementById('pageTransition');
    const textElement = transition.querySelector('.page-transition-text');
    textElement.textContent = text;
    transition.classList.add('active');
}

function hidePageTransition() {
    const transition = document.getElementById('pageTransition');
    transition.classList.remove('active');
}

// Navigation with Transition (Router entegre)
function navigateWithTransition(event, url) {
    event.preventDefault();
    
    // Router varsa onu kullan
    if (window.router) {
        window.router.navigate(url);
    } else {
        // Fallback: Mevcut transition sistemi
        showPageTransition('Sayfa yükleniyor...');
        updateProgressBar(30);
        
        setTimeout(() => {
            updateProgressBar(60);
        }, 200);
        
        setTimeout(() => {
            updateProgressBar(100);
            window.location.href = url;
        }, 500);
    }
}

// Dashboard initialization (Router için)
function initDashboard() {
    console.log('🏠 Dashboard initialized');
    
    // Dashboard-specific initialization
    if (typeof refreshDashboard === 'function') {
        refreshDashboard();
    }
    
    // Auto-refresh every 5 minutes
    setInterval(() => {
        if (window.router && window.router.getCurrentRoute() === '/dashboard') {
            refreshDashboard();
        }
    }, 300000);
}

// Progress Bar
function updateProgressBar(percentage) {
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = percentage + '%';
    
    if (percentage === 100) {
        setTimeout(() => {
            progressBar.style.width = '0%';
        }, 200);
    }
}

// Confirmation Modal System
function showConfirmation(title, message, type = 'warning') {
    return new Promise((resolve) => {
        const overlay = document.getElementById('confirmationOverlay');
        const titleElement = document.getElementById('confirmationTitle');
        const messageElement = document.getElementById('confirmationMessage');
        const iconElement = document.getElementById('confirmationIcon');
        const confirmBtn = document.getElementById('confirmationConfirm');
        const cancelBtn = document.getElementById('confirmationCancel');
        
        titleElement.textContent = title;
        messageElement.textContent = message;
        iconElement.className = `confirmation-icon ${type}`;
        
        overlay.classList.add('show');
        
        const handleConfirm = () => {
            cleanup();
            resolve(true);
        };
        
        const handleCancel = () => {
            cleanup();
            resolve(false);
        };
        
        const cleanup = () => {
            overlay.classList.remove('show');
            confirmBtn.removeEventListener('click', handleConfirm);
            cancelBtn.removeEventListener('click', handleCancel);
        };
        
        confirmBtn.addEventListener('click', handleConfirm);
        cancelBtn.addEventListener('click', handleCancel);
        
        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                handleCancel();
            }
        });
    });
}

// Logout Confirmation
async function confirmLogout(event) {
    event.preventDefault();
    
    const confirmed = await showConfirmation(
        'Çıkış Yap',
        'Oturumunuzu kapatmak istediğinizden emin misiniz?',
        'warning'
    );
    
    if (confirmed) {
        showToast('info', 'Çıkış Yapılıyor', 'Oturumunuz kapatılıyor...', 2000);
        showPageTransition('Çıkış yapılıyor...');
        
        setTimeout(() => {
            window.location.href = '/logout/';
        }, 1000);
    }
}

// Son hastaları yükle
async function loadRecentPatients() {
    try {
        const response = await errorHandler.apiRequest(`${API_BASE_URL}/patients/?limit=5`);
        renderRecentPatients(response.results || response);
    } catch (error) {
        renderRecentPatients([]);
    }
}

// Son hastaları render et
function renderRecentPatients(patients) {
    const tbody = document.getElementById('recentPatientsTable');
    
    if (patients.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem;">Hasta bulunamadı</td></tr>';
        return;
    }
    
    tbody.innerHTML = patients.map(patient => `
        <tr>
            <td>${patient.first_name} ${patient.last_name}</td>
            <td>${formatDate(patient.birth_date)}</td>
            <td>${patient.phone || '-'}</td>
            <td><span class="status-badge status-active">Aktif</span></td>
        </tr>
    `).join('');
}

// Yaklaşan randevuları yükle
async function loadUpcomingAppointments() {
    try {
        // Hem scheduled hem de pending randevuları al
        const scheduledResponse = await errorHandler.apiRequest(`${API_BASE_URL}/appointments/?limit=3&status=scheduled`);
        const pendingResponse = await errorHandler.apiRequest(`${API_BASE_URL}/appointments/?limit=2&status=pending`);
        
        const scheduledAppointments = scheduledResponse.results || scheduledResponse || [];
        const pendingAppointments = pendingResponse.results || pendingResponse || [];
        
        // İki listeyi birleştir ve tarihe göre sırala
        const allAppointments = [...scheduledAppointments, ...pendingAppointments];
        allAppointments.sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date));
        
        renderUpcomingAppointments(allAppointments.slice(0, 5));
    } catch (error) {
        renderUpcomingAppointments([]);
    }
}

// Yaklaşan randevuları render et
function renderUpcomingAppointments(appointments) {
    const tbody = document.getElementById('upcomingAppointmentsTable');
    
    if (appointments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem;">Randevu bulunamadı</td></tr>';
        return;
    }
    
    tbody.innerHTML = appointments.map(appointment => {
        const statusClass = appointment.status === 'pending' ? 'status-pending' : 'status-scheduled';
        const statusText = appointment.status === 'pending' ? 'Bekliyor' : 'Planlandı';
        
        return `
        <tr>
            <td>${formatDate(appointment.appointment_date)}</td>
            <td>${appointment.patient_name || '-'}</td>
            <td>${appointment.appointment_time || '-'}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        </tr>
    `;
    }).join('');
}

// Cihaz envanterini yükle
async function loadDeviceInventory() {
    try {
        const response = await errorHandler.apiRequest(`${API_BASE_URL}/devices/?limit=5`);
        renderDeviceInventory(response.results || response);
    } catch (error) {
        renderDeviceInventory([]);
    }
}

// Cihaz envanterini render et
function renderDeviceInventory(devices) {
    const tbody = document.getElementById('deviceInventoryTable');
    
    if (devices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem;">Cihaz bulunamadı</td></tr>';
        return;
    }
    
    tbody.innerHTML = devices.map(device => `
        <tr>
            <td>${device.device_name || '-'}</td>
            <td>${device.brand || '-'}</td>
            <td>${device.model || '-'}</td>
            <td>${device.stock_quantity || 0}</td>
        </tr>
    `).join('');
}

// Son test raporlarını yükle
async function loadRecentTests() {
    try {
        const response = await errorHandler.apiRequest(`${API_BASE_URL}/hearing_tests/?limit=5`);
        renderRecentTests(response.results || response);
    } catch (error) {
        renderRecentTests([]);
    }
}

// Son test raporlarını render et
function renderRecentTests(tests) {
    const tbody = document.getElementById('recentTestsTable');
    
    if (tests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem;">Test raporu bulunamadı</td></tr>';
        return;
    }
    
    tbody.innerHTML = tests.map(test => `
        <tr>
            <td>${test.patient_name || '-'}</td>
            <td>${test.test_type || '-'}</td>
            <td>${formatDate(test.test_date)}</td>
            <td><span class="status-badge status-completed">Tamamlandı</span></td>
        </tr>
    `).join('');
}

// Tarih formatla
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
}

// Arama filtreleri
function filterPatients(searchTerm) {
    // Hasta arama fonksiyonu
    console.log('Hasta arama:', searchTerm);
}

function filterAppointments(searchTerm) {
    // Randevu arama fonksiyonu
    console.log('Randevu arama:', searchTerm);
}

function filterDevices(searchTerm) {
    // Cihaz arama fonksiyonu
    console.log('Cihaz arama:', searchTerm);
}

function filterTests(searchTerm) {
    // Test arama fonksiyonu
    console.log('Test arama:', searchTerm);
}

// Dashboard yenileme
function refreshDashboard() {
    loadDashboardData();
    errorHandler.showSuccess('Dashboard yenilendi');
}