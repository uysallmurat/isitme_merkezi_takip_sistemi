const API_BASE_URL = '/api';
        
// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    loadInvoices();
    loadInvoiceStats();
    setupFilters();
});

// Fatura verilerini yükle
async function loadInvoices() {
    try {
        const response = await errorHandler.apiRequest(`${API_BASE_URL}/invoices/invoices/`);
        renderInvoices(response.results || response);
    } catch (error) {
        renderInvoices([]);
    }
}

// Fatura istatistiklerini yükle
async function loadInvoiceStats() {
    try {
        // Tüm faturaları al
        const response = await fetch(`${API_BASE_URL}/invoices/invoices/`);
        if (!response.ok) {
            throw new Error('Fatura verileri alınamadı');
        }
        
        const invoices = await response.json();
        console.log('İstatistik için faturalar:', invoices);
        
        // İstatistikleri hesapla
        const stats = calculateInvoiceStats(invoices);
        
        // Kartları güncelle
        document.getElementById('totalRevenue').textContent = `₺${stats.totalRevenue.toLocaleString('tr-TR', {minimumFractionDigits: 2})}`;
        document.getElementById('pendingPayments').textContent = `₺${stats.pendingPayments.toLocaleString('tr-TR', {minimumFractionDigits: 2})}`;
        document.getElementById('overduePayments').textContent = `₺${stats.overduePayments.toLocaleString('tr-TR', {minimumFractionDigits: 2})}`;
        document.getElementById('totalInvoices').textContent = stats.totalInvoices;
        
    } catch (error) {
        console.error('Fatura istatistikleri yüklenemedi:', error);
        // Hata durumunda sıfır göster
        document.getElementById('totalRevenue').textContent = '₺0,00';
        document.getElementById('pendingPayments').textContent = '₺0,00';
        document.getElementById('overduePayments').textContent = '₺0,00';
        document.getElementById('totalInvoices').textContent = '0';
    }
}

// Fatura istatistiklerini hesapla
function calculateInvoiceStats(invoices) {
    let totalRevenue = 0;
    let pendingPayments = 0;
    let overduePayments = 0;
    let totalInvoices = invoices.length;
    
    const today = new Date();
    
    invoices.forEach(invoice => {
        const amount = parseFloat(invoice.amount || 0);
        const invoiceDate = new Date(invoice.invoice_date);
        
        // Toplam gelir (ödenen faturalar)
        if (invoice.status === 'Paid') {
            totalRevenue += amount;
        }
        
        // Bekleyen ödemeler (düzenlendi ama ödenmedi)
        if (invoice.status === 'Issued') {
            pendingPayments += amount;
        }
        
        // Gecikmiş ödemeler (30 günden eski ve ödenmemiş)
        const daysDiff = Math.floor((today - invoiceDate) / (1000 * 60 * 60 * 24));
        if (invoice.status === 'Issued' && daysDiff > 30) {
            overduePayments += amount;
        }
    });
    
    return {
        totalRevenue,
        pendingPayments,
        overduePayments,
        totalInvoices
    };
}

// Fatura verilerini tabloya render et
function renderInvoices(invoices) {
    const tbody = document.getElementById('invoicesTable');
    
    if (invoices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 2rem;">Fatura bulunamadı</td></tr>';
        return;
    }
    
    console.log('renderInvoices çağrıldı, fatura sayısı:', invoices.length);
    console.log('Faturalar:', invoices);
    
    tbody.innerHTML = invoices.map(invoice => `
        <tr>
            <td class="sticky-col">#${invoice.id}</td>
            <td>${invoice.patient_name || 'Bilinmeyen Hasta'}</td>
            <td>${formatDate(invoice.invoice_date)}</td>
            <td>₺${parseFloat(invoice.amount || 0).toLocaleString('tr-TR', {minimumFractionDigits: 2})}</td>
            <td title="${invoice.description || '-'}">${truncateText(invoice.description || '-', 25)}</td>
            <td>
                <span class="status-badge status-${invoice.status.toLowerCase()}">
                    ${getStatusText(invoice.status)}
                </span>
            </td>
            <td>${getUserName(invoice.user)}</td>
            <td>${formatDateTime(invoice.created_at)}</td>
            <td>${formatDateTime(invoice.updated_at)}</td>
            <td class="sticky-actions action-buttons">
                <button class="btn-small btn-view" onclick="viewInvoice(${invoice.id})" title="Görüntüle">
                    <i class="fa-solid fa-eye"></i>
                </button>
                <button class="btn-small btn-pdf" onclick="downloadPDF(${invoice.id})" disabled title="Yakında eklenecek">
                    <i class="fa-solid fa-file-pdf"></i>
                </button>
                <button class="btn-small btn-email" onclick="sendEmail(${invoice.id})" disabled title="Yakında eklenecek">
                    <i class="fa-solid fa-envelope"></i>
                </button>
                <button class="btn-small btn-delete" onclick="deleteInvoice(${invoice.id})" title="Sil">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Metni kırp
function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// User name'i getir
function getUserName(user) {
    if (!user) return 'Sistem';
    return user.first_name && user.last_name ? 
           `${user.first_name} ${user.last_name}` : 
           user.username || 'Bilinmeyen';
}

// DateTime formatla
function formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR') + ' ' + date.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Hizmet metnini getir
function getServiceText(service) {
    switch(service) {
        case 'hearing_aid': return 'İşitme Cihazı';
        case 'consultation': return 'Konsültasyon';
        case 'test': return 'Test';
        case 'maintenance': return 'Bakım';
        default: return service || '-';
    }
}

// Durum metnini getir
function getStatusText(status) {
    switch(status) {
        case 'paid': return 'Ödendi';
        case 'pending': return 'Bekliyor';
        case 'overdue': return 'Gecikmiş';
        case 'cancelled': return 'İptal';
        default: return status || 'Bilinmiyor';
    }
}

// Tarih formatla
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
}

// Tarih ve saat formatla
function formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Filtreleri kur
function setupFilters() {
    const searchInput = document.getElementById('mainSearch');
    
    // Sadece mevcut olan mainSearch elementini kontrol et
    if (searchInput) {
        // Arama filtresi
        searchInput.addEventListener('input', debounce(() => {
            applyFilters();
        }, 500));
    }
}

// Filtreleri uygula
async function applyFilters() {
    const search = document.getElementById('mainSearch')?.value || '';
    
    let url = `${API_BASE_URL}/invoices/invoices/?`;
    
    if (search) url += `search=${encodeURIComponent(search)}&`;

    try {
        const response = await errorHandler.apiRequest(url);
        renderInvoices(response.results || response);
    } catch (error) {
        renderInvoices([]);
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

// Tüm filtreleri temizle
function clearAllFilters() {
    const searchInput = document.getElementById('mainSearch');
    if (searchInput) {
        searchInput.value = '';
        applyFilters();
    }
}

// Yeni fatura modal'ını aç
function openNewPatientModal() {
    openNewInvoiceModal();
}

// Fatura işlemleri
async function openNewInvoiceModal() {
    console.log('openNewInvoiceModal çağrıldı');
    try {
        // Hasta listesini yükle
        await loadPatientsForInvoice();
        
        // Bugünün tarihini set et
        document.getElementById('invoice_date').value = new Date().toISOString().split('T')[0];
        
        // Modal'ı aç
        document.getElementById('newInvoiceModal').style.display = 'flex';
    } catch (error) {
        errorHandler.showError('Hasta listesi yüklenirken hata oluştu');
    }
}

function closeNewInvoiceModal() {
    document.getElementById('newInvoiceModal').style.display = 'none';
    document.getElementById('newInvoiceForm').reset();
}

async function loadPatientsForInvoice() {
    try {
        const response = await fetch('/api/patients/');
        if (!response.ok) {
            throw new Error('Hasta listesi alınamadı');
        }
        
        const data = await response.json();
        const select = document.getElementById('patient_id');
        
        // Mevcut seçenekleri temizle (ilk option hariç)
        select.innerHTML = '<option value="">Hasta Seçin</option>';
        
        // Hastaları ekle
        data.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.id;
            option.textContent = `${patient.first_name} ${patient.last_name}`;
            select.appendChild(option);
        });
    } catch (error) {
        errorHandler.showError('Hasta listesi yüklenemedi: ' + error.message);
        throw error;
    }
}

async function viewInvoice(id) {
    try {
        console.log('Fatura görüntüleniyor:', id);
        errorHandler.showLoading();
        
        // Fatura detaylarını API'den al
        const response = await fetch(`/api/invoices/invoices/${id}/`);
        if (!response.ok) {
            throw new Error('Fatura detayları alınamadı');
        }
        
        const invoice = await response.json();
        console.log('Fatura detayları:', invoice);
        
        // Modal'daki alanları doldur
        populateInvoiceModal(invoice);
        
        // Modal'ı aç
        document.getElementById('viewInvoiceModal').style.display = 'flex';
        
    } catch (error) {
        console.error('Fatura görüntüleme hatası:', error);
        errorHandler.showError('Fatura detayları yüklenemedi: ' + error.message);
    } finally {
        errorHandler.hideLoading();
    }
}

function closeViewInvoiceModal() {
    document.getElementById('viewInvoiceModal').style.display = 'none';
}

function populateInvoiceModal(invoice) {
    // Temel bilgiler
    document.getElementById('invoiceTitle').textContent = `Fatura #${invoice.id}`;
    document.getElementById('invoiceDate').textContent = `Tarih: ${formatDate(invoice.invoice_date)}`;
    document.getElementById('invoiceAmount').textContent = `₺${parseFloat(invoice.amount || 0).toLocaleString('tr-TR', {minimumFractionDigits: 2})}`;
    
    // Status badge
    const statusElement = document.getElementById('invoiceStatus');
    statusElement.textContent = getStatusText(invoice.status);
    statusElement.className = `status-badge status-${invoice.status.toLowerCase()}`;
    
    // Hasta bilgileri
    document.getElementById('patientName').textContent = invoice.patient_name || 'Bilinmeyen Hasta';
    
    // Fatura detayları
    document.getElementById('invoiceDescription').textContent = invoice.description || 'Açıklama yok';
    document.getElementById('invoiceCreated').textContent = formatDateTime(invoice.created_at);
    document.getElementById('invoiceUpdated').textContent = formatDateTime(invoice.updated_at);
}

async function editInvoiceFromView() {
    try {
        // Mevcut fatura verilerini al
        const invoiceId = document.getElementById('invoiceTitle').textContent.replace('Fatura #', '');
        console.log('Düzenleme için fatura ID:', invoiceId);
        
        // Görüntüle modal'ını kapat
        closeViewInvoiceModal();
        
        // Düzenleme modal'ını aç
        await openEditInvoiceModal(invoiceId);
        
    } catch (error) {
        console.error('Düzenleme modal açma hatası:', error);
        errorHandler.showError('Düzenleme modal\'ı açılamadı');
    }
}

async function openEditInvoiceModal(invoiceId) {
    try {
        errorHandler.showLoading();
        
        // Fatura detaylarını ve hasta listesini paralel olarak yükle
        const [invoiceResponse, patientsResponse] = await Promise.all([
            fetch(`/api/invoices/invoices/${invoiceId}/`),
            fetch('/api/patients/')
        ]);
        
        if (!invoiceResponse.ok || !patientsResponse.ok) {
            throw new Error('Veriler yüklenemedi');
        }
        
        const invoice = await invoiceResponse.json();
        const patients = await patientsResponse.json();
        
        console.log('Düzenlenecek fatura:', invoice);
        
        // Hasta listesini doldur
        const patientSelect = document.getElementById('edit_patient_id');
        patientSelect.innerHTML = '<option value="">Hasta Seçin</option>';
        patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.id;
            option.textContent = `${patient.first_name} ${patient.last_name}`;
            patientSelect.appendChild(option);
        });
        
        // Header bilgilerini doldur
        document.getElementById('editInvoiceTitle').textContent = `Fatura #${invoice.id}`;
        document.getElementById('editInvoiceDate').textContent = `Düzenleme Tarihi: ${formatDate(invoice.invoice_date)}`;
        document.getElementById('editInvoiceAmount').textContent = `₺${parseFloat(invoice.amount || 0).toLocaleString('tr-TR', {minimumFractionDigits: 2})}`;
        
        // Status badge
        const editStatusElement = document.getElementById('editInvoiceStatus');
        editStatusElement.textContent = getStatusText(invoice.status);
        editStatusElement.className = `status-badge status-${invoice.status.toLowerCase()}`;
        
        // Form alanlarını doldur
        document.getElementById('edit_invoice_id').value = invoice.id;
        document.getElementById('edit_patient_id').value = invoice.patient;
        document.getElementById('edit_invoice_date').value = invoice.invoice_date;
        document.getElementById('edit_amount').value = invoice.amount;
        document.getElementById('edit_status').value = invoice.status;
        document.getElementById('edit_description').value = invoice.description || '';
        
        // Modal'ı aç
        document.getElementById('editInvoiceModal').style.display = 'flex';
        
    } catch (error) {
        console.error('Düzenleme modal yükleme hatası:', error);
        errorHandler.showError('Düzenleme verileri yüklenemedi: ' + error.message);
    } finally {
        errorHandler.hideLoading();
    }
}

function closeEditInvoiceModal() {
    document.getElementById('editInvoiceModal').style.display = 'none';
    document.getElementById('editInvoiceForm').reset();
}

// Real-time güncelleme fonksiyonları
function updateEditAmount(input) {
    const amount = parseFloat(input.value.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
    document.getElementById('editInvoiceAmount').textContent = `₺${amount.toLocaleString('tr-TR', {minimumFractionDigits: 2})}`;
}

function updateEditStatus(select) {
    const statusElement = document.getElementById('editInvoiceStatus');
    statusElement.textContent = getStatusText(select.value);
    statusElement.className = `status-badge status-${select.value.toLowerCase()}`;
}

function downloadPDFFromView() {
    const invoiceId = document.getElementById('invoiceTitle').textContent.replace('Fatura #', '');
    downloadPDF(invoiceId);
}

// Tutar formatı düzenleme
function formatAmountInput(input) {
    let value = input.value.replace(/[^0-9.,]/g, '');
    input.value = value;
}

// Form submit işleyicileri
document.addEventListener('DOMContentLoaded', function() {
    const newForm = document.getElementById('newInvoiceForm');
    if (newForm) {
        newForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await createInvoice();
        });
    }
    
    const editForm = document.getElementById('editInvoiceForm');
    if (editForm) {
        editForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await updateInvoice();
        });
    }
});

async function createInvoice() {
    try {
        errorHandler.showLoading();

        const formData = new FormData(document.getElementById('newInvoiceForm'));
        
        // Tutar değerini temizle ve parse et
        let amount = formData.get('amount').replace(/[^0-9.,]/g, '');
        amount = amount.replace(',', '.');
        
        const invoiceData = {
            patient: formData.get('patient'),
            invoice_date: formData.get('invoice_date'),
            amount: amount,
            description: formData.get('description') || '',
            status: formData.get('status'),
            user: 1 // Test için admin user
        };

        console.log('Fatura verisi:', invoiceData);

        const response = await fetch('/api/invoices/invoices/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify(invoiceData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Fatura oluşturulamadı: ${JSON.stringify(errorData)}`);
        }

        const result = await response.json();
        console.log('Fatura oluşturuldu:', result);

        errorHandler.showSuccess('Fatura başarıyla oluşturuldu!');
        closeNewInvoiceModal();
        
        // Fatura listesini ve istatistikleri yenile
        loadInvoices();
        loadInvoiceStats();

    } catch (error) {
        console.error('Fatura oluşturma hatası:', error);
        errorHandler.showError('Fatura oluşturulurken hata: ' + error.message);
    } finally {
        errorHandler.hideLoading();
    }
}

async function updateInvoice() {
    try {
        errorHandler.showLoading();

        const formData = new FormData(document.getElementById('editInvoiceForm'));
        const invoiceId = formData.get('invoice_id');
        
        // Tutar değerini temizle ve parse et
        let amount = formData.get('amount').replace(/[^0-9.,]/g, '');
        amount = amount.replace(',', '.');
        
        const invoiceData = {
            patient: formData.get('patient'),
            invoice_date: formData.get('invoice_date'),
            amount: amount,
            description: formData.get('description') || '',
            status: formData.get('status'),
            user: 1 // Test için admin user
        };

        console.log('Güncelleme verisi:', invoiceData);

        const response = await fetch(`/api/invoices/invoices/${invoiceId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify(invoiceData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Fatura güncellenemedi: ${JSON.stringify(errorData)}`);
        }

        const result = await response.json();
        console.log('Fatura güncellendi:', result);

        errorHandler.showSuccess('Fatura başarıyla güncellendi!');
        closeEditInvoiceModal();
        
        // Fatura listesini ve istatistikleri yenile
        loadInvoices();
        loadInvoiceStats();

    } catch (error) {
        console.error('Fatura güncelleme hatası:', error);
        errorHandler.showError('Fatura güncellenirken hata: ' + error.message);
    } finally {
        errorHandler.hideLoading();
    }
}

function downloadPDF(id) {
    errorHandler.showInfo(`Fatura ${id} PDF indiriliyor`);
}

function sendEmail(id) {
    errorHandler.showInfo(`Fatura ${id} e-posta gönderiliyor`);
}

async function deleteInvoice(id) {
    if (!confirm('Bu faturayı silmek istediğinize emin misiniz?')) return;
    
    try {
        await errorHandler.apiRequest(`${API_BASE_URL}/invoices/invoices/${id}/`, {
            method: 'DELETE'
        });
        errorHandler.showSuccess('Fatura silindi');
        loadInvoices();
    } catch (error) {
        // Hata zaten errorHandler tarafından gösterildi
    }
}