const Discord = require("discord.js");
const { Command } = require('discord-akairo');
const surahs = require("../../quran-json/surahs.pretty.json");
const readers = require("../../quran-json/readers.json");

module.exports = class extends Command {
  constructor() {
    super('play', {
      aliases: ['play', 'mushaf', 'مصحف', 'قران', 'القران'],
      category: 'quran',
      cooldown: 10000,
      ratelimit: 2,
      channel: "guild",
      args: [
        {
          id: "toplay",
          type: (message, arg) => {
            if (['all', 'كامل', 'كاملا'].includes(arg.toLowerCase())) {
              return "ALL"
            } else {
              let s = this.getSurah(arg);
              if (s instanceof Object) {
                return s;
              }
            }
            return null;
          }
        },
        {
          id: 'ayah',
          type: 'integer',
          default: 1
        }
      ]
    });
  }
  /**
  * 
  * @param {Discord.Message} message 
  * @param {*} args 
  */
  exec(message, args) {
    const { channel } = message.member.voice;
    if (!channel) return `** أنا آسف ولكن يجب أن تكون في قناة صوتية لتشغيل القران الكريم! **`;
    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT')) return '**I cannot connect to your voice channel, make sure I have the proper permissions!**';
    if (!permissions.has('SPEAK')) return '**I cannot speak in this voice channel, make sure I have the proper permissions!**';
    let thisReader;
    message.channel.send("", {
      embed: new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setFooter(message.client.user.username, message.client.user.displayAvatarURL())
        .setColor("RANDOM")
        .setTitle(`يرجى الان إرسال رقم القارئ الذي تريده.`)
        .setDescription(`**${readers.map((reader, i) => `${i + 1}- ${reader.name}`).join("\n")}**`)
    }).then(async colMessage => {
      let collector = message.channel.createMessageCollector((msg) => (!isNaN(msg.content)) && ((parseInt(msg.content) >= 1) && (parseInt(msg.content) <= readers.length) && msg.author.id == message.author.id), { time: 30000 })
      collector.on("collect", (m) => {
        if (m.deletable) m.delete();
        thisReader = readers[parseInt(m.content) - 1];
        collector.stop("got reader.");
      });
      collector.on("end", async (c, reason) => {
        if (reason == "got reader.") {
          let serverQueue = this.client.guilds_settings.get(message.guild.id, 'quran_queue');
          colMessage.delete();
          if (args.toplay == "ALL") {
            const song = {
              title: `القران الكريم كاملا بصوت القارئ ${thisReader.name}.`,
              url: `http://cdn.alquran.cloud/media/audio/ayah/${thisReader.identifier}/{number}`,
              readerImage: thisReader.image,
              startVerse: 1,
              endVerse: 6236,
              nowVerse: 1
            };
            if (serverQueue) {
              if (serverQueue.size >= 10) {
                return `**${message.author}, لا يمكن إضافة اكثر من 10 مقاطع الى قائمة الانتظار**`;
              } else {
                serverQueue.songs.push(song);
                this.client.guilds_settings.set(message.guild.id, 'quran_queue', serverQueue);
                message.channel.send({
                  embed: new Discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setFooter(`بواسطة: ${message.author.tag}`, message.author.displayAvatarURL())
                    .setDescription(`**✅ تم إضافة إلى قائمة الإنتظار \n \`${song.title}\`**`)
                    .setThumbnail(song.readerImage)
                });
                return;
              }
            }

            const queueConstruct = {
              songs: [],
              volume: 20,
              playing: true,
              repeat: false,
              voiceChannelID: channel.id
            };
            queueConstruct.songs.push(song);
            this.client.guilds_settings.set(message.guild.id, 'quran_queue', queueConstruct);
            message.util.send({
              embed: new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setFooter(`بواسطة: ${message.author.tag}`, message.author.displayAvatarURL())
                .setDescription(`**🔊 تستمع الان إلى: \n \`${song.title}\`**`)
                .setThumbnail(song.readerImage)
            });

            try {
              const connection = await channel.join();
              this.client.quran_connections.set(message.guild.id, connection);
              this.play(queueConstruct.songs[0], message);
            } catch (error) {
              console.error(`I could not join the voice channel: ${error}`);
              this.client.guilds_settings.delete(message.guild.id, 'quran_queue');
              this.client.quran_connections.get(message.guild.id).disconnect();
              return `**لم أستطع الانضمام إلى القناة الصوتية \n \`${error}\`**`;
            }
          } else {
            let verseIndex = this.allVerses().find((s) => s.surahNumber == args.toplay.number && s.verseNumber == args.ayah).verseIndex;
            const song = {
              title: `${args.toplay.name} بصوت القارئ ${thisReader.name}.`,
              url: `http://cdn.alquran.cloud/media/audio/ayah/${thisReader.identifier}/{number}`,
              readerImage: thisReader.image,
              startVerse: verseIndex,
              endVerse: verseIndex + ((args.toplay.total_verses) - args.ayah),
              nowVerse: verseIndex
            };
            if (serverQueue) {
              if (serverQueue.size >= 10) {
                return `**${message.author}, لا يمكن إضافة اكثر من 10 مقاطع الى قائمة الانتظار**`;
              } else {
                serverQueue.songs.push(song);
                this.client.guilds_settings.set(message.guild.id, 'quran_queue', serverQueue);
                message.channel.send({
                  embed: new Discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setFooter(`بواسطة: ${message.author.tag}`, message.author.displayAvatarURL())
                    .setDescription(`**✅ تم إضافة إلى قائمة الإنتظار \n \`${song.title}\`**`)
                    .setThumbnail(song.readerImage)
                });
                return;
              }
            }

            const queueConstruct = {
              songs: [],
              volume: 20,
              playing: true,
              repeat: false,
              voiceChannelID: channel.id
            };
            queueConstruct.songs.push(song);
            this.client.guilds_settings.set(message.guild.id, 'quran_queue', queueConstruct);
            message.util.send({
              embed: new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setFooter(`بواسطة: ${message.author.tag}`, message.author.displayAvatarURL())
                .setDescription(`**🔊 تستمع الان إلى: \n \`${song.title}\`**`)
                .setThumbnail(song.readerImage)
            });
            try {
              const connection = await channel.join();
              this.client.quran_connections.set(message.guild.id, connection);
              this.play(queueConstruct.songs[0], message);
            } catch (error) {
              console.error(`I could not join the voice channel: ${error}`);
              this.client.guilds_settings.delete(message.guild.id, 'quran_queue');
              this.client.quran_connections.get(message.guild.id).disconnect();
              return `**لم أستطع الانضمام إلى القناة الصوتية \n \`${error}\`**`;
            }
          }
        } else {
          return `**إنتهى وقت الاختيار. سيتم ألغاء العملية.**`;
        }
      });
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
  /**
   * @returns {Object[]}
   */
  allVerses() {
    let index = 1;
    let verses = [];
    for (let i = 0; i < surahs.length; i++) {
      let surah = surahs[i];
      for (let j = 0; j < surah.total_verses; j++) {
        let verseInVerses = {
          verseIndex: index,
          surahNumber: surah.number,
          verseNumber: j + 1
        }
        verses.push(verseInVerses);
        index++;
      }
    }
    return verses;
  }

  async play(song, message) {
    const queue = this.client.guilds_settings.get(message.guild.id, 'quran_queue');
    if (!song) {
      message.util.send(`** 🚶‍♂️لم يعد هناك أي شيء في قائمة الإنتظار..**`);
      this.client.guilds_settings.delete(message.guild.id, 'quran_queue');
      this.client.quran_connections.get(message.guild.id).disconnect();
      return;
    }

    const dispatcher = this.client.quran_connections.get(message.guild.id).play(song.url.replace("{number}", song.nowVerse))
      .on('finish', () => {
        if (this.client.guilds_settings.get(message.guild.id, 'quran_queue')) {
          if (song.nowVerse == song.endVerse) {
            if (queue.repeat) {
              queue.songs[0].nowVerse = queue.songs[0].startVerse;
              this.client.guilds_settings.set(message.guild.id, 'quran_queue', queue);
              this.play(queue.songs[0], message);
            } else {
              queue.songs.shift();
              this.client.guilds_settings.set(message.guild.id, 'quran_queue', queue);
              this.play(queue.songs[0], message);
            }
          } else {
            queue.songs[0].nowVerse++;
            this.client.guilds_settings.set(message.guild.id, 'quran_queue', queue);
            this.play(queue.songs[0], message);
          }
        }
      })
      .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(queue.volume / 50);
  };

}