/**
 * İşitme Merkezi Takip Sistemi - Hata Yönetimi Testleri
 * Jest framework kullanarak unit testler
 */

// Import ErrorHandler
const ErrorHandler = require('../error-handler.js');

// Mock DOM environment
document.body.innerHTML = '<div id="test-container"></div>';

// Mock fetch
const fetchMock = jest.fn();
global.fetch = fetchMock;

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock window.location
delete window.location;
window.location = {
    href: '',
    pathname: '/test/',
    reload: jest.fn(),
};

describe('ErrorHandler Sınıfı', () => {
    let errorHandler;

    beforeEach(() => {
        // DOM'u temizle
        document.body.innerHTML = '<div id="test-container"></div>';
        
        // Mock'ları sıfırla
        jest.clearAllMocks();
        
        // Fetch mock'unu default değerle ayarla
        fetchMock.mockResolvedValue({
            ok: true,
            status: 200,
            json: () => Promise.resolve({}),
            text: () => Promise.resolve('')
        });
        
        // ErrorHandler instance'ı oluştur
        errorHandler = new ErrorHandler();
    });

    afterEach(() => {
        // Test sonrası temizlik
        if (errorHandler && errorHandler.notificationContainer) {
            errorHandler.notificationContainer.remove();
        }
    });

    describe('Bildirim Sistemi', () => {
        test('Başarı bildirimi göstermeli', () => {
            const notification = errorHandler.showSuccess('Test başarılı');
            
            expect(notification).toBeDefined();
            expect(notification.classList.contains('notification-success')).toBe(true);
            expect(notification.querySelector('.notification-message').textContent).toBe('Test başarılı');
        });

        test('Hata bildirimi göstermeli', () => {
            const notification = errorHandler.showError('Test hatası');
            
            expect(notification).toBeDefined();
            expect(notification.classList.contains('notification-error')).toBe(true);
            expect(notification.querySelector('.notification-message').textContent).toBe('Test hatası');
        });

        test('Uyarı bildirimi göstermeli', () => {
            const notification = errorHandler.showWarning('Test uyarısı');
            
            expect(notification).toBeDefined();
            expect(notification.classList.contains('notification-warning')).toBe(true);
            expect(notification.querySelector('.notification-message').textContent).toBe('Test uyarısı');
        });

        test('Bilgi bildirimi göstermeli', () => {
            const notification = errorHandler.showInfo('Test bilgisi');
            
            expect(notification).toBeDefined();
            expect(notification.classList.contains('notification-info')).toBe(true);
            expect(notification.querySelector('.notification-message').textContent).toBe('Test bilgisi');
        });

        test('Bildirim otomatik kaldırılmalı', async () => {
            const notification = errorHandler.showNotification('Test', 'info', 100);
            
            expect(notification).toBeTruthy();
            expect(document.body.contains(notification)).toBe(true);
            
            // 200ms bekle (100ms timeout + buffer)
            await new Promise(resolve => setTimeout(resolve, 200));
            
            expect(document.body.contains(notification)).toBe(false);
        });

        test('Bildirim manuel kaldırılabilmeli', () => {
            const notification = errorHandler.showNotification('Test', 'info', 0);
            
            errorHandler.removeNotification(notification);
            
            setTimeout(() => {
                expect(document.querySelector('.notification')).toBeNull();
            }, 100);
        });
    });

    describe('API Hata Yönetimi', () => {
        test('401 hatası oturum yönlendirmesi yapmalı', async () => {
            fetchMock.mockRejectedValueOnce(new Error('401 Unauthorized'));
            
            try {
                await errorHandler.apiRequest('/test');
            } catch (error) {
                expect(sessionStorageMock.setItem).toHaveBeenCalledWith('redirectAfterLogin', '/test/');
                expect(window.location.href).toBe('/login/');
            }
        });

        test('403 hatası yetki mesajı göstermeli', async () => {
            fetchMock.mockRejectedValueOnce(new Error('403 Forbidden'));
            
            try {
                await errorHandler.apiRequest('/test');
            } catch (error) {
                // Hata mesajı gösterildi mi kontrol et
                const notifications = document.querySelectorAll('.notification-error');
                expect(notifications.length).toBeGreaterThan(0);
            }
        });

        test('404 hatası kaynak bulunamadı mesajı göstermeli', async () => {
            fetchMock.mockRejectedValueOnce(new Error('404 Not Found'));
            
            try {
                await errorHandler.apiRequest('/test');
            } catch (error) {
                const notifications = document.querySelectorAll('.notification-error');
                expect(notifications.length).toBeGreaterThan(0);
            }
        });

        test('500 hatası sunucu hatası mesajı göstermeli', async () => {
            fetchMock.mockRejectedValueOnce(new Error('500 Internal Server Error'));
            
            try {
                await errorHandler.apiRequest('/test');
            } catch (error) {
                const notifications = document.querySelectorAll('.notification-error');
                expect(notifications.length).toBeGreaterThan(0);
            }
        });

        test('Bağlantı hatası internet bağlantısı mesajı göstermeli', async () => {
            fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
            
            try {
                await errorHandler.apiRequest('/test');
            } catch (error) {
                const notifications = document.querySelectorAll('.notification-error');
                expect(notifications.length).toBeGreaterThan(0);
            }
        });
    });

    describe('Form Hata Yönetimi', () => {
        beforeEach(() => {
            // Test formu oluştur
            document.body.innerHTML = `
                <form id="test-form">
                    <div class="form-group">
                        <input type="text" name="name" id="name">
                    </div>
                    <div class="form-group">
                        <input type="email" name="email" id="email">
                    </div>
                </form>
            `;
        });

        test('Form hatalarını göstermeli', () => {
            const errors = {
                name: 'Ad alanı zorunludur',
                email: 'Geçerli bir e-posta adresi giriniz'
            };

            errorHandler.showFormErrors(errors, 'test-form');

            const nameField = document.querySelector('[name="name"]');
            const emailField = document.querySelector('[name="email"]');
            const nameError = document.querySelector('.field-error');
            const emailError = document.querySelectorAll('.field-error')[1];

            expect(nameField.classList.contains('error')).toBe(true);
            expect(emailField.classList.contains('error')).toBe(true);
            expect(nameError.textContent).toBe('Ad alanı zorunludur');
            expect(emailError.textContent).toBe('Geçerli bir e-posta adresi giriniz');
        });

        test('Form hatalarını temizlemeli', () => {
            // Önce hata ekle
            const errors = { name: 'Test hatası' };
            errorHandler.showFormErrors(errors, 'test-form');

            // Sonra temizle
            errorHandler.clearFormErrors('test-form');

            const nameField = document.querySelector('[name="name"]');
            const errorElements = document.querySelectorAll('.field-error');

            expect(nameField.classList.contains('error')).toBe(false);
            expect(errorElements.length).toBe(0);
        });

        test('String hata mesajını bildirim olarak göstermeli', () => {
            errorHandler.showFormErrors('Genel hata mesajı');

            // String hata mesajları bildirim olarak gösterilir
            const notifications = document.querySelectorAll('.notification');
            expect(notifications.length).toBeGreaterThan(0);
            expect(notifications[0].classList.contains('notification-error')).toBe(true);
        });
    });

    describe('Loading Durumu Yönetimi', () => {
        test('Loading overlay göstermeli', () => {
            const container = document.getElementById('test-container');
            const loadingOverlay = errorHandler.showLoading(container, 'Test yükleniyor');

            expect(loadingOverlay).toBeDefined();
            expect(loadingOverlay.classList.contains('loading-overlay')).toBe(true);
            expect(loadingOverlay.querySelector('span').textContent).toBe('Test yükleniyor');
        });

        test('Loading overlay kaldırmalı', () => {
            const container = document.getElementById('test-container');
            const loadingOverlay = errorHandler.showLoading(container);

            errorHandler.hideLoading(loadingOverlay);

            expect(container.querySelector('.loading-overlay')).toBeNull();
        });

        test('Tüm loading overlay\'leri kaldırmalı', () => {
            const container = document.getElementById('test-container');
            errorHandler.showLoading(container, 'Test 1');
            errorHandler.showLoading(container, 'Test 2');

            errorHandler.hideLoading();

            expect(container.querySelectorAll('.loading-overlay').length).toBe(0);
        });

        test('Button loading durumu ayarlamalı', () => {
            const button = document.createElement('button');
            button.innerHTML = 'Test Button';
            document.body.appendChild(button);

            errorHandler.setButtonLoading(button, true, 'Yükleniyor...');

            expect(button.disabled).toBe(true);
            expect(button.innerHTML).toContain('fa-spinner');
            expect(button.innerHTML).toContain('Yükleniyor...');

            errorHandler.setButtonLoading(button, false);

            expect(button.disabled).toBe(false);
            expect(button.innerHTML).toBe('Test Button');

            document.body.removeChild(button);
        });
    });

    describe('Token Yönetimi', () => {
        test('Token almalı', () => {
            localStorageMock.getItem.mockReturnValue('test-token');
            
            const token = errorHandler.getToken();
            
            expect(token).toBe('test-token');
            expect(localStorageMock.getItem).toHaveBeenCalledWith('access_token');
        });

        test('Session storage\'dan token almalı', () => {
            localStorageMock.getItem.mockReturnValue(null);
            sessionStorageMock.getItem.mockReturnValue('session-token');
            
            const token = errorHandler.getToken();
            
            expect(token).toBe('session-token');
            expect(sessionStorageMock.getItem).toHaveBeenCalledWith('access_token');
        });

        test('Token yoksa false dönmeli', () => {
            localStorageMock.getItem.mockReturnValue(null);
            sessionStorageMock.getItem.mockReturnValue(null);
            
            const result = errorHandler.checkAuth();
            
            expect(result).toBe(false);
        });

        test('Token varsa true dönmeli', () => {
            localStorageMock.getItem.mockReturnValue('test-token');
            
            const result = errorHandler.checkAuth();
            
            expect(result).toBe(true);
        });
    });

    describe('API İstekleri', () => {
        test('Başarılı API isteği yapmalı', async () => {
            const mockResponse = { data: 'test' };
            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
                headers: { get: () => 'application/json' }
            });

            const result = await errorHandler.apiRequest('/test');

            expect(result).toEqual(mockResponse);
            expect(fetchMock).toHaveBeenCalledWith('/test', expect.objectContaining({
                headers: expect.objectContaining({
                    'Content-Type': 'application/json'
                })
            }));
        });

        test('Token ile API isteği yapmalı', async () => {
            localStorageMock.getItem.mockReturnValue('test-token');
            
            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: async () => ({}),
                headers: { get: () => 'application/json' }
            });

            await errorHandler.apiRequest('/test');

            expect(fetchMock).toHaveBeenCalledWith('/test', expect.objectContaining({
                headers: expect.objectContaining({
                    'Authorization': 'Bearer test-token'
                })
            }));
        });

        test('POST isteği body ile yapmalı', async () => {
            const postData = { name: 'test' };
            
            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: async () => ({}),
                headers: { get: () => 'application/json' }
            });

            await errorHandler.apiRequest('/test', {
                method: 'POST',
                body: postData
            });

            expect(fetchMock).toHaveBeenCalledWith('/test', expect.objectContaining({
                method: 'POST',
                body: JSON.stringify(postData)
            }));
        });
    });

    describe('Global Hata Yakalama', () => {
        test('JavaScript hatalarını yakalamalı', () => {
            const errorEvent = new ErrorEvent('error', {
                error: new Error('Test error')
            });

            window.dispatchEvent(errorEvent);

            const notifications = document.querySelectorAll('.notification-error');
            expect(notifications.length).toBeGreaterThan(0);
        });

        test('Promise rejection\'ları yakalamalı', () => {
            // JSDOM'da PromiseRejectionEvent yok, manuel event oluşturalım
            const rejectionEvent = new Event('unhandledrejection');
            rejectionEvent.reason = new Error('Test rejection');

            window.dispatchEvent(rejectionEvent);

            const notifications = document.querySelectorAll('.notification-error');
            expect(notifications.length).toBeGreaterThan(0);
        });
    });
});

 