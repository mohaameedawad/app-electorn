const BaseHandler = require('./base-handler');

class UsersHandler extends BaseHandler {
  getAllUsers() {
    if (!this.data.users) {
      this.data.users = [];
    }
    return this.data.users;
  }

  addUser(user) {
    if (!this.data.users) {
      this.data.users = [];
    }
    
    const id = this._getNextId("users");
    const newUser = {
      id,
      username: user.username,
      password: user.password,
      role: user.role || 'user',
      name: user.name || '',
      email: user.email || '',
      isActive: user.isActive !== undefined ? user.isActive : true,
      createdAt: new Date().toISOString(),
      ...user
    };
    
    this.data.users.push(newUser);
    this.saveData();
    return { lastInsertRowid: id, changes: 1, row: newUser };
  }

  updateUser(id, user) {
    if (!this.data.users) {
      this.data.users = [];
    }
    
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) return { changes: 0 };

    // If password is empty, keep the old password
    const updatedUser = { ...this.data.users[index], ...user };
    if (!user.password) {
      updatedUser.password = this.data.users[index].password;
    }

    this.data.users[index] = updatedUser;
    this.saveData();
    return { changes: 1, row: this.data.users[index] };
  }

  deleteUser(id) {
    if (!this.data.users) {
      this.data.users = [];
    }
    
    const beforeLength = this.data.users.length;
    this.data.users = this.data.users.filter(u => u.id !== id);
    this.saveData();
    
    return { changes: beforeLength - this.data.users.length };
  }

  // دوال إضافية مفيدة
  getUserById(id) {
    if (!this.data.users) return null;
    return this.data.users.find(u => u.id === id);
  }

  getUserByUsername(username) {
    if (!this.data.users) return null;
    return this.data.users.find(u => u.username === username);
  }

  authenticateUser(username, password) {
    if (!this.data.users) return null;
    
    const user = this.data.users.find(u => 
      u.username === username && 
      u.password === password && 
      u.isActive !== false
    );
    
    return user ? { 
      id: user.id, 
      username: user.username, 
      role: user.role, 
      name: user.name 
    } : null;
  }

  changePassword(id, newPassword) {
    if (!this.data.users) return { changes: 0 };
    
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) return { changes: 0 };

    this.data.users[index].password = newPassword;
    this.saveData();
    return { changes: 1 };
  }

  deactivateUser(id) {
    return this.updateUser(id, { isActive: false });
  }

  activateUser(id) {
    return this.updateUser(id, { isActive: true });
  }
}

module.exports = UsersHandler;


