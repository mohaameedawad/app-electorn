// const BaseHandler = require('./base-handler');

// class EmployeeHandler extends BaseHandler {
//   getAllEmployees() {
//     if (!this.data.employees) {
//       this.data.employees = [];
//     }
//     return this.data.employees;
//   }

//   addEmployee(employee) {
//     if (!this.data.employees) {
//       this.data.employees = [];
//     }
    
//     const id = this._getNextId("employees");
//     const newEmployee = {
//       id,
//       name: employee.name,
//       phone: employee.phone,
//       position: employee.position || "",
//     };

//     this.data.employees.push(newEmployee);
//     this.saveData();
//     return { lastInsertRowid: id, changes: 1, row: newEmployee };
//   }

//   updateEmployee(id, employee) {
//     if (!this.data.employees) {
//       this.data.employees = [];
//     }
    
//     const idx = this.data.employees.findIndex((e) => e.id === id);
//     if (idx === -1) return { changes: 0 };

//     this.data.employees[idx] = {
//       ...this.data.employees[idx],
//       name: employee.name,
//       phone: employee.phone,
//       position: employee.position || "",
//     };

//     this.saveData();
//     return { changes: 1, row: this.data.employees[idx] };
//   }

//   deleteEmployee(id) {
//     if (!this.data.employees) {
//       this.data.employees = [];
//     }
    
//     const idx = this.data.employees.findIndex((e) => e.id === id);
//     if (idx === -1) return { changes: 0 };

//     this.data.employees.splice(idx, 1);
//     this.saveData();
//     return { changes: 1 };
//   }
// }

// module.exports = EmployeeHandler;


const BaseHandler = require('./base-handler');

class EmployeeHandler extends BaseHandler {
    
    
}

module.exports = EmployeeHandler;