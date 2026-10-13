const fs = require("fs-extra");
const path = require("path");

class Config {
  constructor() {
    this.configPath = path.join(__dirname, "..", "..", "settings", "settings.json");
    this.linksPath = path.join(__dirname, "..", "..", "settings", "links_img.json");
    this.logosPath = path.join(__dirname, "..", "..", "settings", "logos.json");
    this.data = {};
    this.links = {};
    this.logos = {};
    this.load();
  }

  load() {
    this.data = fs.existsSync(this.configPath) ? fs.readJsonSync(this.configPath) : {};
    this.links = fs.existsSync(this.linksPath) ? fs.readJsonSync(this.linksPath) : {};
    this.logos = fs.existsSync(this.logosPath) ? fs.readJsonSync(this.logosPath) : {};
    return this;
  }

  save() {
    fs.writeJsonSync(this.configPath, this.data, { spaces: 2 });
    return this;
  }

  // --- generic dot-path access, e.g. get("bot.prefix") ---
  get(keyPath, defaultValue = null) {
    const value = keyPath
      .split(".")
      .reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined), this.data);
    return value !== undefined ? value : defaultValue;
  }

  set(keyPath, value) {
    const keys = keyPath.split(".");
    const last = keys.pop();
    const target = keys.reduce((obj, key) => {
      if (!obj[key] || typeof obj[key] !== "object") obj[key] = {};
      return obj[key];
    }, this.data);
    target[last] = value;
    return this.save();
  }

  getLinks(key, defaultValue = null) {
    return this.links[key] ?? defaultValue;
  }

  getLogos(key, defaultValue = null) {
    return this.logos[key] ?? defaultValue;
  }

  getAll() {
    return { ...this.data, ...this.links, ...this.logos };
  }

  // --- modular groups ---
  get bot() {
    return this.data.bot || {};
  }

  get owner() {
    return this.data.owner || {};
  }

  get api() {
    return this.data.api || {};
  }

  // --- convenience read getters (used across the codebase) ---
  get prefix() {
    return this.bot.prefix || "/";
  }

  get botName() {
    return this.bot.name || "Shoto-Bot";
  }

  get ownerName() {
    return this.owner.name || "Owner";
  }

  get ownerNumber() {
    return this.owner.number || "";
  }

  get apiUrl() {
    return this.api.baseUrl || "https://waguapis.online";
  }

  get apiKey() {
    return this.api.key || "keyfree";
  }

  // --- modular setters (persist immediately) ---
  setPrefix(value) {
    this.set("bot.prefix", value);
    return this.prefix;
  }

  setBotName(value) {
    this.set("bot.name", value);
    return this.botName;
  }

  setOwnerName(value) {
    this.set("owner.name", value);
    return this.ownerName;
  }

  setOwnerNumber(value) {
    this.set("owner.number", value);
    return this.ownerNumber;
  }

  setApiKey(value) {
    this.set("api.key", value);
    return this.apiKey;
  }
}

module.exports = new Config();
