const Discord = require("discord.js");
const { Command } = require("discord-akairo");

module.exports = class extends Command {
  constructor() {
    super("reset", {
      aliases: ["reset", "reconstruct", "ضبط", 'delete-settings', 'formate-bot', 'reset-settings', 'اعادة-الضبط', 'حذف-الإعدادات', 'تنسيق-بوت'],
      category: "moderation",
      cooldown: 10000,
      ratelimit: 2,
      channel: "guild",
      userPermissions: ["ADMINISTRATOR"],
      args: [
        {
          id: 'yesOrNo',
          type: /^(yes|no|نعم|لا)$/i,
          prompt: {
            start: `**يجب عليك الأن ارسال نعم أو لا لتأكيد العملية**`,
            retry: `**يجب عليك الأن ارسال نعم أو لا لتأكيد العملية**`
          }
        }
      ],
      description: {
        content: `Reset all server settings [prefix, quran role, quran channel]`
      }
    });
  }
  /**
   *
   * @param {Discord.Message} message
   * @param {*} args
   */
  exec(message, args) {
    if (args.yesOrNo.match[0] == 'yes' || args.yesOrNo.match[0] == 'نعم') {
      this.client.guilds_settings.delete(message.guild.id, "quran_channel");
      this.client.guilds_settings.delete(message.guild.id, "prefix");
      this.client.guilds_settings.delete(message.guild.id, "quran_role");
      this.client.guilds_settings.clear(message.guild.id);
    } else {
      return `**تم إلغاء هذه العملية**`;
    }
    return `**تم إعادة ضبط أعدادات سيرفرك**`;
  }
};
