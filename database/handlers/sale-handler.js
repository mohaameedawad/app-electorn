const BaseHandler = require('./base-handler');

class SaleHandler extends BaseHandler {
  getAllSales() {
    return this.data.sales || [];
  }

  getSaleById(id) {
    return this.getAllSales().find(s => s.id === id);
  }

  getSaleItems(saleId) {
    return (this.data.sale_items || []).filter(item => item.sale_id === saleId);
  }

  addSale(sale) {
    if (!this.data.sales) this.data.sales = [];
    if (!this.data.sale_items) this.data.sale_items = [];
    
    const newSale = {
      id: this._getNextId('sales'),
      ...sale,
      createdAt: new Date().toISOString(),
      status: sale.status || 'completed'
    };
    
    this.data.sales.push(newSale);
    
    // Add sale items
    if (sale.items && Array.isArray(sale.items)) {
      sale.items.forEach(item => {
        const newItem = {
          id: this._getNextId('sale_items'),
          sale_id: newSale.id,
          ...item
        };
        this.data.sale_items.push(newItem);
      });
    }
    
    this.saveData();
    return { lastInsertRowid: newSale.id, changes: 1 };
  }

  updateSale(id, sale) {
    const index = this.getAllSales().findIndex(s => s.id === id);
    if (index !== -1) {
      this.data.sales[index] = { 
        ...this.data.sales[index], 
        ...sale,
        updatedAt: new Date().toISOString()
      };
      this.saveData();
      return { changes: 1 };
    }
    return { changes: 0 };
  }

  deleteSale(id) {
    const initialLength = this.getAllSales().length;
    this.data.sales = this.getAllSales().filter(s => s.id !== id);
    // Also delete related sale items
    this.data.sale_items = (this.data.sale_items || []).filter(item => item.sale_id !== id);
    this.saveData();
    return { changes: initialLength - this.getAllSales().length };
  }

  getSalesByDateRange(startDate, endDate) {
    return this.getAllSales().filter(sale => {
      const saleDate = new Date(sale.createdAt);
      return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
    });
  }
}

module.exports = SaleHandler;