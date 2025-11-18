const fs = require("fs");
const path = require("path");
const { app } = require("electron");

class BaseHandler {
  constructor(sharedData = null) {
    const userDataPath = app.getPath("userData");
    this.dbPath = path.join(userDataPath, "app-database.json");
    
    if (sharedData) {
      this.data = sharedData;
    } else {
      this.data = this.loadData();
    }
  }

  loadData() {
    try {
      if (fs.existsSync(this.dbPath)) {
        const fileData = fs.readFileSync(this.dbPath, "utf8");
        return JSON.parse(fileData);
      }
    } catch (error) {
      console.error("Error loading database:", error);
    }

    return {
      customers: [],
      suppliers: [],
      products: [],
      categories: [],
      sales: [],
      sale_items: [],
      purchases: [],
      purchase_items: [],
      payments_received: [],
      payments_made: [],
      expenses: [],
      stock_movements: [],
      sales_returns: [],
      sales_return_items: [],
      purchase_returns: [],
      purchase_return_items: [],
      transactions: [],
      employees: [],
      users: [],
      settings: [],
      audit_log: [],
    };
  }

  saveData() {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  _getNextId(collectionName) {
    const arr = this.data[collectionName] || [];
    if (arr.length === 0) return 1;
    const maxId = Math.max(...arr.map((x) => x.id || 0));
    return maxId + 1;
  }

  _parseItems(items) {
    if (!items) return [];
    if (Array.isArray(items)) return items;
    try {
      return JSON.parse(items);
    } catch {
      return [];
    }
  }
}

module.exports = BaseHandler;