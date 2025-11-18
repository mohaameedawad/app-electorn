// const BaseHandler = require('./base-handler');

// class PurchaseHandler extends BaseHandler {
//   constructor() {
//     super();
//   }

//   // ============================================
//   // PURCHASE METHODS - دوال المشتريات
//   // ============================================

//   getAllPurchases() {
//     if (!this.data.purchases) {
//       this.data.purchases = [];
//     }
//     return this.data.purchases;
//   }

//   getPurchaseById(id) {
//     if (!this.data.purchases) return null;
//     return this.data.purchases.find(p => p.id === id);
//   }

//   getPurchaseByInvoiceNo(invoiceNo) {
//     if (!this.data.purchases) return null;
//     return this.data.purchases.find(p => p.invoice_no === invoiceNo);
//   }

//   addPurchase(purchase) {
//     if (!this.data.purchases) {
//       this.data.purchases = [];
//     }
    
//     const id = this._getNextId("purchases");
//     const newPurchase = {
//       id,
//       invoice_no: purchase.invoice_no || this._generatePurchaseInvoiceNumber(),
//       supplier_id: purchase.supplier_id || null,
//       supplier_name: purchase.supplier_name || '',
//       employee_id: purchase.employee_id || null,
//       employee_name: purchase.employee_name || '',
//       purchase_date: purchase.purchase_date || new Date().toISOString().slice(0, 10),
//       items: purchase.items || [],
//       subtotal: purchase.subtotal || 0,
//       discount: purchase.discount || 0,
//       tax: purchase.tax || 0,
//       total: purchase.total || 0,
//       paid_amount: purchase.paid_amount || 0,
//       balance_due: (purchase.total || 0) - (purchase.paid_amount || 0),
//       status: this._getPurchaseStatus(purchase.paid_amount, purchase.total),
//       payment_status: this._getPaymentStatus(purchase.paid_amount, purchase.total),
//       notes: purchase.notes || '',
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//       ...purchase
//     };

//     this.data.purchases.push(newPurchase);
//     this.saveData();
//     return { lastInsertRowid: id, changes: 1, row: newPurchase };
//   }

//   updatePurchase(id, purchase) {
//     if (!this.data.purchases) {
//       this.data.purchases = [];
//     }
    
//     const idx = this.data.purchases.findIndex(p => p.id === id);
//     if (idx === -1) return { changes: 0 };

//     const balance_due = (purchase.total || this.data.purchases[idx].total) - (purchase.paid_amount || this.data.purchases[idx].paid_amount);
//     const payment_status = this._getPaymentStatus(
//       purchase.paid_amount !== undefined ? purchase.paid_amount : this.data.purchases[idx].paid_amount,
//       purchase.total !== undefined ? purchase.total : this.data.purchases[idx].total
//     );

//     this.data.purchases[idx] = {
//       ...this.data.purchases[idx],
//       ...purchase,
//       balance_due: balance_due,
//       payment_status: payment_status,
//       status: this._getPurchaseStatus(
//         purchase.paid_amount !== undefined ? purchase.paid_amount : this.data.purchases[idx].paid_amount,
//         purchase.total !== undefined ? purchase.total : this.data.purchases[idx].total
//       ),
//       updated_at: new Date().toISOString()
//     };

//     this.saveData();
//     return { changes: 1, row: this.data.purchases[idx] };
//   }

//   deletePurchase(id) {
//     if (!this.data.purchases) {
//       this.data.purchases = [];
//     }
    
//     const idx = this.data.purchases.findIndex(p => p.id === id);
//     if (idx === -1) return { changes: 0 };

//     this.data.purchases.splice(idx, 1);
//     this.saveData();
//     return { changes: 1 };
//   }

//   // ============================================
//   // PURCHASE ITEMS METHODS - دوال عناصر المشتريات
//   // ============================================

//   getPurchaseItemsByPurchaseId(purchaseId) {
//     if (!this.data.purchase_items) {
//       this.data.purchase_items = [];
//     }
//     return this.data.purchase_items.filter(item => item.purchase_id === purchaseId);
//   }

//   getPurchaseItems() {
//     if (!this.data.purchase_items) {
//       this.data.purchase_items = [];
//     }
//     return this.data.purchase_items;
//   }

//   addPurchaseItem(item) {
//     if (!this.data.purchase_items) {
//       this.data.purchase_items = [];
//     }
    
//     const id = this._getNextId("purchase_items");
//     const total = (item.quantity || 0) * (item.price || 0);
    
//     const newItem = {
//       id,
//       purchase_id: item.purchase_id,
//       product_id: item.product_id,
//       product_name: item.product_name || '',
//       quantity: item.quantity || 0,
//       price: item.price || 0,
//       total: total,
//       created_at: new Date().toISOString(),
//       ...item
//     };

//     this.data.purchase_items.push(newItem);
//     this.saveData();
//     return { lastInsertRowid: id, changes: 1, row: newItem };
//   }

//   updatePurchaseItem(id, item) {
//     if (!this.data.purchase_items) {
//       this.data.purchase_items = [];
//     }
    
//     const idx = this.data.purchase_items.findIndex(i => i.id === id);
//     if (idx === -1) return { changes: 0 };

//     this.data.purchase_items[idx] = {
//       ...this.data.purchase_items[idx],
//       ...item
//     };

//     // إعادة حساب المجموع إذا تغيرت الكمية أو السعر
//     if (item.quantity !== undefined || item.price !== undefined) {
//       const quantity = item.quantity !== undefined ? item.quantity : this.data.purchase_items[idx].quantity;
//       const price = item.price !== undefined ? item.price : this.data.purchase_items[idx].price;
//       this.data.purchase_items[idx].total = quantity * price;
//     }

//     this.saveData();
//     return { changes: 1, row: this.data.purchase_items[idx] };
//   }

//   deletePurchaseItems(purchaseId) {
//     if (!this.data.purchase_items) {
//       this.data.purchase_items = [];
//     }
    
//     this.data.purchase_items = this.data.purchase_items.filter(
//       item => item.purchase_id !== purchaseId
//     );
//     this.saveData();
//     return { success: true, purchaseId };
//   }

//   clearPurchaseItems(purchaseId) {
//     return this.deletePurchaseItems(purchaseId);
//   }

//   // ============================================
//   // PAYMENT PROCESSING - معالجة الدفعات
//   // ============================================

//   processPurchasePayment(purchaseId, paymentAmount, paymentMethod = 'cash', notes = '') {
//     const purchase = this.getPurchaseById(purchaseId);
//     if (!purchase) return { success: false, error: 'Purchase not found' };

//     const newPaidAmount = (purchase.paid_amount || 0) + paymentAmount;
//     const balance_due = (purchase.total || 0) - newPaidAmount;
//     const payment_status = this._getPaymentStatus(newPaidAmount, purchase.total);

//     // تحديث الفاتورة
//     purchase.paid_amount = newPaidAmount;
//     purchase.balance_due = balance_due;
//     purchase.payment_status = payment_status;
//     purchase.status = this._getPurchaseStatus(newPaidAmount, purchase.total);
//     purchase.updated_at = new Date().toISOString();

//     // تسجيل الدفعة
//     if (!this.data.payments_made) {
//       this.data.payments_made = [];
//     }

//     const paymentId = this._getNextId("payments_made");
//     this.data.payments_made.push({
//       id: paymentId,
//       purchase_id: purchaseId,
//       supplier_id: purchase.supplier_id,
//       supplier_name: purchase.supplier_name,
//       amount: paymentAmount,
//       payment_method: paymentMethod,
//       payment_date: new Date().toISOString().slice(0, 10),
//       notes: notes || `دفعة للفاتورة رقم ${purchase.invoice_no}`,
//       created_at: new Date().toISOString()
//     });

//     this.saveData();
    
//     return {
//       success: true,
//       purchase: purchase,
//       paymentId: paymentId,
//       newBalance: balance_due
//     };
//   }

//   // ============================================
//   // COMPLETE PURCHASE PROCESS - عملية شراء كاملة
//   // ============================================

//   completePurchase(purchaseData, productHandler, supplierHandler) {
//     // 1. التحقق من البيانات الأساسية
//     if (!purchaseData.items || purchaseData.items.length === 0) {
//       return { 
//         success: false, 
//         error: 'لا توجد عناصر في الفاتورة' 
//       };
//     }

//     // 2. إضافة الفاتورة
//     const purchaseResult = this.addPurchase(purchaseData);
//     if (!purchaseResult.changes) {
//       return { success: false, error: 'فشل في إنشاء فاتورة الشراء' };
//     }

//     const purchaseId = purchaseResult.lastInsertRowid;
//     const purchase = purchaseResult.row;

//     // 3. إضافة العناصر
//     let itemsAdded = [];
//     try {
//       for (const item of purchaseData.items) {
//         const itemResult = this.addPurchaseItem({
//           ...item,
//           purchase_id: purchaseId
//         });
//         itemsAdded.push(itemResult.row);
//       }
//     } catch (error) {
//       // إذا فشل إضافة العناصر، احذف الفاتورة
//       this.deletePurchase(purchaseId);
//       return { 
//         success: false, 
//         error: 'فشل في إضافة عناصر الشراء', 
//         details: error.message 
//       };
//     }

//     // 4. تحديث مخزون المنتجات
//     let stockResults = [];
//     if (productHandler) {
//       try {
//         for (const item of purchaseData.items) {
//           const stockResult = productHandler.updateProductStock(
//             item.product_id, 
//             item.quantity, 
//             'purchase', 
//             `purchase:${purchaseId}`
//           );
//           stockResults.push(stockResult);
//         }
//       } catch (error) {
//         // إذا فشل تحديث المخزون، ارجع المخزون واحذف الفاتورة
//         for (const item of purchaseData.items) {
//           try {
//             productHandler.updateProductStock(
//               item.product_id, 
//               -item.quantity, 
//               'purchase_return', 
//               `purchase_return:${purchaseId}`
//             );
//           } catch (e) {
//             console.error('Error reversing stock:', e);
//           }
//         }
//         this.deletePurchase(purchaseId);
//         return { 
//           success: false, 
//           error: 'فشل في تحديث مخزون المنتجات', 
//           details: error.message 
//         };
//       }
//     }

//     // 5. تحديث رصيد المورد
//     let balanceResult = null;
//     if (supplierHandler && purchaseData.supplier_id) {
//       try {
//         balanceResult = supplierHandler.addPurchaseToSupplierBalance(
//           purchaseData.supplier_id, 
//           purchaseData.total
//         );
//       } catch (error) {
//         // إذا فشل تحديث الرصيد، ارجع المخزون واحذف الفاتورة
//         if (productHandler) {
//           for (const item of purchaseData.items) {
//             try {
//               productHandler.updateProductStock(
//                 item.product_id, 
//                 -item.quantity, 
//                 'purchase_return', 
//                 `purchase_return:${purchaseId}`
//               );
//             } catch (e) {
//               console.error('Error reversing stock:', e);
//             }
//           }
//         }
//         this.deletePurchase(purchaseId);
//         return { 
//           success: false, 
//           error: 'فشل في تحديث رصيد المورد', 
//           details: error.message 
//         };
//       }
//     }

//     // 6. معالجة الدفعة إذا كانت مدفوعة جزئياً أو كلياً
//     if (purchaseData.paid_amount > 0) {
//       this.processPurchasePayment(
//         purchaseId, 
//         purchaseData.paid_amount, 
//         purchaseData.payment_method || 'cash',
//         purchaseData.payment_notes || ''
//       );
//     }

//     return {
//       success: true,
//       purchaseId: purchaseId,
//       purchase: purchase,
//       items: itemsAdded,
//       stockUpdate: stockResults,
//       balanceUpdate: balanceResult
//     };
//   }

//   // ============================================
//   // UTILITY METHODS - دوال مساعدة
//   // ============================================

//   _generatePurchaseInvoiceNumber() {
//     if (!this.data.purchases || this.data.purchases.length === 0) {
//       return 5001;
//     }
//     const maxInvoice = Math.max(...this.data.purchases.map(p => p.invoice_no || 0));
//     return maxInvoice + 1;
//   }

//   _getPaymentStatus(paid, total) {
//     if (paid >= total) return 'مدفوعة كلياً';
//     if (paid > 0) return 'مدفوعة جزئياً';
//     return 'غير مدفوعة';
//   }

//   _getPurchaseStatus(paid, total) {
//     if (paid >= total) return 'مكتملة';
//     if (paid > 0) return 'معلقة';
//     return 'معلقة';
//   }

//   // ============================================
//   // REPORTS AND STATISTICS - التقارير والإحصائيات
//   // ============================================

//   getAllPurchasesByDateRange(startDate, endDate) {
//     if (!this.data.purchases) return [];
//     return this.data.purchases.filter(purchase => 
//       purchase.purchase_date >= startDate && purchase.purchase_date <= endDate
//     );
//   }

//   getAllPurchasesBySupplier(supplierId) {
//     if (!this.data.purchases) return [];
//     return this.data.purchases.filter(purchase => purchase.supplier_id === supplierId);
//   }

//   getTotalPurchasesByDate(date) {
//     if (!this.data.purchases) return 0;
//     const dailyPurchases = this.data.purchases.filter(purchase => purchase.purchase_date === date);
//     return dailyPurchases.reduce((sum, purchase) => sum + (purchase.total || 0), 0);
//   }

//   getPurchaseStatistics() {
//     if (!this.data.purchases) {
//       return {
//         totalPurchases: 0,
//         totalAmount: 0,
//         pendingPayments: 0,
//         completedPurchases: 0
//       };
//     }

//     const totalPurchases = this.data.purchases.length;
//     const totalAmount = this.data.purchases.reduce((sum, p) => sum + (p.total || 0), 0);
//     const pendingPayments = this.data.purchases.reduce((sum, p) => sum + (p.balance_due || 0), 0);
//     const completedPurchases = this.data.purchases.filter(p => p.status === 'مكتملة').length;

//     return {
//       totalPurchases,
//       totalAmount,
//       pendingPayments,
//       completedPurchases
//     };
//   }

//   // ============================================
//   // SUPPLIER BALANCE METHODS - دوال أرصدة الموردين
//   // ============================================

//   calculateSupplierBalance(supplierId) {
//     if (!this.data.purchases) return 0;
    
//     const supplierPurchases = this.data.purchases.filter(p => p.supplier_id === supplierId);
//     const balance = supplierPurchases.reduce((sum, purchase) => {
//       return sum + (purchase.balance_due || 0);
//     }, 0);
    
//     return balance;
//   }

//   getSupplierPurchases(supplierId) {
//     if (!this.data.purchases) return [];
//     return this.data.purchases.filter(p => p.supplier_id === supplierId);
//   }

//   getSupplierWithBalance(supplierId) {
//     // هذه الدالة تحتاج إلى SupplierHandler - سنعيد بيانات أساسية حالياً
//     const supplierPurchases = this.getSupplierPurchases(supplierId);
//     const balance = this.calculateSupplierBalance(supplierId);
    
//     return {
//       id: supplierId,
//       balance: balance,
//       total_purchases: supplierPurchases.length,
//       total_amount: supplierPurchases.reduce((sum, p) => sum + (p.total || 0), 0)
//     };
//   }

//   getAllSuppliersWithBalances() {
//     if (!this.data.purchases) return [];
    
//     // تجميع بيانات الموردين من المشتريات
//     const supplierMap = new Map();
    
//     this.data.purchases.forEach(purchase => {
//       if (purchase.supplier_id) {
//         if (!supplierMap.has(purchase.supplier_id)) {
//           supplierMap.set(purchase.supplier_id, {
//             id: purchase.supplier_id,
//             name: purchase.supplier_name || 'مورد غير معروف',
//             balance: 0,
//             total_purchases: 0,
//             total_amount: 0
//           });
//         }
        
//         const supplier = supplierMap.get(purchase.supplier_id);
//         supplier.balance += purchase.balance_due || 0;
//         supplier.total_purchases += 1;
//         supplier.total_amount += purchase.total || 0;
//       }
//     });
    
//     return Array.from(supplierMap.values());
//   }
// }

// module.exports = PurchaseHandler;


const BaseHandler = require('./base-handler');

class PurchaseHandler extends BaseHandler {
}

module.exports = PurchaseHandler;