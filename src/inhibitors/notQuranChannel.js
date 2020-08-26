const { Inhibitor } = require('discord-akairo');
const Discord = require("discord.js");

module.exports = class extends Inhibitor {
  constructor() {
    super('notQuranChannel', {
      reason: 'This Command must use in Quran channel. not here.'
    })
  }
  /**
   * 
   * @param {Discord.Message} message 
   */
  exec(message) {
    let args = message.content.split(/ +/);
    if (args[0].endsWith()) {

    }
  }
}