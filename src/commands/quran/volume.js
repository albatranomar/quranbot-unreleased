const Discord = require("discord.js");
const { Command, Argument } = require('discord-akairo');

module.exports = class extends Command {
  constructor() {
    super('volume', {
      aliases: ['volume', 'vol', 'صوت'],
      category: 'quran',
      cooldown: 10000,
      ratelimit: 2,
      channel: "guild",
      args: [
        {
          id: "volume",
          type: Argument.range('numner', 1, 100),
          default: 'current'
        }
      ]
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
    if (args.volume == 'current') return `مستوى الصوت الحالية: **${serverQueue.volume}**`;
    serverQueue.volume = args.volume;
    this.client.guilds_settings.set(message.guild.id, 'quran_queue', serverQueue);
    connection.dispatcher.setVolumeLogarithmic(args.volume / 50);
    return `** قمت بضبط مستوى الصوت على: ${args.volume}**`;
  }
}