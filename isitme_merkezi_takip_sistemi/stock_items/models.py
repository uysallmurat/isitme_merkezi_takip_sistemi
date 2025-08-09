from django.db import models
from django.contrib.auth.models import User

class Supplier(models.Model):
    """Tedarikçi modeli"""
    name = models.CharField(max_length=200)
    contact_person = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    tax_number = models.CharField(max_length=50, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

class StockItem(models.Model):
    """Stok malzemesi modeli"""
    ITEM_TYPES = [
        ('Battery', 'Pil'),
        ('Ear_Tip', 'Kulak Ucu'),
        ('Tube', 'Tüp'),
        ('Filter', 'Filtre'),
        ('Wax_Guard', 'Kulak Kiri Koruması'),
        ('Accessory', 'Aksesuar'),
        ('Other', 'Diğer')
    ]
    
    name = models.CharField(max_length=200, blank=True, null=True)
    item_type = models.CharField(max_length=20, choices=ITEM_TYPES, blank=True, null=True)
    brand = models.CharField(max_length=100, blank=True, null=True)
    model = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    unit = models.CharField(max_length=20, default='Adet')  # Adet, Paket, Metre vb.
    current_stock = models.IntegerField(default=0)
    minimum_stock = models.IntegerField(default=0)  # Kritik stok seviyesi
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True, related_name='stock_items')
    location = models.CharField(max_length=100, blank=True, null=True)  # Depo konumu
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.brand} ({self.current_stock} {self.unit})"

    class Meta:
        ordering = ['name']

class StockTransaction(models.Model):
    """Stok hareketi modeli"""
    TRANSACTION_TYPES = [
        ('In', 'Giriş'),
        ('Out', 'Çıkış'),
        ('Adjustment', 'Düzeltme'),
        ('Return', 'İade'),
        ('Transfer', 'Transfer')
    ]
    
    stock_item = models.ForeignKey(StockItem, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stock_transactions', null=True, blank=True)
    transaction_date = models.DateTimeField()
    reference_number = models.CharField(max_length=100, blank=True, null=True)  # Fatura/İrsaliye no
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.stock_item.name} - {self.transaction_type} - {self.quantity}"

    class Meta:
        ordering = ['-transaction_date']

    def save(self, *args, **kwargs):
        # Toplam tutarı hesapla
        if self.unit_price and self.quantity:
            self.total_amount = self.unit_price * self.quantity
        
        super().save(*args, **kwargs)
        
        # Stok miktarını güncelle
        if self.transaction_type == 'In':
            self.stock_item.current_stock += self.quantity
        elif self.transaction_type == 'Out':
            self.stock_item.current_stock -= self.quantity
        elif self.transaction_type == 'Return':
            self.stock_item.current_stock += self.quantity
        
        self.stock_item.save()
