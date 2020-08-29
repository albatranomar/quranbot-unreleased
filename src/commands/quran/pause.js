const Discord = require("discord.js");
const { Command } = require('discord-akairo');

module.exports = class extends Command {
  constructor() {
    super('pause', {
      aliases: ['pause', 'تعليق'],
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
    const connection = this.client.quran_connections.get(message.guild.id);
    if (serverQueue && serverQueue.playing) {
      if (!connection || !connection.dispatcher) {
        if (connection) {
          connection.disconnect();
        }
        this.client.guilds_settings.delete(message.guild.id, 'quran_queue');
        return `** انت لا تستمع لشيء حاليا**`
      }
      serverQueue.playing = false;
      this.client.guilds_settings.set(message.guild.id, 'quran_queue', serverQueue);
      connection.dispatcher.pause();
      return `** ⏸ أوقف صوت القران  مؤقتًا من أجلك! **`;
    }
    if (serverQueue && !serverQueue.playing) {
      return `**ان البوت متوقف بالفعل لا حاجة لتعليقه**`;
    }
    return `** انت لا تستمع لشيء حاليا**`;
  }
}