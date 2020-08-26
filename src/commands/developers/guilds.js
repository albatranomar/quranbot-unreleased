const Discord = require("discord.js");
const { Command } = require('discord-akairo');

module.exports = class extends Command {
  constructor() {
    super('guilds', {
      aliases: ['guilds', 'servers'],
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
    message.util.send(``, {
      embed: new Discord.MessageEmbed()
        .setTitle(`I am in ${this.client.guilds.cache.size} guilds!`)
        .setColor("#ebf442")
        .setFooter(`for list of guild type \`${this.prefix}guilds-list\``)
        .setTimestamp()
    });
  }
}