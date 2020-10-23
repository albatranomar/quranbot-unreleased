const Discord = require("discord.js");
const { Command } = require('discord-akairo');

module.exports = class extends Command {
  constructor() {
    super('skip', {
      aliases: ['skip', 'تخطي', 'التالي'],
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
    const { channel } = message.member.voice;
    if (!channel) return `** أنا آسف ولكن يجب أن تكون في قناة صوتية لإستخدام أوامر القران الكريم! **`;
    if (!serverQueue) return `** لا يوجد شيء يمكنني تخطيه لك.**`;
    if (!serverQueue.playing) return `** لا يمكن تخطي حاليا, يجب ان يكون القران غير متوقف **`;
    if (connection) {
      if (connection.dispatcher) {
        connection.dispatcher.end('Skip command has been used!');
      }
    }
    return `**تم التخطي بنجاح**`;
  }
}