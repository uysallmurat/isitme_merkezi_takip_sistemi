/**
 * İşitme Merkezi Takip Sistemi - Hata Yönetimi ve Bildirim Sistemi
 * Tüm frontend modüllerinde kullanılacak ortak hata yönetimi
 */

class ErrorHandler {
    constructor() {
        this.notificationContainer = null;
        this.init();
    }

    init() {
        // Bildirim container'ını oluştur
        this.createNotificationContainer();
        
        // Global hata yakalayıcıları ekle
        this.setupGlobalErrorHandlers();
        
        // API istekleri için interceptor ekle
        this.setupApiInterceptors();
    }

    createNotificationContainer() {
        // Eğer zaten varsa oluşturma
        if (document.getElementById('globalNotification')) {
            this.notificationContainer = document.getElementById('globalNotification');
            return;
        }

        // document.body hazır değilse bekle
        if (!document.body) {
            setTimeout(() => this.createNotificationContainer(), 100);
            return;
        }

        try {
            this.notificationContainer = document.createElement('div');
            this.notificationContainer.id = 'globalNotification';
            this.notificationContainer.className = 'global-notification-container';
            document.body.appendChild(this.notificationContainer);
        } catch (error) {
            console.warn('Notification container oluşturulamadı:', error);
            // Fallback: basit bir div oluştur
            this.notificationContainer = document.createElement('div');
            this.notificationContainer.id = 'globalNotification';
            this.notificationContainer.className = 'global-notification-container';
            this.notificationContainer.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999;';
        }
    }

    setupGlobalErrorHandlers() {
        // JavaScript hatalarını yakala
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.showNotification('Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin.', 'error');
        });

        // Promise rejection'ları yakala
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.showNotification('İşlem sırasında bir hata oluştu.', 'error');
        });
    }

    setupApiInterceptors() {
        // Fetch API için interceptor
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            try {
                const response = await originalFetch(...args);
                
                // HTTP hata kodlarını kontrol et
                if (!response.ok) {
                    const errorData = await this.parseErrorResponse(response);
                    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
                }
                
                return response;
            } catch (error) {
                this.handleApiError(error);
                throw error;
            }
        };
    }

    async parseErrorResponse(response) {
        try {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return { message: await response.text() };
            }
        } catch (error) {
            return { message: 'Sunucu hatası' };
        }
    }

    handleApiError(error) {
        let message = 'Bir hata oluştu. Lütfen tekrar deneyiniz.';
        let type = 'error';

        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            message = 'Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol ediniz.';
        } else if (error.message.includes('401')) {
            message = 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapınız.';
            this.redirectToLogin();
        } else if (error.message.includes('403')) {
            message = 'Bu işlem için yetkiniz bulunmamaktadır.';
        } else if (error.message.includes('404')) {
            message = 'İstenilen kaynak bulunamadı.';
        } else if (error.message.includes('500')) {
            message = 'Sunucu hatası. Lütfen daha sonra tekrar deneyiniz.';
        } else if (error.message) {
            message = error.message;
        }

        this.showNotification(message, type);
    }

    showNotification(message, type = 'info', duration = 5000) {
        // Notification container hazır mı kontrol et
        if (!this.notificationContainer) {
            this.createNotificationContainer();
        }
        
        // Hala hazır değilse console'a yaz
        if (!this.notificationContainer) {
            console.warn('Notification container hazır değil, mesaj gösterilemedi:', message);
            return null;
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="notification-icon ${this.getIconClass(type)}"></i>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
        `;

        try {
            this.notificationContainer.appendChild(notification);

            // Animasyon ekle
            setTimeout(() => {
                notification.classList.add('show');
            }, 100);

            // Otomatik kaldır
            if (duration > 0) {
                setTimeout(() => {
                    this.removeNotification(notification);
                }, duration);
            }

            return notification;
        } catch (error) {
            console.warn('Notification gösterilemedi:', error);
            return null;
        }
    }

    removeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }

    getIconClass(type) {
        switch (type) {
            case 'success': return 'fa-solid fa-check-circle';
            case 'error': return 'fa-solid fa-exclamation-circle';
            case 'warning': return 'fa-solid fa-exclamation-triangle';
            case 'info': return 'fa-solid fa-info-circle';
            default: return 'fa-solid fa-info-circle';
        }
    }

    // Form validasyon hatalarını göster
    showFormErrors(errors, formId = null) {
        // Önceki hataları temizle
        this.clearFormErrors(formId);

        if (typeof errors === 'string') {
            this.showNotification(errors, 'error');
            return;
        }

        if (typeof errors === 'object') {
            Object.keys(errors).forEach(fieldName => {
                const errorMessage = Array.isArray(errors[fieldName]) 
                    ? errors[fieldName][0] 
                    : errors[fieldName];
                
                this.showFieldError(fieldName, errorMessage, formId);
            });
        }
    }

    showFieldError(fieldName, message, formId = null) {
        const form = formId ? document.getElementById(formId) : document.querySelector('form');
        if (!form) return;

        const field = form.querySelector(`[name="${fieldName}"], [id="${fieldName}"]`);
        if (!field) return;

        // Hata mesajı elementini oluştur
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;

        // Field'ı hata durumuna getir
        field.classList.add('error');
        
        // Hata mesajını ekle
        const fieldContainer = field.closest('.form-group') || field.parentElement;
        fieldContainer.appendChild(errorElement);
    }

    clearFormErrors(formId = null) {
        const form = formId ? document.getElementById(formId) : document.querySelector('form');
        if (!form) return;

        // Tüm hata mesajlarını kaldır
        form.querySelectorAll('.field-error').forEach(error => error.remove());
        
        // Tüm error class'larını kaldır
        form.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
    }

    // Loading durumu yönetimi
    showLoading(element = null, message = 'Yükleniyor...') {
        const target = element || document.body;
        
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-spinner">
                <i class="fa-solid fa-spinner fa-spin"></i>
                <span>${message}</span>
            </div>
        `;

        target.appendChild(loadingOverlay);
        return loadingOverlay;
    }

    hideLoading(loadingOverlay = null) {
        if (loadingOverlay) {
            loadingOverlay.remove();
        } else {
            const overlays = document.querySelectorAll('.loading-overlay');
            overlays.forEach(overlay => overlay.remove());
        }
    }

    // Button loading durumu
    setButtonLoading(button, isLoading, loadingText = 'İşleniyor...') {
        if (isLoading) {
            button.disabled = true;
            button.dataset.originalText = button.innerHTML;
            button.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${loadingText}`;
        } else {
            button.disabled = false;
            if (button.dataset.originalText) {
                button.innerHTML = button.dataset.originalText;
                delete button.dataset.originalText;
            }
        }
    }

    // Oturum kontrolü
    checkAuth() {
        const token = this.getToken();
        if (!token) {
            this.redirectToLogin();
            return false;
        }
        return true;
    }

    getToken() {
        return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    }

    redirectToLogin() {
        // Mevcut sayfayı kaydet
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        window.location.href = '/login/';
    }

    // API istekleri için yardımcı fonksiyonlar
    async apiRequest(url, options = {}) {
        const token = this.getToken();
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        };

        const finalOptions = { ...defaultOptions, ...options };
        
        if (finalOptions.body && typeof finalOptions.body === 'object') {
            finalOptions.body = JSON.stringify(finalOptions.body);
        }

        try {
            const response = await fetch(url, finalOptions);
            
            if (!response.ok) {
                const errorData = await this.parseErrorResponse(response);
                throw new Error(errorData.message || `HTTP ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (error) {
            this.handleApiError(error);
            throw error;
        }
    }

    // Başarı mesajları
    showSuccess(message, duration = 3000) {
        return this.showNotification(message, 'success', duration);
    }

    showError(message, duration = 5000) {
        return this.showNotification(message, 'error', duration);
    }

    showWarning(message, duration = 4000) {
        return this.showNotification(message, 'warning', duration);
    }

    showInfo(message, duration = 3000) {
        return this.showNotification(message, 'info', duration);
    }
}

// Global instance - DOM hazır olduktan sonra oluştur
let errorHandler = null;

// DOM hazır olduğunda ErrorHandler'ı initialize et
function initializeErrorHandler() {
    // document.body hazır mı kontrol et
    if (!document.body) {
        setTimeout(initializeErrorHandler, 100);
        return;
    }
    
    errorHandler = new ErrorHandler();
    
    // Global errorHandler'ı window objesine ekle
    window.errorHandler = errorHandler;
    
    // Global fonksiyonları tanımla
    window.showNotification = (message, type, duration) => errorHandler.showNotification(message, type, duration);
    window.showSuccess = (message, duration) => errorHandler.showSuccess(message, duration);
    window.showError = (message, duration) => errorHandler.showError(message, duration);
    window.showWarning = (message, duration) => errorHandler.showWarning(message, duration);
    window.showInfo = (message, duration) => errorHandler.showInfo(message, duration);
    window.getToken = () => errorHandler.getToken();
}

// DOM hazır olduğunda başlat
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeErrorHandler);
} else {
    // DOM zaten hazırsa hemen başlat
    initializeErrorHandler();
}

// Node.js/Jest ortamı için export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorHandler;
} 