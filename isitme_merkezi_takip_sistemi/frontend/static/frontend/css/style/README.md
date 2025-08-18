# Styles CSS Modülü - Genel CSS Kütüphanesi

## Genel Bakış
Bu klasör, tüm proje genelinde kullanılan ortak CSS modüllerini içerir. Bu modüller, herhangi bir sayfa veya bileşende kullanılabilir ve proje genelinde tutarlılık sağlar.

## Modüller ve Açıklamaları

### 1. **typography.css** 📝
**Ne İşe Yarar:** Font aileleri, boyutları, ağırlıkları ve text stilleri
- Font family tanımları
- Font boyutları ve ağırlıkları
- Line height ve letter spacing
- Text alignment ve decoration
- Heading hierarchy (h1-h6)
- Paragraph stilleri
- Link tipografisi
- Code ve pre stilleri

### 2. **utilities.css** 🛠️
**Ne İşe Yarar:** Spacing, display, position ve diğer utility class'lar
- Margin ve padding utility'leri
- Display properties (flex, grid, block, inline)
- Position utilities (relative, absolute, fixed)
- Z-index yönetimi
- Overflow handling
- Visibility ve opacity
- Cursor stilleri
- User select ve pointer events

### 3. **icons.css** 🎨
**Ne İşe Yarar:** Icon boyutları, renkleri, alignment ve animations
- Icon boyutları ve renkleri
- Icon alignment ve positioning
- Icon animations ve transitions
- Custom icon font tanımları
- Icon states (hover, active, disabled)
- Icon spacing ve margins
- Icon background ve border
- Icon accessibility

### 4. **grid.css** 📐
**Ne İşe Yarar:** CSS Grid, Flexbox ve responsive grid system
- CSS Grid layout utilities
- Flexbox utilities
- Responsive grid breakpoints
- Container ve row yapıları
- Column systems
- Grid gap ve spacing
- Grid alignment
- Grid responsive behavior
- Grid auto-fit ve auto-fill

### 5. **print.css** 🖨️
**Ne İşe Yarar:** Print-specific styles ve print media queries
- Print media queries
- Page breaks
- Print-friendly colors
- Print layout adjustments
- Print typography
- Print navigation
- Print forms
- Print tables
- Print images
- Print page setup

### 6. **accessibility.css** ♿
**Ne İşe Yarar:** Focus states, screen reader support ve accessibility
- Focus states
- Screen reader support
- High contrast mode
- Reduced motion preferences
- Keyboard navigation
- ARIA support
- Color contrast
- Skip links
- Focus indicators
- Accessibility announcements

### 7. **dark-mode.css** 🌙
**Ne İşe Yarar:** Dark theme variables ve color scheme switching
- Dark theme variables
- Color scheme switching
- Dark mode specific components
- Dark mode colors
- Dark mode shadows
- Dark mode borders
- Dark mode backgrounds
- Dark mode text colors
- Dark mode transitions
- Dark mode media queries

### 8. **loading.css** ⏳
**Ne İşe Yarar:** Skeleton loaders, spinners ve loading animations
- Skeleton loaders
- Spinners
- Progress bars
- Loading animations
- Loading states
- Shimmer effects
- Pulse animations
- Loading overlays
- Loading text
- Loading icons

### 9. **responsive.css** 📱
**Ne İşe Yarar:** Responsive tasarım ve media queries
- Responsive breakpoints
- Mobile first approach
- Tablet adaptations
- Desktop optimizations
- Large screen enhancements
- Orientation changes
- Touch device optimizations
- Print media queries
- High DPI display support
- Accessibility in responsive design

### 10. **pagination.css** 📄
**Ne İşe Yarar:** Sayfalama bileşenleri ve stilleri
- Pagination container
- Pagination buttons
- Active state styles
- Disabled state styles
- Hover effects
- Page number display
- Navigation arrows
- Pagination info
- Responsive pagination
- Accessibility features

### 11. **animations.css** 🎬
**Ne İşe Yarar:** Animasyonlar, geçişler ve keyframe'ler
- Page transitions
- Loading spinners
- Fade in/out effects
- Slide animations
- Scale transforms
- Rotation effects
- Bounce animations
- Pulse effects
- Hover transitions
- Keyframe definitions

### 12. **feedback.css** 💬
**Ne İşe Yarar:** Bildirim sistemleri ve geri bildirim bileşenleri
- Toast notifications
- Success messages
- Error messages
- Warning messages
- Info messages
- Progress indicators
- Status badges
- Alert boxes
- Notification icons
- Close buttons

### 13. **modals.css** 🪟
**Ne İşe Yarar:** Modal overlay'ler ve dialog bileşenleri
- Modal overlay
- Modal content
- Modal header
- Modal body
- Modal footer
- Close buttons
- Modal animations
- Confirmation modals
- Form modals
- Modal sizes

### 14. **buttons.css** 🔘
**Ne İşe Yarar:** Buton stilleri ve varyasyonları
- Primary buttons
- Secondary buttons
- Small buttons
- Large buttons
- Icon buttons
- Button groups
- Button states
- Hover effects
- Active states
- Disabled states

### 15. **tables.css** 📊
**Ne İşe Yarar:** Tablo stilleri ve bileşenleri
- Table container
- Table headers
- Table rows
- Table cells
- Sortable headers
- Filter dropdowns
- Status badges
- Action buttons
- Responsive tables
- Table pagination

### 16. **forms.css** 📝
**Ne İşe Yarar:** Form elemanları ve validasyon stilleri
- Form groups
- Form labels
- Input fields
- Text areas
- Select boxes
- Checkboxes
- Radio buttons
- Form validation
- Error states
- Success states

### 17. **components.css** 🧩
**Ne İşe Yarar:** Yeniden kullanılabilir UI bileşenleri
- Content cards
- Statistics cards
- Info boxes
- Tooltips
- Dropdowns
- Tabs
- Accordions
- Breadcrumbs
- Progress bars
- Badges

### 18. **navigation.css** 🧭
**Ne İşe Yarar:** Navigasyon bileşenleri ve menü stilleri
- Top navigation bar
- Sidebar navigation
- Menu items
- Dropdown menus
- Breadcrumb navigation
- Pagination navigation
- Tab navigation
- Mobile navigation
- Navigation icons
- Active states

### 19. **layout.css** 🏗️
**Ne İşe Yarar:** Sayfa düzeni ve temel yapı stilleri
- Page background
- Container layouts
- Main content area
- Sidebar layouts
- Header layouts
- Footer layouts
- Grid systems
- Flexbox layouts
- Responsive layouts
- Layout utilities

### 20. **variables.css** 🎨
**Ne İşe Yarar:** CSS custom properties ve değişkenler
- Color palette
- Typography variables
- Spacing variables
- Shadow variables
- Border radius variables
- Transition variables
- Z-index variables
- Breakpoint variables
- Animation variables
- Theme variables

## Kullanım
Bu modüller, ana CSS dosyalarında import edilerek kullanılır:

```css
/* Ana CSS dosyasında */
@import url('./styles/variables.css');
@import url('./styles/typography.css');
@import url('./styles/utilities.css');
@import url('./styles/icons.css');
/* ... diğer modüller */
```

## Avantajlar
- **Tutarlılık:** Tüm proje genelinde aynı stiller
- **Yeniden Kullanılabilirlik:** Modüller her yerde kullanılabilir
- **Bakım Kolaylığı:** Merkezi stil yönetimi
- **Performans:** Sadece gerekli stiller yüklenir
- **Takım Çalışması:** Standart stil kuralları

## Toplam Boyut
- **20 Modül**: ~2-3KB her modül
- **Toplam**: ~40-60KB
- **Avantaj**: Modüler yapı sayesinde sadece gerekli stiller yüklenir

## Modül Kategorileri

### **Temel Modüller** (4)
- variables.css, typography.css, utilities.css, grid.css

### **Bileşen Modülleri** (8)
- buttons.css, forms.css, tables.css, modals.css, components.css, navigation.css, icons.css, pagination.css

### **Gelişmiş Modüller** (8)
- animations.css, feedback.css, loading.css, responsive.css, accessibility.css, dark-mode.css, print.css, layout.css
