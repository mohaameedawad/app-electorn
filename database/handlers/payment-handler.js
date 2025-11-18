// const BaseHandler = require('./base-handler');

// class PaymentHandler extends BaseHandler {
//   // ============================================
//   // PAYMENT METHODS - دوال المدفوعات العامة
//   // ============================================

//   getPayments() {
//     if (!this.data.payments) {
//       this.data.payments = [];
//     }
//     return this.data.payments;
//   }

//   addPayment(payment) {
//     if (!this.data.payments) {
//       this.data.payments = [];
//     }
    
//     const id = this._getNextId("payments");
//     const newPayment = {
//       id,
//       type: payment.type || 'general',
//       amount: payment.amount || 0,
//       date: payment.date || new Date().toISOString().slice(0, 10),
//       description: payment.description || '',
//       created_at: new Date().toISOString(),
//       ...payment
//     };

//     this.data.payments.push(newPayment);
//     this.saveData();
//     return { lastInsertRowid: id, changes: 1, row: newPayment };
//   }

//   updatePayment(id, payment) {
//     if (!this.data.payments) {
//       this.data.payments = [];
//     }
    
//     const idx = this.data.payments.findIndex(p => p.id === id);
//     if (idx === -1) return { changes: 0 };

//     this.data.payments[idx] = {
//       ...this.data.payments[idx],
//       ...payment
//     };

//     this.saveData();
//     return { changes: 1, row: this.data.payments[idx] };
//   }

//   deletePayment(id) {
//     if (!this.data.payments) {
//       this.data.payments = [];
//     }
    
//     const idx = this.data.payments.findIndex(p => p.id === id);
//     if (idx === -1) return { changes: 0 };

//     this.data.payments.splice(idx, 1);
//     this.saveData();
//     return { changes: 1 };
//   }

//   // ============================================
//   // PAYMENTS RECEIVED - الدفعات المستلمة (سندات القبض)
//   // ============================================

//   getPaymentsReceived() {
//     if (!this.data.payments_received) {
//       this.data.payments_received = [];
//     }
//     return this.data.payments_received;
//   }

//   addPaymentReceived(payment) {
//     if (!this.data.payments_received) {
//       this.data.payments_received = [];
//     }
    
//     const id = this._getNextId("payments_received");
//     const newPayment = {
//       id,
//       receipt_number: payment.receiptNumber || this._generateReceiptNumber(),
//       customer_name: payment.customerName || '',
//       date: payment.date || new Date().toISOString().slice(0, 10),
//       amount: payment.amount || 0,
//       notes: payment.notes || '',
//       created_at: new Date().toISOString(),
//       ...payment
//     };

//     this.data.payments_received.push(newPayment);
//     this.saveData();
//     return { lastInsertRowid: id, changes: 1, row: newPayment };
//   }

//   updatePaymentReceived(id, payment) {
//     if (!this.data.payments_received) {
//       this.data.payments_received = [];
//     }
    
//     const idx = this.data.payments_received.findIndex(p => p.id === id);
//     if (idx === -1) return { changes: 0 };

//     this.data.payments_received[idx] = {
//       ...this.data.payments_received[idx],
//       ...payment
//     };

//     this.saveData();
//     return { changes: 1, row: this.data.payments_received[idx] };
//   }

//   deletePaymentReceived(id) {
//     if (!this.data.payments_received) {
//       this.data.payments_received = [];
//     }
    
//     const idx = this.data.payments_received.findIndex(p => p.id === id);
//     if (idx === -1) return { changes: 0 };

//     this.data.payments_received.splice(idx, 1);
//     this.saveData();
//     return { changes: 1 };
//   }

//   // ============================================
//   // SUPPLIER PAYMENTS - مدفوعات الموردين (سندات الصرف)
//   // ============================================

//   getSupplierPayments() {
//     if (!this.data.supplier_payments) {
//       this.data.supplier_payments = [];
//     }
//     return this.data.supplier_payments;
//   }

//   addSupplierPayment(payment) {
//     if (!this.data.supplier_payments) {
//       this.data.supplier_payments = [];
//     }
    
//     const id = this._getNextId("supplier_payments");
//     const newPayment = {
//       id,
//       supplier_name: payment.supplierName || '',
//       date: payment.date || new Date().toISOString().slice(0, 10),
//       amount: payment.amount || 0,
//       notes: payment.notes || '',
//       created_at: new Date().toISOString(),
//       ...payment
//     };

//     this.data.supplier_payments.push(newPayment);
//     this.saveData();
//     return { lastInsertRowid: id, changes: 1, row: newPayment };
//   }

//   updateSupplierPayment(id, payment) {
//     if (!this.data.supplier_payments) {
//       this.data.supplier_payments = [];
//     }
    
//     const idx = this.data.supplier_payments.findIndex(p => p.id === id);
//     if (idx === -1) return { changes: 0 };

//     this.data.supplier_payments[idx] = {
//       ...this.data.supplier_payments[idx],
//       ...payment
//     };

//     this.saveData();
//     return { changes: 1, row: this.data.supplier_payments[idx] };
//   }

//   deleteSupplierPayment(id) {
//     if (!this.data.supplier_payments) {
//       this.data.supplier_payments = [];
//     }
    
//     const idx = this.data.supplier_payments.findIndex(p => p.id === id);
//     if (idx === -1) return { changes: 0 };

//     this.data.supplier_payments.splice(idx, 1);
//     this.saveData();
//     return { changes: 1 };
//   }

//   // ============================================
//   // UTILITY METHODS - دوال مساعدة
//   // ============================================

//   _generateReceiptNumber() {
//     if (!this.data.payments_received || this.data.payments_received.length === 0) {
//       return 'RC-0001';
//     }
//     const maxNumber = Math.max(...this.data.payments_received.map(p => {
//       const num = parseInt(p.receipt_number?.split('-')[1] || '0');
//       return num;
//     }));
//     return `RC-${String(maxNumber + 1).padStart(4, '0')}`;
//   }
// }

// module.exports = PaymentHandler;

const BaseHandler = require('./base-handler');

class PaymentHandler extends BaseHandler {
}

module.exports = PaymentHandler;
