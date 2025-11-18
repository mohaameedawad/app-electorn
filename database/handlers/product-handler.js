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

  updateStock(productId, quantity) {
    const product = this.getProductById(productId);
    if (product) {
      product.stock = (product.stock || 0) + quantity;
      this.saveData();
      return true;
    }
    return false;
  }
}

module.exports = ProductHandler;