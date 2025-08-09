**🧱 VERİTABANI TABLO YAPISI (DETAYLI)**

---

### 1. `patients` (Hastalar)
- `patient_id` (PK, INT, AUTO_INCREMENT)
- `first_name` (VARCHAR(50))
- `last_name` (VARCHAR(50))
- `birth_date` (DATE)
- `gender` (VARCHAR(10))
- `phone` (VARCHAR(20))
- `email` (VARCHAR(100))
- `address` (TEXT)
- `status` (ENUM: 'active', 'inactive') - Hasta durumu
- `user_id` (FK, INT, references `users.user_id`) - Kim ekledi
- `created_at` (DATETIME)

---

### 2. `appointments` (Randevular)
- `appointment_id` (PK, INT, AUTO_INCREMENT)
- `patient_id` (FK, INT, references `patients.patient_id`)
- `user_id` (FK, INT, references `users.user_id`)
- `appointment_date` (DATETIME)
- `appointment_type` (ENUM: 'consultation', 'hearing_test', 'device_fitting', 'follow_up', 'maintenance') - Randevu türü
- `notes` (TEXT)
- `status` (ENUM: 'scheduled', 'completed', 'cancelled')

---

### 3. `hearing_tests` (İşitme Testleri)
- `test_id` (PK, INT, AUTO_INCREMENT)
- `patient_id` (FK, INT, references `patients.patient_id`)
- `user_id` (FK, INT, references `users.user_id`) - Odyolog
- `test_type` (ENUM: 'Pure_Tone', 'Speech', 'Impedance', 'ABR', 'OAE', 'Other')
- `test_date` (DATETIME)
- `right_ear_250` (INT) - Sağ kulak 250Hz sonucu
- `right_ear_500` (INT) - Sağ kulak 500Hz sonucu
- `right_ear_1000` (INT) - Sağ kulak 1000Hz sonucu
- `right_ear_2000` (INT) - Sağ kulak 2000Hz sonucu
- `right_ear_4000` (INT) - Sağ kulak 4000Hz sonucu
- `right_ear_8000` (INT) - Sağ kulak 8000Hz sonucu
- `left_ear_250` (INT) - Sol kulak 250Hz sonucu
- `left_ear_500` (INT) - Sol kulak 500Hz sonucu
- `left_ear_1000` (INT) - Sol kulak 1000Hz sonucu
- `left_ear_2000` (INT) - Sol kulak 2000Hz sonucu
- `left_ear_4000` (INT) - Sol kulak 4000Hz sonucu
- `left_ear_8000` (INT) - Sol kulak 8000Hz sonucu
- `right_ear_srt` (INT) - Sağ kulak konuşma eşiği
- `left_ear_srt` (INT) - Sol kulak konuşma eşiği
- `right_ear_sds` (INT) - Sağ kulak konuşma ayırımı
- `left_ear_sds` (INT) - Sol kulak konuşma ayırımı
- `status` (ENUM: 'Completed', 'Incomplete', 'Cancelled')
- `notes` (TEXT) - Notlar
- `diagnosis` (TEXT) - Tanı
- `recommendations` (TEXT) - Öneriler
- `report_pdf` (VARCHAR(255)) - Rapor PDF dosya yolu
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

---

### 4. `devices` (İşitme Cihazları)
- `device_id` (PK, INT, AUTO_INCREMENT)
- `device_type` (ENUM: 'BTE', 'ITE', 'ITC', 'CIC', 'RIC', 'Accessory', 'Other') - Cihaz türü
- `brand` (VARCHAR(100))
- `model` (VARCHAR(100))
- `serial_number` (VARCHAR(100), UNIQUE)
- `purchase_date` (DATE) - Satın alma tarihi
- `purchase_price` (DECIMAL(10,2)) - Satın alma fiyatı
- `warranty_expiry` (DATE) - Garanti bitiş tarihi
- `status` (ENUM: 'Available', 'In_Use', 'Maintenance', 'Retired', 'Lost') - Cihaz durumu
- `notes` (TEXT) - Notlar
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

---

### 5. `device_transactions` (Cihaz İşlem Geçmişi)
- `transaction_id` (PK, INT, AUTO_INCREMENT)
- `device_id` (FK, INT, references `devices.device_id`)
- `patient_id` (FK, INT, references `patients.patient_id`)
- `user_id` (FK, INT, references `users.user_id`) - Tekniker/Odyolog
- `transaction_type` (ENUM: 'Sale', 'Trial', 'Return', 'Maintenance', 'Repair', 'Exchange', 'Other')
- `transaction_date` (DATETIME)
- `return_date` (DATETIME) - İade/deneme bitiş tarihi
- `price` (DECIMAL(10,2)) - İşlem fiyatı
- `notes` (TEXT)
- `created_at` (DATETIME)

---

### 6. `stock_items` (Sarf Malzemeler)
- `item_id` (PK, INT, AUTO_INCREMENT)
- `name` (VARCHAR(200)) - Ürün adı
- `item_type` (ENUM: 'Battery', 'Ear_Tip', 'Tube', 'Filter', 'Wax_Guard', 'Accessory', 'Other') - Malzeme türü
- `brand` (VARCHAR(100)) - Marka
- `model` (VARCHAR(100)) - Model
- `description` (TEXT) - Açıklama
- `unit` (VARCHAR(20)) - Birim (Adet, Paket, vb.)
- `current_stock` (INT) - Mevcut stok
- `minimum_stock` (INT) - Kritik stok seviyesi
- `unit_price` (DECIMAL(10,2)) - Birim fiyat
- `supplier_id` (FK, INT, references `suppliers.supplier_id`) - Tedarikçi
- `location` (VARCHAR(100)) - Depo konumu
- `notes` (TEXT) - Notlar
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

---

### 7. `invoices` (Faturalar)
- `invoice_id` (PK, INT, AUTO_INCREMENT)
- `patient_id` (FK, INT, references `patients.patient_id`)
- `user_id` (FK, INT, references `users.user_id`) - Kim oluşturdu
- `invoice_date` (DATE) - Fatura tarihi
- `amount` (DECIMAL(10,2)) - Fatura tutarı
- `description` (TEXT) - Açıklama
- `status` (ENUM: 'Draft', 'Issued', 'Paid', 'Cancelled') - Fatura durumu
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

---

### 8. `stock_transactions` (Stok Hareketleri)
- `transaction_id` (PK, INT, AUTO_INCREMENT)
- `stock_item_id` (FK, INT, references `stock_items.item_id`)
- `transaction_type` (ENUM: 'In', 'Out', 'Adjustment', 'Return', 'Transfer') - Hareket türü
- `quantity` (INT) - Miktar
- `unit_price` (DECIMAL(10,2)) - Birim fiyat
- `total_amount` (DECIMAL(10,2)) - Toplam tutar
- `user_id` (FK, INT, references `users.user_id`) - Kim yaptı
- `transaction_date` (DATETIME) - Hareket tarihi
- `reference_number` (VARCHAR(100)) - Referans no (fatura/irsaliye)
- `notes` (TEXT) - Notlar
- `created_at` (DATETIME)

---

### 9. `users` (Kullanıcılar)
- `user_id` (PK, INT, AUTO_INCREMENT)
- `first_name` (VARCHAR(50))
- `last_name` (VARCHAR(50))
- `email` (VARCHAR(100))
- `password_hash` (VARCHAR(255))
- `role` (ENUM: 'Admin', 'Odyolog', 'Sekreter', 'Tekniker')

---

### 10. `suppliers` (Tedarikçiler)
- `supplier_id` (PK, INT, AUTO_INCREMENT)
- `name` (VARCHAR(200)) - Tedarikçi adı
- `contact_person` (VARCHAR(100)) - İletişim kişisi
- `phone` (VARCHAR(20)) - Telefon
- `email` (VARCHAR(100)) - E-posta
- `address` (TEXT) - Adres
- `tax_number` (VARCHAR(50)) - Vergi numarası
- `notes` (TEXT) - Notlar
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

---

## 🔒 **REFERANS İLİŞKİLERİ VE KORUMA MEKANİZMASI**

### **PROTECT İlişkileri** (Ana kayıt korunur - önce bağlı kayıtlar silinmeli):
- **Patient** → Appointments, HearingTests, DeviceTransactions, Invoices
- **Device** → DeviceTransactions  
- **StockItem** → StockTransactions

### **CASCADE İlişkileri** (Ana kayıt silinirse bağlı kayıtlar da silinir):
- **User** → Tüm user field'ları (kim ekledi/oluşturdu bilgisi)

### **SET_NULL İlişkileri** (Ana kayıt silinirse bağlı kayıt kalır ama referans NULL olur):
- **Supplier** → StockItems

**Örnek:** Hasta silinmek istenirse sistem **"Bu hastanın randevuları/test raporları/faturaları var. Önce bunları silin."** hatası verir.

Tüm tablolar arası ilişkiler `FOREIGN KEY` ile tanımlanmıştır. İlgili alanlarda `index` kurulmalıdır. Zaman damgaları için `created_at`, `updated_at` alanları ileride genişletilebilir.

