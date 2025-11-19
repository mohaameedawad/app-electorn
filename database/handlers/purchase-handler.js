const BaseHandler = require('./base-handler');

class PurchaseHandler extends BaseHandler {
  getPurchases() {
    if (!this.data.purchases) {
      this.data.purchases = [];
    }
    return this.data.purchases;
  }

  getPurchaseById(id) {
    return this.getPurchases().find(p => p.id === id);
  }

  getPurchaseItems(purchaseId) {
    return (this.data.purchase_items || []).filter(item => item.purchase_id === purchaseId);
  }

  addPurchase(purchase) {
    if (!this.data.purchases) {
      this.data.purchases = [];
    }
    if (!this.data.purchase_items) {
      this.data.purchase_items = [];
    }
    
    const newPurchase = {
      id: this._getNextId('purchases'),
      ...purchase,
      createdAt: new Date().toISOString(),
      status: purchase.status || 'completed'
    };
    
    this.data.purchases.push(newPurchase);
    
    // Add purchase items
    if (purchase.items && Array.isArray(purchase.items)) {
      purchase.items.forEach(item => {
        const newItem = {
          id: this._getNextId('purchase_items'),
          purchase_id: newPurchase.id,
          ...item
        };
        this.data.purchase_items.push(newItem);
        
        // 🔹 إصلاح: زيادة كمية المنتج (موجبة لأنها شراء)
        console.log(`🔄 [شراء] تحديث مخزون المنتج ${item.product_id}: +${item.quantity}`);
        this.updateProductStock(item.product_id, parseFloat(item.quantity) || 0);
      });
    }
    
    this.saveData();
    return newPurchase;
  }

  updatePurchase(id, purchase) {
    const index = this.getPurchases().findIndex(p => p.id === id);
    if (index !== -1) {
      console.log('🔄 [شراء] بدء تحديث فاتورة الشراء:', { id, purchase });
      
      // 🔹 الحصول على الفاتورة القديمة
      const oldPurchase = this.data.purchases[index];
      
      // 🔹 معالجة items
      let oldItems = [];
      try {
        oldItems = typeof oldPurchase.items === 'string' 
          ? JSON.parse(oldPurchase.items) 
          : oldPurchase.items || [];
      } catch (error) {
        console.error('❌ خطأ في تحليل items القديمة:', error);
        oldItems = oldPurchase.items || [];
      }

      let newItems = [];
      try {
        newItems = typeof purchase.items === 'string' 
          ? JSON.parse(purchase.items) 
          : purchase.items || [];
      } catch (error) {
        console.error('❌ خطأ في تحليل items الجديدة:', error);
        newItems = purchase.items || [];
      }

      console.log('📦 [شراء] مقارنة العناصر:', { oldItems, newItems });

      // 🔹 تحديث المخزون بناءً على التغير في الكميات
      this.updateStockOnEdit(oldItems, newItems);
      
      this.data.purchases[index] = { 
        ...this.data.purchases[index], 
        ...purchase,
        updatedAt: new Date().toISOString()
      };
      this.saveData();
      return this.data.purchases[index];
    }
    return null;
  }

  deletePurchase(id) {
    const initialLength = this.getPurchases().length;
    const purchaseToDelete = this.getPurchaseById(id);
    
    if (purchaseToDelete) {
      // 🔹 استعادة المخزون عند حذف الفاتورة (خصم الكميات)
      const items = typeof purchaseToDelete.items === 'string' 
        ? JSON.parse(purchaseToDelete.items) 
        : purchaseToDelete.items || [];
      
      items.forEach(item => {
        console.log(`🔄 [شراء] استعادة مخزون المنتج ${item.product_id}: -${item.quantity}`);
        this.updateProductStock(item.product_id, -parseFloat(item.quantity) || 0);
      });
    }
    
    this.data.purchases = this.getPurchases().filter(p => p.id !== id);
    // Also delete related purchase items
    this.data.purchase_items = (this.data.purchase_items || []).filter(item => item.purchase_id !== id);
    this.saveData();
    return { changes: initialLength - this.getPurchases().length };
  }

  // 🔹 إصلاح دالة تحديث مخزون المنتج
  updateProductStock(productId, quantity) {
    if (!this.data.products) {
      console.log('❌ لا توجد منتجات في قاعدة البيانات');
      return;
    }
    
    const productIndex = this.data.products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
      const currentStock = parseFloat(this.data.products[productIndex].stock) || 0;
      const newStock = Math.max(0, currentStock + quantity);
      
      console.log(`📦 [شراء] تحديث مخزون المنتج ${productId}: ${currentStock} + ${quantity} = ${newStock}`);
      
      this.data.products[productIndex].stock = newStock;
      
      // 🔹 تسجيل حركة المخزون
      this.addStockMovement({
        product_id: productId,
        type: quantity > 0 ? 'purchase' : 'purchase_cancel',
        quantity: quantity,
        reference_id: productId,
        note: quantity > 0 
          ? `إضافة مخزون من فاتورة شراء (${quantity})` 
          : `خصم مخزون لفاتورة شراء ملغاة (${Math.abs(quantity)})`
      });
    } else {
      console.log(`❌ المنتج ${productId} غير موجود`);
    }
      this.saveData(); 
  }

  // 🔹 إصلاح دالة تحديث المخزون عند التعديل
  updateStockOnEdit(oldItems, newItems) {
    // إنشاء map للكميات القديمة والجديدة
    const oldItemsMap = new Map();
    const newItemsMap = new Map();
    
    oldItems.forEach(item => {
      const productId = item.product_id;
      const quantity = parseFloat(item.quantity) || 0;
      oldItemsMap.set(productId, (oldItemsMap.get(productId) || 0) + quantity);
    });
    
    newItems.forEach(item => {
      const productId = item.product_id;
      const quantity = parseFloat(item.quantity) || 0;
      newItemsMap.set(productId, (newItemsMap.get(productId) || 0) + quantity);
    });
    
    // حساب الفروق وتحديث المخزون
    const allProductIds = new Set([
      ...oldItemsMap.keys(),
      ...newItemsMap.keys()
    ]);
    
    allProductIds.forEach(productId => {
      const oldQty = oldItemsMap.get(productId) || 0;
      const newQty = newItemsMap.get(productId) || 0;
      const diff = newQty - oldQty;
      
      if (diff !== 0) {
        console.log(`🔄 [شراء] تعديل مخزون المنتج ${productId}: ${oldQty} → ${newQty} (فرق: ${diff})`);
        this.updateProductStock(productId, diff); // موجب لأن الشراء يضيف للمخزون
      }
    });
  }

  // 🔹 دالة لإضافة حركة مخزون
  addStockMovement(movement) {
    if (!this.data.stock_movements) {
      this.data.stock_movements = [];
    }
    
    const newMovement = {
      id: this._getNextId('stock_movements'),
      ...movement,
      createdAt: new Date().toISOString()
    };
    
    this.data.stock_movements.push(newMovement);
  }

  // 🔹 دالة إضافية: طباعة حالة المخزون
  printStockStatus() {
    if (!this.data.products) {
      console.log('❌ لا توجد منتجات');
      return;
    }
    
    console.log('📊 [شراء] تقرير المخزون الحالي:');
    this.data.products.forEach(product => {
      console.log(`   ${product.id}. ${product.name}: ${product.stock || 0}`);
    });
  }
}

module.exports = PurchaseHandler;