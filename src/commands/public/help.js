const { Message, MessageEmbed } = require("discord.js");
const { Command } = require("discord-akairo");
const { Menu } = require('discord.js-menu');
const { async } = require("rxjs");

module.exports = class extends Command {
  constructor() {
    super("help", {
      aliases: ["help", "hlp", "h", "commands", "cmds", "مساعدة", "المساعدة"],
      category: "public",
      cooldown: 10000,
      ratelimit: 2,
    });
  }
  /**
   *
   * @param {Message} message
   */
  exec(message) {
    let prefix = this.client.config.prefix;
    let reactions = {
      '⏪': "first",
      '◀': "previous",
      '⏹': "stop",
      '▶': "next",
      '⏩': "last"
    }
    let HelpEmbedDefult = new MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setFooter(this.client.user.tag, this.client.user.displayAvatarURL())
      .setTimestamp()
      .setColor("RANDOM").toJSON();

    let helpPages = [{
      name: "quran",
      content: new MessageEmbed(HelpEmbedDefult)
        .setTitle(`الأوامر القران الكريم`)
        .setThumbnail(`https://media.discordapp.net/attachments/690314090500981189/748519538924191784/d0fe42613a173ec1.png?width=425&height=425`)
        .addFields(this.client.commandHandler.modules.filter(c => c.category == "quran").sort((c, i) => (i == "play") ? 1 : -1).map((c, id) => { return { name: `${prefix}${id}`, value: c.aliases.join('|') } })),
      reactions
    },
    {
      name: "moderation",
      content: new MessageEmbed(HelpEmbedDefult)
        .setTitle(`الأوامر الإدارية`)
        .setThumbnail(`https://media.discordapp.net/attachments/690314090500981189/748519556523229266/1292c1d55de9c96a.png?width=430&height=430`)
        .addFields(this.client.commandHandler.modules.filter(c => c.category == "moderation").map((c, id) => { return { name: `${prefix}${id}`, value: c.aliases.join('|') } })),
      reactions
    },
    {
      name: "public",
      content: new MessageEmbed(HelpEmbedDefult)
        .setTitle(`الأوامر العامة`)
        .setThumbnail(`https://media.discordapp.net/attachments/690314090500981189/748519579680112699/ce9869247e96061e.png?width=430&height=430`)
        .setDescription(`**Website [View](http://quranbot.ml/)|Link Bot [Add](https://discordapp.com/api/oauth2/authorize?client_id=692060368780001300&permissions=8&scope=bot)|Support [join](https://discord.gg/3rZjSyS)**`).addFields(this.client.commandHandler.modules.filter(c => c.category == "public").map((c, id) => { return { name: `${prefix}${id}`, value: c.aliases.join('|') } })),
      reactions
    }
    ]

    if (this.client.isOwner(message.author.id)) {
      helpPages.push({
        name: "developers",
        content: new MessageEmbed(HelpEmbedDefult).setTitle(`الأوامر المطورين`).addFields(this.client.commandHandler.modules.filter(c => c.category == "developers").map((c, id) => { return { name: id, value: c.aliases.join('|') } })),
        reactions
      });
    }

    message.author.send(`${message.author}`).then(async (dmMessage) => {
      await message.react("✅");
      await (new Menu(dmMessage.channel, message.author.id, helpPages));
    })
      .catch(async (e) => {
        console.log(`${e}`);
        await message.react("❌");
      });
  }
};