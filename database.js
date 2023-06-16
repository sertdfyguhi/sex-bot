import { readFileSync, writeFileSync } from 'node:fs';

export class Database {
  constructor(path) {
    this.path = path;

    try {
      this.json = JSON.parse(readFileSync(path));
    } catch {
      this.json = {};
    }
  }

  get(key) {
    return this.json[key];
  }

  set(key, value) {
    this.json[key] = value;
  }

  delete(key) {
    delete this.json[key];
  }

  write() {
    writeFileSync(this.path, JSON.stringify(this.json));
  }
}
