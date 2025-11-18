const BaseHandler = require('./base-handler');

class EmployeeHandler extends BaseHandler {
  getEmployees() {
    if (!this.data.employees) {
      this.data.employees = [];
    }
    return this.data.employees;
  }

  getEmployeeById(id) {
    return this.getEmployees().find(e => e.id === id);
  }

  addEmployee(employee) {
    if (!this.data.employees) {
      this.data.employees = [];
    }
    
    const newEmployee = {
      id: this._getNextId('employees'),
      ...employee,
      createdAt: new Date().toISOString(),
      isActive: employee.isActive !== undefined ? employee.isActive : true
    };
    
    this.data.employees.push(newEmployee);
    this.saveData();
    return newEmployee;
  }

  updateEmployee(id, employee) {
    const index = this.getEmployees().findIndex(e => e.id === id);
    if (index !== -1) {
      this.data.employees[index] = { 
        ...this.data.employees[index], 
        ...employee,
        updatedAt: new Date().toISOString()
      };
      this.saveData();
      return this.data.employees[index];
    }
    return null;
  }

  deleteEmployee(id) {
    const initialLength = this.getEmployees().length;
    this.data.employees = this.getEmployees().filter(e => e.id !== id);
    this.saveData();
    return { changes: initialLength - this.getEmployees().length };
  }
}

module.exports = EmployeeHandler;