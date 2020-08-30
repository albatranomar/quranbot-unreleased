const Discord = require("discord.js");
const { Command } = require('discord-akairo');

module.exports = class extends Command {
  constructor() {
    super('resume', {
      aliases: ['resume', 'استئنف'],
      category: 'quran',
      cooldown: 10000,
      ratelimit: 2,
      channel: "guild"
    });
  }
  /**
  * 
  * @param {Discord.Message} message 
  * @param {*} args 
  */
  exec(message, args) {
    const serverQueue = this.client.guilds_settings.get(message.guild.id, 'quran_queue');
    const connection = this.client.quran_connections.get(message.guild.id);
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      this.client.guilds_settings.set(message.guild.id, 'quran_queue', serverQueue);
      connection.dispatcher.resume();
      return ` ▶ استأنف القران من أجلك!`;
    }
    if (serverQueue && serverQueue.playing) {
      return `** انت تستمع للبوت بالفعل لا حاجة للإستئناف**`;
    }
    return `** انت لا تستمع لشيء حاليا**`;
  }
}