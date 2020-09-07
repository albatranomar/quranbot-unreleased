const Discord = require("discord.js");
const { Command } = require('discord-akairo');

module.exports = class extends Command {
  constructor() {
    super('bot-info', {
      aliases: ['bot-info', 'bot.info'],
      category: 'developers',
      cooldown: 10000,
      ratelimit: 2,
      ownerOnly: true
    });
  }
  /**
   * 
   * @param {Discord.Message} message 
   * @param {*} args 
   */
  exec(message, args) {
    message.channel.send("", {
      embed: new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setColor("RANDOM")
      .setThumbnail(message.client.user.displayAvatarURL())
      .setFooter(`إذا كنت تريد قائمة بأسماء السيرفرات يمكنك كتابة الأمر التالي. [${message.client.config.prefix}servers].`, message.client.user.displayAvatarURL())
      .addField(`**Guilds:**`, `**\`${message.client.guilds.cache.size}\` Servers.**`, true)
      .addField(`**Users:**`, `**\`${message.client.users.cache.size}\` Users.**`, true)
      .addField(`**Connections:**`, `**\`${message.client.quran_connections.size}\` Quran connection.**`, true)
    });
  }
}