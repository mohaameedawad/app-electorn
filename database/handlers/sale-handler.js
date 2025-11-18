// const BaseHandler = require('./base-handler');

// class SaleHandler extends BaseHandler {
//   // ============================
//   // BASIC SALE METHODS
//   // ============================
  
//   getAllSales() {
//     if (!this.data.sales) {
//       this.data.sales = [];
//     }
//     return this.data.sales;
//   }

//   getSaleById(id) {
//     if (!this.data.sales) return null;
//     return this.data.sales.find(s => s.id === id);
//   }

//   addSale(sale) {
//     if (!this.data.sales) {
//       this.data.sales = [];
//     }
    
//     const id = this._getNextId("sales");
//     const newSale = {
//       id,
//       invoice_no: sale.invoice_no || this._generateInvoiceNumber(),
//       customer_id: sale.customer_id || null,
//       employee_id: sale.employee_id || null,
//       sale_date: sale.sale_date || new Date().toISOString().slice(0, 10),
//       items: sale.items || [],
//       subtotal: sale.subtotal || 0,
//       discount: sale.discount || 0,
//       tax: sale.tax || 0,
//       total: sale.total || 0,
//       paid_amount: sale.paid_amount || 0,
//       balance_due: (sale.total || 0) - (sale.paid_amount || 0),
//       status: sale.paid_amount >= sale.total ? 'مدفوعة' : 'معلقة',
//       payment_status: this._getPaymentStatus(sale.paid_amount, sale.total),
//       notes: sale.notes || '',
//       created_at: new Date().toISOString(),
//       ...sale
//     };

//     this.data.sales.push(newSale);
//     this.saveData();
//     return { lastInsertRowid: id, changes: 1, row: newSale };
//   }

//   updateSale(id, sale) {
//     if (!this.data.sales) {
//       this.data.sales = [];
//     }
    
//     const idx = this.data.sales.findIndex(s => s.id === id);
//     if (idx === -1) return { changes: 0 };

//     // حساب الرصيد المستحق
//     const balance_due = (sale.total || 0) - (sale.paid_amount || 0);
//     const payment_status = this._getPaymentStatus(sale.paid_amount, sale.total);

//     this.data.sales[idx] = {
//       ...this.data.sales[idx],
//       ...sale,
//       balance_due: balance_due,
//       payment_status: payment_status,
//       status: sale.paid_amount >= sale.total ? 'مدفوعة' : 'معلقة'
//     };

//     this.saveData();
//     return { changes: 1, row: this.data.sales[idx] };
//   }

//   deleteSale(id) {
//     if (!this.data.sales) {
//       this.data.sales = [];
//     }
    
//     const idx = this.data.sales.findIndex(s => s.id === id);
//     if (idx === -1) return { changes: 0 };

//     this.data.sales.splice(idx, 1);
//     this.saveData();
//     return { changes: 1 };
//   }

//   // ============================
//   // PAYMENT PROCESSING
//   // ============================
  
//   processSalePayment(saleId, paymentAmount, paymentMethod = 'cash') {
//     const sale = this.getSaleById(saleId);
//     if (!sale) return { success: false, error: 'Sale not found' };

//     const newPaidAmount = (sale.paid_amount || 0) + paymentAmount;
//     const balance_due = (sale.total || 0) - newPaidAmount;
//     const payment_status = this._getPaymentStatus(newPaidAmount, sale.total);

//     // تحديث الفاتورة
//     sale.paid_amount = newPaidAmount;
//     sale.balance_due = balance_due;
//     sale.payment_status = payment_status;
//     sale.status = newPaidAmount >= sale.total ? 'مدفوعة' : 'معلقة';

//     // تسجيل الدفعة
//     if (!this.data.payments_received) {
//       this.data.payments_received = [];
//     }

//     const paymentId = this._getNextId("payments_received");
//     this.data.payments_received.push({
//       id: paymentId,
//       sale_id: saleId,
//       customer_id: sale.customer_id,
//       amount: paymentAmount,
//       payment_method: paymentMethod,
//       payment_date: new Date().toISOString().slice(0, 10),
//       notes: `دفعة للفاتورة رقم ${sale.invoice_no}`,
//       created_at: new Date().toISOString()
//     });

//     this.saveData();
    
//     return {
//       success: true,
//       sale: sale,
//       paymentId: paymentId,
//       newBalance: balance_due
//     };
//   }

//   // ============================
//   // COMPLETE SALE PROCESS
//   // ============================
  
//   completeSale(saleData, productHandler, customerHandler) {
//     // 1. التحقق من المخزون
//     const stockValidation = productHandler.validateStockForSale(saleData.items);
//     if (!stockValidation.valid) {
//       return { 
//         success: false, 
//         error: 'Insufficient stock', 
//         details: stockValidation 
//       };
//     }

//     // 2. التحقق من الحد الائتماني للعميل
//     if (saleData.customer_id) {
//       const creditCheck = customerHandler.checkCreditLimit(
//         saleData.customer_id, 
//         saleData.total
//       );
//       if (!creditCheck.valid) {
//         return { 
//           success: false, 
//           error: 'Credit limit exceeded', 
//           details: creditCheck 
//         };
//       }
//     }

//     // 3. إضافة الفاتورة
//     const saleResult = this.addSale(saleData);
//     if (!saleResult.changes) {
//       return { success: false, error: 'Failed to create sale' };
//     }

//     const saleId = saleResult.lastInsertRowid;

//     // 4. خصم الكمية من المخزون
//     const stockResult = productHandler.processSaleStock(saleId, saleData.items);
//     if (!stockResult.success) {
//       // إذا فشل تحديث المخزون، احذف الفاتورة
//       this.deleteSale(saleId);
//       return { 
//         success: false, 
//         error: 'Failed to update stock', 
//         details: stockResult 
//       };
//     }

//     // 5. تحديث رصيد العميل
//     if (saleData.customer_id) {
//       const balanceResult = customerHandler.addSaleToCustomerBalance(
//         saleData.customer_id, 
//         saleData.total
//       );
//       if (!balanceResult.success) {
//         // إذا فشل تحديث الرصيد، ارجع المخزون واحذف الفاتورة
//         productHandler.reverseSaleStock(saleId);
//         this.deleteSale(saleId);
//         return { 
//           success: false, 
//           error: 'Failed to update customer balance', 
//           details: balanceResult 
//         };
//       }
//     }

//     // 6. معالجة الدفعة إذا كانت مدفوعة جزئياً أو كلياً
//     if (saleData.paid_amount > 0) {
//       this.processSalePayment(saleId, saleData.paid_amount, saleData.payment_method || 'cash');
//     }

//     return {
//       success: true,
//       saleId: saleId,
//       sale: saleResult.row,
//       stockUpdate: stockResult,
//       balanceUpdate: saleData.customer_id ? balanceResult : null
//     };
//   }

//   // ============================
//   // UTILITY METHODS
//   // ============================
  
//   _generateInvoiceNumber() {
//     if (!this.data.sales || this.data.sales.length === 0) {
//       return 1001;
//     }
//     const maxInvoice = Math.max(...this.data.sales.map(s => s.invoice_no || 0));
//     return maxInvoice + 1;
//   }

//   _getPaymentStatus(paid, total) {
//     if (paid >= total) return 'مدفوعة كلياً';
//     if (paid > 0) return 'مدفوعة جزئياً';
//     return 'غير مدفوعة';
//   }

//   // ============================
//   // REPORTS AND STATISTICS
//   // ============================
  
//   getAllSalesByDateRange(startDate, endDate) {
//     if (!this.data.sales) return [];
//     return this.data.sales.filter(sale => 
//       sale.sale_date >= startDate && sale.sale_date <= endDate
//     );
//   }

//   getAllSalesByCustomer(customerId) {
//     if (!this.data.sales) return [];
//     return this.data.sales.filter(sale => sale.customer_id === customerId);
//   }

//   getTotalSalesByDate(date) {
//     if (!this.data.sales) return 0;
//     const dailySales = this.data.sales.filter(sale => sale.sale_date === date);
//     return dailySales.reduce((sum, sale) => sum + (sale.total || 0), 0);
//   }
// }

// module.exports = SaleHandler;


const BaseHandler = require('./base-handler');

class SaleHandler extends BaseHandler {
}

module.exports = SaleHandler;