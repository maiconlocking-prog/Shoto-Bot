const registry = require("./registry");
const config = require("../config");

async function handleCommand(ctx) {
  const { command, info, from, isGroup, isOwner, isAdmin, isBotAdmin, shoto, body, args, prefix } = ctx;

  const cmd = registry.get(command);
  if (!cmd) return false;

  if (cmd.ownerOnly && !isOwner) {
    return true; // silently ignore or reply
  }
  if (cmd.groupOnly && !isGroup) {
    await shoto.sendMessage(from, { text: "Este comando só funciona em grupos." }, { quoted: info });
    return true;
  }
  if (cmd.adminOnly && !isAdmin && !isOwner) {
    await shoto.sendMessage(from, { text: "Apenas administradores podem usar este comando." }, { quoted: info });
    return true;
  }
  if (cmd.botAdminOnly && isGroup && !isBotAdmin) {
    await shoto.sendMessage(from, { text: "Preciso ser administrador do grupo para executar este comando." }, { quoted: info });
    return true;
  }

  try {
    if (typeof cmd.run === "function") {
      await cmd.run(ctx);
    } else if (typeof cmd.execute === "function") {
      await cmd.execute(ctx);
    } else if (typeof cmd.handler === "function") {
      await cmd.handler(ctx);
    }
  } catch (err) {
    console.error(`[Dispatcher] Erro no comando ${command}:`, err);
    try {
      await shoto.sendMessage(from, { text: `Erro ao executar o comando: ${err.message}` }, { quoted: info });
    } catch {}
  }

  return true;
}

function suggestCommand(input) {
  const all = registry.getAll().map(c => c.name);
  // simple suggestion
  return all.find(n => n.startsWith(input)) || null;
}

module.exports = { handleCommand, suggestCommand };
