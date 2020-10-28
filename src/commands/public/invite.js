const Discord = require("discord.js");
const { Command } = require('discord-akairo');

module.exports = class extends Command {
  constructor() {
    super('invite', {
      aliases: ['invite', 'inv', 'addme', 'دعوة', 'يدعو'],
      category: 'public',
      cooldown: 10000,
      ratelimit: 2,
      description: {
        content: `Adding the bot to your server`,
        examples: [
          `inv`
        ]
      }
    });
  }
  exec(message) {
    const embed = new Discord.MessageEmbed()
      .setTitle(`Click Me To Add [Quran Bot]`)
      .setURL(`https://discordapp.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=104132416&scope=bot`)
      .setDescription("**Hi, I am the generous Quran bot. If you want me, please click add bot. If there is a problem with the bot, go to tech support**" + `\n` + `**Support [Enter](https://discord.gg/3rZjSyS)**`)
      .setThumbnail(message.client.user.displayAvatarURL())
      .setColor('#3374FF')
    message.channel.send(embed);/**.then(() => {
      message.react("✅");
    }).catch(() => {
      message.react("❌");
    }); */
  }
}