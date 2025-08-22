# Ortak Template'ler Kullanım Kılavuzu

Bu klasör, tüm sayfalarda ortak olarak kullanılan template'leri içerir. Bu sayede kod tekrarı önlenir ve bakım kolaylaşır.

## Mevcut Ortak Template'ler

### 1. `sidebar.html`
- Tüm sayfalarda kullanılan sol menü
- Navigasyon linkleri ve logo
- Her sayfada aynı yapı

### 2. `page-header.html`
- Sayfa başlığı, arama alanı ve butonlar
- Dinamik içerik için template değişkenleri kullanır:
  - `{{ page_icon }}`: Sayfa ikonu (FontAwesome class)
  - `{{ page_title }}`: Sayfa başlığı
  - `{{ search_placeholder }}`: Arama placeholder metni
  - `{{ new_button_onclick }}`: Yeni ekleme butonu onclick fonksiyonu
  - `{{ new_button_text }}`: Yeni ekleme butonu metni

### 3. `stats-cards.html`
- İstatistik kartları
- Dinamik içerik için `stats` listesi kullanır:
  ```html
  {% for stat in stats %}
  <div class="stat-card">
      <div class="stat-icon">
          <i class="fa-solid fa-{{ stat.icon }}"></i>
      </div>
      <div class="stat-content">
          <div class="stat-number" id="{{ stat.id }}">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
      </div>
  </div>
  {% endfor %}
  ```

### 4. `table-container.html`
- Tablo yapısı ve filtreler
- Dinamik kolonlar için `table_columns` listesi kullanır:
  ```html
  {% for column in table_columns %}
  <th class="sortable-header" onclick="toggleFilter('{{ column.filter_id }}')">
      {% if column.icon %}<i class="fa-solid fa-{{ column.icon }}"></i>{% endif %}
      {{ column.title }}
      <!-- Filtre dropdown'ı -->
  </th>
  {% endfor %}
  ```

### 5. `page-container.html`
- Ana sayfa yapısı
- Tüm ortak template'leri birleştirir

## Yeni Sayfa Ekleme

Yeni bir sayfa eklemek için:

1. `{% include 'frontend/base/page-container.html' %}` kullanın
2. JavaScript ile sayfa özel içeriğini yapılandırın
3. Gerekirse CSS ile özel stilleri ekleyin

### Örnek Kullanım:

```html
{% load static %}
{% include 'frontend/base/page-container.html' %}

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Sayfa özel konfigürasyonu
    const pageHeader = document.querySelector('.page-header');
    if (pageHeader) {
        pageHeader.innerHTML = `
            <div class="title-section">
                <h1 class="page-title">
                    <i class="fa-solid fa-icon-name"></i>
                    Sayfa Başlığı
                </h1>
            </div>
            <!-- Diğer header içeriği -->
        `;
    }
    
    // Stats ve table konfigürasyonu...
});
</script>
```

## Avantajlar

- **Kod Tekrarını Önler**: Aynı HTML yapısı tekrar yazılmaz
- **Kolay Bakım**: Değişiklik tek yerden yapılır
- **Tutarlılık**: Tüm sayfalar aynı görünüm ve davranışa sahip
- **Hızlı Geliştirme**: Yeni sayfa eklemek çok kolay

## Notlar

- Ortak template'lerde değişiklik yaparken tüm sayfaları test edin
- JavaScript konfigürasyonu sayfa özelinde yapılır
- CSS sınıfları tutarlı olmalıdır
