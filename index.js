const config = require("./config");
const _QuranBot = require("./src/QuranClient");

const QuranBot = new _QuranBot(config);

QuranBot.start(config.token);


