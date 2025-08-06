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
- `created_at` (DATETIME)

---

### 2. `appointments` (Randevular)
- `appointment_id` (PK, INT, AUTO_INCREMENT)
- `patient_id` (FK, INT, references `patients.patient_id`)
- `user_id` (FK, INT, references `users.user_id`)
- `appointment_date` (DATETIME)
- `notes` (TEXT)
- `status` (ENUM: 'Planned', 'Completed', 'Cancelled')

---

### 3. `hearing_tests` (İşitme Testleri)
- `test_id` (PK, INT, AUTO_INCREMENT)
- `patient_id` (FK, INT, references `patients.patient_id`)
- `test_type` (VARCHAR(50))
- `test_date` (DATETIME)
- `results` (TEXT / JSON)
- `comments` (TEXT)

---

### 4. `devices` (İşitme Cihazları)
- `device_id` (PK, INT, AUTO_INCREMENT)
- `brand` (VARCHAR(50))
- `model` (VARCHAR(50))
- `serial_number` (VARCHAR(100))
- `supplier_id` (FK, INT, references `suppliers.supplier_id`)
- `stock_status` (ENUM: 'In Stock', 'On Trial', 'Sold', 'Returned')

---

### 5. `device_transactions` (Cihaz İşlem Geçmişi)
- `transaction_id` (PK, INT, AUTO_INCREMENT)
- `device_id` (FK, INT, references `devices.device_id`)
- `patient_id` (FK, INT, references `patients.patient_id`)
- `transaction_type` (ENUM: 'Trial', 'Sold', 'Returned')
- `transaction_date` (DATETIME)
- `notes` (TEXT)

---

### 6. `stock_items` (Sarf Malzemeler)
- `item_id` (PK, INT, AUTO_INCREMENT)
- `item_name` (VARCHAR(100))
- `quantity` (INT)
- `critical_level` (INT)

---

### 7. `invoices` (Faturalar)
- `invoice_id` (PK, INT, AUTO_INCREMENT)
- `patient_id` (FK, INT, references `patients.patient_id`)
- `invoice_date` (DATETIME)
- `total_amount` (DECIMAL(10,2))
- `payment_status` (ENUM: 'Paid', 'Unpaid', 'Partially Paid')

---

### 8. `users` (Kullanıcılar)
- `user_id` (PK, INT, AUTO_INCREMENT)
- `first_name` (VARCHAR(50))
- `last_name` (VARCHAR(50))
- `email` (VARCHAR(100))
- `password_hash` (VARCHAR(255))
- `role` (ENUM: 'Admin', 'Odyolog', 'Sekreter', 'Tekniker')

---

### 9. `suppliers` (Tedarikçiler)
- `supplier_id` (PK, INT, AUTO_INCREMENT)
- `name` (VARCHAR(100))
- `contact_person` (VARCHAR(100))
- `phone` (VARCHAR(20))
- `email` (VARCHAR(100))
- `address` (TEXT)

---

Tüm tablolar arası ilişkiler `FOREIGN KEY` ile tanımlanmıştır. İlgili alanlarda `index` kurulmalıdır. Zaman damgaları için `created_at`, `updated_at` alanları ileride genişletilebilir.

