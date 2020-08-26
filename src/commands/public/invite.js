const Discord = require("discord.js");
const { Command } = require('discord-akairo');

module.exports = class extends Command {
  constructor() {
    super('invite', {
      aliases: ['invite', 'inv', 'addme'],
      category: 'public',
      cooldown: 10000,
      ratelimit: 2
    });
  }

  exec(message) {
    const embed = new Discord.MessageEmbed()
      .setTitle(`Click Me To Add [Quran Bot]`)
      .setURL(`https://discordapp.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=104132416&scope=bot`)
      .setDescription("**مرحباً انا بوت القرآن الكريم ان كنت تريديني ارجو منك الضغط على اضافة البوت في حالة لديك مشكلة في البوت توجه لدعم الفني **" + `\n` + `**Support [دعم الفني](https://discord.gg/wxhbgn)**`)
      .setThumbnail(message.client.user.displayAvatarURL())
      .setColor('#3374FF')
    message.author.send(embed).then(() => {
      message.react("✅");
    }).catch(() => {
      message.react("❌");
    });
  }
}