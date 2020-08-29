const Discord = require("discord.js");
const { Command } = require('discord-akairo');

module.exports = class extends Command {
  constructor() {
    super('set-channel', {
      aliases: ['set-channel', 'channel', 'الشات'],
      category: 'moderation',
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
  */
  condition(message) {
    return this.client.isOwner(message.author.id);
  }
  /**
   * 
   * @param {Discord.Message} message 
   * @param {*} args 
   */
  exec(message, args) {
    this.client.guilds_settings.set(message.guild.id, 'quran_channel', args.channel.id);
    return `**تم تغير الشات المسموح فيه تشغيل القران الكريم**`;
  }
}