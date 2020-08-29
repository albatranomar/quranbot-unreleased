const Discord = require("discord.js");
const { Command } = require('discord-akairo');
const surahs = require("../../quran-json/surahs.pretty.json");
const readers = require("../../quran-json/readers.json");

module.exports = class extends Command {
  constructor() {
    super('nowplaying', {
      aliases: ['now-playing', 'الان', 'حالي', 'np'],
      category: 'quran',
      cooldown: 10000,
      ratelimit: 2,
      channel: "guild"
    });
  }
  /**
  * 
  * @param {Discord.Message} message 
  */
  condition(message) {
    return this.client.isOwner(message.author.id);
  }
  /**
  * 
  * @param {Discord.Message} message 
  * @param {*} args 
  */
  exec(message, args) {
    const serverQueue = this.client.guilds_settings.get(message.guild.id, 'quran_queue');
		if (!serverQueue) return `**لا يوجد شيء تستمع اليه حاليا. **`;
		return `** انت تستمع حاليا الى : \n \`${serverQueue.songs[0].title}\`**`;
  }
}