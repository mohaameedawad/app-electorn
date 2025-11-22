const BaseHandler = require("./base-handler");

class PaymentHandler extends BaseHandler {
  constructor(filePath, customerHandler) {
    super(filePath);
    this.customerHandler = customerHandler; // 🔹 إضافة reference للـ CustomerHandler
  }

  getAllCustomerPayments() {
    if (!this.data.customerPayments_received) {
      this.data.customerPayments_received = [];
    }
    return this.data.customerPayments_received;
  }

  addCustomerPaymentReceived(payment) {
    if (!this.data.customerPayments_received) {
      this.data.customerPayments_received = [];
    }

    const newPayment = {
      id: this._getNextId("customerPayments_received"),
      ...payment,
      createdAt: new Date().toISOString(),
      type: "received",
    };

    this.data.customerPayments_received.push(newPayment);

    // 🔹 تحديث رصيد العميل تلقائياً
    if (payment.customerId) {
      this.updateCustomerBalance(payment.customerId, -payment.amount, true);
    }

    this.saveData();
    return newPayment;
  }

  addPaymentMade(payment) {
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
    this.saveData();
    return newPayment;
  }

  updateCustomerPayment(id, payment) {
    const collection = "customerPayments_received";

    const index = (this.data[collection] || []).findIndex((p) => p.id === id);

    if (index !== -1) {
      const oldPayment = this.data[collection][index];

      // 🔹 استعادة الرصيد القديم أولاً
      if (oldPayment.customerId && oldPayment.amount) {
        this.updateCustomerBalance(
          oldPayment.customerId,
          oldPayment.amount,
          false
        );
      }

      this.data[collection][index] = {
        ...this.data[collection][index],
        ...payment,
        updatedAt: new Date().toISOString(),
      };

      // 🔹 تطبيق الرصيد الجديد
      if (payment.customerId && payment.amount) {
        this.updateCustomerBalance(payment.customerId, -payment.amount, true);
      }

      this.saveData();
      return this.data[collection][index];
    }
    return null;
  }

  deleteCustomerPayment(id) {
    const collection = "customerPayments_received";

    const payments = this.data[collection] || [];
    const paymentIndex = payments.findIndex((p) => p.id === id);

    if (paymentIndex !== -1) {
      const payment = payments[paymentIndex];

      // 🔹 استعادة رصيد العميل عند الحذف
      if (payment.customerId && payment.amount) {
        this.updateCustomerBalance(payment.customerId, payment.amount, false);
      }

      this.data[collection] = payments.filter((p) => p.id !== id);
      this.saveData();
      return { changes: 1 };
    }
    return { changes: 0 };
  }

  // 🔹 دالة محدثة لتحديث رصيد العميل
  updateCustomerBalance(customerId, amount, isPaymentReceived = true) {
    if (!this.customerHandler) {
      console.warn("CustomerHandler not available");
      return 0;
    }

    try {
      // استخدام الـ CustomerHandler لتحديث الرصيد
      const customer = this.customerHandler.getCustomerById(customerId);
      if (customer) {
        // amount بيكون سالب علشان نخفض المديونية
        // payment received -> amount سالب -> balance بيتنقص
        const newBalance = (customer.balance || 0) + amount;
        customer.balance = newBalance;
        customer.updatedAt = new Date().toISOString();

        console.log(
          `💰 تحديث رصيد العميل ${customerId}: ${
            customer.balance - amount
          } → ${newBalance}`
        );

        // حفظ التغييرات في الـ CustomerHandler
        this.customerHandler.saveData();
        return newBalance;
      } else {
        console.warn(`Customer ${customerId} not found`);
        return 0;
      }
    } catch (error) {
      console.error("Error updating customer balance:", error);
      return 0;
    }
  }

  getCustomerPayments(customerId) {
    return (this.data.customerPayments_received || []).filter(
      (p) => p.customer_id === customerId || p.customerId === customerId
    );
  }

  getSupplierPayments(supplierId) {
    return (this.data.payments_made || []).filter(
      (p) => p.supplierId === supplierId
    );
  }

  getCustomerBalance(customerId) {
    if (!this.customerHandler) return 0;

    const customer = this.customerHandler.getCustomerById(customerId);
    return customer ? customer.balance || 0 : 0;
  }

  // 🔹 دالة للحصول على إحصائيات المدفوعات
  getPaymentStatistics(startDate, endDate) {
    const received = this.data.customerPayments_received || [];
    const made = this.data.payments_made || [];

    const filteredReceived = received.filter((p) => {
      const paymentDate = new Date(p.date || p.createdAt);
      return (
        paymentDate >= new Date(startDate) && paymentDate <= new Date(endDate)
      );
    });

    const filteredMade = made.filter((p) => {
      const paymentDate = new Date(p.date || p.createdAt);
      return (
        paymentDate >= new Date(startDate) && paymentDate <= new Date(endDate)
      );
    });

    return {
      totalReceived: filteredReceived.reduce(
        (sum, p) => sum + (p.amount || 0),
        0
      ),
      totalMade: filteredMade.reduce((sum, p) => sum + (p.amount || 0), 0),
      receivedCount: filteredReceived.length,
      madeCount: filteredMade.length,
      netCashFlow:
        filteredReceived.reduce((sum, p) => sum + (p.amount || 0), 0) -
        filteredMade.reduce((sum, p) => sum + (p.amount || 0), 0),
    };
  }
}

module.exports = PaymentHandler;
