const config = require("./config");
const _QuranBot = require("./src/QuranClient");

const QuranBot = new _QuranBot(config);

QuranBot.start(config.token);

process.on("unhandledRejection", (r, p) => {
    if (`${r}` == "DiscordAPIError: Cannot execute action on a DM channel") return console.warn(`unhandledRejection: ${r} [HELP EMBED CANOT CLEAR REACION IN DM]`);
    console.warn(r);
})