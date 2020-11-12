const Discord = require("discord.js");
const { Command } = require('discord-akairo');

module.exports = class extends Command {
  constructor() {
    super('bot-info', {
      aliases: ['bot-info', 'bot.info', 'bi'],
      category: 'developers',
      cooldown: 10000,
      ratelimit: 2,
      ownerOnly: true,
      description: {
        content: `👀`,
      }
    });
  }
  /**
   * 
   * @param {Discord.Message} message 
   * @param {*} args 
   */
  exec(message, args) {
    let info = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setColor("RANDOM")
      .setThumbnail(message.client.user.displayAvatarURL())
      .setFooter(`إذا كنت تريد قائمة بأسماء السيرفرات يمكنك كتابة الأمر التالي. [${message.client.config.prefix}servers].`, message.client.user.displayAvatarURL());
    this.client.shard.fetchClientValues('guilds.cache.size')
      .then(results => {
        info.addField(`**Guilds:**`, `${results.reduce((acc, guildCount) => acc + guildCount, 0)}`, true);
        this.client.shard.fetchClientValues('users.cache.size')
          .then(results1 => {
            info.addField(`**Users:**`, `${results1.reduce((acc, guildCount) => acc + guildCount, 0)}`, true);
            this.client.shard.fetchClientValues('quran_connections.size')
              .then(results2 => {
                info.addField(`**Connections:**`, `**\`${results2.reduce((acc, guildCount) => acc + guildCount, 0)}\` Quran connection.**`, true)
                message.channel.send("", {
                  embed: info
                });
              })
              .catch(console.error);
          })
          .catch(console.error);
      })
      .catch(console.error);
  }
}