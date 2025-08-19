const API_BASE_URL = '/api';
let currentPage = 1;
let totalPages = 1;
let lastQuery = '';
let lastStatus = '';
let lastAge = '';

// Global filter state
let activeFilters = {
    tcNumber: '',
    name: '',
    phone: '',
    email: '',
    age: '',
    status: '',
    lastAppointmentStart: '',
    lastAppointmentEnd: '',
    createdStart: '',
    createdEnd: '',
    birthDateStart: '',
    birthDateEnd: ''
};

document.addEventListener('DOMContentLoaded', function() {
    // ErrorHandler zaten error-handler.js'de initialize edildi
    // Sadece global errorHandler'ı kullan
    const errorHandler = window.errorHandler;
    
    console.log('Hasta sayfası yüklendi');
    console.log('ErrorHandler mevcut mu:', !!errorHandler);
    
    // Ana arama için event listener ekle
    const mainSearch = document.getElementById('mainSearch');
    if (mainSearch) {
        mainSearch.addEventListener('input', debounce(function() {
            currentPage = 1;
            fetchPatients();
        }, 500));
    }
    
    fetchPatients();
    fetchPatientStats();
});



         async function fetchPatients() {
     const tbody = document.getElementById('patientsTable');
                      tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem;"><i class="fa-solid fa-spinner fa-spin"></i> Yükleniyor...</td></tr>';
     
     // Ana arama değerini al
     const mainSearch = document.getElementById('mainSearch');
     const searchValue = mainSearch ? mainSearch.value.trim() : '';
     
     let url = `${API_BASE_URL}/patients/?page=${currentPage}`;
     if (searchValue) {
         url += `&search=${encodeURIComponent(searchValue)}`;
     }

                 // Apply column filters
    if (activeFilters.tcNumber) {
        url += `&tc_number=${encodeURIComponent(activeFilters.tcNumber)}`;
    }
    if (activeFilters.name) {
        url += `&name=${encodeURIComponent(activeFilters.name)}`;
    }
    if (activeFilters.phone) {
        url += `&phone=${encodeURIComponent(activeFilters.phone)}`;
    }
    if (activeFilters.email) {
        url += `&email=${encodeURIComponent(activeFilters.email)}`;
    }
    if (activeFilters.age) {
        url += `&age_group=${encodeURIComponent(activeFilters.age)}`;
    }
    if (activeFilters.status) {
        url += `&status=${encodeURIComponent(activeFilters.status)}`;
    }
    if (activeFilters.birthDateStart) {
        url += `&birth_date_gte=${encodeURIComponent(activeFilters.birthDateStart)}`;
    }
    if (activeFilters.birthDateEnd) {
        url += `&birth_date_lte=${encodeURIComponent(activeFilters.birthDateEnd)}`;
    }
     if (activeFilters.lastAppointmentStart) {
         url += `&last_appointment_date_gte=${encodeURIComponent(activeFilters.lastAppointmentStart)}`;
     }
     if (activeFilters.lastAppointmentEnd) {
         url += `&last_appointment_date_lte=${encodeURIComponent(activeFilters.lastAppointmentEnd)}`;
     }
     if (activeFilters.createdStart) {
         url += `&created_at_gte=${encodeURIComponent(activeFilters.createdStart)}`;
     }
     if (activeFilters.createdEnd) {
         url += `&created_at_lte=${encodeURIComponent(activeFilters.createdEnd)}`;
     }
    
    try {
        console.log('Hasta API URL:', url);
        const data = await errorHandler.apiRequest(url);
        console.log('Hasta API Response:', data);
        console.log('Patients data:', data.results || data);
        renderPatients(data.results || data);
        renderPagination(data.count, data.page_size || 10);
                 } catch (error) {
        console.error('Hasta yükleme hatası:', error);
         tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem;">Veri alınamadı.</td></tr>';
     }
}

async function fetchPatientStats() {
    try {
        // Hasta ve randevu verilerini paralel olarak al
        const [patientsResponse, appointmentsResponse] = await Promise.all([
            errorHandler.apiRequest(`${API_BASE_URL}/patients/`),
            errorHandler.apiRequest(`${API_BASE_URL}/appointments/`)
        ]);
        
        const patients = patientsResponse.results || patientsResponse;
        const appointments = appointmentsResponse.results || appointmentsResponse;
        
        console.log('İstatistik için hastalar:', patients);
        console.log('İstatistik için randevular:', appointments);
        
        // İstatistikleri hesapla
        const stats = calculatePatientStats(patients, appointments);
        
        // Kartları güncelle
        document.getElementById('totalPatients').textContent = stats.totalPatients;
        document.getElementById('activePatients').textContent = stats.activePatients;
        document.getElementById('newPatients').textContent = stats.newPatients;
        document.getElementById('appointmentsThisMonth').textContent = stats.appointmentsThisMonth;
        
    } catch (error) {
        console.error('İstatistikler yüklenemedi:', error);
        // Hata durumunda sıfır göster
        document.getElementById('totalPatients').textContent = '0';
        document.getElementById('activePatients').textContent = '0';
        document.getElementById('newPatients').textContent = '0';
        document.getElementById('appointmentsThisMonth').textContent = '0';
    }
}

// Hasta istatistiklerini hesapla
function calculatePatientStats(patients, appointments) {
    let totalPatients = patients.length;
    let activePatients = 0;
    let newPatients = 0;
    let appointmentsThisMonth = 0;
    
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Hasta istatistikleri
    patients.forEach(patient => {
        // Aktif hastalar
        if (patient.status === 'active') {
            activePatients++;
        }
        
        // Bu ay yeni hastalar
        if (patient.created_at) {
            const createdDate = new Date(patient.created_at);
            if (createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear) {
                newPatients++;
            }
        }
    });
    
    // Bu ay randevu sayısı
    appointments.forEach(appointment => {
        if (appointment.appointment_date) {
            const appointmentDate = new Date(appointment.appointment_date);
            if (appointmentDate.getMonth() === currentMonth && appointmentDate.getFullYear() === currentYear) {
                appointmentsThisMonth++;
            }
        }
    });
    
    console.log('Hasta istatistik sonuçları:', {
        totalPatients,
        activePatients,
        newPatients,
        appointmentsThisMonth,
        currentMonth: currentMonth + 1,
        currentYear
    });
    
    return {
        totalPatients,
        activePatients,
        newPatients,
        appointmentsThisMonth
    };
}

         function renderPatients(patients) {
     const tbody = document.getElementById('patientsTable');
     if (!patients || patients.length === 0) {
         tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem;">Kayıt bulunamadı.</td></tr>';
         return;
     }
    tbody.innerHTML = '';
    patients.forEach(patient => {
        const statusClass = patient.status === 'active' ? 'status-active' : 'status-inactive';
        const statusLabel = patient.status === 'active' ? 'Aktif' : 'Pasif';
        tbody.innerHTML += `
            <tr>
                <td>${patient.tc_number || '-'}</td>
                <td>${patient.first_name} ${patient.last_name}</td>
                <td>${patient.birth_date || '-'}</td>
                <td>${patient.phone || '-'}</td>
                <td>${patient.email || '-'}</td>
                <td>${patient.last_appointment_date || '-'}</td>
                <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="editPatient(${patient.id})">Düzenle</button>
                        <button class="btn-status ${patient.status === 'active' ? 'btn-deactivate' : 'btn-activate'}" 
                                onclick="togglePatientStatus(${patient.id}, '${patient.status}')">
                            ${patient.status === 'active' ? 'Pasifleştir' : 'Aktifleştir'}
                        </button>
                        <button class="btn-delete" onclick="deletePatient(${patient.id})">Sil</button>
                    </div>
                </td>
            </tr>
        `;
    });
}

function renderPagination(count, pageSize) {
    totalPages = Math.ceil(count / pageSize);
    const pagination = document.getElementById('pagination');
    if (!pagination) {
        console.error('Pagination elementi bulunamadı!');
        return;
    }
    pagination.innerHTML = '';
    if (totalPages <= 1) return;
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        if (i === currentPage) btn.classList.add('active');
        btn.onclick = () => { currentPage = i; fetchPatients(); };
        pagination.appendChild(btn);
    }
}

async function editPatient(id) {
    try {
        console.log('Hasta düzenleme ID:', id);
        const patient = await errorHandler.apiRequest(`${API_BASE_URL}/patients/${id}/`);
        console.log('Hasta verileri:', patient);
        
                         // Form alanlarını doldur
         document.getElementById('editPatientId').value = patient.id;
         
         // Temel Bilgiler
         document.getElementById('editTcNumber').value = patient.tc_number || '';
         document.getElementById('editFirstName').value = patient.first_name || '';
         document.getElementById('editLastName').value = patient.last_name || '';
         document.getElementById('editBirthDate').value = patient.birth_date || '';
         document.getElementById('editGender').value = patient.gender || '';
         document.getElementById('editOccupation').value = patient.occupation || '';
         
         // İletişim Bilgileri
         document.getElementById('editPhone').value = patient.phone || '';
         document.getElementById('editEmail').value = patient.email || '';
         document.getElementById('editCity').value = patient.city || '';
         document.getElementById('editDistrict').value = patient.district || '';
         document.getElementById('editAddress').value = patient.address || '';
         
         // Tıbbi Bilgiler
         document.getElementById('editMedicalHistory').value = patient.medical_history || '';
         document.getElementById('editAllergies').value = patient.allergies || '';
         document.getElementById('editCurrentMedications').value = patient.current_medications || '';
         
         // Acil Durum Bilgileri
         document.getElementById('editEmergencyContact').value = patient.emergency_contact || '';
         document.getElementById('editEmergencyPhone').value = patient.emergency_phone || '';
         
         // İşitme Cihazı Bilgileri
         document.getElementById('editHearingAidType').value = patient.hearing_aid_type || '';
         document.getElementById('editHearingAidBrand').value = patient.hearing_aid_brand || '';
         document.getElementById('editHearingAidModel').value = patient.hearing_aid_model || '';
         document.getElementById('editHearingAidSerial').value = patient.hearing_aid_serial || '';
         
         // Sosyal Bilgiler
         document.getElementById('editInsuranceProvider').value = patient.insurance_provider || '';
         document.getElementById('editInsuranceNumber').value = patient.insurance_number || '';
         document.getElementById('editReferringDoctor').value = patient.referring_doctor || '';
         
         // Genel Bilgiler
         document.getElementById('editNotes').value = patient.notes || '';
         document.getElementById('editStatus').value = patient.status || 'active';
        
        // Modal'ı göster
        const modal = document.getElementById('editPatientModal');
        modal.style.display = 'block';
        // Kısa bir gecikme ile show class'ını ekle
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
    } catch (error) {
        console.error('Hasta bilgileri yüklenemedi:', error);
        errorHandler.showError('Hasta bilgileri yüklenemedi');
    }
}

async function togglePatientStatus(id, currentStatus) {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const actionText = newStatus === 'active' ? 'aktifleştirmek' : 'pasifleştirmek';
    
    if (!confirm(`Bu hastayı ${actionText} istediğinize emin misiniz?`)) return;
    
    try {
        // Önce hasta verilerini al
        const patient = await errorHandler.apiRequest(`${API_BASE_URL}/patients/${id}/`);
        
        // Status'unu güncelle
        const updateData = {
            first_name: patient.first_name,
            last_name: patient.last_name,
            birth_date: patient.birth_date,
            gender: patient.gender,
            phone: patient.phone,
            email: patient.email || '',
            address: patient.address || '',
            status: newStatus
        };
        
        console.log(`Hasta ${id} status güncelleniyor: ${currentStatus} -> ${newStatus}`);
        
        await errorHandler.apiRequest(`${API_BASE_URL}/patients/${id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
            },
            body: JSON.stringify(updateData)
        });
        
        const statusText = newStatus === 'active' ? 'aktifleştirildi' : 'pasifleştirildi';
        errorHandler.showSuccess(`Hasta ${statusText}`);
        fetchPatients();
        fetchPatientStats();
    } catch (error) {
        console.error('Status güncelleme hatası:', error);
        // Hata zaten errorHandler tarafından gösterildi
    }
}

async function deletePatient(id) {
    if (!confirm('Bu hastayı silmek istediğinize emin misiniz?')) return;
    try {
        await errorHandler.apiRequest(`${API_BASE_URL}/patients/${id}/`, {
            method: 'DELETE'
        });
        errorHandler.showSuccess('Hasta silindi');
        fetchPatients();
    } catch (error) {
        // Hata zaten errorHandler tarafından gösterildi
    }
}

// Modal fonksiyonları - Global scope'a taşındı
window.openNewPatientModal = function() {
    const modal = document.getElementById('newPatientModal');
    modal.style.display = 'block';
    // Kısa bir gecikme ile show class'ını ekle
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    document.getElementById('newPatientForm').reset();
}

window.closeNewPatientModal = function() {
    const modal = document.getElementById('newPatientModal');
    modal.classList.remove('show');
    // Animasyon bittikten sonra modal'ı gizle
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Düzenleme modal fonksiyonları
window.closeEditPatientModal = function() {
    const modal = document.getElementById('editPatientModal');
    modal.classList.remove('show');
    // Animasyon bittikten sonra modal'ı gizle
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Modal dışına tıklandığında kapanma
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
        setTimeout(() => {
            e.target.style.display = 'none';
        }, 300);
    }
});

// ESC tuşu ile modal kapatma
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal.show');
        openModals.forEach(modal => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });
    }
});

// Form submit
document.getElementById('newPatientForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const patientData = Object.fromEntries(formData.entries());
    
    // CSRF token al
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
    try {
        await errorHandler.apiRequest(`${API_BASE_URL}/patients/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify(patientData)
        });
        
        errorHandler.showSuccess('Hasta başarıyla eklendi');
        closeNewPatientModal();
        fetchPatients();
        fetchPatientStats();
    } catch (error) {
        // Hata zaten errorHandler tarafından gösterildi
    }
});

// Düzenleme form submit
document.getElementById('editPatientForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const patientId = formData.get('patient_id');
    
                 const patientData = {
         // Temel Bilgiler
         tc_number: formData.get('tc_number'),
         first_name: formData.get('first_name'),
         last_name: formData.get('last_name'),
         birth_date: formData.get('birth_date'),
         gender: formData.get('gender'),
         occupation: formData.get('occupation'),
         
         // İletişim Bilgileri
         phone: formData.get('phone'),
         email: formData.get('email'),
         city: formData.get('city'),
         district: formData.get('district'),
         address: formData.get('address'),
         
         // Tıbbi Bilgiler
         medical_history: formData.get('medical_history'),
         allergies: formData.get('allergies'),
         current_medications: formData.get('current_medications'),
         
         // Acil Durum Bilgileri
         emergency_contact: formData.get('emergency_contact'),
         emergency_phone: formData.get('emergency_phone'),
         
         // İşitme Cihazı Bilgileri
         hearing_aid_type: formData.get('hearing_aid_type'),
         hearing_aid_brand: formData.get('hearing_aid_brand'),
         hearing_aid_model: formData.get('hearing_aid_model'),
         hearing_aid_serial: formData.get('hearing_aid_serial'),
         
         // Sosyal Bilgiler
         insurance_provider: formData.get('insurance_provider'),
         insurance_number: formData.get('insurance_number'),
         referring_doctor: formData.get('referring_doctor'),
         
         // Genel Bilgiler
         notes: formData.get('notes'),
         status: formData.get('status')
     };
    
    console.log('Güncellenen hasta verisi:', patientData);
    console.log('Hasta ID:', patientId);
    
    const csrfToken = this.querySelector('[name=csrfmiddlewaretoken]').value;
    
    try {
        const response = await errorHandler.apiRequest(`${API_BASE_URL}/patients/${patientId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify(patientData)
        });
        
        console.log('Güncelleme başarılı:', response);
        errorHandler.showSuccess('Hasta başarıyla güncellendi');
        closeEditPatientModal();
        fetchPatients();
        fetchPatientStats();
    } catch (error) {
        console.error('Hasta güncelleme hatası:', error);
        // Hata zaten errorHandler tarafından gösterildi
    }
});



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

function filterByTcNumber(value) {
    activeFilters.tcNumber = value;
    applyColumnFilters();
}

function filterByName(value) {
    activeFilters.name = value;
    applyColumnFilters();
}

function filterByPhone(value) {
    activeFilters.phone = value;
    applyColumnFilters();
}

function filterByEmail(value) {
    activeFilters.email = value;
    applyColumnFilters();
}

function filterByAge(value) {
    activeFilters.age = value;
    applyColumnFilters();
}

function filterByStatus(value) {
    activeFilters.status = value;
    applyColumnFilters();
}

function filterByBirthDate() {
    const startDate = document.getElementById('birthDate-start').value;
    const endDate = document.getElementById('birthDate-end').value;
    activeFilters.birthDateStart = startDate;
    activeFilters.birthDateEnd = endDate;
    applyColumnFilters();
}

function filterByDateRange() {
    const startDate = document.getElementById('lastAppointmentStart').value;
    const endDate = document.getElementById('lastAppointmentEnd').value;
    activeFilters.lastAppointmentStart = startDate;
    activeFilters.lastAppointmentEnd = endDate;
    applyColumnFilters();
}

function filterByCreatedDateRange() {
    const startDate = document.getElementById('createdStart').value;
    const endDate = document.getElementById('createdEnd').value;
    activeFilters.createdStart = startDate;
    activeFilters.createdEnd = endDate;
    applyColumnFilters();
}

function applyColumnFilters() {
    currentPage = 1;
    fetchPatients();
}

function clearAllFilters() {
    // Reset all filter inputs
    document.querySelectorAll('.filter-dropdown input, .filter-dropdown select').forEach(input => {
        input.value = '';
    });
    
    // Reset global filter state
    activeFilters = {
        tcNumber: '',
        name: '',
        phone: '',
        email: '',
        age: '',
        status: '',
        lastAppointmentStart: '',
        lastAppointmentEnd: '',
        createdStart: '',
        createdEnd: '',
        birthDateStart: '',
        birthDateEnd: ''
    };
    
    // Clear main search
    const mainSearch = document.getElementById('mainSearch');
    if (mainSearch) {
        mainSearch.value = '';
    }
    
    currentPage = 1;
    fetchPatients();
}

// Ana arama fonksiyonu
function applyFilters() {
    const mainSearch = document.getElementById('mainSearch');
    if (mainSearch && mainSearch.value.trim()) {
        currentPage = 1;
        fetchPatients();
    }
}

// Ana arama için debounce fonksiyonu
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Toast System
function showToast(type, title, message, duration = 5000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fa-solid fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, duration);
}

// Page Transition System
function showPageTransition(text = 'Yükleniyor...') {
    const transition = document.getElementById('pageTransition');
    if (!transition) return;
    
    const textElement = transition.querySelector('.page-transition-text');
    if (textElement) {
        textElement.textContent = text;
    }
    
    transition.classList.add('show');
}

function hidePageTransition() {
    const transition = document.getElementById('pageTransition');
    if (transition) {
        transition.classList.remove('show');
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
