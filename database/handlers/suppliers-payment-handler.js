const BaseHandler = require("./base-handler");

class SupplierPaymentHandler extends BaseHandler {
  constructor(filePath, supplierHandler) {
    super(filePath);
    this.supplierHandler = supplierHandler;
  }

  getAllSupplierPayments() {
    if (!this.data.payments_made) {
      this.data.payments_made = [];
    }
    return this.data.payments_made;
  }

  // -------------------------------
  // ADD PAYMENT (PAY TO SUPPLIER)
  // -------------------------------

  addSupplierPayment(payment) {
    if (!this.data.payments_made) {
      this.data.payments_made = [];
    }

    const newPayment = {
      id: this._getNextId("payments_made"),
      ...payment,
      createdAt: new Date().toISOString(),
      type: "made",
    };

    this.data.payments_made.push(newPayment);

    // الدفع للمورد → تقليل الرصيد
    if (payment.supplierId && payment.amount) {
      this.updateSupplierBalance(payment.supplierId, payment.amount, "pay");
    }

    this.saveData();
    return newPayment;
  }

  // -------------------------------
  // UPDATE PAYMENT
  // -------------------------------

  updateSupplierPayment(id, payment) {
    const collection = "payments_made";
    const index = (this.data[collection] || []).findIndex((p) => p.id === id);

    if (index !== -1) {
      const oldPayment = this.data[collection][index];

      // STEP 1: Rollback old payment → تعويضها
      if (oldPayment.supplierId && oldPayment.amount) {
        this.updateSupplierBalance(
          oldPayment.supplierId,
          oldPayment.amount,
          "rollback"
        );
      }

      // STEP 2: Apply new update
      this.data[collection][index] = {
        ...oldPayment,
        ...payment,
        updatedAt: new Date().toISOString(),
      };

      // STEP 3: Apply new payment amount
      if (payment.supplierId && payment.amount) {
        this.updateSupplierBalance(payment.supplierId, payment.amount, "pay");
      }

      this.saveData();
      return this.data[collection][index];
    }

    return null;
  }


  deleteSupplierPayment(id) {
    const collection = "payments_made";
    const payments = this.data[collection] || [];

    const paymentIndex = payments.findIndex((p) => p.id === id);

    if (paymentIndex !== -1) {
      const payment = payments[paymentIndex];

      // حذف الدفعة → رجّع المبلغ (يزوّد الرصيد)
      if (payment.supplierId && payment.amount) {
        this.updateSupplierBalance(payment.supplierId, payment.amount, "rollback");
      }

      // حذف من القائمة
      this.data[collection] = payments.filter((p) => p.id !== id);

      this.saveData();
      return { changes: 1 };
    }

    return { changes: 0 };
  }


  updateSupplierBalance(supplierId, amount, mode = "pay") {
    if (!this.supplierHandler) return 0;

    try {
      const supplier = this.supplierHandler.getSupplierById(supplierId);

      if (supplier) {
        if (mode === "pay") {
          supplier.balance = (supplier.balance || 0) - amount; // تقليل الدين
        } else {
          supplier.balance = (supplier.balance || 0) + amount; // رجوع الدين
        }

        supplier.updatedAt = new Date().toISOString();
        this.supplierHandler.saveData();
        return supplier.balance;
      }

      return 0;
    } catch {
      return 0;
    }
  }


  getSupplierPayments(supplierId) {
    return (this.data.payments_made || []).filter(
      (p) => p.supplierId === supplierId || p.supplier_id === supplierId
    );
  }
}

module.exports = SupplierPaymentHandler;
