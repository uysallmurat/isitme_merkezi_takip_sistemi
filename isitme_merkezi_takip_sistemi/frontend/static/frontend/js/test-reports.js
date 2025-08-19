const API_BASE_URL = '/api';
        
// Logout confirmation function
function confirmLogout(event) {
    event.preventDefault();
    if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
        window.location.href = '/logout/';
    }
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    loadTestReports();
    loadTestStats();
    setupFilters();
    
    // Yeni test form submit
    document.getElementById('newTestForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        // User ID'yi ekle (şimdilik 1 olarak sabit)
        formData.append('user', '1');
        
        console.log('Yeni test verisi (FormData):', Object.fromEntries(formData.entries()));
        
        // CSRF token'ı modal içindeki formdan al
        const csrfToken = this.querySelector('[name=csrfmiddlewaretoken]').value;
        
        try {
            // FormData için fetch direkt kullanıyoruz (Content-Type otomatik ayarlanır)
            const response = await fetch(`${API_BASE_URL}/hearing_tests/hearing_tests/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                },
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            errorHandler.showSuccess('Test raporu başarıyla eklendi');
            closeNewTestModal();
            loadTestReports(); // Test listesini yenile
            loadTestStats(); // İstatistikleri yenile
        } catch (error) {
            console.error('Test raporu ekleme hatası:', error);
            
            // Detaylı hata mesajını al
            if (error.response) {
                try {
                    const errorData = await error.response.json();
                    console.error('Backend hata detayı:', errorData);
                    if (errorData.details) {
                        console.error('Validation errors:', errorData.details);
                    }
                    if (errorData.received_data) {
                        console.error('Backend received data:', errorData.received_data);
                    }
                } catch (parseError) {
                    console.error('Hata response parse edilemedi:', parseError);
                }
            }
        }
    });

    // Edit Test Form Submit Handler
    document.getElementById('editTestReportForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const testId = document.getElementById('editTestId').value;
        const formData = new FormData(this);
        
        // User ID'yi ekle (şimdilik 1 olarak sabit)
        formData.append('user', '1');
        
        console.log('Test raporu güncelleme verisi (FormData):', Object.fromEntries(formData.entries()));
        
        try {
            // FormData için fetch direkt kullanıyoruz (Content-Type otomatik ayarlanır)
            const response = await fetch(`${API_BASE_URL}/hearing_tests/hearing_tests/${testId}/`, {
                method: 'PATCH',
                headers: {
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                },
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            errorHandler.showSuccess('Test raporu başarıyla güncellendi');
            closeEditTestReportModal();
            loadTestReports(); // Test listesini yenile
            loadTestStats(); // İstatistikleri yenile
        } catch (error) {
            console.error('Test raporu güncelleme hatası:', error);
            errorHandler.showError('Test raporu güncellenirken bir hata oluştu');
        }
    });
});

// Test raporlarını yükle
async function loadTestReports() {
    try {
        console.log('Test raporları yükleniyor...');
        console.log('Mevcut activeFilters:', activeFilters);
        
        // Ana arama değerini al
        const mainSearch = document.getElementById('mainSearch');
        const searchValue = mainSearch ? mainSearch.value.trim() : '';
        console.log('Ana arama değeri:', searchValue);
        
        let url = `${API_BASE_URL}/hearing_tests/hearing_tests/?`;
        
        // Ana arama filtresi
        if (searchValue) {
            url += `search=${encodeURIComponent(searchValue)}&`;
        }
        
        // Sütun filtreleri
        if (activeFilters.patient) {
            url += `patient_name=${encodeURIComponent(activeFilters.patient)}&`;
        }
        if (activeFilters.testType) {
            url += `test_type=${encodeURIComponent(activeFilters.testType)}&`;
        }
        if (activeFilters.testDateStart) {
            url += `test_date_gte=${encodeURIComponent(activeFilters.testDateStart)}&`;
        }
        if (activeFilters.testDateEnd) {
            url += `test_date_lte=${encodeURIComponent(activeFilters.testDateEnd)}&`;
        }
        if (activeFilters.doctor) {
            url += `doctor_name=${encodeURIComponent(activeFilters.doctor)}&`;
        }
        if (activeFilters.status) {
            url += `status=${encodeURIComponent(activeFilters.status)}&`;
        }
        if (activeFilters.diagnosis) {
            url += `diagnosis=${encodeURIComponent(activeFilters.diagnosis)}&`;
        }
        
        console.log('Filtreli API URL:', url);
        const response = await errorHandler.apiRequest(url);
        console.log('Test raporu API Response:', response);
        console.log('Test raporu sayısı:', response?.length || response?.results?.length || 0);
        
        // API response'unu doğru şekilde işle
        let reports = [];
        if (response && typeof response === 'object') {
            if (Array.isArray(response)) {
                reports = response;
            } else if (response.results && Array.isArray(response.results)) {
                reports = response.results;
            } else if (response.data && Array.isArray(response.data)) {
                reports = response.data;
            }
        }
        
        console.log('İşlenmiş test raporları:', reports);
        renderTestReports(reports);
    } catch (error) {
        console.error('Test raporu yükleme hatası:', error);
        renderTestReports([]);
    }
}

// Test istatistiklerini yükle
async function loadTestStats() {
    try {
        // Tüm test raporlarını al
        const response = await errorHandler.apiRequest(`${API_BASE_URL}/hearing_tests/hearing_tests/`);
        console.log('İstatistik için test raporları:', response);
        
        // API response'unu doğru şekilde işle
        let testReports = [];
        if (response && typeof response === 'object') {
            if (Array.isArray(response)) {
                testReports = response;
            } else if (response.results && Array.isArray(response.results)) {
                testReports = response.results;
            } else if (response.data && Array.isArray(response.data)) {
                testReports = response.data;
            }
        }
        
        // İstatistikleri hesapla
        const stats = calculateTestStats(testReports);
        
        // Kartları güncelle
        document.getElementById('totalTests').textContent = stats.totalTests;
        document.getElementById('completedTests').textContent = stats.completedTests;
        document.getElementById('pendingTests').textContent = stats.pendingTests;
        document.getElementById('weeklyTests').textContent = stats.weeklyTests;
        
    } catch (error) {
        console.error('Test istatistikleri yüklenemedi:', error);
        // Hata durumunda sıfır göster
        document.getElementById('totalTests').textContent = '0';
        document.getElementById('completedTests').textContent = '0';
        document.getElementById('pendingTests').textContent = '0';
        document.getElementById('weeklyTests').textContent = '0';
    }
}

// Test istatistiklerini hesapla
function calculateTestStats(testReports) {
    let totalTests = testReports.length;
    let completedTests = 0;
    let pendingTests = 0;
    let weeklyTests = 0;
    
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Bu haftanın başlangıcı
    weekStart.setHours(0, 0, 0, 0);
    
    testReports.forEach(test => {
        const testDate = new Date(test.test_date);
        
        // Tamamlanan testler (status='Completed' veya diagnosis dolu olanlar)
        if (test.status === 'Completed' || (test.diagnosis && test.diagnosis.trim() !== '')) {
            completedTests++;
        } else if (test.status === 'Incomplete') {
            // Bekleyen testler (status='Incomplete')
            pendingTests++;
        } else if (test.status === 'Cancelled') {
            // İptal edilen testler sayıma dahil edilmez
            totalTests--;
        }
        
        // Bu hafta yapılan testler
        if (testDate >= weekStart && testDate <= today) {
            weeklyTests++;
        }
    });
    
    return {
        totalTests,
        completedTests,
        pendingTests,
        weeklyTests
    };
}

// Test raporlarını tabloya render et
function renderTestReports(reports) {
    const tbody = document.getElementById('testReportsTable');
    
    if (reports.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">Test raporu bulunamadı</td></tr>';
        return;
    }
    
    tbody.innerHTML = reports.map(report => `
        <tr>
            <td>${report.patient_name || 'Bilinmeyen Hasta'}</td>
            <td>${getTestTypeText(report.test_type)}</td>
            <td>${report.test_date_display || '-'}</td>
            <td>${report.doctor_name || '-'}</td>
            <td>
                <span class="status-badge status-${(report.status || 'Completed').toLowerCase()}">
                    ${getStatusText(report.status)}
                </span>
            </td>
            <td>${report.diagnosis || 'Henüz tanı girilmemiş'}</td>
            <td class="action-buttons">
                <button class="btn-small btn-view" onclick="viewTestReport(${report.id})">
                    <i class="fa-solid fa-eye"></i> Görüntüle
                </button>
                ${report.has_pdf ? `
                    <button class="btn-small btn-download" onclick="downloadReport(${report.id})">
                        <i class="fa-solid fa-download"></i> İndir
                    </button>
                    <button class="btn-small btn-print" onclick="printReport(${report.id})">
                        <i class="fa-solid fa-print"></i> Yazdır
                    </button>
                ` : `
                    <button class="btn-small btn-disabled" disabled title="PDF dosyası yüklenmemiş">
                        <i class="fa-solid fa-download"></i> İndir
                    </button>
                    <button class="btn-small btn-disabled" disabled title="PDF dosyası yüklenmemiş">
                        <i class="fa-solid fa-print"></i> Yazdır
                    </button>
                `}
                <button class="btn-small btn-edit" onclick="editTestReport(${report.id})">
                    <i class="fa-solid fa-edit"></i> Düzenle
                </button>
                <button class="btn-small btn-delete" onclick="deleteTestReport(${report.id})">
                    <i class="fa-solid fa-trash"></i> Sil
                </button>
            </td>
        </tr>
    `).join('');
}

// Test türü metnini getir
function getTestTypeText(type) {
    switch(type) {
        case 'Pure_Tone': return 'Saf Ses Odyometrisi';
        case 'Speech': return 'Konuşma Odyometrisi';
        case 'Impedance': return 'Empedans Odyometrisi';
        case 'ABR': return 'İşitsel Beyin Sapı Yanıtı';
        case 'OAE': return 'Otoakustik Emisyon';
        case 'Other': return 'Diğer';
        default: return type || '-';
    }
}

// Durum metnini getir
function getStatusText(status) {
    switch(status) {
        case 'Completed': return 'Tamamlandı';
        case 'Incomplete': return 'Tamamlanmadı';
        case 'Cancelled': return 'İptal Edildi';
        default: return 'Tamamlandı';
    }
}

// Sonuç metnini getir
function getResultText(result) {
    if (!result) return '-';
    switch(result) {
        case 'normal': return 'Normal';
        case 'mild': return 'Hafif';
        case 'moderate': return 'Orta';
        case 'severe': return 'Ağır';
        case 'profound': return 'Çok Ağır';
        default: return result;
    }
}

// Filtreleri kur
function setupFilters() {
    const mainSearchInput = document.getElementById('mainSearch');
    
    // Ana arama filtresi
    if (mainSearchInput) {
        mainSearchInput.addEventListener('input', debounce(() => {
            applyFilters();
        }, 500));
    }
}

// Global filter state
let activeFilters = {
    patient: '',
    testType: '',
    testDateStart: '',
    testDateEnd: '',
    doctor: '',
    status: '',
    diagnosis: ''
};

// Sütun başlığı filtre fonksiyonları
function toggleFilter(columnName) {
    // Close all other filters first
    closeAllFilters();
    
    const filterDropdown = document.getElementById(`${columnName}-filter`);
    if (filterDropdown) {
        filterDropdown.style.display = 'block';
        
        // Load options if opening patient or doctor filter
        if (columnName === 'patient') {
            loadPatientOptions();
        } else if (columnName === 'doctor') {
            loadDoctorOptions();
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

async function loadPatientOptions() {
    try {
        const response = await fetch(`${API_BASE_URL}/patients/`);
        const data = await response.json();
        const names = [...new Set(data.results.map(patient => `${patient.first_name} ${patient.last_name}`))];
        
        const optionsContainer = document.getElementById('patient-options');
        optionsContainer.innerHTML = '';
        
        names.forEach(name => {
            const option = document.createElement('div');
            option.className = 'filter-option';
            option.textContent = name;
            option.onclick = () => selectPatientFilter(name);
            optionsContainer.appendChild(option);
        });
    } catch (error) {
        console.error('Hasta seçenekleri yüklenirken hata:', error);
    }
}

async function loadDoctorOptions() {
    try {
        const response = await fetch(`${API_BASE_URL}/users/`);
        const data = await response.json();
        const doctors = [...new Set(data.results.map(user => `${user.first_name} ${user.last_name}`))];
        
        const optionsContainer = document.getElementById('doctor-options');
        optionsContainer.innerHTML = '';
        
        doctors.forEach(doctor => {
            const option = document.createElement('div');
            option.className = 'filter-option';
            option.textContent = doctor;
            option.onclick = () => selectDoctorFilter(doctor);
            optionsContainer.appendChild(option);
        });
    } catch (error) {
        console.error('Doktor seçenekleri yüklenirken hata:', error);
    }
}

function selectPatientFilter(name) {
    document.querySelector('#patient-filter input').value = name;
    filterByPatient(name);
    closeAllFilters();
}

function selectDoctorFilter(name) {
    document.querySelector('#doctor-filter input').value = name;
    filterByDoctor(name);
    closeAllFilters();
}

function filterByPatient(value) {
    console.log('filterByPatient called with:', value);
    activeFilters.patient = value;
    console.log('activeFilters after patient filter:', activeFilters);
    applyColumnFilters();
}

function filterByTestType(value) {
    console.log('filterByTestType called with:', value);
    activeFilters.testType = value;
    console.log('activeFilters after testType filter:', activeFilters);
    applyColumnFilters();
}

function filterByTestDate() {
    const startDate = document.getElementById('testDate-start').value;
    const endDate = document.getElementById('testDate-end').value;
    console.log('filterByTestDate called with:', { startDate, endDate });
    activeFilters.testDateStart = startDate;
    activeFilters.testDateEnd = endDate;
    console.log('activeFilters after testDate filter:', activeFilters);
    applyColumnFilters();
}

function filterByDoctor(value) {
    console.log('filterByDoctor called with:', value);
    activeFilters.doctor = value;
    console.log('activeFilters after doctor filter:', activeFilters);
    applyColumnFilters();
}

function filterByStatus(value) {
    console.log('filterByStatus called with:', value);
    activeFilters.status = value;
    console.log('activeFilters after status filter:', activeFilters);
    applyColumnFilters();
}

function filterByDiagnosis(value) {
    console.log('filterByDiagnosis called with:', value);
    activeFilters.diagnosis = value;
    console.log('activeFilters after diagnosis filter:', activeFilters);
    applyColumnFilters();
}

function applyColumnFilters() {
    console.log('applyColumnFilters called, activeFilters:', activeFilters);
    loadTestReports();
}

function clearAllFilters() {
    // Reset all filter inputs
    document.querySelectorAll('.filter-dropdown input, .filter-dropdown select').forEach(input => {
        input.value = '';
    });
    
    // Reset global filter state
    activeFilters = {
        patient: '',
        testType: '',
        testDateStart: '',
        testDateEnd: '',
        doctor: '',
        status: '',
        diagnosis: ''
    };
    
    // Clear main search
    const mainSearch = document.getElementById('mainSearch');
    if (mainSearch) {
        mainSearch.value = '';
    }
    
    // Reload data
    loadTestReports();
}

// Ana arama fonksiyonu
function applyFilters() {
    const mainSearch = document.getElementById('mainSearch');
    if (mainSearch && mainSearch.value.trim()) {
        loadTestReports();
    }
}

// Debounce fonksiyonu
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Test raporu işlemleri
function openNewTestModal() {
    const modal = document.getElementById('newTestModal');
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    loadPatientsForTest();
    // Bugünün tarih ve saatini set et
    const now = new Date();
    const localDateTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    document.getElementById('testDate').value = localDateTime;
}

function closeNewTestModal() {
    const modal = document.getElementById('newTestModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        document.getElementById('newTestForm').reset();
    }, 300);
}

function closeViewTestReportModal() {
    const modal = document.getElementById('viewTestReportModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

function closeEditTestReportModal() {
    const modal = document.getElementById('editTestReportModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        document.getElementById('editTestReportForm').reset();
    }, 300);
}

async function loadPatientsForTest() {
    try {
        const response = await errorHandler.apiRequest(`${API_BASE_URL}/patients/`);
        const patients = response.results || response;
        const patientSelect = document.getElementById('testPatient');
        
        patientSelect.innerHTML = '<option value="">Hasta seçin...</option>';
        
        patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.id;
            option.textContent = `${patient.first_name} ${patient.last_name}`;
            patientSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Hasta listesi yükleme hatası:', error);
    }
}

async function loadPatientsForEditTest() {
    try {
        const response = await errorHandler.apiRequest(`${API_BASE_URL}/patients/`);
        const patients = response.results || response;
        
        const editSelect = document.getElementById('editPatientSelect');
        editSelect.innerHTML = '<option value="">Hasta seçin...</option>';
        
        patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.id;
            option.textContent = `${patient.first_name} ${patient.last_name}`;
            editSelect.appendChild(option);
        });
        
        console.log('Edit modal için hasta listesi yüklendi:', patients.length, 'hasta');
    } catch (error) {
        console.error('Edit modal hasta listesi yükleme hatası:', error);
    }
}

async function viewTestReport(id) {
    try {
        console.log('Test raporu görüntüleme ID:', id);
        const report = await errorHandler.apiRequest(`${API_BASE_URL}/hearing_tests/hearing_tests/${id}/`);
        console.log('Test raporu verileri:', report);
        
        // Modal alanlarını doldur
        document.getElementById('viewPatientName').textContent = report.patient_name || 'Bilinmeyen Hasta';
        document.getElementById('viewTestDate').textContent = report.test_date_display || '-';
        document.getElementById('viewTestType').textContent = getTestTypeText(report.test_type);
        document.getElementById('viewDoctorName').textContent = report.user ? `${report.user.first_name || ''} ${report.user.last_name || ''}`.trim() : '-';
        document.getElementById('viewStatus').textContent = getStatusText(report.status);
        document.getElementById('viewDiagnosis').textContent = report.diagnosis || 'Henüz tanı girilmemiş';
        document.getElementById('viewNotes').textContent = report.notes || 'Not yok';
        document.getElementById('viewRecommendations').textContent = report.recommendations || 'Öneri yok';
        
        // Test sonuçlarını göster
        if (report.test_type === 'Pure_Tone') {
            document.getElementById('viewRightEar250').textContent = report.right_ear_250 || '-';
            document.getElementById('viewRightEar500').textContent = report.right_ear_500 || '-';
            document.getElementById('viewRightEar1000').textContent = report.right_ear_1000 || '-';
            document.getElementById('viewRightEar2000').textContent = report.right_ear_2000 || '-';
            document.getElementById('viewLeftEar250').textContent = report.left_ear_250 || '-';
            document.getElementById('viewLeftEar500').textContent = report.left_ear_500 || '-';
            document.getElementById('viewLeftEar1000').textContent = report.left_ear_1000 || '-';
            document.getElementById('viewLeftEar2000').textContent = report.left_ear_2000 || '-';
        }
        
        // Modal'ı göster
        const modal = document.getElementById('viewTestReportModal');
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
    } catch (error) {
        console.error('Test raporu bilgileri yüklenemedi:', error);
        errorHandler.showError('Test raporu bilgileri yüklenemedi');
    }
}

async function editTestReport(id) {
    try {
        console.log('Test raporu düzenleme ID:', id);
        const report = await errorHandler.apiRequest(`${API_BASE_URL}/hearing_tests/hearing_tests/${id}/`);
        console.log('Düzenlenecek test raporu:', report);
        
        // Modal alanlarını doldur
        document.getElementById('editTestId').value = id;
        document.getElementById('editPatientSelect').value = report.patient || '';
        document.getElementById('editTestType').value = report.test_type || '';
        document.getElementById('editTestDate').value = report.test_date ? report.test_date.slice(0, 16) : '';
        document.getElementById('editTestStatus').value = report.status || 'Completed';
        
        // Test sonuçlarını doldur
        document.getElementById('editRightEar250').value = report.right_ear_250 || '';
        document.getElementById('editRightEar500').value = report.right_ear_500 || '';
        document.getElementById('editRightEar1000').value = report.right_ear_1000 || '';
        document.getElementById('editRightEar2000').value = report.right_ear_2000 || '';
        document.getElementById('editRightEar4000').value = report.right_ear_4000 || '';
        document.getElementById('editRightEar8000').value = report.right_ear_8000 || '';
        
        document.getElementById('editLeftEar250').value = report.left_ear_250 || '';
        document.getElementById('editLeftEar500').value = report.left_ear_500 || '';
        document.getElementById('editLeftEar1000').value = report.left_ear_1000 || '';
        document.getElementById('editLeftEar2000').value = report.left_ear_2000 || '';
        document.getElementById('editLeftEar4000').value = report.left_ear_4000 || '';
        document.getElementById('editLeftEar8000').value = report.left_ear_8000 || '';
        
        // Konuşma testi sonuçları
        document.getElementById('editRightEarSrt').value = report.right_ear_srt || '';
        document.getElementById('editLeftEarSrt').value = report.left_ear_srt || '';
        document.getElementById('editRightEarSds').value = report.right_ear_sds || '';
        document.getElementById('editLeftEarSds').value = report.left_ear_sds || '';
        
        // Değerlendirme alanları
        document.getElementById('editTestDiagnosis').value = report.diagnosis || '';
        document.getElementById('editTestNotes').value = report.notes || '';
        document.getElementById('editTestRecommendations').value = report.recommendations || '';
        
        // Mevcut PDF bilgisini göster
        const currentPdfInfo = document.getElementById('currentPdfInfo');
        const currentPdfName = document.getElementById('currentPdfName');
        if (report.report_pdf) {
            const fileName = report.report_pdf.split('/').pop();
            currentPdfName.textContent = fileName;
            currentPdfInfo.style.display = 'block';
        } else {
            currentPdfInfo.style.display = 'none';
        }
        
        // Hasta listesini yükle
        await loadPatientsForEditTest();
        document.getElementById('editPatientSelect').value = report.patient || '';
        
        // Modal'ı göster
        const modal = document.getElementById('editTestReportModal');
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
    } catch (error) {
        console.error('Test raporu düzenleme verileri yüklenemedi:', error);
        errorHandler.showError('Test raporu bilgileri yüklenemedi');
    }
}

async function downloadReport(id) {
    try {
        console.log('PDF indirme başlıyor, ID:', id);
        
        // Fetch ile dosyayı al
        const response = await fetch(`${API_BASE_URL}/hearing_tests/hearing_tests/${id}/download/`);
        
        if (!response.ok) {
            if (response.status === 404) {
                const errorData = await response.json();
                errorHandler.showError(errorData.error || 'PDF dosyası bulunamadı');
                return;
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Dosya adını response header'ından al
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'test_raporu.pdf';
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="(.+)"/);
            if (filenameMatch) {
                filename = filenameMatch[1];
            }
        }
        
        // Blob oluştur ve indir
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        errorHandler.showSuccess('PDF başarıyla indirildi');
        
    } catch (error) {
        console.error('PDF indirme hatası:', error);
        errorHandler.showError('PDF indirilemedi: ' + error.message);
    }
}

async function printReport(id) {
    try {
        const response = await errorHandler.apiRequest(`${API_BASE_URL}/hearing_tests/hearing_tests/${id}/print/`);
        errorHandler.showSuccess('Rapor yazdırılıyor...');
        // Yazdırma işlemi burada yapılacak
    } catch (error) {
        // Hata zaten errorHandler tarafından gösterildi
    }
}

async function deleteTestReport(id) {
    showConfirmation(
        'Test Raporunu Sil',
        'Bu test raporunu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
        'danger',
        async () => {
            try {
                await errorHandler.apiRequest(`${API_BASE_URL}/hearing_tests/hearing_tests/${id}/`, {
                    method: 'DELETE'
                });
                errorHandler.showSuccess('Test raporu silindi');
                loadTestReports();
            } catch (error) {
                // Hata zaten errorHandler tarafından gösterildi
            }
        }
    );
}

// Modal dışına tıklayınca kapat
window.onclick = function(event) {
    const newTestModal = document.getElementById('newTestModal');
    const viewTestModal = document.getElementById('viewTestReportModal');
    const editTestModal = document.getElementById('editTestReportModal');
    const confirmationOverlay = document.getElementById('confirmationOverlay');
    
    if (event.target === newTestModal) {
        closeNewTestModal();
    }
    if (event.target === viewTestModal) {
        closeViewTestReportModal();
    }
    if (event.target === editTestModal) {
        closeEditTestReportModal();
    }
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