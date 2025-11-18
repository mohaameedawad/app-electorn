const BaseHandler = require('./base-handler');

class UsersHandler extends BaseHandler {
  getUsers() {
    if (!this.data.users) {
      this.data.users = [];
    }
    return this.data.users;
  }

  getUserById(id) {
    return this.getUsers().find(user => user.id === id);
  }

  getUserByUsername(username) {
    return this.getUsers().find(user => user.username === username);
  }

  addUser(user) {
    if (!this.data.users) {
      this.data.users = [];
    }
    
    const newUser = {
      id: this._getNextId('users'),
      ...user,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    this.data.users.push(newUser);
    this.saveData();
    return newUser;
  }

  updateUser(id, user) {
    const index = this.getUsers().findIndex(u => u.id === id);
    if (index !== -1) {
      // If password is empty, keep the old password
      if (!user.password) {
        delete user.password;
      }
      this.data.users[index] = { 
        ...this.data.users[index], 
        ...user,
        updatedAt: new Date().toISOString()
      };
      this.saveData();
      return this.data.users[index];
    }
    return null;
  }

  deleteUser(id) {
    const initialLength = this.getUsers().length;
    this.data.users = this.getUsers().filter(u => u.id !== id);
    this.saveData();
    return { changes: initialLength - this.getUsers().length };
  }

  authenticateUser(username, password) {
    const user = this.getUserByUsername(username);
    if (user && user.password === password && user.isActive !== false) {
      return user;
    }
    return null;
  }
}

module.exports = UsersHandler;