const Discord = require("discord.js");
const { Command, Argument } = require('discord-akairo');
const surahs = require("../../quran-data/surahs.pretty.json");

module.exports = class extends Command {
  constructor() {
    super('verse', {
      aliases: ['verse', 'اية', 'ايه'],
      category: 'public',
      cooldown: 10000,
      ratelimit: 2,
      args: [
        {
          id: 'surah',
          type: Argument.union('integer', 'string'),
          prompt: {
            start: `**يجب عليك الآن إرسال اسم السورة او رقمها**`,
            retry: `**يجب عليك الآن إرسال اسم السورة او رقمها, حاول مره اخرى**`
          }
        },
        {
          id: 'ayah',
          type: Argument.union('integer'),
          prompt: {
            start: `**يجب عليك الآن إرسال رقم السورة**`,
            retry: `**يجب عليك الآن إرسال رقم السورة, حاول مره اخرى**`
          }
        }
      ]
    });
  }

  exec(message, args) {
    let surah = this.getSurah(args.surah);
    if (`${surah}`.startsWith("**")) return surah;
    let ayah = this.getAyah(args.ayah, surah);
    if (`${ayah}`.startsWith("**")) return ayah;
    let aya = new Discord.MessageAttachment(`https://cdn.alquran.cloud/media/image/${surah.number}/${ayah}`, `AlQuranBot[${message.client.user.id}].png`)
      message.channel.send(``, {
        embed: new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setFooter(message.client.user.username, message.client.user.displayAvatarURL())
        .setColor("RANDOM")
        .setTitle(`${surah.name}.\n هي سورة ${(surah.revelation_type == "Meccan") ? 'مكية' : 'مدنية'}\n عدد اياتها ${surah.total_verses} اية `)
        .attachFiles([ aya ])
      });
  }
  /**
   * @param {String|Number} surahSelector 
   * @returns {Object|String}
   */
  getSurah(surahSelector) {
    let surah;
    if (isNaN(surahSelector)) {
      if (surahSelector.endsWith("عمران") || surahSelector.startsWith("ال ")) surahSelector = "آل عمران";
      if (surahs.some((s) => s.name == `سورة ${surahSelector}`)) {
        surah = surahs.find((s) => s.name == `سورة ${surahSelector}`);
      } else surah = `**لم يتم إيجاد اسم السورة الذي أرسلته تأكد من الاسمم مجددا**`;
    } else {
      if (parseInt(surahSelector) > 114 || parseInt(surahSelector) < 1) {
        surah = `**ان عدد السور في القران الكريم 114 سورة يرجى ان يكون رقم السورة التي تريدها محصورة بهذا الرقم**`;
      } else {
        surah = surahs.find((s) => s.number == parseInt(surahSelector));
      }
    }
    return surah;
  }
  /**
   * @param {Number} surahSelector 
   * @param {Object} thatSurah 
   * @returns {String|Object}
   */
  getAyah(ayahSelector, thatSurah) {
    let verse;
    if (parseInt(ayahSelector) > thatSurah.total_verses || parseInt(ayahSelector) < 1) {
      verse = `**إن سورة ${thatSurah.name} تحتوي فقط على ${thatSurah.total_verses} من الايات.**`;
    } else {
      verse = ayahSelector;
    }
    return verse;
  }
}