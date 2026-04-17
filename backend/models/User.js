const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_PATH = path.join(__dirname, '..', 'data', 'users.json');

class User {
  static getCollection() {
    try {
      const data = fs.readFileSync(DATA_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      if (err.code === 'ENOENT') {
        fs.writeFileSync(DATA_PATH, '[]');
        return [];
      }
      throw err;
    }
  }

  static saveCollection(data) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  }

  static find() {
    return this.getCollection();
  }

  static findById(id) {
    const users = this.getCollection();
    return users.find((u) => u.id === id);
  }

  static findByEmail(email) {
    const users = this.getCollection();
    return users.find((u) => u.email === email);
  }

  static create(userData) {
    const users = this.getCollection();
    const newUser = {
      id: uuidv4(),
      role: 'user',
      status: 'pending', // all new users are pending
      title: '',
      phone: '',
      experience: '',
      scopusId: '',
      orcid: '',
      hIndex: 0,
      publications: 0,
      collabMode: 'Hybrid',
      expertise: [], // bullets for FYRC card
      skills: [],
      domain: [],
      availability: '',
      bio: '',
      department: '',
      designation: '',
      institution: '',
      settings: {
        profileVisibility: 'All FYRC researchers',
        newCollabAlerts: true,
        newMatchNotifications: true,
        weeklyDigest: false
      },
      preferences: {
        domains: [],
        projectTypes: [],
        collaboratorRoles: []
      },
      createdAt: new Date().toISOString(),
      ...userData,
    };
    users.push(newUser);
    this.saveCollection(users);
    return newUser;
  }

  static update(id, updates) {
    const users = this.getCollection();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    users[index] = { ...users[index], ...updates };
    this.saveCollection(users);
    return users[index];
  }
}

module.exports = User;
