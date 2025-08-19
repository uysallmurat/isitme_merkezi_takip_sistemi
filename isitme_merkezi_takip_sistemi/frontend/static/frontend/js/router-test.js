console.log('🧪 Test sayfası başlatılıyor...');
        
// Debug panel güncelleme
function updateDebug() {
    const debug = document.getElementById('debug');
    const currentRoute = document.getElementById('currentRoute');
    
    if (window.router) {
        const route = window.router.getCurrentRoute() || 'Bilinmiyor';
        currentRoute.textContent = route;
        
        debug.innerHTML = `
            <strong>Debug Bilgileri:</strong><br>
            ✅ Router Status: Aktif<br>
            📍 Current Route: ${route}<br>
            🔄 Is Navigating: ${window.router.isNavigating ? 'Evet' : 'Hayır'}<br>
            📚 Routes Count: ${window.router.routes ? window.router.routes.size : 0}<br>
            🕒 Son Güncelleme: ${new Date().toLocaleTimeString()}
        `;
    } else {
        debug.innerHTML = `
            <strong>Debug Bilgileri:</strong><br>
            ❌ Router Status: Yüklenmedi<br>
            ⚠️ window.router bulunamadı
        `;
    }
}

// Link tıklama yönetimi
document.addEventListener('click', function(event) {
    const link = event.target.closest('[data-route]');
    if (link) {
        event.preventDefault();
        console.log('🖱️ Link tıklandı:', link.getAttribute('data-route'));
        
        // Active class
        document.querySelectorAll('.menu a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
        
        // Router ile navigate
        const route = link.getAttribute('data-route');
        if (window.router) {
            window.router.navigate(route);
        } else {
            console.warn('⚠️ Router henüz yüklenmedi');
            // Manual content update
            document.getElementById('content').innerHTML = `
                <h2>⚠️ Router Yüklenmedi</h2>
                <p>Route: ${route}</p>
                <p>Router henüz aktif değil, sayfa yenileyin</p>
            `;
        }
    }
});

// Route change listener
document.addEventListener('routeChange', function(event) {
    console.log('🔄 Route değişti:', event.detail);
    updateDebug();
});

// Page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM yüklendi');
    
    // İlk debug güncelleme
    setTimeout(updateDebug, 500);
    
    // Periyodik güncelleme
    setInterval(updateDebug, 3000);
});

// Mock functions
window.initDashboard = () => console.log('🏠 Dashboard init');
window.initPatients = () => console.log('👥 Patients init');
window.initAppointments = () => console.log('📅 Appointments init');

// Test Functions
function testRouter() {
    console.log('🧪 Router test başlatılıyor...');
    if (window.router) {
        alert('✅ Router aktif! Mevcut route: ' + window.router.getCurrentRoute());
    } else {
        alert('❌ Router bulunamadı!');
    }
}

function testNavigation() {
    console.log('🧭 Navigation test başlatılıyor...');
    if (window.router) {
        const routes = ['/dashboard', '/patients', '/appointments', '/devices'];
        const randomRoute = routes[Math.floor(Math.random() * routes.length)];
        window.router.navigate(randomRoute);
        alert('🧭 Rastgele route\'a gidiliyor: ' + randomRoute);
    } else {
        alert('❌ Router bulunamadı!');
    }
}

function testBreadcrumb() {
    console.log('🍞 Breadcrumb test başlatılıyor...');
    const breadcrumb = document.getElementById('breadcrumb');
    if (breadcrumb) {
        breadcrumb.innerHTML = 'Ana Sayfa <i class="fa-solid fa-chevron-right"></i> Test <i class="fa-solid fa-chevron-right"></i> <span class="breadcrumb-current">Breadcrumb Test</span>';
        alert('🍞 Breadcrumb güncellendi!');
    } else {
        alert('❌ Breadcrumb elementi bulunamadı!');
    }
}

function testLoading() {
    console.log('⏳ Loading test başlatılıyor...');
    const loading = document.querySelector('.page-loading');
    if (loading) {
        loading.style.display = 'flex';
        setTimeout(() => {
            loading.style.display = 'none';
            alert('⏳ Loading test tamamlandı!');
        }, 2000);
    } else {
        alert('❌ Loading overlay bulunamadı!');
    }
}

console.log('🚀 Test sayfası hazır!');