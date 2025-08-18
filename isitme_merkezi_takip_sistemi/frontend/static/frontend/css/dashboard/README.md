# CSS Modülü - Sayfa CSS Yapısı

## Genel Bakış
Bu klasör, herhangi bir sayfa için CSS modüllerini içerir. Her modül, `style` klasöründeki aynı isimli CSS dosyasından referans alır ve sayfaya özel stilleri ekler.

## Modüller ve Referanslar

### **Temel Modüller** (4)
- **variables.css** 🎨 - `../style/variables.css`'den referans alır
- **layout.css** 🏗️ - `../style/layout.css`'den referans alır
- **typography.css** 📝 - `../style/typography.css`'den referans alır
- **utilities.css** 🛠️ - `../style/utilities.css`'den referans alır

### **Bileşen Modülleri** (8)
- **icons.css** 🎨 - `../style/icons.css`'den referans alır
- **grid.css** 📐 - `../style/grid.css`'den referans alır
- **buttons.css** 🔘 - `../style/buttons.css`'den referans alır
- **forms.css** 📝 - `../style/forms.css`'den referans alır
- **tables.css** 📊 - `../style/tables.css`'den referans alır
- **modals.css** 🪟 - `../style/modals.css`'den referans alır
- **components.css** 🧩 - `../style/components.css`'den referans alır
- **navigation.css** 🧭 - `../style/navigation.css`'den referans alır

### **Gelişmiş Modüller** (8)
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
@import url('./page/utilities.css');
@import url('./page/icons.css');
@import url('./page/grid.css');
@import url('./page/buttons.css');
@import url('./page/forms.css');
@import url('./page/tables.css');
@import url('./page/modals.css');
@import url('./page/components.css');
@import url('./page/navigation.css');
@import url('./page/feedback.css');
@import url('./page/animations.css');
@import url('./page/pagination.css');
@import url('./page/responsive.css');
@import url('./page/accessibility.css');
@import url('./page/print.css');
@import url('./page/dark-mode.css');
@import url('./page/loading.css');
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
├── style/                    # Ortak CSS modülleri (20 dosya)
│   ├── variables.css
│   ├── layout.css
│   ├── typography.css
│   ├── utilities.css
│   ├── icons.css
│   ├── grid.css
│   ├── buttons.css
│   ├── forms.css
│   ├── tables.css
│   ├── modals.css
│   ├── components.css
│   ├── navigation.css
│   ├── feedback.css
│   ├── animations.css
│   ├── pagination.css
│   ├── responsive.css
│   ├── accessibility.css
│   ├── print.css
│   ├── dark-mode.css
│   └── loading.css
└── page/                     # Sayfa CSS modülleri (20 dosya)
    ├── variables.css         # ../style/variables.css'den referans alır
    ├── layout.css           # ../style/layout.css'den referans alır
    ├── typography.css       # ../style/typography.css'den referans alır
    ├── utilities.css        # ../style/utilities.css'den referans alır
    ├── icons.css            # ../style/icons.css'den referans alır
    ├── grid.css             # ../style/grid.css'den referans alır
    ├── buttons.css          # ../style/buttons.css'den referans alır
    ├── forms.css            # ../style/forms.css'den referans alır
    ├── tables.css           # ../style/tables.css'den referans alır
    ├── modals.css           # ../style/modals.css'den referans alır
    ├── components.css       # ../style/components.css'den referans alır
    ├── navigation.css       # ../style/navigation.css'den referans alır
    ├── feedback.css         # ../style/feedback.css'den referans alır
    ├── animations.css       # ../style/animations.css'den referans alır
    ├── pagination.css       # ../style/pagination.css'den referans alır
    ├── responsive.css       # ../style/responsive.css'den referans alır
    ├── accessibility.css    # ../style/accessibility.css'den referans alır
    ├── print.css            # ../style/print.css'den referans alır
    ├── dark-mode.css        # ../style/dark-mode.css'den referans alır
    └── loading.css          # ../style/loading.css'den referans alır
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

## Modül Kategorileri

### **Temel Modüller** (4)
- **variables.css** - CSS değişkenleri ve custom properties
- **layout.css** - Sayfa düzeni ve temel yapı
- **typography.css** - Font stilleri ve tipografi
- **utilities.css** - Yardımcı CSS class'ları

### **Bileşen Modülleri** (8)
- **icons.css** - Icon stilleri ve animasyonları
- **grid.css** - CSS Grid ve Flexbox sistemleri
- **buttons.css** - Buton stilleri ve varyasyonları
- **forms.css** - Form elemanları ve validasyon
- **tables.css** - Tablo stilleri ve bileşenleri
- **modals.css** - Modal overlay'ler ve dialog'lar
- **components.css** - Yeniden kullanılabilir UI bileşenleri
- **navigation.css** - Navigasyon ve menü stilleri

### **Gelişmiş Modüller** (8)
- **feedback.css** - Bildirim sistemleri ve geri bildirim
- **animations.css** - Animasyonlar ve keyframe'ler
- **pagination.css** - Sayfalama bileşenleri
- **responsive.css** - Responsive tasarım ve media queries
- **accessibility.css** - Erişilebilirlik özellikleri
- **print.css** - Print-specific stiller
- **dark-mode.css** - Dark theme ve color scheme
- **loading.css** - Loading states ve skeleton'lar

## Toplam Boyut
- **20 Modül**: Her biri ~2-3KB
- **Toplam**: ~40-60KB
- **Avantaj**: Ortak stiller tekrar yüklenmez, sadece özel stiller eklenir

## Kopyalama ve Kullanım

### **Diğer Sayfalara Kopyalama**
Bu CSS dosyalarını diğer sayfa klasörlerine kopyalayabilirsiniz:

1. **Klasör adını değiştirin** (örn: `devices` → `appointments`)
2. **Gerekirse sayfa özel stilleri ekleyin**
3. **Ana CSS dosyasında import yollarını güncelleyin**

### **Örnek Kopyalama**
```bash
# Devices klasörünü appointments olarak kopyala
cp -r devices appointments

# Klasör adını değiştir
mv devices devices-backup
mv appointments devices
```

## Sonraki Adımlar
1. **Diğer sayfalar için aynı yapıyı uygula** (appointments, dashboard, inventory, vb.)
2. **Ortak stil kütüphanesini genişlet**
3. **Performance optimizasyonları yap**
4. **CSS preprocessor entegrasyonu ekle**
5. **Automated build process kur**
