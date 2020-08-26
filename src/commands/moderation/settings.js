const Discord = require("discord.js");
const { Command } = require('discord-akairo');
const YAML = require('json2yaml');

module.exports = class extends Command {
  constructor() {
    super('settings', {
      aliases: ['show-settings', 'settings', 'settings-show', 'إعدادات', 'خصائص', 'اعدادات', 'الإعدادات', 'الاعدادات', 'الخصائص'],
      category: 'moderation',
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
    let guildData = {...this.client.guilds_settings.items.get(message.guild.id)};
    delete guildData["quran_queue"];
    let toShow = YAML.stringify(guildData);
    return (Object.keys(guildData).length == 0) ? `\`\`\`css\nNothing is here\`\`\`` : `\`\`\`css\n${toShow.replace('---', '')}\`\`\``;
  }
}