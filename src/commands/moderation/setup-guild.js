const Discord = require("discord.js");
const { Command } = require('discord-akairo');

module.exports = class extends Command {
  constructor() {
    super('setup', {
      aliases: ['setup', 'setup-guild', 'setup.guild', 'تجهيز'],
      cooldown: 10000,
      ratelimit: 2,
      channel: "guild",
      userPermissions: ["ADMINISTRATOR"]
    });
  }
  /**
   * 
   * @param {Discord.Message} message 
   * @param {*} args 
   */
  exec(message, args) {
    let guildprefix = this.client.guilds_settings.get(message.guild.id, 'prefix');
    if (!guildprefix) {
      this.client.guilds_settings.set(message.guild.id, 'prefix', this.client.config.prefix);
      this.client.guilds_settings.set(message.guild.id, 'quran_role', 'defult');
      this.client.guilds_settings.set(message.guild.id, 'quran_channel', 'defult');
      message.util.reply(`**لقد تم تجهيز سيرفر بنجاح**`);
    } else {
      message.util.reply(`**تم تجهيز السيرفر الخاص بك \`مسبقا\`**`)
    }
  }
}