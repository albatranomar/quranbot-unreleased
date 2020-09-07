const { Listener } = require("discord-akairo");
const DBL = require("dblapi.js");

class MessageListener extends Listener {
  constructor() {
    super("guildCreate", {
      emitter: "client",
      event: "guildCreate",
      category: "client",
    });
  }

  async exec(guild) {
    const dbl = new DBL(this.client.config.topggToken);
    console.log(`bot added to new Server [${guild.name}].`);
    dbl.postStats(this.client.guilds.cache.size);
  }
}

module.exports = MessageListener;
