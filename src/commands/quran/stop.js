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
    const { channel } = message.member.voice;
    if (!channel) return `** أنا آسف ولكن يجب أن تكون في قناة صوتية لتشغيل القران الكريم! **`;
    let ikQueue = this.client.guilds_settings.get(message.guild.id, 'quran_queue');
    const connection = this.client.quran_connections.get(message.guild.id);
    if (connection) {
      if (connection.dispatcher) {
        connection.dispatcher.end('Stop command has been used!');
      }
    }
    ikQueue.stoped = true;
    this.client.guilds_settings.set(message.guild.id, 'quran_queue', ikQueue);
    return `**تم ايقاف البوت وحذف قائمة الإنتظار**`;
  }
}