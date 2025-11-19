const BaseHandler = require("./base-handler");

class SaleHandler extends BaseHandler {
  getAllSales() {
    return this.data.sales || [];
  }

  getSaleById(id) {
    return this.getAllSales().find((s) => s.id === id);
  }

  getSaleItems(saleId) {
    return (this.data.sale_items || []).filter(
      (item) => item.sale_id === saleId
    );
  }

  addSale(sale) {
    if (!this.data.sales) this.data.sales = [];
    if (!this.data.sale_items) this.data.sale_items = [];

    const newSale = {
      id: this._getNextId("sales"),
      ...sale,
      createdAt: new Date().toISOString(),
      status: sale.status || "معلقة",
      remaining_amount: (sale.total || 0) - (sale.paid_amount || 0),
    };

    this.data.sales.push(newSale);

    // Add sale items
    if (sale.items && Array.isArray(sale.items)) {
      sale.items.forEach((item) => {
        const newItem = {
          id: this._getNextId("sale_items"),
          sale_id: newSale.id,
          ...item,
        };
        this.data.sale_items.push(newItem);

        // 🔹 تحديث المخزون - تقليل كمية المنتج
        this.updateProductStockOnSale(item.product_id, item.quantity);
      });
    }

    // 🔹 تحديث رصيد العميل
    this.updateCustomerBalance(
      sale.customer_id,
      (sale.total || 0) - (sale.paid_amount || 0)
    );

    this.saveData();
    return { lastInsertRowid: newSale.id, changes: 1 };
  }

  updateSale(id, sale) {
    const index = this.getAllSales().findIndex((s) => s.id === id);

    if (index !== -1) {
      // 🔹 الحصول على الفاتورة القديمة
      const oldSale = this.data.sales[index];

      // 🔹 معالجة items إذا كانت string
      let oldItems = [];
      try {
        oldItems =
          typeof oldSale.items === "string"
            ? JSON.parse(oldSale.items)
            : oldSale.items || [];
      } catch (error) {
        console.error("❌ خطأ في تحليل items القديمة:", error);
        oldItems = oldSale.items || [];
      }

      let newItems = [];
      try {
        newItems =
          typeof sale.items === "string"
            ? JSON.parse(sale.items)
            : sale.items || [];
      } catch (error) {
        console.error("❌ خطأ في تحليل items الجديدة:", error);
        newItems = sale.items || [];
      }
      // 🔹 تحديث المخزون بناءً على التغير في الكميات
      this.updateStockOnEdit(oldItems, newItems);

      // 🔹 حساب الفرق في المديونية
      const oldTotal = parseFloat(oldSale.total) || 0;
      const oldPaid = parseFloat(oldSale.paid_amount) || 0;
      const newTotal = parseFloat(sale.total) || 0;
      const newPaid = parseFloat(sale.paid_amount) || 0;

      const oldRemaining = oldTotal - oldPaid;
      const newRemaining = newTotal - newPaid;
      const balanceDiff = newRemaining - oldRemaining;

      console.log("💰 حساب المديونية:", {
        oldTotal,
        oldPaid,
        newTotal,
        newPaid,
        oldRemaining,
        newRemaining,
        balanceDiff,
      });

      // 🔹 تحديث رصيد العميل
      if (balanceDiff !== 0 && sale.customer_id) {
        this.updateCustomerBalance(sale.customer_id, balanceDiff);
      }

      // 🔹 تحديث الفاتورة - الحفاظ على البيانات الأساسية
      this.data.sales[index] = {
        ...this.data.sales[index], // الحفاظ على البيانات القديمة
        ...sale, // تطبيق التحديثات الجديدة
        id: oldSale.id, // الحفاظ على ال ID
        createdAt: oldSale.createdAt, // الحفاظ على تاريخ الإنشاء
        remaining_amount: newRemaining,
        updatedAt: new Date().toISOString(),
      };

      this.saveData();
      console.log("✅ تم تحديث الفاتورة بنجاح");
      return { changes: 1 };
    }

    console.log("❌ لم يتم العثور على الفاتورة للتحديث");
    return { changes: 0 };
  }

  deleteSale(id) {
    const initialLength = this.getAllSales().length;
    const saleToDelete = this.getSaleById(id);

    if (saleToDelete) {
      // 🔹 استعادة المخزون عند حذف الفاتورة
      const items =
        typeof saleToDelete.items === "string"
          ? JSON.parse(saleToDelete.items)
          : saleToDelete.items || [];

      items.forEach((item) => {
        this.updateProductStockOnSale(item.product_id, -item.quantity);
      });

      // 🔹 استعادة رصيد العميل (خصم المديونية)
      const remainingAmount =
        saleToDelete.remaining_amount ||
        (saleToDelete.total || 0) - (saleToDelete.paid_amount || 0);
      this.updateCustomerBalance(saleToDelete.customer_id, -remainingAmount);
    }

    this.data.sales = this.getAllSales().filter((s) => s.id !== id);
    // Also delete related sale items
    this.data.sale_items = (this.data.sale_items || []).filter(
      (item) => item.sale_id !== id
    );
    this.saveData();
    return { changes: initialLength - this.getAllSales().length };
  }

  // 🔹 دالة لتحديث رصيد العميل
  updateCustomerBalance(customerId, amount) {
    if (!this.data.customers || !customerId) return;

    const customerIndex = this.data.customers.findIndex(
      (c) => c.id === customerId
    );
    if (customerIndex !== -1) {
      const currentBalance = this.data.customers[customerIndex].balance || 0;
      this.data.customers[customerIndex].balance = currentBalance + amount;

      console.log(
        `🔄 تم تحديث رصيد العميل ${customerId}: ${currentBalance} → ${this.data.customers[customerIndex].balance}`
      );
    }
  }

  // 🔹 دالة لتحديث مخزون المنتج
  updateProductStockOnSale(productId, quantity) {
    if (!this.data.products) {
      console.log("❌ لا توجد منتجات في قاعدة البيانات");
      return;
    }

    const productIndex = this.data.products.findIndex(
      (p) => p.id === productId
    );
    if (productIndex !== -1) {
      const currentStock =
        parseFloat(this.data.products[productIndex].stock) || 0;

      // 🔹 البيع يقلل المخزون
      const newStock = Math.max(0, currentStock - quantity);

      console.log(
        `💰 [بيع] تحديث مخزون المنتج ${productId}: ${currentStock} - ${quantity} = ${newStock}`
      );

      this.data.products[productIndex].stock = newStock;

      // 🔹 تسجيل حركة المخزون
      this.addStockMovement({
        product_id: productId,
        type: "sale",
        quantity: -quantity, // سالب لأنها خصم
        reference_id: productId,
        note: `خصم مخزون لفاتورة بيع (${quantity})`,
      });
    } else {
      console.log(`❌ المنتج ${productId} غير موجود`);
    }
  }

  // 🔹 دالة لتحديث المخزون عند التعديل
  updateStockOnEdit(oldItems, newItems) {
    const oldItemsMap = new Map();
    const newItemsMap = new Map();

    oldItems.forEach((item) => oldItemsMap.set(item.product_id, item.quantity));
    newItems.forEach((item) => newItemsMap.set(item.product_id, item.quantity));

    const allProductIds = new Set([
      ...oldItemsMap.keys(),
      ...newItemsMap.keys(),
    ]);

    allProductIds.forEach((productId) => {
      const oldQty = oldItemsMap.get(productId) || 0;
      const newQty = newItemsMap.get(productId) || 0;
      const diff = newQty - oldQty;

      if (diff !== 0) {
    this.updateProductStockOnSale(productId, diff);
      }
    });
  }

  // 🔹 دالة لإضافة حركة مخزون
  addStockMovement(movement) {
    if (!this.data.stock_movements) {
      this.data.stock_movements = [];
    }

    const newMovement = {
      id: this._getNextId("stock_movements"),
      ...movement,
      createdAt: new Date().toISOString(),
    };

    this.data.stock_movements.push(newMovement);
  }

  // 🔹 دالة لتسديد مديونية عميل
  addPayment(paymentData) {
    if (!this.data.payments_received) {
      this.data.payments_received = [];
    }

    const newPayment = {
      id: this._getNextId("payments_received"),
      ...paymentData,
      type: "sale_payment",
      createdAt: new Date().toISOString(),
    };

    this.data.payments_received.push(newPayment);

    // 🔹 تحديث رصيد العميل
    this.updateCustomerBalance(paymentData.customer_id, -paymentData.amount);

    // 🔹 تحديث المبلغ المتبقي في الفاتورة إذا كان مرتبطاً بفاتورة
    if (paymentData.sale_id) {
      const sale = this.getSaleById(paymentData.sale_id);
      if (sale) {
        sale.paid_amount = (sale.paid_amount || 0) + paymentData.amount;
        sale.remaining_amount = Math.max(
          0,
          (sale.total || 0) - (sale.paid_amount || 0)
        );
      }
    }

    this.saveData();
    return newPayment;
  }

  // 🔹 دالة للحصول على مديونيات العملاء
  getCustomerDebts() {
    if (!this.data.customers) return [];

    return this.data.customers
      .filter((customer) => (customer.balance || 0) > 0)
      .map((customer) => ({
        customer_id: customer.id,
        customer_name: customer.name,
        total_debt: customer.balance || 0,
        sales: this.getAllSales().filter(
          (sale) =>
            sale.customer_id === customer.id &&
            (sale.total || 0) - (sale.paid_amount || 0) > 0
        ),
      }));
  }

  getSalesByDateRange(startDate, endDate) {
    return this.getAllSales().filter((sale) => {
      const saleDate = new Date(sale.createdAt || sale.sale_date);
      return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
    });
  }


}

module.exports = SaleHandler;
