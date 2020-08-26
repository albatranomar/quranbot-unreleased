const Discord = require("discord.js");
const { Command } = require('discord-akairo');

module.exports = class extends Command {
  constructor() {
    super('set-channel', {
      aliases: ['set-channel', 'channel', 'الشات'],
      cooldown: 10000,
      ratelimit: 2,
      channel: "guild",
      userPermissions: ["ADMINISTRATOR"],
      args: [
        {
          id: "channel",
          type: "textChannel",
          prompt: {
            start: `**يجب عليك الان إرسال id الشات او منشن الشات الان**`,
            retry: `**حاول مره أخرى. أرسل الشات بطريقة صحيحة**`
          }
        }
      ]
    });
  }
  /**
   * 
   * @param {Discord.Message} message 
   * @param {*} args 
   */
  exec(message, args) {
    let oldguildchannel = this.client.guilds_settings.get(message.guild.id, 'quran_channel');
    if (!oldguildchannel) {
      return `**يجب عليك تجهيز سيرفرك فالبداية \`${this.client.config.prefix}تجهيز\`**`;
    } else {
      this.client.guilds_settings.set(message.guild.id, 'quran_channel', args.channel.id);
      return `**تم تغير الشات المسموح فيه تشغيل القران الكريم**`;
    }
  }
}