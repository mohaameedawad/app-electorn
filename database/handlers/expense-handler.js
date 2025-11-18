const BaseHandler = require('./base-handler');

class ExpenseHandler extends BaseHandler {
  getExpenses() {
    if (!this.data.expenses) {
      this.data.expenses = [];
    }
    return this.data.expenses;
  }

  getExpenseById(id) {
    return this.getExpenses().find(expense => expense.id === id);
  }

  addExpense(expense) {
    if (!this.data.expenses) {
      this.data.expenses = [];
    }
    
    const newExpense = {
      id: this._getNextId('expenses'),
      ...expense,
      createdAt: new Date().toISOString(),
      status: expense.status || 'completed'
    };
    
    this.data.expenses.push(newExpense);
    this.saveData();
    return newExpense;
  }

  updateExpense(id, expense) {
    const index = this.getExpenses().findIndex(e => e.id === id);
    if (index !== -1) {
      this.data.expenses[index] = { 
        ...this.data.expenses[index], 
        ...expense,
        updatedAt: new Date().toISOString()
      };
      this.saveData();
      return this.data.expenses[index];
    }
    return null;
  }

  deleteExpense(id) {
    const initialLength = this.getExpenses().length;
    this.data.expenses = this.getExpenses().filter(e => e.id !== id);
    this.saveData();
    return { changes: initialLength - this.getExpenses().length };
  }

  getExpensesByDateRange(startDate, endDate) {
    return this.getExpenses().filter(expense => {
      const expenseDate = new Date(expense.createdAt || expense.date);
      return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
    });
  }

  getExpensesByCategory(category) {
    return this.getExpenses().filter(expense => expense.category === category);
  }

  getTotalExpensesByDateRange(startDate, endDate) {
    const expenses = this.getExpensesByDateRange(startDate, endDate);
    return expenses.reduce((total, expense) => total + (expense.amount || 0), 0);
  }

  getExpensesByPaymentMethod(paymentMethod) {
    return this.getExpenses().filter(expense => expense.paymentMethod === paymentMethod);
  }

  // دالة للحصول على المصروفات مع فلترة متعددة
  getFilteredExpenses(filters = {}) {
    let expenses = this.getExpenses();
    
    if (filters.category) {
      expenses = expenses.filter(expense => expense.category === filters.category);
    }
    
    if (filters.paymentMethod) {
      expenses = expenses.filter(expense => expense.paymentMethod === filters.paymentMethod);
    }
    
    if (filters.startDate && filters.endDate) {
      expenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.createdAt || expense.date);
        return expenseDate >= new Date(filters.startDate) && expenseDate <= new Date(filters.endDate);
      });
    }
    
    if (filters.status) {
      expenses = expenses.filter(expense => expense.status === filters.status);
    }
    
    return expenses;
  }

  // دالة لتحديث حالة المصروف
  updateExpenseStatus(id, status) {
    const expense = this.getExpenseById(id);
    if (expense) {
      expense.status = status;
      expense.updatedAt = new Date().toISOString();
      this.saveData();
      return expense;
    }
    return null;
  }

  // دالة للحصول على إحصائيات المصروفات
  getExpenseStats() {
    const expenses = this.getExpenses();
    const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
    
    const byCategory = {};
    expenses.forEach(expense => {
      const category = expense.category || 'غير مصنف';
      if (!byCategory[category]) {
        byCategory[category] = 0;
      }
      byCategory[category] += expense.amount || 0;
    });
    
    const byMonth = {};
    expenses.forEach(expense => {
      const date = new Date(expense.createdAt || expense.date);
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      if (!byMonth[monthYear]) {
        byMonth[monthYear] = 0;
      }
      byMonth[monthYear] += expense.amount || 0;
    });
    
    return {
      totalExpenses,
      totalCount: expenses.length,
      byCategory,
      byMonth
    };
  }
}

module.exports = ExpenseHandler;