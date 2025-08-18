# CSS Modülü - Sayfa CSS Yapısı

## Genel Bakış
Bu klasör, herhangi bir sayfa için CSS modüllerini içerir. Her modül, `style` klasöründeki aynı isimli CSS dosyasından referans alır ve sayfaya özel stilleri ekler.

## Modüller ve Referanslar

### **Temel Modüller**
- **variables.css** 🎨 - `../style/variables.css`'den referans alır
- **layout.css** 🏗️ - `../style/layout.css`'den referans alır
- **typography.css** 📝 - `../style/typography.css`'den referans alır
- **utilities.css** 🛠️ - `../style/utilities.css`'den referans alır

### **Bileşen Modülleri**
- **icons.css** 🎨 - `../style/icons.css`'den referans alır
- **grid.css** 📐 - `../style/grid.css`'den referans alır
- **buttons.css** 🔘 - `../style/buttons.css`'den referans alır
- **forms.css** 📝 - `../style/forms.css`'den referans alır
- **tables.css** 📊 - `../style/tables.css`'den referans alır
- **modals.css** 🪟 - `../style/modals.css`'den referans alır
- **components.css** 🧩 - `../style/components.css`'den referans alır

### **Gelişmiş Modüller**
- **feedback.css** 💬 - `../style/feedback.css`'den referans alır
- **animations.css** 🎬 - `../style/animations.css`'den referans alır
- **pagination.css** 📄 - `../style/pagination.css`'den referans alır
- **responsive.css** 📱 - `../style/responsive.css`'den referans alır
- **accessibility.css** ♿ - `../style/accessibility.css`'den referans alır
- **print.css** 🖨️ - `../style/print.css`'den referans alır
- **dark-mode.css** 🌙 - `../style/dark-mode.css`'den referans alır
- **loading.css** ⏳ - `../style/loading.css`'den referans alır

## Referans Sistemi

### **Import Yapısı**
Her CSS dosyası, `style` klasöründeki aynı isimli dosyayı import eder:

```css
/* Örnek: variables.css */
@import url('../style/variables.css');

/* Sayfaya özel değişkenler buraya eklenebilir */
```

### **Avantajlar**
- **Kod Tekrarını Önler**: Ortak stiller tek yerde tanımlanır
- **Bakım Kolaylığı**: Değişiklikler tek yerden yapılır
- **Tutarlılık**: Tüm sayfalarda aynı stil kuralları
- **Modüler Yapı**: Her modül kendi sorumluluğunu yerine getirir

## Kullanım

### **Ana CSS Dosyasında Import**
```css
/* page.css - Ana dosya */
@import url('./page/variables.css');
@import url('./page/layout.css');
@import url('./page/typography.css');
/* ... diğer modüller */
```

### **Sayfa Özel Stilleri**
Her modülde, sayfaya özel stiller eklenebilir:

```css
/* Örnek: buttons.css */
@import url('../style/buttons.css');

/* Sayfaya özel buton stilleri */
.action-btn {
    background: var(--primary-orange);
    border-radius: var(--border-radius);
}

.status-btn {
    background: var(--primary-green);
    font-weight: bold;
}
```

## Dosya Yapısı
```
css/
├── style/                    # Ortak CSS modülleri
│   ├── variables.css
│   ├── layout.css
│   ├── typography.css
│   └── ... (diğer ortak modüller)
└── page/                     # Sayfa CSS modülleri
    ├── variables.css         # ../style/variables.css'den referans alır
    ├── layout.css           # ../style/layout.css'den referans alır
    ├── typography.css       # ../style/typography.css'den referans alır
    └── ... (diğer modüller)
```

## Özel Stil Örnekleri

### **Sayfa Kartları**
```css
.page-card {
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-md);
    padding: 20px;
    margin-bottom: 20px;
}

.page-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}
```

### **Durum Göstergeleri**
```css
.status {
    padding: 4px 12px;
    border-radius: var(--border-radius-sm);
    font-size: 0.875rem;
    font-weight: 500;
}

.status.active {
    background: var(--primary-green);
    color: white;
}

.status.maintenance {
    background: var(--primary-orange);
    color: white;
}
```

## Toplam Boyut
- **20 Modül**: Her biri ~2-3KB
- **Toplam**: ~40-60KB
- **Avantaj**: Ortak stiller tekrar yüklenmez, sadece özel stiller eklenir

## Sonraki Adımlar
1. **Diğer sayfalar için aynı yapıyı uygula**
2. **Ortak stil kütüphanesini genişlet**
3. **Performance optimizasyonları yap**
4. **CSS preprocessor entegrasyonu ekle**
