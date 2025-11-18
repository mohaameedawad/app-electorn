// const BaseHandler = require('./base-handler');

// class ProductHandler extends BaseHandler {
//   // ============================
//   // BASIC PRODUCT METHODS
//   // ============================
  
//   getAllProducts() {
//     if (!this.data.products) {
//       this.data.products = [];
//     }
//     return this.data.products;
//   }

//   getProductById(id) {
//     if (!this.data.products) return null;
//     return this.data.products.find(p => p.id === id);
//   }

//   addProduct(product) {
//     if (!this.data.products) {
//       this.data.products = [];
//     }
    
//     const id = this._getNextId("products");
//     const newProduct = {
//       id,
//       name: product.name || '',
//       barcode: product.barcode || '',
//       category_id: product.category_id || null,
//       cost_price: product.cost_price || 0,
//       selling_price: product.selling_price || 0,
//       stock: product.stock || 0,
//       min_stock: product.min_stock || 0,
//       unit: product.unit || '',
//       notes: product.notes || '',
//       is_active: product.is_active !== undefined ? product.is_active : true,
//       created_at: new Date().toISOString(),
//       ...product
//     };

//     this.data.products.push(newProduct);
//     this.saveData();
//     return { lastInsertRowid: id, changes: 1, row: newProduct };
//   }

//   updateProduct(id, product) {
//     if (!this.data.products) {
//       this.data.products = [];
//     }
    
//     const idx = this.data.products.findIndex(p => p.id === id);
//     if (idx === -1) return { changes: 0 };

//     this.data.products[idx] = {
//       ...this.data.products[idx],
//       ...product,
//       id: this.data.products[idx].id // الحفاظ على الـ ID الأصلي
//     };

//     this.saveData();
//     return { changes: 1, row: this.data.products[idx] };
//   }

//   deleteProduct(id) {
//     if (!this.data.products) {
//       this.data.products = [];
//     }
    
//     const idx = this.data.products.findIndex(p => p.id === id);
//     if (idx === -1) return { changes: 0 };

//     this.data.products.splice(idx, 1);
//     this.saveData();
//     return { changes: 1 };
//   }

//   // ============================
//   // STOCK MANAGEMENT
//   // ============================
  
//   calculateProductStock(productId) {
//     const product = this.getProductById(productId);
//     if (!product) return 0;
    
//     // حساب المخزون من حركات المخزون
//     if (!this.data.stock_movements) {
//       this.data.stock_movements = [];
//     }
    
//     const movements = this.data.stock_movements.filter(m => m.product_id === productId);
//     const totalStock = movements.reduce((sum, movement) => {
//       return sum + (Number(movement.qty) || 0);
//     }, 0);
    
//     return totalStock;
//   }

//   updateProductStock(productId, quantity, type = 'manual', reference = '') {
//     const product = this.getProductById(productId);
//     if (!product) return { success: false, error: 'Product not found' };

//     // تحديث المخزون
//     product.stock = (Number(product.stock) || 0) + quantity;
    
//     // تسجيل حركة المخزون
//     if (!this.data.stock_movements) {
//       this.data.stock_movements = [];
//     }
    
//     const movementId = this._getNextId("stock_movements");
//     this.data.stock_movements.push({
//       id: movementId,
//       product_id: productId,
//       type: type, // 'sale', 'purchase', 'return', 'adjustment'
//       qty: quantity,
//       date: new Date().toISOString().slice(0, 10),
//       reference: reference, // مثل 'sale:123', 'purchase:456'
//       previous_stock: (Number(product.stock) || 0) - quantity,
//       new_stock: product.stock
//     });

//     this.saveData();
//     return { 
//       success: true, 
//       changes: 1, 
//       product: product,
//       movementId: movementId
//     };
//   }

//   // ============================
//   // SALES STOCK MANAGEMENT
//   // ============================
  
//   processSaleStock(saleId, items) {
//     if (!items || !Array.isArray(items)) {
//       return { success: false, error: 'Invalid items' };
//     }

//     const results = [];
    
//     for (const item of items) {
//       if (!item.product_id || !item.quantity) {
//         continue;
//       }

//       // طرح الكمية من المخزون (سالبة لأنها بيع)
//       const result = this.updateProductStock(
//         item.product_id, 
//         -item.quantity, 
//         'sale', 
//         `sale:${saleId}`
//       );
      
//       results.push({
//         product_id: item.product_id,
//         product_name: item.product_name,
//         quantity: item.quantity,
//         success: result.success,
//         error: result.error
//       });
//     }

//     return { success: true, results };
//   }

//   reverseSaleStock(saleId) {
//     if (!this.data.stock_movements) {
//       return { success: false, error: 'No stock movements found' };
//     }

//     // إيجاد كل حركات هذا البيع
//     const saleMovements = this.data.stock_movements.filter(
//       m => m.reference === `sale:${saleId}`
//     );

//     const results = [];
    
//     for (const movement of saleMovements) {
//       // إرجاع الكمية للمخزون (موجبة لأنها تراجع بيع)
//       const result = this.updateProductStock(
//         movement.product_id, 
//         Math.abs(movement.qty), 
//         'sale_return', 
//         `sale_return:${saleId}`
//       );
      
//       results.push({
//         product_id: movement.product_id,
//         quantity: Math.abs(movement.qty),
//         success: result.success,
//         error: result.error
//       });
//     }

//     return { success: true, results };
//   }

//   // ============================
//   // PURCHASE STOCK MANAGEMENT
//   // ============================
  
//   processPurchaseStock(purchaseId, items) {
//     if (!items || !Array.isArray(items)) {
//       return { success: false, error: 'Invalid items' };
//     }

//     const results = [];
    
//     for (const item of items) {
//       if (!item.product_id || !item.quantity) {
//         continue;
//       }

//       // إضافة الكمية للمخزون (موجبة لأنها شراء)
//       const result = this.updateProductStock(
//         item.product_id, 
//         item.quantity, 
//         'purchase', 
//         `purchase:${purchaseId}`
//       );
      
//       results.push({
//         product_id: item.product_id,
//         product_name: item.product_name,
//         quantity: item.quantity,
//         success: result.success,
//         error: result.error
//       });
//     }

//     return { success: true, results };
//   }

//   reversePurchaseStock(purchaseId) {
//     if (!this.data.stock_movements) {
//       return { success: false, error: 'No stock movements found' };
//     }

//     // إيجاد كل حركات هذا الشراء
//     const purchaseMovements = this.data.stock_movements.filter(
//       m => m.reference === `purchase:${purchaseId}`
//     );

//     const results = [];
    
//     for (const movement of purchaseMovements) {
//       // طرح الكمية من المخزون (سالبة لأنها تراجع شراء)
//       const result = this.updateProductStock(
//         movement.product_id, 
//         -Math.abs(movement.qty), 
//         'purchase_return', 
//         `purchase_return:${purchaseId}`
//       );
      
//       results.push({
//         product_id: movement.product_id,
//         quantity: Math.abs(movement.qty),
//         success: result.success,
//         error: result.error
//       });
//     }

//     return { success: true, results };
//   }

//   // ============================
//   // STOCK ADJUSTMENT
//   // ============================
  
//   adjustStock(productId, newStock, reason = '') {
//     const product = this.getProductById(productId);
//     if (!product) return { success: false, error: 'Product not found' };

//     const currentStock = Number(product.stock) || 0;
//     const difference = newStock - currentStock;

//     if (difference === 0) {
//       return { success: true, message: 'No change needed' };
//     }

//     const result = this.updateProductStock(
//       productId, 
//       difference, 
//       'adjustment', 
//       `adjustment:${reason}`
//     );

//     return {
//       success: result.success,
//       product_id: productId,
//       previous_stock: currentStock,
//       new_stock: newStock,
//       difference: difference,
//       reason: reason
//     };
//   }

//   // ============================
//   // STOCK VALIDATION
//   // ============================
  
//   validateStockForSale(items) {
//     if (!items || !Array.isArray(items)) {
//       return { valid: false, error: 'Invalid items' };
//     }

//     const validations = [];
    
//     for (const item of items) {
//       const product = this.getProductById(item.product_id);
//       if (!product) {
//         validations.push({
//           product_id: item.product_id,
//           product_name: item.product_name,
//           valid: false,
//           error: 'Product not found'
//         });
//         continue;
//       }

//       const availableStock = this.calculateProductStock(item.product_id);
//       const hasEnoughStock = availableStock >= item.quantity;

//       validations.push({
//         product_id: item.product_id,
//         product_name: product.name,
//         requested: item.quantity,
//         available: availableStock,
//         valid: hasEnoughStock,
//         error: hasEnoughStock ? null : `Insufficient stock. Available: ${availableStock}`
//       });
//     }

//     const allValid = validations.every(v => v.valid);
    
//     return {
//       valid: allValid,
//       validations: validations,
//       error: allValid ? null : 'Some products have insufficient stock'
//     };
//   }

//   // ============================
//   // SEARCH AND FILTER
//   // ============================
  
//   searchProducts(searchTerm) {
//     if (!this.data.products) return [];
    
//     const term = searchTerm.toLowerCase();
//     return this.data.products.filter(product => 
//       product.name?.toLowerCase().includes(term) ||
//       product.barcode?.includes(term)
//     );
//   }

//   getAllProductsByCategory(categoryId) {
//     if (!this.data.products) return [];
//     return this.data.products.filter(product => product.category_id === categoryId);
//   }

//   getLowStockProducts() {
//     if (!this.data.products) return [];
//     return this.data.products.filter(product => 
//       (product.stock || 0) <= (product.min_stock || 0)
//     );
//   }

//   // ============================
//   // CATEGORY METHODS
//   // ============================
  
//   getAllCategories() {
//     if (!this.data.categories) {
//       this.data.categories = [];
//     }
//     return this.data.categories;
//   }

//   addCategory(category) {
//     if (!this.data.categories) {
//       this.data.categories = [];
//     }
    
//     const id = this._getNextId("categories");
//     const newCategory = {
//       id,
//       name: category.name || '',
//       description: category.description || '',
//       parent_id: category.parent_id || null,
//       ...category
//     };

//     this.data.categories.push(newCategory);
//     this.saveData();
//     return { lastInsertRowid: id, changes: 1, row: newCategory };
//   }

//   updateCategory(id, category) {
//     if (!this.data.categories) {
//       this.data.categories = [];
//     }
    
//     const idx = this.data.categories.findIndex(c => c.id === id);
//     if (idx === -1) return { changes: 0 };

//     this.data.categories[idx] = {
//       ...this.data.categories[idx],
//       ...category
//     };

//     this.saveData();
//     return { changes: 1, row: this.data.categories[idx] };
//   }

//   deleteCategory(id) {
//     if (!this.data.categories) {
//       this.data.categories = [];
//     }
    
//     const idx = this.data.categories.findIndex(c => c.id === id);
//     if (idx === -1) return { changes: 0 };

//     this.data.categories.splice(idx, 1);
//     this.saveData();
//     return { changes: 1 };
//   }
// }

// module.exports = ProductHandler;



const BaseHandler = require('./base-handler');

class ProductHandler extends BaseHandler {
}

module.exports = ProductHandler;
