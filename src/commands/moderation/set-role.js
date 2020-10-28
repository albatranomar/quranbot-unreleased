const Discord = require("discord.js");
const { Command } = require("discord-akairo");

module.exports = class extends Command {
  constructor() {
    super("set-role", {
      aliases: ["set-role", "role", "رتبة"],
      category: "moderation",
      cooldown: 10000,
      ratelimit: 2,
      channel: "guild",
      userPermissions: ["ADMINISTRATOR"],
      args: [
        {
          id: "role",
          type: "role",
          prompt: {
            start: `**يجب عليك الان إرسال id الرتبة او منشن الرتبة الان**`,
            retry: `**حاول مره أخرى. أرسل الرتبة بطريقة صحيحة**`,
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
    this.client.guilds_settings.set(
      message.guild.id,
      "quran_role",
      args.role.id
    );
    let reply = `**تم تغير الرتبة المسؤولة عن تشغيل القران الكريم**`;
    message.author.send(reply);
    message.guild.owner.send(reply);
    return reply;
  }
};
