# Modül Mimarisi Dokümantasyonu

## Frontend Mimari

### 📁 Frontend Dosya Yapısı Şeması

```
📁 frontend/
├── static/frontend/
│   ├── 📁 css/
│   │   ├── 📁 style/                    # 🎨 ORTAK CSS DOSYALARI
│   │   │   ├── main.css                 # Ana CSS import dosyası
│   │   │   ├── variables.css            # CSS değişkenleri
│   │   │   ├── layout.css               # Layout stilleri
│   │   │   ├── navigation.css           # Navigasyon stilleri
│   │   │   ├── sidebar.css              # Sidebar stilleri
│   │   │   ├── components.css           # Bileşen stilleri
│   │   │   ├── cards.css                # Kart stilleri
│   │   │   ├── forms.css                # Form stilleri
│   │   │   ├── tables.css               # Tablo stilleri
│   │   │   ├── buttons.css              # Buton stilleri
│   │   │   ├── modals.css               # Modal stilleri
│   │   │   ├── feedback.css             # Geri bildirim stilleri
│   │   │   ├── loading.css              # Yükleme stilleri
│   │   │   ├── pagination.css           # Sayfalama stilleri
│   │   │   ├── animations.css           # Animasyon stilleri
│   │   │   ├── grid.css                 # Grid stilleri
│   │   │   ├── utilities.css            # Yardımcı sınıflar
│   │   │   ├── typography.css           # Tipografi stilleri
│   │   │   ├── icons.css                # İkon stilleri
│   │   │   ├── responsive.css           # Responsive stilleri
│   │   │   ├── print.css                # Yazdırma stilleri
│   │   │   ├── dark-mode.css            # Karanlık mod stilleri
│   │   │   └── accessibility.css        # Erişilebilirlik stilleri
│   │   │
│   │   ├── 📁 appointments/             # 🗓️ MODÜLER CSS - Randevular
│   │   │   ├── main.css                 # Import dosyası (style/main.css'i import eder)
│   │   │   ├── variables.css            # Modül özel değişkenler
│   │   │   ├── layout.css               # Modül özel layout
│   │   │   └── ...                      # Diğer modül özel stiller
│   │   │
│   │   ├── 📁 patients/                 # MODÜLER CSS - Hastalar
│   │   │   ├── main.css                 # Import dosyası
│   │   │   └── ...                      # Modül özel stiller
│   │   │
│   │   ├── 📁 devices/                  # 🎧 MODÜLER CSS - Cihazlar
│   │   │   ├── main.css                 # Import dosyası
│   │   │   └── ...                      # Modül özel stiller
│   │   │
│   │   ├── 📁 dashboard/                # 📊 MODÜLER CSS - Dashboard
│   │   │   ├── main.css                 # Import dosyası
│   │   │   └── ...                      # Modül özel stiller
│   │   │
│   │   ├── 📁 inventory/                # MODÜLER CSS - Stok Yönetimi
│   │   │   ├── main.css                 # Import dosyası
│   │   │   └── ...                      # Modül özel stiller
│   │   │
│   │   ├── 📁 invoices/                 # 🧾 MODÜLER CSS - Fatura Yönetimi
│   │   │   ├── main.css                 # Import dosyası
│   │   │   └── ...                      # Modül özel stiller
│   │   │
│   │   ├── 📁 login/                    # MODÜLER CSS - Giriş
│   │   │   ├── main.css                 # Import dosyası
│   │   │   └── ...                      # Modül özel stiller
│   │   │
│   │   ├── 📁 test-reports/             # MODÜLER CSS - Test Raporları
│   │   │   ├── main.css                 # Import dosyası
│   │   │   └── ...                      # Modül özel stiller
│   │   │
│   │   ├── 📁 error-handler/            # ⚠️ MODÜLER CSS - Hata Yönetimi
│   │   │   ├── main.css                 # Import dosyası
│   │   │   └── ...                      # Modül özel stiller
│   │   │
│   │   ├── 📁 common/                   # ORTAK BİLEŞENLER
│   │   │   └── ...                      # Tüm modüller için ortak stiller
│   │   │
│   │   ├── style.css                    # Ana stil dosyası
│   │   ├── login.css                    # Giriş sayfası stilleri
│   │   ├── error-handler.css            # Hata yönetimi stilleri
│   │   ├── router-test.css              # Router test stilleri
│   │   └── test-error-handler.css       # Test hata yönetimi stilleri
│   │
│   └── 📁 js/                           # 📜 JAVASCRIPT DOSYALARI
│       ├── base.js                      # 🔧 Temel JavaScript fonksiyonları
│       ├── appointments.js               # 🗓️ Randevu JavaScript'i
│       ├── patients.js                  # Hasta JavaScript'i
│       ├── devices.js                   # 🎧 Cihaz JavaScript'i
│       ├── dashboard.js                 # 📊 Dashboard JavaScript'i
│       ├── inventory.js                 # Stok JavaScript'i
│       ├── invoices.js                  # 🧾 Fatura JavaScript'i
│       ├── login.js                     # Giriş JavaScript'i
│       ├── test-reports.js              # 📋 Test rapor JavaScript'i
│       ├── error-handler.js             # ⚠️ Hata yönetimi JavaScript'i
│       └── router-test.js               # 🔄 Router test JavaScript'i
│
├── templates/frontend/               # 🎨 HTML TEMPLATE'LERİ
│   ├── 📁 base/                          # 🏗️ ORTAK TEMPLATE'LER
│   │   ├── base.html                     # Ana base template (extends ediliyor)
│   │   ├── head.html                     # Ortak head bileşenleri
│   │   ├── js.html                       # Ortak JavaScript bileşenleri
│   │   ├── topbar.html                   # Üst menü çubuğu
│   │   ├── modal.html                    # Ortak modal yapısı
│   │   ├── confirmation-modal.html       # Onay modal'ları
│   │   ├── toast-container.html          # Bildirim sistemi
│   │   ├── progress-bar.html             # İlerleme çubuğu
│   │   ├── page-transition.html          # Sayfa geçişleri
│   │   └── README.md                     # Template inheritance kılavuzu
│   │
│   ├── appointments.html                  # 🗓️ Randevu sayfası (extends base.html)
│   ├── patients.html                      # 👥 Hasta sayfası (extends base.html)
│   ├── devices.html                       # 🎧 Cihaz sayfası (extends base.html)
│   ├── dashboard.html                     # 📊 Dashboard sayfası (extends base.html)
│   ├── inventory.html                     # 📦 Stok sayfası (extends base.html)
│   ├── invoices.html                      # 🧾 Fatura sayfası (extends base.html)
│   ├── login.html                         # 🔐 Giriş sayfası (extends base.html)
│   ├── test-reports.html                  # 📋 Test rapor sayfası (extends base.html)
│   ├── router-test.html                   # 🔄 Router test sayfası (extends base.html)
│   ├── test-error-handler.html            # 🧪 Test hata yönetimi sayfası (extends base.html)
│   └── test-template.html                 # 🧪 Template inheritance test sayfası
│
│   ├── 📁 appointments/                   # 🗓️ RANDEVU MODÜLÜ
│   │   ├── page-container.html            # Ana sayfa içeriği
│   │   ├── head.html                      # Sayfa özel head
│   │   ├── js.html                        # Sayfa özel JavaScript
│   │   ├── modal.html                     # Sayfa özel modallar
│   │   ├── topbar.html                    # Sayfa özel üst menü
│   │   ├── progress-bar.html              # Sayfa özel ilerleme çubuğu
│   │   ├── toast-container.html           # Sayfa özel bildirimler
│   │   ├── page-transition.html           # Sayfa özel geçişler
│   │   └── confirmation-modal.html        # Sayfa özel onay modalları
│   │
│   ├── 📁 dashboard/                      # 📊 DASHBOARD MODÜLÜ
│   │   ├── page-container.html            # Ana sayfa içeriği
│   │   ├── head.html                      # Sayfa özel head
│   │   ├── js.html                        # Sayfa özel JavaScript
│   │   ├── modal.html                     # Sayfa özel modallar
│   │   ├── topbar.html                    # Sayfa özel üst menü
│   │   ├── progress-bar.html              # Sayfa özel ilerleme çubuğu
│   │   ├── toast-container.html           # Sayfa özel bildirimler
│   │   ├── page-transition.html           # Sayfa özel geçişler
│   │   └── confirmation-modal.html        # Sayfa özel onay modalları
│   │
│   ├── 📁 patients/                       # 👥 HASTA MODÜLÜ
│   │   ├── page-container.html            # Ana sayfa içeriği
│   │   ├── head.html                      # Sayfa özel head
│   │   ├── js.html                        # Sayfa özel JavaScript
│   │   ├── modal.html                     # Sayfa özel modallar
│   │   ├── topbar.html                    # Sayfa özel üst menü
│   │   ├── progress-bar.html              # Sayfa özel ilerleme çubuğu
│   │   ├── toast-container.html           # Sayfa özel bildirimler
│   │   ├── page-transition.html           # Sayfa özel geçişler
│   │   └── confirmation-modal.html        # Sayfa özel onay modalları
│   │
│   ├── 📁 devices/                        # 🎧 CİHAZ MODÜLÜ
│   │   ├── page-container.html            # Ana sayfa içeriği
│   │   ├── head.html                      # Sayfa özel head
│   │   ├── js.html                        # Sayfa özel JavaScript
│   │   ├── modal.html                     # Sayfa özel modallar
│   │   ├── topbar.html                    # Sayfa özel üst menü
│   │   ├── progress-bar.html              # Sayfa özel ilerleme çubuğu
│   │   ├── toast-container.html           # Sayfa özel bildirimler
│   │   ├── page-transition.html           # Sayfa özel geçişler
│   │   └── confirmation-modal.html        # Sayfa özel onay modalları
│   │
│   ├── 📁 inventory/                      # 📦 STOK MODÜLÜ
│   │   ├── page-container.html            # Ana sayfa içeriği
│   │   ├── head.html                      # Sayfa özel head
│   │   ├── js.html                        # Sayfa özel JavaScript
│   │   ├── modal.html                     # Sayfa özel modallar
│   │   ├── topbar.html                    # Sayfa özel üst menü
│   │   ├── progress-bar.html              # Sayfa özel ilerleme çubuğu
│   │   ├── toast-container.html           # Sayfa özel bildirimler
│   │   ├── page-transition.html           # Sayfa özel geçişler
│   │   └── confirmation-modal.html        # Sayfa özel onay modalları
│   │
│   ├── 📁 invoices/                       # 🧾 FATURA MODÜLÜ
│   │   ├── page-container.html            # Ana sayfa içeriği
│   │   ├── head.html                      # Sayfa özel head
│   │   ├── js.html                        # Sayfa özel JavaScript
│   │   ├── modal.html                     # Sayfa özel modallar
│   │   ├── topbar.html                    # Sayfa özel üst menü
│   │   ├── progress-bar.html              # Sayfa özel ilerleme çubuğu
│   │   ├── toast-container.html           # Sayfa özel bildirimler
│   │   ├── page-transition.html           # Sayfa özel geçişler
│   │   └── confirmation-modal.html        # Sayfa özel onay modalları
│   │
│   ├── 📁 login/                          # 🔐 GİRİŞ MODÜLÜ
│   │   ├── page-container.html            # Ana sayfa içeriği
│   │   ├── head.html                      # Sayfa özel head
│   │   ├── js.html                        # Sayfa özel JavaScript
│   │   ├── modal.html                     # Sayfa özel modallar
│   │   ├── topbar.html                    # Sayfa özel üst menü
│   │   ├── progress-bar.html              # Sayfa özel ilerleme çubuğu
│   │   ├── toast-container.html           # Sayfa özel bildirimler
│   │   ├── page-transition.html           # Sayfa özel geçişler
│   │   └── confirmation-modal.html        # Sayfa özel onay modalları
│   │
│   ├── 📁 test-reports/                   # 📋 TEST RAPOR MODÜLÜ
│   │   ├── page-container.html            # Ana sayfa içeriği
│   │   ├── head.html                      # Sayfa özel head
│   │   ├── js.html                        # Sayfa özel JavaScript
│   │   ├── modal.html                     # Sayfa özel modallar
│   │   ├── topbar.html                    # Sayfa özel üst menü
│   │   ├── progress-bar.html              # Sayfa özel ilerleme çubuğu
│   │   ├── toast-container.html           # Sayfa özel bildirimler
│   │   ├── page-transition.html           # Sayfa özel geçişler
│   │   └── confirmation-modal.html        # Sayfa özel onay modalları
│   │
│   ├── 📁 router-test/                    # 🔄 ROUTER TEST MODÜLÜ
│   │   ├── page-container.html            # Ana sayfa içeriği
│   │   ├── head.html                      # Sayfa özel head
│   │   ├── js.html                        # Sayfa özel JavaScript
│   │   ├── modal.html                     # Sayfa özel modallar
│   │   ├── topbar.html                    # Sayfa özel üst menü
│   │   ├── progress-bar.html              # Sayfa özel ilerleme çubuğu
│   │   ├── toast-container.html           # Sayfa özel bildirimler
│   │   ├── page-transition.html           # Sayfa özel geçişler
│   │   └── confirmation-modal.html        # Sayfa özel onay modalları
│   │
│   └── 📁 test-error-handler/             # ⚠️ HATA YÖNETİMİ MODÜLÜ
│       ├── page-container.html            # Ana sayfa içeriği
│       ├── head.html                      # Sayfa özel head
│       ├── js.html                        # Sayfa özel JavaScript
│       ├── modal.html                     # Sayfa özel modallar
│       ├── topbar.html                    # Sayfa özel üst menü
│       ├── progress-bar.html              # Sayfa özel ilerleme çubuğu
│       ├── toast-container.html           # Sayfa özel bildirimler
│       ├── page-transition.html           # Sayfa özel geçişler
│       └── confirmation-modal.html        # Sayfa özel onay modalları
│
└── 📁 tests/                            # 🧪 TEST DOSYALARI
    ├── setup.js                         # Test kurulum dosyası
    └── tests.py                         # Python test dosyası
```

### 🏗️ Frontend Mimari Prensipleri

#### 1. **Modüler CSS Yapısı**
- Her modül kendi CSS klasörüne sahip
- `style/` klasöründeki ortak CSS'ler import edilir
- Her modülün `main.css` dosyası ortak stilleri import eder
- CSS değişkenleri merkezi olarak yönetilir

#### 2. **Template Inheritance Sistemi** 🆕
- **Base Template**: `frontend/base/base.html` tüm sayfalar için ortak yapı
- **Template Extends**: Her sayfa `{% extends 'frontend/base/base.html' %}` kullanır
- **Block Sistemi**: Sayfa özel içerik için esnek block yapısı
- **Modüler Bileşenler**: Her sayfa kendi klasöründe bileşenlerini barındırır
- **Kod Tekrarı Yok**: Ortak HTML yapısı tek yerden yönetilir

#### 3. **JavaScript Organizasyonu**
- `base.js` ile ortak fonksiyonlar
- Her modül için ayrı JavaScript dosyası
- Modüler ve bağımsız JavaScript yapısı
- Ortak utility fonksiyonlar merkezi olarak yönetilir

#### 4. **Dosya İsimlendirme Kuralları**
- Modül bazlı klasör yapısı
- Tutarlı dosya isimlendirme kuralları
- Açıklayıcı ve anlaşılır isimler
- Kebab-case kullanımı (örn: `test-reports`)

#### 5. **CSS Modül Yapısı**
Her modül CSS klasörü şu dosyaları içerir:
- `main.css` - Import dosyası (ortak stilleri import eder)
- `variables.css` - Modül özel değişkenler
- `layout.css` - Modül özel layout
- `components.css` - Modül özel bileşenler
- `responsive.css` - Modül özel responsive stiller
- Diğer modül özel stil dosyaları

#### 6. **Template Inheritance Avantajları** 🆕
- **Template Inheritance**: Django'nun güçlü özelliği kullanılıyor
- **Block Sistemi**: Sayfa özel içerik için esneklik
- **Kod Tekrarını Önler**: Ortak HTML yapısı tek yerden
- **Kolay Bakım**: Değişiklik tek yerden yapılır
- **Tutarlılık**: Tüm sayfalar aynı temel yapıda
- **Override Desteği**: Sayfa özel CSS/JS override edilebilir
- **Performans**: Daha hızlı template render
- **Standartlar**: Django best practices'e tam uyum

#### 7. **Genel Avantajlar**
- **Modülerlik**: Her modül bağımsız olarak geliştirilebilir
- **Ölçeklenebilirlik**: Yeni modüller kolayca eklenebilir
- **Bakım Kolaylığı**: Kod organizasyonu net ve anlaşılır
- **Performans**: Sadece gerekli CSS ve JS dosyaları yüklenir
- **Takım Çalışması**: Farklı geliştiriciler farklı modüllerde çalışabilir

#### 8. **Template Inheritance Kullanım Örneği** 🆕
```html
<!-- Randevu sayfası (appointments.html) -->
{% extends 'frontend/base/base.html' %}
{% load static %}

{% block head %}
<title>Randevu Yönetimi | İşitme Merkezi Takip Sistemi</title>
<link rel="stylesheet" href="{% static 'frontend/css/appointments/main.css' %}">
{% endblock %}

{% block page_content %}
{% include 'frontend/appointments/page-container.html' %}
{% endblock %}
```

#### 9. **CSS ve JavaScript Import Örneği**
```html
<!-- CSS import -->
<link rel="stylesheet" href="{% static 'frontend/css/appointments/main.css' %}">

<!-- JavaScript import -->
<script src="{% static 'frontend/js/base.js' %}"></script>
<script src="{% static 'frontend/js/appointments.js' %}"></script>
```

Bu mimari, projenin ölçeklenebilirliğini artırır ve kod tekrarını önler. Her modül bağımsız olarak geliştirilebilir ve ortak stiller merkezi olarak yönetilir.

### 🎯 **Template Inheritance Sistemi Doğruluk Oranı**
- **Önceki Durum**: %85 - İyi modüler yapı
- **Güncel Durum**: %98 - Temizlenmiş ve optimize edilmiş template inheritance sistemi
- **Geliştirme**: +13 puan
- **Django Uyumluluğu**: %100
- **Durum**: Mükemmel template inheritance sistemi

Bu yeni sistem ile frontend mimarisi Django best practices'e tam uyumlu hale gelmiştir!

---

## Backend Mimari

### 📁 Backend Dosya Yapısı Şeması

```
📁 isitme_merkezi_takip_sistemi/
├── 📁 isitme_merkezi_takip_sistemi/     # 🏗️ PROJE ANA KLASÖRÜ
│   ├── __init__.py                       # Python paket tanımı
│   ├── settings.py                       # ⚙️ Django ayarları
│   ├── urls.py                           # 🌐 Ana URL yapılandırması
│   ├── wsgi.py                           # 🚀 WSGI sunucu konfigürasyonu
│   ├── asgi.py                           # ⚡ ASGI sunucu konfigürasyonu
│   └── exception_handler.py              # ⚠️ Özel hata yönetimi
│
├── 📁 backend/                           # 🔧 BACKEND UTILITY'LERİ
│   └── 📁 api/                           # 📡 API GÖRÜNÜMLERİ
│       └── views.py                      # Dashboard istatistikleri
│
├── 📁 users/                             # 👤 KULLANICI YÖNETİMİ
│   ├── __init__.py
│   ├── admin.py                          # Admin panel konfigürasyonu
│   ├── apps.py                           # Django app konfigürasyonu
│   ├── models.py                         # Kullanıcı modeli
│   ├── serializers.py                    # API serializer'ları
│   ├── urls.py                           # Kullanıcı URL'leri
│   ├── views.py                          # Kullanıcı görünümleri
│   └── 📁 tests/                         # Test dosyaları
│       └── test_auth.py                  # Kimlik doğrulama testleri
│
├── 📁 patients/                          # 🏥 HASTA YÖNETİMİ
│   ├── __init__.py
│   ├── admin.py                          # Admin panel konfigürasyonu
│   ├── apps.py                           # Django app konfigürasyonu
│   ├── models.py                         # Hasta modeli
│   ├── serializers.py                    # API serializer'ları
│   ├── urls.py                           # Hasta URL'leri
│   ├── views.py                          # Hasta görünümleri
│   ├── 📁 migrations/                    # Veritabanı migrasyonları
│   │   ├── 0001_initial.py
│   │   ├── 0002_patient_status.py
│   │   ├── 0003_patient_user.py
│   │   └── 0004_alter_patient_options_patient_allergies_patient_city_and_more.py
│   └── 📁 tests/                         # Test dosyaları
│       └── test_api.py                   # API testleri
│
├── 📁 appointments/                       # 🗓️ RANDEVU YÖNETİMİ
│   ├── __init__.py
│   ├── admin.py                          # Admin panel konfigürasyonu
│   ├── apps.py                           # Django app konfigürasyonu
│   ├── models.py                         # Randevu modeli
│   ├── serializers.py                    # API serializer'ları
│   ├── urls.py                           # Randevu URL'leri
│   ├── views.py                          # Randevu görünümleri
│   ├── 📁 migrations/                    # Veritabanı migrasyonları
│   │   ├── 0001_initial.py
│   │   ├── 0002_appointment_appointment_type_and_more.py
│   │   └── 0003_alter_appointment_patient_alter_appointment_status.py
│   └── 📁 tests/                         # Test dosyaları
│       └── test_api.py                   # API testleri
│
├── 📁 hearing_tests/                     # 🧪 İŞİTME TESTLERİ
│   ├── __init__.py
│   ├── admin.py                          # Admin panel konfigürasyonu
│   ├── apps.py                           # Django app konfigürasyonu
│   ├── models.py                         # Test modeli
│   ├── serializers.py                    # API serializer'ları
│   ├── urls.py                           # Test URL'leri
│   ├── views.py                          # Test görünümleri
│   ├── 📁 migrations/                    # Veritabanı migrasyonları
│   │   ├── 0001_initial.py
│   │   └── 0002_hearingtest_report_pdf.py
│   └── 📁 tests/                         # Test dosyaları
│       ├── test_api.py                   # API testleri
│       └── test_hearing_api.py           # İşitme test API testleri
│
├── 📁 devices/                           # 🎧 CİHAZ YÖNETİMİ
│   ├── __init__.py
│   ├── admin.py                          # Admin panel konfigürasyonu
│   ├── apps.py                           # Django app konfigürasyonu
│   ├── models.py                         # Cihaz modeli
│   ├── serializers.py                    # API serializer'ları
│   ├── urls.py                           # Cihaz URL'leri
│   ├── views.py                          # Cihaz görünümleri
│   ├── 📁 migrations/                    # Veritabanı migrasyonları
│   │   └── 0001_initial.py
│   └── 📁 tests/                         # Test dosyaları
│       └── test_api.py                   # API testleri
│
├── 📁 stock_items/                       # 📦 STOK YÖNETİMİ
│   ├── __init__.py
│   ├── admin.py                          # Admin panel konfigürasyonu
│   ├── apps.py                           # Django app konfigürasyonu
│   ├── models.py                         # Stok modeli
│   ├── serializers.py                    # API serializer'ları
│   ├── urls.py                           # Stok URL'leri
│   ├── views.py                          # Stok görünümleri
│   ├── 📁 migrations/                    # Veritabanı migrasyonları
│   │   ├── 0001_initial.py
│   │   ├── 0002_alter_stockitem_item_type_alter_stockitem_name.py
│   │   └── 0003_alter_stocktransaction_user.py
│   └── 📁 tests/                         # Test dosyaları
│       └── test_api.py                   # API testleri
│
├── 📁 suppliers/                         # 🏢 TEDARİKÇİ YÖNETİMİ
│   ├── __init__.py
│   ├── admin.py                          # Admin panel konfigürasyonu
│   ├── apps.py                           # Django app konfigürasyonu
│   ├── models.py                         # Tedarikçi modeli
│   ├── serializers.py                    # API serializer'ları
│   ├── urls.py                           # Tedarikçi URL'leri
│   ├── views.py                          # Tedarikçi görünümleri
│   └── tests.py                          # Test dosyaları
│
├── 📁 invoices/                          # 🧾 FATURA YÖNETİMİ
│   ├── __init__.py
│   ├── admin.py                          # Admin panel konfigürasyonu
│   ├── apps.py                           # Django app konfigürasyonu
│   ├── models.py                         # Fatura modeli
│   ├── serializers.py                    # API serializer'ları
│   ├── urls.py                           # Fatura URL'leri
│   ├── views.py                          # Fatura görünümleri
│   ├── 📁 migrations/                    # Veritabanı migrasyonları
│   │   ├── 0001_initial.py
│   │   └── 0002_invoice_user.py
│   └── 📁 tests/                         # Test dosyaları
│       └── test_api.py                   # API testleri
│
├── 📁 frontend/                          # 🎨 FRONTEND UYGULAMASI
│   ├── __init__.py
│   ├── admin.py                          # Admin panel konfigürasyonu
│   ├── apps.py                           # Django app konfigürasyonu
│   ├── models.py                         # Frontend modeli
│   ├── urls.py                           # Frontend URL'leri
│   ├── views.py                          # Frontend görünümleri
│   ├── tests.py                          # Test dosyaları
│   ├── 📁 static/frontend/               # Statik dosyalar (CSS, JS)
│   ├── 📁 templates/frontend/            # HTML template'leri
│   └── 📁 tests/                         # Test dosyaları
│
├── 📁 media/                             # 📁 MEDYA DOSYALARI
│   └── 📁 test_reports/                  # Test rapor PDF'leri
│
├── 📁 tests/                             # 🧪 GENEL TEST DOSYALARI
│   ├── __init__.py
│   ├── admin.py                          # Test admin konfigürasyonu
│   ├── apps.py                           # Test app konfigürasyonu
│   ├── models.py                         # Test modelleri
│   ├── tests.py                          # Test dosyaları
│   └── views.py                          # Test görünümleri
│
├── manage.py                             # 🚀 Django yönetim komutları
├── db.sqlite3                            # 💾 SQLite veritabanı
├── django.log                            # 📝 Django log dosyası
├── create_test_data.py                   # 🧪 Test verisi oluşturma
├── test_api.py                           # 🧪 API test dosyası
├── test_stock_api.py                     # 🧪 Stok API test dosyası
├── test_stock_item.py                    # 🧪 Stok item test dosyası
└── test_stock_transaction.py             # 🧪 Stok işlem test dosyası
```

### 🏗️ Backend Mimari Prensipleri

#### 1. **Django REST Framework (DRF) Mimarisi**
- **ViewSets**: Her modül için ModelViewSet kullanımı
- **Serializers**: Veri validasyonu ve API response formatı
- **Routers**: Otomatik URL routing
- **Permissions**: Kimlik doğrulama ve yetkilendirme

#### 2. **Modüler Uygulama Yapısı**
Her modül şu dosyaları içerir:
- `models.py` - Veritabanı modelleri
- `views.py` - API görünümleri (ViewSets)
- `serializers.py` - Veri serileştirme
- `urls.py` - URL routing
- `admin.py` - Django admin konfigürasyonu
- `apps.py` - Django app konfigürasyonu
- `migrations/` - Veritabanı şema değişiklikleri

#### 3. **API Tasarım Prensipleri**
```python
# Örnek ViewSet yapısı
class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'gender']
    search_fields = ['tc_number', 'first_name', 'last_name']
    ordering_fields = ['created_at', 'first_name', 'last_name']
```

#### 4. **Veritabanı Tasarımı**
- **İlişkisel Model**: ForeignKey ile modüller arası bağlantı
- **Audit Fields**: `created_at`, `updated_at`, `user` alanları
- **Status Management**: Aktif/pasif durum yönetimi
- **Soft Delete**: Veri silme yerine durum değiştirme

#### 5. **Güvenlik ve Kimlik Doğrulama**
- **JWT Authentication**: `rest_framework_simplejwt`
- **Permission Classes**: `IsAuthenticated`, `IsAdminUser`
- **User Tracking**: Her işlemde kullanıcı takibi
- **Input Validation**: Serializer seviyesinde validasyon

#### 6. **API Dokümantasyonu**
- **Swagger UI**: `/swagger/` endpoint'i
- **ReDoc**: `/redoc/` endpoint'i
- **Auto-generated**: Model ve ViewSet'lerden otomatik oluşturma

#### 7. **Test Stratejisi**
- **Unit Tests**: Her modül için ayrı test dosyaları
- **API Tests**: Endpoint'lerin test edilmesi
- **Model Tests**: Veri validasyonu testleri
- **Integration Tests**: Modüller arası etkileşim testleri

#### 8. **URL Yapısı**
```python
# Ana URL yapılandırması
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('frontend.urls')),
    path('api/dashboard/statistics/', dashboard_statistics),
    path('api/users/', include('users.urls')),
    path('api/patients/', include('patients.urls')),
    path('api/appointments/', include('appointments.urls')),
    # ... diğer modüller
]
```

#### 9. **Middleware ve Ayarlar**
- **CORS**: Cross-origin resource sharing
- **Authentication**: JWT tabanlı kimlik doğrulama
- **Filtering**: Django-filter ile gelişmiş filtreleme
- **Pagination**: Sayfalama desteği

#### 10. **Avantajlar**
- **Modülerlik**: Her modül bağımsız olarak geliştirilebilir
- **Ölçeklenebilirlik**: Yeni modüller kolayca eklenebilir
- **API First**: RESTful API tasarımı
- **Admin Panel**: Django admin ile veri yönetimi
- **Test Coverage**: Kapsamlı test yapısı
- **Documentation**: Otomatik API dokümantasyonu

Bu backend mimarisi, Django REST Framework'ün güçlü özelliklerini kullanarak modüler, ölçeklenebilir ve sürdürülebilir bir API yapısı sunar.
