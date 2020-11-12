const { Listener, Command } = require("discord-akairo");
const { Message, MessageEmbed } = require("discord.js");

module.exports = class extends Listener {
  constructor() {
    super('missingPermissions', {
      emitter: 'commandHandler',
      event: 'missingPermissions',
      category: 'commandHandler'
    });
  }
  /**
   * 
   * @param {Message} message 
   * @param {Command} command 
   * @param {'client'|'user'} type,
   * @param {*} missing
   */
  exec(message, command, type, missing) {
    let simpleEmbed = new MessageEmbed()
      .setColor("RANDOM")
      .setFooter(`بواسطة: ${message.author.tag}`, message.author.displayAvatarURL());
    message.util.reply('', {
      embed: simpleEmbed.setDescription(`${(type == "client") ? 'I' : 'You'} dont have \`${missing}\` Permission/s.`)
    });
    console.log(`missingPermissions[${command.id}]-${type}: ${missing}`);
  }
}