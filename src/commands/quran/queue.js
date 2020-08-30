const Discord = require("discord.js");
const { Command } = require('discord-akairo');

module.exports = class extends Command {
  constructor() {
    super('queue', {
      aliases: ['queue', 'الانتظار', 'الإنتظار'],
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
    if (!serverQueue) return `**لا يوجد شيء تستمع اليه حاليا. **`;
    message.channel.send(``, {
      embed: new Discord.MessageEmbed()
        .setTitle(`قائمة الإنتظار`)
        .setDescription(`${serverQueue.songs.map((song, n) => `**${n + 1}- \`${song.title}\`**`).join('\n')}`)
        .setColor("RANDOM")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setFooter(`تستمع في هذه اللحظة الى: ${serverQueue.songs[0].title}`)
    });
    return;
  }
}