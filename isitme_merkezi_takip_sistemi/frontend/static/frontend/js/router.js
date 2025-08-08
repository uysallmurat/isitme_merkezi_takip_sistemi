/**
 * İşitme Merkezi Takip Sistemi - Navigation Router
 * Modern SPA (Single Page Application) navigasyon sistemi
 * 
 * Özellikler:
 * - Smooth page transitions
 * - URL yönetimi ve browser history
 * - Loading states
 * - Error handling
 * - Breadcrumb desteği
 */

class NavigationRouter {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.isNavigating = false;
        this.mainContent = null;
        
        // Route history
        this.history = [];
        this.historyIndex = -1;
        
        // Initialize router
        this.init();
    }

    /**
     * Router'ı başlat
     */
    init() {
        // Ana content container'ı bul
        this.mainContent = document.querySelector('.main-content') || document.querySelector('main') || document.querySelector('#content') || document.body;
        
        // Route'ları tanımla
        this.defineRoutes();
        
        // Event listener'ları ekle
        this.setupEventListeners();
        
        // İlk sayfa yüklemesi
        this.handleInitialLoad();
        
        console.log('🧭 Navigation Router initialized');
    }

    /**
     * Route'ları tanımla
     */
    defineRoutes() {
        // Ana route'lar
        this.routes.set('/', {
            title: 'Ana Sayfa',
            template: 'dashboard.html',
            breadcrumb: ['Ana Sayfa'],
            requiresAuth: true
        });

        this.routes.set('/dashboard', {
            title: 'Kontrol Paneli',
            template: 'dashboard.html',
            breadcrumb: ['Ana Sayfa', 'Kontrol Paneli'],
            requiresAuth: true
        });

        // Hasta yönetimi
        this.routes.set('/patients', {
            title: 'Hasta Yönetimi',
            template: 'patients.html',
            breadcrumb: ['Ana Sayfa', 'Hasta Yönetimi'],
            requiresAuth: true
        });

        this.routes.set('/patients/new', {
            title: 'Yeni Hasta Kaydı',
            template: 'patient_form.html',
            breadcrumb: ['Ana Sayfa', 'Hasta Yönetimi', 'Yeni Hasta'],
            requiresAuth: true
        });

        // Randevu yönetimi
        this.routes.set('/appointments', {
            title: 'Randevu Yönetimi',
            template: 'appointments.html',
            breadcrumb: ['Ana Sayfa', 'Randevu Yönetimi'],
            requiresAuth: true
        });

        // Test raporları
        this.routes.set('/tests', {
            title: 'Test Raporları',
            template: 'test-reports.html',
            breadcrumb: ['Ana Sayfa', 'Test Raporları'],
            requiresAuth: true
        });

        // Cihaz yönetimi
        this.routes.set('/devices', {
            title: 'Cihaz Yönetimi',
            template: 'devices.html',
            breadcrumb: ['Ana Sayfa', 'Cihaz Yönetimi'],
            requiresAuth: true
        });

        // Stok yönetimi
        this.routes.set('/inventory', {
            title: 'Stok Yönetimi',
            template: 'inventory.html',
            breadcrumb: ['Ana Sayfa', 'Stok Yönetimi'],
            requiresAuth: true
        });

        // Fatura yönetimi
        this.routes.set('/invoices', {
            title: 'Fatura Yönetimi',
            template: 'invoices.html',
            breadcrumb: ['Ana Sayfa', 'Fatura Yönetimi'],
            requiresAuth: true
        });

        // Yardım ve ayarlar
        this.routes.set('/help', {
            title: 'Yardım',
            template: 'help.html',
            breadcrumb: ['Ana Sayfa', 'Yardım'],
            requiresAuth: false
        });

        this.routes.set('/settings', {
            title: 'Ayarlar',
            template: 'settings.html',
            breadcrumb: ['Ana Sayfa', 'Ayarlar'],
            requiresAuth: true
        });
    }

    /**
     * Event listener'ları kur
     */
    setupEventListeners() {
        // Browser back/forward butonları
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.route) {
                this.navigateToRoute(event.state.route, false);
            }
        });

        // Menü link'lerine tıklama
        document.addEventListener('click', (event) => {
            const link = event.target.closest('[data-route]');
            if (link) {
                event.preventDefault();
                const route = link.getAttribute('data-route');
                this.navigate(route);
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            // Alt + H: Ana sayfa
            if (event.altKey && event.key === 'h') {
                event.preventDefault();
                this.navigate('/dashboard');
            }
            
            // Alt + P: Hastalar
            if (event.altKey && event.key === 'p') {
                event.preventDefault();
                this.navigate('/patients');
            }
        });
    }

    /**
     * İlk sayfa yüklemesi
     */
    handleInitialLoad() {
        const currentPath = window.location.pathname;
        const route = this.routes.has(currentPath) ? currentPath : '/dashboard';
        this.navigateToRoute(route, false);
    }

    /**
     * Yeni route'a git
     * @param {string} route - Hedef route
     * @param {boolean} addToHistory - History'e ekle
     */
    async navigate(route) {
        if (this.isNavigating) {
            console.warn('⚠️ Navigation already in progress');
            return;
        }

        await this.navigateToRoute(route, true);
    }

    /**
     * Route'a git (internal)
     * @param {string} route - Hedef route
     * @param {boolean} addToHistory - History'e ekle
     */
    async navigateToRoute(route, addToHistory = true) {
        if (!this.routes.has(route)) {
            console.error(`❌ Route not found: ${route}`);
            this.showError('Sayfa bulunamadı');
            return;
        }

        const routeConfig = this.routes.get(route);
        
        // Auth kontrolü
        if (routeConfig.requiresAuth && !this.checkAuth()) {
            console.warn('🔒 Authentication required');
            this.redirectToLogin();
            return;
        }

        try {
            this.isNavigating = true;
            
            // Loading state göster
            this.showLoadingState();
            
            // Önceki route'dan çık
            await this.exitCurrentRoute();
            
            // Yeni route'u yükle
            await this.loadRoute(route, routeConfig);
            
            // URL ve history güncelle
            if (addToHistory) {
                this.updateUrl(route, routeConfig);
            }
            
            // Breadcrumb güncelle
            this.updateBreadcrumb(routeConfig.breadcrumb);
            
            // Aktif menü öğesini güncelle
            this.updateActiveMenuItem(route);
            
            // Loading state'i kaldır
            this.hideLoadingState();
            
            this.currentRoute = route;
            console.log(`✅ Navigated to: ${route}`);
            
            // Route change event'i fırlat
            const routeChangeEvent = new CustomEvent('routeChange', {
                detail: { route, config: routeConfig }
            });
            document.dispatchEvent(routeChangeEvent);
            
        } catch (error) {
            console.error('❌ Navigation error:', error);
            this.showError('Sayfa yüklenirken hata oluştu');
        } finally {
            this.isNavigating = false;
        }
    }

    /**
     * Route'u yükle
     * @param {string} route - Route path
     * @param {object} config - Route konfigürasyonu
     */
    async loadRoute(route, config) {
        try {
            // Test ortamında sadece mock content yükle
            if (window.location.pathname.includes('test-router.html')) {
                await this.loadMockContent(route, config);
                return;
            }
            
            // Template'i yükle
            const templateUrl = `/static/frontend/templates/frontend/${config.template}`;
            const response = await fetch(templateUrl);
            
            if (!response.ok) {
                throw new Error(`Template not found: ${config.template}`);
            }
            
            const html = await response.text();
            
            // Content'i güncelle
            await this.updateContent(html);
            
            // Sayfa başlığını güncelle
            document.title = `${config.title} - İşitme Merkezi`;
            
            // Route-specific JavaScript'i çalıştır
            await this.executeRouteScript(route);
            
        } catch (error) {
            console.error('❌ Route loading error:', error);
            await this.loadErrorContent(route, error);
        }
    }
    
    /**
     * Test için mock content yükle
     * @param {string} route - Route path
     * @param {object} config - Route konfigürasyonu
     */
    async loadMockContent(route, config) {
        const mockHtml = `
            <div style="padding: 40px; text-align: center; border: 2px dashed #FF6F00; border-radius: 12px; background: #FFF3E0;">
                <h2 style="color: #FF6F00; margin-bottom: 16px;">📍 ${config.title}</h2>
                <p style="color: #666; margin-bottom: 20px;">Bu sayfa router tarafından yüklendi</p>
                <div style="background: #E3F2FD; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <strong>Route:</strong> ${route}<br>
                    <strong>Template:</strong> ${config.template}<br>
                    <strong>Breadcrumb:</strong> ${config.breadcrumb.join(' > ')}<br>
                    <strong>Yüklenme Zamanı:</strong> ${new Date().toLocaleString()}
                </div>
                <p style="color: #4CAF50; font-weight: 500;">✅ Router başarıyla çalışıyor!</p>
            </div>
        `;
        
        await this.updateContent(mockHtml);
        document.title = `${config.title} - Test`;
        await this.executeRouteScript(route);
    }
    
    /**
     * Error content yükle
     * @param {string} route - Route path
     * @param {Error} error - Hata
     */
    async loadErrorContent(route, error) {
        const errorHtml = `
            <div class="router-error">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <h3>Sayfa Yüklenemedi</h3>
                <p>Route: ${route}</p>
                <p>Hata: ${error.message}</p>
                <button onclick="window.router.navigate('/dashboard')" style="background: #FF6F00; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;">
                    Ana Sayfaya Dön
                </button>
            </div>
        `;
        
        await this.updateContent(errorHtml);
    }

    /**
     * Content'i güncelle
     * @param {string} html - Yeni HTML content
     */
    async updateContent(html) {
        return new Promise((resolve) => {
            // Fade out animasyonu
            this.mainContent.style.opacity = '0';
            this.mainContent.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                // HTML'i güncelle
                this.mainContent.innerHTML = html;
                
                // Fade in animasyonu
                this.mainContent.style.opacity = '1';
                this.mainContent.style.transform = 'translateY(0)';
                
                resolve();
            }, 150);
        });
    }

    /**
     * Route-specific JavaScript'i çalıştır
     * @param {string} route - Route path
     */
    async executeRouteScript(route) {
        // Route'a göre özel JavaScript fonksiyonlarını çalıştır
        switch (route) {
            case '/dashboard':
                if (typeof initDashboard === 'function') {
                    await initDashboard();
                }
                break;
            case '/patients':
                if (typeof initPatients === 'function') {
                    await initPatients();
                }
                break;
            case '/appointments':
                if (typeof initAppointments === 'function') {
                    await initAppointments();
                }
                break;
            // Diğer route'lar için benzer şekilde...
        }
    }

    /**
     * Önceki route'dan çık
     */
    async exitCurrentRoute() {
        if (this.currentRoute) {
            // Cleanup fonksiyonlarını çalıştır
            const event = new CustomEvent('routeExit', { 
                detail: { route: this.currentRoute } 
            });
            document.dispatchEvent(event);
        }
    }

    /**
     * URL güncelle
     * @param {string} route - Route path
     * @param {object} config - Route konfigürasyonu
     */
    updateUrl(route, config) {
        const state = { route, title: config.title };
        history.pushState(state, config.title, route);
    }

    /**
     * Breadcrumb güncelle
     * @param {Array} breadcrumb - Breadcrumb öğeleri
     */
    updateBreadcrumb(breadcrumb) {
        const breadcrumbContainer = document.querySelector('.breadcrumb');
        if (breadcrumbContainer && breadcrumb) {
            let breadcrumbHtml = breadcrumb.map((item, index) => {
                if (index === breadcrumb.length - 1) {
                    return `<span class="breadcrumb-current">${item}</span>`;
                } else {
                    return `<span class="breadcrumb-item">${item}</span>`;
                }
            }).join(' <i class="fa-solid fa-chevron-right"></i> ');
            
            breadcrumbContainer.innerHTML = breadcrumbHtml;
        }
    }

    /**
     * Aktif menü öğesini güncelle
     * @param {string} route - Aktif route
     */
    updateActiveMenuItem(route) {
        // Tüm menü öğelerinden active class'ını kaldır
        document.querySelectorAll('.sidebar-menu a, .topbar-menu a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Aktif route'a göre menü öğesini işaretle
        const activeLink = document.querySelector(`[data-route="${route}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    /**
     * Loading state göster
     */
    showLoadingState() {
        // Global loading overlay
        let loadingOverlay = document.querySelector('.page-loading');
        if (!loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'page-loading';
            loadingOverlay.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>Sayfa yükleniyor...</p>
                </div>
            `;
            document.body.appendChild(loadingOverlay);
        }
        loadingOverlay.style.display = 'flex';
    }

    /**
     * Loading state kaldır
     */
    hideLoadingState() {
        const loadingOverlay = document.querySelector('.page-loading');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }

    /**
     * Auth kontrolü
     * @returns {boolean} - Kullanıcı authenticated mi?
     */
    checkAuth() {
        // ErrorHandler'dan token kontrolü
        if (typeof errorHandler !== 'undefined' && errorHandler.checkAuth) {
            return errorHandler.checkAuth();
        }
        
        // Fallback: localStorage/sessionStorage kontrolü
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        return !!token;
    }

    /**
     * Login sayfasına yönlendir
     */
    redirectToLogin() {
        // Mevcut sayfayı kaydet
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        window.location.href = '/login/';
    }

    /**
     * Hata göster
     * @param {string} message - Hata mesajı
     */
    showError(message) {
        if (typeof errorHandler !== 'undefined' && errorHandler.showNotification) {
            errorHandler.showNotification(message, 'error');
        } else {
            alert(message);
        }
    }

    /**
     * Geri git
     */
    goBack() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            const previousRoute = this.history[this.historyIndex];
            this.navigateToRoute(previousRoute, false);
        } else {
            window.history.back();
        }
    }

    /**
     * İleri git
     */
    goForward() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            const nextRoute = this.history[this.historyIndex];
            this.navigateToRoute(nextRoute, false);
        } else {
            window.history.forward();
        }
    }

    /**
     * Mevcut route'u al
     * @returns {string} - Mevcut route
     */
    getCurrentRoute() {
        return this.currentRoute;
    }

    /**
     * Route var mı kontrol et
     * @param {string} route - Route path
     * @returns {boolean} - Route mevcut mu?
     */
    hasRoute(route) {
        return this.routes.has(route);
    }
}

// Global router instance
let navigationRouter = null;

// DOM yüklendikten sonra router'ı başlat
document.addEventListener('DOMContentLoaded', () => {
    navigationRouter = new NavigationRouter();
    
    // Global erişim için
    window.router = navigationRouter;
});

// Router'ı export et (ES6 modules için)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationRouter;
}