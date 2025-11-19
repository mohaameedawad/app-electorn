const BaseHandler = require('./base-handler');

class ProductHandler extends BaseHandler {
  getAllProducts() {
    return this.data.products || [];
  }

  getProductById(id) {
    return this.getAllProducts().find(p => p.id === id);
  }

  getProductsByCategory(categoryId) {
    return this.getAllProducts().filter(p => p.category_id === categoryId);
  }

  addProduct(product) {
    if (!this.data.products) this.data.products = [];
    
    const newProduct = {
      id: this._getNextId('products'),
      ...product,
      createdAt: new Date().toISOString(),
      stock: product.stock || 0,
      isActive: true
    };
    
    this.data.products.push(newProduct);
    this.saveData();
    return { lastInsertRowid: newProduct.id, changes: 1 };
  }

  updateProduct(id, product) {
    const index = this.getAllProducts().findIndex(p => p.id === id);
    if (index !== -1) {
      this.data.products[index] = { 
        ...this.data.products[index], 
        ...product,
        updatedAt: new Date().toISOString()
      };
      this.saveData();
      return { changes: 1 };
    }
    return { changes: 0 };
  }

  deleteProduct(id) {
    const initialLength = this.getAllProducts().length;
    this.data.products = this.getAllProducts().filter(p => p.id !== id);
    this.saveData();
    return { changes: initialLength - this.getAllProducts().length };
  }

  // 🔹 دالة للتحقق من توفر المخزون
  checkStockAvailability(productId, requestedQuantity) {
    const product = this.getProductById(productId);
    if (!product) return { available: false, message: 'المنتج غير موجود' };
    
    const currentStock = product.stock || 0;
    if (currentStock >= requestedQuantity) {
      return { available: true, currentStock };
    } else {
      return { 
        available: false, 
        currentStock,
        message: `المخزون غير كافٍ. المتوفر: ${currentStock}، المطلوب: ${requestedQuantity}`
      };
    }
  }

  updateStock(productId, quantity) {
    const product = this.getProductById(productId);
    if (product) {
      product.stock = Math.max(0, (product.stock || 0) + quantity);
      this.saveData();
      return true;
    }
    return false;
  }

  // 🔹 دالة للحصول على منتجات منخفضة المخزون
  getLowStockProducts(threshold = 5) {
    return this.getAllProducts().filter(p => (p.stock || 0) <= threshold);
  }

  // 🔹 دالة للحصول على حركات المخزون لمنتج معين
  getProductStockMovements(productId) {
    if (!this.data.stock_movements) return [];
    return this.data.stock_movements.filter(movement => movement.product_id === productId);
  }
}

module.exports = ProductHandler;