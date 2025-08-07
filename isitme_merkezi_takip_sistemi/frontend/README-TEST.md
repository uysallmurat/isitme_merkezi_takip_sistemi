# İşitme Merkezi Takip Sistemi - Hata Yönetimi Test Kılavuzu

Bu doküman, frontend hata yönetimi sisteminin nasıl test edileceğini açıklar.

## 📋 İçindekiler

1. [Test Türleri](#test-türleri)
2. [Manuel Test](#manuel-test)
3. [Otomatik Test](#otomatik-test)
4. [Test Senaryoları](#test-senaryoları)
5. [Sonuçları Değerlendirme](#sonuçları-değerlendirme)
6. [Sorun Giderme](#sorun-giderme)

## 🧪 Test Türleri

### 1. Manuel Test
- **Amaç:** Kullanıcı deneyimini test etmek
- **Araç:** Test sayfası (`test-error-handler.html`)
- **Süre:** 15-20 dakika

### 2. Otomatik Test
- **Amaç:** Kod kalitesini ve fonksiyonelliği test etmek
- **Araç:** Jest framework
- **Süre:** 2-3 dakika

## 🖱️ Manuel Test

### Test Sayfasına Erişim
```
http://localhost:8000/test-error-handler/
```

### Test Adımları

#### 1. Bildirim Sistemi Testleri
- ✅ **Başarı Bildirimi:** Yeşil bildirim görünmeli
- ✅ **Hata Bildirimi:** Kırmızı bildirim görünmeli
- ✅ **Uyarı Bildirimi:** Sarı bildirim görünmeli
- ✅ **Bilgi Bildirimi:** Mavi bildirim görünmeli
- ✅ **Çoklu Bildirim:** Birden fazla bildirim aynı anda görünmeli
- ✅ **Uzun Mesaj:** Uzun mesajlar düzgün görünmeli

#### 2. Form Hata Testleri
- ✅ **Form Hatalarını Göster:** Hata mesajları input'ların altında görünmeli
- ✅ **Hataları Temizle:** Hata mesajları temizlenmeli
- ✅ **Form Validasyonu:** Boş alanlar için hata mesajları görünmeli

#### 3. Loading Durumu Testleri
- ✅ **Loading Overlay:** Sayfa üzerinde loading animasyonu görünmeli
- ✅ **Button Loading:** Buton üzerinde spinner görünmeli
- ✅ **Form Loading:** Form üzerinde loading durumu görünmeli
- ✅ **Tüm Loading'leri Durdur:** Tüm loading durumları durmalı

#### 4. API Hata Testleri
- ✅ **Başarılı API:** Başarı mesajı görünmeli
- ✅ **401 Unauthorized:** Oturum yönlendirmesi yapılmalı
- ✅ **403 Forbidden:** Yetki hatası mesajı görünmeli
- ✅ **404 Not Found:** Kaynak bulunamadı mesajı görünmeli
- ✅ **500 Server Error:** Sunucu hatası mesajı görünmeli
- ✅ **Bağlantı Hatası:** İnternet bağlantısı mesajı görünmeli

#### 5. Global Hata Testleri
- ✅ **JavaScript Hatası:** Global hata yakalama çalışmalı
- ✅ **Promise Rejection:** Promise hataları yakalanmalı
- ✅ **Token Yönetimi:** Token kaydetme/alma çalışmalı
- ✅ **Oturum Kontrolü:** Oturum durumu kontrol edilmeli

## 🤖 Otomatik Test

### Gereksinimler
```bash
# Node.js ve npm yüklü olmalı
node --version
npm --version
```

### Kurulum
```bash
cd isitme_merkezi_takip_sistemi/frontend
npm install
```

### Test Çalıştırma

#### Tüm Testleri Çalıştır
```bash
npm test
```

#### Belirli Test Dosyasını Çalıştır
```bash
npm run test:error-handler
```

#### Test Coverage Raporu
```bash
npm run test:coverage
```

#### Watch Modu (Geliştirme)
```bash
npm run test:watch
```

### Test Sonuçları

#### Başarılı Test Örneği
```
 PASS  static/frontend/js/tests/error-handler.test.js
  ErrorHandler Sınıfı
    Bildirim Sistemi
      ✓ Başarı bildirimi göstermeli (5 ms)
      ✓ Hata bildirimi göstermeli (2 ms)
      ✓ Uyarı bildirimi göstermeli (1 ms)
      ✓ Bilgi bildirimi göstermeli (1 ms)
      ✓ Bildirim otomatik kaldırılmalı (105 ms)
      ✓ Bildirim manuel kaldırılabilmeli (1 ms)
    API Hata Yönetimi
      ✓ 401 hatası oturum yönlendirmesi yapmalı (2 ms)
      ✓ 403 hatası yetki mesajı göstermeli (1 ms)
      ✓ 404 hatası kaynak bulunamadı mesajı göstermeli (1 ms)
      ✓ 500 hatası sunucu hatası mesajı göstermeli (1 ms)
      ✓ Bağlantı hatası internet bağlantısı mesajı göstermeli (1 ms)
    Form Hata Yönetimi
      ✓ Form hatalarını göstermeli (3 ms)
      ✓ Form hatalarını temizlemeli (1 ms)
      ✓ String hata mesajını bildirim olarak göstermeli (1 ms)
    Loading Durumu Yönetimi
      ✓ Loading overlay göstermeli (1 ms)
      ✓ Loading overlay kaldırmalı (1 ms)
      ✓ Tüm loading overlay'leri kaldırmalı (1 ms)
      ✓ Button loading durumu ayarlamalı (2 ms)
    Token Yönetimi
      ✓ Token almalı (1 ms)
      ✓ Session storage'dan token almalı (1 ms)
      ✓ Token yoksa false dönmeli (1 ms)
      ✓ Token varsa true dönmeli (1 ms)
    API İstekleri
      ✓ Başarılı API isteği yapmalı (2 ms)
      ✓ Token ile API isteği yapmalı (2 ms)
      ✓ POST isteği body ile yapmalı (2 ms)
    Global Hata Yakalama
      ✓ JavaScript hatalarını yakalamalı (1 ms)
      ✓ Promise rejection'ları yakalamalı (1 ms)

Test Suites: 1 passed, 1 total
Tests:       25 passed, 25 total
Snapshots:   0 total
Time:        2.145 s
```

## 📊 Test Senaryoları

### Senaryo 1: Normal Kullanım
1. Kullanıcı hasta ekleme formunu doldurur
2. Form gönderilir
3. Başarı bildirimi görünür
4. Sayfa hasta listesine yönlendirilir

### Senaryo 2: Hata Durumu
1. Kullanıcı eksik form doldurur
2. Form gönderilir
3. Hata mesajları görünür
4. Kullanıcı hataları düzeltir
5. Form tekrar gönderilir

### Senaryo 3: Ağ Sorunu
1. İnternet bağlantısı kesilir
2. API isteği yapılır
3. Bağlantı hatası mesajı görünür
4. İnternet bağlantısı geri gelir
5. İstek tekrar yapılır

### Senaryo 4: Oturum Süresi
1. Kullanıcı uzun süre işlem yapmaz
2. Token süresi dolar
3. API isteği yapılır
4. Oturum yönlendirmesi yapılır
5. Login sayfasına gidilir

## 📈 Sonuçları Değerlendirme

### Başarı Kriterleri
- ✅ Tüm testler geçmeli (%100 başarı)
- ✅ Coverage %80'in üzerinde olmalı
- ✅ Manuel testlerde tüm senaryolar çalışmalı
- ✅ Performans kriterleri karşılanmalı

### Performans Kriterleri
- **Bildirim Görünme Süresi:** < 100ms
- **Loading Animasyonu:** < 50ms
- **Form Validasyonu:** < 200ms
- **API İsteği:** < 1000ms

### Hata Durumları
- ❌ Test başarısızlığı
- ❌ Coverage düşük
- ❌ Performans kriterleri karşılanmıyor
- ❌ Manuel testlerde sorun

## 🔧 Sorun Giderme

### Yaygın Sorunlar

#### 1. Test Çalışmıyor
```bash
# Node modules'u yeniden yükle
rm -rf node_modules package-lock.json
npm install
```

#### 2. Jest Hatası
```bash
# Jest cache'ini temizle
npx jest --clearCache
```

#### 3. Coverage Düşük
- Test edilmeyen fonksiyonları kontrol et
- Mock'ları doğru yapılandır
- Edge case'leri ekle

#### 4. Manuel Test Sorunları
- Browser console'u kontrol et
- Network sekmesini incele
- JavaScript hatalarını kontrol et

### Debug İpuçları

#### Console Log Ekleme
```javascript
// Test dosyasında
console.log('Test başladı:', testName);
console.log('Beklenen sonuç:', expectedResult);
console.log('Gerçek sonuç:', actualResult);
```

#### Browser Debug
```javascript
// Test sayfasında
debugger; // Breakpoint ekle
console.log('Debug bilgisi:', variable);
```

## 📝 Test Raporu

### Test Sonuç Raporu Şablonu

```markdown
# Hata Yönetimi Test Raporu

**Tarih:** [TARİH]
**Test Eden:** [AD SOYAD]
**Versiyon:** [VERSİYON]

## Otomatik Testler
- **Toplam Test:** 25
- **Başarılı:** 25
- **Başarısız:** 0
- **Coverage:** %95

## Manuel Testler
- **Bildirim Sistemi:** ✅
- **Form Hataları:** ✅
- **Loading Durumları:** ✅
- **API Hataları:** ✅
- **Global Hatalar:** ✅

## Performans
- **Bildirim Süresi:** 50ms ✅
- **Loading Süresi:** 30ms ✅
- **Form Validasyon:** 150ms ✅

## Sorunlar
- [Varsa sorunları listele]

## Öneriler
- [Varsa önerileri listele]

## Sonuç
✅ Tüm testler başarılı - Sistem production'a hazır
```

## 🚀 Sonraki Adımlar

1. **Test Otomasyonu:** CI/CD pipeline'a test entegrasyonu
2. **E2E Testler:** Selenium/Cypress ile end-to-end testler
3. **Performans Testleri:** Load testing ve stress testing
4. **Güvenlik Testleri:** XSS, CSRF testleri
5. **Accessibility Testleri:** WCAG uyumluluk testleri

---

**Not:** Bu test kılavuzu sürekli güncellenmelidir. Yeni özellikler eklendikçe test senaryoları da güncellenmelidir. 