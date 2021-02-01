import * as fs from 'fs';
import os from 'os';
import path from 'path';

class SimpleStorage {
  constructor(filePath) {
    this.filePath = filePath;
    if (!fs.existsSync(filePath)) {
      SimpleStorage.writeToFile(filePath, {});
    }
  }

  get(key) {
    const options = SimpleStorage.readFile(this.filePath);
    return options[key];
  }

  set(key, data) {
    const options = SimpleStorage.readFile(this.filePath);
    options[key] = data;
    SimpleStorage.writeToFile(this.filePath, options);
  }

  static readFile(filepath) {
    return JSON.parse(fs.readFileSync(filepath));
  }

  static writeToFile(filepath, data) {
    fs.writeFileSync(filepath, JSON.stringify(data));
  }
}

class ProfileManager {
  constructor() {
    this.store = new SimpleStorage(path.join(os.homedir(), 'rmm.json'));
    this.profiles = this.store.get('profiles') || {};
  }

  saveProfile(name, folder, modpackfile) {
    const profile = {
      folder,
      modpackfile,
    };
    console.log(name, profile);
    this.profiles[name] = profile;
    this.store.set('profiles', this.profiles);
  }

  getProfile(key) {
    return this.profiles[key];
  }
  deleteProfile(key) {
    delete this.profiles[key];
    this.store.set('profiles', this.profiles);
  }
}

export default ProfileManager;
