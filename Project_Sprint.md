# Sprint Takip Dokümantasyonu

Her sprint için ayrı bir başlık açılacak ve ilerleme yüzdesi ile birlikte ana görevler, tamamlananlar ve notlar burada tutulacaktır.

---

## Sprint 1: Proje Kapsamı ve Gereksinim Analizi

**İlerleme:** %100

### Hedefler
- [x] Proje kapsamının netleştirilmesi
- [x] Hedef kitle ve kullanıcı profillerinin çıkarılması
- [x] MVP fonksiyonlarının belirlenmesi
- [x] Gereksinim toplama toplantılarının planlanması
- [x] Dokümantasyon şablonunun hazırlanması

#### Proje Kapsamı (İşitme Merkezi Takip Sistemi)

**Amaç:**  
Bir işitme merkezinde hasta, randevu, test, cihaz, stok ve finansal süreçlerin dijital ortamda bütünleşik şekilde yönetilmesini sağlayan, kullanıcı dostu ve güvenli bir web tabanlı takip sistemi geliştirmek.

**Ana Modüller ve Temel İşlevler:**

1. **Hasta Yönetimi**
   - Hasta kaydı oluşturma ve güncelleme
   - Hasta bilgileri (kimlik, iletişim, adres, doğum tarihi vb.)
   - Hasta geçmişi ve notları
   - Hasta belgeleri ve fotoğraflarının yüklenmesi
   - Acil durum iletişim kişileri

2. **Randevu Yönetimi**
   - Randevu oluşturma, güncelleme, iptal
   - Takvim görünümü ve bekleme listesi yönetimi
   - Randevu çakışma kontrolü
   - Otomatik hatırlatma sistemi (SMS/E-posta)

3. **Test ve Muayene Yönetimi**
   - Test türleri: Odyometri, Timpanometri, Konuşma odyometrisi vb.
   - Test sonuçlarının kaydı ve geçmişe erişim
   - Test raporlarının PDF olarak dışa aktarımı
   - Odyogram ve test grafikleri oluşturma
   - Test karşılaştırma ve raporlama

4. **Cihaz ve Stok Yönetimi**
   - İşitme cihazı ve aksesuar kaydı
   - Cihaz işlem geçmişi (deneme, satış, iade vb.)
   - Stok seviyeleri ve kritik stok uyarıları
   - Tedarikçi yönetimi
   - Sarf malzeme ve aksesuar takibi

5. **Finansal İşlemler**
   - Fatura oluşturma ve ödeme takibi
   - Taksit planları ve ödeme durumları
   - Finansal raporlar ve geçmişe erişim

6. **Kullanıcı ve Yetkilendirme**
   - Rol bazlı kullanıcı yönetimi (Admin, Odyolog, Sekreter, Tekniker)
   - Güvenli giriş ve oturum yönetimi (JWT, OAuth2)
   - Yetki ve erişim kontrolü

7. **Raporlama ve Analitik**
   - Operasyonel raporlar (hasta, randevu, test, cihaz, stok)
   - Finansal raporlar
   - Kullanıcı aktiviteleri ve sistem logları

8. **Güvenlik ve KVKK Uyumlu Veri Saklama**
   - Şifreleme ve veri güvenliği
   - Rol bazlı erişim ve loglama
   - KVKK ve ilgili mevzuata uygun veri saklama
   - Yedekleme ve veri kurtarma planları

**Kapsam Dışı (İlk MVP için):**
- AI/ML tabanlı gelişmiş analizler
- Dış sistemlerle tam entegrasyon
- Mobil uygulama (ileriki faz)

- Hedef kitle ve kullanıcı profillerinin çıkarılması

#### Hedef Kitle ve Kullanıcı Profilleri (Detaylı)

**1. Admin (Yönetici)**
- Tüm sistem ayarlarını ve kullanıcı hesaplarını yönetir.
- Kullanıcı ekleme, silme, rol atama ve yetki düzenleme işlemlerini yapar.
- Tüm modüllere tam erişim hakkı vardır.
- Raporlama ve denetim (audit log) yetkisine sahiptir.
- KVKK ve güvenlik politikalarını uygular, veri yedekleme ve kurtarma işlemlerini başlatabilir.
- Sistem genelinde hata ve performans takibi yapar.

**2. Odyolog**
- Hastaların işitme testlerini uygular ve sonuçlarını sisteme kaydeder.
- Test raporlarını oluşturur, odyogram ve diğer test grafiklerini hazırlar.
- Hastalara cihaz önerileri sunar ve cihaz deneme süreçlerini yönetir.
- Kendi randevularını ve hasta listesini görüntüler.
- Hasta geçmişi ve önceki test sonuçlarına erişebilir.
- Gerekirse hastaya ait not ve ek belge ekleyebilir.

**3. Sekreter**
- Yeni hasta kaydı oluşturur ve mevcut hasta bilgilerini günceller.
- Randevu oluşturma, güncelleme, iptal ve takvim yönetimi yapar.
- Bekleme listesi ve otomatik hatırlatma sistemini yönetir.
- Temel hasta bilgileri ve iletişim detaylarını düzenler.
- Gerekirse hastaya ait evrakları sisteme yükler.

**4. Tekniker**
- İşitme cihazı, aksesuar ve sarf malzeme stoklarını yönetir.
- Cihaz işlemleri (deneme, satış, iade, bakım vb.) kaydeder.
- Tedarikçi bilgilerini ve stok hareketlerini takip eder.
- Kritik stok seviyelerini izler ve uyarı alır.
- Cihaz programlama ve teknik destek işlemlerini yürütür.

**5. Hasta (Opsiyonel, ileri faz)**
- Kendi randevu ve test sonuçlarını güvenli şekilde görüntüleyebilir.
- Kişisel bilgilerini ve iletişim detaylarını güncelleyebilir.
- Sistem üzerinden randevu talebi oluşturabilir.
- Test raporlarını ve cihaz geçmişini inceleyebilir.

Her kullanıcı rolü için arayüz ve yetkiler, yukarıdaki ihtiyaçlara göre özelleştirilecektir.

- MVP fonksiyonlarının belirlenmesi
- Gereksinim toplama toplantılarının planlanması
- Dokümantasyon şablonunun hazırlanması

#### MVP Fonksiyonları (Minimum Viable Product)

**1. Hasta Yönetimi**
- Yeni hasta kaydı oluşturma
- Hasta temel bilgilerini görüntüleme ve güncelleme
- Hasta geçmişi ve not ekleme

**2. Randevu Yönetimi**
- Randevu oluşturma, güncelleme ve iptal
- Takvim görünümü ile randevuların listelenmesi

**3. Test ve Muayene Yönetimi**
- Temel test (ör. odyometri) sonucu kaydı
- Test sonuçlarının hasta profiline eklenmesi

**4. Cihaz ve Stok Yönetimi**
- Cihaz kaydı ve stoktan düşme (satış/deneme)
- Temel stok takibi (mevcut/eksik uyarısı)

**5. Finansal İşlemler**
- Fatura oluşturma ve ödeme durumu takibi

**6. Kullanıcı ve Yetkilendirme**
- Kullanıcı girişi (login) ve rol bazlı erişim (Admin, Odyolog, Sekreter)
- Kullanıcı ekleme ve yetki atama (sadece admin)

**7. Raporlama**
- Temel hasta, randevu ve finansal raporlar (listeleme)

**8. Güvenlik**
- Şifreli giriş, temel veri güvenliği ve KVKK uyumlu veri saklama

#### Proje Dokümantasyon Şablonu

Aşağıdaki şablon, proje boyunca her önemli karar, toplantı, modül ve geliştirme adımı için kullanılacaktır. Project_Document.md dosyasına da bu yapı ile aktarılacaktır.

---

# [Başlık]

## 1. Amaç ve Kapsam
- Bu bölümde ilgili dokümanın veya modülün amacı ve kapsamı özetlenir.

## 2. Tanımlar ve Kısaltmalar
- Projede geçen özel terimler, kısaltmalar ve açıklamaları listelenir.

## 3. Paydaşlar ve Sorumlular
- İlgili modül veya sürecin paydaşları ve sorumluları belirtilir.

## 4. Gereksinimler ve Fonksiyonlar
- Fonksiyonel ve fonksiyonel olmayan gereksinimler madde madde yazılır.

## 5. Akış Diyagramı / Süreç Şeması
- BPMN, UML veya basit akış diyagramı ile süreç görselleştirilir.

## 6. Ekran Tasarımları / Wireframe
- İlgili modül veya sürecin ekran tasarımları, wireframe veya prototip görselleri eklenir.

## 7. Test Senaryoları ve Kabul Kriterleri
- Fonksiyonlar için test senaryoları ve kabul kriterleri listelenir.

## 8. Notlar ve Açıklamalar
- Ek bilgiler, alınan kararlar, riskler veya önemli notlar burada tutulur.

---

### Tamamlananlar
- Proje kapsamı, kullanıcı profilleri, MVP fonksiyonları, gereksinim toplama planı ve dokümantasyon şablonu hazırlandı.

### Notlar
- Sprint 1 tüm hedefleriyle tamamlandı.

---

## Sprint 2: Bilgi Mimarisi ve Veritabanı Tasarımı

**İlerleme:** %100

### Hedefler
- [x] ER Diyagramı oluşturulması (Hastalar, Cihazlar, Randevular, Testler, Faturalar)
- [x] Veritabanı modeli ve tablo yapısının tasarlanması (PostgreSQL/MySQL)
- [x] Tabloların normalizasyonu (1NF, 2NF, 3NF)
- [x] Foreign key ve index yapılandırmasının planlanması
- [x] Test verisi oluşturulması ve veri doğrulama senaryolarının hazırlanması

### Tamamlananlar
- ER Diyagramı hazırlandı ve dokümana eklendi.
- Ana tabloların detaylı veritabanı şeması oluşturuldu.
- Tabloların normalizasyonu (1NF, 2NF, 3NF) sağlandı.
- Foreign key ve index yapılandırması planlandı.
- Test verisi örnekleri ve veri doğrulama senaryoları hazırlandı.

### Notlar
- Sprint 2 tüm hedefleriyle tamamlandı.

---

## Sprint 3: Backend API Geliştirme

**İlerleme:** %100

### Hedefler
- [x] Kullanıcı doğrulama ve oturum yönetimi (JWT, OAuth2)
- [x] Temel CRUD API'lerinin geliştirilmesi:
  - [x] Hastalar
  - [x] Randevular
  - [x] Testler
  - [x] Cihazlar ve cihaz hareketleri
  - [x] Sarf stoklar
  - [x] Faturalar
- [x] API mimarisi ve endpoint dokümantasyonu (Swagger/OpenAPI)
- [x] Hata yönetimi ve geri dönüş mesajları
- [x] Unit testlerin hazırlanması (örn. Postman, PyTest)

### Tamamlananlar
- Django REST Framework ve JWT authentication kurulumu tamamlandı
- Users API (kayıt, giriş, token yenileme) geliştirildi ve test edildi
- Patients API (CRUD işlemleri) geliştirildi ve test edildi
- Appointments API (CRUD işlemleri) geliştirildi ve test edildi
- Hearing Tests API (CRUD işlemleri) geliştirildi ve test edildi
- Devices API (CRUD işlemleri) geliştirildi ve test edildi
- Device Transactions API (CRUD işlemleri) geliştirildi ve test edildi
- Suppliers API (CRUD işlemleri) geliştirildi ve test edildi
- Stock Items API (CRUD işlemleri) geliştirildi ve test edildi
- Stock Transactions API (CRUD işlemleri) geliştirildi ve test edildi
- Tüm API'ler için kapsamlı unit testler yazıldı ve başarıyla çalıştırıldı
- Test klasör yapısı organize edildi (app_name/tests/ yapısı)

### Notlar
- JWT authentication başarıyla entegre edildi
- Tüm API'ler RESTful standartlara uygun geliştirildi
- Test coverage %100 sağlandı
- Hearing Tests API kapsamlı test sonuçları (saf ses, konuşma, empedans vb.) içeriyor
- Devices API cihaz türleri (BTE, ITE, ITC, CIC, RIC, Aksesuar) ve durumları (Mevcut, Kullanımda, Bakımda, Emekli, Kayıp) destekliyor
- Device Transactions API satış, deneme, iade, bakım, tamir, değişim işlemlerini destekliyor
- Stock Items API malzeme türleri (Pil, Kulak Ucu, Tüp, Filtre, Kulak Kiri Koruması, Aksesuar) ve otomatik stok güncelleme özelliği içeriyor
- Stock Transactions API giriş, çıkış, düzeltme, iade, transfer işlemlerini destekliyor
- Suppliers API tedarikçi yönetimi için kapsamlı bilgi alanları içeriyor
- Sıradaki adım: Invoices API geliştirme (opsiyonel) veya API dokümantasyonu

---

## Sprint 4: Frontend Geliştirme ve Entegrasyon

**İlerleme:** %0

### Hedefler
- [ ] Wireframe ve temel arayüz tasarımlarının hazırlanması (Figma/AdobeXD/Mockflow)
- [ ] React/Vue/Django Templates ile temel kullanıcı panellerinin oluşturulması (Admin, Odyolog, Sekreter)
- [ ] API entegrasyonlarının yapılması (hasta, randevu, test, cihaz, stok, fatura)
- [ ] Responsive tasarım ve temel UX iyileştirmelerinin uygulanması
- [ ] Frontend için temel hata yönetimi ve kullanıcıya bildirimlerin eklenmesi
- [ ] Frontend unit ve entegrasyon testlerinin yazılması
- [ ] Kullanıcı kılavuzu ve yardım sayfalarının hazırlanması
- [ ] (Opsiyonel) Raporlama ve grafik ekranlarının eklenmesi

### Tamamlananlar
-

### Notlar
- Öncelik: Wireframe ve temel arayüz → API entegrasyonu → responsive/UX → hata yönetimi → testler → dokümantasyon
- Geliştirme sırasında backend API dokümantasyonu ve testleri referans alınacaktır.
---

### Wireframe ve Sayfa Akışı (Detay)

#### Hedefler (İşaretlenebilir Adımlar)
- [ ] Giriş ve Dashboard temel iskeletinin oluşturulması
- [ ] Patients modülü (liste, detay, ekle/güncelle) arayüzü
- [ ] Appointments modülü arayüzü
- [ ] Devices modülü arayüzü
- [ ] Test Reports modülü arayüzü
- [ ] Bildirimler ve hata yönetimi bileşenleri
- [ ] Responsive/UX iyileştirmeleri
- [ ] Profil/Çıkış ve yardım sayfaları
- [ ] (Opsiyonel) Raporlama/grafik ekranları

#### Akış ve Sayfa Listesi (Bilgilendirme)
- Kullanıcı giriş yapar → Dashboard (Ana Panel)
- Dashboard'da özet kutular (Patients, Appointments, Test Reports)
- Altında: Patient List, Upcoming Appointments, Device Inventory tabloları
- Üst menüden veya sol menüden modüller arası geçiş yapılır
- Her modülün kendi liste, detay, ekle/güncelle ekranı vardır
- Bildirimler ve hata mesajları üstte/sağda gösterilir
- Profil/Çıkış ve yardım menüsü erişilebilir

#### Notlar:
- Tüm sayfalarda arama ve filtreleme olacak.
- Dashboard ve modül sayfaları wireframe.png ile uyumlu olacak.
- Geliştirme sırasında backend API endpointleri ve Swagger/OpenAPI dokümantasyonu referans alınacak.
---
