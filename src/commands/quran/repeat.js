const Discord = require("discord.js");
const { Command } = require('discord-akairo');
const surahs = require("../../quran-json/surahs.pretty.json");
const readers = require("../../quran-json/readers.json");

module.exports = class extends Command {
  constructor() {
    super('repeat', {
      aliases: ['repeat', 'تكرار', 'التكرار'],
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
    if (serverQueue) {
      serverQueue.repeat = !serverQueue.repeat;
      this.client.guilds_settings.set(message.guild.id, 'quran_queue', serverQueue);
      let onoff = (serverQueue.repeat) ? "تفعيل" : "إلغاء تفعيل";
      return `**${message.author}, 🔁 تم [${onoff}] وضع التكرار في القران الكريم **`;
    } else return `**${message.author}, انت لا تستمع لشيء حاليا**`;
  }
}