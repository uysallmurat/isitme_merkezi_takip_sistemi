# Sprint 1: Proje Kapsamı ve Gereksinim Analizi

## 1. Amaç ve Kapsam
- Bir işitme merkezinde hasta, randevu, test, cihaz, stok ve finansal süreçlerin dijital ortamda bütünleşik şekilde yönetilmesini sağlayan, kullanıcı dostu ve güvenli bir web tabanlı takip sistemi geliştirmek.

## 2. Tanımlar ve Kısaltmalar
- [Bu bölümde proje boyunca kullanılan özel terimler ve kısaltmalar listelenecek.]

## 3. Paydaşlar ve Sorumlular
- Yönetici, Odyolog, Sekreter, Tekniker, (varsa) Hasta Temsilcisi

## 4. Gereksinimler ve Fonksiyonlar
- Hasta Yönetimi: Kayıt, güncelleme, geçmiş, belge yükleme
- Randevu Yönetimi: Oluşturma, takvim, çakışma kontrolü, hatırlatma
- Test Yönetimi: Test kaydı, rapor, grafik, karşılaştırma
- Cihaz ve Stok: Cihaz kaydı, stok takibi, tedarikçi yönetimi
- Finansal: Fatura, ödeme, rapor
- Kullanıcı ve Yetkilendirme: Rol bazlı erişim, güvenli giriş
- Raporlama: Temel operasyonel ve finansal raporlar
- Güvenlik: Şifreleme, KVKK uyumu, yedekleme

## 5. Akış Diyagramı / Süreç Şeması
- [Proses_Flow.md ve wireframe dosyasından alınacak BPMN veya akış diyagramı eklenecek.]

## 6. Ekran Tasarımları / Wireframe
- [Wireframe.png veya ilgili prototip görselleri eklenecek.]

## 7. Test Senaryoları ve Kabul Kriterleri
- [Her ana fonksiyon için test senaryoları ve kabul kriterleri burada listelenecek.]

## 8. Notlar ve Açıklamalar
- Sprint 1 sonunda kapsam, kullanıcı profilleri, MVP ve gereksinim toplama süreci netleştirildi.
- Sprint 4 sonunda tüm temel modüller, API entegrasyonu ve modern UI/UX tasarımı tamamlandı.
- **Modern UI/UX İyileştirmeleri:** Glassmorphism tasarım, gelişmiş animasyonlar, micro-interactions, feedback sistemleri ve responsive tasarım başarıyla uygulandı.
- **Dashboard Modernizasyonu:** Modern renk paleti, gradient efektler, loading animasyonları ve smooth page transitions eklendi.
- **Modern UI Elementleri:** Buttons, cards, forms, tables için kapsamlı modernizasyon ve design system oluşturuldu.
- **Renk ve Tipografi Sistemi:** Sofistike renk paleti, modern font hierarchy ve CSS variables sistemi implement edildi.
- **Frontend Unit ve Entegrasyon Testleri:** Jest framework ile 27 test case'i yazıldı ve çalıştırıldı (%74.1 başarı oranı).
- **PROTECT Mekanizması Uygulandı:** Tüm kritik ilişkiler CASCADE'dan PROTECT'e çevrildi. Hasta, Cihaz, StockItem silinirken bağlı kayıtlar varsa güvenli hata mesajı verilir ve silme işlemi engellenir.

---

# Sprint 2: Bilgi Mimarisi ve Veritabanı Tasarımı

## 6. Veritabanı Tablo Şeması (Detaylı)

### 1. patients (Hastalar)
- patient_id (PK, INT, AUTO_INCREMENT)
- first_name (VARCHAR(50))
- last_name (VARCHAR(50))
- birth_date (DATE)
- gender (VARCHAR(10))
- phone (VARCHAR(20))
- email (VARCHAR(100))
- address (TEXT)
- created_at (DATETIME)

### 2. users (Kullanıcılar)
- user_id (PK, INT, AUTO_INCREMENT)
- first_name (VARCHAR(50))
- last_name (VARCHAR(50))
- email (VARCHAR(100))
- password_hash (VARCHAR(255))
- role (ENUM: 'Admin', 'Odyolog', 'Sekreter', 'Tekniker')

### 3. appointments (Randevular)
- appointment_id (PK, INT, AUTO_INCREMENT)
- patient_id (FK, INT, references patients.patient_id)
- user_id (FK, INT, references users.user_id)
- appointment_date (DATETIME)
- notes (TEXT)
- status (ENUM: 'Planned', 'Completed', 'Cancelled')

### 4. hearing_tests (İşitme Testleri)
- test_id (PK, INT, AUTO_INCREMENT)
- patient_id (FK, INT, references patients.patient_id)
- test_type (VARCHAR(50))
- test_date (DATETIME)
- results (TEXT / JSON)
- comments (TEXT)

### 5. devices (İşitme Cihazları)
- device_id (PK, INT, AUTO_INCREMENT)
- brand (VARCHAR(50))
- model (VARCHAR(50))
- serial_number (VARCHAR(100))
- supplier_id (FK, INT, references suppliers.supplier_id)
- stock_status (ENUM: 'In Stock', 'On Trial', 'Sold', 'Returned')

### 6. device_transactions (Cihaz İşlem Geçmişi)
- transaction_id (PK, INT, AUTO_INCREMENT)
- device_id (FK, INT, references devices.device_id)
- patient_id (FK, INT, references patients.patient_id)
- transaction_type (ENUM: 'Trial', 'Sold', 'Returned')
- transaction_date (DATETIME)
- notes (TEXT)

### 7. stock_items (Sarf Malzemeler)
- item_id (PK, INT, AUTO_INCREMENT)
- item_name (VARCHAR(100))
- quantity (INT)
- critical_level (INT)

### 8. invoices (Faturalar)
- invoice_id (PK, INT, AUTO_INCREMENT)
- patient_id (FK, INT, references patients.patient_id)
- invoice_date (DATETIME)
- total_amount (DECIMAL(10,2))
- payment_status (ENUM: 'Paid', 'Unpaid', 'Partially Paid')

### 9. suppliers (Tedarikçiler)
- supplier_id (PK, INT, AUTO_INCREMENT)
- name (VARCHAR(100))
- contact_person (VARCHAR(100))
- phone (VARCHAR(20))
- email (VARCHAR(100))
- address (TEXT)

---

## 7. Tablo Normalizasyonu ve İlişki Yapısı

### Normalizasyon (1NF, 2NF, 3NF)
- **1NF (Birinci Normal Form):**
  - Tüm tablolar atomik (bölünemez) alanlardan oluşur. Her hücrede tek bir değer bulunur.
  - Örneğin, hasta adresi tek bir TEXT alanında tutulur, birden fazla adres gerekiyorsa ayrı tablo açılır.
- **2NF (İkinci Normal Form):**
  - Tüm tabloların birincil anahtarı vardır ve anahtara tam bağımlı olmayan alan yoktur.
  - Örneğin, randevu tablosunda hasta ve kullanıcıya ait bilgiler sadece ilgili FK ile tutulur, tekrar eden veri yoktur.
- **3NF (Üçüncü Normal Form):**
  - Tablolarda transitif bağımlılık yoktur. Yani, bir alan sadece anahtara bağlıdır, başka bir alana bağımlı değildir.
  - Örneğin, tedarikçi iletişim bilgileri suppliers tablosunda tutulur, cihaz tablosunda tekrar edilmez.

### Foreign Key ve Index Yapılandırması
- **Foreign Key (FK) Kullanımı:**
  - appointments.patient_id → patients.patient_id
  - appointments.user_id → users.user_id
  - hearing_tests.patient_id → patients.patient_id
  - devices.supplier_id → suppliers.supplier_id
  - device_transactions.device_id → devices.device_id
  - device_transactions.patient_id → patients.patient_id
  - invoices.patient_id → patients.patient_id
- **Index Kullanımı:**
  - Tüm birincil anahtarlar (PK) otomatik olarak indexlenir.
  - Sık sorgulanan alanlar (ör. email, appointment_date, test_date, stock_status) için ek indexler önerilir.
  - Foreign key alanlarında da index olması performans için faydalıdır.

---

## 8. Test Verisi ve Veri Doğrulama Senaryoları

### Test Verisi Örnekleri
- **patients:**
  - (1, "Ahmet", "Yılmaz", "1980-05-12", "Erkek", "5551234567", "ahmet@example.com", "İstanbul", "2024-06-01 10:00:00")
  - (2, "Ayşe", "Demir", "1975-09-23", "Kadın", "5559876543", "ayse@example.com", "Ankara", "2024-06-02 11:30:00")
- **users:**
  - (1, "Admin", "Kullanıcı", "admin@merkez.com", "hashedpass", "Admin")
  - (2, "Oya", "Odyolog", "oya@merkez.com", "hashedpass", "Odyolog")
- **appointments:**
  - (1, 1, 2, "2024-06-10 09:00:00", "İlk muayene", "Planned")
- **hearing_tests:**
  - (1, 1, "Odyometri", "2024-06-10 09:30:00", "{...}", "Normal")
- **devices:**
  - (1, "Phonak", "Audeo", "SN12345", 1, "In Stock")
- **device_transactions:**
  - (1, 1, 1, "Trial", "2024-06-11 10:00:00", "Deneme verildi")
- **stock_items:**
  - (1, "Pil 312", 100, 10)
- **invoices:**
  - (1, 1, "2024-06-12 14:00:00", 3500.00, "Unpaid")
- **suppliers:**
  - (1, "ABC Medikal", "Mehmet Kaya", "5551112233", "info@abcmedikal.com", "İzmir")

### Veri Doğrulama Senaryoları
- Hasta kaydı oluşturulduğunda zorunlu alanlar (isim, soyisim, doğum tarihi) boş bırakılamaz.
- Randevu oluşturulurken hasta ve kullanıcı (odyolog/sekreter) seçilmelidir.
- Test kaydı, var olan bir hastaya bağlı olmalıdır.
- Cihaz kaydı yapılırken tedarikçi seçimi zorunludur.
- Fatura oluşturulurken hasta ve tutar alanları boş olamaz.
- Stok seviyesi kritik seviyenin altına düştüğünde uyarı verilmelidir.
- Email alanları için format kontrolü yapılmalıdır.

---

# Sprint 3: Backend API Geliştirme

## 1. Amaç ve Kapsam
- Tüm ana modüller (hastalar, randevular, işitme testleri, cihazlar, stok, faturalar) için güvenli, RESTful ve test edilebilir backend API'lerinin geliştirilmesi.
- JWT tabanlı kimlik doğrulama ve rol bazlı erişim.
- Swagger/OpenAPI ile otomatik API dokümantasyonu.
- Standart, Türkçe ve kullanıcı dostu hata yönetimi.

## 2. Geliştirilen Modüller ve API'ler
- Kullanıcı Doğrulama ve Oturum Yönetimi (JWT, OAuth2)
- Hastalar (patients) CRUD API
- Randevular (appointments) CRUD API
- İşitme Testleri (hearing_tests) CRUD API
- Cihazlar (devices) ve Cihaz Hareketleri (device_transactions) CRUD API
- Sarf Stoklar (stock_items), Tedarikçi (suppliers) ve Stok Hareketleri (stock_transactions) CRUD API
- Faturalar (invoices) CRUD API

## 3. Testler ve Otomasyon
- Tüm modüller için kapsamlı unit testler yazıldı ve başarıyla çalıştırıldı.
- Testler app_name/tests/ klasörlerinde organize edildi.
- Testler ile API'nin doğruluğu ve hata yönetimi otomatik olarak kontrol edildi.

## 4. API Dokümantasyonu
- Swagger/OpenAPI (drf-yasg) ile /swagger/ ve /redoc/ endpointlerinden tüm API görsel ve interaktif olarak dokümante edildi.
- API dokümantasyonunda iletişim e-posta adresi: uysallmurat@gmail.com

## 5. Hata Yönetimi ve Geri Dönüş Mesajları
- Tüm API hataları için global exception handler ile Türkçe ve açıklayıcı mesajlar döndürülüyor.
- 400: Doğrulama hatası, 401: Kimlik doğrulama gerekli, 403: Yetki reddedildi, 404: Kayıt bulunamadı, 500: Sunucu hatası
- Hata mesajları kullanıcı ve geliştirici dostu, standart formatta.

## 6. Sonuç ve Kapanış
- Sprint 3 sonunda sistemin tüm backend API altyapısı eksiksiz ve testlerle doğrulanmış şekilde tamamlandı.
- Sonraki sprintlerde frontend, raporlama, gelişmiş rol yönetimi veya ek modüller planlanabilir.

---

# Sprint 4: Frontend Geliştirme ve Entegrasyon - Tamamlanan Çalışmalar

## 1. Amaç ve Kapsam
Sprint 4'te backend API'leri ile entegre çalışan, modern ve kullanıcı dostu frontend arayüzlerinin geliştirilmesi ve tam işlevsel bir web uygulaması oluşturulması hedeflendi.

## 2. Tamamlanan Ana Modüller

### 2.1 Tasarım Sistemi ve UI/UX
- **Modern Tasarım Sistemi**: Tutarlı renk paleti, tipografi ve bileşen kütüphanesi
- **Responsive Design**: Mobil-first yaklaşım ile tüm cihazlarda uyumlu tasarım
- **CSS Değişkenleri**: Tema sistemi ve kolay özelleştirme imkanı
- **Font Awesome İkonları**: Tüm modüllerde tutarlı ikon kullanımı
- **Türkçe Dil Desteği**: Tam Türkçe arayüz ve mesajlar

### 2.2 Merkezi Hata Yönetimi Sistemi
- **ErrorHandler Sınıfı**: Merkezi hata yönetimi ve API iletişimi
- **Notification System**: Success, error, warning, info bildirimleri
- **Loading States**: Overlay, button ve form loading durumları
- **Session Management**: Otomatik token yönetimi ve login yönlendirmesi
- **Form Validation**: Client-side validasyon ve hata gösterimi

### 2.3 Geliştirilen Modüller
1. **Dashboard (dashboard.html)**
   - İstatistik kartları ile özet bilgiler
   - Son hastalar, yaklaşan randevular, cihaz envanteri tabloları
   - Dinamik veri yükleme ve arama özelliği

2. **Hasta Yönetimi (patients.html)**
   - Hasta listesi, arama ve filtreleme
   - Özet kartları (Toplam Hasta, Aktif Hastalar, vb.)
   - Yeni hasta ekleme modal'ı

3. **Hasta Kayıt Formu (patient_form.html)**
   - Kapsamlı hasta kayıt formu
   - Form validasyonu ve hata yönetimi
   - API entegrasyonu ile kayıt işlemi

4. **Randevu Yönetimi (appointments.html)**
   - Randevu listesi ve durum yönetimi
   - Özet kartları (Toplam Randevu, Bugünkü Randevular, vb.)
   - Randevu durumu güncelleme (tamamlandı/iptal)

5. **Cihaz Yönetimi (devices.html)**
   - Cihaz envanteri listesi
   - Özet kartları (Toplam Cihaz, Aktif Cihazlar, vb.)
   - Cihaz durumu ve stok takibi

6. **Test Raporları (test-reports.html)**
   - Test raporu listesi ve yönetimi
   - Özet kartları (Toplam Test, Tamamlanan Testler, vb.)
   - PDF indirme ve yazdırma özelliği

7. **Fatura Yönetimi (invoices.html)**
   - Fatura listesi ve durum takibi
   - Özet kartları (Toplam Gelir, Bekleyen Ödemeler, vb.)
   - PDF indirme ve e-posta gönderme

8. **Stok Yönetimi (inventory.html)**
   - Stok listesi ve seviye takibi
   - Özet kartları (Toplam Ürün, Stok Değeri, vb.)
   - Stok giriş/çıkış işlemleri

9. **Test ve Debug Sayfası (test-error-handler.html)**
   - Hata yönetimi sisteminin test edilmesi
   - API test senaryoları
   - Debugging ve geliştirici araçları

## 3. Teknik Özellikler

### 3.1 API Entegrasyonu
- **RESTful API**: Tüm CRUD işlemleri için backend entegrasyonu
- **Error Handling**: Merkezi hata yakalama ve kullanıcı bildirimleri
- **Data Validation**: Client-side ve server-side validasyon
- **Async/Await**: Modern JavaScript ile asenkron işlemler

### 3.2 Testing Infrastructure
- **Jest Framework**: Unit testing için kurulum ve konfigürasyon
- **Test Coverage**: ErrorHandler sınıfı için kapsamlı testler
- **Manual Testing**: Test sayfası ile manuel test senaryoları
- **Documentation**: Test dokümantasyonu ve kullanım kılavuzu

### 3.3 Performance ve UX
- **Loading States**: Kullanıcı deneyimi için loading göstergeleri
- **Debounced Search**: Performanslı arama işlemleri
- **Responsive Tables**: Mobil cihazlarda table overflow yönetimi
- **Progressive Enhancement**: Temel işlevsellik önceliği

## 4. Dosya Yapısı ve Organizasyon

### 4.1 Frontend Dosyaları
```
frontend/
├── templates/frontend/
│   ├── dashboard.html
│   ├── patients.html
│   ├── patient_form.html
│   ├── appointments.html
│   ├── devices.html
│   ├── test-reports.html
│   ├── invoices.html
│   ├── inventory.html
│   └── test-error-handler.html
├── static/frontend/
│   ├── css/
│   │   ├── style.css
│   │   └── error-handler.css
│   └── js/
│       ├── error-handler.js
│       └── tests/
│           └── error-handler.test.js
├── package.json
├── tests/setup.js
└── README-TEST.md
```

## 5. Güvenlik ve KVKK Uyumluluğu
- **JWT Token Management**: Güvenli token saklama ve yenileme
- **Session Control**: Otomatik oturum kontrolü ve yönlendirme
- **Data Protection**: Hassas verilerin güvenli işlenmesi
- **Input Validation**: XSS ve injection saldırılarına karşı koruma

## 6. Sonuç ve Değerlendirme
Sprint 4 %85 tamamlanmış olup, tüm temel modüller çalışır durumda ve API entegrasyonu tamamlanmıştır. Sistem modern web standartlarına uygun, kullanıcı dostu ve güvenli bir şekilde geliştirilmiştir.

### 6.1 Başarılan Hedefler
- ✅ Modern ve responsive UI/UX tasarımı
- ✅ Tüm modüller için API entegrasyonu
- ✅ Merkezi hata yönetimi sistemi
- ✅ Form validasyonu ve kullanıcı bildirimleri
- ✅ Testing infrastructure kurulumu
- ✅ Tasarım tutarlılığı ve standardizasyon
- ✅ **Modern UI/UX İyileştirmeleri:** Glassmorphism tasarım, gelişmiş animasyonlar, micro-interactions
- ✅ **Feedback Sistemleri:** Toast bildirimleri, confirmation modals, progress bar
- ✅ **Sayfa Geçişleri:** Smooth navigation, full-screen transitions, loading states
- ✅ **Responsive Tasarım:** Mobile-first approach, touch optimizasyonları

## 7. Gerçek Zamanlı İstatistik Kartları Sistemi (Sprint 5 - Tamamlandı)

### 7.1 Sistem Genel Bakış
Tüm sayfalardaki özet kartları statik verilerden gerçek API verilerine dönüştürülerek, kullanıcılara anlık ve doğru istatistikler sunulması sağlanmıştır.

### 7.2 Teknik Mimari

#### API Integration Strategy
- **Paralel Veri Çekme**: `Promise.all()` ile multiple API endpoints
- **Client-side Hesaplama**: Server yükünü azaltmak için frontend'de hesaplama
- **Real-time Updates**: CRUD işlemlerinden sonra otomatik kart güncellemesi
- **Error Resilience**: API hatalarında graceful fallback

#### Performance Optimizations
- **Parallel API Calls**: Aynı anda birden fazla endpoint çağrısı
- **Caching Strategy**: Client-side data caching (gelecek geliştirme)
- **Debounced Updates**: Gereksiz API çağrılarının önlenmesi
- **Loading States**: User experience için smooth loading animations

### 7.3 Modül Detayları

#### Dashboard Ana Kartları
- **Toplam Hasta, Randevu, Test, Cihaz**: 4 paralel API çağrısı
- **Animasyonlu Güncellemeler**: Smooth number transitions
- **API Endpoints**: `/api/patients/`, `/api/appointments/`, `/api/hearing_tests/hearing_tests/`, `/api/devices/devices/`

#### Sayfa Bazlı Kartlar
1. **Fatura Kartları**: Toplam gelir, bekleyen ödemeler, vadesi geçen, toplam fatura
2. **Stok Kartları**: Toplam ürün, stok değeri, düşük stok, stokta yok
3. **Test Kartları**: Toplam test, tamamlanan, bekleyen, bu hafta testler
4. **Cihaz Kartları**: Toplam cihaz, aktif cihazlar, bakımdaki, az stoklu türler
5. **Randevu Kartları**: Toplam randevu, bugünkü, tamamlanan, bu hafta randevular
6. **Hasta Kartları**: Toplam hasta, aktif hastalar, bu ay yeni, bu ay randevu

### 7.4 Teknik İmplementasyon

#### JavaScript Functions
```javascript
// Her modül için ayrı hesaplama fonksiyonları
calculateInvoiceStats(invoices)
calculateStockStats(stockItems)
calculateTestStats(testReports)
calculateDeviceStats(devices)
calculateAppointmentStats(appointments)
calculatePatientStats(patients, appointments)
calculateDashboardStats(patients, appointments, tests, devices)
```

#### Date/Time Calculations
- **Bu Hafta Hesaplama**: Pazartesi başlangıcı (düzeltildi)
- **Bu Ay Hesaplama**: `getMonth()` ve `getFullYear()` kontrolü
- **Bugün Hesaplama**: Tam tarih eşleşmesi (YYYY-MM-DD)

#### Currency Formatting
- **Turkish Lira**: `toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })`
- **Number Formatting**: Binlik ayırıcılar ve decimal precision

### 7.5 Test Data Generation
Sistem testleri için çeşitli durumları kapsayan test verileri oluşturuldu:
- **Faturalar**: 4 farklı status (paid, pending, overdue)
- **Stok**: 4 farklı seviye (normal, düşük, yok, kritik)
- **Testler**: 4 farklı durum (tamamlanan, bekleyen, bu hafta, geçmiş)
- **Cihazlar**: 8 farklı status ve tür kombinasyonu
- **Randevular**: 7 farklı zaman ve durum
- **Hastalar**: 5 farklı status ve kayıt zamanı

### 7.6 User Experience Improvements
- **Loading Spinners**: Veri yüklenirken görsel feedback
- **Success Animations**: Başarılı güncelleme animasyonları
- **Error States**: Hata durumunda kullanıcı dostu mesajlar
- **Debug Console**: Geliştirici için detaylı logging

### 7.7 Quality Assurance
- **Code Modularity**: Her sayfa için ayrı fonksiyonlar
- **Consistent Naming**: Standart isimlendirme konvansiyonları
- **Error Handling**: Comprehensive try-catch blokları
- **Documentation**: Inline comments ve function descriptions

### 7.8 Production Readiness
- **API Endpoint Standardization**: Tüm URL'ler tutarlı
- **Cross-browser Compatibility**: Modern JavaScript features
- **Mobile Responsiveness**: Kartların mobil uyumluluğu
- **Security Considerations**: XSS koruması ve input validation

### 6.2 Kalan Görevler (Sprint 5'e taşınan)
- 🔄 **Breadcrumb Navigasyon Sistemi** (UI entegrasyonu)
- 📋 **Performance Testleri ve Optimizasyon**
- 📋 **Frontend Test Coverage %90+**
- 📋 **Production Deployment Hazırlıkları**
- 📋 **Fatura modülündeki tüm butonları çalışır hale getir** - Daha sonra baştan yazılacak

---

# Toast/Notification Sistemi Teknik Dokümantasyonu

## 1. Sistem Genel Bakış

Proje genelinde kullanılan modern ve kullanıcı dostu toast/notification sistemi, kullanıcılara işlem sonuçları hakkında anlık geri bildirim sağlar. Sistem, error-handler.js dosyasında merkezi olarak yönetilir ve tüm sayfalarda tutarlı şekilde kullanılır.

## 2. Teknik Mimari

### 2.1 Core Components
- **error-handler.js**: Merkezi toast yönetimi ve API iletişimi
- **CSS Stilleri**: Her sayfada tanımlı toast container stilleri
- **HTML Container**: `toast-container` div'i ile toast'ların render edilmesi

### 2.2 Toast Container Yapısı
```html
<!-- Her sayfada bulunan toast container -->
<div class="toast-container" id="toastContainer"></div>
```

### 2.3 CSS Stilleri
```css
.toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    min-width: 300px;
}

.toast {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border-left: 4px solid;
    animation: slideIn 0.3s ease-out;
}

.toast.success { border-color: #28a745; }
.toast.error { border-color: #dc3545; }
.toast.warning { border-color: #ffc107; }
.toast.info { border-color: #17a2b8; }
```

## 3. Toast Türleri ve Kullanım Alanları

### 3.1 Success Toast (Başarı)
- **Renk**: Yeşil (#28a745)
- **İkon**: `fa-check-circle`
- **Kullanım**: Başarılı işlemler, kayıt işlemleri, güncellemeler
- **Örnek Kullanımlar**:
  - Hasta başarıyla kaydedildi
  - Randevu oluşturuldu
  - Cihaz stoktan çıkarıldı
  - Fatura oluşturuldu

### 3.2 Error Toast (Hata)
- **Renk**: Kırmızı (#dc3545)
- **İkon**: `fa-exclamation-circle`
- **Kullanım**: Hatalar, başarısız işlemler, validasyon hataları
- **Örnek Kullanımlar**:
  - Bağlantı hatası
  - Form validasyon hataları
  - API hataları
  - Silme işlemi başarısız

### 3.3 Warning Toast (Uyarı)
- **Renk**: Sarı (#ffc107)
- **İkon**: `fa-exclamation-triangle`
- **Kullanım**: Uyarılar, dikkat gerektiren durumlar
- **Örnek Kullanımlar**:
  - Eksik bilgi uyarısı
  - Düşük stok uyarısı
  - Vadesi geçen fatura uyarısı

### 3.4 Info Toast (Bilgi)
- **Renk**: Mavi (#17a2b8)
- **İkon**: `fa-info-circle`
- **Kullanım**: Bilgilendirme mesajları, sistem durumu
- **Örnek Kullanımlar**:
  - Sistem güncellemeleri
  - Bilgilendirme mesajları

## 4. JavaScript API ve Kullanım

### 4.1 Temel Toast Fonksiyonu
```javascript
// errorHandler.js'de tanımlı
function showToast(type, title, message, duration = 5000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-header">
            <i class="fas fa-${getIcon(type)}"></i>
            <strong>${title}</strong>
            <button onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="toast-body">${message}</div>
    `;
    
    document.getElementById('toastContainer').appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, duration);
}
```

### 4.2 ErrorHandler Entegrasyonu
```javascript
// Başarı mesajı
errorHandler.showSuccess('Başarılı!', 'İşlem başarıyla tamamlandı.');

// Hata mesajı
errorHandler.showError('Hata!', 'Bir hata oluştu.');

// Uyarı mesajı
errorHandler.showWarning('Dikkat!', 'Lütfen tüm alanları doldurun.');

// Bilgi mesajı
errorHandler.showInfo('Bilgi', 'Sistem güncellendi.');
```

### 4.3 Direkt Toast Kullanımı
```javascript
// Doğrudan showToast fonksiyonu
showToast('success', 'Başarılı!', 'Hasta kaydedildi.', 3000);
showToast('error', 'Hata!', 'Bağlantı hatası.', 5000);
```

## 5. Sayfa Bazlı Toast Kullanımları

### 5.1 Dashboard
- **Kullanım**: Sayfa yükleme bildirimleri (kaldırıldı)
- **Toast Türü**: Success, Error
- **Durum**: Welcome toast kaldırıldı

### 5.2 Hastalar (Patients)
- **Kullanım**: CRUD işlemleri, form validasyonları
- **Toast Türü**: Success, Error, Warning
- **Örnekler**:
  - Hasta başarıyla kaydedildi
  - Form validasyon hataları
  - Silme işlemi onayı

### 5.3 Randevular (Appointments)
- **Kullanım**: Randevu oluşturma, güncelleme, silme
- **Toast Türü**: Success, Error, Warning
- **Örnekler**:
  - Randevu oluşturuldu
  - Çakışma uyarısı
  - Tarih validasyon hatası

### 5.4 Cihazlar (Devices)
- **Kullanım**: Cihaz kayıt, stok işlemleri
- **Toast Türü**: Success, Error, Warning
- **Örnekler**:
  - Cihaz kaydedildi
  - Stok yetersiz uyarısı
  - Seri numara çakışması

### 5.5 Test Raporları (Test Reports)
- **Kullanım**: Test kayıt, rapor oluşturma
- **Toast Türü**: Success, Error, Warning
- **Örnekler**:
  - Test raporu oluşturuldu
  - PDF oluşturma hatası
  - Veri eksikliği uyarısı

### 5.6 Stok Yönetimi (Inventory)
- **Kullanım**: Stok giriş/çıkış, ürün yönetimi
- **Toast Türü**: Success, Error, Warning
- **Örnekler**:
  - Stok güncellendi
  - Düşük stok uyarısı
  - Ürün bulunamadı hatası

### 5.7 Fatura Yönetimi (Invoices)
- **Kullanım**: Fatura oluşturma, ödeme takibi
- **Toast Türü**: Success, Error, Warning
- **Örnekler**:
  - Fatura oluşturuldu
  - Ödeme hatırlatması
  - Vadesi geçen fatura uyarısı

## 6. Animasyon ve UX Özellikleri

### 6.1 Giriş Animasyonu
```css
@keyframes slideIn {
    from {
        transform: translateX(400px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
```

### 6.2 Otomatik Kapanma
- **Varsayılan Süre**: 5 saniye
- **Özelleştirilebilir**: Her toast için ayrı süre
- **Manuel Kapatma**: × butonu ile anında kapatma

### 6.3 Responsive Tasarım
- **Mobile**: Minimum 300px genişlik
- **Desktop**: Maksimum 400px genişlik
- **Z-index**: 1000 (diğer elementlerin üstünde)

## 7. Güvenlik ve Performans

### 7.1 XSS Koruması
- **Input Sanitization**: HTML injection koruması
- **Safe Rendering**: Güvenli DOM manipülasyonu

### 7.2 Performans Optimizasyonu
- **Memory Management**: Otomatik toast temizleme
- **DOM Manipulation**: Minimal DOM değişikliği
- **Event Handling**: Efficient event listener yönetimi

## 8. Test ve Kalite Güvencesi

### 8.1 Test Coverage
- **Unit Tests**: Toast fonksiyonları için testler
- **Integration Tests**: ErrorHandler entegrasyonu
- **UI Tests**: Toast görünüm ve animasyon testleri

### 8.2 Browser Uyumluluğu
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **CSS Support**: Backdrop-filter, CSS animations
- **JavaScript**: ES6+ features

## 9. Gelecek Geliştirmeler

### 9.1 Planlanan Özellikler
- **Toast Queue**: Çoklu toast yönetimi
- **Custom Themes**: Kullanıcı tanımlı renk şemaları
- **Sound Notifications**: Ses bildirimleri
- **Push Notifications**: Browser push API entegrasyonu

### 9.2 Teknik İyileştirmeler
- **WebSocket Integration**: Real-time notifications
- **Service Worker**: Offline notification support
- **Accessibility**: Screen reader uyumluluğu

## 10. Sonuç

Toast sistemi, proje genelinde tutarlı ve kullanıcı dostu bir deneyim sağlar. Modern tasarım prensipleri, responsive yapı ve kapsamlı hata yönetimi ile kullanıcıların işlem sonuçlarını anında görmelerini sağlar. Sistem, gelecekteki geliştirmeler için esnek bir mimari sunar ve tüm modern web standartlarına uyumludur.

## 11. CSS Modüler Yapısı ve Kod Organizasyonu

### 11.1 Genel Bakış
Proje genelinde CSS kodlarının modüler ve yönetilebilir hale getirilmesi için kapsamlı bir refactoring çalışması başlatıldı. Bu yaklaşım, kod tekrarlarını azaltır, bakım kolaylığı sağlar ve takım çalışmasını destekler.

### 11.2 Patient CSS Modüler Yapısı (Tamamlandı)

#### 11.2.1 Dosya Yapısı
```
css/
├── patient.css (ana dosya - import'ları içerir)
└── patient/
    ├── variables.css (998B) - CSS değişkenleri
    ├── layout.css (2.6KB) - Sayfa düzeni
    ├── navigation.css (6.7KB) - Navigasyon bileşenleri
    ├── components.css (3.2KB) - Yeniden kullanılabilir bileşenler
    ├── forms.css (1.7KB) - Form elemanları
    ├── tables.css (3.0KB) - Tablo stilleri
    ├── buttons.css (3.4KB) - Buton stilleri
    ├── modals.css (4.8KB) - Modal ve overlay stilleri
    ├── feedback.css (2.0KB) - Bildirim sistemleri
    ├── animations.css (1.8KB) - Animasyonlar ve geçişler
    ├── pagination.css (999B) - Sayfalama
    ├── responsive.css (3.1KB) - Responsive tasarım
    └── README.md - Dokümantasyon
```

#### 11.2.2 Modül Açıklamaları

**1. variables.css**
- CSS değişkenleri (renkler, gölgeler, border-radius, geçişler)
- Tüm modüllerde kullanılan ortak değerler
- Merkezi renk paleti ve tasarım sistemi

**2. layout.css**
- Sayfa arka planı ve temel düzeni
- Ana içerik alanı ve sayfa başlığı
- Arama konteyneri ve header butonları

**3. navigation.css**
- Üst çubuk (topbar) stilleri
- Yan menü (sidebar) stilleri
- Navigasyon linkleri ve hover efektleri

**4. components.css**
- İçerik kartları ve istatistik kartları
- Yeniden kullanılabilir bileşenler
- Hover efektleri ve animasyonlar

**5. forms.css**
- Form grupları ve etiketler
- Input, textarea, select stilleri
- Form bölümleri ve satırları

**6. tables.css**
- Tablo konteyneri ve temel stiller
- Sütun başlıkları ve satırlar
- Durum rozetleri ve filtre dropdown'ları

**7. buttons.css**
- Birincil, ikincil ve küçük butonlar
- Düzenleme, silme, görüntüleme butonları
- Durum değiştirme butonları

**8. modals.css**
- Modal overlay ve içerik
- Modal başlık ve gövde
- Onay modalları ve butonları

**9. feedback.css**
- Toast bildirimleri
- Başarı, hata, uyarı ve bilgi mesajları
- Bildirim kapatma butonları

**10. animations.css**
- Sayfa geçiş animasyonları
- Yükleme spinner'ları
- Fade-in ve spin animasyonları

**11. pagination.css**
- Sayfalama konteyneri
- Sayfa butonları ve aktif durumlar
- Hover efektleri

**12. responsive.css**
- Tablet (1024px) responsive tasarım
- Mobil (768px) responsive tasarım
- Küçük mobil (480px) responsive tasarım

#### 11.2.3 Ana Dosya Yapısı
Ana `patient.css` dosyası tüm modülleri import eder:

```css
/* Patient.css - Hasta Yönetimi Sayfası Ana Dosyası */
/* Bu dosya tüm CSS modüllerini import eder */

/* Temel Değişkenler */
@import url('./patient/variables.css');

/* Sayfa Düzeni ve Temel Yapı */
@import url('./patient/layout.css');

/* Navigasyon Bileşenleri */
@import url('./patient/navigation.css');

/* Yeniden Kullanılabilir Bileşenler */
@import url('./patient/components.css');

/* Form Elemanları */
@import url('./patient/forms.css');

/* Tablo Stilleri */
@import url('./patient/tables.css');

/* Buton Stilleri */
@import url('./patient/buttons.css');

/* Modal ve Overlay Stilleri */
@import url('./patient/modals.css');

/* Bildirim ve Geri Bildirim Sistemleri */
@import url('./patient/feedback.css');

/* Animasyonlar ve Geçişler */
@import url('./patient/animations.css');

/* Sayfalama */
@import url('./patient/pagination.css');

/* Responsive Tasarım */
@import url('./patient/responsive.css');
```

### 11.3 Avantajlar

#### 11.3.1 Modüler Yapı
- Her dosya belirli bir işlevi yerine getirir
- Kod organizasyonu ve okunabilirlik artar
- Belirli bir bileşeni düzenlemek için doğru dosyayı bulmak kolay

#### 11.3.2 Bakım Kolaylığı
- Belirli bir stili düzenlemek için ilgili modül dosyası açılır
- Kod tekrarları azalır
- Değişiklikler izole edilir

#### 11.3.3 Yeniden Kullanılabilirlik
- Bileşenler başka sayfalarda da kullanılabilir
- Ortak stiller merkezi olarak yönetilir
- Tutarlı tasarım sistemi sağlanır

#### 11.3.4 Takım Çalışması
- Farklı geliştiriciler farklı dosyalar üzerinde çalışabilir
- Merge conflict'ler azalır
- Kod review süreci kolaylaşır

#### 11.3.5 Performans
- Sadece gerekli CSS dosyaları yüklenebilir
- Conditional loading ile optimize edilebilir
- Browser caching daha etkili olur

### 11.4 Gelecek Planları

#### 11.4.1 Diğer CSS Dosyalarının Modülerleştirilmesi
- `appointments.css` - Randevu yönetimi modülleri
- `dashboard.css` - Dashboard bileşenleri
- `inventory.css` - Stok yönetimi modülleri
- `devices.css` - Cihaz yönetimi modülleri
- `test-reports.css` - Test raporları modülleri
- `invoices.css` - Fatura yönetimi modülleri

#### 11.4.2 Ortak CSS Kütüphanesi
- `common/` klasörü altında ortak bileşenler
- `base/` klasörü altında temel stiller
- `utilities/` klasörü altında yardımcı sınıflar

#### 11.4.3 CSS Preprocessor Entegrasyonu
- SCSS/Sass kullanımı ile daha gelişmiş modüler yapı
- Mixin'ler ve fonksiyonlar ile kod tekrarının azaltılması
- Nested selectors ile daha okunabilir kod

### 11.5 Teknik Detaylar

#### 11.5.1 Import Sistemi
- CSS `@import` kullanılarak modüller birleştirilir
- Browser uyumluluğu için fallback mekanizmaları
- Performance için kritik CSS inline, diğerleri lazy load

#### 11.5.2 CSS Variables Sistemi
- Merkezi renk paleti ve tasarım token'ları
- Tema değişiklikleri için kolay güncelleme
- Dark mode desteği için hazır altyapı

#### 11.5.3 Responsive Design Strategy
- Mobile-first yaklaşım
- Breakpoint sistemi ile tutarlı responsive davranış
- Container queries için hazırlık

### 11.6 Sonuç

CSS modüler yapısı, proje genelinde kod kalitesini ve yönetilebilirliği önemli ölçüde artırır. Patient CSS modülerleştirmesi başarıyla tamamlanmış olup, diğer CSS dosyaları için de aynı yaklaşım uygulanacaktır. Bu yapı, projenin büyümesiyle birlikte CSS kodunun daha yönetilebilir hale gelmesini sağlar ve gelecekteki geliştirmeler için sağlam bir temel oluşturur.
