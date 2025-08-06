# Proje Chat Promptu: İşitme Merkezi Takip Sistemi

## Proje Amacı
Bir işitme merkezinde hasta, randevu, işitme testi, cihaz, stok ve finansal süreçlerin dijital ortamda bütünleşik şekilde yönetilmesini sağlayan, güvenli ve sürdürülebilir bir web tabanlı takip sistemi geliştirmek.

## Kullanılan Teknolojiler
- Python 3
- Django (backend, güvenlik ve yönetim için)
- Django REST Framework (API)
- djangorestframework-simplejwt (JWT tabanlı kimlik doğrulama)
- PostgreSQL/MySQL (veritabanı, tercihe göre)

## Sprint ve Süreç Yönetimi
- Sprintler Project_Sprint.md dosyasında, ilerleme yüzdesi ve tamamlananlar ile takip edilir.
- Her sprint sonunda Project_Document.md dosyasına detaylı dokümantasyon eklenir.
- Tüm önemli kararlar, süreçler ve mimari değişiklikler Project_Document.md ve Chat_Prompt.md dosyalarında özetlenir.

## Yapılan Başlıca İşlemler
1. **Proje kapsamı, hedef kitle ve kullanıcı profilleri çıkarıldı.**
2. **MVP fonksiyonları ve gereksinim toplama süreci belirlendi.**
3. **Veritabanı tasarımı ve ER diyagramı hazırlandı.**
   - Tablolar: patients, users, appointments, hearing_tests, devices, device_transactions, stock_items, invoices, suppliers
   - Tüm ilişkiler ve foreign key yapıları tanımlandı.
4. **Tabloların normalizasyonu (1NF, 2NF, 3NF) ve index planlaması yapıldı.**
5. **Test verisi ve veri doğrulama senaryoları oluşturuldu.**
6. **Backend için Django projesi başlatıldı.**
   - Uygulamalar: users, patients, appointments, hearing_tests
   - Sanal ortam (venv) ve gerekli paketler kuruldu.
7. **Kod ve dokümantasyonda 'tests' → 'hearing_tests' isim değişikliği yapıldı.**
8. **Proje GitHub’a yüklendi: https://github.com/uysallmurat/isitme_merkezi**

## Yapılacak Başlıca İşlemler
- Cihaz, stok ve fatura yönetimi için Django app’leri oluşturulacak.
- Kullanıcı doğrulama ve JWT tabanlı oturum yönetimi geliştirilecek.
- Temel CRUD API’leri (hastalar, randevular, işitme testleri, cihazlar, stok, faturalar) yazılacak.
- API endpointleri için Swagger/OpenAPI dokümantasyonu hazırlanacak.
- Unit testler ve hata yönetimi eklenecek.
- Frontend ve diğer modüller için sonraki sprintlerde planlama yapılacak.

## Notlar
- Tüm dokümantasyon ve kodda işitme testleriyle ilgili referanslar 'hearing_tests' olarak güncellenmiştir.
- Sprint ve dokümantasyon yönetimi için Project_Sprint.md ve Project_Document.md dosyaları ana kaynaktır.
- Her yeni chat veya geliştirici, bu promptu ve ilgili dokümanları okuyarak projeye hızlıca adapte olabilir.
