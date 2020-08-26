const { Listener } = require("discord-akairo");
const { Message, MessageEmbed } = require("discord.js");

module.exports = class extends Listener {
  constructor() {
    super('commandFinished', {
      emitter: 'commandHandler',
      event: 'commandFinished',
      category: 'commandHandler'
    });
  }
  /**
   * 
   * @param {Message} message 
   * @param {*} command 
   * @param {*} args 
   * @param {*} returnValue 
   */
  exec(message, command, args, returnValue) {
    let simpleEmbed = new MessageEmbed()
      .setColor("RANDOM")
      .setFooter(`بواسطة: ${message.author.tag}`, message.author.displayAvatarURL());
    if (returnValue) {
      message.util.reply('',{
        embed: simpleEmbed.setDescription(returnValue)
      });
    }
  }
}