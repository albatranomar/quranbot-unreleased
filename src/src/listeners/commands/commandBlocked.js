const { Listener, Command } = require("discord-akairo");
const { Message, MessageEmbed } = require("discord.js");

module.exports = class extends Listener {
  constructor() {
    super('commandBlocked', {
      emitter: 'commandHandler',
      event: 'commandBlocked',
      category: 'commandHandler'
    });
  }
  /**
   * 
   * @param {Message} message 
   * @param {Command} command 
   * @param {String} reason 
   */
  exec(message, command, reason) {
    console.log(`commandBlocked[${command.id}]: ${reason}`);
  }
}