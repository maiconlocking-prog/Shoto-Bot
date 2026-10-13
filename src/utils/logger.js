const pino = require("pino");
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");

const logDir = path.join(__dirname, "..", "..", "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const logger = pino({
  level: "info",
  transport: {
    targets: [
      { target: "pino/file", level: "info", options: { destination: path.join(logDir, "bot.log") } },
      { target: "pino/file", level: "error", options: { destination: path.join(logDir, "error.log") } },
      { target: "pino-pretty", level: "info", options: { destination: 1, colorize: true, translateTime: "SYS:HH:MM:ss", ignore: "pid,hostname" } },
    ]
  }
});

const fileOnlyLogger = pino({
  level: "info",
  transport: {
    target: "pino/file",
    level: "info",
    options: { destination: path.join(logDir, "bot.log") }
  }
});

const shotoLogger = {
  connectionLog: (status, msg) => logger.info({ type: "connection", status, message: msg }),

  messageLog: ({ type, pushname, sender, from, command, isCmd, isGroup, groupName }) => {
    fileOnlyLogger.info({ type: "message", pushname, sender, from, command, isCmd, isGroup, groupName, msgType: type });

    const hora = chalk.gray(`[${new Date().toLocaleTimeString("pt-BR", { hour12: false })}]`);
    const origem = isGroup
      ? chalk.magenta(`GRUPO`) + chalk.gray(" · ") + chalk.white(groupName || "sem nome")
      : chalk.blue(`PV`);
    const usuario = chalk.cyan(pushname || sender || "?");
    const tipoMsg = chalk.gray(`[${type || "unknown"}]`);

    if (isCmd) {
      console.log(
        `${hora} ${chalk.bgGreen.black(" CMD ")} ${origem} ${chalk.gray("→")} ${usuario} ${chalk.gray("executou")} ${chalk.yellowBright.bold("!" + command)}`
      );
    } else {
      console.log(
        `${hora} ${chalk.bgBlue.black(" MSG ")} ${origem} ${chalk.gray("→")} ${usuario} ${tipoMsg}`
      );
    }
  },

  infoLog: (msg) => logger.info(msg),
  errorLog: (msg, err) => logger.error({ message: msg, error: err?.message || err }),
  debugLog: (msg, data) => logger.debug({ message: msg, data }),
  warnLog: (msg) => logger.warn(msg),
};

module.exports = { shotoLogger, logger };
