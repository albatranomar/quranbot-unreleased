const { Inhibitor } = require('discord-akairo');
const Discord = require("discord.js");

module.exports = class extends Inhibitor {
  constructor() {
    super('memberDontHaveQuranRole', {
      reason: 'This Command must use by someone have the Quran role. not you.'
    })
  }
  /**
   * @param {Discord.Message} message 
   */
  exec(message) {
    if (message.channel.type == 'dm') return false;
    let args = message.content.split(/ +/);
    let allaliases = [];
    this.client.commandHandler.modules.filter(c => c.category == 'quran').map(c => allaliases = allaliases.concat(c.aliases));
    let check = false;
    for (const aliase of allaliases) {
      if (args[0].toLowerCase().endsWith(aliase)) {
        check = true;
        break;
      }
    }
    if (check) {
      let quranRole = this.client.guilds_settings.get(message.guild.id, 'quran_role', 'defult');
      if (this.client.isOwner(message.author.id)) {
        return false;
      } else {
        if (quranRole == 'defult') {
          return !message.member.hasPermission('MANAGE_CHANNELS');
        } else {
          return !message.member.roles.cache.has(quranRole);
        }
      }
    }
    return false;
  }
}