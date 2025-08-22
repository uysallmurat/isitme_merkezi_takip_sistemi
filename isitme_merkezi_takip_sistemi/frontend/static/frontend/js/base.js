// Base JavaScript - Tüm sayfalarda kullanılan ortak fonksiyonlar

// Debounce fonksiyonu
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Tablo Kaydırma Sistemi - Tüm sayfalarda kullanılabilir
function initializeTableScroll(containerSelector = '.table-container', indicatorSelector = '#scrollIndicator') {
    const tableContainer = document.querySelector(containerSelector);
    const scrollIndicator = document.querySelector(indicatorSelector);
    
    if (!tableContainer) {
        console.warn('Tablo container bulunamadı:', containerSelector);
        return;
    }
    
    let isScrolling = false;
    let startX = 0;
    let scrollLeft = 0;
    
    // Mouse wheel ile yatay kaydırma
    tableContainer.addEventListener('wheel', function(e) {
        if (e.shiftKey) {
            e.preventDefault();
            tableContainer.scrollLeft += e.deltaY;
        }
    });
    
    // Mouse ile sürükleme
    tableContainer.addEventListener('mousedown', function(e) {
        isScrolling = true;
        startX = e.pageX - tableContainer.offsetLeft;
        scrollLeft = tableContainer.scrollLeft;
        tableContainer.style.cursor = 'grabbing';
        tableContainer.style.userSelect = 'none';
    });
    
    tableContainer.addEventListener('mousemove', function(e) {
        if (!isScrolling) return;
        
        e.preventDefault();
        const x = e.pageX - tableContainer.offsetLeft;
        const walk = (x - startX) * 2;
        tableContainer.scrollLeft = scrollLeft - walk;
        
        // Scroll indicator'ı göster
        if (scrollIndicator) showScrollIndicator();
    });
    
    tableContainer.addEventListener('mouseup', function() {
        isScrolling = false;
        tableContainer.style.cursor = 'grab';
        tableContainer.style.userSelect = 'auto';
        
        // Scroll indicator'ı gizle
        if (scrollIndicator) {
            setTimeout(hideScrollIndicator, 2000);
        }
    });
    
    tableContainer.addEventListener('mouseleave', function() {
        if (isScrolling) {
            isScrolling = false;
            tableContainer.style.cursor = 'grab';
            tableContainer.style.userSelect = 'auto';
        }
    });
    
    // Touch events için mobil desteği
    tableContainer.addEventListener('touchstart', function(e) {
        startX = e.touches[0].pageX - tableContainer.offsetLeft;
        scrollLeft = tableContainer.scrollLeft;
    });
    
    tableContainer.addEventListener('touchmove', function(e) {
        e.preventDefault();
        const x = e.touches[0].pageX - tableContainer.offsetLeft;
        const walk = (x - startX) * 2;
        tableContainer.scrollLeft = scrollLeft - walk;
        
        if (scrollIndicator) showScrollIndicator();
    });
    
    tableContainer.addEventListener('touchend', function() {
        if (scrollIndicator) {
            setTimeout(hideScrollIndicator, 2000);
        }
    });
    
    // Scroll indicator fonksiyonları
    function showScrollIndicator() {
        if (scrollIndicator) {
            scrollIndicator.classList.add('show');
        }
    }
    
    function hideScrollIndicator() {
        if (scrollIndicator) {
            scrollIndicator.classList.remove('show');
        }
    }
    
    // Scroll pozisyonuna göre indicator'ı güncelle
    tableContainer.addEventListener('scroll', function() {
        if (!scrollIndicator) return;
        
        const maxScroll = tableContainer.scrollWidth - tableContainer.clientWidth;
        const scrollPercent = (tableContainer.scrollLeft / maxScroll) * 100;
        
        if (scrollPercent > 0) {
            showScrollIndicator();
        } else {
            hideScrollIndicator();
        }
    });
    
    // Klavye ile kaydırma
    tableContainer.addEventListener('keydown', function(e) {
        const scrollAmount = 100;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                tableContainer.scrollLeft -= scrollAmount;
                break;
            case 'ArrowRight':
                e.preventDefault();
                tableContainer.scrollLeft += scrollAmount;
                break;
            case 'Home':
                e.preventDefault();
                tableContainer.scrollLeft = 0;
                break;
            case 'End':
                e.preventDefault();
                tableContainer.scrollLeft = tableContainer.scrollWidth;
                break;
        }
        
        if (e.key.startsWith('Arrow') || e.key === 'Home' || e.key === 'End') {
            if (scrollIndicator) {
                showScrollIndicator();
                setTimeout(hideScrollIndicator, 2000);
            }
        }
    });
    
    // Tablo container'a focus özelliği ekle
    tableContainer.setAttribute('tabindex', '0');
    
    console.log('Tablo kaydırma sistemi başlatıldı:', containerSelector);
}

// Tüm tablolara otomatik olarak kaydırma özelliği ekle
document.addEventListener('DOMContentLoaded', function() {
    // Sayfa yüklendiğinde tüm tablo container'ları bul ve kaydırma özelliği ekle
    const tableContainers = document.querySelectorAll('.table-container');
    tableContainers.forEach((container, index) => {
        // Her container için unique ID oluştur
        if (!container.id) {
            container.id = `table-container-${index}`;
        }
        
        // Scroll indicator ekle (eğer yoksa)
        if (!container.querySelector('.scroll-indicator')) {
            const indicator = document.createElement('div');
            indicator.className = 'scroll-indicator';
            container.appendChild(indicator);
        }
        
        // Kaydırma özelliğini başlat
        initializeTableScroll(`#${container.id}`, `#${container.id} .scroll-indicator`);
    });
    
    console.log(`${tableContainers.length} adet tablo kaydırma sistemi başlatıldı`);
});
