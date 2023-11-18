import { readFileSync, writeFile } from "node:fs";

export class Database {
  constructor(path) {
    this.path = path;

    try {
      this.json = JSON.parse(readFileSync(path));
    } catch {
      this.json = {};
    }
  }

  /**
   * Get count of a user. Returns 0 if not found.
   * @param {string} server_id
   * @param {string} user_id
   * @returns {number}
   */
  getUserCount(server_id, user_id) {
    try {
      return this.json[server_id][user_id].count;
    } catch (e) {
      return 0;
    }
  }

  /**
   * Get tag of a user. Returns undefined if not found.
   * @param {string} server_id
   * @param {string} user_id
   * @returns {string|undefined}
   */
  getUserTag(server_id, user_id) {
    try {
      return this.json[server_id][user_id].tag;
    } catch {
      return undefined;
    }
  }

  /**
   * Sets the count of a user.
   * @param {string} server_id
   * @param {string} user_id
   * @param {string} user_tag
   * @param {number} value
   */
  setUserCount(server_id, user_id, user_tag, value) {
    if (!(server_id in this.json)) this.json[server_id] = {};
    this.json[server_id][user_id] = {
      tag: user_tag,
      count: value,
    };
  }

  /**
   * Increments the count of a user.
   * @param {string} server_id
   * @param {string} user_id
   * @param {string} user_tag
   * @param {number} [n=1]
   */
  incrementUserCount(server_id, user_id, user_tag, n = 1) {
    this.setUserCount(
      server_id,
      user_id,
      user_tag,
      this.getUserCount(server_id, user_id) + n
    );
  }

  /**
   * Decrements the count of a user.
   * @param {string} server_id
   * @param {string} user_id
   * @param {string} user_tag
   * @param {number} [n=1]
   */
  decrementUserCount(server_id, user_id, user_tag, n = 1) {
    this.setUserCount(
      server_id,
      user_id,
      user_tag,
      this.getUserCount(server_id, user_id) - n
    );
  }

  /**
   * Resets the count of a user.
   * @param {string} server_id
   * @param {string} user_id
   */
  resetUserCount(server_id, user_id) {
    try {
      delete this.json[server_id][user_id];

      // also delete server object if empty
      if (Object.keys(this.json[server_id]).length == 0)
        delete this.json[server_id];
    } catch {}
  }

  /**
   * Writes to database. Runs callback when write is finished.
   * @param {CallableFunction|undefined} [callback=() => {}]
   */
  write(callback = () => {}) {
    writeFile(this.path, JSON.stringify(this.json), callback);
  }
}
