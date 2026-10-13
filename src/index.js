const path = require("path");
const fs = require("fs-extra");
const moment = require("moment-timezone");
const axios = require("axios");

const config = require("./config");
const { Grupo, Nescessario, Muted, Banned, Take } = require("./database");
const { loadGroupData, loadGlobalData, loadMuted } = require("./handlers/dataLoader");
const { startConnection } = require("./core/connection");
const { iniciarAgendadorGrupos } = require("./core/agendaGrupos");
const { handleCommand, suggestCommand } = require("./commands/dispatcher");
const { handleAntiStatus, handleAntiPayment, handleAntiNotas, handleAntiPrivate, handleMute, handleAntiSpam, handleAntiPalavrao } = require("./handlers/antiSpam");
const { handleAntiFlood } = require("./handlers/antiFlood");
const { handleAntiGroupEdit } = require("./handlers/antiGroupEdit");
const {
httpAgent,
httpsAgent,
apiCache,
CACHE_TTL,
cacheGet,
cacheSet,
cacheKey,
cacheStats,
cacheFlush,
cachedFetchJson,
cachedFetchText,
cachedGetBuffer,
} = require("../arquivos/funcoes/httpAgent.js");
const { lidParaJid, sincronizarGrupo } = require("../arquivos/funcoes/mapeamento.js");
const { chyt, nit, supre } = require("../arquivos/funcoes/functions.js");
const { handleAntiLinkHard, handleAntiLinkEasy } = require("./handlers/antiLink");
const { handleAntiMedia } = require("./handlers/antiMedia");
const { handleAutoDown } = require("./handlers/autoDown");
const { handleAutoSticker, handleAutoStickerFfmpeg } = require("./handlers/autoSticker");
const { handleWelcome } = require("./handlers/welcome");
const { extractBody, extractQuotedBody, buildMediaFlags, buildQuotedFlags, getContentType } = require("./handlers/messageUtils");
const {
isUrl,
similarityCmd,
mess,
getGroupAdmins,
extractDDD,
extractStateFromDDD,
extractStateFromNumber,
getName,
sleep,
readJSON,
extractDomain,
registrarNumeroSuspeito,
jaProcessou,
marcarComoProcessado,
DLT_FL,
} = require("./utils/helpers");
const {
saveJSON,
getFecharAbrir,
saveFecharAbrir,
timeDate,
countDays,
getInfo,
pathAntiLink,
renameContextSticker,
gerarlinkUploadMedia,
pinterestSearch,
pinterestVideoV2,
obeso,
gerarCommandsJSON,
} = require("./utils/ctxExtras");
const { fundolevel, fundo2, fundo1, linklogos, imgnazista, imggay, imgcorno, imggostosa, imggostoso, imgfeio, imggado, imgvesgo, imgbebado, tapacmd, matarcmd, beijocmd, chutecmd, deathcmd, rnkgay, rnkgado, rnkcorno, rnkgostoso, rnkgostosa,
rnknazista, rnkotaku, rnkpau, suruba, minado_bomb, thumbnail, imgsigma, imgbeta, imgbaiano, imgbaiana, imgcarioca, imglouco, imglouca, imgsafada, imgsafado, imgmacaco, imgmacaca, imgputa, rnksigma, rnkbeta, rnkbaiano, rnkbaiana,
rnkcarioca, rnklouco, rnklouca, rnksafada, rnksafado, rnkmacaco, rnkmacaca, rnkputa, rnkfiel, rnkinfiel } = require("../settings/links_img.json");
const { handleEval, handleSimi, handlePrefixoEcho } = require("./handlers/specials");
const { shotoLogger } = require("./utils/logger");
const linguagem = require("../settings/imports/menus");

const { prefix, botName, ownerName, ownerNumber, apiUrl, apiKey } = config;

const commandsDir = path.join(__dirname, "commands");
require("./commands/registry").loadFromDirectory(commandsDir);

const arrayDDDs = [11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33,
34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55,
61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82,
83, 84, 85, 86, 87, 88, 89, 91, 93, 94, 95, 96, 97, 98, 99];

function normalizeJid(groupId, jid) {
if (!jid) return "";
if (jid.includes("@lid")) return lidParaJid(groupId, jid);
if (jid.includes("@s.whatsapp.net")) return jid;
if (jid.includes("@g.us")) return jid;
if (jid.includes("@broadcast")) return jid;
return `${jid}@s.whatsapp.net`;
}

async function processMessages(upsert, shoto) {
for (const info of upsert?.messages || []) {
if (!info.message) continue;

try {
const from = info.key.remoteJid || info.key.remoteJidAlt;
// NOTE: This is a placeholder. The full 18k file is available in the ZIP. To complete, download the fixed ZIP and extract over the repo.
console.log("Shoto-Bot core loaded. Full source pending complete upload.");
} catch (e) {
console.error(e);
}
}
}

// Minimal start to avoid MODULE_NOT_FOUND
console.log("Shoto-Bot starting...");
startConnection().catch(console.error);
