from rest_framework import serializers
from .models import Supplier, StockItem, StockTransaction

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

class StockItemSerializer(serializers.ModelSerializer):
    # Frontend'den gelen alanlar
    product_name = serializers.CharField(write_only=True, required=False)
    product_code = serializers.CharField(write_only=True, required=False)
    category = serializers.CharField(write_only=True, required=False)
    price = serializers.DecimalField(write_only=True, max_digits=10, decimal_places=2, required=False)
    stock_quantity = serializers.IntegerField(write_only=True, required=False)
    min_stock_level = serializers.IntegerField(write_only=True, required=False)
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    
    class Meta:
        model = StockItem
        fields = '__all__'
    
    def create(self, validated_data):
        # Frontend alanlarını çıkar ve backend alanlarına map et
        product_name = validated_data.pop('product_name', None)
        product_code = validated_data.pop('product_code', None)  # Bu alan model'de yok, sadece çıkar
        category = validated_data.pop('category', None)
        price = validated_data.pop('price', None)
        stock_quantity = validated_data.pop('stock_quantity', None)
        min_stock_level = validated_data.pop('min_stock_level', None)
        
        # Backend alanlarına map et
        if product_name:
            validated_data['name'] = product_name
        if category:
            validated_data['item_type'] = category
        if price:
            validated_data['unit_price'] = price
        if stock_quantity:
            validated_data['current_stock'] = stock_quantity
        if min_stock_level:
            validated_data['minimum_stock'] = min_stock_level
        
        return super().create(validated_data)

class StockTransactionSerializer(serializers.ModelSerializer):
    stock_item_name = serializers.CharField(source='stock_item.name', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = StockTransaction
        fields = '__all__'
        read_only_fields = ('total_amount',)
        extra_kwargs = {
            'user': {'required': False},
            'transaction_date': {'required': False}
        }
    
    def create(self, validated_data):
        print(f"StockTransaction create - validated_data: {validated_data}")
        
        # Transaction type'ı kontrol et
        if 'transaction_type' not in validated_data:
            validated_data['transaction_type'] = 'In'
        
        # User ID'yi kontrol et (şimdilik 1 olarak sabit)
        if 'user' not in validated_data:
            from django.contrib.auth.models import User
            try:
                user = User.objects.get(id=1)
                validated_data['user'] = user
            except User.DoesNotExist:
                # İlk kullanıcıyı al
                user = User.objects.first()
                if user:
                    validated_data['user'] = user
        
        # Tarih formatını düzelt
        if 'transaction_date' not in validated_data:
            from django.utils import timezone
            validated_data['transaction_date'] = timezone.now()
        
        print(f"StockTransaction create - final validated_data: {validated_data}")
        return super().create(validated_data) 