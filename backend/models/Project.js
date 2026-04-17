const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_PATH = path.join(__dirname, '..', 'data', 'projects.json');

class Project {
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
    const projects = this.getCollection();
    return projects.find((p) => p.id === id);
  }

  static findByCreator(userId) {
    const projects = this.getCollection();
    return projects.filter((p) => p.createdBy === userId);
  }

  static create(projectData) {
    const projects = this.getCollection();
    const newProject = {
      id: `proj-${uuidv4().split('-')[0]}`,
      isPublic: projectData.visibility === 'public',
      approvalStatus: 'pending_approval',
      pendingDeletion: false,
      pendingUpdates: null,
      createdAt: new Date().toISOString(),
      postedAt: new Date().toISOString(),
      matchScore: null,
      ...projectData,
    };
    projects.push(newProject);
    this.saveCollection(projects);
    return newProject;
  }

  static update(id, userId, updates) {
    const projects = this.getCollection();
    const index = projects.findIndex((p) => p.id === id && p.createdBy === userId);
    if (index === -1) return null;

    // Direct update logic (used for Admin or special cases)
    // Actually, we will use this method for both direct and pending
    projects[index] = { ...projects[index], ...updates };
    if (updates.visibility) {
       projects[index].isPublic = updates.visibility === 'public';
    }
    this.saveCollection(projects);
    return projects[index];
  }

  // New helper for submitting edits for approval
  static submitEditRequest(id, userId, updates) {
    const projects = this.getCollection();
    const index = projects.findIndex((p) => p.id === id && p.createdBy === userId);
    if (index === -1) return null;

    projects[index].pendingUpdates = updates;
    this.saveCollection(projects);
    return projects[index];
  }

  static requestDeletion(id, userId) {
    const projects = this.getCollection();
    const index = projects.findIndex((p) => p.id === id && p.createdBy === userId);
    if (index === -1) return false;

    projects[index].pendingDeletion = true;
    this.saveCollection(projects);
    return true;
  }

  static delete(id) {
    let projects = this.getCollection();
    const lengthBefore = projects.length;
    projects = projects.filter((p) => p.id !== id);
    
    if (projects.length === lengthBefore) return false;
    
    this.saveCollection(projects);
    return true;
  }
}

module.exports = Project;
