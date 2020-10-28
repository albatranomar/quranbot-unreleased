const Discord = require("discord.js");
const { Command } = require('discord-akairo');

module.exports = class extends Command {
  constructor() {
    super('stop', {
      aliases: ['stop', 'توقف'],
      category: 'quran',
      cooldown: 10000,
      ratelimit: 2,
      channel: "guild",
      description: {
        content: `Stop what is currently playing and delete the queue.`
      }
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
    const { channel } = message.member.voice;
    if (!channel) return `** أنا آسف ولكن يجب أن تكون في قناة صوتية لتشغيل القران الكريم! **`;
    if (!serverQueue) return `** لا يوجد شيء يمكنني تخطيه لك.**`;
    if (connection) {
      if (connection.dispatcher) {
        connection.dispatcher.end('Stop command has been used!');
      }
      connection.disconnect();
      this.client.quran_connections.delete(message.guild.id);
    } else this.client.quran_connections.delete(message.guild.id);
    serverQueue.songs = [];
    serverQueue.playing = false;
    this.client.guilds_settings.delete(message.guild.id, 'quran_queue');
    return `**تم ايقاف البوت وحذف قائمة الإنتظار**`;
  }
}