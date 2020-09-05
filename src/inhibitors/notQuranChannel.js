const { Inhibitor } = require('discord-akairo');
const Discord = require("discord.js");

module.exports = class extends Inhibitor {
  constructor() {
    super('notQuranChannel', {
      reason: 'This Command must use in Quran channel. not here.'
    })
  }
  /**
   * @param {Discord.Message} message 
   */
  exec(message) {
    if (message.channel.type == 'dm') return false;
    let args = message.content.split(/ +/);
    let allaliases = [];
    this.client.commandHandler.modules.filter(c => c.category != 'moderation').map(c => allaliases = allaliases.concat(c.aliases));
    let check = false;
    for (const aliase of allaliases) {
      if (args[0].toLowerCase().endsWith(aliase)) {
        check = true;
        break;
      }
    }
    if (check) {
      let quranChannel = this.client.guilds_settings.get(message.guild.id, 'quran_channel', 'defult');
      if (this.client.isOwner(message.author.id)) {
        return false;
      } else {
        if (quranChannel != 'defult') {
          return message.channel.id != quranChannel;
        }
      }
    }
    return false;
  }
}