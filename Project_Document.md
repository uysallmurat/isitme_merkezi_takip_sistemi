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
