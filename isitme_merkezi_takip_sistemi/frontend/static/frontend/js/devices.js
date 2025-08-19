const API_BASE_URL = '/api';
        
// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    loadDevices();
    loadDeviceStats();
    
    // Yeni cihaz form submit
    document.getElementById('newDeviceForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const deviceData = Object.fromEntries(formData.entries());
        
        // CSRF token'ı veri objesinden çıkar
        delete deviceData.csrfmiddlewaretoken;
        
        console.log('Yeni cihaz verisi:', deviceData);
        
        // CSRF token'ı modal içindeki formdan al
        const csrfToken = this.querySelector('[name=csrfmiddlewaretoken]').value;
        
        try {
            const response = await errorHandler.apiRequest(`${API_BASE_URL}/devices/devices/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                body: JSON.stringify(deviceData)
            });
            
            errorHandler.showSuccess('Cihaz başarıyla eklendi');
            closeNewDeviceModal();
            loadDevices(); // Cihaz listesini yenile
            loadDeviceStats(); // İstatistikleri yenile
        } catch (error) {
            console.error('Cihaz ekleme hatası:', error);
            
            // Detaylı hata mesajını al
            if (error.response) {
                error.response.json().then(errorData => {
                    console.error('Backend hata detayı:', errorData);
                    if (errorData.details) {
                        console.error('Validation errors:', errorData.details);
                    }
                }).catch(() => {
                    console.error('Hata response parse edilemedi');
                });
            }
        }
    });
    
    // Main search input için debounce
    const mainSearchInput = document.getElementById('mainSearch');
    if (mainSearchInput) {
        mainSearchInput.addEventListener('input', debounce(() => {
            applyMainSearch();
        }, 500));
    }
});

// Aktif filtreler
let activeFilters = {
    name: '', brand: '', model: '', stock: '', status: '',
    updated: { start: '', end: '' }
};

// Filtre dropdown'larını aç/kapat
function toggleFilter(columnName) {
    closeAllFilters();
    const filterDropdown = document.getElementById(`${columnName}-filter`);
    if (filterDropdown) {
        filterDropdown.style.display = 'block';
    }
}

// Tüm filtre dropdown'larını kapat
function closeAllFilters() {
    const allDropdowns = document.querySelectorAll('.filter-dropdown');
    allDropdowns.forEach(dropdown => {
        dropdown.style.display = 'none';
    });
}

// Filtre fonksiyonları
function filterByName(value) {
    activeFilters.name = value;
    applyColumnFilters();
}

function filterByBrand(value) {
    activeFilters.brand = value;
    applyColumnFilters();
}

function filterByModel(value) {
    activeFilters.model = value;
    applyColumnFilters();
}

function filterByStock(value) {
    activeFilters.stock = value;
    applyColumnFilters();
}

function filterByStatus(value) {
    activeFilters.status = value;
    applyColumnFilters();
}

function filterByUpdatedDate() {
    activeFilters.updated.start = document.getElementById('updated-start').value;
    activeFilters.updated.end = document.getElementById('updated-end').value;
    applyColumnFilters();
}

// Sütun filtrelerini uygula
function applyColumnFilters() {
    loadDevices();
}

// Ana arama filtresi
function applyMainSearch() {
    activeFilters.name = document.getElementById('mainSearch').value;
    loadDevices();
}

// Tüm filtreleri temizle
function clearAllFilters() {
    activeFilters = {
        name: '', brand: '', model: '', stock: '', status: '',
        updated: { start: '', end: '' }
    };
    
    // Main search input'u temizle
    const mainSearchInput = document.getElementById('mainSearch');
    if (mainSearchInput) {
        mainSearchInput.value = '';
    }
    
    // Tarih input'larını temizle
    const updatedStart = document.getElementById('updated-start');
    const updatedEnd = document.getElementById('updated-end');
    if (updatedStart) updatedStart.value = '';
    if (updatedEnd) updatedEnd.value = '';
    
    loadDevices();
}

// Cihazları yükle
async function loadDevices() {
    try {
        let url = `${API_BASE_URL}/devices/devices/`;
        const params = new URLSearchParams();
        
        if (activeFilters.name) {
            params.append('search', activeFilters.name);
        }
        if (activeFilters.brand) {
            params.append('brand', activeFilters.brand);
        }
        if (activeFilters.model) {
            params.append('model', activeFilters.model);
        }
        if (activeFilters.status) {
            params.append('status', activeFilters.status);
        }
        if (activeFilters.stock) {
            params.append('stock_filter', activeFilters.stock);
        }
        if (activeFilters.updated.start) {
            params.append('updated_at_gte', activeFilters.updated.start);
        }
        if (activeFilters.updated.end) {
            params.append('updated_at_lte', activeFilters.updated.end);
        }
        
        if (params.toString()) {
            url += '?' + params.toString();
        }
        
        const response = await errorHandler.apiRequest(url);
        renderDevices(response.results || response);
    } catch (error) {
        renderDevices([]);
    }
}

// Cihaz istatistiklerini yükle
async function loadDeviceStats() {
    try {
        // Tüm cihazları al
        const response = await errorHandler.apiRequest(`${API_BASE_URL}/devices/devices/`);
        const devices = response.results || response;
        console.log('İstatistik için cihazlar:', devices);
        
        // İstatistikleri hesapla
        const stats = calculateDeviceStats(devices);
        
        // Kartları güncelle
        document.getElementById('totalDevices').textContent = stats.totalDevices;
        document.getElementById('activeDevices').textContent = stats.activeDevices;
        document.getElementById('maintenanceDevices').textContent = stats.maintenanceDevices;
        document.getElementById('lowStockDevices').textContent = stats.lowStockDevices;
        
    } catch (error) {
        console.error('Cihaz istatistikleri yüklenemedi:', error);
        // Hata durumunda sıfır göster
        document.getElementById('totalDevices').textContent = '0';
        document.getElementById('activeDevices').textContent = '0';
        document.getElementById('maintenanceDevices').textContent = '0';
        document.getElementById('lowStockDevices').textContent = '0';
    }
}

// Cihaz istatistiklerini hesapla
function calculateDeviceStats(devices) {
    let totalDevices = devices.length;
    let activeDevices = 0;
    let maintenanceDevices = 0;
    let lowStockDevices = 0;
    
    // Cihaz türlerine göre stok sayısını hesapla
    const deviceTypeCount = {};
    
    devices.forEach(device => {
        // Aktif cihazlar (Available veya In_Use)
        if (device.status === 'Available' || device.status === 'In_Use') {
            activeDevices++;
        }
        
        // Bakımdaki cihazlar
        if (device.status === 'Maintenance') {
            maintenanceDevices++;
        }
        
        // Cihaz türü sayısını hesapla
        if (!deviceTypeCount[device.device_type]) {
            deviceTypeCount[device.device_type] = 0;
        }
        deviceTypeCount[device.device_type]++;
    });
    
    // Az stoklu cihaz türleri (her türden 3'ten az olan türlerin sayısı)
    Object.values(deviceTypeCount).forEach(count => {
        if (count < 3) {
            lowStockDevices++;
        }
    });
    
    return {
        totalDevices,
        activeDevices,
        maintenanceDevices,
        lowStockDevices
    };
}

// Cihazları tabloya render et
function renderDevices(devices) {
    const tbody = document.getElementById('devicesTable');
    
    if (devices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">Cihaz bulunamadı</td></tr>';
        return;
    }
    
    tbody.innerHTML = devices.map(device => `
        <tr>
            <td>${device.name || '-'}</td>
            <td>${device.brand || '-'}</td>
            <td>${device.model || '-'}</td>
            <td class="${getStockClass(device.current_stock)}">
                ${device.current_stock || 0}
            </td>
            <td>
                <span class="status-badge status-${device.status || 'active'}">
                    ${getStatusText(device.status)}
                </span>
            </td>
            <td>${device.updated_at ? new Date(device.updated_at).toLocaleDateString('tr-TR') : '-'}</td>
            <td class="action-buttons">
                <button class="btn-small btn-view" onclick="viewDevice(${device.id})">
                    <i class="fa-solid fa-eye"></i> Görüntüle
                </button>
                <button class="btn-small btn-edit" onclick="editDevice(${device.id})">
                    <i class="fa-solid fa-edit"></i> Düzenle
                </button>
                <button class="btn-small btn-delete" onclick="deleteDevice(${device.id})">
                    <i class="fa-solid fa-trash"></i> Sil
                </button>
            </td>
        </tr>
    `).join('');
}

// Stok durumuna göre CSS class'ı getir
function getStockClass(quantity) {
    if (!quantity || quantity === 0) return 'stock-critical';
    if (quantity <= 5) return 'stock-warning';
    return '';
}

// Durum metnini getir
function getStatusText(status) {
    switch(status) {
        case 'active': return 'Aktif';
        case 'inactive': return 'Pasif';
        case 'maintenance': return 'Bakımda';
        default: return 'Aktif';
    }
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

// Cihaz işlemleri
function openNewDeviceModal() {
    const modal = document.getElementById('newDeviceModal');
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeNewDeviceModal() {
    const modal = document.getElementById('newDeviceModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        document.getElementById('newDeviceForm').reset();
    }, 300);
}

function viewDevice(id) {
    errorHandler.showInfo(`Cihaz ${id} görüntüleniyor`);
}

function editDevice(id) {
    errorHandler.showInfo(`Cihaz ${id} düzenleniyor`);
}

async function deleteDevice(id) {
    showConfirmation(
        'Cihazı Sil',
        'Bu cihazı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
        'danger',
        async () => {
            try {
                await errorHandler.apiRequest(`${API_BASE_URL}/devices/devices/${id}/`, {
                    method: 'DELETE'
                });
                errorHandler.showSuccess('Cihaz silindi');
                loadDevices();
            } catch (error) {
                // Hata zaten errorHandler tarafından gösterildi
            }
        }
    );
}

// Modal dışına tıklayınca kapat
window.onclick = function(event) {
    const newDeviceModal = document.getElementById('newDeviceModal');
    if (event.target === newDeviceModal) {
        closeNewDeviceModal();
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

// Filtre dropdown'ları dışına tıklandığında kapat
document.addEventListener('click', function(event) {
    if (!event.target.closest('.sortable-header')) {
        closeAllFilters();
    }
});