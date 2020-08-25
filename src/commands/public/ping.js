const Discord = require("discord.js");
const { Command } = require('discord-akairo');

module.exports = class extends Command {
  constructor() {
    super('ping', {
      aliases: ['ping', 'pong', 'speed', 'test'],
      cooldown: 10000,
      ratelimit: 2
    });
  }

  exec(message) {
    var embed = new Discord.MessageEmbed()
      .setTitle("Quran-قرآن")
      .addField('**Ping**', [`**⦍${Date.now() - message.createdTimestamp}⦎` + 'MS⏎**'], true)
      .setThumbnail(message.client.user.displayAvatarURL())
      .setColor('RANDOM')
      .setFooter('طلب بواسطة' + message.author.tag, message.client.user.avatarURL)

    message.channel.send(embed);
  }
}