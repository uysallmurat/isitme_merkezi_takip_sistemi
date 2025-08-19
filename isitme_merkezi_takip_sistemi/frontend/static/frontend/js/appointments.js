const API_BASE_URL = '/api';
        
// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    // ErrorHandler zaten error-handler.js'de initialize edildi
    const errorHandler = window.errorHandler;
    
    loadAppointments();
    loadAppointmentStats();
    loadPatients();
    setupFilters();
    
    // Welcome toast kaldırıldı
});

// Randevuları yükle
async function loadAppointments() {
    try {
        console.log('Randevular yükleniyor...');
        
        // Filtreleme parametrelerini oluştur
        let url = `${API_BASE_URL}/appointments/?`;
        
        if (activeFilters.name) url += `search=${encodeURIComponent(activeFilters.name)}&`;
        if (activeFilters.date) url += `date=${encodeURIComponent(activeFilters.date)}&`;
        if (activeFilters.time) url += `time=${encodeURIComponent(activeFilters.time)}&`;
        if (activeFilters.type) url += `type=${encodeURIComponent(activeFilters.type)}&`;
        if (activeFilters.status) url += `status=${encodeURIComponent(activeFilters.status)}&`;
        if (activeFilters.dateStart) url += `date_from=${encodeURIComponent(activeFilters.dateStart)}&`;
        if (activeFilters.dateEnd) url += `date_to=${encodeURIComponent(activeFilters.dateEnd)}&`;
        
        console.log('Filtreleme URL:', url);
        
        const response = await errorHandler.apiRequest(url);
        console.log('Randevu API Response:', response);
        console.log('Randevu sayısı:', response?.length || response?.results?.length || 0);
        renderAppointments(response.results || response);
    } catch (error) {
        console.error('Randevu yükleme hatası:', error);
        renderAppointments([]);
    }
}

// Randevu istatistiklerini yükle
async function loadAppointmentStats() {
    try {
        // Tüm randevuları al
        const response = await fetch(`${API_BASE_URL}/appointments/`);
        if (!response.ok) {
            throw new Error('Randevu verileri alınamadı');
        }
        
        const appointments = await response.json();
        console.log('İstatistik için randevular:', appointments);
        
        // İstatistikleri hesapla
        const stats = calculateAppointmentStats(appointments);
        
        // Kartları güncelle
        document.getElementById('totalAppointments').textContent = stats.totalAppointments;
        document.getElementById('todayAppointments').textContent = stats.todayAppointments;
        document.getElementById('completedAppointments').textContent = stats.completedAppointments;
        document.getElementById('weeklyAppointments').textContent = stats.weeklyAppointments;
        
    } catch (error) {
        console.error('Randevu istatistikleri yüklenemedi:', error);
        // Hata durumunda sıfır göster
        document.getElementById('totalAppointments').textContent = '0';
        document.getElementById('todayAppointments').textContent = '0';
        document.getElementById('completedAppointments').textContent = '0';
        document.getElementById('weeklyAppointments').textContent = '0';
    }
}

// Randevu istatistiklerini hesapla
function calculateAppointmentStats(appointments) {
    let totalAppointments = appointments.length;
    let todayAppointments = 0;
    let completedAppointments = 0;
    let weeklyAppointments = 0;
    
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD formatı
    
    // Bu haftanın başlangıcını hesapla (Pazartesi)
    const weekStart = new Date(today);
    const dayOfWeek = today.getDay(); // 0=Pazar, 1=Pazartesi, ..., 6=Cumartesi
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Pazar ise 6 gün geriye, diğerleri dayOfWeek-1
    weekStart.setDate(today.getDate() - daysToMonday);
    weekStart.setHours(0, 0, 0, 0);
    
    // Bu haftanın sonunu hesapla (Pazar)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    console.log('Hafta hesaplama:', {
        today: today.toISOString(),
        weekStart: weekStart.toISOString(),
        weekEnd: weekEnd.toISOString(),
        dayOfWeek: dayOfWeek,
        daysToMonday: daysToMonday
    });
    
    appointments.forEach(appointment => {
        const appointmentDate = new Date(appointment.appointment_date);
        const appointmentDateStr = appointmentDate.toISOString().split('T')[0];
        
        console.log('Randevu kontrol:', {
            date: appointmentDate.toISOString(),
            dateStr: appointmentDateStr,
            todayStr: todayStr,
            isToday: appointmentDateStr === todayStr,
            isThisWeek: appointmentDate >= weekStart && appointmentDate <= weekEnd,
            status: appointment.status
        });
        
        // Bugünkü randevular
        if (appointmentDateStr === todayStr) {
            todayAppointments++;
        }
        
        // Tamamlanan randevular
        if (appointment.status === 'completed') {
            completedAppointments++;
        }
        
        // Bu hafta randevular (Pazartesi - Pazar)
        if (appointmentDate >= weekStart && appointmentDate <= weekEnd) {
            weeklyAppointments++;
        }
    });
    
    console.log('İstatistik sonuçları:', {
        totalAppointments,
        todayAppointments,
        completedAppointments,
        weeklyAppointments
    });
    
    return {
        totalAppointments,
        todayAppointments,
        completedAppointments,
        weeklyAppointments
    };
}

// Hasta listesini yükle
async function loadPatients() {
    try {
        const response = await errorHandler.apiRequest(`${API_BASE_URL}/patients/`);
        const patients = response.results || response;
        const patientSelect = document.getElementById('patientSelect');
        
        // Mevcut seçenekleri temizle (ilk seçenek hariç)
        patientSelect.innerHTML = '<option value="">Hasta seçin...</option>';
        
        // Hasta seçeneklerini ekle
        patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.id;
            option.textContent = `${patient.first_name} ${patient.last_name}`;
            patientSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Hasta listesi yüklenemedi:', error);
    }
}

// Randevuları tabloya render et
function renderAppointments(appointments) {
    const tbody = document.getElementById('appointmentsTable');
    
    if (appointments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">Randevu bulunamadı</td></tr>';
        return;
    }
    
    tbody.innerHTML = appointments.map(appointment => `
        <tr>
            <td>${appointment.patient_name || 'Bilinmeyen Hasta'}</td>
            <td>${appointment.appointment_date_display || '-'}</td>
            <td>${appointment.appointment_time_display || '-'}</td>
            <td>${appointment.appointment_type || '-'}</td>
            <td>
                <span class="status-badge status-${appointment.status || 'scheduled'}">
                    ${getStatusText(appointment.status)}
                </span>
            </td>
            <td class="action-buttons">
                <button class="btn-small btn-view" onclick="viewAppointment(${appointment.id})">
                    <i class="fa-solid fa-eye"></i> Görüntüle
                </button>
                <button class="btn-small btn-edit" onclick="editAppointment(${appointment.id})">
                    <i class="fa-solid fa-edit"></i> Düzenle
                </button>
                <button class="btn-small btn-delete" onclick="deleteAppointment(${appointment.id})">
                    <i class="fa-solid fa-trash"></i> Sil
                </button>
            </td>
        </tr>
    `).join('');
}

// Durum metnini getir
function getStatusText(status) {
    switch(status) {
        case 'scheduled': return 'Planlandı';
        case 'completed': return 'Tamamlandı';
        case 'cancelled': return 'İptal Edildi';
        default: return 'Planlandı';
    }
}

// Global filter state
let activeFilters = {
    name: '',
    date: '',
    time: '',
    type: '',
    status: '',
    dateStart: '',
    dateEnd: ''
};

let currentPage = 1;

// Filtreleri kur
function setupFilters() {
    const mainSearch = document.getElementById('mainSearch');
    
    // Ana arama filtresi
    if (mainSearch) {
        mainSearch.addEventListener('input', debounce(() => {
            applyFilters();
        }, 500));
    }
}

// Filtreleri uygula
async function applyFilters() {
    const mainSearch = document.getElementById('mainSearch');
    if (mainSearch) {
        activeFilters.name = mainSearch.value;
    }
    
    // Filtreleri uygula
    loadAppointments();
}

// Debounce fonksiyonu
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Sütun başlığı filtre fonksiyonları
function toggleFilter(columnName) {
    // Close all other filters first
    closeAllFilters();
    
    const filterDropdown = document.getElementById(`${columnName}-filter`);
    if (filterDropdown) {
        filterDropdown.style.display = 'block';
        
        // Load name options if opening name filter
        if (columnName === 'name') {
            loadNameOptions();
        }
    }
}

function closeAllFilters() {
    const allFilters = document.querySelectorAll('.filter-dropdown');
    allFilters.forEach(filter => {
        filter.style.display = 'none';
    });
}

// Close filters when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.closest('.sortable-header')) {
        closeAllFilters();
    }
});

async function loadNameOptions() {
    try {
        const response = await fetch(`${API_BASE_URL}/patients/`);
        const data = await response.json();
        const names = [...new Set(data.results.map(patient => `${patient.first_name} ${patient.last_name}`))];
        
        const optionsContainer = document.getElementById('name-options');
        optionsContainer.innerHTML = '';
        
        names.forEach(name => {
            const option = document.createElement('div');
            option.className = 'filter-option';
            option.textContent = name;
            option.onclick = () => selectNameFilter(name);
            optionsContainer.appendChild(option);
        });
    } catch (error) {
        console.error('İsim seçenekleri yüklenirken hata:', error);
    }
}

function selectNameFilter(name) {
    document.querySelector('#name-filter input').value = name;
    filterByName(name);
    closeAllFilters();
}

function filterByName(value) {
    activeFilters.name = value;
    applyColumnFilters();
}

function filterByDate(value) {
    activeFilters.date = value;
    applyColumnFilters();
}

function filterByTime(value) {
    activeFilters.time = value;
    applyColumnFilters();
}

function filterByType(value) {
    activeFilters.type = value;
    applyColumnFilters();
}

function filterByStatus(value) {
    activeFilters.status = value;
    applyColumnFilters();
}

function filterByDateRange() {
    const startDate = document.getElementById('date-start').value;
    const endDate = document.getElementById('date-end').value;
    activeFilters.dateStart = startDate;
    activeFilters.dateEnd = endDate;
    applyColumnFilters();
}

function applyColumnFilters() {
    currentPage = 1;
    loadAppointments();
}

function clearAllFilters() {
    // Reset all filter inputs
    document.querySelectorAll('.filter-dropdown input, .filter-dropdown select').forEach(input => {
        input.value = '';
    });
    
    // Reset global filter state
    activeFilters = {
        name: '',
        date: '',
        time: '',
        type: '',
        status: '',
        dateStart: '',
        dateEnd: ''
    };
    
    // Clear main search
    const mainSearch = document.getElementById('mainSearch');
    if (mainSearch) {
        mainSearch.value = '';
    }
    
    currentPage = 1;
    loadAppointments();
}

// Randevu işlemleri
function openNewAppointmentModal() {
    const modal = document.getElementById('newAppointmentModal');
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    document.getElementById('newAppointmentForm').reset();
    
    // Bugünün tarihini varsayılan olarak ayarla
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appointmentDate').value = today;
}

function closeNewAppointmentModal() {
    const modal = document.getElementById('newAppointmentModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

async function viewAppointment(id) {
    try {
        const appointment = await errorHandler.apiRequest(`${API_BASE_URL}/appointments/${id}/`);
        
        // Modal içeriğini doldur
        document.getElementById('viewAppointmentId').textContent = appointment.id;
        document.getElementById('viewAppointmentPatient').textContent = appointment.patient_name || `Hasta ID: ${appointment.patient}`;
        document.getElementById('viewAppointmentDate').textContent = appointment.appointment_date_display || appointment.appointment_date;
        document.getElementById('viewAppointmentTime').textContent = appointment.appointment_time_display;
        // Appointment type'ı Türkçe'ye çevir
        const appointmentTypes = {
            'consultation': 'Konsültasyon',
            'hearing_test': 'İşitme Testi', 
            'device_fitting': 'Cihaz Uygulaması',
            'follow_up': 'Kontrol',
            'maintenance': 'Bakım'
        };
        document.getElementById('viewAppointmentType').textContent = appointmentTypes[appointment.appointment_type] || appointment.appointment_type;
        // Status'u Türkçe'ye çevir
        const statusTypes = {
            'scheduled': 'Planlandı',
            'completed': 'Tamamlandı',
            'cancelled': 'İptal Edildi'
        };
        document.getElementById('viewAppointmentStatus').textContent = statusTypes[appointment.status] || appointment.status;
        document.getElementById('viewAppointmentNotes').textContent = appointment.notes || 'Not yok';
        
        // Status badge rengini ayarla
        const statusBadge = document.getElementById('viewAppointmentStatus');
        statusBadge.className = `status-badge ${appointment.status.toLowerCase()}`;
        
        // Modal'ı göster
        const modal = document.getElementById('viewAppointmentModal');
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
    } catch (error) {
        console.error('Randevu detayları yüklenemedi:', error);
    }
}

async function editAppointment(id) {
    try {
        // Randevu verilerini yükle
        const appointment = await errorHandler.apiRequest(`${API_BASE_URL}/appointments/${id}/`);
        
        // Hastaları yükle
        const patients = await errorHandler.apiRequest(`${API_BASE_URL}/patients/`);
        const patientSelect = document.getElementById('editAppointmentPatient');
        patientSelect.innerHTML = '<option value="">Hasta Seçin</option>';
        patients.forEach(patient => {
            const selected = patient.id === appointment.patient ? 'selected' : '';
            patientSelect.innerHTML += `<option value="${patient.id}" ${selected}>${patient.first_name} ${patient.last_name}</option>`;
        });
        
        // Form alanlarını doldur
        document.getElementById('editAppointmentId').value = appointment.id;
        document.getElementById('editAppointmentDate').value = appointment.appointment_date_display || appointment.appointment_date.split('T')[0];
        document.getElementById('editAppointmentTime').value = appointment.appointment_time_display;
        document.getElementById('editAppointmentType').value = appointment.appointment_type;
        document.getElementById('editAppointmentStatus').value = appointment.status;
        document.getElementById('editAppointmentNotes').value = appointment.notes || '';
        
        // Modal'ı göster
        const modal = document.getElementById('editAppointmentModal');
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
    } catch (error) {
        console.error('Randevu düzenleme verisi yüklenemedi:', error);
    }
}

        function closeViewAppointmentModal() {
    const modal = document.getElementById('viewAppointmentModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

function closeEditAppointmentModal() {
    const modal = document.getElementById('editAppointmentModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

async function submitEditAppointment() {
    const form = document.getElementById('editAppointmentForm');
    const formData = new FormData(form);
    
    const appointmentData = {
        patient: formData.get('patient'),
        appointment_date_input: formData.get('appointment_date'),
        appointment_time_input: formData.get('appointment_time'),
        appointment_type: formData.get('appointment_type'),
        status: formData.get('status'),
        notes: formData.get('notes')
    };
    
    // Validasyon
    if (!appointmentData.patient || !appointmentData.appointment_date_input || !appointmentData.appointment_time_input) {
        errorHandler.showError('Lütfen tüm zorunlu alanları doldurun');
        return;
    }
    
    try {
        const appointmentId = formData.get('appointment_id');
        
        // Debug: Gönderilen veriyi console'da göster
        console.log('Gönderilen randevu verisi:', appointmentData);
        console.log('Randevu ID:', appointmentId);
        
        const response = await errorHandler.apiRequest(`${API_BASE_URL}/appointments/${appointmentId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify(appointmentData)
        });
        
        console.log('API Response:', response);
        errorHandler.showSuccess('Randevu başarıyla güncellendi');
        closeEditAppointmentModal();
        loadAppointments();
        
    } catch (error) {
        console.error('Randevu güncellenirken hata:', error);
        console.error('Hata detayları:', error.message);
        
        // Daha detaylı hata mesajı göster
        if (error.message.includes('400')) {
            errorHandler.showError('Form verilerinde hata var. Lütfen tüm alanları kontrol edin.');
        } else {
            errorHandler.showError('Randevu güncellenirken bir hata oluştu: ' + error.message);
        }
    }
}

async function deleteAppointment(id) {
    showConfirmation(
        'Randevuyu Sil',
        'Bu randevuyu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
        'danger',
        async () => {
            try {
                await errorHandler.apiRequest(`${API_BASE_URL}/appointments/${id}/`, {
                    method: 'DELETE'
                });
                errorHandler.showSuccess('Randevu silindi');
                loadAppointments();
            } catch (error) {
                // Hata zaten errorHandler tarafından gösterildi
            }
        }
    );
}

// Form submit event listener
document.getElementById('newAppointmentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const appointmentData = Object.fromEntries(formData.entries());
    
    // Debug için veriyi yazdır
    console.log('Gönderilen veri:', appointmentData);
    
    // CSRF token al
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
    try {
        const response = await errorHandler.apiRequest(`${API_BASE_URL}/appointments/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify(appointmentData)
        });
        
        console.log('Başarılı yanıt:', response);
        errorHandler.showSuccess('Randevu başarıyla eklendi');
        closeNewAppointmentModal();
        loadAppointments();
        loadAppointmentStats();
    } catch (error) {
        console.error('Hata detayı:', error);
        // Hata zaten errorHandler tarafından gösterildi
    }
});

// Modal dışına tıklayınca kapat
window.onclick = function(event) {
    const newAppointmentModal = document.getElementById('newAppointmentModal');
    if (event.target === newAppointmentModal) {
        closeNewAppointmentModal();
    }
    
    const viewAppointmentModal = document.getElementById('viewAppointmentModal');
    if (event.target === viewAppointmentModal) {
        closeViewAppointmentModal();
    }
    
    const editAppointmentModal = document.getElementById('editAppointmentModal');
    if (event.target === editAppointmentModal) {
        closeEditAppointmentModal();
    }
    
    const confirmationOverlay = document.getElementById('confirmationOverlay');
    if (event.target === confirmationOverlay) {
        hideConfirmation();
    }
}

// Confirmation modal fonksiyonları
function showConfirmation(title, message, iconClass, onConfirm) {
    const overlay = document.getElementById('confirmationOverlay');
    const icon = document.getElementById('confirmationIcon');
    const titleEl = document.getElementById('confirmationTitle');
    const messageEl = document.getElementById('confirmationMessage');
    const confirmBtn = document.getElementById('confirmationConfirm');
    const cancelBtn = document.getElementById('confirmationCancel');
    
    // İçeriği güncelle
    titleEl.textContent = title;
    messageEl.textContent = message;
    icon.className = `confirmation-icon ${iconClass}`;
    
    // Event listener'ları temizle ve yeniden ekle
    confirmBtn.onclick = null;
    cancelBtn.onclick = null;
    
    confirmBtn.onclick = () => {
        hideConfirmation();
        if (onConfirm) onConfirm();
    };
    
    cancelBtn.onclick = hideConfirmation;
    
    // Modal'ı göster
    overlay.style.display = 'flex';
    setTimeout(() => {
        overlay.classList.add('show');
    }, 10);
}

function hideConfirmation() {
    const overlay = document.getElementById('confirmationOverlay');
    overlay.classList.remove('show');
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 300);
}

function confirmLogout(event) {
    event.preventDefault();
    showConfirmation(
        'Çıkış Yap',
        'Çıkış yapmak istediğinize emin misiniz?',
        'warning',
        () => {
            window.location.href = '/logout/';
        }
    );
}

// Toast Notification System
function showToast(type, title, message, duration = 5000) {
    let container = document.getElementById('toastContainer');
    if (!container) {
        // Toast container yoksa oluştur
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
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

// Logout Confirmation
async function confirmLogout(event) {
    event.preventDefault();
    
    if (confirm('Oturumunuzu kapatmak istediğinizden emin misiniz?')) {
        showToast('info', 'Çıkış Yapılıyor', 'Oturumunuz kapatılıyor...', 2000);
        setTimeout(() => {
            window.location.href = '/logout/';
        }, 1000);
    }
}