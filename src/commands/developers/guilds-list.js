const Discord = require("discord.js");
const { Command } = require('discord-akairo');

module.exports = class extends Command {
  constructor() {
    super('guilds-list', {
      aliases: ['guilds-list', 'servers-list'],
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
    let txtServers = `How many servers? [${message.client.guilds.cache.size}]\n\n\n` + message.client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map((guild, i) => `${i+1}- [${guild.name}] -> members: ${guild.memberCount} -> guildID: ${guildId}`).join("\n");
    let serversAttach = new Discord.MessageAttachment(Buffer.from(txtServers, 'utf8'), "servers.txt");
    message.channel.send(`${message.author}, هذا ملف نصي يحتي على أسماء جميع سيرفرات البوت.`, {
      files: [ serversAttach ]
    });
  }
}