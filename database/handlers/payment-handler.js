const BaseHandler = require('./base-handler');

class PaymentHandler extends BaseHandler {
  getPayments() {
    if (!this.data.payments_received) {
      this.data.payments_received = [];
      this.data.payments_made = [];
    }
    return {
      received: this.data.payments_received,
      made: this.data.payments_made
    };
  }

  addPaymentReceived(payment) {
    if (!this.data.payments_received) {
      this.data.payments_received = [];
    }
    
    const newPayment = {
      id: this._getNextId('payments_received'),
      ...payment,
      createdAt: new Date().toISOString(),
      type: 'received'
    };
    
    this.data.payments_received.push(newPayment);
    this.saveData();
    return newPayment;
  }

  addPaymentMade(payment) {
    if (!this.data.payments_made) {
      this.data.payments_made = [];
    }
    
    const newPayment = {
      id: this._getNextId('payments_made'),
      ...payment,
      createdAt: new Date().toISOString(),
      type: 'made'
    };
    
    this.data.payments_made.push(newPayment);
    this.saveData();
    return newPayment;
  }

  updatePayment(id, payment, type = 'received') {
    const collection = type === 'received' ? 'payments_received' : 'payments_made';
    const index = (this.data[collection] || []).findIndex(p => p.id === id);
    if (index !== -1) {
      this.data[collection][index] = { 
        ...this.data[collection][index], 
        ...payment,
        updatedAt: new Date().toISOString()
      };
      this.saveData();
      return this.data[collection][index];
    }
    return null;
  }

  deletePayment(id, type = 'received') {
    const collection = type === 'received' ? 'payments_received' : 'payments_made';
    const initialLength = (this.data[collection] || []).length;
    this.data[collection] = (this.data[collection] || []).filter(p => p.id !== id);
    this.saveData();
    return { changes: initialLength - this.data[collection].length };
  }

  getCustomerPayments(customerId) {
    return (this.data.payments_received || []).filter(p => p.customer_id === customerId);
  }

  getSupplierPayments(supplierId) {
    return (this.data.payments_made || []).filter(p => p.supplier_id === supplierId);
  }
}

module.exports = PaymentHandler;