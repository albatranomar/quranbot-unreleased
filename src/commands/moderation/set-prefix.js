const Discord = require("discord.js");
const { Command } = require("discord-akairo");

module.exports = class extends Command {
  constructor() {
    super("set-prefix", {
      aliases: ["set-prefix", "prefix", "بريفكس"],
      category: "moderation",
      cooldown: 10000,
      ratelimit: 2,
      channel: "guild",
      userPermissions: ["ADMINISTRATOR"],
      args: [
        {
          id: "newPrefix",
          prompt: {
            start: `**يجب عليك الان إرسال البريفس الجديد**`,
          },
        },
      ],
    });
  }
  /**
   *
   * @param {Discord.Message} message
   * @param {*} args
   */
  exec(message, args) {
    let oldguildprefix = this.client.guilds_settings.get(
      message.guild.id,
      "prefix"
    );
    this.client.guilds_settings.set(message.guild.id, "prefix", args.newPrefix);
    let reply = `**تم تغير البريفكس بنجاح \n \`${
      oldguildprefix ? oldguildprefix : this.client.config.prefix
    }\` -> \`${args.newPrefix}\`**`;

    message.author.send(reply);
    message.guild.owner.send(reply);
    return reply;
  }
};
