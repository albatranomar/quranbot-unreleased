const { Message, MessageEmbed } = require("discord.js");
const { Command } = require('discord-akairo');
let readers = require("../../quran-data/readers.json");

module.exports = class extends Command {
  constructor() {
    super('readers', {
      aliases: ['readers', 'القراء', 'الاصوات', 'قراء'],
      category: 'public',
      cooldown: 120000,
      ratelimit: 1
    });
  }
  /**
   * 
   * @param {Message} message 
   */
  async exec(message) {
    await message.util.send(`${readers.map((reader, i) => `[${i+1}] ${reader.arabic_name}.`).join("\n")}`, {
      split: true,
      code: true
    });
    var embed = new MessageEmbed()
      .setTitle("هاذي جميع القراء الذي يمكنك تشغيلهم")
      .setThumbnail('https://cdn.discordapp.com/attachments/702827650733047828/751848553168764948/PicsArt_09-05-07.png')
      .setColor('#3374FF')
      .setFooter('طلب بواسطة' + message.author.tag, message.client.user.avatarURL)
    message.channel.send(embed);
  }
}