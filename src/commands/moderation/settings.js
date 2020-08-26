const Discord = require("discord.js");
const { Command } = require('discord-akairo');
const YAML = require('json2yaml');

module.exports = class extends Command {
  constructor() {
    super('settings', {
      aliases: ['show-settings', 'settings', 'settings-show', 'إعدادات', 'خصائص', 'اعدادات', 'الإعدادات', 'الاعدادات', 'الخصائص'],
      cooldown: 10000,
      ratelimit: 2,
      channel: "guild",
      userPermissions: ["ADMINISTRATOR"],
    });
  }
  /**
   * 
   * @param {Discord.Message} message 
   * @param {*} args 
   */
  exec(message, args) {
    
  }
}