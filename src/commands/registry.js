const path = require("path");
const fs = require("fs-extra");

class CommandRegistry {
  constructor() {
    this.commands = new Map();
    this.aliases = new Map();
    this.categories = new Map();
  }

  register(command) {
    const rawNomes = command.nome || command.name || [];
    const names = Array.isArray(rawNomes) ? rawNomes : [rawNomes];

    if (!names.length || !names[0] || typeof names[0] !== "string") {
      return false;
    }

    const primaryName = names[0].toLowerCase();

    const cmd = {
      ...command,
      name: primaryName,
      aliases: names.slice(1).map(n => n.toLowerCase()),
      category: command.category || "general",
      description: command.description || "",
      usage: command.usage || "",
      ownerOnly: !!command.ownerOnly,
      groupOnly: !!command.groupOnly,
      adminOnly: !!command.adminOnly,
      botAdminOnly: !!command.botAdminOnly,
    };

    this.commands.set(primaryName, cmd);

    for (const alias of cmd.aliases) {
      this.aliases.set(alias, primaryName);
    }

    if (!this.categories.has(cmd.category)) {
      this.categories.set(cmd.category, []);
    }
    this.categories.get(cmd.category).push(primaryName);

    return true;
  }

  get(name) {
    const key = (name || "").toLowerCase();
    if (this.commands.has(key)) return this.commands.get(key);
    if (this.aliases.has(key)) return this.commands.get(this.aliases.get(key));
    return null;
  }

  has(name) {
    return !!this.get(name);
  }

  getAll() {
    return Array.from(this.commands.values());
  }

  getByCategory(category) {
    return (this.categories.get(category) || []).map(n => this.commands.get(n));
  }

  loadFromDirectory(dir) {
    if (!fs.existsSync(dir)) return;

    const walk = (current) => {
      const entries = fs.readdirSync(current, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(current, entry.name);
        if (entry.isDirectory()) {
          walk(full);
        } else if (entry.isFile() && entry.name.endsWith(".js") && !entry.name.startsWith(".")) {
          try {
            delete require.cache[require.resolve(full)];
            const mod = require(full);
            if (mod && (mod.nome || mod.name || mod.run || mod.execute)) {
              this.register(mod);
            }
          } catch (e) {
            console.error("[Registry] Erro ao carregar", full, e.message);
          }
        }
      }
    };

    walk(dir);
    console.log(`[Registry] ${this.commands.size} comandos carregados`);
  }
}

const registry = new CommandRegistry();
module.exports = registry;
