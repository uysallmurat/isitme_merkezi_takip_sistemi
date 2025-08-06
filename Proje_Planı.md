**📊 İŞitme Merkezi Web Projesi: Detaylı To-Do Listesi**

> Not: Aşağıda [x] ile işaretli olanlar Sprint 1-3 kapsamında tamamlanmıştır. Kalan işler Sprint 4 ve sonrası için netleştirilmiştir.

---

**🌐 1. Proje Planlama ve Hazırlık**
- [x] Proje kapsamını tanımla (Hasta kayıt, test raporu, cihaz takibi, stok vs.)
- [x] Hedef kitle analizi (Kullanıcı profilleri: sekreter, odyolog, tekniker, hasta)
- [ ] Rekabet ve rakip sistem incelemesi
- [x] Gereksinim toplama (Yöneticilerle toplantı, mevcut işleyişin analizi)
- [x] MVP (Minimum Viable Product) sürümü tanımla
- [ ] Takım ataması ve rol dağılımı (Frontend, Backend, UI/UX, DB, Test)

---

**📆 2. Bilgi Mimarisi ve Veritabanı Tasarımı**
- [x] ER Diyagramı oluştur (Hastalar, Cihazlar, Randevular, Testler, Faturalar)
- [x] Veritabanı modeli tasarla (Relational DB: PostgreSQL/MySQL tercih)
- [x] Tabloları oluştur ve normalize et (1NF, 2NF, 3NF)
- [x] Foreign key ve index yapılarını kur
- [x] Test verisi oluştur ve veri doğrulama senaryolarını yap

---

**🔖 3. Backend Geliştirme (API Katmanı)**
- [x] API mimarisi planla (RESTful veya GraphQL)
- [x] Kullanıcı doğrulama ve oturum yönetimi (JWT, OAuth2)
- [x] CRUD API'lerini geliştir:
  - [x] Hastalar
  - [x] Randevular
  - [x] Testler
  - [x] Cihazlar ve cihaz hareketleri
  - [x] Sarf stoklar
  - [x] Faturalar
- [ ] Loglama (request-response logları)
- [x] Hata yönetimi ve geri dönüş mesajları
- [x] Unit testler (Postman / PyTest / JUnit vs.)

---

**📱 4. Frontend Geliştirme (UI/UX ve Kullanıcı Paneli)**
- [ ] Wireframe oluştur (Figma/AdobeXD/Mockflow)
- [ ] Responsive tasarım planla (mobil, tablet, masaüstü)
- [ ] Kullanıcı rolleri bazlı arayüzler:
  - [ ] Admin paneli
  - [ ] Odyolog paneli
  - [ ] Sekreter paneli
  - [ ] Hasta görüntüleme paneli (opsiyonel)
- [ ] API entegrasyonları (Axios/Fetch)
- [ ] Formlar, tablolar, grafikler (Chart.js, DataTable)
- [ ] Test ve hata bildirimi sayfaları

---

**🚀 5. DevOps & Deployment**
- [ ] Geliştirme ve test ortamlarını ayarla
- [ ] CI/CD pipeline kurulumu (GitHub Actions / GitLab CI / Jenkins)
- [ ] Sunucu kurulumları (VPS veya cloud: AWS, DigitalOcean vs.)
- [ ] Veritabanı barındırması ve yedekleme stratejisi
- [ ] Web sunucu (Nginx/Apache) + SSL kurulumu (Let's Encrypt)
- [ ] Monitoring ve log takip (Grafana + Prometheus, LogRocket)

---

**🛡️ 6. Güvenlik Önlemleri**
- [ ] KVKK uyumlu veri saklama politikaları
- [ ] HTTPS zorunluluğu ve SSL sertifikası
- [ ] Güvenli şifreleme (BCrypt/SHA256)
- [ ] Rol bazlı yetkilendirme (RBAC)
- [ ] SQL injection, XSS, CSRF korumaları
- [ ] Yedekleme ve veri kurtarma planları

---

**📊 7. Test ve Kalite Kontrol**
- [ ] Manuel test senaryoları yaz (hasta kaydı, randevu, test sonucu girme vb.)
- [x] Unit test (backend ve frontend)
- [ ] Entegrasyon testleri
- [ ] Yük testi (JMeter, Locust)
- [ ] Kullanılabilirlik testi (UX testleri)
- [ ] Son gözden geçirme (UI/UX ve fonksiyonel kontrol)

---

**🌟 8. Yayın & Kullanıma Alma**
- [ ] Son sürüm staging'e aktarılır
- [ ] Gerçek verilerle test edilir
- [ ] Kullanıcı eğitimi (kılavuz, video, uzaktan destek)
- [ ] Kullanıcı hesapları oluşturulur
- [ ] Canlı yayına alınır (DNS ayarları, SSL aktif)

---

**📅 9. Sonrası Bakım & Destek**
- [ ] Teknik destek talep sistemi kur (ticket formu)
- [ ] Sürüm güncellemeleri için yol haritası
- [ ] Yeni özellik talebi için modül
- [ ] Haftalık/aylık sistem yedeklemesi
- [ ] Veri için anonimleştirme ve silme talepleri şablonları

---

Projenin her aşaması net bir şekilde belirlendi.
Hazırlanacak dökümanlar: ER diyagramı, BPMN akışı, wireframe, API dökümanları, test senaryoları ve KVKK politikaları.

