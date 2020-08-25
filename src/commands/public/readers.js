const Discord = require("discord.js");
const { Command } = require('discord-akairo');
let readers = require("../../quran-json/readers.json");

module.exports = class extends Command {
  constructor() {
    super('readers', {
      aliases: ['readers', 'القراء', 'الاصوات'],
      cooldown: 10000,
      ratelimit: 2
    });
  }

  exec(message) {
    var embed = new Discord.MessageEmbed()
      .setTitle("هاذي هي الأوامر للأستماع للقرآن")
      .setDescription(`**${readers.map((reader, i) => `[${i+1}] ${reader.name}.`).join("\n")}**`)
      .setThumbnail('https://cdn.discordapp.com/attachments/694287727444754573/697966982628245594/PicsArt_04-10-03.31.01.png')
      .setColor('#3374FF')
      .setFooter('طلب بواسطة' + message.author.tag, message.client.user.avatarURL)
    message.channel.send(embed);
  }
}