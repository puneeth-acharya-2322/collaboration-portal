const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_PATH = path.join(__dirname, '..', 'data', 'requests.json');

class Request {
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
    const reqs = this.getCollection();
    return reqs.find((r) => r.id === id);
  }

  static findByApplicant(applicantId) {
    const reqs = this.getCollection();
    return reqs.filter((r) => r.applicantId === applicantId);
  }

  static findByProject(projectId) {
    const reqs = this.getCollection();
    return reqs.filter((r) => r.projectId === projectId);
  }

  static create(requestData) {
    const reqs = this.getCollection();
    const newReq = {
      id: `req-${uuidv4().split('-')[0]}`,
      status: 'pending', // pending, accepted, rejected
      createdAt: new Date().toISOString(),
      ...requestData,
    };
    reqs.push(newReq);
    this.saveCollection(reqs);
    return newReq;
  }

  static update(id, updates) {
    const reqs = this.getCollection();
    const index = reqs.findIndex((r) => r.id === id);
    if (index === -1) return null;

    reqs[index] = { ...reqs[index], ...updates };
    this.saveCollection(reqs);
    return reqs[index];
  }

  static delete(id) {
    let reqs = this.getCollection();
    const lengthBefore = reqs.length;
    reqs = reqs.filter((r) => r.id !== id);
    
    if (reqs.length === lengthBefore) return false;
    
    this.saveCollection(reqs);
    return true;
  }
}

module.exports = Request;
