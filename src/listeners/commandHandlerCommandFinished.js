const { Listener } = require("discord-akairo");
const { Message } = require("discord.js");

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
    if (returnValue) {
      message.util.reply(returnValue);
    }
  }
}