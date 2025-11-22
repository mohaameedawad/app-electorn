const BaseHandler = require("./base-handler");

class PurchaseHandler extends BaseHandler {
  getPurchases() {
    if (!this.data.purchases) {
      this.data.purchases = [];
    }
    return this.data.purchases;
  }

  getPurchaseById(id) {
    return this.getPurchases().find((p) => p.id === id);
  }

  getPurchaseItems(purchaseId) {
    return (this.data.purchase_items || []).filter(
      (item) => item.purchase_id === purchaseId
    );
  }

addPurchase(purchase) {
  if (!this.data.purchases) {
    this.data.purchases = [];
  }
  if (!this.data.purchase_items) {
    this.data.purchase_items = [];
  }

  const newPurchase = {
    id: this._getNextId("purchases"),
    ...purchase,
    createdAt: new Date().toISOString(),
    status: purchase.status || "completed",
    items: purchase.items || [],
  };

  this.data.purchases.push(newPurchase);

  if (purchase.items && Array.isArray(purchase.items)) {
    purchase.items.forEach((item) => {
      const newItem = {
        id: this._getNextId("purchase_items"),
        purchase_id: newPurchase.id,
        ...item,
      };
      this.data.purchase_items.push(newItem);

      this.updateProductStock(
        item.product_id,
        parseFloat(item.quantity) || 0
      );
    });
  }

  if (purchase.supplierId) {
    const net = (purchase.total || 0) - (purchase.paid_amount || 0);
    this.updateSupplierBalance(purchase.supplierId, net);
  }

  this.saveData();
  return newPurchase;
}

  updatePurchase(id, purchase) {
    const index = this.getPurchases().findIndex((p) => p.id === id);
    if (index !== -1) {
      const oldPurchase = this.data.purchases[index];

      let oldItems = [];
      try {
        oldItems =
          typeof oldPurchase.items === "string"
            ? JSON.parse(oldPurchase.items)
            : oldPurchase.items || [];
      } catch {
        oldItems = oldPurchase.items || [];
      }

      let newItems = [];
      try {
        newItems =
          typeof purchase.items === "string"
            ? JSON.parse(purchase.items)
            : purchase.items || [];
      } catch {
        newItems = purchase.items || [];
      }

      this.updateStockOnEdit(oldItems, newItems);

      if (oldPurchase.supplierId) {
        const oldNet =
          (oldPurchase.total || 0) - (oldPurchase.paid_amount || 0);
        this.updateSupplierBalance(oldPurchase.supplierId, -oldNet);
      }

      this.data.purchases[index] = {
        ...oldPurchase,
        ...purchase,
        updatedAt: new Date().toISOString(),
      };

      if (purchase.supplierId) {
        const newNet = (purchase.total || 0) - (purchase.paid_amount || 0);
        this.updateSupplierBalance(purchase.supplierId, newNet);
      }

      this.saveData();
      return this.data.purchases[index];
    }
    return null;
  }

  deletePurchase(id) {
    const purchaseToDelete = this.getPurchaseById(id);

    if (purchaseToDelete) {
      const items =
        typeof purchaseToDelete.items === "string"
          ? JSON.parse(purchaseToDelete.items)
          : purchaseToDelete.items || [];

      items.forEach((item) => {
        this.updateProductStock(
          item.product_id,
          -parseFloat(item.quantity) || 0
        );
      });

      if (purchaseToDelete.supplierId) {
        const net =
          (purchaseToDelete.total || 0) - (purchaseToDelete.paid_amount || 0);
        this.updateSupplierBalance(purchaseToDelete.supplierId, -net);
      }
    }

    this.data.purchases = this.getPurchases().filter((p) => p.id !== id);
    this.data.purchase_items = (this.data.purchase_items || []).filter(
      (item) => item.purchase_id !== id
    );
    this.saveData();
    return { success: true };
  }

  updateProductStock(productId, quantity) {
    if (!this.data.products) return;

    const index = this.data.products.findIndex((p) => p.id === productId);
    if (index === -1) return;

    const currentStock = parseFloat(this.data.products[index].stock) || 0;
    const newStock = Math.max(0, currentStock + quantity);

    this.data.products[index].stock = newStock;

    this.addStockMovement({
      product_id: productId,
      type: quantity > 0 ? "purchase" : "purchase_cancel",
      quantity,
      reference_id: productId,
      note:
        quantity > 0
          ? `إضافة مخزون (${quantity})`
          : `خصم مخزون (${Math.abs(quantity)})`,
    });

    this.saveData();
  }

  updateStockOnEdit(oldItems, newItems) {
    const oldMap = new Map();
    const newMap = new Map();

    oldItems.forEach((i) =>
      oldMap.set(
        i.product_id,
        (oldMap.get(i.product_id) || 0) + (parseFloat(i.quantity) || 0)
      )
    );

    newItems.forEach((i) =>
      newMap.set(
        i.product_id,
        (newMap.get(i.product_id) || 0) + (parseFloat(i.quantity) || 0)
      )
    );

    const all = new Set([...oldMap.keys(), ...newMap.keys()]);

    all.forEach((productId) => {
      const diff = (newMap.get(productId) || 0) - (oldMap.get(productId) || 0);
      if (diff !== 0) this.updateProductStock(productId, diff);
    });
  }

  addStockMovement(movement) {
    if (!this.data.stock_movements) this.data.stock_movements = [];

    this.data.stock_movements.push({
      id: this._getNextId("stock_movements"),
      ...movement,
      createdAt: new Date().toISOString(),
    });
  }

  updateSupplierBalance(supplierId, amount) {
    if (!this.data.suppliers) return;

    const supplier = this.data.suppliers.find((s) => s.id === supplierId);
    if (!supplier) return;

    supplier.balance = (supplier.balance || 0) + amount;

    this.saveData();
  }
}

module.exports = PurchaseHandler;
