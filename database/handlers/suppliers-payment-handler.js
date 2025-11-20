const BaseHandler = require("./base-handler");

class SupplierPaymentHandler extends BaseHandler {
  constructor(filePath, supplierHandler) {
    super(filePath);
    this.supplierHandler = supplierHandler; // ⭐ ربط الموردين
  }

  getAllSupplierPayments() {
    if (!this.data.payments_made) {
      this.data.payments_made = [];
    }
    return this.data.payments_made;
  }

  // ⭐ 2) إضافة دفعة جديدة للمورد
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

    // ⭐ تحديث رصيد المورد ← المورد رصيده بيزيد لما أدفع له
    if (payment.supplierId && payment.amount) {
      this.updateSupplierBalance(payment.supplierId, payment.amount, true);
    }

    this.saveData();
    return newPayment;
  }

  // ⭐ 3) تعديل دفعة مورد
  updateSupplierPayment(id, payment) {
    const collection = "payments_made";

    const index = (this.data[collection] || []).findIndex(p => p.id === id);

    if (index !== -1) {
      const oldPayment = this.data[collection][index];

      // استرجاع الرصيد القديم
      if (oldPayment.supplierId && oldPayment.amount) {
        this.updateSupplierBalance(oldPayment.supplierId, -oldPayment.amount, false);
      }

      this.data[collection][index] = {
        ...this.data[collection][index],
        ...payment,
        updatedAt: new Date().toISOString()
      };

      // تطبيق التعديل الجديد
      if (payment.supplierId && payment.amount) {
        this.updateSupplierBalance(payment.supplierId, payment.amount, true);
      }

      this.saveData();
      return this.data[collection][index];
    }

    return null;
  }

  // ⭐ 4) حذف دفعة مورد
  deleteSupplierPayment(id) {
    const collection = "payments_made";
    const payments = this.data[collection] || [];

    const paymentIndex = payments.findIndex(p => p.id === id);

    if (paymentIndex !== -1) {
      const payment = payments[paymentIndex];

      // استرجاع الأموال عند الحذف
      if (payment.supplierId && payment.amount) {
        this.updateSupplierBalance(payment.supplierId, -payment.amount, false);
      }

      this.data[collection] = payments.filter(p => p.id !== id);

      this.saveData();
      return { changes: 1 };
    }

    return { changes: 0 };
  }

  // ⭐ تحديث رصيد المورد
  updateSupplierBalance(supplierId, amount, isPaymentMade = true) {
    if (!this.supplierHandler) {
      console.warn("SupplierHandler not available");
      return 0;
    }

    try {
      const supplier = this.supplierHandler.getSupplierById(supplierId);

      if (supplier) {
        // دفعة للمورد → رصيده بيزيد
        const newBalance = (supplier.balance || 0) + amount;
        supplier.balance = newBalance;
        supplier.updatedAt = new Date().toISOString();

        console.log(`💸 تحديث رصيد المورد ${supplierId}: ${supplier.balance - amount} → ${newBalance}`);

        this.supplierHandler.saveData();
        return newBalance;
      } else {
        console.warn(`Supplier ${supplierId} not found`);
        return 0;
      }

    } catch (error) {
      console.error("Error updating supplier balance:", error);
      return 0;
    }
  }

  // ⭐ كل دفعات مورد واحد
  getSupplierPayments(supplierId) {
    return (this.data.payments_made || []).filter(
      p => p.supplierId === supplierId || p.supplier_id === supplierId
    );
  }
}

module.exports = SupplierPaymentHandler;
